"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import WineCard from "./WineCard";
import { ChevronRight } from "./Icons";

/* Paged carousel of product cards — exactly PER_PAGE cards per page.
   Paddles swap the whole visible set for the next/previous page,
   sliding the group in with a physics-driven spring. */

const PER_PAGE = 5;

export default function WineRail({ wines, className = "" }) {
  const reduced = useReducedMotion();
  const pageCount = Math.max(1, Math.ceil(wines.length / PER_PAGE));
  // page = current index; dir tracks slide direction (1 = next, -1 = prev).
  const [[page, dir], setPage] = useState([0, 0]);

  const go = (step) => {
    setPage(([p]) => [(p + step + pageCount) % pageCount, step]);
  };

  const start = page * PER_PAGE;
  const current = wines.slice(start, start + PER_PAGE);

  const spring = { type: "spring", stiffness: 260, damping: 30 };
  const variants = {
    enter: (d) => ({ opacity: 0, x: reduced ? 0 : d * 64 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: reduced ? 0 : d * -64 }),
  };

  const paddle = (step, label) => (
    <button
      onClick={() => go(step)}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-stone bg-white/70 text-charcoal/70 shadow-luxe transition-all duration-300 hover:border-champagne hover:text-bordeaux active:scale-95"
    >
      <ChevronRight className={`h-4 w-4 ${step < 0 ? "rotate-180" : ""}`} />
    </button>
  );

  return (
    <div className={className}>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={page}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className="grid grid-cols-1 gap-5 pb-4 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          >
            {current.map((w) => (
              <WineCard key={w.name} wine={w} variant="mini" className="w-full" />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-2 flex items-center justify-end gap-3">
        {paddle(-1, "Vorherige Weine")}
        {paddle(1, "Nächste Weine")}
      </div>
    </div>
  );
}
