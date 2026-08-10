"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GoldRule } from "@/components/Deco";
import { Arrow, Glasses } from "@/components/Icons";
import { WINES } from "@/components/data";
import {
  CARD_PHOTO_SIZE,
  CARD_SIZES,
  PAIRING_CARDS,
  cardPhotoSrc,
  cardSrcSet,
} from "@/components/magazin/pairingCards";
import { cardBlurFor } from "@/components/magazin/pairingCardsBlur";
import { pairingPhotoSrc, pairingSrcSet } from "@/components/weine/pairingPhoto";
import { pairingBlurFor } from "@/components/weine/pairingBlur";

/* Der Anlass-Schalter des Food-Pairing-Kapitels — Frage → Antwort:
   fünf Anlass-Tasten, darunter genau eine Antwort-Karte. Ein Klick auf
   „Fisch & Meer" zeigt die Empfehlung für Fisch, ein Klick auf „Pasta-Abend"
   die für Pasta — die übrigen Antworten sind nie gleichzeitig zu sehen
   (Redaktionsvorgabe 08/2026: eine Frage, eine Antwort, kein Karten-Basar).

   Die Antwort-Karte als Doppelseite:
   · Links die Empfehlung ALS Foto: die Schlagzeile (Wein und Gericht in
     einem Satz, `caption`) steht nach der Vorlage der Redaktion im freien
     Himmel oben rechts im Motiv — Playfair in Elfenbein, darunter das
     Ornament aus Goldlinien und Kelch und ein leiser „Zum Wein"-Pfeil.
     Ein weicher Espresso-Hauch oben plus Text-Schatten sichern die
     Lesbarkeit auf hellen Motiven, ohne das Licht zu erdrücken. Die ganze
     Bildfläche ist der Link auf die Landingpage des Weins (dort erzählt
     der Maria-Maria-Moment das „Warum es passt").
   · Rechts „Auch passend": drei Weine der Kollektion als eigene
     Foto-Karten, die die Seitenspalte voll ausfüllen — vier sichtbare Wege
     je Anlass, mit klarer Hierarchie (eine Empfehlung groß im Bild, drei
     Nachbarn daneben). Namen aus dem
     Katalog (components/data.js), Fotos aus den Pairing-Motiven der
     Landingpages (weine/pairingPhoto.js) — weder ein zweiter Namensbestand
     noch eine zweite Foto-Pipeline.

   Motion contract — dasselbe 560-ms-Fenster wie RegionExplorer
   (OUT 0.18 s → IN 0.38 s auf cubic-bezier(.4,0,.2,1)):
   · Die Anlass-Fotos bleiben alle gemountet und überblenden per Opacity
     (Bauform OccasioniTeaser) — kein Remount, kein weißer Blitz.
   · Bild-Text und Alternativen räumen zuerst (mode="wait") und folgen dann
     gemeinsam — beide Register teilen Schlüssel und Uhr.
   · Die Bordeaux-Füllung der aktiven Taste wandert als layoutId-Feder;
     bei prefers-reduced-motion springt alles instantan.
   · Auf dem Foto kein Hover-Zoom: die Überblendung gehört dem Wechsel,
     der Hover antwortet mit vertieftem Schleier und wanderndem Pfeil.

   Layout-Ruhe: das Foto hält ab lg eine Mindesthöhe, die Alternativen sind
   immer genau drei Karten — die Antwort-Karte behält beim Umschalten ihre
   Höhe.

   Ein sr-only-Live-Satz meldet den Wechsel an Screenreader in einem Stück
   („Fisch & Meer: Fischrisotto … — Lugana DOC"), statt drei Regionen
   gleichzeitig plappern zu lassen. */

const EASE = [0.4, 0, 0.2, 1];
const OUT = 0.18; // s — ausgehende Antwort räumt zuerst
const IN = 0.38; // s — die neue folgt, sobald die Bühne frei ist
const INSTANT = { duration: 0 };

/* Die Feder der wandernden Bordeaux-Füllung — straff genug, um vor dem
   Text-Einblenden zu sitzen. */
const PILL_SPRING = { type: "spring", stiffness: 420, damping: 34 };

/* Slug → Katalogname, einmal aufgebaut. Fehlt ein Wein im Katalog, fällt die
   Alternative stillschweigend weg statt namenlos zu erscheinen. */
const WINE_NAME = Object.fromEntries(WINES.map((w) => [w.slug, w.name]));

