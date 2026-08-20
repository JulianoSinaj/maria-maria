"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import TiltCard from "@/components/motion/TiltCard";
import { Aura } from "@/components/Atmosphere";

/* Die zwei Seelen hinter dem Namen — als Etiketten-Paar gestaltet:
   Maria als dunkle Bordeaux-Karte (der Ursprung), Maria Pia als helle
   Elfenbein-Karte (die Gegenwart), verbunden durch ein goldenes „&".

   Die beiden Karten stehen gerade nebeneinander; beim Hover tritt die
   jeweils andere Karte dezent einen Schritt zurück, ohne dass etwas im
   Layout springt.

   Gemeinsame Komponente für Startseite, Shop und Geschichte — Aussehen
   und Verhalten sind überall identisch. Dasselbe Etiketten-Paar trägt
   als `EtiquettePair` auch Vision & Mission im Magazin (ein Etikett kann
   dort statt Rubrik und Eigenschaften ein goldenes Icon über dem Namen
   führen). Nur die Ruhelage steht hier;
   Name, Rubrik, Eigenschaften und Text kommen je Sprache aus
   common.souls und werden als `souls` hereingereicht. Es gibt bewusst
   KEINEN deutschen Fallback mehr: er hat auf /shop und /geschichte
   monatelang die vorhandenen Übersetzungen verdeckt, weil dort das Prop
   fehlte. Fehlt ein Schlüssel, bleibt die Stelle sichtbar leer. */

const SOUL_SHAPE = [
  /* Anflugrichtung beim Einblenden — bewusst kurz gehalten */
  { key: "roots", dark: true, from: -14 },
  { key: "today", dark: false, from: 14 },
];

/* Rautenmarken der Etikette — Position + gestaffelte Verzögerung beim Hover,
   damit sie nicht alle vier gleichzeitig aufspringen */
const CORNERS = [
  "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
  "right-0 top-0 translate-x-1/2 -translate-y-1/2",
  "left-0 bottom-0 -translate-x-1/2 translate-y-1/2",
  "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
];

const SPRING = { type: "spring", stiffness: 120, damping: 18, mass: 0.9 };

