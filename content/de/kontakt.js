/* Kontaktseite und Kontaktformular.

   Ein Formular in der falschen Sprache ist teurer als jede andere
   unübersetzte Seite: Wer nicht versteht, welches Feld was will, schickt
   nichts ab. Deshalb liegen hier auch die Fehlermeldungen, die
   Auswahlwerte und die Zustimmung zur Datenschutzerklärung.

   `topics` sind Anzeigetexte zu festen Schlüsseln (tasting, merchant, press,
   general). Vorher verglich der Code den deutschen String
   („Verkostungsanfrage"), um die Terminfelder aufzuklappen — auf jeder
   anderen Sprache wäre das Kapitel damit unsichtbar geblieben. */

export const kontakt = {
  hero: {
    eyebrow: "Wir sind für Sie da",
    title: "Kontakt",
    titleItalic: "Parliamo di vino.",
    text: "Wir freuen uns auf Ihre Nachricht! Ob eine Verkostung in Düsseldorf, Fragen zu unseren Weinen, Partnerschaften oder Händleranfragen – wir sind gerne für Sie da.",
    promiseLabel: "Unser Versprechen:",
    promise:
      "Wir antworten innerhalb von 1–2 Werktagen auf Ihre Anfrage. Persönlich, ehrlich und mit Leidenschaft für Wein.",
  },

  details: {
    email: "E-Mail",
    phone: "Telefon",
    address: "Adresse",
    addressValue: "Senso Valerio Weinhandel · Mettmann, Deutschland",
  },

  help: {
    eyebrow: "Ihr Anliegen",
    title: "Womit können wir Ihnen helfen?",
    description:
      "Vier direkte Wege zu uns – wählen Sie einfach das Thema, das zu Ihrer Anfrage passt.",
    cta: "Anfrage senden",
    items: {
      tasting: {
        title: "Verkostungen",
        text: "Sie möchten unsere Weine verkosten? Hier erfahren Sie, wie es geht.",
      },
      merchant: {
        title: "Händleranfragen",
        text: "Sie sind Händler oder möchten unsere Weine in Ihr Sortiment aufnehmen?",
      },
      press: {
        title: "Presse & Kooperationen",
        text: "Für Presseanfragen, Kooperationen oder gemeinsame Projekte sind wir offen.",
      },
      general: {
        title: "Allgemeine Fragen",
        text: "Sie haben eine allgemeine Frage zu Maria Maria? Wir helfen Ihnen gerne weiter.",
      },
    },
  },

  faq: {
    eyebrow: "Gut zu wissen",
    title: "Häufige",
    titleAccent: "Fragen.",
    description:
      "Antworten auf die Fragen, die uns am häufigsten erreichen — nach Anliegen sortiert: von Verkostungen in Düsseldorf über Händleranfragen bis zu Shop und Versand.",
    footer: "Frage nicht dabei? Schreiben Sie uns",
  },

  form: {
    title: "Schreiben Sie uns",
    name: { label: "Name", placeholder: "Ihr Name" },
    email: { label: "E-Mail", placeholder: "name@beispiel.de" },
    subject: { label: "Betreff", placeholder: "Worum geht es?" },
    topic: { label: "Anliegen", placeholder: "Anliegen wählen" },
    topics: {
      tasting: "Verkostungsanfrage",
      merchant: "Händleranfrage",
      press: "Presse & Kooperationen",
      general: "Allgemeine Frage",
    },
    date: { label: "Wunschtermin" },
    guests: {
      label: "Anzahl Gäste",
      placeholder: "Gäste wählen",
      /* Einheit hinter der Zahlenspanne: „5–8 Personen" */
      unit: "Personen",
      /* Werte sind zugleich Anzeigetext — reine Zahlenspannen, nur die
         letzte Option ist ein Satz. */
      options: ["2–4", "5–8", "9–12", "13–20", "Mehr als 20"],
      /* Hinweis unter den Verkostungsfeldern */
      note: "Unsere Verkostungen finden in Düsseldorf & Umgebung statt — privat oder für Ihr Team, bei Ihnen oder in unserem Verkostungsraum.",
    },
    message: { label: "Nachricht", placeholder: "Ihre Nachricht an uns …" },
    privacyPre: "Ich habe die",
    privacyLink: "Datenschutzerklärung",
    privacyPost: "gelesen und stimme der Verarbeitung meiner Daten zu.",
    submit: "Nachricht senden",
    sending: "Wird gesendet…",
    errors: {
      name: "Bitte geben Sie Ihren Namen an.",
      email: "Bitte geben Sie Ihre E-Mail-Adresse an.",
      emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
      subject: "Bitte geben Sie einen Betreff an.",
      topic: "Bitte wählen Sie ein Anliegen.",
      date: "Bitte wählen Sie einen Wunschtermin.",
      guests: "Bitte geben Sie die Anzahl der Gäste an.",
      message: "Bitte schreiben Sie uns eine kurze Nachricht.",
      privacy: "Bitte stimmen Sie der Datenschutzerklärung zu.",
      send: "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    },
    success: {
      title: "Vielen Dank für Ihre Nachricht!",
      text: "Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 1–2 Werktagen persönlich bei Ihnen.",
      again: "Neue Nachricht",
    },
  },
};

export default kontakt;
