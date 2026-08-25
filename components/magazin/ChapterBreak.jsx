"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import { Grapes } from "@/components/Icons";
import { SCROLL_SPRING } from "@/components/motion/springs";

/* Kapitelmarke — die Trennlinie zwischen den Kapiteln des Magazins, gesetzt
   wie ein Zwischentitel im Heft: links „Capitolo II" mit dem Kapitelnamen,
   dazwischen eine Haarlinie, die sich beim Erscheinen von links aufzieht,
   rechts ein kursives italienisches Stichwort. Dahinter treibt die römische
   Ziffer in Plakatgröße quer durch die Zeile — scroll-gebunden und über die
   gemeinsame Feder geglättet, damit sie Gewicht hat statt zu rutschen. */

const RULE_SPRING = { type: "spring", stiffness: 70, damping: 22, mass: 1 };

export default function ChapterBreak({ number, title, word, className = "" }) {
  const ref = useRef(null);
  const reduced = useReducedMotionSafe();

  /* Ziffern-Drift: ±5vw über die Sichtspanne der Marke */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useSpring(useTransform(scrollYProgress, [0, 1], ["5vw", "-7vw"]), SCROLL_SPRING);

  return (
    <div ref={ref} aria-hidden="true" className={`relative overflow-hidden ${className}`}>
      {/* die treibende Kapitelziffer — gefüllt hauchzart, umrissen wie gedruckt */}
      <motion.span
        className="pointer-events-none absolute right-[6%] top-1/2 select-none whitespace-nowrap font-playfair italic leading-none will-transform"
        style={{
          /* y übernimmt die vertikale Zentrierung — eine Tailwind-Translate-
             Klasse würde von Motions Inline-Transform überschrieben */
          x: reduced ? 0 : drift,
          y: "-50%",
          fontSize: "clamp(7rem, 16vw, 13rem)",
          color: "rgba(107, 15, 26, 0.045)",
          WebkitTextStroke: "1px rgba(107, 15, 26, 0.10)",
        }}
      >
        {number}
      </motion.span>

      <div className="relative mx-auto flex max-w-content items-center gap-5 px-6 pb-2 pt-10 sm:gap-7 lg:px-10 lg:pt-12">
        {/* Capitolo-Kicker + Kapitelname */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ ...RULE_SPRING, opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="shrink-0"
        >
          <span className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-champagne">
            <Grapes className="h-3.5 w-3.5" />
            Capitolo {number}
          </span>
          <span className="mt-1 block font-playfair text-[15px] italic text-charcoal/75 sm:text-[17px]">
            {title}
          </span>
        </motion.div>

        {/* die Haarlinie zieht sich von links auf */}
        <motion.span
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ ...RULE_SPRING, delay: 0.12 }}
          className="h-px min-w-0 flex-1 origin-left bg-gradient-to-r from-champagne/70 via-champagne/40 to-transparent will-transform"
        />

        {/* das italienische Stichwort als Gegengewicht */}
        {word && (
          <motion.span
            initial={reduced ? false : { opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...RULE_SPRING, delay: 0.2, opacity: { duration: 0.5, delay: 0.2 } }}
            className="hidden shrink-0 font-playfair text-[15px] italic text-bordeaux/60 sm:block sm:text-[17px]"
          >
            {word}
          </motion.span>
        )}
      </div>
    </div>
  );
}
