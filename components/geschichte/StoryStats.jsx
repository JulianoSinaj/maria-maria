"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useSpring, useMotionValueEvent, useInView } from "motion/react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Glasses, GrapeVine, Book, Sun } from "@/components/Icons";
import { STORY_STATS } from "./storyData";

/* „Heute" in Zahlen — vier Stationen zwischen Haarlinien, wie die
   Fakten-Zeile eines Heftrückens. Die kleinen Kennzahlen (9 Weine,
   3 Regionen) rollen beim Eintritt ins Bild über eine Feder auf ihren
   Wert, statt hart dazustehen; die Jahreszahl 2019 bleibt bewusst
   stehen — ein Datum zählt nicht hoch. */

const ICONS = { glasses: Glasses, grapes: GrapeVine, book: Book, sun: Sun };

/* Haarlinien je Raster: einspaltig trennt oben, zweispaltig (sm) bekommt
   die rechte Spalte eine linke und die zweite Reihe eine obere Linie,
   vierspaltig (lg) trennt nur noch links. */
const DIVIDERS = [
  "",
  "border-t border-charcoal/[0.08] sm:border-t-0 sm:border-l",
  "border-t border-charcoal/[0.08] sm:border-t lg:border-t-0 lg:border-l",
  "border-t border-charcoal/[0.08] sm:border-t sm:border-l lg:border-t-0",
];

function SpringNumber({ value }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const spring = useSpring(0, { stiffness: 55, damping: 16, mass: 0.8 });
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (inView && !reduced) spring.set(value);
  }, [inView, reduced, spring, value]);

  useMotionValueEvent(spring, "change", (v) => setShown(Math.round(v)));

  return (
    <span ref={ref} className="tabular-nums">
      {reduced ? value : shown}
    </span>
  );
}

function StatFigure({ stat }) {
  const Icon = ICONS[stat.icon];
  return (
    <div className="flex h-full flex-col items-center px-6 py-6 text-center lg:py-2">
      {Icon && <Icon aria-hidden="true" className="h-6 w-6 text-champagne" />}
      {/* Kopfzeile: Kennzahl oder Leitwort */}
      {stat.text ? (
        <p className="mt-3 max-w-[18ch] text-[12px] font-semibold leading-snug text-charcoal">
          {stat.text}
        </p>
      ) : (
        <p className="mt-2.5 flex items-baseline gap-1.5 font-playfair text-charcoal">
          {stat.prefix && (
            <span className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/50">
              {stat.prefix}
            </span>
          )}
          <span className="text-[clamp(1.9rem,3vw,2.4rem)] leading-none text-bordeaux">
            {stat.plain ? stat.value : <SpringNumber value={stat.value} />}
          </span>
        </p>
      )}
      {stat.label && (
        <p className="mt-2 text-[12px] font-semibold leading-snug text-charcoal">{stat.label}</p>
      )}
      {stat.detail && (
        <p className="mt-1 text-[11.5px] leading-relaxed text-charcoal/55">{stat.detail}</p>
      )}
    </div>
  );
}

export default function StoryStats() {
  return (
    <Stagger
      className="grid grid-cols-1 border-y border-charcoal/10 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:py-8"
      gap={0.1}
    >
      {STORY_STATS.map((stat, i) => (
        <StaggerItem key={stat.icon} className={`border-charcoal/[0.08] ${DIVIDERS[i] || ""}`} y={18}>
          <StatFigure stat={stat} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
