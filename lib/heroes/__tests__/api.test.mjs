/* Hero stages of the subpages — /api/admin/heroes.
   Run against a dev server: npm run test:heroes  (BASE_URL to point elsewhere)
   The suite restores every slot it touched, so it can run twice in a row. */
const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/heroes`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };
const J = async (u, i) => { const r = await fetch(u, i); return { s: r.status, b: await r.json().catch(() => null) }; };
const PUT = (body) => J(B, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const DEL = (q = "") => J(`${B}${q}`, { method: "DELETE" });

await DEL();

console.log("CATALOGUE (the live storefront, slot by slot):");
let r = await J(B);
ok(r.s === 200, "GET → 200");
const pages = r.b.data.pages;
const by = Object.fromEntries(pages.map((p) => [p.key, p]));

ok(pages.length === 14, `${pages.length} stages: 5 pages + 9 wine landing pages`);
ok(r.b.data.altLocales.join(",") === "de,it,en,cs", "alt text spans the four storefront locales");
ok(by.weine?.config.image.src === "/img/weine/hero-1600.webp" &&
   by.weine?.config.image.focus.y === 68,
   "collection hero: the file that ships, anchored at its real 50/68");
ok(by.kontakt?.config.image.focus.x === 75, "contact hero keeps its 75% anchor");
ok(by.geschichte?.ratio === "4 / 3" && by.magazin?.ratio === "875 / 823",
   "the two figure stages carry their own crop, not a convenient 16:9");
ok(by["wein-lugana"]?.config.image.src === "/img/food-pairing/lugana-1280.webp",
   "wine pages lead with their food-pairing motif");
ok(pages.every((p) => !p.missing), "every default motif exists on disk");

console.log("\nLIVE ALT TEXT (read from content/<locale>, not copied):");
ok(by.weine.live.alt.de.includes("Steinmauer") && by.weine.live.alt.it && by.weine.live.alt.cs,
   "collection hero reports its editorial alt text in all four languages");
ok(by.magazin.live.alt.de.includes("Cantina"), "magazine cover alt comes from magazin.cover.photoAlt");
ok(by["wein-lugana"].altKind === "generated" &&
   by["wein-lugana"].live.alt.de === by["wein-lugana"].live.alt.it,
   "wine alt is assembled in the component — same German sentence on every locale");

console.log("\nVALIDATION:");
r = await PUT({ key: "nope", alt: { de: "x" } });
ok(r.s === 404, "unknown slot → 404");
r = await PUT({ key: "weine", image: { src: "/etc/passwd" } });
ok(r.s === 422, "path outside the library → 422");
r = await PUT({ key: "weine", image: { src: "/img/weine/../../secret.webp" } });
ok(r.s === 422, "traversal → 422");
r = await PUT({ key: "weine", image: { src: "/img/weine/does-not-exist.webp" } });
ok(r.s === 422, "nonexistent file → 422");
r = await PUT({ key: "weine", image: { focus: { x: 140 } } });
ok(r.s === 422, "focus 140% → 422");
r = await PUT({ key: "weine", alt: { de: "x".repeat(221) } });
ok(r.s === 422, "alt over 220 characters → 422");
r = await PUT({ key: "weine", alt: { fr: "Bonjour" } });
ok(r.s === 422, "a locale the storefront does not speak → 422");
r = await PUT({ key: "home", image: { src: "/img/home/hero-mare-1280.webp" } });
ok(r.s === 422, "the homepage motif stays owned by the hero editor → 422");

console.log("\nWRITE + MERGE:");
r = await PUT({ key: "kontakt", image: { focus: { x: 40 } } });
ok(r.s === 200 && r.b.data.config.image.focus.x === 40 && r.b.data.config.image.focus.y === 50,
   "focus.x patched, focus.y preserved by the nested merge");
ok(r.b.data.config.image.src === "/img/kontakt/kontakt-hero-375ml-1600.webp",
   "the motif is untouched by a focus-only patch");
r = await PUT({ key: "kontakt", alt: { de: "Zwei Flaschen auf gedecktem Tisch" } });
ok(r.s === 200 && r.b.data.config.alt.de === "Zwei Flaschen auf gedecktem Tisch" &&
   r.b.data.config.alt.it === null,
   "German override stored, the other three still fall through to the page");
r = await PUT({ key: "kontakt", image: { src: "/img/regions/apulien.webp" } });
ok(r.s === 200, "any library asset is a legal motif");
r = await PUT({ key: "home", alt: { de: "Nur der Alternativtext" } });
ok(r.s === 200 && r.b.data.config.alt.de === "Nur der Alternativtext",
   "the homepage still accepts its alt text");

console.log("\nPERSIST + HEAL + RESET:");
r = await J(B);
const kontakt = r.b.data.pages.find((p) => p.key === "kontakt");
ok(kontakt.config.alt.de === "Zwei Flaschen auf gedecktem Tisch" &&
   kontakt.config.image.focus.x === 40,
   "edits survive a fresh GET");
ok(kontakt.live.alt.de && kontakt.live.alt.de !== kontakt.config.alt.de,
   "the live text is still reported beside the override");
r = await J(`${B}?fresh=1`);
const fresh = r.b.data.pages.find((p) => p.key === "kontakt");
ok(fresh.config.image.focus.x === 75 && fresh.config.alt.de === null,
   "?fresh=1 shows what the storefront ships, ignoring stored edits");
r = await PUT({ key: "kontakt", alt: { de: null } });
ok(r.s === 200 && r.b.data.config.alt.de === null, "null clears an override");
r = await DEL("?key=kontakt");
ok(r.s === 200 && r.b.data.config.image.focus.x === 75,
   "DELETE hands one slot back to the live values");
r = await DEL("?key=nope");
ok(r.s === 404, "DELETE on an unknown slot → 404");

await DEL();
r = await J(B);
ok(r.b.data.pages.every((p) => p.config.alt.de === null),
   "suite restored: nothing overridden");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
