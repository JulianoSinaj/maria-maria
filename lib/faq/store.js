/* FAQ store — the questions of every storefront page, in four languages.
   ==================================================================
   Seeded from the shipped files (./seed.js) the first time it runs, then
   owned here: the editor writes records, and lib/i18n/dictionaries merges
   them back into `dict.faq` so FaqSection and faqNode() read exactly what
   they read before.

   Persistence: a JSON file under data/faq/ (gitignored), read once into a
   globalThis singleton and rewritten atomically after every mutation —
   same shape and the same honesty as the Anfragen inbox: if the disk is
   read-only (a serverless container), the write fails once, is logged
   once, and the store carries on in memory. persistenceMode() says which
   of the two is true, and the editor shows it.

   The singleton lives on globalThis and not in a module binding because
   `next dev` compiles each route into its own module graph — a PATCH
   through /api/admin/faq/[id] would otherwise mutate a different copy
   than the dictionary reads. One process, one FAQ.

   Server only: it touches the filesystem and pulls the content modules. */

import fs from "fs";
import path from "path";
import { buildSeed, wineNames, SEED_STAMP } from "./seed";
import {
  FAQ_LOCALES,
  FAQ_DEFAULT_LOCALE,
  ID_RE,
  KEY_RE,
  LIMITS,
  PAGE_GROUPS,
  PAGE_GROUP_KEYS,
  STATUS,
  completeness,
  isComplete,
  isNestedGroup,
  normalizeText,
  validateRecord,
  wineGroup,
  wineSlugOf,
} from "./schema";

if (typeof window !== "undefined") {
  throw new Error(
    "lib/faq/store ist serverseitig — der Editor spricht mit /api/admin/faq, " +
      "Schema und Helfer liegen in lib/faq/schema.",
  );
}

const FILE_VERSION = 1;

const storeFile = () =>
  process.env.MM_FAQ_FILE || path.join(process.cwd(), "data", "faq", "faq.json");

const g = globalThis;
g.__mmFaqStore ??= { items: null, subgroups: null, persistence: null, warned: false };
const state = g.__mmFaqStore;

/* ---------------------------------------------------------- persistence ---- */

const seeded = () => {
  const { items, subgroups } = buildSeed();
  return { items, subgroups };
};

function load() {
  if (state.items) return state;

  try {
    const parsed = JSON.parse(fs.readFileSync(storeFile(), "utf8"));
    if (!Array.isArray(parsed?.items)) throw Object.assign(new Error("malformed"), { code: "EBADF" });
    state.items = parsed.items;
    state.subgroups = Array.isArray(parsed.subgroups) ? parsed.subgroups : seeded().subgroups;
    state.persistence = "file";
    return state;
  } catch (err) {
    /* No file yet is the normal first start: the shipped content IS the
       seed, so the store opens with exactly what the site shows today. */
    const fresh = seeded();
    state.items = fresh.items;
    state.subgroups = fresh.subgroups;
    state.persistence = err?.code === "ENOENT" ? "file" : "memory";
    if (err?.code !== "ENOENT") {
      console.warn(
        `[faq] Datei nicht lesbar (${err?.code ?? err}); FAQ aus den Inhaltsdateien, Änderungen nur im Arbeitsspeicher.`,
      );
    }
    return state;
  }
}

function persist() {
  const file = storeFile();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    /* write-then-rename: a crash mid-write leaves the previous file intact */
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(
      tmp,
      JSON.stringify(
        { version: FILE_VERSION, seededAt: SEED_STAMP, items: state.items, subgroups: state.subgroups },
        null,
        2,
      ),
    );
    fs.renameSync(tmp, file);
    state.persistence = "file";
  } catch (err) {
    state.persistence = "memory";
    if (!state.warned) {
      state.warned = true;
      console.warn(
        `[faq] Datei nicht schreibbar (${err?.code ?? err}); FAQ-Änderungen nur im Arbeitsspeicher.`,
      );
    }
  }
}

