/* Startseite — Hero, Philosophie, Kollektions-Auftakt, Le Origini,
   Regionen-Explorer, Shop-Band und die Marken-FAQ-Sektion.

   Struktur (Icons, Bildpfade, Bildausschnitte, Reihenfolge) bleibt in
   components/home/*; hier steht ausschließlich Text. Die Reben- und
   Ortsnamen im Laufband sowie „Le Origini" bleiben unübersetzt — das sind
   Namen, keine Beschriftungen. */

export const home = {
  hero: {
    eyebrow: "Italienische Boutique-Weine",
    lede: "Handverlesene Weine kleiner Familienweingüter – für bewusst gewählte Genussmomente, vom Aperitivo bis zum großen Abend.",
    ctaWines: "Weine entdecken",
    ctaShop: "Zum Shop",
    statWines: "Boutique-Weine",
    statRegions: "Regionen Italiens",
    statSince: "seit der Gründung",
  },

  philosophy: {
    eyebrow: "Unsere Philosophie",
    title: "Italienische Boutique-Weine, die sich leicht wählen, erzählen und erleben lassen.",
    description:
      "Persönlich kuratiert, klar in ihrer Herkunft und ausgewählt für Gastronomie, Hospitality, Events und besondere Genussmomente.",
    /* Reihenfolge und Ikonen stehen im Code — die Schlüssel verbinden beide Seiten. */
    moments: {
      selection: {
        title: "Persönlich kuratiert",
        text: "Jeder Wein wird persönlich verkostet und bewusst ausgewählt. So entsteht ein überschaubares Boutique-Sortiment, das Gastgeber sicher empfehlen und Genießer leicht entdecken können.",
      },
      origin: {
        title: "Herkunft mit Handschrift",
        text: "Wir arbeiten mit ausgewählten, familiengeführten Weingütern in Italien. Region, Rebsorte und die Menschen hinter dem Wein geben jeder Flasche eine glaubwürdige und erzählenswerte Geschichte.",
      },
      occasion: {
        title: "Für Genussmomente gemacht",
        text: "Vom Aperitivo und Food Pairing bis zu Events und stilvollen Geschenken: Maria Maria verbindet Geschmack, Ästhetik und italienische Lebensart in Momenten, die in Erinnerung bleiben.",
      },
      guidance: {
        title: "Persönlich begleitet",
        text: "Ein klares Sortiment, verständliche Empfehlungen und der direkte Austausch erleichtern Auswahl und Einsatz – für eine persönliche Zusammenarbeit auf Augenhöhe.",
      },
    },
    note: "Für Gastronomie, Hospitality und besondere Konzepte",
    cta: "Maria Maria als Partner entdecken",
  },

  collection: {
    eyebrow: "Die Kollektion",
    title: "Unsere Weine",
    description: "Neun Charaktere aus vier Regionen – jeder mit eigener Geschichte.",
  },

  origins: {
    title: "Zwei Seelen,",
    titleAccent: "ein Name",
    paragraphs: [
      "Maria Maria beginnt im Salento, im Sommer 2019 — zwischen Kindheitserinnerungen und alten Rebzeilen wurde aus einem Moment eine Erleuchtung: Wein ist für uns kein Getränk, sondern ein Katalysator für Emotionen.",
      "Seitdem führt unsere Reise von den sonnigen Rebzeilen des Salento über die Vulkanböden Kampaniens hinauf ans Südufer des Gardasees — jede Flasche eine Station, jede Region eine eigene Sprache.",
    ],
    /* Ortsnamen der Reise — in allen Sprachen die jeweils gebräuchliche Form. */
    journey: ["Salento", "Apulien", "Kampanien", "Gardasee"],
    quote: "„Italian wine, personal selection, share the pleasure.“",
    cta: "Magazin",
  },

  regions: {
    eyebrow: "Herkunft",
    title: "Wo unsere Weine zuhause sind",
    description:
      "Boden, Licht und Klima prägen jede Traube – am Ende schmeckt man die Landschaft im Glas.",
    cta: "Alle Regionen",
    /* Beschriftung der Detail-Karte im Explorer */
    detailCta: "Mehr entdecken",
    items: {
      apulien: {
        name: "Apulien",
        tag: "Das Herz des Südens",
        desc: "Die Sonne des Südens und kraftvolle Aromen.",
        long: "Zwischen Salento und Gallipoli reifen Primitivo und Negroamaro unter der Sonne des Südens – kraftvolle, warme Weine mit mediterraner Seele.",
      },
      kampanien: {
        name: "Kampanien",
        tag: "Zwischen Vulkan und Meer",
        desc: "Vulkanische Böden, ursprüngliche Charaktere.",
        long: "Rund um Napoli und Salerno prägen die vulkanischen Böden des Vesuv Weine mit Tiefe und Ursprünglichkeit – von Falanghina bis Aglianico.",
      },
      garda: {
        name: "Gardasee / Lombardei",
        tag: "Eleganz des Nordens",
        desc: "Eleganz, Frische und mineralische Tiefe.",
        long: "Am Südufer des Gardasees entsteht Lugana – ein Weißwein von seltener Eleganz, getragen von Frische und mineralischer Tiefe.",
      },
    },
  },

  shopBand: {
    eyebrow: "Der offizielle Shop",
    title: "Bereit für den Geschmack, der",
    titleAccent: "Sie inspiriert?",
    text: "Entdecken und bestellen Sie unsere Weine bequem online – direkt vom Weingut zu Ihnen nach Hause.",
    primary: "Zum Shop",
    secondary: "Kontakt aufnehmen",
  },

  faq: {
    eyebrow: "Häufige Fragen",
    title: "Maria Maria,",
    titleAccent: "kurz erklärt.",
    description:
      "Alles, was Sie über unsere Weine, den Einkauf und eine mögliche Zusammenarbeit mit Maria Maria wissen möchten.",
    footerNote: "Noch Fragen oder Interesse an einer Zusammenarbeit?",
    footerLabel: "Persönlich Kontakt aufnehmen",
  },
};

export default home;
