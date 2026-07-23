/* Lugana DOC — content model for the wine landing page.
   Gleiche Struktur wie components/weine/falanghina/wineData.js; die Sektionen
   sind wine-Prop-getrieben und werden von app/weine/lugana/page.jsx
   mit diesen Daten gefüttert.

   PHOTO DROP-IN: Fotografie unter public/img/wines/lugana/ ablegen
   (hero.jpg = Kellerei-Stimmungsfoto mit Flasche, Korkenzieher und Oliven,
   front.jpg = freigestellter Packshot). Solange eine Datei fehlt, den
   jeweiligen Pfad auf null setzen — die Sektion fällt automatisch auf die
   illustrierte Variante zurück.

   Fakten stammen aus dem Datenblatt „Lugana DOC“ (Trebbiano di Lugana /
   Turbiana, Desenzano & Pozzolengo, Kryomazeration 7 Tage, Hefelager bis zur
   Füllung). Mit [BESTÄTIGEN] markierte Felder sind erzählerisch ergänzt und
   sollten vor Go-live bestätigt werden. */

export const LUGANA = {
  slug: "lugana",
  catalogName: "Lugana", // key into components/data.js WINES via byName()

  name: "Lugana DOC",
  eyebrow: "Italienische Boutique-Weine",
  heroTitle: ["Lugana", "DOC"],
  lede:
    "Vom Südufer des Gardasees. Aus der Turbiana auf kiesigen Moränenböden entsteht ein Weißwein von intensivem, komplexem Duft — voll, warm und weich am Gaumen, mit langem, aromatischem Nachhall.",
  /* Akt 2 des gepinnten Heros — drei Worte, die beim Scrollen erscheinen */
  heroWords: ["Intensiv.", "Weich.", "Anhaltend."],

  /* Genitiv/Nominativ für generische Sektionsuntertitel */
  shortNameNom: "der Lugana",
  shortNameGen: "des Lugana",

  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Unsere Weine", href: "/weine" },
    { label: "Lugana DOC", href: null },
  ],

  images: {
    /* Freigestellter Studio-Packshot (noch offen) */
    front: null,
    /* Rückenetikett (noch offen) */
    back: null,
    /* Kellerei-Stimmungsfoto — trägt den kompletten Kino-Hero */
    hero: "/img/wines/lugana/hero.jpg",
  },

  /* ---- Schnellfakten (Icon-Leiste unter dem Hero) ---- */
  facts: [
    { icon: "pin", label: "Herkunft", value: "Gardasee – Desenzano & Pozzolengo" },
    { icon: "grapes", label: "Rebsorte", value: "Trebbiano di Lugana (Turbiana)" },
    { icon: "tank", label: "Ausbau", value: "Hefelager bis zur Füllung" },
    { icon: "thermometer", label: "Serviertemperatur", value: "8–10 °C" },
  ],

  /* ---- Farb-Kapitel (immersive Typo-Sektion) ---- */
  colorMoment: {
    kicker: "Die Farbe",
    lines: ["Strohgelb.", "Kräftig und leuchtend."],
    text: "Im Glas zeigt sich der Lugana in sattem, glänzendem Strohgelb – eine Farbe, die schon vor dem ersten Schluck von Dichte und Wärme erzählt.",
    swatches: [
      { hex: "#F4E9B8", label: "Helles Stroh" },
      { hex: "#E9D98C", label: "Strohgelb" },
      { hex: "#DCC96A", label: "Goldener Glanz" },
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

  /* ---- Der Geschmack: drei gepinnte Kapitel (Auge / Nase / Gaumen) ---- */
  taste: [
    {
      key: "farbe",
      icon: "eye",
      kicker: "Farbe",
      title: "Kräftiges, leuchtendes Strohgelb",
      text: "Ein sattes Gelb mit klarem Glanz – der erste Eindruck im Glas verspricht Fülle statt Leichtigkeit.",
      tone: "#E9D98C",
    },
    {
      key: "duft",
      icon: "nose",
      kicker: "Duft",
      title: "Maiglöckchen, Weißdorn und reife Frucht",
      text: "Intensiv und komplex: florale Noten von Maiglöckchen und Weißdorn, gefolgt von reifer Frucht, feinem Gebäck und einem zarten Röstton.",
      tone: "#EFE3C4",
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Voll, warm, weich und umhüllend",
      text: "Am Gaumen breit und samtig, mit guter Persistenz und harmonischen aromatischen Anklängen, die lange nachhallen.",
      tone: "#DCE5D4",
    },
  ],

  /* ---- Im Detail (Bento / technisches Datenblatt) ---- */
  detail: [
    { label: "Bezeichnung", value: "Lugana DOC", span: "wide" },
    { label: "Rebsorte", value: "Trebbiano di Lugana (Turbiana)" },
    { label: "Herkunft", value: "Desenzano & Pozzolengo, Gardasee" },
    { label: "Erziehung", value: "Reihenanlage mit Guyot-Schnitt" },
    {
      label: "Vinifikation",
      value:
        "Weißweinbereitung mit siebentägiger Kryomazeration auf der Schale zur Extraktion der Primäraromen. Anschließend Gärung bei kontrollierten 14–16 °C.",
      span: "wide",
    },
    { label: "Ausbau", value: "Auf der Feinhefe bis zur Abfüllung" },
    { label: "Boden", value: "Skelettreich, kiesige Matrix" },
    { label: "Serviertemperatur", value: "8–10 °C" },
    { label: "Füllmenge", value: "750 ml" },
    { label: "Hinweis", value: "Enthält Sulfite" },
  ],

  /* ---- Die Geschichte ---- */
  story: {
    kicker: "Die Geschichte",
    title: "Die Turbiana und das Licht des Gardasees",
    paragraphs: [
      "Der Lugana wächst am Südufer des Gardasees, zwischen Desenzano und Pozzolengo. Die Rebsorte heißt hier Trebbiano di Lugana – bekannter unter ihrem alten Namen Turbiana.",
      /* [BESTÄTIGEN] Erzähltext zur Bodenwirkung, aus dem Datenblatt abgeleitet */
      "Die Weinberge stehen auf skelettreichen, kiesigen Moränenböden. Genau diese magere, durchlässige Struktur ist es, die dem Wein seine Aromatik und seinen Duft schenkt – nicht Üppigkeit, sondern Konzentration.",
    ],
    quote: {
      text: "Ein Wein, der den See im Glas trägt: weit, warm und ruhig.",
      attribution: "Maria & Maria",
    },
  },

  /* ---- Der Ort (Luogo) ---- */
  place: {
    kicker: "Die Herkunft",
    title: "Das Südufer des Gardasees",
    region: "garda", // ItalyMap region key
    text: "Zwischen Desenzano und Pozzolengo liegen die Weinberge auf den Moränenhügeln des Gardasees. Der See mildert die Temperaturen, die kiesigen Böden zwingen die Reben in die Tiefe – daraus entsteht die Aromatik des Lugana.",
    stats: [
      { label: "Region", value: "Lombardei" },
      { label: "Gebiet", value: "Desenzano · Pozzolengo" },
      { label: "Boden", value: "Skelettreich, kiesig" },
      { label: "Erziehung", value: "Guyot" },
    ],
    photo: "/img/region-garda.jpg",
    photoAlt: "Weinberge am Südufer des Gardasees",
    chip: { title: "Lugana", subtitle: "Gardasee · Lombardei" },
  },

  /* ---- Passt zu (Food-Pairing, aus dem Datenblatt) ---- */
  pairing: {
    kicker: "Passt zu",
    title: "Roher und gegarter Fisch – und der Auftakt des Abends",
    text: "Der Lugana begleitet die feine Küche ohne sie zu übertönen: Er liebt zarte Gerichte, die ohne schwere Saucen auskommen.",
    photo: "/img/aperitivo.jpg",
    photoAlt: "Aperitivo mit Antipasti und einem Glas Weißwein",
    items: [
      { icon: "fish", title: "Fisch-Antipasti", text: "Roh und gegart – von Crudo bis Gebratenem" },
      { icon: "shell", title: "Meeresfrüchte", text: "Zart gewürzt, ohne schwere Saucen" },
      { icon: "plate", title: "Feine Primi", text: "Delikate erste Gänge mit klarer Würze" },
      { icon: "glasses", title: "Aperitivo", text: "Ausgezeichnet als Auftakt des Abends" },
    ],
  },

  /* ---- Servieren & Genießen + Der Maria-Moment ---- */
  moment: {
    title: "So schmeckt der Lugana am besten",
    accent: { base: "#C9C06E", deep: "#7C7433", light: "#EAE5BE" },
    serve: {
      title: "Servieren & Genießen",
      items: [
        { icon: "thermometer", title: "Serviertemperatur", text: "8–10 °C — im Weißweinglas" },
        /* [BESTÄTIGEN] Trinkfenster nicht im Datenblatt — Lugana auf der Feinhefe reift gut nach */
        { icon: "hourglass", title: "Trinkfenster", text: "Jetzt genießen oder innerhalb von 2–4 Jahren" },
        { icon: "glasses", title: "Das Ritual", text: "Ein Moment Luft im Glas öffnet Duft und Fülle" },
      ],
    },
    maria: {
      text: "Für weite Abende am Wasser — wenn der Tisch draußen steht und der See im Glas liegt: weit, warm und ruhig.",
      link: { label: "Mehr entdecken", href: "/shop" },
    },
    essence: [
      {
        icon: "glass",
        kicker: "Geschmack",
        title: "Voll, warm und weich",
        text: "Maiglöckchen, Weißdorn, reife Frucht und feines Gebäck — umhüllend, mit langem, aromatischem Nachhall.",
        tone: "#DCC96A",
        toneDeep: "#7C7433",
      },
      {
        icon: "italy",
        kicker: "Herkunft",
        title: "Südufer des Gardasees",
        text: "Kiesige Moränenböden zwischen Desenzano und Pozzolengo — der See mildert das Klima, der magere Boden konzentriert.",
        tone: "#7BA0A0",
        toneDeep: "#44625F",
      },
      {
        icon: "grapes",
        kicker: "Rebsorte",
        title: "Turbiana",
        text: "Trebbiano di Lugana — die alte weiße Rebe des Sees, auf der Feinhefe bis zur Füllung gereift.",
        tone: "#8F9A63",
        toneDeep: "#5C6638",
      },
    ],
  },

  /* ---- Häufige Fragen ---- */
  faq: [
    {
      q: "Wie schmeckt der Lugana DOC?",
      a: "Voll, warm, weich und umhüllend, mit guter Persistenz und harmonischen aromatischen Anklängen. In der Nase intensiv und komplex: Maiglöckchen und Weißdorn, gefolgt von reifer Frucht, feinem Gebäck und einem zarten Röstton.",
    },
    {
      q: "Aus welcher Rebsorte wird der Lugana gemacht?",
      a: "Aus Trebbiano di Lugana, auch Turbiana genannt. Die Trauben stammen aus den Turbiana-Weinbergen der Gemeinden Desenzano und Pozzolengo am Südufer des Gardasees.",
    },
    {
      q: "Wie wird der Lugana ausgebaut?",
      a: "Weißweinbereitung mit siebentägiger Kryomazeration auf der Schale, um die Primäraromen zu extrahieren. Anschließend vergärt der Wein temperaturkontrolliert bei 14–16 °C und bleibt bis zur Abfüllung auf der Feinhefe.",
    },
    {
      q: "Zu welchen Gerichten passt der Lugana?",
      a: "Zu rohen und gegarten Fisch-Antipasti, zu delikaten ersten Gängen und zu Speisen ohne schwere Saucen oder dominante Würze. Ausgezeichnet auch als Aperitivo.",
    },
    {
      q: "Wie sollte der Lugana serviert werden?",
      a: "Bei 8 bis 10 °C im Weißweinglas. So bleiben der florale Duft und die weiche Textur am klarsten erhalten.",
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen der Lugana gefällt",
    names: ["Falanghina", "Greco di Tufo D.O.C.G.", "Il Bianco – Greco Cuvée"],
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
