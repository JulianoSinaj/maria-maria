/* Gallery categories — client-safe (no fs). The scanner in scan.js and the
   admin UI share this list so a tab can never show a category the API
   doesn't produce.

   Note on "logo": the brief calls for vector brand logos, but the repo holds
   no SVG assets — logo.png, stemma.png and aniversario.png are raster. The
   tab carries what exists; the hint says so. */

export const GALLERY_CATEGORIES = [
  { key: "landscape", label: "Felder & Landschaft", hint: "Regionen, Weinberge, Terroir" },
  { key: "lifestyle", label: "Balkon & Lifestyle", hint: "Terrasse, Momente, Magazin" },
  { key: "bottle", label: "Flaschen-Renders", hint: "Packshots je Wein" },
  { key: "bundle", label: "9er-Showcase", hint: "Paket-Kompositionen" },
  { key: "logo", label: "Marken-Logos", hint: "Wortmarke & Stemma (PNG)" },
];

export const GALLERY_KEYS = GALLERY_CATEGORIES.map((c) => c.key);
