/* Contact inquiry store — the Anfragen inbox.
   ==================================================================
   Every submission of the /kontakt form lands here BEFORE the notification
   mail goes out, so a message can no longer vanish with a bounced mail.

   Persistence: a JSON file under data/inquiries/ (gitignored, ignored by
   the dev watcher — see next.config.js). The file is read once into a
   globalThis singleton and rewritten atomically after every mutation. On a
   read-only filesystem (serverless containers) the write fails once, is
   logged once, and the store carries on in memory — the admin page shows
   a note in that case and the CSV export is the way to keep the records.

   Same singleton semantics as the other admin stores: `next dev` compiles
   each route into its own module graph, so a plain module binding would
   exist once per route bundle. One process, one inbox. */

import fs from "fs";
import path from "path";
import {
  assertInquiry,
  isInquiryIntent,
  isInquiryStatus,
  INQUIRY_INTENTS,
  INQUIRY_LANGUAGES,
  INQUIRY_MAX,
  INQUIRY_STATUS,
  INQUIRY_STATUSES,
} from "./schema";

const FILE_VERSION = 1;

const storeFile = () =>
  process.env.MM_INQUIRIES_FILE || path.join(process.cwd(), "data", "inquiries", "inquiries.json");

const g = globalThis;
g.__mmInquiryStore ??= { items: null, persistence: null, warned: false };
const state = g.__mmInquiryStore;

/* ---------------------------------------------------------- persistence ---- */

function load() {
  if (state.items) return state.items;
  try {
    const parsed = JSON.parse(fs.readFileSync(storeFile(), "utf8"));
    state.items = Array.isArray(parsed?.items) ? parsed.items : [];
    state.persistence = "file";
  } catch (err) {
    state.items = [];
    /* no file yet is the normal first start — it appears with the first
       inquiry. Anything else means the disk is not ours to rely on. */
    state.persistence = err?.code === "ENOENT" ? "file" : "memory";
    if (err?.code !== "ENOENT") {
      console.warn(`[anfragen] Inbox-Datei nicht lesbar (${err?.code ?? err}); Anfragen nur im Arbeitsspeicher.`);
    }
  }
  return state.items;
}

function persist() {
  const file = storeFile();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    /* write-then-rename: a crash mid-write leaves the previous file intact */
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({ version: FILE_VERSION, items: state.items }, null, 2));
    fs.renameSync(tmp, file);
    state.persistence = "file";
  } catch (err) {
    state.persistence = "memory";
    if (!state.warned) {
      state.warned = true;
      console.warn(`[anfragen] Inbox-Datei nicht schreibbar (${err?.code ?? err}); Anfragen nur im Arbeitsspeicher.`);
    }
  }
}

/** "file" when records survive a restart, "memory" when they do not. */
export function persistenceMode() {
  load();
  return state.persistence;
}

/** Empty the inbox. Used by tests. */
export function reset() {
  load();
  state.items = [];
  persist();
  return 0;
}

/* ---------------------------------------------------------------- reads ---- */

const clone = (item) => structuredClone(item);

const newestFirst = (a, b) => b.receivedAt.localeCompare(a.receivedAt);
const oldestFirst = (a, b) => a.receivedAt.localeCompare(b.receivedAt);

/**
 * List inquiries, newest first.
 * @param {Object} [q]
 * @param {string}  [q.intent]    one of INQUIRY_INTENTS
 * @param {string}  [q.status]    one of INQUIRY_STATUSES
 * @param {string}  [q.language]  one of INQUIRY_LANGUAGES
 * @param {string}  [q.search]    matches name, e-mail, company, city, message, id
 * @param {"newest"|"oldest"} [q.sort]
 * @param {number}  [q.limit]
 */
export function list(q = {}) {
  let out = load().slice();

  if (q.intent && isInquiryIntent(q.intent)) out = out.filter((i) => i.intent === q.intent);
  if (q.status && isInquiryStatus(q.status)) out = out.filter((i) => i.status === q.status);
  if (q.language && INQUIRY_LANGUAGES.includes(q.language)) {
    out = out.filter((i) => i.language === q.language);
  }
  if (q.search) {
    const needle = q.search.trim().toLowerCase();
    if (needle) {
      out = out.filter((i) =>
        [i.id, i.name, i.email, i.company, i.city, i.message, ...i.details.map((d) => d.value)]
          .filter(Boolean)
          .some((s) => s.toLowerCase().includes(needle)),
      );
    }
  }

  out.sort(q.sort === "oldest" ? oldestFirst : newestFirst);
  if (Number.isInteger(q.limit) && q.limit > 0) out = out.slice(0, q.limit);
  return out.map(clone);
}

