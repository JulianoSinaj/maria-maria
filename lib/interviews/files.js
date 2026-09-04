/* Where interview images live on disk — server-only (fs).
   ==================================================================
   Two sources, one rule: a web path is accepted only if it maps to a file
   that exists. `/img/…` is the tracked library under public/, the
   `/api/admin/<x>/file/…` routes are the admin uploads outside public/
   (outside, because `next start` snapshots public/ at build time — see
   app/api/admin/hero/route.js). */

import { promises as fs } from "node:fs";
import path from "node:path";

export const UPLOAD_DIR = () => path.join(process.cwd(), "data", "uploads", "interviews");
export const OG_DIR = () => path.join(process.cwd(), "public", "img", "og");

/** Web path → absolute disk path, or null for anything outside the sources. */
export function imageToDisk(src) {
  if (typeof src !== "string" || src.includes("..")) return null;
  if (src.startsWith("/img/")) return path.join(process.cwd(), "public", src);

  const own = src.match(/^\/api\/admin\/interviews\/file\/([^/]+)$/);
  if (own) return path.join(UPLOAD_DIR(), path.basename(own[1]));

  const hero = src.match(/^\/api\/admin\/hero\/file\/([^/]+)$/);
  if (hero) return path.join(process.cwd(), "data", "uploads", "hero", path.basename(hero[1]));

  const gal = src.match(/^\/api\/admin\/gallery\/file\/([^/]+)\/([^/]+)$/);
  if (gal) {
    return path.join(process.cwd(), "data", "uploads", "gallery", gal[1], path.basename(gal[2]));
  }
  return null;
}

export async function imageExists(src) {
  const p = imageToDisk(src);
  if (!p) return false;
  return fs.access(p).then(
    () => true,
    () => false,
  );
}

const IMG_RE = /\.(png|jpe?g|webp|avif)$/i;
/* the responsive derivatives scripts/optimize-pages.mjs writes next to each
   source (foo-640.webp) — noise in a picker, the source is what one assigns */
const DERIVATIVE_RE = /-\d{3,4}\.webp$/i;

async function readDir(dir, toPath, out, uploaded, depth = 0) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (depth > 0) await readDir(path.join(dir, e.name), (n) => toPath(`${e.name}/${n}`), out, uploaded, depth - 1);
      continue;
    }
    if (!IMG_RE.test(e.name) || DERIVATIVE_RE.test(e.name)) continue;
    const st = await fs.stat(path.join(dir, e.name));
    out.push({ name: e.name, path: toPath(e.name), size: st.size, uploaded });
  }
}

/** Every image an interview may use: the magazine library plus the root
    lifestyle shots under public/img, and the admin's own uploads. */
export async function listInterviewImages() {
  const out = [];
  const pub = (...p) => path.join(process.cwd(), "public", ...p);
  await readDir(pub("img", "magazin"), (n) => `/img/magazin/${n}`, out, false, 1);
  await readDir(pub("img"), (n) => `/img/${n}`, out, false, 0);
  await readDir(UPLOAD_DIR(), (n) => `/api/admin/interviews/file/${n}`, out, true, 0);
  /* uploads first, then the library alphabetically — what the editor just
     added is what they are looking for */
  return out.sort((a, b) => Number(b.uploaded) - Number(a.uploaded) || a.path.localeCompare(b.path));
}
