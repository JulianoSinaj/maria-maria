/* ============================================================================
   MAGAZIN — Inhaltsquelle der Seite /magazin.
   ----------------------------------------------------------------------------
   Themenwelten, Artikel, Schlagworte und die Social-Pinnwand lagen vorher als
   Literale in app/magazin/page.jsx. Dieselben Artikel standen dort in zwei
   Formen nebeneinander (LATEST und POPULAR), mit abweichenden Titeln für
   denselben Text — die Seite konnte auseinanderlaufen, ohne dass es auffällt.

   Jetzt gilt: ein Artikel, ein Objekt. Die Seite leitet ihre Listen daraus ab
   (FEATURED, LATEST, POPULAR), statt sie zu wiederholen.

   Feldreferenz ARTICLES
   ---------------------
   id        stabiler Schlüssel (kebab-case) — React-Key und späterer Slug
   cat       Themenwelt; muss zu einem `cat` aus THEMES passen
   title     Überschrift der Karte
   excerpt   1 Satz Anriss
   minutes   Lesedauer als Zahl — die Anzeige formatiert sie (readingTime)
   img       Pfad im Photo-Manifest (components/media/photoManifest.js)
   alt       Bildbeschreibung; leer nur bei rein dekorativer Verwendung
   featured  true = Aufmacher der Seite (genau einer)
   popular   true = erscheint in „Beliebte Artikel" der Seitenleiste

   Solange es keine Artikelrouten (/magazin/<id>) gibt, tragen die Karten
   bewusst KEIN href: ein Link auf „#" ist für Tastatur und Crawler eine
   Sackgasse. Sobald die Route existiert, bekommt sie hier ein `href` und die
   Karten werden in page.jsx automatisch wieder klickbar.
   ========================================================================== */

import { GrapeVine, Plate, Mountains, Book, Sun } from "@/components/Icons";

/* ---- Themenwelten: die fünf Wege durch das Magazin ---- */
export const THEMES = [
  {
    cat: "Weinwissen",
    sub: "Wissen vertiefen",
    icon: GrapeVine,
    img: "/img/magazin/trauben-hand.jpg",
    alt: "Hände halten eine frisch geerntete Weintraube",
  },
  {
    cat: "Food Pairing",
    sub: "Perfekt kombiniert",
    icon: Plate,
    img: "/img/magazin/abendessen.jpg",
    alt: "Gedeckter Tisch mit Wein und italienischen Speisen",
  },
  {
    cat: "Regionen",
    sub: "Italien entdecken",
    icon: Mountains,
    img: "/img/magazin/weinlese.jpg",
    alt: "Weinberg in der Abendsonne während der Lese",
  },
  {
    cat: "Geschichten",
    sub: "Hinter den Kulissen",
    icon: Book,
    img: "/img/magazin/handverlesen.jpg",
    alt: "Handverlesene Trauben in einer Kiste",
  },
  {
    cat: "Genussmomente",
    sub: "Inspiration genießen",
    icon: Sun,
    img: "/img/aperitivo-sunset.jpg",
    alt: "Aperitivo mit Weingläsern im Abendlicht",
  },
];

/* ---- die Artikel: eine Liste, aus der sich alle Ausspielungen ableiten ---- */
export const ARTICLES = [
  {
    id: "maria-moment-zuhause",
    cat: "Geschichten",
    title: "Der Maria-Moment zuhause",
    excerpt:
      "Warum die besonderen Momente oft ganz einfach sind – und wie Wein sie noch schöner macht.",
    minutes: 5,
    img: "/img/magazin/weinkeller.jpg",
    alt: "Winzer prüft ein Glas Rotwein zwischen Barriquefässern im Keller",
    featured: true,
    popular: true,
  },
  {
    id: "was-passt-zu-primitivo",
    cat: "Weinwissen",
    title: "Was passt zu Primitivo?",
    excerpt: "Tipps für harmonische Kombinationen mit Aromen, die begeistern.",
    minutes: 4,
    img: "/img/magazin/trauben-hand.jpg",
    alt: "Hände halten eine frisch geerntete Weintraube",
    popular: true,
  },
  {
    id: "lugana-und-fisch",
    cat: "Food Pairing",
    title: "Lugana und Fisch – eine elegante Kombination",
    excerpt: "Frische, Mineralität und feine Aromen im perfekten Zusammenspiel.",
    minutes: 4,
    img: "/img/magazin/pranzo.jpg",
    alt: "Gedeckter Mittagstisch mit Weißwein und Fischgericht",
  },
  {
    id: "apulien-sonne-reben-charakter",
    cat: "Regionen",
    title: "Apulien: Sonne, Reben, Charakter",
    excerpt: "Eine Reise in das Herz Süditaliens und seine unverwechselbaren Weine.",
    minutes: 6,
    img: "/img/magazin/weinlese.jpg",
    alt: "Weinberg in der Abendsonne während der Lese",
    popular: true,
  },
  {
    id: "sommerabend-auf-italienisch",
    cat: "Genussmomente",
    title: "Sommerabend auf Italienisch",
    excerpt: "Leichte Gerichte, gute Gespräche und der richtige Wein dazu.",
    minutes: 3,
    img: "/img/magazin/abendessen.jpg",
    alt: "Gedeckter Tisch mit Wein und italienischen Speisen",
  },
  {
    id: "wein-und-kaese",
    cat: "Food Pairing",
    title: "Wein & Käse – Klassiker neu gedacht",
    excerpt: "Welche Käsesorten welchen Wein tragen – und warum die Regel „je reifer, desto roter“ zu kurz greift.",
    minutes: 5,
    img: "/img/magazin/handverlesen.jpg",
    alt: "Handverlesene Trauben in einer Kiste",
    popular: true,
  },
];

/* Abgeleitete Ausspielungen — die Seite rechnet nicht selbst. */
export const FEATURED_ARTICLE = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];
export const LATEST_ARTICLES = ARTICLES;
export const POPULAR_ARTICLES = ARTICLES.filter((a) => a.popular);

/* „4 Min. Lesedauer" — eine Stelle, an der die Lesedauer Text wird. */
export function readingTime(minutes) {
  return `${minutes} Min. Lesedauer`;
}

/* ---- Filter der Seitenleiste ---- */
export const KATEGORIEN = ["Alle Themen", ...THEMES.map((t) => t.cat)];
export const LESEDAUER = ["Alle", "1–3 Min.", "4–6 Min.", "7+ Min."];

export const TAGS = [
  "Primitivo",
  "Falanghina",
  "Apulien",
  "Food Pairing",
  "Verkostung",
  "Aglianico",
  "Süditalien",
  "Aperitivo",
  "Lugana",
  "Terroir",
];

/* ---- Die Weine, um die sich die Artikel drehen ---- */
export const MAGAZIN_WINE_SLUGS = [
  "primitivo-14-5",
  "lugana",
  "falanghina",
  "il-rosso-aglianico",
  "greco-di-tufo",
];

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
