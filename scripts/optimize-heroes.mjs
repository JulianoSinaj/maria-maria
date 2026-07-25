/* Erzeugt responsive WebP-Varianten + Inline-LQIP für jedes Wein-Hero-Foto.

   Die Original-hero.jpg (2000–2500 px, 240–400 KB) bleibt als Fallback liegen;
   daneben entstehen drei WebP-Breiten und ein winziges Blur-Placeholder-Bild,
   dessen Data-URI in components/weine/heroBlur.js geschrieben wird.

   Aufruf: npm run optimize:heroes  (nur nötig, wenn neue hero.jpg dazukommen) */

import sharp from "sharp";
import { readdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const WINES_DIR = path.join(process.cwd(), "public", "img", "wines");
const BLUR_OUT = path.join(process.cwd(), "components", "weine", "heroBlur.js");

/* Breiten decken Handy (1x/2x), Tablet und Desktop ab. Mehr als 1920 px
   bringt auf dem object-cover-Hero optisch nichts mehr. */
const WIDTHS = [640, 1280, 1920];
const QUALITY = 72;

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function run() {
  const slugs = (await readdir(WINES_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const blurMap = {};

  for (const slug of slugs) {
    const src = path.join(WINES_DIR, slug, "hero.jpg");
    if (!(await exists(src))) {
      console.log(`· ${slug}: kein hero.jpg — übersprungen`);
      continue;
    }

    const original = (await stat(src)).size;
    const pipeline = sharp(src);
    const meta = await pipeline.metadata();
    const sizes = [];

    for (const w of WIDTHS) {
      /* Nie hochskalieren: schmalere Originale liefern nur die Breiten,
         die sie auch wirklich hergeben. */
      if (meta.width < w && w !== WIDTHS[0]) continue;

      const out = path.join(WINES_DIR, slug, `hero-${w}.webp`);
      const info = await sharp(src)
        .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(out);
      sizes.push(`${w}w=${kb(info.size)}`);
    }

    /* LQIP: 20 px breit, stark komprimiert — landet als Data-URI direkt im
       Markup und deckt die Bühne ab, bis das echte Foto da ist. */
    const lqip = await sharp(src)
      .resize({ width: 20 })
      .webp({ quality: 28, effort: 6 })
      .toBuffer();
    blurMap[slug] = `data:image/webp;base64,${lqip.toString("base64")}`;

    console.log(
      `✓ ${slug}: ${meta.width}px/${kb(original)} → ${sizes.join(" ")} · lqip ${lqip.length} B`
    );
  }

  const file = `/* AUTOGENERIERT von scripts/optimize-heroes.mjs — nicht von Hand bearbeiten.

   Winzige (20 px breite) WebP-Vorschauen der Hero-Fotos als Data-URI. Sie
   stehen im server-gerenderten Markup und füllen die Bühne sofort, während
   das volle Foto noch lädt — kein weißer Blitz mehr beim Seitenaufruf. */

export const HERO_BLUR = ${JSON.stringify(blurMap, null, 2)};

export const heroBlurFor = (slug) => HERO_BLUR[slug] ?? null;
`;

  await writeFile(BLUR_OUT, file, "utf8");
  console.log(`\n→ ${path.relative(process.cwd(), BLUR_OUT)} geschrieben (${Object.keys(blurMap).length} Weine)`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
