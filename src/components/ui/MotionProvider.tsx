"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

// LazyMotion + the light `m.*` elements ship only the animation features this
// site uses (less JavaScript than `motion.*`); `strict` throws if a heavy
// `motion.*` element sneaks back in. reducedMotion="user" honours the
// visitor's "reduce motion" OS setting.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
