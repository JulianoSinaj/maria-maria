/* Magazin /magazin — Titelseite (Cover Story), Vision & Mission, das
   Food-Pairing-Kapitel, die Bacheca, das Archiv und die Weinwissen-FAQ.

   Struktur (Anker, Kapitelnummern, Bildpfade, Wein-Slugs) bleibt im Code;
   hier steht ausschließlich Text. Die italienischen Rivista-Worte des Hefts
   — „Capitolo", „Bacheca", „Curiosità", „Interviste", „Archivio del Magazin",
   die Leitworte „Storie di vino" … — sind Markendesign und stehen deshalb im
   Code, nicht im Wörterbuch. Ebenso bleiben „Maria Maria", Weinnamen und
   italienische Gerichtsnamen in jeder Sprache stehen. */

export const magazin = {
  /* Die übersetzbaren Leitworte des Laufbands — die italienischen stehen im Code. */
  marquee: {
    boutique: "Boutique-Winzer",
    handpicked: "Handverlesen",
  },

  /* Capitolo I — Masthead, Rubrikenleiste und Cover Story. */
  cover: {
    title: "Geschichten, Menschen und Genuss aus Italien",
    subline:
      "Im Magazin erzählt Maria Maria von Herkunft, Auswahl und Genussmomenten — mit Geschichten aus den Regionen, Food Pairings, Begegnungen und der Vision hinter dem Brand.",
    rubricsAria: "Rubriken des Magazins",
    rubrics: {
      story: "Die Geschichte",
      pairing: "Food Pairing",
      interviews: "Interviews",
      events: "Events",
    },
    photoAlt: "Maria wählt in der Cantina drei Flaschen Maria Maria am Glastisch aus",
    /* Zeilenfall der Schlagzeile ist redaktionell gesetzt — drei Zeilen. */
    headline: ["Zwei Marias.", "Eine Geschichte", "des Genusses."],
    paragraph:
      "Ein Name, zwei Generationen und eine Reise durch italienische Weinwelten — vom Salento über Kampanien und den Gardasee bis nach Düsseldorf.",
    /* Die Stationen der Reise — Ortsnamen in der jeweils gebräuchlichen Form. */
    stations: ["Salento", "Kampanien", "Gardasee", "Düsseldorf"],
    cta: "Die ganze Geschichte lesen",
  },

  /* Vision & Mission — das Leitbild-Kartenpaar in der Cover Story. */
  vision: {
    srTitle: "Vision und Mission von Maria Maria",
    blocks: {
      vision: {
        kicker: "Vision",
        text: "Maria Maria möchte eine kuratierte Weinwelt schaffen, in der italienische Herkunft, persönliche Auswahl und moderner Genuss für Menschen in Deutschland erlebbar werden.",
      },
      mission: {
        kicker: "Mission",
        text: "Wir wählen Weine mit Charakter, erzählen ihre Herkunft verständlich und verbinden Regionen, Menschen und Genussmomente zu einer klaren, authentischen Markenerfahrung.",
      },
    },
  },

  /* Kapitelnamen der ChapterBreaks — nur der deutsche; „Bacheca" und
     „Curiosità" sind Rivista-Marken und bleiben im Code. */
  chapters: {
    moments: "Genussmomente",
  },

  /* Übersetzungszeile unter dem Soldati-Zitat — das Zitat selbst bleibt
     italienisch im Code; im Italienischen bleibt diese Zeile bewusst leer. */
  quote: {
    translation: "Der Wein ist die Poesie der Erde.",
  },

  /* Capitolo II — der Anlass-Schalter des Food Pairings. */
  pairing: {
    eyebrow: "Food Pairing · Nach Anlass",
    title: "Welcher Wein passt zu",
    titleAccent: "Ihrem Moment?",
    description:
      "Nicht den Wein zuerst wählen, sondern den Moment — wählen Sie Ihren Anlass, Maria Maria zeigt den passenden Wein.",
    toWine: "Zum Wein",
    alsoFits: "Auch passend",
    /* Text je Anlass-Karte — Struktur, Fotos und Slugs liegen in
       components/magazin/pairingCards.js; `hints` je Alternative nach
       Wein-Slug. „Aperitivo" und die italienischen Gerichtsnamen bleiben
       in jeder Sprache stehen. */
    cards: {
      aperitivo: {
        anlass: "Aperitivo",
        dish: "Burrata · Tomaten · Focaccia",
        caption: "Italienischer Aperitivo mit Rosato, Burrata und Focaccia",
        hints: {
          falanghina: "Makrele all’acqua pazza",
          "il-bianco-greco-cuvee": "Paccheri mit Garnelen",
          lugana: "Cremiges Fischrisotto",
        },
      },
      "pasta-abend": {
        anlass: "Pasta-Abend",
        dish: "Spaghetti alle Vongole",
        caption: "Spaghetti alle Vongole mit Greco di Tufo DOCG",
        hints: {
          "primitivo-14-5": "Orecchiette mit Braciole-Ragù",
          "il-bianco-greco-cuvee": "Paccheri mit Garnelen",
          falanghina: "Makrele all’acqua pazza",
        },
      },
      "fisch-meer": {
        anlass: "Fisch & Meer",
        dish: "Fischrisotto · Zitrone · Kräuter",
        caption: "Lugana DOC mit cremigem Fischrisotto am Gardasee",
        hints: {
          falanghina: "Makrele all’acqua pazza",
          "greco-di-tufo": "Spaghetti alle Vongole",
          "il-bianco-greco-cuvee": "Paccheri mit Garnelen",
        },
      },
      grillabend: {
        anlass: "Grillabend",
        dish: "Involtini · Rosmarin · Grillgemüse",
        caption: "Aglianico zum Grillabend – Fleischröllchen und Rosmarin",
        hints: {
          "primitivo-salento": "Bombette vom Grill",
          "primitivo-14-5": "Orecchiette mit Braciole-Ragù",
          "rosato-puglia": "Burrata mit Focaccia",
        },
      },
      dinner: {
        anlass: "Dinner mit Gästen",
        dish: "Geschmorte Rinderbacke · Kartoffelcreme",
        caption: "Primitivo di Manduria mit geschmorter Rinderbacke",
        hints: {
          "il-rosso-aglianico": "Involtini vom Grill",
          "primitivo-salento": "Bombette vom Grill",
          "greco-di-tufo": "Spaghetti alle Vongole",
        },
      },
    },
  },

  /* Capitolo III — die Social-Pinnwand; das Eyebrow „Bacheca Social" bleibt im Code. */
  social: {
    title: "Maria Maria auf",
    titleAccent: "Instagram",
    text: "Momente aus Weinbergen, Kellern und von gedeckten Tischen — unsere Pinnwand aus der Welt von Maria Maria.",
    follow: "{handle} folgen",
    postAria: "{caption} — Maria Maria auf Instagram öffnen",
    /* Bildunterschriften nach Post-Schlüssel (magazinData.SOCIAL_POSTS);
       die Hashtags bleiben im Code. */
    posts: {
      aperitivo: "Aperitivo im Abendlicht",
      harvest: "Weinlese im Süden",
      pranzo: "Pranzo mit Freunden",
      handpicked: "Handverlesen",
    },
  },

  /* Capitolo IV — Box Curiosità; Eyebrow „Curiosità" und der Fußzeilen-Kicker
     „Interviste" bleiben im Code. */
  curiosity: {
    title: "Kurios, aber",
    titleAccent: "wahr",
    description:
      "Drei Dinge, die wir beim Winzer gelernt haben. Karte antippen — die Antwort steht auf der Rückseite.",
    flip: "Umdrehen",
    back: "Zurück",
    closing:
      "Neun Flaschen, drei Weinherkünfte — und damit neun Geschichten, die schon geschrieben sind.",
    interviewsLabel: "Winzer & Kunden im Gespräch",
    /* Die drei Kärtchen — Nummern-Stempel und Farbwelten stehen im Code. */
    cards: {
      name: {
        kicker: "Nomen est omen",
        question: "Warum heißt der Primitivo „Primitivo“?",
        answer:
          "Nicht weil er urtümlich wäre — sondern weil er als einer der ersten reift. „Primo“: der Frühe. Im August ist er schon fertig, während andere noch hängen.",
      },
      temperature: {
        kicker: "Küchenwissen",
        question: "Wie kalt darf ein Rotwein sein?",
        answer:
          "Kühler, als Sie denken. 16–18 °C — also Keller, nicht Wohnzimmer. Zwanzig Minuten im Kühlschrank vor dem Öffnen, und der Wein wird plötzlich präzise.",
      },
      tears: {
        kicker: "Aus dem Keller",
        question: "Was ist die „Träne“ am Glasrand?",
        answer:
          "Die Schlieren, die nach dem Schwenken zurücklaufen. Sie verraten den Alkohol, nicht die Qualität — ein guter Wein weint nicht schöner, nur langsamer.",
      },
    },
  },

  /* Leerzustand der Interview-Rubrik — erscheint nur, solange kein Gespräch
     veröffentlicht ist; Rubrik-Kopf und Artikel liegen in interviews.js. */
  interviewEmpty: {
    title: "Die ersten Gespräche entstehen gerade.",
    text: "Wir besuchen Winzerinnen, Kellermeister und Sommeliers in ihren Weinbergen und Kellern — und bringen ihre Antworten hierher: über Böden und Jahrgänge, über Geschmack, Handwerk und die Menschen hinter jeder Flasche.",
    badge: "Bald hier zu lesen",
  },

  /* Archiv — die Weine aus den Geschichten. */
  wines: {
    eyebrow: "Aus dem Magazin ins Glas",
    title: "Die Weine aus unseren Geschichten",
    description:
      "Die Flaschen, um die sich unsere Geschichten drehen – wischen Sie über ein Foto, um das Rückenetikett zu sehen.",
    railLabel: "Im Magazin verkostet",
  },

  /* Kopf der Weinwissen-FAQ — die Fragen selbst liegen in faq.js. */
  faq: {
    eyebrow: "Weinwissen",
    title: "Häufige Fragen aus dem",
    titleAccent: "Weinwissen.",
    description:
      "Die Evergreens rund um Temperatur, Glas, Lagerung und Herkunftsstufen — beantwortet aus den Datenblättern unserer Weine, ohne Fachchinesisch.",
    footerLabel: "Eine Frage fehlt? Schreiben Sie uns",
  },
};

export default magazin;
