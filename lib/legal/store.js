/* Legal document store — Impressum, Datenschutz, AGB.
   ==================================================================
   Twelve documents: three types × the four storefront languages. The seed
   of each one is the code itself (content/<locale>/legal.js), so a document
   nobody has touched IS the file on disk and the editor shows it verbatim.

   HISTORY IS THE POINT OF THIS MODULE. A legal text is the one kind of
   content where "what did the page say on the day of that order" is a
   question with consequences, so revisions are APPEND-ONLY: every save
   writes a new revision with its date and its author, and nothing ever
   rewrites an earlier one. Restoring an old version does not roll the
   history back — it appends the old text as a NEW revision that says where
   it came from. The chain therefore reads as what was online, in order,
   which is exactly what has to be provable.

   Persistence: a JSON file under data/legal/ (gitignored, ignored by the
   dev watcher — see next.config.js). Read once into a globalThis singleton,
   rewritten atomically after every change. On a read-only filesystem the
   write fails once, is logged once, and the store carries on in memory —
   the admin page says so, because a history that does not survive a restart
   is not a history and nobody should find that out later. THIS IS THE ONE
   STORE WHERE THAT MATTERS: on Vercel, data/ is ephemeral, and the
   deployment needs a persistent volume before the history means anything.

   Same globalThis semantics as the other admin stores: `next dev` compiles
   each route into its own module graph, so a plain module binding would
   exist once per route bundle. One process, one archive. */

import fs from "fs";
import path from "path";
import { LOCALES, isLocale } from "@/lib/i18n/config";
import {
  LEGAL_MAX,
  LEGAL_MAX_REVISIONS,
  LEGAL_TYPES,
  countWords,
  isLegalType,
  sameDocument,
  sanitizeDocument,
  validateDocument,
} from "./schema";

if (typeof window !== "undefined") {
  throw new Error(
    "lib/legal/store ist serverseitig — der Editor spricht mit /api/admin/legal, " +
      "Form und Helfer liegen in lib/legal/schema.",
  );
}

const FILE_VERSION = 1;

const storeFile = () =>
  process.env.MM_LEGAL_FILE || path.join(process.cwd(), "data", "legal", "legal.json");

/* The same four named branches as lib/i18n/dictionaries — a template string
   in the import would make Webpack bundle the whole content directory. */
const SEEDS = {
  de: () => import("@/content/de/legal"),
  it: () => import("@/content/it/legal"),
  en: () => import("@/content/en/legal"),
  cs: () => import("@/content/cs/legal"),
};

const key = (type, locale) => `${type}:${locale}`;

const g = globalThis;
g.__mmLegalStore ??= { docs: null, persistence: null, warned: false };
const state = g.__mmLegalStore;

/* ---------------------------------------------------------- persistence ---- */

function load() {
  if (state.docs) return state.docs;
  try {
    const parsed = JSON.parse(fs.readFileSync(storeFile(), "utf8"));
    state.docs = parsed?.docs && typeof parsed.docs === "object" ? parsed.docs : {};
    state.persistence = "file";
  } catch (err) {
    state.docs = {};
    /* no file yet is the normal first start — it appears with the first
       edit. Anything else means the disk is not ours to rely on. */
    state.persistence = err?.code === "ENOENT" ? "file" : "memory";
    if (err?.code !== "ENOENT") {
      console.warn(
        `[rechtstexte] Archiv nicht lesbar (${err?.code ?? err}); Fassungen nur im Arbeitsspeicher.`,
      );
    }
  }
  return state.docs;
}

function persist() {
  const file = storeFile();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    /* write-then-rename: a crash mid-write leaves the previous archive intact */
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({ version: FILE_VERSION, docs: state.docs }, null, 2));
    fs.renameSync(tmp, file);
    state.persistence = "file";
  } catch (err) {
    state.persistence = "memory";
    if (!state.warned) {
      state.warned = true;
      console.warn(
        `[rechtstexte] Archiv nicht schreibbar (${err?.code ?? err}); Fassungen nur im Arbeitsspeicher.`,
      );
    }
  }
}

/** "file" when revisions survive a restart, "memory" when they do not. */
export function persistenceMode() {
  load();
  return state.persistence;
}

/** Empty the archive. Used by tests. */
export function resetLegalStore() {
  load();
  state.docs = {};
  persist();
}

/* ---------------------------------------------------------------- seeds ---- */

/** The document as the code has it — the baseline every comparison and
    every "zurück zum Code" refers to. */
