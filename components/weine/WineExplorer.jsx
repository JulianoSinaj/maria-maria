"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import WineCard from "@/components/WineCard";
import Button from "@/components/ui/Button";
import WineFilterBar from "@/components/weine/WineFilterBar";
import { TYPE_KEYS, REGION_KEYS } from "@/components/data";
import { useWines, useCommon } from "@/lib/i18n/context";

/* Interactive collection explorer — die Filterleiste (WineFilterBar) legt die
   beiden Achsen nebeneinander statt übereinander: links die Weinart als
   mitfärbende Segment-Schiene, rechts die Region als stilles Popover. Darunter
   ein layout-animiertes Raster. Alle Bewegung federgetrieben, kein Layout-Shift
   in den Bedienelementen selbst. */

/* Gefiltert wird auf SCHLÜSSELN, beschriftet aus dem Wörterbuch. Vorher
   standen hier die deutschen Bezeichnungen und der Vergleich lautete
   `w.type === "Rotwein"` — außerhalb des Deutschen hätte jeder Filter eine
   leere Kollektion ergeben. "all" ist die Ruhestellung beider Achsen. */
const TYPES = ["all", ...TYPE_KEYS];
const REGIONS = ["all", ...REGION_KEYS];

/* ?art=… deep-links from the header dropdown straight into a filtered view.
   Die Query-Werte bleiben unverändert (rot/weiss/rose), damit bestehende
   Links und QR-Codes weiter funktionieren — sie zeigen jetzt nur auf einen
   Schlüssel statt auf einen deutschen Anzeigetext. */
export const ART_PARAM = { rot: "red", weiss: "white", rose: "rose" };
/* ?region=… tut dasselbe für die Herkunft — die Regionen-Seite verlinkt ihre
   Blöcke laut Regionen-Guide (Abschnitt 8) auf eine bereits gefilterte
   Auswahl statt auf die ungefilterte Übersicht. Slug statt Klartext, damit
   die URL keine Umlaute trägt. */
export const REGION_PARAM = {
  apulien: "puglia",
  kampanien: "campania",
  garda: "garda",
  lugana: "garda",
};

const GRID_SPRING = { type: "spring", stiffness: 300, damping: 30 };

export default function WineExplorer() {
  const allWines = useWines();
  const catalogue = useCommon("catalogue");
  const reduced = useReducedMotionSafe();
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
      allWines.filter(
        (w) =>
          (type === "all" || w.typeKey === type) &&
          (region === "all" || w.regionKey === region)
      ),
    [allWines, type, region]
  );

  /* Anzahl je Region unter der *aktuellen* Weinart — das Popover zeigt so
     vorab, wohin ein Klick führt, und nie eine leere Auswahl als Überraschung */
  const regionCounts = useMemo(() => {
    const pool = allWines.filter((w) => type === "all" || w.typeKey === type);
    return REGIONS.reduce(
      (acc, r) => ({ ...acc, [r]: r === "all" ? pool.length : pool.filter((w) => w.regionKey === r).length }),
      {}
    );
  }, [allWines, type]);

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
        labels={catalogue.filters}
        typeLabels={{ all: catalogue.filters?.allWines, ...(catalogue.typesPlural ?? {}) }}
        regionLabels={{ all: catalogue.filters?.allRegions, ...(catalogue.regions ?? {}) }}
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
            {catalogue.filters?.emptyTitle}{" "}
            <span className="italic text-bordeaux">{catalogue.filters?.emptyTitleAccent}</span>
          </p>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-charcoal/65">
            {catalogue.filters?.emptyText}
          </p>
          <div className="mt-7 flex justify-center">
            <Button variant="outline" size="sm" iconType="none" onClick={reset}>
              {catalogue.filters?.reset}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
