/* Pfad-Arithmetik für die vier Sprachen.

   Reine Funktionen, kein React, kein "use client" — Middleware (Edge),
   Server-Components und Client-Components teilen sich dieselbe Logik. Sobald
   Präfix-Regeln an zwei Stellen leben, driften sie auseinander; genau das
   verhindert diese Datei.

   Begriffe:
   - Öffentlicher Pfad  = das, was in der Adressleiste steht   → "/shop", "/it/shop"
   - Interner Pfad      = das, was der App-Router sieht        → "/de/shop", "/it/shop"

   Die Middleware übersetzt zwischen beiden; alles andere im Code arbeitet mit
   öffentlichen Pfaden. */

import { DEFAULT_LOCALE, LOCALES, isLocale } from "./config";

/* Zerlegt einen Pfad in Sprache + sprachfreien Rest.
   "/it/unsere-weine/lugana" → { locale: "it", path: "/unsere-weine/lugana" }
   "/unsere-weine/lugana"    → { locale: "de", path: "/unsere-weine/lugana" }
   "/de/unsere-weine/lugana" → { locale: "de", path: "/unsere-weine/lugana" }

   Auch "de" wird abgeschnitten, obwohl öffentlich kein Pfad so beginnt: Nach
   dem Rewrite der Middleware sieht der Server intern sehr wohl "/de/shop",
   und usePathname() liefert je nach Zeitpunkt die eine oder die andere Form.
   Würde hier nur das Nicht-Default-Präfix fallen, käme die aktive Navigation
   auf Deutsch beim Server auf ein anderes Ergebnis als im Browser — ein
   Hydration-Mismatch, der sich als kurz aufblitzende falsche Markierung
   zeigt. Beide Formen auf dasselbe Ergebnis abzubilden macht das unmöglich.

   Nur ein exaktes Segment zählt: "/entdecken" beginnt zwar mit "en", ist aber
   kein englischer Pfad — deshalb die Prüfung auf Segmentgrenzen statt
   startsWith("/en"). */
export function splitLocale(pathname = "/") {
  const [, first = "", ...rest] = pathname.split("/");
  if (isLocale(first)) {
    return { locale: first, path: `/${rest.join("/")}`.replace(/\/+$/, "") || "/" };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/* Die Sprache eines öffentlichen Pfads. */
export const localeFromPath = (pathname) => splitLocale(pathname).locale;

/* Der sprachfreie Rest eines öffentlichen Pfads — die Basis dafür, beim
   Sprachwechsel auf derselben Seite zu bleiben. */
export const pathWithoutLocale = (pathname) => splitLocale(pathname).path;

/* Baut den öffentlichen Pfad für eine Sprache.
   ("it", "/shop")  → "/it/shop"
   ("de", "/shop")  → "/shop"      (Default bleibt präfixlos)
   ("it", "/")      → "/it"
   Query und Hash bleiben unangetastet: ("it", "/unsere-weine?art=rot#kollektion")
   → "/it/unsere-weine?art=rot#kollektion" */
export function localePath(locale, path = "/") {
  const target = isLocale(locale) ? locale : DEFAULT_LOCALE;

  /* Externe Ziele, Anker, mailto:/tel: — nichts davon ist ein Seitenpfad. */
  if (typeof path !== "string" || !path.startsWith("/")) return path;

  const { path: bare } = splitLocale(path);
  if (target === DEFAULT_LOCALE) return bare;
  return bare === "/" ? `/${target}` : `/${target}${bare}`;
}

/* Interner Pfad für den App-Router — hier trägt AUCH Deutsch sein Segment,
   weil die Seiten unter app/[locale]/ liegen. Nur die Middleware braucht das. */
export function internalPath(locale, path = "/") {
  const { path: bare } = splitLocale(path);
  return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
}

/* Alle vier öffentlichen Varianten einer Seite — Grundlage für die
   hreflang-Alternates und den Sprachumschalter. */
export function alternatePaths(path = "/") {
  const { path: bare } = splitLocale(path);
  return Object.fromEntries(LOCALES.map((l) => [l, localePath(l, bare)]));
}
