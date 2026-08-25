"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import { Arrow, ChevronRight } from "@/components/Icons";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { useIntentTarget } from "./IntentContext";
import { INTENT_CARDS } from "./intents";
import { Bag, Cheers, Cutlery, WineGlass } from "./icons";
import { CARD, CTA_LINK } from "./styles";

const AUTOPLAY_MS = 4000;

/* Die 2×2-Kachel „Warum möchten Sie uns kontaktieren?".

   Die Karte trägt GENAU EIN Ziel und der Klick erreicht sie ganz: Handoff §12
   verlangt „Tutta la card deve essere cliccabile", §17 „card cliccabili con
   semantica button/link reale". Ein <div onClick> sähe identisch aus und wäre
   für Tastatur und Screenreader nicht vorhanden; zwei Ziele in einer Karte
   wären ein Ziel im Ziel.

   Der Weg dahin war zuerst: die ganze Karte IST der <button>. Das kostete
   aber die Überschriften. Ein <button> darf laut HTML nur Phrasing Content
   enthalten — <h3> gehört nicht dazu —, weshalb die vier Kacheltitel als
   <span> im Markup standen. Damit hatte ausgerechnet der wertvollste
   Wortschatz der Seite (Gastronomie & Feinkost, Handel & Wiederverkauf,
   Events & besondere Anlässe, Verkostung & individuelle Auswahl) keine
   Gliederungsebene: Handoff §15 verlangt „H3 per card/FAQ quando
   semanticamente appropriato", und eine Suchmaschine liest die
   Seitenstruktur an genau diesen Elementen ab.

   Jetzt ist die Karte ein <div> mit echter <h3>, und die Terrakotta-Zeile
   unten ist der <button>. Sein ::before deckt die ganze Karte ab — die
   Klickfläche bleibt also die vollständige Kachel, es bleibt bei einem
   einzigen Tabstopp, und der Barrierefreiheitsname der Schaltfläche ist die
   CTA-Zeile („Gastronomie anfragen"), die auch beschreibt, was der Klick tut.

   Nebenwirkung des Overlays: Text in der Karte lässt sich nicht mehr
   markieren. Das war mit der Karte als <button> genauso, ist also kein
   Rückschritt — und eine Kachel, deren Text man kopiert, ist nicht der
   Anwendungsfall. */

const ICONS = { Cutlery, Bag, Cheers, WineGlass };

/* Der Karteninhalt, unabhängig von Grid (Desktop) oder Karussell (Telefon).
   `has-[:focus-visible]` zieht den Fokusrahmen der Schaltfläche auf die
   Karte nach: Tastaturnutzer sehen sonst einen Ring um eine kurze Textzeile,
   während das eigentliche Ziel die ganze Kachel ist. */
