import { promises as fs } from "node:fs";
import path from "node:path";

/* Web path → file on disk, for every source the backoffice can point at.
   ==================================================================
   Six kinds of address end up in the admin stores, and each one lives
   somewhere different:

     /img/…                             public/img/…
     /video/…                           public/video/…
     /api/admin/hero/file/<n>           data/uploads/hero/<n>
     /api/admin/video/file/<n>          data/uploads/video/<n>
     /api/admin/gallery/file/<cat>/<n>  data/uploads/gallery/<cat>/<n>
     /api/admin/assets/<slug>/file/<n>  data/uploads/<slug>/<n>

   Uploads sit outside public/ because `next start` snapshots that directory
   at build time — a file written there afterwards would 404 in production —
   which is why half of these are routes rather than static files.

   Every validator in the backoffice checks the SHAPE of a path; this is what
   proves the file is actually there. The two are separate on purpose: a
   plausible path to a deleted file is the failure that leaves a page with an
   empty hero, and shape checks cannot catch it.

   Server-only (fs). */

const root = (...parts) => path.join(process.cwd(), ...parts);
const uploads = (...parts) => root("data", "uploads", ...parts);

/* Percent-encoded names are real here: the food-pairing originals carry
   spaces, en dashes and typographic quotes in their filenames. */
function decode(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    /* A stray "%" that is not an escape — take the segment as it stands. */
    return segment;
  }
}

/** Absolute path for a web path, or null when it addresses nothing we serve. */
export function assetPathToDisk(webPath) {
  if (typeof webPath !== "string" || webPath.includes("..")) return null;

  const clean = webPath.split("?")[0].split("#")[0];

  if (clean.startsWith("/img/") || clean.startsWith("/video/")) {
    return root("public", ...clean.slice(1).split("/").map(decode));
  }

  const hero = clean.match(/^\/api\/admin\/hero\/file\/([^/]+)$/);
  if (hero) return uploads("hero", path.basename(decode(hero[1])));

  const video = clean.match(/^\/api\/admin\/video\/file\/([^/]+)$/);
  if (video) return uploads("video", path.basename(decode(video[1])));

  const gallery = clean.match(/^\/api\/admin\/gallery\/file\/([^/]+)\/([^/]+)$/);
  if (gallery) {
    return uploads("gallery", path.basename(decode(gallery[1])), path.basename(decode(gallery[2])));
  }

  const asset = clean.match(/^\/api\/admin\/assets\/([a-z0-9-]+)\/file\/([^/]+)$/);
  if (asset) return uploads(path.basename(asset[1]), path.basename(decode(asset[2])));

  return null;
}

/** Is there a real file behind this web path? */
export async function assetExists(webPath) {
  const disk = assetPathToDisk(webPath);
  if (!disk) return false;
  return fs.access(disk).then(
    () => true,
    () => false,
  );
}
