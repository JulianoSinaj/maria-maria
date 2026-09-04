/* Seed inventory — the nine real Maria Maria wines.
   ==================================================================
   PROVENANCE, field by field:
     name / vintage / price / region  → components/data.js (catalogue)
     appellation.name                 → the `Bezeichnung` row of each
                                        components/weine/<slug>/wineData.js
     aging.vessel / months / detail   → the `Ausbau` fact of the same file
     abv                              → the `Alkoholgehalt` row
     batch.size                       → components/shop/shopData.js `edition`
                                        (only two wines publish one)
     tastingNotes                     → catalogue `notes`
     pairingNotes                     → catalogue `pairing`
     label.*                          → read off the real packshots in
                                        public/img/wines/<slug>/card-front.webp

   batch.committed is the one INVENTED field — there is no stock backend yet.
   It is flagged in every consumer as sample data. Everything else is real. */

import { DEFAULT_PRODUCT_HANDLES } from "@/lib/shop/handles";
import { AGING, TIER, STYLE, PAIRING, ACCENT, WORDMARK, STATUS, EMPTY_SHOP } from "./schema";

/* House label system: black band, white outlined wordmark, accent stripes. */
const banded = (accent, ground = "Silber-/Weißfeld mit Akzentstreifen") => ({
  wordmark: WORDMARK.BANDED,
  accent,
  redAccent: accent === ACCENT.RED,
  ground,
});

