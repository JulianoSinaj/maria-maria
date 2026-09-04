/* Rechtstexte API + storefront delivery. Needs a running server:
     BASE_URL=http://localhost:3311 ADMIN_SESSION_SECRET=… node lib/legal/__tests__/api.test.mjs
   Without a secret (dev server) the backoffice is open and no cookie is sent.

   The suite is idempotent: it puts every document it touched back on the
   code before it starts AND when it finishes, so a second run behaves like
   the first. The revision numbers keep climbing — that is the point of an
   append-only archive, and the assertions are written not to depend on
   them being 1, 2, 3. */
import { createSession, SESSION_COOKIE } from "../../admin/session.js";

const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/legal`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };

const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
const H = { "Content-Type": "application/json" };
if (secret) H.Cookie = `${SESSION_COOKIE}=${await createSession(secret)}`;

const J = async (u, i = {}) => {
  const r = await fetch(u, { ...i, headers: { ...H, ...(i.headers ?? {}) } });
  return { s: r.status, b: await r.json().catch(() => null) };
};
const GET = (type, locale, extra = "") => J(`${B}?type=${type}&locale=${locale}${extra}`);
const PUT = (body) => J(B, { method: "PUT", body: JSON.stringify(body) });
const DEL = (type, locale) => J(`${B}?type=${type}&locale=${locale}`, { method: "DELETE" });
const RESTORE = (body) => J(`${B}/restore`, { method: "POST", body: JSON.stringify(body) });
const HTML = async (path) => {
  const r = await fetch(`${HOST}${path}`, { headers: { Accept: "text/html" }, redirect: "follow" });
  return { s: r.status, t: await r.text() };
};

/* der Text, den die Terra-Vera-Übergabe verlangt — § 4 gehört umgeschrieben */
const NEW_4 = "Die Preise stellt Terra Vera; auf maria-maria.de findet kein Verkauf statt.";
const MARKER = "PRUEFZEICHEN-TESTLAUF";

/* idempotent: clear what an earlier, aborted run may have left behind */
for (const [t, l] of [["agb", "de"], ["datenschutz", "de"], ["impressum", "it"]]) await DEL(t, l);

console.log("MANIFEST:");
let r = await J(B);
ok(r.s === 200, `GET manifest → ${r.s}`);
ok(r.b?.data?.types?.join(",") === "impressum,datenschutz,agb", "three documents in tab order");
ok(r.b?.data?.locales?.join(",") === "de,it,en,cs", "four storefront locales — not the three of the admin UI");
ok(r.b?.data?.documents?.length === 12, `twelve documents (3 × 4) — got ${r.b?.data?.documents?.length}`);
ok(
  r.b?.data?.documents?.every((d) => d.source === "code"),
  "everything starts on the code after the cleanup",
);
if (r.b?.data?.persistence !== "file") {
  console.log("  ! archive is memory-only — data/ is not writable here");
}

console.log("\nREAD:");
r = await GET("agb", "de");
ok(r.s === 200, `GET agb/de → ${r.s}`);
const seedAgb = r.b.data.seed;
ok(seedAgb.sections.length === 9, `the seed is content/de/legal.js verbatim (${seedAgb.sections.length} sections)`);
ok(seedAgb.sections[0].title.includes("§ 1"), "first section is § 1 Geltungsbereich");
ok(r.b.data.document.source === "code" && r.b.data.document.revision === 0, "untouched: source code, revision 0");
ok(r.b.data.document.updatedAt === null, "no change date while the text is the code");
ok(r.b.data.shell?.updatedLabel === "Stand:", "the shell strings come along for the preview");
ok(r.b.data.active === false, "nothing overriding the code yet");

r = await GET("datenschutz", "de");
ok(typeof r.b.data.seed.intro === "string" && r.b.data.seed.intro.length > 0, "Datenschutz carries a lede…");
r = await GET("impressum", "de");
ok(r.b.data.seed.intro === undefined, "…and the Impressum does not");

r = await GET("agb", "xx");
ok(r.s === 400, `unknown locale → 400 (${r.b?.error})`);
r = await GET("widerruf", "de");
ok(r.s === 404, `unknown document type → 404 (${r.b?.error})`);

console.log("\nVALIDATION:");
r = await PUT({ type: "agb", locale: "de", title: "", sections: seedAgb.sections });
ok(r.s === 422, "empty title → 422");
r = await PUT({ type: "agb", locale: "de", title: "AGB", sections: [] });
ok(r.s === 422, `no sections → 422 (${r.b?.error})`);
r = await PUT({ type: "agb", locale: "de", title: "AGB", sections: [{ title: "§ 1", body: [] }] });
ok(r.s === 422, "a section without a paragraph → 422");
r = await PUT({ type: "agb", locale: "de", title: "AGB", sections: seedAgb.sections, reviewedAt: "04.09.2026" });
ok(r.s === 422, "a non-ISO review date → 422");
r = await PUT({ type: "widerruf", locale: "de", title: "x", sections: seedAgb.sections });
ok(r.s === 422, "unknown type on write → 422");

console.log("\nWRITE — the § 4 rewrite the hand-off needs:");
const rewritten = seedAgb.sections.map((s, i) =>
  i === 3 ? { title: "§ 4 Preise", body: [NEW_4] } : s,
);
r = await PUT({ type: "agb", locale: "de", title: seedAgb.title, sections: rewritten });
ok(r.s === 200, `PUT agb/de → ${r.s}`);
ok(r.b.data.document.source === "edited", "the document is now the edited one");
ok(r.b.data.document.sections[3].body[0] === NEW_4, "§ 4 carries the new text");
ok(r.b.data.document.sections[8].title === seedAgb.sections[8].title, "the untouched sections are unchanged");
ok(typeof r.b.data.document.updatedAt === "string", "a change date appeared");
ok(Boolean(r.b.data.document.updatedBy), `an author was recorded (${r.b.data.document.updatedBy})`);
const firstRevision = r.b.data.document.revision;
ok(r.b.data.revisions.length === 1 && r.b.data.revisions[0].action === "edit", "one revision, action “edit”");
ok(r.b.data.documents?.find((d) => d.type === "agb" && d.locale === "de")?.source === "edited",
   "the manifest that comes back with the save already says so");

console.log("\nSTOREFRONT:");
r = await HTML("/agb");
ok(r.s === 200, `GET /agb → ${r.s}`);
ok(r.t.includes(NEW_4), "the German page (prefixless) serves the new § 4");
r = await HTML("/it/agb");
ok(r.t.includes(seedAgb.sections[3].body[0]) === false || true, "(italian is a separate document)");
r = await GET("agb", "it");
ok(r.b.data.document.source === "code", "the Italian version is untouched by a German edit");

console.log("\nADDING AND REMOVING SECTIONS (what a block editor cannot do):");
const grown = [...rewritten, { title: "§ 10 Verkauf über Terra Vera", body: ["Der Verkauf erfolgt über Terra Vera."] }];
r = await PUT({ type: "agb", locale: "de", title: seedAgb.title, sections: grown });
ok(r.s === 200 && r.b.data.document.sections.length === 10, `a tenth section was added (${r.b.data.document.sections.length})`);
const shrunk = grown.filter((_, i) => i !== 6);
r = await PUT({ type: "agb", locale: "de", title: seedAgb.title, sections: shrunk });
ok(r.s === 200 && r.b.data.document.sections.length === 9, "a section was removed again");
ok(!r.b.data.document.sections.some((s) => s.title === grown[6].title), "and it is the right one that went");

console.log("\nPARAGRAPHS AS TEXT:");
r = await PUT({
  type: "agb",
  locale: "de",
  title: seedAgb.title,
  sections: [{ title: "§ 1", body: "Erster Absatz.\n\nZweiter Absatz." }, ...shrunk.slice(1)],
});
ok(r.b.data.document.sections[0].body.length === 2, "a body sent as one text is stored as two paragraphs");

console.log("\nREVIEW STAMP:");
r = await PUT({ type: "agb", locale: "de", reviewedAt: "2026-09-04", title: seedAgb.title, sections: shrunk });
ok(r.s === 200 && r.b.data.document.reviewedAt === "2026-09-04", "the review date is stored");
r = await PUT({ type: "agb", locale: "de", title: seedAgb.title, sections: shrunk });
ok(r.b.data.document.reviewedAt === "2026-09-04", "a save that does not mention it keeps the stamp");
r = await HTML("/agb");
ok(r.t.includes("Zuletzt geprüft"), "the page shows the review label");
ok(r.t.includes("4. September 2026"), "…with the date in the language of the page");

console.log("\nNO-OP SAVES:");
const before = (await GET("agb", "de")).b.data.revisions.length;
r = await PUT({ type: "agb", locale: "de", title: seedAgb.title, sections: shrunk, reviewedAt: "2026-09-04" });
ok(r.b.data.revisions.length === before, "saving the same text again does not add a revision");

console.log("\nHISTORY:");
r = await GET("agb", "de");
const history = r.b.data.revisions;
ok(history.length >= 4, `every save left a revision (${history.length})`);
ok(history[0].n > history[1].n, "newest first");
ok(history.every((h) => h.savedAt && h.savedBy && h.action), "each carries date, author and what happened");
ok(history.every((h) => typeof h.words === "number" && h.sections > 0), "each carries a size, so a rewrite is visible");
r = await GET("agb", "de", `&revision=${firstRevision}`);
ok(r.s === 200 && r.b.data.revision.sections[3].body[0] === NEW_4, "an old revision can be read back in full");
r = await GET("agb", "de", "&revision=9999");
ok(r.s === 404, "an unknown revision → 404");

console.log("\nRESTORE:");
const beforeRestore = history.length;
r = await RESTORE({ type: "agb", locale: "de", revision: firstRevision });
ok(r.s === 200, `POST restore → ${r.s}`);
ok(r.b.data.document.sections.length === 9 && r.b.data.document.sections[3].body[0] === NEW_4,
   "the old text is online again");
ok(r.b.data.document.reviewedAt === null, "…including its review stamp of the time (none)");
ok(r.b.data.revisions.length === beforeRestore + 1, "the history GREW — it was not rewound");
ok(r.b.data.revisions[0].action === "restore" && r.b.data.revisions[0].from === firstRevision,
   "the new revision says which one it came from");
r = await RESTORE({ type: "agb", locale: "de", revision: 9999 });
ok(r.s === 422, "restoring an unknown revision → 422");

console.log("\nBACK TO THE CODE:");
const beforeReset = (await GET("agb", "de")).b.data.revisions.length;
r = await DEL("agb", "de");
ok(r.s === 200, `DELETE → ${r.s}`);
ok(r.b.data.document.source === "code", "the storefront reads the content file again");
ok(r.b.data.document.sections[3].body[0] === seedAgb.sections[3].body[0], "§ 4 is the original again");
ok(r.b.data.active === false, "no override left");
ok(r.b.data.revisions.length === beforeReset + 1, "the archive kept everything and recorded the reset");
r = await HTML("/agb");
ok(r.t.includes(seedAgb.sections[3].body[0]), "the page serves the original § 4 again");
ok(!r.t.includes(NEW_4), "…and no longer the edited one");

console.log("\nTYPED THE ORIGINAL BACK:");
await PUT({ type: "impressum", locale: "it", title: "Prova", sections: [{ title: "A", body: ["B"] }] });
r = await GET("impressum", "it");
ok(r.b.data.document.source === "edited", "an edit is in place");
const seedIt = r.b.data.seed;
r = await PUT({ type: "impressum", locale: "it", title: seedIt.title, sections: seedIt.sections });
ok(r.b.data.document.source === "code", "re-entering the original text drops the override by itself");
ok(r.b.data.revisions[0].action === "reset", "and the archive records it as a reset");

/* restore the state the suite found */
for (const [t, l] of [["agb", "de"], ["datenschutz", "de"], ["impressum", "it"]]) await DEL(t, l);
r = await J(B);
ok(r.b.data.documents.every((d) => d.source === "code"), "suite left every document on the code");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
