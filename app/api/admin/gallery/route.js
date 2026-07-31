import { NextResponse } from "next/server";
import { scanGallery, galleryCounts } from "@/lib/gallery/scan";
import { GALLERY_KEYS } from "@/lib/gallery/categories";

/* Media & Asset Gallery — read side. The filesystem is the library; every
   request rescans, so nothing needs registration and nothing can go stale. */
export const dynamic = "force-dynamic";

/** GET /api/admin/gallery  (?category=landscape|lifestyle|bottle|bundle|logo) */
export async function GET(request) {
  const category = request.nextUrl.searchParams.get("category");
  if (category && !GALLERY_KEYS.includes(category)) {
    return NextResponse.json({ error: `Unknown category "${category}"` }, { status: 400 });
  }

  const all = await scanGallery();
  const assets = category ? all.filter((a) => a.category === category) : all;

  /* counts always describe the full library, so tab badges cannot disagree
     with what a tab will show when clicked */
  return NextResponse.json({
    data: { assets, counts: galleryCounts(all) },
  });
}
