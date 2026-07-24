/* Il Bianco — Campania Bianco I.G.P. — Inhaltsmodell für die Weinlandingpage.
   Gleiche Form wie components/weine/falanghina/wineData.js; die Sektionen sind
   geteilt und rein wine-Prop-getrieben.

   Quelle der harten Daten: das Datenblatt des Erzeugers (Uvaggio, Gradazione,
   Vendemmia, Vinificazione, Caratteristiche organolettiche, Abbinamento,
   Temperatura di servizio).

   PHOTO DROP-IN: Fotos unter public/img/wines/il-bianco/ ablegen
   (front.jpg / back.jpg / hero.jpg). Fehlende Pfade auf null setzen — dann
   greift automatisch die illustrierte Flasche.

   Felder mit [BESTÄTIGEN] sind plausibel formulierte, aber nicht aus dem
   Datenblatt belegte Texte (Aromatik, Storytelling) — vor Go-live prüfen. */

export const IL_BIANCO = {
  slug: "il-bianco-greco-cuvee",
  catalogName: "Il Bianco – Greco Cuvée", // key in components/data.js WINES

  name: "Il Bianco — Campania Bianco IGP",
  shortNameNom: "der Bianco",
  shortNameGen: "des Bianco",
  eyebrow: "Italienische Boutique-Weine",
  heroTitle: ["Il Bianco", "Campania Bianco IGP"],
  lede:
    "Eine Cuvée aus ausgewählten weißen Rebsorten Kampaniens. Zwei Jahre Ruhe im Stahltank schenken ihm ein intensives Bouquet und einen zarten, verführerischen Geschmack.",
  heroWords: ["Intensiv.", "Zart.", "Verführerisch."],

  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Unsere Weine", href: "/weine" },
    { label: "Il Bianco — Campania Bianco IGP", href: null },
  ],

  images: {
    /* Studio-Packshot & Rückenetikett (aus Schede tecniche e foto bottiglie) */
    front: "/img/wines/il-bianco-greco-cuvee/front.jpg",
    back: "/img/wines/il-bianco-greco-cuvee/back.jpg",
    /* Kellerei-Foto der Flasche — trägt den kompletten Kino-Hero */
    hero: "/img/wines/il-bianco-greco-cuvee/hero.jpg",
  },

  /* ---- Schnellfakten ---- */
  facts: [
    { icon: "pin", label: "Herkunft", value: "Kampanien, Italien" },
    { icon: "grapes", label: "Uvaggio", value: "Cuvée ausgewählter weißer Rebsorten" },
    { icon: "tank", label: "Ausbau", value: "2 Jahre Stahltank" },
    { icon: "thermometer", label: "Serviertemperatur", value: "ca. 10 °C" },
  ],

  /* ---- Farb-Kapitel ---- */
  colorMoment: {
    kicker: "Die Farbe",
    lines: ["Strohgelb.", "Hell und ruhig."],
    text: "Im Glas zeigt sich der Bianco strohgelb und klar — ein Weißwein, dessen Ruhe man sieht, bevor man ihn riecht.",
    swatches: [
      { hex: "#F5EFC8", label: "Helles Stroh" },
      { hex: "#E9DEA0", label: "Strohgelb" },
      { hex: "#DCCB86", label: "Warmer Reflex" },
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
      video: "/video/wine-white.mp4",
      videoFocus: "50% 50%",
      videoTitle: "Strohgelb im Glas",
    },
  },

  /* ---- Der Geschmack: Auge / Nase / Gaumen ---- */
  taste: [
    {
      key: "farbe",
      icon: "eye",
      kicker: "Farbe",
      title: "Strohgelb und klar",
      text: "Ein heller, ruhiger Weißwein — strohgelb im Glas, ohne jede Schwere.",
      tone: "#E9DEA0",
      artwork: {
        src: "/img/wines/il-bianco-greco-cuvee/front.jpg",
        alt: "Flasche Il Bianco — Campania Bianco IGP von Maria Maria — Frontansicht des Etiketts",
        medium: "Die Flasche",
        title: "Il Bianco — Campania Bianco IGP",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
    {
      key: "duft",
      icon: "nose",
      kicker: "Duft",
      title: "Sehr intensiv und angenehm",
      text: "Das Datenblatt nennt ihn schlicht „profumo molto intenso e gradevole“: ein weit geöffnetes, einnehmendes Bouquet, das den ganzen Raum füllt.",
      tone: "#E4E1BC",
      artwork: {
        src: "/img/wines/il-bianco-greco-cuvee/back.jpg",
        alt: "Rückenetikett der Flasche Il Bianco — Campania Bianco IGP von Maria Maria",
        medium: "Das Rückenetikett",
        title: "Il Bianco — Campania Bianco IGP",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Zart und verführerisch",
      text: "Am Gaumen delikat und zurückhaltend — ein Wein, der nicht drängt, sondern einlädt. Genau das macht ihn so gefährlich trinkbar.",
      tone: "#D6E3D2",
      artwork: {
        src: "/img/wines/il-bianco-greco-cuvee/hero.jpg",
        alt: "Flasche Il Bianco — Campania Bianco IGP von Maria Maria in der Kellerei",
        medium: "In der Kellerei",
        title: "Il Bianco — Campania Bianco IGP",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
  ],

  /* ---- Im Detail ---- */
  detail: [
    { label: "Bezeichnung", value: "Campania Bianco IGP", span: "wide" },
    { label: "Uvaggio", value: "Blend ausgewählter weißer Rebsorten" },
    { label: "Herkunft", value: "Kampanien, Italien" },
    { label: "Lese", value: "Ende September / Anfang Oktober" },
    {
      label: "Vinifikation",
      value: "Sanfte, weiche Pressung ganzer Trauben. Anschließend zwei Jahre Reife im Stahlsilo.",
      span: "wide",
    },
    { label: "Ausbau", value: "2 Jahre im Stahltank" },
    { label: "Alkoholgehalt", value: "13,0 % vol." },
    { label: "Serviertemperatur", value: "ca. 10 °C" },
    { label: "Füllmenge", value: "750 ml" },
    { label: "Hinweis", value: "Enthält Sulfite" },
  ],

  /* ---- Die Geschichte ---- */
  story: {
    kicker: "Die Geschichte",
    title: "Zwei Jahre Geduld",
    paragraphs: [
      "Il Bianco ist keine Solistin, sondern ein Zusammenspiel: ausgewählte weiße Rebsorten Kampaniens, die erst gemeinsam ihren Charakter finden. Die Trauben werden als ganze Rispen sanft und weich gepresst — nichts wird erzwungen.",
      /* [BESTÄTIGEN] Deutung der zweijährigen Stahlreife */
      "Danach kommt der Teil, den man nicht abkürzen kann: zwei Jahre im Stahlsilo. Kein Holz, keine Ablenkung. Was bleibt, ist ein sehr intensives Bouquet und ein Geschmack, der zart geworden ist statt laut.",
    ],
    quote: {
      text: "Manche Weine muss man warten lassen, damit sie leise werden.",
      attribution: "Maria & Maria",
    },
  },

  /* ---- Der Ort ---- */
  place: {
    kicker: "Die Herkunft",
    title: "Kampanien",
    region: "kampanien",
    text: "Sonne, Meer und vulkanische Böden: Kampanien bringt weiße Rebsorten hervor, die Frucht und Frische zugleich halten können. Genau daraus entsteht diese Cuvée.",
    stats: [
      { label: "Region", value: "Kampanien" },
      { label: "Klassifikation", value: "Campania Bianco IGP" },
      { label: "Lese", value: "Ende September" },
      { label: "Reife", value: "2 Jahre im Stahl" },
    ],
    photo: "/img/region-kampanien.jpg",
    photoAlt: "Weinlandschaft in Kampanien",
    chip: { title: "Campania", subtitle: "Kampanien · Italien" },
  },

  /* ---- Passt zu (aus dem Datenblatt) ---- */
  pairing: {
    kicker: "Passt zu",
    title: "Alles, was aus dem Meer kommt",
    text: "Das Datenblatt ist hier eindeutig: Fisch, Krustentiere, Meeresfrüchte. Der Bianco begleitet sie, ohne sie zu übertönen.",
    photo: "/img/aperitivo.jpg",
    photoAlt: "Gedeckter Tisch mit Fisch und einem Glas Weißwein",
    items: [
      { icon: "fish", title: "Fischgerichte", text: "Gegrillt, gedämpft oder aus dem Ofen" },
      { icon: "shell", title: "Krustentiere", text: "Garnelen, Scampi, Langustinen" },
      { icon: "plate", title: "Meeresfrüchte", text: "Vongole, Muscheln, Crudo" },
      { icon: "glasses", title: "Aperitivo", text: "Gut gekühlt als Auftakt des Abends" },
    ],
  },

  /* ---- Servieren & Genießen + Der Maria-Moment ---- */
  moment: {
    title: "So schmeckt der Bianco am besten",
    accent: { base: "#DCCB86", deep: "#8F7A33", light: "#F1E9C6" },
    serve: {
      title: "Servieren & Genießen",
      items: [
        { icon: "thermometer", title: "Serviertemperatur", text: "ca. 10 °C — nicht zu kalt, sonst verschließt sich das Bouquet" },
        /* [BESTÄTIGEN] Trinkfenster nicht im Datenblatt — der Bianco reift bereits 2 Jahre im Stahl */
        { icon: "hourglass", title: "Trinkfenster", text: "Bereits gereift — jetzt genießen oder innerhalb von 2–3 Jahren" },
        { icon: "glasses", title: "Das Glas", text: "Im bauchigen Weißweinglas entfaltet sich das intensive Bouquet am schönsten" },
      ],
    },
    maria: {
      text: "Für ruhige Abende, an denen es nichts zu beweisen gibt — ein Wein, der leise geworden ist und genau deshalb bleibt.",
      link: { label: "Mehr entdecken", href: "/shop" },
    },
    essence: [
      {
        icon: "glass",
        kicker: "Geschmack",
        title: "Zart und verführerisch",
        text: "Ein sehr intensives Bouquet, am Gaumen delikat und zurückhaltend — ein Wein, der nicht drängt, sondern einlädt.",
        tone: "#DCCB86",
        toneDeep: "#8F7A33",
      },
      {
        icon: "italy",
        kicker: "Herkunft",
        title: "Kampanien",
        text: "Sonne, Meer und vulkanische Böden — eine Region, deren weiße Reben Frucht und Frische zugleich halten.",
        tone: "#7BA0A0",
        toneDeep: "#44625F",
      },
      {
        icon: "grapes",
        kicker: "Rebsorte",
        title: "Greco Cuvée",
        text: "Ausgewählte weiße Rebsorten Kampaniens, deren Zusammensetzung dem Jahrgang folgt — zwei Jahre im Stahl vereint.",
        tone: "#C8B77A",
        toneDeep: "#7C6A22",
      },
    ],
  },

  /* ---- Häufige Fragen ---- */
  faq: [
    {
      q: "Wie schmeckt der Il Bianco?",
      a: "Sehr intensiv und angenehm im Duft, im Geschmack dagegen zart und verführerisch. Die Farbe ist strohgelb — ein heller, zugänglicher Weißwein mit erstaunlicher aromatischer Tiefe.",
    },
    {
      q: "Aus welchen Rebsorten besteht er?",
      a: "Il Bianco ist eine Cuvée aus ausgewählten weißen Rebsorten Kampaniens. Der Erzeuger gibt bewusst keine exakte Sortenaufteilung an — die Zusammensetzung folgt dem Jahrgang.",
    },
    {
      q: "Was bedeutet „Campania Bianco IGP“?",
      a: "IGP steht für „Indicazione Geografica Protetta“, die geschützte geografische Angabe. Die Trauben stammen aus der Region Kampanien in Süditalien.",
    },
    {
      q: "Zu welchen Gerichten passt der Il Bianco?",
      a: "Er passt hervorragend zu Fischgerichten, Krustentieren und Meeresfrüchten — und ebenso als gut gekühlter Aperitivo.",
    },
    {
      q: "Wie wird der Il Bianco ausgebaut?",
      a: "Ganze Trauben werden sanft und weich gepresst, anschließend reift der Wein zwei Jahre im Stahlsilo. Ohne Holz bleibt die Frucht der Cuvée unverfälscht.",
    },
    {
      q: "Wie sollte er serviert werden?",
      a: "Bei etwa 10 °C im Weißweinglas. So bleibt das intensive Bouquet erhalten, ohne dass der Wein zu kalt und damit verschlossen wird.",
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen der Bianco gefällt",
    names: ["Falanghina", "Greco di Tufo D.O.C.G.", "Lugana"],
  },

  cta: {
    title: "Noch mehr entdecken?",
    text: "Entdecken Sie alle unsere Weine im offiziellen Maria Maria Shop.",
    button: { label: "Zum offiziellen Shop", href: "/shop" },
  },

  subnav: [
    { label: "Überblick", href: "#ueberblick" },
    { label: "Geschmack", href: "#geschmack" },
    { label: "Herkunft", href: "#herkunft" },
    { label: "Genießen", href: "#geniessen" },
    { label: "Details", href: "#details" },
    { label: "Fragen", href: "#fragen" },
  ],
};
