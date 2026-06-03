"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const services = ["Photography", "Video Production", "Podcast Production", "Event Coverage", "Creative Direction", "Content Creation"];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      id="home"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,175,55,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
        />
        {/* Diagonal lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#D4AF37" strokeWidth="0.5"/>
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="#D4AF37" strokeWidth="0.5"/>
        </svg>
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.45em" }}
          transition={{ duration: 1.2, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-montserrat text-xs uppercase text-gold/70 mb-10 tracking-[0.45em]"
        >
          Delhi, India
        </motion.p>

        {/* Main Logo Mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-8"
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64">
            <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
              <defs>
                <linearGradient id="heroGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37"/>
                  <stop offset="50%" stopColor="#F2C667"/>
                  <stop offset="100%" stopColor="#B8960C"/>
                </linearGradient>
              </defs>
              {/* H */}
              <text x="5" y="155" fontFamily="Cinzel, serif" fontSize="160" fontWeight="700" fill="url(#heroGold)">H</text>
              {/* P */}
              <text x="95" y="155" fontFamily="Cinzel, serif" fontSize="160" fontWeight="700" fill="url(#heroGold)">P</text>
              {/* Camera shutter */}
              <g transform="translate(90, 75)" opacity="0.85">
                <circle cx="0" cy="0" r="22" fill="none" stroke="url(#heroGold)" strokeWidth="1.5"/>
                <circle cx="0" cy="0" r="10" fill="none" stroke="url(#heroGold)" strokeWidth="1"/>
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <line
                    key={i}
                    x1="0" y1="-10"
                    x2="0" y2="-22"
                    stroke="url(#heroGold)"
                    strokeWidth="2"
                    transform={`rotate(${angle})`}
                  />
                ))}
              </g>
              {/* Diagonal slash */}
              <line x1="20" y1="20" x2="180" y2="180" stroke="url(#heroGold)" strokeWidth="2" opacity="0.7"/>
            </svg>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-cinzel font-bold leading-none">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl gold-shimmer tracking-[0.15em]">
              HOUSE
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl text-ivory/40 font-light tracking-[0.5em] my-1 md:my-2">
              of
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl gold-shimmer tracking-[0.15em]">
              PARADOX
            </span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex items-center justify-center gap-4"
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
          <p className="font-montserrat text-xs md:text-sm tracking-[0.35em] text-gold/80 uppercase">
            Where Style Becomes Story
          </p>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
        </motion.div>

        {/* Services ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.2 }}
          className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {services.map((s, i) => (
            <span key={s} className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-ivory/40 flex items-center gap-2">
              {i > 0 && <span className="text-gold/30">·</span>}
              {s}
            </span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 3.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-gold px-10 py-4 text-sm font-cinzel tracking-[0.2em]"
          >
            View Our Work
          </button>
          <button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-outline-gold px-10 py-4 text-sm font-cinzel tracking-[0.2em]"
          >
            Get In Touch
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-montserrat text-[9px] tracking-[0.4em] text-gold/40 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
