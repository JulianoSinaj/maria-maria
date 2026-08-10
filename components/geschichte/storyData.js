/* ============================================================================
   GESCHICHTE — Inhaltsquelle der Seite /geschichte.
   ----------------------------------------------------------------------------
   Die Erzählung in sechs Kapiteln: der Anfang in Deutschland mit
   italienischen Wurzeln, die drei Weinregionen der Reise, die Ankunft in
   Düsseldorf und die Auswahl-Prinzipien. Die Seite (app/geschichte/page.jsx)
   ordnet nur noch — Texte, Bilder und Sprungziele stehen hier. Das
   Kapitel-Menü (StoryChapterNav) und die Kapitel selbst lesen aus derselben
   Liste, damit Anker und Beschriftung nie auseinanderlaufen.

   Bildtexte je Kapitel: `micro` ist das italienische Kurzwort AUF dem Foto
   („La tavola lunga"), `caption` die Didascalia DARUNTER — zwei Ebenen aus
   dem Redaktionsbriefing, die StoryChapter getrennt setzt. `rebsorten` ist
   die Wein-Tag-Zeile über der CTA.
   ========================================================================== */

export const STORY_CHAPTERS = [
  {
    num: "01",
    id: "anfang",
    label: "Der Anfang · 2019",
    title: "Von Deutschland aus. Mit italienischen Wurzeln.",
    paragraphs: [
      "Seit 2019 ist Maria Maria in Deutschland aktiv. Die Marke hat ihren Sitz in Düsseldorf – ihre persönliche und kulturelle Herkunft führt nach Lizzano im Salento.",
      "Aus der Verbindung zweier Generationen entstand eine Auswahl, in der jede Flasche für einen Ort, eine Rebsorte und eine bewusste Entscheidung steht.",
    ],
    quote:
      "„Der Wein beginnt bei seiner Herkunft – und findet seinen Platz dort, wo Menschen ihn miteinander teilen.“",
    img: "/img/aperitivo-sunset.jpg",
    alt: "Gedeckter Tisch mit Weingläsern und einer originalen Maria-Maria-Weinflasche",
    micro: "La tavola lunga",
    caption: "Italienische Wurzeln, seit 2019 in Deutschland weitergetragen.",
  },
  {
    num: "02",
    id: "salento",
    label: "Salento · Lizzano",
    title: "Wo die Wurzeln liegen",
    paragraphs: [
      "Im Salento beginnt die Weinsprache von Maria Maria. Rund um Lizzano prägen rote Erde, mediterrane Vegetation, Licht und die Nähe zum Ionischen Meer die Landschaft.",
      "Hier liegen die persönlichen Wurzeln des Namens und der Ausgangspunkt einer Auswahl, in der der Primitivo für Wärme, Tiefe und eine unverwechselbare Herkunft steht.",
    ],
    rebsorten: "Primitivo · Rosso · Salento",
    link: { label: "Salento und unsere Primitivo-Weine entdecken", href: "/regionen#apulien" },
    img: "/img/magazin/puglia1.jpg",
    alt: "Rote Erde und Weinberge bei Lizzano im Salento",
    micro: "Terra rossa",
    caption: "Reben, mediterranes Licht und die Nähe zum Ionischen Meer.",
  },
  {
    num: "03",
    id: "kampanien",
    label: "Kampanien · Irpinien",
    title: "Autochthone Rebsorten. Unverwechselbare Herkunft.",
    paragraphs: [
      "Mit Kampanien erweitert sich die Geschichte um eine Weinlandschaft, die von Höhenlagen, Mikroklimata und autochthonen Rebsorten geprägt ist.",
      "Greco di Tufo DOCG, Falanghina und Aglianico stehen für eigenständige Charaktere und eine traditionsreiche Weinkultur.",
      "Der fachliche Austausch mit dem Önologen Francesco De Stefano vertieft den Blick auf Rebsorten, Herkunft und Entscheidungen.",
    ],
    rebsorten: "Greco di Tufo DOCG · Falanghina · Aglianico",
    link: { label: "Irpinien und seine Weine entdecken", href: "/regionen#kampanien" },
    img: "/img/magazin/campagnia1.jpg",
    alt: "Hügelige Weinlandschaft der Irpinia in Kampanien",
    micro: "Vento di collina",
    caption: "Höhenlagen und autochthone Rebsorten prägen Irpiniens Weinlandschaft.",
  },
  {
    num: "04",
    id: "gardasee",
    label: "Gardasee · Lugana DOC",
    title: "Eleganz, die aus dem Ort kommt",
    paragraphs: [
      "Am Südufer des Gardasees begegnet Maria Maria einer anderen Ausdrucksform italienischer Weinkultur.",
      "Auf kalkhaltigen, lehmreichen Moränenböden und unter dem Einfluss des milden Seeklimas entsteht aus der Rebsorte Turbiana ein Wein mit Klarheit, Frische und eleganter Struktur. Der Lugana DOC ergänzt die Auswahl um eine Herkunft, deren Charakter nicht laut sein muss, um in Erinnerung zu bleiben.",
    ],
    rebsorten: "Turbiana · Lugana DOC",
    link: { label: "Lugana und den Gardasee entdecken", href: "/unsere-weine/lugana" },
    img: "/img/magazin/lagoDG.jpg",
    alt: "Weinberge des Lugana-Gebiets am Gardasee",
    micro: "Luce sul Garda",
    caption: "Moränenböden, Turbiana und milde Seebrisen.",
  },
  {
    num: "05",
    id: "duesseldorf",
    label: "Seit 2019 · Düsseldorf",
    title: "In Deutschland zu Hause. Über Grenzen hinweg gedacht.",
    paragraphs: [
      "Die Marke Maria Maria ist seit 2019 in Deutschland aktiv und hat ihren Sitz in Düsseldorf. Von hier aus werden persönlich ausgewählte italienische Weine für Menschen in Deutschland und weiteren Ländern zugänglich.",
      "Düsseldorf ist der Standort der Marke – nicht die Grenze ihrer Auswahl. Entscheidend bleiben Herkunft, Charakter und die Geschichte hinter jedem Wein.",
    ],
    link: { label: "Unsere Weinauswahl entdecken", href: "/unsere-weine" },
    img: "/img/magazin/abendessen.jpg",
    alt: "Gedeckter Abendtisch mit Maria-Maria-Rotwein in der Abenddämmerung",
    micro: "Dall’Italia, oltre i confini",
  },
];

