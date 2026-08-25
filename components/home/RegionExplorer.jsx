"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import Button from "@/components/ui/Button";
import { photoSrcSet } from "@/components/media/Photo";
import { SCROLL_SPRING } from "@/components/motion/springs";

/* Region explorer — die drei Weinherkünfte als Foto-Karten.

   EINE Komponente, EIN DOM für alle Breiten (Homepage-Brief §4,
   „Responsive"): Jede Herkunft hat genau ein <img> mit Alt-Text und genau
   eine <h3>. Vorher standen Desktop-Bühne und Telefon-Stapel als zwei
   getrennte Bäume nebeneinander (per md:hidden / md:flex umgeschaltet), und
   die offene Desktop-Karte trug ihre Überschrift ein zweites Mal in der
   Glasleiste — sechs H3 und sechs Fotos für drei Herkünfte. Jetzt wechselt
   nur das Layout per CSS:

     ab md   drei Karten nebeneinander in einer 2.2:1-Bühne; die Karte unter
             dem Cursor (oder mit Fokus) wächst auf ~16:9 (GROW), die
             Nachbarn schrumpfen zu abgedunkelten Bildstreifen. Die
             Beschriftung liegt als Leiste knapp über dem unteren Bildrand;
             beim Öffnen frostet sie zu Liquid Glass und klappt Text und CTA
             darunter aus.
     < md    dieselben Karten gestapelt; ein Tipp auf die Kopfzeile klappt
             Text und CTA aus (aria-expanded), eine Karte zur Zeit.

   Motion contract — eine Uhr für den Wechsel, damit nichts stapelt:
   flex-grow, Scrim, Abdunkelung, Foto-Zoom und Glas laufen im selben
   560-ms-Fenster auf derselben cubic-bezier; der Detailblock klappt in
   340 ms auf, sein Inhalt blendet nach OUT ein (ausgehend räumt zuerst,
   eingehend folgt). Die Fotos driften auf einer scroll-getriebenen Feder
   (Parallax-Tiefe); Drift (Wrapper) und Zoom (img) leben auf getrennten
   Ebenen — reine GPU-Transforms, nie ein Layout-Shift.

   Zeiger-Regeln: Öffnen per Hover gilt nur für die Maus (pointerType) — ein
   Tipp auf dem Telefon löste sonst erst „hover" und dann den Toggle aus und
   schlösse die Karte im selben Moment wieder. Fokus öffnet nur, wenn die
   Karte SELBST fokussiert wird, nicht der Knopf darin (derselbe Grund). */

const EASE = [0.4, 0, 0.2, 1]; // cubic-bezier(0.4, 0, 0.2, 1)
const OUT = 0.18; // s — ausgehender Inhalt räumt zuerst
const IN = 0.38; // s — eingehender Inhalt folgt
const SWAP_MS = 560; // (OUT + IN) * 1000 — CSS-Layer nutzen dasselbe Fenster
const GROW = 10.5; // Gewicht der offenen Karte vs. 1 für den Rest — zusammen
// mit dem 2.2:1-Seitenverhältnis der Bühne landet die offene Karte bei ~16:9,
// das Foto erscheint also in voller Breite (samt der eingezeichneten
// Italien-Karte am rechten Rand); die Nachbarn bleiben schmale Bildstreifen

const FADE_OUT = { duration: OUT, ease: EASE };
const FADE_IN = { duration: IN, delay: OUT, ease: EASE };
const ZOOM = { duration: SWAP_MS / 1000, ease: EASE };
const UNFOLD = { duration: 0.34, ease: EASE };
const INSTANT = { duration: 0 };

/* Specular-Details, die den Frost "flüssig" wirken lassen: eine helle
   Lichtkante entlang des oberen Rands plus ein weicher, schräger Sheen. */
function GlassLight() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/4 -top-3/4 h-[170%] w-2/3 rotate-12 bg-gradient-to-b from-white/10 to-transparent blur-2xl"
      />
    </>
  );
}

