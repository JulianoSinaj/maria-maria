"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Grapes } from "@/components/Icons";
import { SCROLL_SPRING } from "@/components/motion/springs";

/* Tinten-Zitat — das Zwischenspiel des Magazins: ein großes kursives Zitat,
   das sich beim Scrollen Wort für Wort mit Tinte füllt. Der Fortschritt ist
   direkt ans Scrollen gebunden (vor und zurück), läuft aber durch die
   gemeinsame Feder, damit die Tinte fließt statt zu springen. Screenreader
   erhalten den Satz als Ganzes, die Wort-Spans sind dekorativ. */

function InkWord({ progress, range, children, last }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {/* Trenner unten ist U+00A0 — ein normales Leerzeichen kollabiert am
          Ende eines inline-blocks und ließe die Wörter zusammenrücken */}
      {children}
      {last ? "" : " "}
    </motion.span>
  );
}

export default function InkQuote({
  text,
  translation,
  cite,
  className = "",
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    /* füllt sich zwischen „Zitat betritt das untere Drittel" und „Zitat
       erreicht die obere Hälfte" — ein Lesetempo, kein Blitzstart */
    offset: ["start 88%", "start 38%"],
  });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  const words = String(text).split(" ");
  const step = 1 / words.length;

  return (
    <figure ref={ref} className={`relative mx-auto max-w-content px-6 lg:px-10 ${className}`}>
      <blockquote>
        <p
          aria-label={`„${text}“`}
          className="text-balance text-center font-playfair text-[clamp(1.9rem,4.6vw,3.4rem)] italic leading-[1.18] text-charcoal"
        >
          <span aria-hidden="true" className="text-champagne">„</span>
          {reduced ? (
            <span aria-hidden="true">{text}</span>
          ) : (
            <span aria-hidden="true">
              {words.map((word, i) => (
                <InkWord
                  key={`${word}-${i}`}
                  progress={progress}
                  range={[i * step, (i + 1) * step]}
                  last={i === words.length - 1}
                >
                  {word}
                </InkWord>
              ))}
            </span>
          )}
          <span aria-hidden="true" className="text-champagne">“</span>
        </p>
      </blockquote>

      <figcaption className="mt-5 flex flex-col items-center gap-2.5">
        <span aria-hidden="true" className="flex items-center gap-4">
          <span className="h-px w-12 bg-champagne/60 sm:w-16" />
          <Grapes className="h-4 w-4 text-champagne" />
          <span className="h-px w-12 bg-champagne/60 sm:w-16" />
        </span>
        {cite && (
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">
            {cite}
          </span>
        )}
        {translation && (
          <span className="text-[12px] italic leading-relaxed text-charcoal/45">{translation}</span>
        )}
      </figcaption>
    </figure>
  );
}
