"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(centered && "text-center", className)}
    >
      {eyebrow && (
        <p className="font-montserrat text-xs tracking-[0.35em] text-gold uppercase mb-4 flex items-center gap-3">
          {centered ? (
            <>
              <span className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/40 max-w-[60px] ml-auto" />
              {eyebrow}
              <span className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/40 max-w-[60px] mr-auto" />
            </>
          ) : (
            <>
              <span className="inline-block w-8 h-px bg-gold" />
              {eyebrow}
            </>
          )}
        </p>
      )}
      <h2 className="font-cinzel font-bold text-3xl md:text-4xl lg:text-5xl gold-text leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 font-montserrat text-base md:text-lg text-ivory/60 font-light max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
