/* In-memory inventory store — the stand-in for a database.
   ==================================================================
   Deliberately a module-level singleton: the mock API routes import it and
   mutations survive across requests within one server process. It is NOT
   persistent and NOT multi-process safe — restarting the dev server resets it.
   Swapping in a real database means reimplementing this file's exported
   functions; nothing above it needs to change.

   Every write goes through assertItem(), so an invalid record can never enter
   the store. */

import { primeHandleOverrides, readShopState, writeShopState } from "@/lib/shop/persist";
import { SEED_WINES } from "./seed";
import {
  assertItem,
  deriveStatus,
  remaining,
  remainingShare,
  inCategory,
  hasShopPriceDrift,
  shopPriceDrift,
  AGING,
  PAIRING,
  STYLE,
  STATUS,
  CATEGORY,
  EMPTY_SHOP,
  SHOP_SYNC,
} from "./schema";

/* structuredClone keeps the seed pristine — callers mutating a returned item
   must not silently corrupt the source of truth.

   The state lives on globalThis, not in a module binding: `next dev` compiles
   each route lazily into its own module graph, so a plain `let items` would
   exist once per route bundle — a PATCH through /inventory/[id] would mutate
   a different copy than the list route reads. One process, one store. */
const g = globalThis;
g.__mmInventoryStore ??= { items: hydrate() };
const state = g.__mmInventoryStore;

/* The seed, with the partner-shop block put back on top of it.

   One exception to "restarting resets everything", and a deliberate one:
   the shop handle is the address at which the customer actually buys. A
   correction the editor made after Terra Vera renamed a product must not
   evaporate at the next deploy — it would fall back to the seed, i.e. to
   exactly the handle that was just corrected, and the wine page would go on
   answering 404 with nobody the wiser. The synced price and availability
   ride along because they belong to that handle.

   Everything else in this store stays in memory, as before. */
function hydrate() {
  const items = structuredClone(SEED_WINES);
  const stored = readShopState();

  for (const item of items) {
    const entry = stored[item.slug];
    if (entry) item.shop = { ...EMPTY_SHOP, ...item.shop, ...entry };
  }

  /* Wines the seed does not know (created in the backoffice) live only in
     the persisted state until they are recreated — their entries are kept
     so a restart-and-recreate does not lose the handle. */
  primeHandleOverrides(stored);
  return items;
}

/* Write the shop blocks back to disk and re-prime the handle resolution
   that shopHref() reads. Called after every write that can touch a handle,
   so the file and the process never disagree. */
function persistShop() {
  const stored = readShopState();
  for (const item of state.items) {
    stored[item.slug] = { ...EMPTY_SHOP, ...item.shop };
  }
  writeShopState(stored);
  primeHandleOverrides(stored);
  return stored;
}

/** Reset to the seed. Used by tests. Leaves the persisted shop state alone —
    it is not part of the seed and a test run must not wipe the client's
    handles. */
export function reset() {
  state.items = hydrate();
  return state.items.length;
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
  let out = state.items.map(decorate);

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
  const hit = state.items.find((i) => i.id === id);
  return hit ? decorate(hit) : null;
};

export const getBySlug = (slug) => {
  const hit = state.items.find((i) => i.slug === slug);
  return hit ? decorate(hit) : null;
};

/* -------------------------------------------------------------- writes ---- */

/** Create an item. Throws VALIDATION on a malformed record, CONFLICT on a
    duplicate id or slug. */
export function create(input) {
  const item = assertItem({
    ...input,
    id: input.id ?? `inv-${input.slug}`,
    /* a record always carries a full shop block, even an empty one, so no
       consumer has to guard against its absence */
    shop: { ...EMPTY_SHOP, ...(input.shop ?? {}) },
  });
  if (state.items.some((i) => i.id === item.id || i.slug === item.slug)) {
    const err = new Error(`Item with id "${item.id}" or slug "${item.slug}" already exists`);
    err.code = "CONFLICT";
    throw err;
  }
  state.items.push(structuredClone(item));
  if (item.shop?.handle) persistShop();
  return getById(item.id);
}

/** Patch an item. Nested objects are merged one level deep so a caller can
    send `{ batch: { committed } }` without restating the batch size. */
