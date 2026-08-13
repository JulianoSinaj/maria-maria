/* ============================================================================
   GESCHICHTE — Strukturquelle der Seite /geschichte.
   ----------------------------------------------------------------------------
   Hier steht nur noch Struktur: Kapitel-Nummern, Anker-IDs, Bildpfade,
   Link-Ziele, die Rebsorten-Zeilen (Namen, keine Beschriftungen) und die
   Ikonen der Auswahl-Prinzipien. Der sichtbare Text — Stationsnamen, Titel,
   Absätze, Zitate, Bildbeschreibungen — liegt je Sprache in
   content/<sprache>/geschichte.js und wird in
   app/(site)/[locale]/geschichte/page.jsx über die Kapitel-IDs dazugemischt;
   das Kapitel-Menü (StoryChapterNav) bekommt dieselbe Zusammenführung als
   Prop, damit Anker und Beschriftung nie auseinanderlaufen.

   `rebsorten` bleibt bewusst hier: Rebsorten-, Wein- und Ortsnamen
   („Primitivo · Rosso · Salento") werden in keiner Sprache übersetzt.
   ========================================================================== */

export const STORY_CHAPTERS = [
  {
    num: "01",
    id: "anfang",
    img: "/img/aperitivo-sunset.jpg",
  },
  {
    num: "02",
    id: "salento",
    rebsorten: "Primitivo · Rosso · Salento",
    link: { href: "/regionen#apulien" },
    img: "/img/magazin/puglia1.jpg",
  },
  {
    num: "03",
    id: "kampanien",
    rebsorten: "Greco di Tufo DOCG · Falanghina · Aglianico",
    link: { href: "/regionen#kampanien" },
    img: "/img/magazin/campagnia1.jpg",
  },
  {
    num: "04",
    id: "gardasee",
    rebsorten: "Turbiana · Lugana DOC",
    link: { href: "/unsere-weine/lugana" },
    img: "/img/magazin/lagoDG.jpg",
  },
  {
    num: "05",
    id: "duesseldorf",
    link: { href: "/unsere-weine" },
    img: "/img/magazin/abendessen.jpg",
  },
];

/* ---- Kapitel 06 „Die Auswahl" — Text unter `today` im Wörterbuch ---- */
export const STORY_TODAY = { num: "06", id: "auswahl" };

/* Die drei Auswahl-Prinzipien — `value` ist die dekorative Prinzip-Nummer
   (für Screenreader verborgen, die Reihenfolge steckt schon in der Liste),
   `icon` die Ikone der Spalte. Prinzip und Grundsatz stehen unter `stats`
   im Wörterbuch, in derselben Reihenfolge. */
export const STORY_STATS = [
  { icon: "glasses", value: 1 },
  { icon: "grapes", value: 2 },
  { icon: "book", value: 3 },
];
