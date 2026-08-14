/* Pagina contatti e modulo di contatto. Stessa struttura di
   content/de/kontakt.js. `topics` sono etichette per le chiavi fisse
   tasting / merchant / press / general — i campi data e ospiti si aprono in
   base alla chiave, mai all'etichetta. */

export const kontakt = {
  hero: {
    eyebrow: "Siamo qui per te",
    title: "Contatti",
    titleItalic: "Parliamo di vino.",
    text: "Saremo felici di leggerti! Che si tratti di una degustazione a Düsseldorf, di domande sui nostri vini, di collaborazioni o di richieste da rivenditori – siamo a tua disposizione.",
    promiseLabel: "La nostra promessa:",
    promise:
      "Rispondiamo alla tua richiesta entro 1–2 giorni lavorativi. Con attenzione, sincerità e passione per il vino.",
  },

  details: {
    email: "E-mail",
    phone: "Telefono",
    address: "Indirizzo",
    addressValue: "Senso Valerio Weinhandel · Mettmann, Germania",
  },

  help: {
    eyebrow: "La tua richiesta",
    title: "Come possiamo aiutarti?",
    description:
      "Quattro strade dirette verso di noi – scegli semplicemente il tema che corrisponde alla tua richiesta.",
    cta: "Invia richiesta",
    items: {
      tasting: {
        title: "Degustazioni",
        text: "Vuoi degustare i nostri vini? Qui scopri come fare.",
      },
      merchant: {
        title: "Richieste da rivenditori",
        text: "Sei un rivenditore o vuoi inserire i nostri vini nel tuo assortimento?",
      },
      press: {
        title: "Stampa e collaborazioni",
        text: "Siamo aperti a richieste della stampa, collaborazioni e progetti comuni.",
      },
      general: {
        title: "Domande generali",
        text: "Hai una domanda generale su Maria Maria? Ti aiutiamo volentieri.",
      },
    },
  },

  faq: {
    eyebrow: "Buono a sapersi",
    title: "Domande",
    titleAccent: "frequenti.",
    description:
      "Le risposte alle domande che ci arrivano più spesso — ordinate per tema: dalle degustazioni a Düsseldorf alle richieste dei rivenditori, fino allo shop e alle spedizioni.",
    footer: "Non trovi la tua domanda? Scrivici",
  },

  form: {
    title: "Scrivici",
    name: { label: "Nome", placeholder: "Il tuo nome" },
    email: { label: "E-mail", placeholder: "nome@esempio.it" },
    subject: { label: "Oggetto", placeholder: "Di cosa si tratta?" },
    topic: { label: "Tipo di richiesta", placeholder: "Scegli il tipo di richiesta" },
    topics: {
      tasting: "Richiesta di degustazione",
      merchant: "Richiesta rivenditore",
      press: "Stampa e collaborazioni",
      general: "Domanda generale",
    },
    date: { label: "Data desiderata" },
    guests: {
      label: "Numero di ospiti",
      placeholder: "Scegli gli ospiti",
      unit: "persone",
      options: ["2–4", "5–8", "9–12", "13–20", "Più di 20"],
      note: "Le nostre degustazioni si svolgono a Düsseldorf e dintorni — private o per il vostro team, da voi o nella nostra sala di degustazione.",
    },
    message: { label: "Messaggio", placeholder: "Il tuo messaggio per noi …" },
    /* L'articolo eliso sta DENTRO il testo del link: il markup inserisce uno
       spazio fra le tre parti, e „l' informativa" sarebbe un errore di
       composizione. Con „l'informativa" nel link la frase resta corretta. */
    privacyPre: "Ho letto",
    privacyLink: "l'informativa sulla privacy",
    privacyPost: "e acconsento al trattamento dei miei dati.",
    submit: "Invia messaggio",
    sending: "Invio in corso…",
    errors: {
      name: "Inserisci il tuo nome.",
      email: "Inserisci il tuo indirizzo e-mail.",
      emailInvalid: "Inserisci un indirizzo e-mail valido.",
      subject: "Inserisci un oggetto.",
      topic: "Scegli il tipo di richiesta.",
      date: "Scegli una data desiderata.",
      guests: "Indica il numero di ospiti.",
      message: "Scrivici un breve messaggio.",
      privacy: "Accetta l'informativa sulla privacy.",
      send: "Non è stato possibile inviare il messaggio. Riprova.",
    },
    success: {
      title: "Grazie per il tuo messaggio!",
      text: "Abbiamo ricevuto la tua richiesta e ti risponderemo personalmente entro 1–2 giorni lavorativi.",
      again: "Nuovo messaggio",
    },
  },
};

export default kontakt;
