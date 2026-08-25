/* Pagina Contatti — struttura identica a content/de/kontakt.js.

   Il sito di riferimento è tedesco: l'handoff fissa lì il copy definitivo,
   qui sta la sua traduzione. Se in tedesco nasce una chiave nuova, deve
   nascere anche qui — lib/i18n/dictionaries non ha fallback silenzioso sul
   tedesco, e una chiave mancante lascia un buco visibile invece di un testo
   sbagliato invisibile.

   I valori tecnici degli intent (gastronomie_feinkost, event_feier …) NON si
   traducono: stanno in components/kontakt/intents.js e restano identici in
   tutte e quattro le lingue, perché backend, routing dei lead e analytics
   dipendono da loro. */

export const kontakt = {
  hero: {
    eyebrow: "Contatti · Consulenza vini per Düsseldorf & NRW",
    title: "Il vino per il tuo momento.",
    titleSecond: "Scelto personalmente.",
    text: "Per ristorazione, distribuzione, eventi e occasioni speciali. Conosci Maria Maria e trova insieme a noi i vini giusti per il tuo concept, i tuoi ospiti o la tua occasione.",
    ctaPrimary: "Richiedi una consulenza",
    ctaSecondary: "Prenota una degustazione",
    promise: "Risposta personale entro 1–2 giorni lavorativi.",
    imageAlt:
      "Maria Maria Il Rosso e Il Bianco in bottiglie da 375 ml su una tavola apparecchiata.",
  },

  details: {
    emailLabel: "E-mail",
    email: "info@maria-maria.de",
    locationLabel: "Sede",
    location: "Mettmann, Germania",
  },

  intents: {
    title: "Perché vuoi contattarci?",
    intro: "Scegli l'occasione che corrisponde meglio al tuo progetto.",
    carouselPrev: "Occasione precedente",
    carouselNext: "Occasione successiva",
    items: {
      gastronomie: {
        title: "Ristorazione & gastronomia",
        text: "Vuoi proporre Maria Maria nel tuo ristorante, caffè, wine bar o negozio gourmet? Insieme troviamo una selezione adatta al tuo concept, alla tua cucina e ai tuoi ospiti.",
        cta: "Richiesta ristorazione",
      },
      handel: {
        title: "Distribuzione & rivendita",
        text: "Vuoi inserire Maria Maria nel tuo assortimento? Parliamone insieme: selezione dei vini, quantità e modalità di una collaborazione personale.",
        cta: "Richiesta partnership",
      },
      event: {
        title: "Eventi & occasioni speciali",
        text: "Da eventi aziendali e convention fino a matrimoni, compleanni e feste private: ti consigliamo nella scelta dei vini adatti all'occasione, al menù e al numero di ospiti.",
        cta: "Richiesta vini per eventi",
      },
      verkostung: {
        title: "Degustazione & selezione su misura",
        text: "Conosci Maria Maria nel bicchiere. Durante una degustazione personale scopri i tuoi preferiti; poi componiamo insieme la tua selezione su misura.",
        cta: "Prenota una degustazione",
      },
    },
  },

  process: {
    title: "Ecco come troviamo il tuo vino",
    steps: [
      {
        title: "Ci racconti il tuo progetto",
        text: "Ristorante, assortimento, evento, degustazione o occasione speciale: più conosciamo il tuo progetto, più mirata sarà la consulenza.",
      },
      {
        title: "Ti consigliamo di persona",
        text: "Parliamo dei tuoi desideri e, se lo desideri, organizziamo una degustazione a Düsseldorf e dintorni, per farti conoscere i vini di persona.",
      },
      {
        title: "Scegliamo insieme",
        text: "Dai tuoi preferiti nasce una selezione adatta al tuo concept, ai tuoi ospiti, al tuo menù o alla tua occasione.",
      },
    ],
    closing:
      "Dalla prima richiesta fino alla selezione giusta ti accompagniamo personalmente.",
  },

  bridge: {
    title: "Il vino accompagna i momenti che si ricordano.",
    text: "A cena a casa, al tavolo del ristorante, a un evento aziendale o a una festa speciale: Maria Maria unisce persone, piacere e vini italiani di carattere.",
    claim: "La tua selezione. La tua occasione. I nostri vini.",
    imageAlt:
      "Vino Maria Maria su una tavola apparecchiata per cene e occasioni speciali.",
  },

  form: {
    title: "Raccontaci il tuo progetto.",
    intro:
      "Più conosciamo la tua occasione, meglio possiamo consigliarti. Scegli prima il tema: dopo mostriamo solo i campi davvero rilevanti per la tua richiesta.",
    hints: [
      { title: "Per eventi", text: "data, numero di ospiti, tipo di evento" },
      { title: "Per ristorazione/distribuzione", text: "tipo di attività, selezione desiderata" },
    ],
    trust: "Di persona. Con sincerità. Con passione per il vino.",

    intent: {
      label: "Di cosa si tratta?",
      placeholder: "Selezionare",
      options: {
        gastronomie_feinkost: "Ristorazione & gastronomia",
        handel_wiederverkauf: "Distribuzione & rivendita",
        event_feier: "Evento / festa",
        verkostung: "Degustazione",
        individuelle_auswahl: "Selezione di vini su misura",
        sonstiges: "Altro",
      },
    },
    name: { label: "Nome", placeholder: "Il tuo nome" },
    email: { label: "E-mail", placeholder: "tua@email.it" },
    company: { label: "Azienda / location", placeholder: "es. ristorante, hotel, distribuzione" },
    city: { label: "Città / CAP", placeholder: "es. Düsseldorf, 40210" },
    phone: { label: "Telefono (facoltativo)", placeholder: "es. 0176 12345678" },
    message: { label: "Messaggio", placeholder: "Descrivi brevemente il tuo progetto…" },

    conditional: {
      eventDate: { label: "Data / data desiderata" },
      eventType: {
        label: "Tipo di evento",
        placeholder: "es. festa aziendale, matrimonio, compleanno",
      },
      guests: { label: "Numero di ospiti indicativo", placeholder: "es. 40" },
      location: { label: "Location / luogo", placeholder: "es. Düsseldorf" },
      tastingDate: { label: "Data desiderata" },
      persons: { label: "Numero di persone", placeholder: "es. 8" },
      occasion: {
        label: "Occasione",
        placeholder: "Selezionare",
        options: {
          privat: "Privata",
          unternehmen: "Azienda / team",
          gastro: "Ristorazione / distribuzione",
          sonstiger: "Altra occasione",
        },
      },
      businessTypeGastro: {
        label: "Tipo di attività",
        placeholder: "Selezionare",
        options: {
          restaurant: "Ristorante",
          cafe: "Caffè",
          weinbar: "Wine bar",
          feinkost: "Gastronomia",
          sonstiges: "Altro",
        },
      },
      businessTypeHandel: {
        label: "Tipo di attività",
        placeholder: "Selezionare",
        options: {
          weinhandel: "Enoteca",
          feinkost: "Gastronomia",
          fachhandel: "Negozio specializzato",
          sonstiges: "Altro",
        },
      },
      selection: {
        label: "Interesse / selezione desiderata",
        placeholder: "es. rossi pugliesi, confezione degustazione",
      },
      context: { label: "Occasione / contesto", placeholder: "es. abbinamento al menù, regalo" },
      guestsOptional: { label: "Numero di ospiti (facoltativo)", placeholder: "es. 12" },
      style: {
        label: "Stile preferito (facoltativo)",
        placeholder: "es. rossi strutturati, bianchi freschi",
      },
    },

    privacyPre: "Ho letto",
    privacyLink: "l'informativa sulla privacy",
    privacyPost: "e acconsento al trattamento dei miei dati per la gestione della mia richiesta.",
    required: "campo obbligatorio",
    submit: "Invia richiesta",
    sending: "Invio in corso…",

    errors: {
      intent: "Indica di cosa si tratta.",
      name: "Indica il tuo nome.",
      email: "Indica il tuo indirizzo e-mail.",
      emailInvalid: "Indica un indirizzo e-mail valido.",
      message: "Descrivi brevemente il tuo progetto.",
      privacy: "Accetta l'informativa sulla privacy.",
      send: "Non è stato possibile inviare la richiesta. Riprova.",
    },

    success: {
      title: "Grazie per la tua richiesta.",
      text: "Ti ricontattiamo personalmente entro 1–2 giorni lavorativi.",
      again: "Nuova richiesta",
    },
  },

  faq: {
    title: "Domande frequenti",
    more: "Vedi tutte le domande",
    less: "Mostra meno domande",
    imageAlt:
      "Maria Maria Il Rosso e Il Bianco in bottiglie da 375 ml con dettagli di servizio.",
    items: [
      {
        id: "kontakt-verkostung-buchen",
        q: "Come prenoto una degustazione a Düsseldorf?",
        a: "Scegli «Degustazione» nel modulo di contatto e indicaci la data desiderata, il numero indicativo di persone e l'occasione. Concordiamo luogo e formato personalmente con te e ti rispondiamo entro 1–2 giorni lavorativi con una proposta.",
      },
      {
        id: "kontakt-sortiment",
        q: "Posso inserire Maria Maria nel mio assortimento?",
        a: "Sì. Scegli «Distribuzione & rivendita» e raccontaci brevemente della tua attività, della tua sede e della selezione desiderata. Poi discutiamo personalmente i passi successivi.",
        link: { label: "Vedi l'assortimento completo", href: "/unsere-weine" },
      },
      {
        id: "kontakt-firmenveranstaltungen",
        q: "Offrite vini per eventi aziendali?",
        a: "Sì. Per eventi aziendali, convention e occasioni speciali ti consigliamo nella scelta dei vini. Indicaci data, numero di ospiti, luogo e carattere dell'evento, così possiamo valutare la tua richiesta in modo mirato.",
      },
      {
        id: "kontakt-gastronomie",
        q: "Posso proporre i vini Maria Maria nel mio ristorante o negozio gourmet?",
        a: "Sì. Scegli «Ristorazione & gastronomia» e raccontaci brevemente della tua attività, della tua cucina o del tuo concept e della tua sede. Insieme troviamo una selezione adatta ai tuoi ospiti.",
        link: { label: "Scopri origini e abbinamenti", href: "/regionen" },
      },
      {
        id: "kontakt-individuelle-auswahl",
        q: "Come funziona una selezione di vini su misura?",
        a: "Prima ci racconti il tuo progetto. Se lo desideri, conosci i vini durante una degustazione. Dai tuoi preferiti nasce poi una selezione adatta al tuo concept, al tuo menù o alla tua occasione.",
        link: { label: "Tutti i vini in sintesi", href: "/unsere-weine" },
      },
      {
        id: "kontakt-kaufen",
        q: "Dove posso acquistare i vini Maria Maria?",
        a: "I vini si possono ordinare nello shop ufficiale Maria Maria. Nella pagina Contatti lo shop resta una via secondaria, così le richieste di consulenza, eventi e B2B non vengono distolte dal percorso di contatto.",
        link: { label: "Vai allo shop", href: "/shop" },
      },
    ],
  },
};

export default kontakt;
