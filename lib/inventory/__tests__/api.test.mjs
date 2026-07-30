const B = `${process.env.BASE_URL ?? "http://localhost:3000"}/api/admin/inventory`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };
const J = async (u, i) => { const r = await fetch(u, i); return { s: r.status, b: await r.json().catch(() => null) }; };

console.log("READ:");
let r = await J(B);
ok(r.s === 200, `GET list → 200 (${r.b?.data?.length} items, meta.count ${r.b?.meta?.count})`);
ok(r.b.data.length === 9, "9 seeded wines");
ok(r.b.data.every(i => i.name && i.vintage && i.appellation?.tier && i.aging?.vessel && i.label?.wordmark && i.pairings?.length && i.tastingNotes?.length),
   "every item carries all required schema fields");

// derived fields resolved on read
const amph = r.b.data.find(i => i.aging.vessel === "amphora");
ok(amph?.name === "Primitivo 15,5", `amphora wine is ${amph?.name}`);
ok(amph.remaining === 2740 && Math.abs(amph.remainingShare - 2740/12000) < 1e-9,
   `derived remaining=${amph.remaining} share=${(amph.remainingShare*100).toFixed(1)}%`);
ok(amph.status === "low", `status derived as "low" (<=25% left), not the stored "active"`);
const open = r.b.data.find(i => i.batch.size === null);
ok(open.remaining === null && open.status === "active",
   `open-production wine (${open.name}) has remaining=null, no fake denominator`);

console.log("\nFILTERS:");
for (const [q, expect, label] of [
  ["?aging=oak", 1, "aging=oak → Il Rosso only"],
  ["?aging=steel", 7, "aging=steel → 7"],
  ["?style=white", 4, "style=white → 4"],
  ["?region=Kampanien", 3, "region=Kampanien → 3"],
  ["?pairing=aperitif", 5, "pairing=aperitif → 5 (4 whites + rosato)"],
  ["?redAccent=true", 4, "redAccent=true → 4 red labels"],
  ["?limitedOnly=true", 2, "limitedOnly=true → 2 published editions"],
  ["?search=manduria", 2, "search=manduria → 2"],
]) {
  const x = await J(B + q);
  ok(x.b.data.length === expect, `${label} (got ${x.b.data.length})`);
}
r = await J(B + "?sort=price");
ok(r.b.data[0].price <= r.b.data.at(-1).price, `sort=price ascending (${r.b.data[0].price} … ${r.b.data.at(-1).price})`);

console.log("\nSTATS / FACETS:");
r = await J(B + "?view=stats");
const st = r.b.data;
ok(st.total === 9, `stats.total 9`);
ok(st.allocation.batch === 30000 && st.allocation.remaining === 9260,
   `allocation batch ${st.allocation.batch} remaining ${st.allocation.remaining}`);
ok(st.allocation.committed + st.allocation.remaining === st.allocation.batch, "allocation reconciles");
ok(st.labels.redAccent === 4 && st.labels.whiteWordmark === 8,
   `labels: ${st.labels.redAccent} red accent, ${st.labels.whiteWordmark} white wordmark (Rosato excluded)`);
ok(JSON.stringify(st.byAging) === JSON.stringify({steel:7,amphora:1,oak:1}), `byAging ${JSON.stringify(st.byAging)}`);
r = await J(B + "?view=facets");
ok(r.b.data.regions.length === 4, `facets.regions ${JSON.stringify(r.b.data.regions)}`);

