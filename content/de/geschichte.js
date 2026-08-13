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

  /* Das Kapitel-Menü der Telefone (StoryChapterNav). */
  nav: {
    ariaLabel: "Die Kapitel dieser Geschichte",
  },

  /* Die Stationen 01–05 — Schlüssel sind die Anker-IDs aus storyData.
     `micro` liegt als italienisches Kurzwort AUF dem Foto, `caption` ist
     die Didascalia darunter, `linkLabel` beschriftet den Tiefen-Link. */
  chapters: {
    anfang: {
      label: "Der Anfang · 2019",
      title: "Von Deutschland aus. Mit italienischen Wurzeln.",
      paragraphs: [
        "Seit 2019 ist Maria Maria in Deutschland aktiv. Die Marke hat ihren Sitz in Düsseldorf – ihre persönliche und kulturelle Herkunft führt nach Lizzano im Salento.",
        "Aus der Verbindung zweier Generationen entstand eine Auswahl, in der jede Flasche für einen Ort, eine Rebsorte und eine bewusste Entscheidung steht.",
      ],
      quote:
        "„Der Wein beginnt bei seiner Herkunft – und findet seinen Platz dort, wo Menschen ihn miteinander teilen.“",
      alt: "Gedeckter Tisch mit Weingläsern und einer originalen Maria-Maria-Weinflasche",
      micro: "La tavola lunga",
      caption: "Italienische Wurzeln, seit 2019 in Deutschland weitergetragen.",
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
    kampanien: {
      label: "Kampanien · Irpinien",
      title: "Autochthone Rebsorten. Unverwechselbare Herkunft.",
      paragraphs: [
        "Mit Kampanien erweitert sich die Geschichte um eine Weinlandschaft, die von Höhenlagen, Mikroklimata und autochthonen Rebsorten geprägt ist.",
        "Greco di Tufo DOCG, Falanghina und Aglianico stehen für eigenständige Charaktere und eine traditionsreiche Weinkultur.",
        "Der fachliche Austausch mit dem Önologen Francesco De Stefano vertieft den Blick auf Rebsorten, Herkunft und Entscheidungen.",
      ],
      linkLabel: "Irpinien und seine Weine entdecken",
      alt: "Hügelige Weinlandschaft der Irpinia in Kampanien",
      micro: "Vento di collina",
      caption: "Höhenlagen und autochthone Rebsorten prägen Irpiniens Weinlandschaft.",
    },
    gardasee: {
      label: "Gardasee · Lugana DOC",
      title: "Eleganz, die aus dem Ort kommt",
      paragraphs: [
        "Am Südufer des Gardasees begegnet Maria Maria einer anderen Ausdrucksform italienischer Weinkultur.",
        "Auf kalkhaltigen, lehmreichen Moränenböden und unter dem Einfluss des milden Seeklimas entsteht aus der Rebsorte Turbiana ein Wein mit Klarheit, Frische und eleganter Struktur. Der Lugana DOC ergänzt die Auswahl um eine Herkunft, deren Charakter nicht laut sein muss, um in Erinnerung zu bleiben.",
      ],
      linkLabel: "Lugana und den Gardasee entdecken",
      alt: "Weinberge des Lugana-Gebiets am Gardasee",
      micro: "Luce sul Garda",
      caption: "Moränenböden, Turbiana und milde Seebrisen.",
    },
    duesseldorf: {
      label: "Seit 2019 · Düsseldorf",
      title: "In Deutschland zu Hause. Über Grenzen hinweg gedacht.",
      paragraphs: [
        "Die Marke Maria Maria ist seit 2019 in Deutschland aktiv und hat ihren Sitz in Düsseldorf. Von hier aus werden persönlich ausgewählte italienische Weine für Menschen in Deutschland und weiteren Ländern zugänglich.",
        "Düsseldorf ist der Standort der Marke – nicht die Grenze ihrer Auswahl. Entscheidend bleiben Herkunft, Charakter und die Geschichte hinter jedem Wein.",
      ],
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
};

export default geschichte;
