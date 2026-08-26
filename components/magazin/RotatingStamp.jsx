"use client";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import { Grapes } from "@/components/Icons";
import { SCROLL_SPRING_HEAVY } from "@/components/motion/springs";

/* Das Siegel des Magazins — eine runde Prägemarke wie auf einem Etikett:
   das Motto läuft im Kreis und dreht sich mit dem Scrollen weiter, träge
   gefedert wie ein schweres Wachssiegel. Rein dekorativ; bei reduzierter
   Bewegung steht die Marke still. */

export default function RotatingStamp({ className = "" }) {
  const reduced = useReducedMotionSafe();
  const { scrollY } = useScroll();
  const rotate = useSpring(useTransform(scrollY, [0, 2200], [0, 200]), SCROLL_SPRING_HEAVY);

  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <div className="glass relative flex h-full w-full items-center justify-center rounded-full shadow-glass">
        {/* innerer Haarlinienring — die „Prägung" */}
        <span className="absolute inset-[9%] rounded-full border border-champagne/45" />
        <motion.svg
          viewBox="0 0 100 100"
          style={{ rotate: reduced ? 0 : rotate }}
          className="absolute inset-0 h-full w-full will-transform"
        >
          <defs>
            <path
              id="magazin-stamp-circle"
              d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              fill="none"
            />
          </defs>
          <text
            className="font-montserrat font-semibold uppercase"
            fontSize="8"
            letterSpacing="1.4"
            fill="rgba(27, 27, 27, 0.66)"
          >
            <textPath href="#magazin-stamp-circle">
              Il piacere del vino · Maria Maria ·
            </textPath>
          </text>
        </motion.svg>
        <Grapes className="h-6 w-6 text-bordeaux/80" />
      </div>
    </div>
  );
}