function SoulCard({ soul, dimmed, onEnter, onLeave, compact = false }) {
  const reduced = useReducedMotion();
  const { dark } = soul;

  return (
    <div className="h-full">
      <motion.div
        className="h-full"
        variants={
          reduced
            ? undefined
            : {
                hidden: { opacity: 0, x: soul.from, filter: "blur(6px)" },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                  transition: { ...SPRING, opacity: { duration: 0.6 }, filter: { duration: 0.6 } },
                  transitionEnd: { filter: "none" },
                },
              }
        }
      >
        <motion.div
          className="h-full"
          initial={false}
          animate={
            reduced
              ? undefined
              : { opacity: dimmed ? 0.85 : 1, scale: dimmed ? 0.99 : 1 }
          }
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          onPointerEnter={(e) => e.pointerType !== "touch" && onEnter()}
          onPointerLeave={(e) => e.pointerType !== "touch" && onLeave()}
        >
          <TiltCard className="group h-full" max={3} radius="rounded-card">
            <div
              className={`relative flex h-full flex-col overflow-hidden rounded-card shadow-luxe transition-shadow duration-500 group-hover:shadow-lift ${
                compact ? "p-1.5" : "p-2.5"
              } ${
                dark
                  ? "bg-gradient-to-b from-bordeaux to-bordeaux-deep"
                  : "ring-hairline border border-stone/50 bg-ivory"
              }`}
            >
              {/* atmosphärische Drift im Karteninneren — dieselbe Sprache wie
                  die Auren der Sektionen, nur im Kleinformat */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-0">
                <Aura
                  tint={dark ? "wine" : "gold"}
                  drift={1}
                  className="-left-24 -top-28 h-72 w-72 opacity-80"
                />
                <Aura
                  tint={dark ? "bordeaux" : "champagne"}
                  drift={2}
                  className="-bottom-32 -right-20 h-64 w-64 opacity-70"
                />
              </span>

              {/* Glanz, der beim Hover einmal über das Etikett streicht — auf
                  dem Rückweg blendet er schnell aus, statt zurückzuwischen */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 opacity-0 transition-[transform,opacity] duration-300 ease-out-expo group-hover:translate-x-[400%] group-hover:opacity-100 group-hover:duration-[1300ms] ${
                  dark
                    ? "bg-gradient-to-r from-transparent via-champagne-light/20 to-transparent"
                    : "bg-gradient-to-r from-transparent via-champagne/25 to-transparent"
                }`}
              />

              {/* the etiquette frame — hairline border with diamond corner marks */}
              <div
                className={`relative flex h-full flex-col items-center border text-center transition-colors duration-500 ${
                  compact ? "rounded-[0.875rem] px-3 py-3" : "rounded-[1.125rem] px-6 py-7 sm:px-7"
                } ${
                  dark
                    ? "border-champagne/45 group-hover:border-champagne/75"
                    : "border-champagne/55 group-hover:border-champagne/85"
                }`}
              >
                {CORNERS.map((pos, i) => (
                  <span
                    key={pos}
                    aria-hidden="true"
                    style={{ transitionDelay: `${i * 60}ms` }}
                    className={`absolute h-[5px] w-[5px] rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-[225deg] group-hover:scale-150 ${pos} ${
                      dark ? "bg-champagne/70" : "bg-champagne/80"
                    }`}
                  />
                ))}

                {/* Magazin-Variante: goldenes Icon als Marke über dem Namen */}
                {soul.icon && (
                  <span
                    aria-hidden="true"
                    className={`transition-transform duration-500 ease-out-expo group-hover:-translate-y-[2px] ${
                      dark ? "text-champagne-light" : "text-champagne"
                    }`}
                  >
                    {soul.icon}
                  </span>
                )}
                {soul.tag && (
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${
                      soul.icon ? "mt-2.5" : ""
                    } ${dark ? "text-champagne-light" : "text-champagne"}`}
                  >
                    {soul.tag}
                  </p>
                )}
                <h3
                  className={`font-playfair leading-tight transition-transform duration-500 ease-out-expo group-hover:scale-[1.06] ${
                    compact ? "mt-1 text-[17px]" : "mt-2.5 text-[clamp(26px,2.6vw,32px)]"
                  } ${dark ? "text-ivory" : "text-charcoal"}`}
                >
                  {soul.name}
                </h3>

                {/* die Eigenschaften heben sich nacheinander an, statt als
                    ein Block zu springen */}
                {(soul.traits?.length ?? 0) > 0 && (
                  <p
                    className={`mt-6 text-[9.5px] font-semibold uppercase leading-[1.9] tracking-[0.2em] ${
                      dark ? "text-champagne-light" : "text-champagne"
                    }`}
                  >
                    {soul.traits.map((trait, i, traits) => (
                      <span
                        key={trait}
                        style={{ transitionDelay: `${i * 80}ms` }}
                        className="inline-block transition-transform duration-500 ease-out-expo group-hover:-translate-y-[3px]"
                      >
                        {trait}
                        {i < traits.length - 1 && (
                          /* Leerzeichen im Text, nicht als Margin — sonst liest
                             der Screenreader „Familie·Gastfreundschaft" */
                          <span aria-hidden="true" className="opacity-60">
                            {" · "}
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                )}

                <p
                  className={`max-w-[26ch] leading-relaxed ${
                    compact ? "mt-2 text-[11px]" : "mt-5 text-[12.5px]"
                  } ${dark ? "text-ivory/75" : "text-charcoal/70"}`}
                >
                  {soul.desc}
                </p>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* Das Siegel zwischen den beiden Karten — ein langsam kreisender Ring aus
   Champagner-Strichen, der beim Hover einer Karte kurz aufatmet. */
function Seal({ awake, glyph = "&", compact = false }) {
  const reduced = useReducedMotion();
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
    >
      <motion.span
        className={`relative flex items-center justify-center ${compact ? "h-10 w-10" : "h-14 w-14"}`}
        variants={
          reduced
            ? undefined
            : {
                hidden: { scale: 0.4, opacity: 0, rotate: -60 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                  transition: { type: "spring", stiffness: 180, damping: 15, delay: 0.35 },
                },
              }
        }
      >
        {/* Die CSS-Rotation liegt auf der Hülle: eine laufende Keyframe-
            Animation schlägt jedes inline gesetzte `transform` von Motion. */}
        <span className={`absolute animate-seal ${compact ? "-inset-[5px]" : "-inset-[7px]"}`}>
          <motion.span
            className="block h-full w-full rounded-full border border-dashed border-champagne/45"
            initial={false}
            animate={reduced ? undefined : { scale: awake ? 1.12 : 1, opacity: awake ? 0.95 : 0.6 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          />
        </span>
        <motion.span
          className={`flex items-center justify-center rounded-full bg-gradient-to-br from-champagne to-[#A9945C] font-playfair italic text-cream shadow-chip ring-cream/90 ${
            compact ? "h-10 w-10 text-[17px] ring-[3px]" : "h-14 w-14 text-[24px] ring-4"
          }`}
          initial={false}
          animate={reduced ? undefined : { scale: awake ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          {glyph}
        </motion.span>
      </motion.span>
    </span>
  );
}

/* Das Etiketten-Paar als wiederverwendbare Bühne: `items` bringen Gestalt
   (dark, from) und Inhalt (icon, tag, name, traits, desc) mit; das Siegel
   dazwischen bleibt das goldene „&" — es verbindet jedes Paar, ob zwei
   Marias oder Vision & Mission. `compact` setzt dasselbe Etikett kleiner
   (Magazin-Spalte): engere Ränder, kleinere Schrift, kleineres Siegel —
   die Ruhelage der zwei Marias bleibt davon unberührt. */
export function EtiquettePair({ items, seal = "&", compact = false, className = "" }) {
  const reduced = useReducedMotion();
  /* Welche Karte der Zeiger gerade ansteuert — die andere tritt zurück */
  const [active, setActive] = useState(null);

  return (
    <motion.div
      className={`relative ${className}`}
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -6% 0px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
    >
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? "gap-4" : "gap-5"}`}>
        {items.map((item, i) => (
          <SoulCard
            key={item.key}
            soul={item}
            compact={compact}
            dimmed={active !== null && active !== i}
            onEnter={() => setActive(i)}
            onLeave={() => setActive(null)}
          />
        ))}
      </div>
      {/* die Vereinigung beider Seiten — ein goldenes Siegel dazwischen */}
      <Seal awake={active !== null} glyph={seal} compact={compact} />
    </motion.div>
  );
}

export default function SoulCards({ souls: copy }) {
  const souls = SOUL_SHAPE.map((s) => ({ ...s, ...(copy?.[s.key] ?? {}) }));
  return <EtiquettePair items={souls} />;
}
