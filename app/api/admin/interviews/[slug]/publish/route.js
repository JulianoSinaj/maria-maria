import { NextResponse } from "next/server";
import { setStatus, findRecord } from "@/lib/interviews/store";
import { INTERVIEW_STATUS, DATE_RE, localeCompleteness } from "@/lib/interviews/schema";
import { renderInterviewOg } from "@/lib/interviews/og";
import { revalidateInterviewPages } from "@/lib/interviews/revalidate";

/* Publish / withdraw — the one write that changes what visitors see.

   Publishing does three things in order: it validates the German block is
   complete and stamps the status, it renders the share image, and it
   refreshes the rendered pages (article in four languages, magazine,
   regions, sitemap). The share image is best-effort: if sharp cannot run,
   the piece still goes live and og:image falls back to the portrait; the
   response carries the reason so the desk can see it. */
export const dynamic = "force-dynamic";

const notFound = (slug) =>
  NextResponse.json({ error: `No interview with slug "${slug}"` }, { status: 404 });

/** POST /api/admin/interviews/:slug/publish
    body { action: "publish", publishedAt?: "YYYY-MM-DD" } | { action: "unpublish" } */
export async function POST(request, { params }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const action = body?.action;
  if (action !== "publish" && action !== "unpublish") {
    return NextResponse.json({ error: 'action must be "publish" or "unpublish"' }, { status: 422 });
  }
  if (body.publishedAt != null && !DATE_RE.test(body.publishedAt)) {
    return NextResponse.json({ error: "publishedAt must be YYYY-MM-DD" }, { status: 422 });
  }

  try {
    const record = await setStatus(
      params.slug,
      action === "publish" ? INTERVIEW_STATUS.PUBLISHED : INTERVIEW_STATUS.DRAFT,
      { publishedAt: body.publishedAt ?? undefined },
    );
    if (!record) return notFound(params.slug);

    const og = action === "publish" ? await renderInterviewOg(record) : null;
    revalidateInterviewPages();

    const hit = await findRecord(record.slug);
    return NextResponse.json({
      data: record,
      meta: {
        source: hit?.source ?? "store",
        completeness: localeCompleteness(record),
        og,
        revalidated: true,
      },
    });
  } catch (err) {
    if (err.code === "VALIDATION") {
      return NextResponse.json({ error: err.message, details: err.details }, { status: 422 });
    }
    throw err;
  }
}
