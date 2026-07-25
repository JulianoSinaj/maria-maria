/* Erzeugt karten-taugliche Flaschen-Freisteller aus den Packshots.

   front.jpg / back.jpg (1920×1920 bzw. 1440×1920, viel Studiohintergrund)
   → card-front.webp / card-back.webp: eng auf die Flasche beschnitten und
   freigestellt — WebP mit echtem Alpha-Kanal.

   Echtes Alpha statt mix-blend-multiply, weil die Karten die Fotos animieren:
   Framer Motion setzt inline-Transforms, und ein transformiertes Element
   isoliert seinen eigenen Blend-Kontext — der Studiohintergrund bliebe dort
   als Rechteck stehen.

   Aufruf: npm run crop:cards          (überspringt vorhandene card-*.webp)
           npm run crop:cards -- --force  (erzeugt alles neu) */

import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const WINES_DIR = path.join(process.cwd(), "public", "img", "wines");
const FORCE = process.argv.includes("--force");

/* sharp.trim() scheitert am grauen Stoffhintergrund der Rückseiten (Falten,
   Vignette). Stattdessen: Pixel-Scan auf einer verkleinerten Kopie — Rand-
   pixel liefern die Hintergrundfarbe, alles was deutlich davon abweicht ist
   Flasche; deren Bounding-Box wird aufs Original hochgerechnet. */
