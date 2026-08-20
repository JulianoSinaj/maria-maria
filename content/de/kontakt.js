/* Kontaktseite — Copy aus dem Kontakt-Handoff vom 18.08.2026 (Version 2.0).

   Die deutschen Texte sind die freigegebene Fassung und werden ohne neue
   Freigabe nicht umformuliert. Struktur (Reihenfolge der Sektionen, Icons,
   Intent-Schlüssel, Bildpfade) liegt im Code; hier steht nur, was ein
   Besucher liest.

   Ein Formular in der falschen Sprache ist teurer als jede andere
   unübersetzte Seite: Wer nicht versteht, welches Feld was will, schickt
   nichts ab. Deshalb liegen hier auch Fehlermeldungen, Auswahlwerte und die
   Einwilligung zur Datenschutzerklärung.

   Die Anliegen (`intents`) sind Anzeigetexte zu STABILEN Schlüsseln —
   gastronomie_feinkost, handel_wiederverkauf, event_feier, verkostung,
   individuelle_auswahl, sonstiges. Die Schlüssel gehen an Backend, Analytics
   und Lead-Routing; die Beschriftungen dürfen sich ändern, die Schlüssel
   nicht (Handoff, Abschnitt 14). */

export const kontakt = {
  /* ---- Sektion 01 — Hero ---- */
  hero: {
    eyebrow: "Kontakt · Weinberatung für Düsseldorf & NRW",
    title: "Wein für Ihren Moment.",
    /* zweite Zeile der H1 — im Markup kursiv gesetzt */
    titleAccent: "Persönlich ausgewählt.",
    text: "Für Gastronomie, Handel, Events und besondere Anlässe. Lernen Sie Maria Maria kennen und finden Sie gemeinsam mit uns die Weine, die zu Ihrem Konzept, Ihren Gästen oder Ihrem Anlass passen.",
    primaryCta: "Beratung anfragen",
    secondaryCta: "Verkostung vereinbaren",
    trust: "Persönliche Rückmeldung innerhalb von 1–2 Werktagen.",
    imageAlt: "Maria Maria Il Rosso und Il Bianco in 375-ml-Flaschen auf einem gedeckten Tisch.",
  },

  /* Beschriftungen der Kontaktzeile — E-Mail-Adresse und Telefonnummer selbst
     kommen aus lib/site.js (eine Quelle für Hero, Footer und JSON-LD). */
  details: {
    email: "E-Mail",
    phone: "Telefon",
    location: "Standort",
    locationValue: "Mettmann, Deutschland",
  },

  /* ---- Sektion 02 — Warum möchten Sie uns kontaktieren? ---- */
  intents: {
    title: "Warum möchten Sie uns kontaktieren?",
    intro: "Wählen Sie den Anlass, der am besten zu Ihrem Vorhaben passt.",
    items: {
      gastronomie_feinkost: {
        title: "Gastronomie & Feinkost",
        text: "Sie möchten Maria Maria in Ihrem Restaurant, Café, Ihrer Weinbar oder Ihrem Feinkostgeschäft anbieten? Gemeinsam finden wir eine Auswahl, die zu Ihrem Konzept, Ihrer Küche und Ihren Gästen passt.",
        cta: "Gastronomie anfragen",
      },
      handel_wiederverkauf: {
        title: "Handel & Wiederverkauf",
        text: "Sie möchten Maria Maria in Ihr Sortiment aufnehmen? Sprechen Sie mit uns über Weinauswahl, Mengen und die Möglichkeiten einer persönlichen Zusammenarbeit.",
        cta: "Partnerschaft anfragen",
      },
      event_feier: {
        title: "Events & besondere Anlässe",
        text: "Von Firmenveranstaltungen und Conventions bis zu Hochzeiten, Geburtstagen und privaten Feiern: Wir beraten Sie bei der Auswahl der Weine, die zu Anlass, Menü und Gästezahl passen.",
        cta: "Event-Weine anfragen",
      },
      verkostung: {
        title: "Verkostung & individuelle Auswahl",
        text: "Lernen Sie Maria Maria im Glas kennen. Bei einer persönlichen Verkostung entdecken Sie Ihre Favoriten; anschließend stellen wir gemeinsam Ihre individuelle Weinauswahl zusammen.",
        cta: "Verkostung vereinbaren",
      },
    },
  },

  /* ---- Sektion 03 — So einfach finden wir Ihren Wein ---- */
  process: {
    title: "So einfach finden wir Ihren Wein",
    steps: [
      {
        title: "Sie erzählen uns von Ihrem Vorhaben",
        text: "Restaurant, Sortiment, Event, Verkostung oder besonderer Anlass: Je besser wir Ihr Vorhaben kennen, desto gezielter können wir beraten.",
      },
      {
        title: "Wir beraten Sie persönlich",
        text: "Wir besprechen Ihre Wünsche und organisieren auf Wunsch eine Verkostung in Düsseldorf und Umgebung, damit Sie die Weine persönlich kennenlernen können.",
      },
      {
        title: "Gemeinsam wählen wir aus",
        text: "Aus Ihren Favoriten entsteht eine Auswahl, die zu Ihrem Konzept, Ihren Gästen, Ihrem Menü oder Ihrem Anlass passt.",
      },
    ],
    closing: "Von der ersten Anfrage bis zur passenden Weinauswahl begleiten wir Sie persönlich.",
  },

  /* ---- Sektion 04 — Emotional Brand Bridge ---- */
  bridge: {
    title: "Wein begleitet die Momente, an die man sich erinnert.",
    text: "Beim Dinner zu Hause, am Tisch im Restaurant, bei einer Firmenveranstaltung oder einer besonderen Feier: Maria Maria bringt Menschen, Genuss und charaktervolle italienische Weine zusammen.",
    tagline: "Ihre Auswahl. Ihr Anlass. Unsere Weine.",
    imageAlt: "Maria Maria Wein bei einem gedeckten Tisch für Dinner und besondere Anlässe.",
  },

  /* ---- Sektion 05 — Lead Form ---- */
  form: {
    title: "Erzählen Sie uns von Ihrem Vorhaben.",
    intro: "Je mehr wir über Ihren Anlass wissen, desto besser können wir Sie beraten. Wählen Sie zuerst Ihr Thema – anschließend zeigen wir nur die Felder, die für Ihre Anfrage wirklich relevant sind.",
    /* die zwei Hinweiskästen links neben dem Formular (Mockup) */
    hints: {
      event: { label: "Bei Event:", text: "Datum, Gästezahl, Art des Events" },
      trade: { label: "Bei Gastronomie/Handel:", text: "Art des Betriebs, gewünschte Auswahl" },
    },
    trust: "Persönlich. Ehrlich. Mit Leidenschaft für Wein.",
    /* Zusatz hinter optionalen Feldbeschriftungen: „Telefon (optional)" */
    optional: "optional",

    intent: { label: "Worum geht es?", placeholder: "Bitte auswählen" },
    intents: {
      gastronomie_feinkost: "Gastronomie & Feinkost",
      handel_wiederverkauf: "Handel & Wiederverkauf",
      event_feier: "Event / Feier",
      verkostung: "Verkostung",
      individuelle_auswahl: "Individuelle Weinauswahl",
      sonstiges: "Sonstiges",
    },
    name: { label: "Name", placeholder: "Ihr Name" },
    email: { label: "E-Mail", placeholder: "ihre@email.de" },
    companyLocation: {
      label: "Unternehmen / Location",
      placeholder: "z. B. Restaurant, Hotel, Handel, Eventlocation",
    },
    postalCity: { label: "Ort / PLZ", placeholder: "z. B. Düsseldorf, 40210" },
    phone: { label: "Telefon", placeholder: "Optional" },
    message: { label: "Nachricht", placeholder: "Beschreiben Sie kurz Ihr Vorhaben…" },

    /* Bedingte Felder je Anliegen (Handoff, Abschnitt 9). Alle optional —
       das Formular soll qualifizieren, kein Fragebogen werden. */
    details: {
      event_feier: {
        eventDate: { label: "Datum / Wunschtermin" },
        eventType: { label: "Art des Events", placeholder: "z. B. Firmenfeier, Hochzeit, Geburtstag" },
        guests: { label: "Ungefähre Gästezahl", placeholder: "z. B. 40" },
        location: { label: "Location / Ort", placeholder: "z. B. Düsseldorf, Eventlocation" },
      },
      gastronomie_feinkost: {
        businessType: {
          label: "Art des Betriebs",
          placeholder: "Bitte auswählen",
          options: {
            restaurant: "Restaurant",
            cafe: "Café",
            weinbar: "Weinbar",
            feinkost: "Feinkost",
            sonstiges: "Sonstiges",
          },
        },
        interest: {
          label: "Interesse / gewünschte Auswahl",
          placeholder: "z. B. Weinkarte, offene Weine, saisonale Auswahl",
        },
      },
      handel_wiederverkauf: {
        businessType: {
          label: "Art des Betriebs",
          placeholder: "Bitte auswählen",
          options: {
            weinhandel: "Weinhandel",
            feinkost: "Feinkost",
            fachhandel: "Fachhandel",
            sonstiges: "Sonstiges",
          },
        },
        interest: {
          label: "Interesse / gewünschte Auswahl",
          placeholder: "z. B. Sortiment, einzelne Weine, Probierpakete",
        },
      },
      verkostung: {
        date: { label: "Wunschtermin" },
        persons: { label: "Anzahl der Personen", placeholder: "z. B. 8" },
        occasion: {
          label: "Anlass",
          placeholder: "Bitte auswählen",
          options: {
            privat: "privat",
            unternehmen: "Unternehmen/Team",
            gastronomie_handel: "Gastronomie/Handel",
            sonstiger: "sonstiger Anlass",
          },
        },
      },
      individuelle_auswahl: {
        context: { label: "Anlass / Kontext", placeholder: "z. B. Dinner mit Gästen, Geschenk, Weinkarte" },
        guests: { label: "Gästezahl", placeholder: "z. B. 12" },
        style: { label: "Bevorzugte Stilrichtung", placeholder: "z. B. frisch & leicht, kräftig, Rosé" },
      },
    },

    privacyPre: "Ich habe die",
    privacyLink: "Datenschutzerklärung",
    privacyPost: "gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu.",
    submit: "Anfrage senden",
    sending: "Wird gesendet…",
    errors: {
      intent: "Bitte wählen Sie, worum es geht.",
      name: "Bitte geben Sie Ihren Namen an.",
      email: "Bitte geben Sie Ihre E-Mail-Adresse an.",
      emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
      message: "Bitte beschreiben Sie kurz Ihr Vorhaben.",
      privacy: "Bitte stimmen Sie der Datenschutzerklärung zu.",
      send: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt per E-Mail.",
    },
    success: {
      title: "Vielen Dank für Ihre Anfrage.",
      text: "Wir melden uns persönlich innerhalb von 1–2 Werktagen bei Ihnen.",
      again: "Neue Anfrage senden",
    },
  },

  /* ---- Sektion 06 — Häufige Fragen ---- */
  faq: {
    title: "Häufige Fragen",
    showAll: "Alle Fragen ansehen",
    showLess: "Weniger Fragen anzeigen",
    /* Das gelieferte FAQ-Motiv zeigt Falanghina, Primitivo di Manduria und
       Greco di Tufo mit Gläsern und Notizblock — der ALT beschreibt das
       Bild, das tatsächlich ausgeliefert wird. */
    imageAlt:
      "Drei Maria-Maria-Weine – Falanghina, Primitivo di Manduria und Greco di Tufo – mit Gläsern und Notizblock auf einem Tisch: Weinberatung für Gastronomie und Handel.",
  },
};

export default kontakt;
