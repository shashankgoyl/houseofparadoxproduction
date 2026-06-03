"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const categories = ["All", "Photography", "Video", "Events", "Creative"];

const projects = [
  {
    id: 1,
    title: "Noir Editorial",
    category: "Photography",
    type: "Fashion Photography",
    aspect: "portrait",
    color: "#1a1209",
    accent: "#D4AF37",
    description: "High-fashion editorial for a luxury apparel brand",
  },
  {
    id: 2,
    title: "Brand Film",
    category: "Video",
    type: "Commercial",
    aspect: "landscape",
    color: "#0d1117",
    accent: "#F2C667",
    description: "60-second brand film for a fintech startup",
  },
  {
    id: 3,
    title: "Couture Launch",
    category: "Events",
    type: "Event Coverage",
    aspect: "portrait",
    color: "#111118",
    accent: "#D4AF37",
    description: "Delhi Fashion Week coverage",
  },
  {
    id: 4,
    title: "Product Series",
    category: "Photography",
    type: "E-commerce",
    aspect: "square",
    color: "#0f0f0f",
    accent: "#B8960C",
    description: "200-shot e-commerce series for luxury jewellery",
  },
  {
    id: 5,
    title: "Art Direction",
    category: "Creative",
    type: "Campaign",
    aspect: "landscape",
    color: "#13100a",
    accent: "#F2C667",
    description: "Complete visual identity campaign",
  },
  {
    id: 6,
    title: "Studio Sessions",
    category: "Photography",
    type: "Portrait",
    aspect: "portrait",
    color: "#0a0a12",
    accent: "#D4AF37",
    description: "Celebrity portrait series",
  },
];

// Placeholder visuals using SVG patterns
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden cursor-pointer group ${
        project.aspect === "landscape" ? "col-span-2" : "col-span-1"
      }`}
      style={{ aspectRatio: project.aspect === "landscape" ? "16/9" : project.aspect === "square" ? "1/1" : "3/4" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        style={{ background: project.color }}
      >
        {/* Abstract visual pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id={`grad-${project.id}`} cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor={project.accent} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={project.accent} stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="400" height="400" fill={`url(#grad-${project.id})`}/>
          {project.category === "Photography" && (
            <>
              <ellipse cx="200" cy="160" rx="70" ry="90" fill={project.accent} opacity="0.15"/>
              <path d="M100 320 Q160 250 200 230 Q240 250 300 320Z" fill={project.accent} opacity="0.1"/>
            </>
          )}
          {project.category === "Video" && (
            <>
              <polygon points="160,140 280,200 160,260" fill={project.accent} opacity="0.2"/>
              <circle cx="200" cy="200" r="80" fill="none" stroke={project.accent} strokeWidth="1" opacity="0.2"/>
            </>
          )}
          {project.category === "Events" && (
            <>
              <line x1="50" y1="50" x2="350" y2="350" stroke={project.accent} strokeWidth="1" opacity="0.15"/>
              <line x1="350" y1="50" x2="50" y2="350" stroke={project.accent} strokeWidth="1" opacity="0.15"/>
              <circle cx="200" cy="200" r="60" fill="none" stroke={project.accent} strokeWidth="1.5" opacity="0.25"/>
            </>
          )}
          {project.category === "Creative" && (
            <>
              <rect x="120" y="120" width="160" height="160" fill="none" stroke={project.accent} strokeWidth="1" opacity="0.2" transform="rotate(45 200 200)"/>
              <rect x="150" y="150" width="100" height="100" fill={project.accent} opacity="0.1" transform="rotate(20 200 200)"/>
            </>
          )}
        </svg>

        {/* Category label watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 select-none pointer-events-none">
          <p className="font-cinzel text-6xl md:text-8xl font-black text-ivory whitespace-nowrap">{project.type}</p>
        </div>
      </div>

      {/* Overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-jet/70"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Top badge */}
        <div className="flex justify-between items-start">
          <span className="inline-block border border-gold/30 bg-jet/60 px-3 py-1 font-montserrat text-[10px] tracking-[0.25em] uppercase text-gold/70">
            {project.type}
          </span>
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
            className="w-8 h-8 border border-gold/40 bg-jet/60 flex items-center justify-center"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 13L13 3M13 3H6M13 3v7"/>
            </svg>
          </motion.div>
        </div>

        {/* Bottom info */}
        <motion.div
          animate={{ y: hovered ? 0 : 12, opacity: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-montserrat text-xs tracking-widest uppercase text-gold/60 mb-1">{project.category}</p>
          <h3 className="font-cinzel text-xl md:text-2xl font-semibold text-ivory/90">{project.title}</h3>
          <motion.p
            animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
            className="font-montserrat text-sm text-ivory/50 mt-2 overflow-hidden"
          >
            {project.description}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function WorkSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="section-padding relative overflow-hidden bg-charcoal/30">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <SectionHeading
            eyebrow="Portfolio"
            title="Our Work"
            subtitle="A selection of projects that define our craft."
          />

          {/* Filter tabs */}
          <div className="flex gap-1 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 font-cinzel text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gold text-jet"
                    : "border border-gold/20 text-ivory/40 hover:border-gold/50 hover:text-gold/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <p className="font-montserrat text-sm text-ivory/40 mb-6 tracking-wide">
            Ready to create something extraordinary together?
          </p>
          <button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-gold px-12 py-4 font-cinzel text-sm tracking-[0.2em]"
          >
            Start A Project
          </button>
        </motion.div>
      </div>
    </section>
  );
}
