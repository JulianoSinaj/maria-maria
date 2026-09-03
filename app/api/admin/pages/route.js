import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { PAGES, PAGE_ORDER, isPage } from "@/lib/pages/blocks";
import { LOCALES, DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import {
  getPageBlocks,
  getBlockRecord,
  putOverride,
  deleteOverride,
  listOverrides,
} from "@/lib/pages/store";

/* Seiten-Editor API — die Textblöcke der Storefront je Seite und Sprache.

   GET    /api/admin/pages                      Manifest: Seiten, Blöcke, Sprachen, Überschreibungen
   GET    /api/admin/pages?page=home&locale=it  Blöcke einer Seite in einer Sprache (Saat + Wert)
   PUT    /api/admin/pages  { page, block, locale, value }
   DELETE /api/admin/pages?page=&block=&locale=  zurück zum Code

   Jede Antwort trägt `overrides` (Seite → Block → Sprachen), damit der
   Editor seine Zähler nie aus einem zweiten Aufruf zusammensetzen muss. */
export const dynamic = "force-dynamic";

const fail = (error, status = 400, extra) =>
  NextResponse.json({ error, ...(extra ?? {}) }, { status });

/* Die Storefront ist statisch vorgerendert (generateStaticParams). Ohne
   diesen Anstoß bliebe ein gespeicherter Text bis zum nächsten Deploy
   unsichtbar — genau das, was der Editor abschaffen soll. Muster UND
   konkrete Pfade, weil Deutsch präfixlos an der Wurzel liegt und intern
   auf /de/… umgeschrieben wird. */
function revalidate(page) {
  const route = PAGES[page]?.route;
  if (!route) return;
  const concrete = [
    ...LOCALES.map((locale) => route.replace("[locale]", locale)),
    route.replace("/[locale]", "") || "/",
  ];
  try {
    revalidatePath(route, "page");
  } catch {
    /* außerhalb eines Request-Kontexts (Tests importieren die Route nicht) */
  }
  for (const path of concrete) {
    try {
      revalidatePath(path);
    } catch {
      /* dito */
    }
  }
}

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const page = params.get("page");

  if (!page) {
    return NextResponse.json({
      data: {
        pages: PAGE_ORDER.map((key) => ({
          key,
          route: PAGES[key].route,
          blocks: PAGES[key].blocks.map((entry) => entry.key),
        })),
        locales: LOCALES,
        overrides: listOverrides(),
      },
    });
  }

  if (!isPage(page)) return fail(`Unknown page "${page}"`, 404);
  const locale = params.get("locale") ?? DEFAULT_LOCALE;
  if (!isLocale(locale)) return fail(`Unknown locale "${locale}"`, 400);

  return NextResponse.json({
    data: { page, locale, blocks: await getPageBlocks(page, locale), overrides: listOverrides() },
  });
}

export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Request body must be valid JSON");
  }
  const { page, block, locale, value } = body ?? {};
  if (!isPage(page)) return fail(`Unknown page "${page}"`, 422);
  if (!isLocale(locale)) return fail(`Unknown locale "${locale}"`, 422);
  if (typeof block !== "string") return fail("block must be a string", 422);

  const result = await putOverride(page, block, locale, value);
  if (result.errors) return fail(result.errors.join("; "), 422, { details: result.errors });

  revalidate(page);
  return NextResponse.json({
    data: { block: await getBlockRecord(page, block, locale), overrides: listOverrides() },
  });
}

export async function DELETE(request) {
  const params = request.nextUrl.searchParams;
  const page = params.get("page");
  const block = params.get("block");
  const locale = params.get("locale");
  if (!isPage(page)) return fail(`Unknown page "${page}"`, 422);
  if (!isLocale(locale)) return fail(`Unknown locale "${locale}"`, 422);
  const record = await getBlockRecord(page, block, locale);
  if (!record) return fail(`Unknown block "${block}" on page "${page}"`, 422);

  deleteOverride(page, block, locale);
  revalidate(page);
  return NextResponse.json({
    data: { block: await getBlockRecord(page, block, locale), overrides: listOverrides() },
  });
}