/* ---- Kapitel 06 „Die Auswahl": was einen Wein zu Maria Maria führt ----
   Der Intro-Satz gehört sichtbar vor die Prinzipien: er stellt klar, dass
   nicht Düsseldorf (und kein Trend) über die Auswahl entscheidet. */
export const STORY_TODAY = {
  num: "06",
  id: "auswahl",
  label: "Die Auswahl",
  title: "Was einen Wein zu Maria Maria führt",
  intro:
    "Nicht eine einzelne Stadt und nicht ein kurzfristiger Trend bestimmen die Auswahl. Entscheidend sind Herkunft, Charakter und die Art, wie ein Wein den Moment am Tisch begleitet.",
};

/* Die drei Auswahl-Prinzipien — `value` ist die dekorative Prinzip-Nummer
   (für Screenreader verborgen, die Reihenfolge steckt schon in der Liste),
   `icon` die Ikone der Spalte. */
export const STORY_STATS = [
  {
    icon: "glasses",
    value: 1,
    label: "Herkunft vor Beliebigkeit",
    detail: "Jeder Wein muss seine Region, seine Rebsorte und seinen eigenen Charakter erkennen lassen.",
  },
  {
    icon: "grapes",
    value: 2,
    label: "Charakter vor Trend",
    detail: "Keine austauschbaren Etiketten, sondern Weine mit einer klaren Identität und einer Herkunft, die spürbar bleibt.",
  },
  {
    icon: "book",
    value: 3,
    label: "Genuss, der geteilt wird",
    detail: "Ein Wein findet seinen Sinn in den Momenten, Speisen und Begegnungen, die er begleitet.",
  },
];
