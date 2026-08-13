import HomeContent from "@/components/home/HomeContent";
import JsonLd from "@/components/seo/JsonLd";
import { WINES, wineHref } from "@/components/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import { graph, webPageNode, itemListNode, faqNode } from "@/lib/seo/jsonLd";

/* Die Startseite hatte als einzige Seite der Storefront GAR KEIN
   generateMetadata. Sie fiel damit auf die Vorgaben des Root-Layouts
   zurück — Titel und Description stimmten, aber es fehlte das Teaserbild:
   ausgerechnet die meistgeteilte Adresse der Domain erschien in WhatsApp,
   Slack und LinkedIn als grauer Kasten. */
export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "/",
    meta: dict.meta.home,
    image: {
      url: "/img/og/default.jpg",
      width: 1200,
      height: 630,
      alt: dict.meta.siteTitle,
    },
  });
}

/* Die Startseite ist der Einstieg in den Katalog, und genau so beschreibt
   sie sich: eine WebPage mit der Liste aller neun Weine und den Fragen der
   Marken-FAQ, die weiter unten sichtbar stehen.

   Die Weinliste ist hier wichtiger als sie aussieht. Sie verkettet die
   Startseite — die Seite mit den meisten eingehenden Links — direkt mit den
   neun Produktadressen und sagt Google, dass es sich um EINE Sammlung
   handelt, nicht um neun zufällige Links im Fließtext. */
function HomeJsonLd({ locale, dict }) {
  const url = absoluteUrl(localePath(locale, "/"));
  const catalogue = dict?.common?.catalogue ?? {};

  return (
    <JsonLd
      data={graph(
        webPageNode({
          url,
          name: dict.meta.siteTitle,
          description: dict.meta.siteDescription,
          locale,
          image: { url: "/img/og/default.jpg", alt: dict.meta.siteTitle },
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
           auf der Seite liest. */
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
