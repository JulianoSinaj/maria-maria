"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import WineCard from "@/components/WineCard";
import Button from "@/components/ui/Button";
import { WINES } from "@/components/data";

/* Interactive collection explorer — pill tabs for the wine type with a
   spring-sliding active pill (layoutId), toggle chips for regions, and a
   layout-animated product grid. All motion is spring-driven, no layout shift
   inside the controls themselves. */

const TYPES = ["Alle Weine", "Rotwein", "Weißwein", "Roséwein"];
// derived from the catalogue so a chip can never point at zero wines
const REGIONS = ["Alle Regionen", ...new Set(WINES.map((w) => w.region))];

const PILL_SPRING = { type: "spring", stiffness: 350, damping: 30 };
const GRID_SPRING = { type: "spring", stiffness: 300, damping: 30 };

export default function WineExplorer() {
  const reduced = useReducedMotion();
  const [type, setType] = useState(TYPES[0]);
  const [region, setRegion] = useState(REGIONS[0]);

  const wines = useMemo(
    () =>
      WINES.filter(
        (w) =>
          (type === "Alle Weine" || w.type === type) &&
          (region === "Alle Regionen" || w.region === region)
      ),
    [type, region]
  );

  const reset = () => {
    setType(TYPES[0]);
    setRegion(REGIONS[0]);
  };

  const itemMotion = reduced
    ? {}
    : {
        layout: true,
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
        transition: { ...GRID_SPRING, opacity: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
      };

  return (
    <div>
      {/* ---- filter head ---- */}
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="min-w-0">
          {/* type tabs — sliding active pill */}
          <div
            role="group"
            aria-label="Weine nach Weinart filtern"
            className="no-scrollbar -mx-6 overflow-x-auto px-6 lg:mx-0 lg:px-0"
          >
            <div className="inline-flex items-center gap-1 rounded-full border border-stone/60 bg-white/70 p-1.5 shadow-luxe">
              {TYPES.map((t) => {
                const active = t === type;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    aria-pressed={active}
                    className={`relative h-11 shrink-0 select-none rounded-full px-4 text-[11.5px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 sm:px-5 ${
                      active ? "text-ivory" : "text-charcoal/60 hover:text-bordeaux"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="weine-type-pill"
                        aria-hidden="true"
                        transition={reduced ? { duration: 0 } : PILL_SPRING}
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-bordeaux to-wine shadow-chip"
                        style={{ willChange: "transform" }}
                      />
                    )}
                    <span className="relative z-10">{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* region chips */}
          <div role="group" aria-label="Weine nach Region filtern" className="mt-4 flex flex-wrap items-center gap-2">
            {REGIONS.map((r) => {
              const active = r === region;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  aria-pressed={active}
                  className={`h-11 select-none rounded-full border px-4 text-[10.5px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    active
                      ? "border-bordeaux bg-bordeaux text-ivory shadow-chip"
                      : "border-stone/70 bg-white/50 text-charcoal/60 hover:border-champagne/70 hover:text-bordeaux"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* live count */}
        <p aria-live="polite" className="text-[11px] uppercase tracking-[0.18em] text-charcoal/55">
          <span className="mr-1.5 font-playfair text-[24px] normal-case tabular-nums tracking-normal text-bordeaux">
            {wines.length}
          </span>
          {wines.length === 1 ? "Wein" : "Weine"}
        </p>
      </div>

      {/* ---- layout-animated grid ---- */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {wines.map((w) => (
            <motion.div key={w.name} {...itemMotion} className="h-full">
              <WineCard wine={w} className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ---- empty state ---- */}
      {wines.length === 0 && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          className="rounded-card-lg border border-dashed border-stone/80 bg-white/50 px-8 py-16 text-center"
        >
          <p className="font-playfair text-[22px] text-charcoal">
            Für diese Auswahl führen wir <span className="italic text-bordeaux">derzeit keinen Wein.</span>
          </p>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-charcoal/65">
            Probieren Sie eine andere Kombination aus Weinart und Region – oder entdecken Sie die gesamte Kollektion.
          </p>
          <div className="mt-7 flex justify-center">
            <Button variant="outline" size="sm" iconType="none" onClick={reset}>
              Filter zurücksetzen
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