export async function getSeedDocument(type, locale) {
  if (!isLegalType(type) || !SEEDS[locale]) return null;
  const mod = await SEEDS[locale]();
  const legal = mod.default ?? mod.legal;
  const doc = legal?.[type];
  if (!doc) return null;

  /* structuredClone, because the module cache hands out the SAME object on
     every call — a caller that edited it would corrupt the seed for the
     whole process, storefront included */
  return structuredClone({
    title: doc.title,
    ...(doc.intro !== undefined ? { intro: doc.intro } : {}),
    sections: doc.sections,
  });
}

/** The shared shell strings (kicker, "Stand:", the contact line). They are
    not edited here — this editor is about the legal text itself — but the
    preview needs them to look like the page. */
export async function getShell(locale) {
  if (!SEEDS[locale]) return null;
  const mod = await SEEDS[locale]();
  const legal = mod.default ?? mod.legal;
  return legal?.shell ? structuredClone(legal.shell) : null;
}

/* ---------------------------------------------------------------- reads ---- */

const record = (type, locale) => load()[key(type, locale)] ?? null;

const latest = (rec) =>
  rec?.active && rec.revisions?.length ? rec.revisions[rec.revisions.length - 1] : null;

/** Strip the bookkeeping — a revision's content is a document. */
const contentOf = (rev) => ({
  title: rev.title,
  ...(rev.intro !== undefined ? { intro: rev.intro } : {}),
  sections: structuredClone(rev.sections),
});

/**
 * The document the storefront should render, seed or edited.
 *
 * `updatedAt` is null while the text is the code — the page then keeps the
 * static "Stand:" from the content file, because a build date would be a
 * worse answer than the one the lawyer wrote.
 */
export async function resolveDocument(type, locale) {
  const seed = await getSeedDocument(type, locale);
  if (!seed) return null;

  const rev = latest(record(type, locale));
  if (!rev) {
    return { ...seed, reviewedAt: null, updatedAt: null, updatedBy: null, revision: 0, source: "code" };
  }

  return {
    ...contentOf(rev),
    reviewedAt: rev.reviewedAt ?? null,
    updatedAt: rev.savedAt,
    updatedBy: rev.savedBy,
    revision: rev.n,
    source: "edited",
  };
}

/** One revision as the history list shows it — without the text, which is
    fetched only when someone opens or restores it. */
const revisionMeta = (rev) => ({
  n: rev.n,
  savedAt: rev.savedAt,
  savedBy: rev.savedBy,
  action: rev.action,
  from: rev.from ?? null,
  sections: rev.sections.length,
  words: countWords(rev),
  reviewedAt: rev.reviewedAt ?? null,
});

/**
 * Everything the editor needs for one document: what is live, what the code
 * says, and the full history.
 */
export async function getRecord(type, locale) {
  const seed = await getSeedDocument(type, locale);
  if (!seed) return null;
  const rec = record(type, locale);

  return {
    type,
    locale,
    document: await resolveDocument(type, locale),
    seed,
    /* the editor greys out "zurück zum Code" when the text already is it */
    active: Boolean(rec?.active),
    revisions: (rec?.revisions ?? []).map(revisionMeta).reverse(),
  };
}

/** The text of one revision — for the history preview and for restore. */
export async function getRevision(type, locale, n) {
  const rec = record(type, locale);
  const rev = rec?.revisions?.find((r) => r.n === Number(n));
  if (!rev) return null;
  return { ...revisionMeta(rev), ...contentOf(rev) };
}

/**
 * The manifest of all twelve documents — what the editor's type and language
 * tabs are built from, so no counter is ever assembled from a second call.
 */
export async function overview() {
  const out = [];
  for (const type of LEGAL_TYPES) {
    for (const locale of LOCALES) {
      const doc = await resolveDocument(type, locale);
      if (!doc) continue;
      const rec = record(type, locale);
      out.push({
        type,
        locale,
        source: doc.source,
        revision: doc.revision,
        updatedAt: doc.updatedAt,
        updatedBy: doc.updatedBy,
        reviewedAt: doc.reviewedAt,
        sections: doc.sections.length,
        words: countWords(doc),
        /* revisions exist even for a document that is back on the code —
           the archive outlives the override, that is its whole job */
        revisions: rec?.revisions?.length ?? 0,
      });
    }
  }
  return out;
}

/* --------------------------------------------------------------- writes ---- */

const fail = (errors) => {
  const err = new Error(errors.join("; "));
  err.code = "VALIDATION";
  err.details = errors;
  throw err;
};

const author = (who) =>
  (typeof who === "string" && who.trim().slice(0, LEGAL_MAX.author)) || "unbekannt";