const SCAN_WIDTH = 400;
const THRESHOLD = 38; // Kanal-Abstand zum Hintergrund: Stofffalten ±15, Kapsel ≥45
const PAD = 0.015; // etwas Luft um die Flasche
const MAX_HEIGHT = 1400;
const QUALITY = 80;

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function bottleBox(src) {
  const { data, info } = await sharp(src)
    .resize({ width: SCAN_WIDTH })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const px = (x, y) => {
    const i = (y * w + x) * c;
    return [data[i], data[i + 1], data[i + 2]];
  };

  /* Hintergrund = Median der Randpixel (oben/unten/links/rechts) */
  const border = [];
  for (let x = 0; x < w; x += 4) border.push(px(x, 0), px(x, h - 1));
  for (let y = 0; y < h; y += 4) border.push(px(0, y), px(w - 1, y));
  const med = (i) => {
    const v = border.map((p) => p[i]).sort((a, b) => a - b);
    return v[v.length >> 1];
  };
  const bg = [med(0), med(1), med(2)];

  /* Maske: alles, was deutlich vom Hintergrund abweicht. Neben der Flasche
     leuchten auch Lichtflecken im Stoff auf — deshalb zählt nicht die ganze
     Maske, sondern nur die zusammenhängende Flaschen-Region: Flood-Fill ab
     der Spalte mit dem längsten vertikalen Treffer-Lauf (der Flaschenkorpus). */
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b] = px(x, y);
      const d = Math.max(Math.abs(r - bg[0]), Math.abs(g - bg[1]), Math.abs(b - bg[2]));
      if (d > THRESHOLD) mask[y * w + x] = 1;
    }
  }

  const runLen = new Int32Array(w);
  let seed = -1, best = 0;
  for (let x = 0; x < w; x++) {
    let run = 0;
    for (let y = 0; y < h; y++) {
      run = mask[y * w + x] ? run + 1 : 0;
      if (run > runLen[x]) runLen[x] = run;
      if (run > best) {
        best = run;
        seed = (y - run + 1) * w + x;
      }
    }
  }
  if (seed < 0) return null; // nichts gefunden — Original behalten

  const rowMin = new Int16Array(h).fill(-1);
  const rowMax = new Int16Array(h).fill(-1);
  const stack = [seed];
  mask[seed] = 2; // 2 = besucht
  while (stack.length) {
    const i = stack.pop();
    const x = i % w, y = (i / w) | 0;
    if (rowMin[y] < 0 || x < rowMin[y]) rowMin[y] = x;
    if (x > rowMax[y]) rowMax[y] = x;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx;
        if (mask[n] === 1) {
          mask[n] = 2;
          stack.push(n);
        }
      }
    }
  }

  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    if (rowMin[y] < 0) continue;
    if (rowMin[y] < minX) minX = rowMin[y];
    if (rowMax[y] > maxX) maxX = rowMax[y];
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  /* Lichtflecken im Stoff können die Flaschen-Region berühren und die Box
     aufblähen. Weinflaschen-Crops liegen bei ~0,26–0,33 Breite/Höhe — ist die
     Box deutlich breiter, wird sie um die Spalten mit den längsten vertikalen
     Läufen (der Flaschenkorpus) neu zentriert und die Höhe nur noch aus
     Zeilen gelesen, die dieses Band schneiden. */
  if ((maxX - minX) / (maxY - minY) > 0.34) {
    const good = [];
    for (let x = 0; x < w; x++) if (runLen[x] >= best * 0.9) good.push(x);
    const cx = (good[0] + good[good.length - 1]) / 2;
    const half = (maxY - minY) * 0.16;
    minX = Math.max(0, Math.round(cx - half));
    maxX = Math.min(w - 1, Math.round(cx + half));
    minY = h;
    maxY = -1;
    for (let y = 0; y < h; y++) {
      if (rowMin[y] < 0 || rowMin[y] > maxX || rowMax[y] < minX) continue;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const meta = await sharp(src).metadata();
  const s = meta.width / w;
  const padX = (maxX - minX) * PAD * 4; // seitlich großzügiger als vertikal
  const padY = (maxY - minY) * PAD;
  const left = Math.max(0, Math.round((minX - padX) * s));
  const top = Math.max(0, Math.round((minY - padY) * s));
  const right = Math.min(meta.width, Math.round((maxX + 1 + padX) * s));
  const bottom = Math.min(meta.height, Math.round((maxY + 1 + padY) * s));
  return {
    box: { left, top, width: right - left, height: bottom - top },
    bg,
    rowMin,
    rowMax,
    clampMinX: minX,
    clampMaxX: maxX,
    scanW: w,
    scanH: h,
    scale: s,
  };
}

/* Alles außerhalb der Flaschen-Silhouette transparent schalten (alpha = 0).
   Echtes Alpha statt mix-blend-multiply, weil die Karten die Fotos animieren:
   ein Element mit Transform isoliert seinen Blend-Kontext, und der
   Studiohintergrund bliebe dort als Rechteck stehen.

   Die Silhouette kommt aus der Flood-Fill-Region (rowMin…rowMax), begrenzt
   aufs Flaschenband clampMinX…clampMaxX: Lichtflecken im Stoff, die die
   Flasche irgendwo berühren, ragen darüber hinaus und werden gekappt.
   Die Zeilenränder werden anschließend geglättet, damit einzelne Ausreißer
   keine Zacken in die Kontur schneiden. */
async function cutout(src, det) {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const s = det.scale;
  const PAD_PX = Math.round(4 * s);

  /* Band aus der Korpusbreite. Ein am Rand angewachsener Lichtfleck im Stoff
     kann über hunderte Zeilen mitlaufen — deshalb taugt weder das Maximum noch
     der Median der Zeilenspannen als Grenze. Stattdessen: die Mittelachse aus
     den schmalsten Zeilen (Hals, garantiert fleckenfrei) und als Halbbreite
     der Median der Spannen, die überhaupt in Frage kommen; das Band liegt
     symmetrisch um die Achse, wie die Flasche selbst. */
  const spans = [];
  for (let sy = 0; sy < det.scanH; sy++) {
    if (det.rowMin[sy] < 0) continue;
    spans.push({ min: det.rowMin[sy], max: det.rowMax[sy], w: det.rowMax[sy] - det.rowMin[sy] });
  }
  const byWidth = [...spans].sort((a, b) => a.w - b.w);
  /* Achse: Mittel der schmalsten 20 % (Flaschenhals — dort wächst kein
     Lichtfleck an, weil rings um den Hals viel Hintergrund liegt) */
  const neck = byWidth.slice(0, Math.max(1, Math.floor(byWidth.length * 0.2)));
  const cx = neck.reduce((s, r) => s + (r.min + r.max) / 2, 0) / neck.length;
  const neckW = neck[neck.length - 1].w;

  /* Korpusbreite: das Perzentil der Zeilenspannen ist unbrauchbar, sobald ein
     Lichtfleck über viele Zeilen angewachsen ist (er verschiebt das Perzentil
     mit). Verlässlich ist die Halsbreite — bei einer 0,75-l-Flasche misst der
     Bauch rund das 2,4-fache davon. Die tatsächlich gemessene Breite gewinnt,
     solange sie unter dieser Schranke bleibt. */
  const bodyCap = neckW * 2.4;
  const measured = byWidth.filter((r) => r.w <= bodyCap);
  const bodyW = measured.length ? measured[measured.length - 1].w : bodyCap;
  const halfW = (bodyW / 2) * 1.1;
  const bandMin = cx - halfW;
  const bandMax = cx + halfW;

  /* Zeilenspannen auf Originalauflösung bringen, aufs Band beschneiden und um
     die Achse symmetrieren: eine stehende Flasche ist links wie rechts gleich
     breit, ein angewachsener Lichtfleck dagegen sitzt nur auf einer Seite.
     Die schmalere der beiden Hälften gibt darum die Zeilenbreite vor. */
  const lo = new Int32Array(H).fill(-1);
  const hi = new Int32Array(H).fill(-1);
  for (let y = 0; y < H; y++) {
    const sy = Math.min(det.scanH - 1, Math.round(y / s));
    if (det.rowMin[sy] < 0) continue;
    const rMin = Math.max(det.rowMin[sy], bandMin);
    const rMax = Math.min(det.rowMax[sy], bandMax);
    if (rMin > rMax) continue;
    const reach = Math.min(cx - rMin, rMax - cx);
    if (reach < 0) continue;
    lo[y] = Math.max(0, Math.round((cx - reach) * s) - PAD_PX);
    hi[y] = Math.min(W - 1, Math.round((cx + reach + 1) * s) + PAD_PX);
  }

  /* Glättung: Median über ein vertikales Fenster. Median statt Maximum —
     das Maximum würde die Breite einer einzelnen Ausreißerzeile (ein am Rand
     angewachsener Lichtfleck) auf alle Nachbarzeilen ausdehnen; der Median
     schließt Lücken, ohne solche Zacken zu übernehmen. */
  const R = Math.max(2, Math.round(6 * s));
  const loS = new Int32Array(H).fill(-1);
  const hiS = new Int32Array(H).fill(-1);
  const midOf = (arr, y) => {
    const v = [];
    for (let k = Math.max(0, y - R); k <= Math.min(H - 1, y + R); k++) {
      if (arr[k] >= 0) v.push(arr[k]);
    }
    if (!v.length) return -1;
    v.sort((a, b) => a - b);
    return v[v.length >> 1];
  };
  for (let y = 0; y < H; y++) {
    const a = midOf(lo, y);
    const b = midOf(hi, y);
    if (a >= 0 && b >= 0) {
      loS[y] = a;
      hiS[y] = b;
    }
  }

  /* RGBA aufbauen: außerhalb der Kontur (und in den Randzonen, die farblich
     noch Hintergrund sind) alpha = 0 */
  const rgba = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    const left = loS[y], right = hiS[y];
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      const o = (y * W + x) * 4;
      rgba[o] = data[i];
      rgba[o + 1] = data[i + 1];
      rgba[o + 2] = data[i + 2];

      let keep = left >= 0 && x >= left && x <= right;
      if (keep && Math.min(x - left, right - x) < PAD_PX * 2) {
        /* Randzone: Stofffalten, die sich zwischen Kontur und Flaschenrand
           drängen, liegen farblich noch auf dem Hintergrund — die Flasche
           selbst hebt sich klar ab und bleibt stehen. */
        const d = Math.max(
          Math.abs(data[i] - det.bg[0]),
          Math.abs(data[i + 1] - det.bg[1]),
          Math.abs(data[i + 2] - det.bg[2])
        );
        if (d <= THRESHOLD) keep = false;
      }
      rgba[o + 3] = keep ? 255 : 0;
    }
  }
  return {
    image: sharp(rgba, { raw: { width: W, height: H, channels: 4 } }),
    bandLeft: Math.max(0, Math.round(bandMin * s) - PAD_PX),
    bandRight: Math.min(W, Math.round(bandMax * s) + PAD_PX),
  };
}

