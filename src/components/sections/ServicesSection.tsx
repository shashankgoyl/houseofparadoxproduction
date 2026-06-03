"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="2" y="6" width="20" height="14" rx="2"/>
        <circle cx="12" cy="13" r="4"/>
        <circle cx="12" cy="13" r="1.5" fill="currentColor" stroke="none"/>
        <path d="M7 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/>
      </svg>
    ),
    title: "Photography",
    subtitle: "Fashion, E-commerce, Editorial, Product & Portfolio Shoots",
    description:
      "We capture the essence of your brand through meticulously crafted imagery. From high-fashion editorials to commercial product photography, every frame tells your story.",
    tags: ["Fashion", "Editorial", "Commercial", "Portrait"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="2" y="7" width="14" height="11" rx="2"/>
        <path d="m16 11 5-3v8l-5-3V11Z"/>
      </svg>
    ),
    title: "Video Production",
    subtitle: "Brand Films, Commercials, Reels, Product & Music Videos",
    description:
      "Cinematic storytelling that moves audiences. We produce compelling video content — from concept to colour grade — that elevates your brand in motion.",
    tags: ["Brand Films", "Commercials", "Reels", "Music Video"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
        <path d="M19 10a7 7 0 0 1-14 0"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="8" y1="22" x2="16" y2="22"/>
      </svg>
    ),
    title: "Podcast Production",
    subtitle: "Podcast Recording, Editing, Studio Setup & Social Clips",
    description:
      "Full-service podcast production that makes your voice heard. Professional studio setup, expert editing, and strategic social content to grow your audience.",
    tags: ["Recording", "Editing", "Studio", "Social Clips"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M9 14h1l1 2 2-4 1 2h1"/>
      </svg>
    ),
    title: "Event Coverage",
    subtitle: "Fashion Shows, Launches, Corporate & Live Events",
    description:
      "We document your most important moments with precision and artistry. From intimate brand launches to large-scale fashion shows, no detail escapes our lens.",
    tags: ["Fashion Shows", "Launches", "Corporate", "Live Events"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: "Creative Direction",
    subtitle: "Concept Development, Art Direction, Styling & Production Management",
    description:
      "Our creative direction transforms ideas into cohesive visual narratives. We handle concept development, art direction, and complete production management.",
    tags: ["Concept", "Art Direction", "Styling", "Production"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 19l7-7 3 3-7 7-3-3z"/>
        <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
        <path d="m2 2 7.586 7.586"/>
        <circle cx="11" cy="11" r="2"/>
      </svg>
    ),
    title: "Content Creation",
    subtitle: "Social Media Content, Reels, UGC & Campaigns",
    description:
      "Strategic content that stops the scroll. We create platform-native content designed to engage, convert, and build lasting connections with your audience.",
    tags: ["Social Media", "Reels", "UGC", "Campaigns"],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function ServicesSection() {
  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <SectionHeading
            eyebrow="What We Do"
            title={"Our\nServices"}
            subtitle="Six disciplines. One singular vision. We craft experiences that transcend the ordinary."
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-montserrat text-sm text-ivory/40 tracking-wide max-w-xs md:text-right"
          >
            Every service is delivered with the same obsessive attention to quality and detail.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              className="group relative bg-jet p-8 lg:p-10 overflow-hidden cursor-default"
              data-cursor="hover"
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Number */}
              <span className="absolute top-6 right-8 font-cinzel text-5xl font-bold text-gold/5 group-hover:text-gold/10 transition-colors duration-500 select-none">
                0{index + 1}
              </span>

              {/* Icon */}
              <div className="relative z-10 w-14 h-14 flex items-center justify-center border border-gold/20 group-hover:border-gold/50 transition-colors duration-400 mb-6">
                <span className="text-gold/60 group-hover:text-gold transition-colors duration-300">
                  {service.icon}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="font-cinzel font-semibold text-xl text-ivory/90 group-hover:gold-text transition-all duration-300 mb-2 tracking-wide">
                  {service.title}
                </h3>
                <p className="font-montserrat text-xs text-gold/60 tracking-wide mb-4 uppercase">
                  {service.subtitle}
                </p>
                <p className="font-montserrat text-sm text-ivory/50 leading-relaxed font-light mb-6">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-montserrat tracking-[0.2em] uppercase border border-gold/15 group-hover:border-gold/30 px-3 py-1 text-ivory/40 group-hover:text-gold/60 transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom line */}
              <div className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
