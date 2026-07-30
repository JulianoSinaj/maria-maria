const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/hero`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };
const J = async (u, i) => { const r = await fetch(u, i); return { s: r.status, b: await r.json().catch(() => null) }; };
const PUT = (body) => J(B, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

console.log("DEFAULTS (fresh — suite must be idempotent):");
let r = await J(`${B}?fresh=1`);
ok(r.s === 200, "GET → 200");
const d = r.b.data.config;
ok(d.image.src === "/img/home/hero-1280.webp" && d.image.focus.x === 58 && d.image.focus.y === 42,
   "default is the live terrace hero at its real 58/42 anchor");
ok(d.copy.eyebrow === "Italienische Boutique-Weine" && d.copy.titleLine2 === "Il piacere del vino.",
   "eyebrow and italic title line verbatim from the homepage");
ok(d.copy.lede.includes("Handverlesene Weine kleiner Familienweingüter"),
   "brand lede is the real homepage copy");
ok(r.b.data.images.some((i) => i.name === "hero-1280.webp") &&
   r.b.data.images.some((i) => i.name === "region-apulien.webp"),
   `${r.b.data.images.length} tracked home images enumerated (hero + landscapes)`);

console.log("\nVALIDATION:");
r = await PUT({ copy: { titleLine1: "" } });
ok(r.s === 422, "empty title → 422");
r = await PUT({ copy: { lede: "x".repeat(241) } });
ok(r.s === 422, "lede over 240 chars → 422");
r = await PUT({ image: { src: "/img/wines/lugana/front.jpg" } });
ok(r.s === 422, "image outside /img/home/ → 422");
r = await PUT({ image: { src: "/img/home/../../logo.png" } });
ok(r.s === 422, "path traversal → 422");
r = await PUT({ image: { src: "/img/home/nope.webp" } });
ok(r.s === 422, "nonexistent image → 422");
r = await PUT({ image: { focus: { x: 140 } } });
ok(r.s === 422, "focus.x 140% → 422");

console.log("\nWRITE + MERGE:");
r = await PUT({ image: { src: "/img/home/region-garda.webp", focus: { x: 30 } },
  copy: { lede: "Maria Maria steht für handverlesene italienische Boutique-Weine kleiner Familienweingüter." } });
ok(r.s === 200 && r.b.data.config.image.src === "/img/home/region-garda.webp",
   "background switched to the Garda landscape");
ok(r.b.data.config.image.focus.x === 30 && r.b.data.config.image.focus.y === 42,
   "focus.x patched, focus.y preserved by nested merge");
ok(r.b.data.config.copy.titleLine1 === "Maria Maria", "untouched copy fields preserved");

console.log("\nVEIL (gradient & shadow):");
r = await J(`${B}?fresh=1`);
const dv = r.b.data.config.veil;
ok(dv?.enabled === true && dv.tone === "ivory" && dv.opacity === 0.9 && dv.distance === 70,
   `veil defaults mirror the live hero (ivory, ${dv?.opacity} peak, ${dv?.distance}% travel)`);
r = await PUT({ veil: { tone: "neon" } });
ok(r.s === 422, "unknown veil tone → 422");
r = await PUT({ veil: { opacity: 2 } });
ok(r.s === 422, "veil.opacity 2 → 422");
r = await PUT({ veil: { softness: 10 } });
ok(r.s === 422, "veil.softness 10 → 422 (range 0.5–4)");
r = await PUT({ veil: { distance: 150 } });
ok(r.s === 422, "veil.distance 150% → 422");
r = await PUT({ veil: { tone: "espresso", opacity: 0.6, softness: 2.5 } });
ok(r.s === 200 && r.b.data.config.veil.tone === "espresso" && r.b.data.config.veil.distance === 70,
   "shadow tone + softness patched, distance preserved by merge");
r = await PUT({ veil: { enabled: false } });
ok(r.s === 200 && r.b.data.config.veil.enabled === false && r.b.data.config.veil.tone === "espresso",
   "veil removable (left block off), other veil fields kept");

console.log("\nUPLOAD:");
r = await J(`${B}/upload`, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "balkon-abend.png", dataUrl: PNG }) });
ok(r.s === 201 && /^\/api\/admin\/hero\/file\/balkon-abend(-\d+)?\.png$/.test(r.b.data.path),
   `upload → 201, ${r.b.data?.path}`);
const up = r.b.data;
const served = await fetch(`${HOST}${up.path}`);
ok(served.status === 200, `uploaded file served (${served.status})`);
r = await PUT({ image: { src: up.path } });
ok(r.s === 200, "uploaded file selectable as hero background");
r = await J(`${B}/upload`, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "../../evil.svg", dataUrl: PNG }) });
ok(r.s === 422, "svg refused → 422");
r = await J(`${B}/upload`, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "x.png", dataUrl: "data:text/html;base64,PGh0bWw+" }) });
ok(r.s === 422, "non-image dataUrl → 422");

console.log("\nPERSIST + RESTORE:");
r = await J(B);
ok(r.b.data.config.image.src === up.path, "config persisted across GET");
r = await PUT({ image: { src: "/img/home/hero-1280.webp", focus: { x: 58, y: 42 } },
  copy: { lede: "Handverlesene Weine kleiner Familienweingüter – für bewusst gewählte Genussmomente, vom Aperitivo bis zum großen Abend." },
  veil: { enabled: true, tone: "ivory", opacity: 0.9, softness: 1.5, distance: 70 } });
ok(r.s === 200 && r.b.data.config.image.src === "/img/home/hero-1280.webp" &&
   r.b.data.config.veil.tone === "ivory",
   "suite restored default-equivalent state (incl. veil)");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
