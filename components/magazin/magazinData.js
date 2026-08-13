/* ============================================================================
   MAGAZIN — Inhaltsquelle der Seite /magazin.
   ----------------------------------------------------------------------------
   Themen, Artikel und Schlagworte lagen vorher als Literale in
   app/magazin/page.jsx. Die Artikelstrecke ist derzeit nicht Teil der Seite
   (siehe Kommentar in page.jsx) — hier stehen deshalb nur die Inhalte, die
   die Seite tatsächlich rendert. So beschreibt das Modul, was zu sehen ist,
   statt Karteileichen zu pflegen.
   ========================================================================== */

/* ---- Bacheca: die Social-Pinnwand. Eine Reihe, vier Motive ---- */
export const SOCIAL_URL = "https://www.instagram.com/mariamaria.wine";
export const SOCIAL_HANDLE = "@mariamaria.wine";

/* Struktur der Pinnwand — Bild, Hashtag und der Schlüssel, unter dem die
   Bildunterschrift je Sprache in content/<sprache>/magazin.js (social.posts)
   steht. Die Hashtags bleiben in jeder Sprache gleich. */
export const SOCIAL_POSTS = [
  {
    key: "aperitivo",
    img: "/img/aperitivo-sunset.jpg",
    tag: "#aperitivo",
  },
  {
    key: "harvest",
    img: "/img/magazin/weinlese.jpg",
    tag: "#vendemmia",
  },
  {
    key: "pranzo",
    img: "/img/pranzo.webp",
    tag: "#pranzo",
  },
  {
    key: "handpicked",
    img: "/img/magazin/trauben-hand.jpg",
    tag: "#handpicked",
  },
];

/* ---- La Cantina: alle Wein-Landingpages als Karten-Galerie ----
   Die Reihenfolge erzählt eine Reise durch die Regionen: erst Apuliens
   Rote und der Rosato, dann Kampanien, zum Schluss der Lugana vom
   Gardasee. Jede Karte trägt das Hero-Foto ihrer Landingpage und führt
   per Klick dorthin. */
export const MAGAZIN_CANTINA_SLUGS = [
  "primitivo-14-5",
  "primitivo-15-5",
  "primitivo-salento",
  "rosato-puglia",
  "il-rosso-aglianico",
  "falanghina",
  "greco-di-tufo",
  "il-bianco-greco-cuvee",
  "lugana",
];

/* ---- Die Weine, um die sich die Geschichten drehen ---- */
export const MAGAZIN_WINE_SLUGS = [
  "primitivo-14-5",
  "lugana",
  "falanghina",
  "il-rosso-aglianico",
  "greco-di-tufo",
];
