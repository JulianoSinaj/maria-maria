import { NextResponse } from "next/server";
import { WINES } from "@/components/data";
import { listInterviews, createRecord, WINE_SLUGS } from "@/lib/interviews/store";
import { listInterviewImages } from "@/lib/interviews/files";
import {
  INTERVIEW_LOCALES,
  INTERVIEW_REGIONS,
  INTERVIEW_STATUS,
  PAIRING_ICONS,
  PORTRAIT_POSITIONS,
  LIMITS,
} from "@/lib/interviews/schema";

/* Interview API — collection endpoints.
   The store reads a file; nothing here may be statically optimised. */
export const dynamic = "force-dynamic";

/** GET /api/admin/interviews          → every piece, code and store
    GET /api/admin/interviews?view=options → the editor's option lists */
export async function GET(request) {
  if (request.nextUrl.searchParams.get("view") === "options") {
    return NextResponse.json({
      data: {
        wines: WINES.map((w) => ({ slug: w.slug, name: w.name, regionKey: w.regionKey })),
        wineSlugs: WINE_SLUGS,
        regions: INTERVIEW_REGIONS,
        locales: INTERVIEW_LOCALES,
        pairingIcons: PAIRING_ICONS,
        portraitPositions: PORTRAIT_POSITIONS,
        limits: LIMITS,
        images: await listInterviewImages(),
      },
    });
  }

  const rows = await listInterviews();
  return NextResponse.json({
    data: rows,
    meta: {
      count: rows.length,
      published: rows.filter((r) => r.status === INTERVIEW_STATUS.PUBLISHED).length,
      drafts: rows.filter((r) => r.status !== INTERVIEW_STATUS.PUBLISHED).length,
    },
  });
}

/** POST /api/admin/interviews — create a draft. */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  try {
    const record = await createRecord(body);
    return NextResponse.json({ data: record }, { status: 201 });
  } catch (err) {
    if (err.code === "VALIDATION") {
      return NextResponse.json({ error: err.message, details: err.details }, { status: 422 });
    }
    if (err.code === "CONFLICT") {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
