"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";

const brandColors = [
  { name: "Gold", hex: "#D4AF37", label: "#D4AF37", textClass: "text-jet" },
  { name: "Light Gold", hex: "#F2C667", label: "#F2C667", textClass: "text-jet" },
  { name: "Charcoal", hex: "#1A1A1A", label: "#1A1A1A", textClass: "text-ivory/60" },
  { name: "Jet Black", hex: "#0D0D0D", label: "#0D0D0D", textClass: "text-ivory/60" },
  { name: "Ivory", hex: "#F7F5EF", label: "#F7F5EF", textClass: "text-jet" },
];

const socialIcons = [
  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  { label: "Pinterest", path: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" },
  { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
];

const highlightCovers = [
  { label: "Shoots", icon: "📷" },
  { label: "Films", icon: "🎬" },
  { label: "Podcast", icon: "🎙" },
  { label: "Events", icon: "⭐" },
  { label: "BTS", icon: "🎥" },
  { label: "Reviews", icon: "✦" },
];

export default function BrandSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section id="brand" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="Brand Identity"
          title="The Visual Language"
          subtitle="A cohesive design system built on luxury, precision, and timeless elegance."
          centered
          className="mb-16"
        />

        {/* Brand Colors */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="font-cinzel text-xs tracking-[0.35em] uppercase text-gold/60 mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-gold/40" /> Brand Colors
          </p>
          <div className="flex gap-3 flex-wrap">
            {brandColors.map((color, i) => (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group cursor-default"
              >
                <div
                  className="w-20 h-20 md:w-28 md:h-28 relative overflow-hidden transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="absolute inset-0 border border-gold/10" />
                </div>
                <p className={`font-cinzel text-xs font-semibold mt-2 tracking-wider ${color.name === "Ivory" || color.name === "Light Gold" || color.name === "Gold" ? "text-ivory/80" : "text-ivory/50"}`}>
                  {color.name}
                </p>
                <p className="font-montserrat text-[10px] text-gold/40 tracking-widest">{color.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-gold/10"
        >
          <div className="bg-jet p-8">
            <p className="font-cinzel text-xs tracking-[0.35em] uppercase text-gold/60 mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gold/40" /> Primary Typeface
            </p>
            <p className="font-cinzel text-7xl md:text-8xl font-bold gold-text leading-none">Aa</p>
            <p className="font-cinzel text-2xl font-semibold text-ivory/70 mt-3">Cinzel Regular</p>
            <p className="font-cinzel text-xs tracking-[0.3em] text-ivory/30 mt-4">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>0123456789
            </p>
          </div>
          <div className="bg-charcoal p-8">
            <p className="font-cinzel text-xs tracking-[0.35em] uppercase text-gold/60 mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gold/40" /> Secondary Typeface
            </p>
            <p className="font-montserrat text-7xl md:text-8xl font-light text-ivory/80 leading-none">Aa</p>
            <p className="font-montserrat text-2xl font-light text-ivory/60 mt-3">Montserrat Light / Regular</p>
            <p className="font-montserrat text-xs tracking-[0.15em] text-ivory/25 mt-4">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>0123456789
            </p>
          </div>
        </motion.div>

        {/* Marquee / Social */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-cinzel text-xs tracking-[0.35em] uppercase text-gold/60 mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-gold/40" /> Social Media
          </p>
          <div className="flex gap-6 flex-wrap items-center">
            {socialIcons.map((icon, i) => (
              <motion.a
                key={icon.label}
                href="#"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.15 }}
                className="w-12 h-12 border border-gold/20 hover:border-gold/60 flex items-center justify-center rounded-full transition-all duration-300 group"
                aria-label={icon.label}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-ivory/40 group-hover:fill-gold transition-colors duration-300">
                  <path d={icon.path} />
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Highlight Covers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-cinzel text-xs tracking-[0.35em] uppercase text-gold/60 mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-gold/40" /> Story Highlights
          </p>
          <div className="flex gap-4 flex-wrap">
            {highlightCovers.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-gold/30 group-hover:border-gold/70 rounded-full flex items-center justify-center bg-charcoal group-hover:bg-gold/5 transition-all duration-300">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <span className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-ivory/40 group-hover:text-gold/60 transition-colors">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tagline Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 border border-gold/20 p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5"
            style={{ background: "radial-gradient(ellipse at center, #D4AF37 0%, transparent 70%)" }}
          />
          <p className="font-cinzel text-xs tracking-[0.5em] uppercase text-gold/50 mb-4">Brand Statement</p>
          <h3 className="font-cinzel text-3xl md:text-5xl font-bold gold-shimmer tracking-[0.2em] leading-tight">
            WHERE STYLE BECOMES STORY
          </h3>
          <div className="w-24 h-px bg-gold/40 mx-auto mt-6 mb-6" />
          <p className="font-montserrat text-sm md:text-base text-ivory/50 font-light max-w-2xl mx-auto leading-relaxed">
            We don&apos;t just create visuals, we craft timeless stories that define brands,
            inspire audiences and leave a lasting impact.
          </p>
        </motion.div>
      </div>

      {/* Scrolling text marquee */}
      <div className="mt-20 overflow-hidden border-t border-b border-gold/10 py-4">
        <motion.div style={{ x: x1 }} className="flex gap-12 whitespace-nowrap">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="font-cinzel text-xs tracking-[0.4em] uppercase text-gold/15 shrink-0">
              House of Paradox · Where Style Becomes Story ·
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
