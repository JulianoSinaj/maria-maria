"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate, useReducedMotion } from "motion/react";

/* 3D tilt card — true perspective viewport, spring-damped rotation, and a
   soft champagne glare that tracks the pointer. Desktop pointer only. */

export default function TiltCard({ children, className = "", max = 6, glare = true, lift = true, radius = "rounded-card-lg" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const spring = { stiffness: 160, damping: 18, mass: 0.6 };
  const srx = useSpring(rx, spring);
  const sry = useSpring(ry, spring);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(255,246,220,0.28), transparent 62%)`;

  const onMove = (e) => {
    if (reduced || e.pointerType === "touch") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        whileHover={reduced || !lift ? undefined : { y: -6, scale: 1.012 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", willChange: "transform" }}
        className={`relative h-full ${radius}`}
      >
        {children}
        {glare && !reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}
