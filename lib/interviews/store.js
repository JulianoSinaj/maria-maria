/* Interview store — the editorial records behind /magazin/interviews/<slug>.
   ==================================================================
   Persistence is one JSON file, data/admin/interviews.json — next to the
   other backoffice documents (lib/admin/jsonStore.js) and the client's
   password — read on every access (cheap: two or three articles, and the
   mtime check makes a second process see another's write) and written
   atomically. `data/` is runtime state, git-ignored, and on the server it
   MUST be a persistent volume — a deploy that wipes it loses every
   interview written here.

   Two sources of truth, one reading order:

     1. the four content/<locale>/interviews.js files — the pieces a
        developer shipped ("code" items). They stay exactly where they are.
     2. this store — pieces the editorial desk created, PLUS overrides of
        code items the desk has since edited (same slug wins).

   mergeInterviews() is where the two meet, and it is the only merge: the
   article route, the magazine cards, the region teasers and the sitemap all
   go through it via components/magazin/interviewRegistry.js.

   Node runtime only (fs). Client components use lib/interviews/useInterviews. */

import { promises as fs } from "node:fs";
import path from "node:path";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { WINES } from "@/components/data";
import {
  INTERVIEW_LOCALES,
  INTERVIEW_STATUS,
  REQUIRED_LOCALE,
  normalizeRecord,
  validateRecord,
  toDictionaryItem,
  fromDictionaryItems,
  localeCompleteness,
} from "./schema";

const FILE = path.join(process.cwd(), "data", "admin", "interviews.json");
export const WINE_SLUGS = WINES.map((w) => w.slug);

/* Cache keyed on the file's mtime — `next dev` builds each route into its
   own module graph, so a plain module variable would exist once per route;
   globalThis makes it one process, one cache. */
globalThis.__mmInterviewStore ??= { mtimeMs: null, items: [] };
const cache = globalThis.__mmInterviewStore;

const fail = (code, message, details) => {
  const err = new Error(message);
  err.code = code;
  if (details) err.details = details;
  return err;
};

/* ------------------------------------------------------------ file i/o ---- */

async function load() {
  let stat;
  try {
    stat = await fs.stat(FILE);
  } catch {
    cache.mtimeMs = null;
    cache.items = [];
    return cache.items;
  }
  if (cache.mtimeMs === stat.mtimeMs) return cache.items;
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8"));
    cache.items = (Array.isArray(parsed?.items) ? parsed.items : []).map(normalizeRecord);
  } catch {
    /* unreadable or not JSON — treat as empty rather than crash every
       storefront page; the next write replaces it */
    cache.items = [];
  }
  cache.mtimeMs = stat.mtimeMs;
  return cache.items;
}

