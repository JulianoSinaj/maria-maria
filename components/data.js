/* Shared wine catalogue — single source of truth for cards, carousels, filters. */
export const WINES = [
  { name: "Primitivo 14,5", region: "Apulien", variant: "red", type: "Rotwein", price: 12.9, year: 2021, notes: "Weich, vollmundig und harmonisch", dot: "#6B0F1A" },
  { name: "Primitivo 15,5", region: "Apulien", variant: "redsoft", type: "Rotwein", price: 16.9, year: 2020, notes: "Intensiv, kraftvoll und ausgewogen", dot: "#6B0F1A" },
  { name: "Primitivo Salento IGP", region: "Apulien", variant: "amber", type: "Rotwein", price: 11.5, year: 2022, notes: "Fruchtig, rund und zugänglich", dot: "#6B0F1A" },
  { name: "Lugana", region: "Gardasee", variant: "white", type: "Weißwein", price: 14.9, year: 2023, notes: "Elegant, frisch und mineralisch", dot: "#C8B77A" },
  { name: "Greco di Tufo D.O.C.G.", region: "Kampanien", variant: "white", type: "Weißwein", price: 18.9, year: 2022, notes: "Strukturiert, fein und aromatisch", dot: "#C8B77A" },
  { name: "Falanghina", region: "Kampanien", variant: "white", type: "Weißwein", price: 13.9, year: 2023, notes: "Frisch, fruchtig und lebendig", dot: "#C8B77A" },
  { name: "Rosato Puglia", region: "Apulien", variant: "rose", type: "Roséwein", price: 10.9, year: 2023, notes: "Zart, fruchtig und erfrischend", dot: "#c67f78" },
  { name: "Il Rosso – Aglianico", region: "Basilikata", variant: "red", type: "Rotwein", price: 17.5, year: 2020, notes: "Tiefgründig, würzig und charakterstark", dot: "#6B0F1A" },
  { name: "Il Bianco – Greco Cuvée", region: "Kampanien", variant: "white", type: "Weißwein", price: 15.5, year: 2022, notes: "Frisch, elegant und ausgewogen", dot: "#C8B77A" },
];

export const byName = (n) => WINES.find((w) => w.name === n);

export const fmtPrice = (p) => `${p.toFixed(2).replace(".", ",")} €`;

export const REGION_COUNT = new Set(WINES.map((w) => w.region)).size;