async function cropOne(src, out) {
  const det = await bottleBox(src);
  if (!det) {
    const info = await sharp(src)
      .resize({ height: MAX_HEIGHT, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6, alphaQuality: 90 })
      .toFile(out);
    return info;
  }
  /* cutout liefert das Band zurück, mit dem es freigestellt hat — die Box muss
     demselben Band folgen, sonst bleibt transparenter Rand stehen, wo ein
     Lichtfleck die ursprüngliche Box aufgebläht hatte. */
  const { image, bandLeft, bandRight } = await cutout(src, det);
  const box = {
    ...det.box,
    left: Math.max(det.box.left, bandLeft),
    width: Math.min(det.box.left + det.box.width, bandRight) - Math.max(det.box.left, bandLeft),
  };
  let pipeline = image.extract(box);
  const info = await pipeline
    .resize({ height: MAX_HEIGHT, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6, alphaQuality: 90 })
    .toFile(out);
  return info;
}

async function run() {
  const slugs = (await readdir(WINES_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const slug of slugs) {
    for (const side of ["front", "back"]) {
      const src = path.join(WINES_DIR, slug, `${side}.jpg`);
      const out = path.join(WINES_DIR, slug, `card-${side}.webp`);
      if (!(await exists(src))) {
        console.log(`· ${slug}: kein ${side}.jpg — übersprungen`);
        continue;
      }
      if (!FORCE && (await exists(out))) {
        console.log(`· ${slug}/card-${side}.webp existiert — übersprungen`);
        continue;
      }
      const info = await cropOne(src, out);
      console.log(`✓ ${slug}/card-${side}.webp  ${info.width}×${info.height} · ${kb(info.size)}`);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
