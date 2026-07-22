/* Shared wine catalogue — single source of truth for cards, carousels, filters. */
export const WINES = [
  { slug: "primitivo-14-5", name: "Primitivo 14,5", region: "Apulien", variant: "red", type: "Rotwein", price: 12.9, year: 2021, notes: "Weich, vollmundig und harmonisch", dot: "#6B0F1A" },
  { slug: "primitivo-15-5", name: "Primitivo 15,5", region: "Apulien", variant: "redsoft", type: "Rotwein", price: 16.9, year: 2020, notes: "Intensiv, kraftvoll und ausgewogen", dot: "#6B0F1A" },
  { slug: "primitivo-salento", name: "Primitivo Salento IGP", region: "Apulien", variant: "amber", type: "Rotwein", price: 11.5, year: 2022, notes: "Fruchtig, rund und zugänglich", dot: "#6B0F1A" },
  { slug: "lugana", name: "Lugana", region: "Gardasee", variant: "white", type: "Weißwein", price: 14.9, year: 2023, notes: "Elegant, frisch und mineralisch", dot: "#C8B77A" },
  { slug: "greco-di-tufo", name: "Greco di Tufo D.O.C.G.", region: "Kampanien", variant: "white", type: "Weißwein", price: 18.9, year: 2022, notes: "Strukturiert, fein und aromatisch", dot: "#C8B77A" },
  { slug: "falanghina", name: "Falanghina", region: "Kampanien", variant: "white", type: "Weißwein", price: 13.9, year: 2023, notes: "Frisch, fruchtig und lebendig", dot: "#C8B77A", photos: { front: "/img/wines/falanghina/card-front.jpg", back: "/img/wines/falanghina/card-back.jpg" } },
  { slug: "rosato-puglia", name: "Rosato Puglia", region: "Apulien", variant: "rose", type: "Roséwein", price: 10.9, year: 2023, notes: "Zart, fruchtig und erfrischend", dot: "#c67f78" },
  { slug: "il-rosso-aglianico", name: "Il Rosso – Aglianico", region: "Basilikata", variant: "red", type: "Rotwein", price: 17.5, year: 2020, notes: "Tiefgründig, würzig und charakterstark", dot: "#6B0F1A" },
  { slug: "il-bianco-greco-cuvee", name: "Il Bianco – Greco Cuvée", region: "Kampanien", variant: "white", type: "Weißwein", price: 15.5, year: 2022, notes: "Frisch, elegant und ausgewogen", dot: "#C8B77A" },
];

export const byName = (n) => WINES.find((w) => w.name === n);

/* Slugs, für die bereits eine Landingpage unter app/weine/<slug>/ existiert.
   Geht eine neue Weinseite live, den Slug hier ergänzen — alle Karten
   verlinken dann automatisch dorthin. */
const DETAIL_PAGES = new Set(["falanghina"]);

export const detailHref = (w) => (DETAIL_PAGES.has(w.slug) ? `/weine/${w.slug}` : null);

/* Karten-Link: eigene Landingpage, sonst der Shop als Kaufweg. */
export const wineHref = (w) => detailHref(w) ?? "/shop";

export const fmtPrice = (p) => `${p.toFixed(2).replace(".", ",")} €`;

export const REGION_COUNT = new Set(WINES.map((w) => w.region)).size;
