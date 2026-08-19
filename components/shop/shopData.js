/* Shop layer on top of the shared wine catalogue — merchandising meta,
   Probierpakete and a flat product lookup for the cart. The catalogue in
   components/data.js stays the single source of truth for the wines.

   Wie components/data.js hält auch dieses Modul seit der Mehrsprachigkeit
   nur noch Struktur: IDs, Preise, Zusammenstellungen, Auflagenzahlen. Jeder
   sichtbare Satz — Paketbeschreibung, Badge, „Probierpaket · 3 Flaschen" —
   steht in content/<sprache>/common.js unter `shop`.

   Die Paketnamen („Trio Rosso", „Grande Selezione") bleiben stehen: Das sind
   Produktnamen, keine Beschreibungen. */

import { WINES } from "@/components/data";

export const FREE_SHIPPING_FROM = 69;
export const SHIPPING_COST = 4.9;

/* merchandising accents, keyed by catalogue name.
   edition = real production numbers from the winery.

   `badge` ist ein Schlüssel ins Wörterbuch, `edition` eine Zahl — vorher
   stand hier „18.000 Flaschen" als fertiger String, inklusive deutschem
   Tausenderpunkt und deutschem Substantiv. */
export const WINE_META = {
  "Primitivo di Manduria D.O.C. 14,5": { badge: "bestseller", edition: 18000 },
  "Primitivo di Manduria D.O.C. 15,5": { badge: "limited", edition: 12000 },
  "Lugana D.O.P.": { badge: "popular" },
  "Greco di Tufo D.O.C.G.": { scarce: true },
  "Il Rosso – Aglianico": { scarce: true },
  "Rosato Puglia": { badge: "summer" },
};

const wine = (name) => WINES.find((w) => w.name === name);

export const BUNDLES = [
  {
    id: "paket-trio-rosso",
    name: "Trio Rosso",
    wines: ["Primitivo di Manduria D.O.C. 14,5", "Primitivo Salento IGP", "Il Rosso – Aglianico"],
    price: 50.9,
  },
  {
    id: "paket-grande-selezione",
    name: "Grande Selezione",
    wines: [
      "Primitivo di Manduria D.O.C. 14,5",
      "Primitivo Salento IGP",
      "Il Rosso – Aglianico",
      "Lugana D.O.P.",
      "Greco di Tufo D.O.C.G.",
      "Falanghina I.G.P.",
    ],
    price: 84.9,
    featured: true,
  },
  {
    id: "paket-trio-bianco",
    name: "Trio Bianco",
    wines: ["Lugana D.O.P.", "Greco di Tufo D.O.C.G.", "Falanghina I.G.P."],
    price: 34.9,
  },
];

export const bundleWines = (b) => b.wines.map(wine).filter(Boolean);
export const bundleSum = (b) => bundleWines(b).reduce((s, w) => s + w.price, 0);
export const bundleSaving = (b) => bundleSum(b) - b.price;

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const wineId = (w) => `wein-${slug(w.name)}`;

/* flat lookup: everything the cart can hold.
   photos = echte Packshot-Vorderseiten für die Warenkorb-Miniatur.

   `sub` fehlt hier bewusst — die Unterzeile („Rotwein · Apulien") hängt an
   der Sprache und würde als Modul-Konstante in der Sprache einfrieren, in der
   das Modul zufällig zuerst ausgewertet wurde. Sie entsteht stattdessen beim
   Rendern über productSub(). */
export const PRODUCTS = {};
WINES.forEach((w) => {
  PRODUCTS[wineId(w)] = {
    id: wineId(w),
    kind: "wine",
    slug: w.slug,
    name: w.name,
    price: w.price,
    variants: [w.variant],
    photos: w.photos ? [w.photos.front] : null,
  };
});
BUNDLES.forEach((b) => {
  const wines = bundleWines(b);
  PRODUCTS[b.id] = {
    id: b.id,
    kind: "bundle",
    name: b.name,
    price: b.price,
    bottles: b.wines.length,
    variants: [...new Set(wines.map((w) => w.variant))],
    photos: wines.every((w) => w.photos) ? wines.map((w) => w.photos.front) : null,
  };
});

/* Unterzeile eines Warenkorb-Eintrags in der aktiven Sprache.
   Wein   → „Rotwein · Apulien"
   Paket  → „Probierpaket · 3 Flaschen" */
export function productSub(product, common = {}) {
  if (!product) return "";
  if (product.kind === "bundle") {
    return (common.shop?.bundleSub ?? "").replace("{count}", product.bottles);
  }
  const cat = common.catalogue ?? {};
  const structure = WINES.find((w) => w.slug === product.slug);
  if (!structure) return "";
  const type = cat.types?.[structure.typeKey] ?? "";
  const region = cat.regions?.[structure.regionKey] ?? "";
  return [type, region].filter(Boolean).join(" · ");
}
