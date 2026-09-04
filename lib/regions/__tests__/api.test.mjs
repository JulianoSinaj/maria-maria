const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/regions`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };
const J = async (u, i) => { const r = await fetch(u, i); return { s: r.status, b: await r.json().catch(() => null) }; };
const PUT = (body) => J(B, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const find = (body, key) => body.data.regions.find((r) => r.key === key);

console.log("DEFAULTS (fresh — suite must be idempotent):");
let r = await J(`${B}?fresh=1`);
ok(r.s === 200, "GET → 200");
ok(r.b.data.regions.length === 3, "three origins");
ok(r.b.data.regions.every((x) => x.publish.state === "live" && x.visible),
   "everything is live by default — an untouched store is the site of today");
ok(find(r.b, "apulien").wines.length === 4 && find(r.b, "apulien").wines.includes("primitivo-15-5"),
   "Apulien defaults to the catalogue's four Puglia wines");
ok(find(r.b, "garda").wines.length === 1 && find(r.b, "garda").wines[0] === "lugana",
   "Garda holds exactly the Lugana");
ok(r.b.data.regions.every((x) => x.custom === false), "no custom assignment by default");
ok(r.b.data.unassigned.length === 0, "every catalogue wine has an origin");

console.log("\nCOPY (read-only, from the dictionary — the pages editor owns it):");
ok(r.b.data.locales.join(",") === "de,it,en,cs", "all four storefront languages are served");
ok(find(r.b, "apulien").copy.de.page.name === "Apulien" &&
   find(r.b, "apulien").copy.it.page.name === "Puglia" &&
   find(r.b, "apulien").copy.en.page.name === "Puglia",
   "region names come translated per language");
ok(find(r.b, "garda").copy.cs.page.name.includes("Lombardie") ||
   find(r.b, "garda").copy.cs.page.name.length > 0,
   "Czech carries its own name too");
ok(find(r.b, "kampanien").copy.de.home.long.includes("Falanghina"),
   "home explorer copy is the real storefront text");

console.log("\nCATALOGUE:");
ok(r.b.data.catalogue.length === 9, "nine wines offered for assignment");
ok(r.b.data.catalogue.every((w) => w.name && w.defaultRegion),
   "each carries a name and its catalogue origin");
ok(r.b.data.catalogue.some((w) => w.zone), "growing areas are read from the inventory");

console.log("\nVALIDATION:");
r = await PUT({ regions: { toskana: { publish: { state: "draft" } } } });
ok(r.s === 422, `unknown region → 422 (${r.b?.error})`);
r = await PUT({ regions: { apulien: { publish: { state: "hidden" } } } });
ok(r.s === 422, "unknown publish state → 422");
r = await PUT({ regions: { apulien: { publish: { state: "scheduled", scheduledAt: null } } } });
ok(r.s === 422, "scheduled without a date → 422 (it could never become due)");
r = await PUT({ regions: { apulien: { publish: { state: "scheduled", scheduledAt: "bald" } } } });
ok(r.s === 422, "unparseable date → 422");
r = await PUT({ regions: { apulien: { wines: ["chianti"] } } });
ok(r.s === 422, "unknown wine → 422");
r = await PUT({ regions: { apulien: { wines: ["lugana", "lugana"] } } });
ok(r.s === 422, "the same wine twice → 422");

console.log("\nPUBLISH STATE:");
r = await PUT({ regions: { kampanien: { publish: { state: "draft" } } } });
ok(r.s === 200 && find(r.b, "kampanien").visible === false,
   "draft → invisible: the origin drops off /regionen and the homepage");
ok(find(r.b, "apulien").visible === true, "the other origins are untouched");

const past = new Date(Date.now() - 60_000).toISOString();
const future = new Date(Date.now() + 86_400_000).toISOString();
r = await PUT({ regions: { garda: { publish: { state: "scheduled", scheduledAt: future } } } });
ok(r.s === 200 && find(r.b, "garda").visible === false && find(r.b, "garda").publish.effective === "draft",
   "scheduled for tomorrow → still hidden");
r = await PUT({ regions: { garda: { publish: { state: "scheduled", scheduledAt: past } } } });
ok(find(r.b, "garda").visible === true && find(r.b, "garda").publish.effective === "live",
   "a due date is live without anyone switching it");
r = await PUT({ regions: { garda: { publish: { state: "live" } } } });
ok(find(r.b, "garda").publish.scheduledAt === null,
   "leaving 'scheduled' clears the date instead of leaving a dud behind");

console.log("\nWINE ASSIGNMENT:");
r = await PUT({ regions: { apulien: { wines: ["primitivo-15-5", "rosato-puglia"] } } });
ok(r.s === 200 && find(r.b, "apulien").wines.length === 2, "assignment narrowed to two wines");
ok(find(r.b, "apulien").custom === true, "marked as a custom assignment");
ok(r.b.data.unassigned.includes("primitivo-14-5") && r.b.data.unassigned.includes("primitivo-salento"),
   "the two dropped wines are reported as belonging to no origin");
r = await PUT({ regions: { apulien: { wines: ["lugana"] } } });
ok(find(r.b, "apulien").wines[0] === "lugana",
   "a wine may be moved across origins — the catalogue key is a default, not a cage");
r = await PUT({ regions: { apulien: { wines: null } } });
ok(find(r.b, "apulien").custom === false && find(r.b, "apulien").wines.length === 4,
   "null restores the catalogue default");

console.log("\nPERSIST + RESTORE:");
r = await PUT({ regions: { kampanien: { publish: { state: "draft" } } } });
ok(r.b.data.persisted === true || r.b.data.persisted === false,
   `store reports whether it persisted (${r.b.data.persisted})`);
r = await J(B);
ok(find(r.b, "kampanien").visible === false, "state survives a fresh GET");
r = await J(`${B}?fresh=1`);
ok(find(r.b, "kampanien").visible === true, "?fresh=1 still serves the defaults");
r = await J(B, { method: "DELETE" });
ok(r.s === 200 && r.b.data.regions.every((x) => x.visible && !x.custom),
   "DELETE restores the defaults — suite leaves the store as it found it");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
