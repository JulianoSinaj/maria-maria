import path from "node:path";
import { NextResponse } from "next/server";
import { buildDerivatives, derivativeSummary, getDerivatives } from "@/lib/media/derivatives";
import { assetPathToDisk } from "@/lib/media/paths";

/* Build the WebP/AVIF ladder for one uploaded file.
   ==================================================================
   Uploads get their derivatives automatically at the moment they land (see
   the three upload routes). This endpoint exists for the files that arrived
   BEFORE that was true, and for the rare rebuild — a changed quality setting,
   a run that failed because sharp was missing on the box.

   Tracked assets under public/img are refused, with the command that does the
   job instead. Their variants belong to scripts/optimize-*.mjs and their
   widths are recorded in components/media/photoManifest.js, a checked-in
   module: a server process writing either would put generated files into a
   commit — and would fail outright on a read-only deployment. */
export const dynamic = "force-dynamic";

/* Which upload directory an asset path belongs to, and the route that serves
   it back. Mirrors lib/media/paths.js; only uploads can be built. */
const UPLOAD_ROUTES = [
  { re: /^\/api\/admin\/hero\/file\/([^/]+)$/, base: (m) => "/api/admin/hero/file" },
  { re: /^\/api\/admin\/gallery\/file\/([^/]+)\/([^/]+)$/, base: (m) => `/api/admin/gallery/file/${m[1]}` },
  { re: /^\/api\/admin\/assets\/([a-z0-9-]+)\/file\/([^/]+)$/, base: (m) => `/api/admin/assets/${m[1]}/file` },
];

/** POST /api/admin/media/derivatives — { path } */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const assetPath = body?.path;
  if (typeof assetPath !== "string") {
    return NextResponse.json({ error: "path is required" }, { status: 422 });
  }

  if (assetPath.startsWith("/img/") || assetPath.startsWith("/video/")) {
    return NextResponse.json(
      {
        error:
          "Tracked assets are built by the optimise scripts — run `npm run optimize:pages` " +
          "(or the pipeline that owns this folder) and commit the result.",
      },
      { status: 409 },
    );
  }

  const match = UPLOAD_ROUTES.map((route) => ({ route, m: assetPath.match(route.re) })).find(
    (candidate) => candidate.m,
  );
  const disk = assetPathToDisk(assetPath);
  if (!match || !disk) {
    return NextResponse.json({ error: "Path is not an upload" }, { status: 422 });
  }

  const record = await buildDerivatives({
    dir: path.dirname(disk),
    file: path.basename(disk),
    webBase: match.route.base(match.m),
    assetPath,
  });

  /* "Nothing was produced" is an answer, not a failure: a 6 KB icon is below
     the threshold where a second request pays for itself, and a box without
     sharp cannot encode at all. The record says which, and the UI shows it. */
  return NextResponse.json({ data: { path: assetPath, derivatives: derivativeSummary(record) } });
}

/** GET /api/admin/media/derivatives?path=… — what exists right now. */
export async function GET(request) {
  const assetPath = request.nextUrl.searchParams.get("path");
  if (!assetPath) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }
  return NextResponse.json({
    data: { path: assetPath, derivatives: derivativeSummary(await getDerivatives(assetPath)) },
  });
}
