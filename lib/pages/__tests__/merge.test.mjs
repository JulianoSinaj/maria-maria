/* Pure helpers — runs without a server: `node lib/pages/__tests__/merge.test.mjs` */
import {
  pathOf,
  getAt,
  setAt,
  deepEqual,
  applyOverrides,
  countStrings,
  labelOf,
  validateAgainstSeed,
} from "../merge.js";

let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };

const seed = {
  hero: { eyebrow: "Herkunft", titleLines: ["Zwei", "Frauen"], cta: "Mehr", href: "/kontakt" },
  regions: {
    apulien: { name: "Apulien", desc: "Sonne" },
    garda: { name: "Gardasee", desc: "Frische" },
  },
  stats: [{ label: "A", detail: "a" }, { label: "B", detail: "b" }],
};

console.log("PATHS:");
ok(pathOf("regions.apulien").join("|") === "regions|apulien", "pathOf splits on dots");
ok(getAt(seed, ["regions", "garda", "name"]) === "Gardasee", "getAt walks nested keys");
ok(getAt(seed, ["stats", 1, "label"]) === "B", "getAt walks list indices");
ok(getAt(seed, ["nope", "x"]) === undefined, "getAt returns undefined off the map");
ok(labelOf(["moments", "selection", "title"]) === "moments.selection.title", "labelOf dots");
ok(labelOf(["paragraphs", 1]) === "paragraphs[1]", "labelOf brackets list indices");

console.log("\nSET (immutable):");
const next = setAt(seed, ["regions", "apulien"], { name: "Puglia", desc: "Sole" });
ok(next !== seed && next.regions !== seed.regions, "path is copied");
ok(next.hero === seed.hero && next.stats === seed.stats, "siblings keep their reference");
ok(seed.regions.apulien.name === "Apulien", "source untouched");
ok(next.regions.apulien.name === "Puglia" && next.regions.garda === seed.regions.garda, "value replaced, neighbour shared");
const arr = setAt(seed, ["stats", 0, "label"], "Z");
ok(Array.isArray(arr.stats) && arr.stats[0].label === "Z" && arr.stats[1] === seed.stats[1], "setAt through a list keeps it a list");

console.log("\nMERGE:");
const dict = { regionen: seed, home: { hero: { title: "x" } } };
const merged = applyOverrides(dict, {
  regionen: { "regions.garda": { name: "Lago di Garda", desc: "Freschezza" }, hero: { ...seed.hero, cta: "Scopri" } },
});
ok(merged.regionen.regions.garda.name === "Lago di Garda", "sub-block override lands at the dotted path");
ok(merged.regionen.hero.cta === "Scopri" && merged.regionen.regions.apulien === seed.regions.apulien, "block override replaces, untouched branches shared");
ok(merged.home === dict.home, "other pages keep their reference");
ok(applyOverrides(dict, null) === dict, "no overrides → same object");
ok(deepEqual(seed, JSON.parse(JSON.stringify(seed))) && !deepEqual(seed, next), "deepEqual structural");
/* 13 = 5 im hero (der gesperrte href zählt mit, er ist ein String im Baum)
   + 4 in regions + 4 in stats. countStrings zählt Blätter, nicht Felder: die
   Karte nennt die Zahl neben dem Blocknamen. */
ok(countStrings(seed) === 13, `countStrings counts every leaf (${countStrings(seed)})`);

console.log("\nVALIDATION:");
const opts = { lockedKeys: ["href", "id"] };
ok(validateAgainstSeed(seed.hero, { ...seed.hero, eyebrow: "" }, opts).length === 0, "empty string is a legal text");
ok(validateAgainstSeed(seed.hero, { ...seed.hero, eyebrow: 5 }, opts)[0].includes("must be a string"), "number leaf → error");
ok(validateAgainstSeed(seed.hero, { ...seed.hero, href: "/shop" }, opts)[0].includes("structural"), "locked href change → error");
ok(validateAgainstSeed(seed.hero, { ...seed.hero, titleLines: ["Zwei"] }, opts)[0].includes("keep 2 entries"), "list length change → error");
const { cta, ...missing } = seed.hero;
ok(validateAgainstSeed(seed.hero, missing, opts)[0] === "cta is missing", "missing key → error");
ok(validateAgainstSeed(seed.hero, { ...seed.hero, extra: "x" }, opts)[0].includes("not a field"), "unknown key → error");
ok(validateAgainstSeed(seed.stats, [{ label: "A", detail: 1 }, seed.stats[1]], opts)[0] === "[0].detail must be a string", "nested list error names the path");
ok(validateAgainstSeed(seed, "text", opts)[0] === "block must be an object", "wrong root type");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
