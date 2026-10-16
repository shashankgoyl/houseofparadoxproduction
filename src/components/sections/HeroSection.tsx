"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { SERVICES } from "@/lib/contact";

// Entrance animations are plain CSS (.hero-in in globals.css) so they start as
// soon as the HTML paints, without waiting for JavaScript. This is what makes
// the hero appear fast on phones. Framer Motion only drives the scroll fade.
const delay = (s: number) => ({ animationDelay: `${s}s` });

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  // Progress runs from hero top at viewport top (0) to hero fully scrolled past (1).
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-28 md:pb-32"
      id="home"
    >
      {/* Background grid, glow and diagonals */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
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
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,140vw)] aspect-square rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#D4AF37" strokeWidth="0.5" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="#D4AF37" strokeWidth="0.5" />
        </svg>
      </div>

      <m.div style={{ y, opacity }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <p className="hero-in font-montserrat text-xs uppercase text-gold/80 mb-8 md:mb-10 tracking-[0.45em]" style={delay(0.05)}>
          Delhi, India
        </p>

        {/* Main logo mark */}
        <div className="hero-in hero-in-scale flex justify-center mb-6 md:mb-8" style={delay(0.1)}>
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64">
            <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
              <defs>
                <linearGradient id="heroGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#F2C667" />
                  <stop offset="100%" stopColor="#B8960C" />
                </linearGradient>
              </defs>
              <text x="5" y="155" className="font-cinzel" fontSize="160" fontWeight="700" fill="url(#heroGold)">H</text>
              <text x="95" y="155" className="font-cinzel" fontSize="160" fontWeight="700" fill="url(#heroGold)">P</text>
              <g transform="translate(90, 75)" opacity="0.85">
                <circle cx="0" cy="0" r="22" fill="none" stroke="url(#heroGold)" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="10" fill="none" stroke="url(#heroGold)" strokeWidth="1" />
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <line key={angle} x1="0" y1="-10" x2="0" y2="-22" stroke="url(#heroGold)" strokeWidth="2" transform={`rotate(${angle})`} />
                ))}
              </g>
              <line x1="20" y1="20" x2="180" y2="180" stroke="url(#heroGold)" strokeWidth="2" opacity="0.7" />
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="hero-in font-cinzel font-bold leading-none" style={delay(0.2)}>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl gold-shimmer tracking-[0.15em]">
            HOUSE
          </span>
          <span className="block text-lg sm:text-xl md:text-2xl text-ivory/50 font-light tracking-[0.5em] my-1 md:my-2">
            of
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl gold-shimmer tracking-[0.15em]">
            PARADOX
          </span>
          <span className="sr-only"> — luxury photography and video production studio in Delhi</span>
        </h1>

        {/* Tagline */}
        <div className="hero-in mt-6 flex items-center justify-center gap-3 sm:gap-4" style={delay(0.35)}>
          <span className="h-px w-8 sm:w-12 shrink-0 bg-gradient-to-r from-transparent to-gold" aria-hidden />
          <p className="font-montserrat text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.35em] text-gold/90 uppercase">
            Where Style Becomes Story
          </p>
          <span className="h-px w-8 sm:w-12 shrink-0 bg-gradient-to-l from-transparent to-gold" aria-hidden />
        </div>

        {/* Services */}
        <ul className="hero-in mt-8 md:mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2" style={delay(0.45)} aria-label="Our services">
          {SERVICES.map((s, i) => (
            <li key={s} className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-ivory/60 flex items-center gap-2">
              {i > 0 && <span className="text-gold/40" aria-hidden>·</span>}
              {s}
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div className="hero-in mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center" style={delay(0.55)}>
          <button onClick={() => scrollTo("#work")} className="btn-gold px-10 py-4 text-sm font-cinzel tracking-[0.2em]">
            View Our Work
          </button>
          <button onClick={() => scrollTo("#contact")} className="btn-outline-gold px-10 py-4 text-sm font-cinzel tracking-[0.2em]">
            Get In Touch
          </button>
        </div>
      </m.div>

      {/* Scroll indicator */}
      <div className="hero-in absolute bottom-8 inset-x-0 mx-auto w-fit hidden sm:flex flex-col items-center gap-2" style={delay(0.9)} aria-hidden>
        <span className="font-montserrat text-[9px] tracking-[0.4em] text-gold/60 uppercase">Scroll</span>
        <span className="block w-px h-8 bg-gradient-to-b from-gold/60 to-transparent scroll-bob" />
      </div>
    </section>
  );
}
