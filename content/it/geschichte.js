/* Vedi content/de/geschichte.js — stessa struttura in tutte e quattro le
   lingue. Nomi di marca, luoghi e vitigni restano invariati; le parole
   brevi italiane sulle foto (`micro`) sono identiche in ogni lingua. */

export const geschichte = {
  hero: {
    eyebrow: "Maria Maria · La nostra storia",
    titleLines: ["Due donne.", "Due generazioni.", "Un modo di intendere", "il vino."],
    paragraphs: [
      "Il nome Maria Maria unisce memoria e presente. Le radici personali nel Salento danno forma a un modo di intendere il vino che tiene insieme origine, carattere e piacere condiviso.",
      "Dal 2019 Maria Maria è attiva in Germania, con sede a Düsseldorf e una selezione pensata per la Germania e per altri Paesi.",
    ],
    ctaStory: "Scopri la storia",
    ctaWines: "Conosci i nostri vini",
    journey: ["In Germania dal 2019", "Sede a Düsseldorf", "Origini italiane"],
    photoAlt:
      "Due generazioni intorno a una lunga tavolata sotto la pergola, davanti due bottiglie di Maria Maria",
    photoBadge: "Selezione personale",
  },

  name: {
    eyebrow: "Il nome",
    titleLines: ["Due Marie.", "Memoria e presente."],
    paragraphs: [
      "Il nome Maria Maria porta in sé il legame tra due donne e due generazioni.",
      "La Maria più grande rappresenta Lizzano, la famiglia, l'ospitalità e una cultura del vino che si vive intorno alla tavola.",
      "La Maria più giovane porta questa visione nel presente: con uno sguardo contemporaneo e una selezione personale di vini italiani.",
    ],
    quote: "«Ciò che resta si tramanda con uno sguardo nuovo.»",
  },

  valerio: {
    eyebrow: "Il titolare · Importazione e selezione",
    title: "Valerio Caniglia: l'imprenditore dietro Maria Maria",
    paragraphs: [
      "Valerio Caniglia porta con sé più di 30 anni di esperienza nel mondo del vino. Conosce mercati, persone e vini e sceglie con sicurezza i produttori che si adattano a Maria Maria.",
      "Con sensibilità, affidabilità e una rete internazionale fa sì che ogni bottiglia porti i nostri valori nel calice.",
    ],
    cta: "Maria Maria per ristorazione e rivenditori specializzati",
    href: "/kontakt",
    imageLabel: "Ritratto di Valerio Caniglia",
  },

  nav: {
    ariaLabel: "I capitoli di questa storia",
  },

  chapters: {
    anfang: {
      label: "Oggi · Mettmann, vicino a Düsseldorf",
      title: "Di casa in Germania. Legati personalmente all'Italia.",
      paragraphs: [
        "Da Mettmann portiamo vini selezionati di viticoltori italiani nella ristorazione e nelle enoteche – in modo personale, affidabile e con una vicinanza autentica.",
        "Ogni ordine viene composto con cura, perché i nostri vini arrivino dove hanno il loro posto: a tavola.",
      ],
      linkLabel: "Scopri la nostra selezione di vini",
      alt: "Tavola apparecchiata con calici e una bottiglia originale Maria Maria",
      micro: "La tavola lunga",
    },
    salento: {
      label: "Salento · Lizzano",
      title: "Dove affondano le radici",
      paragraphs: [
        "Nel Salento comincia la lingua del vino di Maria Maria. Intorno a Lizzano il paesaggio è segnato dalla terra rossa, dalla vegetazione mediterranea, dalla luce e dalla vicinanza del Mar Ionio.",
        "Qui si trovano le radici personali del nome e il punto di partenza di una selezione in cui il Primitivo rappresenta calore, profondità e un'origine inconfondibile.",
      ],
      linkLabel: "Scopri il Salento e i nostri Primitivo",
      alt: "Terra rossa e vigneti nei pressi di Lizzano, nel Salento",
      micro: "Terra rossa",
      caption: "Vigne, luce mediterranea e la vicinanza del Mar Ionio.",
    },
    duesseldorf: {
      label: "L'inizio · Estate 2019",
      title: "Alcune idee nascono a tavola.",
      paragraphs: [
        "Tra buon cibo, conversazioni aperte e vini speciali cresce un'idea: trovare vini che mostrino la loro origine, abbiano carattere e uniscano le persone.",
        "Da quella sera nasce più di un ricordo – nasce Maria Maria.",
      ],
      quote: "«Alcune idee non hanno bisogno di un business plan. Solo del tavolo giusto.»",
      linkLabel: "Scopri la nostra selezione di vini",
      alt: "Tavola serale apparecchiata con un rosso Maria Maria al crepuscolo",
      micro: "Dall’Italia, oltre i confini",
    },
  },

  today: {
    label: "La selezione",
    title: "Che cosa fa entrare un vino nella selezione Maria Maria",
    intro:
      "A determinare la selezione non sono una singola città né una tendenza passeggera. Contano l'origine, il carattere e il modo in cui un vino accompagna il momento a tavola.",
  },

  stats: [
    {
      label: "L'origine prima dell'omologazione",
      detail:
        "In ogni vino devono riconoscersi la regione, il vitigno e un carattere proprio.",
    },
    {
      label: "Il carattere prima della moda",
      detail:
        "Niente etichette intercambiabili, ma vini con un'identità chiara e un'origine che resta percepibile.",
    },
    {
      label: "Il piacere che si condivide",
      detail:
        "Un vino trova il suo senso nei momenti, nei piatti e negli incontri che accompagna.",
    },
  ],

  cta: {
    ariaLabel: "Prosegui verso le regioni",
    text: "Ogni vino comincia in un luogo. La sua storia continua a scriversi a tavola.",
  },

  /* Kopf der B2B-FAQ am Seitenende — die Fragen selbst liegen in faq.js
     (faq.geschichte). */
  faq: {
    eyebrow: "Domande & risposte",
    title: "Le domande frequenti di ristorazione,",
    titleAccent: "commercio & partner.",
    description:
      "Ciò che ristoranti, wine bar, hotel, rivenditori e organizzatori ci chiedono prima di collaborare — risposte dalla pratica. Quello che qui resta aperto, lo chiariamo di persona.",
    footerLabel: "La tua domanda non c'è? Scrivici",
  },
};

export default geschichte;
