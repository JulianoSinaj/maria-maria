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
    /* Studio-Packshot & Rückenetikett (aus Schede tecniche e foto bottiglie) */
    front: "/img/wines/rosato-puglia/front.jpg",
    back: "/img/wines/rosato-puglia/back.jpg",
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
    artwork: {
      src: "/img/art/farbe-rose-fantin-latour.webp",
      alt: "Ölgemälde „Pink and Red Roses“ von Henri Fantin-Latour: zartrosa Rosen mit warmen Reflexen",
      title: "Pink and Red Roses",
      artist: "Henri Fantin-Latour",
      focus: "50% 38%",
      /* Loop-Video im Rahmen — läuft stumm in Endlosschleife, das Gemälde
         oben bleibt Poster und Reduced-Motion-Fallback */
      video: "/video/wine-red-720.mp4",
      videoFocus: "50% 50%",
      videoTitle: "Rosa im Glas",
    },
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
      artwork: {
        src: "/img/wines/rosato-puglia/front.jpg",
        alt: "Flasche Rosato Negroamaro IGP Salento von Maria Maria — Frontansicht des Etiketts",
        medium: "Die Flasche",
        title: "Rosato Negroamaro IGP Salento",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
    {
      key: "duft",
      icon: "nose",
      kicker: "Duft",
      title: "Delikat, anhaltend, blumig",
      text: "Feine florale Noten, die nicht laut auftreten, aber lange bleiben. Die kontrollierte Gärtemperatur bewahrt jedes Aroma.",
      tone: "#E8A793",
      artwork: {
        src: "/img/wines/rosato-puglia/back.jpg",
        alt: "Rückenetikett der Flasche Rosato Negroamaro IGP Salento von Maria Maria",
        medium: "Das Rückenetikett",
        title: "Rosato Negroamaro IGP Salento",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Frisch, ausgewogen, elegant fruchtig",
      text: "Am Gaumen frisch und in sich stimmig — ein Rosé, dessen Frucht elegant bleibt statt süß zu werden.",
      tone: "#D98A76",
      artwork: {
        src: "/img/wines/rosato-puglia/hero.jpg",
        alt: "Flasche Rosato Negroamaro IGP Salento von Maria Maria in der Kellerei",
        medium: "In der Kellerei",
        title: "Rosato Negroamaro IGP Salento",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
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
    photo: "/img/home/region-apulien.webp",
    photoAlt: "Trulli und Olivenhaine in Apulien im Abendlicht",
    chip: { title: "Salento", subtitle: "Apulien · Italien" },
  },

  /* ---- Passt zu (Food-Pairing, aus dem Datenblatt) ---- */
  pairing: {
    kicker: "Passt zu",
    title: "Der Wein für den Aperitivo",
    text: "Ideal zum Aperitif und zu allem, was leicht und mediterran bleibt — von Antipasti bis zum blauen Fisch.",
    why: {
      kicker: "Warum das zusammenpasst",
      principle:
        "Der Rosato steht dazwischen — und genau das ist sein Vorteil: die Frische eines Weißweins, die Frucht eines Roten. Er passt dorthin, wo ein Tisch beides gleichzeitig verlangt.",
      axes: [
        { label: "Frische", value: 76, hint: "die Seite, die er vom Weißwein hat" },
        { label: "Frucht", value: 68, hint: "die Seite, die er vom Roten hat" },
        { label: "Leichtigkeit", value: 72, hint: "bleibt mediterran, nie schwer" },
      ],
    },
    photo: "/img/dinner.webp",
    photoAlt: "Gedeckter Tisch mit Antipasti und Roséwein",
    items: [
      {
        icon: "glasses",
        title: "Aperitivo",
        text: "Der Klassiker vor dem Essen",
        note: "Frucht macht neugierig, Frische macht Appetit — beides in einem Glas.",
      },
      {
        icon: "plate",
        title: "Antipasti",
        text: "Vorspeisen, kalt wie warm",
        note: "Auf einem Antipasti-Teller liegt vieles nebeneinander: Der Rosato passt zu allem davon.",
      },
      {
        icon: "plate",
        title: "Einfache Primi",
        text: "Unkomplizierte Pasta- und Reisgerichte",
        note: "Wo Tomate und Kräuter führen, ergänzt die Frucht, ohne zu dominieren.",
      },
      {
        icon: "plate",
        title: "Fisch & weißes Fleisch",
        text: "Blauer Fisch, Geflügel, Kaninchen",
        note: "Blauer Fisch ist vielen Weißweinen zu kräftig — hier trägt ihn die Frucht.",
      },
    ],
  },

  /* ---- Servieren & Genießen + Der Maria-Moment ---- */
  moment: {
    title: "So schmeckt der Rosato am besten",
    accent: { base: "#D98A76", deep: "#A34A38", light: "#F4CDBB" },
    serve: {
      title: "Servieren & Genießen",
      items: [
        { icon: "thermometer", title: "Serviertemperatur", text: "12–14 °C — gut gekühlt" },
        /* [BESTÄTIGEN] Trinkfenster nicht im Datenblatt — Rosé lebt von seiner Jugend */
        { icon: "hourglass", title: "Trinkfenster", text: "Jung genießen — am schönsten innerhalb von 1–2 Jahren" },
        { icon: "glasses", title: "Der Auftakt", text: "Kurz vor dem Servieren aus dem Kühlschrank nehmen — die Frische ist sein Charakter" },
      ],
    },
    maria: {
      text: "Für Sommerabende auf der Terrasse — wenn der Tag noch nachhallt, das Licht warm wird und das Essen leicht bleibt.",
      link: { label: "Mehr entdecken", href: "/shop" },
    },
    essence: [
      {
        icon: "glass",
        kicker: "Geschmack",
        title: "Frisch, ausgewogen, elegant",
        text: "Feine florale Noten, delikat und anhaltend — eine Frucht, die elegant bleibt statt süß zu werden.",
        tone: "#D98A76",
        toneDeep: "#A34A38",
      },
      {
        icon: "italy",
        kicker: "Herkunft",
        title: "Salento, Apulien",
        text: "Alberello-Weinberge von Torricella und Maruggio — vier Stunden auf der Schale, mehr braucht es nicht.",
        tone: "#D8A97E",
        toneDeep: "#8A5A2E",
      },
      {
        icon: "grapes",
        kicker: "Rebsorte",
        title: "Negroamaro",
        text: "Die dunkle Rebe des Salento — ihr Name trägt das Schwarz schon in sich. Hier zeigt sie ihre zarte Seite.",
        tone: "#C67F78",
        toneDeep: "#8A4340",
      },
    ],
  },

  /* ---- Häufige Fragen ---- */
  /* Fragenset nach der FAQ-Guide (Product-Cluster Rosato Puglia — bewusst auf
     dem aktuellen Produkt aufgebaut, kein Chiaretto-Erbe): Geschmack,
     Trockenheit, Aperitivo-Anlass samt Serviertemperatur und die
     Rosato/Rosé-Terminologie als Mikro-Antwort mit der Schalenkontakt-Story. */
  faq: [
    {
      id: "rosato-geschmack",
      q: "Wie schmeckt der Maria Maria Rosato Puglia?",
      a: "Frisch, ausgewogen und elegant fruchtig. In der Nase delikat und anhaltend mit floralen Noten, im Glas rosa wie Pfirsichfleisch — am Gaumen bleibt die Frucht elegant, statt süß zu werden: ein Rosé, der von seiner Frische lebt.",
    },
    {
      /* [BESTÄTIGEN] „trocken (secco)“ steht nicht explizit im Datenblatt —
         Antwort stützt sich auf die freigegebene Geschmacksbeschreibung
         („statt süß zu werden“) und die Sortiments-Auszeichnung „Trocken“ */
      id: "rosato-trocken",
      q: "Ist Rosato Puglia trocken?",
      a: "Ja — seine Frucht bleibt elegant und frisch, statt süß zu wirken. Nur vier Stunden auf der Schale und drei Monate Ruhe im Stahltank bewahren genau diese Klarheit, bei leichten 12 % vol.",
    },
    {
      id: "rosato-aperitivo",
      q: "Passt Rosato zum Aperitivo?",
      a: "Er ist geradezu dafür gemacht: gut gekühlt bei 12 bis 14 °C der Klassiker vor dem Essen. Ebenso schön begleitet er Antipasti, einfache Primi und Hauptgänge mit blauem Fisch oder weißem Fleisch.",
    },
    {
      id: "rosato-vs-rose",
      q: "Was ist der Unterschied zwischen Rosato und Rosé?",
      a: "In der Sache keiner: Rosato ist das italienische Wort für Rosé. Entscheidend ist die Machart — unser Rosato entsteht aus der dunklen Negroamaro-Traube, deren Most nur vier Stunden auf den Schalen bleibt. Die Farbe sitzt in der Beerenhaut, nicht im Saft: eine kurze Standzeit ergibt das zarte Rosa statt eines Rotweins.",
    },
    {
      id: "rosato-igp",
      q: "Was bedeutet „IGP Salento“?",
      a: "IGP steht für „Indicazione Geografica Protetta“, die geschützte geografische Angabe. Die Trauben stammen aus dem Salento, dem südlichsten Teil Apuliens.",
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
    { label: "Servieren", href: "#servieren" },
    { label: "Geschmack", href: "#geschmack" },
    { label: "Passt zu", href: "#passt-zu" },
    { label: "Fragen", href: "#fragen" },
  ],
};
