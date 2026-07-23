/* Rosato Negroamaro IGP Salento — content model for the wine landing page.
   Gleiche Form wie wineData.js (Falanghina): dieselben Sektionen, nur andere
   Daten. Technische Werte stammen aus dem Datenblatt
   "MARIA MARIA — ROSATO NEGROAMARO IGP SALENTO".

   PHOTO DROP-IN: Fotos unter public/img/wines/rosato-puglia/ ablegen
   (hero.jpg = Kellerei-Stimmungsfoto mit der Flasche, front.jpg = Packshot,
   back.jpg = Rückenetikett). Solange eine Datei fehlt, den Pfad auf null setzen.

   Fields marked [BESTÄTIGEN] sind plausible, aber nicht aus dem Datenblatt
   belegte Storytelling-Passagen. */

export const ROSATO_NEGROAMARO = {
  slug: "rosato-puglia",
  catalogName: "Rosato Puglia", // key into components/data.js WINES via byName()

  name: "Rosato Negroamaro IGP Salento",
  eyebrow: "Italienische Boutique-Weine",
  heroTitle: ["Rosato Negroamaro", "IGP Salento"],
  lede:
    "Negroamaro aus den Alberello-Weinbergen von Torricella und Maruggio. Vier Stunden auf der Schale, drei Monate Stahl — ein Rosé in der Farbe von Pfirsichfleisch.",
  /* Akt 2 des gepinnten Heros — drei Worte, die beim Scrollen erscheinen */
  heroWords: ["Zart.", "Frisch.", "Fruchtig."],

  /* Kurzformen für generische Sektionstexte (sonst greift der Falanghina-Default) */
  shortNameNom: "der Rosato",
  shortNameGen: "des Rosato",

  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Unsere Weine", href: "/weine" },
    { label: "Rosato Negroamaro IGP Salento", href: null },
  ],

  images: {
    /* Packshot & Rückenetikett liegen noch nicht vor — bleiben null, bis die
       Dateien unter public/img/wines/rosato-puglia/ liegen. */
    front: null,
    back: null,
    /* Kellerei-Stimmungsfoto mit der Flasche — trägt den kompletten Kino-Hero */
    hero: "/img/wines/rosato-puglia/hero.jpg",
  },

  /* ---- Schnellfakten (Icon-Leiste unter dem Hero) ---- */
  facts: [
    { icon: "pin", label: "Herkunft", value: "Salento, Apulien" },
    { icon: "grapes", label: "Rebsorte", value: "Negroamaro 100 %" },
    { icon: "tank", label: "Ausbau", value: "3 Monate Stahltank" },
    { icon: "thermometer", label: "Serviertemperatur", value: "12–14 °C" },
  ],

  /* ---- Farb-Kapitel (immersive Typo-Sektion) ---- */
  colorMoment: {
    kicker: "Die Farbe",
    lines: ["Rosa.", "Wie Pfirsichfleisch."],
    text: "Nur vier Stunden Kontakt mit den Schalen — gerade genug, um dem Wein seine zarte, leuchtende Farbe zu geben, ohne ihm Gewicht zu nehmen.",
    swatches: [
      { hex: "#F4C9B4", label: "Pfirsichfleisch" },
      { hex: "#E8A793", label: "Zartes Rosa" },
      { hex: "#D98A76", label: "Warmer Reflex" },
    ],
  },

  /* ---- Der Geschmack: drei gepinnte Kapitel (Auge / Nase / Gaumen) ---- */
  taste: [
    {
      key: "farbe",
      icon: "eye",
      kicker: "Farbe",
      title: "Rosa Pfirsichfleisch",
      text: "Ein zartes, leuchtendes Rosé — das Ergebnis von nur vier Stunden auf der Schale. Hell im Glas, warm im Licht.",
      tone: "#F4C9B4",
    },
    {
      key: "duft",
      icon: "nose",
      kicker: "Duft",
      title: "Delikat, anhaltend, blumig",
      text: "Feine florale Noten, die nicht laut auftreten, aber lange bleiben. Die kontrollierte Gärtemperatur bewahrt jedes Aroma.",
      tone: "#E8A793",
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Frisch, ausgewogen, elegant fruchtig",
      text: "Am Gaumen frisch und in sich stimmig — ein Rosé, dessen Frucht elegant bleibt statt süß zu werden.",
      tone: "#D98A76",
    },
  ],

  /* ---- Im Detail (Bento / technisches Datenblatt) ---- */
  detail: [
    { label: "Bezeichnung", value: "Rosato Negroamaro I.G.P. Salento", span: "wide" },
    { label: "Rebsorte", value: "Negroamaro IGP Salento 100 %" },
    { label: "Herkunft", value: "Torricella und Maruggio, Salento" },
    { label: "Erziehung", value: "Ausschließlich Alberello, ohne Bewässerung" },
    {
      label: "Vinifikation",
      value:
        "Alkoholische Gärung bei kontrollierter Temperatur zur Bewahrung des Aromas, mit 4 Stunden Kontakt auf den Schalen.",
      span: "wide",
    },
    { label: "Ausbau", value: "3 Monate im Stahltank bis zur Abfüllung" },
    { label: "Alkoholgehalt", value: "12,00 % vol." },
    { label: "Serviertemperatur", value: "12–14 °C" },
    { label: "Füllmenge", value: "750 ml" },
    { label: "Hinweis", value: "Enthält Sulfite" },
  ],

  /* ---- Die Geschichte ---- */
  story: {
    kicker: "Die Geschichte",
    title: "Vier Stunden, die alles entscheiden",
    paragraphs: [
      "Negroamaro ist eine dunkle Rebe — ihr Name trägt das Schwarz schon in sich. Aus ihr einen Rosé zu machen, ist eine Frage von Stunden: vier Stunden Kontakt zwischen Most und Schale, dann wird getrennt. Länger, und der Wein wäre rot.",
      /* [BESTÄTIGEN] Storytelling zum Alberello-Anbau */
      "Die Trauben stammen aus den Lagen von Torricella und Maruggio, erzogen ausschließlich als Alberello — den niedrigen, freistehenden Buschreben Apuliens, ohne Bewässerung. Danach drei Monate Ruhe im Stahl, damit die Frische unangetastet in die Flasche kommt.",
    ],
    quote: {
      text: "Ein Wein für den Moment vor dem Abendessen — wenn der Tag noch nachhallt und der Abend gerade beginnt.",
      attribution: "Maria & Maria",
    },
  },

  /* ---- Der Ort (Luogo) ---- */
  place: {
    kicker: "Die Herkunft",
    title: "Salento",
    region: "apulien", // ItalyMap region key
    text: "Der Absatz des italienischen Stiefels, zwischen zwei Meeren. Heiße Tage, kühlende Seewinde und rote, kalkhaltige Böden — das Salento ist die Heimat des Negroamaro.",
    stats: [
      { label: "Region", value: "Salento, Apulien" },
      { label: "Lagen", value: "Torricella und Maruggio" },
      { label: "Erziehung", value: "Alberello, ohne Bewässerung" },
      { label: "Klassifikation", value: "Negroamaro I.G.P. Salento" },
    ],
    photo: "/img/region-apulien.jpg",
    photoAlt: "Weinlandschaft im Salento, Apulien",
    chip: { title: "Salento", subtitle: "Apulien · Italien" },
  },

  /* ---- Passt zu (Food-Pairing, aus dem Datenblatt) ---- */
  pairing: {
    kicker: "Passt zu",
    title: "Der Wein für den Aperitivo",
    text: "Ideal zum Aperitif und zu allem, was leicht und mediterran bleibt — von Antipasti bis zum blauen Fisch.",
    photo: "/img/dinner.jpg",
    photoAlt: "Gedeckter Tisch mit Antipasti und Roséwein",
    items: [
      { icon: "glasses", title: "Aperitivo", text: "Der Klassiker vor dem Essen" },
      { icon: "plate", title: "Antipasti", text: "Vorspeisen, kalt wie warm" },
      { icon: "plate", title: "Einfache Primi", text: "Unkomplizierte Pasta- und Reisgerichte" },
      { icon: "plate", title: "Fisch & weißes Fleisch", text: "Blauer Fisch, Geflügel, Kaninchen" },
    ],
  },

  /* ---- Häufige Fragen ---- */
  faq: [
    {
      q: "Wie schmeckt der Rosato Negroamaro IGP Salento?",
      a: "Frisch, ausgewogen und elegant fruchtig. In der Nase delikat und anhaltend mit floralen Noten, im Glas rosa wie Pfirsichfleisch.",
    },
    {
      q: "Aus welcher Rebsorte besteht der Rosato?",
      a: "Zu 100 % aus Negroamaro IGP Salento — der wichtigsten roten Rebsorte Apuliens.",
    },
    {
      q: "Warum ist ein Wein aus einer roten Rebe rosé?",
      a: "Weil der Most nur vier Stunden Kontakt mit den Schalen hat. Die Farbe sitzt in der Beerenhaut, nicht im Saft — eine kurze Standzeit ergibt daher ein zartes Rosa statt eines Rotweins.",
    },
    {
      q: "Was bedeutet „IGP Salento“?",
      a: "IGP steht für „Indicazione Geografica Protetta“, die geschützte geografische Angabe. Die Trauben stammen aus dem Salento, dem südlichsten Teil Apuliens.",
    },
    {
      q: "Zu welchen Gerichten passt der Rosato?",
      a: "Ideal zum Aperitif sowie zu Antipasti, einfachen Primi und Hauptgängen mit blauem Fisch oder weißem Fleisch.",
    },
    {
      q: "Wie sollte der Rosato serviert werden?",
      a: "Gut gekühlt bei 12 bis 14 °C. So bleiben die floralen Noten und die Frische am besten erhalten.",
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen der Rosato gefällt",
    names: ["Falanghina", "Primitivo Salento IGP", "Il Bianco – Greco Cuvée"],
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
