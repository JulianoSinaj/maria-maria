/* Geschichte — die Erzählseite /geschichte: Auftakt, der Name, die fünf
   Kapitel der Reise, die Auswahl-Prinzipien und das Schlussband.

   Struktur (Anker-IDs, Bildpfade, Ikonen, Rebsorten-Zeilen, Link-Ziele,
   Reihenfolge) bleibt in components/geschichte/storyData.js — hier steht
   ausschließlich Text; die Seite mischt beides über die Kapitel-IDs
   zusammen. Marken-, Orts- und Rebsortennamen bleiben stehen; die
   italienischen Kurzworte auf den Fotos (`micro`, „La tavola lunga" …)
   bleiben in allen Sprachen italienisch — Atmosphäre der Marke, keine
   Beschriftung. */

export const geschichte = {
  /* Der Auftakt — Kanon der Marke, zwei CTAs, das Foto „Persönlich
     ausgewählt". `titleLines` sind die vier Zeilen des <h1>, die SplitText
     einzeln setzt; `journey` ist die stille Eckdaten-Zeile unter den CTAs. */
  hero: {
    eyebrow: "Maria Maria · Unsere Geschichte",
    titleLines: ["Zwei Frauen.", "Zwei Generationen.", "Eine Haltung", "zum Wein."],
    paragraphs: [
      "Der Name Maria Maria verbindet Erinnerung und Gegenwart. Persönliche Wurzeln im Salento prägen eine Haltung, die Herkunft, Charakter und gemeinsamen Genuss verbindet.",
      "Seit 2019 ist Maria Maria in Deutschland aktiv, mit Sitz in Düsseldorf und einer Auswahl, die für Deutschland und weitere Länder gedacht ist.",
    ],
    ctaStory: "Geschichte entdecken",
    ctaWines: "Unsere Weine kennenlernen",
    journey: ["Seit 2019 in Deutschland", "Sitz in Düsseldorf", "Italienische Herkunft"],
    photoAlt:
      "Zwei Generationen an einer langen Tafel unter der Pergola, davor zwei Flaschen Maria Maria",
    photoBadge: "Persönlich ausgewählt",
  },

  /* Der Name — die zwei Generationen hinter Maria Maria. */
  name: {
    eyebrow: "Der Name",
    titleLines: ["Zwei Marias.", "Erinnerung und Gegenwart."],
    paragraphs: [
      "Der Name Maria Maria trägt die Verbindung zwischen zwei Frauen und zwei Generationen in sich.",
      "Die ältere Maria steht für Lizzano, Familie, Gastfreundschaft und eine Weinkultur, die am gemeinsamen Tisch gelebt wird.",
      "Die jüngere Maria führt diese Haltung in die Gegenwart: mit einem zeitgemäßen Blick und einer persönlichen Auswahl italienischer Weine.",
    ],
    quote: "„Was bleibt, wird mit einer neuen Perspektive weitergetragen.“",
  },

  valerio: {
    eyebrow: "Der Inhaber · Weinimport & Auswahl",
    title: "Valerio Caniglia: der Unternehmer hinter Maria Maria",
    paragraphs: [
      "Valerio Caniglia bringt mehr als 30 Jahre Erfahrung im Weingeschäft mit. Er versteht Märkte, Menschen und Weine und wählt mit sicherem Gespür die Produzenten aus, die zu Maria Maria passen.",
      "Mit Feingefühl, Verlässlichkeit und einem internationalen Netzwerk sorgt er dafür, dass jede Flasche unsere Werte ins Glas bringt.",
    ],
    cta: "Maria Maria für Gastronomie und Fachhandel",
    href: "/kontakt",
    imageLabel: "Portrait von Valerio Caniglia",
  },

  /* Das Kapitel-Menü der Telefone (StoryChapterNav). */
  nav: {
    ariaLabel: "Die Kapitel dieser Geschichte",
  },

  /* Die Stationen 01–05 — Schlüssel sind die Anker-IDs aus storyData.
     `micro` liegt als italienisches Kurzwort AUF dem Foto, `caption` ist
     die Didascalia darunter, `linkLabel` beschriftet den Tiefen-Link. */
  chapters: {
    anfang: {
      label: "Heute · Mettmann bei Düsseldorf",
      title: "In Deutschland zu Hause. Italien persönlich verbunden.",
      paragraphs: [
        "Von Mettmann aus bringen wir ausgewählte Weine italienischer Winzer in die Gastronomie und in Weinbars – persönlich, verlässlich und mit echter Nähe.",
        "Jede Bestellung wird mit Sorgfalt zusammengestellt, damit unsere Weine dort ankommen, wo sie ihren Platz haben: am Tisch.",
      ],
      linkLabel: "Unsere Weinauswahl entdecken",
      alt: "Gedeckter Tisch mit Weingläsern und einer originalen Maria-Maria-Weinflasche",
      micro: "La tavola lunga",
    },
    salento: {
      label: "Salento · Lizzano",
      title: "Wo die Wurzeln liegen",
      paragraphs: [
        "Im Salento beginnt die Weinsprache von Maria Maria. Rund um Lizzano prägen rote Erde, mediterrane Vegetation, Licht und die Nähe zum Ionischen Meer die Landschaft.",
        "Hier liegen die persönlichen Wurzeln des Namens und der Ausgangspunkt einer Auswahl, in der der Primitivo für Wärme, Tiefe und eine unverwechselbare Herkunft steht.",
      ],
      linkLabel: "Salento und unsere Primitivo-Weine entdecken",
      alt: "Rote Erde und Weinberge bei Lizzano im Salento",
      micro: "Terra rossa",
      caption: "Reben, mediterranes Licht und die Nähe zum Ionischen Meer.",
    },
    duesseldorf: {
      label: "Der Anfang · Sommer 2019",
      title: "Manche Ideen entstehen am Tisch.",
      paragraphs: [
        "Zwischen gutem Essen, offenen Gesprächen und besonderen Weinen wächst eine Idee: Weine zu finden, die Herkunft zeigen, Charakter haben und Menschen zusammenbringen.",
        "Aus diesem Abend wird mehr als eine Erinnerung – es wird Maria Maria.",
      ],
      quote: "„Manche Ideen brauchen keinen Businessplan. Nur den richtigen Tisch.“",
      linkLabel: "Unsere Weinauswahl entdecken",
      alt: "Gedeckter Abendtisch mit Maria-Maria-Rotwein in der Abenddämmerung",
      micro: "Dall’Italia, oltre i confini",
    },
  },

  /* Kapitel 06 „Die Auswahl" — Intro vor den drei Prinzipien. */
  today: {
    label: "Die Auswahl",
    title: "Was einen Wein zu Maria Maria führt",
    intro:
      "Nicht eine einzelne Stadt und nicht ein kurzfristiger Trend bestimmen die Auswahl. Entscheidend sind Herkunft, Charakter und die Art, wie ein Wein den Moment am Tisch begleitet.",
  },

  /* Die drei Auswahl-Prinzipien — Reihenfolge wie STORY_STATS in
     storyData (Ikone und Prinzip-Nummer stehen dort). */
  stats: [
    {
      label: "Herkunft vor Beliebigkeit",
      detail:
        "Jeder Wein muss seine Region, seine Rebsorte und seinen eigenen Charakter erkennen lassen.",
    },
    {
      label: "Charakter vor Trend",
      detail:
        "Keine austauschbaren Etiketten, sondern Weine mit einer klaren Identität und einer Herkunft, die spürbar bleibt.",
    },
    {
      label: "Genuss, der geteilt wird",
      detail:
        "Ein Wein findet seinen Sinn in den Momenten, Speisen und Begegnungen, die er begleitet.",
    },
  ],

  /* Das Bordeaux-Schlussband (StoryCta) — weiter in die Regionen. */
  cta: {
    ariaLabel: "Weiter zu den Regionen",
    text: "Jeder Wein beginnt an einem Ort. Seine Geschichte wird am Tisch weitergeschrieben.",
  },

  /* Kopf der B2B-FAQ am Seitenende — die Fragen selbst liegen in faq.js
     (faq.geschichte). */
  faq: {
    eyebrow: "Fragen & Antworten",
    title: "Häufige Fragen von Gastronomie,",
    titleAccent: "Handel & Partnern.",
    description:
      "Was Restaurants, Weinbars, Hotels, Händler und Veranstalter uns fragen, bevor wir zusammenarbeiten — beantwortet aus der Praxis. Was hier offen bleibt, klären wir persönlich.",
    footerLabel: "Ihre Frage ist nicht dabei? Schreiben Sie uns",
  },
};

export default geschichte;
