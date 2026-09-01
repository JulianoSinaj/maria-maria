/* Overlay di testo per la pagina del Lugana — struttura: components/weine/lugana/wineData.js */

const lugana = {
  shortNameNom: "il Lugana",
  shortNameGen: "del Lugana",
  eyebrow: "Vini boutique italiani",
  lede:
    "Dalla sponda meridionale del Garda. Dalla Turbiana su suoli morenici ghiaiosi nasce un bianco dal profumo intenso e complesso — pieno, caldo e morbido al palato, con un lungo finale aromatico.",
  heroWords: ["Intenso.", "Morbido.", "Persistente."],

  breadcrumb: [{ label: "Home" }, { label: "I nostri vini" }, {}],

  facts: [
    { label: "Provenienza", value: "Lago di Garda – Desenzano e Pozzolengo" },
    { label: "Vitigno" },
    { label: "Affinamento", value: "Sui lieviti fino all'imbottigliamento" },
    { label: "Temperatura di servizio", value: "8–10 °C" },
  ],

  colorMoment: {
    kicker: "Il colore",
    lines: ["Giallo paglierino.", "Intenso e luminoso."],
    text: "Nel calice il Lugana si presenta di un giallo paglierino pieno e brillante – un colore che racconta densità e calore ancora prima del primo sorso.",
    swatches: [
      { label: "Paglia chiara" },
      { label: "Giallo paglierino" },
      { label: "Riflesso dorato" },
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
      title: "Giallo paglierino intenso e luminoso",
      text: "Un giallo pieno dal riflesso nitido – la prima impressione nel calice promette pienezza più che leggerezza.",
      artwork: {
        alt: "Bottiglia di Lugana DOC di Maria Maria — vista frontale dell'etichetta",
        medium: "La bottiglia",
      },
    },
    {
      kicker: "Profumo",
      title: "Mughetto, biancospino e frutta matura",
      text: "Intenso e complesso: note floreali di mughetto e biancospino, seguite da frutta matura, pasticceria fine e un delicato tocco tostato.",
      artwork: {
        alt: "Retroetichetta della bottiglia di Lugana DOC di Maria Maria",
        medium: "La retroetichetta",
      },
    },
    {
      kicker: "Gusto",
      title: "Pieno, caldo, morbido e avvolgente",
      text: "Al palato ampio e vellutato, con buona persistenza e ritorni aromatici armonici che risuonano a lungo.",
      artwork: {
        alt: "Bottiglia di Lugana DOC di Maria Maria in cantina",
        medium: "In cantina",
      },
    },
  ],

  detail: [
    { label: "Denominazione" },
    { label: "Vitigno" },
    { label: "Provenienza", value: "Desenzano e Pozzolengo, Lago di Garda" },
    { label: "Sistema di allevamento", value: "Filare con potatura a Guyot" },
    {
      label: "Vinificazione",
      value:
        "Vinificazione in bianco con criomacerazione di sette giorni sulle bucce per estrarre gli aromi primari. Segue la fermentazione a temperatura controllata di 14–16 °C.",
    },
    { label: "Affinamento", value: "Sui lieviti fini fino all'imbottigliamento" },
    { label: "Suolo", value: "Ricco di scheletro, matrice ghiaiosa" },
    { label: "Temperatura di servizio", value: "8–10 °C" },
    { label: "Formato", value: "750 ml" },
    { label: "Nota", value: "Contiene solfiti" },
  ],

  story: {
    kicker: "La storia",
    title: "La Turbiana e la luce del Garda",
    paragraphs: [
      "Il Lugana cresce sulla sponda meridionale del Lago di Garda, tra Desenzano e Pozzolengo. Qui il vitigno si chiama Trebbiano di Lugana – più noto con il suo antico nome, Turbiana.",
      "I vigneti sorgono su suoli morenici ghiaiosi e ricchi di scheletro. È proprio questa struttura magra e drenante a donare al vino la sua aromaticità e il suo profumo – non opulenza, ma concentrazione.",
    ],
    quote: {
      text: "Un vino che porta il lago nel calice: ampio, caldo e quieto.",
    },
    image: {
      alt: "Grappoli maturi di Turbiana nella luce dorata del sole sulla vite",
    },
  },

  place: {
    kicker: "La provenienza",
    title: "La sponda sud del Garda",
    text: "Tra Desenzano e Pozzolengo i vigneti si distendono sulle colline moreniche del Garda. Il lago mitiga le temperature, i suoli ghiaiosi costringono le radici in profondità – da qui nasce l'aromaticità del Lugana.",
    stats: [
      { label: "Regione", value: "Lombardia" },
      { label: "Zona", value: "Desenzano · Pozzolengo" },
      { label: "Suolo", value: "Ricco di scheletro, ghiaioso" },
      { label: "Sistema di allevamento", value: "Guyot" },
    ],
    photoAlt: "Vigneti sulla sponda meridionale del Lago di Garda nella luce della sera",
    chip: { subtitle: "Lago di Garda · Lombardia" },
  },

  pairing: {
    scene: {
      dish: "Risotto di pesce con limone ed erbe aromatiche",
      copy: "Un delicato risotto di pesce con limone ed erbe chiede un vino che porti freschezza e quiete allo stesso tempo. Il Lugana DOC si abbina qui particolarmente bene perché accompagna con eleganza la texture cremosa del risotto senza coprire gli aromi fini del pesce. La sua struttura gentile, il frutto luminoso e il finale nitido fanno sì che ogni boccone risulti leggero, equilibrato e molto armonioso.",
      imageAlt:
        "Risotto di pesce con limone ed erbe su una terrazza sopra il Lago di Garda, accanto un calice di Lugana DOC e la bottiglia",
      regionLink: {
        label: "Scopri la Lombardia sul Lago di Garda",
      },
    },
  },

  moment: {
    title: "Così il Lugana dà il meglio di sé",
    serve: {
      title: "Servire e degustare",
      items: [
        { title: "Temperatura di servizio", text: "8–10 °C — nel calice da bianco" },
        { title: "Quando berlo", text: "Da gustare ora o entro 2–4 anni" },
        { title: "Il rituale", text: "Un momento d'aria nel calice apre profumo e pienezza" },
      ],
    },
    maria: {
      text: "Per lunghe serate in riva all'acqua — quando la tavola è apparecchiata fuori e il lago sta nel calice: ampio, caldo e quieto.",
      link: { label: "Scopri di più" },
    },
    essence: [
      {
        kicker: "Gusto",
        title: "Pieno, caldo e morbido",
        text: "Mughetto, biancospino, frutta matura e pasticceria fine — avvolgente, con un lungo finale aromatico.",
      },
      {
        kicker: "Provenienza",
        title: "Sponda sud del Garda",
        text: "Suoli morenici ghiaiosi tra Desenzano e Pozzolengo — il lago mitiga il clima, il suolo magro concentra.",
      },
      {
        kicker: "Vitigno",
        title: "Turbiana",
        text: "Trebbiano di Lugana — l'antica uva bianca del lago, affinata sui lieviti fini fino all'imbottigliamento.",
      },
    ],
  },

  faq: [
    {
      q: "Che cos'è il vino Lugana?",
      a: "Il Lugana è una piccola e rinomata denominazione di vino bianco (DOC) sulla sponda meridionale del Lago di Garda, ottenuta dal vitigno Turbiana. Il nostro Lugana proviene dai vigneti di Desenzano e Pozzolengo.",
      link: { label: "Scopri la Lombardia sul Lago di Garda" },
    },
    {
      q: "Che gusto ha il Lugana di Maria Maria?",
      a: "Pieno, caldo, morbido e avvolgente, con buona persistenza e ritorni aromatici armonici. Al naso è intenso e complesso: mughetto e biancospino, seguiti da frutta matura, pasticceria fine e un delicato tocco tostato.",
    },
    {
      q: "Quale vitigno si usa per il Lugana?",
      a: "Trebbiano di Lugana, chiamato anche Turbiana. Le uve provengono dai vigneti di Turbiana dei comuni di Desenzano e Pozzolengo, sulla sponda sud del Garda.",
    },
    {
      q: "Il Lugana si abbina al pesce?",
      a: "Sì, in modo eccellente – soprattutto con antipasti di pesce crudo e cotto e primi piatti delicati. L'importante è evitare salse pesanti e speziature dominanti, così che sia la sua finezza a guidare. Anche come aperitivo è una scelta elegante.",
    },
    {
      q: "Qual è la differenza tra Lugana e Pinot Grigio?",
      a: "Il Lugana è un vino bianco legato al territorio (DOC) della sponda sud del Garda, ottenuto dal vitigno Turbiana; il Pinot Grigio è invece il nome di un vitigno, senza questo legame con l'origine. Il nostro Lugana si mostra pieno, caldo e morbido al palato — con profumo intenso di mughetto e biancospino, frutta matura e buona persistenza.",
    },
  ],

  similar: {
    kicker: "Scopri vini simili",
    title: "Se ti piace il Lugana",
    trait: "che cercano la stessa freschezza e mineralità: eleganti e nitidi.",
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

export default lugana;
