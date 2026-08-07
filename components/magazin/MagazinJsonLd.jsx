import { absoluteUrl, ORGANIZATION, SITE_NAME } from "@/lib/site";

/* Strukturierte Daten der Magazin-Seite — gleiche Bauform wie das
   ProductJsonLd der Wein-Landingpages (ein <script type="application/ld+json">
   pro Seite, aus den vorhandenen Daten abgeleitet, nie handgepflegt).

   Zwei Graphen in einem Block:
   - CollectionPage: beschreibt /magazin als das, was die Seite tatsächlich
     zeigt — Marke, Genussmomente, Bacheca und die Weine dahinter. Bewusst
     KEIN Blog mit `blogPost`: Artikelkarten stehen derzeit nicht auf der
     Seite, und strukturierte Daten dürfen nur beschreiben, was sichtbar ist.
     Sobald es Artikelrouten gibt, wird hier wieder ein Blog daraus.
   - BreadcrumbList: Start › Magazin, damit die Seite in der SERP ihren Pfad
     zeigt statt der nackten URL.

   Kein FAQPage-Markup: die FAQ-Sektion trägt dieselbe Entscheidung schon
   (components/faq/FaqSection) — seit Mai 2026 ohne Rich-Result-Effekt. */

export default function MagazinJsonLd({ description }) {
  const url = absoluteUrl("/magazin");

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#magazin`,
        url,
        name: `Magazin — ${SITE_NAME}`,
        description,
        inLanguage: "de-DE",
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
        publisher: ORGANIZATION,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Start",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Magazin",
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
