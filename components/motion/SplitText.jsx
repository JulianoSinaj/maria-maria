"use client";
import { motion, useReducedMotion } from "motion/react";

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
}) {
  const reduced = useReducedMotion();
  const words = String(text).split(" ");

  if (reduced) {
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
