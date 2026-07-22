"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { useMagneticEnabled } from "./MagneticContext";

/* Magnetic hover — the element eases toward the cursor inside its bounds,
   the inner content travels a touch further for depth. Pointer-fine only.
   Goes inert (same markup, no tracking) when the route variant disables it. */

export default function Magnetic({ children, className = "", strength = 0.28, innerStrength = 1.35 }) {
  const ref = useRef(null);
  const enabled = useMagneticEnabled();
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 180, damping: 16, mass: 0.4 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const extra = innerStrength - 1;
  const ix = useSpring(useTransform(x, (v) => v * extra), { ...spring, stiffness: 130 });
  const iy = useSpring(useTransform(y, (v) => v * extra), { ...spring, stiffness: 130 });

  const onMove = (e) => {
    if (reduced || e.pointerType === "touch") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!enabled) {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-block will-transform ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div style={{ x: ix, y: iy }}>{children}</motion.div>
    </motion.div>
  );
}
