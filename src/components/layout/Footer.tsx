"use client";

import { motion } from "framer-motion";

const footerLinks = {
  Services: ["Photography", "Video Production", "Podcast Production", "Event Coverage", "Creative Direction", "Content Creation"],
  Company: ["About Us", "Our Work", "Brand Identity", "Testimonials", "Contact"],
  Connect: ["Instagram", "YouTube", "Pinterest", "LinkedIn", "Email Us"],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-jet border-t border-gold/10 overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10">
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    <text x="1" y="32" fontFamily="Cinzel, serif" fontSize="34" fontWeight="700" fill="url(#footerGold)">H</text>
                    <text x="18" y="32" fontFamily="Cinzel, serif" fontSize="34" fontWeight="700" fill="url(#footerGold)">P</text>
                    <circle cx="20" cy="18" r="5" fill="none" stroke="url(#footerGold)" strokeWidth="1"/>
                    <line x1="3" y1="3" x2="37" y2="37" stroke="url(#footerGold)" strokeWidth="1"/>
                    <defs>
                      <linearGradient id="footerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37"/>
                        <stop offset="100%" stopColor="#F2C667"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <p className="font-cinzel text-sm font-semibold tracking-[0.2em] gold-text">
                    HOUSE <span className="text-ivory/30 font-light">of</span> PARADOX
                  </p>
                  <p className="font-montserrat text-[9px] tracking-[0.3em] text-gold/40 uppercase mt-0.5">
                    Where Style Becomes Story
                  </p>
                </div>
              </div>

              <p className="font-montserrat text-sm text-ivory/40 font-light leading-relaxed max-w-xs mb-8">
                A luxury creative production studio based in Delhi, India. We craft timeless stories that define brands and inspire audiences.
              </p>

              {/* Social links */}
              <div className="flex gap-3">
                {["IG", "YT", "LI", "PT"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="w-9 h-9 border border-gold/20 hover:border-gold/50 flex items-center justify-center font-cinzel text-[10px] text-gold/40 hover:text-gold transition-all duration-300"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links], colIdx) => (
            <motion.div
              key={heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: colIdx * 0.1 }}
            >
              <h4 className="font-cinzel text-xs tracking-[0.35em] uppercase text-gold/70 mb-5">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-montserrat text-sm text-ivory/35 hover:text-gold/70 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-montserrat text-[11px] tracking-[0.2em] text-ivory/25">
            © {year} House of Paradox. All rights reserved.
          </p>
          <p className="font-montserrat text-[11px] tracking-[0.2em] text-ivory/20">
            houseofparadoxproduction.com · Delhi, India
          </p>
        </div>
      </div>
    </footer>
  );
}
