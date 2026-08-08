/* ============================================================================
   GESCHICHTE — Inhaltsquelle der Seite /geschichte.
   ----------------------------------------------------------------------------
   Die Erzählung in sechs Kapiteln: der Anfang in Italien, die drei
   Weinregionen der Reise, die Ankunft in Düsseldorf und der Stand heute.
   Die Seite (app/geschichte/page.jsx) ordnet nur noch — Texte, Bilder und
   Sprungziele stehen hier. Das Kapitel-Menü (StoryChapterNav) und die
   Kapitel selbst lesen aus derselben Liste, damit Anker und Beschriftung
   nie auseinanderlaufen.
   ========================================================================== */

export const STORY_CHAPTERS = [
  {
    num: "01",
    id: "anfang",
    label: "Der Anfang",
    title: "Wo alles begann",
    paragraphs: [
      "Italien. Familie. Lange Tische und echte Gastfreundschaft — hier begann meine Liebe zum Wein. Nicht im Lehrbuch, sondern im Alltag. Im Gespräch mit Winzern, am Tisch mit Freunden, im Vertrauen auf Geschmack und Instinkt.",
      "So wurde aus einer Leidenschaft ein Versprechen: Weine zu finden, die Menschen verbinden und besondere Momente unvergesslich machen.",
    ],
    img: "/img/aperitivo-sunset.jpg",
    alt: "Freunde am langen Tisch beim Aperitivo im Abendlicht — wo die Liebe zum Wein begann",
    caption: "La tavola lunga — Gastfreundschaft als Anfang von allem.",
  },
  {
    num: "02",
    id: "salento",
    label: "Salento",
    title: "Eine Begegnung, die etwas verändert",
    paragraphs: [
      "Salento hat mich mit seiner Weite, seinem Licht und seiner Bodenständigkeit gepackt. Hier habe ich Winzer getroffen, die mit Herz und Überzeugung arbeiten. Weine, die ehrlich sind und ihre Herkunft spürbar machen.",
    ],
    link: { label: "Die Wurzeln unserer Reise.", href: "/regionen#apulien" },
    img: "/img/magazin/puglia1.jpg",
    alt: "Trulli zwischen Olivenbäumen und Trockenmauern im Abendlicht des Salento",
    caption: "Trulli, Olivenbäume, rote Erde — das Licht des Südens.",
  },
  {
    num: "03",
    id: "gardasee",
    label: "Lago di Garda",
    title: "Ein Zwischenstopp, der blieb",
    paragraphs: [
      "Am Gardasee habe ich den Lugana entdeckt — mineralisch, elegant und einzigartig. Eine Rebsorte und Region, die meine Sicht auf italienische Weißweine erweitert und perfekt zu meiner Auswahlphilosophie passt.",
    ],
    link: { label: "Lugana & Gardasee entdecken.", href: "/unsere-weine/lugana" },
    img: "/img/magazin/lagoDG.jpg",
    alt: "Rebzeilen über dem Südufer des Gardasees im Morgenlicht",
    caption: "Das Südufer des Gardasees — Heimat des Lugana.",
  },
  {
    num: "04",
    id: "campania",
    label: "Campania",
    title: "Wo aus Nähe zum Wein echtes Verständnis wurde",
    paragraphs: [
      "In Kampanien habe ich echte Charaktere in der Geschichte von Irpinia kennengelernt. Greco, Falanghina und Aglianico zeigen, wie Tradition und Innovation eine Region prägen.",
    ],
    link: { label: "Mehr über die Menschen und ihre Weine.", href: "/regionen#kampanien" },
    img: "/img/magazin/campagnia1.jpg",
    alt: "Weinberge Kampaniens über dem Meer, am Horizont der Vesuv",
    caption: "Vulkanböden, alte Rebsorten — das Erbe Kampaniens.",
  },
  {
    num: "05",
    id: "duesseldorf",
    label: "Düsseldorf",
    title: "Ausgewählt für Düsseldorf. Für Menschen, die guten Wein bewusst erleben.",
    paragraphs: [
      "Maria Maria ist keine Weinbar, sondern eine kuratierte Auswahl besonderer italienischer Weine, bewusst für Düsseldorf und NRW ausgewählt. Für Genießer, Gastgeber und alle, die Wert auf Herkunft, Stil und Qualität legen.",
    ],
    link: { label: "Mehr über unsere Auswahl.", href: "/unsere-weine" },
    img: "/img/magazin/abendessen.jpg",
    alt: "Gedeckter Abendtisch mit Maria-Maria-Rotwein in der Abenddämmerung",
    caption: "Angekommen — bewusster Genuss, mitten im Alltag.",
  },
];

/* ---- Kapitel 06 „Heute": die Auswahl in Zahlen ---- */
export const STORY_TODAY = {
  num: "06",
  id: "heute",
  label: "Heute",
  title: "Eine kleine Auswahl mit persönlicher Handschrift",
  footer:
    "Unsere Auswahl wächst bewusst und mit Bedacht. Immer mit dem Ziel, Weine zu finden, die uns begeistern — und Sie.",
};

export const STORY_STATS = [
  {
    icon: "glasses",
    value: 9,
    label: "ausgewählte Weine",
    detail: "Sorgfältig kuratiert.",
  },
  {
    icon: "grapes",
    value: 3,
    label: "Weinregionen",
    detail: "Salento, Lago di Garda, Campania.",
  },
  {
    icon: "book",
    prefix: "seit",
    value: 2019,
    plain: true /* Jahreszahl steht — sie zählt nicht hoch */,
    label: "Aus Leidenschaft entstanden.",
  },
  {
    icon: "sun",
    text: "für bewusste Genussmomente",
    label: "Mit Herkunft und Haltung.",
  },
];