async function persist(items) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify({ version: 1, items }, null, 2)}\n`, "utf8");
  await fs.rename(tmp, FILE);
  const stat = await fs.stat(FILE);
  cache.items = items;
  cache.mtimeMs = stat.mtimeMs;
}

/** Reset the store — used by tests. */
export async function resetInterviews() {
  await fs.rm(FILE, { force: true });
  cache.mtimeMs = null;
  cache.items = [];
}

/* ------------------------------------------------------- store records ---- */

const clone = (v) => structuredClone(v);

export async function listRecords() {
  return (await load()).map(clone);
}

export async function getRecord(slug) {
  const hit = (await load()).find((r) => r.slug === slug);
  return hit ? clone(hit) : null;
}

/* -------------------------------------------------------- code records ---- */

/** The developer-shipped pieces of one language, as the dictionary has them. */
export async function codeItems(locale = REQUIRED_LOCALE) {
  const dict = await getDictionary(locale);
  return dict?.interviews?.items ?? [];
}

/** A code item as an editable record — its four language entries folded
    into one. Not persisted: the first save creates the override. */
export async function importFromCode(slug) {
  const perLocale = {};
  for (const l of INTERVIEW_LOCALES) {
    const items = await codeItems(l);
    perLocale[l] = items.find((i) => i.slug === slug) ?? null;
  }
  if (!perLocale[REQUIRED_LOCALE]) return null;
  return fromDictionaryItems(perLocale);
}

/* ---------------------------------------------------------------- reads ---- */

/**
 * A record for the editor, wherever it lives.
 * @returns {{ record, source: "store"|"override"|"code" } | null}
 */
export async function findRecord(slug) {
  const stored = await getRecord(slug);
  const inCode = (await codeItems()).some((i) => i.slug === slug);
  if (stored) return { record: stored, source: inCode ? "override" : "store" };
  const imported = await importFromCode(slug);
  return imported ? { record: imported, source: "code" } : null;
}

/** Rows for the admin list: every piece the site knows, code and store. */
export async function listInterviews() {
  const code = await codeItems();
  const stored = await listRecords();
  const byStoredSlug = new Map(stored.map((r) => [r.slug, r]));

  const row = (record, source) => {
    const de = record.locales?.[REQUIRED_LOCALE] ?? {};
    return {
      slug: record.slug,
      status: record.status,
      source,
      publishedAt: record.publishedAt,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
      name: de.name ?? "",
      headline: de.headline ?? "",
      portrait: record.portrait?.src ?? null,
      wine: record.wine?.slug ?? "",
      region: record.region ?? "",
      completeness: localeCompleteness(record),
    };
  };

  const rows = [];
  for (const item of code) {
    const override = byStoredSlug.get(item.slug);
    if (override) {
      rows.push(row(override, "override"));
      continue;
    }
    /* a code item is listed from its own four files; the German entry
       carries the shared facts, the others only count towards completeness */
    const record = await importFromCode(item.slug);
    if (record) rows.push(row(record, "code"));
  }
  const codeSlugs = new Set(code.map((i) => i.slug));
  for (const r of stored) if (!codeSlugs.has(r.slug)) rows.push(row(r, "store"));
  return rows;
}

/**
 * THE merge the storefront reads: code items in file order, each replaced
 * by its override if one exists, then the desk's own pieces in creation
 * order. Drafts are included only on request (preview).
 */
export function mergeInterviews(codeList, records, locale, { includeDrafts = false } = {}) {
  const bySlug = new Map(records.map((r) => [r.slug, r]));
  const out = [];
  const seen = new Set();
  for (const item of codeList ?? []) {
    const override = bySlug.get(item.slug);
    out.push(override ? toDictionaryItem(override, locale) : item);
    seen.add(item.slug);
  }
  for (const r of records) {
    if (seen.has(r.slug)) continue;
    const item = toDictionaryItem(r, locale);
    if (item) out.push(item);
  }
  return includeDrafts ? out.filter(Boolean) : out.filter((i) => i && !i.draft);
}

/** Every slug the site should build — code slugs plus published records.
    Drafts only when asked (the article route tolerates them for preview). */
export async function listInterviewSlugs({ includeDrafts = false } = {}) {
  const code = await codeItems();
  const stored = await listRecords();
  const merged = mergeInterviews(code, stored, REQUIRED_LOCALE, { includeDrafts });
  return merged.map((i) => i.slug);
}

/* --------------------------------------------------------------- writes ---- */

const now = () => new Date().toISOString();

/** Today in the house's time zone as YYYY-MM-DD — the default publish date. */
export const todayIso = () =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(new Date());

/** Create a record. Throws VALIDATION or CONFLICT (slug in store or code). */
export async function createRecord(input) {
  const record = normalizeRecord({ ...input, status: INTERVIEW_STATUS.DRAFT, publishedAt: null });
  const errs = validateRecord(record, { wineSlugs: WINE_SLUGS });
  if (errs.length) throw fail("VALIDATION", errs.join("; "), errs);

  const items = await load();
  if (items.some((r) => r.slug === record.slug)) {
    throw fail("CONFLICT", `An interview with slug "${record.slug}" already exists`);
  }
  if ((await codeItems()).some((i) => i.slug === record.slug)) {
    throw fail("CONFLICT", `"${record.slug}" is a code-defined interview — open it to edit`);
  }
  record.createdAt = now();
  record.updatedAt = record.createdAt;
  await persist([...items, record]);
  return clone(record);
}

/** Replace a record's content. Creates the override for a code item on
    first save. Identity (slug) and publish state are not editable here —
    status changes go through setStatus(). */
export async function updateRecord(slug, input) {
  const items = await load();
  const idx = items.findIndex((r) => r.slug === slug);
  let current = idx >= 0 ? items[idx] : await importFromCode(slug);
  if (!current) return null;

  const record = normalizeRecord({
    ...input,
    slug: current.slug,
    status: current.status,
    publishedAt: current.publishedAt,
    createdAt: current.createdAt ?? now(),
  });
  /* a live piece must stay complete — an edit cannot pull the floor out */
  const errs = validateRecord(record, {
    wineSlugs: WINE_SLUGS,
    forPublish: record.status === INTERVIEW_STATUS.PUBLISHED,
  });
  if (errs.length) throw fail("VALIDATION", errs.join("; "), errs);

  record.updatedAt = now();
  const next = [...items];
  if (idx >= 0) next[idx] = record;
  else next.push(record);
  await persist(next);
  return clone(record);
}

/** Publish or withdraw. Publishing validates completeness and stamps the
    publish date if none was chosen. */
export async function setStatus(slug, status, { publishedAt } = {}) {
  const items = await load();
  const idx = items.findIndex((r) => r.slug === slug);
  const current = idx >= 0 ? items[idx] : await importFromCode(slug);
  if (!current) return null;

  const record = clone(current);
  record.status = status;
  if (status === INTERVIEW_STATUS.PUBLISHED) {
    record.publishedAt = publishedAt ?? record.publishedAt ?? todayIso();
    const errs = validateRecord(record, { wineSlugs: WINE_SLUGS, forPublish: true });
    if (errs.length) throw fail("VALIDATION", errs.join("; "), errs);
  }
  record.createdAt ??= now();
  record.updatedAt = now();

  const next = [...items];
  if (idx >= 0) next[idx] = record;
  else next.push(record);
  await persist(next);
  return clone(record);
}

/** Remove a store record. For an override this reveals the code item again;
    a pure code item cannot be deleted from here. */
export async function removeRecord(slug) {
  const items = await load();
  const idx = items.findIndex((r) => r.slug === slug);
  if (idx === -1) return false;
  const next = [...items];
  next.splice(idx, 1);
  await persist(next);
  return true;
}
