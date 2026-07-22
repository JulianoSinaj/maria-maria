"use client";
import { motion, useReducedMotion } from "motion/react";
import Parallax from "../motion/Parallax";
import Bottle from "../Bottle";
import { byName, fmtPrice } from "../data";
import { Star } from "../Icons";

/* Hero composition — arched photo frame with parallax, a floating glass
   product teaser and the slowly turning 250-years seal. */

export default function HeroVisual() {
  const reduced = useReducedMotion();
  const featured = byName("Primitivo Salento IGP");

  const float = (delay = 0, dist = 10) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -dist, 0] },
          transition: { duration: 6.5, delay, repeat: Infinity, ease: "easeInOut" },
        };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[440px]"
      initial={reduced ? false : { opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 20, delay: 0.25 }}
    >
      {/* offset hairline arch */}
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-t-[240px] rounded-b-[2.4rem] border border-champagne/50"
      />
      {/* arched photo frame */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[220px] rounded-b-[2rem] shadow-lift">
        <Parallax speed={0.09} overscan className="h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/hero.jpg"
            alt="Weingläser im Abendlicht über den Hügeln Italiens"
            className="h-full w-full object-cover"
          />
        </Parallax>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/25 via-transparent to-transparent"
        />
      </div>

      {/* floating product teaser */}
      <motion.div {...float(0.4)} className="absolute -left-6 bottom-12 sm:-left-14">
        <div className="glass flex w-[230px] items-center gap-3.5 rounded-card p-4 shadow-glass">
          <Bottle variant={featured.variant} className="h-[74px]" />
          <div className="min-w-0">
            <div className="flex items-center gap-0.5 text-champagne" role="img" aria-label="5 von 5 Sternen">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3" />
              ))}
            </div>
            <p className="mt-1 truncate font-playfair text-[13.5px] leading-tight text-charcoal">{featured.name}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-charcoal/50">{featured.region}</p>
            <p className="mt-1 text-[13px] font-semibold tabular-nums text-bordeaux">{fmtPrice(featured.price)}</p>
          </div>
        </div>
      </motion.div>

      {/* turning anniversary seal */}
      <motion.div {...float(1.6, 8)} className="absolute -right-3 top-14 sm:-right-8">
        <div className="glass flex h-24 w-24 items-center justify-center rounded-full p-2 shadow-glass">
          <motion.img
            src="/img/aniversario.png"
            alt="250 Jahre Jubiläum"
            className="h-full w-full object-contain"
            animate={reduced ? undefined : { rotate: 360 }}
            transition={reduced ? undefined : { duration: 28, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* animated scroll invitation, hero bottom-center */
export function ScrollCue() {
  const reduced = useReducedMotion();
  return (
    <div className="pointer-events-none flex flex-col items-center gap-3" aria-hidden="true">
      <span className="text-[10px] uppercase tracking-[0.3em] text-charcoal/50">Scrollen</span>
      <span className="relative block h-14 w-px overflow-hidden bg-charcoal/15">
        {!reduced && (
          <motion.span
            className="absolute left-0 top-0 h-6 w-px bg-gradient-to-b from-transparent via-bordeaux to-bordeaux"
            animate={{ y: [-24, 56] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          />
        )}
      </span>
    </div>
  );
}