export const getById = (id) => {
  const hit = load().find((i) => i.id === id);
  return hit ? clone(hit) : null;
};

/** The same message from the same address within `windowMs` — a double
    submit or a retry after a slow response. Returns the earlier record. */
export function findRecentDuplicate({ email, message }, windowMs = 10 * 60_000, now = Date.now()) {
  const hit = load()
    .filter((i) => i.email === email && i.message === message)
    .sort(newestFirst)[0];
  if (!hit) return null;
  return now - Date.parse(hit.receivedAt) <= windowMs ? clone(hit) : null;
}

/** Counts the admin page needs in one call — over the WHOLE inbox, so the
    filter pills stay informative while a filter is active. */
export function stats(now = Date.now()) {
  const all = load();
  const tally = (keys, fn) => {
    const acc = Object.fromEntries(keys.map((k) => [k, 0]));
    for (const i of all) acc[fn(i)] = (acc[fn(i)] ?? 0) + 1;
    return acc;
  };
  const weekAgo = now - 7 * 86_400_000;
  const byStatus = tally(INQUIRY_STATUSES, (i) => i.status);
  return {
    total: all.length,
    byStatus,
    byIntent: tally(INQUIRY_INTENTS, (i) => i.intent),
    open: byStatus[INQUIRY_STATUS.NEW] + byStatus[INQUIRY_STATUS.IN_PROGRESS],
    last7Days: all.filter((i) => Date.parse(i.receivedAt) >= weekAgo).length,
    persistence: state.persistence,
  };
}

/* --------------------------------------------------------------- writes ---- */

/* anf-20260903-k7x2 — readable enough to quote on the phone, unique enough
   for a small inbox. The date lets the desk place it without opening it. */
function makeId(items, now) {
  const day = now.toISOString().slice(0, 10).replace(/-/g, "");
  for (;;) {
    const rand = Math.random().toString(36).slice(2, 6).padEnd(4, "0");
    const id = `anf-${day}-${rand}`;
    if (!items.some((i) => i.id === id)) return id;
  }
}

/**
 * File a sanitized, validated submission (see schema.sanitizeSubmission /
 * validateSubmission). Throws VALIDATION if the record is malformed.
 * `delivery` records how the notification went out: "pending" until the
 * route has tried, then the channel name or "failed".
 */
export function create(input, { now = new Date() } = {}) {
  const items = load();
  const stamp = now.toISOString();
  const record = {
    id: makeId(items, now),
    receivedAt: stamp,
    updatedAt: stamp,
    status: INQUIRY_STATUS.NEW,
    intent: input.intent,
    intentLabel: input.intentLabel ?? "",
    name: input.name,
    email: input.email,
    company: input.company ?? "",
    city: input.city ?? "",
    phone: input.phone ?? "",
    message: input.message,
    details: Array.isArray(input.details) ? structuredClone(input.details) : [],
    language: input.language,
    notes: "",
    delivery: typeof input.delivery === "string" ? input.delivery : "pending",
  };
  assertInquiry(record);
  items.push(record);
  persist();
  return clone(record);
}

/**
 * Patch the desk's fields. Only `status`, `notes` and `delivery` are
 * writable — what the visitor wrote is a record, not a draft.
 * Returns the updated record or null when the id is unknown.
 */
export function update(id, patch = {}) {
  const items = load();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;

  const next = { ...items[idx] };

  if (patch.status !== undefined) {
    if (!isInquiryStatus(patch.status)) {
      const err = new Error(`status must be one of ${INQUIRY_STATUSES.join(", ")}`);
      err.code = "VALIDATION";
      err.details = [err.message];
      throw err;
    }
    next.status = patch.status;
  }
  if (patch.notes !== undefined) {
    if (typeof patch.notes !== "string") {
      const err = new Error("notes must be a string");
      err.code = "VALIDATION";
      err.details = [err.message];
      throw err;
    }
    next.notes = patch.notes.slice(0, INQUIRY_MAX.notes);
  }
  if (typeof patch.delivery === "string") next.delivery = patch.delivery.slice(0, 40);

  next.updatedAt = new Date().toISOString();
  assertInquiry(next);
  items[idx] = next;
  persist();
  return clone(next);
}

export function remove(id) {
  const items = load();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  persist();
  return true;
}
