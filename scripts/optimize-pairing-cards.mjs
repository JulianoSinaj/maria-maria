/* Erzeugt responsive WebP-Varianten + Inline-LQIP für die fünf Magazine Cards
   des Food-Pairing-Kapitels (/magazin, Capitolo II).

   Gleiche Pipeline wie scripts/optimize-pairing.mjs, nur für
   public/img/food-pairing/cards: die Original-PNGs (1448 px, ~2 MB) bleiben
   unangetastet als Fallback liegen; daneben entstehen drei WebP-Breiten je
   Motiv und ein winziges Blur-Placeholder-Bild, dessen Data-URI nach
   components/magazin/pairingCardsBlur.js geschrieben wird.

   Die Ausgabedateien heißen nach dem Karten-Schlüssel (aperitivo-960.webp)
   und nicht nach dem Quell-PNG — dessen Name trägt Leerzeichen, Umlaute und
   Halbgeviertstriche, die im srcSet erst kodiert werden müssten.

   Aufruf: npm run optimize:pairing-cards  (nötig, wenn ein Karten-Motiv
   dazukommt oder ausgetauscht wird) */

import sharp from "sharp";
import { writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const CARDS_DIR = path.join(ROOT, "public", "img", "food-pairing", "cards");
const BLUR_OUT = path.join(ROOT, "components", "magazin", "pairingCardsBlur.js");

/* Die Dateiliste kommt aus dem Modul, das auch die Seite benutzt — eine
   Quelle, kein zweiter Schlüssel→Datei-Katalog, der auseinanderlaufen kann. */
const { PAIRING_CARDS, CARD_WIDTHS, cardVariantFile } = await import(
  pathToFileURL(path.join(ROOT, "components", "magazin", "pairingCards.js")).href
);

const QUALITY = 72;

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function run() {
  const blurMap = {};
  let before = 0;
  let after = 0;

  for (const card of PAIRING_CARDS) {
    const src = path.join(CARDS_DIR, card.file);

    let original;
    try {
      original = (await stat(src)).size;
    } catch {
      console.log(`· ${card.key}: ${card.file} fehlt — übersprungen`);
      continue;
    }
    before += original;

    const meta = await sharp(src).metadata();
    const report = [];

    for (const w of CARD_WIDTHS) {
      /* Nie hochskalieren: schmalere Originale liefern nur die Breiten, die
         sie auch wirklich hergeben — die schmalste Breite immer, damit auch
         ein kleines Motiv einen gültigen srcSet-Eintrag behält. */
      if (meta.width < w && w !== CARD_WIDTHS[0]) continue;

      const out = path.join(CARDS_DIR, cardVariantFile(card.key, w));
      const info = await sharp(src)
        .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(out);
      report.push(`${w}w=${kb(info.size)}`);
      after += info.size;
    }

    /* LQIP: 20 px breit, stark komprimiert — landet als Data-URI direkt im
       Markup und deckt die Karte ab, bis das echte Foto da ist. */
    const lqip = await sharp(src)
      .resize({ width: 20 })
      .webp({ quality: 28, effort: 6 })
      .toBuffer();
    blurMap[card.key] = `data:image/webp;base64,${lqip.toString("base64")}`;

    console.log(
      `✓ ${card.key}: ${meta.width}px/${kb(original)} → ${report.join(" ")} · lqip ${lqip.length} B`
    );
  }

  const file = `/* AUTOGENERIERT von scripts/optimize-pairing-cards.mjs — nicht von Hand bearbeiten.

   Winzige (20 px breite) WebP-Vorschauen der Magazine-Card-Fotos als Data-URI.
   Sie stehen im server-gerenderten Markup und füllen die Karte sofort,
   während das volle Foto noch lädt — kein weißer Blitz beim Scrollen ins
   Kapitel.

   Getrennt von pairingBlur.js, weil die Quellen verschieden sind: dort
   public/img/food-pairing (Landingpage-Motive), hier der Unterordner cards. */

export const CARD_BLUR = ${JSON.stringify(blurMap, null, 2)};

export const cardBlurFor = (key) => CARD_BLUR[key] ?? null;
`;

  await writeFile(BLUR_OUT, file, "utf8");
  console.log(`\n→ ${path.relative(ROOT, BLUR_OUT)} geschrieben (${Object.keys(blurMap).length} Karten)`);
  console.log(
    `→ Auslieferung je Karte: ${kb(before / PAIRING_CARDS.length)} PNG → ` +
      `${kb(after / PAIRING_CARDS.length / CARD_WIDTHS.length)} WebP (Durchschnitt pro Breite)`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
