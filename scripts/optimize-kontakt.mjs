/* Erzeugt responsive WebP-Varianten + Inline-LQIP für die drei Motive der
   Kontaktseite (Hero, Brand Bridge, FAQ-Bild).

   Gleiche Pipeline wie scripts/optimize-pairing-cards.mjs: die Original-PNGs
   unter public/img/kontakt/ (1,7–2,1 MB je Motiv) bleiben unangetastet als
   Fallback liegen; daneben entstehen die WebP-Breiten aus
   components/kontakt/kontaktPhotos.js und ein winziges Blur-Placeholder-Bild
   je Motiv, dessen Data-URI nach components/kontakt/kontaktBlur.js geschrieben
   wird. Das Hero-Motiv ist der LCP der Seite — ohne LQIP stünde dort bis zum
   Eintreffen des Fotos ein cremefarbenes Loch.

   scripts/optimize-pages.mjs überspringt den Ordner kontakt/ bewusst, damit
   sich die beiden Pipelines nicht gegenseitig Dateien anlegen.

   Aufruf: npm run optimize:kontakt  (nötig, wenn ein Motiv dazukommt oder
   ausgetauscht wird) */

import sharp from "sharp";
import { writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "public", "img", "kontakt");
const BLUR_OUT = path.join(ROOT, "components", "kontakt", "kontaktBlur.js");

/* Dateiliste und Breitenleiter kommen aus dem Modul, das auch die Seite
   benutzt — eine Quelle, kein zweiter Katalog, der auseinanderlaufen kann. */
const { KONTAKT_PHOTOS, KONTAKT_PHOTO_KEYS, variantFile } = await import(
  pathToFileURL(path.join(ROOT, "components", "kontakt", "kontaktPhotos.js")).href
);

const QUALITY = 72;

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function run() {
  const blurMap = {};

  for (const key of KONTAKT_PHOTO_KEYS) {
    const photo = KONTAKT_PHOTOS[key];
    const src = path.join(SRC_DIR, photo.file);

    let original;
    try {
      original = (await stat(src)).size;
    } catch {
      console.log(`· ${key}: ${photo.file} fehlt — übersprungen`);
      continue;
    }

    const meta = await sharp(src).metadata();
    if (meta.width !== photo.width || meta.height !== photo.height) {
      /* Die Maße stehen als width/height-Attribute im Markup (CLS). Weichen
         Quelle und Katalog ab, stimmt das Seitenverhältnis im Layout nicht
         mehr — lieber laut scheitern als stillschweigend springen. */
      throw new Error(
        `${key}: ${photo.file} ist ${meta.width}x${meta.height}, kontaktPhotos.js erwartet ${photo.width}x${photo.height}`
      );
    }

    const report = [];
    for (const w of photo.widths) {
      if (w > meta.width) {
        console.log(`· ${key}: ${w}w übersteigt die Quellbreite ${meta.width} — übersprungen`);
        continue;
      }
      const out = path.join(SRC_DIR, variantFile(key, w));
      const info = await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(out);
      report.push(`${w}w=${kb(info.size)}`);
    }

    /* LQIP: 20 px breit, stark komprimiert — landet als Data-URI direkt im
       Markup und deckt die Fläche ab, bis das echte Foto da ist. */
    const lqip = await sharp(src)
      .resize({ width: 20 })
      .webp({ quality: 28, effort: 6 })
      .toBuffer();
    blurMap[key] = `data:image/webp;base64,${lqip.toString("base64")}`;

    console.log(`✓ ${key}: ${meta.width}px/${kb(original)} → ${report.join(" ")} · lqip ${lqip.length} B`);
  }

  const file = `/* AUTOGENERIERT von scripts/optimize-kontakt.mjs — nicht von Hand bearbeiten.

   Winzige (20 px breite) WebP-Vorschauen der drei Kontaktseiten-Motive als
   Data-URI. Sie stehen im server-gerenderten Markup und füllen die Fläche
   sofort, während das volle Foto noch lädt — kein cremefarbener Blitz im
   Hero (LCP) und kein leerer Rahmen beim Scrollen in Bridge und FAQ. */

export const KONTAKT_BLUR = ${JSON.stringify(blurMap, null, 2)};

export const kontaktBlurFor = (key) => KONTAKT_BLUR[key] ?? null;
`;

  await writeFile(BLUR_OUT, file, "utf8");
  console.log(`\n→ ${path.relative(ROOT, BLUR_OUT)} geschrieben (${Object.keys(blurMap).length} Motive)`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
