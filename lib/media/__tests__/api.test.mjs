/* Alt text, image rights and derivatives — /api/admin/media (+ the gallery
   rows that carry them). Run against a dev server: npm run test:media */
const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/media`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };
const J = async (u, i) => { const r = await fetch(u, i); return { s: r.status, b: await r.json().catch(() => null) }; };
const PUT = (body) => J(B, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const DEL = (q = "") => J(`${B}${q}`, { method: "DELETE" });

/* A 1x1 PNG — deliberately far below the 20 KB threshold, so the derivative
   pipeline reports "small" instead of building six copies of nothing. */
const PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
const TARGET = "/img/regions/apulien.webp";

await DEL();

console.log("EMPTY STATE:");
let r = await J(B);
ok(r.s === 200, "GET → 200");
ok(Object.keys(r.b.data.assets).length === 0, "nothing described yet — no rows for undescribed files");
ok(r.b.data.licenses.includes("stock") && r.b.data.altLocales.length === 4,
   "licence vocabulary and the four storefront locales come with the payload");
r = await J(`${B}?path=${encodeURIComponent(TARGET)}`);
ok(r.s === 200 && r.b.data.meta.license === "unknown" && r.b.data.meta.alt.de === "",
   "an undescribed asset reads as defaults, not as 404");
ok(r.b.data.state.described === false && r.b.data.state.rightsKnown === false,
   "and reports itself as neither described nor cleared");

console.log("\nVALIDATION:");
r = await PUT({ path: "/etc/passwd", alt: { de: "x" } });
ok(r.s === 422, "path outside the library → 422");
r = await PUT({ path: "/img/../secret.webp", alt: { de: "x" } });
ok(r.s === 422, "traversal → 422");
r = await PUT({ path: "/img/regions/nope.webp", alt: { de: "x" } });
ok(r.s === 422, "describing a file that does not exist → 422");
r = await PUT({ path: TARGET, alt: { de: "x".repeat(221) } });
ok(r.s === 422, "alt over 220 characters → 422");
r = await PUT({ path: TARGET, alt: { fr: "Bonjour" } });
ok(r.s === 422, "a locale the storefront does not speak → 422");
r = await PUT({ path: TARGET, license: "public-domain-ish" });
ok(r.s === 422, "a licence outside the vocabulary → 422");
r = await PUT({ path: TARGET, expires: "31.12.2027" });
ok(r.s === 422, "a German date → 422 (ISO only)");
r = await PUT({ path: TARGET, expires: "2027-02-30" });
ok(r.s === 422, "30 February → 422");
r = await PUT({ path: TARGET, decorative: "yes" });
ok(r.s === 422, "decorative must be a boolean → 422");

console.log("\nDESCRIBE:");
r = await PUT({
  path: TARGET,
  alt: { de: "Weinberge auf roter Erde in Apulien", en: "Vineyards on red soil in Apulia" },
  license: "licensed",
  holder: "Studio Salento",
  expires: "2020-01-01",
});
ok(r.s === 200 && r.b.data.meta.alt.de === "Weinberge auf roter Erde in Apulien",
   "alt text stored per locale");
ok(r.b.data.meta.alt.it === "" && r.b.data.state.missingLocales.join(",") === "it,cs",
   "the two languages nobody wrote are named, not guessed");
ok(r.b.data.state.described === true && r.b.data.state.rightsKnown === true,
   "described and rights cleared");
ok(r.b.data.state.expiry === "expired", "a licence that ran out in 2020 reads as expired");
ok(r.b.data.meta.updatedAt, "the save stamps updatedAt");

r = await PUT({ path: TARGET, expires: null });
ok(r.s === 200 && r.b.data.state.expiry === null, "clearing the date removes the expiry state");
r = await PUT({ path: TARGET, holder: "Studio Salento II" });
ok(r.s === 200 && r.b.data.meta.alt.de === "Weinberge auf roter Erde in Apulien",
   "a rights-only patch leaves the alt text alone");

console.log("\nDECORATIVE:");
r = await PUT({ path: "/img/stemma.png", decorative: true });
ok(r.s === 200 && r.b.data.state.described === true && r.b.data.state.missingLocales.length === 0,
   "a deliberately decorative image counts as described in every language");

console.log("\nDERIVATIVES:");
const gallery = await J(`${HOST}/api/admin/gallery?category=landscape`);
const row = gallery.b.data.assets.find((a) => a.path === TARGET);
ok(row?.meta.holder === "Studio Salento II" && row?.described === true,
   "the gallery row carries the description with it");
ok(row?.derivatives?.source === "manifest" && row.derivatives.widths.length >= 3,
   `tracked asset reports its build widths (${row?.derivatives?.widths?.join("/")})`);

r = await J(`${B}/derivatives`, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ path: TARGET }) });
ok(r.s === 409, "rebuilding a TRACKED asset is refused — that belongs to the optimise scripts");

const up = await J(`${HOST}/api/admin/gallery/upload`, { method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ category: "lifestyle", name: "derivative-probe.png", dataUrl: PNG }) });
ok(up.s === 201, `upload → 201, ${up.b.data?.path}`);
ok(up.b.data.derivatives?.skipped === "small",
   "a 1x1 png is below the threshold — reported, not silently skipped");

r = await J(`${B}/derivatives`, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ path: up.b.data.path }) });
ok(r.s === 200, "an upload can be rebuilt on demand");
r = await J(`${B}/derivatives?path=${encodeURIComponent(up.b.data.path)}`);
ok(r.s === 200 && r.b.data.derivatives?.skipped === "small", "and reports the same verdict on GET");

const after = await J(`${HOST}/api/admin/gallery?category=lifestyle`);
ok(after.b.data.assets.some((a) => a.path === up.b.data.path),
   "the upload itself is listed in its category");
ok(!after.b.data.assets.some((a) => /derivative-probe-\d+\.(webp|avif)$/.test(a.path)),
   "generated widths are folded away — one upload stays one row");

console.log("\nRESET:");
r = await DEL(`?path=${encodeURIComponent(TARGET)}`);
ok(r.s === 200, "one description dropped");
r = await J(`${B}?path=${encodeURIComponent(TARGET)}`);
ok(r.b.data.meta.alt.de === "" && r.b.data.meta.license === "unknown", "back to defaults");
await DEL();
r = await J(B);
ok(Object.keys(r.b.data.assets).length === 0, "suite restored: nothing described");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
