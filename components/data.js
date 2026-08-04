/* Shared wine catalogue — single source of truth for cards, carousels, filters. */

/* Jede Flasche liegt als freigestelltes Karten-Packshot-Paar unter
   public/img/wines/<slug>/card-front.webp + card-back.webp — WebP mit Alpha,
   Studiohintergrund entfernt (erzeugt via `npm run crop:cards`). */
const cardPhotos = (slug) => ({
  front: `/img/wines/${slug}/card-front.webp`,
  back: `/img/wines/${slug}/card-back.webp`,
});

const CATALOGUE = [
  { slug: "primitivo-14-5", name: "Primitivo 14,5", region: "Apulien", variant: "red", type: "Rotwein", price: 12.9, year: 2021, notes: "Weich, vollmundig und harmonisch", pairing: "Ideal zu Pasta, Grillgerichten und reifem Käse.", dot: "#6B0F1A" },
  { slug: "primitivo-15-5", name: "Primitivo 15,5", region: "Apulien", variant: "redsoft", type: "Rotwein", price: 16.9, year: 2020, notes: "Intensiv, kraftvoll und ausgewogen", pairing: "Zu geschmortem Fleisch, Wild und gereiftem Käse.", dot: "#6B0F1A" },
  { slug: "primitivo-salento", name: "Primitivo Salento IGP", region: "Apulien", variant: "amber", type: "Rotwein", price: 11.5, year: 2022, notes: "Fruchtig, rund und zugänglich", pairing: "Unkompliziert zu Pizza, Pasta und geselligen Abenden.", dot: "#6B0F1A" },
  { slug: "lugana", name: "Lugana", region: "Gardasee", variant: "white", type: "Weißwein", price: 14.9, year: 2023, notes: "Elegant, frisch und mineralisch", pairing: "Ideal zu Fisch, Pasta mit Pesto oder hellem Fleisch.", dot: "#C8B77A" },
  { slug: "greco-di-tufo", name: "Greco di Tufo D.O.C.G.", region: "Kampanien", variant: "white", type: "Weißwein", price: 18.9, year: 2022, notes: "Strukturiert, fein und aromatisch", pairing: "Zu Meeresfrüchten, gegrilltem Fisch und feiner Küche.", dot: "#C8B77A" },
  { slug: "falanghina", name: "Falanghina", region: "Kampanien", variant: "white", type: "Weißwein", price: 13.9, year: 2023, notes: "Frisch, fruchtig und lebendig", pairing: "Perfekt zum Aperitivo, zu Meeresfrüchten oder Salaten.", dot: "#C8B77A" },
  { slug: "rosato-puglia", name: "Rosato Puglia", region: "Apulien", variant: "rose", type: "Roséwein", price: 10.9, year: 2023, notes: "Zart, fruchtig und erfrischend", pairing: "Herrlich zu Antipasti, Salaten oder gegrilltem Gemüse.", dot: "#c67f78" },
  { slug: "il-rosso-aglianico", name: "Il Rosso – Aglianico", region: "Kampanien", variant: "red", type: "Rotwein", price: 17.5, year: 2020, notes: "Tiefgründig, würzig und charakterstark", pairing: "Ein Begleiter zu Pasta al forno, Grillfleisch und Käse.", dot: "#6B0F1A" },
  { slug: "il-bianco-greco-cuvee", name: "Il Bianco – Greco Cuvée", region: "Kampanien", variant: "white", type: "Weißwein", price: 15.5, year: 2022, notes: "Frisch, elegant und ausgewogen", pairing: "Ein Genuss zu Antipasti, Fisch und leichten Gerichten.", dot: "#C8B77A" },
];

export const WINES = CATALOGUE.map((w) => ({ ...w, photos: cardPhotos(w.slug) }));

export const byName = (n) => WINES.find((w) => w.name === n);

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

/* Karten-Link: eigene Landingpage, sonst der Shop als Kaufweg. */
export const wineHref = (w) => detailHref(w) ?? "/shop";

export const fmtPrice = (p) => `${p.toFixed(2).replace(".", ",")} €`;

/* Charakterworte fürs Kollektions-Layout: „Elegant, frisch und mineralisch"
   → ["elegant", "frisch", "mineralisch"] — die Karten setzen sie mit „·"
   getrennt unter den Namen. */
export const tasteWords = (w) =>
  w.notes
    .toLowerCase()
    .split(/,\s*|\s+und\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

export const REGION_COUNT = new Set(WINES.map((w) => w.region)).size;
