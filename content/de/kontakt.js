/* Kontaktseite — Text nach dem freigegebenen Handoff „Maria Maria ·
   Kontaktseite — SEO Copy DE + Developer Handoff IT" (Version 2.0).

   Die Seite qualifiziert Anfragen, sie verkauft nicht: vier Anlässe, drei
   Schritte, dann erst das Formular. Diese Reihenfolge ist im Dokument als
   verbindlich festgehalten und steckt deshalb in der Struktur dieser Datei —
   `intents` vor `process` vor `form`.

   ZWEI REGELN AUS DEM DOKUMENT, die hier sichtbar werden:

   1. Die technischen Werte der Anliegen (gastronomie_feinkost, event_feier …)
      stehen NICHT im Text. Sie liegen in components/kontakt/intents.js und
      bleiben über alle vier Sprachen und alle künftigen Textänderungen
      stabil, weil Backend, Analytics und Lead-Routing an ihnen hängen. Hier
      steht nur, wie sie heißen.

   2. Die Telefonnummer aus dem Mockup (+49 211 976 420) ist laut Handoff
      NICHT die richtige. Bis der Kunde die korrekte Nummer bestätigt,
      erscheint auf der Kontaktseite gar keine — ein Platzhalter wäre die
      teurere Variante: Anrufe, die niemand entgegennimmt. `details` führt
      deshalb nur E-Mail und Standort. */