/** "file" when edits survive a restart, "memory" when they do not. */
export function persistenceMode() {
  load();
  return state.persistence;
}

/** Back to the shipped content. Used by tests. */
export function reset() {
  const fresh = seeded();
  state.items = fresh.items;
  state.subgroups = fresh.subgroups;
  persist();
  return state.items.length;
}

/* --------------------------------------------------------------- groups ---- */

/* The wine groups are discovered from the records themselves rather than
   from the registry: a wine whose page is gone should not vanish from the
   editor while its questions are still stored. The registry only supplies
   the display names. */
const NAMES = () => wineNames();

export function groupKeys() {
  const wines = new Set(
    load()
      .items.map((i) => wineSlugOf(i.group))
      .filter(Boolean),
  );
  for (const slug of Object.keys(NAMES())) wines.add(slug);
  return [...PAGE_GROUP_KEYS, ...[...wines].sort().map(wineGroup)];
}

const clone = (value) => structuredClone(value);

const bySortKey = (a, b) => a.order - b.order || a.id.localeCompare(b.id);

/** Subgroups of a nested group, ordered. Flat groups have none. */
export function subgroupsOf(group) {
  return load()
    .subgroups.filter((s) => s.group === group)
    .sort((a, b) => a.order - b.order)
    .map(clone);
}

export const subgroupKeysOf = (group) => subgroupsOf(group).map((s) => s.key);

/** Everything the editor needs to draw its rail in one call. */
export function groupSummaries() {
  const names = NAMES();
  const items = load().items;
  return groupKeys().map((key) => {
    const slug = wineSlugOf(key);
    const mine = items.filter((i) => i.group === key);
    const missing = Object.fromEntries(
      FAQ_LOCALES.map((l) => [
        l,
        mine.filter((i) => !isComplete(i.text?.[l])).length,
      ]),
    );
    return {
      key,
      kind: slug ? "wine" : "page",
      slug,
      name: slug ? (names[slug] ?? slug) : null,
      path: slug ? `/unsere-weine/${slug}` : (PAGE_GROUPS.find((p) => p.key === key)?.path ?? null),
      nested: isNestedGroup(key),
      count: mine.length,
      drafts: mine.filter((i) => i.status === STATUS.DRAFT).length,
      missing,
      subgroups: subgroupsOf(key),
    };
  });
}

/* ---------------------------------------------------------------- reads ---- */

const decorate = (item) => ({ ...clone(item), completeness: completeness(item) });

/**
 * List records.
 * @param {Object} [q]
 * @param {string}  [q.group]   one page group or `wine:<slug>`
 * @param {string}  [q.status]  draft | published
 * @param {string}  [q.search]  matches id and every language's question/answer
 * @param {string}  [q.incomplete] language code — only records missing it
 */
export function list(q = {}) {
  let out = load().items.slice();

  if (q.group) out = out.filter((i) => i.group === q.group);
  if (q.status) out = out.filter((i) => i.status === q.status);
  if (q.incomplete && FAQ_LOCALES.includes(q.incomplete)) {
    out = out.filter((i) => !isComplete(i.text?.[q.incomplete]));
  }
  if (q.search) {
    const needle = q.search.trim().toLowerCase();
    if (needle) {
      out = out.filter((i) =>
        [i.id, ...FAQ_LOCALES.flatMap((l) => [i.text?.[l]?.q, i.text?.[l]?.a])]
          .filter(Boolean)
          .some((s) => s.toLowerCase().includes(needle)),
      );
    }
  }

  /* Sorted by cluster, then by the order the page shows them in — the
     editor's list IS the page's order, which is what makes drag-to-sort
     mean something. */
  const rank = (item) => {
    const keys = subgroupKeysOf(item.group);
    const at = keys.indexOf(item.subgroup);
    return at === -1 ? keys.length : at;
  };
  return out.sort((a, b) => rank(a) - rank(b) || bySortKey(a, b)).map(decorate);
}

