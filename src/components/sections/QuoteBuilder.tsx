"use client";

import { useEffect, useId, useRef, useState } from "react";
import { siteConfig, whatsappUrl } from "@/config/site";
import { SERVICES, LIMITS, check, formatShootDate, type ContactInput } from "@/lib/contact";
import { BUDGETS, CITY_SUGGESTIONS, SERVICE_HINTS, MAX_REFERENCE_LINKS } from "@/content/quote";
import { trackEvent } from "@/lib/analytics";

// "Get a quote" brief builder: five short steps instead of one big form.
// Answers are checked step by step with the same rules the server uses.

type Form = Omit<ContactInput, "referenceLinks"> & { links: string[] };
type Field = keyof Form | `link${number}`;
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: Form = {
  service: "",
  shootDate: "",
  dateFlexible: false,
  city: "",
  budget: "",
  message: "",
  links: [""],
  name: "",
  email: "",
  phone: "",
  company: "",
};

const STEPS = [
  { key: "service", label: "Service", title: "What do you need?", hint: "Pick the one that fits best — you can mention the rest in your brief." },
  { key: "when", label: "Date & city", title: "When and where?", hint: "A rough date is fine. Tick “flexible” if it isn't decided yet." },
  { key: "budget", label: "Budget", title: "What's your budget?", hint: "This helps us suggest the right crew and scope. No commitment." },
  { key: "brief", label: "Brief", title: "Tell us about it", hint: "The idea, the deliverables, the vibe. Add references or a mood board if you have them." },
  { key: "details", label: "Your details", title: "Where should we reply?", hint: "We'll email you a confirmation right away." },
] as const;

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

/** Errors for the fields on one step (empty object = step is valid). */
function validateStep(step: number, f: Form): Errors {
  const e: Errors = {};
  const put = (k: Field, msg: string) => {
    if (msg) e[k] = msg;
  };
  if (step === 0) put("service", check.service(f.service));
  if (step === 1) {
    put("shootDate", check.date(f.shootDate, f.dateFlexible));
    if (!f.dateFlexible && f.shootDate && f.shootDate < todayISO()) e.shootDate = "That date has already passed.";
    put("city", check.city(f.city));
  }
  if (step === 2) put("budget", check.budget(f.budget));
  if (step === 3) {
    put("message", check.message(f.message));
    f.links.forEach((l, i) => put(`link${i}`, check.link(l)));
  }
  if (step === 4) {
    put("name", check.name(f.name));
    put("email", check.email(f.email));
    put("phone", check.phone(f.phone));
    put("company", check.company(f.company));
  }
  return e;
}

const inputClass =
  "w-full bg-charcoal/50 border px-4 py-3 font-montserrat text-sm text-ivory/90 outline-none transition-colors duration-300 placeholder:text-ivory/35 focus:border-gold/60";
const labelClass = "font-montserrat text-[10px] tracking-[0.3em] uppercase text-gold/70 block mb-2";
const border = (bad?: string) => (bad ? "border-red-400/60" : "border-gold/15");

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-2 font-montserrat text-xs text-red-300">
      {msg}
    </p>
  );
}

/** A big tappable option card backed by a real radio input. */
function OptionCard({
  name, value, checked, onChange, title, hint, describedBy,
}: {
  name: string; value: string; checked: boolean; onChange: (v: string) => void;
  title: string; hint?: string; describedBy?: string;
}) {
  return (
    <label
      className={`relative flex cursor-pointer flex-col gap-1 border px-4 py-3.5 transition-colors duration-200 ${
        checked ? "border-gold bg-gold/10" : "border-gold/15 hover:border-gold/40"
      } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        aria-describedby={describedBy}
        className="sr-only"
      />
      <span className="flex items-center justify-between gap-3">
        <span className={`font-cinzel text-sm font-semibold tracking-wide ${checked ? "text-gold" : "text-ivory/90"}`}>{title}</span>
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${checked ? "border-gold" : "border-gold/40"}`}
          aria-hidden
        >
          {checked && <span className="h-2 w-2 rounded-full bg-gold" />}
        </span>
      </span>
      {hint && <span className="font-montserrat text-xs text-ivory/55">{hint}</span>}
    </label>
  );
}

