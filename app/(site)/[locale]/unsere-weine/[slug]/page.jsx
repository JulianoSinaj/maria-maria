import { notFound } from "next/navigation";
import { WINE_PAGES, WINE_SLUGS } from "@/components/weine/wineRegistry";
import JsonLd from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeWinePage } from "@/lib/i18n/winePages";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import { wineSeo, wineBreadcrumb } from "@/lib/seo/wine";
import {
  graph,
  siteNodes,
  webPageNode,
  productNode,
  breadcrumbNode,
  faqNode,
} from "@/lib/seo/jsonLd";
import FalanghinaHero from "@/components/weine/falanghina/FalanghinaHero";
import HeroPhoto from "@/components/weine/falanghina/HeroPhoto";
import HeroPreload from "@/components/weine/falanghina/HeroPreload";
import SubNav from "@/components/weine/falanghina/SubNav";
import FactStrip from "@/components/weine/falanghina/FactStrip";
import ColorBand from "@/components/weine/falanghina/ColorBand";
import PairingScene from "@/components/weine/PairingScene";
import WineFaq from "@/components/weine/falanghina/WineFaq";
import SimilarWines from "@/components/weine/falanghina/SimilarWines";
import CtaBand from "@/components/weine/falanghina/CtaBand";

/* Produkt-Landingpage im Apple-Stil — eine dynamische Route für alle neun
   Weine. Die Sektionen (components/weine/falanghina/*) sind komplett
   wine-Prop-getrieben; die Daten kommen pro Slug aus dem wineRegistry.
   Neuer Wein = neue wineData.js + ein Registry-Eintrag, keine neue Route.

   Kapitel-Dramaturgie: der Überblick nennt die Eckdaten, dann öffnet das
   Farb-/Geschmackskapitel das Glas selbst (ColorBand — der eingeschenkte
   Wein läuft dort als Bewegtbild hinter der Sektion). Erst danach folgt das
   Pairing-Kapitel — bewusst eine einzige Szene (PairingScene, aus
   wine.pairing.scene) statt eines Rasters aus Speisenkategorien: Maria Maria
   ist kein Rezeptbuch, das Bild ist Gebrauchsbeweis für den Wein. Ein eigenes
   Genuss-Kapitel („Servieren & Genießen“) gibt es nicht mehr; sein Platz
   gehört jetzt dem Pairing. Das Herkunftskapitel („Die Geschichte“)
   liegt gebündelt im Magazin (components/magazin/StoriesSection) — die
   Landingpage bleibt am Produkt. Nach den ähnlichen Weinen folgt das
   Shop-Band, die FAQ schließt die Seite als ruhiger Ausklang ab. */

export function generateStaticParams() {
  return WINE_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

/* Vorher stand hier `title: "${wine.name} — Maria Maria"` — und weil das
   Root-Layout per title.template ohnehin „ — Maria Maria" anhängt, trug jede
   der neun Produktseiten den Markennamen ZWEIMAL im Tab und im
   Suchergebnis: „Lugana DOC — Maria Maria — Maria Maria". Dazu fehlten
   Canonical, hreflang und Teaserbild vollständig; die vier Sprachfassungen
   jeder Weinseite waren für Google vier konkurrierende Duplikate.

   Beides erledigt jetzt pageMetadata() wie auf allen anderen Seiten. Titel
   und Description setzt lib/seo/wine.js aus dem ÜBERSETZTEN Katalog
   zusammen — die deutschen Fließtexte in wineData.js taugen dafür nicht,
   sie stünden sonst auch über der englischen Fassung. */
export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  const seo = wineSeo(params.slug, params.locale, dict);
  if (!seo) return {};

  return pageMetadata({
    locale: params.locale,
    path: `/unsere-weine/${params.slug}`,
    meta: { title: seo.title, description: seo.description },
    image: seo.ogImage,
  });
}

/* Strukturierte Daten der Produktseite — vier Knoten in EINEM Graphen, damit
   die `@id`-Verweise untereinander sicher auflösen:

   ItemPage       die Seite selbst, eingehängt in Website und Organisation
   Product        Datenblatt, Bilder und Angebot — der Knoten, aus dem die
                  Preis- und Verfügbarkeitsanzeige im Suchergebnis entsteht
   BreadcrumbList ersetzt die nackte URL in der Ergebniszeile durch
                  „… › Unsere Weine › Lugana DOC"
   FAQPage        die Fragen aus wineData.faq, die unter der Seite ohnehin
                  sichtbar stehen — Futter für KI-Antwortmaschinen

   Der vorherige Block trug Name, Beschreibung, Kategorie und einen nackten
   Preis. Es fehlten: Bilder (ohne sie keine Produktvorschau), url und sku
   (ohne sie keine Zuordnung über Quellen hinweg), Versand- und
   Rückgabekonditionen, das Datenblatt — und die Beschreibung war deutsch,
   auch auf /en und /cs. */
function WineJsonLd({ slug, locale, seo, dict }) {
  const path = `/unsere-weine/${slug}`;
  const url = absoluteUrl(localePath(locale, path));
  const localize = (href) => localePath(locale, href);

  const crumbs = breadcrumbNode(wineBreadcrumb(slug, dict, seo.name), { url, localize });

  return (
    <JsonLd
      data={graph(
        siteNodes({ locale, description: dict.meta?.orgDescription }),
        webPageNode({
          url,
          name: seo.title,
          description: seo.description,
          locale,
          type: "ItemPage",
          image: seo.ogImage,
          breadcrumbId: crumbs?.["@id"] ?? null,
        }),
        productNode({
          url,
          name: seo.name,
          description: seo.description,
          images: seo.images,
          sku: slug,
          category: seo.category,
          price: seo.price,
          properties: seo.properties,
          locale,
        }),
        crumbs,
        faqNode({ url, items: seo.faq })
      )}
    />
  );
}

export default async function WinePage({ params }) {
  const base = WINE_PAGES[params.slug];
  if (!base) notFound();

  const dict = await getDictionary(params.locale);
  /* Der sichtbare Seitentext in der aktiven Sprache: das Text-Overlay aus
     content/<sprache>/weine-pages/<slug> legt sich über die deutsche Basis.
     Für Deutsch gibt es kein Overlay — `wine` ist dann `base`. */
  const wine = localizeWinePage(base, dict.weinePages?.[params.slug]);
  const seo = wineSeo(params.slug, params.locale, dict);

  return (
    <>
      {seo && <WineJsonLd slug={params.slug} locale={params.locale} seo={seo} dict={dict} />}
      <HeroPreload wine={wine} />
      <FalanghinaHero wine={wine} photo={<HeroPhoto wine={wine} />} />
      <SubNav wine={wine} />
      <FactStrip wine={wine} />
      <ColorBand wine={wine} />
      <PairingScene wine={wine} />
      <SimilarWines wine={wine} t={dict.common?.winePage} />
      <CtaBand wine={wine} t={dict.common?.winePage} />
      <WineFaq wine={wine} t={dict.common?.winePage} />
    </>
  );
}
