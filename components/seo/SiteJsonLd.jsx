import JsonLd from "@/components/seo/JsonLd";
import { graph, siteNodes } from "@/lib/seo/jsonLd";

/* Der Graph für Seiten ohne eigene Knoten — die Rechtstexte: Unternehmen,
   Marke, Website, dieselben drei, die jede andere Seite an den Anfang ihres
   eigenen Blocks stellt (lib/seo/jsonLd.js, siteNodes).

   Bis August 2026 kamen diese Knoten aus dem Root-Layout und standen damit
   automatisch auf jeder Seite. Seit jede Seite genau EINEN JSON-LD-Block
   trägt (Homepage-Brief §7), hätten Impressum, Datenschutz und AGB sonst gar
   keine strukturierten Daten mehr — und ausgerechnet das Impressum ist die
   Seite, an der Google die Firmenangaben gegenprüft. */
export default function SiteJsonLd({ locale, dict }) {
  return <JsonLd data={graph(siteNodes({ locale, description: dict?.meta?.orgDescription }))} />;
}
