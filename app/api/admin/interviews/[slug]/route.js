import { NextResponse } from "next/server";
import { findRecord, updateRecord, removeRecord } from "@/lib/interviews/store";
import { localeCompleteness, INTERVIEW_LOCALES, INTERVIEW_STATUS } from "@/lib/interviews/schema";
import { ogExists, ogPath, ogSource } from "@/lib/interviews/og";
import { imageExists } from "@/lib/interviews/files";
import { revalidateInterviewPages } from "@/lib/interviews/revalidate";
import { localePath } from "@/lib/i18n/routing";
import { interviewPath } from "@/components/magazin/interviewPath";

/* Interview API — single-record endpoints. */
export const dynamic = "force-dynamic";

const notFound = (slug) =>
  NextResponse.json({ error: `No interview with slug "${slug}"` }, { status: 404 });

async function withMeta(record, source) {
  return {
    source,
    completeness: localeCompleteness(record),
    /* the preview goes through the draft-mode route, which redirects into
       the storefront with the bypass cookie set; the live link is the
       canonical address itself */
    preview: Object.fromEntries(
      INTERVIEW_LOCALES.map((l) => [
        l,
        `/api/admin/interviews/${encodeURIComponent(record.slug)}/preview?locale=${l}`,
      ]),
    ),
    live: Object.fromEntries(
      INTERVIEW_LOCALES.map((l) => [l, localePath(l, interviewPath(record.slug))]),
    ),
    og: {
      exists: await ogExists(record.slug),
      path: ogPath(record.slug),
      source: ogSource(record),
    },
  };
}

/** GET /api/admin/interviews/:slug */
export async function GET(_request, { params }) {
  const hit = await findRecord(params.slug);
  if (!hit) return notFound(params.slug);
  return NextResponse.json({ data: hit.record, meta: await withMeta(hit.record, hit.source) });
}

/** PUT /api/admin/interviews/:slug — replace the editable content.
    Status and publish date are NOT touched here (see ./publish). */
export async function PUT(request, { params }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  /* every image the record names has to exist on disk — a typo in a path
     would otherwise reach the live page as a broken frame */
  const missing = [];
  const check = async (key, src) => {
    if (src && !(await imageExists(src))) missing.push(`${key}: ${src}`);
  };
  await check("portrait.src", body?.portrait?.src);
  await check("portrait.article", body?.portrait?.article);
  await check("teaserPortrait", body?.teaserPortrait);
  await check("winePhoto", body?.winePhoto);
  await check("og", body?.og);
  for (const l of INTERVIEW_LOCALES) {
    const c = body?.locales?.[l];
    if (!c) continue;
    for (const [i, s] of (c.sections ?? []).entries()) await check(`sections[${i}].media`, s?.media?.src);
    await check(`pairing.media`, c.pairing?.media?.src);
  }
  if (missing.length) {
    return NextResponse.json(
      { error: `Image not found: ${missing.join("; ")}`, details: missing.map((m) => `image ${m}`) },
      { status: 422 },
    );
  }

  try {
    const record = await updateRecord(params.slug, body);
    if (!record) return notFound(params.slug);
    /* a live piece changed — the rendered pages are stale now */
    if (record.status === INTERVIEW_STATUS.PUBLISHED) revalidateInterviewPages();
    const hit = await findRecord(record.slug);
    return NextResponse.json({ data: record, meta: await withMeta(record, hit?.source ?? "store") });
  } catch (err) {
    if (err.code === "VALIDATION") {
      return NextResponse.json({ error: err.message, details: err.details }, { status: 422 });
    }
    throw err;
  }
}

/** DELETE /api/admin/interviews/:slug — removes the store record. For an
    override this reveals the code-defined piece again. */
export async function DELETE(_request, { params }) {
  const removed = await removeRecord(params.slug);
  if (!removed) {
    const hit = await findRecord(params.slug);
    if (hit?.source === "code") {
      return NextResponse.json(
        { error: `"${params.slug}" lives in the content files and cannot be deleted here` },
        { status: 409 },
      );
    }
    return notFound(params.slug);
  }
  revalidateInterviewPages();
  return new NextResponse(null, { status: 204 });
}
