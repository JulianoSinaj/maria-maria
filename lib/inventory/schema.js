/* Maria Maria — wine inventory schema.
   ==================================================================
   Single source of truth for the SHAPE of an inventory item. Enums are
   exported as frozen objects so the admin UI, the mock API and any future
   real backend all validate against the same vocabulary instead of comparing
   loose strings.

   Grounding: every enum value here reflects something that actually exists in
   the project today —
     · aging vessels        → the `Ausbau` facts in each wine's wineData.js
     · appellation tiers    → the D.O.C.G./D.O.P./DOC/IGP names on the labels
     · label accent colours → the real packshots in public/img/wines/*
                              (red on Primitivo, acqua on Falanghina, …)
     · batch sizes          → components/shop/shopData.js `edition`

   Nothing here invents a category the brand does not use. */

/* ---------------------------------------------------------------- enums ---- */

/** Aging vessel. The three the house actually uses. */
export const AGING = Object.freeze({
  STEEL: "steel",
  AMPHORA: "amphora",
  OAK: "oak",
});

export const AGING_LABEL = Object.freeze({
  [AGING.STEEL]: "Stahltank",
  [AGING.AMPHORA]: "Terrakotta-Amphore",
  [AGING.OAK]: "Eichenfass",
});

/** Quality tier of the appellation, in descending legal rank. */
export const TIER = Object.freeze({
  DOCG: "DOCG",
  DOP: "DOP",
  DOC: "DOC",
  IGP: "IGP",
});

/** Wine colour/style — mirrors the catalogue's `type` field. */
export const STYLE = Object.freeze({
  RED: "red",
  WHITE: "white",
  ROSE: "rose",
});

export const STYLE_LABEL = Object.freeze({
  [STYLE.RED]: "Rotwein",
  [STYLE.WHITE]: "Weißwein",
  [STYLE.ROSE]: "Roséwein",
});

/** Food-pairing categories. Exactly the four the brief calls for. */
export const PAIRING = Object.freeze({
  MEAT: "meat",
  FISH: "fish",
  APERITIF: "aperitif",
  RICH: "rich",
});

export const PAIRING_LABEL = Object.freeze({
  [PAIRING.MEAT]: "Fleisch",
  [PAIRING.FISH]: "Fisch",
  [PAIRING.APERITIF]: "Aperitif",
  [PAIRING.RICH]: "Herzhafte Menüs",
});

/* Label accent.
   The wordmark band is constant across the range — white outlined lettering on
   black — so what distinguishes a label is the accent stripe colour. RED is
   the house default (all Primitivo, Il Rosso); the whites and the rosato carry
   their own accent. Hex values are the existing design tokens, so the admin
   swatches and the storefront can never drift apart. */
export const ACCENT = Object.freeze({
  RED: "red",
  ACQUA: "acqua",
  STRAW: "straw",
  CORAL: "coral",
});

/* hex = the accent as it prints on the label (read off the packshots in
   public/img/wines/*), token = the nearest existing Tailwind colour so admin
   swatches reuse the design system rather than hard-coding new values. */
export const ACCENT_META = Object.freeze({
  [ACCENT.RED]: { label: "Rot", hex: "#E1140A", token: "bordeaux" },
  [ACCENT.ACQUA]: { label: "Acqua", hex: "#45B3A2", token: "acqua" },
  [ACCENT.STRAW]: { label: "Gold", hex: "#C8B77A", token: "champagne" },
  [ACCENT.CORAL]: { label: "Koralle", hex: "#E8853F", token: "rose" },
});

/* Wordmark treatment. Two families exist on the shelf today:
     · BANDED  — the house standard: a black band carrying the MARIA MARIA
                 wordmark in white outlined lettering, over a silver/white
                 field with accent stripes (Primitivo, Lugana, Greco, …).
     · TINTED  — the Rosato inverts it: no black band, a plain cream field
                 with the wordmark drawn in the accent colour itself.
   BLACK_ON_WHITE is reserved for a future dark-on-light edition. */
export const WORDMARK = Object.freeze({
  BANDED: "banded-white-on-black",
  TINTED: "tinted-line-art",
  BLACK_ON_WHITE: "black-on-white",
});

export const WORDMARK_LABEL = Object.freeze({
  [WORDMARK.BANDED]: "Weiße Kontur auf schwarzem Band",
  [WORDMARK.TINTED]: "Linienschrift in Akzentfarbe",
  [WORDMARK.BLACK_ON_WHITE]: "Schwarz auf Weiß",
});

/** True when the wordmark is the white-outlined-on-black house treatment —
    the "white text" status the label brief asks after. */
export const hasWhiteWordmark = (item) => item?.label?.wordmark === WORDMARK.BANDED;

/* Where an item stands in the sales cycle.
   ACTIVE / LOW / SOLD_OUT are DERIVED from stock — never store them and
   expect them to stay true. DRAFT and ARCHIVED are EDITORIAL states the
   editor sets by hand, and they win over whatever the stock says. */