export const getById = (id) => {
  const hit = load().items.find((i) => i.id === id);
  return hit ? decorate(hit) : null;
};

export const exists = (id) => load().items.some((i) => i.id === id);

/** Counts for the overview card and the group rail badges. */
export function stats() {
  const items = load().items;
  return {
    count: items.length,
    published: items.filter((i) => i.status === STATUS.PUBLISHED).length,
    drafts: items.filter((i) => i.status === STATUS.DRAFT).length,
    groupCount: groupKeys().length,
    missing: Object.fromEntries(
      FAQ_LOCALES.map((l) => [l, items.filter((i) => !isComplete(i.text?.[l])).length]),
    ),
  };
}

/* --------------------------------------------------------------- writes ---- */

const now = () => new Date().toISOString();

const validationError = (errs) => {
  const err = new Error(errs.join("; "));
  err.code = "VALIDATION";
  err.details = errs;
  return err;
};

const conflict = (message) => {
  const err = new Error(message);
  err.code = "CONFLICT";
  return err;
};

/* Every write goes through here, so a malformed record can never enter the
   store — the same contract the inventory store keeps. */
function assertRecord(rec) {
  const errs = validateRecord(rec, {
    groups: groupKeys(),
    subgroupKeys: subgroupKeysOf,
  });
  if (errs.length) throw validationError(errs);
  return rec;
}

const normalizeTexts = (text = {}) =>
  Object.fromEntries(FAQ_LOCALES.map((l) => [l, normalizeText(text[l] ?? {})]));

/** Next free position at the end of a cluster. */
function nextOrder(group, subgroup) {
  const siblings = load().items.filter((i) => i.group === group && i.subgroup === (subgroup ?? null));
  return siblings.reduce((max, i) => Math.max(max, i.order + 1), 0);
}

/** Create a question. Throws VALIDATION or CONFLICT (duplicate id). */
export function create(input = {}) {
  load();
  const group = input.group;
  /* Not coerced: a cluster named for a flat page is a mistake in the
     caller, and validateRecord() says so. Only "nothing given" defaults. */
  const subgroup = input.subgroup ?? null;
  const status = input.status === STATUS.PUBLISHED ? STATUS.PUBLISHED : STATUS.DRAFT;

  const record = {
    id: typeof input.id === "string" ? input.id.trim() : "",
    group,
    subgroup,
    order: Number.isInteger(input.order) ? input.order : nextOrder(group, subgroup),
    status,
    publishedAt: status === STATUS.PUBLISHED ? now() : null,
    updatedAt: now(),
    text: normalizeTexts(input.text),
  };

  assertRecord(record);
  if (exists(record.id)) {
    throw conflict(`Eine Frage mit der ID „${record.id}" gibt es bereits`);
  }

  state.items.push(record);
  persist();
  return getById(record.id);
}

/**
 * Patch a question. `text` is merged per language, so a caller may send one
 * language without restating the other three.
 *
 * The id is identity and is NOT patchable here — see rename(), which exists
 * so the block on renaming a published question has one obvious place.
 */
export function update(id, patch = {}) {
  load();
  const idx = state.items.findIndex((i) => i.id === id);
  if (idx === -1) return null;

  const current = state.items[idx];
  const group = patch.group ?? current.group;
  const nested = isNestedGroup(group);
  const subgroup = nested
    ? (patch.subgroup !== undefined ? patch.subgroup : current.subgroup)
    : null;

  const text = { ...current.text };
  for (const l of FAQ_LOCALES) {
    if (patch.text?.[l] === undefined) continue;
    text[l] = normalizeText({ ...current.text[l], ...patch.text[l] });
  }

  const status = patch.status ?? current.status;
  const next = {
    ...current,
    group,
    subgroup,
    /* moving a question into another cluster puts it at that cluster's end
       rather than at whatever index it happened to hold in the old one */
    order:
      patch.order !== undefined
        ? patch.order
        : group !== current.group || subgroup !== current.subgroup
          ? nextOrder(group, subgroup)
          : current.order,
    status,
    publishedAt:
      status === STATUS.PUBLISHED ? (current.publishedAt ?? now()) : current.publishedAt,
    updatedAt: now(),
    text,
    id: current.id,
  };

  assertRecord(next);
  state.items[idx] = next;
  persist();
  return getById(id);
}

