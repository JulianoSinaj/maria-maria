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
      label: "L'inizio · 2019",
      title: "Dalla Germania. Con radici italiane.",
      paragraphs: [
        "Dal 2019 Maria Maria è attiva in Germania. Il marchio ha sede a Düsseldorf – le sue origini personali e culturali portano a Lizzano, nel Salento.",
        "Dall'incontro tra due generazioni è nata una selezione in cui ogni bottiglia rappresenta un luogo, un vitigno e una scelta consapevole.",
      ],
      quote:
        "«Il vino comincia dalla sua origine – e trova il suo posto dove le persone lo condividono.»",
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
      label: "Dal 2019 · Düsseldorf",
      title: "Di casa in Germania. Con lo sguardo oltre i confini.",
      paragraphs: [
        "Il marchio Maria Maria è attivo in Germania dal 2019 e ha sede a Düsseldorf. Da qui, vini italiani selezionati personalmente diventano accessibili alle persone in Germania e in altri Paesi.",
        "Düsseldorf è la sede del marchio – non il confine della sua selezione. A contare restano l'origine, il carattere e la storia dietro ogni vino.",
      ],
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
