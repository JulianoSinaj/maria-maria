/* Primitivo di Manduria DOP 15.50 — content model for the wine landing page.
   Gleiche Form wie components/weine/falanghina/wineData.js: dieselben Sektionen,
   nur andere Daten. Technische Werte stammen aus dem Datenblatt
   "MARIA MARIA — PRIMITIVO DI MANDURIA DOP 15.50".

   PHOTO DROP-IN: Fotos unter public/img/wines/primitivo-15-5/ ablegen
   (hero.jpg = Kellerei-Stimmungsfoto mit der Flasche, front.jpg = Packshot,
   back.jpg = Rückenetikett). Solange eine Datei fehlt, den Pfad auf null setzen.

   Fields marked [BESTÄTIGEN] sind plausible, aber nicht aus dem Datenblatt
   belegte Storytelling-Passagen. */

export const PRIMITIVO_155 = {
  slug: "primitivo-15-5",
  catalogName: "Primitivo 15,5", // key into components/data.js WINES via byName()

  name: "Primitivo di Manduria DOP 15.50",
  eyebrow: "Italienische Boutique-Weine",
  heroTitle: ["Primitivo 15,5", "di Manduria DOP"],
  lede:
    "100 % Primitivo di Manduria aus Torricella und Maruggio. Zwölf Monate in antiken Terrakotta-Amphoren — den capasoni. Kraftvoll, warm, komplex.",
  /* Akt 2 des gepinnten Heros — drei Worte, die beim Scrollen erscheinen */
  heroWords: ["Intensiv.", "Kraftvoll.", "Ausgewogen."],

  /* Kurzformen für generische Sektionstexte (sonst greift der Falanghina-Default) */
  shortNameNom: "der Primitivo",
  shortNameGen: "des Primitivo",

  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Unsere Weine", href: "/weine" },
    { label: "Primitivo di Manduria DOP 15.50", href: null },
  ],

  images: {
    /* Studio-Packshot & Rückenetikett (aus Schede tecniche e foto bottiglie) */
    front: "/img/wines/primitivo-15-5/front.jpg",
    back: "/img/wines/primitivo-15-5/back.jpg",
    /* Kellerei-Stimmungsfoto mit der Flasche — trägt den kompletten Kino-Hero */
    hero: "/img/wines/primitivo-15-5/hero.jpg",
  },

  /* ---- Schnellfakten (Icon-Leiste unter dem Hero) ---- */
  facts: [
    { icon: "pin", label: "Herkunft", value: "Manduria, Apulien" },
    { icon: "grapes", label: "Rebsorte", value: "100 % Primitivo di Manduria" },
    { icon: "tank", label: "Ausbau", value: "12 Monate in Terrakotta-Amphoren" },
    { icon: "thermometer", label: "Serviertemperatur", value: "16–18 °C" },
  ],

  /* ---- Farb-Kapitel (immersive Typo-Sektion) ---- */
  colorMoment: {
    kicker: "Die Farbe",
    lines: ["Rubinrot.", "Mit violetten Reflexen."],
    text: "Im Glas steht der Primitivo dicht und undurchdringlich — rubinrot, durchzogen von intensiven violetten Reflexen, wie sie nur voll ausgereifte Trauben aus dem Salento hervorbringen.",
    swatches: [
      { hex: "#6B0F1A", label: "Rubinrot" },
      { hex: "#41102A", label: "Violettreflex" },
      { hex: "#8C2230", label: "Granatrand" },
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
      title: "Rubinrot mit intensiven violetten Reflexen",
      text: "Ein tiefes, sattes Rubinrot, dessen violette Reflexe die Jugend und Konzentration dieses Weines schon im Glas ankündigen.",
      tone: "#6B0F1A",
      artwork: {
        src: "/img/wines/primitivo-15-5/front.jpg",
        alt: "Flasche Primitivo di Manduria DOP 15,50 von Maria Maria — Frontansicht des Etiketts",
        medium: "Die Flasche",
        title: "Primitivo di Manduria DOP 15,50",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
    {
      key: "duft",
      icon: "nose",
      kicker: "Duft",
      title: "Erdbeere und Waldbeeren, fein und zart",
      text: "Fein und delikat in der Nase, mit klaren Anklängen von Erdbeere und Waldfrüchten — überraschend zurückhaltend für einen Wein dieser Kraft.",
      tone: "#8C2230",
      artwork: {
        src: "/img/wines/primitivo-15-5/back.jpg",
        alt: "Rückenetikett der Flasche Primitivo di Manduria DOP 15,50 von Maria Maria",
        medium: "Das Rückenetikett",
        title: "Primitivo di Manduria DOP 15,50",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Körperreich, warm und komplex",
      text: "Ein körperreicher Wein von bemerkenswerter gusto-olfaktorischer Dichte: entschieden, trocken, warm und komplex — und über den ganzen Nachhall hinweg intensiv.",
      tone: "#A8452F",
      artwork: {
        src: "/img/wines/primitivo-15-5/hero.jpg",
        alt: "Flasche Primitivo di Manduria DOP 15,50 von Maria Maria in der Kellerei",
        medium: "In der Kellerei",
        title: "Primitivo di Manduria DOP 15,50",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
  ],

  /* ---- Im Detail (Bento / technisches Datenblatt) ---- */
  detail: [
    { label: "Bezeichnung", value: "Primitivo di Manduria D.O.P.", span: "wide" },
    { label: "Rebsorte", value: "Primitivo di Manduria DOP 100 %" },
    { label: "Herkunft", value: "Torricella und Maruggio, Apulien" },
    { label: "Erziehung", value: "Ausschließlich Alberello, ohne Bewässerung" },
    {
      label: "Vinifikation",
      value:
        "Alkoholische Gärung bei kontrollierter Temperatur zur Bewahrung von Aromen und Farbe, mit 7–8 Tagen Kontakt auf den Schalen. Anschließend eine leichte Pressung der Schalen.",
      span: "wide",
    },
    { label: "Ausbau", value: "12 Monate in antiken Terrakotta-Giare (capasoni) bis zur Füllung" },
    { label: "Alkoholgehalt", value: "15,50 % vol." },
    { label: "Serviertemperatur", value: "16–18 °C" },
    { label: "Füllmenge", value: "750 ml" },
    { label: "Hinweis", value: "Enthält Sulfite" },
  ],

  /* ---- Die Geschichte ---- */
  story: {
    kicker: "Die Geschichte",
    title: "Alberello, Meer und capasoni",
    paragraphs: [
      "Die Trauben stammen aus den Primitivo-Weingärten der Gemeinden Torricella und Maruggio. Die Nähe zum Meer ist hier kein Postkartenmotiv, sondern Handschrift: Sie hebt die Düfte und die Struktur dieses Weines hervor.",
      "Erzogen wird ausschließlich im Alberello — dem traditionellen Buschbaum Apuliens, ohne Bewässerung. Jeder Stock steht für sich, jede Rebe trägt wenig und reift dafür vollständig aus. Danach ruht der Wein zwölf Monate in antiken Terrakotta-Giare, den capasoni, bevor er auf die Flasche kommt.",
    ],
    quote: {
      /* [BESTÄTIGEN] Storytelling-Zitat, nicht aus dem Datenblatt */
      text: "Fünfzehnfünfzig — kein Wein für nebenbei. Einer für den langen Abend, den vollen Teller und das Gespräch danach.",
      attribution: "Maria & Maria",
    },
  },

  /* ---- Der Ort (Luogo) ---- */
  place: {
    kicker: "Die Herkunft",
    title: "Manduria, Apulien",
    region: "apulien", // ItalyMap region key
    text: "Zwischen Torricella und Maruggio, im Salento und nur wenige Kilometer vom Ionischen Meer entfernt: kalkhaltige rote Böden, viel Sonne und eine ständige Meeresbrise. Genau diese Nähe zum Wasser gibt dem Primitivo di Manduria seine Düfte und seine Struktur.",
    stats: [
      { label: "Region", value: "Apulien, Italien" },
      { label: "Klassifikation", value: "Primitivo di Manduria D.O.P." },
      { label: "Erziehung", value: "Alberello, ohne Bewässerung" },
      { label: "Ausbau", value: "12 Monate in capasoni" },
    ],
    photo: "/img/region-apulien.jpg",
    photoAlt: "Weinlandschaft in Apulien mit Alberello-Reben",
    chip: { title: "Manduria", subtitle: "Apulien · Italien" },
  },

  /* ---- Passt zu (Food-Pairing, aus dem Datenblatt) ---- */
  pairing: {
    kicker: "Passt zu",
    title: "Ein Wein für den vollen Tisch",
    text: "Mit 15,5 % vol. und dieser Dichte begleitet der Primitivo hervorragend alles, was Substanz, Würze und Röstaromen mitbringt.",
    photo: "/img/dinner.jpg",
    photoAlt: "Gedeckter Tisch mit herzhaften Gerichten und Rotwein",
    items: [
      { icon: "plate", title: "Primi al ragù", text: "Pastagerichte mit langsam geschmortem Ragù" },
      { icon: "plate", title: "Braten", text: "Arrosti — gebratenes und geschmortes Fleisch" },
      { icon: "plate", title: "Wild", text: "Cacciagione und kräftige Schmorgerichte" },
      { icon: "glasses", title: "Scharf & Hartkäse", text: "Pikante Speisen und lang gereifte Hartkäse" },
    ],
  },

  /* ---- Servieren & Genießen + Der Maria-Moment ---- */
  moment: {
    title: "So schmeckt der Primitivo 15,5 am besten",
    accent: { base: "#A8452F", deep: "#6B2114", light: "#EBD0BD" },
    serve: {
      title: "Servieren & Genießen",
      items: [
        { icon: "thermometer", title: "Serviertemperatur", text: "16–18 °C — im großen Rotweinglas" },
        /* [BESTÄTIGEN] Trinkfenster nicht im Datenblatt — Struktur und 15,5 % vol. tragen weiter als der 14,5er */
        { icon: "hourglass", title: "Trinkfenster", text: "Jetzt genießen oder innerhalb von 4–6 Jahren" },
        { icon: "decanter", title: "Das Ritual", text: "Eine gute Stunde vorher öffnen — dann entfalten sich Frucht und Würze voll" },
      ],
    },
    maria: {
      text: "Kein Wein für nebenbei — einer für den langen Abend, den vollen Teller und das Gespräch danach.",
      link: { label: "Mehr entdecken", href: "/shop" },
    },
    essence: [
      {
        icon: "glass",
        kicker: "Geschmack",
        title: "Körperreich, warm, komplex",
        text: "Erdbeere und Waldbeeren in der Nase, am Gaumen entschieden, trocken und intensiv — bis in den langen Nachhall.",
        tone: "#8C2230",
        toneDeep: "#5C0D18",
      },
      {
        icon: "italy",
        kicker: "Herkunft",
        title: "Torricella & Maruggio",
        text: "Alberello-Weingärten nur wenige Kilometer vom Ionischen Meer — die Brise hebt Duft und Struktur.",
        tone: "#A8452F",
        toneDeep: "#6B2114",
      },
      {
        icon: "grapes",
        kicker: "Rebsorte",
        title: "Primitivo di Manduria",
        text: "100 % Primitivo, zwölf Monate in antiken Terrakotta-Giare — den capasoni — gereift.",
        tone: "#D8A97E",
        toneDeep: "#8A5A2E",
      },
    ],
  },

  /* ---- Häufige Fragen ---- */
  faq: [
    {
      q: "Wie schmeckt der Primitivo di Manduria DOP 15.50?",
      a: "Körperreich und von bemerkenswerter gusto-olfaktorischer Dichte: entschieden, trocken, warm und komplex, dabei durchgehend intensiv. In der Nase fein und delikat mit Anklängen von Erdbeere und Waldfrüchten.",
    },
    {
      q: "Aus welchen Trauben besteht dieser Wein?",
      a: "Zu 100 % aus Primitivo di Manduria DOP. Die Trauben stammen aus den Weingärten der Gemeinden Torricella und Maruggio in Apulien.",
    },
    {
      q: "Was sind capasoni?",
      a: "Capasoni sind antike Giare — große Amphoren aus Terrakotta, die in Apulien traditionell zum Ausbau von Wein genutzt werden. Der Primitivo 15,5 reift zwölf Monate darin, bevor er abgefüllt wird.",
    },
    {
      q: "Was bedeutet die Erziehung im Alberello?",
      a: "Alberello ist die traditionelle Buscherziehung Süditaliens: freistehende, niedrige Stöcke ohne Drahtrahmen. Hier wird ausschließlich im Alberello und ohne Bewässerung gearbeitet — die Reben tragen weniger und reifen dafür vollständig aus.",
    },
    {
      q: "Zu welchen Gerichten passt der Primitivo 15,5?",
      a: "Zu Primi al ragù, Braten und Wild, zu pikanten Speisen sowie zu Hartkäse. Er verträgt kräftige Aromen und Würze mühelos.",
    },
    {
      q: "Wie sollte der Primitivo 15,5 serviert werden?",
      a: "Bei 16 bis 18 °C im großen Rotweinglas. Bei 15,5 % vol. lohnt es sich, die Flasche eine gute Stunde vorher zu öffnen, damit sich Frucht und Würze voll entfalten.",
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen der Primitivo 15,5 gefällt",
    names: ["Primitivo 14,5", "Primitivo Salento IGP", "Il Rosso – Aglianico"],
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
