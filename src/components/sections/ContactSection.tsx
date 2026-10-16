"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { SERVICES, LIMITS } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";

const contactInfo = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.64A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    label: "Phone",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/\s+/g, "")}`,
    external: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    external: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    label: "Website",
    value: siteConfig.url.replace(/^https?:\/\//, "www."),
    href: siteConfig.url,
    external: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: "Location",
    value: siteConfig.location,
    href: `https://maps.google.com/?q=${encodeURIComponent(siteConfig.location)}`,
    external: true,
  },
];

const emptyForm = { name: "", email: "", service: "", message: "" };

const inputClass =
  "w-full bg-charcoal/50 border border-gold/15 focus:border-gold/50 px-4 py-3 font-montserrat text-sm text-ivory/80 outline-none transition-colors duration-300 placeholder:text-ivory/35";
const labelClass = "font-montserrat text-[10px] tracking-[0.3em] uppercase text-gold/70 block mb-2";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactSection() {
  const [form, setForm] = useState(emptyForm);
  const [botField, setBotField] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const startedAt = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // The thank-you panel is shorter than the form, so bring it into view on phones.
  useEffect(() => {
    if (status === "sent") panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [status]);

  // Remember when the visitor first touched the form (bots submit instantly).
  const markStarted = () => {
    if (startedAt.current === null) startedAt.current = Date.now();
  };

  // Sends the enquiry to our API route, which saves it to Supabase and emails the team.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: botField,
          elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0,
          pageUrl: window.location.href,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error ?? "");
        setStatus("error");
        return;
      }
      trackEvent("generate_lead", { form: "contact", service: form.service || "unspecified" });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const hasFounder = siteConfig.founderName.trim() !== "";

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="Let's Create Together"
          title="Get In Touch"
          subtitle="Ready to bring your vision to life? Tell us about your project."
          centered
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-px bg-gold/10">
          {/* Contact Info */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 bg-charcoal p-8 lg:p-10 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-cinzel text-xl font-semibold gold-text tracking-wide mb-2">
                {hasFounder ? siteConfig.founderName : siteConfig.name}
              </h3>
              <p className="font-montserrat text-xs tracking-[0.25em] uppercase text-ivory/50 mb-8">
                {hasFounder ? siteConfig.founderRole : "Creative Production Studio"}
              </p>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 group"
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    <span className="text-gold/50 group-hover:text-gold transition-colors duration-300">
                      {item.icon}
                    </span>
                    <div>
                      <p className="font-montserrat text-[10px] tracking-widest uppercase text-ivory/50 mb-0.5">
                        {item.label}
                      </p>
                      <p className="font-montserrat text-sm text-ivory/70 group-hover:text-gold/80 transition-colors duration-300 break-all sm:break-normal">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Logo */}
            <div className="mt-12 pt-8 border-t border-gold/10">
              <p className="font-cinzel text-2xl font-bold gold-text tracking-[0.15em]">HoP</p>
              <div className="w-16 h-px bg-gradient-to-r from-gold to-transparent mt-2" />
              <p className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-ivory/40 mt-2">
                {siteConfig.name}
              </p>
            </div>
          </m.div>

          {/* Form */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3 bg-jet p-8 lg:p-10"
            ref={panelRef}
          >
            {status === "sent" ? (
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
                role="status"
              >
                <div className="w-16 h-16 border border-gold/40 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-cinzel text-2xl font-bold gold-text mb-3">Message Sent</h3>
                <p className="font-montserrat text-sm text-ivory/60 leading-relaxed max-w-xs">
                  Thank you for reaching out. We&apos;ll be in touch within 24 hours to discuss your vision.
                </p>
                <button
                  onClick={() => { setStatus("idle"); setForm(emptyForm); startedAt.current = null; }}
                  className="mt-8 btn-outline-gold px-8 py-3 text-xs font-cinzel tracking-[0.2em]"
                >
                  Send Another
                </button>
              </m.div>
            ) : (
              <form onSubmit={handleSubmit} onFocus={markStarted} className="space-y-6">
                {/* Honeypot: hidden from people, catches spam bots */}
                <p className="hidden" aria-hidden>
                  <label>
                    Don&apos;t fill this out:{" "}
                    <input
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={botField}
                      onChange={(e) => setBotField(e.target.value)}
                    />
                  </label>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      maxLength={LIMITS.name}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      maxLength={LIMITS.email}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                      placeholder="hello@yourbrand.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-service" className={labelClass}>
                    Service Required
                  </label>
                  <select
                    id="contact-service"
                    name="service"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="" className="bg-jet">Select a service...</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-jet">{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    Tell Us About Your Project *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    maxLength={LIMITS.message}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                    placeholder="Describe your vision, timeline, and any specific requirements..."
                  />
                </div>

                {status === "error" && (
                  <p role="alert" className="font-montserrat text-sm text-red-300/90 border border-red-400/30 bg-red-950/20 px-4 py-3">
                    {errorMsg || "Sorry, your message couldn't be sent."} Please try again, or email us at{" "}
                    <a href={`mailto:${siteConfig.email}`} className="underline text-gold">
                      {siteConfig.email}
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full btn-gold py-4 font-cinzel text-sm tracking-[0.25em] flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {status === "sending" ? (
                    <>
                      <m.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-jet/30 border-t-jet rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </m.div>
        </div>
      </div>
    </section>
  );
}
