"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Button from "@/components/ui/Button";
import ItalyMap from "@/components/ItalyMap";

/* Region explorer — drei eigenständige Foto-Karten statt einer gemeinsamen
   Karten-Bühne. Jede Region bringt ihr eigenes Landschaftsfoto mit (inklusive
   der eingezeichneten Italien-Silhouette); die Fotos driften auf einer
   scroll-getriebenen Feder (Parallax-Tiefe). Die Karte unter dem Cursor
   öffnet sich auf die volle Breite ihres Fotos (~16:9, inklusive der
   Italien-Karte am rechten Bildrand), die Nachbarn schrumpfen zu schmalen,
   abgedunkelten Bildstreifen.

   Motion contract — eine Uhr für den ganzen Wechsel, damit nichts stapelt:
     Phase 1 (0 → OUT)      ausgehende Karte + eingehender Titel blenden AUS
     Phase 2 (OUT → OUT+IN) eingehende Karte + ausgehender Titel blenden EIN
   Scrim, Abdunkelung, Foto-Zoom und der flex-grow der Karte laufen über
   dasselbe 560ms-Fenster auf derselben cubic-bezier, so landen Ausdehnung
   und Vordergrund-Karte gemeinsam.
   Karten bleiben gemountet und werden über `animate` getrieben (kein
   AnimatePresence auf der Desktop-Bühne) — Enter/Exit-Überlappung war es,
   die den Geistertext erzeugte. */

const EASE = [0.4, 0, 0.2, 1]; // cubic-bezier(0.4, 0, 0.2, 1)
const OUT = 0.18; // s — ausgehender Inhalt räumt zuerst
const IN = 0.38; // s — eingehender Inhalt folgt
const SWAP_MS = 560; // (OUT + IN) * 1000 — CSS-Layer nutzen dasselbe Fenster
const GROW = 10.5; // Gewicht der aktiven Karte vs. 1 für den Rest — zusammen
// mit dem 2.2:1-Seitenverhältnis der Bühne landet die offene Karte bei ~16:9,
// das Foto erscheint also in voller Breite (samt der eingezeichneten
// Italien-Karte am rechten Rand); die Nachbarn bleiben schmale Bildstreifen

const FADE_OUT = { duration: OUT, ease: EASE };
const FADE_IN = { duration: IN, delay: OUT, ease: EASE };
const ZOOM = { duration: SWAP_MS / 1000, ease: EASE };
const INSTANT = { duration: 0 };