const WINES = [
  {
    id: "inv-primitivo-14-5",
    slug: "primitivo-14-5",
    name: "Primitivo 14,5",
    fullName: "Primitivo di Manduria D.O.P. 14,50",
    vintage: 2021,
    appellation: {
      name: "Primitivo di Manduria D.O.P.",
      tier: TIER.DOP,
      region: "Apulien",
      zone: "Torricella",
    },
    style: STYLE.RED,
    aging: {
      vessel: AGING.STEEL,
      months: 12,
      detail: "12 Monate im Stahltank bis zur Abfüllung",
    },
    batch: { size: 18_000, committed: 11_480, lot: "MAN-21-A" },
    price: 25.95,
    abv: 14.5,
    pairings: [PAIRING.MEAT, PAIRING.RICH],
    pairingNotes: "Ideal zu Pasta, Grillgerichten und reifem Käse.",
    tastingNotes: ["weich", "vollmundig", "harmonisch"],
    tastingText:
      "Rubinrot mit violetten Reflexen. Weich und vollmundig, mit warmer Frucht und samtigem Abgang.",
    label: banded(ACCENT.RED),
    status: STATUS.ACTIVE,
  },
  {
    id: "inv-primitivo-15-5",
    slug: "primitivo-15-5",
    name: "Primitivo 15,5",
    fullName: "Primitivo di Manduria D.O.P. 15,50",
    vintage: 2020,
    appellation: {
      name: "Primitivo di Manduria D.O.P.",
      tier: TIER.DOP,
      region: "Apulien",
      zone: "Torricella · Maruggio",
    },
    style: STYLE.RED,
    aging: {
      vessel: AGING.AMPHORA,
      months: 12,
      detail: "12 Monate in antiken Terrakotta-Giare (capasoni) bis zur Füllung",
    },
    batch: { size: 12_000, committed: 9_260, lot: "MAN-20-C" },
    price: 28.95,
    abv: 15.5,
    pairings: [PAIRING.MEAT, PAIRING.RICH],
    pairingNotes: "Zu geschmortem Fleisch, Wild und gereiftem Käse.",
    tastingNotes: ["intensiv", "kraftvoll", "ausgewogen"],
    tastingText:
      "Dicht und undurchdringlich im Glas. Zwölf Monate in Amphoren geben ihm Tiefe ohne Holznote.",
    label: banded(ACCENT.RED),
    status: STATUS.ACTIVE,
  },
  {
    id: "inv-primitivo-salento",
    slug: "primitivo-salento",
    name: "Primitivo Salento IGP",
    fullName: "Primitivo I.G.P. Salento",
    vintage: 2022,
    appellation: {
      name: "Primitivo I.G.P. Salento",
      tier: TIER.IGP,
      region: "Apulien",
      zone: "Salento",
    },
    style: STYLE.RED,
    aging: {
      vessel: AGING.STEEL,
      months: 12,
      detail: "12 Monate im Stahltank bis zur Abfüllung",
    },
    batch: { size: null, committed: 3_240 },
    price: 12.95,
    abv: 14.5,
    pairings: [PAIRING.MEAT, PAIRING.RICH],
    pairingNotes: "Unkompliziert zu Pizza, Pasta und geselligen Abenden.",
    tastingNotes: ["fruchtig", "rund", "zugänglich"],
    label: banded(ACCENT.RED),
    status: STATUS.ACTIVE,
  },
  {
    id: "inv-il-rosso-aglianico",
    slug: "il-rosso-aglianico",
    name: "Il Rosso – Aglianico",
    fullName: "Il Rosso — Campania Rosso I.G.P.",
    vintage: 2020,
    appellation: {
      name: "Campania Rosso I.G.P.",
      tier: TIER.IGP,
      region: "Kampanien",
      zone: "Irpinia",
    },
    style: STYLE.RED,
    aging: {
      vessel: AGING.OAK,
      months: 6,
      detail: "6 Monate in Fässern aus französischer Eiche",
    },
    batch: { size: null, committed: 1_090 },
    price: 16.95,
    abv: 14.0,
    pairings: [PAIRING.MEAT, PAIRING.RICH],
    pairingNotes: "Ein Begleiter zu Pasta al forno, Grillfleisch und Käse.",
    tastingNotes: ["tiefgründig", "würzig", "charakterstark"],
    tastingText:
      "Sechs Monate französische Eiche geben dem Aglianico Struktur, Würze und einen langen Abgang.",
    label: banded(ACCENT.RED),
    status: STATUS.ACTIVE,
  },
  {
    id: "inv-lugana",
    slug: "lugana",
    name: "Lugana",
    fullName: "Lugana DOC",
    vintage: 2023,
    appellation: {
      name: "Lugana DOC",
      tier: TIER.DOC,
      region: "Gardasee",
      zone: "Sirmione",
    },
    style: STYLE.WHITE,
    aging: {
      vessel: AGING.STEEL,
      months: 6,
      detail: "Auf der Feinhefe bis zur Abfüllung",
    },
    batch: { size: null, committed: 2_760 },
    price: 12.95,
    abv: 13.0,
    pairings: [PAIRING.FISH, PAIRING.APERITIF],
    pairingNotes: "Ideal zu Fisch, Pasta mit Pesto oder hellem Fleisch.",
    tastingNotes: ["elegant", "frisch", "mineralisch"],
    tastingText:
      "Trebbiano di Lugana vom Südufer des Gardasees — strohgelb, mineralisch, mit feiner Salzigkeit.",
    label: banded(ACCENT.STRAW),
    status: STATUS.ACTIVE,
  },
  {
    id: "inv-greco-di-tufo",
    slug: "greco-di-tufo",
    name: "Greco di Tufo D.O.C.G.",
    fullName: "Greco di Tufo D.O.C.G.",
    vintage: 2022,
    appellation: {
      name: "Greco di Tufo D.O.C.G.",
      tier: TIER.DOCG,
      region: "Kampanien",
      zone: "Tufo · Irpinia",
    },
    style: STYLE.WHITE,
    aging: { vessel: AGING.STEEL, months: 12, detail: "1 Jahr im Stahltank" },
    batch: { size: null, committed: 1_180 },
    price: 13.95,
    abv: 13.0,
    pairings: [PAIRING.FISH, PAIRING.APERITIF],
    pairingNotes: "Zu Meeresfrüchten, gegrilltem Fisch und feiner Küche.",
    tastingNotes: ["strukturiert", "fein", "aromatisch"],
    tastingText:
      "Der einzige D.O.C.G. der Kollektion — vulkanische Böden geben ihm Struktur und Länge.",
    label: banded(ACCENT.STRAW),
    status: STATUS.ACTIVE,
  },
  {
    id: "inv-falanghina",
    slug: "falanghina",
    name: "Falanghina",
    fullName: "Beneventano Falanghina IGP",
    vintage: 2023,
    appellation: {
      name: "Beneventano Falanghina IGP",
      tier: TIER.IGP,
      region: "Kampanien",
      zone: "Benevento",
    },
    style: STYLE.WHITE,
    aging: {
      vessel: AGING.STEEL,
      months: 12,
      bottleMonths: 2,
      detail: "1 Jahr im Stahltank, 2 Monate Flaschenreife",
    },
    batch: { size: null, committed: 2_410 },
    price: 11.49,
    abv: 13.0,
    pairings: [PAIRING.APERITIF, PAIRING.FISH],
    pairingNotes: "Perfekt zum Aperitivo, zu Meeresfrüchten oder Salaten.",
    tastingNotes: ["frisch", "fruchtig", "lebendig"],
    label: banded(ACCENT.ACQUA, "Acqua-Karo mit weißem Schriftfeld"),
    status: STATUS.ACTIVE,
  },
  {
    id: "inv-il-bianco-greco-cuvee",
    slug: "il-bianco-greco-cuvee",
    name: "Il Bianco – Greco Cuvée",
    fullName: "Il Bianco — Campania Bianco IGP",
    vintage: 2022,
    appellation: {
      name: "Campania Bianco IGP",
      tier: TIER.IGP,
      region: "Kampanien",
      zone: "Irpinia",
    },
    style: STYLE.WHITE,
    aging: { vessel: AGING.STEEL, months: 24, detail: "2 Jahre im Stahltank" },
    batch: { size: null, committed: 1_460 },
    price: 11.95,
    abv: 13.0,
    pairings: [PAIRING.APERITIF, PAIRING.FISH],
    pairingNotes: "Ein Genuss zu Antipasti, Fisch und leichten Gerichten.",
    tastingNotes: ["frisch", "elegant", "ausgewogen"],
    tastingText: "Zwei Jahre Stahltank — ungewöhnlich lang für einen Weißwein dieser Preisklasse.",
    label: banded(ACCENT.STRAW),
    status: STATUS.ACTIVE,
  },
  {
    id: "inv-rosato-puglia",
    slug: "rosato-puglia",
    name: "Rosato Puglia",
    fullName: "Rosato Negroamaro I.G.P. Salento",
    vintage: 2023,
    appellation: {
      name: "Rosato Negroamaro I.G.P. Salento",
      tier: TIER.IGP,
      region: "Apulien",
      zone: "Salento",
    },
    style: STYLE.ROSE,
    aging: { vessel: AGING.STEEL, months: 3, detail: "3 Monate im Stahltank bis zur Abfüllung" },
    batch: { size: null, committed: 2_050 },
    price: 11.95,
    abv: 12.0,
    pairings: [PAIRING.APERITIF, PAIRING.FISH],
    pairingNotes: "Herrlich zu Antipasti, Salaten oder gegrilltem Gemüse.",
    tastingNotes: ["zart", "fruchtig", "erfrischend"],
    tastingText: "Aus Negroamaro — zartes Pfirsichrosa, trocken und erfrischend.",
    /* the Rosato is the one label that inverts the system: no black band,
       cream field, wordmark drawn in coral line-art */
    label: {
      wordmark: WORDMARK.TINTED,
      accent: ACCENT.CORAL,
      redAccent: false,
      ground: "Cremefeld ohne Band",
      notes: "Einzige Etikettvariante ohne schwarzes Schriftband.",
    },
    status: STATUS.ACTIVE,
  },
];

/* The shop link is attached rather than typed out nine times, and it is
   attached from lib/shop/handles.js — the same table the storefront's
   shopHref() resolves against. Two lists of the same nine handles would
   drift the first time one of them is corrected; there is one.

   Only the handle is seeded. Price, availability and the timestamp stay
   null until a sync has actually spoken to the shop: a seeded price would
   be a claim about someone else's shop that nobody ever verified. */
export const SEED_WINES = WINES.map((wine) => ({
  ...wine,
  shop: { ...EMPTY_SHOP, handle: DEFAULT_PRODUCT_HANDLES[wine.slug] ?? null },
}));
