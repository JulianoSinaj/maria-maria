/* In-memory inventory store — the stand-in for a database.
   ==================================================================
   Deliberately a module-level singleton: the mock API routes import it and
   mutations survive across requests within one server process. It is NOT
   persistent and NOT multi-process safe — restarting the dev server resets it.
   Swapping in a real database means reimplementing this file's exported
   functions; nothing above it needs to change.

   Every write goes through assertItem(), so an invalid record can never enter
   the store. */

import { SEED_WINES } from "./seed";
import {
  assertItem,
  deriveStatus,
  remaining,
  remainingShare,
  inCategory,
  AGING,
  PAIRING,
  STYLE,
  STATUS,
  CATEGORY,
} from "./schema";

/* structuredClone keeps the seed pristine — callers mutating a returned item
   must not silently corrupt the source of truth. */
let items = structuredClone(SEED_WINES);

/** Reset to the seed. Used by tests. */
export function reset() {
  items = structuredClone(SEED_WINES);
  return items.length;
}

/* Each read returns a copy with the derived fields resolved, so consumers
   never have to recompute stock maths — and can never disagree about it. */
const decorate = (item) => ({
  ...structuredClone(item),
  status: deriveStatus(item),
  remaining: remaining(item),
  remainingShare: remainingShare(item),
});

/* ------------------------------------------------------------- queries ---- */

const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name, "de"),
  vintage: (a, b) => b.vintage - a.vintage,
  price: (a, b) => a.price - b.price,
  remaining: (a, b) => (b.remaining ?? Infinity) - (a.remaining ?? Infinity),
  region: (a, b) => a.appellation.region.localeCompare(b.appellation.region, "de"),
};

/**
 * List items with optional filtering and sorting.
 * @param {Object} [q]
 * @param {string}   [q.search]   matches name, full name or appellation
 * @param {STYLE}    [q.style]
 * @param {AGING}    [q.aging]
 * @param {string}   [q.region]
 * @param {PAIRING}  [q.pairing]
 * @param {boolean}  [q.redAccent] only red-accent labels when true
 * @param {boolean}  [q.limitedOnly] only wines with a published batch
 * @param {CATEGORY} [q.category] merchandising tab (Amphora cuts across style)
 * @param {boolean}  [q.includeArchived] archived items are hidden by default
 * @param {keyof SORTERS} [q.sort]
 */
export function list(q = {}) {
  let out = items.map(decorate);

  /* Archived wines stay out of every listing unless explicitly asked for —
     archiving is meant to remove a wine from the working set, not to be a
     label the editor has to keep filtering past. */
  if (q.includeArchived !== true) {
    out = out.filter((i) => i.status !== STATUS.ARCHIVED);
  }
  if (q.category && q.category !== CATEGORY.ALL) {
    out = out.filter((i) => inCategory(i, q.category));
  }

  if (q.search) {
    const needle = q.search.trim().toLowerCase();
    out = out.filter((i) =>
      [i.name, i.fullName, i.appellation.name, i.appellation.region, i.appellation.zone]
        .filter(Boolean)
        .some((s) => s.toLowerCase().includes(needle)),
    );
  }
  if (q.style) out = out.filter((i) => i.style === q.style);
  if (q.aging) out = out.filter((i) => i.aging.vessel === q.aging);
  if (q.region) out = out.filter((i) => i.appellation.region === q.region);
  if (q.pairing) out = out.filter((i) => i.pairings.includes(q.pairing));
  if (q.redAccent === true) out = out.filter((i) => i.label.redAccent);
  if (q.limitedOnly === true) out = out.filter((i) => i.batch.size != null);

  return out.sort(SORTERS[q.sort] ?? SORTERS.name);
}

export const getById = (id) => {
  const hit = items.find((i) => i.id === id);
  return hit ? decorate(hit) : null;
};

export const getBySlug = (slug) => {
  const hit = items.find((i) => i.slug === slug);
  return hit ? decorate(hit) : null;
};

/* -------------------------------------------------------------- writes ---- */

/** Create an item. Throws VALIDATION on a malformed record, CONFLICT on a
    duplicate id or slug. */
