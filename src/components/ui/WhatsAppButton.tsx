"use client";

import { useEffect, useId, useRef, useState } from "react";
import { siteConfig, whatsappUrl } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

// WhatsApp logo glyph (for linking to WhatsApp).
const WA_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

function WaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={WA_PATH} />
    </svg>
  );
}

/**
 * Floating WhatsApp button (bottom-right). Tapping it toggles a small chat card;
 * "Start chat" opens WhatsApp with the studio's number and a pre-filled message.
 */
export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  // On phones, step aside while the quote form is on screen (it has its own
  // WhatsApp links, and the floating button would cover its Send button).
  const [hidden, setHidden] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on Escape or a tap outside the widget.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target || !("IntersectionObserver" in window)) return;
    const small = window.matchMedia("(max-width: 1023px)");
    let inView = false;
    const update = () => {
      const hide = small.matches && inView;
      setHidden(hide);
      if (hide) setOpen(false);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { rootMargin: "0px 0px -35% 0px" }
    );
    io.observe(target);
    small.addEventListener("change", update);
    return () => {
      io.disconnect();
      small.removeEventListener("change", update);
    };
  }, []);

  const href = whatsappUrl();

  return (
    <div
      ref={rootRef}
      className={`fixed right-4 sm:right-6 z-30 flex flex-col items-end gap-3 transition-all duration-300 ${
        hidden ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
      }`}
      aria-hidden={hidden || undefined}
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      {/* Chat card */}
      <div
        id={panelId}
        role="dialog"
        aria-label="Chat with House of Paradox on WhatsApp"
        aria-hidden={!open}
        className={`w-[min(20rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden border border-gold/25 bg-charcoal shadow-2xl shadow-black/60 transition-all duration-200 ${
          open ? "opacity-100 scale-100 translate-y-0" : "pointer-events-none opacity-0 scale-95 translate-y-2"
        }`}
      >
        <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-jet font-cinzel text-sm font-bold text-gold">
            HP
          </span>
          <div className="min-w-0">
            <p className="font-cinzel text-sm font-semibold tracking-wide text-white">{siteConfig.name}</p>
            <p className="font-montserrat text-[11px] text-white/80">Chat with us on WhatsApp</p>
          </div>
        </div>

        <div className="px-4 py-4">
          <p className="font-montserrat text-[11px] uppercase tracking-[0.2em] text-gold/70 mb-2">Your message</p>
          <p className="relative rounded-md rounded-tr-none bg-[#DCF8C6] px-3 py-2 font-montserrat text-sm leading-snug text-jet">
            {siteConfig.whatsappMessage}
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              trackEvent("whatsapp_click", { location: "floating_button" });
              setOpen(false);
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-montserrat text-sm font-semibold text-jet transition-colors hover:bg-[#1ebe5b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <WaIcon className="h-5 w-5" />
            Start chat
          </a>
          <p className="mt-3 text-center font-montserrat text-[11px] text-ivory/50">{siteConfig.phone}</p>
        </div>
      </div>

      {/* Toggle button */}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/50 transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {!open && <span className="wa-ping absolute inset-0 rounded-full bg-[#25D366]" aria-hidden />}
        <span className={`relative transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <WaIcon className="h-7 w-7" />
          )}
        </span>
      </button>
    </div>
  );
}