export const kontakt = {
  hero: {
    eyebrow: "Kontakt · Weinberatung für Düsseldorf & NRW",
    /* Zwei Zeilen, weil die Überschrift im Mockup zwei ist — nicht als
       Umbruchtrick, sondern als Satz und Antwortsatz. */
    title: "Wein für Ihren Moment.",
    titleSecond: "Persönlich ausgewählt.",
    text: "Für Gastronomie, Handel, Events und besondere Anlässe. Lernen Sie Maria Maria kennen und finden Sie gemeinsam mit uns die Weine, die zu Ihrem Konzept, Ihren Gästen oder Ihrem Anlass passen.",
    ctaPrimary: "Beratung anfragen",
    ctaSecondary: "Verkostung vereinbaren",
    promise: "Persönliche Rückmeldung innerhalb von 1–2 Werktagen.",
    imageAlt:
      "Maria Maria Il Rosso und Il Bianco in 375-ml-Flaschen auf einem gedeckten Tisch.",
  },

  details: {
    emailLabel: "E-Mail",
    email: "info@maria-maria.de",
    locationLabel: "Standort",
    location: "Mettmann, Deutschland",
  },

  intents: {
    title: "Warum möchten Sie uns kontaktieren?",
    intro: "Wählen Sie den Anlass, der am besten zu Ihrem Vorhaben passt.",
    items: {
      gastronomie: {
        title: "Gastronomie & Feinkost",
        text: "Sie möchten Maria Maria in Ihrem Restaurant, Café, Ihrer Weinbar oder Ihrem Feinkostgeschäft anbieten? Gemeinsam finden wir eine Auswahl, die zu Ihrem Konzept, Ihrer Küche und Ihren Gästen passt.",
        cta: "Gastronomie anfragen",
      },
      handel: {
        title: "Handel & Wiederverkauf",
        text: "Sie möchten Maria Maria in Ihr Sortiment aufnehmen? Sprechen Sie mit uns über Weinauswahl, Mengen und die Möglichkeiten einer persönlichen Zusammenarbeit.",
        cta: "Partnerschaft anfragen",
      },
      event: {
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
    closing:
      "Von der ersten Anfrage bis zur passenden Weinauswahl begleiten wir Sie persönlich.",
  },

  bridge: {
    title: "Wein begleitet die Momente, an die man sich erinnert.",
    text: "Beim Dinner zu Hause, am Tisch im Restaurant, bei einer Firmenveranstaltung oder einer besonderen Feier: Maria Maria bringt Menschen, Genuss und charaktervolle italienische Weine zusammen.",
    claim: "Ihre Auswahl. Ihr Anlass. Unsere Weine.",
    imageAlt:
      "Maria Maria Wein bei einem gedeckten Tisch für Dinner und besondere Anlässe.",
  },

  form: {
    title: "Erzählen Sie uns von Ihrem Vorhaben.",
    intro:
      "Je mehr wir über Ihren Anlass wissen, desto besser können wir Sie beraten. Wählen Sie zuerst Ihr Thema – anschließend zeigen wir nur die Felder, die für Ihre Anfrage wirklich relevant sind.",
    /* Die zwei Kontext-Kästchen der linken Spalte: sie nehmen dem Formular
       die Überraschung. Wer vorher liest, dass nach der Gästezahl gefragt
       wird, bricht nicht ab, wenn das Feld aufklappt. */
    hints: [
      { title: "Bei Event", text: "Datum, Gästezahl, Art des Events" },
      { title: "Bei Gastronomie/Handel", text: "Art des Betriebs, gewünschte Auswahl" },
    ],
    trust: "Persönlich. Ehrlich. Mit Leidenschaft für Wein.",

    intent: {
      label: "Worum geht es?",
      placeholder: "Bitte auswählen",
      options: {
        gastronomie_feinkost: "Gastronomie & Feinkost",
        handel_wiederverkauf: "Handel & Wiederverkauf",
        event_feier: "Event / Feier",
        verkostung: "Verkostung",
        individuelle_auswahl: "Individuelle Weinauswahl",
        sonstiges: "Sonstiges",
      },
    },
    name: { label: "Name", placeholder: "Ihr Name" },
    email: { label: "E-Mail", placeholder: "ihre@email.de" },
    company: { label: "Unternehmen / Location", placeholder: "z. B. Restaurant, Hotel, Handel" },
    city: { label: "Ort / PLZ", placeholder: "z. B. Düsseldorf, 40210" },
    phone: { label: "Telefon (optional)", placeholder: "z. B. 0176 12345678" },
    message: { label: "Nachricht", placeholder: "Beschreiben Sie kurz Ihr Vorhaben…" },

    /* Bedingte Felder — Abschnitt 9 des Handoffs. Sie erscheinen erst, wenn
       das Anliegen sie sinnvoll macht, und sind nie „required", solange sie
       versteckt sind (sonst blockiert ein unsichtbares Feld den Versand). */
    conditional: {
      eventDate: { label: "Datum / Wunschtermin" },
      eventType: {
        label: "Art des Events",
        placeholder: "z. B. Firmenfeier, Hochzeit, Geburtstag",
      },
      guests: { label: "Ungefähre Gästezahl", placeholder: "z. B. 40" },
      location: { label: "Location / Ort", placeholder: "z. B. Düsseldorf" },
      tastingDate: { label: "Wunschtermin" },
      persons: { label: "Anzahl der Personen", placeholder: "z. B. 8" },
      occasion: {
        label: "Anlass",
        placeholder: "Bitte auswählen",
        options: {
          privat: "Privat",
          unternehmen: "Unternehmen / Team",
          gastro: "Gastronomie / Handel",
          sonstiger: "Sonstiger Anlass",
        },
      },
      businessTypeGastro: {
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
      businessTypeHandel: {
        label: "Art des Betriebs",
        placeholder: "Bitte auswählen",
        options: {
          weinhandel: "Weinhandel",
          feinkost: "Feinkost",
          fachhandel: "Fachhandel",
          sonstiges: "Sonstiges",
        },
      },
      selection: {
        label: "Interesse / gewünschte Auswahl",
        placeholder: "z. B. Rotweine aus Apulien, Probierpaket",
      },
      context: { label: "Anlass / Kontext", placeholder: "z. B. Menübegleitung, Geschenk" },
      guestsOptional: { label: "Gästezahl (optional)", placeholder: "z. B. 12" },
      style: {
        label: "Bevorzugte Stilrichtung (optional)",
        placeholder: "z. B. kräftige Rotweine, frische Weißweine",
      },
    },

    privacyPre: "Ich habe die",
    privacyLink: "Datenschutzerklärung",
    privacyPost: "gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu.",
    required: "Pflichtfeld",
    submit: "Anfrage senden",
    sending: "Wird gesendet…",

    errors: {
      intent: "Bitte wählen Sie aus, worum es geht.",
      name: "Bitte geben Sie Ihren Namen an.",
      email: "Bitte geben Sie Ihre E-Mail-Adresse an.",
      emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
      message: "Bitte beschreiben Sie kurz Ihr Vorhaben.",
      privacy: "Bitte stimmen Sie der Datenschutzerklärung zu.",
      send: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    },

    success: {
      title: "Vielen Dank für Ihre Anfrage.",
      text: "Wir melden uns persönlich innerhalb von 1–2 Werktagen bei Ihnen.",
      again: "Neue Anfrage",
    },
  },

  faq: {
    title: "Häufige Fragen",
    /* Vier Fragen stehen offen da, die übrigen kommen über den Schalter —
       im HTML sind alle sechs von Anfang an vorhanden. */
    more: "Alle Fragen ansehen",
    less: "Weniger Fragen anzeigen",
    imageAlt:
      "Maria Maria Il Rosso und Il Bianco in 375-ml-Flaschen mit Servierdetails.",
    items: [
      {
        id: "kontakt-verkostung-buchen",
        q: "Wie buche ich eine Weinverkostung in Düsseldorf?",
        a: "Wählen Sie im Kontaktformular „Verkostung“ und nennen Sie uns Ihren Wunschtermin, die ungefähre Personenzahl und den Anlass. Wir stimmen Ort und Format persönlich mit Ihnen ab und melden uns innerhalb von 1–2 Werktagen mit einem Vorschlag.",
      },
      {
        id: "kontakt-sortiment",
        q: "Kann ich Maria Maria in mein Sortiment aufnehmen?",
        a: "Ja. Wählen Sie „Handel & Wiederverkauf“ und erzählen Sie uns kurz von Ihrem Geschäft, Ihrem Standort und Ihrer gewünschten Auswahl. Anschließend besprechen wir persönlich die passenden nächsten Schritte.",
      },
      {
        id: "kontakt-firmenveranstaltungen",
        q: "Bieten Sie Weine für Firmenveranstaltungen an?",
        a: "Ja. Für Firmenveranstaltungen, Conventions und besondere Anlässe beraten wir Sie bei der Weinauswahl. Nennen Sie uns Datum, Gästezahl, Ort und den Charakter der Veranstaltung, damit wir Ihre Anfrage gezielt besprechen können.",
      },
      {
        id: "kontakt-gastronomie",
        q: "Kann ich Maria-Maria-Weine in meinem Restaurant oder Feinkostgeschäft anbieten?",
        a: "Ja. Wählen Sie „Gastronomie & Feinkost“ und erzählen Sie uns kurz von Ihrem Betrieb, Ihrer Küche bzw. Ihrem Konzept und Ihrem Standort. Gemeinsam finden wir eine Auswahl, die zu Ihren Gästen passt.",
      },
      {
        id: "kontakt-individuelle-auswahl",
        q: "Wie funktioniert eine individuelle Weinauswahl?",
        a: "Sie erzählen uns zunächst von Ihrem Vorhaben. Auf Wunsch lernen Sie die Weine bei einer Verkostung kennen. Aus Ihren Favoriten entsteht anschließend eine Auswahl, die zu Ihrem Konzept, Ihrem Menü oder Ihrem Anlass passt.",
      },
      {
        id: "kontakt-kaufen",
        q: "Wo kann ich Maria-Maria-Weine kaufen?",
        a: "Die Weine können über den offiziellen Maria-Maria-Shop bestellt werden. Auf der Kontaktseite bleibt der Shop ein sekundärer Weg, damit Beratungs-, Event- und B2B-Anfragen nicht vom Kontakt-Funnel abgelenkt werden.",
      },
    ],
  },
};

export default kontakt;
