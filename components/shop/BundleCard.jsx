"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Bottle from "@/components/Bottle";
import Button from "@/components/ui/Button";
import TiltCard from "@/components/motion/TiltCard";
import { Check } from "@/components/Icons";
import { fmtPrice } from "@/components/data";
import { useCart } from "./CartContext";
import { bundleWines, bundleSum, bundleSaving } from "./shopData";

/* Probierpaket card — a fanned bottle still that spreads on hover, the
   contents as a checked list, and a bundle price with visible savings.
   The featured package carries a champagne ribbon. */

const FAN = {
  3: ["-rotate-[9deg] -mr-5 group-hover:-rotate-[13deg] group-hover:-translate-x-1.5", "z-10", "rotate-[9deg] -ml-5 group-hover:rotate-[13deg] group-hover:translate-x-1.5"],
  6: [
    "-rotate-[14deg] -mr-7 group-hover:-rotate-[18deg] group-hover:-translate-x-2",
    "-rotate-[7deg] -mr-7 z-[5] group-hover:-rotate-[10deg] group-hover:-translate-x-1",
    "z-10",
    "z-10 -ml-2",
    "rotate-[7deg] -ml-7 z-[5] group-hover:rotate-[10deg] group-hover:translate-x-1",
    "rotate-[14deg] -ml-7 group-hover:rotate-[18deg] group-hover:translate-x-2",
  ],
};

export default function BundleCard({ bundle, className = "" }) {
  const reduced = useReducedMotion();
  const { add, openCart } = useCart();
  const wines = bundleWines(bundle);
  const sum = bundleSum(bundle);
  const saving = bundleSaving(bundle);
  const fan = FAN[wines.length] || FAN[3];
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onAdd = () => {
    add(bundle.id);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <TiltCard className={`group h-full ${className}`} max={4} radius="rounded-card-lg">
      <article
        className={`ring-hairline relative flex h-full flex-col overflow-hidden rounded-card-lg border bg-white/70 shadow-luxe transition-[box-shadow,border-color] duration-500 group-hover:shadow-lift ${
          bundle.featured
            ? "border-champagne/80 group-hover:border-champagne"
            : "border-stone/40 group-hover:border-champagne/60"
        }`}
      >
        {bundle.featured && (
          <span className="pointer-events-none absolute right-4 top-4 z-10 rounded-full bg-gradient-to-br from-champagne to-champagne-light px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal shadow-chip">
            {bundle.tag}
          </span>
        )}

        {/* fanned bottles */}
        <div className="relative flex h-56 items-end justify-center overflow-hidden bg-gradient-to-b from-cream to-champagne-light/20 pt-6">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(closest-side, rgba(200,183,122,0.36), rgba(200,183,122,0.1) 55%, transparent 75%)" }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 select-none whitespace-nowrap font-playfair text-[3.4rem] italic leading-none text-bordeaux/[0.07]"
          >
            {bundle.name}
          </span>
          <div className="relative flex items-end pb-6">
            {wines.map((w, i) => (
              <Bottle
                key={w.name}
                variant={w.variant}
                className={`${wines.length > 3 ? "h-32" : "h-40"} origin-bottom will-transform transition-transform duration-500 ease-out-expo ${fan[i] || ""}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col border-t border-stone/40 px-6 pb-6 pt-5">
          {!bundle.featured && (
            <p className="text-[10px] uppercase tracking-[0.22em] text-champagne">{bundle.tag}</p>
          )}
          <h3 className={`font-playfair text-[22px] text-charcoal ${bundle.featured ? "" : "mt-1.5"}`}>
            {bundle.name}
            <span className="ml-2 align-middle font-montserrat text-[11px] uppercase tracking-[0.14em] text-charcoal/50">
              {wines.length} Flaschen
            </span>
          </h3>
          <p className="mt-2 text-[12.5px] leading-relaxed text-charcoal/65">{bundle.desc}</p>

          <ul className="mt-4 space-y-1.5">
            {wines.map((w) => (
              <li key={w.name} className="flex items-center gap-2 text-[12px] text-charcoal/75">
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: w.dot }} />
                {w.name}
                <span className="ml-auto tabular-nums text-charcoal/45">{w.year}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-5">
            <div className="flex items-end justify-between border-t border-dashed border-stone/60 pt-4">
              <div>
                <p className="text-[11px] text-charcoal/50">
                  Einzeln <span className="tabular-nums line-through">{fmtPrice(sum)}</span>
                </p>
                <p className="mt-0.5 font-playfair text-[26px] leading-none text-bordeaux">
                  {fmtPrice(bundle.price)}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-champagne/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-bordeaux">
                Sie sparen {fmtPrice(saving)}
              </span>
            </div>
            <div className="mt-5">
              <Button
                onClick={onAdd}
                variant={bundle.featured ? "primary" : "dark"}
                className="w-full"
                iconType={added ? "none" : "arrow"}
                magnetic={false}
              >
                {added ? (
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4" /> Hinzugefügt
                  </span>
                ) : (
                  "Paket in den Warenkorb"
                )}
              </Button>
              {/* fixed-height slot so the confirmation link never shifts layout */}
              <div className="mt-2 flex h-7 items-center justify-center">
                {added && (
                  <motion.button
                    type="button"
                    onClick={openCart}
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 22 }}
                    className="text-[11.5px] font-medium text-bordeaux underline-offset-4 hover:underline"
                  >
                    Warenkorb ansehen
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
