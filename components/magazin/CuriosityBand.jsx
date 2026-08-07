"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { Arrow, Grapes } from "@/components/Icons";

/* Box Curiosità — das Abschlussband des Magazins, gesetzt als eigenständiger
   Kasten auf hellem Grund statt als randlose dunkle Bühne. Der Kasten ist die
   Spielecke des Hefts: drei umdrehbare Kärtchen mit Weinwissen, das Freude
   macht statt zu belehren. Vorderseite stellt die Frage, Rückseite gibt die
   Antwort — echte 3D-Drehung um die Y-Achse in einem perspektivischen Raum.

   Die Fußzeile bleibt zweigleisig: links zu den Interviews (Winzer & Kunden),
   rechts der Passaggio zurück in die Artikel des Magazins. */

const CURIOSITIES = [
  {
    kicker: "Nomen est omen",
    question: "Warum heißt der Primitivo „Primitivo“?",
    answer:
      "Nicht weil er urtümlich wäre — sondern weil er als einer der ersten reift. „Primo“: der Frühe. Im August ist er schon fertig, während andere noch hängen.",
    stamp: "Nº I",
  },
  {
    kicker: "Küchenwissen",
    question: "Wie kalt darf ein Rotwein sein?",
    answer:
      "Kühler, als Sie denken. 16–18 °C — also Keller, nicht Wohnzimmer. Zwanzig Minuten im Kühlschrank vor dem Öffnen, und der Wein wird plötzlich präzise.",
    stamp: "Nº II",
  },
  {
    kicker: "Aus dem Keller",
    question: "Was ist die „Träne“ am Glasrand?",
    answer:
      "Die Schlieren, die nach dem Schwenken zurücklaufen. Sie verraten den Alkohol, nicht die Qualität — ein guter Wein weint nicht schöner, nur langsamer.",
    stamp: "Nº III",
  },
];

const FLIP_SPRING = { type: "spring", stiffness: 260, damping: 26, mass: 0.8 };

/* ---- eine umdrehbare Kuriositätenkarte ---- */
function CuriosityCard({ item, index }) {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-expanded={flipped}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={FLIP_SPRING}
      className="group relative block h-[13.5rem] w-full rounded-card-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/50 focus-visible:ring-offset-4 focus-visible:ring-offset-cream sm:h-[14rem]"
      style={{ perspective: 1200, willChange: "transform" }}
    >
      <motion.div
        className="relative h-full w-full will-transform"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: reduced ? 0 : flipped ? 180 : 0 }}
        transition={FLIP_SPRING}
      >
        {/* ---- Vorderseite: die Frage ---- */}
        <span
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-card-lg border border-champagne/45 bg-cream p-5 transition-colors duration-300 ease-out group-hover:border-champagne"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* die Nummer als Prägestempel im Hintergrund */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-3 -right-1 select-none font-playfair text-[5.5rem] italic leading-none text-bordeaux/[0.055]"
          >
            {index + 1}
          </span>

          <span className="relative flex items-center gap-2 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-champagne">
            <Grapes className="h-3.5 w-3.5" />
            {item.kicker}
          </span>

          <span className="relative block font-playfair text-[clamp(1.15rem,1.7vw,1.4rem)] leading-[1.15] text-charcoal">
            {item.question}
          </span>

          <span className="relative inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-bordeaux/75">
            {/* Kreis schwillt beim Hover an — der Hinweis „hier wird gedreht“ */}
            <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-bordeaux/25">
              <span
                aria-hidden="true"
                className="absolute inset-0 scale-0 rounded-full bg-bordeaux/10 transition-transform duration-500 ease-out-expo group-hover:scale-100"
              />
              <Arrow
                aria-hidden="true"
                className="relative h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-[3px]"
              />
            </span>
            Umdrehen
          </span>
        </span>

        {/* ---- Rückseite: die Auflösung ---- */}
        <span
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-card-lg border border-bordeaux/20 bg-bordeaux p-5"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-80 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(200,183,122,0.30) 0%, rgba(200,183,122,0) 70%)",
            }}
          />
          <span className="relative text-[9.5px] font-semibold uppercase tracking-[0.22em] text-champagne-light/85">
            {item.stamp}
          </span>
          <span className="relative block text-[12.5px] leading-[1.55] text-ivory/90">
            {item.answer}
          </span>
          <span className="relative inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-champagne-light">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-champagne-light/30">
              <Arrow aria-hidden="true" className="h-3.5 w-3.5 rotate-180" />
            </span>
            Zurück
          </span>
        </span>
      </motion.div>
    </motion.button>
  );
}

