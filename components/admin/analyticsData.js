/* Analytics layer for the admin overview.
   ------------------------------------------------------------------
   Structure is real: wine names, types, regions and the two production
   editions (18.000 / 12.000 Flaschen) all derive from the shared catalogue
   in components/data.js and the merchandising meta in shop/shopData.js, so
   this view can never drift from the portfolio.

   The MOVEMENT figures — bottles sold, revenue, order rows — are seeded
   specimens. There is no orders backend yet; they exist so the layout can be
   judged at realistic magnitudes. Every consumer surfaces them as
   "Beispieldaten". Replace `seed` + `ORDERS` with real queries and the
   derived aggregates below keep working unchanged. */

import { WINES } from "@/components/data";
import { WINE_META } from "@/components/shop/shopData";

/* ---------- allocation ----------
   Only two wines carry a published edition size. Anything else is stocked
   from the winery's open production, so it has no batch to track against —
   `batch: null` marks that rather than faking a denominator. */

const VESSEL = {
  "Primitivo 14,5": { vessel: "Stahltank", short: "Steel" },
  "Primitivo 15,5": { vessel: "Terrakotta-Amphore", short: "Amphore" },
};

/* bottles already committed (sold + allocated to trade) per edition wine */
const COMMITTED = {
  "Primitivo 14,5": 11_480,
  "Primitivo 15,5": 9_260,
};

const parseEdition = (s) => (s ? Number(s.replace(/[^\d]/g, "")) : null);

export const ALLOCATION = Object.keys(VESSEL).map((name) => {
  const batch = parseEdition(WINE_META[name]?.edition);
  const committed = COMMITTED[name] ?? 0;
  const remaining = batch == null ? null : batch - committed;
  return {
    name,
    ...VESSEL[name],
    batch,
    committed,
    remaining,
    /* share of the batch still available */
    pct: batch ? Math.round((remaining / batch) * 100) : null,
  };
});

export const ALLOCATION_TOTALS = ALLOCATION.reduce(
  (acc, a) => ({
    batch: acc.batch + (a.batch ?? 0),
    remaining: acc.remaining + (a.remaining ?? 0),
  }),
  { batch: 0, remaining: 0 },
);

/* ---------- revenue by wine type ----------
   Grouped by the catalogue's own `type`, plus the Amphore edition broken out
   as its own line: it is a vessel, not a wine type, but it is merchandised
   and reported separately, so the board wants to see it on its own. */

const SOLD = {
  "Primitivo 14,5": 4_120,
  "Primitivo 15,5": 2_980,
  "Primitivo Salento IGP": 3_240,
  Lugana: 2_760,
  "Greco di Tufo D.O.C.G.": 1_180,
  Falanghina: 2_410,
  "Rosato Puglia": 2_050,
  "Il Rosso – Aglianico": 1_090,
  "Il Bianco – Greco Cuvée": 1_460,
};

const AMPHORA_WINE = "Primitivo 15,5";

const TYPE_STYLE = {
  Rotwein: { label: "Rotwein", tone: "#6B0F1A" },
  Weißwein: { label: "Weißwein", tone: "#C8B77A" },
  Roséwein: { label: "Rosato", tone: "#c67f78" },
  Amphore: { label: "Amphore-Serie", tone: "#8A5A3B" },
};

function buildRevenue() {
  const groups = new Map();
  const add = (key, wine, bottles) => {
    const g = groups.get(key) ?? { key, bottles: 0, revenue: 0, wines: 0 };
    g.bottles += bottles;
    g.revenue += bottles * wine.price;
    g.wines += 1;
    groups.set(key, g);
  };

  for (const w of WINES) {
    const bottles = SOLD[w.name] ?? 0;
    /* the amphora edition reports on its own line, not under Rotwein */
    add(w.name === AMPHORA_WINE ? "Amphore" : w.type, w, bottles);
  }

  const rows = [...groups.values()].map((g) => ({
    ...g,
    ...TYPE_STYLE[g.key],
  }));
  const total = rows.reduce((s, r) => s + r.revenue, 0);
  return {
    rows: rows
      .map((r) => ({ ...r, share: total ? r.revenue / total : 0 }))
      .sort((a, b) => b.revenue - a.revenue),
    total,
    bottles: rows.reduce((s, r) => s + r.bottles, 0),
  };
}

export const REVENUE = buildRevenue();

/* ---------- regional performance ----------
   Keyed on the catalogue's `region` values. Salento is an Apulian sub-zone,
   so it appears as Apulien's detail line rather than as a peer region —
   the same relationship Sirmione has to the Gardasee. */

const REGION_META = {
  Apulien: { detail: "Salento · Manduria D.O.P.", trend: +12.4 },
  Kampanien: { detail: "Irpinia · Tufo", trend: +8.1 },
  Gardasee: { detail: "Sirmione · Lugana D.O.C.", trend: +5.6 },
  Basilikata: { detail: "Vulture · Aglianico", trend: -2.3 },
};

function buildRegions() {
  const groups = new Map();
  for (const w of WINES) {
    const bottles = SOLD[w.name] ?? 0;
    const g = groups.get(w.region) ?? { region: w.region, bottles: 0, revenue: 0, wines: [] };
    g.bottles += bottles;
    g.revenue += bottles * w.price;
    g.wines.push(w.name);
    groups.set(w.region, g);
  }
  const rows = [...groups.values()].map((g) => ({ ...g, ...REGION_META[g.region] }));
  const top = Math.max(...rows.map((r) => r.revenue));
  return rows
    .map((r) => ({ ...r, index: top ? r.revenue / top : 0 }))
    .sort((a, b) => b.revenue - a.revenue);
}

export const REGIONS = buildRegions();

/* ---------- orders & inquiries ---------- */

export const ORDERS = [
  { ref: "#2481", who: "Enoteca Bellini, Düsseldorf", kind: "order", status: "versandbereit", items: 24, total: 486.4, when: "vor 40 Min." },
  { ref: "#2480", who: "Ristorante Al Porto, Köln", kind: "order", status: "in Bearbeitung", items: 12, total: 214.8, when: "vor 2 Std." },
  { ref: "ANF-118", who: "Hotel Vier Jahreszeiten", kind: "inquiry", status: "Angebot offen", items: null, total: null, when: "vor 3 Std." },
  { ref: "#2479", who: "L. Hoffmann (Privat)", kind: "order", status: "bezahlt", items: 6, total: 79.9, when: "vor 5 Std." },
  { ref: "ANF-117", who: "Weinhandel Sørensen, DK", kind: "inquiry", status: "Export-Anfrage", items: null, total: null, when: "gestern" },
  { ref: "#2478", who: "Trattoria da Enzo, Neuss", kind: "order", status: "versandt", items: 18, total: 342.2, when: "gestern" },
];

export const ORDER_SUMMARY = {
  open: ORDERS.filter((o) => o.kind === "order" && o.status !== "versandt").length,
  inquiries: ORDERS.filter((o) => o.kind === "inquiry").length,
  value: ORDERS.reduce((s, o) => s + (o.total ?? 0), 0),
};

/* ---------- formatters ---------- */

const nf = new Intl.NumberFormat("de-DE");
export const fmtNum = (n) => nf.format(n);

export const fmtEur = (n) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export const fmtEurExact = (n) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export const fmtPct = (n) => `${n > 0 ? "+" : ""}${n.toLocaleString("de-DE")} %`;