/** Append a revision and write the archive. The only path that mutates. */
function append(type, locale, entry, { active }) {
  const docs = load();
  const k = key(type, locale);
  const rec = (docs[k] ??= { type, locale, active: false, revisions: [] });

  const n = (rec.revisions.at(-1)?.n ?? 0) + 1;
  rec.revisions.push({ n, ...entry });
  /* the cap trims the OLDEST entries; the recent chain is the one anyone
     ever asks about, and an unbounded file would eventually be the reason
     the archive stops being written at all */
  if (rec.revisions.length > LEGAL_MAX_REVISIONS) {
    rec.revisions = rec.revisions.slice(-LEGAL_MAX_REVISIONS);
  }
  rec.active = active;

  persist();
  return n;
}

/**
 * Save an edited document as a new revision.
 *
 * Returns the fresh record. Throws VALIDATION when the document is
 * malformed, so the route can answer 422 with `details`.
 */
export async function saveDocument(type, locale, input, { who, now = new Date() } = {}) {
  if (!isLegalType(type)) fail([`Unknown document type "${type}"`]);
  if (!isLocale(locale)) fail([`Unknown locale "${locale}"`]);

  const seed = await getSeedDocument(type, locale);
  if (!seed) fail([`No seed for ${type} in "${locale}"`]);

  const current = await resolveDocument(type, locale);

  const doc = sanitizeDocument(input);

  /* A field the caller did not mention keeps the value that is live. The
     editor always posts the whole document, but a script that patches only
     the review stamp must not silently blank the lede — and the other way
     round. Only `title` and `sections` are required, and validation says so. */
  if (doc.intro === undefined && current.intro !== undefined) doc.intro = current.intro;
  /* a document whose code has no lede does not grow one here — the seed
     decides which fields exist, the same rule the Seiten editor follows */
  if (seed.intro === undefined) delete doc.intro;
  if (doc.reviewedAt === undefined) doc.reviewedAt = current.reviewedAt ?? null;

  const errs = validateDocument(doc);
  if (errs.length) fail(errs);

  /* Nothing changed: not a revision. Ten saves of the same text would
     otherwise bury the one that mattered. */
  if (sameDocument(current, doc)) return getRecord(type, locale);

  /* Typed the original back, review stamp and all — that IS the code, so
     the override goes and the page follows the content file again. The
     revision is still recorded: "on this day it went back to the code". */
  const backToCode = sameDocument({ ...seed, reviewedAt: null }, doc);

  append(
    type,
    locale,
    {
      savedAt: now.toISOString(),
      savedBy: author(who),
      action: backToCode ? "reset" : "edit",
      ...doc,
      reviewedAt: doc.reviewedAt ?? null,
    },
    { active: !backToCode },
  );

  return getRecord(type, locale);
}

/**
 * Put an earlier revision back online — as a NEW revision that names the one
 * it came from. The history is never rewound; that is what makes it usable
 * as evidence.
 */
export async function restoreRevision(type, locale, n, { who, now = new Date() } = {}) {
  if (!isLegalType(type)) fail([`Unknown document type "${type}"`]);
  if (!isLocale(locale)) fail([`Unknown locale "${locale}"`]);

  const rec = record(type, locale);
  const source = rec?.revisions?.find((r) => r.n === Number(n));
  if (!source) fail([`Unknown revision ${n} for ${type}/${locale}`]);

  const seed = await getSeedDocument(type, locale);
  const doc = { ...contentOf(source), reviewedAt: source.reviewedAt ?? null };
  const backToCode = sameDocument({ ...seed, reviewedAt: null }, doc);

  append(
    type,
    locale,
    {
      savedAt: now.toISOString(),
      savedBy: author(who),
      action: "restore",
      from: source.n,
      ...doc,
    },
    { active: !backToCode },
  );

  return getRecord(type, locale);
}

/**
 * Back to the code: the storefront reads content/<locale>/legal.js again.
 *
 * The archive is NOT deleted. Dropping the history along with the override
 * would destroy the record of what was online during exactly the period
 * somebody is most likely to ask about.
 */
export async function resetDocument(type, locale, { who, now = new Date() } = {}) {
  if (!isLegalType(type)) fail([`Unknown document type "${type}"`]);
  if (!isLocale(locale)) fail([`Unknown locale "${locale}"`]);

  const seed = await getSeedDocument(type, locale);
  if (!seed) fail([`No seed for ${type} in "${locale}"`]);

  /* already on the code — nothing to record */
  if (!record(type, locale)?.active) return getRecord(type, locale);

  append(
    type,
    locale,
    {
      savedAt: now.toISOString(),
      savedBy: author(who),
      action: "reset",
      ...seed,
      reviewedAt: null,
    },
    { active: false },
  );

  return getRecord(type, locale);
}
