"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GoldRule } from "@/components/Deco";

/* Sidebar filter card — chip groups with a spring-animated active pill that
   glides between selections (shared layoutId). Filtering is visual only. */

function ChipGroup({ label, options, active, onSelect, layoutId }) {
  return (
    <div role="group" aria-label={`Nach ${label} filtern`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === active;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              aria-pressed={isActive}
              className={`relative inline-flex h-10 select-none items-center rounded-full border px-4 text-[11px] font-medium tracking-[0.06em] transition-colors duration-300 after:absolute after:-inset-[3px] after:rounded-full after:content-[''] ${
                isActive
                  ? "border-transparent text-ivory"
                  : "border-stone/80 bg-white/60 text-charcoal/70 hover:border-champagne hover:text-bordeaux"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-bordeaux shadow-chip"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FilterPanel({ categories = [], durations = [] }) {
  const [kategorie, setKategorie] = useState(categories[0]);
  const [lesedauer, setLesedauer] = useState(durations[0]);

  return (
    <div className="rounded-card-lg border border-stone/50 bg-gradient-to-b from-white/90 to-cream p-6 shadow-luxe">
      <h2 className="font-playfair text-[19px] text-charcoal">Themen &amp; Filter</h2>
      <GoldRule className="mt-3 w-full" />

      <div className="mt-6 space-y-6">
        <ChipGroup
          label="Kategorie"
          options={categories}
          active={kategorie}
          onSelect={setKategorie}
          layoutId="magazin-filter-kategorie"
        />
        <ChipGroup
          label="Lesedauer"
          options={durations}
          active={lesedauer}
          onSelect={setLesedauer}
          layoutId="magazin-filter-lesedauer"
        />
      </div>

      <p className="mt-6 border-t border-stone/50 pt-4 text-[11px] leading-relaxed text-charcoal/55" aria-live="polite">
        Aktive Auswahl: <span className="font-medium text-bordeaux">{kategorie}</span>
        {" · "}
        <span className="font-medium text-bordeaux">{lesedauer}</span>
      </p>
    </div>
  );
}
