/* Pure helpers — runs without a server: `node lib/legal/__tests__/schema.test.mjs` */
import {
  LEGAL_MAX,
  LEGAL_TYPES,
  countWords,
  isIsoDay,
  isLegalType,
  isoToday,
  joinParagraphs,
  sameDocument,
  sanitizeDocument,
  splitParagraphs,
  validateDocument,
} from "../schema.js";

let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };

const doc = (over = {}) => ({
  title: "Allgemeine Geschäftsbedingungen",
  sections: [{ title: "§ 1 Geltungsbereich", body: ["Diese Bedingungen gelten."] }],
  ...over,
});

console.log("TYPES:");
ok(LEGAL_TYPES.join(",") === "impressum,datenschutz,agb", "three documents in tab order");
ok(isLegalType("agb") && !isLegalType("widerruf"), "isLegalType gates the enum");

console.log("\nPARAGRAPHS:");
ok(splitParagraphs("a\n\nb").join("|") === "a|b", "a blank line separates two paragraphs");
ok(splitParagraphs("a\nb").join("|") === "a b", "a single newline is a soft wrap, not a paragraph");
ok(splitParagraphs("a\n\n\n\nb").length === 2, "several blank lines still make two paragraphs");
ok(splitParagraphs("  \n\n b \n\n  ").join("|") === "b", "blank paragraphs are dropped");
ok(splitParagraphs("a\r\n\r\nb").join("|") === "a|b", "CRLF from a Windows paste splits too");
ok(splitParagraphs(null).length === 0 && splitParagraphs(undefined).length === 0, "non-strings give nothing");
const body = ["Erster Absatz.", "Zweiter Absatz."];
ok(splitParagraphs(joinParagraphs(body)).join("|") === body.join("|"), "split(join(body)) === body");
ok(joinParagraphs(body) === "Erster Absatz.\n\nZweiter Absatz.", "join puts a blank line between");

console.log("\nSANITIZE:");
let s = sanitizeDocument({ title: "  AGB  ", sections: [{ title: " § 1 ", body: "a\n\nb" }] });
ok(s.title === "AGB", "title is trimmed");
ok(s.sections[0].title === "§ 1", "section title is trimmed");
ok(s.sections[0].body.join("|") === "a|b", "a section body given as text becomes paragraphs");
s = sanitizeDocument({ title: "T", sections: [{ title: "S", body: ["x", "  ", "y"] }] });
ok(s.sections[0].body.join("|") === "x|y", "a body given as an array keeps its shape, empties dropped");
ok(sanitizeDocument({ title: "T", sections: [] }).intro === undefined, "no intro key unless one was sent");
ok(sanitizeDocument({ title: "T", intro: " hi ", sections: [] }).intro === "hi", "intro is trimmed when present");
ok(sanitizeDocument({ title: "x".repeat(400), sections: [] }).title.length === LEGAL_MAX.title, "title is capped");
ok(
  sanitizeDocument({ title: "T", sections: Array(200).fill({ title: "S", body: ["b"] }) }).sections.length ===
    LEGAL_MAX.sections,
  "the section list is capped",
);
ok(sanitizeDocument({ title: "T", sections: [], reviewedAt: "2026-09-04" }).reviewedAt === "2026-09-04", "a valid review date survives");
ok(sanitizeDocument({ title: "T", sections: [], reviewedAt: "gestern" }).reviewedAt === null, "an unparseable review date becomes null");
ok(sanitizeDocument({ title: "T", sections: [], reviewedAt: null }).reviewedAt === null, "null stays null (a document may have no stamp)");

console.log("\nVALIDATE:");
ok(validateDocument(doc()).length === 0, "a well-formed document passes");
ok(validateDocument(doc({ title: "" })).some((e) => e.includes("title")), "an empty title is refused");
ok(
  validateDocument(doc({ sections: [] })).some((e) => e.includes("at least one section")),
  "a document without sections is refused — an empty Impressum is a missing Impressum",
);
ok(
  validateDocument(doc({ sections: [{ title: "§ 1", body: [] }] })).some((e) => e.includes("at least one paragraph")),
  "a section without a paragraph is refused",
);
ok(
  validateDocument(doc({ sections: [{ title: "", body: ["x"] }] })).some((e) => e.includes("sections[0].title")),
  "the error names the offending section",
);
ok(validateDocument(doc({ reviewedAt: "04.09.2026" })).some((e) => e.includes("reviewedAt")), "a German date is not an ISO day");
ok(validateDocument(doc({ reviewedAt: null })).length === 0, "no review stamp is valid");

console.log("\nDATES:");
ok(isIsoDay("2026-09-04") && !isIsoDay("2026-9-4") && !isIsoDay("2026-13-40"), "isIsoDay wants a real YYYY-MM-DD");
ok(isIsoDay(isoToday()), "isoToday produces one");
ok(isoToday(new Date(2026, 8, 4)) === "2026-09-04", "isoToday pads month and day, in local time");

console.log("\nCOMPARE:");
ok(sameDocument(doc(), doc()), "identical documents match");
ok(!sameDocument(doc(), doc({ title: "AGB" })), "a changed title differs");
ok(!sameDocument(doc(), doc({ reviewedAt: "2026-09-04" })), "a review stamp alone counts as a change");
ok(
  !sameDocument(doc(), doc({ sections: [...doc().sections, { title: "§ 2", body: ["y"] }] })),
  "an added section differs",
);
ok(
  !sameDocument(doc(), doc({ sections: [{ title: "§ 1 Geltungsbereich", body: ["Diese Bedingungen gelten!"] }] })),
  "a changed paragraph differs",
);
ok(sameDocument({ ...doc(), reviewedAt: null }, { ...doc(), reviewedAt: undefined }), "null and undefined stamps are the same absence");

console.log("\nWORDS:");
/* "Allgemeine Geschäftsbedingungen" 2 + "§ 1 Geltungsbereich" 3 + "Diese Bedingungen gelten." 3 */
ok(countWords(doc()) === 8, `title, section title and body all count (${countWords(doc())})`);
ok(countWords({ title: "", sections: [] }) === 0, "an empty document counts zero");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
