"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ShopCard from "./ShopCard";
import Bottle from "@/components/Bottle";
import Button from "@/components/ui/Button";
import { Check } from "@/components/Icons";
import { WINES } from "@/components/data";

/* Maria Maria Selection — the client's character taxonomy as the filter:
   three tactile character cards (Corposo / Elegante / Fresco) with food
   pairings, sort chips, live count and a layout-animated grid. Tapping the
   active character again returns to the whole Selection. */

const CHARACTERS = [
  {
    type: "Rotwein",
    name: "Corposo",
    sub: "Kraftvoll & vollmundig",
    pairing: "zu Gegrilltem, Pasta und gereiftem Käse",
    variant: "red",
  },
  {
    type: "Weißwein",
    name: "Elegante",
    sub: "Fein & mineralisch",
    pairing: "zu Fisch, Meeresfrüchten und Antipasti",
    variant: "white",
  },
  {
    type: "Roséwein",
    name: "Fresco",
    sub: "Frisch & lebendig",
    pairing: "zum Aperitivo und zur leichten Sommerküche",
    variant: "rose",
  },
];

const SORTS = [
  { id: "empfohlen", label: "Empfohlen" },
  { id: "preis-auf", label: "Preis aufsteigend" },
  { id: "preis-ab", label: "Preis absteigend" },
];

const TAP_SPRING = { type: "spring", stiffness: 400, damping: 22 };
const GRID_SPRING = { type: "spring", stiffness: 300, damping: 30 };

export default function ShopExplorer() {
  const reduced = useReducedMotion();
  const [type, setType] = useState(null); // null = die ganze Selection
  const [sort, setSort] = useState(SORTS[0].id);

  const wines = useMemo(() => {
    const list = WINES.filter((w) => !type || w.type === type);
    if (sort === "preis-auf") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "preis-ab") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [type, sort]);

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
      {/* ---- character cards ---- */}
      <div role="group" aria-label="Weine nach Charakter wählen" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CHARACTERS.map((c) => {
          const active = type === c.type;
          const count = WINES.filter((w) => w.type === c.type).length;
          return (
            <motion.button
              key={c.type}
              type="button"
              onClick={() => setType(active ? null : c.type)}
              aria-pressed={active}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={TAP_SPRING}
              className={`group relative flex items-center gap-4 overflow-hidden rounded-card border p-4 pr-10 text-left shadow-luxe transition-[border-color,box-shadow,background-color] duration-500 hover:shadow-lift ${
                active
                  ? "border-bordeaux bg-gradient-to-br from-champagne-light/45 to-white/85"
                  : "border-stone/50 bg-white/70 hover:border-champagne/70"
              }`}
            >
              {/* selection check */}
              <span
                aria-hidden="true"
                className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-bordeaux text-ivory shadow-chip transition-transform duration-400 ease-out-expo ${
                  active ? "scale-100" : "scale-0"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
              </span>

              {/* mini stage */}
              <span className="relative flex h-20 w-14 shrink-0 items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-cream to-champagne-light/30 ring-1 ring-stone/50">
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: "radial-gradient(closest-side, rgba(200,183,122,0.32), transparent 72%)" }}
                />
                <Bottle
                  variant={c.variant}
                  className="relative h-14 pb-0 will-transform transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:rotate-[-2deg]"
                />
              </span>

              <span className="min-w-0">
                <span className="font-playfair text-[19px] italic leading-none text-bordeaux">{c.name}</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-charcoal/55">
                  {c.type} · {count} {count === 1 ? "Wein" : "Weine"}
                </span>
                <span className="mt-1.5 block text-[11.5px] leading-snug text-charcoal/65">
                  {c.sub} – {c.pairing}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ---- sort + live count ---- */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        {/* on phones the chips glide as one edge-to-edge strip instead of wrapping */}
        <div
          role="group"
          aria-label="Sortiment sortieren"
          className="no-scrollbar -mx-6 flex items-center gap-2 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          <span className="mr-1 shrink-0 text-[10.5px] uppercase tracking-[0.18em] text-charcoal/45">Sortieren</span>
          {SORTS.map((s) => {
            const active = s.id === sort;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSort(s.id)}
                aria-pressed={active}
                className={`h-11 shrink-0 select-none whitespace-nowrap rounded-full border px-4 text-[10.5px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                  active
                    ? "border-bordeaux bg-bordeaux text-ivory shadow-chip"
                    : "border-stone/70 bg-white/50 text-charcoal/60 hover:border-champagne/70 hover:text-bordeaux"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="ml-auto text-right">
          <p aria-live="polite" className="text-[11px] uppercase tracking-[0.18em] text-charcoal/55">
            <span className="mr-1.5 font-playfair text-[24px] normal-case tabular-nums tracking-normal text-bordeaux">
              {wines.length}
            </span>
            {wines.length === 1 ? "Wein" : "Weine"}
          </p>
          {/* fixed-height slot so the reset link never shifts layout */}
          <p className="mt-1 flex h-4 items-center justify-end text-[10.5px] text-charcoal/45">
            {type ? (
              <button
                type="button"
                onClick={() => setType(null)}
                className="font-medium text-bordeaux underline-offset-4 hover:underline"
              >
                Ganze Selection anzeigen
              </button>
            ) : (
              "Alle Preise inkl. MwSt., zzgl. Versand"
            )}
          </p>
        </div>
      </div>

      {/* ---- layout-animated grid ---- */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {wines.map((w) => (
            <motion.div key={w.name} {...itemMotion} className="h-full">
              <ShopCard wine={w} className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ---- empty state (safety net) ---- */}
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
          <div className="mt-7 flex justify-center">
            <Button variant="outline" size="sm" iconType="none" onClick={() => setType(null)}>
              Ganze Selection anzeigen
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
