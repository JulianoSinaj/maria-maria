import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getConfig, putConfig, defaultConfig, validatePatch } from "@/lib/assets/store";

/* Bottle-asset API — config + available mockup files for one wine.
   Files are enumerated from public/img/wines/<slug>/ on every request, so an
   upload (or a file dropped in by hand) appears without any registration. */
export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9-]+$/;
const IMG_RE = /\.(png|jpe?g|webp|avif)$/i;

const wineDir = (slug) => path.join(process.cwd(), "public", "img", "wines", slug);
const uploadDir = (slug) => path.join(process.cwd(), "data", "uploads", slug);

/* Tracked packshots come straight from public/. Mock uploads live in
   data/uploads/<slug>/ and are served through the file route, because
   `next start` snapshots public/ at build time — a file written there after
   the build would 404 in production. */
async function listAssets(slug) {
  const out = [];
  const read = async (dir, toPath, uploaded) => {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return; // dir may not exist yet
    }
    for (const e of entries) {
      if (e.isDirectory() || !IMG_RE.test(e.name)) continue;
      const st = await fs.stat(path.join(dir, e.name));
      out.push({ name: e.name, path: toPath(e.name), size: st.size, uploaded });
    }
  };
  await read(wineDir(slug), (n) => `/img/wines/${slug}/${n}`, false);
  await read(uploadDir(slug), (n) => `/api/admin/assets/${slug}/file/${n}`, true);
  return out;
}

/** Resolve the effective config: stored if present, otherwise defaults with a
    sensible lead asset (the storefront's card packshot when it exists). */
function resolveConfig(slug, assets, { fresh = false } = {}) {
  const fallback =
    assets.find((a) => a.name === "card-front.webp")?.path ?? assets[0]?.path ?? null;
  const stored = fresh ? null : getConfig(slug);
  const cfg = stored ?? defaultConfig(slug, fallback);
  /* heal a config whose asset has since been deleted from disk */
  if (!assets.some((a) => a.path === cfg.asset)) cfg.asset = fallback;
  return cfg;
}

/** GET /api/admin/assets/:slug  (?fresh=1 → defaults, ignoring stored) */
export async function GET(request, { params }) {
  const { slug } = params;
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  try {
    await fs.access(wineDir(slug));
  } catch {
    return NextResponse.json({ error: `No asset directory for "${slug}"` }, { status: 404 });
  }
  const assets = await listAssets(slug);
  const fresh = request.nextUrl.searchParams.get("fresh") === "1";
  return NextResponse.json({ data: { config: resolveConfig(slug, assets, { fresh }), assets } });
}

/** PUT /api/admin/assets/:slug — partial config update. */
export async function PUT(request, { params }) {
  const { slug } = params;
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  let patch;
  try {
    patch = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const errs = validatePatch(slug, patch);
  if (errs.length) {
    return NextResponse.json({ error: errs.join("; "), details: errs }, { status: 422 });
  }

  const assets = await listAssets(slug);
  /* the chosen asset must actually exist on disk, not merely look plausible.
     Gallery uploads live outside this wine's listing — check those on disk. */
  if (patch.asset !== undefined && !assets.some((a) => a.path === patch.asset)) {
    const gal = patch.asset.match(/^\/api\/admin\/gallery\/file\/([^/]+)\/([^/]+)$/);
    const onDisk =
      gal &&
      (await fs
        .access(
          path.join(process.cwd(), "data", "uploads", "gallery", gal[1], path.basename(gal[2])),
        )
        .then(() => true, () => false));
    if (!onDisk) {
      return NextResponse.json(
        { error: `Asset "${patch.asset}" does not exist for this wine` },
        { status: 422 },
      );
    }
  }

  const config = putConfig(slug, patch, resolveConfig(slug, assets));
  return NextResponse.json({ data: { config, assets } });
}
