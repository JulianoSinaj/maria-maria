/* Le occasioni — die fünf Anlässe des Food-Pairing-Kapitels (/magazin).

   Inhalt nach der Redaktionsvorgabe 08/2026 („testi da mettere sulle Magazine
   Cards"): je Anlass genau ein Gericht und sein Wein (die Empfehlung) — die
   Gericht-Zeile `dish` ist zugleich der Untertitel des Anlass-Schalters,
   wortgleich mit der Vorlage — und `alternatives` — genau drei weitere Weine der Kollektion, die zum
   Anlass passen (drei füllen die Seitenspalte der Antwort-Karte; über die
   fünf Anlässe verteilt ist so jeder Wein der Cantina von hier erreichbar). Die Alternativen tragen nur Slug und ein kurzes Gericht-
   Stichwort (`hint`); der Weinname kommt zur Laufzeit aus dem Katalog
   (components/data.js), damit hier kein zweiter Namensbestand entsteht.
   Der Katalog wird bewusst NICHT hier importiert, sondern erst in der
   Selector-Komponente — dieses Modul lädt auch das Optimize-Skript in Node,
   und data.js hängt am Webpack-Alias.

   Die Begründung, warum ein Paar funktioniert, lebt auf der Landingpage des
   Weins in der Sektion „Der Maria-Maria-Moment" — dorthin führt die Auswahl;
   hier wird kein Fließtext gepflegt, der dort dann doppelt stünde.

   Foto-Pipeline wie bei den Landingpage-Motiven (weine/pairingPhoto.js): die
   Original-PNGs in public/img/food-pairing/cards behalten ihre sprechenden
   Namen (Leerzeichen, Umlaute, Halbgeviertstriche) und bleiben nur als
   <img>-Fallback; ausgeliefert werden WebP-Breiten mit URL-sicherem
   Schlüssel-Namen (aperitivo-960.webp), erzeugt von
   scripts/optimize-pairing-cards.mjs. Das Skript importiert diese Liste —
   im Projekt gibt es damit nur eine Schlüssel→Datei-Quelle.

   Der Import aus pairingPhoto.js steht relativ und mit Endung, nicht als
   @/-Alias: das Optimize-Skript lädt dieses Modul direkt in Node, und Node
   löst weder den Alias noch endungslose ESM-Specifier auf. */

import { encodePairingFile } from "../weine/pairingPhoto.js";

/* `caption` ist die Bild-Schlagzeile der Antwort-Karte — Wein und Gericht in
   einem Satz, wortgleich mit den Titeln, unter denen die fünf Motive
   entstanden sind (Vorlage der Redaktion, Beispielbild 08/2026). */
