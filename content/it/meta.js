/* Testi per i motori di ricerca, pagina per pagina.
   Stessa struttura di content/de/meta.js — vedi lì per le note.
   Il suffisso del marchio („— Maria Maria") arriva dal title.template. */

export const meta = {
  siteTitle: "Maria Maria — Il piacere del vino",
  siteDescription: "Vini italiani di boutique per momenti di piacere scelti con cura.",
  orgDescription:
    "Vini italiani di boutique selezionati personalmente da Puglia, Campania e Lago di Garda.",

  home: {
    title: "Maria Maria — Il piacere del vino",
    description: "Vini italiani di boutique per momenti di piacere scelti con cura.",
  },

  collection: {
    title: "I nostri vini",
    description:
      "Vini italiani di boutique selezionati a mano da piccole cantine – rossi, bianchi e rosati dalla Puglia, dalla Campania e dal Lago di Garda.",
  },

  shop: {
    title: "Shop",
    description:
      "Lo shop ufficiale Maria Maria: vini di boutique in edizione limitata e confezioni degustazione, spedizione gratuita da 69 €. Italian wine, personal selection.",
  },

  geschichte: {
    title: "La nostra storia",
    description:
      "Due donne, due generazioni, un modo di intendere il vino: da Lizzano nel Salento all'Irpinia e al Lago di Garda fino a Düsseldorf — in Germania dal 2019.",
    keywords: [
      "Maria Maria",
      "storia",
      "vini italiani",
      "Salento",
      "Lizzano",
      "Lago di Garda",
      "Campania",
      "Düsseldorf",
    ],
    ogImageAlt:
      "Bottiglia Maria Maria con calice di vino rosso e olive su una terrazza di pietra al sole",
  },

  magazin: {
    title: "Magazine",
    description:
      "Cultura del vino, abbinamenti, regioni e storie dal mondo di Maria Maria — ispirazione per il prossimo momento di piacere.",
    keywords: [
      "magazine del vino",
      "cultura del vino",
      "abbinamenti",
      "vini italiani",
      "momenti di piacere",
      "Maria Maria",
    ],
    ogImageAlt: "Un vignaiolo osserva un calice di vino rosso tra le barrique in cantina",
  },

  regionen: {
    titleAbsolute: "Regioni vinicole italiane: Puglia, Campania e Lugana | Maria Maria",
    description:
      "Scopri vini selezionati dalla Puglia, dalla Campania e dalla zona del Lugana sul Lago di Garda – vitigni, origine, gusto e consigli di abbinamento.",
  },

  kontakt: {
    /* come in content/de/meta.js: titolo completo con il marchio */
    titleAbsolute: "Contatti | Vini italiani per ristorazione & eventi | Maria Maria",
    description:
      "Vini boutique italiani per ristorazione, gastronomia, commercio, eventi e degustazioni a Düsseldorf & NRW. Consulenza personale e selezione di vini su misura.",
  },

  agb: {
    title: "Condizioni di vendita",
    description: "Condizioni generali di vendita per gli ordini nello shop online Maria Maria.",
  },

  datenschutz: {
    title: "Informativa sulla privacy",
    description:
      "Informazioni sul trattamento dei dati personali su maria-maria.wine ai sensi del GDPR.",
  },

  impressum: {
    title: "Note legali",
    description: "Note legali e dati societari di Maria Maria Wines GmbH, Düsseldorf.",
  },

  /* Le nove pagine prodotto — modelli, non frasi finite: nome, annata,
     tipologia, regione, note e abbinamento arrivano dal catalogo tradotto
     tramite lib/seo/wine.js. Il nome del marchio non va qui: lo aggiunge il
     title.template del layout. */
  wine: {
    title: "{name} {year} · {type} · {region}",
    description:
      "{name} ({year}) — {type}, {region}. {notes}. {pairing} A {price} da Maria Maria.",
    ogImageAlt: "Bottiglia {name} di Maria Maria — {type}, {region}",
  },

  notFound: {
    title: "Pagina non trovata",
  },
};

export default meta;
