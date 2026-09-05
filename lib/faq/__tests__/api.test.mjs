/* FAQ API — end-to-end against a running server.
   Run: node lib/faq/__tests__/api.test.mjs  (npm run test:faq)

   The suite is idempotent: everything it creates it deletes again, and the
   two records it edits are restored. It never asserts on the seeded wording
   itself — that is the storefront's business — only on the rules the store
   is there to keep: ids stay put, published questions stay complete in
   German, order is the page's order, and the dictionary shape is the shape
   FaqSection already reads. */

const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/faq`;
const AUTH = process.env.ADMIN_PASSWORD
  ? {
      Authorization: `Basic ${Buffer.from(
        `${process.env.ADMIN_USER ?? "maria"}:${process.env.ADMIN_PASSWORD}`,
      ).toString("base64")}`,
    }
  : {};

let pass = 0;
let fail = 0;
const ok = (c, m) => {
  if (c) {
    pass += 1;
    console.log("  ✓ " + m);
  } else {
    fail += 1;
    console.log("  ✗ FAIL: " + m);
  }
};

const J = async (url, init) => {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...AUTH, ...init?.headers },
  });
  return { s: res.status, b: await res.json().catch(() => null) };
};
const POST = (body) => J(B, { method: "POST", body: JSON.stringify(body) });
const PATCH = (body) => J(B, { method: "PATCH", body: JSON.stringify(body) });
const ITEM = (id, init) => J(`${B}/${encodeURIComponent(id)}`, init);

const text = (q, a, link = null) => ({
  de: { q, a, link },
  it: { q, a, link },
  en: { q, a, link },
  cs: { q, a, link },
});

console.log("MANIFEST:");
let r = await J(`${B}?view=groups`);
ok(r.s === 200, "GET ?view=groups → 200");
const groups = r.b.data.groups;
ok(groups.length === 16, `${groups.length} groups: seven pages plus nine wines`);
ok(
  groups.filter((g) => g.kind === "page").length === 7 &&
    groups.filter((g) => g.kind === "wine").length === 9,
  "pages and wines are told apart",
);
ok(
  groups.find((g) => g.key === "regionen")?.nested === true &&
    groups.find((g) => g.key === "home")?.nested === false,
  "regionen is clustered, home is flat",
);
ok(
  groups.find((g) => g.key === "kontakt")?.nested === false &&
    groups.find((g) => g.key === "kontakt")?.count === 6,
  "kontakt is flat with six questions — the list /kontakt renders",
);
ok(
  groups.find((g) => g.key === "wine:lugana")?.name === "Lugana DOC",
  "wine groups carry the wine's name",
);
ok(r.b.data.count === 98, `${r.b.data.count} seeded questions (53 page + 45 wine)`);
ok(
  Object.values(r.b.data.missing).every((n) => n === 0),
  "the seed is complete in all four languages",
);
console.log(`  · persistence: ${r.b.data.persistence}`);

console.log("\nLIST:");
r = await J(`${B}?group=kontakt`);
ok(r.s === 200 && r.b.data.length === 6, `kontakt has ${r.b.data.length} questions`);
ok(
  r.b.data.every((i) => i.subgroup === null),
  "kontakt is flat — every question sits directly on the page",
);
r = await J(`${B}?group=regionen`);
ok(
  r.s === 200 && r.b.data[0].subgroup === "apulien" && r.b.data.at(-1).subgroup === "garda",
  "a clustered group follows the page's cluster order, then position",
);
r = await J(`${B}?search=versand`);
ok(r.s === 200 && r.b.data.length > 0, `search "versand" finds ${r.b.data.length} questions`);
r = await J(`${B}?incomplete=cs`);
ok(r.s === 200 && r.b.data.length === 0, "no question is missing its Czech text");

console.log("\nVALIDATION:");
r = await POST({ id: "Kontakt Versand", group: "kontakt", subgroup: "shop", text: text("Q", "A") });
ok(r.s === 422, "id with spaces and capitals → 422");
r = await POST({ id: "kontakt-kaufen", group: "kontakt", text: text("Q", "A") });
ok(r.s === 409, "duplicate id → 409");
r = await POST({ id: "test-unknown-group", group: "nirgends", text: text("Q", "A") });
ok(r.s === 422, "unknown group → 422");
r = await POST({ id: "test-no-cluster", group: "regionen", text: text("Q", "A") });
ok(r.s === 422, "clustered page without a cluster → 422");
r = await POST({ id: "test-flat-cluster", group: "home", subgroup: "allgemein", text: text("Q", "A") });
ok(r.s === 422, "cluster on a flat page → 422");
r = await POST({
  id: "test-bad-href",
  group: "home",
  text: text("Q", "A", { label: "Mehr", href: "javascript:alert(1)" }),
});
ok(r.s === 422, "link target that is not a path, anchor or URL → 422");
r = await POST({
  id: "test-published-empty",
  group: "home",
  status: "published",
  text: { de: { q: "", a: "" }, it: { q: "", a: "" }, en: { q: "", a: "" }, cs: { q: "", a: "" } },
});
ok(r.s === 422, "publishing without a German text → 422");

console.log("\nCREATE, EDIT, ORDER:");
r = await POST({
  id: "test-terra-vera",
  group: "kontakt",
  text: text(
    "Wo kann ich bestellen?",
    "Der Verkauf läuft über Terra Vera.",
    { label: "Zu Terra Vera", href: "https://www.terra-vera.com" },
  ),
});
ok(r.s === 201, "create → 201");
ok(r.b.data.status === "draft", "a new question starts as a draft");
ok(r.b.data.order === 6, `it lands at the end of the page (order ${r.b.data.order})`);
ok(
  Object.values(r.b.data.completeness).every(Boolean),
  "completeness is reported per language",
);

r = await ITEM("test-terra-vera", {
  method: "PATCH",
  body: JSON.stringify({ text: { it: { q: "Dove posso ordinare?" } } }),
});
ok(r.s === 200 && r.b.data.text.it.q === "Dove posso ordinare?", "patching one language …");
ok(r.b.data.text.de.q === "Wo kann ich bestellen?", "… leaves the other three alone");
ok(r.b.data.text.it.a === "Der Verkauf läuft über Terra Vera.", "… and keeps that language's answer");

r = await ITEM("test-terra-vera", {
  method: "PATCH",
  body: JSON.stringify({ status: "published" }),
});
ok(r.s === 200 && r.b.data.publishedAt, "publishing stamps publishedAt");

const before = (await J(`${B}?group=kontakt`)).b.data.map((i) => i.id);
r = await PATCH({ action: "reorder", group: "kontakt", subgroup: null, ids: [...before].reverse() });
ok(r.s === 200, "reorder → 200");
const after = (await J(`${B}?group=kontakt`)).b.data.map((i) => i.id);
ok(JSON.stringify(after) === JSON.stringify([...before].reverse()), "the page is in the new order");
await PATCH({ action: "reorder", group: "kontakt", subgroup: null, ids: before });

console.log("\nID LOCK:");
r = await ITEM("test-terra-vera", {
  method: "PATCH",
  body: JSON.stringify({ action: "rename", id: "test-terra-vera-neu" }),
});
ok(r.s === 409 && r.b.code === "ID_LOCKED", "renaming a published question → 409 ID_LOCKED");
r = await ITEM("test-terra-vera", {
  method: "PATCH",
  body: JSON.stringify({ action: "rename", id: "kontakt-kaufen", force: true }),
});
ok(r.s === 409, "renaming onto an id that exists → 409");
r = await ITEM("test-terra-vera", {
  method: "PATCH",
  body: JSON.stringify({ action: "rename", id: "test-terra-vera-neu", force: true }),
});
ok(r.s === 200 && r.b.data.id === "test-terra-vera-neu", "with force it renames");
r = await ITEM("test-terra-vera-neu", { method: "PATCH", body: JSON.stringify({ id: "hijack" }) });
ok(r.s === 200 && r.b.data.id === "test-terra-vera-neu", "a plain patch cannot re-key a record");

console.log("\nMOVE AND DELETE:");
r = await ITEM("test-terra-vera-neu", {
  method: "PATCH",
  body: JSON.stringify({ group: "shop", subgroup: null }),
});
ok(r.s === 200 && r.b.data.group === "shop" && r.b.data.subgroup === null, "moved to a flat page");
r = await ITEM("test-terra-vera-neu", { method: "DELETE" });
ok(r.s === 204, "delete → 204");
r = await ITEM("test-terra-vera-neu");
ok(r.s === 404, "and it is gone");

console.log("\nCLUSTERS:");
r = await PATCH({ action: "subgroup", group: "regionen", key: "test-cluster", label: { de: "Test" } });
ok(r.s === 200 && r.b.data.some((s) => s.key === "test-cluster"), "create a cluster");
r = await J(`${B}?group=regionen&subgroup=test-cluster`, { method: "DELETE" });
ok(r.s === 200, "an empty cluster can go");
r = await J(`${B}?group=regionen&subgroup=apulien`, { method: "DELETE" });
ok(r.s === 409, "a cluster with questions in it cannot");
r = await PATCH({ action: "subgroup", group: "kontakt", key: "nope", label: { de: "X" } });
ok(r.s === 422, "a flat page takes no clusters");

console.log("\nSTOREFRONT SHAPE:");
r = await J(`${HOST}/api/admin/faq?group=wine:lugana`);
ok(r.s === 200 && r.b.data.length === 5, `wine:lugana carries ${r.b.data.length} questions`);
ok(
  r.b.data.every((i) => i.id.startsWith("lugana-")),
  "the wine's ids are the ones its page deep-links",
);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
