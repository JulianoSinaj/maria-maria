import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  getHeroConfig,
  putHeroConfig,
  defaultHeroConfig,
  validateHeroPatch,
} from "@/lib/hero/store";
import { audited } from "@/lib/admin/audited";

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

/** Map a legal image src to its on-disk location. Returns null for paths
    outside the known sources (validation should have caught those). */
function srcToDisk(src) {
  if (typeof src !== "string" || src.includes("..")) return null;
  if (src.startsWith("/img/")) return path.join(process.cwd(), "public", src);
  const hero = src.match(/^\/api\/admin\/hero\/file\/([^/]+)$/);
  if (hero) return path.join(uploadDir(), path.basename(hero[1]));
  const gal = src.match(/^\/api\/admin\/gallery\/file\/([^/]+)\/([^/]+)$/);
  if (gal)
    return path.join(process.cwd(), "data", "uploads", "gallery", gal[1], path.basename(gal[2]));
  return null;
}

const existsOnDisk = async (src) => {
  const p = srcToDisk(src);
  if (!p) return false;
  return fs.access(p).then(() => true, () => false);
};

/** Heal a config whose image has since vanished from disk. The src may be a
    library-wide path assigned from the gallery, so the check is against the
    disk — not against the picker's img/home listing. */
async function resolveConfig(images, { fresh = false } = {}) {
  const cfg = fresh ? defaultHeroConfig() : getHeroConfig();
  if (!(await existsOnDisk(cfg.image.src))) {
    cfg.image.src = images.find((i) => i.name === "hero-1280.webp")?.path ?? images[0]?.path ?? null;
  }
  return cfg;
}

/** GET /api/admin/hero  (?fresh=1 → defaults, ignoring stored) */
export async function GET(request) {
  const images = await listImages();
  const fresh = request.nextUrl.searchParams.get("fresh") === "1";
  return NextResponse.json({ data: { config: await resolveConfig(images, { fresh }), images } });
}

/** PUT /api/admin/hero — partial config update.

    Wrapped: the wrapper checks that this session may write at all and files
    the receipt afterwards; the handler says what changed, because only it
    knows what the config looked like a moment ago. */
export const PUT = audited("hero.update", async (request, { audit }) => {
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

  /* the src may point anywhere in the library — verify it on disk */
  if (patch.image?.src !== undefined && !(await existsOnDisk(patch.image.src))) {
    return NextResponse.json(
      { error: `Image "${patch.image.src}" does not exist` },
      { status: 422 },
    );
  }

  const images = await listImages();
  /* read the state BEFORE the write, or the diff compares a thing with
     itself: putHeroConfig merges into the same stored object */
  const before = structuredClone(getHeroConfig());
  const config = putHeroConfig(patch);
  audit({ target: "Hero", before, after: config });

  return NextResponse.json({ data: { config, images } });
});