function DetailCard({ region, compact = false }) {
  return (
    <div className={`rounded-card bg-ivory shadow-lift ring-1 ring-stone/60 ${compact ? "p-5" : "p-6"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-bordeaux">{region.tag}</p>
          <h3 className="mt-1 font-playfair text-[clamp(20px,2vw,26px)] text-charcoal">{region.name}</h3>
        </div>
        <span className="shrink-0 rounded-2xl bg-gradient-to-br from-espresso to-charcoal p-2">
          <ItalyMap region={region.region} ghost className="w-9" />
        </span>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">{region.long || region.desc}</p>
      {region.grapes?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {region.grapes.map((g) => (
            <span
              key={g}
              className="rounded-full border border-stone/70 bg-cream px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-charcoal/60"
            >
              {g}
            </span>
          ))}
        </div>
      )}
      <div className="mt-5">
        <Button href={`/regionen#${region.region}`} size="sm" magnetic={false}>
          Mehr entdecken
        </Button>
      </div>
    </div>
  );
}

/* Das Regionsfoto einer Karte. Ruhezustand: Overscan (scale 1.12) trägt den
   Parallax-Drift, der pos-Crop hält das Motiv im Bild und die eingezeichnete
   Italien-Karte außerhalb. Offen: Overscan und Drift weichen (scale → 1.02,
   Drift-Anteil federt → 0), objectPosition zentriert — die Karte ist dann
   ~16:9 wie das Foto selbst, es erscheint in voller Breite samt der
   Italien-Karte am rechten Rand. Drift (Wrapper) und Zoom (img) leben auf
   getrennten Ebenen — reine GPU-Transforms, nie ein Layout-Shift. */
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
    <motion.div
      aria-hidden="true"
      style={reduced ? undefined : { y, willChange: "transform" }}
      className="absolute inset-0"
    >
      <motion.img
        src={region.img}
        alt=""
        loading="lazy"
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

export default function RegionExplorer({ regions }) {
  const [active, setActive] = useState(null); // Desktop: Karte unter Cursor/Fokus
  const [open, setOpen] = useState(null); // Mobil: aufgeklappte Karte
  const reduced = useReducedMotion();

  // Scroll-Parallax für die Fotos. Desktop- und Mobil-Bühne brauchen je einen
  // eigenen Target-Ref: die per display:none versteckte hat keine Geometrie,
  // ein geteiltes useScroll meldete dort einen toten Fortschritt.
  const stageRef = useRef(null);
  const mobileStageRef = useRef(null);
  const SPRING_CFG = { stiffness: 120, damping: 30, mass: 0.6 };
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: mobileProgress } = useScroll({
    target: mobileStageRef,
    offset: ["start end", "end start"],
  });
  // roher Fortschritt → sanfter vertikaler Drift, geglättet durch die Feder.
  const driftRaw = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const drift = useSpring(driftRaw, SPRING_CFG);
  const mobileDriftRaw = useTransform(mobileProgress, [0, 1], ["-6%", "6%"]);
  const mobileDrift = useSpring(mobileDriftRaw, SPRING_CFG);

  return (
    <>
      {/* ============ DESKTOP — drei wachsende Foto-Karten ============ */}
      <div
        ref={stageRef}
        onMouseLeave={() => setActive(null)}
        className="hidden aspect-[2.2/1] gap-4 md:flex lg:gap-5"
      >
        {regions.map((r, i) => {
          const isActive = active === i;
          const dimmed = active !== null && !isActive;
          return (
            <div
              key={r.region}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              style={{
                flexGrow: isActive ? GROW : 1,
                transition: `flex-grow ${SWAP_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                willChange: "flex-grow",
              }}
              className="group relative min-w-0 basis-0 overflow-hidden rounded-card-lg bg-espresso shadow-luxe outline-none transition-shadow duration-500 focus-visible:ring-2 focus-visible:ring-champagne/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              <CardPhoto region={r} drift={drift} active={isActive} reduced={reduced} />

              {/* Lesbarkeits-Scrim hinter dem ruhenden Titel — weicht zurück,
                  sobald die elfenbeinfarbene Detail-Karte übernimmt */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-espresso/85 via-espresso/35 to-transparent transition-opacity duration-[560ms] ease-standard ${
                  isActive ? "opacity-35" : "opacity-100"
                }`}
              />

              {/* Nachbarn dunkeln leicht ab, während eine Karte die Bühne hält */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-espresso/50 transition-opacity duration-[560ms] ease-standard ${
                  dimmed ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Ruhezustand — Regionsname am unteren Rand. Räumt, bevor die
                  Karte kommt; auf den schmalen Nachbar-Streifen verschwindet
                  er ganz, statt zu Fragmenten gestutzt zu werden. */}
              <motion.div
                initial={false}
                animate={{ opacity: isActive || dimmed ? 0 : 1, y: isActive ? -8 : 0 }}
                transition={reduced ? INSTANT : isActive || dimmed ? FADE_OUT : FADE_IN}
                style={{ willChange: "transform, opacity" }}
                className="pointer-events-none absolute inset-x-0 bottom-0 p-6"
              >
                <p className="truncate text-[10px] uppercase tracking-[0.22em] text-champagne-light">{r.tag}</p>
                <h3 className="mt-1 truncate font-playfair text-[24px] text-ivory lg:text-[27px]">{r.name}</h3>
              </motion.div>

              {/* Fokuszustand — Detail-Karte über die volle Kartenbreite. Ihr
                  Fade-in endet genau, wenn der flex-grow settelt, damit der
                  Text-Umbruch unter der Blende passiert statt danach. */}
              <motion.div
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
                transition={reduced ? INSTANT : isActive ? FADE_IN : FADE_OUT}
                inert={isActive ? undefined : ""}
                style={{ willChange: "transform, opacity", pointerEvents: isActive ? "auto" : "none" }}
                className="absolute inset-x-5 bottom-5 max-w-[560px] lg:inset-x-7 lg:bottom-7"
              >
                <DetailCard region={r} />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* ============ MOBIL — drei gestapelte Foto-Karten, Tippen klappt auf ============ */}
      {/* Gleicher Motion-Vertrag wie auf dem Desktop: die Fotos driften auf
          ihrer eigenen Scroll-Feder, geschlossene Nachbarn dunkeln ab — alle
          Ebenen teilen die 560ms-ease-standard-Uhr des Höhenwechsels. */}
      <div ref={mobileStageRef} className="space-y-3.5 md:hidden">
        {regions.map((r, i) => {
          const isOpen = open === i;
          const dimmed = open !== null && !isOpen;
          return (
            <div
              key={r.region}
              className="relative overflow-hidden rounded-card-lg bg-espresso shadow-luxe"
            >
              <CardPhoto region={r} drift={mobileDrift} active={isOpen} reduced={reduced} />

              {/* Lesbarkeits-Scrim hinter der Titelzeile */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/30 to-transparent"
              />

              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="relative block w-full text-left"
              >
                {/* eigener Scrim der Titelzeile — der Karten-Scrim wandert beim
                    Aufklappen nach unten mit, die Zeile bleibt so lesbar */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-espresso/60 via-espresso/25 to-transparent"
                />
                <span className="relative flex items-end justify-between gap-4 px-5 pb-4 pt-20">
                  <span className="min-w-0">
                    <span className="block truncate text-[9.5px] uppercase tracking-[0.22em] text-champagne-light">
                      {r.tag}
                    </span>
                    <span className="mt-0.5 block truncate font-playfair text-[22px] text-ivory">{r.name}</span>
                  </span>
                  {/* Plus → Minus als Aufklapp-Zeichen */}
                  <span
                    aria-hidden="true"
                    className="glass relative mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-full"
                  >
                    <span className="absolute h-[1.5px] w-3.5 rounded-full bg-charcoal/80" />
                    <span
                      className={`absolute h-[1.5px] w-3.5 rounded-full bg-charcoal/80 transition-transform duration-[560ms] ease-standard ${
                        isOpen ? "rotate-0" : "rotate-90"
                      }`}
                    />
                  </span>
                </span>
              </button>

              {/* Eine Karte ist zur Zeit offen: schließende und öffnende Karte
                  teilen dieselbe Höhenkurve, die Detail-Karte blendet erst
                  ein, wenn die ausgehende gegangen ist. */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: reduced
                        ? INSTANT
                        : { height: { duration: 0.34, ease: EASE }, opacity: FADE_IN },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: reduced
                        ? INSTANT
                        : { height: { duration: 0.34, ease: EASE }, opacity: FADE_OUT },
                    }}
                    className="relative overflow-hidden"
                  >
                    <div className="px-4 pb-5">
                      <DetailCard region={r} compact />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* geschlossene Karten dunkeln ab, während eine die Bühne hält —
                  zuletzt gemalt, damit sie den Kopf überdeckt; Taps gehen durch */}
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
    </>
  );
}
