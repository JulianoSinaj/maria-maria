"use client";
import { motion, useReducedMotion } from "motion/react";
import { CATEGORIES } from "@/lib/inventory/schema";

/* Category tabs. The active indicator is one shared layoutId element that
   springs between tabs — same treatment as the sidebar rail, so selection
   reads consistently across the admin.

   Counts come from the list response's meta, so a badge can never disagree
   with the rows the tab actually shows. */

export default function CategoryTabs({ value, onChange, counts = {} }) {
  const reduced = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Weinkategorien"
      className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
    >
      {CATEGORIES.map((cat) => {
        const active = value === cat.key;
        const count = counts[cat.key];
        return (
          <button
            key={cat.key}
            role="tab"
            type="button"
            aria-selected={active}
            title={cat.hint}
            onClick={() => onChange(cat.key)}
            className={`group relative shrink-0 rounded-full px-4 py-2.5 text-left transition-colors duration-300 ${
              active ? "text-ivory" : "text-charcoal/60 hover:text-bordeaux"
            }`}
          >
            {active && (
              <motion.span
                layoutId="portfolio-tab-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-bordeaux to-wine"
                transition={
                  reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32 }
                }
              />
            )}
            {!active && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-charcoal/12 transition-colors duration-300 group-hover:border-champagne"
              />
            )}
            <span className="relative z-10 flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-[12.5px] font-medium tracking-[0.02em]">{cat.label}</span>
              {count != null && (
                <span
                  className={`text-[10.5px] tabular-nums ${
                    active ? "text-ivory/65" : "text-charcoal/35"
                  }`}
                >
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
