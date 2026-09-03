"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/* Shared frame for the hero metrics. One card = one story, so the header slot
   (eyebrow + title + trailing aside) is fixed and the body is free-form.

   `tall` lets a card span two rows on wide screens without the caller having
   to know the grid. */

export function MetricCard({ eyebrow, title, aside, children, delay = 0, className = "" }) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 24, delay: reduced ? 0 : delay }}
      className={`group relative flex flex-col overflow-hidden rounded-card-lg border border-a-ink/[0.08] bg-a-surface/70 p-6 sm:p-7 ${className}`}
    >
      {/* champagne hairline wipes in on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-champagne to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
      />
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
            {eyebrow}
          </p>
          <h3 className="mt-1.5 font-playfair text-[19px] leading-tight text-a-ink">{title}</h3>
        </div>
        {aside && <div className="shrink-0 text-right">{aside}</div>}
      </header>
      <div className="mt-6 flex flex-1 flex-col">{children}</div>
    </motion.section>
  );
}

/* Counter that springs from 0 to `value` once scrolled into view. Writes
   through a ref instead of React state so each frame costs one text-node
   update rather than a re-render. */

export function Counter({ value, format = (n) => Math.round(n).toLocaleString("de-DE"), className = "" }) {
  const ref = useRef(null);
  const nodeRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18, mass: 0.9 });

  useEffect(() => {
    if (inView && !reduced) mv.set(value);
  }, [inView, reduced, mv, value]);

  /* A spring only approaches its target asymptotically, so the last frame can
     land a hair short and render a wrong total (e.g. 301.737 for 301.745).
     Snap to the exact value once the animation completes. */
  useEffect(() => {
    if (reduced) return;
    const unChange = spring.on("change", (v) => {
      if (nodeRef.current) nodeRef.current.textContent = format(v);
    });
    const unDone = spring.on("animationComplete", () => {
      if (nodeRef.current) nodeRef.current.textContent = format(value);
    });
    return () => {
      unChange();
      unDone();
    };
  }, [spring, format, reduced, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      <span ref={nodeRef}>{reduced ? format(value) : format(0)}</span>
    </span>
  );
}

/* Horizontal meter. `tone` is a raw colour so a series can carry the wine's
   own accent rather than a palette index. */

export function Meter({ value, tone = "#6B0F1A", delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  const pct = Math.max(0, Math.min(1, value)) * 100;

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`block h-1.5 overflow-hidden rounded-full bg-a-ink/[0.07] ${className}`}
    >
      {/* the outer span owns the width, the inner owns the transform — so the
          fill animates on the GPU and the track never reflows mid-transition */}
      <span className="block h-full" style={{ width: `${pct}%` }}>
        <motion.span
          className="block h-full rounded-full will-transform"
          style={{ background: tone, transformOrigin: "left" }}
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: inView || reduced ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 20, delay: reduced ? 0 : delay }}
        />
      </span>
    </span>
  );
}
