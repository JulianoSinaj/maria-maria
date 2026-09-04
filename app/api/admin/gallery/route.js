import { NextResponse } from "next/server";
import { scanGallery, galleryCounts } from "@/lib/gallery/scan";
import { GALLERY_KEYS } from "@/lib/gallery/categories";
import { getAllMeta } from "@/lib/media/metaStore";
import { defaultMeta, metaState } from "@/lib/media/rights";
import { derivativeSummary, derivativeWebPaths, getAllDerivatives } from "@/lib/media/derivatives";
import { PHOTO_MANIFEST } from "@/components/media/photoManifest";

/* Media & Asset Gallery — read side. The filesystem is the library; every
   request rescans, so nothing needs registration and nothing can go stale.

   What the filesystem cannot say travels with each row: the alt text and the
   rights recorded for that file (/api/admin/media), and which responsive
   widths exist for it. The second comes from two places on purpose —
   generated derivatives for uploads, and components/media/photoManifest.js
   for the tracked assets, whose variants belong to scripts/optimize-*.mjs.
   One badge, two truthful sources, and no pretence that the server could
   rebuild the tracked ones. */
export const dynamic = "force-dynamic";

/** GET /api/admin/gallery  (?category=landscape|lifestyle|bottle|bundle|logo) */
export async function GET(request) {
  const category = request.nextUrl.searchParams.get("category");
  if (category && !GALLERY_KEYS.includes(category)) {
    return NextResponse.json({ error: `Unknown category "${category}"` }, { status: 400 });
  }

  /* Generated widths are files, not assets — fold them into their parent. */
  const all = await scanGallery({ skipPaths: await derivativeWebPaths() });
  const filtered = category ? all.filter((a) => a.category === category) : all;

  const stored = await getAllMeta();
  const generated = await getAllDerivatives();

  const assets = filtered.map((asset) => {
    const meta = { ...defaultMeta(), ...(stored[asset.path] ?? {}) };
    const manifest = PHOTO_MANIFEST[asset.path];
    return {
      ...asset,
      meta,
      state: metaState(meta),
      described: Boolean(stored[asset.path]),
      derivatives:
        derivativeSummary(generated[asset.path] ?? null) ??
        (manifest
          ? { widths: manifest.widths, formats: ["webp"], count: manifest.widths.length, bytes: null, source: "manifest" }
          : null),
    };
  });

  /* counts always describe the full library, so tab badges cannot disagree
     with what a tab will show when clicked */
  return NextResponse.json({
    data: { assets, counts: galleryCounts(all) },
  });
}
