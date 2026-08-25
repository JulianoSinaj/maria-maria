/* Vedi content/de/home.js — stessa struttura in tutte e quattro le lingue. */

export const home = {
  hero: {
    eyebrow: "Vini boutique italiani",
    lede: "Vini selezionati a mano da piccole cantine familiari – per momenti di piacere scelti con cura, dall'aperitivo alla grande serata.",
    ctaWines: "Scopri i vini",
    ctaShop: "Vai allo shop",
    statWines: "Vini boutique",
    statRegions: "Regioni d'Italia",
    statSince: "dalla fondazione",
    photoAlt:
      "Bottiglia Maria Maria e un calice di vino rosso su un muretto di pietra tra vigne e mare, dietro una donna in abito bianco che guarda la costa",
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
      "Maria Maria nasce nel Salento, nell'estate del 2019 — tra ricordi d'infanzia e vecchi filari, un momento è diventato un'illuminazione: per noi il vino non è una bevanda, ma un catalizzatore di emozioni.",
      "Da allora il nostro viaggio va dai filari assolati del Salento ai suoli vulcanici della Campania, fino alla sponda meridionale del Lago di Garda — ogni bottiglia una tappa, ogni regione una lingua diversa.",
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
    title: "Dove i nostri vini sono di casa",
    description:
      "Suolo, luce e clima plasmano ogni uva – alla fine nel calice si assapora il paesaggio.",
    cta: "Tutte le regioni",
    detailCta: "Scopri di più",
    items: {
      apulien: {
        name: "Puglia",
        tag: "Il cuore del Sud",
        desc: "Il sole del Sud e aromi pieni di forza.",
        long: "Tra Salento e Gallipoli, Primitivo e Negroamaro maturano sotto il sole del Sud – vini caldi e potenti, con un'anima mediterranea.",
      },
      kampanien: {
        name: "Campania",
        tag: "Tra vulcano e mare",
        desc: "Suoli vulcanici, caratteri originari.",
        long: "Intorno a Napoli e Salerno i suoli vulcanici del Vesuvio danno vini di profondità e autenticità – dalla Falanghina all'Aglianico.",
      },
      garda: {
        name: "Lago di Garda / Lombardia",
        tag: "L'eleganza del Nord",
        desc: "Eleganza, freschezza e profondità minerale.",
        long: "Sulla sponda meridionale del Lago di Garda nasce il Lugana – un bianco di rara eleganza, sostenuto da freschezza e profondità minerale.",
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
