"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Bottle from "@/components/Bottle";
import { Cart, Plus } from "@/components/Icons";
import { Minus } from "./ShopIcons";
import { fmtPrice } from "@/components/data";
import { useCart } from "./CartContext";
import { WINE_META, wineId } from "./shopData";

/* Shop product card — the boutique WineCard silhouette with real commerce:
   merchandising badge, scarcity note and an add-to-cart control that morphs
   into a quantity stepper. The control lives in a fixed-size slot, so the
   morph never shifts layout. */

const SPRING = { type: "spring", stiffness: 320, damping: 24 };

function Stage({ wine }) {
  return (
    <div className="relative flex h-56 items-end justify-center overflow-hidden pt-6">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(closest-side, rgba(200,183,122,0.32), rgba(200,183,122,0.08) 55%, transparent 75%)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] select-none font-playfair text-[7.5rem] italic leading-none text-bordeaux/[0.06]"
      >
        {wine.region.charAt(0)}
      </span>
      <div className="relative flex flex-col items-center pb-5">
        <Bottle
          variant={wine.variant}
          className="h-44 will-transform transition-transform duration-500 ease-out-expo group-hover:-translate-y-2.5 group-hover:rotate-[-2deg]"
        />
        <span
          aria-hidden="true"
          className="mt-1 h-2 w-20 rounded-full bg-charcoal/20 blur-[5px] transition-all duration-500 ease-out-expo group-hover:scale-x-75 group-hover:opacity-60"
        />
      </div>
    </div>
  );
}

export default function ShopCard({ wine, className = "" }) {
  const reduced = useReducedMotion();
  const { add, decrement, qtyOf } = useCart();
  const id = wineId(wine);
  const qty = qtyOf(id);
  const meta = WINE_META[wine.name] || {};
  const lift = reduced ? {} : { whileHover: { y: -6 }, transition: { type: "spring", stiffness: 260, damping: 24 } };

  return (
    <motion.article
      {...lift}
      className={`group relative flex flex-col overflow-hidden rounded-card border border-stone/50 bg-gradient-to-b from-white/90 to-cream shadow-luxe transition-[box-shadow,border-color] duration-500 hover:border-champagne/70 hover:shadow-lift ${className}`}
    >
      <span className="glass pointer-events-none absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
        {wine.region}
      </span>
      {meta.badge && (
        <span className="pointer-events-none absolute right-4 top-4 z-10 rounded-full bg-gradient-to-br from-bordeaux to-wine px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-ivory shadow-chip">
          {meta.badge}
        </span>
      )}

      <Stage wine={wine} />

      <div className="flex flex-1 flex-col border-t border-stone/40 px-5 pb-5 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-playfair text-[17px] leading-snug text-charcoal">{wine.name}</h3>
          <span className="shrink-0 text-[11px] tabular-nums text-charcoal/60">{wine.year}</span>
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal/65">{wine.notes}</p>
        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-charcoal/60">
          <span className="inline-block h-2 w-2 rounded-full ring-1 ring-black/10" style={{ background: wine.dot }} />
          {wine.type} · Trocken
          {meta.scarce && (
            <span className="ml-auto inline-flex items-center gap-1.5 font-medium text-bordeaux/80">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-champagne opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-champagne" />
              </span>
              Nur noch wenige Flaschen
            </span>
          )}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-stone/60 pt-4">
          <p className="text-[16px] font-semibold tabular-nums text-charcoal">
            {fmtPrice(wine.price)}
            <span className="ml-1.5 text-[10px] font-normal text-charcoal/60">/ 0,75 l</span>
          </p>

          {/* fixed-size slot: circular add button ⇄ quantity stepper */}
          <div className="relative h-11 w-[118px] shrink-0">
            <AnimatePresence initial={false}>
              {qty === 0 ? (
                <motion.button
                  key="add"
                  type="button"
                  onClick={() => add(id)}
                  aria-label={`${wine.name} in den Warenkorb legen`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={SPRING}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-bordeaux text-ivory shadow-chip transition-colors duration-300 hover:bg-bordeaux-deep"
                >
                  <Cart className="h-[18px] w-[18px]" />
                </motion.button>
              ) : (
                <motion.div
                  key="stepper"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={SPRING}
                  className="absolute inset-0 flex items-center justify-between rounded-full bg-bordeaux px-1 text-ivory shadow-chip"
                >
                  <motion.button
                    type="button"
                    onClick={() => decrement(id)}
                    aria-label={`Eine Flasche ${wine.name} entfernen`}
                    whileTap={{ scale: 0.85 }}
                    transition={SPRING}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 hover:bg-white/10"
                  >
                    <Minus className="h-4 w-4" />
                  </motion.button>
                  <motion.span
                    key={qty}
                    initial={reduced ? false : { y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={SPRING}
                    aria-live="polite"
                    className="text-[13px] font-semibold tabular-nums"
                  >
                    {qty}
                  </motion.span>
                  <motion.button
                    type="button"
                    onClick={() => add(id)}
                    aria-label={`Eine weitere Flasche ${wine.name} hinzufügen`}
                    whileTap={{ scale: 0.85 }}
                    transition={SPRING}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
