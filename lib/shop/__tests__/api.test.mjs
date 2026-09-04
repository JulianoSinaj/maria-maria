/* Partner-shop sync — API test.
   Run against a dev server:  BASE_URL=http://localhost:3000 npm run test:shop

   It talks to the REAL Terra Vera product endpoints (they are public and
   need no key) — that is the point of the test: the contract being verified
   is the one with the shop, not with a fixture.

   It changes one wine's handle to a bogus value to prove the 404 path, and
   puts the real one back at the end. */

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const INV = `${BASE}/api/admin/inventory`;
const SHOP = `${BASE}/api/admin/shop/sync`;

let pass = 0;
let fail = 0;
const ok = (c, m) => {
  c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m));
};
const J = async (u, i) => {
  const r = await fetch(u, { ...i, headers: { "Content-Type": "application/json", ...i?.headers } });
  return { s: r.status, b: await r.json().catch(() => null) };
};
const patch = (id, body) =>
  J(`${INV}/${id}`, { method: "PATCH", body: JSON.stringify(body) });

const LUGANA = "inv-lugana";
const REAL_HANDLE = "lugana-doc-maria-maria-0-7";

console.log("SEED / SHAPE:");
let r = await J(INV);
const wines = r.b?.data ?? [];
ok(wines.length === 9, `9 wines (${wines.length})`);
ok(
  wines.every((w) => w.shop && "handle" in w.shop && "sync" in w.shop),
  "every wine carries a shop block",
);
ok(
  wines.filter((w) => w.shop.handle).length === 9,
  `all nine carry a partner-shop handle (${wines.filter((w) => w.shop.handle).length})`,
);
const lugana = wines.find((w) => w.id === LUGANA);
ok(lugana?.shop.handle === REAL_HANDLE, `Lugana handle is ${lugana?.shop.handle}`);

console.log("\nSUMMARY (no outbound request):");
r = await J(SHOP);
ok(r.s === 200 && r.b?.data?.linked === 9, `GET summary → linked ${r.b?.data?.linked}`);
ok(
  typeof r.b?.data?.bySync === "object" && Array.isArray(r.b?.data?.missing),
  "summary carries bySync counts and a missing[] list",
);

console.log("\nSYNC ONE (live call to terra-vera.com):");
r = await J(SHOP, { method: "POST", body: JSON.stringify({ id: LUGANA }) });
ok(r.s === 200 && r.b?.data?.shop?.sync === "ok", `sync → ${r.b?.data?.shop?.sync}`);
ok(
  typeof r.b?.data?.shop?.price === "number" && r.b.data.shop.price > 0,
  `price read from the shop: ${r.b?.data?.shop?.price} €`,
);
ok(typeof r.b?.data?.shop?.available === "boolean", `availability: ${r.b?.data?.shop?.available}`);
ok(
  Boolean(r.b?.data?.shop?.syncedAt) && !Number.isNaN(Date.parse(r.b.data.shop.syncedAt)),
  `syncedAt stamped (${r.b?.data?.shop?.syncedAt})`,
);
ok(
  typeof r.b?.data?.shop?.title === "string" && r.b.data.shop.title.length > 0,
  `shop title captured: „${String(r.b?.data?.shop?.title).slice(0, 46)}…"`,
);
ok(r.b?.meta?.result?.source === ".js", `read from the ${r.b?.meta?.result?.source} endpoint`);

console.log("\nHANDLE CHANGE INVALIDATES THE SYNCED NUMBERS:");
r = await patch(LUGANA, { shop: { handle: "kein-produkt-mit-diesem-handle" } });
ok(r.s === 200 && r.b?.data?.shop?.handle === "kein-produkt-mit-diesem-handle", "handle patched");
ok(
  r.b?.data?.shop?.sync === "never" && r.b?.data?.shop?.price === null,
  "price/availability cleared with the old handle (no stale claim)",
);

console.log("\n404 PATH:");
r = await J(SHOP, { method: "POST", body: JSON.stringify({ id: LUGANA }) });
ok(r.s === 200 && r.b?.data?.shop?.sync === "missing", `bogus handle → ${r.b?.data?.shop?.sync}`);
ok(String(r.b?.data?.shop?.error).includes("404"), `error says why: ${r.b?.data?.shop?.error}`);
r = await J(SHOP);
ok(
  r.b?.data?.missing?.some((m) => m.id === LUGANA),
  "the summary lists it under missing[] — the warning the table shows",
);

console.log("\nVALIDATION:");
r = await patch(LUGANA, { shop: { handle: "Nicht/Erlaubt?" } });
ok(r.s === 422, `a handle with URL characters → 422 (${r.b?.details?.[0] ?? r.b?.error})`);
r = await J(SHOP, { method: "POST", body: JSON.stringify({ id: "inv-does-not-exist" }) });
ok(r.s === 404, "sync of an unknown id → 404");

console.log("\nRESTORE + SYNC ALL:");
r = await patch(LUGANA, { shop: { handle: REAL_HANDLE } });
ok(r.s === 200 && r.b?.data?.shop?.handle === REAL_HANDLE, "real handle restored");

r = await J(SHOP, { method: "POST", body: JSON.stringify({}) });
const run = r.b?.meta?.run;
ok(r.s === 200 && run?.checked === 9, `sync all → ${run?.checked} checked`);
ok(run?.ok === 9, `all nine answered: ok ${run?.ok}, missing ${run?.missing}, error ${run?.error}`);
ok(run?.durationMs < 20_000, `run took ${run?.durationMs} ms`);
ok(
  (r.b?.data ?? []).every((w) => w.shop.sync === "ok" && w.shop.price > 0),
  "every wine now carries a price from the shop",
);

console.log("\nDRIFT DETECTION (catalogue price vs shop price):");
r = await J(SHOP);
console.log(
  `  · drift: ${(r.b?.data?.drift ?? [])
    .map((d) => `${d.name} ${d.price}→${d.shopPrice}`)
    .join(", ") || "none"}`,
);
ok(Array.isArray(r.b?.data?.drift), "summary reports price drift as a list");
ok(r.b?.data?.bySync?.ok === 9 && r.b?.data?.missing?.length === 0, "summary agrees with the run");

console.log("\nCRON DOOR:");
r = await J(`${BASE}/api/cron/shop-sync`);
ok(r.s === 200 || r.s === 401 || r.s === 503, `GET /api/cron/shop-sync → ${r.s} (dev: 200)`);
if (r.s === 200) ok(r.b?.data?.checked === 9, `cron run checked ${r.b?.data?.checked} wines`);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
