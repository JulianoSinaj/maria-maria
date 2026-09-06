import HomeContent from "@/components/home/HomeContent";
import JsonLd from "@/components/seo/JsonLd";
import { WINES, wineHref } from "@/components/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import { graph, siteNodes, webPageNode, itemListNode, faqNode } from "@/lib/seo/jsonLd";
import { withRegionState } from "@/lib/regions/content";
import { getShowcaseConfig } from "@/lib/showcase/store";

/* Die drei Herkünfte des Regionen-Explorers — dieselben Schlüssel, unter
   denen HomeContent Foto und Ausschnitt führt und das Backoffice ihre
   Sichtbarkeit verwaltet. Hier steht nur die Reihenfolge; Text kommt aus
   dem Wörterbuch, Zustand aus dem Store. */
const HOME_REGIONS = [{ key: "apulien" }, { key: "kampanien" }, { key: "garda" }];

/* Die Startseite wird nicht mehr vorgerendert, seit der Regionen-Explorer
   Sichtbarkeit und Bauform aus dem Backoffice liest.

   Das ist der teuerste Punkt dieser Änderung und deshalb ausdrücklich
   notiert: Die meistbesuchte Adresse der Domain rendert jetzt je Anfrage.
   Der statische Weg wäre revalidatePath() nach dem Speichern — der auf
   dieser Route aber eine dauerhafte 404 erzeugt, weil das Sprach-Layout
   `dynamicParams = false` setzt (gemessen am 2026-09-06, siehe
   lib/regions/revalidate.js). Die Alternative wäre gewesen, die Startseite
   statisch zu lassen und eine auf „Entwurf" gesetzte Herkunft trotzdem
   öffentlich im Explorer stehen zu lassen, bis jemand deployt. Zwischen
   „langsamer" und „zeigt, was nicht gezeigt werden soll" fiel die Wahl
   leicht — rückgängig zu machen ist sie, sobald dynamicParams gelöst ist. */
export const dynamic = "force-dynamic";

/* Teaserbild der Startseite — 1200 × 630, erzeugt von scripts/og-images.mjs
   aus dem Hero-Motiv „zwischen Reben und Meer". Dateiname und Maße nennt
   der Homepage-Brief (§2); was in WhatsApp, Slack und LinkedIn aufklappt,
   ist damit dasselbe Bild, das nach dem Klick oben auf der Seite steht. */
const HOME_OG_IMAGE = { url: "/img/og/maria-maria-boutique-weine-de.jpg", width: 1200, height: 630 };

/* Die Startseite hatte als einzige Seite der Storefront GAR KEIN
   generateMetadata. Sie fiel damit auf die Vorgaben des Root-Layouts
   zurück — Titel und Description stimmten, aber es fehlte das Teaserbild:
   ausgerechnet die meistgeteilte Adresse der Domain erschien in WhatsApp,
   Slack und LinkedIn als grauer Kasten.

   Seit dem Homepage-Brief trägt meta.home auf Deutsch `titleAbsolute`
   („… | Maria Maria"): Der Titel führt die Marke selbst, das title.template
   des Layouts hängte sie sonst ein zweites Mal an. Die übrigen Sprachen
   laufen weiter über `title` + Template. */
export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "/",
    meta: dict.meta.home,
    image: { ...HOME_OG_IMAGE, alt: dict.home?.hero?.photoAlt ?? dict.meta.siteTitle },
  });
}

/* EIN JSON-LD-Graph für die Seite (Homepage-Brief §7): Unternehmen, Marke
   und Website (siteNodes) voran, dann die Seite selbst — eine WebPage mit
   der Liste aller neun Weine und den Fragen der Marken-FAQ, die weiter
   unten sichtbar stehen. Keine Breadcrumb auf der Startseite, kein
   OnlineStore, kein LocalBusiness.

   Die Weinliste ist hier wichtiger als sie aussieht. Sie verkettet die
   Startseite — die Seite mit den meisten eingehenden Links — direkt mit den
   neun Produktadressen und sagt Google, dass es sich um EINE Sammlung
   handelt, nicht um neun zufällige Links im Fließtext. Alle neun sind
   verifizierte, im Katalog geführte Produkte (components/data.js). */
function HomeJsonLd({ locale, dict }) {
  const url = absoluteUrl(localePath(locale, "/"));
  const meta = dict.meta.home ?? {};
  const catalogue = dict?.common?.catalogue ?? {};
  const imageAlt = dict.home?.hero?.photoAlt ?? dict.meta.siteTitle;

  return (
    <JsonLd
      data={graph(
        siteNodes({ locale, description: dict.meta?.orgDescription }),
        webPageNode({
          url,
          name: meta.titleAbsolute ?? meta.title ?? dict.meta.siteTitle,
          description: meta.description ?? dict.meta.siteDescription,
          locale,
          image: { url: HOME_OG_IMAGE.url, alt: imageAlt },
        }),
        itemListNode({
          url,
          name: catalogue.filters?.allWines ?? "",
          items: WINES.map((w) => ({
            name: w.name,
            url: localePath(locale, wineHref(w)),
          })),
        }),
        /* Die Marken-FAQ liegt in allen vier Sprachen vor — das Markup
           beschreibt damit in jeder Fassung genau das, was der Besucher
           auf der Seite liest.

           FAQPage steht in §7 des Briefs weder unter „verwenden" noch unter
           „nicht verwenden" — die Lücke ist hier bewusst zugunsten des
           Markups geschlossen (Brief-Nachtrag §7a, siehe SEO-BRIEF-NACHTRAG.md):

           Ein Rich Result bringt es nicht mehr. Google zeigt FAQ-Sternchen
           seit August 2023 nur noch für Behörden- und Gesundheitsseiten; ein
           Weinhändler bekommt dafür keine erweiterte Ergebniszeile, und wer
           es deswegen einbaut, baut es umsonst ein.

           Es bleibt trotzdem drin: Die Fragen stehen sichtbar auf der Seite,
           das Markup behauptet also nichts Zusätzliches, und für
           Antwortmaschinen ist ein ausgezeichnetes Frage-Antwort-Paar
           deutlich leichter zu verwerten als derselbe Text als Fließtext.
           Der Nutzen hat sich verlagert, er ist nicht verschwunden. */
        faqNode({ url, items: dict.faq?.home ?? [] })
      )}
    />
  );
}

export default async function HomePage({ params }) {
  const dict = await getDictionary(params.locale);

  /* Sichtbarkeit je Herkunft und die Bauform des Explorers kommen aus dem
     Backoffice. Beide Vorgaben bilden die Seite von heute ab — ohne
     Konfiguration ändert sich nichts. Nach jedem Speichern stößt
     /api/admin/regions bzw. der Showcase-Store diese Seite über
     revalidatePath neu an; sie bleibt also statisch vorgerendert. */
  const regionState = await withRegionState(HOME_REGIONS);
  const { layout } = await getShowcaseConfig();

  return (
    <>
      <HomeJsonLd locale={params.locale} dict={dict} />
      <HomeContent
        t={dict.home}
        faq={dict.faq?.home ?? []}
        souls={dict.common?.souls}
        regionState={regionState}
        regionLayout={{
          hoverExpand: layout.desktop.hoverExpand,
          grow: layout.desktop.grow,
          mobileVariant: layout.mobile.variant,
        }}
      />
    </>
  );
}
