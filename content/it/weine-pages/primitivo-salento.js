/* Overlay di testo per la pagina del Primitivo Salento — struttura: components/weine/primitivo-salento/wineData.js */

const primitivoSalento = {
  shortNameNom: "il Primitivo",
  shortNameGen: "del Primitivo",
  eyebrow: "Vini boutique italiani",
  lede:
    "100 % Primitivo da Torricella e Lizzano. Allevamento ad alberello senza irrigazione, lunga macerazione sulle bucce e dodici mesi in acciaio — frutto maturo con profondità.",
  heroWords: ["Intenso.", "Maturo.", "Persistente."],

  breadcrumb: [{ label: "Home" }, { label: "I nostri vini" }, {}],

  facts: [
    { label: "Provenienza", value: "Salento, Puglia" },
    { label: "Vitigno" },
    { label: "Affinamento", value: "12 mesi in acciaio" },
    { label: "Temperatura di servizio", value: "16–18 °C" },
  ],

  colorMoment: {
    kicker: "Il colore",
    lines: ["Rosso rubino.", "Molto intenso."],
    text: "La lunga macerazione si legge nel calice: un rosso rubino fitto e molto intenso, che lascia passare pochissima luce.",
    swatches: [
      { label: "Rosso rubino" },
      { label: "Prugna scura" },
      { label: "Riflesso ciliegia" },
    ],
    artwork: {
      alt: "Dipinto a olio «Roses in a Bowl» di Henri Fantin-Latour: rose nei toni del rubino e della crema su fondo scuro profondo",
      videoTitle: "Rosso rubino nel calice",
    },
  },

  taste: [
    {
      kicker: "Colore",
      title: "Rosso rubino molto intenso",
      text: "Un rosso rubino fitto e molto intenso — il colore di un vino rimasto a lungo sulle bucce.",
      artwork: {
        alt: "Bottiglia di Primitivo IGP Salento di Maria Maria — vista frontale dell'etichetta",
        medium: "La bottiglia",
      },
    },
    {
      kicker: "Profumo",
      title: "Prugna e frutta secca",
      text: "Un bouquet complesso con note nette di prugna e frutta secca — il lato maturo del Salento.",
      artwork: {
        alt: "Retroetichetta della bottiglia di Primitivo IGP Salento di Maria Maria",
        medium: "La retroetichetta",
      },
    },
    {
      kicker: "Gusto",
      title: "Intenso, persistente e accessibile",
      text: "Intenso e a lungo persistente al gusto, e al tempo stesso piacevolmente accessibile, con una bevibilità immediata.",
      artwork: {
        alt: "Bottiglia di Primitivo IGP Salento di Maria Maria in cantina",
        medium: "In cantina",
      },
    },
  ],

  detail: [
    { label: "Denominazione" },
    { label: "Vitigno" },
    { label: "Provenienza", value: "Torricella e Lizzano, Salento" },
    { label: "Sistema di allevamento", value: "Esclusivamente alberello, senza irrigazione" },
    {
      label: "Vinificazione",
      value:
        "Fermentazione alcolica a temperatura controllata per preservare aromi e colore, con 7–8 giorni di contatto sulle bucce. Segue una leggera pressatura delle bucce.",
    },
    { label: "Affinamento", value: "12 mesi in acciaio fino all'imbottigliamento" },
    { label: "Gradazione alcolica", value: "14,5 % vol." },
    { label: "Temperatura di servizio", value: "16–18 °C" },
    { label: "Formato", value: "750 ml" },
    { label: "Nota", value: "Contiene solfiti" },
  ],

  story: {
    kicker: "La storia",
    title: "Alberello, senza irrigazione",
    paragraphs: [
      "Le uve provengono dai vigneti di Primitivo di Torricella e Lizzano — allevati esclusivamente ad alberello, la forma bassa e libera del Sud Italia, e senza alcuna irrigazione. La vite si procura l'acqua da sola, in profondità nel suolo.",
      "La lunga macerazione sulle bucce è la chiave: fa emergere le note nette di frutto maturo che segnano questo vino. Poi dodici mesi in acciaio — nessun legno a mettersi in mezzo, soltanto il frutto.",
    ],
    quote: {
      text: "Un vino che non ha nulla da nascondere: frutto maturo, origine chiara, carattere aperto.",
    },
  },

  place: {
    kicker: "La provenienza",
    title: "Salento",
    text: "Il Salento si trova nel tacco dello stivale italiano, fra due mari. Estati calde e secche e suoli calcarei danno qui un Primitivo dal frutto fitto e maturo — Torricella e Lizzano stanno nel cuore di questa zona.",
    stats: [
      { label: "Regione", value: "Salento, Puglia" },
      { label: "Comuni", value: "Torricella e Lizzano" },
      { label: "Classificazione", value: "Primitivo I.G.P. Salento" },
      { label: "Sistema di allevamento", value: "Alberello, senza irrigazione" },
    ],
    photoAlt: "Trulli e uliveti in Puglia nella luce della sera",
    chip: { subtitle: "Puglia · Italia" },
  },

  pairing: {
    scene: {
      dish: "Bombette della Valle d'Itria",
      copy: "Le bombette sono piccoli involtini di capocollo di maiale, farciti con caciocavallo e pepe, grigliati sulla brace in macelleria. Il formaggio si scioglie all'interno, all'esterno la carne diventa scura e croccante. Un piatto senza cerimonie — ed è esattamente per questo che è fatto questo Primitivo. Regge l'intensità, ma resta abbastanza morbido da non entrare in competizione con essa. La sapidità del formaggio stagionato mette nettamente in primo piano il suo frutto scuro.",
      imageAlt:
        "Bombette grigliate della Valle d'Itria su un tagliere di legno, accanto un calice di Primitivo e la bottiglia aperta",
      regionLink: {
        label: "Scopri di più sulla Puglia",
      },
    },
  },

  moment: {
    title: "Così il Primitivo dà il meglio di sé",
    serve: {
      title: "Servire e degustare",
      items: [
        { title: "Temperatura di servizio", text: "16–18 °C — nel calice da rosso" },
        { title: "Quando berlo", text: "Da gustare ora o entro 3–5 anni" },
        { title: "Il rituale", text: "Lasciarlo respirare un attimo — il frutto maturo emerge più nitido" },
      ],
    },
    maria: {
      text: "Per le serate spontanee senza occasione — un vino immediato per tavole piene e bottiglie vuote.",
      link: { label: "Scopri di più" },
    },
    essence: [
      {
        kicker: "Gusto",
        title: "Intenso, maturo, persistente",
        text: "Prugna e frutta secca, intenso e a lungo persistente — e al tempo stesso accessibile, con una bevibilità immediata.",
      },
      {
        kicker: "Provenienza",
        title: "Salento, Puglia",
        text: "Torricella e Lizzano fra due mari — estati calde e secche e suoli calcarei nel tacco dello stivale.",
      },
      {
        kicker: "Vitigno",
        title: "Primitivo",
        text: "La vite autoctona del Salento — lunga macerazione, dodici mesi in acciaio, puro frutto scuro.",
      },
    ],
  },

  faq: [
    {
      q: "Che gusto ha il Primitivo Salento IGP di Maria Maria?",
      a: "Intenso e a lungo persistente al gusto, con una bevibilità immediata e piacevolmente accessibile. Al naso un bouquet complesso con note di prugna e frutta secca.",
    },
    {
      q: "Che cosa significa Salento IGP?",
      a: "IGP sta per «Indicazione Geografica Protetta». Il Salento è la penisola del sud della Puglia — il tacco dello stivale italiano.",
    },
    {
      q: "Che cosa distingue il Primitivo Salento dal Primitivo di Manduria?",
      a: "Il livello di denominazione: «Primitivo di Manduria D.O.P.» è la denominazione di origine protetta per il Primitivo della zona ristretta attorno a Manduria; «I.G.P. Salento» comprende l'intera penisola salentina. Il nostro Salento IGP è l'interpretazione più immediata e accessibile — i due vini di Manduria sono più strutturati e concentrati.",
      link: { label: "Scopri il Primitivo di Manduria DOP" },
    },
    {
      q: "Con quali piatti si abbina il Primitivo Salento IGP?",
      a: "Con carne e formaggi — dagli arrosti e dalle grigliate ai formaggi stagionati, fino a primi saporiti e salumi. La sua bevibilità immediata ne fa un compagno accessibile della cucina saporita, servito preferibilmente a 16–18 °C nel calice da rosso.",
    },
    {
      q: "Che cosa significa allevamento ad alberello?",
      a: "L'alberello è la forma di allevamento tradizionale del Sud Italia: ceppi bassi e liberi, senza spalliera. Qui si pratica esclusivamente e senza irrigazione, così la vite si procura l'acqua da sé, dalla profondità.",
    },
  ],

  similar: {
    kicker: "Scopri vini simili",
    title: "Se ti piace il Primitivo",
    trait: "che portano lo stesso frutto e lo stesso calore: rotondi, morbidi, accessibili.",
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

export default primitivoSalento;
