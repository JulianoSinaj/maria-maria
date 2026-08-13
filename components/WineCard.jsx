"use client";
import Link from "@/components/i18n/LocaleLink";
import Bottle from "./Bottle";
import WinePhotos from "./WinePhotos";
import { Arrow } from "./Icons";
import { wineHref } from "./data";
import { useCommon, useLocaleTools } from "@/lib/i18n/context";

/* Editorial wine entry — kein Karten-Chrome mehr: Flasche und Text schweben
   frei auf dem Seitengrund (Referenz: „Neun Charaktere"-Layout).

   - "default": rote Laufnummer (01…), kursiver Name, Region, Charakterworte
     mit „·" getrennt, Pairing-Satz und „Wein kennenlernen →". Flasche links,
     Text rechts. Der ganze Eintrag ist ein gestreckter Link zur Landingpage
     (Shop als Fallback); ein Druck aufs Foto blättert die Flasche um statt
     zu navigieren (WinePhotos liegt auf z-10 über dem Link).
   - "mini": kompakte Ausgabe derselben Anatomie für Karussells und Rails.

   `index` ist optional — nur Listen mit echter Reihenfolge (Kollektion,
   Rails) zeigen die Nummer. */

function Packshot({ wine, imgClass }) {
  return wine.photos ? (
    <WinePhotos wine={wine} imgClass={imgClass} />
  ) : (
    /* Fallback ohne Fotos: illustrierte Flasche mit demselben Hover-Lift */
    <Bottle
      variant={wine.variant}
      className={`${imgClass} will-transform transition-transform duration-500 ease-out-expo group-hover:-translate-y-2.5 group-hover:rotate-[-2deg]`}
    />
  );
}

export default function WineCard({ wine, variant = "default", className = "", href, index }) {
  const { list } = useLocaleTools();
  const ui = useCommon("ui");
  const detailsLabel = (ui.wineDetails ?? "").replace("{name}", wine.name);
  // Landingpage des Weins, sonst Shop — explizites href gewinnt.
  const link = href ?? wineHref(wine);
  const number = Number.isInteger(index) ? String(index + 1).padStart(2, "0") : null;
  const words = (wine.notes ?? []).join(" · ");

  if (variant === "mini") {
    return (
      <div className={`group relative flex items-center gap-4 ${className || "w-[228px] shrink-0 snap-start"}`}>
        <div className="flex w-16 shrink-0 items-end justify-center">
          <Packshot wine={wine} imgClass="h-32" />
        </div>
        <div className="min-w-0 flex-1 py-1">
          <h3 className="font-playfair text-[15px] italic leading-snug text-vine transition-colors duration-300 group-hover:text-bordeaux">
            <Link href={link} className="outline-none after:absolute after:inset-0" aria-label={detailsLabel}>
              {wine.name}
            </Link>
          </h3>
          <p className="mt-0.5 font-playfair text-[11.5px] italic text-bordeaux/75">{wine.region}</p>
          <p className="mt-2 text-[10.5px] lowercase tracking-[0.04em] text-charcoal/70">{words}</p>
          <p className="pointer-events-none mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-bordeaux">
            {ui.discoverWine}
            <Arrow className="h-3 w-3 transition-transform duration-400 ease-out-expo group-hover:translate-x-0.5" />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative flex items-stretch gap-5 sm:gap-6 ${className}`}>
      {/* Flasche schwebt direkt auf der Seite — keine Bühne, kein Glow */}
      <div className="flex w-[84px] shrink-0 items-end justify-center sm:w-[92px]">
        <Packshot wine={wine} imgClass="h-44 sm:h-48" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col pt-1">
        {number && (
          <span aria-hidden="true" className="font-playfair text-[19px] leading-none tracking-[0.08em] text-bordeaux">
            {number}
          </span>
        )}
        <h3
          className={`font-playfair text-[19px] italic leading-snug text-vine transition-colors duration-300 group-hover:text-bordeaux ${
            number ? "mt-3" : ""
          }`}
        >
          <Link href={link} className="outline-none after:absolute after:inset-0" aria-label={detailsLabel}>
            {wine.name}
          </Link>
        </h3>
        <p className="mt-1 font-playfair text-[12.5px] italic text-bordeaux/75">{wine.region}</p>
        <p className="mt-3 text-[11.5px] lowercase tracking-[0.05em] text-charcoal/75">{words}</p>
        {wine.pairing && (
          <p className="mt-2 max-w-[15rem] text-[12.5px] leading-relaxed text-charcoal/60">{wine.pairing}</p>
        )}
        <p className="pointer-events-none mt-auto inline-flex items-center gap-1.5 pt-4 text-[12px] font-medium text-bordeaux">
          <span className="border-b border-bordeaux/30 pb-0.5 transition-colors duration-300 group-hover:border-bordeaux/70">
            {ui.discoverWine}
          </span>
          <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </p>
      </div>
    </div>
  );
}
