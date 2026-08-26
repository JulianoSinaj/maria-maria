/* Testi per i motori di ricerca, pagina per pagina.
   Stessa struttura di content/de/meta.js — vedi lì per le note.
   Il suffisso del marchio („— Maria Maria") arriva dal title.template. */

export const meta = {
  siteTitle: "Maria Maria — Il piacere del vino",
  siteDescription: "Vini italiani di boutique per momenti di piacere scelti con cura.",
  orgDescription:
    "Vini italiani di boutique selezionati personalmente da Puglia, Campania e Lago di Garda.",

  home: {
    /* `titleAbsolute`, weil der Titel die Marke selbst führt: Mit dem
       title.template des Root-Layouts stand vorher „Maria Maria — Il piacere
       del vino — Maria Maria" im Tab, in og:title und in der Ergebniszeile.

       Titel und Description folgen jetzt dem Muster der deutschen Fassung
       („Hauptkeyword + Markt | Marke"), statt nur den Markenclaim zu
       wiederholen. Grund ist der hreflang-Verbund: Der Brief (§2) meldet
       it-IT, en-US und cs-CZ als Live-Geschwister der deutschen Startseite,
       und Google bewertet einen solchen Verbund als Einheit. Drei von vier
       Mitgliedern ohne ein einziges Keyword im Titel schwächen den ganzen
       Cluster — die deutsche Optimierung eingeschlossen.

       ACHTUNG: Der Brief deckt ausdrücklich nur die deutsche Homepage ab
       (§ Umfang). Diese drei Strings sind nach seinem Muster gebildet, aber
       nicht von SEO/Brand freigegeben — Abnahme nachholen. */
    titleAbsolute: "Vini boutique italiani in Germania | Maria Maria",
    description:
      "Vini boutique selezionati personalmente da Puglia, Campania e area del Garda – per piacere, ristorazione, rivendita e occasioni speciali.",
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
    titleAbsolute: "Regioni vinicole: Puglia, Campania e Lugana | Maria Maria",
    description:
      "Scopri vini selezionati dalla Puglia, dalla Campania e dalla zona del Lugana sul Lago di Garda – vitigni, origine, gusto e consigli di abbinamento.",
  },

  kontakt: {
    titleAbsolute: "Contatti: vini italiani per la ristorazione | Maria Maria",
    description:
      "Vini boutique italiani per ristorazione, gastronomia, distribuzione, eventi e degustazioni a Düsseldorf e in NRW. Consulenza personale e selezione su misura.",
  },

  agb: {
    title: "Condizioni di vendita",
    description: "Condizioni generali di vendita per gli ordini nello shop online Maria Maria.",
  },

  datenschutz: {
    title: "Informativa sulla privacy",
    description:
      "Informazioni sul trattamento dei dati personali su maria-maria.de ai sensi del GDPR.",
  },

  impressum: {
    title: "Note legali",
    description: "Note legali e dati societari di Maria Maria Wines GmbH, Mettmann.",
  },

  /* Le nove pagine prodotto — modelli, non frasi finite: nome, annata,
     tipologia, regione, note e abbinamento arrivano dal catalogo tradotto
     tramite lib/seo/wine.js. Il nome del marchio non va qui: lo aggiunge il
     title.template del layout. */
  wine: {
    title: "{name} {year} · {type} · {region}",
    description: "{name} ({year}) — {type}, {region}. {notes}. {pairing}",
    /* La frase sul prezzo è STACCABILE: lib/seo/wine.js la aggiunge solo se
       la description resta nel budget. È la prima a cadere perché il prezzo è
       comunque nel markup Offer — a differenza di note e abbinamento, che non
       esistono altrove. */
    descriptionPrice: "A {price} da Maria Maria.",
    ogImageAlt: "Bottiglia {name} di Maria Maria — {type}, {region}",
  },

  notFound: {
    title: "Pagina non trovata",
  },
};

export default meta;
