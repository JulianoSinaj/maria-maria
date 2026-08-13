/* Overlay di testo per la pagina del Rosato — struttura: components/weine/rosato-puglia/wineData.js */

const rosatoPuglia = {
  shortNameNom: "il Rosato",
  shortNameGen: "del Rosato",
  eyebrow: "Vini boutique italiani",
  lede:
    "Negroamaro dai vigneti ad alberello di Torricella e Maruggio. Quattro ore sulle bucce, tre mesi in acciaio — un rosato del colore della polpa di pesca.",
  heroWords: ["Delicato.", "Fresco.", "Fruttato."],

  breadcrumb: [{ label: "Home" }, { label: "I nostri vini" }, {}],

  facts: [
    { label: "Provenienza", value: "Salento, Puglia" },
    { label: "Vitigno" },
    { label: "Affinamento", value: "3 mesi in acciaio" },
    { label: "Temperatura di servizio", value: "12–14 °C" },
  ],

  colorMoment: {
    kicker: "Il colore",
    lines: ["Rosa.", "Come polpa di pesca."],
    text: "Solo quattro ore di contatto con le bucce — quel tanto che basta a dare al vino il suo colore delicato e luminoso, senza appesantirlo.",
    swatches: [
      { label: "Polpa di pesca" },
      { label: "Rosa delicato" },
      { label: "Riflesso caldo" },
    ],
    artwork: {
      alt: "Dipinto a olio «Pink and Red Roses» di Henri Fantin-Latour: rose rosa tenue con riflessi caldi",
      videoTitle: "Rosa nel calice",
    },
  },

  taste: [
    {
      kicker: "Colore",
      title: "Rosa polpa di pesca",
      text: "Un rosato delicato e luminoso — il risultato di sole quattro ore sulle bucce. Chiaro nel calice, caldo nella luce.",
      artwork: {
        alt: "Bottiglia di Rosato Negroamaro IGP Salento di Maria Maria — vista frontale dell'etichetta",
        medium: "La bottiglia",
      },
    },
    {
      kicker: "Profumo",
      title: "Delicato, persistente, floreale",
      text: "Fini note floreali che non si impongono, ma restano a lungo. La temperatura di fermentazione controllata preserva ogni aroma.",
      artwork: {
        alt: "Retroetichetta della bottiglia di Rosato Negroamaro IGP Salento di Maria Maria",
        medium: "La retroetichetta",
      },
    },
    {
      kicker: "Gusto",
      title: "Fresco, equilibrato, elegantemente fruttato",
      text: "Al palato fresco e coerente in sé — un rosato il cui frutto resta elegante invece di farsi dolce.",
      artwork: {
        alt: "Bottiglia di Rosato Negroamaro IGP Salento di Maria Maria in cantina",
        medium: "In cantina",
      },
    },
  ],

  detail: [
    { label: "Denominazione" },
    { label: "Vitigno" },
    { label: "Provenienza", value: "Torricella e Maruggio, Salento" },
    { label: "Sistema di allevamento", value: "Esclusivamente alberello, senza irrigazione" },
    {
      label: "Vinificazione",
      value:
        "Fermentazione alcolica a temperatura controllata per preservare l'aroma, con 4 ore di contatto sulle bucce.",
    },
    { label: "Affinamento", value: "3 mesi in acciaio fino all'imbottigliamento" },
    { label: "Gradazione alcolica", value: "12,00 % vol." },
    { label: "Temperatura di servizio", value: "12–14 °C" },
    { label: "Formato", value: "750 ml" },
    { label: "Nota", value: "Contiene solfiti" },
  ],

  story: {
    kicker: "La storia",
    title: "Quattro ore che decidono tutto",
    paragraphs: [
      "Il Negroamaro è un'uva scura — il nero è già nel suo nome. Farne un rosato è una questione di ore: quattro ore di contatto fra mosto e bucce, poi si separa. Ancora un poco, e il vino sarebbe rosso.",
      "Le uve provengono dalle vigne di Torricella e Maruggio, allevate esclusivamente ad alberello — i ceppi bassi e liberi della Puglia, senza irrigazione. Poi tre mesi di riposo in acciaio, perché la freschezza arrivi intatta in bottiglia.",
    ],
    quote: {
      text: "Un vino per il momento prima di cena — quando il giorno risuona ancora e la sera sta appena iniziando.",
    },
  },

  place: {
    kicker: "La provenienza",
    title: "Salento",
    text: "Il tacco dello stivale italiano, fra due mari. Giornate calde, brezze marine rinfrescanti e suoli rossi e calcarei — il Salento è la patria del Negroamaro.",
    stats: [
      { label: "Regione", value: "Salento, Puglia" },
      { label: "Vigneti", value: "Torricella e Maruggio" },
      { label: "Sistema di allevamento", value: "Alberello, senza irrigazione" },
      { label: "Classificazione", value: "Negroamaro I.G.P. Salento" },
    ],
    chip: { subtitle: "Puglia · Italia" },
  },

  pairing: {
    scene: {
      dish: "Burrata con pomodori e focaccia",
      copy: "Burrata cremosa, pomodori maturati al sole e focaccia calda sono un aperitivo che vive di semplicità ed equilibrio. Il Rosato Puglia IGP accompagna questo momento con freschezza, frutto fine e una leggerezza che non copre né la dolcezza del formaggio né quella dei pomodori. È proprio questa armonia a renderlo il vino ideale per la prima sera — immediato, mediterraneo e pieno di piacere.",
      imageAlt:
        "Burrata con pomodorini, olive e focaccia su una terrazza nella luce della sera, accanto un calice di Rosato e la bottiglia",
      regionLink: {
        label: "Scopri di più sulla Puglia",
      },
    },
  },

  moment: {
    title: "Così il Rosato dà il meglio di sé",
    serve: {
      title: "Servire e degustare",
      items: [
        { title: "Temperatura di servizio", text: "12–14 °C — ben fresco" },
        { title: "Quando berlo", text: "Da gustare giovane — al meglio entro 1–2 anni" },
        { title: "Il rituale", text: "Versare poco e spesso, così resta fresco nel calice" },
      ],
    },
    maria: {
      text: "Per le sere d'estate in terrazza — quando il giorno risuona ancora, la luce si fa calda e il cibo resta leggero.",
      link: { label: "Scopri di più" },
    },
    essence: [
      {
        kicker: "Gusto",
        title: "Fresco, equilibrato, elegante",
        text: "Fini note floreali, delicate e persistenti — un frutto che resta elegante invece di farsi dolce.",
      },
      {
        kicker: "Provenienza",
        title: "Salento, Puglia",
        text: "Vigneti ad alberello di Torricella e Maruggio — quattro ore sulle bucce, non serve altro.",
      },
      {
        kicker: "Vitigno",
        title: "Negroamaro",
        text: "L'uva scura del Salento — il nero è già nel suo nome. Qui mostra il suo lato delicato.",
      },
    ],
  },

  faq: [
    {
      q: "Che gusto ha il Rosato Puglia di Maria Maria?",
      a: "Fresco, equilibrato ed elegantemente fruttato. Al naso delicato e persistente con note floreali, nel calice rosa come polpa di pesca — al palato il frutto resta elegante invece di farsi dolce: un rosato che vive della sua freschezza.",
    },
    {
      q: "Il Rosato Puglia è secco?",
      a: "Sì — il suo frutto resta elegante e fresco, senza risultare dolce. Solo quattro ore sulle bucce e tre mesi di riposo in acciaio preservano esattamente questa nitidezza, con leggeri 12 % vol.",
    },
    {
      q: "Il Rosato si abbina all'aperitivo?",
      a: "È fatto proprio per questo: ben fresco a 12–14 °C è il classico prima di cena. Accompagna altrettanto bene antipasti, primi semplici e secondi di pesce azzurro o carni bianche.",
    },
    {
      q: "Qual è la differenza tra rosato e rosé?",
      a: "Nella sostanza nessuna: rosato è la parola italiana per rosé. Ciò che conta è il metodo — il nostro rosato nasce dall'uva scura Negroamaro, il cui mosto resta sulle bucce solo quattro ore. Il colore sta nella buccia, non nel succo: una macerazione breve dà il rosa delicato invece di un vino rosso.",
    },
    {
      q: "Che cosa significa «IGP Salento»?",
      a: "IGP sta per «Indicazione Geografica Protetta», l'indicazione geografica protetta. Le uve provengono dal Salento, la parte più meridionale della Puglia.",
    },
  ],

  similar: {
    kicker: "Scopri vini simili",
    title: "Se ti piace il Rosato",
    trait: "che cercano la stessa leggerezza: fruttati, freschi, immediati.",
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

export default rosatoPuglia;
