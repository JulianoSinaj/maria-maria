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

export const SOCIAL_POSTS = [
  {
    img: "/img/aperitivo-sunset.jpg",
    caption: "Aperitivo im Abendlicht",
    tag: "#aperitivo",
  },
  {
    img: "/img/magazin/weinlese.jpg",
    caption: "Weinlese im Süden",
    tag: "#vendemmia",
  },
  {
    img: "/img/pranzo.webp",
    caption: "Pranzo mit Freunden",
    tag: "#pranzo",
  },
  {
    img: "/img/magazin/trauben-hand.jpg",
    caption: "Handverlesen",
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
