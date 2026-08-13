"use client";
import Link from "@/components/i18n/LocaleLink";
import Bottle from "@/components/Bottle";
import WinePhotos from "@/components/WinePhotos";
import { Arrow } from "@/components/Icons";
import { wineHref } from "@/components/data";
import { useCommon, useLocaleTools } from "@/lib/i18n/context";
import AddToCart from "./AddToCart";
import { WINE_META } from "./shopData";

/* Shop-Eintrag — dieselbe Anatomie wie WineCard auf /weine und den
   Regionenseiten: kein Karten-Chrome, keine Bühne, kein Glow. Flasche und
   Text schweben frei auf dem Seitengrund.

   Einziger Unterschied zum redaktionellen Eintrag: der Commerce-Fuß mit
   Preis und AddToCart. Der Name ist ein gestreckter Link auf die
   Landingpage; AddToCart und WinePhotos liegen auf z-10 darüber, damit
   Warenkorb und Blättern nie navigieren. */

function Packshot({ wine, imgClass }) {
  return wine.photos ? (
    <WinePhotos wine={wine} imgClass={imgClass} />
  ) : (
    <Bottle
      variant={wine.variant}
      className={`${imgClass} will-transform transition-transform duration-500 ease-out-expo group-hover:-translate-y-2.5 group-hover:rotate-[-2deg]`}
    />
  );
}

export default function ShopCard({ wine, className = "", index }) {
  const { price: fmtPrice, number: formatCount } = useLocaleTools();
  const shop = useCommon("shop");
  const ui = useCommon("ui");
  const meta = WINE_META[wine.name] || {};
  const link = wineHref(wine);
  const number = Number.isInteger(index) ? String(index + 1).padStart(2, "0") : null;
  const words = (wine.notes ?? []).join(" · ");

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
          className={`font-playfair text-[19px] italic leading-snug text-charcoal transition-colors duration-300 group-hover:text-bordeaux ${
            number ? "mt-3" : ""
          }`}
        >
          <Link href={link} className="outline-none after:absolute after:inset-0" aria-label={(ui.wineDetails ?? "").replace("{name}", wine.name)}>
            {wine.name}
          </Link>
        </h3>
        <p className="mt-1 font-playfair text-[12.5px] italic text-bordeaux/75">{wine.region}</p>
        <p className="mt-3 text-[11.5px] lowercase tracking-[0.05em] text-charcoal/75">{words}</p>

        {meta.edition && (
          <p className="mt-2 text-[10.5px] uppercase tracking-[0.14em] text-bordeaux/70">
            {shop.limitedEdition?.replace("{count}", formatCount(meta.edition))}
          </p>
        )}
        {meta.scarce && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.14em] text-bordeaux/70">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-champagne opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-champagne" />
            </span>
            {shop.scarce}
          </p>
        )}

        <p className="pointer-events-none mt-auto inline-flex items-center gap-1.5 pt-4 text-[12px] font-medium text-bordeaux">
          <span className="border-b border-bordeaux/30 pb-0.5 transition-colors duration-300 group-hover:border-bordeaux/70">
            {ui.discoverWine}
          </span>
          <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </p>

        {/* Commerce-Fuß — das Einzige, was der Shop dem Eintrag hinzufügt */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[15px] font-semibold tabular-nums text-charcoal">
            {fmtPrice(wine.price)}
            <span className="ml-1.5 text-[10px] font-normal text-charcoal/60">{ui.perBottle}</span>
          </p>
          <AddToCart wine={wine} />
        </div>
      </div>
    </div>
  );
}
