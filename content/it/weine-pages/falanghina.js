/* Overlay di testo per la pagina della Falanghina — struttura: components/weine/falanghina/wineData.js */

const falanghina = {
  shortNameNom: "la Falanghina",
  shortNameGen: "della Falanghina",
  eyebrow: "Vini boutique italiani",
  lede: "Dalle colline baciate dal sole del Beneventano, in Campania. Una Falanghina di limpida freschezza, dal frutto fine e dall'anima mediterranea.",
  heroWords: ["Fresca.", "Limpida.", "Mediterranea."],

  breadcrumb: [{ label: "Home" }, { label: "I nostri vini" }, {}],

  facts: [
    { label: "Provenienza", value: "Campania – Beneventano" },
    { label: "Vitigno" },
    { label: "Affinamento", value: "1 anno in acciaio, 2 mesi in bottiglia" },
    { label: "Temperatura di servizio", value: "circa 10 °C" },
  ],

  colorMoment: {
    kicker: "Il colore",
    lines: ["Giallo paglierino.", "Con riflessi verdolini."],
    text: "Nel calice la Falanghina si mostra chiara, limpida e luminosa – un bianco che promette freschezza ancora prima del primo sorso.",
    swatches: [
      { label: "Paglia chiara" },
      { label: "Giallo paglierino" },
      { label: "Riflesso verdolino" },
    ],
    artwork: {
      alt: "Dipinto a olio di Claude Monet «Covoni, fine dell'estate»: campi nei toni della paglia e dell'oro nella luce della sera",
      videoTitle: "Giallo paglierino nel calice",
    },
  },

  taste: [
    {
      kicker: "Colore",
      title: "Chiaro, limpido e luminoso",
      text: "Giallo paglierino con riflessi verdolini – il primo sguardo nel calice è pura freschezza.",
      artwork: {
        alt: "Bottiglia di Beneventano Falanghina IGP di Maria Maria — vista frontale dell'etichetta",
        medium: "La bottiglia",
      },
    },
    {
      kicker: "Profumo",
      title: "Fiori bianchi, pera e un tocco di agrumi",
      text: "Un bouquet fine e luminoso: fiori, frutta gialla e una leggerezza mediterranea che sale dal calice.",
      artwork: {
        alt: "Retroetichetta della bottiglia di Beneventano Falanghina IGP di Maria Maria",
        medium: "La retroetichetta",
      },
    },
    {
      kicker: "Gusto",
      title: "Di carattere, morbido e armonico",
      text: "Molto morbida e al tempo stesso armonica e persistente – un bianco di carattere che resta piacevolmente accessibile.",
      artwork: {
        alt: "Bottiglia di Beneventano Falanghina IGP di Maria Maria in cantina",
        medium: "In cantina",
      },
    },
  ],

  detail: [
    { label: "Denominazione" },
    { label: "Vitigno" },
    { label: "Provenienza", value: "Campania, Italia" },
    { label: "Vendemmia", value: "Prima metà di ottobre" },
    {
      label: "Sistema di allevamento",
      value: "Guyot su pali di legno — le «falangae» che già in epoca romana diedero il nome alla vite.",
    },
    {
      label: "Vinificazione",
      value: "Pressatura soffice a grappolo intero. Segue un affinamento tranquillo a temperatura controllata.",
    },
    { label: "Affinamento", value: "1 anno in acciaio, 2 mesi in bottiglia" },
    { label: "Gradazione alcolica", value: "13,0 % vol." },
    { label: "Temperatura di servizio", value: "circa 10 °C" },
    { label: "Formato" },
    { label: "Nota", value: "Contiene solfiti" },
  ],

  story: {
    kicker: "La storia",
    title: "Una vite antica quanto la Campania",
    paragraphs: [
      "La Falanghina è tra i vitigni più antichi della Campania. Secondo la tradizione, il suo nome risale alle «falangae» – i pali di legno lungo i quali le viti si arrampicavano già al tempo dei Romani.",
      "La nostra Falanghina cresce nell'entroterra collinare della provincia di Benevento. Giornate calde, notti fresche e la vicinanza del Mediterraneo le regalano ciò che la rende inconfondibile: freschezza, limpidezza e un frutto fine e luminoso.",
    ],
    quote: {
      text: "Un vino per i momenti luminosi – per i lunghi mezzogiorni, la cucina fresca e le conversazioni sincere.",
    },
  },

  place: {
    kicker: "La provenienza",
    title: "Il Beneventano",
    text: "Tra l'Appennino e la costa si distende il Beneventano: colline dolci, tanta luce e notti più fresche che in riva al mare. Qui la Falanghina matura lentamente – e conserva la sua tensione.",
    stats: [
      { label: "Regione", value: "Campania" },
      { label: "Provincia" },
      { label: "Vendemmia", value: "Inizio ottobre" },
      { label: "Clima", value: "Giorni caldi, notti fresche" },
    ],
    photoAlt: "Vigneti sopra il Golfo di Napoli con vista sul Vesuvio",
    chip: { subtitle: "Campania · Italia" },
  },

  pairing: {
    scene: {
      copy: "La ricciola delicata e i pomodorini succosi non chiedono un compagno impegnativo. La Falanghina porta in tavola freschezza, frutto e vivacità, lasciando al pesce tutto lo spazio che merita. La sua indole fresca riprende la succosità dei pomodorini, mentre il corpo snello accompagna il piatto senza coprirlo. Un abbinamento chiaro e mediterraneo, che dà il meglio di sé nelle giornate più calde.",
      imageAlt: "Filetto di ricciola con pomodorini su un piatto, accanto un calice di Falanghina e la bottiglia aperta",
      regionLink: { label: "Scopri di più sulla Campania" },
    },
  },

  moment: {
    title: "Come gustare al meglio la Falanghina",
    serve: {
      title: "Servire e degustare",
      items: [
        { title: "Temperatura di servizio", text: "circa 10 °C — ben fresca, nel calice da vino bianco" },
        { title: "Quando berlo", text: "Da bere subito o entro 2–3 anni" },
        { title: "Il preludio", text: "Togliere la bottiglia dal frigorifero poco prima di servire" },
      ],
    },
    maria: {
      text: "Per i lunghi mezzogiorni all'aperto, la cucina fresca e le conversazioni sincere — la Falanghina è il vino dei momenti luminosi.",
      link: { label: "Scopri di più" },
    },
    essence: [
      {
        kicker: "Gusto",
        title: "Morbido, armonico, fresco",
        text: "Fiori bianchi, pera e un tocco di agrumi — un sorso molto morbido e al tempo stesso armonico e persistente.",
      },
      {
        kicker: "Provenienza",
        title: "Beneventano, Campania",
        text: "Colline dolci tra l'Appennino e la costa. Giornate calde e notti fresche custodiscono freschezza e tensione.",
      },
      {
        kicker: "Vitigno",
        text: "Uno dei vitigni più antichi della Campania — il suo nome risale ai pali di legno dell'epoca romana. 100 % in purezza.",
      },
    ],
  },

  faq: [
    {
      q: "Che gusto ha la Falanghina?",
      a: "Molto morbida e al tempo stesso armonica e persistente: un bianco fresco e di carattere, dal frutto luminoso e dalla limpidezza vivace – accessibile, senza mai essere banale. Nel calice si presenta di un giallo paglierino con riflessi verdolini, chiara e luminosa – una freschezza che al palato mantiene ciò che promette.",
    },
    {
      q: "Da dove viene la Falanghina?",
      a: "La nostra Falanghina cresce nel Beneventano, l'entroterra collinare della provincia di Benevento, in Campania – giornate calde, notti fresche e la vicinanza del Mediterraneo le regalano freschezza e un frutto fine e luminoso. Il vitigno stesso è tra i più antichi della Campania.",
      link: { label: "Scopri di più sulla Campania" },
    },
    {
      q: "Che cosa significa «Beneventano IGP»?",
      a: "IGP sta per «Indicazione Geografica Protetta». Le uve provengono dal Beneventano – l'entroterra collinare della provincia di Benevento, in Campania.",
    },
    {
      q: "La Falanghina si abbina al pesce o alla pasta?",
      a: "A entrambi – ma soprattutto al pesce: alla griglia, in padella o al forno, e altrettanto bene a crostacei e frutti di mare. Con la pasta decide il condimento: con le preparazioni chiare e leggere si abbina a meraviglia. E ben fresca è un aperitivo ideale.",
    },
    {
      q: "Qual è la differenza tra Falanghina e Greco di Tufo?",
      a: "Entrambi sono vitigni bianchi della Campania, ma con un carattere proprio: la Falanghina del Beneventano è morbida, armonica e di una freschezza immediata. Il Greco di Tufo cresce su tufo vulcanico, porta con sé più struttura e una vena minerale – ed è uno dei pochi bianchi italiani a fregiarsi della D.O.C.G.",
      link: { label: "Scopri il Greco di Tufo" },
    },
  ],

  similar: {
    kicker: "Scopri vini simili",
    title: "Se ti piace la Falanghina",
    trait: "che colgono la stessa nota: luminosi, freschi, mediterranei.",
  },

  cta: {
    title: "Vuoi scoprire di più?",
    text: "Scopri tutti i nostri vini nello shop ufficiale Maria Maria.",
    button: { label: "Allo shop ufficiale" },
  },

  subnav: [
    { label: "Panoramica" },
    { label: "Gusto" },
    { label: "Si abbina a" },
    { label: "Domande" },
  ],
};

export default falanghina;
