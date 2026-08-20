"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ShopCard from "./ShopCard";
import { useCommon, useWines } from "@/lib/i18n/context";
import { pluralUnit } from "@/lib/i18n/format";

/* Maria Maria Selection — die ganze Selection in einem layout-animierten Grid. */

const GRID_SPRING = { type: "spring", stiffness: 300, damping: 30 };

export default function ShopExplorer() {
  const reduced = useReducedMotion();
  const wines = useWines();
  const catalogue = useCommon("catalogue");
  const ui = useCommon("ui");

  const itemMotion = reduced
    ? {}
    : {
        layout: true,
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
        transition: { ...GRID_SPRING, opacity: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
      };

  return (
    <div>
      {/* ---- live count ---- */}
      <div className="flex justify-end">
        <div className="text-right">
          <p aria-live="polite" className="text-[11px] uppercase tracking-[0.18em] text-charcoal/55">
            <span className="mr-1.5 font-playfair text-[24px] normal-case tabular-nums tracking-normal text-bordeaux">
              {wines.length}
            </span>
            {pluralUnit(catalogue.filters, wines.length)}
          </p>
          <p className="mt-1 flex h-4 items-center justify-end text-[10.5px] text-charcoal/45">
            {ui.priceNote}
          </p>
        </div>
      </div>

      {/* ---- layout-animated grid ---- */}
      {/* Kein Karten-Raster: die Einträge schweben frei, Reihen werden nur
          durch Haarlinien getrennt — dieselbe Rhythmik wie auf /weine. */}
      <div className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
        <AnimatePresence mode="popLayout" initial={false}>
          {wines.map((w) => (
            <motion.div
              key={w.name}
              {...itemMotion}
              className="h-full border-t border-transparent pb-6 pt-8 [&:nth-child(n+2)]:border-charcoal/10 sm:[&:nth-child(2)]:border-transparent lg:[&:nth-child(3)]:border-transparent"
            >
              <ShopCard wine={w} className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