export function update(id, patch) {
  const idx = state.items.findIndex((i) => i.id === id);
  if (idx === -1) return null;

  const current = state.items[idx];
  const next = {
    ...current,
    ...patch,
    appellation: { ...current.appellation, ...(patch.appellation ?? {}) },
    aging: { ...current.aging, ...(patch.aging ?? {}) },
    batch: { ...current.batch, ...(patch.batch ?? {}) },
    label: { ...current.label, ...(patch.label ?? {}) },
    shop: { ...EMPTY_SHOP, ...current.shop, ...(patch.shop ?? {}) },
    /* id and slug are identity — a patch must not silently re-key a record */
    id: current.id,
    slug: current.slug,
  };
  /* keep the convenience flag consistent when only `accent` was patched */
  if (patch.label?.accent && patch.label.redAccent === undefined) {
    next.label.redAccent = patch.label.accent === "red";
  }

  /* A new handle invalidates everything that was synced under the old one.
     Carrying the previous price over would be the worst of both worlds: it
     looks synced, it reads plausible, and it describes a product this wine
     no longer points at. Empty string means "no handle", not "the handle
     called ''". */
  const handlePatched = patch.shop && "handle" in patch.shop;
  const nextHandle = handlePatched ? patch.shop.handle || null : undefined;
  if (handlePatched && nextHandle !== (current.shop?.handle ?? null)) {
    next.shop = { ...EMPTY_SHOP, handle: nextHandle };
  }

  assertItem(next);
  state.items[idx] = next;
  if (patch.shop) persistShop();
  return getById(id);
}

export function remove(id) {
  const idx = state.items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  state.items.splice(idx, 1);
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
  const item = state.items.find((i) => i.id === id);
  if (!item) return null;
  const left = remaining(item);
  if (left != null && count > left) {
    const err = new Error(`Only ${left} bottles remain of ${item.name}; cannot commit ${count}`);
    err.code = "INSUFFICIENT_STOCK";
    throw err;
  }
  return update(id, { batch: { committed: item.batch.committed + count } });
}

/* --------------------------------------------------------- partner shop ---- */

/**
 * Record the outcome of one sync against the partner shop.
 * The editor never types these fields; lib/shop/sync.js produces them and
 * this is the only door they come in through.
 *
 * @param {string} id
 * @param {{sync: string, price?: number|null, available?: boolean|null,
 *          title?: string|null, error?: string|null}} result
 */
export function recordShopSync(id, result) {
  const idx = state.items.findIndex((i) => i.id === id);
  if (idx === -1) return null;

  const current = state.items[idx];
  const shop = {
    ...EMPTY_SHOP,
    ...current.shop,
    ...result,
    /* the handle is not the sync's to change — it is what was asked about */
    handle: current.shop?.handle ?? null,
    syncedAt: result.syncedAt ?? new Date().toISOString(),
  };

  /* A failed attempt must not leave last week's price standing as if it were
     fresh: the numbers belong to a successful read, the timestamp belongs to
     the attempt. */
  if (result.sync !== SHOP_SYNC.OK) {
    shop.price = null;
    shop.available = null;
  }

  state.items[idx] = assertItem({ ...current, shop });
  persistShop();
  return getById(id);
}

/** Everything the portfolio header needs to say about the shop link in one
    call: how many are linked, what the last sync found, and which wines want
    a person to look at them. Archived wines are left out — they are not on
    sale, so their shop link is nobody's problem. */
export function shopSummary() {
  const live = state.items.map(decorate).filter((i) => i.status !== STATUS.ARCHIVED);

  const bySync = { never: 0, ok: 0, missing: 0, error: 0 };
  const missing = [];
  const unavailable = [];
  const drift = [];
  let lastSyncedAt = null;

  for (const item of live) {
    const shop = item.shop ?? EMPTY_SHOP;
    if (!shop.handle) continue;

    bySync[shop.sync] = (bySync[shop.sync] ?? 0) + 1;
    if (shop.sync === SHOP_SYNC.MISSING) missing.push({ id: item.id, name: item.name, handle: shop.handle });
    if (shop.available === false) unavailable.push({ id: item.id, name: item.name });
    if (hasShopPriceDrift(item)) {
      drift.push({
        id: item.id,
        name: item.name,
        price: item.price,
        shopPrice: shop.price,
        drift: shopPriceDrift(item),
      });
    }
    if (shop.syncedAt && (!lastSyncedAt || shop.syncedAt > lastSyncedAt)) lastSyncedAt = shop.syncedAt;
  }

  return {
    total: live.length,
    linked: live.filter((i) => i.shop?.handle).length,
    bySync,
    missing,
    unavailable,
    drift,
    lastSyncedAt,
  };
}

/* ------------------------------------------------------------ aggregate ---- */

/** Facet counts and stock totals — what the overview cards need in one call. */
export function stats() {
  const all = state.items.map(decorate);
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
  const live = state.items.map(decorate).filter((i) => i.status !== STATUS.ARCHIVED);
  return Object.fromEntries(
    Object.values(CATEGORY).map((key) => [key, live.filter((i) => inCategory(i, key)).length]),
  );
}

/** How many archived items exist — drives the "show archived" affordance. */
export const archivedCount = () =>
  state.items.filter((i) => i.status === STATUS.ARCHIVED).length;

/** Distinct values, for building filter dropdowns without hard-coding. */
export const facets = () => ({
  regions: [...new Set(state.items.map((i) => i.appellation.region))].sort((a, b) =>
    a.localeCompare(b, "de"),
  ),
  vintages: [...new Set(state.items.map((i) => i.vintage))].sort((a, b) => b - a),
  styles: Object.values(STYLE),
  aging: Object.values(AGING),
  pairings: Object.values(PAIRING),
});
