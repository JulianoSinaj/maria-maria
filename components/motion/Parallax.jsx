"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";

/* Scroll-linked parallax. Wrap the moving layer; it drifts by ±speed of its own
   height across the viewport, smoothed through a spring so motion has weight.
   For images inside overflow-hidden frames pass `overscan` to avoid gaps. */

export default function Parallax({ children, className = "", speed = 0.12, overscan = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  const y = useSpring(raw, { stiffness: 70, damping: 22, mass: 0.8 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full w-full will-transform"
        style={{ y, scale: overscan ? 1 + Math.abs(speed) * 2.2 : 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
