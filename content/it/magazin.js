/* Vedi content/de/magazin.js — stessa struttura in tutte e quattro le lingue.
   Le parole italiane della rivista („Capitolo", „Bacheca", „Curiosità",
   „Interviste" …) sono design del brand e vivono nel codice, non qui. */

export const magazin = {
  marquee: {
    boutique: "Vignaioli boutique",
    handpicked: "Selezionati a mano",
  },

  cover: {
    title: "Storie, persone e piacere dall'Italia",
    subline:
      "Nel magazine Maria Maria racconta origini, selezione e momenti di piacere — con storie dalle regioni, abbinamenti, incontri e la visione dietro al brand.",
    rubricsAria: "Rubriche del magazine",
    rubrics: {
      story: "La storia",
      pairing: "Food Pairing",
      interviews: "Interviste",
      events: "Eventi",
    },
    photoAlt: "Maria sceglie tre bottiglie Maria Maria al tavolo di vetro della cantina",
    headline: ["Due Marie.", "Una storia", "di piacere."],
    paragraph:
      "Un nome, due generazioni e un viaggio attraverso l'Italia del vino — dal Salento, passando per la Campania e il Lago di Garda, fino a Düsseldorf.",
    stations: ["Salento", "Campania", "Lago di Garda", "Düsseldorf"],
    cta: "Leggi tutta la storia",
  },

  vision: {
    srTitle: "Visione e missione di Maria Maria",
    blocks: {
      vision: {
        kicker: "Visione",
        text: "Maria Maria vuole creare un mondo del vino curato, dove origine italiana, selezione personale e piacere contemporaneo diventano un'esperienza viva per le persone in Germania.",
      },
      mission: {
        kicker: "Missione",
        text: "Scegliamo vini di carattere, ne raccontiamo l'origine con chiarezza e uniamo regioni, persone e momenti di piacere in un'esperienza di marca limpida e autentica.",
      },
    },
  },

  chapters: {
    moments: "Momenti di piacere",
  },

  /* La citazione di Soldati è già in italiano — la riga di traduzione
     resta vuota di proposito. */
  quote: {
    translation: "",
  },

  pairing: {
    eyebrow: "Food Pairing · Per occasione",
    title: "Quale vino si abbina al",
    titleAccent: "tuo momento?",
    description:
      "Non scegliere prima il vino, ma il momento — scegli la tua occasione e Maria Maria ti mostra il vino giusto.",
    toWine: "Vai al vino",
    alsoFits: "Si abbinano anche",
    cards: {
      aperitivo: {
        anlass: "Aperitivo",
        dish: "Burrata · Pomodori · Focaccia",
        caption: "Aperitivo italiano con Rosato, burrata e focaccia",
        hints: {
          falanghina: "Sgombro all’acqua pazza",
          "il-bianco-greco-cuvee": "Paccheri con i gamberi",
          lugana: "Risotto di pesce cremoso",
        },
      },
      "pasta-abend": {
        anlass: "Serata di pasta",
        dish: "Spaghetti alle Vongole",
        caption: "Spaghetti alle Vongole con Greco di Tufo DOCG",
        hints: {
          "primitivo-14-5": "Orecchiette al ragù di braciole",
          "il-bianco-greco-cuvee": "Paccheri con i gamberi",
          falanghina: "Sgombro all’acqua pazza",
        },
      },
      "fisch-meer": {
        anlass: "Pesce & mare",
        dish: "Risotto di pesce · Limone · Erbe",
        caption: "Lugana DOC con risotto di pesce cremoso sul Lago di Garda",
        hints: {
          falanghina: "Sgombro all’acqua pazza",
          "greco-di-tufo": "Spaghetti alle Vongole",
          "il-bianco-greco-cuvee": "Paccheri con i gamberi",
        },
      },
      grillabend: {
        anlass: "Serata alla griglia",
        dish: "Involtini · Rosmarino · Verdure alla griglia",
        caption: "Aglianico per la serata alla griglia – involtini e rosmarino",
        hints: {
          "primitivo-salento": "Bombette alla griglia",
          "primitivo-14-5": "Orecchiette al ragù di braciole",
          "rosato-puglia": "Burrata con focaccia",
        },
      },
      dinner: {
        anlass: "Cena con ospiti",
        dish: "Guancia di manzo brasata · Crema di patate",
        caption: "Primitivo di Manduria con guancia di manzo brasata",
        hints: {
          "il-rosso-aglianico": "Involtini alla griglia",
          "primitivo-salento": "Bombette alla griglia",
          "greco-di-tufo": "Spaghetti alle Vongole",
        },
      },
    },
  },

  social: {
    title: "Maria Maria su",
    titleAccent: "Instagram",
    text: "Momenti dai vigneti, dalle cantine e dalle tavole apparecchiate — la nostra bacheca dal mondo di Maria Maria.",
    follow: "Segui {handle}",
    postAria: "{caption} — apri Maria Maria su Instagram",
    posts: {
      aperitivo: "Aperitivo nella luce della sera",
      harvest: "Vendemmia nel Sud",
      pranzo: "Pranzo con gli amici",
      handpicked: "Raccolta a mano",
    },
  },

  curiosity: {
    title: "Curioso, ma",
    titleAccent: "vero",
    description:
      "Tre cose che abbiamo imparato dai vignaioli. Tocca una carta — la risposta è sul retro.",
    flip: "Girare",
    back: "Indietro",
    closing:
      "Nove bottiglie, quattro regioni — e con loro nove storie già scritte.",
    interviewsLabel: "Vignaioli e clienti a colloquio",
    cards: {
      name: {
        kicker: "Nomen omen",
        question: "Perché il Primitivo si chiama «Primitivo»?",
        answer:
          "Non perché sia rustico — ma perché matura tra i primi. «Primo»: il precoce. Ad agosto è già pronto, mentre altre uve sono ancora sulla pianta.",
      },
      temperature: {
        kicker: "Sapere di cucina",
        question: "Quanto può essere fresco un vino rosso?",
        answer:
          "Più fresco di quanto pensi. 16–18 °C — cantina, non salotto. Venti minuti in frigorifero prima di aprirlo, e il vino diventa improvvisamente preciso.",
      },
      tears: {
        kicker: "Dalla cantina",
        question: "Cosa sono le «lacrime» sul bordo del calice?",
        answer:
          "Gli archetti che scendono dopo la rotazione. Rivelano l'alcol, non la qualità — un buon vino non piange più bello, solo più lentamente.",
      },
    },
  },

  interviewEmpty: {
    title: "Le prime conversazioni stanno nascendo proprio ora.",
    text: "Visitiamo vignaiole, cantinieri e sommelier nei loro vigneti e nelle loro cantine — e portiamo qui le loro risposte: su suoli e annate, sul gusto, sul mestiere e sulle persone dietro ogni bottiglia.",
    badge: "Presto da leggere qui",
  },

  wines: {
    eyebrow: "Dal magazine al calice",
    title: "I vini delle nostre storie",
    description:
      "Le bottiglie attorno a cui ruotano le nostre storie – scorri su una foto per vedere la retroetichetta.",
    railLabel: "Degustati nel magazine",
  },

  faq: {
    eyebrow: "Cultura del vino",
    title: "Le domande frequenti sulla",
    titleAccent: "cultura del vino.",
    description:
      "I grandi classici su temperatura, calice, conservazione e denominazioni — con risposte tratte dalle schede tecniche dei nostri vini, senza tecnicismi.",
    footerLabel: "Manca una domanda? Scrivici",
  },
};

export default magazin;
