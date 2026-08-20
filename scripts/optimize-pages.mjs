/* Erzeugt responsive WebP-Varianten für alle übrigen Seitenbilder.

   Die drei Hero-Strecken haben eigene Skripte, weil sie eigene Regeln haben:
   optimize-heroes.mjs (Kellerei-Fotos unter public/img/wines/<slug>/hero.jpg)
   und optimize-pairing.mjs (Food-Pairing-Motive) erzeugen zusätzlich Inline-
   LQIPs, weil ihre Bilder über dem Falz stehen und der LCP sind.

   Dieses Skript kümmert sich um den ganzen Rest: Regionen-Kacheln, Magazin-
   Aufmacher, Packshots, Hintergrundmotive. Die stehen alle unter dem Falz und
   laden lazy — sie brauchen kein LQIP, nur vernünftige Breiten. Bis hierher
   lieferte die Startseite drei 1600x900-Regionenbilder à ~125 KB aus, obwohl
   die Kacheln nie breiter als ~420 px werden; das Magazin schickte 1400 px
   breite Aufmacher in 300-px-Karten. Jedes Byte davon lag auf demselben
   Netzwerk wie das Hero-Foto und verzögerte es mit.

   Ergebnis: neben jeder Quelle liegen <name>-640.webp, -1024.webp, -1600.webp
   (nie hochskaliert), und components/media/photoManifest.js merkt sich, welche
   Breiten es je Quellpfad wirklich gibt. <Photo> (components/media/Photo.jsx)
   liest daraus den srcSet; Quellen ohne Manifest-Eintrag rendert es unverändert
   als nacktes <img>. Neue Bilder funktionieren also sofort und werden beim
   nächsten Lauf hier automatisch schneller.

   Aufruf: npm run optimize:pages */

import sharp from "sharp";
import { readdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, "public", "img");
const MANIFEST_OUT = path.join(ROOT, "components", "media", "photoManifest.js");

/* Die Leiter deckt bewusst auch schmale Breiten ab. Die Flaschen-Packshots
   (card-front.webp, 391x1400) sind hochkant: sie stehen in den Wein-Karten
   nie breiter als ~56 px, brachten aber volle 34 KB mit — und das zehnmal je
   Seite, weil jede Seite die Wein-Rail trägt. Eine Leiter, die erst bei 640
   anfängt, hätte für sie gar keine sinnvolle Stufe. */
const WIDTHS = [160, 320, 640, 1024, 1600];
const QUALITY = 72;

/* Unter diesem Gewicht lohnt die Variantenbildung nicht: der zusätzliche
   Request kostet mehr als die gesparten Bytes. */
const MIN_BYTES = 20 * 1024;

/* Diese Verzeichnisse haben eigene Skripte (siehe Kopf) und werden hier
   komplett übersprungen, damit sich die Pipelines nicht überschreiben. */
const SKIP_DIRS = new Set(["food-pairing", "kontakt"]);

/* Erzeugte Varianten erkennen — sonst optimiert der zweite Lauf die Ausgabe
   des ersten und legt hero-1280-640.webp an. Trifft auch die Dateien der
   beiden anderen Skripte (hero-1920.webp, lugana-1280.webp). */
const IS_VARIANT = /-\d{3,4}\.webp$/i;

/* Quellen, die andere Pipelines besitzen oder die als reine Fallback-Originale
   liegen bleiben sollen. */
