"use client";
import { motion, useReducedMotion } from "motion/react";

/* Route-change entrance — a weighted fade-rise so navigation keeps spatial
   continuity. Remounts per navigation (App Router template semantics). */

export default function Template({ children }) {
  const reduced = useReducedMotion();
  if (reduced) return children;
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 20,
        opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {children}
    </motion.div>
  );
}