console.log("\nVALIDATION (must reject):");
const bad = [
  [{ slug: "x", name: "X" }, "missing most fields"],
  [{ slug: "y", name: "Y", vintage: 99, price: 5, style: "red", status: "active",
     appellation:{name:"A",tier:"DOP",region:"R"}, aging:{vessel:"steel",months:1},
     batch:{size:100,committed:0}, pairings:["meat"], tastingNotes:["a"],
     label:{wordmark:"banded-white-on-black",accent:"red",redAccent:true} }, "2-digit vintage"],
  [{ slug: "z", name: "Z", vintage: 2020, price: 5, style: "purple", status: "active",
     appellation:{name:"A",tier:"DOP",region:"R"}, aging:{vessel:"steel",months:1},
     batch:{size:100,committed:0}, pairings:["meat"], tastingNotes:["a"],
     label:{wordmark:"banded-white-on-black",accent:"red",redAccent:true} }, "unknown style"],
  [{ slug: "w", name: "W", vintage: 2020, price: 5, style: "red", status: "active",
     appellation:{name:"A",tier:"DOP",region:"R"}, aging:{vessel:"concrete",months:1},
     batch:{size:100,committed:0}, pairings:["meat"], tastingNotes:["a"],
     label:{wordmark:"banded-white-on-black",accent:"red",redAccent:true} }, "unknown aging vessel"],
  [{ slug: "v", name: "V", vintage: 2020, price: 5, style: "red", status: "active",
     appellation:{name:"A",tier:"DOP",region:"R"}, aging:{vessel:"steel",months:1},
     batch:{size:100,committed:500}, pairings:["meat"], tastingNotes:["a"],
     label:{wordmark:"banded-white-on-black",accent:"red",redAccent:true} }, "committed > batch size"],
  [{ slug: "u", name: "U", vintage: 2020, price: 5, style: "red", status: "active",
     appellation:{name:"A",tier:"DOP",region:"R"}, aging:{vessel:"steel",months:1},
     batch:{size:100,committed:0}, pairings:["dessert"], tastingNotes:["a"],
     label:{wordmark:"banded-white-on-black",accent:"red",redAccent:true} }, "unknown pairing"],
  [{ slug: "t", name: "T", vintage: 2020, price: 5, style: "red", status: "active",
     appellation:{name:"A",tier:"DOP",region:"R"}, aging:{vessel:"steel",months:1},
     batch:{size:100,committed:0}, pairings:["meat"], tastingNotes:["a"],
     label:{wordmark:"banded-white-on-black",accent:"acqua",redAccent:true} }, "redAccent disagrees with accent"],
];
for (const [body, label] of bad) {
  const x = await J(B, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
  ok(x.s === 422, `${label} → 422 (${x.b?.details?.[0] ?? x.b?.error ?? "?"})`);
}

console.log("\nWRITE PATH:");
const valid = { slug:"test-nuovo", name:"Test Nuovo", fullName:"Test Nuovo IGP", vintage:2024,
  appellation:{name:"Test IGP",tier:"IGP",region:"Apulien",zone:"Test"}, style:"red",
  aging:{vessel:"oak",months:8,detail:"8 Monate Eiche"}, batch:{size:1000,committed:0},
  price:19.9, abv:14, pairings:["meat","rich"], pairingNotes:"Test.", tastingNotes:["test"],
  label:{wordmark:"banded-white-on-black",accent:"red",redAccent:true}, status:"active" };
r = await J(B, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(valid) });
ok(r.s === 201 && r.b.data.id === "inv-test-nuovo", `POST valid → 201, id ${r.b.data?.id}`);
r = await J(B, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(valid) });
ok(r.s === 409, "POST duplicate slug → 409 CONFLICT");

r = await J(`${B}/inv-test-nuovo`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ price: 21.5 }) });
ok(r.s === 200 && r.b.data.price === 21.5 && r.b.data.batch.size === 1000,
   "PATCH price → 200, nested batch preserved (shallow merge works)");

r = await J(`${B}/inv-test-nuovo`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ label:{accent:"acqua"} }) });
ok(r.s === 200 && r.b.data.label.redAccent === false,
   "PATCH accent→acqua auto-syncs redAccent to false");

r = await J(`${B}/inv-test-nuovo`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ commit: 800 }) });
ok(r.s === 200 && r.b.data.remaining === 200 && r.b.data.status === "low",
   `commit 800 → remaining ${r.b.data?.remaining}, status ${r.b.data?.status}`);
r = await J(`${B}/inv-test-nuovo`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ commit: 500 }) });
ok(r.s === 409, `oversell 500 of 200 → 409 (${r.b?.error})`);
r = await J(`${B}/inv-test-nuovo`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ commit: 200 }) });
ok(r.s === 200 && r.b.data.status === "sold-out", `commit to zero → status ${r.b.data?.status}`);

r = await J(`${B}/inv-test-nuovo`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id:"hacked", slug:"hacked" }) });
ok(r.s === 200 && r.b.data.id === "inv-test-nuovo" && r.b.data.slug === "test-nuovo",
   "PATCH cannot re-key identity (id/slug immutable)");

r = await J(`${B}/inv-test-nuovo`, { method:"DELETE" });
ok(r.s === 204, "DELETE → 204");
r = await J(`${B}/inv-test-nuovo`);
ok(r.s === 404, "GET deleted → 404");
r = await J(`${B}/nope`, { method:"DELETE" });
ok(r.s === 404, "DELETE unknown → 404");

r = await J(B);
ok(r.b.data.length === 9, "store back to 9 items — seed uncorrupted");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
