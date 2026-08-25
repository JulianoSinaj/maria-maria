/* Vedi content/de/home.js — stessa struttura in tutte e quattro le lingue. */

export const home = {
  hero: {
    /* Stessa struttura di content/de/home.js (brief Homepage, 24.08.2026):
       una sola H1 — marchio più keyword principale — con il claim italiano
       come <p lang="it"> a parte; la seconda CTA porta alla consulenza
       personale (/kontakt), la vecchia riga di numeri non c'è più. */
    eyebrow: "SELEZIONE PERSONALE · DAL 2019",
    title: "Maria Maria – vini boutique italiani",
    claim: "Il piacere del vino.",
    lede: "Vini selezionati a mano da piccole cantine familiari italiane – scelti personalmente per momenti di piacere consapevole in Germania, dall'aperitivo alla grande serata.",
    ctaWines: "Scopri i nostri vini",
    ctaContact: "Richiedi una consulenza personale",
    photoAlt: "Bottiglia Maria Maria e calice di vino rosso davanti alle vigne con vista sulla costa mediterranea",
  },

  philosophy: {
    eyebrow: "La nostra filosofia",
    title: "Vini boutique italiani, facili da scegliere, da raccontare e da vivere.",
    description:
      "Curati personalmente, chiari nella loro origine e selezionati per ristorazione, hospitality, eventi e momenti di piacere speciali.",
    moments: {
      selection: {
        title: "Selezione personale",
        text: "Ogni vino viene degustato di persona e scelto con criterio. Nasce così un assortimento boutique essenziale, che chi ospita può consigliare con sicurezza e chi ama il vino può scoprire con facilità.",
      },
      origin: {
        title: "Un'origine con una firma",
        text: "Lavoriamo con cantine familiari selezionate in Italia. Regione, vitigno e le persone dietro al vino danno a ogni bottiglia una storia credibile e degna di essere raccontata.",
      },
      occasion: {
        title: "Fatti per i momenti di piacere",
        text: "Dall'aperitivo e dagli abbinamenti fino agli eventi e ai regali di gusto: Maria Maria unisce sapore, estetica e arte di vivere italiana in momenti che restano.",
      },
      guidance: {
        title: "Un accompagnamento personale",
        text: "Un assortimento chiaro, consigli comprensibili e il dialogo diretto rendono più semplice scegliere e proporre – per una collaborazione personale e alla pari.",
      },
    },
    note: "Per ristorazione, hospitality e progetti speciali",
    cta: "Scopri Maria Maria come partner",
  },

  collection: {
    eyebrow: "La collezione",
    title: "I nostri vini",
    /* Tre origini, mai „quattro regioni": Puglia e Campania sono regioni
       amministrative, il Garda è un'area vinicola. Regola del brief
       vincolante in ogni lingua, non solo in tedesco. */
    description: "Nove vini da tre origini selezionate – ognuno con la propria storia.",
  },

  origins: {
    title: "Due anime,",
    titleAccent: "un solo nome",
    paragraphs: [
      "Maria Maria nasce nel Salento, nell'estate del 2019. A un tavolo tra amici, con due donne di nome Maria e un enologo, prende forma l'idea di una selezione personale di vini italiani.",
    ],
    journey: ["Salento", "Puglia", "Campania", "Lago di Garda"],
    quote: "«Italian wine, personal selection, share the pleasure.»",
    /* Il pulsante porta a /geschichte (la storia del marchio), non al
       magazine: l'etichetta nominava la destinazione sbagliata, e /magazin
       esiste davvero — chi cliccava si aspettava quello. */
    cta: "Scopri la nostra storia",
  },

  regions: {
    eyebrow: "Origine",
    title: "Tre origini italiane, tre firme inconfondibili",
    description:
      "I nostri nove vini portano dalla Puglia alla Campania fino all'area meridionale del Lago di Garda. Ogni origine ha i suoi vitigni, i suoi paesaggi e le sue persone – selezionati personalmente per Maria Maria.",
    cta: "Tutte le regioni",
    detailCta: "Scopri di più",
    items: {
      apulien: {
        name: "Puglia",
        tag: "Il cuore del Sud",
        long: "Vini baciati dal sole, con calore, frutto e carattere mediterraneo – tra cui la nostra selezione di Primitivo e Rosato.",
        cta: "Scopri la Puglia",
        alt: "Trulli e ulivi in Puglia",
      },
      kampanien: {
        name: "Campania",
        tag: "Tra vulcano e mare",
        long: "Vini minerali e di carattere dal Sud Italia – segnati da vitigni come Greco, Falanghina e Aglianico.",
        cta: "Scopri la Campania",
        alt: "Vigneti sulla costa campana con il Vesuvio",
      },
      garda: {
        name: "Area del Lago di Garda (Lombardia)",
        tag: "L'eleganza del Nord",
        long: "Vini eleganti e freschi dall'area meridionale del Lago di Garda – con il Lugana DOC come chiaro riferimento d'origine.",
        cta: "Scopri i vini del Lago di Garda",
        alt: "Vigneti sul Lago di Garda in Lombardia",
      },
    },
  },

  /* I tre segmenti di conversione — le CTA portano a /kontakt?anliegen=…
     e preselezionano la richiesta nel modulo (components/kontakt/intents.js). */
  segments: {
    title: "Selezionati personalmente – per il vostro piacere, il vostro assortimento e la vostra occasione",
    intro:
      "Per il vostro ristorante, il vostro assortimento o un evento speciale: consigliamo personalmente e componiamo una selezione adatta a concept, ospiti e occasione.",
    proof: "Consulenza personale da Mettmann, vicino a Düsseldorf – nel Nord Reno-Vestfalia e oltre.",
    items: {
      gastronomie: {
        title: "Ristorazione & gastronomia",
        text: "Vini italiani selezionati personalmente per ristoranti, caffè, enoteche e gastronomie – in linea con cucina, stile e ospiti.",
        cta: "Richiedi un assortimento per la ristorazione",
      },
      handel: {
        title: "Commercio & rivendita",
        text: "Vini di carattere con origine tracciabile e consulenza personale per partner commerciali e rivenditori selezionati.",
        cta: "Parliamo di una partnership commerciale",
      },
      events: {
        title: "Eventi & degustazioni",
        text: "Selezioni di vini su misura per feste private, eventi aziendali e degustazioni guidate a Düsseldorf, nel Nord Reno-Vestfalia e oltre.",
        cta: "Richiedi un evento o una degustazione",
      },
    },
  },

  shopBand: {
    eyebrow: "Lo shop ufficiale",
    title: "Pronto per il gusto che",
    titleAccent: "ti ispira?",
    /* Terra Vera è lo shop ufficiale esterno: nessuna promessa di
       spedizione diretta dalla cantina — non è il canale che gestiamo. */
    text: "Scopri e ordina i vini Maria Maria comodamente tramite il nostro shop online ufficiale su Terra Vera.",
    primary: "Vai allo shop ufficiale",
    secondary: "Contattaci",
  },

  faq: {
    eyebrow: "Domande frequenti",
    title: "Maria Maria,",
    titleAccent: "in breve.",
    description:
      "Tutto quello che vuoi sapere sui nostri vini, sull'acquisto e su una possibile collaborazione con Maria Maria.",
    footerNote: "Altre domande o interesse per una collaborazione?",
    footerLabel: "Contattaci di persona",
  },
};

export default home;
