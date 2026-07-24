/* Il Rosso — Campania Rosso I.G.P. — content model for the wine landing page.
   Gleiche Form wie wineData.js (Falanghina): dieselben Sektionen, nur andere
   Daten. Technische Werte stammen aus dem Datenblatt "Campania Rosso I.G.P.".

   PHOTO DROP-IN: Fotos unter public/img/wines/il-rosso-aglianico/ ablegen
   (hero.jpg = Kellerei-Stimmungsfoto mit der Flasche, front.jpg = Packshot,
   back.jpg = Rückenetikett). Solange eine Datei fehlt, den Pfad auf null setzen.

   Fields marked [BESTÄTIGEN] sind plausible, aber nicht aus dem Datenblatt
   belegte Storytelling-Passagen. */

export const IL_ROSSO = {
  slug: "il-rosso-aglianico",
  catalogName: "Il Rosso – Aglianico", // key into components/data.js WINES via byName()

  name: "Il Rosso — Campania Rosso IGP",
  eyebrow: "Italienische Boutique-Weine",
  heroTitle: ["Il Rosso", "Campania Rosso IGP"],
  lede:
    "Aglianico, Piedirosso und Primitivo aus Kampanien. Sechs Monate französische Eiche, dunkle Frucht und würzige Tiefe — la poesia in bottiglia.",
  /* Akt 2 des gepinnten Heros — drei Worte, die beim Scrollen erscheinen */
  heroWords: ["Tief.", "Würzig.", "Charakterstark."],

  /* Kurzformen für generische Sektionstexte (sonst greift der Falanghina-Default) */
  shortNameNom: "der Rosso",
  shortNameGen: "des Rosso",

  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Unsere Weine", href: "/weine" },
    { label: "Il Rosso — Campania Rosso IGP", href: null },
  ],

  images: {
    /* Studio-Packshot & Rückenetikett (aus Schede tecniche e foto bottiglie) */
    front: "/img/wines/il-rosso-aglianico/front.jpg",
    back: "/img/wines/il-rosso-aglianico/back.jpg",
    /* Kellerei-Stimmungsfoto mit der Flasche — trägt den kompletten Kino-Hero */
    hero: "/img/wines/il-rosso-aglianico/hero.jpg",
  },

  /* ---- Schnellfakten (Icon-Leiste unter dem Hero) ---- */
  facts: [
    { icon: "pin", label: "Herkunft", value: "Kampanien, Italien" },
    { icon: "grapes", label: "Rebsorten", value: "Aglianico, Piedirosso, Primitivo" },
    { icon: "tank", label: "Ausbau", value: "6 Monate französische Eiche" },
    { icon: "thermometer", label: "Serviertemperatur", value: "ca. 16–18 °C" },
  ],

  /* ---- Farb-Kapitel (immersive Typo-Sektion) ---- */
  colorMoment: {
    kicker: "Die Farbe",
    lines: ["Tiefes Rubinrot.", "Mit granatfarbenem Rand."],
    text: "Im Glas steht der Rosso dicht und dunkel — ein Wein, dem man die Sonne Kampaniens und die sechs Monate im französischen Holz ansieht.",
    swatches: [
      { hex: "#6B0F1A", label: "Rubinrot" },
      { hex: "#4A0A15", label: "Dunkle Kirsche" },
      { hex: "#8C2230", label: "Granatreflex" },
    ],
    artwork: {
      src: "/img/art/farbe-rot-fantin-latour.jpg",
      alt: "Ölgemälde „Roses in a Bowl“ von Henri Fantin-Latour: Rosen in Rubin- und Cremetönen vor tiefdunklem Grund",
      title: "Roses in a Bowl",
      artist: "Henri Fantin-Latour",
      year: "1883",
      focus: "50% 40%",
      /* Loop-Video im Rahmen — läuft stumm in Endlosschleife, das Gemälde
         oben bleibt Poster und Reduced-Motion-Fallback */
      video: "/video/wine-red.mp4",
      videoFocus: "50% 50%",
      videoTitle: "Rubinrot im Glas",
    },
  },

  /* ---- Der Geschmack: drei gepinnte Kapitel (Auge / Nase / Gaumen) ---- */
  taste: [
    {
      key: "farbe",
      icon: "eye",
      kicker: "Farbe",
      title: "Dicht, dunkel und leuchtend",
      /* [BESTÄTIGEN] Farbbeschreibung ist rebsortentypisch, nicht im Datenblatt */
      text: "Tiefes Rubinrot mit granatfarbenem Rand — ein Rotwein, der Konzentration schon im Glas zeigt.",
      tone: "#6B0F1A",
      artwork: {
        src: "/img/wines/il-rosso-aglianico/front.jpg",
        alt: "Flasche Il Rosso — Campania Rosso IGP von Maria Maria — Frontansicht des Etiketts",
        medium: "Die Flasche",
        title: "Il Rosso — Campania Rosso IGP",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
    {
      key: "duft",
      icon: "nose",
      kicker: "Duft",
      title: "Amarena, Brombeere und getrocknete Pflaume",
      text: "Ein einnehmender Wein mit ausgeprägten Noten von Sauerkirsche, Brombeere und getrockneter Pflaume, begleitet von einem Hauch süßer Gewürze.",
      tone: "#8C2230",
      artwork: {
        src: "/img/wines/il-rosso-aglianico/back.jpg",
        alt: "Rückenetikett der Flasche Il Rosso — Campania Rosso IGP von Maria Maria",
        medium: "Das Rückenetikett",
        title: "Il Rosso — Campania Rosso IGP",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Würzig, warm und fruchtig im Abgang",
      text: "Die süßen Gewürze aus dem französischen Holz tragen den Wein, bevor er mit einer angenehm konzentrierten Fruchtnote ausklingt.",
      tone: "#A8452F",
      artwork: {
        src: "/img/wines/il-rosso-aglianico/hero.jpg",
        alt: "Flasche Il Rosso — Campania Rosso IGP von Maria Maria in der Kellerei",
        medium: "In der Kellerei",
        title: "Il Rosso — Campania Rosso IGP",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
  ],

  /* ---- Im Detail (Bento / technisches Datenblatt) ---- */
  detail: [
    { label: "Bezeichnung", value: "Campania Rosso I.G.P.", span: "wide" },
    { label: "Uvaggio", value: "Aglianico, Piedirosso und Primitivo" },
    { label: "Herkunft", value: "Kampanien, Italien" },
    { label: "Lese", value: "Ende Oktober, Selektion und Handlese" },
    {
      label: "Vinifikation",
      value:
        "Maischestandzeit von rund 12 Tagen, Gärung teilweise mit autochthonen Hefestartern. Malolaktische Gärung vollständig im französischen Eichenholz.",
      span: "wide",
    },
    { label: "Ausbau", value: "6 Monate in Fässern aus französischer Eiche" },
    { label: "Alkoholgehalt", value: "14,00 % vol." },
    { label: "Serviertemperatur", value: "ca. 16–18 °C" },
    { label: "Füllmenge", value: "750 ml" },
    { label: "Hinweis", value: "Enthält Sulfite" },
  ],

  /* ---- Die Geschichte ---- */
  story: {
    kicker: "Die Geschichte",
    title: "Drei Reben, ein Charakter",
    paragraphs: [
      /* [BESTÄTIGEN] Storytelling zu den Rebsorten */
      "Aglianico gibt dem Wein sein Rückgrat: Struktur, Tiefe und die dunkle, würzige Seite Kampaniens. Piedirosso bringt Eleganz und Duft, Primitivo die warme, reife Frucht.",
      "Ende Oktober wird von Hand gelesen und selektiert. Nach rund zwölf Tagen auf der Maische reift der Wein sechs Monate in französischer Eiche — lang genug für süße Gewürznoten, kurz genug, damit die Frucht das letzte Wort behält.",
    ],
    quote: {
      text: "La poesia in bottiglia — ein Wein für lange Abende, volle Tische und Gespräche, die nicht enden wollen.",
      attribution: "Maria & Maria",
    },
  },

  /* ---- Der Ort (Luogo) ---- */
  place: {
    kicker: "Die Herkunft",
    title: "Kampanien",
    region: "kampanien", // ItalyMap region key
    text: "Vulkanische Böden, warme Tage und die Nähe des Mittelmeers: Kampanien bringt Rotweine hervor, die kraftvoll sind, ohne schwer zu werden — genau die Balance, die dieser Rosso sucht.",
    stats: [
      { label: "Region", value: "Kampanien" },
      { label: "Klassifikation", value: "Campania Rosso I.G.P." },
      { label: "Lese", value: "Ende Oktober, von Hand" },
      { label: "Ausbau", value: "6 Monate französische Eiche" },
    ],
    photo: "/img/region-kampanien.jpg",
    photoAlt: "Hügelige Weinlandschaft in Kampanien",
    chip: { title: "Campania", subtitle: "Kampanien · Italien" },
  },

  /* ---- Passt zu (Food-Pairing, aus dem Datenblatt) ---- */
  pairing: {
    kicker: "Passt zu",
    title: "Ein Begleiter für die kräftige Küche",
    text: "Der Rosso liebt alles, was Würze und Substanz hat — von der herzhaften Pasta bis zum Braten.",
    photo: "/img/dinner.jpg",
    photoAlt: "Gedeckter Tisch mit herzhaften Gerichten und Rotwein",
    items: [
      { icon: "plate", title: "Kräftige Primi", text: "Herzhafte Pasta- und Nudelgerichte" },
      { icon: "plate", title: "Wurst & Salumi", text: "Insaccati und gereifte Aufschnitte" },
      { icon: "plate", title: "Schweinebraten", text: "Arrosti und Schmorgerichte" },
      { icon: "glasses", title: "Vegetarisch & würzig", text: "Reiche Saucen, fein gewürzte Rezepte" },
    ],
  },

  /* ---- Servieren & Genießen + Der Maria-Moment ---- */
  moment: {
    title: "So schmeckt der Rosso am besten",
    accent: { base: "#8C2230", deep: "#6B0F1A", light: "#E3CDB8" },
    serve: {
      title: "Servieren & Genießen",
      items: [
        { icon: "thermometer", title: "Serviertemperatur", text: "ca. 16–18 °C — im Rotweinglas" },
        /* [BESTÄTIGEN] Trinkfenster nicht im Datenblatt — die 6 Monate Eiche geben Reifepotenzial */
        { icon: "hourglass", title: "Trinkfenster", text: "Jetzt genießen oder innerhalb von 3–5 Jahren" },
        { icon: "decanter", title: "Das Ritual", text: "Eine knappe Stunde vorher öffnen — Frucht und Gewürz treten deutlicher hervor" },
      ],
    },
    maria: {
      text: "La poesia in bottiglia — für lange Abende, volle Tische und Gespräche, die nicht enden wollen.",
      link: { label: "Mehr entdecken", href: "/shop" },
    },
    essence: [
      {
        icon: "glass",
        kicker: "Geschmack",
        title: "Würzig, warm, fruchtig",
        text: "Amarena, Brombeere und getrocknete Pflaume, getragen von süßen Gewürznoten aus der französischen Eiche.",
        tone: "#8C2230",
        toneDeep: "#6B0F1A",
      },
      {
        icon: "italy",
        kicker: "Herkunft",
        title: "Kampanien",
        text: "Vulkanische Böden, warme Tage und die Nähe des Mittelmeers — Kraft ohne Schwere.",
        tone: "#A8452F",
        toneDeep: "#6B2114",
      },
      {
        icon: "grapes",
        kicker: "Rebsorte",
        title: "Aglianico, Piedirosso & Primitivo",
        text: "Drei süditalienische Reben, ein Charakter: Rückgrat, Duft und reife Frucht — Ende Oktober von Hand gelesen.",
        tone: "#7A2A55",
        toneDeep: "#41102A",
      },
    ],
  },

  /* ---- Häufige Fragen ---- */
  faq: [
    {
      q: "Wie schmeckt der Campania Rosso IGP?",
      a: "Ein einnehmender Rotwein mit ausgeprägten Noten von Amarena, Brombeere und getrockneter Pflaume, einem leichten Hauch süßer Gewürze und einem Abgang mit angenehm konzentrierter Frucht.",
    },
    {
      q: "Aus welchen Rebsorten besteht Il Rosso?",
      a: "Aus einer Cuvée von Aglianico, Piedirosso und Primitivo — Struktur, Duft und reife Frucht aus drei süditalienischen Reben.",
    },
    {
      q: "Was bedeutet „Campania Rosso I.G.P.“?",
      a: "IGP steht für „Indicazione Geografica Protetta“, die geschützte geografische Angabe. Die Trauben stammen aus der Region Kampanien in Süditalien.",
    },
    {
      q: "Zu welchen Gerichten passt Il Rosso?",
      a: "Zu kräftigen Primi, Wurstwaren und Schweinebraten — ebenso zu vegetarischen Gerichten mit reichen, würzigen Saucen und fein gewürzten Rezepten.",
    },
    {
      q: "Wie sollte Il Rosso serviert werden?",
      a: "Bei etwa 16 bis 18 °C im Rotweinglas. Eine knappe Stunde vorher öffnen lässt die Frucht und die Gewürznoten deutlicher hervortreten.",
    },
    {
      q: "Wie wird Il Rosso ausgebaut?",
      a: "Nach rund zwölf Tagen Maischestandzeit — die Gärung teilweise mit autochthonen Hefen gestartet — erfolgt die malolaktische Gärung vollständig in französischer Eiche. Anschließend reift der Wein sechs Monate in französischen Holzfässern.",
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen Il Rosso gefällt",
    names: ["Primitivo 15,5", "Primitivo Salento IGP", "Rosato Puglia"],
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
    { label: "Genießen", href: "#geniessen" },
    { label: "Details", href: "#details" },
    { label: "Fragen", href: "#fragen" },
  ],
};
