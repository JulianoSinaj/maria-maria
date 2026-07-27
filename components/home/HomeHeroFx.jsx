"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { ChevronDown } from "@/components/Icons";

/* Foto-Bühne und Scroll-Cue des Home-Heros — die Client-Schicht über dem
   server-gerenderten <picture> (siehe HomeHeroPhoto, children-Prop-Trick wie
   bei FalanghinaHero).

   Kein Pin wie auf den Weinseiten: die Startseite erzählt unterhalb weiter.
   Stattdessen zieht die Kamera beim Verlassen des Heros federgewichtet in die
   Szene — derselbe langsame Zoom wie im Foto-Modus der Landingpages. */

const SPRING = { stiffness: 60, damping: 19, mass: 0.9 };

export default function HomeHeroFx({ photo }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1.04, 1.16]), SPRING);
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -30]), SPRING);
  const cueOpacity = useSpring(useTransform(scrollYProgress, [0, 0.16], [1, 0]), SPRING);

  return (
    <>
      <motion.div
        ref={ref}
        style={reduced ? undefined : { scale, y }}
        className="absolute inset-0 will-transform"
      >
        {photo}
      </motion.div>

      {/* z-10 hebt den Cue über die Schleier- und Fade-Ebenen der Sektion */}
      <motion.div
        style={reduced ? undefined : { opacity: cueOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-1.5 text-charcoal/55"
        aria-hidden="true"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">Entdecken</span>
        <motion.span
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={reduced ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.div>
    </>
  );
}
