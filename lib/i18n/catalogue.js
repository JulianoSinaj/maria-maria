/* Katalog + Sprache zusammenführen.

   components/data.js hält die sprachneutrale Struktur (Slug, Preis, Jahrgang,
   typeKey, regionKey), content/<sprache>/common.js den sichtbaren Text. Hier
   treffen sich beide.

   Reine Funktionen, kein "use client" — Server-Components rufen sie direkt
   auf, Client-Components über den Hook `useWines()` in ./context. */

import { WINES } from "@/components/data";

/* Ein Katalogeintrag plus Text der aktiven Sprache.

   `notes` ist bewusst ein Array („intensiv", „kraftvoll", „ausgewogen") und
   kein fertiger Satz: Die Karten setzen die Worte mit „·" getrennt, der
   Fließtext braucht sie als Aufzählung mit Konjunktion. Aus einer Liste lässt
   sich beides bauen — aus dem Satz „Intensiv, kraftvoll und ausgewogen"
   dagegen nur mit einem Parser, der die Konjunktion jeder Sprache kennt.
   Genau den gab es hier vorher, und er kannte nur „und". */
export function localizeWine(wine, catalogue = {}) {
  const text = catalogue.wines?.[wine.slug] ?? {};
  return {
    ...wine,
    type: catalogue.types?.[wine.typeKey] ?? "",
    region: catalogue.regions?.[wine.regionKey] ?? "",
    notes: text.notes ?? [],
    pairing: text.pairing ?? "",
  };
}

export function localizeWines(catalogue = {}, wines = WINES) {
  return wines.map((w) => localizeWine(w, catalogue));
}

/* Einzelner Wein über den Slug — der übliche Zugriff auf Produktseiten. */
export function localizedWineBySlug(slug, catalogue = {}) {
  const wine = WINES.find((w) => w.slug === slug);
  return wine ? localizeWine(wine, catalogue) : null;
}

/* Über den Produktnamen, weil die wineData-Module ihren Katalogeintrag so
   referenzieren (`catalogName`). */
export function localizedWineByName(name, catalogue = {}) {
  const wine = WINES.find((w) => w.name === name);
  return wine ? localizeWine(wine, catalogue) : null;
}
