import { promises as fs } from "node:fs";
import path from "node:path";
import { jsonStore } from "@/lib/admin/jsonStore";

/* Responsive derivatives for uploaded images — WebP and AVIF.
   ==================================================================
   The storefront never serves an original. Every photo on the public site
   goes out as a WebP of roughly the width it is displayed at, built ahead of
   time by the scripts in scripts/optimize-*.mjs and looked up through
   components/media/photoManifest.js. That is why the site loads the way it
   does, and it is a rule with one hole in it: ANYTHING UPLOADED THROUGH THE
   BACKOFFICE MISSED IT. A 4 MB phone photo assigned as a hero background went
   to visitors as a 4 MB phone photo.

   This module closes that hole at the moment of upload. The settings are
   deliberately the ones from scripts/optimize-pages.mjs — the same width
   ladder, quality 72, effort 6, and near-lossless for graphics with an alpha
   channel, where photo quantisation puts visible rings around letterforms —
   so an uploaded file behaves like a tracked one. On top of that it writes
   AVIF, which the build scripts do not: they predate it, and for a new file
   there is no back catalogue to regenerate.

   WHAT IT DOES NOT DO, and deliberately: touch public/img. The tracked assets
   are source, their variants are built by the npm scripts, and their manifest
   is a checked-in module. A server process that rewrote either would put
   generated files in a commit and would fail outright on a read-only
   deployment. For those, the gallery reports what the manifest already knows
   and names the command that refreshes it.

   sharp is imported lazily and its absence is not an error: the upload
   succeeds, the record says why there are no derivatives, and the UI shows
   that instead of pretending. */

/* Same ladder as optimize-pages.mjs. The narrow steps matter more here than
   there: an uploaded packshot can end up in a 56 px card. */
export const DERIVATIVE_WIDTHS = [160, 320, 640, 1024, 1600];
export const DERIVATIVE_FORMATS = ["webp", "avif"];

/* Below this the extra request costs more than the saved bytes — the rule the
   build script uses, and the reason a 6 KB logo keeps to itself. */
const MIN_BYTES = 20 * 1024;

/* No point resampling a master file into six copies of a master file. */
const MAX_WIDTH = 2400;

const QUALITY = {
  photo: { webp: { quality: 72, effort: 6 }, avif: { quality: 50, effort: 4 } },
  graphic: {
    webp: { nearLossless: true, quality: 90, effort: 6 },
    avif: { quality: 70, effort: 4 },
  },
};

const store = jsonStore("derivatives", () => ({ version: 1, assets: {} }));

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    /* sharp is a devDependency and a native binary: a deployment that
       installed production dependencies only, or one on a platform without a
       prebuilt binary, has none. */
    return null;
  }
}

/** Every derivative record, keyed by the asset's web path. */
export async function getAllDerivatives() {
  const doc = await store.read();
  return doc.assets ?? {};
}

export async function getDerivatives(assetPath) {
  const assets = await getAllDerivatives();
  return assets[assetPath] ?? null;
}

/* The web paths of every generated file, so the library scanner can fold them
   into the asset they belong to instead of listing six copies of one photo.
   Recorded rather than guessed from the filename: an editor may well upload a
   file that is honestly called "terrasse-640.webp". */
export async function derivativeWebPaths() {
  const assets = await getAllDerivatives();
  const paths = new Set();
  for (const record of Object.values(assets)) {
    for (const variant of record.variants ?? []) paths.add(variant.path);
  }
  return paths;
}

export async function forgetDerivatives(assetPath) {
  if (!assetPath) {
    await store.reset();
    return;
  }
  await store.update((current) => {
    const assets = { ...(current.assets ?? {}) };
    delete assets[assetPath];
    return { ...current, assets };
  });
}

/**
 * Build WebP + AVIF variants beside an uploaded file and record them.
 *
 * @param {object}  args
 * @param {string}  args.dir       absolute directory the upload landed in
 * @param {string}  args.file      its filename
 * @param {string}  args.webBase   the file route that serves that directory
 * @param {string}  args.assetPath the upload's own web path (the record key)
 */
export async function buildDerivatives({ dir, file, webBase, assetPath }) {
  const record = {
    generatedAt: new Date().toISOString(),
    source: null,
    variants: [],
    skipped: null,
  };

  const absolute = path.join(dir, file);
  let bytes;
  try {
    bytes = (await fs.stat(absolute)).size;
  } catch {
    record.skipped = "unreadable";
    return persist(assetPath, record);
  }

  const sharp = await loadSharp();
  if (!sharp) {
    record.skipped = "no-encoder";
    return persist(assetPath, record);
  }

  let meta;
  try {
    meta = await sharp(absolute).metadata();
  } catch {
    /* A file that passed the extension and data-URL checks but is not an
       image sharp can read. The upload itself stays valid. */
    record.skipped = "unreadable";
    return persist(assetPath, record);
  }

  record.source = {
    width: meta.width ?? null,
    height: meta.height ?? null,
    format: meta.format ?? null,
    bytes,
  };

  if (bytes < MIN_BYTES) {
    record.skipped = "small";
    return persist(assetPath, record);
  }
  if (!meta.width) {
    record.skipped = "unreadable";
    return persist(assetPath, record);
  }

  /* Every ladder step below the source width, plus the source width itself —
     capped. Never upscale, and never call a file 640w that is 391 px wide:
     the browser believes the srcSet and would pick something too small. */
  const top = Math.min(meta.width, MAX_WIDTH);
  const steps = DERIVATIVE_WIDTHS.filter((w) => w < top);
  if (!steps.includes(top)) steps.push(top);

  const profile = meta.format === "png" && meta.hasAlpha ? QUALITY.graphic : QUALITY.photo;
  const stem = file.replace(/\.[^.]+$/, "");

  for (const width of steps) {
    for (const format of DERIVATIVE_FORMATS) {
      const name = `${stem}-${width}.${format}`;
      try {
        const info = await sharp(absolute)
          .resize({ width, withoutEnlargement: true })
          [format](profile[format])
          .toFile(path.join(dir, name));
        record.variants.push({
          file: name,
          path: `${webBase}/${name}`,
          width: info.width ?? width,
          format,
          bytes: info.size,
        });
      } catch {
        /* One format failing (an AVIF encoder missing from a slim build, a
           disk that filled up) must not cost the other. */
      }
    }
  }

  if (!record.variants.length) record.skipped = "no-encoder";
  return persist(assetPath, record);
}

async function persist(assetPath, record) {
  const doc = await store.update((current) => ({
    ...current,
    version: 1,
    assets: { ...(current.assets ?? {}), [assetPath]: record },
  }));
  return doc.assets[assetPath];
}

/* Summary for the UI: how many widths exist, in which formats, and what the
   whole set weighs. */
export function derivativeSummary(record) {
  if (!record) return null;
  const widths = [...new Set((record.variants ?? []).map((v) => v.width))].sort((a, b) => a - b);
  const formats = [...new Set((record.variants ?? []).map((v) => v.format))];
  const bytes = (record.variants ?? []).reduce((sum, v) => sum + (v.bytes ?? 0), 0);
  return { widths, formats, bytes, count: record.variants?.length ?? 0, skipped: record.skipped };
}
