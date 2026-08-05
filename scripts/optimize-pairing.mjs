/* Erzeugt responsive WebP-Varianten + Inline-LQIP für jedes Food-Pairing-Foto.

   Diese Fotos sind der LCP der neun Wein-Landingpages (HeroPhoto) und kehren
   weiter unten in der Sektion „Der Maria-Maria-Moment" zurück (PairingScene).
   Sie lagen bis hierher als 1774 px breite PNGs mit ~3 MB pro Datei im
   Auslieferungspfad — 27 MB für neun Motive, und jeder Seitenaufruf zog eines
   davon in voller Größe. Genau das war das lange Aufblenden des Hero-Fotos.

   Die Original-PNGs bleiben unangetastet als Fallback liegen; daneben
   entstehen drei WebP-Breiten je Motiv und ein winziges Blur-Placeholder-Bild,
   dessen Data-URI in components/weine/pairingBlur.js geschrieben wird.

   Warum eine eigene Datei statt heroBlur.js: heroBlur.js gehört
   scripts/optimize-heroes.mjs, das aus public/img/wines/<slug>/hero.jpg
   generiert. Die Werte dort wurden beim Wechsel auf die Pairing-Motive einmal
   von Hand passend gemacht — der nächste optimize:heroes-Lauf hätte sie
   stillschweigend wieder auf die Kellerei-Fotos zurückgesetzt. Zwei Quellen,
   zwei Dateien, keine stille Kollision.

   Die Ausgabedateien heißen nach dem Wein-Slug (falanghina-1280.webp) und
   nicht nach dem Quell-PNG: dessen Name trägt Leerzeichen, Halbgeviertstriche,
   Umlaute, Kommata und typografische Anführungszeichen, die im srcSet-Attribut
   erst kodiert werden müssten — und ein srcSet trennt seine Kandidaten
   ausgerechnet am Komma. Slug-Namen sind URL-sicher und brauchen keine
   Kodierung (siehe encodePairingFile in pairingPhoto.js, das nur noch den
   Fallback-Pfad auf die Original-PNGs betrifft).

   Aufruf: npm run optimize:pairing  (nötig, wenn neue Pairing-Motive dazu-
   kommen oder ein bestehendes ausgetauscht wird) */

import sharp from "sharp";
import { writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const PAIRING_DIR = path.join(ROOT, "public", "img", "food-pairing");
const BLUR_OUT = path.join(ROOT, "components", "weine", "pairingBlur.js");

/* Die Dateiliste kommt aus dem Modul, das auch die Seiten benutzen — eine
   Quelle, kein zweiter Slug→Datei-Katalog, der auseinanderlaufen kann. */
const { PAIRING_FILE, PAIRING_WIDTHS, pairingVariantFile } = await import(
  pathToFileURL(path.join(ROOT, "components", "weine", "pairingPhoto.js")).href
);

const QUALITY = 72;

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function run() {
  const slugs = Object.keys(PAIRING_FILE).sort();
  const blurMap = {};
  let before = 0;
  let after = 0;

  for (const slug of slugs) {
    const src = path.join(PAIRING_DIR, PAIRING_FILE[slug]);

    let original;
    try {
      original = (await stat(src)).size;
    } catch {
      console.log(`· ${slug}: ${PAIRING_FILE[slug]} fehlt — übersprungen`);
      continue;
    }
    before += original;

    const meta = await sharp(src).metadata();
    const report = [];

    for (const w of PAIRING_WIDTHS) {
      /* Nie hochskalieren: schmalere Originale liefern nur die Breiten, die
         sie auch wirklich hergeben — die schmalste Breite immer, damit auch
         ein kleines Motiv einen gültigen srcSet-Eintrag behält. */
      if (meta.width < w && w !== PAIRING_WIDTHS[0]) continue;

      const out = path.join(PAIRING_DIR, pairingVariantFile(slug, w));
      const info = await sharp(src)
        .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(out);
      report.push(`${w}w=${kb(info.size)}`);
      after += info.size;
    }

    /* LQIP: 20 px breit, stark komprimiert — landet als Data-URI direkt im
       Markup und deckt die Bühne ab, bis das echte Foto da ist. */
    const lqip = await sharp(src)
      .resize({ width: 20 })
      .webp({ quality: 28, effort: 6 })
      .toBuffer();
    blurMap[slug] = `data:image/webp;base64,${lqip.toString("base64")}`;

    console.log(
      `✓ ${slug}: ${meta.width}px/${kb(original)} → ${report.join(" ")} · lqip ${lqip.length} B`
    );
  }

  const file = `/* AUTOGENERIERT von scripts/optimize-pairing.mjs — nicht von Hand bearbeiten.

   Winzige (20 px breite) WebP-Vorschauen der Food-Pairing-Fotos als Data-URI.
   Sie stehen im server-gerenderten Markup und füllen die Hero-Bühne sofort,
   während das volle Foto noch lädt — kein weißer Blitz beim Seitenaufruf.

   Getrennt von heroBlur.js, weil die Quellen verschieden sind: dort
   public/img/wines/<slug>/hero.jpg, hier public/img/food-pairing. */

export const PAIRING_BLUR = ${JSON.stringify(blurMap, null, 2)};

export const pairingBlurFor = (slug) => PAIRING_BLUR[slug] ?? null;
`;

  await writeFile(BLUR_OUT, file, "utf8");
  console.log(`\n→ ${path.relative(ROOT, BLUR_OUT)} geschrieben (${Object.keys(blurMap).length} Weine)`);
  console.log(
    `→ Auslieferung je Seite: ${kb(before / slugs.length)} PNG → ` +
      `${kb(after / slugs.length / PAIRING_WIDTHS.length)} WebP (Durchschnitt pro Breite)`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
