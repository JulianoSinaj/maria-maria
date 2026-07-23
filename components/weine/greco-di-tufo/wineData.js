/* Greco di Tufo D.O.C.G. — content model for the wine landing page.
   Gleiche Struktur wie components/weine/falanghina/wineData.js; die Sektionen
   sind wine-Prop-getrieben und werden von app/weine/greco-di-tufo/page.jsx
   mit diesen Daten gefüttert.

   PHOTO DROP-IN: Fotografie unter public/img/wines/greco-di-tufo/ ablegen
   (hero.jpg = Kellerei-Stimmungsfoto, front.jpg = freigestellter Packshot).
   Solange eine Datei fehlt, den jeweiligen Pfad auf null setzen — die Sektion
   fällt automatisch auf die illustrierte Variante zurück.

   Fakten stammen aus dem Datenblatt „Greco di Tufo D.O.C.G.“.
   Mit [BESTÄTIGEN] markierte Felder sind rebsortentypisch formulierte
   Erzähltexte, die der Kunde vor Go-live bestätigen sollte. */

export const GRECO_DI_TUFO = {
  slug: "greco-di-tufo",
  catalogName: "Greco di Tufo D.O.C.G.", // key into components/data.js WINES via byName()

  name: "Greco di Tufo D.O.C.G.",
  eyebrow: "Italienische Boutique-Weine",
  heroTitle: ["Greco", "di Tufo D.O.C.G."],
  lede:
    "Aus dem vulkanischen Tuffgestein im Herzen Irpiniens. Ein Weißwein mit intensivem, feinem Duft, strohgelber Farbe mit goldenen Reflexen und einem frischen, verführerischen Geschmack.",
  /* Akt 2 des gepinnten Heros — drei Worte, die beim Scrollen erscheinen */
  heroWords: ["Intensiv.", "Fein.", "Verführerisch."],

  /* Genitiv/Nominativ für generische Sektionsuntertitel */
  shortNameNom: "der Greco",
  shortNameGen: "des Greco",

  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Unsere Weine", href: "/weine" },
    { label: "Greco di Tufo D.O.C.G.", href: null },
  ],

  images: {
    /* Freigestellter Studio-Packshot (noch offen) */
    front: null,
    /* Rückenetikett (noch offen) */
    back: null,
    /* Kellerei-Stimmungsfoto — trägt den kompletten Kino-Hero */
    hero: "/img/wines/greco-di-tufo/hero.jpg",
  },

  /* ---- Schnellfakten (Icon-Leiste unter dem Hero) ---- */
  facts: [
    { icon: "pin", label: "Herkunft", value: "Kampanien – Irpinien" },
    { icon: "grapes", label: "Rebsorte", value: "Greco 100 %" },
    { icon: "tank", label: "Ausbau", value: "1 Jahr im Stahltank" },
    { icon: "thermometer", label: "Serviertemperatur", value: "ca. 10 °C" },
  ],

  /* ---- Farb-Kapitel (immersive Typo-Sektion) ---- */
  colorMoment: {
    kicker: "Die Farbe",
    lines: ["Strohgelb.", "Mit goldenen Reflexen."],
    text: "Im Glas leuchtet der Greco warm und tief – ein Weißwein, dessen goldene Reflexe schon vor dem ersten Schluck von Struktur und Reife erzählen.",
    swatches: [
      { hex: "#F0E4B4", label: "Helles Stroh" },
      { hex: "#E4CE84", label: "Strohgelb" },
      { hex: "#D2AE55", label: "Goldener Reflex" },
    ],
  },

  /* ---- Der Geschmack: drei gepinnte Kapitel (Auge / Nase / Gaumen) ---- */
  taste: [
    {
      key: "farbe",
      icon: "eye",
      kicker: "Farbe",
      title: "Strohgelb mit goldenen Reflexen",
      text: "Ein warmes, leuchtendes Gelb – der erste Eindruck im Glas verspricht Tiefe statt Leichtgewicht.",
      tone: "#E4CE84",
    },
    {
      key: "duft",
      icon: "nose",
      kicker: "Duft",
      title: "Intensiv und angenehm",
      /* [BESTÄTIGEN] Aromenbilder rebsortentypisch ergänzt; das Datenblatt
         nennt nur „intensiv und angenehm“ */
      text: "Ein ausdrucksstarkes Bouquet: gelbe Steinfrucht, Zitrusschale und ein feiner mineralischer Zug aus dem Tuffboden.",
      tone: "#E8DCC2",
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Frisch, zart und verführerisch",
      text: "Am Gaumen frisch und delikat zugleich – ein Weißwein mit Struktur, der leise verführt statt laut zu sein.",
      tone: "#D8E2CE",
    },
  ],

  /* ---- Im Detail (Bento / technisches Datenblatt) ---- */
  detail: [
    { label: "Bezeichnung", value: "Greco di Tufo D.O.C.G.", span: "wide" },
    { label: "Rebsorte", value: "Greco 100 %" },
    { label: "Herkunft", value: "Kampanien, Italien" },
    { label: "Lese", value: "Ende der ersten Oktoberhälfte" },
    {
      label: "Vinifikation",
      value:
        "Sanfte Pressung ganzer Trauben, malolaktische Gärung nicht vollständig durchgeführt.",
      span: "wide",
    },
    { label: "Ausbau", value: "1 Jahr im Stahltank" },
    { label: "Alkoholgehalt", value: "13,0 % vol." },
    { label: "Serviertemperatur", value: "ca. 10 °C" },
    { label: "Füllmenge", value: "750 ml" },
    { label: "Hinweis", value: "Enthält Sulfite" },
  ],

  /* ---- Die Geschichte ---- */
  story: {
    kicker: "Die Geschichte",
    title: "Eine griechische Rebe auf vulkanischem Grund",
    paragraphs: [
      /* [BESTÄTIGEN] Namensherkunft ist die gängige Überlieferung */
      "Der Greco kam der Überlieferung nach mit griechischen Siedlern nach Süditalien – und fand rund um das Dorf Tufo in Irpinien seine Heimat. Der Name der Herkunft ist zugleich ihr Geheimnis: Tuff, das poröse Vulkangestein, das den Reben Mineralität und Spannung schenkt.",
      "Der Greco di Tufo gehört zu den wenigen Weißweinen Italiens mit D.O.C.G. – der höchsten Herkunftsstufe des Landes. Die Trauben werden erst Ende der ersten Oktoberhälfte gelesen, sanft als ganze Trauben gepresst und reifen anschließend ein Jahr im Stahltank.",
    ],
    quote: {
      text: "Ein Wein mit Charakter und Ruhe – für Abende, an denen niemand auf die Uhr schaut.",
      attribution: "Maria & Maria",
    },
  },

  /* ---- Der Ort (Luogo) ---- */
  place: {
    kicker: "Die Herkunft",
    title: "Tufo in Irpinien",
    region: "kampanien", // ItalyMap region key
    text: "Im bergigen Hinterland Kampaniens, rund um das Dorf Tufo, liegen die Weinberge auf vulkanischem Tuffgestein. Höhenlage, kühle Nächte und mineralische Böden geben dem Greco seine Struktur – und seine Langlebigkeit.",
    stats: [
      { label: "Region", value: "Kampanien" },
      { label: "Gebiet", value: "Irpinien · Tufo" },
      { label: "Lese", value: "Mitte Oktober" },
      { label: "Boden", value: "Vulkanischer Tuff" },
    ],
    photo: "/img/region-kampanien.jpg",
    photoAlt: "Hügelige Weinlandschaft in Kampanien",
    chip: { title: "Tufo", subtitle: "Irpinien · Kampanien" },
  },

  /* ---- Passt zu (Food-Pairing, aus dem Datenblatt) ---- */
  pairing: {
    kicker: "Passt zu",
    title: "Fisch, Meeresfrüchte – und Büffelmozzarella",
    text: "Der Greco di Tufo begleitet die helle Küche mit Struktur. Und überrascht, wenn er zu Mozzarella di Bufala ins Glas kommt.",
    photo: "/img/aperitivo.jpg",
    photoAlt: "Gedeckter Tisch mit Meeresfrüchten und einem Glas Weißwein",
    items: [
      { icon: "fish", title: "Fischgerichte", text: "Gegrillt, gebraten oder aus dem Ofen" },
      { icon: "shell", title: "Meeresfrüchte", text: "Von Vongole bis Gambero" },
      { icon: "plate", title: "Risotto & Käse", text: "Cremige Risotti und helle Käsesorten" },
      { icon: "glasses", title: "Büffelmozzarella", text: "Die überraschendste Kombination" },
    ],
  },

  /* ---- Häufige Fragen ---- */
  faq: [
    {
      q: "Wie schmeckt der Greco di Tufo D.O.C.G.?",
      a: "Intensiv und angenehm im Duft, strohgelb mit goldenen Reflexen im Glas – und am Gaumen frisch, zart und verführerisch. Ein Weißwein mit Struktur, der zugänglich bleibt.",
    },
    {
      q: "Was bedeutet „D.O.C.G.“?",
      a: "D.O.C.G. steht für „Denominazione di Origine Controllata e Garantita“ – die höchste Herkunftsstufe im italienischen Weinrecht. Der Greco di Tufo ist einer der wenigen Weißweine Italiens mit dieser Klassifizierung.",
    },
    {
      q: "Zu welchen Gerichten passt der Greco di Tufo?",
      a: "Perfekt zu Fischgerichten, Meeresfrüchten, Käse und Risotto. Besonders überraschend schmeckt er zu Mozzarella di Bufala.",
    },
    {
      q: "Wie sollte der Greco di Tufo serviert werden?",
      a: "Am besten bei etwa 10 °C im Weißweinglas. So bleiben Duft und Frische am klarsten – kurz vor dem Servieren aus dem Kühlschrank nehmen.",
    },
    {
      q: "Wie wird der Greco di Tufo ausgebaut?",
      a: "Die ganzen Trauben werden sanft gepresst, die malolaktische Gärung wird bewusst nicht vollständig durchgeführt. Anschließend reift der Wein ein Jahr im Stahltank – so bleiben Frische und Rebsortencharakter erhalten.",
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen der Greco gefällt",
    names: ["Falanghina", "Il Bianco – Greco Cuvée", "Lugana"],
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
