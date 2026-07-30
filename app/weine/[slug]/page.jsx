import { notFound } from "next/navigation";
import { WINE_PAGES, WINE_SLUGS } from "@/components/weine/wineRegistry";
import { byName } from "@/components/data";
import FalanghinaHero from "@/components/weine/falanghina/FalanghinaHero";
import HeroPhoto from "@/components/weine/falanghina/HeroPhoto";
import HeroPreload from "@/components/weine/falanghina/HeroPreload";
import SubNav from "@/components/weine/falanghina/SubNav";
import FactStrip from "@/components/weine/falanghina/FactStrip";
import RitualSection from "@/components/weine/falanghina/RitualSection";
import ColorBand from "@/components/weine/falanghina/ColorBand";
import PairingSection from "@/components/weine/falanghina/PairingSection";
import WineFaq from "@/components/weine/falanghina/WineFaq";
import SimilarWines from "@/components/weine/falanghina/SimilarWines";
import CtaBand from "@/components/weine/falanghina/CtaBand";

/* Produkt-Landingpage im Apple-Stil — eine dynamische Route für alle neun
   Weine. Die Sektionen (components/weine/falanghina/*) sind komplett
   wine-Prop-getrieben; die Daten kommen pro Slug aus dem wineRegistry.
   Neuer Wein = neue wineData.js + ein Registry-Eintrag, keine neue Route.

   Kapitel-Dramaturgie: der Überblick nennt die Eckdaten, dann sagt das
   Genuss-Kapitel (#servieren), wie der Wein ins Glas kommt — Ritual und
   Maria-Moment stehen dort als helles und dunkles Kartenpaar nebeneinander
   (RitualSection), beide aus dem wine.moment-Block. Erst danach öffnet das
   Farb-/Geschmackskapitel das Glas selbst. Das Herkunftskapitel („Die Geschichte“) liegt gebündelt im
   Magazin (components/magazin/StoriesSection) — die Landingpage bleibt am
   Produkt. Nach den ähnlichen Weinen folgt das Shop-Band, die FAQ schließt
   die Seite als ruhiger Ausklang ab. */

export function generateStaticParams() {
  return WINE_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const wine = WINE_PAGES[params.slug];
  if (!wine) return {};
  return {
    title: `${wine.name} — Maria Maria`,
    description: wine.lede,
  };
}

function ProductJsonLd({ wine }) {
  const catalog = byName(wine.catalogName);
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: wine.name,
    description: wine.lede,
    brand: { "@type": "Brand", name: "Maria Maria" },
    /* Kategorie aus dem Katalog abgeleitet statt pro Seite hart codiert */
    ...(catalog?.type && { category: catalog.type }),
    ...(catalog && {
      offers: {
        "@type": "Offer",
        price: catalog.price.toFixed(2),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function WinePage({ params }) {
  const wine = WINE_PAGES[params.slug];
  if (!wine) notFound();

  return (
    <>
      <ProductJsonLd wine={wine} />
      <HeroPreload wine={wine} />
      <FalanghinaHero wine={wine} photo={<HeroPhoto wine={wine} />} />
      <SubNav wine={wine} />
      <FactStrip wine={wine} />
      <RitualSection wine={wine} />
      <ColorBand wine={wine} />
      <PairingSection wine={wine} />
      <SimilarWines wine={wine} />
      <CtaBand wine={wine} />
      <WineFaq wine={wine} />
    </>
  );
}
