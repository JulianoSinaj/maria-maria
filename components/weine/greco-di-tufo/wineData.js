/* Greco di Tufo D.O.C.G. — content model for the wine landing page.
   Gleiche Struktur wie components/weine/falanghina/wineData.js; die Sektionen
   sind wine-Prop-getrieben und werden von app/unsere-weine/greco-di-tufo/page.jsx
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
    { label: "Unsere Weine", href: "/unsere-weine" },
    { label: "Greco di Tufo D.O.C.G.", href: null },
  ],

  images: {
    /* Studio-Packshot (aus Schede tecniche e foto bottiglie) */
    front: "/img/wines/greco-di-tufo/front.jpg",
    /* Rückenetikett (aus Schede tecniche e foto bottiglie) */
    back: "/img/wines/greco-di-tufo/back.jpg",
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
    artwork: {
      src: "/img/art/farbe-gold-monet.jpg",
      alt: "Ölgemälde „Getreideschober, Spätsommer“ von Claude Monet: Felder in Stroh- und Goldtönen im Abendlicht",
      title: "Getreideschober, Spätsommer",
      artist: "Claude Monet",
      year: "1891",
      focus: "72% 52%",
      /* Loop-Video im Rahmen — läuft stumm in Endlosschleife, das Gemälde
         oben bleibt Poster und Reduced-Motion-Fallback */
      video: "/video/wine-white-720.mp4",
      videoPoster: "/img/pour/wine-white-still.webp",
      videoFocus: "50% 50%",
      videoTitle: "Strohgelb im Glas",
    },
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
      artwork: {
        src: "/img/wines/greco-di-tufo/front.jpg",
        alt: "Flasche Greco di Tufo D.O.C.G. von Maria Maria — Frontansicht des Etiketts",
        medium: "Die Flasche",
        title: "Greco di Tufo D.O.C.G.",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
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
      artwork: {
        src: "/img/wines/greco-di-tufo/back.jpg",
        alt: "Rückenetikett der Flasche Greco di Tufo D.O.C.G. von Maria Maria",
        medium: "Das Rückenetikett",
        title: "Greco di Tufo D.O.C.G.",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Frisch, zart und verführerisch",
      text: "Am Gaumen frisch und delikat zugleich – ein Weißwein mit Struktur, der leise verführt statt laut zu sein.",
      tone: "#D8E2CE",
      artwork: {
        src: "/img/wines/greco-di-tufo/hero.jpg",
        alt: "Flasche Greco di Tufo D.O.C.G. von Maria Maria in der Kellerei",
        medium: "In der Kellerei",
        title: "Greco di Tufo D.O.C.G.",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
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
    photo: "/img/home/region-kampanien.webp",
    photoAlt: "Weinberge über dem Golf von Neapel mit Blick auf den Vesuv",
    chip: { title: "Tufo", subtitle: "Irpinien · Kampanien" },
  },

  /* ---- Der Maria-Maria-Moment ---- */
  /* ---- Der Maria-Maria-Moment (eine Szene statt einer Speisenliste) ----
     PHOTO DROP-IN: 2:1 (1774 × 887) unter public/img/pairing/ ablegen und
     `image` auf den Pfad setzen. Solange null, rendert die Sektion die
     Copy über die volle Breite. */
  pairing: {
    /* Copy nach der Redaktionsvorgabe „testi food pairing" (08/2026) — Anlass
       Pasta-Abend, identisch mit der Antwort-Karte in /magazin (pairingCards.js).
       Die Sektion zeigt über `cardKey` dasselbe Motiv wie die Magazine-Card;
       das 2:1-Hero-Motiv (pairingPhoto.js) bleibt oben unberührt. */
    scene: {
      dish: "Spaghetti alle Vongole",
      cardKey: "pasta-abend",
      copy: "Spaghetti alle Vongole leben von Klarheit: Venusmuscheln, Olivenöl, Knoblauch und ein Hauch Meeresaroma. Genau darin liegt die Stärke des Greco di Tufo DOCG. Seine mineralische Spannung, seine Frische und seine präzise Struktur greifen die salzige Eleganz des Gerichts auf, ohne sich in den Vordergrund zu drängen. So entsteht ein Pairing, das die Küste Kampaniens auf besonders authentische Weise spürbar macht.",
      image: null,
      imageAlt:
        "Spaghetti alle Vongole auf einem Teller in der Trattoria, daneben ein Glas Greco di Tufo und die Flasche",
      regionLink: {
        label: "Mehr über Kampanien entdecken",
        href: "/regionen#kampanien",
        region: "kampanien",
      },
    },
  },

  /* ---- Servieren & Genießen + Der Maria-Moment ---- */
  moment: {
    title: "So schmeckt der Greco am besten",
    accent: { base: "#D2AE55", deep: "#8F6B1F", light: "#EFE3BC" },
    serve: {
      title: "Servieren & Genießen",
      items: [
        { icon: "thermometer", title: "Serviertemperatur", text: "ca. 10 °C — im Weißweinglas" },
        /* [BESTÄTIGEN] Trinkfenster nicht im Datenblatt — der vulkanische Boden gibt dem Greco Langlebigkeit */
        { icon: "hourglass", title: "Trinkfenster", text: "Jetzt genießen oder innerhalb von 3–5 Jahren" },
        { icon: "glasses", title: "Der Auftakt", text: "Kurz vor dem Servieren aus dem Kühlschrank nehmen" },
      ],
    },
    maria: {
      text: "Für Abende, an denen niemand auf die Uhr schaut — ein Glas Greco, gute Gespräche und Zeit, die stehen bleibt.",
      link: { label: "Mehr entdecken", href: "/shop" },
    },
    essence: [
      {
        icon: "glass",
        kicker: "Geschmack",
        title: "Frisch, zart und verführerisch",
        text: "Gelbe Steinfrucht, Zitrusschale und ein feiner mineralischer Zug — ein Weißwein mit Struktur, der leise verführt.",
        tone: "#D2AE55",
        toneDeep: "#8F6B1F",
      },
      {
        icon: "italy",
        kicker: "Herkunft",
        title: "Tufo, Irpinien",
        text: "Weinberge auf vulkanischem Tuffgestein im bergigen Hinterland Kampaniens — Höhenlage und kühle Nächte geben Spannung.",
        tone: "#A8452F",
        toneDeep: "#6B2114",
      },
      {
        icon: "grapes",
        kicker: "Rebsorte",
        title: "Greco",
        text: "Mit griechischen Siedlern nach Süditalien gekommen — heute einer der wenigen Weißweine Italiens mit D.O.C.G.-Status.",
        tone: "#8F9A63",
        toneDeep: "#5C6638",
      },
    ],
  },

  /* ---- Häufige Fragen ---- */
  /* Fragenset nach der FAQ-Guide (Product-Cluster Greco): Geschmack, DOCG,
     Mineralität, Pairing, Vergleich mit der Falanghina — Antworten aus
     bestätigten Fakten (Boden, Denomination, Datenblatt), Vergleich kurz
     mit Link auf den Nachbarwein. */
  faq: [
    {
      id: "greco-geschmack",
      q: "Wie schmeckt der Greco di Tufo?",
      a: "Intensiv und angenehm im Duft, strohgelb mit goldenen Reflexen im Glas – und am Gaumen frisch, zart und verführerisch. Ein Weißwein mit Struktur, der zugänglich bleibt.",
    },
    {
      id: "greco-docg",
      q: "Was bedeutet DOCG bei Greco di Tufo?",
      a: "D.O.C.G. steht für „Denominazione di Origine Controllata e Garantita“ – die höchste Herkunftsstufe im italienischen Weinrecht. Der Greco di Tufo ist einer der wenigen Weißweine Italiens mit dieser Klassifizierung.",
    },
    {
      id: "greco-mineralisch",
      q: "Ist Greco di Tufo mineralisch?",
      a: "Ja. Die Weinberge rund um das Dorf Tufo liegen auf vulkanischem Tuffgestein, das dem Wein einen feinen mineralischen Zug und Spannung verleiht. Zusammen mit Höhenlage und kühlen Nächten entsteht so seine typische Struktur – Frische mit Tiefgang.",
    },
    {
      id: "greco-pairing",
      q: "Zu welchem Essen passt Greco di Tufo?",
      a: "Perfekt zu Fischgerichten, Meeresfrüchten, Käse und Risotto — besonders überraschend schmeckt er zu Mozzarella di Bufala. Mit seiner Struktur begleitet der Greco die helle Küche, ohne sie zu übertönen; servieren Sie ihn dazu gut gekühlt bei etwa 10 °C im Weißweinglas.",
    },
    {
      id: "greco-vs-falanghina",
      q: "Was ist der Unterschied zu Falanghina?",
      a: "Der Greco bringt Struktur, goldene Reflexe und einen mineralischen Zug vom Tuffboden mit – ein Weißwein mit D.O.C.G.-Status, der leise verführt. Die Falanghina aus dem Beneventano ist weicher, heller in der Frucht und unkomplizierter. Kurz: der Greco für Tiefe, die Falanghina für den leichten Auftakt.",
      link: { label: "Falanghina entdecken", href: "/unsere-weine/falanghina" },
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen der Greco gefällt",
    names: ["Falanghina I.G.P.", "Il Bianco – Greco Cuvée", "Lugana D.O.P."],
    trait: "die dieselbe Klarheit mitbringen: frisch, fein, mineralisch.",
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
    { label: "Passt zu", href: "#maria-moment" },
    { label: "Fragen", href: "#fragen" },
  ],
};
