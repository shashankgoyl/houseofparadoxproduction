"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const testimonials = [
  {
    quote:
      "House of Paradox elevated our brand to an entirely new level. Their attention to detail and artistic vision is unmatched. Every frame they delivered was pure art.",
    name: "Priya Sharma",
    role: "Creative Director, Aura Couture",
    initials: "PS",
  },
  {
    quote:
      "Working with HoP on our brand film was a transformative experience. They didn't just produce content — they told our story with a depth and elegance we never imagined possible.",
    name: "Rohan Mehta",
    role: "Founder, Ziro Digital",
    initials: "RM",
  },
  {
    quote:
      "From concept to final delivery, the professionalism and creative direction from House of Paradox was extraordinary. Our event coverage exceeded every expectation.",
    name: "Nisha Kapoor",
    role: "Marketing Head, Lumière India",
    initials: "NK",
  },
  {
    quote:
      "The podcast production quality from House of Paradox is world-class. Our listenership doubled within two months of the rebrand. Worth every rupee.",
    name: "Arjun Bose",
    role: "Podcast Host, The Growth Lab",
    initials: "AB",
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-padding relative overflow-hidden bg-charcoal/20">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #D4AF37, transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto px-6 text-center">
        <SectionHeading
          eyebrow="Client Love"
          title="What They Say"
          centered
          className="mb-16"
        />

        {/* Testimonial card */}
        <div className="relative min-h-[280px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mx-auto"
            >
              {/* Quote mark */}
              <div className="font-cinzel text-8xl text-gold/15 leading-none select-none mb-4">&ldquo;</div>

              <p className="font-montserrat text-lg md:text-xl text-ivory/80 font-light leading-relaxed italic mb-8">
                {testimonials[active].quote}
              </p>

              {/* Author */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-gold/40 bg-charcoal flex items-center justify-center">
                  <span className="font-cinzel text-sm font-bold gold-text">{testimonials[active].initials}</span>
                </div>
                <div>
                  <p className="font-cinzel text-sm font-semibold text-ivory/80 tracking-wider">
                    {testimonials[active].name}
                  </p>
                  <p className="font-montserrat text-xs tracking-widest text-gold/50 uppercase mt-1">
                    {testimonials[active].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all duration-300 ${
                i === active ? "w-8 h-1 bg-gold" : "w-2 h-1 bg-gold/30 hover:bg-gold/60"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
