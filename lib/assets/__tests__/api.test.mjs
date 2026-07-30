const B = `${process.env.BASE_URL ?? "http://localhost:3000"}/api/admin/assets`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };
const J = async (u, i) => { const r = await fetch(u, i); return { s: r.status, b: await r.json().catch(() => null) }; };
const PUT = (slug, body) => J(`${B}/${slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

// 1×1 transparent PNG
const PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

console.log("READ:");
let r = await J(`${B}/primitivo-15-5?fresh=1`); // fresh: suite must be idempotent
ok(r.s === 200, `GET → 200`);
ok(r.b.data.assets.length >= 8, `${r.b.data.assets.length} real assets enumerated from disk`);
ok(r.b.data.config.asset === "/img/wines/primitivo-15-5/card-front.webp",
   `default lead asset is the card packshot (${r.b.data.config.asset})`);
ok(r.b.data.config.mode === "single" && r.b.data.config.opener.x === 78,
   `defaults: mode=${r.b.data.config.mode}, opener at ${r.b.data.config.opener.x}/${r.b.data.config.opener.y}`);
r = await J(`${B}/kein-wein`);
ok(r.s === 404, "unknown slug → 404");
r = await J(`${B}/..%2F..%2Fetc`);
ok(r.s === 400 || r.s === 404, `traversal slug → ${r.s}`);

console.log("\nVALIDATION:");
r = await PUT("primitivo-15-5", { mode: "diorama" });
ok(r.s === 422, `unknown mode → 422 (${r.b?.error})`);
r = await PUT("primitivo-15-5", { asset: "/img/wines/lugana/card-front.webp" });
ok(r.s === 422, "asset from ANOTHER wine's dir → 422");
r = await PUT("primitivo-15-5", { asset: "/img/wines/primitivo-15-5/../../../logo.png" });
ok(r.s === 422, "path traversal in asset → 422");
r = await PUT("primitivo-15-5", { asset: "/img/wines/primitivo-15-5/nope.webp" });
ok(r.s === 422, "nonexistent file → 422");
r = await PUT("primitivo-15-5", { opener: { x: 140 } });
ok(r.s === 422, "opener.x 140% → 422");
r = await PUT("primitivo-15-5", { accent: { opacity: 3 } });
ok(r.s === 422, "accent.opacity 3 → 422");

console.log("\nWRITE + PERSIST:");
r = await PUT("primitivo-15-5", { mode: "bundle", accent: { opacity: 0.6 }, opener: { x: 20.5, y: 81 } });
ok(r.s === 200 && r.b.data.config.mode === "bundle", "valid PUT → 200");
ok(r.b.data.config.accent.opacity === 0.6 && r.b.data.config.accent.enabled === true,
   "nested merge kept accent.enabled while changing opacity");
r = await J(`${B}/primitivo-15-5`);
ok(r.b.data.config.opener.x === 20.5 && r.b.data.config.mode === "bundle", "config persisted across GET");
r = await J(`${B}/primitivo-15-5?fresh=1`);
ok(r.b.data.config.mode === "single" && r.b.data.config.opener.x === 78,
   "?fresh=1 returns defaults without touching stored");
r = await J(`${B}/primitivo-15-5`);
ok(r.b.data.config.mode === "bundle", "stored config untouched by fresh read");

console.log("\nUPLOAD:");
r = await J(`${B}/lugana/upload`, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "studio-neu.png", dataUrl: PNG }) });
ok(r.s === 201 && /^\/api\/admin\/assets\/lugana\/file\/studio-neu(-\d+)?\.png$/.test(r.b.data.path),
   `upload → 201, ${r.b.data?.path}`);
const uploadedName = r.b.data.name;
const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const served = await fetch(`${HOST}${r.b.data.path}`);
ok(served.status === 200, `uploaded file is served (${served.status})`);
r = await J(`${B}/lugana`);
ok(r.b.data.assets.some(a => a.name === uploadedName && a.uploaded),
   "upload appears in the asset list, flagged as uploaded");

r = await J(`${B}/lugana/upload`, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "../../../evil.png", dataUrl: PNG }) });
ok(r.s === 201 && !r.b.data.path.includes(".."), `traversal filename sanitised → ${r.b.data?.path}`);
r = await J(`${B}/lugana/upload`, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "script.svg", dataUrl: PNG }) });
ok(r.s === 422, "svg extension refused (XSS vector) → 422");
r = await J(`${B}/lugana/upload`, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "x.png", dataUrl: "data:text/html;base64,PGh0bWw+" }) });
ok(r.s === 422, "non-image dataUrl → 422");

// duplicate name → counter suffix, no overwrite
r = await J(`${B}/lugana/upload`, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "studio-neu.png", dataUrl: PNG }) });
ok(r.s === 201 && /studio-neu-\d+\.png$/.test(r.b.data.path),
   `same name again → suffixed, no overwrite (${r.b.data?.path})`);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