export const STATUS = Object.freeze({
  ACTIVE: "active",
  LOW: "low",
  SOLD_OUT: "sold-out",
  DRAFT: "draft",
  ARCHIVED: "archived",
});

export const STATUS_LABEL = Object.freeze({
  [STATUS.ACTIVE]: "Verfügbar",
  [STATUS.LOW]: "Knapp",
  [STATUS.SOLD_OUT]: "Ausverkauft",
  [STATUS.DRAFT]: "Entwurf",
  [STATUS.ARCHIVED]: "Archiviert",
});

/** Editorial states — set by a person, not computed from stock. */
export const EDITORIAL_STATUS = Object.freeze([STATUS.DRAFT, STATUS.ARCHIVED]);

export const isArchived = (item) => item?.status === STATUS.ARCHIVED;

/* Merchandising categories for the portfolio filter tabs.
   These are NOT the same axis as `style`: the Amphorae series is defined by
   its vessel and cuts across colour (today it is a red), so a wine can match
   both "Rotweine" and "Amphoren-Serie". Each category carries its own
   predicate rather than a stored field, so nothing can fall out of sync. */
export const CATEGORY = Object.freeze({
  ALL: "all",
  RED: "red",
  WHITE: "white",
  ROSE: "rose",
  AMPHORA: "amphora",
});

export const CATEGORIES = Object.freeze([
  { key: CATEGORY.ALL, label: "Alle", hint: "Gesamte Kollektion" },
  { key: CATEGORY.RED, label: "Rotweine", hint: "Primitivo & Aglianico" },
  { key: CATEGORY.WHITE, label: "Weißweine", hint: "Lugana · Falanghina · Greco" },
  { key: CATEGORY.ROSE, label: "Rosato", hint: "Negroamaro" },
  { key: CATEGORY.AMPHORA, label: "Amphoren-Serie", hint: "Terrakotta-Ausbau" },
]);

/** Does an item belong to a merchandising category? */
export function inCategory(item, category) {
  switch (category) {
    case CATEGORY.ALL:
      return true;
    case CATEGORY.AMPHORA:
      return item.aging?.vessel === AGING.AMPHORA;
    case CATEGORY.RED:
      return item.style === STYLE.RED;
    case CATEGORY.WHITE:
      return item.style === STYLE.WHITE;
    case CATEGORY.ROSE:
      return item.style === STYLE.ROSE;
    default:
      return true;
  }
}

/* ------------------------------------------------------- item contract ---- */

/**
 * @typedef {Object} Appellation
 * @property {string} name    Full legal name, e.g. "Primitivo di Manduria D.O.P."
 * @property {TIER}   tier    Quality tier.
 * @property {string} region  Administrative region, e.g. "Apulien".
 * @property {string} [zone]  Sub-zone / comune, e.g. "Manduria" or "Sirmione".
 */

/**
 * @typedef {Object} Aging
 * @property {AGING}  vessel    Which vessel.
 * @property {number} months    Months in that vessel.
 * @property {string} [detail]  Verbatim datasheet wording, e.g.
 *                              "12 Monate in antiken Terrakotta-Giare (capasoni)".
 * @property {number} [bottleMonths] Additional bottle maturation, in months.
 */

/**
 * @typedef {Object} Batch
 * @property {number|null} size       Published edition size in bottles, or null
 *                                    when the wine comes from open production
 *                                    and has no fixed batch to track against.
 * @property {number}      committed  Bottles sold or allocated to trade.
 * @property {string}      [lot]      Winery lot reference.
 */

/**
 * @typedef {Object} LabelDesign
 * @property {WORDMARK} wordmark   Wordmark treatment.
 * @property {ACCENT}   accent     Accent stripe colour.
 * @property {boolean}  redAccent  Convenience flag: is this a red-accent label?
 *                                 Derived — kept on the record so lists can
 *                                 filter without importing the enum.
 * @property {string}   [ground]   Background treatment of the label field.
 * @property {string}   [notes]    Print/finish notes, e.g. embossing.
 */

/**
 * @typedef {Object} WineItem
 * @property {string}      id            Stable inventory id.
 * @property {string}      slug          Catalogue slug — joins components/data.js.
 * @property {string}      name          Display name, e.g. "Primitivo 15,5".
 * @property {string}      fullName      Label name incl. appellation.
 * @property {number}      vintage       Harvest year.
 * @property {Appellation} appellation
 * @property {STYLE}       style
 * @property {Aging}       aging
 * @property {Batch}       batch
 * @property {number}      price         Gross price per bottle in EUR.
 * @property {number}      [abv]         Alcohol by volume, percent.
 * @property {PAIRING[]}   pairings      Pairing categories.
 * @property {string}      pairingNotes  Prose pairing recommendation.
 * @property {string[]}    tastingNotes  Character words, e.g. ["intensiv", …].
 * @property {string}      [tastingText] Longer tasting description.
 * @property {LabelDesign} label
 * @property {STATUS}      status
 */