/* Ein Registerwechsel — Bild-Text und Alternativen nutzen dieselbe Blende. */
function swapProps(reduced) {
  return {
    initial: reduced ? { opacity: 1 } : { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: reduced ? INSTANT : { duration: IN, ease: EASE },
    },
    exit: reduced
      ? { opacity: 0, transition: INSTANT }
      : { opacity: 0, y: -8, transition: { duration: OUT, ease: EASE } },
  };
}

function AnlassButton({ card, isActive, onSelect, reduced }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      className="group relative min-w-[186px] shrink-0 snap-start rounded-card border border-charcoal/10 bg-ivory px-4 py-3 text-left shadow-sm outline-none transition-shadow duration-300 ease-out hover:shadow-lift focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream lg:min-w-0"
    >
      {/* Die aktive Taste trägt die wandernde Bordeaux-Füllung */}
      {isActive && (
        <motion.span
          layoutId="anlass-fill"
          transition={reduced ? INSTANT : PILL_SPRING}
          aria-hidden="true"
          className="absolute inset-0 rounded-[inherit] bg-bordeaux shadow-luxe"
        />
      )}
      <span className="relative block">
        <span
          className={`block text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
            isActive ? "text-ivory" : "text-charcoal group-hover:text-bordeaux"
          }`}
        >
          {card.anlass}
        </span>
        {/* Untertitel = die Gericht-Zeile aus der Redaktionsvorgabe („testi da
            mettere sulle Magazine Cards", 08/2026) — der Wein bleibt bewusst
            der Antwort-Karte vorbehalten: erst der Anlass, dann der Wein. */}
        <span
          className={`mt-1 block text-[11px] leading-snug transition-colors duration-300 ${
            isActive ? "text-ivory/75" : "text-charcoal/55"
          }`}
        >
          {card.dish}
        </span>
      </span>
    </motion.button>
  );
}

/* Eine „Auch passend"-Karte: Pairing-Foto, Name, Gericht-Stichwort. */
function AlternativeCard({ alt }) {
  const blur = pairingBlurFor(alt.slug);
  return (
    <Link
      href={`/unsere-weine/${alt.slug}`}
      className="group/alt flex items-center gap-4 rounded-[14px] border border-charcoal/10 bg-cream/70 p-2.5 pr-4 shadow-sm outline-none transition-shadow duration-[250ms] ease-out hover:shadow-lift focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:p-3 sm:pr-5"
    >
      <span
        aria-hidden="true"
        className="relative h-20 w-32 shrink-0 overflow-hidden rounded-[10px] sm:h-[5.5rem] sm:w-36"
        style={blur ? { backgroundImage: `url(${blur})`, backgroundSize: "cover" } : undefined}
      >
        <img
          src={pairingPhotoSrc(alt.slug) ?? undefined}
          srcSet={pairingSrcSet(alt.slug) ?? undefined}
          sizes="(min-width: 640px) 144px, 128px"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[250ms] ease-out group-hover/alt:scale-[1.05]"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold leading-snug text-charcoal transition-colors duration-[250ms] ease-out group-hover/alt:text-bordeaux">
          {WINE_NAME[alt.slug]}
        </span>
        <span className="mt-1 block text-[11.5px] leading-snug text-charcoal/60">{alt.hint}</span>
      </span>
      <Arrow
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-champagne transition-transform duration-[250ms] ease-out group-hover/alt:translate-x-[5px]"
      />
    </Link>
  );
}

