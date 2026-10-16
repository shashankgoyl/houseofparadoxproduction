"use client";

import { m } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import QuoteBuilder from "@/components/sections/QuoteBuilder";
import { siteConfig, whatsappUrl } from "@/config/site";

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
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
      </svg>
    ),
    label: "WhatsApp",
    value: "Chat with us",
    href: whatsappUrl(),
    external: true,
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

export default function ContactSection() {
  const hasFounder = siteConfig.founderName.trim() !== "";

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="Let's Create Together"
          title="Get a Quote"
          subtitle="Five quick steps. Tell us what you need and we'll reply within 24 hours."
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

          {/* Quote builder */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3 bg-jet p-6 sm:p-8 lg:p-10"
          >
            <QuoteBuilder />
          </m.div>
        </div>
      </div>
    </section>
  );
}