export function create(input) {
  const item = assertItem({
    ...input,
    id: input.id ?? `inv-${input.slug}`,
  });
  if (items.some((i) => i.id === item.id || i.slug === item.slug)) {
    const err = new Error(`Item with id "${item.id}" or slug "${item.slug}" already exists`);
    err.code = "CONFLICT";
    throw err;
  }
  items.push(structuredClone(item));
  return getById(item.id);
}

/** Patch an item. Nested objects are merged one level deep so a caller can
    send `{ batch: { committed } }` without restating the batch size. */
export function update(id, patch) {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;

  const current = items[idx];
  const next = {
    ...current,
    ...patch,
    appellation: { ...current.appellation, ...(patch.appellation ?? {}) },
    aging: { ...current.aging, ...(patch.aging ?? {}) },
    batch: { ...current.batch, ...(patch.batch ?? {}) },
    label: { ...current.label, ...(patch.label ?? {}) },
    /* id and slug are identity — a patch must not silently re-key a record */
    id: current.id,
    slug: current.slug,
  };
  /* keep the convenience flag consistent when only `accent` was patched */
  if (patch.label?.accent && patch.label.redAccent === undefined) {
    next.label.redAccent = patch.label.accent === "red";
  }

  assertItem(next);
  items[idx] = next;
  return getById(id);
}

export function remove(id) {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  return true;
}

/* Archive is the soft, reversible alternative to remove(): the record stays,
   drops out of the working set, and keeps its allocation history. This is what
   the table's "archive" action calls — a wine that sold out still has orders
   pointing at it, so hard-deleting it would orphan them. */
export const archive = (id) => update(id, { status: STATUS.ARCHIVED });

/** Restore an archived wine. Status returns to derived stock state. */
export const restore = (id) => update(id, { status: STATUS.ACTIVE });

/** Commit bottles against a batch — the operation an order placement performs.
    Refuses to oversell rather than letting `committed` exceed the batch. */
export function commitBottles(id, count) {
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  const left = remaining(item);
  if (left != null && count > left) {
    const err = new Error(`Only ${left} bottles remain of ${item.name}; cannot commit ${count}`);
    err.code = "INSUFFICIENT_STOCK";
    throw err;
  }
  return update(id, { batch: { committed: item.batch.committed + count } });
}

/* ------------------------------------------------------------ aggregate ---- */

/** Facet counts and stock totals — what the overview cards need in one call. */
export function stats() {
  const all = items.map(decorate);
  const tally = (key, fn) =>
    all.reduce((acc, i) => {
      const k = fn(i);
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {});

  const limited = all.filter((i) => i.batch.size != null);

  return {
    total: all.length,
    byStyle: tally("style", (i) => i.style),
    byAging: tally("aging", (i) => i.aging.vessel),
    byRegion: tally("region", (i) => i.appellation.region),
    byTier: tally("tier", (i) => i.appellation.tier),
    labels: {
      redAccent: all.filter((i) => i.label.redAccent).length,
      whiteWordmark: all.filter((i) => i.label.wordmark === "banded-white-on-black").length,
    },
    allocation: {
      editions: limited.length,
      batch: limited.reduce((s, i) => s + i.batch.size, 0),
      committed: limited.reduce((s, i) => s + i.batch.committed, 0),
      remaining: limited.reduce((s, i) => s + i.remaining, 0),
    },
    scarce: all.filter((i) => i.status === "low").map((i) => i.name),
  };
}

/** Live counts per merchandising tab, so the badges can't go stale.
    Counted over the unarchived working set — the same population the tab
    will actually show when clicked. */
export function categoryCounts() {
  const live = items.map(decorate).filter((i) => i.status !== STATUS.ARCHIVED);
  return Object.fromEntries(
    Object.values(CATEGORY).map((key) => [key, live.filter((i) => inCategory(i, key)).length]),
  );
}

/** How many archived items exist — drives the "show archived" affordance. */
export const archivedCount = () =>
  items.filter((i) => i.status === STATUS.ARCHIVED).length;

/** Distinct values, for building filter dropdowns without hard-coding. */
export const facets = () => ({
  regions: [...new Set(items.map((i) => i.appellation.region))].sort((a, b) =>
    a.localeCompare(b, "de"),
  ),
  vintages: [...new Set(items.map((i) => i.vintage))].sort((a, b) => b - a),
  styles: Object.values(STYLE),
  aging: Object.values(AGING),
  pairings: Object.values(PAIRING),
});