export default function PairingSelector({ className = "" }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const card = PAIRING_CARDS[active];

  const alternatives = card.alternatives.filter((a) => WINE_NAME[a.slug]);
  const swap = swapProps(reduced);

  return (
    <div className={className}>
      {/* ============ DIE FÜNF ANLASS-TASTEN ============ */}
      {/* Mobil eine Schnapp-Leiste mit Peek, ab lg fünf gleiche Spalten. */}
      <div
        data-lenis-prevent-horizontal
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {PAIRING_CARDS.map((c, i) => (
          <AnlassButton
            key={c.key}
            card={c}
            isActive={active === i}
            onSelect={() => setActive(i)}
            reduced={reduced}
          />
        ))}
      </div>

      {/* Der Wechsel als ein ruhiger Satz für Screenreader */}
      <p className="sr-only" aria-live="polite">
        {`${card.anlass}: ${card.dish} — ${card.wine}`}
      </p>

      {/* ============ DIE ANTWORT-KARTE ============ */}
      <div className="mt-6 overflow-hidden rounded-card-lg border border-charcoal/10 bg-ivory shadow-luxe lg:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr]">
          {/* ---- Links: die Empfehlung im Bild ---- */}
          <Link
            href={`/unsere-weine/${card.slug}`}
            className="group/hero relative block aspect-[4/3] overflow-hidden bg-espresso outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-inset sm:aspect-[16/10] lg:aspect-auto lg:min-h-[420px]"
          >
            {/* Foto-Bühne: alle fünf Motive bleiben gemountet und überblenden —
                jedes auf seinem eigenen LQIP-Grund, solange das WebP lädt. */}
            <span aria-hidden="true" className="absolute inset-0 block">
              {PAIRING_CARDS.map((c, i) => {
                const blur = cardBlurFor(c.key);
                const isShown = active === i;
                return (
                  <motion.span
                    key={c.key}
                    initial={false}
                    animate={{ opacity: isShown ? 1 : 0 }}
                    transition={reduced ? INSTANT : { duration: OUT + IN, ease: EASE }}
                    style={{
                      willChange: "opacity",
                      ...(blur ? { backgroundImage: `url(${blur})`, backgroundSize: "cover" } : {}),
                    }}
                    className="absolute inset-0 block"
                  >
                    <motion.img
                      src={cardPhotoSrc(c)}
                      srcSet={cardSrcSet(c)}
                      sizes={CARD_SIZES}
                      alt=""
                      width={CARD_PHOTO_SIZE.width}
                      height={CARD_PHOTO_SIZE.height}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      initial={false}
                      animate={{ scale: isShown ? 1.0 : 1.06 }}
                      transition={reduced ? INSTANT : { duration: OUT + IN, ease: EASE }}
                      style={{ willChange: "transform" }}
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                    />
                  </motion.span>
                );
              })}
            </span>

            {/* Leichter Espresso-Hauch hinter der Schlagzeilen-Zone — hält
                Elfenbein auf hellem Himmel lesbar, ohne das Licht des Motivs
                zu erdrücken; der Hover dunkelt sanft nach, statt zu zoomen. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 block h-3/5 bg-gradient-to-b from-espresso/40 via-espresso/10 to-transparent"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 block bg-espresso/20 opacity-0 transition-opacity duration-[250ms] ease-out group-hover/hero:opacity-100"
            />

            {/* Die Schlagzeile im freien Himmel oben rechts — Satz, Ornament
                (Goldlinien + Kelch, wie im Vorlagenbild) und „Zum Wein". */}
            {/* Mobil zentriert und breiter (die Zeile bleibt im Himmel, statt
                auf den Teller zu rutschen), ab sm rechts wie im Vorlagenbild. */}
            <span className="absolute inset-x-0 top-0 flex justify-center p-5 sm:justify-end sm:p-8 lg:p-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={card.key}
                  {...swap}
                  className="block w-[86%] text-center sm:w-[58%]"
                >
                  <span className="block font-playfair text-[clamp(1.35rem,2.5vw,2.05rem)] leading-[1.22] text-ivory [text-shadow:0_1px_22px_rgba(43,28,20,0.55)]">
                    {card.caption}
                  </span>
                  <span aria-hidden="true" className="mt-4 flex items-center justify-center gap-3">
                    <GoldRule className="w-10" />
                    <Glasses className="h-4 w-4 text-champagne-light" />
                    <GoldRule className="w-10" />
                  </span>
                  {/* Frost-Pille statt nackter Zeile: bleibt auch über hellem
                      Wasser und Himmel lesbar, egal welches Motiv liegt. */}
                  <span className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-espresso/35 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory backdrop-blur-[6px] transition-colors duration-[250ms] ease-out group-hover/hero:bg-espresso/50">
                    Zum Wein
                    <Arrow
                      aria-hidden="true"
                      className="h-3.5 w-3.5 text-champagne-light transition-transform duration-[250ms] ease-out group-hover/hero:translate-x-[5px]"
                    />
                  </span>
                </motion.span>
              </AnimatePresence>
            </span>
          </Link>

          {/* ---- Rechts: „Auch passend" ---- */}
          <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={card.key} {...swap}>
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-charcoal/45">
                  Auch passend
                </p>
                <div className="mt-3.5 grid grid-cols-1 gap-3">
                  {alternatives.map((alt) => (
                    <AlternativeCard key={alt.slug} alt={alt} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
