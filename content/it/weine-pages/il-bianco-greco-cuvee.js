/* Overlay di testo per la pagina de Il Bianco — struttura: components/weine/il-bianco-greco-cuvee/wineData.js */

const ilBianco = {
  shortNameNom: "il Bianco",
  shortNameGen: "del Bianco",
  eyebrow: "Vini boutique italiani",
  lede:
    "Una cuvée di vitigni bianchi selezionati della Campania. Due anni di riposo in acciaio gli donano un bouquet intenso e un gusto delicato e seducente.",
  heroWords: ["Intenso.", "Delicato.", "Seducente."],

  breadcrumb: [{ label: "Home" }, { label: "I nostri vini" }, {}],

  facts: [
    { label: "Provenienza", value: "Campania, Italia" },
    { label: "Uvaggio", value: "Cuvée di vitigni bianchi selezionati" },
    { label: "Affinamento", value: "2 anni in acciaio" },
    { label: "Temperatura di servizio", value: "circa 10 °C" },
  ],

  colorMoment: {
    kicker: "Il colore",
    lines: ["Giallo paglierino.", "Chiaro e quieto."],
    text: "Nel calice il Bianco si presenta giallo paglierino e limpido — un bianco la cui quiete si vede prima ancora di annusarla.",
    swatches: [
      { label: "Paglia chiara" },
      { label: "Giallo paglierino" },
      { label: "Riflesso caldo" },
    ],
    artwork: {
      alt: "Dipinto a olio «Covoni, fine dell'estate» di Claude Monet: campi nei toni della paglia e dell'oro nella luce della sera",
      title: "Covoni, fine dell'estate",
      videoTitle: "Giallo paglierino nel calice",
    },
  },

  taste: [
    {
      kicker: "Colore",
      title: "Giallo paglierino e limpido",
      text: "Un bianco chiaro e quieto — giallo paglierino nel calice, senza alcuna pesantezza.",
      artwork: {
        alt: "Bottiglia di Il Bianco — Campania Bianco IGP di Maria Maria — vista frontale dell'etichetta",
        medium: "La bottiglia",
      },
    },
    {
      kicker: "Profumo",
      title: "Molto intenso e gradevole",
      text: "La scheda tecnica lo definisce semplicemente «profumo molto intenso e gradevole»: un bouquet ampio e avvolgente, che riempie tutta la stanza.",
      artwork: {
        alt: "Retroetichetta della bottiglia di Il Bianco — Campania Bianco IGP di Maria Maria",
        medium: "La retroetichetta",
      },
    },
    {
      kicker: "Gusto",
      title: "Delicato e seducente",
      text: "Al palato delicato e discreto — un vino che non incalza, ma invita. Ed è proprio questo a renderlo così pericolosamente bevibile.",
      artwork: {
        alt: "Bottiglia di Il Bianco — Campania Bianco IGP di Maria Maria in cantina",
        medium: "In cantina",
      },
    },
  ],

  detail: [
    { label: "Denominazione" },
    { label: "Uvaggio", value: "Blend di vitigni bianchi selezionati" },
    { label: "Provenienza", value: "Campania, Italia" },
    { label: "Vendemmia", value: "Fine settembre / inizio ottobre" },
    {
      label: "Vinificazione",
      value: "Pressatura soffice e delicata dei grappoli interi. Seguono due anni di affinamento in silo d'acciaio.",
    },
    { label: "Affinamento", value: "2 anni in acciaio" },
    { label: "Gradazione alcolica", value: "13,0 % vol." },
    { label: "Temperatura di servizio", value: "circa 10 °C" },
    { label: "Formato", value: "750 ml" },
    { label: "Nota", value: "Contiene solfiti" },
  ],

  story: {
    kicker: "La storia",
    title: "Due anni di pazienza",
    paragraphs: [
      "Il Bianco non è una solista, ma un insieme: vitigni bianchi selezionati della Campania che trovano il proprio carattere solo insieme. Le uve vengono pressate a grappolo intero, in modo soffice e delicato — nulla viene forzato.",
      "Poi arriva la parte che non si può abbreviare: due anni in silo d'acciaio. Niente legno, nessuna distrazione. Ciò che resta è un bouquet molto intenso e un gusto che si è fatto delicato invece che rumoroso.",
    ],
    quote: {
      text: "Certi vini bisogna farli aspettare, perché diventino silenziosi.",
    },
  },

  place: {
    kicker: "La provenienza",
    title: "Campania",
    text: "Sole, mare e suoli vulcanici: la Campania genera vitigni bianchi capaci di tenere insieme frutto e freschezza. È proprio da qui che nasce questa cuvée.",
    stats: [
      { label: "Regione", value: "Campania" },
      { label: "Classificazione", value: "Campania Bianco IGP" },
      { label: "Vendemmia", value: "Fine settembre" },
      { label: "Maturazione", value: "2 anni in acciaio" },
    ],
    photoAlt: "Vigneti sopra il Golfo di Napoli con vista sul Vesuvio",
    chip: { subtitle: "Campania · Italia" },
  },

  pairing: {
    scene: {
      dish: "Paccheri con gamberi e zucchine",
      copy: "Paccheri, gamberi succosi e zucchine delicate uniscono la freschezza mediterranea a una texture piacevolmente morbida. Il Bianco accompagna esattamente questo equilibrio: fresco quanto basta per i gamberi, aromatico quanto serve per le verdure e con struttura sufficiente per la pasta. La dolcezza fine dei gamberi resta intatta, mentre la freschezza del vino riapre il palato tra un boccone e l'altro. Un abbinamento semplice ma raffinato per una serata italiana di pasta.",
      imageAlt:
        "Paccheri con gamberi e zucchine nel piatto, accanto un calice di Il Bianco e la bottiglia aperta",
      regionLink: {
        label: "Scopri di più sulla Campania",
      },
    },
  },

  moment: {
    title: "Così il Bianco dà il meglio di sé",
    serve: {
      title: "Servire e degustare",
      items: [
        { title: "Temperatura di servizio", text: "circa 10 °C — non troppo freddo, altrimenti il bouquet si chiude" },
        { title: "Quando berlo", text: "Già affinato — da gustare ora o entro 2–3 anni" },
        { title: "Il calice", text: "Nel calice ampio da bianco il bouquet intenso si esprime al meglio" },
      ],
    },
    maria: {
      text: "Per le sere tranquille in cui non c'è nulla da dimostrare — un vino che si è fatto silenzioso e proprio per questo resta.",
      link: { label: "Scopri di più" },
    },
    essence: [
      {
        kicker: "Gusto",
        title: "Delicato e seducente",
        text: "Un bouquet molto intenso, al palato delicato e discreto — un vino che non incalza, ma invita.",
      },
      {
        kicker: "Provenienza",
        title: "Campania",
        text: "Sole, mare e suoli vulcanici — una regione le cui uve bianche tengono insieme frutto e freschezza.",
      },
      {
        kicker: "Vitigno",
        title: "Greco Cuvée",
        text: "Vitigni bianchi selezionati della Campania, la cui composizione segue l'annata — uniti da due anni in acciaio.",
      },
    ],
  },

  faq: [
    {
      q: "Che gusto ha Il Bianco Greco Cuvée di Maria Maria?",
      a: "Molto intenso e gradevole nel profumo, delicato e seducente nel gusto. Il colore è giallo paglierino — un bianco chiaro e accessibile con una sorprendente profondità aromatica.",
    },
    {
      q: "Che cosa significa Greco Cuvée per Il Bianco?",
      a: "Il Bianco è una cuvée di vitigni bianchi selezionati della Campania — il nome rimanda al Greco. Una ripartizione esatta delle varietà non è pubblicata; sono confermate la pressatura soffice dei grappoli interi e i due anni di affinamento in acciaio, che uniscono le uve in un bianco intenso e delicato.",
    },
    {
      q: "La Greco Cuvée si abbina all'aperitivo?",
      a: "Sì — ben fresca, intorno ai 10 °C, è un elegante inizio di serata. Da non servire troppo fredda, altrimenti il bouquet intenso si chiude; nel calice ampio da bianco si esprime al meglio.",
    },
    {
      q: "Per quale occasione è adatto Il Bianco Greco Cuvée?",
      a: "Per le sere tranquille in cui non c'è nulla da dimostrare — con piatti di pesce, crostacei e frutti di mare oppure come aperitivo. Un vino già affinato (due anni in acciaio), che non incalza ma invita.",
    },
    {
      q: "Che cosa significa «Campania Bianco IGP»?",
      a: "IGP sta per «Indicazione Geografica Protetta», l'indicazione geografica protetta. Le uve provengono dalla regione Campania, nel Sud Italia.",
    },
  ],

  similar: {
    kicker: "Scopri vini simili",
    title: "Se ti piace il Bianco",
    trait: "che portano la stessa scrittura luminosa: freschi, eleganti, equilibrati.",
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

export default ilBianco;
