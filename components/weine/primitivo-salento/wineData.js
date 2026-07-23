/* Primitivo I.G.P. Salento — content model for the wine landing page.
   Gleiche Form wie wineData.js (Falanghina): dieselben Sektionen, nur andere
   Daten. Technische Werte stammen aus dem Datenblatt "MARIA MARIA PRIMITIVO
   IGP SALENTO".

   PHOTO DROP-IN: Fotos unter public/img/wines/primitivo-salento/ ablegen
   (hero.jpg = Kellerei-Stimmungsfoto mit der Flasche, front.jpg = Packshot,
   back.jpg = Rückenetikett). Solange eine Datei fehlt, den Pfad auf null setzen.

   Fields marked [BESTÄTIGEN] sind plausible, aber nicht aus dem Datenblatt
   belegte Storytelling-Passagen. */

export const PRIMITIVO_SALENTO = {
  slug: "primitivo-salento",
  catalogName: "Primitivo Salento IGP", // key into components/data.js WINES via byName()

  name: "Primitivo IGP Salento",
  eyebrow: "Italienische Boutique-Weine",
  heroTitle: ["Primitivo", "IGP Salento"],
  lede:
    "100 % Primitivo aus Torricella und Lizzano. Alberello-Erziehung ohne Bewässerung, lange Maischestandzeit und zwölf Monate Stahl — reife Frucht mit Tiefgang.",
  /* Akt 2 des gepinnten Heros — drei Worte, die beim Scrollen erscheinen */
  heroWords: ["Intensiv.", "Reif.", "Anhaltend."],

  /* Kurzformen für generische Sektionstexte (sonst greift der Falanghina-Default) */
  shortNameNom: "der Primitivo",
  shortNameGen: "des Primitivo",

  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Unsere Weine", href: "/weine" },
    { label: "Primitivo IGP Salento", href: null },
  ],

  images: {
    /* Packshot & Rückenetikett liegen noch nicht vor — bleiben null, bis die
       Dateien unter public/img/wines/primitivo-salento/ liegen. */
    front: null,
    back: null,
    /* Kellerei-Stimmungsfoto mit der Flasche — trägt den kompletten Kino-Hero */
    hero: "/img/wines/primitivo-salento/hero.jpg",
  },

  /* ---- Schnellfakten (Icon-Leiste unter dem Hero) ---- */
  facts: [
    { icon: "pin", label: "Herkunft", value: "Salento, Apulien" },
    { icon: "grapes", label: "Rebsorte", value: "100 % Primitivo" },
    { icon: "tank", label: "Ausbau", value: "12 Monate Stahl" },
    { icon: "thermometer", label: "Serviertemperatur", value: "16–18 °C" },
  ],

  /* ---- Farb-Kapitel (immersive Typo-Sektion) ---- */
  colorMoment: {
    kicker: "Die Farbe",
    lines: ["Rubinrot.", "Sehr intensiv."],
    text: "Die lange Maischestandzeit zeichnet sich im Glas ab: ein dichtes, sehr intensives Rubinrot, das kaum Licht durchlässt.",
    swatches: [
      { hex: "#6B0F1A", label: "Rubinrot" },
      { hex: "#4A0A15", label: "Dunkle Pflaume" },
      { hex: "#8C2230", label: "Kirschreflex" },
    ],
  },

  /* ---- Der Geschmack: drei gepinnte Kapitel (Auge / Nase / Gaumen) ---- */
  taste: [
    {
      key: "farbe",
      icon: "eye",
      kicker: "Farbe",
      title: "Sehr intensives Rubinrot",
      text: "Ein dichtes, sehr intensives Rubinrot — die Farbe eines Weins, der lange auf den Schalen gelegen hat.",
      tone: "#6B0F1A",
    },
    {
      key: "duft",
      icon: "nose",
      kicker: "Duft",
      title: "Pflaume und Trockenfrüchte",
      text: "Ein komplexes Bukett mit deutlichen Noten von Pflaume und Trockenfrüchten — die reife Seite des Salento.",
      tone: "#8C2230",
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Intensiv, anhaltend und zugänglich",
      text: "Intensiv und lang anhaltend im Geschmack, dabei angenehm zugänglich und von unkomplizierter Trinkfreude.",
      tone: "#A8452F",
    },
  ],

  /* ---- Im Detail (Bento / technisches Datenblatt) ---- */
  detail: [
    { label: "Bezeichnung", value: "Primitivo I.G.P. Salento", span: "wide" },
    { label: "Rebsorte", value: "100 % Primitivo" },
    { label: "Herkunft", value: "Torricella und Lizzano, Salento" },
    { label: "Erziehung", value: "Ausschließlich Alberello, ohne Bewässerung" },
    {
      label: "Vinifikation",
      value:
        "Alkoholische Gärung bei kontrollierter Temperatur zur Bewahrung von Aromen und Farbe, mit 7–8 Tagen Kontakt auf den Schalen. Anschließend eine leichte Pressung der Schalen.",
      span: "wide",
    },
    { label: "Ausbau", value: "12 Monate im Stahltank bis zur Abfüllung" },
    { label: "Alkoholgehalt", value: "14,5 % vol." },
    { label: "Serviertemperatur", value: "16–18 °C" },
    { label: "Füllmenge", value: "750 ml" },
    { label: "Hinweis", value: "Enthält Sulfite" },
  ],

  /* ---- Die Geschichte ---- */
  story: {
    kicker: "Die Geschichte",
    title: "Alberello, ohne Bewässerung",
    paragraphs: [
      /* [BESTÄTIGEN] Storytelling zur Erziehungsform */
      "Die Trauben stammen aus den Primitivo-Weinbergen von Torricella und Lizzano — erzogen ausschließlich als Alberello, dem niedrigen Buschbaum Süditaliens, und ohne jede Bewässerung. Die Rebe holt sich das Wasser selbst, tief aus dem Boden.",
      "Die lange Maischestandzeit auf den Schalen ist der Schlüssel: Sie bringt die deutlichen Noten reifer Frucht hervor, die diesen Wein prägen. Danach zwölf Monate im Stahl — kein Holz, das dazwischentritt, nur die Frucht selbst.",
    ],
    quote: {
      text: "Ein Wein, der nichts verstecken muss: reife Frucht, klare Herkunft, offener Charakter.",
      attribution: "Maria & Maria",
    },
  },

  /* ---- Der Ort (Luogo) ---- */
  place: {
    kicker: "Die Herkunft",
    title: "Salento",
    region: "apulien", // ItalyMap region key
    text: "Der Salento liegt im Absatz des italienischen Stiefels, zwischen zwei Meeren. Heiße, trockene Sommer und kalkhaltige Böden bringen hier Primitivo mit dichter, reifer Frucht hervor — Torricella und Lizzano liegen mitten in diesem Herzstück.",
    stats: [
      { label: "Region", value: "Salento, Apulien" },
      { label: "Gemeinden", value: "Torricella und Lizzano" },
      { label: "Klassifikation", value: "Primitivo I.G.P. Salento" },
      { label: "Erziehung", value: "Alberello, ohne Bewässerung" },
    ],
    photo: "/img/region-apulien.jpg",
    photoAlt: "Weinlandschaft im Salento, Apulien",
    chip: { title: "Salento", subtitle: "Apulien · Italien" },
  },

  /* ---- Passt zu (Food-Pairing, aus dem Datenblatt) ---- */
  pairing: {
    kicker: "Passt zu",
    title: "Fleisch und Käse",
    text: "Ein Wein für den gedeckten Tisch: Seine Intensität hält kräftigen Gerichten stand, seine Zugänglichkeit macht ihn zum unkomplizierten Begleiter.",
    photo: "/img/dinner.jpg",
    photoAlt: "Gedeckter Tisch mit Fleisch, Käse und Rotwein",
    items: [
      { icon: "plate", title: "Rotes Fleisch", text: "Braten, Schmorgerichte und Gegrilltes" },
      { icon: "plate", title: "Gereifter Käse", text: "Pecorino, Caciocavallo und Hartkäse" },
      { icon: "plate", title: "Kräftige Primi", text: "Herzhafte Pasta mit Fleischsauce" },
      { icon: "glasses", title: "Salumi", text: "Aufschnitt und würzige Wurstwaren" },
    ],
  },

  /* ---- Häufige Fragen ---- */
  faq: [
    {
      q: "Wie schmeckt der Primitivo IGP Salento?",
      a: "Intensiv und lang anhaltend im Geschmack, dabei von unkomplizierter Trinkfreude und angenehm zugänglich. In der Nase ein komplexes Bukett mit Noten von Pflaume und Trockenfrüchten.",
    },
    {
      q: "Aus welchen Trauben besteht dieser Wein?",
      a: "Zu 100 % aus Primitivo. Die Trauben stammen aus den Weinbergen der Gemeinden Torricella und Lizzano im Salento.",
    },
    {
      q: "Was bedeutet „I.G.P. Salento“?",
      a: "IGP steht für „Indicazione Geografica Protetta“, die geschützte geografische Angabe. Der Salento ist die Halbinsel im Süden Apuliens — der Absatz des italienischen Stiefels.",
    },
    {
      q: "Was heißt Alberello-Erziehung?",
      a: "Alberello ist die traditionelle Buscherziehung Süditaliens: niedrige, freistehende Stöcke ohne Drahtrahmen. Hier wird sie ausschließlich und ohne Bewässerung praktiziert, sodass die Rebe ihr Wasser selbst aus der Tiefe holt.",
    },
    {
      q: "Zu welchen Gerichten passt der Primitivo?",
      a: "Zu Fleisch und Käse — von Braten und Gegrilltem über gereiften Hartkäse bis zu kräftigen Pastagerichten und Salumi.",
    },
    {
      q: "Wie sollte der Primitivo serviert werden?",
      a: "Bei 16 bis 18 °C im Rotweinglas. Eine knappe Stunde vorher öffnen lässt die reife Frucht deutlicher hervortreten.",
    },
    {
      q: "Wie wird der Primitivo ausgebaut?",
      a: "Die alkoholische Gärung läuft bei kontrollierter Temperatur, um Aromen und Farbe zu bewahren, mit sieben bis acht Tagen Kontakt auf den Schalen. Nach einer leichten Pressung reift der Wein zwölf Monate im Stahltank bis zur Abfüllung.",
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen der Primitivo gefällt",
    names: ["Primitivo 14,5", "Primitivo 15,5", "Il Rosso – Aglianico"],
  },

  /* ---- Abschluss-CTA ---- */
  cta: {
    title: "Noch mehr entdecken?",
    text: "Entdecken Sie alle unsere Weine im offiziellen Maria Maria Shop.",
    button: { label: "Zum offiziellen Shop", href: "/shop" },
  },

  /* ---- Seitennavigation (Apple-Stil Subnav) ---- */
  subnav: [
    { label: "Überblick", href: "#ueberblick" },
    { label: "Geschmack", href: "#geschmack" },
    { label: "Herkunft", href: "#herkunft" },
    { label: "Details", href: "#details" },
    { label: "Fragen", href: "#fragen" },
  ],
};
