/* Beneventano Falanghina IGP — complete content model for the wine landing page.
   This is the template for all future per-wine pages: new wine = new data file
   with this exact shape + a thin route that feeds it into the shared sections.

   PHOTO DROP-IN: place the real photography under public/img/wines/falanghina/
   and fill the `images` paths below — every section swaps automatically from
   the illustrated fallback to the photo. Until then the paths stay `null`.

   Fields marked [BESTÄTIGEN] are plausible-but-unverified copy (aroma notes,
   storytelling) that the client should confirm before go-live. */

import { shopHref } from "@/lib/shop/config";

const SLUG = "falanghina";

export const FALANGHINA = {
  slug: SLUG,
  catalogName: "Falanghina I.G.P.", // key into components/data.js WINES via byName()

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
    { label: "Unsere Weine", href: "/unsere-weine" },
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

  /* Akzentfarben der Sektionen (Teal-Familie vom karierten Etikett) */
  accent: { base: "#45B3A2", deep: "#23786B", light: "#C9E8E1" },

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

  /* ---- Der Geschmack: drei gepinnte Kapitel (Auge / Nase / Gaumen) ----
     Jedes Kapitel zeigt in der „Galerie der Sinne" ein Gemälde. Ohne eigenes
     `artwork` (src/alt/title/artist/year/focus) greift das kuratierte
     Fallback-Set in TasteStory — hell/dunkel nach dem Ton des Farbkapitels. */
  taste: [
    {
      key: "farbe",
      icon: "eye",
      kicker: "Farbe",
      title: "Hell, klar und leuchtend",
      text: "Strohgelb mit grünlichen Reflexen – der erste Eindruck im Glas ist pure Frische.",
      tone: "#E8DC9A",
      artwork: {
        src: "/img/wines/falanghina/front.jpg",
        alt: "Flasche Beneventano Falanghina IGP von Maria Maria — Frontansicht des Etiketts",
        medium: "Die Flasche",
        title: "Beneventano Falanghina IGP",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
    {
      key: "duft",
      icon: "nose",
      kicker: "Duft",
      title: "Weiße Blüten, Birne und ein Hauch Zitrus",
      /* [BESTÄTIGEN] Aromatik ist rebsortentypisch formuliert, nicht aus dem Datenblatt */
      text: "Ein feines, helles Bouquet: Blüten, gelbe Frucht und mediterrane Leichtigkeit steigen aus dem Glas.",
      tone: "#D9E4C0",
      artwork: {
        src: "/img/wines/falanghina/back.jpg",
        alt: "Rückenetikett der Flasche Beneventano Falanghina IGP von Maria Maria",
        medium: "Das Rückenetikett",
        title: "Beneventano Falanghina IGP",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
    {
      key: "geschmack",
      icon: "lips",
      kicker: "Geschmack",
      title: "Charaktervoll, weich und harmonisch",
      text: "Sehr weich und zugleich harmonisch und anhaltend – ein charakterstarker Weißwein, der angenehm zugänglich bleibt.",
      tone: "#CBE3DA",
      artwork: {
        src: "/img/wines/falanghina/hero.jpg",
        alt: "Flasche Beneventano Falanghina IGP von Maria Maria in der Kellerei",
        medium: "In der Kellerei",
        title: "Beneventano Falanghina IGP",
        artist: "Maria Maria",
        focus: "50% 50%",
      },
    },
  ],

  /* ---- Im Detail (Bento / technisches Datenblatt) ---- */
  detail: [
    { label: "Bezeichnung", value: "Beneventano Falanghina IGP", span: "wide" },
    { label: "Rebsorte", value: "Falanghina 100 %" },
    { label: "Herkunft", value: "Kampanien, Italien" },
    { label: "Lese", value: "Erste Oktoberhälfte" },
    {
      label: "Erziehung",
      value: "Guyot an Holzpfählen — den „falangae“, die der Rebe schon zur Römerzeit ihren Namen gaben.",
    },
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
    photo: "/img/home/region-kampanien.webp",
    photoAlt: "Weinberge über dem Golf von Neapel mit Blick auf den Vesuv",
    chip: { title: "Beneventano", subtitle: "Kampanien · Italien" },
  },

  /* ---- Der Maria-Maria-Moment ----
     `why` erklärt das Prinzip hinter den Empfehlungen: `principle` ist der
     Merksatz, `axes` sind die Struktur-Achsen des Weins (0–100), die die
     Sektion als Balken zeichnet, und `note` an jedem Item sagt in einer Zeile,
     welche Achse hier greift. Alles optional — fehlt `why`, rendert die
     Sektion wie bisher nur die Liste. */
  /* ---- Der Maria-Maria-Moment (eine Szene statt einer Speisenliste) ----
     PHOTO DROP-IN: 2:1 (1774 × 887) unter public/img/pairing/ ablegen und
     `image` auf den Pfad setzen. Solange null, rendert die Sektion die
     Copy über die volle Breite. */
  pairing: {
    scene: {
      dish: "Ricciola ai Pomodorini",
      /* Kein eigenes Magazine-Motiv (kein cardKey) — im Magazin steht der
         Wein unter „Fisch & Meer" als „Auch passend". Der Pairing-CTA öffnet
         dort genau diese Antwort-Karte (pairingCards.js). */
      anlassKey: "fisch-meer",
      copy: "Zarte Ricciola und saftige Kirschtomaten brauchen keinen schweren Begleiter. Die Falanghina bringt Frische, Frucht und Lebendigkeit an den Tisch und lässt dem feinen Fisch genügend Raum. Ihre frische Art greift die Saftigkeit der Tomaten auf, während ihr leichter Körper das Gericht begleitet, ohne es zu überdecken. Ein klares, mediterranes Pairing, das besonders an warmen Tagen seine Stärke zeigt.",
      image: null,
      imageAlt:
        "Ricciola-Filet mit Kirschtomaten auf einem Teller, daneben ein Glas Falanghina und die geöffnete Flasche",
      regionLink: {
        label: "Mehr über Kampanien entdecken",
        href: "/regionen#kampanien",
        region: "kampanien",
      },
    },
  },

  /* ---- Servieren & Genießen + Der Maria-Moment ---- */
  moment: {
    title: "So schmeckt die Falanghina am besten",
    serve: {
      title: "Servieren & Genießen",
      items: [
        { icon: "thermometer", title: "Serviertemperatur", text: "ca. 10 °C — gut gekühlt im Weißweinglas" },
        /* [BESTÄTIGEN] Trinkfenster nicht im Datenblatt — rebsortentypisch für frische Weißweine */
        { icon: "hourglass", title: "Trinkfenster", text: "Jetzt genießen oder innerhalb von 2–3 Jahren" },
        { icon: "glasses", title: "Der Auftakt", text: "Kurz vor dem Servieren aus dem Kühlschrank nehmen" },
      ],
    },
    maria: {
      text: "Für lange Mittage im Freien, frische Küche und ehrliche Gespräche — die Falanghina ist der Wein für die hellen Momente.",
      link: { label: "Mehr entdecken", href: shopHref(SLUG) },
    },
    essence: [
      {
        icon: "glass",
        kicker: "Geschmack",
        title: "Weich, harmonisch, frisch",
        text: "Weiße Blüten, Birne und ein Hauch Zitrus — sehr weich und zugleich harmonisch und anhaltend.",
        tone: "#45B3A2",
        toneDeep: "#23786B",
      },
      {
        icon: "italy",
        kicker: "Herkunft",
        title: "Beneventano, Kampanien",
        text: "Sanfte Hügel zwischen Apennin und Küste. Warme Tage und kühle Nächte bewahren Frische und Spannung.",
        tone: "#D3C56E",
        toneDeep: "#7C6A22",
      },
      {
        icon: "grapes",
        kicker: "Rebsorte",
        title: "Falanghina",
        text: "Eine der ältesten Rebsorten Kampaniens — ihr Name geht auf die Holzpfähle der Römerzeit zurück. 100 % rebsortenrein.",
        tone: "#23786B",
        toneDeep: "#12403A",
      },
    ],
  },

  /* ---- Häufige Fragen ----
     Fragenset nach der FAQ-Guide (Product-Cluster Falanghina): Geschmack,
     Herkunft, Pairing, Vergleich mit dem Greco. Antworten nur aus bestätigten
     Datenblatt-Fakten; Vergleichsfragen kurz halten und auf die Seite des
     Nachbarweins verlinken (max. 1 interner Link pro Antwort). */
  faq: [
    {
      id: "falanghina-geschmack",
      q: "Wie schmeckt die Falanghina?",
      a: "Sehr weich und zugleich harmonisch und anhaltend: ein charakterstarker, frischer Weißwein mit heller Frucht und lebendiger Klarheit – zugänglich, ohne beliebig zu sein. Im Glas zeigt sie sich strohgelb mit grünlichen Reflexen, hell und leuchtend – Frische, die sie am Gaumen einlöst.",
    },
    {
      id: "falanghina-herkunft",
      q: "Woher kommt die Falanghina?",
      a: "Unsere Falanghina wächst im Beneventano, dem hügeligen Hinterland der Provinz Benevento in Kampanien – warme Tage, kühle Nächte und die Nähe des Mittelmeers schenken ihr Frische und feine, helle Frucht. Die Rebsorte selbst zählt zu den ältesten Kampaniens.",
      link: { label: "Mehr über Kampanien entdecken", href: "/regionen#kampanien" },
    },
    {
      id: "falanghina-igp",
      q: "Was bedeutet „Beneventano IGP“?",
      a: "IGP steht für „Indicazione Geografica Protetta“, die geschützte geografische Angabe. Die Trauben stammen aus dem Beneventano – dem hügeligen Hinterland der Provinz Benevento in Kampanien.",
    },
    {
      id: "falanghina-pairing",
      q: "Passt Falanghina zu Fisch oder Pasta?",
      a: "Zu beidem – am liebsten zu Fisch: gegrillt, gebraten oder aus dem Ofen, ebenso zu Krustentieren und Meeresfrüchten. Bei Pasta entscheidet die Sauce: Zu hellen, leichten Zubereitungen passt sie wunderbar. Und gut gekühlt ist sie ein idealer Aperitivo.",
    },
    {
      id: "falanghina-vs-greco",
      q: "Was ist der Unterschied zwischen Falanghina und Greco di Tufo?",
      a: "Beide sind weiße Rebsorten Kampaniens, aber mit eigenem Charakter: Die Falanghina aus dem Beneventano ist weich, harmonisch und unkompliziert frisch. Der Greco di Tufo wächst auf vulkanischem Tuffgestein, bringt mehr Struktur und einen mineralischen Zug mit – und trägt als einer der wenigen Weißweine Italiens das D.O.C.G.-Siegel.",
      link: { label: "Greco di Tufo entdecken", href: "/unsere-weine/greco-di-tufo" },
    },
  ],

  /* ---- Ähnliche Weine (Namen aus components/data.js WINES) ---- */
  similar: {
    kicker: "Ähnliche Weine entdecken",
    title: "Wenn Ihnen die Falanghina gefällt",
    names: ["Greco di Tufo D.O.C.G.", "Il Bianco – Greco Cuvée", "Lugana D.O.P."],
    /* Halbsatz hinter „Drei Weißweine aus unserer Kollektion," — die Gattung
       davor leitet SimilarWines aus den Karten ab, nicht aus diesem Text. */
    trait: "die denselben Ton treffen: hell, frisch, mediterran.",
  },

  /* ---- Abschluss-CTA ---- */
  cta: {
    title: "Noch mehr entdecken?",
    text: "Entdecken Sie alle unsere Weine im offiziellen Maria Maria Shop.",
    button: { label: "Zum offiziellen Shop", href: shopHref(SLUG) },
  },

  /* ---- Seitennavigation (Apple-Stil Subnav) ---- */
  subnav: [
    { label: "Überblick", href: "#ueberblick" },
    { label: "Geschmack", href: "#geschmack" },
    { label: "Passt zu", href: "#maria-moment" },
    { label: "Fragen", href: "#fragen" },
  ],
};
