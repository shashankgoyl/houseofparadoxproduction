"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const services = [
  "Photography",
  "Video Production",
  "Podcast Production",
  "Event Coverage",
  "Creative Direction",
  "Content Creation",
];

const contactInfo = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.64A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    label: "Phone",
    value: "+91 9711717136",
    href: "tel:+919711717136",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: "Email",
    value: "hello@houseofparadox.com",
    href: "mailto:hello@houseofparadox.com",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    label: "Website",
    value: "www.houseofparadox.com",
    href: "https://houseofparadoxproduction.com",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: "Location",
    value: "Delhi, India",
    href: "https://maps.google.com/?q=Delhi,India",
  },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

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
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 bg-charcoal p-8 lg:p-10 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-cinzel text-xl font-semibold gold-text tracking-wide mb-2">
                Your Name
              </h3>
              <p className="font-montserrat text-xs tracking-[0.25em] uppercase text-ivory/40 mb-8">
                Founder & Creative Director
              </p>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 group"
                    target={item.label === "Website" ? "_blank" : undefined}
                    rel="noreferrer"
                  >
                    <span className="text-gold/50 group-hover:text-gold transition-colors duration-300">
                      {item.icon}
                    </span>
                    <div>
                      <p className="font-montserrat text-[10px] tracking-widest uppercase text-ivory/30 mb-0.5">
                        {item.label}
                      </p>
                      <p className="font-montserrat text-sm text-ivory/70 group-hover:text-gold/80 transition-colors duration-300">
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
              <p className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-ivory/30 mt-2">
                House of Paradox
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3 bg-jet p-8 lg:p-10"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-16 h-16 border border-gold/40 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-cinzel text-2xl font-bold gold-text mb-3">Message Sent</h3>
                <p className="font-montserrat text-sm text-ivory/50 leading-relaxed max-w-xs">
                  Thank you for reaching out. We&apos;ll be in touch within 24 hours to discuss your vision.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", service: "", message: "" }); }}
                  className="mt-8 btn-outline-gold px-8 py-3 text-xs font-cinzel tracking-[0.2em]"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-gold/50 block mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-charcoal/50 border border-gold/15 focus:border-gold/50 px-4 py-3 font-montserrat text-sm text-ivory/80 outline-none transition-colors duration-300 placeholder:text-ivory/20"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-gold/50 block mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-charcoal/50 border border-gold/15 focus:border-gold/50 px-4 py-3 font-montserrat text-sm text-ivory/80 outline-none transition-colors duration-300 placeholder:text-ivory/20"
                      placeholder="hello@yourbrand.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-gold/50 block mb-2">
                    Service Required
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full bg-charcoal/50 border border-gold/15 focus:border-gold/50 px-4 py-3 font-montserrat text-sm text-ivory/80 outline-none transition-colors duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-jet">Select a service...</option>
                    {services.map((s) => (
                      <option key={s} value={s} className="bg-jet">{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-gold/50 block mb-2">
                    Tell Us About Your Project *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-charcoal/50 border border-gold/15 focus:border-gold/50 px-4 py-3 font-montserrat text-sm text-ivory/80 outline-none transition-colors duration-300 resize-none placeholder:text-ivory/20"
                    placeholder="Describe your vision, timeline, and any specific requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-4 font-cinzel text-sm tracking-[0.25em] flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-jet/30 border-t-jet rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
