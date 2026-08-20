/* Pagina Contatti — struttura identica a content/de/kontakt.js (fonte: Kontakt-
   Handoff del 18.08.2026). Le chiavi degli intenti (gastronomie_feinkost,
   handel_wiederverkauf, event_feier, verkostung, individuelle_auswahl,
   sonstiges) sono stabili in tutte le lingue: vanno a backend, analytics e
   lead routing. Cambiano solo le etichette. */

export const kontakt = {
  hero: {
    eyebrow: "Contatti · Consulenza vino per Düsseldorf & NRW",
    title: "Il vino per il tuo momento.",
    titleAccent: "Scelto personalmente.",
    text: "Per ristorazione, commercio, eventi e occasioni speciali. Conosci Maria Maria e trova insieme a noi i vini adatti al tuo concept, ai tuoi ospiti o alla tua occasione.",
    primaryCta: "Richiedi consulenza",
    secondaryCta: "Prenota degustazione",
    trust: "Risposta personale entro 1–2 giorni lavorativi.",
    imageAlt: "Maria Maria Il Rosso e Il Bianco in bottiglie da 375 ml su una tavola apparecchiata.",
  },

  details: {
    email: "E-mail",
    phone: "Telefono",
    location: "Sede",
    locationValue: "Mettmann, Germania",
  },

  intents: {
    title: "Perché vuoi contattarci?",
    intro: "Scegli l'occasione che meglio corrisponde al tuo progetto.",
    items: {
      gastronomie_feinkost: {
        title: "Ristorazione & gastronomia",
        text: "Vuoi proporre Maria Maria nel tuo ristorante, café, wine bar o negozio di gastronomia? Insieme troviamo una selezione adatta al tuo concept, alla tua cucina e ai tuoi ospiti.",
        cta: "Richiesta ristorazione",
      },
      handel_wiederverkauf: {
        title: "Commercio & rivendita",
        text: "Vuoi inserire Maria Maria nel tuo assortimento? Parliamo insieme di selezione, quantità e delle possibilità di una collaborazione personale.",
        cta: "Richiedi una partnership",
      },
      event_feier: {
        title: "Eventi & occasioni speciali",
        text: "Da eventi aziendali e convention a matrimoni, compleanni e feste private: ti consigliamo i vini adatti a occasione, menu e numero di ospiti.",
        cta: "Vini per il tuo evento",
      },
      verkostung: {
        title: "Degustazione & selezione personalizzata",
        text: "Conosci Maria Maria nel bicchiere. In una degustazione personale scopri i tuoi preferiti; poi componiamo insieme la tua selezione di vini su misura.",
        cta: "Prenota una degustazione",
      },
    },
  },

  process: {
    title: "Trovare il tuo vino è semplice",
    steps: [
      {
        title: "Ci racconti il tuo progetto",
        text: "Ristorante, assortimento, evento, degustazione o occasione speciale: più conosciamo il tuo progetto, più mirata sarà la nostra consulenza.",
      },
      {
        title: "Ti consigliamo personalmente",
        text: "Parliamo dei tuoi desideri e, se vuoi, organizziamo una degustazione a Düsseldorf e dintorni, così puoi conoscere i vini di persona.",
      },
      {
        title: "Scegliamo insieme",
        text: "Dai tuoi preferiti nasce una selezione adatta al tuo concept, ai tuoi ospiti, al tuo menu o alla tua occasione.",
      },
    ],
    closing: "Dalla prima richiesta alla selezione giusta ti accompagniamo personalmente.",
  },

  bridge: {
    title: "Il vino accompagna i momenti che si ricordano.",
    text: "A cena a casa, al tavolo del ristorante, a un evento aziendale o a una festa speciale: Maria Maria unisce persone, piacere e vini italiani di carattere.",
    tagline: "La tua selezione. La tua occasione. I nostri vini.",
    imageAlt: "Vino Maria Maria su una tavola apparecchiata per cene e occasioni speciali.",
  },

  form: {
    title: "Raccontaci il tuo progetto.",
    intro: "Più sappiamo della tua occasione, meglio possiamo consigliarti. Scegli prima il tema – poi mostriamo solo i campi davvero rilevanti per la tua richiesta.",
    hints: {
      event: { label: "Per un evento:", text: "data, numero di ospiti, tipo di evento" },
      trade: { label: "Per ristorazione/commercio:", text: "tipo di attività, selezione desiderata" },
    },
    trust: "Personale. Sincero. Con passione per il vino.",
    optional: "facoltativo",

    intent: { label: "Di cosa si tratta?", placeholder: "Seleziona" },
    intents: {
      gastronomie_feinkost: "Ristorazione & gastronomia",
      handel_wiederverkauf: "Commercio & rivendita",
      event_feier: "Evento / festa",
      verkostung: "Degustazione",
      individuelle_auswahl: "Selezione personalizzata",
      sonstiges: "Altro",
    },
    name: { label: "Nome", placeholder: "Il tuo nome" },
    email: { label: "E-mail", placeholder: "tua@email.it" },
    companyLocation: {
      label: "Azienda / location",
      placeholder: "es. ristorante, hotel, rivendita, location per eventi",
    },
    postalCity: { label: "Città / CAP", placeholder: "es. Düsseldorf, 40210" },
    phone: { label: "Telefono", placeholder: "Facoltativo" },
    message: { label: "Messaggio", placeholder: "Descrivi brevemente il tuo progetto…" },

    details: {
      event_feier: {
        eventDate: { label: "Data / data desiderata" },
        eventType: { label: "Tipo di evento", placeholder: "es. festa aziendale, matrimonio, compleanno" },
        guests: { label: "Numero approssimativo di ospiti", placeholder: "es. 40" },
        location: { label: "Location / luogo", placeholder: "es. Düsseldorf, location per eventi" },
      },
      gastronomie_feinkost: {
        businessType: {
          label: "Tipo di attività",
          placeholder: "Seleziona",
          options: {
            restaurant: "Ristorante",
            cafe: "Café",
            weinbar: "Wine bar",
            feinkost: "Gastronomia",
            sonstiges: "Altro",
          },
        },
        interest: {
          label: "Interesse / selezione desiderata",
          placeholder: "es. carta dei vini, vini al calice, selezione stagionale",
        },
      },
      handel_wiederverkauf: {
        businessType: {
          label: "Tipo di attività",
          placeholder: "Seleziona",
          options: {
            weinhandel: "Enoteca",
            feinkost: "Gastronomia",
            fachhandel: "Negozio specializzato",
            sonstiges: "Altro",
          },
        },
        interest: {
          label: "Interesse / selezione desiderata",
          placeholder: "es. assortimento, singoli vini, pacchetti degustazione",
        },
      },
      verkostung: {
        date: { label: "Data desiderata" },
        persons: { label: "Numero di persone", placeholder: "es. 8" },
        occasion: {
          label: "Occasione",
          placeholder: "Seleziona",
          options: {
            privat: "privata",
            unternehmen: "azienda/team",
            gastronomie_handel: "ristorazione/commercio",
            sonstiger: "altra occasione",
          },
        },
      },
      individuelle_auswahl: {
        context: { label: "Occasione / contesto", placeholder: "es. cena con ospiti, regalo, carta dei vini" },
        guests: { label: "Numero di ospiti", placeholder: "es. 12" },
        style: { label: "Stile preferito", placeholder: "es. fresco e leggero, strutturato, rosé" },
      },
    },

    /* Das Markup setzt zwischen privacyPre und Link ein Leerzeichen — der
       Apostroph gehört deshalb zum Linktext („Ho letto l'informativa …"). */
    privacyPre: "Ho letto",
    privacyLink: "l'informativa sulla privacy",
    privacyPost: "e acconsento al trattamento dei miei dati per la gestione della mia richiesta.",
    submit: "Invia richiesta",
    sending: "Invio in corso…",
    errors: {
      intent: "Scegli di cosa si tratta.",
      name: "Inserisci il tuo nome.",
      email: "Inserisci il tuo indirizzo e-mail.",
      emailInvalid: "Inserisci un indirizzo e-mail valido.",
      message: "Descrivi brevemente il tuo progetto.",
      privacy: "Accetta l'informativa sulla privacy.",
      send: "Non è stato possibile inviare la richiesta. Riprova o scrivici direttamente via e-mail.",
    },
    success: {
      title: "Grazie per la tua richiesta.",
      text: "Ti rispondiamo personalmente entro 1–2 giorni lavorativi.",
      again: "Invia una nuova richiesta",
    },
  },

  faq: {
    title: "Domande frequenti",
    showAll: "Vedi tutte le domande",
    showLess: "Mostra meno domande",
    imageAlt:
      "Tre vini Maria Maria – Falanghina, Primitivo di Manduria e Greco di Tufo – con calici e taccuino su un tavolo: consulenza vino per ristorazione e commercio.",
  },
};

export default kontakt;
