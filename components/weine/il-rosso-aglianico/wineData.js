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
    "100 % Aglianico aus Kampanien. Sechs Monate französische Eiche, dunkle Frucht und würzige Tiefe — la poesia in bottiglia.",
  /* Akt 2 des gepinnten Heros — drei Worte, die beim Scrollen erscheinen */
  heroWords: ["Tief.", "Würzig.", "Charakterstark."],

  /* Kurzformen für generische Sektionstexte (sonst greift der Falanghina-Default) */
  shortNameNom: "der Rosso",
  shortNameGen: "des Rosso",

  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Unsere Weine", href: "/unsere-weine" },
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
    { icon: "grapes", label: "Rebsorte", value: "100 % Aglianico" },
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
      src: "/img/art/farbe-rot-fantin-latour.webp",
      alt: "Ölgemälde „Roses in a Bowl“ von Henri Fantin-Latour: Rosen in Rubin- und Cremetönen vor tiefdunklem Grund",
      title: "Roses in a Bowl",
      artist: "Henri Fantin-Latour",
      year: "1883",
      focus: "50% 40%",
      /* Loop-Video im Rahmen — läuft stumm in Endlosschleife, das Gemälde
         oben bleibt Poster und Reduced-Motion-Fallback */
      video: "/video/wine-red-720.mp4",
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
    { label: "Uvaggio", value: "100 % Aglianico" },
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
    title: "Eine Rebe, ein Charakter",
    paragraphs: [
      /* [BESTÄTIGEN] Storytelling zur Rebsorte */
      "Aglianico gibt dem Wein alles, was er hat: Rückgrat und Struktur, dunkle Frucht und die würzige Tiefe Kampaniens. Eine Rebsorte, die nichts hinter einem Verschnitt verstecken kann — und es auch nicht muss.",
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
    photo: "/img/home/region-kampanien.webp",
    photoAlt: "Weinberge über dem Golf von Neapel mit Blick auf den Vesuv",
    chip: { title: "Campania", subtitle: "Kampanien · Italien" },
  },

  /* ---- Der Maria-Maria-Moment ---- */
  /* ---- Der Maria-Maria-Moment (eine Szene statt einer Speisenliste) ----
     PHOTO DROP-IN: 2:1 (1774 × 887) unter public/img/pairing/ ablegen und
     `image` auf den Pfad setzen. Solange null, rendert die Sektion die
     Copy über die volle Breite. */
  pairing: {
    scene: {
      dish: "Maiale al ragù mit Paccheri",
      copy: "Schweinenacken, der einen halben Nachmittag in Tomate, Zwiebel und Lorbeer schmort, bis die Sauce dunkel und dicht ist. Dazu Paccheri, die breiten Röhren, die genug Sauce fassen. Der Rosso braucht dieses Gegenüber: Fett und Eiweiß aus dem Schmorfleisch binden sein Tannin, das solo streng wirken könnte, und lassen dafür die Frucht nach vorn. Die sechs Monate Eiche liegen im Hintergrund und treffen dort auf die Röstaromen aus der Pfanne.",
      image: null,
      imageAlt:
        "Paccheri mit geschmortem Schweinefleisch-Ragù in einer Schüssel, daneben ein Glas Il Rosso und die geöffnete Flasche",
      regionLink: {
        label: "Mehr über Kampanien entdecken",
        href: "/regionen#kampanien",
        region: "kampanien",
      },
    },
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
        title: "100 % Aglianico",
        text: "Die große rote Rebsorte Süditaliens: Rückgrat, Würze und reife dunkle Frucht — Ende Oktober von Hand gelesen.",
        tone: "#7A2A55",
        toneDeep: "#41102A",
      },
    ],
  },

  /* ---- Häufige Fragen ---- */
  /* Fragenset nach der FAQ-Guide (Product-Cluster Il Rosso): der branded Name
     allein bleibt abstrakt — die FAQ macht die Rebsorte Aglianico und den
     Anlass sichtbar. Il Rosso ist ein reinsortiger Aglianico (100 %) und
     ausdrücklich keine Cuvée; siehe Regionen-Guide v1.0, Entscheidung P0.
     Ausbau/Servieren stehen in Detail & Genießen. */
  faq: [
    {
      id: "rosso-geschmack",
      q: "Wie schmeckt Maria Maria Il Rosso Aglianico?",
      a: "Ein einnehmender Rotwein mit ausgeprägten Noten von Amarena, Brombeere und getrockneter Pflaume, einem leichten Hauch süßer Gewürze und einem Abgang mit angenehm konzentrierter Frucht.",
    },
    {
      id: "rosso-rebsorte",
      q: "Welche Rebsorte prägt Il Rosso?",
      a: "Il Rosso besteht aus 100 % Aglianico, der großen roten Rebsorte Süditaliens — keine Cuvée. Ende Oktober werden die Trauben von Hand gelesen und selektiert; nach rund zwölf Tagen auf der Maische reift der Wein sechs Monate in Fässern aus französischer Eiche.",
    },
    {
      id: "rosso-essen",
      q: "Zu welchem Essen passt Il Rosso Aglianico?",
      a: "Zu kräftigen Primi, Wurstwaren und Schweinebraten — ebenso zu vegetarischen Gerichten mit reichen, würzigen Saucen und fein gewürzten Rezepten. Der Rosso liebt alles, was Würze und Substanz hat; servieren Sie ihn dazu bei 16 bis 18 °C im Rotweinglas.",
    },
    {
      id: "rosso-anlass",
      q: "Für welchen Anlass eignet sich Il Rosso Aglianico?",
      a: "„La poesia in bottiglia“: ein Wein für lange Abende, volle Tische und Gespräche, die nicht enden wollen. Ideal zum gemeinsamen Dinner mit kräftiger Küche — bei 16 bis 18 °C serviert und eine knappe Stunde vorher geöffnet.",
    },
    {
      /* Katalog folgt jetzt dem Datenblatt: Herkunft durchgängig Kampanien
         (Campania Rosso I.G.P.), wie auf dem Etikett ausgewiesen. */
      id: "rosso-igp",
      q: "Was bedeutet „Campania Rosso I.G.P.“?",
      a: "IGP steht für „Indicazione Geografica Protetta“, die geschützte geografische Angabe. „Campania Rosso I.G.P.“ ist die auf Etikett und Datenblatt ausgewiesene Bezeichnung dieses Weins.",
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen Il Rosso gefällt",
    names: ["Primitivo di Manduria D.O.C. 15,5", "Primitivo Salento IGP", "Rosato Puglia"],
    /* Gemischte Auswahl (zwei Rote, ein Rosé) — SimilarWines schreibt hier
       „Drei Weine", der Halbsatz bleibt deshalb bewusst farbneutral. */
    trait: "die den süditalienischen Charakter teilen: würzig, warm, charakterstark.",
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
    { label: "Passt zu", href: "#maria-moment" },
    { label: "Geschmack", href: "#geschmack" },
    { label: "Fragen", href: "#fragen" },
  ],
};
