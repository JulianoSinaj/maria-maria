/* The share image of an interview — public/img/og/interview-<slug>.jpg
   ==================================================================
   The same 1200 × 630 recipe as scripts/og-images.mjs (which still renders
   the code-defined pieces on `npm run og`): cover-crop on the region of
   highest attention, mozjpeg at quality 82, 4:4:4 chroma. The route reads
   the file by the same name — see ogImage() in
   app/(site)/[locale]/magazin/interviews/[slug]/page.jsx.

   Written on publish, not on save: a draft has no address to share.

   sharp is a devDependency of the project; Next's file tracing carries it
   into the server bundle of the publish route. If it is ever missing at
   runtime the publish still succeeds — the route falls back to the portrait
   as og:image and the response says why. */

import { promises as fs } from "node:fs";
import path from "node:path";
import { REQUIRED_LOCALE } from "./schema";
import { imageToDisk, OG_DIR } from "./files";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const ogPath = (slug) => `/img/og/interview-${slug}.jpg`;
const ogFile = (slug) => path.join(OG_DIR(), `interview-${slug}.jpg`);

export async function ogExists(slug) {
  return fs.access(ogFile(slug)).then(
    () => true,
    () => false,
  );
}

/** Which photo the teaser card is cut from. The editor may name one; else
    the article portrait, else the first chapter photo, else the pairing
    photo — a landscape survives the 1.91:1 crop better than a portrait. */
export function ogSource(record) {
  const de = record.locales?.[REQUIRED_LOCALE];
  const candidates = [
    record.og,
    record.portrait?.article,
    record.portrait?.src,
    ...(de?.sections ?? []).map((s) => s.media?.src),
    de?.pairing?.media?.src,
  ];
  return candidates.find((c) => typeof c === "string" && c) ?? null;
}

/**
 * Render the share image. Idempotent — overwrites.
 * @returns {Promise<{ ok: boolean, path: string, source: string|null, bytes?: number, error?: string }>}
 */
export async function renderInterviewOg(record) {
  const source = ogSource(record);
  const out = { ok: false, path: ogPath(record.slug), source };
  if (!source) return { ...out, error: "no source image" };

  const srcAbs = imageToDisk(source);
  if (!srcAbs) return { ...out, error: `source outside the image library: ${source}` };
  try {
    await fs.access(srcAbs);
  } catch {
    return { ...out, error: `source file missing: ${source}` };
  }

  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch (err) {
    return { ...out, error: `sharp unavailable: ${err.message}` };
  }

  try {
    const buffer = await sharp(srcAbs)
      .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toBuffer();
    await fs.mkdir(OG_DIR(), { recursive: true });
    await fs.writeFile(ogFile(record.slug), buffer);
    return { ...out, ok: true, bytes: buffer.length };
  } catch (err) {
    return { ...out, error: err.message };
  }
}
