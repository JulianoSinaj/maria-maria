/* Erzeugt dunkeltaugliche Flaschen-Freisteller für das Datenblatt.

   card-front.webp (aus crop-cards.mjs) trägt binäres Alpha und behält innerhalb
   der Kontur einen 4–8 px breiten, hellen Saum Studiohintergrund — auf den
   Creme-Karten unsichtbar, auf der Espresso-Tafel des Datenblatts ein weißer
   Rand wie bei einem Aufkleber.

   → sheet-front.webp: derselbe Freisteller, aber entsäumt und mit weicher
   Kante. Verfahren (Decontamination):
   1. Luma-gesteuerte Erosion — helle, farbneutrale Pixel, die an Transparenz
      grenzen, werden abgetragen (max. SAUM_PASSES Ringe). Der Saum ist
      neutral-hell, die Flaschenkante dunkel bzw. farbig — die Erosion frisst
      den Saum und stoppt am Glas. Etiketten liegen tiefer und bleiben stehen.
   2. Ein unbedingter Erosions-Ring gegen dunkelgraue Saumreste.
   3. Alpha weichzeichnen und zusammenziehen (Feder statt Treppenkante).

   Aufruf: npm run crop:sheet           (überspringt vorhandene sheet-*.webp)
           npm run crop:sheet -- --force  (erzeugt alles neu) */

import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const WINES_DIR = path.join(process.cwd(), "public", "img", "wines");
const FORCE = process.argv.includes("--force");

const SAUM_PASSES = 6; // maximale Saumbreite in Pixeln, die abgetragen wird
const SAUM_LUMA = 165; // heller als das → Kandidat für Studiohintergrund
const SAUM_NEUTRAL = 26; // Kanalabstand: Saum ist grau/weiß, Glas ist farbig
const QUALITY = 82;

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const kb = (n) => `${Math.round(n / 1024)} KB`;

function defringe(rgba, W, H) {
  const a = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) a[i] = rgba[i * 4 + 3];

  const touchesHole = (buf, x, y) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) return true; // Bildrand zählt als Loch
        if (buf[ny * W + nx] === 0) return true;
      }
    }
    return false;
  };

  /* 1. Luma-gesteuerte Erosion — Doppelpuffer, damit jeder Durchlauf genau
     einen Ring abträgt statt in Leserichtung durchzufressen. */
  for (let pass = 0; pass < SAUM_PASSES; pass++) {
    const prev = a.slice();
    let eroded = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (prev[i] === 0 || !touchesHole(prev, x, y)) continue;
        const o = i * 4;
        const r = rgba[o], g = rgba[o + 1], b = rgba[o + 2];
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const neutral = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
        if (luma > SAUM_LUMA && neutral < SAUM_NEUTRAL) {
          a[i] = 0;
          eroded++;
        }
      }
    }
    if (!eroded) break;
  }

  /* 2. Ein unbedingter Ring — dunkelgraue Reste des Saums direkt an der Kante. */
  {
    const prev = a.slice();
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (prev[i] !== 0 && touchesHole(prev, x, y)) a[i] = 0;
      }
    }
  }

  /* 3. Feder: zweimal 3×3-Mittel übers Alpha, dann zusammenziehen — die
     Treppenkante wird weich, ohne dass die Kontur sichtbar wächst. */
  let soft = a;
  for (let round = 0; round < 2; round++) {
    const src = soft;
    soft = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let sum = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
            sum += src[ny * W + nx];
            n++;
          }
        }
        soft[y * W + x] = sum / n;
      }
    }
  }
  for (let i = 0; i < W * H; i++) {
    rgba[i * 4 + 3] = Math.max(0, Math.min(255, (soft[i] - 110) * 3));
  }
  return rgba;
}

async function sheetOne(src, out) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = defringe(Buffer.from(data), info.width, info.height);
  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: QUALITY, effort: 6, alphaQuality: 95 })
    .toFile(out);
}

async function run() {
  const slugs = (await readdir(WINES_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const slug of slugs) {
    const src = path.join(WINES_DIR, slug, "card-front.webp");
    const out = path.join(WINES_DIR, slug, "sheet-front.webp");
    if (!(await exists(src))) {
      console.log(`· ${slug}: kein card-front.webp — übersprungen`);
      continue;
    }
    if (!FORCE && (await exists(out))) {
      console.log(`· ${slug}/sheet-front.webp existiert — übersprungen`);
      continue;
    }
    const info = await sheetOne(src, out);
    console.log(`✓ ${slug}/sheet-front.webp  ${info.width}×${info.height} · ${kb(info.size)}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