/**
 * Rename a question — the one write that breaks links, so it is its own
 * function and refuses by default.
 *
 * The id is the anchor in /kontakt#kontakt-versand, the target of every
 * deep link the site and the wine pages carry, and the faq_id in GA4.
 * Renaming a PUBLISHED question therefore silently 404s existing links and
 * splits its analytics history in two. Draft questions have never been
 * anywhere, so they rename freely; a published one needs `force: true`,
 * which the editor only sends after the operator has confirmed the box.
 */
export function rename(id, nextId, { force = false } = {}) {
  load();
  const idx = state.items.findIndex((i) => i.id === id);
  if (idx === -1) return null;

  const target = typeof nextId === "string" ? nextId.trim() : "";
  if (!ID_RE.test(target) || target.length > LIMITS.id) {
    throw validationError([
      `id muss aus Kleinbuchstaben, Ziffern und Bindestrichen bestehen, höchstens ${LIMITS.id} Zeichen`,
    ]);
  }
  if (target === id) return getById(id);
  if (exists(target)) throw conflict(`Eine Frage mit der ID „${target}" gibt es bereits`);

  const current = state.items[idx];
  if (current.status === STATUS.PUBLISHED && !force) {
    const err = new Error(
      `„${id}" ist veröffentlicht: Die ID trägt Deep-Links und die faq_id in GA4. Umbenennen nur mit ausdrücklicher Bestätigung.`,
    );
    err.code = "ID_LOCKED";
    throw err;
  }

  state.items[idx] = { ...current, id: target, updatedAt: now() };
  persist();
  return getById(target);
}

export function remove(id) {
  load();
  const idx = state.items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  state.items.splice(idx, 1);
  persist();
  return true;
}

/**
 * Reorder one cluster. `ids` is the complete new order of that cluster —
 * anything missing from it keeps its relative position behind the listed
 * ones, so a stale drag can shuffle but never delete.
 */
export function reorder(group, subgroup, ids) {
  load();
  if (!Array.isArray(ids)) throw validationError(["ids must be an array of question ids"]);
  const key = subgroup ?? null;
  const mine = state.items.filter((i) => i.group === group && i.subgroup === key);
  if (!mine.length) return [];

  const wanted = ids.filter((id) => mine.some((i) => i.id === id));
  const rest = mine.filter((i) => !wanted.includes(i.id)).sort(bySortKey).map((i) => i.id);
  const order = [...wanted, ...rest];

  order.forEach((id, at) => {
    const item = state.items.find((i) => i.id === id);
    if (item) {
      item.order = at;
      item.updatedAt = now();
    }
  });
  persist();
  return list({ group }).filter((i) => i.subgroup === key);
}

/** Create or relabel a cluster of a nested group. */
export function putSubgroup(group, key, { label = {}, order } = {}) {
  load();
  if (!isNestedGroup(group)) {
    throw validationError([`Die Gruppe „${group}" führt keine Cluster`]);
  }
  if (typeof key !== "string" || !KEY_RE.test(key) || key.length > LIMITS.key) {
    throw validationError([
      `Cluster-Schlüssel muss aus Kleinbuchstaben, Ziffern und Bindestrichen bestehen, höchstens ${LIMITS.key} Zeichen`,
    ]);
  }
  for (const l of FAQ_LOCALES) {
    const value = label[l];
    if (value !== undefined && (typeof value !== "string" || value.length > LIMITS.subgroupLabel)) {
      throw validationError([
        `label.${l} muss Text von höchstens ${LIMITS.subgroupLabel} Zeichen sein`,
      ]);
    }
  }

  const existing = state.subgroups.find((s) => s.group === group && s.key === key);
  if (existing) {
    existing.label = { ...existing.label, ...pickLabels(label) };
    if (Number.isInteger(order)) existing.order = order;
  } else {
    state.subgroups.push({
      group,
      key,
      order: Number.isInteger(order)
        ? order
        : state.subgroups.filter((s) => s.group === group).length,
      label: { ...Object.fromEntries(FAQ_LOCALES.map((l) => [l, ""])), ...pickLabels(label) },
    });
  }
  persist();
  return subgroupsOf(group);
}

