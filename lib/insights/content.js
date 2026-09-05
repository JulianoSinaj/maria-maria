/* Content status — what is unfinished, in one pass.
   ==================================================================
   Three questions the desk cannot answer by looking at the site, because
   the answer is precisely what is NOT on it:

     drafts               an interview written but not published
     missing translations a key that exists in German and in no other language
     broken shop links    a wine whose "Im Shop entdecken" no longer lands
                          on a bottle (see ./links.js — checked over the
                          network and cached, so it is passed in here)

   German is the reference language throughout. That is not a hierarchy but
   a fact of this codebase: the site was written in German and the other
   three are overlays on it (lib/i18n/winePages.js says so at length). A key
   missing from German is a bug in German; a key missing from Italian is an
   untranslated string.

   Server-only — it loads all four dictionaries, which lib/i18n/dictionaries
   refuses to hand to a browser. */

import { getDictionary } from "../i18n/dictionaries";
import { LOCALES, DEFAULT_LOCALE, LOCALE_META } from "../i18n/config";
import { listInterviews } from "../interviews/store";
import { INTERVIEW_LOCALES } from "../interviews/schema";
import { WINE_SLUGS } from "../../components/weine/wineRegistry";

/* Sections whose absence in a translation is not a gap.

   `weinePages` is the overlay for the nine landing pages and exists ONLY in
   it/en/cs — German is the original the overlay is laid over, so comparing
   German against it would report every translated page as missing. */
const SKIP_SECTIONS = new Set(["weinePages"]);

/* How many individual missing keys to name per language. The count is
   exact; the list is a sample, because "412 fehlende Schlüssel" as 412
   lines is a wall, not a report. */
const SAMPLE = 8;

/* ------------------------------------------------------------ key paths ---- */

/* Every leaf of the German dictionary as a dotted path. Arrays are walked
   by index — the overlays are position-for-position (winePages.mergeText
   depends on it), so index 3 of a list is the same string in every
   language. */
function leafPaths(node, prefix, out) {
  if (node === null || node === undefined) return out;

  if (Array.isArray(node)) {
    node.forEach((item, i) => leafPaths(item, `${prefix}[${i}]`, out));
    return out;
  }
  if (typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      leafPaths(value, prefix ? `${prefix}.${key}` : key, out);
    }
    return out;
  }
  /* Only text is translatable. Numbers, booleans and dates are the same in
     every language and their absence is not a translation gap. */
  if (typeof node === "string" && node.trim()) out.push(prefix);
  return out;
}

/* Read a dotted path (with [i] segments) back out of a dictionary. */
function readPath(root, path) {
  let cur = root;
  for (const part of path.split(".")) {
    const [key, ...indices] = part.split("[");
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[key];
    for (const raw of indices) {
      const i = Number(raw.slice(0, -1));
      if (!Array.isArray(cur)) return undefined;
      cur = cur[i];
    }
  }
  return cur;
}

/* --------------------------------------------------------- translations ---- */

async function translationGaps() {
  const de = await getDictionary(DEFAULT_LOCALE);

  const sections = Object.keys(de).filter((s) => !SKIP_SECTIONS.has(s));
  const paths = [];
  for (const section of sections) leafPaths(de[section], section, paths);

  const others = LOCALES.filter((l) => l !== DEFAULT_LOCALE);
  const rows = [];

  for (const locale of others) {
    const dict = await getDictionary(locale);
    const missing = [];
    const bySection = {};

    for (const path of paths) {
      const value = readPath(dict, path);
      if (typeof value === "string" && value.trim()) continue;
      missing.push(path);
      const section = path.split(/[.[]/)[0];
      bySection[section] = (bySection[section] ?? 0) + 1;
    }

    rows.push({
      locale,
      label: LOCALE_META[locale]?.native ?? locale,
      total: paths.length,
      missing: missing.length,
      /* share TRANSLATED, because that is the number that goes up when
         someone does the work */
      coverage: paths.length ? (paths.length - missing.length) / paths.length : 1,
      sections: Object.entries(bySection)
        .map(([section, count]) => ({ section, count }))
        .sort((a, b) => b.count - a.count),
      sample: missing.slice(0, SAMPLE),
    });
  }

  return { reference: DEFAULT_LOCALE, keys: paths.length, rows };
}

/* -------------------------------------------------------------- drafts ---- */

/* An interview is a draft when its record says so, and it is "incomplete"
   when it is published without a date — the article renders, but its
   structured data carries no datePublished (the route drops the field
   rather than inventing one), which is the difference between an article
   Google can date and one it cannot.

   Reads lib/interviews/store.js — the same merge of code-shipped pieces
   and the magazine editor's own records that the storefront renders from
   — rather than the four dictionaries directly, so a piece created or
   edited in the backoffice shows up here immediately, not just the ones
   shipped in content/<locale>/interviews.js. */
async function interviewStatus() {
  const rows = await listInterviews();

  return rows.map((row) => {
    const missingLocales = INTERVIEW_LOCALES.filter((l) => row.completeness?.[l] === "missing");
    /* The publish date is one shared fact per piece, not per language (see
       lib/interviews/schema.js) — a live piece without one is undated in
       EVERY language it actually appears in, i.e. every language that is
       not already flagged as missing. A draft has no datePublished by
       definition and that is not a gap worth flagging. */
    const undatedLocales =
      row.status === "published" && !row.publishedAt
        ? INTERVIEW_LOCALES.filter((l) => !missingLocales.includes(l))
        : [];
    return {
      slug: row.slug,
      title: row.name || row.slug,
      draft: row.status !== "published",
      missingLocales,
      undatedLocales,
    };
  });
}

/* Wine landing pages: does every language carry an overlay for every slug?
   German has none by design — it IS the original. */
async function winePageStatus() {
  const overlays = Object.fromEntries(
    await Promise.all(
      LOCALES.filter((l) => l !== DEFAULT_LOCALE).map(async (l) => [
        l,
        (await getDictionary(l))?.weinePages ?? {},
      ]),
    ),
  );

  return WINE_SLUGS.map((slug) => ({
    slug,
    missingLocales: Object.entries(overlays)
      .filter(([, pages]) => !pages?.[slug])
      .map(([locale]) => locale),
  })).filter((row) => row.missingLocales.length);
}

/* --------------------------------------------------------------- report ---- */

/**
 * The whole content status. `links` is the cached Terra Vera check
 * (lib/insights/links.js) — passed in rather than fetched here so a page
 * load never waits on a foreign server.
 */
export async function contentStatus({ links = null } = {}) {
  const [translations, interviews, winePages] = await Promise.all([
    translationGaps(),
    interviewStatus(),
    winePageStatus(),
  ]);

  const drafts = interviews.filter((i) => i.draft);
  const undated = interviews.filter((i) => !i.draft && i.undatedLocales.length);
  const brokenLinks = (links?.items ?? []).filter((l) => !l.ok);
  const unavailable = (links?.items ?? []).filter((l) => l.ok && l.available === false);

  return {
    translations,
    interviews,
    winePages,
    links,
    /* The one-line summary the card leads with — each number is a thing
       somebody has to do, not a thing that merely exists. */
    counts: {
      drafts: drafts.length,
      undated: undated.length,
      missingTranslations: translations.rows.reduce((s, r) => s + r.missing, 0),
      incompleteLanguages: translations.rows.filter((r) => r.missing > 0).length,
      missingWinePages: winePages.reduce((s, w) => s + w.missingLocales.length, 0),
      brokenLinks: brokenLinks.length,
      unavailable: unavailable.length,
    },
  };
}