export const PAIRING_CARDS = [
  {
    key: "aperitivo",
    anlass: "Aperitivo",
    dish: "Burrata · Tomaten · Focaccia",
    wine: "Rosato Puglia IGP",
    caption: "Italienischer Aperitivo mit Rosato, Burrata und Focaccia",
    slug: "rosato-puglia",
    file: "Italienischer Aperitivo mit Rosato, Burrata und Focaccia.png",
    alternatives: [
      { slug: "falanghina", hint: "Makrele all’acqua pazza" },
      { slug: "il-bianco-greco-cuvee", hint: "Paccheri mit Garnelen" },
      { slug: "lugana", hint: "Cremiges Fischrisotto" },
    ],
  },
  {
    key: "pasta-abend",
    anlass: "Pasta-Abend",
    dish: "Spaghetti alle Vongole",
    wine: "Greco di Tufo DOCG",
    caption: "Spaghetti alle Vongole mit Greco di Tufo DOCG",
    slug: "greco-di-tufo",
    file: "Spaghetti alle Vongole mit Greco di Tufo DOCG.png",
    alternatives: [
      { slug: "primitivo-14-5", hint: "Orecchiette mit Braciole-Ragù" },
      { slug: "il-bianco-greco-cuvee", hint: "Paccheri mit Garnelen" },
      { slug: "falanghina", hint: "Makrele all’acqua pazza" },
    ],
  },
  {
    key: "fisch-meer",
    anlass: "Fisch & Meer",
    dish: "Fischrisotto · Zitrone · Kräuter",
    wine: "Lugana DOC",
    caption: "Lugana DOC mit cremigem Fischrisotto am Gardasee",
    slug: "lugana",
    file: "Lugana DOC mit cremigem Fischrisotto am Gardasee.png",
    alternatives: [
      { slug: "falanghina", hint: "Makrele all’acqua pazza" },
      { slug: "greco-di-tufo", hint: "Spaghetti alle Vongole" },
      { slug: "il-bianco-greco-cuvee", hint: "Paccheri mit Garnelen" },
    ],
  },
  {
    key: "grillabend",
    anlass: "Grillabend",
    dish: "Involtini · Rosmarin · Grillgemüse",
    wine: "Il Rosso · Aglianico",
    caption: "Aglianico zum Grillabend – Fleischröllchen und Rosmarin",
    slug: "il-rosso-aglianico",
    file: "Aglianico zum Grillabend – Fleischröllchen, Rosmarin und Glut.png",
    alternatives: [
      { slug: "primitivo-salento", hint: "Bombette vom Grill" },
      { slug: "primitivo-14-5", hint: "Orecchiette mit Braciole-Ragù" },
      { slug: "rosato-puglia", hint: "Burrata mit Focaccia" },
    ],
  },
  {
    key: "dinner",
    anlass: "Dinner mit Gästen",
    dish: "Geschmorte Rinderbacke · Kartoffelcreme",
    wine: "Primitivo di Manduria DOP 15,5",
    caption: "Primitivo di Manduria mit geschmorter Rinderbacke",
    slug: "primitivo-15-5",
    file: "Primitivo di Manduria mit geschmorter Rinderbacke.png",
    alternatives: [
      { slug: "il-rosso-aglianico", hint: "Involtini vom Grill" },
      { slug: "primitivo-salento", hint: "Bombette vom Grill" },
      { slug: "greco-di-tufo", hint: "Spaghetti alle Vongole" },
    ],
  },
];

/* Alle fünf Motive liegen 1448×1086 (4:3) vor. Die Maße stehen im Markup,
   damit beim Laden nichts springt (CLS). */
export const CARD_PHOTO_SIZE = { width: 1448, height: 1086 };

const BASE = "/img/food-pairing/cards";

/* 480 deckt schmale Viewports bei DPR 1, 960 Handy-Retina und Tablet,
   1448 ist die native Breite — mehr gibt das Original nicht her.
   Muss zu scripts/optimize-pairing-cards.mjs passen; das Skript importiert
   diese Liste, damit beide Seiten nicht auseinanderlaufen können. */
export const CARD_WIDTHS = [480, 960, 1448];

/* Das Foto steht in der Antwort-Karte: ab lg in der linken 1.55fr-Spalte
   (~50 % des Viewports innerhalb von max-w-content), mobil volle Breite. */
export const CARD_SIZES = "(min-width: 1024px) 50vw, 92vw";

/* Dateiname einer optimierten Variante — Schlüssel statt Original-Dateiname,
   aus demselben Grund wie bei pairingVariantFile: srcSet trennt am Komma,
   und die Originalnamen sind alles andere als URL-sicher. */
export function cardVariantFile(key, width) {
  return `${key}-${width}.webp`;
}

/* URL des Original-PNGs — steht nur noch als <img>-Fallback im <picture>. */
export function cardPhotoSrc(card) {
  return `${BASE}/${encodePairingFile(card.file)}`;
}

/* srcSet über die optimierten WebP-Breiten. */
export function cardSrcSet(card) {
  return CARD_WIDTHS.map((w) => `${BASE}/${cardVariantFile(card.key, w)} ${w}w`).join(", ");
}
