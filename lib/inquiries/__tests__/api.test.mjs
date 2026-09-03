/* End-to-end check of the Anfragen inbox against a running server:
     BASE_URL=http://localhost:3311 ADMIN_PASSWORD=… node lib/inquiries/__tests__/api.test.mjs
   Exercises the public /api/contact route (filing, honeypot, dedupe, rate
   limit) and the protected /api/admin/inquiries routes (list, filters,
   patch, CSV, delete). Cleans up every record it creates.

   The rate limit counts per IP over 15 minutes, so a second run within
   that window is refused early — the script says so and exits 2. */

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const C = `${BASE}/api/contact`;
const A = `${BASE}/api/admin/inquiries`;

const AUTH = process.env.ADMIN_PASSWORD
  ? {
      Authorization: `Basic ${Buffer.from(
        `${process.env.ADMIN_USER ?? "maria"}:${process.env.ADMIN_PASSWORD}`,
      ).toString("base64")}`,
    }
  : {};

let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };
const J = async (u, i = {}) => {
  const r = await fetch(u, { ...i, headers: { "Content-Type": "application/json", ...AUTH, ...(i.headers ?? {}) } });
  const text = await r.text();
  let b = null;
  try { b = JSON.parse(text); } catch { /* not JSON (CSV, 204) */ }
  return { s: r.status, b, text, h: r.headers };
};
const post = (body) => J(C, { method: "POST", headers: { Authorization: "" }, body: JSON.stringify(body) });
const patch = (id, body) => J(`${A}/${id}`, { method: "PATCH", body: JSON.stringify(body) });

const stamp = Date.now().toString(36);
const company = `Testbetrieb ${stamp}`;
const valid = {
  intent: "event_feier",
  intentLabel: "Evento / festa",
  name: "Test Anfrage",
  email: `anfrage-${stamp}@example.com`,
  company,
  city: "40822 Mettmann",
  phone: "+49 2104 000000",
  message: `Testnachricht ${stamp}`,
  language: "it-IT",
  details: [
    { key: "guests", label: "Numero di ospiti", value: "40" },
    { key: "eventType", label: "Tipo di evento", value: "Compleanno" },
  ],
};

console.log("SUBMIT (/api/contact):");
let r = await post({ ...valid, intent: "" });
if (r.s === 429) {
  console.log("  rate-limited from an earlier run — wait 15 minutes (or restart the server) and retry");
  process.exit(2);
}
ok(r.s === 422, `missing intent → 422 (${r.b?.error})`);
r = await post({ ...valid, website: "http://spam.example" });
ok(r.s === 200 && r.b?.ok === true && r.b.channel === undefined, "honeypot filled → 200 ok, nothing else said");
r = await post(valid);
ok(r.s === 200 && r.b?.ok === true && typeof r.b.channel === "string", `valid → 200, channel "${r.b?.channel}"`);

console.log("\nINBOX (/api/admin/inquiries):");
r = await J(A);
ok(r.s === 200 && Array.isArray(r.b?.data), `GET list → 200 (${r.b?.data?.length} records, meta.total ${r.b?.meta?.total})`);
const mine = (r.b?.data ?? []).filter((i) => i.email === valid.email);
ok(mine.length === 1, "exactly one record for the test address — the honeypot submission was not filed");
const rec = mine[0] ?? {};
ok(/^anf-\d{8}-[a-z0-9]{4}$/.test(rec.id ?? ""), `id has the anf-YYYYMMDD-xxxx shape (${rec.id})`);
ok(rec.status === "neu" && rec.language === "it" && rec.intent === "event_feier",
   `filed as status "${rec.status}", language "${rec.language}", intent "${rec.intent}"`);
ok(rec.details?.length === 2 && rec.details[0].label === "Numero di ospiti" && rec.details[0].value === "40",
   "extra fields kept with their labels");
ok(rec.notes === "" && typeof rec.delivery === "string" && rec.delivery !== "pending",
   `notes empty, delivery recorded as "${rec.delivery}"`);
ok(rec.company === company && rec.phone === valid.phone && rec.intentLabel === "Evento / festa",
   "company, phone and the visitor-language intent label kept");
const stamps = (r.b?.data ?? []).map((i) => i.receivedAt);
ok(stamps.every((s, i) => i === 0 || stamps[i - 1] >= s), "newest first");
ok(r.b?.meta?.total >= 1 && r.b.meta.byIntent?.event_feier >= 1 && r.b.meta.byStatus?.neu >= 1 && typeof r.b.meta.last7Days === "number",
   `meta carries total / byIntent / byStatus / last7Days (persistence: ${r.b?.meta?.persistence})`);

