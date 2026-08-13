/* Kollektionsseite /unsere-weine — Hero, Occasioni-Doppelseite,
   Beratungs-Trio (HelpStrip) und die Wahl-FAQ.

   Der Zeitungskopf der Occasioni-Sektion („Le occasioni", „Il vino giusto per
   ogni momento", „Dal Magazin") bleibt italienisch: er ist das Echo der
   Rivista, in die die Sektion führt — eine Marken-Setzung, keine
   Beschriftung. */

export const weine = {
  hero: {
    eyebrow: "Die Kollektion",
    title: "Unsere Weine",
    titleAccent: "Neun Charaktere.",
    lede: "Maria Maria steht für handverlesene italienische Boutique-Weine von kleinen Weingütern – ausgewählt für bewusste Momente und echten Genuss.",
    ctaCollection: "Zur Kollektion",
    ctaShop: "Zum Shop",
    statWines: "Ausgewählte Weine",
    statRegions: "Regionen aus Italien",
    statSinceValue: "seit 2019",
    statSince: "Für bewusste Genussmomente",
    /* nur für Screenreader — die Kollektion trägt darüber schon ihr H1 */
    collectionHeading: "Die Kollektion",
    /* Scroll-Cue unter dem Hero-Foto + Alternativtext des Fotos */
    photoAlt:
      "Alle neun Maria-Maria-Weine aufgereiht auf einer Steinmauer vor süditalienischer Hügellandschaft im Abendlicht",
  },

  occasioni: {
    title: "Zu jedem Moment",
    titleAccent: "der richtige Wein.",
    text: "Aperitivo im Abendlicht. Ein eleganter Dinner. Ein langer Abend mit Freunden. Maria Maria hat für jeden dieser Momente die passenden Pairings kuratiert — entdecken Sie im Magazin, welche Weine Ihre Anlässe begleiten.",
    cta: "Die Pairings entdecken",
    ctaAria: "Zu den Food-Pairing-Empfehlungen im Magazin",
    /* Die drei Motive der überblendenden Foto-Karte */
    moments: {
      aperitivo: { title: "Aperitivo", text: "Leicht, frisch und bereichernd." },
      dinner: { title: "Dinner", text: "Elegante Begleiter für besondere Gerichte." },
      friends: { title: "Freunde", text: "Für gute Gespräche und unvergessliche Abende." },
    },
  },

  help: {
    eyebrow: "Gut zu wissen",
    title: "Gut beraten",
    titleAccent: "genießen",
    description:
      "Wissen und Antworten rund um Ihre Auswahl – vom passenden Gericht bis zur richtigen Herkunft.",
    cards: {
      pairing: {
        title: "Food Pairing",
        text: "Entdecken Sie passende Speisen zu unseren Weinen – für den perfekten Genussmoment.",
        link: "Mehr erfahren",
      },
      regions: {
        title: "Regionen",
        text: "Entdecken Sie die Herkunft unserer Weine – von Apulien bis zum Gardasee.",
        link: "Zu den Regionen",
      },
    },
  },

  faq: {
    eyebrow: "Häufige Fragen",
    title: "Welcher Wein",
    titleAccent: "darf es sein?",
    description:
      "Orientierung für Ihre Wahl — von Farbe und Anlass bis zum passenden Geschenk. Jede Antwort führt Sie einen Schritt näher zur richtigen Flasche.",
    footerLabel: "Persönliche Beratung? Schreiben Sie uns",
  },
};

export default weine;
