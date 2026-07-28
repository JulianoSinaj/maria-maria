import { notFound } from "next/navigation";
import { WINE_PAGES, WINE_SLUGS } from "@/components/weine/wineRegistry";
import { byName } from "@/components/data";
import FalanghinaHero from "@/components/weine/falanghina/FalanghinaHero";
import HeroPhoto from "@/components/weine/falanghina/HeroPhoto";
import HeroPreload from "@/components/weine/falanghina/HeroPreload";
import SubNav from "@/components/weine/falanghina/SubNav";
import FactStrip from "@/components/weine/falanghina/FactStrip";
import ColorBand from "@/components/weine/falanghina/ColorBand";
import StorySection from "@/components/weine/falanghina/StorySection";
import PlaceSection from "@/components/weine/falanghina/PlaceSection";
import PairingSection from "@/components/weine/falanghina/PairingSection";
import DetailBento from "@/components/weine/falanghina/DetailBento";
import WineFaq from "@/components/weine/falanghina/WineFaq";
import SimilarWines from "@/components/weine/falanghina/SimilarWines";
import CtaBand from "@/components/weine/falanghina/CtaBand";
import MariaMoment from "@/components/weine/falanghina/MariaMoment";

/* Produkt-Landingpage im Apple-Stil — eine dynamische Route für alle neun
   Weine. Die Sektionen (components/weine/falanghina/*) sind komplett
   wine-Prop-getrieben; die Daten kommen pro Slug aus dem wineRegistry.
   Neuer Wein = neue wineData.js + ein Registry-Eintrag, keine neue Route.

   Kapitel-Dramaturgie: Herkunft eröffnet als erstes großes Bildkapitel
   (das Terroir ist das Verkaufsargument), aus dem Ort folgt das Glas
   (Farbe/Geschmack → Passt zu → Genießen); die Geschichte vertieft für
   Lesende vor dem Datenblatt. Ähnliche Weine stehen vor den Fragen,
   damit die FAQ als Einwand-Klärung direkt am Schluss-CTA liegt. */

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
      <PlaceSection wine={wine} />
      <ColorBand wine={wine} />
      <PairingSection wine={wine} />
      <MariaMoment wine={wine} />
      <StorySection wine={wine} />
      <DetailBento wine={wine} />
      <SimilarWines wine={wine} />
      <WineFaq wine={wine} />
      <CtaBand wine={wine} />
    </>
  );
}
