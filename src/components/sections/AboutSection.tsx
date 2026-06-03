"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const stats = [
  { value: "200+", label: "Projects Delivered" },
  { value: "5+", label: "Years of Excellence" },
  { value: "80+", label: "Happy Clients" },
  { value: "15+", label: "Industry Awards" },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main visual block */}
            <div className="relative aspect-[4/5] bg-charcoal overflow-hidden">
              {/* Mood grid */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1">
                {/* Top-left: dark fashion */}
                <div className="bg-[#111] relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <svg viewBox="0 0 100 120" className="w-full h-full">
                      <ellipse cx="50" cy="35" rx="18" ry="22" fill="#D4AF37" opacity="0.4"/>
                      <path d="M20 120 Q30 75 50 65 Q70 75 80 120Z" fill="#D4AF37" opacity="0.25"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="font-cinzel text-[10px] tracking-widest text-gold/60 uppercase">Fashion</span>
                  </div>
                </div>
                {/* Top-right: dark */}
                <div className="bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center">
                  <div className="w-16 h-16 border border-gold/20 rotate-45 flex items-center justify-center">
                    <div className="w-8 h-8 border border-gold/40 rotate-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-gold/60 rounded-full" />
                    </div>
                  </div>
                </div>
                {/* Bottom-left */}
                <div className="bg-[#0f0f0f] relative overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-cinzel text-2xl gold-text font-bold">HoP</p>
                    <div className="w-8 h-px bg-gold/40 mx-auto mt-2"/>
                  </div>
                </div>
                {/* Bottom-right: tagline card */}
                <div className="bg-[#1a1a1a] relative overflow-hidden flex items-end p-4">
                  <div>
                    <p className="font-cinzel text-sm font-bold text-ivory/80 leading-tight">WHERE<br/>STYLE<br/>BECOMES<br/>STORY</p>
                  </div>
                </div>
              </div>

              {/* Gold border overlay */}
              <div className="absolute inset-0 border border-gold/15 pointer-events-none" />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 bg-jet border border-gold/30 p-6 shadow-2xl"
            >
              <p className="font-cinzel text-3xl font-bold gold-text">5+</p>
              <p className="font-montserrat text-xs tracking-widest text-ivory/50 uppercase mt-1">Years of<br/>Excellence</p>
            </motion.div>

            {/* Decorative corner lines */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-gold/40" />
            <div className="absolute -bottom-4 -right-16 w-8 h-8 border-b border-r border-gold/40" />
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionHeading
              eyebrow="Our Story"
              title="We Don't Just Create Visuals"
              className="mb-8"
            />

            <div className="space-y-5 font-montserrat text-ivory/60 font-light leading-relaxed">
              <p>
                House of Paradox is a luxury creative production studio born from a passion for storytelling that transcends the ordinary. Based in the heart of Mumbai, we are where style meets substance.
              </p>
              <p>
                We craft timeless stories that define brands, inspire audiences and leave a lasting impact. Our team of seasoned creatives, directors, and photographers bring an obsessive attention to detail and an unrelenting pursuit of excellence.
              </p>
              <p className="text-ivory/80 font-normal italic font-cinzel text-sm tracking-wide border-l-2 border-gold/40 pl-5">
                &ldquo;Every frame, every edit, every moment — a deliberate act of artistry.&rdquo;
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-px mt-12 bg-gold/10">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-jet p-6 group hover:bg-charcoal transition-colors duration-300">
                  <p className="font-cinzel text-3xl font-bold gold-text mb-1">{stat.value}</p>
                  <p className="font-montserrat text-xs tracking-[0.25em] uppercase text-ivory/40">{stat.label}</p>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ x: 6 }}
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-10 flex items-center gap-3 font-cinzel text-sm tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors duration-300"
            >
              Work With Us
              <span className="text-xl leading-none">→</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
