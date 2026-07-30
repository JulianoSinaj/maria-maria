/* Akzentpalette der Weinseiten — Champagner/Bordeaux als Rückfall, wenn ein
   Wein weder `wine.accent` noch `wine.moment.accent` mitbringt. Lag vorher
   dreifach kopiert in den einzelnen Sektionen; eine Quelle, damit alle
   Kapitel derselben Seite denselben Ton treffen. */

export const ACCENT_FALLBACK = { base: "#C8B77A", deep: "#8A2B2F", light: "#E3D9B8" };
