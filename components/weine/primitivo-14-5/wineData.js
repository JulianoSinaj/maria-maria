/* Primitivo di Manduria DOP 14,50 — Inhaltsmodell für die Wein-Landingpage.
   Gleiche Form wie wineData.js (Falanghina): dieselben Sektionen, nur andere
   Daten. Technische Werte stammen aus dem Datenblatt
   "MARIA MARIA — PRIMITIVO DI MANDURIA DOP 14.50".

   PHOTO DROP-IN: Fotos unter public/img/wines/primitivo-14-5/ ablegen
   (hero.jpg = Kellerei-Stimmungsfoto mit der Flasche, front.jpg = Packshot,
   back.jpg = Rückenetikett). Solange eine Datei fehlt, den Pfad auf null setzen.

   Mit [BESTÄTIGEN] markierte Felder sind plausible, aber nicht im Datenblatt
   belegte Storytelling-Passagen. */

export const PRIMITIVO_14_5 = {
  slug: "primitivo-14-5",
  catalogName: "Primitivo 14,5", // key into components/data.js WINES via byName()

  name: "Primitivo di Manduria DOP 14,50",
  eyebrow: "Italienische Boutique-Weine",
  heroTitle: ["Primitivo 14,50", "di Manduria DOP"],
  /* Verlauf der kursiven zweiten Headline-Zeile — Rubinrot statt des
     Falanghina-Grüns, abgestimmt auf das rote Etikett und das warme
     Kellerlicht des Heros. */
  titleGradient: "from-bordeaux via-[#8C2230] to-champagne",
  lede:
    "100 % Primitivo aus Torricella und Lizzano, im Alberello-Buschbau ohne Bewässerung gezogen. Zwölf Monate Stahl, dunkle Brombeere und Pflaume — Struktur, die geschmeidig bleibt.",
  /* Akt 2 des gepinnten Heros — drei Worte, die beim Scrollen erscheinen */
  heroWords: ["Dunkel.", "Weich.", "Anhaltend."],

  /* Kurzformen für generische Sektionstexte (sonst greift der Falanghina-Default) */
  shortNameNom: "der Primitivo",
  shortNameGen: "des Primitivo",

  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Unsere Weine", href: "/weine" },
    { label: "Primitivo di Manduria DOP 14,50", href: null },
  ],

  images: {
    /* Packshot & Rückenetikett liegen noch nicht vor — bleiben null, bis die
       Dateien unter public/img/wines/primitivo-14-5/ liegen. */
    front: null,
    back: null,
    /* Kellerei-Stimmungsfoto mit der Flasche — trägt den kompletten Kino-Hero */
    hero: "/img/wines/primitivo-14-5/hero.jpg",
  },

  /* ---- Schnellfakten (Icon-Leiste unter dem Hero) ---- */
  facts: [
    { icon: "pin", label: "Herkunft", value: "Manduria, Apulien" },
    { icon: "grapes", label: "Rebsorte", value: "100 % Primitivo di Manduria DOP" },
    { icon: "tank", label: "Ausbau", value: "12 Monate im Stahltank" },
    { icon: "thermometer", label: "Serviertemperatur", value: "16–18 °C" },
  ],

  /* ---- Farb-Kapitel (immersive Typo-Sektion) ---- */
  colorMoment: {
    kicker: "Die Farbe",
    lines: ["Sehr intensives Rubinrot.", "Mit violetten Reflexen."],
    text: "Im Glas steht der Primitivo tief und undurchdringlich — die violetten Reflexe am Rand verraten die Jugend und die Kraft der sonnenverwöhnten Trauben aus dem Salento.",
    swatches: [
      { hex: "#5C0D18", label: "Rubinrot" },
      { hex: "#3B0A14", label: "Dunkle Brombeere" },
      { hex: "#7A2A55", label: "Violetter Reflex" },
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
      title: "Sehr intensives Rubinrot",
      text: "Ein dichtes, sehr intensives Rubinrot mit violetten Reflexen — die Farbe eines Weines von hoher Struktur.",
      tone: "#5C0D18",
    },
    {
      key: "duft",
      icon: "nose",
      kicker: "Duft",
      title: "Brombeere und Pflaume",
      text: "Ein komplexes Bukett, das mit seinem ausgeprägten Aroma von Brombeeren und Pflaumen überrascht — die intensiven Düfte reifer Früchte.",
      tone: "#7A2A55",
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Weich, intensiv und anhaltend",
      text: "Weich am Gaumen, mit intensivem und anhaltendem Geschmack — ein Wein von großer Struktur, der trotzdem leicht und angenehm zu trinken bleibt.",
      tone: "#A8452F",
    },
  ],

  /* ---- Im Detail (Bento / technisches Datenblatt) ---- */
  detail: [
    { label: "Bezeichnung", value: "Primitivo di Manduria D.O.P.", span: "wide" },
    { label: "Rebsorte", value: "Primitivo di Manduria DOP 100 %" },
    { label: "Herkunft", value: "Torricella und Lizzano, Apulien" },
    { label: "Erziehung", value: "Ausschließlich Alberello (Buschrebe), ohne Bewässerung" },
    {
      label: "Vinifikation",
      value:
        "Alkoholische Gärung bei kontrollierter Temperatur, um Aromen und Farbe zu bewahren, mit 7–8 Tagen Maischekontakt. Anschließend eine leichte Pressung der Schalen.",
      span: "wide",
    },
    { label: "Ausbau", value: "12 Monate im Stahltank bis zur Abfüllung" },
    { label: "Alkoholgehalt", value: "14,50 % vol." },
    { label: "Serviertemperatur", value: "16–18 °C" },
    { label: "Füllmenge", value: "750 ml" },
    { label: "Hinweis", value: "Enthält Sulfite" },
  ],

  /* ---- Die Geschichte ---- */
  story: {
    kicker: "Die Geschichte",
    title: "Alberello — der Buschbau des Salento",
    paragraphs: [
      "Die Trauben stammen aus den Primitivo-Weinbergen der Gemeinden Torricella und Lizzano — Lagen, die wie kaum andere dafür geschaffen sind, einen Wein von hoher Struktur mit intensiven Düften reifer Früchte hervorzubringen.",
      /* [BESTÄTIGEN] Einordnung der Alberello-Erziehung als Storytelling */
      "Erzogen wird ausschließlich im Alberello, dem traditionellen Buschbau, und ohne Bewässerung. Jeder Stock steht für sich, trägt wenig und muss seine Wurzeln tief in den Kalkboden treiben — der Grund für die Konzentration, die man später im Glas schmeckt.",
      "Nach sieben bis acht Tagen auf der Maische und einer nur leichten Pressung reift der Wein zwölf Monate im Stahl. Kein Holz, das dazwischentritt: was bleibt, ist reine, dunkle Frucht.",
    ],
    quote: {
      text: "Ein Wein für lange Abende, volle Tische und Gespräche, die nicht enden wollen.",
      attribution: "Maria & Maria",
    },
  },

  /* ---- Der Ort (Luogo) ---- */
  place: {
    kicker: "Die Herkunft",
    title: "Manduria, Apulien",
    region: "apulien", // ItalyMap region key
    text: "Im Absatz des italienischen Stiefels, zwischen Ionischem und Adriatischem Meer, liegen Torricella und Lizzano. Viel Sonne, wenig Regen und kalkhaltige Böden geben dem Primitivo di Manduria seine Wärme, seine Reife und seine unverkennbare Tiefe.",
    stats: [
      { label: "Region", value: "Apulien (Salento)" },
      { label: "Gemeinden", value: "Torricella und Lizzano" },
      { label: "Klassifikation", value: "Primitivo di Manduria D.O.P." },
      { label: "Ausbau", value: "12 Monate im Stahltank" },
    ],
    photo: "/img/region-apulien.jpg",
    photoAlt: "Weinlandschaft im Salento, Apulien",
    chip: { title: "Manduria", subtitle: "Apulien · Italien" },
  },

  /* ---- Passt zu (Food-Pairing, aus dem Datenblatt) ---- */
  pairing: {
    kicker: "Passt zu",
    title: "Ein Begleiter für die kräftige Küche",
    text: "Dieser Wein gibt sein Bestes zu robusten Primi, rotem Fleisch und Wild sowie zu Hartkäse.",
    photo: "/img/dinner.jpg",
    photoAlt: "Gedeckter Tisch mit herzhaften Gerichten und Rotwein",
    items: [
      { icon: "plate", title: "Robuste Primi", text: "Kräftige Pasta- und Nudelgerichte" },
      { icon: "plate", title: "Rotes Fleisch", text: "Gegrilltes, Braten und Schmorgerichte" },
      { icon: "plate", title: "Wild", text: "Cacciagione und kräftige Wildgerichte" },
      { icon: "glasses", title: "Hartkäse", text: "Gereifte Käse mit fester Textur" },
    ],
  },

  /* ---- Servieren & Genießen + Der Maria-Moment ---- */
  moment: {
    title: "So schmeckt der Primitivo am besten",
    accent: { base: "#8C2230", deep: "#5C0D18", light: "#E8C7BC" },
    serve: {
      title: "Servieren & Genießen",
      items: [
        { icon: "thermometer", title: "Serviertemperatur", text: "16–18 °C — im großen Rotweinglas" },
        /* [BESTÄTIGEN] Trinkfenster nicht im Datenblatt — typisch für Primitivo dieser Struktur */
        { icon: "hourglass", title: "Trinkfenster", text: "Jetzt genießen oder innerhalb von 3–5 Jahren" },
        { icon: "decanter", title: "Das Ritual", text: "Vor dem Genuss kurz atmen lassen — eine knappe Stunde vorher öffnen" },
      ],
    },
    maria: {
      text: "Für lange Abende mit guten Gesprächen, ein gemeinsames Essen und den Genuss kleiner, besonderer Momente.",
      link: { label: "Mehr entdecken", href: "/shop" },
    },
    essence: [
      {
        icon: "glass",
        kicker: "Geschmack",
        title: "Weich, vollmundig, harmonisch",
        text: "Aromen von Brombeeren und reifen Pflaumen mit einem Hauch von Gewürzen — große Struktur, die geschmeidig bleibt.",
        tone: "#8C2230",
        toneDeep: "#5C0D18",
      },
      {
        icon: "italy",
        kicker: "Herkunft",
        title: "Manduria, Apulien",
        text: "Torricella und Lizzano im sonnigen Süden Italiens — warme Tage und kühle Nächte sorgen für reife Trauben und Finesse.",
        tone: "#A8452F",
        toneDeep: "#6B2114",
      },
      {
        icon: "grapes",
        kicker: "Rebsorte",
        title: "Primitivo",
        text: "Eine autochthone Rebsorte mit intensivem Charakter und samtigem Abgang — hier im Alberello-Buschbau ohne Bewässerung gezogen.",
        tone: "#7A2A55",
        toneDeep: "#41102A",
      },
    ],
  },

  /* ---- Häufige Fragen ---- */
  faq: [
    {
      q: "Wie schmeckt der Primitivo di Manduria DOP 14,50?",
      a: "Weich am Gaumen, mit intensivem und anhaltendem Geschmack — leicht zu trinken und ausgesprochen angenehm. In der Nase überrascht er mit einem komplexen Aroma von Brombeeren und Pflaumen.",
    },
    {
      q: "Aus welcher Rebsorte besteht dieser Wein?",
      a: "Zu 100 % aus Primitivo di Manduria DOP. Die Trauben stammen aus den Weinbergen der Gemeinden Torricella und Lizzano in Apulien.",
    },
    {
      q: "Was bedeutet „Primitivo di Manduria D.O.P.“?",
      a: "DOP steht für „Denominazione di Origine Protetta“, die geschützte Ursprungsbezeichnung. Sie erlaubt den Namen nur für Primitivo aus dem eng umgrenzten Gebiet um Manduria im apulischen Salento.",
    },
    {
      q: "Wie wird der Wein ausgebaut?",
      a: "Die alkoholische Gärung läuft bei kontrollierter Temperatur, um Aromen und Farbe zu bewahren, mit 7 bis 8 Tagen Kontakt auf den Schalen. Danach folgt eine leichte Pressung und ein Ausbau von zwölf Monaten im Stahltank bis zur Abfüllung.",
    },
    {
      q: "Was bedeutet die Erziehung im Alberello?",
      a: "Alberello ist der traditionelle Buschbau ohne Drahtrahmen. Die Reben stehen einzeln und werden nicht bewässert — die Stöcke tragen weniger, die Trauben werden konzentrierter.",
    },
    {
      q: "Wie sollte der Primitivo 14,50 serviert werden?",
      a: "Bei 16 bis 18 °C im Rotweinglas. Eine knappe Stunde vorher geöffnet, treten die dunkle Frucht und die weiche Textur am deutlichsten hervor.",
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen der Primitivo 14,50 gefällt",
    names: ["Primitivo 15,5", "Primitivo Salento IGP", "Il Rosso – Aglianico"],
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
