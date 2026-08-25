import HomeContent from "@/components/home/HomeContent";
import JsonLd from "@/components/seo/JsonLd";
import { WINES, wineHref } from "@/components/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/site";
import { graph, siteNodes, webPageNode, itemListNode, faqNode } from "@/lib/seo/jsonLd";

/* Teaserbild der Startseite — seit 2026-08-25 die Wortmarke, schwarz auf
   weißem Grund (public/img/og/default.jpg, erzeugt von scripts/og-images.mjs),
   kein Foto mehr. Der Homepage-Brief (§2) nannte noch den Hero-Zuschnitt
   „zwischen Reben und Meer" (maria-maria-boutique-weine-de.jpg); die Datei
   bleibt im Build, wird aber nicht mehr referenziert: Wer maria-maria.de
   weitergibt, soll in der Karte die Marke sehen, nicht ein Motiv. */
const HOME_OG_IMAGE = DEFAULT_OG_IMAGE;

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
    image: { ...HOME_OG_IMAGE, alt: dict.meta.siteTitle ?? HOME_OG_IMAGE.alt },
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
  const imageAlt = dict.meta.siteTitle ?? HOME_OG_IMAGE.alt;

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

  return (
    <>
      <HomeJsonLd locale={params.locale} dict={dict} />
      <HomeContent t={dict.home} faq={dict.faq?.home ?? []} souls={dict.common?.souls} />
    </>
  );
}
