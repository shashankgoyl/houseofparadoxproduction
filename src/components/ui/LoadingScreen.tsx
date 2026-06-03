"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsVisible(false), 400);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-jet flex flex-col items-center justify-center"
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 text-center"
          >
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <text x="4" y="62" fontFamily="Cinzel, serif" fontSize="68" fontWeight="700" fill="url(#goldGrad)" opacity="0.9">H</text>
                <text x="36" y="62" fontFamily="Cinzel, serif" fontSize="68" fontWeight="700" fill="url(#goldGrad)" opacity="0.9">P</text>
                {/* Shutter element */}
                <circle cx="40" cy="38" r="10" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.7"/>
                <line x1="8" y1="8" x2="72" y2="72" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.8"/>
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37"/>
                    <stop offset="50%" stopColor="#F2C667"/>
                    <stop offset="100%" stopColor="#D4AF37"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="font-cinzel text-xs tracking-[0.4em] text-gold-light uppercase opacity-80">
              House of Paradox
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-48"
          >
            <div className="h-px bg-charcoal relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold to-gold-light"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <p className="text-center mt-3 font-montserrat text-xs tracking-widest text-gold/50">
              {progress}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
