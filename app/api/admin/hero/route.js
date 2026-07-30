import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  getHeroConfig,
  putHeroConfig,
  defaultHeroConfig,
  validateHeroPatch,
} from "@/lib/hero/store";

/* Hero content API — config plus the background images available to the
   landing hero: the tracked photos in public/img/home/ and any mock uploads
   in data/uploads/hero/ (outside public/, because `next start` snapshots
   public/ at build time). */
export const dynamic = "force-dynamic";

const IMG_RE = /\.(png|jpe?g|webp|avif)$/i;
const homeDir = () => path.join(process.cwd(), "public", "img", "home");
const uploadDir = () => path.join(process.cwd(), "data", "uploads", "hero");

async function listImages() {
  const out = [];
  const read = async (dir, toPath, uploaded) => {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.isDirectory() || !IMG_RE.test(e.name)) continue;
      const st = await fs.stat(path.join(dir, e.name));
      out.push({ name: e.name, path: toPath(e.name), size: st.size, uploaded });
    }
  };
  await read(homeDir(), (n) => `/img/home/${n}`, false);
  await read(uploadDir(), (n) => `/api/admin/hero/file/${n}`, true);
  return out;
}

/** Heal a config whose image has since vanished from disk. */
function resolveConfig(images, { fresh = false } = {}) {
  const cfg = fresh ? defaultHeroConfig() : getHeroConfig();
  if (!images.some((i) => i.path === cfg.image.src)) {
    cfg.image.src = images.find((i) => i.name === "hero-1280.webp")?.path ?? images[0]?.path ?? null;
  }
  return cfg;
}

/** GET /api/admin/hero  (?fresh=1 → defaults, ignoring stored) */
export async function GET(request) {
  const images = await listImages();
  const fresh = request.nextUrl.searchParams.get("fresh") === "1";
  return NextResponse.json({ data: { config: resolveConfig(images, { fresh }), images } });
}

/** PUT /api/admin/hero — partial config update. */
export async function PUT(request) {
  let patch;
  try {
    patch = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const errs = validateHeroPatch(patch);
  if (errs.length) {
    return NextResponse.json({ error: errs.join("; "), details: errs }, { status: 422 });
  }

  const images = await listImages();
  if (patch.image?.src !== undefined && !images.some((i) => i.path === patch.image.src)) {
    return NextResponse.json(
      { error: `Image "${patch.image.src}" does not exist` },
      { status: 422 },
    );
  }

  return NextResponse.json({ data: { config: putHeroConfig(patch), images } });
}
