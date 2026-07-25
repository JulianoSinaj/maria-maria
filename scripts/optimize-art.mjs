/* Konvertiert die Kunstdrucke unter public/img/art/ in komprimierte WebP-
   Varianten (max. 1600px Breite, Qualität 76). Die Originale bleiben liegen,
   der Code referenziert die .webp-Dateien.

   Aufruf: npm run optimize:art */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ART_DIR = path.resolve(process.cwd(), "public/img/art");
const MAX_WIDTH = 1600;
const QUALITY = 76;

const files = (await readdir(ART_DIR)).filter((f) => /\.jpe?g$/i.test(f));
if (!files.length) {
  console.log("Keine JPEGs in public/img/art gefunden.");
  process.exit(0);
}

for (const file of files) {
  const src = path.join(ART_DIR, file);
  const out = path.join(ART_DIR, file.replace(/\.jpe?g$/i, ".webp"));
  const img = sharp(src);
  const meta = await img.metadata();
  const width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);
  await img.resize({ width, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
  const before = (await stat(src)).size;
  const after = (await stat(out)).size;
  console.log(
    `${file} → ${path.basename(out)}  ${(before / 1024).toFixed(0)} kB → ${(after / 1024).toFixed(0)} kB`
  );
}
