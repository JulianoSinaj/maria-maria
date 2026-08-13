/* Erzeugt die responsiven WebP-Varianten + das Inline-LQIP für den
   Geschichte-Hero (die Tavolata unter der Pergola).

   Die Quelle liegt als public/img/magazin/tavolata.jpg vor und misst nur
   915 × 686 px — für eine randlose 100svh-Bühne zu wenig. Wie schon beim
   Wein-Hero (1600 px Quelle, 1920/2560 er Varianten) wird deshalb vorab mit
   Lanczos hochskaliert und nachgeschärft, damit nicht der Browser weich
   hochrechnet. Sobald ein größeres Original nachkommt: SRC austauschen,
   Skript neu laufen lassen — die Breiten unter der Quellbreite werden dann
   automatisch echt herunterskaliert statt hochgerechnet.

   Aufruf: npm run optimize:geschichte-hero */

import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = path.join(process.cwd(), "public", "img", "magazin", "tavolata.jpg");
const OUT_DIR = path.join(process.cwd(), "public", "img", "geschichte");
const BASE = "hero";

/* Das Seitenverhältnis der Quelle (4:3) bleibt erhalten: der Hero schneidet
   per object-cover selbst zu — auf dem Desktop oben/unten, im Hochkant des
   Telefons links/rechts. Ein fest eingebackener Panorama-Schnitt würde dem
   Telefon genau die Höhe nehmen, die es dort braucht. */
const WIDTHS = [640, 1280, 1600, 1920];
const QUALITY = 74;

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function run() {
  await mkdir(OUT_DIR, { recursive: true });

  const original = (await stat(SRC)).size;
  const meta = await sharp(SRC).metadata();
  const report = [];

  for (const w of WIDTHS) {
    const out = path.join(OUT_DIR, `${BASE}-${w}.webp`);
    const upscaled = w > meta.width;

    let pipeline = sharp(SRC).resize({ width: w, kernel: sharp.kernel.lanczos3 });
    /* Nachschärfen nur beim Hochrechnen — herunterskalierte Breiten sind
       von sich aus knackig und würden nur Kanten bekommen. */
    if (upscaled) pipeline = pipeline.sharpen({ sigma: 0.8, m1: 0.6, m2: 2.2 });

    const info = await pipeline.webp({ quality: QUALITY, effort: 6 }).toFile(out);
    report.push(`${w}w=${kb(info.size)}${upscaled ? "↑" : ""}`);
  }

  /* LQIP: 20 px breite WebP-Vorschau — dieselben Einstellungen wie in
     scripts/optimize-heroes.mjs, damit alle Bühnen gleich anlaufen. */
  const lqip = await sharp(SRC).resize({ width: 20 }).webp({ quality: 28, effort: 6 }).toBuffer();

  console.log(`✓ ${path.relative(process.cwd(), SRC)}: ${meta.width}×${meta.height}/${kb(original)}`);
  console.log(`  → ${report.join(" ")}`);
  console.log(`\n  LQIP (${lqip.length} B) — nach components/geschichte/GeschichteHeroPhoto.jsx:\n`);
  console.log(`data:image/webp;base64,${lqip.toString("base64")}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