/* Das Foto einer Karte — das eine <img> der Herkunft, mit Alt-Text (Brief
   §7), lazy, mit den Kantenlängen der Quelle (1600 × 900, 16:9). Ruhezustand:
   Overscan (scale 1.12) trägt den Parallax-Drift, der pos-Crop hält das
   Motiv im Bild und die eingezeichnete Italien-Karte außerhalb. Offen:
   Overscan und Drift weichen (scale → 1.02, Drift-Anteil federt → 0),
   objectPosition zentriert — die Karte ist dann ~16:9 wie das Foto selbst. */
function CardPhoto({ region, drift, active, reduced }) {
  // Drift-Anteil dieser Karte: 1 in Ruhe, 0 sobald sie offen ist. Die Feder
  // ist straffer als der 560ms-Zoom, damit der schrumpfende Overscan während
  // der Blende nie eine Kante freigibt.
  const driftFactor = useSpring(1, { stiffness: 300, damping: 34 });
  useEffect(() => {
    driftFactor.set(active ? 0 : 1);
  }, [active, driftFactor]);
  const y = useTransform([drift, driftFactor], ([d, f]) => `${parseFloat(d) * f}%`);
  return (
    <motion.div style={reduced ? undefined : { y, willChange: "transform" }} className="absolute inset-0">
      {/* srcSet direkt am <img> statt über <Photo>: der Zoom beim Öffnen
          läuft über framer-motion, das Element muss also ein motion.img
          bleiben. Die Quellen sind ohnehin WebP — ein <picture>-Fallback
          hätte nichts zu tun. */}
      <motion.img
        src={region.img}
        srcSet={photoSrcSet(region.img) ?? undefined}
        /* Gestapelt volle Breite; ab md nimmt die offene Karte gut die halbe
           Bühne — 50vw deckt beide Zustände ohne Nachladen. */
        sizes="(min-width: 768px) 50vw, 100vw"
        alt={region.alt ?? ""}
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
        initial={false}
        animate={{
          scale: active ? 1.02 : reduced ? 1.04 : 1.12,
          objectPosition: active ? "50% 50%" : region.pos,
        }}
        transition={reduced ? INSTANT : ZOOM}
        style={{ willChange: "transform" }}
        className="pointer-events-none h-full w-full object-cover"
      />
    </motion.div>
  );
}

