import JsonLd from "@/components/seo/JsonLd";
import { graph, webPageNode, breadcrumbNode, faqNode } from "@/lib/seo/jsonLd";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";

/* Strukturierte Daten der Magazin-Seite.

   Baut jetzt auf denselben Knoten-Bauteilen auf wie der Rest der Seite
   (lib/seo/jsonLd.js) statt das Schema selbst zusammenzuschreiben. Der
   Unterschied ist nicht kosmetisch: Vorher trug der Block einen eigenen,
   verkürzten Organisationsknoten und ein hart codiertes `inLanguage:
   "de-DE"` — auf /it/magazin, /en/magazin und /cs/magazin meldete die Seite
   damit deutsche Sprache und ein zweites, unvollständiges Unternehmen unter
   derselben Adresse. Beides zieht die Signale auseinander, die der
   Layout-Knoten sammelt.

   Weiterhin bewusst KEIN Blog mit `blogPost`: Artikelkarten stehen nicht auf
   der Seite, und strukturierte Daten dürfen nur beschreiben, was sichtbar
   ist. Sobald es Artikelrouten gibt, wird hier wieder ein Blog daraus.

   Die FAQ ist dagegen neu — und die Begründung hat sich geändert: Es geht
   nicht mehr um das Aufklapp-Rich-Result (das gibt Google für Weinseiten
   seit 2023 nicht mehr aus), sondern um KI-Antwortmaschinen, die Frage und
   Antwort als Paar lesen. „Welche Trinktemperatur ist ideal?" ist genau die
   Art Frage, die dort gestellt wird. */

export default function MagazinJsonLd({ locale, dict, faq = [] }) {
  const url = absoluteUrl(localePath(locale, "/magazin"));
  const nav = dict?.common?.nav ?? {};
  const meta = dict?.meta?.magazin ?? {};
  const localize = (href) => localePath(locale, href);

  const crumbs = breadcrumbNode(
    [
      { label: nav.home || "Home", href: "/" },
      { label: nav.magazine || "Magazin", href: "/magazin" },
    ],
    { url, localize }
  );

  return (
    <JsonLd
      data={graph(
        webPageNode({
          url,
          name: meta.title,
          description: meta.description,
          locale,
          type: "CollectionPage",
          image: { url: "/img/og/magazin.jpg", alt: meta.ogImageAlt },
          breadcrumbId: crumbs?.["@id"] ?? null,
        }),
        crumbs,
        /* Noch deutsch (I18N.md, Abschnitt 7) — Markup nur dort, wo der
           Besucher denselben Text auch liest. */
        locale === "de" ? faqNode({ url, items: faq }) : null
      )}
    />
  );
}
