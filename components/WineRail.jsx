"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import WineCard from "./WineCard";
import { Arrow, ChevronRight } from "./Icons";

/* Single-card wine showcase (home page).
   One wine at a time on every viewport: filter pills (Alle / Rot / Weiß / Rosé)
   narrow the collection, paddles page through it with a directional spring
   slide. Paddles flank the card on sm+ and sit under it on phones; the active
   filter pill is a shared layout element that glides between buttons. */

const FILTERS = [
  { label: "Alle Weine", type: null },
  { label: "Rotweine", type: "Rotwein" },
  { label: "Weißweine", type: "Weißwein" },
  { label: "Rosé", type: "Roséwein" },
];

const spring = { type: "spring", stiffness: 260, damping: 30 };
const tapSpring = { type: "spring", stiffness: 400, damping: 22 };

export default function WineRail({ wines, className = "" }) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState(null);
  // index = position in the filtered list; dir = slide direction (1 next, -1 prev).
  const [[index, dir], setIndex] = useState([0, 0]);

  const list = filter ? wines.filter((w) => w.type === filter) : wines;
  const count = list.length;
  const active = list[Math.min(index, count - 1)];

  const go = (step) => setIndex(([i]) => [(i + step + count) % count, step]);
  const pick = (type) => {
    setFilter(type);
    setIndex([0, 0]);
  };

  const variants = {
    enter: (d) => ({ opacity: 0, x: reduced ? 0 : d * 72, scale: reduced ? 1 : 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: reduced ? 0 : d * -72, scale: reduced ? 1 : 0.97 }),
  };

  const paddle = (step, label, extra = "") => (
    <motion.button
      onClick={() => go(step)}
      aria-label={label}
      whileTap={{ scale: 0.9 }}
      transition={tapSpring}
      className={`h-11 w-11 items-center justify-center rounded-full border border-stone bg-white/70 text-charcoal/70 shadow-luxe transition-colors duration-300 hover:border-champagne hover:text-bordeaux ${extra}`}
    >
      <ChevronRight className={`h-4 w-4 ${step < 0 ? "rotate-180" : ""}`} />
    </motion.button>
  );

  return (
    <div className={className}>
      {/* ---- filter pills: edge-bleed swipe row on phones, plain row on sm+ ---- */}
      <div className="no-scrollbar -mx-6 overflow-x-auto px-6 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex w-max items-center gap-2 pb-1 sm:w-auto sm:flex-wrap sm:gap-2.5">
          {FILTERS.map((f) => {
            const on = filter === f.type;
            return (
              <motion.button
                key={f.label}
                onClick={() => pick(f.type)}
                aria-pressed={on}
                whileTap={{ scale: 0.96 }}
                transition={tapSpring}
                className={`relative h-10 shrink-0 rounded-full border px-5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                  on
                    ? "border-transparent text-ivory"
                    : "border-charcoal/20 bg-white/60 text-charcoal/70 hover:border-champagne hover:text-bordeaux"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="wine-filter-pill"
                    transition={reduced ? { duration: 0 } : spring}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-bordeaux to-wine shadow-chip"
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ---- single card with flanking paddles (sm+) ---- */}
      <div className="relative mx-auto mt-8 w-full max-w-[340px] sm:mt-10">
        {paddle(-1, "Vorheriger Wein", "absolute -left-16 top-1/2 z-10 hidden -translate-y-1/2 sm:flex lg:-left-20")}
        {paddle(1, "Nächster Wein", "absolute -right-16 top-1/2 z-10 hidden -translate-y-1/2 sm:flex lg:-right-20")}

        {/* grid-stack: entering and exiting card share the cell, so the
            section never jumps in height mid-transition */}
        <div className="grid">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={`${filter ?? "alle"}-${active.slug}`}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={spring}
              className="col-start-1 row-start-1 will-transform"
            >
              <WineCard wine={active} className="w-full" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ---- counter, plus the paddles on phones ---- */}
      <div className="mt-7 flex items-center justify-center gap-6">
        <span className="sm:hidden">{paddle(-1, "Vorheriger Wein", "flex")}</span>
        <p aria-live="polite" className="text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
          <span className="font-semibold tabular-nums text-bordeaux">{String(index + 1).padStart(2, "0")}</span>
          <span className="mx-1.5">/</span>
          <span className="tabular-nums">{String(count).padStart(2, "0")}</span>
        </p>
        <span className="sm:hidden">{paddle(1, "Nächster Wein", "flex")}</span>
      </div>

      <div className="mt-5 text-center">
        <Link
          href="/weine"
          className="group inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.16em] text-bordeaux"
        >
          Die ganze Kollektion
          <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
