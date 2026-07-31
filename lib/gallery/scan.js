/* Media library scanner — server-only (fs).
   ==================================================================
   Walks the real asset locations on every request and classifies each file
   into one gallery category. Stateless by design: the filesystem IS the
   library, so a photo dropped into public/img appears without registration,
   and nothing here can go stale.

   Sources:
     public/img (root files)        → lifestyle, except the brand marks
     public/img/home                → hero + moment = lifestyle, region- = landscape
     public/img/regions             → landscape
     public/img/magazin (+1 level)  → lifestyle
     public/img/wines/<slug>        → bottle (wine = slug)
     data/uploads/hero              → lifestyle uploads (hero file route)
     data/uploads/<wine-slug>       → bottle uploads (assets file route)
     data/uploads/gallery/<cat>     → that category (gallery file route) */

import { promises as fs } from "fs";
import path from "path";
import { GALLERY_KEYS } from "./categories";

const IMG_RE = /\.(png|jpe?g|webp|avif)$/i;
const LOGO_NAMES = new Set(["logo.png", "stemma.png", "aniversario.png"]);
const BUNDLE_RE = /bundle|paket|selezione|showcase/i;

const pub = (...p) => path.join(process.cwd(), "public", ...p);
const up = (...p) => path.join(process.cwd(), "data", "uploads", ...p);

async function files(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries;
  } catch {
    return [];
  }
}

async function collect(dir, webBase, categorize, out, extra = {}) {
  for (const e of await files(dir)) {
    if (e.isDirectory() || !IMG_RE.test(e.name)) continue;
    const st = await fs.stat(path.join(dir, e.name));
    out.push({
      name: e.name,
      path: `${webBase}/${e.name}`,
      category: categorize(e.name),
      size: st.size,
      uploaded: !!extra.uploaded,
      ...(extra.wine ? { wine: extra.wine } : {}),
    });
  }
}

export async function scanGallery() {
  const out = [];

  /* brand marks + root lifestyle shots */
  await collect(pub("img"), "/img", (n) =>
    LOGO_NAMES.has(n.toLowerCase()) ? "logo" : BUNDLE_RE.test(n) ? "bundle" : "lifestyle",
  out);

  await collect(pub("img", "home"), "/img/home", (n) =>
    n.startsWith("region-") ? "landscape" : "lifestyle",
  out);

  await collect(pub("img", "regions"), "/img/regions", () => "landscape", out);

  await collect(pub("img", "magazin"), "/img/magazin", () => "lifestyle", out);
  for (const e of await files(pub("img", "magazin"))) {
    if (e.isDirectory())
      await collect(pub("img", "magazin", e.name), `/img/magazin/${e.name}`, () => "lifestyle", out);
  }

  /* per-wine packshots — the individual bottle renders */
  for (const e of await files(pub("img", "wines"))) {
    if (!e.isDirectory()) continue;
    await collect(pub("img", "wines", e.name), `/img/wines/${e.name}`, () => "bottle", out, {
      wine: e.name,
    });
  }

  /* mock uploads, each served through its own route */
  await collect(up("hero"), "/api/admin/hero/file", () => "lifestyle", out, { uploaded: true });
  for (const e of await files(up())) {
    if (!e.isDirectory() || e.name === "hero" || e.name === "gallery") continue;
    await collect(up(e.name), `/api/admin/assets/${e.name}/file`, () => "bottle", out, {
      uploaded: true,
      wine: e.name,
    });
  }
  for (const cat of GALLERY_KEYS) {
    await collect(up("gallery", cat), `/api/admin/gallery/file/${cat}`, () => cat, out, {
      uploaded: true,
    });
  }

  return out;
}

export function galleryCounts(assets) {
  const counts = Object.fromEntries(GALLERY_KEYS.map((k) => [k, 0]));
  counts.all = assets.length;
  for (const a of assets) counts[a.category] += 1;
  return counts;
}
