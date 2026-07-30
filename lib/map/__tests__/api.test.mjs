const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/map`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };
const J = async (u, i) => { const r = await fetch(u, i); return { s: r.status, b: await r.json().catch(() => null) }; };
const PUT = (body) => J(B, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

console.log("DEFAULTS (fresh — suite must be idempotent):");
let r = await J(`${B}?fresh=1`);
ok(r.s === 200, "GET → 200");
const d = r.b.data.config;
ok(d.regions.apulien.highlight === "#6B0F1A" && d.regions.kampanien.highlight === "#6B0F1A",
   "Salento & Kampanien default to the house dark red #6B0F1A");
ok(d.sea.visible === false, "sea overlay off by default (matches today's storefront)");
ok(d.labels.lecce.size === 9 && d.labels.napoli.size === 9 &&
   d.labels.lecce.color === d.labels.napoli.color,
   "Lecce & Napoli start balanced (9pt, same colour)");
ok(r.b.data.balance.balanced === true, "balance rides along in the envelope: balanced");

console.log("\nVALIDATION:");
r = await PUT({ regions: { toskana: { highlight: "#6B0F1A" } } });
ok(r.s === 422, `unknown region → 422 (${r.b?.error})`);
r = await PUT({ regions: { apulien: { highlight: "darkred" } } });
ok(r.s === 422, "named colour instead of hex → 422");
r = await PUT({ sea: { opacity: 2 } });
ok(r.s === 422, "sea.opacity 2 → 422");
r = await PUT({ labels: { lecce: { size: 40 } } });
ok(r.s === 422, "label size 40 → 422 (range 6–16)");
r = await PUT({ labels: { roma: { size: 9 } } });
ok(r.s === 422, "unknown city label → 422");

console.log("\nWRITE + BALANCE:");
r = await PUT({ regions: { apulien: { highlight: "#43090F" } }, sea: { visible: true, opacity: 0.4 } });
ok(r.s === 200 && r.b.data.config.regions.apulien.highlight === "#43090F",
   "Salento recoloured to deep bordeaux");
ok(r.b.data.config.regions.kampanien.highlight === "#6B0F1A",
   "partial patch left Kampanien untouched");
ok(r.b.data.config.sea.visible === true && r.b.data.config.sea.tone === "#C9E8E1",
   "sea toggled on, tone preserved by nested merge");

r = await PUT({ labels: { napoli: { size: 14 } } });
ok(r.b.data.balance.balanced === false && r.b.data.balance.sizeDelta === 5,
   `Napoli at 14pt vs Lecce 9pt → unbalanced (delta ${r.b.data.balance.sizeDelta})`);
r = await PUT({ labels: { napoli: { size: 10 } } });
ok(r.b.data.balance.balanced === true, "within 1pt → balanced again");
r = await PUT({ labels: { napoli: { color: "#6B0F1A" } } });
ok(r.b.data.balance.balanced === false && r.b.data.balance.colorMatch === false,
   "colour mismatch alone breaks balance");

console.log("\nPERSIST + RESTORE:");
r = await J(B);
ok(r.b.data.config.regions.apulien.highlight === "#43090F" && r.b.data.config.sea.visible === true,
   "config persisted across GET");
// restore defaults so the suite leaves the store as it found nothing
r = await PUT({
  regions: { apulien: { highlight: "#6B0F1A" } },
  sea: { visible: false, opacity: 0.55 },
  labels: { napoli: { size: 9, color: "#1B1B1B" } },
});
ok(r.s === 200 && r.b.data.balance.balanced === true, "suite restored default-equivalent state");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
