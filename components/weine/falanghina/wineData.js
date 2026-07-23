/* Beneventano Falanghina IGP — complete content model for the wine landing page.
   This is the template for all future per-wine pages: new wine = new data file
   with this exact shape + a thin route that feeds it into the shared sections.

   PHOTO DROP-IN: place the real photography under public/img/wines/falanghina/
   and fill the `images` paths below — every section swaps automatically from
   the illustrated fallback to the photo. Until then the paths stay `null`.

   Fields marked [BESTÄTIGEN] are plausible-but-unverified copy (aroma notes,
   storytelling) that the client should confirm before go-live. */

export const FALANGHINA = {
  slug: "falanghina",
  catalogName: "Falanghina", // key into components/data.js WINES via byName()

  name: "Beneventano Falanghina IGP",
  /* Kurzform für Fließtext — Nominativ und Genitiv, damit die geteilten
     Sektionen ohne hartcodierten Weinnamen auskommen */
  shortNameNom: "die Falanghina",
  shortNameGen: "der Falanghina",
  eyebrow: "Italienische Boutique-Weine",
  heroTitle: ["Beneventano", "Falanghina IGP"],
  lede:
    "Aus den sonnenverwöhnten Hügeln des Beneventano in Kampanien. Eine Falanghina mit klarer Frische, feiner Frucht und mediterraner Seele.",
  /* Akt 2 des gepinnten Heros — drei Worte, die beim Scrollen erscheinen */
  heroWords: ["Frisch.", "Klar.", "Mediterran."],

  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Unsere Weine", href: "/weine" },
    { label: "Beneventano Falanghina IGP", href: null },
  ],

  images: {
    /* Studio-Packshot auf Weiß (aus Schede-foto/foto e dati falanghina) */
    front: "/img/wines/falanghina/front.jpg",
    /* Rückenetikett (aufgehellt & freigestellt aus falanghina_retro.jpg) */
    back: "/img/wines/falanghina/back.jpg",
    /* Kellerei-Stimmungsfoto — trägt den kompletten Kino-Hero */
    hero: "/img/wines/falanghina/hero.jpg",
  },

  /* ---- Schnellfakten (Icon-Leiste unter dem Hero) ---- */
  facts: [
    { icon: "pin", label: "Herkunft", value: "Kampanien – Beneventano" },
    { icon: "grapes", label: "Rebsorte", value: "Falanghina 100 %" },
    { icon: "tank", label: "Ausbau", value: "1 Jahr Stahltank, 2 Monate Flasche" },
    { icon: "thermometer", label: "Serviertemperatur", value: "ca. 10 °C" },
  ],

  /* ---- Farb-Kapitel (immersive Typo-Sektion) ---- */
  colorMoment: {
    kicker: "Die Farbe",
    lines: ["Strohgelb.", "Mit grünlichen Reflexen."],
    text: "Im Glas zeigt sich die Falanghina hell, klar und leuchtend – ein Weißwein, der Frische verspricht, bevor Sie ihn probieren.",
    swatches: [
      { hex: "#F3ECC0", label: "Helles Stroh" },
      { hex: "#E8DC9A", label: "Strohgelb" },
      { hex: "#D9D584", label: "Grüner Reflex" },
    ],
  },

  /* ---- Der Geschmack: drei gepinnte Kapitel (Auge / Nase / Gaumen) ---- */
  taste: [
    {
      key: "farbe",
      icon: "eye",
      kicker: "Farbe",
      title: "Hell, klar und leuchtend",
      text: "Strohgelb mit grünlichen Reflexen – der erste Eindruck im Glas ist pure Frische.",
      tone: "#E8DC9A",
    },
    {
      key: "duft",
      icon: "nose",
      kicker: "Duft",
      title: "Weiße Blüten, Birne und ein Hauch Zitrus",
      /* [BESTÄTIGEN] Aromatik ist rebsortentypisch formuliert, nicht aus dem Datenblatt */
      text: "Ein feines, helles Bouquet: Blüten, gelbe Frucht und mediterrane Leichtigkeit steigen aus dem Glas.",
      tone: "#D9E4C0",
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Charaktervoll, weich und harmonisch",
      text: "Sehr weich und zugleich harmonisch und anhaltend – ein charakterstarker Weißwein, der angenehm zugänglich bleibt.",
      tone: "#CBE3DA",
    },
  ],

  /* ---- Im Detail (Bento / technisches Datenblatt) ---- */
  detail: [
    { label: "Bezeichnung", value: "Beneventano Falanghina IGP", span: "wide" },
    { label: "Rebsorte", value: "Falanghina 100 %" },
    { label: "Herkunft", value: "Kampanien, Italien" },
    { label: "Lese", value: "Erste Oktoberhälfte" },
    {
      label: "Vinifikation",
      value: "Sanfte Pressung ganzer Trauben. Anschließend ruhiger, temperaturkontrollierter Ausbau.",
      span: "wide",
    },
    { label: "Ausbau", value: "1 Jahr im Stahltank, 2 Monate Flaschenreife" },
    { label: "Alkoholgehalt", value: "13,0 % vol." },
    { label: "Serviertemperatur", value: "ca. 10 °C" },
    { label: "Füllmenge", value: "750 ml" },
    { label: "Hinweis", value: "Enthält Sulfite" },
  ],

  /* ---- Die Geschichte ---- */
  story: {
    kicker: "Die Geschichte",
    title: "Eine Rebe, so alt wie Kampanien selbst",
    paragraphs: [
      /* [BESTÄTIGEN] Namensherkunft ist die gängige Überlieferung */
      "Die Falanghina zählt zu den ältesten Rebsorten Kampaniens. Ihr Name geht der Überlieferung nach auf die „falangae“ zurück – die Holzpfähle, an denen die Reben schon zur Römerzeit emporwuchsen.",
      "Unsere Falanghina wächst im hügeligen Hinterland der Provinz Benevento. Warme Tage, kühle Nächte und die Nähe des Mittelmeers schenken ihr das, was sie unverwechselbar macht: Frische, Klarheit und eine feine, helle Frucht.",
    ],
    quote: {
      text: "Ein Wein für helle Momente – für lange Mittage, frische Küche und ehrliche Gespräche.",
      attribution: "Maria & Maria",
    },
  },

  /* ---- Der Ort (Luogo) ---- */
  place: {
    kicker: "Die Herkunft",
    title: "Das Beneventano",
    region: "kampanien", // ItalyMap region key
    text: "Zwischen Apennin und Küste liegt das Beneventano: sanfte Hügel, viel Licht und Nächte, die kühler sind als am Meer. Hier reift die Falanghina langsam – und behält ihre Spannung.",
    stats: [
      { label: "Region", value: "Kampanien" },
      { label: "Provinz", value: "Benevento" },
      { label: "Lese", value: "Anfang Oktober" },
      { label: "Klima", value: "Warme Tage, kühle Nächte" },
    ],
    photo: "/img/region-kampanien.jpg",
    photoAlt: "Hügelige Weinlandschaft in Kampanien",
    chip: { title: "Beneventano", subtitle: "Kampanien · Italien" },
  },

  /* ---- Passt zu (Food-Pairing, aus dem Datenblatt) ---- */
  pairing: {
    kicker: "Passt zu",
    title: "Ein Begleiter für die helle Küche",
    text: "Die Falanghina liebt alles, was aus dem Meer kommt – und jeden Auftakt eines guten Abends.",
    photo: "/img/aperitivo.jpg",
    photoAlt: "Aperitivo mit Antipasti und einem Glas Weißwein",
    items: [
      { icon: "fish", title: "Fischgerichte", text: "Gegrillt, gebraten oder aus dem Ofen" },
      { icon: "shell", title: "Krustentiere & Meeresfrüchte", text: "Von Garnelen bis Vongole" },
      { icon: "plate", title: "Antipasti", text: "Helle Vorspeisen und Gemüse" },
      { icon: "glasses", title: "Aperitivo-Momente", text: "Gut gekühlt als Auftakt des Abends" },
    ],
  },

  /* ---- Häufige Fragen ---- */
  faq: [
    {
      q: "Wie schmeckt die Beneventano Falanghina IGP?",
      a: "Sehr weich und zugleich harmonisch und anhaltend: ein charakterstarker, frischer Weißwein mit heller Frucht und lebendiger Klarheit – zugänglich, ohne beliebig zu sein.",
    },
    {
      q: "Was bedeutet „Beneventano IGP“?",
      a: "IGP steht für „Indicazione Geografica Protetta“, die geschützte geografische Angabe. Die Trauben stammen aus dem Beneventano – dem hügeligen Hinterland der Provinz Benevento in Kampanien.",
    },
    {
      q: "Zu welchen Gerichten passt die Falanghina?",
      a: "Perfekt zu Fischgerichten, Krustentieren und Meeresfrüchten – und ebenso zu hellen Antipasti oder als gut gekühlter Aperitivo.",
    },
    {
      q: "Wie sollte die Falanghina serviert werden?",
      a: "Am besten bei etwa 10 °C im Weißweinglas. So bleiben Frische und Duft am klarsten – kurz vor dem Servieren aus dem Kühlschrank nehmen.",
    },
    {
      q: "Wie wird die Falanghina ausgebaut?",
      a: "Die ganzen Trauben werden sanft gepresst, anschließend reift der Wein ein Jahr im Stahltank und ruht vor dem Verkauf noch zwei Monate in der Flasche. So bleibt die Rebsorte pur: Frucht, Frische und Klarheit statt Holz.",
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen die Falanghina gefällt",
    names: ["Greco di Tufo D.O.C.G.", "Il Bianco – Greco Cuvée", "Lugana"],
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
