"use client";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/* Filterleiste der Kollektion.

   Gestalterische Idee: die beiden Filter-Achsen dürfen nicht als zwei
   gleichfarbige Pillen-Reihen übereinander stehen — dann liest das Auge eine
   einzige zerbrochene Zeile. Stattdessen:

   • Weinart  = horizontale Segment-Schiene, links, mit *eigener Weinfarbe* je
     Sorte. Die aktive Pille gleitet per layoutId und wechselt dabei ihren
     Farbverlauf: Bordeaux → Stroh-Gold → Rosé. Der Filter schmeckt nach dem
     Wein, den er zeigt.
   • Region   = rechts auf derselben Achse, ein ruhiger, typografischer
     Trigger, der ein Popover mit Karten-Punkten öffnet. Untergeordnet,
     kein Farbwettbewerb, keine zweite Reihe.

   Alle Bewegungen laufen über Federn; sämtliche Zustände sind reine
   transform/opacity-Wechsel — die Leiste behält ihre Höhe, egal was aktiv ist.
*/

const PILL_SPRING = { type: "spring", stiffness: 340, damping: 32, mass: 0.7 };
const POP_SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.6 };

/* Farbwelt je Weinart, geschlüsselt auf typeKey (all/red/white/rose).
   Farbwerte sind sprachneutral — vorher lag die Zuordnung auf den deutschen
   Bezeichnungen und hätte außerhalb des Deutschen keine Farbe gefunden. */
export const TYPE_THEME = {
  all: {
    fill: "linear-gradient(135deg,#1B1B1B 0%,#3A2A26 100%)",
    ink: "#F7F4EF",
    dot: "#C8B77A",
  },
  red: {
    fill: "linear-gradient(135deg,#6B0F1A 0%,#8A2B2F 100%)",
    ink: "#F7F4EF",
    dot: "#6B0F1A",
  },
  white: {
    fill: "linear-gradient(135deg,#D3C56E 0%,#E8DC9A 100%)",
    ink: "#3A3113",
    dot: "#D3C56E",
  },
  rose: {
    fill: "linear-gradient(135deg,#C67F78 0%,#E3B3AC 100%)",
    ink: "#42201D",
    dot: "#C67F78",
  },
};

/* ------------------------------------------------------------------ */
/* Weinart — Segment-Schiene mit gleitender, mitfärbender Pille        */
/* ------------------------------------------------------------------ */

/* `types` sind Schlüssel (all/red/white/rose), `labels` die Übersetzung
   dazu. Beides getrennt zu führen ist der Kern der Umstellung: Der Zustand
   des Filters darf sich nicht ändern, wenn der Besucher die Sprache wechselt. */
