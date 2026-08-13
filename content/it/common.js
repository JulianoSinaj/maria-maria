/* Cornice comune: navigazione, footer, carrello, testi di servizio.
   Stessa struttura di content/de/common.js — vedi lì per le note.

   L'italiano è la lingua d'origine del marchio: „Il piacere del vino" e i
   nomi dei vini non si traducono, perché in italiano sono già a casa. */

export const common = {
  nav: {
    home: "Home",
    wines: "I nostri vini",
    regions: "Regioni",
    magazine: "Magazine",
    contact: "Contatti",
    shop: "Vai allo shop",
    wineTypes: {
      red: "Vini rossi",
      white: "Vini bianchi",
      rose: "Vini rosati",
    },
  },

  a11y: {
    skipToContent: "Vai al contenuto",
    homeLink: "Maria Maria — Home",
    mainNav: "Navigazione principale",
    mobileNav: "Navigazione mobile",
    openMenu: "Apri il menu",
    closeMenu: "Chiudi il menu",
    menuDialog: "Menu",
  },

  wineMenu: {
    eyebrow: "La collezione",
    overview: {
      all: { label: "Tutti i vini", hint: "La collezione completa" },
      bestseller: { label: "Bestseller", hint: "Quelli che finiscono più spesso nel calice" },
      regions: { label: "Le regioni d'Italia", hint: "Origine e terroir" },
    },
    shop: "Vai allo shop",
    note: "Selezionati a mano da piccole cantine italiane.",
    seeAll: "Vedi tutti i {count} vini",
  },

  footer: {
    newsletter: {
      title: "Storie dall'Italia,",
      titleAccent: "direttamente nella tua casella",
      text: "Novità, offerte esclusive e momenti di piacere — circa una volta al mese, senza rumore.",
      success: "Grazie! Conferma l'iscrizione nella tua casella di posta.",
      emailLabel: "Indirizzo e-mail",
      placeholder: "Inserisci il tuo indirizzo e-mail",
      submit: "Iscriviti",
    },
    tagline: "Vini italiani di boutique per momenti di piacere scelti con cura.",
    exploreHeading: "Scopri",
    explore: {
      wines: "I nostri vini",
      regions: "Le regioni d'Italia",
      magazine: "Magazine",
      contact: "Contatti",
    },
    contactHeading: "Contatti",
    shopHeading: "Shop ufficiale",
    shopText: "Scopri e ordina i nostri vini direttamente nello shop Maria Maria.",
    shopLink: "Vai allo shop",
    legal: {
      privacy: "Privacy",
      imprint: "Note legali",
      terms: "Condizioni di vendita",
    },
    copyright: "Maria Maria Wines — Il piacere del vino",
  },

  /* Testo visibile del catalogo — struttura in components/data.js.
     `notes` è una lista, non una frase: joinList() in lib/i18n/format
     compone „Intenso, potente ed equilibrato". */
  catalogue: {
    types: { red: "Vino rosso", white: "Vino bianco", rose: "Vino rosato" },
    typesPlural: { red: "Vini rossi", white: "Vini bianchi", rose: "Vini rosati" },
    regions: { puglia: "Puglia", campania: "Campania", garda: "Lago di Garda" },
    filters: {
      allWines: "Tutti i vini",
      allRegions: "Tutte le regioni",
      reset: "Reimposta",
      wineOne: "vino",
      wineMany: "vini",
      byType: "Filtra i vini per tipologia",
      byRegion: "Filtra i vini per regione",
      emptyTitle: "Per questa selezione",
      emptyTitleAccent: "non abbiamo vini al momento.",
      emptyText:
        "Prova un'altra combinazione di tipologia e regione – oppure scopri l'intera collezione.",
    },
    wines: {
      "primitivo-15-5": {
        notes: ["intenso", "potente", "equilibrato"],
        pairing: "Con brasati, selvaggina e formaggi stagionati.",
      },
      lugana: {
        notes: ["elegante", "fresco", "minerale"],
        pairing: "Ideale con pesce, pasta al pesto o carni bianche.",
      },
      "greco-di-tufo": {
        notes: ["strutturato", "fine", "aromatico"],
        pairing: "Con frutti di mare, pesce alla griglia e cucina raffinata.",
      },
      "primitivo-14-5": {
        notes: ["morbido", "pieno", "armonioso"],
        pairing: "Ideale con pasta, grigliate e formaggi maturi.",
      },
      "primitivo-salento": {
        notes: ["fruttato", "rotondo", "accessibile"],
        pairing: "Semplice con pizza, pasta e serate in compagnia.",
      },
      falanghina: {
        notes: ["fresco", "fruttato", "vivace"],
        pairing: "Perfetto per l'aperitivo, con frutti di mare o insalate.",
      },
      "rosato-puglia": {
        notes: ["delicato", "fruttato", "rinfrescante"],
        pairing: "Splendido con antipasti, insalate o verdure grigliate.",
      },
      "il-rosso-aglianico": {
        notes: ["profondo", "speziato", "di carattere"],
        pairing: "Un compagno per pasta al forno, carni alla brace e formaggi.",
      },
      "il-bianco-greco-cuvee": {
        notes: ["fresco", "elegante", "equilibrato"],
        pairing: "Un piacere con antipasti, pesce e piatti leggeri.",
      },
    },
  },

  cart: {
    title: "Il tuo carrello",
    items: "articoli",
    open: "Apri il carrello",
    close: "Chiudi il carrello",
    label: "Carrello",
    increase: "Aumenta la quantità di {name}",
    decrease: "Riduci la quantità di {name}",
    remove: "Rimuovi {name} dal carrello",
    empty: {
      title: "Ancora tutto",
      titleAccent: "vuoto.",
      text: "Scopri i nostri vini di boutique e le confezioni degustazione – il tuo momento Maria ti aspetta.",
      cta: "Scopri i vini",
    },
    success: {
      title: "Grazie",
      titleAccent: "mille!",
      text: "Grazie per il tuo ordine. Una conferma è già in viaggio verso la tua casella di posta.",
      orderNumber: "Numero d'ordine",
      cta: "Continua a esplorare",
    },
    missingForFreeShipping: "Ancora {amount} per la spedizione gratuita",
    freeShippingReached: "Il tuo ordine ha la spedizione gratuita",
    summary: {
      subtotal: "Subtotale",
      shipping: "Spedizione",
      free: "Gratuita",
      total: "Totale",
      vat: "IVA inclusa",
      checkout: "Vai alla cassa",
      secure: "Pagamento sicuro · crittografia SSL",
    },
  },

  shop: {
    badges: {
      bestseller: "Bestseller",
      limited: "Edizione limitata",
      popular: "Molto amato",
      summer: "Vino d'estate",
    },
    edition: "{count} bottiglie",
    bottles: "{count} bottiglie",
    limitedEdition: "Edizione limitata · {count} bottiglie",
    scarce: "Ancora poche bottiglie",
    single: "Singolarmente",
    save: "Risparmi {amount}",
    bundleSub: "Confezione degustazione · {count} bottiglie",
    bundles: {
      "paket-trio-rosso": {
        tag: "La forza del Sud",
        desc: "Tre rossi di carattere dalla Puglia e dalla Campania – dal Primitivo morbido all'Aglianico speziato.",
      },
      "paket-grande-selezione": {
        tag: "La scelta più amata",
        desc: "Sei vini, quattro regioni – tutta la varietà dell'Italia in una sola confezione. Spedizione gratuita a casa tua.",
      },
      "paket-trio-bianco": {
        tag: "Freschezza ed eleganza",
        desc: "Tre bianchi eleganti dal Lago di Garda e dalla Campania – minerali, fini e vivaci nel calice.",
      },
    },
  },

  ui: {
    discoverWine: "Scopri il vino",
    wineDetails: "{name} — vedi i dettagli",
    bottleAlt: "Bottiglia {name}",
    bottleFront: "Fronte",
    bottleBack: "Retro",
    bottleFrontAlt: "Bottiglia {name} – fronte",
    bottleBackAlt: "Bottiglia {name} – retro",
    showSide: "Mostra il {side}",
    prevWine: "Vino precedente",
    nextWine: "Vino successivo",
    prevWines: "Vini precedenti",
    moreWines: "Altri vini",
    back: "Indietro",
    next: "Avanti",
    wholeCollection: "Tutta la collezione",
    winesLabel: "vini",
    addToCart: "Aggiungi {name} al carrello",
    removeBottle: "Togli una bottiglia di {name}",
    addBottle: "Aggiungi un'altra bottiglia di {name}",
    addBundle: "Aggiungi la confezione",
    added: "Aggiunto",
    viewCart: "Vedi il carrello",
    priceNote: "Tutti i prezzi IVA inclusa, spedizione esclusa",
    perBottle: "/ 0,75 l",
    faqTopics: "Argomenti delle domande frequenti",
    discoverMore: "Scopri di più",
  },

  souls: {
    roots: {
      name: "Maria",
      tag: "Le radici",
      traits: ["Famiglia", "Ospitalità", "Memoria"],
      desc: "A Lizzano comincia la storia personale dietro al nome – in una cultura in cui vino, cibo e tempo condiviso vanno insieme.",
    },
    today: {
      name: "Maria",
      tag: "Lo sguardo di oggi",
      traits: ["Selezione", "Estetica", "Nuove prospettive"],
      desc: "Scegliere vini italiani con consapevolezza, raccontare le loro regioni e portarli alle persone in Paesi diversi.",
    },
  },

  language: {
    label: "Lingua",
    ariaLabel: "Scegli la lingua",
    current: "Lingua attuale",
  },

  errors: {
    eyebrow: "Si è verificato un errore",
    title: "Non è stata la nostra",
    titleAccent: "annata migliore.",
    text: "Qualcosa è andato storto. Riprova — oppure torna alla home.",
    retry: "Riprova",
    home: "Torna alla home",
  },

  notFound: {
    eyebrow: "Pagina non trovata",
    title: "Questa bottiglia",
    titleAccent: "non è nella nostra cantina.",
    text: "La pagina che cerchi non esiste o è stata spostata. Scopri piuttosto i nostri vini — è lì che c'è il meglio.",
    wines: "I nostri vini",
    home: "Torna alla home",
  },
};

export default common;
