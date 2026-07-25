"use client";
import { motion, useReducedMotion } from "motion/react";
import Parallax from "../motion/Parallax";

/* Hero composition — arched photo frame with parallax and the slowly
   turning 250-years seal. */

export default function HeroVisual() {
  const reduced = useReducedMotion();

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
            alt="Maria-Maria-Flasche auf Steinplatte im warmen Licht eines Weinkellers"
            className="h-full w-full object-cover"
          />
        </Parallax>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/25 via-transparent to-transparent"
        />
      </div>

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
