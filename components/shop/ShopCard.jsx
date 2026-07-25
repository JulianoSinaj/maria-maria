"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import Bottle from "@/components/Bottle";
import WinePhotos from "@/components/WinePhotos";
import { Arrow, Grapes } from "@/components/Icons";
import { fmtPrice, detailHref } from "@/components/data";
import AddToCart from "./AddToCart";
import { WINE_META } from "./shopData";

/* Shop product card — the boutique WineCard silhouette with real commerce:
   merchandising badge, scarcity note and the shared AddToCart control.

   The stage shows the real packshots (WinePhotos): a swipe or tap on the
   photo turns the bottle to its back label.

   Has the wine a live landing page, the whole card is a stretched link to it
   (via the name's ::after overlay); the cart control and the photo stage sit
   above on z-10, so add-to-cart and swiping never trigger navigation. */

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
      {wine.photos ? (
        <WinePhotos wine={wine} imgClass="h-44" className="pb-3" />
      ) : (
        <div className="relative flex flex-col items-center pb-5">
          <Bottle
            variant={wine.variant}
            className="h-44 will-transform transition-transform duration-500 ease-out-expo group-hover:-translate-y-2.5 group-hover:rotate-[-2deg]"
          />
          <span aria-hidden="true" className="mt-1 h-2 w-20" />
        </div>
      )}
    </div>
  );
}

export default function ShopCard({ wine, className = "" }) {
  const reduced = useReducedMotion();
  const meta = WINE_META[wine.name] || {};
  const detail = detailHref(wine);

  /* Hover-Sensorik auf dem stillstehenden Wrapper, der Lift auf der inneren
     Karte — dasselbe Muster wie WineCard: hebt die Karte selbst ab, wandert
     sie unter dem Cursor weg und enter/leave flattert an der Kante. */
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={`group relative h-full ${className}`}
    >
    <motion.article
      variants={reduced ? undefined : { rest: { y: 0 }, hover: { y: -6 } }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="relative flex h-full flex-col overflow-hidden rounded-card border border-stone/50 bg-gradient-to-b from-white/90 to-cream shadow-luxe transition-[box-shadow,border-color] duration-500 group-hover:border-champagne/70 group-hover:shadow-lift"
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
          <h3 className="font-playfair text-[17px] leading-snug text-charcoal">
            {detail ? (
              <Link
                href={detail}
                aria-label={`${wine.name} — Details ansehen`}
                className="outline-none transition-colors duration-300 after:absolute after:inset-0 hover:text-bordeaux"
              >
                {wine.name}
              </Link>
            ) : (
              wine.name
            )}
          </h3>
          <span className="shrink-0 text-[11px] tabular-nums text-charcoal/60">{wine.year}</span>
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal/65">{wine.notes}</p>
        {detail && (
          <p className="pointer-events-none mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-bordeaux/70 transition-colors duration-300 group-hover:text-bordeaux">
            Details ansehen
            <Arrow className="h-3 w-3 transition-transform duration-400 ease-out-expo group-hover:translate-x-0.5" />
          </p>
        )}
        {meta.edition && (
          <p className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-bordeaux/80">
            <Grapes className="h-3.5 w-3.5 text-champagne" />
            Limitierte Auflage · {meta.edition}
          </p>
        )}
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

          <AddToCart wine={wine} />
        </div>
      </div>
    </motion.article>
    </motion.div>
  );
}
