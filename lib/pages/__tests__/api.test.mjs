/* Seiten-Editor API + storefront delivery. Needs a running server:
     BASE_URL=http://localhost:3311 ADMIN_SESSION_SECRET=… node lib/pages/__tests__/api.test.mjs
   Without a secret (dev server) the backoffice is open and no cookie is sent. */
import { createSession, SESSION_COOKIE } from "../../admin/session.js";

const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/pages`;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m)); };

const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
const H = { "Content-Type": "application/json" };
if (secret) H.Cookie = `${SESSION_COOKIE}=${await createSession(secret)}`;

const J = async (u, i = {}) => { const r = await fetch(u, { ...i, headers: { ...H, ...(i.headers ?? {}) } }); return { s: r.status, b: await r.json().catch(() => null) }; };
const PUT = (body) => J(B, { method: "PUT", body: JSON.stringify(body) });
const DEL = (page, block, locale) => J(`${B}?${new URLSearchParams({ page, block, locale })}`, { method: "DELETE" });
const HTML = async (path) => { const r = await fetch(`${HOST}${path}`, { headers: { Accept: "text/html" }, redirect: "follow" }); return { s: r.status, t: await r.text() }; };
const blockOf = (body, key) => body.data.blocks.find((x) => x.key === key);

/* idempotent: clear what an earlier, aborted run may have left behind */
for (const l of ["de", "it"]) { await DEL("regionen", "intro", l); await DEL("regionen", "regions.garda", l); }

console.log("MANIFEST:");
let r = await J(B);
ok(r.s === 200, `GET manifest → ${r.s}`);
ok(r.b?.data?.pages?.map((p) => p.key).join(",") === "home,regionen,geschichte,kontakt,magazin,weine", "six pages in tab order");
ok(r.b?.data?.locales?.join(",") === "de,it,en,cs", "four storefront locales");
const home = r.b?.data?.pages?.find((p) => p.key === "home");
ok(home?.blocks.join(",") === "hero,philosophy,collection,origins,regions,shopBand,faq", "homepage blocks = top-level keys of content/*/home.js");
const geschichte = r.b?.data?.pages?.find((p) => p.key === "geschichte");
ok(geschichte?.blocks.includes("chapters.duesseldorf") && geschichte?.blocks.includes("chapters.anfang") && geschichte?.blocks.includes("stats"),
   "geschichte lists the storyData chapters and the stats");

console.log("\nPAGE READ:");
r = await J(`${B}?page=regionen&locale=it`);
ok(r.s === 200 && r.b.data.blocks.length === 8, `regionen/it → ${r.b?.data?.blocks?.length} blocks`);
const introIt = blockOf(r.b, "intro");
ok(introIt && introIt.overridden === false && introIt.value.title === introIt.seed.title && typeof introIt.seed.eyebrow === "string",
   "intro comes seeded from content/it/regionen.js");
const garda = blockOf(r.b, "regions.garda");
ok(garda?.titleFrom === "name" && typeof garda.seed.desc === "string", "regions.garda is a sub-block titled by its name");
r = await J(`${B}?page=nope&locale=de`);
ok(r.s === 404, "unknown page → 404");
r = await J(`${B}?page=home&locale=xx`);
ok(r.s === 400, "unknown locale → 400");

console.log("\nVALIDATION:");
r = await PUT({ page: "home", block: "hero", locale: "de", value: {} });
ok(r.s === 422 && /own editor/.test(r.b.error), "homepage hero is refused — it lives in Hero & Media");
r = await PUT({ page: "regionen", block: "nope", locale: "de", value: {} });
ok(r.s === 422, "unknown block → 422");
r = await PUT({ page: "regionen", block: "intro", locale: "it", value: { eyebrow: "x" } });
ok(r.s === 422 && /missing/.test(r.b.error), "missing fields → 422");
r = await PUT({ page: "regionen", block: "intro", locale: "it", value: { ...introIt.seed, extra: "x" } });
ok(r.s === 422 && /not a field/.test(r.b.error), "unknown field → 422");
r = await PUT({ page: "regionen", block: "intro", locale: "it", value: { ...introIt.seed, title: 42 } });
ok(r.s === 422 && /must be a string/.test(r.b.error), "non-string leaf → 422");
r = await J(`${B}?page=regionen&locale=de`);
const manifestDe = blockOf(r.b, "manifest");
r = await PUT({ page: "regionen", block: "manifest", locale: "de", value: { ...manifestDe.seed, pillars: manifestDe.seed.pillars.slice(0, 2) } });
ok(r.s === 422 && /keep 3 entries/.test(r.b.error), "list length change → 422");
r = await J(`${B}?page=geschichte&locale=de`);
const valerio = blockOf(r.b, "valerio");
r = await PUT({ page: "geschichte", block: "valerio", locale: "de", value: { ...valerio.seed, href: "/shop" } });
ok(r.s === 422 && /structural/.test(r.b.error), "href is structure → 422");

console.log("\nWRITE:");
const markIt = `MMTEST-IT-${Date.now()}`;
r = await PUT({ page: "regionen", block: "intro", locale: "it", value: { ...introIt.seed, eyebrow: markIt } });
ok(r.s === 200 && r.b.data.block.overridden === true && r.b.data.block.value.eyebrow === markIt, "IT intro saved → overridden");
ok(r.b.data.block.locales.join(",") === "it" && r.b.data.overrides?.regionen?.intro?.join(",") === "it", "override summary lists regionen.intro in IT only");
r = await J(`${B}?page=regionen&locale=it`);
ok(blockOf(r.b, "intro").value.eyebrow === markIt && blockOf(r.b, "intro").seed.eyebrow === introIt.seed.eyebrow, "read back: value overridden, seed untouched");
r = await J(`${B}?page=regionen&locale=de`);
ok(blockOf(r.b, "intro").overridden === false && blockOf(r.b, "intro").locales.join(",") === "it", "DE intro still the code, but knows IT changed");
r = await PUT({ page: "regionen", block: "intro", locale: "it", value: introIt.seed });
ok(r.s === 200 && r.b.data.block.overridden === false, "saving the code text back clears the override");
r = await PUT({ page: "regionen", block: "intro", locale: "it", value: { ...introIt.seed, eyebrow: markIt } });
ok(r.s === 200, "re-applied IT marker");
const markDe = `MMTEST-DE-${Date.now()}`;
r = await J(`${B}?page=regionen&locale=de`);
const gardaDe = blockOf(r.b, "regions.garda");
r = await PUT({ page: "regionen", block: "regions.garda", locale: "de", value: { ...gardaDe.seed, tag: markDe } });
ok(r.s === 200 && r.b.data.block.value.tag === markDe, "DE sub-block regions.garda saved");

console.log("\nSTOREFRONT DELIVERY (dictionary merge + revalidation):");
let page = await HTML("/it/regionen");
ok(page.s === 200 && page.t.includes(markIt), `/it/regionen carries the IT marker (${page.s})`);
page = await HTML("/regionen");
ok(page.s === 200 && !page.t.includes(markIt) && page.t.includes(markDe), `/regionen carries the DE marker and not the IT one (${page.s})`);
page = await HTML("/en/regionen");
ok(page.s === 200 && !page.t.includes(markIt) && !page.t.includes(markDe), "/en/regionen unaffected");

console.log("\nRESET:");
r = await DEL("regionen", "intro", "it");
ok(r.s === 200 && r.b.data.block.overridden === false && r.b.data.block.value.eyebrow === introIt.seed.eyebrow, "DELETE → back to the code");
r = await DEL("regionen", "regions.garda", "de");
ok(r.s === 200 && r.b.data.block.overridden === false, "DELETE sub-block → back to the code");
ok(!r.b.data.overrides?.regionen, "override summary is empty again");
page = await HTML("/it/regionen");
ok(page.s === 200 && !page.t.includes(markIt), "/it/regionen back to the code text");
r = await DEL("regionen", "nope", "de");
ok(r.s === 422, "DELETE unknown block → 422");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
