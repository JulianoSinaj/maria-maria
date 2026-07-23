import { IL_ROSSO } from "@/components/weine/il-rosso-aglianico/wineData";
import { byName } from "@/components/data";
import FalanghinaHero from "@/components/weine/falanghina/FalanghinaHero";
import SubNav from "@/components/weine/falanghina/SubNav";
import FactStrip from "@/components/weine/falanghina/FactStrip";
import ColorBand from "@/components/weine/falanghina/ColorBand";
import TasteStory from "@/components/weine/falanghina/TasteStory";
import StorySection from "@/components/weine/falanghina/StorySection";
import PlaceSection from "@/components/weine/falanghina/PlaceSection";
import PairingSection from "@/components/weine/falanghina/PairingSection";
import DetailBento from "@/components/weine/falanghina/DetailBento";
import WineFaq from "@/components/weine/falanghina/WineFaq";
import SimilarWines from "@/components/weine/falanghina/SimilarWines";
import CtaBand from "@/components/weine/falanghina/CtaBand";
import MariaMoment from "@/components/weine/falanghina/MariaMoment";

/* Produkt-Landingpage im Apple-Stil für den Campania Rosso IGP.
   Nutzt exakt dieselben Sektionen wie die Falanghina-Seite — nur die
   wineData-Datei ist eine andere. */

const wine = IL_ROSSO;

export const metadata = {
  title: "Il Rosso — Campania Rosso IGP — Maria Maria",
  description: wine.lede,
};

function ProductJsonLd() {
  const catalog = byName(wine.catalogName);
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: wine.name,
    description: wine.lede,
    brand: { "@type": "Brand", name: "Maria Maria" },
    category: "Rotwein",
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

export default function IlRossoPage() {
  return (
    <>
      <ProductJsonLd />
      <FalanghinaHero wine={wine} />
      <SubNav wine={wine} />
      <FactStrip wine={wine} />
      <ColorBand wine={wine} />
      <TasteStory wine={wine} />
      <StorySection wine={wine} />
      <PlaceSection wine={wine} />
      <PairingSection wine={wine} />
      <MariaMoment wine={wine} />
      <DetailBento wine={wine} />
      <WineFaq wine={wine} />
      <SimilarWines wine={wine} />
      <CtaBand wine={wine} />
    </>
  );
}
