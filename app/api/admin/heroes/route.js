import { NextResponse } from "next/server";
import {
  HERO_ALT_LOCALES,
  HERO_PAGES,
  generatedAlt,
  heroPage,
  validateHeroPagePatch,
} from "@/lib/heroes/pages";
import {
  getHeroPageConfig,
  getHeroPages,
  putHeroPageConfig,
  resetHeroPageConfig,
} from "@/lib/heroes/store";
import { assetExists } from "@/lib/media/paths";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* Hero stages of the subpages — image, focal point and alt text.
   ==================================================================
   The homepage keeps its own endpoint (/api/admin/hero), which also owns its
   copy block and readability veil. This one covers everything else: the four
   remaining page stages and the nine wine landing pages.

   The interesting half is the alt text. Every slot reports what the LIVE page
   says in all four storefront locales, read straight out of
   content/<locale>/… through getDictionary — not copied into a catalogue
   where it would rot. An editor therefore sees the real sentence, sees which
   locale is thin, and can put an override beside it. */
export const dynamic = "force-dynamic";

/** Walk "hero.photoAlt" into a dictionary. */
function lookup(dict, dotted) {
  let cursor = dict;
  for (const key of dotted.split(".")) {
    if (cursor == null || typeof cursor !== "object") return undefined;
    cursor = cursor[key];
  }
  return typeof cursor === "string" ? cursor : undefined;
}

/* The four dictionaries, loaded once per request and shared by every slot —
   thirteen slots × four locales would otherwise be 52 imports. */
async function liveAltResolver() {
  const dicts = Object.fromEntries(
    await Promise.all(HERO_ALT_LOCALES.map(async (l) => [l, await getDictionary(l)])),
  );

  return (page) => {
    if (page.alt?.kind === "generated") {
      /* Assembled inside the component from the wine name. The same German
         sentence goes out on all four locales — visible here rather than
         asserted, and precisely what an override is for. */
      const text = generatedAlt(page);
      return Object.fromEntries(HERO_ALT_LOCALES.map((l) => [l, text]));
    }
    return Object.fromEntries(
      HERO_ALT_LOCALES.map((l) => [
        l,
        lookup(dicts[l]?.[page.alt.section] ?? {}, page.alt.path) ?? "",
      ]),
    );
  };
}

/** GET /api/admin/heroes  (?fresh=1 → the live values, ignoring stored edits) */
export async function GET(request) {
  const fresh = request.nextUrl.searchParams.get("fresh") === "1";
  const liveAlt = await liveAltResolver();
  const configs = fresh ? null : await getHeroPages();

  const pages = await Promise.all(
    HERO_PAGES.map(async (page, index) => {
      const config = fresh
        ? { key: page.key, image: { ...page.image }, alt: Object.fromEntries(HERO_ALT_LOCALES.map((l) => [l, null])) }
        : configs[index];

      return {
        key: page.key,
        group: page.group,
        route: page.route,
        source: page.source,
        ratio: page.ratio,
        ...(page.label ? { label: page.label } : {}),
        ...(page.slug ? { slug: page.slug } : {}),
        ...(page.ownedBy ? { ownedBy: page.ownedBy } : {}),
        altKind: page.alt.kind,
        config,
        live: { image: { ...page.image }, alt: liveAlt(page) },
        /* A motif that has been deleted from disk since it was chosen: the
           page would render an empty stage, and the editor should say so
           rather than show a broken thumbnail. */
        missing: !(await assetExists(config.image.src)),
      };
    }),
  );

  return NextResponse.json({ data: { pages, altLocales: HERO_ALT_LOCALES } });
}

/** PUT /api/admin/heroes — patch one slot: { key, image?, alt? } */
export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const { key, ...patch } = body ?? {};
  if (!heroPage(key)) {
    return NextResponse.json({ error: `Unknown hero slot "${key}"` }, { status: 404 });
  }

  const errs = validateHeroPagePatch(key, patch);
  if (errs.length) {
    return NextResponse.json({ error: errs.join("; "), details: errs }, { status: 422 });
  }

  if (patch.image?.src !== undefined && !(await assetExists(patch.image.src))) {
    return NextResponse.json(
      { error: `Image "${patch.image.src}" does not exist` },
      { status: 422 },
    );
  }

  const config = await putHeroPageConfig(key, patch);
  return NextResponse.json({ data: { config } });
}

/** DELETE /api/admin/heroes?key=…  — hand a slot back to its live values.
    Without a key it clears every slot; the test suite depends on that. */
export async function DELETE(request) {
  const key = request.nextUrl.searchParams.get("key");
  if (key && !heroPage(key)) {
    return NextResponse.json({ error: `Unknown hero slot "${key}"` }, { status: 404 });
  }
  await resetHeroPageConfig(key ?? undefined);
  return NextResponse.json({
    data: { config: key ? await getHeroPageConfig(key) : null, cleared: key ?? "all" },
  });
}