/* ---- die zweigleisige Fußzeile ---- */
const INTERVIEW_LINK = {
  kicker: "Interviste",
  label: "Winzer & Kunden im Gespräch",
  href: "#interviste",
  align: "left",
};


function FooterLink({ item }) {
  const right = item.align === "right";
  return (
    <Link
      href={item.href}
      className={`group inline-flex min-h-[44px] flex-col justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/50 focus-visible:ring-offset-4 focus-visible:ring-offset-cream ${
        right ? "items-start sm:items-end sm:text-right" : "items-start"
      }`}
    >
      <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-champagne">
        {item.kicker}
      </span>
      <span
        className={`mt-1 inline-flex items-center gap-2 text-[13px] font-medium text-charcoal transition-colors duration-300 group-hover:text-bordeaux ${
          right ? "sm:flex-row-reverse" : ""
        }`}
      >
        {/* Unterstrich wird von links aufgezogen – geclippte Maske statt Farbwechsel */}
        <span className="relative">
          {item.label}
          <span
            aria-hidden="true"
            className={`absolute -bottom-1 left-0 h-px w-full scale-x-0 bg-bordeaux/60 transition-transform duration-500 ease-out-expo group-hover:scale-x-100 ${
              right ? "origin-right" : "origin-left"
            }`}
          />
        </span>
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-bordeaux/20">
          {/* Pfeil-Karussell: der alte fährt raus, ein zweiter kommt nach */}
          <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-6" />
          <Arrow className="absolute h-3.5 w-3.5 -translate-x-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
        </span>
      </span>
    </Link>
  );
}

export default function CuriosityBand({
  className = "",
  headingId,
  /* Der Interview-Link erscheint nur, wenn wirklich ein Gespräch
     veröffentlicht ist — sonst zeigte er auf eine leere Platzhalterkarte.
     Ohne ihn rückt der Magazin-Link allein nach rechts. */
  showInterviewLink = true,
}) {
  return (
    <section
      aria-labelledby={headingId}
      className={`mx-auto max-w-content px-6 py-8 lg:px-10 lg:py-10 ${className}`}
    >
      {/* Der Kasten selbst — Elfenbein auf hellem Grund, umlaufende
          Champagnerkante, keine randlose Bühne mehr. */}
      <Reveal>
        <div className="grain relative overflow-hidden rounded-card-lg border border-champagne/40 bg-ivory px-6 py-7 sm:px-8 lg:px-10 lg:py-8">
          {/* zarter warmer Schimmer statt Dunkelheit */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-40 h-[26rem] w-[26rem] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(200,183,122,0.35) 0%, rgba(200,183,122,0) 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-28 h-[22rem] w-[22rem] rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(107,15,26,0.16) 0%, rgba(107,15,26,0) 70%)",
            }}
          />

          {/* ---- Kopf des Kastens: eine schlanke Zeile statt gestapelter Mitte ---- */}
          <div className="relative flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne">
                <Grapes className="h-3.5 w-3.5" />
                Curiosità
              </span>
              <h2
                id={headingId}
                className="mt-2 font-playfair text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.08] text-charcoal"
              >
                Kurios, aber{" "}
                <span className="italic text-bordeaux">wahr</span>
              </h2>
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-charcoal/65 lg:text-right">
              Drei Dinge, die wir beim Winzer gelernt haben. Karte antippen — die Antwort
              steht auf der Rückseite.
            </p>
          </div>

          {/* ---- die Spielkarten ---- */}
          <div className="relative mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CURIOSITIES.map((item, i) => (
              <Reveal key={item.question} delay={0.08 * i} y={22}>
                <CuriosityCard item={item} index={i} />
              </Reveal>
            ))}
          </div>

          {/* ---- Übergang in die Kollektion: eine Zeile, Satz links, Knopf rechts ---- */}
          <Reveal delay={0.1}>
            <div className="relative mt-6 flex flex-col items-center gap-4 border-t border-champagne/35 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="max-w-md font-playfair text-[15px] italic leading-snug text-charcoal/75">
                Neun Flaschen, vier Regionen — und damit neun Geschichten, die schon geschrieben
                sind.
              </p>
            </div>
          </Reveal>
        </div>
      </Reveal>

      {/* ---- zweigleisige Fußzeile: Interviews links, Magazin rechts ---- */}
      <Reveal delay={0.12}>
        <div className="mt-6 border-t border-champagne/30 pt-4">
          <div
            className={`flex flex-col gap-5 sm:flex-row sm:items-center ${
              showInterviewLink ? "sm:justify-between" : "sm:justify-end"
            }`}
          >
            {showInterviewLink && <FooterLink item={INTERVIEW_LINK} />}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
