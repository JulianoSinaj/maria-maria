import { DISALLOWED_PATHS } from "@/lib/seo/routes";
import { SITE_URL, INDEXABLE, absoluteUrl } from "@/lib/site";

/* /robots.txt

   Die Grundhaltung ist offen: Alles, was die Storefront zeigt, darf gecrawlt
   werden. Gesperrt sind nur die beiden Bereiche ohne öffentlichen Inhalt —
   das Backoffice unter /admin und die JSON-Endpunkte unter /api. Beide würden
   nie ranken, verbrauchen aber Crawl-Budget und tauchen im Zweifel als
   „Seite ohne Inhalt" in der Search Console auf.

   `Disallow` ist KEIN Zugriffsschutz. Es hält höfliche Crawler fern, sonst
   nichts — die Zugangskontrolle fürs Backoffice ist eine andere Baustelle
   und darf sich nie auf diese Datei verlassen.

   Zwei Regeln, die häufig fehlen:

   - Die Sortier- und Filterlinks der Kollektion (`?art=rot`, `?region=…`)
     erzeugen dieselbe Seite in Varianten. Sie sind NICHT gesperrt: Google
     soll sie sehen und über den Canonical selbst zusammenführen — ein
     Disallow verhindert genau das Lesen des Canonicals und lässt die
     Duplikate als „gecrawlt, nicht indexiert" stehen.
   - Kein `Crawl-delay`. Google ignoriert es, Bing verlangsamt daraufhin die
     Indexierung. Eine Storefront dieser Größe braucht keine Drossel.

   Der Sitemap-Verweis ist der eigentliche Zweck der Datei: Er ist der einzige
   Weg, eine Sitemap ohne Search-Console-Zugang bekannt zu machen. */

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
    ],
    /* Die Sitemap NUR auf der Live-Domain. Eine Vorschau-Instanz trägt in
       jeder Seite `noindex` (INDEXABLE in lib/site.js) — würde sie daneben
       achtzig Adressen zur Indexierung anbieten, widerspräche die eine Datei
       der anderen.

       Bewusst KEIN `Disallow: /` auf der Vorschau: Ein gesperrter Pfad
       verhindert, dass der Crawler die Seite lädt — und damit auch, dass er
       das `noindex` darin überhaupt zu Gesicht bekommt. Adressen, die er
       anderswo verlinkt findet, blieben so als nackte Zeile im Index stehen,
       genau das Gegenteil des Ziels. Erst lesen lassen, dann ausschließen. */
    ...(INDEXABLE ? { sitemap: absoluteUrl("/sitemap.xml") } : null),
    /* `host` löst für Crawler auf, welche Schreibweise die maßgebliche ist,
       falls die Seite unter mehreren Adressen erreichbar bleibt. */
    host: SITE_URL,
  };
}
