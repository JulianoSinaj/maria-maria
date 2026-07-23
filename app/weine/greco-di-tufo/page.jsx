import { GRECO_DI_TUFO } from "@/components/weine/greco-di-tufo/wineData";
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

/* Produkt-Landingpage im Apple-Stil für den Greco di Tufo D.O.C.G.
   Nutzt dieselben wine-Prop-getriebenen Sektionen wie /weine/falanghina —
   einziger Unterschied ist die Datendatei. */

const wine = GRECO_DI_TUFO;

export const metadata = {
  title: "Greco di Tufo D.O.C.G. — Maria Maria",
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
    category: "Weißwein",
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

export default function GrecoDiTufoPage() {
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
      <DetailBento wine={wine} />
      <WineFaq wine={wine} />
      <SimilarWines wine={wine} />
      <CtaBand wine={wine} />
    </>
  );
}
