"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import WineCard from "@/components/WineCard";
import Button from "@/components/ui/Button";
import WineFilterBar from "@/components/weine/WineFilterBar";
import { WINES } from "@/components/data";

/* Interactive collection explorer — die Filterleiste (WineFilterBar) legt die
   beiden Achsen nebeneinander statt übereinander: links die Weinart als
   mitfärbende Segment-Schiene, rechts die Region als stilles Popover. Darunter
   ein layout-animiertes Raster. Alle Bewegung federgetrieben, kein Layout-Shift
   in den Bedienelementen selbst. */

const TYPES = ["Alle Weine", "Rotwein", "Weißwein", "Roséwein"];
/* ?art=… deep-links from the header dropdown straight into a filtered view */
export const ART_PARAM = { rot: "Rotwein", weiss: "Weißwein", rose: "Roséwein" };
/* ?region=… tut dasselbe für die Herkunft — die Regionen-Seite verlinkt ihre
   Blöcke laut Regionen-Guide (Abschnitt 8) auf eine bereits gefilterte
   Auswahl statt auf die ungefilterte Übersicht. Slug statt Klartext, damit
   die URL keine Umlaute trägt. */
export const REGION_PARAM = {
  apulien: "Apulien",
  kampanien: "Kampanien",
  garda: "Gardasee",
  lugana: "Gardasee",
};
// derived from the catalogue so a chip can never point at zero wines
const REGIONS = ["Alle Regionen", ...new Set(WINES.map((w) => w.region))];

const GRID_SPRING = { type: "spring", stiffness: 300, damping: 30 };

export default function WineExplorer() {
  const reduced = useReducedMotion();
  const params = useSearchParams();
  const art = params.get("art");
  const regionParam = params.get("region");
  const [type, setType] = useState(TYPES[0]);
  const [region, setRegion] = useState(REGIONS[0]);

  // follow the header dropdown when it deep-links a wine type
  useEffect(() => {
    if (art && ART_PARAM[art]) setType(ART_PARAM[art]);
  }, [art]);

  // dasselbe für die Herkunft, wenn die Regionen-Seite gefiltert verlinkt
  useEffect(() => {
    const target = regionParam && REGION_PARAM[regionParam.toLowerCase()];
    if (target && REGIONS.includes(target)) setRegion(target);
  }, [regionParam]);

  const wines = useMemo(
    () =>
      WINES.filter(
        (w) =>
          (type === "Alle Weine" || w.type === type) &&
          (region === "Alle Regionen" || w.region === region)
      ),
    [type, region]
  );

  /* Anzahl je Region unter der *aktuellen* Weinart — das Popover zeigt so
     vorab, wohin ein Klick führt, und nie eine leere Auswahl als Überraschung */
  const regionCounts = useMemo(() => {
    const pool = WINES.filter((w) => type === TYPES[0] || w.type === type);
    return REGIONS.reduce(
      (acc, r) => ({ ...acc, [r]: r === REGIONS[0] ? pool.length : pool.filter((w) => w.region === r).length }),
      {}
    );
  }, [type]);

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
      <WineFilterBar
        types={TYPES}
        type={type}
        onType={setType}
        regions={REGIONS}
        region={region}
        onRegion={setRegion}
        regionCounts={regionCounts}
        count={wines.length}
        onReset={reset}
      />

      {/* ---- layout-animated collection ---- */}
      {/* Kein Karten-Raster mehr: die Einträge schweben frei, Reihen werden
          nur durch Haarlinien getrennt. Jede Zelle reserviert ihre border-t
          dauerhaft (transparent), damit Filterwechsel nichts verschieben;
          nth-child blendet sie je Spaltenzahl erst ab der zweiten Reihe ein. */}
      <div className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
        <AnimatePresence mode="popLayout" initial={false}>
          {wines.map((w) => (
            <motion.div
              key={w.name}
              {...itemMotion}
              className="h-full border-t border-transparent pb-6 pt-8 [&:nth-child(n+2)]:border-charcoal/10 sm:[&:nth-child(2)]:border-transparent lg:[&:nth-child(3)]:border-transparent"
            >
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
