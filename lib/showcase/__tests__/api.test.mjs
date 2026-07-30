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
ok(d.regions.apulien.long.includes("Salento") && d.regions.apulien.long.includes("Primitivo"),
   "Apulien copy is the real storefront text (Salento Primitivo)");
ok(d.regions.garda.long.includes("Lugana") && d.regions.garda.name.includes("Gardasee"),
   "Gardasee copy is the real storefront text (Lugana)");
ok(d.regions.kampanien.tag === "Zwischen Vulkan und Meer", "Kampanien tag verbatim");

console.log("\nVALIDATION:");
r = await PUT({ regions: { toskana: { name: "Toskana" } } });
ok(r.s === 422, `unknown region → 422 (${r.b?.error})`);
r = await PUT({ regions: { apulien: { name: "" } } });
ok(r.s === 422, "empty title → 422");
r = await PUT({ regions: { apulien: { name: "x".repeat(41) } } });
ok(r.s === 422, "title over 40 chars → 422");
r = await PUT({ regions: { apulien: { long: "x".repeat(321) } } });
ok(r.s === 422, "territory text over 320 chars → 422");
r = await PUT({ layout: { desktop: { grow: 30 } } });
ok(r.s === 422, "grow 30 → 422 (range 3–14)");
r = await PUT({ layout: { mobile: { variant: "carousel" } } });
ok(r.s === 422, "unknown mobile variant → 422");

console.log("\nWRITE + MERGE:");
r = await PUT({
  layout: { desktop: { grow: 8 }, mobile: { variant: "rail" } },
  regions: { apulien: { name: "Süditalien", tag: "Ursprünge des Südens" } },
});
ok(r.s === 200 && r.b.data.config.layout.desktop.grow === 8, "grow updated to 8");
ok(r.b.data.config.layout.desktop.hoverExpand === true, "partial layout patch kept hoverExpand");
ok(r.b.data.config.layout.mobile.variant === "rail", "mobile switched to the horizontal rail");
ok(r.b.data.config.regions.apulien.name === "Süditalien" &&
   r.b.data.config.regions.apulien.long.includes("Salento"),
   "title renamed, untouched long text preserved by nested merge");
ok(r.b.data.config.regions.garda.name.includes("Gardasee"), "other regions untouched");

console.log("\nPERSIST + RESTORE:");
r = await J(B);
ok(r.b.data.config.regions.apulien.name === "Süditalien" && r.b.data.config.layout.mobile.variant === "rail",
   "config persisted across GET");
r = await J(`${B}?fresh=1`);
ok(r.b.data.config.regions.apulien.name === "Apulien", "?fresh=1 still serves the storefront defaults");
// restore default-equivalent state
r = await PUT({
  layout: { desktop: { grow: 10.5 }, mobile: { variant: "stack" } },
  regions: { apulien: { name: "Apulien", tag: "Das Herz des Südens" } },
});
ok(r.s === 200 && r.b.data.config.regions.apulien.name === "Apulien",
   "suite restored default-equivalent state");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
