/* Which strings a language is still missing — the rules, on their own.
   ==================================================================
   Split out of ./content.js so it can be tested without loading four
   dictionaries and the interview store: these three functions are pure text
   logic, and they are the part of the content report most able to be
   quietly wrong.

   German is the reference throughout. That is not a hierarchy but a fact of
   this codebase — the site was written in German and the other three are
   overlays on it (lib/i18n/winePages.js says so at length). A key missing
   from German is a bug in German; a key missing from Italian is an
   untranslated string. */

/* Keys a language is RIGHT not to carry.

   Every one is argued for in the content file itself; they are repeated
   here because the report would otherwise send the editor chasing the same
   non-problems every time they open the backoffice.

   Grammar, not laziness:
     · similarCounts.5/.6 — Czech counts 2–4 with the nominative and needs
       the genitive from five upwards („pět vín"), which changes the whole
       agreement. content/cs/common.js deliberately stops at four and the
       code prints the digit beyond it. */
export const DELIBERATE_GAPS = new Set([
  "cs:common.winePage.similarCounts.5",
  "cs:common.winePage.similarCounts.6",
]);

/* Every leaf of a dictionary as a dotted path. Arrays are walked by index —
   the overlays are position-for-position (winePages.mergeText depends on
   it), so index 3 of a list is the same string in every language. */
export function leafPaths(node, prefix, out) {
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
  /* Only text is translatable. Numbers, booleans and dates read the same in
     every language, and an empty German string is not a key to translate —
     it is a slot the German edition chose to leave shut. */
  if (typeof node === "string" && node.trim()) out.push(prefix);
  return out;
}

/* Read a dotted path (with [i] segments) back out of a dictionary. */
export function readPath(root, path) {
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

/**
 * Has this key been translated into this language?
 *
 * A string — ANY string — counts as translated. Emptiness is a decision in
 * this codebase, not an omission, and the content files say so where they
 * use it: magazin.quote.translation is left empty in Italian because the
 * quotation is already Italian, and regionen.band.titleEnd "darf je Sprache
 * leer sein". Whitespace is a decision too — common.winePage.similarJoin is
 * ", " in German and a bare space in English, because English takes no
 * comma before a restrictive clause.
 *
 * An earlier version required a non-blank string and duly reported four
 * permanent faults that no amount of translating could ever clear. A status
 * list nobody can empty is a status list nobody reads.
 */
export function isTranslated(value, locale, path) {
  if (typeof value === "string") return true;
  return DELIBERATE_GAPS.has(`${locale}:${path}`);
}
