/* Video loops and poster frames — /api/admin/video.
   Run against a dev server: npm run test:video
   Restores every slot it touched; the uploaded fixture is left behind on
   purpose (it is a valid tiny mp4 and the next run suffixes its own). */
const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/video`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };
const J = async (u, i) => { const r = await fetch(u, i); return { s: r.status, b: await r.json().catch(() => null) }; };
const PUT = (body) => J(B, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const DEL = (q = "") => J(`${B}${q}`, { method: "DELETE" });

/* The smallest thing that is honestly an MP4: an ftyp box at offset 4, which
   is what the upload route checks before it writes anything. */
const mp4 = () => {
  const box = Buffer.from([0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d,
    0, 0, 2, 0, 0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32]);
  return Buffer.concat([box, Buffer.alloc(64)]);
};
const upload = async (name, body, type = "video/mp4") =>
  J(`${B}/upload`, { method: "POST", headers: { "Content-Type": type, "X-Upload-Name": name }, body });

await DEL();

console.log("SLOTS (what the storefront plays today):");
let r = await J(B);
ok(r.s === 200, "GET → 200");
const slots = Object.fromEntries(r.b.data.slots.map((s) => [s.key, s]));
ok(r.b.data.slots.length === 3, "three loops: the region panorama and the two pours");
ok(slots.regionen.config.src === "/video/regionen-hero-720.mp4" &&
   slots.regionen.config.poster === "/img/regions/regionen-hero-poster.webp",
   "region hero carries both halves — file and poster frame");
ok(slots.regionen.config.rate === 0.75, "region panorama runs at 0.75x, as RegionHeroVideo sets it");
ok(slots["pour-red"].config.rate === 0.55 && slots["pour-white"].config.rate === 0.55,
   "the pours run at POUR_RATE 0.55 from ColorBand");
ok(slots["pour-red"].usedBy.length + slots["pour-white"].usedBy.length === 9,
   "the two pours together carry all nine wine pages");
ok(r.b.data.slots.every((s) => !s.missing.video && !s.missing.poster),
   "every default file and poster exists on disk");
ok(r.b.data.videos.some((v) => v.path === "/video/wine-red-720.mp4"),
   `${r.b.data.videos.length} choosable video files enumerated`);

console.log("\nVALIDATION:");
r = await PUT({ key: "nope", rate: 1 });
ok(r.s === 404, "unknown slot → 404");
r = await PUT({ key: "regionen", src: "/img/home/hero-1280.webp" });
ok(r.s === 422, "an image as the video source → 422");
r = await PUT({ key: "regionen", src: "/video/../secret.mp4" });
ok(r.s === 422, "traversal → 422");
r = await PUT({ key: "regionen", src: "/video/nope.mp4" });
ok(r.s === 422, "nonexistent video → 422");
r = await PUT({ key: "regionen", poster: "/video/regionen-hero-720.mp4" });
ok(r.s === 422, "a video as the poster frame → 422");
r = await PUT({ key: "regionen", poster: "/img/nope.webp" });
ok(r.s === 422, "nonexistent poster → 422");
r = await PUT({ key: "regionen", rate: 4 });
ok(r.s === 422, "rate 4x → 422 (range 0.25–1.5)");
r = await PUT({ key: "regionen", focus: { y: -5 } });
ok(r.s === 422, "focus −5% → 422");

console.log("\nWRITE + MERGE:");
r = await PUT({ key: "regionen", rate: 1 });
ok(r.s === 200 && r.b.data.config.rate === 1 &&
   r.b.data.config.poster === "/img/regions/regionen-hero-poster.webp",
   "rate patched, poster preserved by the merge");
r = await PUT({ key: "regionen", poster: "/img/regions/apulien.webp", focus: { x: 30 } });
ok(r.s === 200 && r.b.data.config.poster === "/img/regions/apulien.webp" &&
   r.b.data.config.focus.x === 30 && r.b.data.config.focus.y === 50,
   "poster swapped and focus.x moved, focus.y kept");

console.log("\nUPLOAD:");
r = await upload("panorama-test.mp4", mp4());
ok(r.s === 201 && /^\/api\/admin\/video\/file\/panorama-test(-\d+)?\.mp4$/.test(r.b.data?.path),
   `upload → 201, ${r.b.data?.path}`);
const up = r.b.data;
let served = await fetch(`${HOST}${up.path}`);
ok(served.status === 200 && served.headers.get("content-type") === "video/mp4",
   `uploaded file served as video/mp4 (${served.status})`);
ok(served.headers.get("accept-ranges") === "bytes", "the file route advertises range support");
served = await fetch(`${HOST}${up.path}`, { headers: { Range: "bytes=0-7" } });
ok(served.status === 206 && served.headers.get("content-length") === "8",
   "a range request gets 206 and exactly the bytes it asked for — Safari needs this");
r = await PUT({ key: "regionen", src: up.path });
ok(r.s === 200, "an uploaded loop is selectable");
r = await upload("evil.svg", mp4());
ok(r.s === 422, "svg refused → 422");
r = await upload("notreally.mp4", Buffer.from("<html>not a video</html>"));
ok(r.s === 422, "a file that is not an mp4 inside → 422 (signature is checked)");
r = await upload("empty.mp4", Buffer.alloc(0));
ok(r.s === 422, "empty body → 422");

console.log("\nPERSIST + RESET:");
r = await J(B);
ok(r.b.data.slots.find((s) => s.key === "regionen").config.src === up.path,
   "the assignment survives a fresh GET");
r = await J(`${B}?fresh=1`);
ok(r.b.data.slots.find((s) => s.key === "regionen").config.src === "/video/regionen-hero-720.mp4",
   "?fresh=1 reports what the storefront ships");
r = await DEL("?key=regionen");
ok(r.s === 200 && r.b.data.config.rate === 0.75, "DELETE restores one slot");
r = await DEL("?key=nope");
ok(r.s === 404, "DELETE on an unknown slot → 404");

await DEL();
r = await J(B);
ok(r.b.data.slots.every((s) => s.config.src.startsWith("/video/")),
   "suite restored: all three slots back on the tracked files");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
