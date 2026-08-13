/* Erzeugt die Teaserbilder fürs Teilen — public/img/og/*.jpg

   Warum überhaupt eigene Dateien? Ein Link auf diese Seite wird in WhatsApp,
   Slack, iMessage, LinkedIn und X aufgeklappt, und jeder dieser Dienste
   verlangt dasselbe: ein Bild, dessen Maße er OHNE es zu laden aus dem
   <head> ablesen kann, im Seitenverhältnis 1,91 : 1. Ein hochformatiger
   Packshot wird dort mittig beschnitten — aus der Flasche wird ein
   Etikettenausschnitt. Vor diesem Skript hatte die Seite gar kein OG-Bild;
   `twitter:card = summary_large_image` stand im Kopf und zeigte auf nichts.

   Warum keine dynamische Erzeugung über next/og? ImageResponse rendert pro
   Anfrage (oder pro Build) React zu einem Bild und braucht dafür die
   Schriftdateien als Buffer — bei Google-Fonts über next/font heißt das ein
   Netzabruf im Build. Neununddreißig statische JPEGs aus vorhandener
   Fotografie sind schneller, offline reproduzierbar und zeigen echte Bilder
   statt generierter Textkacheln.

   JPEG, nicht WebP: Die älteren Scraper (WhatsApp, einige Mailclients)
   verstehen WebP im og:image bis heute nicht zuverlässig.

   Aufruf:  npm run og
   Das Skript ist idempotent — es überschreibt und schadet nicht, wenn es
   mehrfach läuft. Neue Weine brauchen keinen Eingriff: Es liest das
   Wein-Register. */

import { mkdir, access, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "img", "og");

/* Facebooks Empfehlung, von allen übrigen Diensten übernommen. Kleiner wird
   unscharf hochskaliert, deutlich größer nur langsamer geladen. */
const WIDTH = 1200;
const HEIGHT = 630;

/* Die Marken-Motive für die Seiten ohne eigenes Produktfoto. `focus` steuert,
   welcher Teil des Bildes den Schnitt überlebt — bei 1,91 : 1 fällt bei
   einem Querformat wenig, bei einem Hochformat viel weg, und der Automatik
   ist der Bildinhalt egal. */
const PAGES = [
  { name: "default", src: "img/home/hero.jpg", focus: "attention" },
  { name: "collection", src: "img/weine-hero.jpg", focus: "attention" },
  { name: "shop", src: "img/aperitivo-sunset.jpg", focus: "attention" },
  /* /geschichte und /magazin gaben ihr Motiv schon vorher als og:image an —
     aber mit den Maßen 1200 × 630, die es nie hatte: stilllife.jpg misst
     700 × 676, weinkeller.jpg 641 × 403. Scraper, die den Angaben glauben,
     zerren ein nahezu quadratisches Foto auf Breitformat; die anderen
     schneiden blind mittig. Beide Quellen bleiben erhalten, weil die
     Bildbeschreibungen in content/<sprache>/meta.js genau sie beschreiben — sie
     bekommen hier nur endlich den Zuschnitt, den sie vorgeben zu haben. */
  { name: "geschichte", src: "img/stilllife.jpg", focus: "attention" },
  { name: "magazin", src: "img/magazin/weinkeller.jpg", focus: "attention" },
];

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

/* Der Zuschnitt selbst. `fit: cover` füllt den Rahmen und schneidet den
   Überstand weg; `position: attention` sucht dabei die Region mit der
   höchsten Sättigung und Kantenzahl — bei Flaschenfotos zuverlässig die
   Flasche, nicht der leere Hintergrund. */
async function render(srcAbs, outAbs, focus = "attention") {
  const position = focus === "attention" ? sharp.strategy.attention : focus;

  const buffer = await sharp(srcAbs)
    .resize(WIDTH, HEIGHT, { fit: "cover", position })
    /* mozjpeg bei Qualität 82: der Punkt, an dem ein Foto dieser Größe
       optisch verlustfrei bleibt und die Datei unter den ~300 KB liegt, ab
       denen manche Scraper die Vorschau abbrechen. */
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();

  await writeFile(outAbs, buffer);
  return buffer.length;
}

async function main() {
  await mkdir(path.join(OUT, "wines"), { recursive: true });

  const jobs = [...PAGES];

  /* Die Slugs kommen aus public/img/wines/ und NICHT aus dem Wein-Register.
     Das Register ist Quellcode für den Bundler: Es importiert ohne
     Dateiendung (`./lugana/wineData`), was Node im ESM-Modus nicht auflöst —
     ein Standalone-Skript kann es nicht laden. Das Bildverzeichnis trägt
     dieselben neun Namen und ist ohnehin das, wovon dieses Skript abhängt.
     Ein neuer Wein bringt seinen Ordner mit und wird automatisch erfasst. */
  const winesDir = path.join(PUBLIC, "img", "wines");
  const slugs = (await readdir(winesDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const slug of slugs) {
    jobs.push({
      name: path.join("wines", slug),
      /* Das Kellerei-Stimmungsfoto ist quer und trägt den Zuschnitt am
         besten. Fehlt es, greift der Packshot. */
      src: `img/wines/${slug}/hero.jpg`,
      fallback: `img/wines/${slug}/front.jpg`,
      focus: "attention",
    });
  }

  let made = 0;
  let skipped = 0;

  for (const job of jobs) {
    let src = path.join(PUBLIC, job.src);
    if (!(await exists(src))) {
      src = job.fallback ? path.join(PUBLIC, job.fallback) : null;
      if (!src || !(await exists(src))) {
        console.warn(`  übersprungen  ${job.name} — Quelle fehlt (${job.src})`);
        skipped += 1;
        continue;
      }
    }

    const out = path.join(OUT, `${job.name}.jpg`);
    const bytes = await render(src, out, job.focus);
    console.log(`  ${job.name}.jpg  ${(bytes / 1024).toFixed(0)} KB`);
    made += 1;
  }

  console.log(`\n${made} Teaserbilder in public/img/og/${skipped ? `, ${skipped} übersprungen` : ""}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
