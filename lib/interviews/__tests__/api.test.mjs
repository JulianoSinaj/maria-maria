/* Interview API — end-to-end against a running server.
   Run: node lib/interviews/__tests__/api.test.mjs  (npm run test:interviews)

   Idempotent: everything the suite creates it deletes again at the end. It
   creates its own throwaway slug rather than touching the two code-shipped
   pieces, so a failed run never leaves the live magazine in a broken state.

   Covers: create → validation gate on publish → publish → the storefront-
   shaped merge (mergeInterviews via the registry) → revalidation trigger →
   image-path guarding → unpublish → delete → the code-item override path
   (import, edit, revert by deleting the override). */

const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/interviews`;
/* The backoffice has signed in via a cookie session since September 2026
   (lib/admin/session.js) — Basic auth was retired with it. In development
   the guard lets every request through regardless (middleware.js), so a
   local server needs no cookie at all; a production-mode verification
   server needs SESSION_TOKEN set to a token minted for its
   ADMIN_SESSION_SECRET/ADMIN_PASSWORD. */
const AUTH = process.env.SESSION_TOKEN ? { Cookie: `mm_admin=${process.env.SESSION_TOKEN}` } : {};

let pass = 0;
let fail = 0;
const ok = (c, m) => {
  if (c) {
    pass += 1;
    console.log("  ✓ " + m);
  } else {
    fail += 1;
    console.log("  ✗ FAIL: " + m);
  }
};

const J = async (url, init) => {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...AUTH, ...init?.headers },
  });
  return { s: res.status, b: await res.json().catch(() => null) };
};
const GET = (url) => J(url);
const POST = (url, body) => J(url, { method: "POST", body: JSON.stringify(body) });
const PUT = (url, body) => J(url, { method: "PUT", body: JSON.stringify(body) });
const DEL = (url) => J(url, { method: "DELETE" });

const SLUG = `test-interview-${Date.now()}`;
const CODE_SLUG = "daniele-malavasi-lugana-doc";

async function cleanup() {
  await DEL(`${B}/${SLUG}`);
  /* revert any override the code-item edit test left behind */
  await DEL(`${B}/${CODE_SLUG}`);
}

async function main() {
  console.log("OPTIONS:");
  let r = await GET(`${B}?view=options`);
  ok(r.s === 200, "GET ?view=options → 200");
  ok(Array.isArray(r.b?.data?.wineSlugs) && r.b.data.wineSlugs.includes("lugana"), "wine slugs include the catalogue");
  ok(Array.isArray(r.b?.data?.images), "image library returned");
  const wineSlugs = r.b.data.wineSlugs;

  console.log("\nCREATE:");
  r = await POST(B, { slug: SLUG, locales: { de: { name: "Test Person", headline: "Ein Titel" } } });
  ok(r.s === 201, `POST → 201 (${r.s})`);
  ok(r.b?.data?.status === "draft", "created as draft");
  ok(r.b?.data?.locales?.de?.name === "Test Person", "German name saved");
  ok(r.b?.data?.locales?.it === null, "no Italian block until one is written");

  r = await POST(B, { slug: SLUG, locales: { de: { name: "Dup" } } });
  ok(r.s === 409, `duplicate slug → 409 (${r.s})`);

  r = await POST(B, { slug: "Not A Slug!", locales: { de: { name: "x" } } });
  ok(r.s === 422, `malformed slug → 422 (${r.s})`);

  console.log("\nREAD:");
  r = await GET(`${B}/${SLUG}`);
  ok(r.s === 200, "GET one → 200");
  ok(r.b?.meta?.source === "store", 'a fresh piece reports source "store"');
  ok(r.b?.meta?.completeness?.de === "partial", "German is partial (no chapters yet)");

  r = await GET(`${B}/does-not-exist`);
  ok(r.s === 404, "unknown slug → 404");

  console.log("\nPUBLISH GATE:");
  r = await POST(`${B}/${SLUG}/publish`, { action: "publish" });
  ok(r.s === 422, `publishing an incomplete draft is refused (${r.s})`);
  ok(Array.isArray(r.b?.details) && r.b.details.length > 0, "the refusal names what is missing");

  console.log("\nUPDATE with an out-of-library image:");
  r = await PUT(`${B}/${SLUG}`, {
    locales: {
      de: {
        name: "Test Person",
        headline: "Ein Titel ohne Namen",
        eyebrow: "Testrubrik",
        deck: "Ein Vorspann für den Test.",
        portraitAlt: "Testbild",
        intro: ["Ein Absatz."],
        sections: [{ heading: "Kapitel eins", paragraphs: ["Text."] }],
        teaserMagazin: { title: "Titel", teaser: "Anmoderation", cta: "Lesen" },
        profile: { name: "Test Person" },
      },
    },
    portrait: { src: "/img/does-not-exist-on-disk.jpg" },
  });
  ok(r.s === 422, `image path that does not exist on disk → 422 (${r.s})`);

  console.log("\nCOMPLETE UPDATE + PUBLISH:");
  r = await PUT(`${B}/${SLUG}`, {
    wine: { slug: "lugana" },
    locales: {
      de: {
        name: "Test Person",
        headline: "Ein Titel ohne Namen",
        eyebrow: "Testrubrik",
        deck: "Ein Vorspann für den Test.",
        portraitAlt: "Testbild",
        intro: ["Ein Absatz vor dem ersten Kapitel."],
        sections: [
          { heading: "Kapitel eins", paragraphs: ["Ein Absatz.", "Noch einer."] },
          { heading: "Pairing", paragraphs: ["Text."] } /* must not collide with the "pairing" anchor id */,
        ],
        teaserMagazin: { title: "Titel", teaser: "Anmoderation", cta: "Lesen" },
        profile: { name: "Test Person", role: "Testrolle" },
      },
    },
    portrait: { src: "/img/magazin/daniele-solo.jpeg" },
  });
  ok(r.s === 200, `PUT with real fields → 200 (${r.s})`);
  ok(
    r.b?.data?.locales?.de?.sections?.[1]?.id === "pairing-2",
    `a section literally titled "Pairing" gets a disambiguated id, not the reserved anchor (${r.b?.data?.locales?.de?.sections?.[1]?.id})`,
  );
  ok(r.b?.meta?.completeness?.de === "complete", "German now reports complete");

  r = await POST(`${B}/${SLUG}/publish`, { action: "publish" });
  ok(r.s === 200, `publish now succeeds → 200 (${r.s})`);
  ok(r.b?.data?.status === "published", "status is published");
  ok(/^\d{4}-\d{2}-\d{2}$/.test(r.b?.data?.publishedAt ?? ""), "a publish date was stamped");
  ok("og" in (r.b?.meta ?? {}), "publish reports the share-image outcome");
  ok(r.b?.meta?.revalidated === true, "publish reports the pages were revalidated");

  console.log("\nLIVE WITHOUT A REBUILD:");
  /* Regression guard for a real bug found on 2026-09-05: the article route
     used to ship generateStaticParams + dynamicParams=true, expecting Next
     to fall back to on-demand rendering for a slug published after the
     build. The parent [locale] layout's dynamicParams=false blocks that
     fallback for the WHOLE subtree in Next 14 (a single check across every
     segment in the chain, not one per segment — see the comment at the top
     of the article route) — so a freshly published piece 404'd until the
     next deploy, exactly the failure this feature exists to prevent. The
     route now renders on every request instead (no generateStaticParams,
     no dynamicParams export); this checks the actual HTML, not just the
     API response, because the API succeeding was never the part that broke. */
  r = await fetch(`${HOST}/magazin/interviews/${SLUG}`);
  ok(r.status === 200, `the published article is reachable with zero rebuild (${r.status})`);
  const html = await r.text();
  ok(html.includes("Ein Titel ohne Namen"), "the article HTML carries the content just saved");

  console.log("\nSTOREFRONT SHAPE:");
  r = await GET(`${B}/${SLUG}`);
  const preview = r.b?.meta?.preview?.de;
  ok(typeof preview === "string" && preview.includes(SLUG), "a draft-mode preview link is offered per language");

  console.log("\nVALIDATION ON RE-SAVE OF A LIVE PIECE:");
  r = await PUT(`${B}/${SLUG}`, {
    wine: { slug: "lugana" },
    locales: { de: { name: "", headline: "", intro: [], sections: [], teaserMagazin: {}, profile: {} } },
  });
  ok(r.s === 422, `emptying a PUBLISHED piece is refused, not silently saved (${r.s})`);

  console.log("\nUNPUBLISH:");
  r = await POST(`${B}/${SLUG}/publish`, { action: "unpublish" });
  ok(r.s === 200 && r.b?.data?.status === "draft", `unpublish → draft (${r.s})`);

  console.log("\nDELETE:");
  r = await DEL(`${B}/${SLUG}`);
  ok(r.s === 204, `DELETE → 204 (${r.s})`);
  r = await GET(`${B}/${SLUG}`);
  ok(r.s === 404, "gone after delete");

  console.log("\nCODE-ITEM OVERRIDE:");
  r = await GET(`${B}/${CODE_SLUG}`);
  ok(r.s === 200, `GET a code-defined interview → 200 (${r.s})`);
  ok(r.b?.meta?.source === "code", 'reports source "code" before any edit');
  const original = r.b.data;
  ok(original.locales.de.name === "Daniele Malavasi", "the four content files were read correctly into one record");

  r = await PUT(`${B}/${CODE_SLUG}`, {
    ...original,
    locales: { ...original.locales, de: { ...original.locales.de, badge: "TEST-OVERRIDE-BADGE" } },
  });
  ok(r.s === 200, `editing a code item creates an override → 200 (${r.s})`);

  r = await GET(`${B}/${CODE_SLUG}`);
  ok(r.b?.meta?.source === "override", 'now reports source "override"');
  ok(r.b?.data?.locales?.de?.badge === "TEST-OVERRIDE-BADGE", "the edit is what the store now returns");

  r = await DEL(`${B}/${CODE_SLUG}`);
  ok(r.s === 204, `deleting the override → 204, revealing the code item again (${r.s})`);
  r = await GET(`${B}/${CODE_SLUG}`);
  ok(r.b?.meta?.source === "code", "back to source \"code\" with the original badge");
  ok(r.b?.data?.locales?.de?.badge !== "TEST-OVERRIDE-BADGE", "the override text is gone, the content file was never touched");

  r = await DEL(`${B}/does-not-exist-either`);
  ok(r.s === 404, "deleting an unknown slug → 404");

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exitCode = fail ? 1 : 0;
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(cleanup);
