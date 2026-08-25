"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import { SCROLL_SPRING_HEAVY } from "@/components/motion/springs";
import { Eyebrow } from "@/components/Deco";
import { Aura, GhostWord } from "@/components/Atmosphere";

/* Terroir-Manifest — das Argument der Seite, nicht ihre Fußnote.

   Vorher stand hier eine schmale linksbündige Spalte (max-w-3xl) mit drei
   Häkchen-Bullets, hinter dem Shop-Band und damit hinter dem Abschluss der
   Seite. Sie las sich als Rest, nicht als Aussage.

   Jetzt: eine helle Vollbreiten-Bühne zwischen den Regionsporträts und den
   Fragen — gleiche Fläche und gleicher Höhenrhythmus (py-12/14/16) wie die
   Fragen darunter. Links das Manifest, rechts drei Säulen — ohne Ziffern, Icons oder
   Karten: nur Serifen-Titel, Fließtext und je eine Haarlinie darüber, an der
   beim Hover eine champagnerfarbene Kante einläuft. Links davon läuft ein
   Fortschrittsstrich beim Scrollen mit (feder-gedämpft, nicht linear). Beim
   Hover wandert die einzelne Säule minimal nach vorn: eine 3D-Ebene
   (translateZ) im perspektivischen Viewport, keine Layout-Bewegung. */

function Pillar({ pillar, index }) {
  const reduced = useReducedMotionSafe();
  const { title, text } = pillar;

  return (
    <motion.li
      className="group relative"
      style={{ perspective: 900 }}
      initial={reduced ? false : { opacity: 0, y: 26, filter: "blur(6px)" }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transitionEnd: { filter: "none" },
      }}
      viewport={{ once: true, amount: 0.5, margin: "0px 0px -8% 0px" }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 20,
        delay: 0.08 * index,
        opacity: { duration: 0.55, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: 0.6, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {/* Trennlinie oben — beim Hover läuft eine Champagner-Kante von links
          hinein (clip-path statt width, damit nichts umbricht) */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 block h-px bg-charcoal/10" />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 block h-px origin-left scale-x-0 bg-gradient-to-r from-champagne via-champagne to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
      />

      <motion.div
        className="py-5 sm:py-6"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        variants={reduced ? undefined : { rest: { z: 0, x: 0 }, hover: { z: 26, x: 6 } }}
        initial="rest"
        whileHover="hover"
        animate="rest"
        transition={{ type: "spring", stiffness: 210, damping: 24, mass: 0.6 }}
      >
        <h3 className="font-playfair text-[clamp(1.05rem,1.7vw,1.3rem)] leading-snug text-charcoal">
          {title}
        </h3>
        <p className="mt-2.5 max-w-md text-[13px] leading-relaxed text-charcoal/65 transition-colors duration-500 group-hover:text-charcoal/85">
          {text}
        </p>
      </motion.div>
    </motion.li>
  );
}

/* Der Text kommt als Prop von der Seite (content/<sprache>/regionen.js,
   Abschnitt `manifest`) — die Komponente ist eine Client-Component und darf
   das Wörterbuch nicht selbst laden. */
export default function TerroirManifest({ t = {} }) {
  const ref = useRef(null);
  const reduced = useReducedMotionSafe();

  /* Der Fortschrittsstrich links der Säulen folgt dem Scroll — über eine
     Feder geführt, damit er nachschwingt statt zu kleben. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 68%"],
  });
  const smooth = useSpring(scrollYProgress, SCROLL_SPRING_HEAVY);
  const scaleY = useTransform(smooth, [0, 1], [0, 1]);

  return (
    <section className="grain relative overflow-hidden">
      {/* Helle Bühne wie die übrigen Sektionen — die Auren geben der Fläche
          Farbe, ohne sie zuzudecken */}
      <Aura tint="bordeaux" drift={1} className="-left-64 -top-56 h-[42rem] w-[42rem]" />
      <Aura tint="terracotta" drift={2} className="-right-72 bottom-[-18rem] h-[46rem] w-[46rem] opacity-60" />
      <GhostWord className="right-[-3vw] top-[8%] text-[15vw]">Terra</GhostWord>

      <div
        ref={ref}
        className="relative mx-auto grid max-w-content gap-10 px-6 py-12 sm:py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20 lg:px-10 lg:py-16"
      >
        {/* ---- Manifest ---- */}
        <motion.div
          className="lg:self-center"
          initial={reduced ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 20,
            opacity: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          <Eyebrow>{t.eyebrow}</Eyebrow>

          <h2 className="mt-5 text-balance font-playfair text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.1] text-charcoal">
            {t.title}
            <br className="hidden sm:block" />{" "}
            <span className="italic text-bordeaux">{t.titleAccent}</span>
          </h2>

          <p className="mt-6 max-w-md text-[13.5px] leading-relaxed text-charcoal/70">
            {t.text}
          </p>
        </motion.div>

        {/* ---- Säulen ---- */}
        <div className="relative">
          {/* Scroll-Schiene: ruhende Haarlinie + mitlaufende Champagner-Kante */}
          <div aria-hidden="true" className="absolute -left-5 top-0 hidden h-full w-px bg-charcoal/10 sm:block lg:-left-10">
            <motion.span
              className="block h-full w-px origin-top bg-gradient-to-b from-champagne via-champagne/70 to-transparent"
              style={{ scaleY, willChange: "transform" }}
            />
          </div>

          <ul>
            {(t.pillars ?? []).map((p, i) => (
              <Pillar key={p.title} pillar={p} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