export default function RegionExplorer({ regions, ctaLabel }) {
  const [open, setOpen] = useState(null); // Index der offenen Karte
  const reduced = useReducedMotionSafe();
  const baseId = useId();

  // Scroll-Parallax für die Fotos — eine Bühne, ein Ref, ein Fortschritt.
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });
  // roher Fortschritt → sanfter vertikaler Drift, geglättet durch die Feder.
  const driftRaw = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const drift = useSpring(driftRaw, SCROLL_SPRING);

  const mouseOnly = (e, next) => {
    if (e.pointerType === "mouse") setOpen(next);
  };

  return (
    <div
      ref={stageRef}
      onPointerLeave={(e) => mouseOnly(e, null)}
      className="flex flex-col gap-3.5 md:aspect-[2.2/1] md:flex-row md:gap-4 lg:gap-5"
    >
      {regions.map((r, i) => {
        const isOpen = open === i;
        const dimmed = open !== null && !isOpen;
        const panelId = `${baseId}${r.region}`;
        return (
          <div
            key={r.region}
            tabIndex={0}
            onPointerEnter={(e) => mouseOnly(e, i)}
            onFocus={(e) => {
              if (e.target === e.currentTarget) setOpen(i);
            }}
            /* flex-grow trägt nur in der Reihe (ab md); im Stapel hat der
               Wert keine Wirkung, weil der Container keine feste Höhe hat. */
            style={{
              flexGrow: isOpen ? GROW : 1,
              transition: `flex-grow ${SWAP_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              willChange: "flex-grow",
            }}
            className="group relative overflow-hidden rounded-card-lg bg-espresso shadow-luxe outline-none transition-shadow duration-500 focus-visible:ring-2 focus-visible:ring-champagne/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory md:min-w-0 md:basis-0"
          >
            <CardPhoto region={r} drift={drift} active={isOpen} reduced={reduced} />

            {/* Lesbarkeits-Scrim hinter der Beschriftung — gestapelt über die
                ganze Karte, ab md auf die untere Hälfte begrenzt; weicht
                zurück, sobald die Glasleiste übernimmt */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/30 to-transparent transition-opacity duration-[560ms] ease-standard md:via-25% md:to-55% ${
                isOpen ? "md:opacity-35" : ""
              }`}
            />

            {/* Die Leiste: im Stapel im Fluss (sie gibt der Karte ihre Höhe),
                ab md schwebend knapp über dem unteren Bildrand. Auf den
                schmalen Nachbar-Streifen blendet sie ganz aus, statt zu
                Fragmenten gestutzt zu werden. */}
            <div
              className={`relative transition-opacity duration-[560ms] ease-standard md:absolute md:inset-x-3.5 md:bottom-3.5 lg:inset-x-4 lg:bottom-4 ${
                dimmed ? "md:opacity-0" : ""
              }`}
            >
              {/* Liquid Glass — nur ab md, und nur solange die Karte offen ist */}
              <div
                aria-hidden="true"
                className={`glass-dark pointer-events-none absolute inset-0 hidden overflow-hidden rounded-[22px] transition-opacity duration-[560ms] ease-standard md:block ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                <GlassLight />
              </div>

              {/* Kopfzeile: Rubrik + die eine H3. Im Stapel ist die ganze
                  Kopfzeile das Tippziel — der Knopf deckt sie über sein
                  ::before ab (ein Tabstopp, echte button-Semantik, die H3
                  bleibt außerhalb des Knopfs, weil ein <button> keine
                  Überschrift enthalten darf). Ab md gibt es keinen Knopf:
                  dort öffnen Hover und Fokus. */}
              <div className="relative flex items-end justify-between gap-4 px-5 pb-4 pt-20 md:block md:px-6 md:pb-4 md:pt-5 lg:px-7">
                <div className="min-w-0">
                  <p className="truncate text-[10px] uppercase tracking-[0.22em] text-champagne-light">{r.tag}</p>
                  <h3 className="mt-1 truncate font-playfair text-[22px] text-ivory md:text-[24px] lg:text-[26px]">
                    {r.name}
                  </h3>
                </div>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={r.name}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="shrink-0 outline-none before:absolute before:inset-0 before:content-[''] md:hidden"
                >
                  {/* Plus → Minus als Aufklapp-Zeichen */}
                  <span
                    aria-hidden="true"
                    className="glass relative mb-1 grid h-9 w-9 place-items-center rounded-full"
                  >
                    <span className="absolute h-[1.5px] w-3.5 rounded-full bg-charcoal/80" />
                    <span
                      className={`absolute h-[1.5px] w-3.5 rounded-full bg-charcoal/80 transition-transform duration-[560ms] ease-standard ${
                        isOpen ? "rotate-0" : "rotate-90"
                      }`}
                    />
                  </span>
                </button>
              </div>

              {/* Detailblock — Text und CTA. Klappt über die Höhe auf; die
                  Leiste ist ab md absolut, der Rest der Seite bewegt sich
                  also nie. `inert` hält den Link aus der Tab-Reihenfolge,
                  solange er unsichtbar ist. */}
              <motion.div
                id={panelId}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={
                  reduced ? INSTANT : { height: UNFOLD, opacity: isOpen ? FADE_IN : FADE_OUT }
                }
                inert={isOpen ? undefined : ""}
                style={{ pointerEvents: isOpen ? "auto" : "none", willChange: "height, opacity" }}
                className="relative overflow-hidden"
              >
                <div className="flex flex-col gap-4 bg-espresso/65 px-5 pb-5 pt-4 backdrop-blur-[14px] md:flex-row md:items-center md:justify-between md:gap-6 md:bg-transparent md:px-6 md:pb-5 md:pt-0 md:backdrop-blur-none lg:px-7">
                  <p className="text-[13px] leading-relaxed text-ivory/80 md:line-clamp-2 md:max-w-[560px] md:text-[12.5px] md:text-ivory/75">
                    {r.long || r.desc}
                  </p>
                  <div className="shrink-0">
                    <Button href={`/regionen#${r.region}`} size="sm" magnetic={false}>
                      {r.cta || ctaLabel}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Nachbarn dunkeln ab, während eine Karte die Bühne hält —
                zuletzt gemalt, damit sie im Stapel auch die Kopfzeile deckt;
                Taps gehen durch */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-espresso/50 transition-opacity duration-[560ms] ease-standard ${
                dimmed ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
