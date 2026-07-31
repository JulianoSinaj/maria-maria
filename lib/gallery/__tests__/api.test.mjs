const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/gallery`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };
const J = async (u, i) => { const r = await fetch(u, i); return { s: r.status, b: await r.json().catch(() => null) }; };
const POST = (u, body) => J(u, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const PUT = (u, body) => J(u, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

console.log("SCAN + CLASSIFICATION:");
let r = await J(B);
ok(r.s === 200, "GET → 200");
const { assets, counts } = r.b.data;
ok(counts.all === assets.length, `${counts.all} assets scanned from disk`);
/* >= : gallery uploads from earlier runs may sit alongside the tracked marks */
ok(counts.logo >= 3, `logo tab: the 3 brand marks (+uploads) (got ${counts.logo})`);
ok(counts.landscape >= 8, `landscape: region shots + regions dir (${counts.landscape})`);
ok(counts.bottle >= 80, `bottle renders: 9 wines × packshots (${counts.bottle})`);
ok(counts.lifestyle >= 15, `lifestyle: terrace/moments/magazin (${counts.lifestyle})`);

const byPath = Object.fromEntries(assets.map((a) => [a.path, a]));
ok(byPath["/img/home/region-apulien.webp"]?.category === "landscape", "region-apulien → landscape");
ok(byPath["/img/home/hero-1280.webp"]?.category === "lifestyle", "terrace hero → lifestyle");
ok(byPath["/img/wines/primitivo-15-5/card-front.webp"]?.category === "bottle" &&
   byPath["/img/wines/primitivo-15-5/card-front.webp"]?.wine === "primitivo-15-5",
   "card packshot → bottle, tagged with its wine");
ok(byPath["/img/logo.png"]?.category === "logo" && byPath["/img/stemma.png"]?.category === "logo",
   "wordmark + stemma → logo");
ok(byPath["/img/regions/apulien.webp"]?.category === "landscape", "regions dir → landscape");
ok(byPath["/img/magazin/weinlese.jpg"]?.category === "lifestyle", "magazin → lifestyle");

r = await J(`${B}?category=logo`);
ok(r.b.data.assets.every((a) => a.category === "logo") &&
   ["logo.png", "stemma.png", "aniversario.png"].every((n) =>
     r.b.data.assets.some((a) => a.path === `/img/${n}`)) &&
   r.b.data.assets.every((a) => !a.uploaded || a.path.startsWith("/api/admin/gallery/file/logo/")),
   "?category=logo → the 3 tracked marks, extras only as logo uploads");
r = await J(`${B}?category=quatsch`);
ok(r.s === 400, "unknown category → 400");

console.log("\nUPLOAD (per category):");
r = await POST(`${B}/upload`, { category: "bundle", name: "grande-selezione-mock.png", dataUrl: PNG });
ok(r.s === 201 && r.b.data.category === "bundle" &&
   /^\/api\/admin\/gallery\/file\/bundle\/grande-selezione-mock(-\d+)?\.png$/.test(r.b.data.path),
   `bundle upload → 201, ${r.b.data?.path}`);
const bundleAsset = r.b.data;
const served = await fetch(`${HOST}${bundleAsset.path}`);
ok(served.status === 200, `uploaded file served (${served.status})`);
r = await J(`${B}?category=bundle`);
ok(r.b.data.assets.some((a) => a.path === bundleAsset.path),
   "upload appears in the 9er-Showcase tab");
r = await POST(`${B}/upload`, { category: "diorama", name: "x.png", dataUrl: PNG });
ok(r.s === 422, "unknown category → 422");
r = await POST(`${B}/upload`, { category: "logo", name: "evil.svg", dataUrl: PNG });
ok(r.s === 422, "svg refused → 422");
r = await POST(`${B}/upload`, { category: "logo", name: "../../../x.png", dataUrl: PNG });
ok(r.s === 201 && !r.b.data.path.includes(".."), `traversal name sanitised → ${r.b.data?.path}`);

console.log("\nASSIGN → HERO:");
r = await PUT(`${HOST}/api/admin/hero`, { image: { src: "/img/regions/apulien.webp" } });
ok(r.s === 200 && r.b.data.config.image.src === "/img/regions/apulien.webp",
   "landscape asset assigned as hero background");
r = await PUT(`${HOST}/api/admin/hero`, { image: { src: bundleAsset.path } });
ok(r.s === 200, "gallery upload assignable as hero background");
r = await J(`${HOST}/api/admin/hero`);
ok(r.b.data.config.image.src === bundleAsset.path,
   "hero GET reflects the assignment (no false heal)");
r = await PUT(`${HOST}/api/admin/hero`, { image: { src: "/img/regions/nope.webp" } });
ok(r.s === 422, "nonexistent library path still → 422");

console.log("\nASSIGN → WINE:");
r = await PUT(`${HOST}/api/admin/assets/lugana`, { asset: bundleAsset.path });
ok(r.s === 200 && r.b.data.config.asset === bundleAsset.path,
   "gallery upload assigned as Lugana mockup");
r = await PUT(`${HOST}/api/admin/assets/lugana`, { asset: "/img/wines/primitivo-15-5/card-front.webp" });
ok(r.s === 422, "cross-wine packshot still refused → 422 (guard intact)");
r = await PUT(`${HOST}/api/admin/assets/lugana`, { asset: "/api/admin/gallery/file/bundle/nope.png" });
ok(r.s === 422, "nonexistent gallery path → 422");

console.log("\nRESTORE:");
r = await PUT(`${HOST}/api/admin/hero`, { image: { src: "/img/home/hero-1280.webp", focus: { x: 58, y: 42 } } });
ok(r.s === 200, "hero restored to the live default");
r = await PUT(`${HOST}/api/admin/assets/lugana`, { asset: "/img/wines/lugana/card-front.webp" });
ok(r.s === 200, "Lugana mockup restored");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