/* ------------------------------------------------------ derived helpers ---- */

/** Bottles still sellable, or null when the wine has no fixed batch. */
export const remaining = (item) =>
  item.batch.size == null ? null : item.batch.size - item.batch.committed;

/** Share of the batch still available (0–1), or null without a batch. */
export const remainingShare = (item) => {
  const left = remaining(item);
  return left == null || !item.batch.size ? null : left / item.batch.size;
};

/** True when a limited edition has dipped to a quarter or less. */
export const isScarce = (item) => {
  const share = remainingShare(item);
  return share != null && share <= 0.25;
};

/** Status derived from stock rather than stored, so it cannot go stale.
    A stored DRAFT always wins — it is an editorial state, not a stock one. */
export function deriveStatus(item) {
  if (EDITORIAL_STATUS.includes(item.status)) return item.status;
  const left = remaining(item);
  if (left != null && left <= 0) return STATUS.SOLD_OUT;
  return isScarce(item) ? STATUS.LOW : STATUS.ACTIVE;
}

/** Total months of maturation, vessel plus bottle. */
export const totalAging = (item) => item.aging.months + (item.aging.bottleMonths ?? 0);

/* ---------------------------------------------------------- validation ---- */

const inEnum = (enumObj, v) => Object.values(enumObj).includes(v);

/**
 * Structural validation. Returns a list of human-readable problems — empty
 * means valid. Used by the mock API's write path so malformed records are
 * rejected at the boundary rather than corrupting the store.
 */
export function validateItem(item) {
  const errs = [];
  const req = (cond, msg) => {
    if (!cond) errs.push(msg);
  };

  req(typeof item?.name === "string" && item.name.trim(), "name is required");
  req(typeof item?.slug === "string" && item.slug.trim(), "slug is required");
  req(
    Number.isInteger(item?.vintage) && item.vintage >= 1900 && item.vintage <= 2100,
    "vintage must be a four-digit year",
  );
  req(typeof item?.price === "number" && item.price > 0, "price must be a positive number");

  req(inEnum(STYLE, item?.style), `style must be one of ${Object.values(STYLE).join(", ")}`);
  req(inEnum(STATUS, item?.status), `status must be one of ${Object.values(STATUS).join(", ")}`);

  /* appellation */
  req(typeof item?.appellation?.name === "string" && item.appellation.name.trim(),
    "appellation.name is required");
  req(inEnum(TIER, item?.appellation?.tier),
    `appellation.tier must be one of ${Object.values(TIER).join(", ")}`);
  req(typeof item?.appellation?.region === "string" && item.appellation.region.trim(),
    "appellation.region is required");

  /* aging */
  req(inEnum(AGING, item?.aging?.vessel),
    `aging.vessel must be one of ${Object.values(AGING).join(", ")}`);
  req(typeof item?.aging?.months === "number" && item.aging.months >= 0,
    "aging.months must be a non-negative number");

  /* batch — null size is legal (open production), a negative one is not */
  const size = item?.batch?.size;
  req(size === null || (Number.isInteger(size) && size > 0),
    "batch.size must be a positive integer or null");
  req(Number.isInteger(item?.batch?.committed) && item.batch.committed >= 0,
    "batch.committed must be a non-negative integer");
  if (Number.isInteger(size) && Number.isInteger(item?.batch?.committed)) {
    req(item.batch.committed <= size, "batch.committed cannot exceed batch.size");
  }

  /* pairings */
  req(Array.isArray(item?.pairings) && item.pairings.length > 0,
    "pairings must be a non-empty array");
  (item?.pairings ?? []).forEach((p) => {
    req(inEnum(PAIRING, p), `unknown pairing "${p}"`);
  });

  /* tasting */
  req(Array.isArray(item?.tastingNotes) && item.tastingNotes.length > 0,
    "tastingNotes must be a non-empty array");

  /* label */
  req(inEnum(WORDMARK, item?.label?.wordmark),
    `label.wordmark must be one of ${Object.values(WORDMARK).join(", ")}`);
  req(inEnum(ACCENT, item?.label?.accent),
    `label.accent must be one of ${Object.values(ACCENT).join(", ")}`);
  if (item?.label && inEnum(ACCENT, item.label.accent)) {
    req(item.label.redAccent === (item.label.accent === ACCENT.RED),
      "label.redAccent must agree with label.accent");
  }

  return errs;
}

/** Throwing variant for the write path. */
export function assertItem(item) {
  const errs = validateItem(item);
  if (errs.length) {
    const err = new Error(`Invalid wine item: ${errs.join("; ")}`);
    err.code = "VALIDATION";
    err.details = errs;
    throw err;
  }
  return item;
}