console.log("\nFILTERS:");
r = await J(`${A}?intent=event_feier`);
ok(r.b.data.some((i) => i.id === rec.id), "intent=event_feier includes it");
r = await J(`${A}?intent=verkostung`);
ok(!r.b.data.some((i) => i.id === rec.id), "intent=verkostung excludes it");
r = await J(`${A}?search=${encodeURIComponent(company)}`);
ok(r.b.data.length === 1 && r.b.data[0].id === rec.id, "search by company → exactly the record");
r = await J(`${A}?search=${encodeURIComponent("compleanno")}`);
ok(r.b.data.some((i) => i.id === rec.id), "search reaches into the extra fields (case-insensitive)");
r = await J(`${A}?language=it`);
ok(r.b.data.some((i) => i.id === rec.id), "language=it includes it");
r = await J(`${A}?limit=1`);
ok(r.b.data.length === 1, "limit=1 → one row");
r = await J(`${A}?status=beantwortet&search=${encodeURIComponent(company)}`);
ok(r.b.data.length === 0, "status=beantwortet excludes the new record");

console.log("\nDESK:");
r = await J(`${A}/${rec.id}`);
ok(r.s === 200 && r.b.data.id === rec.id, "GET by id → 200");
r = await patch(rec.id, { status: "in_bearbeitung", notes: "Rückruf vereinbart" });
ok(r.s === 200 && r.b.data.status === "in_bearbeitung" && r.b.data.notes === "Rückruf vereinbart",
   "PATCH status + notes → 200 with both applied");
ok(r.b.data.updatedAt > r.b.data.receivedAt, "updatedAt moved past receivedAt");
r = await J(`${A}?status=in_bearbeitung`);
ok(r.b.data.some((i) => i.id === rec.id), "status=in_bearbeitung now includes it");
r = await patch(rec.id, { status: "unbekannt" });
ok(r.s === 422, `unknown status → 422 (${r.b?.error})`);
r = await patch(rec.id, { name: "hacked", email: "x@y.zz" });
ok(r.s === 422, "patching what the visitor wrote → 422 (nothing to update)");
r = await patch(rec.id, { notes: "" });
ok(r.s === 200 && r.b.data.status === "in_bearbeitung" && r.b.data.notes === "", "clearing notes keeps the status");
r = await patch("anf-00000000-none", { status: "neu" });
ok(r.s === 404, "PATCH unknown id → 404");
r = await J(`${A}?view=stats`);
ok(r.b.data.total >= 1 && r.b.data.byStatus.in_bearbeitung >= 1 && r.b.data.open >= 1,
   `view=stats: total ${r.b.data.total}, open ${r.b.data.open}`);

console.log("\nCSV EXPORT:");
r = await J(`${A}?format=csv&search=${encodeURIComponent(company)}`);
ok(r.s === 200 && /^text\/csv/.test(r.h.get("content-type") ?? ""), `content-type ${r.h.get("content-type")}`);
ok(/attachment; filename="anfragen-\d{4}-\d{2}-\d{2}\.csv"/.test(r.h.get("content-disposition") ?? ""),
   `content-disposition ${r.h.get("content-disposition")}`);
ok(r.text.charCodeAt(0) === 0xfeff, "starts with a UTF-8 BOM (Excel)");
const lines = r.text.slice(1).replace(/\r\n$/, "").split("\r\n");
ok(lines[0].startsWith("id;receivedAt;status;intent;name;email;company;city;phone;language;message;details;notes"),
   "semicolon header row");
ok(lines.length === 2 && lines[1].startsWith(`${rec.id};`) && lines[1].includes("Numero di ospiti: 40 | Tipo di evento: Compleanno"),
   "one data row, extra fields flattened");

console.log("\nDEDUPE & RATE LIMIT:");
r = await post(valid);
ok(r.s === 200 && r.b?.ok === true, "resubmitting the same message → 200");
r = await J(`${A}?search=${encodeURIComponent(company)}`);
ok(r.b.data.length === 1, "…but still one record (deduplicated)");
const second = { ...valid, email: `zweite-${stamp}@example.com`, message: `Zweite Nachricht ${stamp}`, intent: "verkostung", intentLabel: "Verkostung", language: "de-DE", details: [] };
r = await post(second);
ok(r.s === 200 && r.b?.ok === true, "5th attempt in the window → 200");
r = await post({ ...second, message: `Dritte Nachricht ${stamp}` });
ok(r.s === 429 && r.b?.ok === false && r.h.get("retry-after"), `6th attempt → 429 with Retry-After ${r.h.get("retry-after")}`);
r = await J(`${A}?search=${encodeURIComponent(`Dritte Nachricht ${stamp}`)}`);
ok(r.b.data.length === 0, "the refused attempt was not filed");

console.log("\nCLEANUP:");
r = await J(`${A}?search=${encodeURIComponent(stamp)}`);
ok(r.b.data.length === 2, `two test records to remove (found ${r.b.data.length})`);
for (const i of r.b.data) {
  const d = await J(`${A}/${i.id}`, { method: "DELETE" });
  ok(d.s === 204, `DELETE ${i.id} → 204`);
}
r = await J(`${A}/${rec.id}`);
ok(r.s === 404, "GET deleted → 404");
r = await J(`${A}/${rec.id}`, { method: "DELETE" });
ok(r.s === 404, "DELETE unknown → 404");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
