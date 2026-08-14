/* Das Verzeichnis aller indexierbaren Seiten — eine Quelle für Sitemap,
   Breadcrumbs und interne SEO-Prüfungen.

   Warum eine eigene Liste und kein Scan über app/? Der App-Router kennt zur
   Laufzeit keine Route-Übersicht, und ein Dateisystem-Scan würde genau die
   Dinge mitnehmen, die NICHT in die Sitemap gehören: das Backoffice unter
   /admin, die JSON-Endpunkte unter /api, Fehler- und 404-Seiten. Eine
   gepflegte Liste ist hier ehrlicher als eine automatische, die man
   anschließend wieder filtern muss.

   Neue Seite = eine Zeile hier. Fehlt sie, ist die Seite erreichbar und
   verlinkt, taucht aber nicht in der Sitemap auf.

   `priority` und `changeFrequency` sind Hinweise, keine Befehle — Google
   ignoriert sie weitgehend, Bing und kleinere Crawler lesen sie noch. Sie
   kosten nichts und ordnen die Seite intern nach Wichtigkeit. */

import { WINE_SLUGS } from "@/components/weine/wineRegistry";
import { INTERVIEW_SLUGS, interviewPath } from "@/components/magazin/interviewRegistry";
import { SHOP_ENABLED } from "@/lib/shop/config";

/* Die Gewichtung folgt dem Geschäft, nicht dem Seitenumfang: Startseite,
   Kollektion, Shop und die neun Produktseiten verdienen Crawl-Budget, die
   Rechtstexte sind Pflichtseiten ohne Ranking-Ambition. */
const ALL_STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/unsere-weine", priority: 0.9, changeFrequency: "weekly" },
  { path: "/shop", priority: 0.9, changeFrequency: "weekly" },
  { path: "/regionen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/magazin", priority: 0.7, changeFrequency: "monthly" },
  { path: "/geschichte", priority: 0.6, changeFrequency: "yearly" },
  { path: "/kontakt", priority: 0.5, changeFrequency: "yearly" },
  { path: "/impressum", priority: 0.2, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" },
  { path: "/agb", priority: 0.2, changeFrequency: "yearly" },
];

/* Der stillgelegte Shop gehört nicht in die Sitemap: Er antwortet mit 307 auf
   eine fremde Domain. Eine Sitemap-Zeile, die weiterleitet, ist für Google
   ein Fehler in der eigenen Datei — sie soll Endadressen nennen, keine
   Umwege. Sobald SHOP_ENABLED wieder true ist, steht die Zeile von selbst
   wieder drin (lib/shop/config.js). */
export const STATIC_ROUTES = SHOP_ENABLED
  ? ALL_STATIC_ROUTES
  : ALL_STATIC_ROUTES.filter((r) => r.path !== "/shop");

/* Die neun Produktseiten kommen aus dem Wein-Register — ein neuer Wein
   landet damit automatisch in der Sitemap, ohne dass jemand daran denken
   muss. Sie stehen bewusst gleichauf mit dem Shop: auf einer Weinseite
   landet, wer „Lugana kaufen" sucht, und genau der Besuch ist das Ziel. */
export const WINE_ROUTES = WINE_SLUGS.map((slug) => ({
  path: `/unsere-weine/${slug}`,
  priority: 0.9,
  changeFrequency: "monthly",
}));

/* Die redaktionellen Gespräche. Sie tragen dieselbe Gewichtung wie das
   Magazin selbst: Sie sollen gefunden werden, konkurrieren aber bewusst
   nicht mit den Produktseiten um „Lugana kaufen" — der Artikel bedient die
   informationelle Absicht, die Weinseite die kommerzielle (Handoff Seite 20). */
export const INTERVIEW_ROUTES = INTERVIEW_SLUGS.map((slug) => ({
  path: interviewPath(slug),
  priority: 0.7,
  changeFrequency: "monthly",
}));

/* Sprachfreie öffentliche Pfade — localePath() setzt das Präfix davor. */
export const SEO_ROUTES = [...STATIC_ROUTES, ...WINE_ROUTES, ...INTERVIEW_ROUTES];

/* Nicht indexierbar, deshalb nicht in der Sitemap und in robots.txt gesperrt.
   /admin und /api tragen keinen öffentlichen Inhalt; würden sie gecrawlt,
   verbrennt das Crawl-Budget an Seiten, die nie ranken sollen. */
export const DISALLOWED_PATHS = ["/admin", "/api"];
