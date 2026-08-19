/* Shared wine catalogue — single source of truth for cards, carousels, filters. */

/* Was hier steht, ist sprachneutral: Slug, Name, Preis, Jahrgang, Farbwert
   und zwei Schlüssel für Typ und Region. Der sichtbare Text — „Rotwein",
   „Apulien", die Charakterworte und die Speiseempfehlung — liegt in
   content/<sprache>/common.js unter `catalogue` und wird erst beim Rendern
   dazugemischt (siehe lib/i18n/catalogue.js).

   Vorher trug dieses Modul den deutschen Text selbst, und die Filter
   verglichen darauf: `w.type === "Rotwein"`, `w.region === "Apulien"`. Damit
   war jeder Filter an die deutsche Schreibweise gebunden — auf /it/shop hätte
   „Vini rossi" nie etwas gefunden. Deshalb `typeKey`/`regionKey`: Es wird auf
   Schlüsseln gefiltert und nur noch mit Wörterbuch-Text beschriftet.

   Die Namen der Weine bleiben unübersetzt. „Primitivo di Manduria D.O.C." ist
   eine geschützte Herkunftsbezeichnung, keine Beschreibung. */

/* Jede Flasche liegt als freigestelltes Karten-Packshot-Paar unter
   public/img/wines/<slug>/card-front.webp + card-back.webp — WebP mit Alpha,
   Studiohintergrund entfernt (erzeugt via `npm run crop:cards`). */
const cardPhotos = (slug) => ({
  front: `/img/wines/${slug}/card-front.webp`,
  back: `/img/wines/${slug}/card-back.webp`,
});

const CATALOGUE = [
  { slug: "primitivo-15-5", name: "Primitivo di Manduria D.O.C. 15,5", regionKey: "puglia", variant: "redsoft", typeKey: "red", price: 28.95, year: 2020, dot: "#6B0F1A" },
  { slug: "lugana", name: "Lugana D.O.P.", regionKey: "garda", variant: "white", typeKey: "white", price: 12.95, year: 2023, dot: "#C8B77A" },
  { slug: "greco-di-tufo", name: "Greco di Tufo D.O.C.G.", regionKey: "campania", variant: "white", typeKey: "white", price: 13.95, year: 2022, dot: "#C8B77A" },
  { slug: "primitivo-14-5", name: "Primitivo di Manduria D.O.C. 14,5", regionKey: "puglia", variant: "red", typeKey: "red", price: 25.95, year: 2021, dot: "#6B0F1A" },
  { slug: "primitivo-salento", name: "Primitivo Salento IGP", regionKey: "puglia", variant: "amber", typeKey: "red", price: 12.95, year: 2022, dot: "#6B0F1A" },
  { slug: "falanghina", name: "Falanghina I.G.P.", regionKey: "campania", variant: "white", typeKey: "white", price: 11.49, year: 2023, dot: "#C8B77A" },
  { slug: "rosato-puglia", name: "Rosato Puglia", regionKey: "puglia", variant: "rose", typeKey: "rose", price: 11.95, year: 2023, dot: "#c67f78" },
  { slug: "il-rosso-aglianico", name: "Il Rosso – Aglianico", regionKey: "campania", variant: "red", typeKey: "red", price: 16.95, year: 2020, dot: "#6B0F1A" },
  { slug: "il-bianco-greco-cuvee", name: "Il Bianco – Greco Cuvée", regionKey: "campania", variant: "white", typeKey: "white", price: 11.95, year: 2022, dot: "#C8B77A" },
];

export const WINES = CATALOGUE.map((w) => ({ ...w, photos: cardPhotos(w.slug) }));

export const byName = (n) => WINES.find((w) => w.name === n);

export const bySlug = (s) => WINES.find((w) => w.slug === s);

/* Reihenfolge der Typ- und Regionsfilter — die Beschriftung kommt aus dem
   Wörterbuch, die Sortierung soll in allen Sprachen dieselbe sein. */
export const TYPE_KEYS = ["red", "white", "rose"];
export const REGION_KEYS = ["puglia", "campania", "garda"];

/* Slugs, für die bereits eine Landingpage unter app/unsere-weine/<slug>/ existiert.
   Geht eine neue Weinseite live, den Slug hier ergänzen — alle Karten
   verlinken dann automatisch dorthin. */
const DETAIL_PAGES = new Set([
  "falanghina",
  "greco-di-tufo",
  "il-bianco-greco-cuvee",
  "il-rosso-aglianico",
  "lugana",
  "primitivo-14-5",
  "primitivo-15-5",
  "primitivo-salento",
  "rosato-puglia",
]);

export const detailHref = (w) => (DETAIL_PAGES.has(w.slug) ? `/unsere-weine/${w.slug}` : null);

/* Karten-Link: eigene Landingpage, sonst der Shop als Kaufweg. Das
   Sprachpräfix hängt LocaleLink beim Rendern an — hier bleiben die Pfade
   sprachfrei. */
export const wineHref = (w) => detailHref(w) ?? "/shop";

export const REGION_COUNT = new Set(WINES.map((w) => w.regionKey)).size;