const SKIP_FILES = [
  /^wines[/][^/]+[/]hero\.jpg$/i, // optimize-heroes.mjs
  /^weine[/]hero\.jpg$/i, // Fallback zu den vorhandenen hero-*.webp
  /^weine[/]occasioni-bg\.jpg$/i, // dito
  /^home[/]hero\.jpg$/i, // dito
  /^regions[/]regionen-hero\.jpg$/i, // Videoposter, wird als .webp ausgeliefert
];

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function run() {
  const manifest = {};
  let before = 0;
  let after = 0;
  let touched = 0;

  for await (const file of walk(IMG_DIR)) {
    const rel = path.relative(IMG_DIR, file).split(path.sep).join("/");

    if (!/\.(jpe?g|png|webp)$/i.test(rel)) continue;
    if (IS_VARIANT.test(rel)) continue;
    if (SKIP_FILES.some((re) => re.test(rel))) continue;

    const size = (await stat(file)).size;
    if (size < MIN_BYTES) continue;

    const meta = await sharp(file).metadata();
    const dir = path.dirname(file);
    /* Endung abschneiden, nicht ersetzen: „region-apulien.webp" wird zu
       „region-apulien-640.webp" und kollidiert nicht mit der Quelle. */
    const stem = path.basename(rel).replace(/\.[^.]+$/, "");

    const made = [];
    const report = [];

    /* Jede Leiterstufe unterhalb der Originalbreite, plus die Originalbreite
       selbst. Nie hochskalieren — und vor allem nie eine Datei als „640w"
       deklarieren, die in Wahrheit nur 391 px breit ist: der Browser glaubt
       dem srcSet und wählte dann für einen 500-px-Slot ein zu kleines Bild.
       Deshalb heißt die oberste Stufe immer nach ihrer echten Breite. */
    const steps = WIDTHS.filter((w) => w < meta.width);
    if (!steps.includes(meta.width)) steps.push(meta.width);

    /* Marken- und Grafikdateien (Logo, Stemma, Jubiläumssiegel) sind PNGs mit
       Alphakanal und harten Kanten. Auf denen erzeugt eine Foto-Quantisierung
       sichtbare Ringe um die Buchstaben — sie bekommen near-lossless, das
       spart gegenüber PNG immer noch deutlich, ohne die Kanten anzufassen. */
    const isGraphic = meta.format === "png" && meta.hasAlpha;
    const encode = isGraphic
      ? { nearLossless: true, quality: 90, effort: 6 }
      : { quality: QUALITY, effort: 6 };

    for (const w of steps) {
      const out = path.join(dir, `${stem}-${w}.webp`);
      const info = await sharp(file)
        .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
        .webp({ ...encode })
        .toFile(out);

      made.push(w);
      report.push(`${w}w=${kb(info.size)}`);
      after += info.size;
    }

    if (!made.length) continue;

    manifest[`/img/${rel}`] = {
      /* Basis ohne Breite und ohne Endung — <Photo> setzt beides zusammen.
         Ein Array aus fertigen URLs wäre größer im Client-Bundle. */
      base: `/img/${path.posix.join(path.posix.dirname(rel), stem)}`,
      widths: made,
    };

    before += size;
    touched += 1;
    console.log(`✓ ${rel}: ${meta.width}px/${kb(size)} → ${report.join(" ")}`);
  }

  const file = `/* AUTOGENERIERT von scripts/optimize-pages.mjs — nicht von Hand bearbeiten.

   Welche WebP-Breiten es je Quellbild wirklich gibt. <Photo> baut daraus den
   srcSet; was hier fehlt, rendert es unverändert als nacktes <img>.

   Bewusst ohne LQIP-Data-URIs: die Bilder hier stehen unter dem Falz und laden
   lazy, ein Blur-Platzhalter wäre nur Ballast im Client-Bundle. Die beiden
   Hero-Pipelines (heroBlur.js, pairingBlur.js) halten ihre LQIPs selbst. */

export const PHOTO_MANIFEST = ${JSON.stringify(manifest, null, 2)};
`;

  await writeFile(MANIFEST_OUT, file, "utf8");

  console.log(`\n→ ${path.relative(ROOT, MANIFEST_OUT)} geschrieben (${touched} Bilder)`);
  console.log(`→ Originale ${kb(before)} → Varianten ${kb(after)} (alle Breiten zusammen)`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
