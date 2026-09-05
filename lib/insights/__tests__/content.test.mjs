/* Pure helpers — runs without a server:
   `node lib/insights/__tests__/content.test.mjs`

   The translation checker is the one part of the content report that can be
   confidently wrong: it has to tell an untranslated string apart from a
   deliberately empty one, and the four deliberate ones in this codebase are
   documented in the content files rather than anywhere a program can see.
   An earlier version counted whitespace and emptiness as gaps and reported
   four faults that no amount of translating could clear — hence this file. */

import { leafPaths, readPath, isTranslated } from "../translations.js";

let pass = 0;
let fail = 0;
const ok = (c, m) => {
  c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m));
};

/* ------------------------------------------------------------ leafPaths -- */

console.log("leafPaths:");
{
  const de = {
    hero: { title: "Zwei Frauen", lines: ["Eins", "Zwei"] },
    count: 7,
    flag: true,
    nested: { deep: { text: "da" } },
    empty: "",
  };
  const paths = leafPaths(de, "sec", []);
  ok(paths.includes("sec.hero.title"), "walks nested objects");
  ok(paths.includes("sec.hero.lines[0]") && paths.includes("sec.hero.lines[1]"), "walks arrays by index");
  ok(paths.includes("sec.nested.deep.text"), "walks deeply");
  ok(!paths.includes("sec.count") && !paths.includes("sec.flag"), "numbers and booleans are not translatable");
  ok(!paths.includes("sec.empty"), "an empty German string is not a key to translate");
}

/* ------------------------------------------------------------- readPath -- */

console.log("\nreadPath:");
{
  const it = { hero: { title: "Due donne", lines: ["Uno", "Due"] } };
  ok(readPath(it, "hero.title") === "Due donne", "reads a dotted path");
  ok(readPath(it, "hero.lines[1]") === "Due", "reads an indexed path");
  ok(readPath(it, "hero.missing") === undefined, "absent key reads undefined");
  ok(readPath(it, "nope.deep.deeper") === undefined, "absent branch does not throw");
  ok(readPath(it, "hero.lines[9]") === undefined, "out-of-range index reads undefined");
}

/* --------------------------------------------------- isTranslated rules -- */

console.log("\nisTranslated — the four real cases from content/:");
{
  /* common.winePage.similarJoin: ", " in de/cs, " " in en/it */
  ok(isTranslated(" ", "en", "common.winePage.similarJoin"), "a bare space is a translation (EN similarJoin)");
  /* magazin.quote.translation: empty in Italian, the quote is already Italian */
  ok(isTranslated("", "it", "magazin.quote.translation"), "a deliberately empty string counts as translated");
  /* regionen.band.titleEnd: „darf je Sprache leer sein" */
  ok(isTranslated("", "cs", "regionen.band.titleEnd"), "an optional empty tail counts as translated");
  /* cs stops counting at four — grammar, not laziness */
  ok(
    isTranslated(undefined, "cs", "common.winePage.similarCounts.5"),
    "Czech may omit similarCounts.5 (genitive from five upwards)",
  );
  ok(
    isTranslated(undefined, "cs", "common.winePage.similarCounts.6"),
    "Czech may omit similarCounts.6",
  );
}

console.log("\nisTranslated — a genuine gap must still be caught:");
{
  ok(!isTranslated(undefined, "it", "home.hero.title"), "an absent key IS a gap");
  ok(!isTranslated(null, "en", "home.hero.title"), "null IS a gap");
  ok(!isTranslated(42, "cs", "home.hero.title"), "a non-string IS a gap");
  ok(
    !isTranslated(undefined, "it", "common.winePage.similarCounts.5"),
    "the Czech exemption does not leak to Italian",
  );
  ok(
    !isTranslated(undefined, "cs", "common.winePage.similarCounts.4"),
    "the exemption is exact — 4 is still required in Czech",
  );
}

console.log(`\n${fail ? "FAILED" : "PASSED"} — ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
