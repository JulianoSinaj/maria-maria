"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { SCROLL_SPRING_HEAVY } from "@/components/motion/springs";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";

/* Foto-Bühne des Home-Heros — die Client-Schicht über dem
   server-gerenderten <picture> (siehe HomeHeroPhoto, children-Prop-Trick wie
   bei FalanghinaHero).

   Kein Pin wie auf den Weinseiten: die Startseite erzählt unterhalb weiter.
   Stattdessen zieht die Kamera beim Verlassen des Heros federgewichtet in die
   Szene — derselbe langsame Zoom wie im Foto-Modus der Landingpages. */

const SPRING = SCROLL_SPRING_HEAVY;

export default function HomeHeroFx({ photo }) {
  const ref = useRef(null);
  /* Hydration-sicher: `style` hängt am Wert, der Server rendert
     scale(1.04) — Motions useReducedMotion() lieferte auf Telefonen mit
     „Bewegung reduzieren" schon beim ersten Client-Render `true`. */
  const reduced = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1.04, 1.16]), SPRING);
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -30]), SPRING);

  return (
    <>
      <motion.div
        ref={ref}
        style={reduced ? undefined : { scale, y }}
        className="absolute inset-0 will-transform"
      >
        {photo}
      </motion.div>

    </>
  );
}
