"use client";
import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import useFirstLoad from "@/components/motion/useFirstLoad";

/* Word-level masked reveal for display headlines — each word rises out of an
   overflow clip on a spring, staggered. Screen readers get the plain string. */

export default function SplitText({
  text,
  className = "",
  /* Klassen pro Wort-Span — nötig für bg-clip-text-Gradients, die auf dem
     äußeren Wrapper nicht durch die overflow-clip-Spans hindurchmalen */
  wordClassName = "",
  /* Inline-Style pro Wort-Span — für laufzeitdynamische Gradients (z. B.
     weinspezifische Töne), die Tailwind-JIT nicht sehen kann */
  wordStyle,
  delay = 0,
  stagger = 0.05,
  once = true,
  as: Tag = "span",
  /* Überschrift steht beim Laden schon im Bild — siehe `priority` in
     Reveal.jsx. Hier wiegt es noch etwas schwerer: Die Wörter starten auf
     `y: 112%` INNERHALB eines overflow-hidden-Spans, sind also aus ihrem
     eigenen Kasten herausgeschoben. Ohne JavaScript bleibt die H1 damit
     unsichtbar — der Text steht zwar im HTML (Crawler und Screenreader
     lesen ihn über aria-label), zu sehen ist er aber erst, wenn Motion
     gelaufen ist. Beim ersten Aufbau liefern wir deshalb schlichten Text. */
  priority = false,
}) {
  /* Hydration-sicher (siehe useReducedMotionSafe): Der reduzierte Zweig
     rendert einen anderen DOM-Baum als der Server — mit Motions eigenem
     useReducedMotion() scheiterte die Hydration auf jedem Telefon mit
     „Bewegung reduzieren". */
  const reduced = useReducedMotionSafe();
  const firstLoad = useFirstLoad();
  const words = String(text).split(" ");

  if (reduced || (priority && firstLoad)) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span
            /* derselbe Haken wie bei Reveal: markiert „startet verborgen und
               braucht ohne JavaScript eine Rettung" — siehe die
               <noscript>-Regel im Layout und den reduced-motion-Block in
               globals.css */
            data-reveal=""
            className={`inline-block will-transform ${wordClassName}`}
            style={wordStyle}
            initial={{ y: "112%", rotate: 2.5 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once }}
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 22,
              mass: 0.9,
              delay: delay + i * stagger,
            }}
          >
            {/* separator below is U+00A0 (non-breaking space) — a plain space
                would collapse at the end of the inline-block and merge words */}
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
