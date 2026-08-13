"use client";
import { useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow, Grapes } from "@/components/Icons";

/* Box Curiosità — das Abschlussband des Magazins, gesetzt als eigenständiger
   Kasten auf hellem Grund statt als randlose dunkle Bühne. Der Kasten ist die
   Spielecke des Hefts: drei umdrehbare Kärtchen mit Weinwissen, das Freude
   macht statt zu belehren. Vorderseite stellt die Frage, Rückseite gibt die
   Antwort — echte 3D-Drehung um die Y-Achse in einem perspektivischen Raum.

   Die Fußzeile bleibt zweigleisig: links zu den Interviews (Winzer & Kunden),
   rechts der Passaggio zurück in die Artikel des Magazins. */

/* Drei Farbwelten aus der bestehenden Palette, je eine pro Kärtchen — die
   Farbe ist hier keine Dekoration, sie sortiert: die frühe rote Traube, der
   kühle Keller, das grüne Flaschenglas. Vorn eine Tinte des Akzents auf Creme
   #FBF9F4, hinten derselbe Ton satt ausgespielt. Die Anteile sind nicht gleich
   (13 / 14 / 22 %, beim Hover 20 / 22 / 31 %), sondern nach Augenmaß
   ausgeglichen: Bordeaux ist dunkel und satt und trägt schon wenig, das
   entsättigte Olivgrün braucht mehr für denselben Auftritt. So stehen die drei
   Flächen perzeptuell gleich weit auseinander (ΔE 6–9).
   Gold bleibt über alle drei die Konstante: Kanten, Stempel, Rückseiten-
   schimmer — aber nur dort, wo es keine Schrift tragen muss: Champagner auf
   Elfenbein liegt bei 1,8:1. Gemessen am gerenderten Ergebnis liegt der
   schlechteste Textkontrast dieses Abschnitts bei 5,3:1 (WCAG AA: 4,5). */
const TONES = {
  /* Primitivo — Bordeauxglas */
  rosso: {
    face: "bg-[#E8DBD8] group-hover:bg-[#DECAC8]",
    edge: "border-bordeaux/25 group-hover:border-bordeaux/55",
    ink: "text-bordeaux",
    stamp: "text-bordeaux/[0.11]",
    ring: "border-bordeaux/30",
    fill: "bg-bordeaux/[0.12]",
    focus: "focus-visible:ring-bordeaux/50",
    back: "bg-bordeaux",
  },
  /* Serviertemperatur — der kühle Keller */
  fresco: {
    face: "bg-[#DDE7E1] group-hover:bg-[#CBDDD6]",
    edge: "border-acqua-deep/25 group-hover:border-acqua-deep/55",
    ink: "text-acqua-ink",
    stamp: "text-acqua-ink/[0.11]",
    ring: "border-acqua-deep/30",
    fill: "bg-acqua-deep/[0.12]",
    focus: "focus-visible:ring-acqua-deep/50",
    back: "bg-acqua-ink",
  },
  /* Die Träne im Glas — Flaschenglasgrün */
  verde: {
    face: "bg-[#D6D9CC] group-hover:bg-[#C8CCBC]",
    edge: "border-vine/30 group-hover:border-vine/60",
    ink: "text-vine-deep",
    stamp: "text-vine-deep/[0.11]",
    ring: "border-vine/40",
    fill: "bg-vine/[0.14]",
    focus: "focus-visible:ring-vine/60",
    back: "bg-vine-deep",
  },
};

const CURIOSITIES = [
  {
    kicker: "Nomen est omen",
    question: "Warum heißt der Primitivo „Primitivo“?",
    answer:
      "Nicht weil er urtümlich wäre — sondern weil er als einer der ersten reift. „Primo“: der Frühe. Im August ist er schon fertig, während andere noch hängen.",
    stamp: "Nº I",
    tone: TONES.rosso,
  },
  {
    kicker: "Küchenwissen",
    question: "Wie kalt darf ein Rotwein sein?",
    answer:
      "Kühler, als Sie denken. 16–18 °C — also Keller, nicht Wohnzimmer. Zwanzig Minuten im Kühlschrank vor dem Öffnen, und der Wein wird plötzlich präzise.",
    stamp: "Nº II",
    tone: TONES.fresco,
  },
  {
    kicker: "Aus dem Keller",
    question: "Was ist die „Träne“ am Glasrand?",
    answer:
      "Die Schlieren, die nach dem Schwenken zurücklaufen. Sie verraten den Alkohol, nicht die Qualität — ein guter Wein weint nicht schöner, nur langsamer.",
    stamp: "Nº III",
    tone: TONES.verde,
  },
];

const FLIP_SPRING = { type: "spring", stiffness: 260, damping: 26, mass: 0.8 };

/* ---- eine umdrehbare Kuriositätenkarte ---- */
function CuriosityCard({ item, index }) {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const tone = item.tone;

  return (
    <motion.button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-expanded={flipped}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={FLIP_SPRING}
      className={`group relative block h-[13.5rem] w-full rounded-card-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory sm:h-[14rem] ${tone.focus}`}
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
          className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-card-lg border p-5 transition-colors duration-300 ease-out ${tone.face} ${tone.edge}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* die Nummer als Prägestempel im Hintergrund */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute -bottom-3 -right-1 select-none font-playfair text-[5.5rem] italic leading-none ${tone.stamp}`}
          >
            {index + 1}
          </span>

          <span
            className={`relative flex items-center gap-2 text-[9.5px] font-semibold uppercase tracking-[0.22em] ${tone.ink}`}
          >
            <Grapes className="h-3.5 w-3.5" />
            {item.kicker}
          </span>

          <span className="relative block font-playfair text-[clamp(1.15rem,1.7vw,1.4rem)] leading-[1.15] text-charcoal">
            {item.question}
          </span>

          <span
            className={`relative inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] ${tone.ink}`}
          >
            {/* Kreis schwillt beim Hover an — der Hinweis „hier wird gedreht“ */}
            <span
              className={`relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border ${tone.ring}`}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-0 scale-0 rounded-full transition-transform duration-500 ease-out-expo group-hover:scale-100 ${tone.fill}`}
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
          className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-card-lg border border-champagne/25 p-5 ${tone.back}`}
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
      <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-bordeaux">
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
          {/* der dritte Schimmer greift die kühle Karte auf — so trägt der
              Kasten dieselben drei Töne wie die Kärtchen darin */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 right-[12%] h-[20rem] w-[20rem] rounded-full opacity-45 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(35,120,107,0.15) 0%, rgba(35,120,107,0) 70%)",
            }}
          />

          {/* ---- Kopf des Kastens: eine schlanke Zeile statt gestapelter Mitte ---- */}
          <div className="relative flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              {/* Bordeaux statt Champagner: Gold liegt auf Elfenbein bei 1,8:1
                  und war als Schrift schlicht nicht lesbar. Gold bleibt für
                  Kanten und die dunklen Rückseiten reserviert. */}
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-bordeaux">
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