function IntentCard({ item, Icon, value, requestIntent, className = "" }) {
  return (
    <div
      className={`${CARD} group relative flex h-full w-full items-start gap-5 p-6 text-left transition-colors duration-400 hover:border-champagne/70 hover:bg-white has-[:focus-visible]:border-champagne sm:gap-6 sm:p-7 ${className}`}
    >
      {/* Die Bauform von IconChip (components/Deco.jsx): Champagner-
          Verlauf, Haarlinien-Ring, Bordeaux-Zeichnung — nur in der
          Kachelgröße des Mockups statt der festen Chip-Maße. */}
      <span className="ring-hairline mt-0.5 flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cream to-champagne-light/40 text-bordeaux sm:h-[64px] sm:w-[64px]">
        <Icon className="h-[28px] w-[28px]" aria-hidden="true" />
      </span>

      {/* Spalte mit `mt-auto` an der CTA: In einer Reihe sind die
          Karten gleich hoch, die Texte aber verschieden lang. Ohne
          das steht die Terrakotta-Zeile in jeder Karte auf einer
          anderen Höhe — im Mockup liegen sie auf einer Linie. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-playfair text-[18.5px] leading-snug text-charcoal">
          {item.title}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.6] text-charcoal/70">
          {item.text}
        </p>
        {/* Keine eigene Mindesthöhe: Das Ziel ist über das ::before
            die ganze Karte, nicht diese Zeile. Ein 44-px-Kasten um
            sie herum bläht nur die Kachel auf. */}
        <button
          type="button"
          onClick={() => requestIntent(value, { label: item.cta, section: "intent_cards" })}
          className={`${CTA_LINK} mt-auto pt-4 before:absolute before:inset-0 before:content-['']`}
        >
          {item.cta}
          <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

/* Telefon: statt der 2×2-Kachel (die auf Telefonbreite zu einer langen
   einspaltigen Liste würde und die Sektion streckt) zeigt ein Karussell
   jeweils eine Karte — kürzer, ruhiger, eine Entscheidung nach der anderen.
   Es blättert von selbst alle vier Sekunden weiter; die Pfeile blättern
   sofort in beide Richtungen und setzen den Automatik-Timer zurück, statt
   gegen ihn zu laufen.

   Alle vier Karten liegen übereinander in derselben Grid-Zelle (row-start-1/
   col-start-1) statt nacheinander im DOM montiert zu werden: Ein Grid
   bemisst seine Zeile nach dem GRÖSSTEN Kind, unabhängig davon, welches
   Kind gerade sichtbar ist. Damit hat der Container immer die Höhe der
   längsten Karte, und die Sektion darunter (Formular, Fußzeile) rutscht
   beim Kartenwechsel nicht auf und ab — anders als bei einem Wechsel, der
   jeweils nur die aktive Karte rendert. */
function IntentCarousel({ copy, requestIntent }) {
  const reduced = useReducedMotionSafe();
  const count = INTENT_CARDS.length;
  const [[index, dir], setIndex] = useState([0, 0]);
  const timerRef = useRef(null);

  const restartTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex(([i]) => [(i + 1) % count, 1]);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    restartTimer();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = () => {
    setIndex(([i]) => [(i + 1) % count, 1]);
    restartTimer();
  };
  const prev = () => {
    setIndex(([i]) => [(i - 1 + count) % count, -1]);
    restartTimer();
  };

  return (
    <div className="mt-8 md:hidden">
      <div className="relative grid">
        {INTENT_CARDS.map(({ key, value, icon }, i) => {
          const item = copy.items[key];
          const Icon = ICONS[icon];
          const active = i === index;
          return (
            <motion.div
              key={key}
              className="col-start-1 row-start-1"
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
                x: reduced ? 0 : active ? 0 : (i > index ? 1 : -1) * 48 * (dir || 1),
              }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              style={{ pointerEvents: active ? "auto" : "none" }}
              aria-hidden={!active}
            >
              <IntentCard
                item={item}
                Icon={Icon}
                value={value}
                requestIntent={requestIntent}
                className={active ? "" : "invisible"}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label={copy.carouselPrev || "Previous"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white/70 text-bordeaux transition-colors duration-300 hover:border-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>

        <div className="flex items-center gap-1.5">
          {INTENT_CARDS.map((card, i) => (
            <span
              key={card.key}
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-bordeaux" : "w-1.5 bg-stone"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label={copy.carouselNext || "Next"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white/70 text-bordeaux transition-colors duration-300 hover:border-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function IntentCards({ copy }) {
  const { requestIntent } = useIntentTarget();

  return (
    <>
      <IntentCarousel copy={copy} requestIntent={requestIntent} />

      <Stagger className="mt-10 hidden gap-5 md:grid md:grid-cols-2" gap={0.08}>
        {INTENT_CARDS.map(({ key, value, icon }) => {
          const item = copy.items[key];
          const Icon = ICONS[icon];

          return (
            <StaggerItem key={key} className="h-full">
              <IntentCard item={item} Icon={Icon} value={value} requestIntent={requestIntent} />
            </StaggerItem>
          );
        })}
      </Stagger>
    </>
  );
}