const pickLabels = (label = {}) =>
  Object.fromEntries(
    FAQ_LOCALES.filter((l) => typeof label[l] === "string").map((l) => [l, label[l].trim()]),
  );

/** Remove an empty cluster. A cluster with questions in it is refused. */
export function removeSubgroup(group, key) {
  load();
  const used = state.items.some((i) => i.group === group && i.subgroup === key);
  if (used) {
    throw conflict(`Das Cluster „${key}" trägt noch Fragen — erst umhängen, dann entfernen`);
  }
  const before = state.subgroups.length;
  state.subgroups = state.subgroups.filter((s) => !(s.group === group && s.key === key));
  if (state.subgroups.length === before) return false;
  persist();
  return true;
}

/* --------------------------------------------------- the storefront read ---- */

/* What a page actually renders. Two rules, both deliberate:

   1. Only PUBLISHED questions leave the store. A draft is the editor's
      workspace, not a half-finished answer on a live page.
   2. A question whose text in THIS language is incomplete is left out of
      THIS language — not filled in with German. A German sentence in the
      middle of the Italian accordion is worse than a shorter accordion,
      and the empty row a missing text would otherwise render is worse than
      both. The editor shows the same gaps as a per-language marker, so
      nothing disappears quietly.

   Today's four content files are complete in all four languages, so the
   seeded store reproduces them one for one. */
const publicItem = (rec, locale) => {
  const t = rec.text?.[locale];
  return {
    id: rec.id,
    q: t.q,
    a: t.a,
    ...(t.link ? { link: { label: t.link.label, href: t.link.href } } : {}),
  };
};

const visible = (rec, locale) =>
  rec.status === STATUS.PUBLISHED && isComplete(rec.text?.[locale]);

/**
 * The `faq` branch of a dictionary, in the shape content/<locale>/faq.js
 * has today: a flat array per simple page, `{ key, label, items }` clusters
 * for the nested ones. Wine questions are NOT in here — they belong to the
 * wine pages and come out of faqWines().
 */
export function faqDictionary(locale = FAQ_DEFAULT_LOCALE) {
  const items = load().items;
  const out = {};

  for (const group of PAGE_GROUP_KEYS) {
    const mine = items.filter((i) => i.group === group && visible(i, locale));

    if (!isNestedGroup(group)) {
      out[group] = mine.sort(bySortKey).map((i) => publicItem(i, locale));
      continue;
    }

    out[group] = subgroupsOf(group)
      .map((sub) => ({
        key: sub.key,
        label: sub.label?.[locale] ?? sub.label?.[FAQ_DEFAULT_LOCALE] ?? "",
        items: mine
          .filter((i) => i.subgroup === sub.key)
          .sort(bySortKey)
          .map((i) => publicItem(i, locale)),
      }))
      /* an empty cluster would draw an index entry that opens nothing */
      .filter((sub) => sub.items.length > 0);
  }

  return out;
}

/** The wine pages' questions, keyed by slug — same item shape. */
export function faqWines(locale = FAQ_DEFAULT_LOCALE) {
  const out = {};
  for (const rec of load().items) {
    const slug = wineSlugOf(rec.group);
    if (!slug || !visible(rec, locale)) continue;
    (out[slug] ??= []).push(rec);
  }
  for (const slug of Object.keys(out)) {
    out[slug] = out[slug].sort(bySortKey).map((i) => publicItem(i, locale));
  }
  return out;
}
