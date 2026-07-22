"use client";
import { motion, useReducedMotion } from "motion/react";

/* Scroll-reveal primitives — physics springs, subtle blur-in, viewport-once. */

const SPRING = { type: "spring", stiffness: 90, damping: 20, mass: 1 };

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  blur = true,
  once = true,
  amount = 0.25,
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      transition={{
        ...SPRING,
        delay,
        opacity: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = "", delay = 0, gap = 0.09, once = true, amount = 0.18 }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "0px 0px -6% 0px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", y = 26 }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { ...SPRING, opacity: { duration: 0.5 }, filter: { duration: 0.55 } },
          transitionEnd: { filter: "none" },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
