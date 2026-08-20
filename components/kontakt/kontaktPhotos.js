/* Die drei Motive der Kontaktseite — nur Struktur, kein Text.

   Die ALT-Texte kommen aus content/<sprache>/kontakt.js (sie sind Sprache),
   hier stehen Dateinamen, Breitenleiter und Bildmaße (sie sind Technik).
   Dasselbe Modul lesen die Seite, die Server-Komponente des Hero-Fotos UND
   das Build-Skript scripts/optimize-kontakt.mjs — deshalb keine React-
   Importe und keine Pfad-Aliase, die Node nicht auflösen könnte.

   Die Quellen liegen als PNG unter public/img/kontakt/ (Handoff 18.08.2026,
   Dateiname des Hero-Motivs laut Handoff: maria-maria-kontakt-gastronomie-
   events-375ml). Daneben legt optimize:kontakt die WebP-Breiten an; die
   Leiter endet ehrlich bei der echten Quellbreite statt bei einer runden
   Zahl, die das Original gar nicht hergibt.

   `sizes` beschreibt die tatsächliche Anzeigebreite: Hero die halbe
   Viewportbreite ab lg (50/50-Split, Handoff §1), Bridge full-bleed,
   FAQ-Motiv ein Drittel der Inhaltsspalte. */

export const KONTAKT_DIR = "/img/kontakt";

export const KONTAKT_PHOTOS = {
  hero: {
    file: "maria-maria-kontakt-gastronomie-events-375ml.png",
    width: 1672,
    height: 941,
    widths: [640, 1024, 1672],
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
  bridge: {
    file: "maria-maria-wein-besondere-momente-lugana-rosato.png",
    width: 1942,
    height: 809,
    widths: [640, 1024, 1600, 1942],
    sizes: "100vw",
  },
  faq: {
    file: "maria-maria-weinberatung-gastronomie-auswahl.png",
    width: 1448,
    height: 1086,
    widths: [480, 960, 1448],
    sizes: "(min-width: 1024px) 34vw, 100vw",
  },
};

export const KONTAKT_PHOTO_KEYS = Object.keys(KONTAKT_PHOTOS);

/* Dateistamm ohne Endung — „foto.png" → „foto" */
export const photoStem = (key) => KONTAKT_PHOTOS[key].file.replace(/\.[^.]+$/, "");

/* Name einer erzeugten Variante: „foto-640.webp" */
export const variantFile = (key, width) => `${photoStem(key)}-${width}.webp`;

/* Alles, was ein <picture> braucht: srcSet der WebP-Breiten, das PNG als
   Fallback für Engines ohne WebP, dazu eine mittlere Breite als `src` für
   Stellen, die (wie das LCP-Bild) bewusst ohne PNG-Fallback auskommen. */
export function photoSources(key) {
  const photo = KONTAKT_PHOTOS[key];
  if (!photo) return null;
  const srcSet = photo.widths.map((w) => `${KONTAKT_DIR}/${variantFile(key, w)} ${w}w`).join(", ");
  const mid = photo.widths[Math.min(1, photo.widths.length - 1)];
  return {
    srcSet,
    sizes: photo.sizes,
    fallback: `${KONTAKT_DIR}/${photo.file}`,
    src: `${KONTAKT_DIR}/${variantFile(key, mid)}`,
    width: photo.width,
    height: photo.height,
  };
}