export default function QuoteBuilder() {
  const uid = useId();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [autoReplied, setAutoReplied] = useState(false);
  const [botField, setBotField] = useState("");
  const startedAt = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const id = (f: string) => `${uid}-${f}`;
  const errId = (f: string) => `${uid}-${f}-err`;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k as Field]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const markStarted = () => {
    if (startedAt.current === null) startedAt.current = Date.now();
  };

  // On step change: move focus to the new heading and keep the panel in view.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.6) {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step, status]);

  const focusFirstError = (e: Errors) => {
    const first = Object.keys(e)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el =
        document.getElementById(id(first)) ??
        (rootRef.current?.querySelector(`[name="${uid}-${first}"]:checked, [name="${uid}-${first}"]`) as HTMLElement | null);
      el?.focus();
    });
  };

  const next = () => {
    const e = validateStep(step, form);
    if (Object.keys(e).length) {
      setErrors(e);
      focusFirstError(e);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async () => {
    for (let s = 0; s < STEPS.length; s++) {
      const e = validateStep(s, form);
      if (Object.keys(e).length) {
        setStep(s);
        setErrors(e);
        focusFirstError(e);
        return;
      }
    }
    setStatus("sending");
    setServerError("");
    try {
      const { links, ...rest } = form;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          referenceLinks: links.filter((l) => l.trim()),
          website: botField,
          elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0,
          pageUrl: window.location.href,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; autoReplied?: boolean };
      if (!res.ok || !json.ok) {
        setServerError(json.error ?? "");
        setStatus("error");
        return;
      }
      trackEvent("generate_lead", { form: "quote_builder", service: form.service, budget: form.budget });
      setAutoReplied(Boolean(json.autoReplied));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) next();
    else void submit();
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setStep(0);
    setStatus("idle");
    setAutoReplied(false);
    startedAt.current = null;
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (status === "sent") {
    return (
      <div ref={rootRef} className="flex h-full flex-col items-center justify-center py-10 text-center" role="status">
        <div className="mb-6 flex h-16 w-16 items-center justify-center border border-gold/40">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 ref={headingRef} tabIndex={-1} className="mb-3 font-cinzel text-2xl font-bold gold-text outline-none">
          Brief Received
        </h3>
        <p className="max-w-sm font-montserrat text-sm leading-relaxed text-ivory/65">
          Thank you, {form.name.split(" ")[0]}. {siteConfig.founderName} will get back to you within 24 hours.
          {autoReplied && (
            <>
              {" "}We&apos;ve emailed a confirmation to <span className="text-gold/90">{form.email}</span>.
            </>
          )}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappUrl(`Hi House of Paradox! I just sent a ${form.service.toLowerCase()} brief on your website.`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { location: "quote_success" })}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-montserrat text-sm font-semibold text-jet transition-colors hover:bg-[#1ebe5b]"
          >
            Continue on WhatsApp
          </a>
          <button onClick={reset} className="btn-outline-gold px-6 py-3 font-cinzel text-xs tracking-[0.2em]">
            Send Another Brief
          </button>
        </div>
      </div>
    );
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const errProps = (f: Field) =>
    errors[f] ? { "aria-invalid": true as const, "aria-describedby": errId(f) } : {};

  // ── Wizard ─────────────────────────────────────────────────────────────────
  return (
    <div ref={rootRef} className="scroll-mt-24">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-gold/80">
            Step {step + 1} of {STEPS.length}
          </p>
          <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-ivory/45">{current.label}</p>
        </div>
        <div
          className="h-px w-full bg-gold/15"
          role="progressbar"
          aria-label="Quote progress"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
        >
          <div className="h-px bg-gold transition-[width] duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <form onSubmit={onSubmit} onFocus={markStarted} noValidate>
        {/* Honeypot: hidden from people, catches spam bots */}
        <p className="hidden" aria-hidden>
          <label>
            Don&apos;t fill this out:{" "}
            <input name="website" tabIndex={-1} autoComplete="off" value={botField} onChange={(e) => setBotField(e.target.value)} />
          </label>
        </p>

        <h3 ref={headingRef} tabIndex={-1} className="font-cinzel text-xl font-semibold text-ivory/95 outline-none md:text-2xl">
          {current.title}
        </h3>
        <p className="mb-6 mt-2 font-montserrat text-sm text-ivory/55">{current.hint}</p>

        <div className="min-h-[260px]" aria-live="polite">
          {/* 1. Service */}
          {step === 0 && (
            <fieldset>
              <legend className="sr-only">Service</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SERVICES.map((s) => (
                  <OptionCard
                    key={s}
                    name={`${uid}-service`}
                    value={s}
                    checked={form.service === s}
                    onChange={(v) => set("service", v)}
                    title={s}
                    hint={SERVICE_HINTS[s]}
                    describedBy={errors.service ? errId("service") : undefined}
                  />
                ))}
              </div>
              <FieldError id={errId("service")} msg={errors.service} />
            </fieldset>
          )}

          {/* 2. Date & city */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor={id("shootDate")} className={labelClass}>
                  Shoot / event date
                </label>
                <input
                  id={id("shootDate")}
                  type="date"
                  min={todayISO()}
                  value={form.shootDate}
                  disabled={form.dateFlexible}
                  onChange={(e) => set("shootDate", e.target.value)}
                  className={`${inputClass} ${border(errors.shootDate)} [color-scheme:dark] disabled:opacity-40`}
                  {...errProps("shootDate")}
                />
                <label className="mt-3 flex cursor-pointer items-center gap-3 font-montserrat text-sm text-ivory/75">
                  <input
                    type="checkbox"
                    checked={form.dateFlexible}
                    onChange={(e) => {
                      set("dateFlexible", e.target.checked);
                      if (e.target.checked) set("shootDate", "");
                      setErrors((x) => ({ ...x, shootDate: undefined }));
                    }}
                    className="h-4 w-4 accent-[#D4AF37]"
                  />
                  Dates are flexible / not decided yet
                </label>
                <FieldError id={errId("shootDate")} msg={errors.shootDate} />
              </div>
              <div>
                <label htmlFor={id("city")} className={labelClass}>
                  City *
                </label>
                <input
                  id={id("city")}
                  list={id("cities")}
                  value={form.city}
                  maxLength={LIMITS.city}
                  autoComplete="address-level2"
                  placeholder="e.g. Delhi"
                  onChange={(e) => set("city", e.target.value)}
                  className={`${inputClass} ${border(errors.city)}`}
                  {...errProps("city")}
                />
                <datalist id={id("cities")}>
                  {CITY_SUGGESTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CITY_SUGGESTIONS.slice(0, 4).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set("city", c)}
                      className={`border px-3 py-1.5 font-montserrat text-xs transition-colors ${
                        form.city === c ? "border-gold bg-gold/10 text-gold" : "border-gold/20 text-ivory/65 hover:border-gold/50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <FieldError id={errId("city")} msg={errors.city} />
              </div>
            </div>
          )}

          {/* 3. Budget */}
          {step === 2 && (
            <fieldset>
              <legend className="sr-only">Budget</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {BUDGETS.map((b) => (
                  <OptionCard
                    key={b}
                    name={`${uid}-budget`}
                    value={b}
                    checked={form.budget === b}
                    onChange={(v) => set("budget", v)}
                    title={b}
                    describedBy={errors.budget ? errId("budget") : undefined}
                  />
                ))}
              </div>
              <FieldError id={errId("budget")} msg={errors.budget} />
            </fieldset>
          )}

          {/* 4. Brief & references */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label htmlFor={id("message")} className={labelClass}>
                  Your brief *
                </label>
                <textarea
                  id={id("message")}
                  rows={5}
                  maxLength={LIMITS.message}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="e.g. A 60-second brand film for our festive collection launch — 1 day shoot, studio + outdoor, 3 reels cut-downs."
                  className={`${inputClass} ${border(errors.message)} resize-none`}
                  {...errProps("message")}
                />
                <div className="mt-1 flex justify-between">
                  <FieldError id={errId("message")} msg={errors.message} />
                  <span className="ml-auto mt-2 font-montserrat text-[11px] text-ivory/35">
                    {form.message.length}/{LIMITS.message}
                  </span>
                </div>
              </div>

              <div>
                <p className={labelClass} id={id("links-label")}>
                  References / mood board <span className="normal-case tracking-normal text-ivory/40">(optional)</span>
                </p>
                <p className="-mt-1 mb-3 font-montserrat text-xs text-ivory/45">
                  Pinterest board, Instagram post, Google Drive folder, YouTube video…
                </p>
                <div className="space-y-3">
                  {form.links.map((l, i) => (
                    <div key={i}>
                      <div className="flex gap-2">
                        <input
                          id={id(`link${i}`)}
                          type="url"
                          inputMode="url"
                          value={l}
                          placeholder="https://"
                          aria-label={`Reference link ${i + 1}`}
                          onChange={(e) => {
                            const links = [...form.links];
                            links[i] = e.target.value;
                            set("links", links);
                            setErrors((x) => ({ ...x, [`link${i}`]: undefined }));
                          }}
                          className={`${inputClass} ${border(errors[`link${i}`])}`}
                          {...errProps(`link${i}`)}
                        />
                        {form.links.length > 1 && (
                          <button
                            type="button"
                            onClick={() => set("links", form.links.filter((_, j) => j !== i))}
                            className="shrink-0 border border-gold/20 px-3 text-ivory/60 hover:border-gold/50 hover:text-gold"
                            aria-label={`Remove link ${i + 1}`}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <FieldError id={errId(`link${i}`)} msg={errors[`link${i}`]} />
                    </div>
                  ))}
                </div>
                {form.links.length < MAX_REFERENCE_LINKS && (
                  <button
                    type="button"
                    onClick={() => set("links", [...form.links, ""])}
                    className="mt-3 font-montserrat text-xs uppercase tracking-[0.2em] text-gold/80 hover:text-gold"
                  >
                    + Add another link
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 5. Details */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Summary of earlier answers */}
              <div className="flex flex-wrap gap-2">
                {[
                  { k: form.service, s: 0 },
                  { k: formatShootDate({ ...form, referenceLinks: [] }), s: 1 },
                  { k: form.city, s: 1 },
                  { k: form.budget, s: 2 },
                ].map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStep(c.s)}
                    className="border border-gold/25 bg-gold/5 px-3 py-1.5 font-montserrat text-xs text-ivory/80 hover:border-gold/60"
                    title="Edit"
                  >
                    {c.k} <span className="ml-1 text-gold/70" aria-hidden>✎</span>
                    <span className="sr-only"> (edit)</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor={id("name")} className={labelClass}>Full name *</label>
                  <input
                    id={id("name")}
                    autoComplete="name"
                    maxLength={LIMITS.name}
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your full name"
                    className={`${inputClass} ${border(errors.name)}`}
                    {...errProps("name")}
                  />
                  <FieldError id={errId("name")} msg={errors.name} />
                </div>
                <div>
                  <label htmlFor={id("email")} className={labelClass}>Email *</label>
                  <input
                    id={id("email")}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={LIMITS.email}
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="hello@yourbrand.com"
                    className={`${inputClass} ${border(errors.email)}`}
                    {...errProps("email")}
                  />
                  <FieldError id={errId("email")} msg={errors.email} />
                </div>
                <div>
                  <label htmlFor={id("phone")} className={labelClass}>
                    Phone / WhatsApp <span className="normal-case tracking-normal text-ivory/40">(optional)</span>
                  </label>
                  <input
                    id={id("phone")}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={LIMITS.phone}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98xxx xxxxx"
                    className={`${inputClass} ${border(errors.phone)}`}
                    {...errProps("phone")}
                  />
                  <FieldError id={errId("phone")} msg={errors.phone} />
                </div>
                <div>
                  <label htmlFor={id("company")} className={labelClass}>
                    Brand / company <span className="normal-case tracking-normal text-ivory/40">(optional)</span>
                  </label>
                  <input
                    id={id("company")}
                    autoComplete="organization"
                    maxLength={LIMITS.company}
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="Your brand"
                    className={`${inputClass} ${border(errors.company)}`}
                    {...errProps("company")}
                  />
                  <FieldError id={errId("company")} msg={errors.company} />
                </div>
              </div>
            </div>
          )}
        </div>

        {status === "error" && (
          <p role="alert" className="mt-6 border border-red-400/30 bg-red-950/20 px-4 py-3 font-montserrat text-sm text-red-300/90">
            {serverError || "Sorry, your brief couldn't be sent."} Please try again, or{" "}
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="text-gold underline">
              message us on WhatsApp
            </a>
            .
          </p>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center gap-3">
          {step > 0 && (
            <button type="button" onClick={back} className="btn-outline-gold px-6 py-4 font-cinzel text-xs tracking-[0.2em]">
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-gold flex flex-1 items-center justify-center gap-3 py-4 font-cinzel text-sm tracking-[0.25em] disabled:opacity-70"
          >
            {status === "sending" ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-jet/30 border-t-jet" aria-hidden />
                Sending…
              </>
            ) : isLast ? (
              "Send Brief"
            ) : (
              "Next"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
