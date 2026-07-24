"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronRight } from "@/components/Icons";
import { WINE_ICON } from "./WineIcons";

/* Mobile-Variante des Essenz-Trios („So schmeckt … am besten"): ein
   auto-rotierender Kartenstapel wie ein Kartendeck. Die aktive Karte liegt
   vorn, die nächsten liegen federnd versetzt dahinter (kleiner, blasser, nach
   hinten geschoben). Alle 4 s rückt der Stapel eine Karte weiter; die vordere
   Karte gleitet weg und wandert nach hinten. Pausiert bei Hover/Touch, mit
   manueller Vor/Zurück-Steuerung. Rein moment.essence-getrieben.

   Nur < lg sichtbar — auf Desktop bleibt das dreispaltige Grid in MariaMoment. */

const AUTO_MS = 4000;
const SPRING = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 };

/* Sichtbare Stapeltiefe (aktive Karte + 2 dahinter) */
const DEPTH = 3;

export default function EssenceCarousel({ items, accent, backgrounds = [] }) {
  const reduced = useReducedMotion();
  const count = items.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /* Richtung nur fürs Bewusstsein der Exit-Animation (vor = +1, zurück = -1) */
  const [dir, setDir] = useState(1);
  const timer = useRef(null);

  const go = useCallback(
    (delta) => {
      setDir(delta >= 0 ? 1 : -1);
      setIndex((i) => (i + delta + count) % count);
    },
    [count]
  );

  /* Auto-Rotation — läuft nur, wenn nicht pausiert und mehr als eine Karte */
  useEffect(() => {
    if (paused || reduced || count < 2) return undefined;
    timer.current = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => clearInterval(timer.current);
  }, [paused, reduced, count]);

  if (!count) return null;

  return (
    <div
      className="relative select-none"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      style={{ perspective: 1400 }}
      role="group"
      aria-roledescription="Karussell"
      aria-label="Die Essenz des Weins"
    >
      {/* Bühne — feste Höhe, damit der Stapel keinen Layout-Shift erzeugt */}
      <div
        className="relative h-[420px] w-full"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        <AnimatePresence initial={false} custom={dir}>
          {Array.from({ length: Math.min(DEPTH, count) }).map((_, depth) => {
            const cardIndex = (index + depth) % count;
            const item = items[cardIndex];
            const bg = backgrounds[cardIndex % backgrounds.length];
            const isFront = depth === 0;

            return (
              <motion.article
                key={`${cardIndex}-${item.kicker}`}
                custom={dir}
                aria-hidden={!isFront}
                /* Neue Karte kommt hinten am Stapel ins Bild */
                initial={{
                  opacity: 0,
                  y: 18 * DEPTH + 24,
                  scale: 1 - 0.05 * DEPTH - 0.04,
                  filter: "blur(6px)",
                }}
                animate={{
                  opacity: 1 - depth * 0.16,
                  y: depth * 18,
                  scale: 1 - depth * 0.05,
                  /* Front-Karte bleibt filterfrei: ein (auch nulliger) blur-Filter
                     zwingt die Karte auf einen eigenen Compositing-Layer, der auf
                     mobilen GPUs zusammen mit preserve-3d den Karteninhalt
                     verschluckt. Nur die hinteren Karten werden geblurrt. */
                  filter: reduced || isFront ? "none" : `blur(${depth * 1.4}px)`,
                  zIndex: DEPTH - depth,
                }}
                /* Vordere Karte gleitet nach oben+weg, hintere lösen sich sanft */
                exit={{
                  opacity: 0,
                  y: reduced ? 0 : -46,
                  scale: 0.94,
                  filter: "blur(8px)",
                  transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
                }}
                transition={SPRING}
                className="absolute inset-0 overflow-hidden rounded-card border border-stone/50 shadow-luxe"
                style={{ willChange: "transform" }}
              >
                {/* Hintergrundbild + dunkle Überlagerung */}
                {bg ? (
                  <img
                    src={bg}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(150deg, ${item.tone || accent.base}, ${accent.deep})` }}
                  />
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(20,14,12,0.35) 0%, rgba(20,14,12,0.55) 55%, rgba(20,14,12,0.82) 100%)",
                  }}
                />
                {/* Akzent-Wash in der Weinfarbe */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 mix-blend-soft-light opacity-70"
                  style={{ background: `linear-gradient(155deg, ${item.tone || accent.base}55, transparent 70%)` }}
                />

                {/* Inhalt — sauberes Kleintext-/Titel-Set über dem Bild.
                    Explizites z-10, damit der Text auch dann über Bild + Overlays
                    liegt, wenn ein mobiler Renderer die Stapelkontexte flacht. */}
                <div className="relative z-10 flex h-full flex-col justify-end p-7">
                  {(() => {
                    const Icon = WINE_ICON[item.icon];
                    return (
                      <span
                        className="ring-hairline mb-auto inline-flex items-center justify-center rounded-full bg-white/12 backdrop-blur-sm"
                        style={{ color: item.light || accent.light, width: "3.25rem", height: "3.25rem" }}
                      >
                        {Icon && <Icon className="h-7 w-7" aria-hidden="true" />}
                      </span>
                    );
                  })()}

                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.26em]"
                    style={{ color: item.light || accent.light }}
                  >
                    {item.kicker}
                  </p>
                  {item.title && (
                    <h3 className="mt-2 font-playfair text-[1.5rem] leading-snug text-ivory">{item.title}</h3>
                  )}
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-ivory/75">{item.text}</p>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Steuerung — Vor/Zurück + Punkt-Indikator */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Vorherige Karte"
            className="ring-hairline inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-charcoal shadow-chip transition-transform duration-300 ease-out-expo active:scale-90"
          >
            <ChevronRight className="h-5 w-5 rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Nächste Karte"
            className="ring-hairline inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-charcoal shadow-chip transition-transform duration-300 ease-out-expo active:scale-90"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-2" role="tablist" aria-label="Karten">
          {items.map((it, i) => {
            const active = i === index;
            return (
              <button
                key={it.kicker}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={it.kicker}
                onClick={() => {
                  setDir(i >= index ? 1 : -1);
                  setIndex(i);
                }}
                className="h-2 rounded-full transition-all duration-400 ease-out-expo"
                style={{
                  width: active ? "1.6rem" : "0.5rem",
                  background: active ? accent.deep : `${accent.deep}45`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
