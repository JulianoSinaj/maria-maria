import { NextResponse } from "next/server";
import {
  MEDIA_ALT_LOCALES,
  MEDIA_LICENSES,
  defaultMeta,
  isLegalAssetPath,
  metaState,
  validateMetaPatch,
} from "@/lib/media/rights";
import { getAllMeta, getMeta, putMeta, resetMeta } from "@/lib/media/metaStore";
import { getAllDerivatives, derivativeSummary } from "@/lib/media/derivatives";
import { assetExists } from "@/lib/media/paths";

/* Alt text and image rights, per asset.
   ==================================================================
   The library itself is not stored — lib/gallery/scan.js walks the disk on
   every request, and that stays the source of truth for WHAT exists. This
   endpoint owns what cannot be read off a filesystem: what a picture shows,
   who owns it, and until when.

   Keyed by web path, like every other admin store. A file that is renamed
   loses its entry, which is the honest outcome: the description belonged to
   the file, and there is no way to prove the new one shows the same thing. */
export const dynamic = "force-dynamic";

/** GET /api/admin/media            → every described asset
    GET /api/admin/media?path=/img/… → one asset, defaults filled in */
export async function GET(request) {
  const assetPath = request.nextUrl.searchParams.get("path");

  if (assetPath) {
    if (!isLegalAssetPath(assetPath)) {
      return NextResponse.json({ error: "Path is outside the media library" }, { status: 400 });
    }
    const meta = await getMeta(assetPath);
    const derivatives = (await getAllDerivatives())[assetPath] ?? null;
    return NextResponse.json({
      data: {
        path: assetPath,
        meta,
        state: metaState(meta),
        derivatives: derivativeSummary(derivatives),
        exists: await assetExists(assetPath),
      },
    });
  }

  const stored = await getAllMeta();
  const derivatives = await getAllDerivatives();

  const assets = Object.fromEntries(
    Object.entries(stored).map(([key, value]) => {
      const meta = { ...defaultMeta(), ...value };
      return [key, { meta, state: metaState(meta) }];
    }),
  );

  return NextResponse.json({
    data: {
      assets,
      derivatives: Object.fromEntries(
        Object.entries(derivatives).map(([key, record]) => [key, derivativeSummary(record)]),
      ),
      licenses: MEDIA_LICENSES,
      altLocales: MEDIA_ALT_LOCALES,
    },
  });
}

/** PUT /api/admin/media — { path, alt?, decorative?, license?, holder?, source?, expires?, note? } */
export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const { path: assetPath, ...patch } = body ?? {};
  if (!isLegalAssetPath(assetPath)) {
    return NextResponse.json({ error: "Path is outside the media library" }, { status: 422 });
  }

  const errs = validateMetaPatch(patch);
  if (errs.length) {
    return NextResponse.json({ error: errs.join("; "), details: errs }, { status: 422 });
  }

  /* Describing a file that is not there would leave an orphan entry behind
     the first time somebody mistypes a path. */
  if (!(await assetExists(assetPath))) {
    return NextResponse.json({ error: `Asset "${assetPath}" does not exist` }, { status: 422 });
  }

  const meta = await putMeta(assetPath, patch);
  return NextResponse.json({ data: { path: assetPath, meta, state: metaState(meta) } });
}

/** DELETE /api/admin/media?path=… — drop one description (or all of them). */
export async function DELETE(request) {
  const assetPath = request.nextUrl.searchParams.get("path");
  if (assetPath && !isLegalAssetPath(assetPath)) {
    return NextResponse.json({ error: "Path is outside the media library" }, { status: 400 });
  }
  await resetMeta(assetPath ?? undefined);
  return NextResponse.json({ data: { cleared: assetPath ?? "all" } });
}
