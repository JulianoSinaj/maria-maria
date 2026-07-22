"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import Bottle from "./Bottle";
import { Arrow } from "./Icons";
import { fmtPrice } from "./data";

/* E-commerce product card. Two variants:
   - "default": vertical boutique card — glowing stage, lifting bottle,
     region chip, price row with circular CTA.
   - "mini": compact horizontal card for carousels and region rails. */

function Stage({ wine, className = "", bottleClass = "h-40" }) {
  return (
    <div className={`relative flex items-end justify-center overflow-hidden ${className}`}>
      {/* champagne glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(closest-side, rgba(200,183,122,0.32), rgba(200,183,122,0.08) 55%, transparent 75%)" }}
      />
      {/* ghost region monogram */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] select-none font-playfair text-[7.5rem] italic leading-none text-bordeaux/[0.06]"
      >
        {wine.region.charAt(0)}
      </span>
      {/* bottle + settling shadow */}
      <div className="relative flex flex-col items-center pb-5">
        <Bottle
          variant={wine.variant}
          className={`${bottleClass} will-transform transition-transform duration-500 ease-out-expo group-hover:-translate-y-2.5 group-hover:rotate-[-2deg]`}
        />
        <span
          aria-hidden="true"
          className="mt-1 h-2 w-20 rounded-full bg-charcoal/20 blur-[5px] transition-all duration-500 ease-out-expo group-hover:scale-x-75 group-hover:opacity-60"
        />
      </div>
    </div>
  );
}

export default function WineCard({ wine, variant = "default", className = "", href = "#" }) {
  const reduced = useReducedMotion();
  const lift = reduced ? {} : { whileHover: { y: -6 }, transition: { type: "spring", stiffness: 260, damping: 24 } };

  if (variant === "mini") {
    return (
      <motion.article
        {...lift}
        className={`group relative flex flex-col overflow-hidden rounded-card border border-stone/50 bg-gradient-to-b from-white/90 to-cream shadow-luxe transition-[box-shadow,border-color] duration-500 hover:border-champagne/70 hover:shadow-lift ${className || "w-[228px] shrink-0 snap-start"}`}
      >
        <Stage wine={wine} className="h-40 pt-4" bottleClass="h-32" />
        <div className="flex flex-1 flex-col px-4 pb-4">
          <h3 className="font-playfair text-[15px] leading-snug text-charcoal">
            <Link href={href} className="outline-none after:absolute after:inset-0" aria-label={`${wine.name} — Details ansehen`}>
              {wine.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.14em] text-charcoal/70">{wine.region}</p>
          <div className="mt-2.5 flex items-center justify-between">
            <p className="text-[14px] font-semibold tabular-nums text-charcoal">{fmtPrice(wine.price)}</p>
            <span className="pointer-events-none flex h-8 w-8 items-center justify-center rounded-full bg-bordeaux text-ivory transition-all duration-400 ease-out-expo group-hover:bg-bordeaux-deep">
              <Arrow className="h-3.5 w-3.5 transition-transform duration-400 ease-out-expo group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      {...lift}
      className={`group relative flex flex-col overflow-hidden rounded-card border border-stone/50 bg-gradient-to-b from-white/90 to-cream shadow-luxe transition-[box-shadow,border-color] duration-500 hover:border-champagne/70 hover:shadow-lift ${className}`}
    >
      {/* region chip */}
      <span className="glass pointer-events-none absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
        {wine.region}
      </span>

      <Stage wine={wine} className="h-56 pt-6" bottleClass="h-44" />

      <div className="flex flex-1 flex-col border-t border-stone/40 px-5 pb-5 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-playfair text-[17px] leading-snug text-charcoal">
            <Link href={href} className="outline-none after:absolute after:inset-0" aria-label={`${wine.name} — Details ansehen`}>
              {wine.name}
            </Link>
          </h3>
          <span className="shrink-0 text-[11px] tabular-nums text-charcoal/60">{wine.year}</span>
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal/65">{wine.notes}</p>
        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-charcoal/60">
          <span className="inline-block h-2 w-2 rounded-full ring-1 ring-black/10" style={{ background: wine.dot }} />
          {wine.type} · Trocken
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-dashed border-stone/60 pt-4">
          <p className="text-[16px] font-semibold tabular-nums text-charcoal">
            {fmtPrice(wine.price)}
            <span className="ml-1.5 text-[10px] font-normal text-charcoal/60">/ 0,75 l</span>
          </p>
          <span className="pointer-events-none relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bordeaux text-ivory shadow-chip transition-all duration-400 ease-out-expo group-hover:scale-105 group-hover:bg-bordeaux-deep">
            <Arrow className="h-4 w-4 transition-transform duration-400 ease-out-expo group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