function TypeRail({ types, labels, value, onChange, reduced }) {
  return (
    <div
      role="group"
      aria-label={labels?.byType}
      data-lenis-prevent-horizontal
      /* Kantenfade + nativer Wisch wie im SubNav — unterhalb lg scrollbar */
      className="no-scrollbar -mx-6 snap-x overflow-x-auto scroll-pl-6 px-6 [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] lg:mx-0 lg:overflow-visible lg:px-0 lg:[mask-image:none]"
    >
      <div className="relative inline-flex items-center gap-0.5 rounded-full border border-stone/50 bg-white/60 p-1.5 backdrop-blur-sm">
        {types.map((t) => {
          const active = t === value;
          const theme = TYPE_THEME[t] ?? TYPE_THEME.all;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              aria-pressed={active}
              className="group relative h-11 shrink-0 select-none rounded-full px-4 text-[11.5px] font-semibold uppercase tracking-[0.14em] outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/45 sm:px-5"
              style={{ color: active ? theme.ink : undefined, willChange: "transform" }}
            >
              {active && (
                <motion.span
                  layoutId="weine-type-pill"
                  aria-hidden="true"
                  transition={reduced ? { duration: 0 } : PILL_SPRING}
                  className="absolute inset-0 rounded-full shadow-chip"
                  style={{ background: theme.fill, willChange: "transform" }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  active ? "" : "text-charcoal/55 group-hover:text-bordeaux"
                }`}
              >
                {labels?.[t] ?? t}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Region — stiller Trigger + Popover mit Herkunfts-Punkten            */
/* ------------------------------------------------------------------ */

function RegionSelect({ regions, labels, value, onChange, counts, allLabel, reduced }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const listId = useId();
  const isAll = value === allLabel;

  /* Klick daneben und Escape schließen das Popover */
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Weine nach Region filtern"
        className="group flex h-11 select-none items-center gap-2.5 rounded-full border border-stone/50 bg-white/60 pl-4 pr-3.5 outline-none backdrop-blur-sm transition-colors duration-300 hover:border-champagne/70 focus-visible:ring-2 focus-visible:ring-bordeaux/45"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40">Region</span>
        <span
          className={`text-[11.5px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
            isAll ? "text-charcoal/70" : "text-bordeaux"
          }`}
        >
          {isAll ? "Alle" : value}
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduced ? { duration: 0 } : POP_SPRING}
          className="grid h-6 w-6 place-items-center text-charcoal/45"
          style={{ willChange: "transform" }}
        >
          <svg viewBox="0 0 12 8" className="h-2.5 w-2.5" fill="none" aria-hidden="true">
            <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listId}
            role="listbox"
            aria-label="Regionen"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={reduced ? { duration: 0.15 } : POP_SPRING}
            className="glass absolute right-0 top-[calc(100%+0.6rem)] z-30 w-[15.5rem] origin-top-right overflow-hidden rounded-card p-1.5 shadow-glass"
            style={{ willChange: "transform, opacity" }}
          >
            {regions.map((r) => {
              const active = r === value;
              const n = counts[r] ?? 0;
              return (
                <button
                  key={r}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(r);
                    setOpen(false);
                  }}
                  className={`group flex w-full items-center gap-3 rounded-full px-3.5 py-2.5 text-left outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-bordeaux/40 ${
                    active ? "bg-bordeaux/[0.07]" : "hover:bg-charcoal/[0.04]"
                  }`}
                >
                  {/* Herkunfts-Punkt: ein Ring, der sich bei Auswahl füllt */}
                  <span
                    aria-hidden="true"
                    className={`h-[7px] w-[7px] shrink-0 rounded-full border transition-colors duration-300 ${
                      active ? "border-bordeaux bg-bordeaux" : "border-charcoal/25 bg-transparent group-hover:border-bordeaux/60"
                    }`}
                  />
                  <span
                    className={`flex-1 text-[11.5px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                      active ? "font-semibold text-bordeaux" : "text-charcoal/70 group-hover:text-charcoal"
                    }`}
                  >
                    {labels?.[r] ?? r}
                  </span>
                  <span className="font-playfair text-[13px] tabular-nums text-charcoal/35">{n}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function WineFilterBar({
  types,
  typeLabels,
  labels,
  type,
  onType,
  regions,
  regionLabels,
  region,
  onRegion,
  regionCounts,
  count,
  onReset,
}) {
  const reduced = useReducedMotion();
  const dirty = type !== types[0] || region !== regions[0];

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-4 lg:flex-nowrap">
        <TypeRail types={types} labels={typeLabels} value={type} onChange={onType} reduced={reduced} />

        {/* Haarlinie trennt die beiden Achsen, statt sie zu stapeln */}
        <span aria-hidden="true" className="hidden h-8 w-px shrink-0 bg-charcoal/10 lg:block" />

        <RegionSelect
          regions={regions}
          labels={regionLabels}
          value={region}
          onChange={onRegion}
          counts={regionCounts}
          allLabel={regionLabels?.all ?? regions[0]}
          reduced={reduced}
        />

        {/* Zurücksetzen erscheint nur, wenn wirklich gefiltert wird —
            als Breiten-Kollaps, damit die Zeile nicht springt */}
        <AnimatePresence initial={false}>
          {dirty && (
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, width: 0 }}
              transition={reduced ? { duration: 0.15 } : PILL_SPRING}
              className="overflow-hidden"
            >
              <button
                type="button"
                onClick={onReset}
                className="group flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[10.5px] uppercase tracking-[0.16em] text-charcoal/45 outline-none transition-colors duration-300 hover:text-bordeaux focus-visible:ring-2 focus-visible:ring-bordeaux/40"
              >
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
                  <path d="M2.5 2.5 9.5 9.5M9.5 2.5 2.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {labels?.reset}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zähler ganz rechts auf derselben Achse */}
        <p
          aria-live="polite"
          className="ml-auto flex shrink-0 items-baseline gap-1.5 text-[10.5px] uppercase tracking-[0.18em] text-charcoal/50"
        >
          <span className="font-playfair text-[26px] normal-case tabular-nums tracking-normal text-bordeaux">
            {count}
          </span>
          {count === 1 ? labels?.wineOne : labels?.wineMany}
        </p>
      </div>

      {/* Farbfaden: nimmt den Ton der aktiven Weinart auf und spannt sich
          unter die ganze Leiste — das visuelle Bindeglied der beiden Achsen */}
      <div aria-hidden="true" className="relative mt-5 h-px w-full bg-charcoal/10">
        <motion.span
          animate={{ background: (TYPE_THEME[type] ?? TYPE_THEME.all).fill }}
          transition={reduced ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 left-0 w-24 rounded-full"
        />
      </div>
    </div>
  );
}
