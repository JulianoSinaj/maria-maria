/* Shop layer on top of the shared wine catalogue — merchandising meta,
   Probierpakete and a flat product lookup for the cart. The catalogue in
   components/data.js stays the single source of truth for the wines. */

import { WINES } from "@/components/data";

export const FREE_SHIPPING_FROM = 69;
export const SHIPPING_COST = 4.9;

/* merchandising accents, keyed by catalogue name */
export const WINE_META = {
  "Primitivo 14,5": { badge: "Bestseller" },
  Lugana: { badge: "Beliebt" },
  "Greco di Tufo D.O.C.G.": { badge: "Limitiert", scarce: true },
  "Il Rosso – Aglianico": { scarce: true },
  "Rosato Puglia": { badge: "Sommerwein" },
};

const wine = (name) => WINES.find((w) => w.name === name);

export const BUNDLES = [
  {
    id: "paket-trio-rosso",
    name: "Trio Rosso",
    tag: "Die Kraft des Südens",
    desc: "Drei charakterstarke Rotweine aus Apulien und der Basilikata – vom weichen Primitivo bis zum würzigen Aglianico.",
    wines: ["Primitivo 14,5", "Primitivo Salento IGP", "Il Rosso – Aglianico"],
    price: 37.9,
  },
  {
    id: "paket-grande-selezione",
    name: "Grande Selezione",
    tag: "Beliebteste Wahl",
    desc: "Sechs Weine, vier Regionen – die ganze Vielfalt Italiens in einem Paket. Versandkostenfrei zu Ihnen nach Hause.",
    wines: [
      "Primitivo 14,5",
      "Primitivo Salento IGP",
      "Il Rosso – Aglianico",
      "Lugana",
      "Greco di Tufo D.O.C.G.",
      "Falanghina",
    ],
    price: 79.9,
    featured: true,
  },
  {
    id: "paket-trio-bianco",
    name: "Trio Bianco",
    tag: "Frische & Eleganz",
    desc: "Drei elegante Weißweine vom Gardasee und aus Kampanien – mineralisch, fein und lebendig im Glas.",
    wines: ["Lugana", "Greco di Tufo D.O.C.G.", "Falanghina"],
    price: 42.9,
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

/* flat lookup: everything the cart can hold */
export const PRODUCTS = {};
WINES.forEach((w) => {
  PRODUCTS[wineId(w)] = {
    id: wineId(w),
    kind: "wine",
    name: w.name,
    price: w.price,
    sub: `${w.type} · ${w.region}`,
    variants: [w.variant],
  };
});
BUNDLES.forEach((b) => {
  PRODUCTS[b.id] = {
    id: b.id,
    kind: "bundle",
    name: b.name,
    price: b.price,
    sub: `Probierpaket · ${b.wines.length} Flaschen`,
    variants: [...new Set(bundleWines(b).map((w) => w.variant))],
  };
});
