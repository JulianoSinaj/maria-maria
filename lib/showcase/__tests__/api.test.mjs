const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/showcase`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };
const J = async (u, i) => { const r = await fetch(u, i); return { s: r.status, b: await r.json().catch(() => null) }; };
const PUT = (body) => J(B, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

console.log("DEFAULTS (fresh — suite must be idempotent):");
let r = await J(`${B}?fresh=1`);
ok(r.s === 200, "GET → 200");
const d = r.b.data.config;
ok(d.layout.desktop.hoverExpand === true && d.layout.desktop.grow === 10.5,
   "desktop defaults mirror the storefront: hover-expand on, grow 10.5");
ok(d.layout.mobile.variant === "stack", "mobile default is today's stacked accordion");

console.log("\nSCOPE — copy moved to the pages editor:");
ok(d.regions === undefined,
   "the config carries layout only; region names and texts are no longer duplicated here");
r = await PUT({ regions: { apulien: { name: "Süditalien" } } });
ok(r.s === 422 && /pages editor/.test(r.b?.error ?? ""),
   "a patch that still sends copy is refused, not silently swallowed");

console.log("\nVALIDATION:");
r = await PUT({ layout: { desktop: { grow: 30 } } });
ok(r.s === 422, "grow 30 → 422 (range 3–14)");
r = await PUT({ layout: { desktop: { grow: 1 } } });
ok(r.s === 422, "grow 1 → 422 (below the range)");
r = await PUT({ layout: { desktop: { hoverExpand: "yes" } } });
ok(r.s === 422, "non-boolean hoverExpand → 422");
r = await PUT({ layout: { mobile: { variant: "carousel" } } });
ok(r.s === 422, "unknown mobile variant → 422");

console.log("\nWRITE + MERGE:");
r = await PUT({ layout: { desktop: { grow: 8 }, mobile: { variant: "rail" } } });
ok(r.s === 200 && r.b.data.config.layout.desktop.grow === 8, "grow updated to 8");
ok(r.b.data.config.layout.desktop.hoverExpand === true, "partial layout patch kept hoverExpand");
ok(r.b.data.config.layout.mobile.variant === "rail", "mobile switched to the horizontal rail");
r = await PUT({ layout: { desktop: { hoverExpand: false } } });
ok(r.b.data.config.layout.desktop.grow === 8 && r.b.data.config.layout.mobile.variant === "rail",
   "a desktop-only patch leaves grow and the mobile variant standing");

console.log("\nPERSIST + RESTORE:");
r = await J(B);
ok(r.b.data.config.layout.mobile.variant === "rail" && r.b.data.config.layout.desktop.hoverExpand === false,
   "config persisted across GET");
ok(r.b.data.persisted === true || r.b.data.persisted === false,
   `store reports whether the write reached the disk (${r.b.data.persisted})`);
r = await J(`${B}?fresh=1`);
ok(r.b.data.config.layout.desktop.grow === 10.5 && r.b.data.config.layout.mobile.variant === "stack",
   "?fresh=1 still serves the storefront defaults");
// restore the default-equivalent state
r = await PUT({ layout: { desktop: { hoverExpand: true, grow: 10.5 }, mobile: { variant: "stack" } } });
ok(r.s === 200 && r.b.data.config.layout.desktop.grow === 10.5 &&
   r.b.data.config.layout.mobile.variant === "stack",
   "suite restored default-equivalent state");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
