/* Startseite — Hero, Philosophie, Kollektions-Auftakt, Le Origini, die drei
   Weinherkünfte, die drei Conversion-Segmente, Shop-Band und die
   Marken-FAQ-Sektion.

   Struktur (Icons, Bildpfade, Bildausschnitte, Reihenfolge, Link-Ziele)
   bleibt in components/home/*; hier steht ausschließlich Text. Die Reben-
   und Ortsnamen im Laufband sowie „Le Origini" bleiben unübersetzt — das
   sind Namen, keine Beschriftungen.

   Die Texte folgen dem „Homepage SEO – Developer Brief" (24.08.2026):
   Veröffentlicht ist nur, was dort als „DE – veröffentlichen" freigegeben
   wurde. Strings nicht ohne SEO-/Brand-Freigabe ändern. Wo der Brief eine
   Zeile nicht kennt (Eyebrows der Sektionen, Zitat, Regionen-Rubriken,
   FAQ-Kopf), steht der bisherige Text. */

export const home = {
  hero: {
    /* Wörtlich wie im Brief (§3). Die Eyebrow-Komponente setzt ohnehin
       Versalien per CSS — die Schreibweise hier ändert nichts am Bild,
       aber die Abnahme prüft gegen genau diese Zeichenkette. */
    eyebrow: "PERSÖNLICH KURATIERT · SEIT 2019",
    /* Genau eine H1: Marke plus Hauptkeyword. Der italienische Claim steht
       NICHT mehr in der Überschrift, sondern darunter als eigener
       <p lang="it"> — im DOM darf nie „Maria MariaIl piacere del vino."
       entstehen. */
    title: "Maria Maria – italienische Boutique-Weine",
    claim: "Il piacere del vino.",
    lede: "Handverlesene Weine kleiner italienischer Familienweingüter – persönlich ausgewählt für bewusste Genussmomente in Deutschland, vom Aperitivo bis zum großen Abend.",
    ctaWines: "Unsere Weine entdecken",
    /* Die zweite CTA führt zur persönlichen Beratung (/kontakt), nicht mehr
       zum Shop. Die frühere Statzeile (Weine · Regionen · seit 2019) ist
       entfallen: Ihre Beschriftungen gehörten nicht zur freigegebenen Copy,
       und „seit 2019" steht bereits in der Eyebrow. Wer sie zurückholen
       will, trägt statWines/statRegions/statSince wieder ein — die
       Komponente rendert die Zeile dann von selbst. */
    ctaContact: "Persönliche Beratung anfragen",
    /* Alternativtext des Hero-Fotos (Brief §7) */
    photoAlt: "Maria-Maria-Weinflasche und Rotweinglas vor Reben mit Blick auf die Mittelmeerküste",
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
    /* Brief §4, „Contatore": drei Weinherkünfte — nie „vier Regionen". */
    description: "Neun Weine aus drei ausgewählten Weinherkünften – jeder mit eigener Geschichte.",
  },

  origins: {
    title: "Zwei Seelen,",
    titleAccent: "ein Name",
    /* Brief §3, „Storia breve" — ein Absatz statt der früheren zwei. */
    paragraphs: [
      "Maria Maria beginnt im Salento, im Sommer 2019. An einem Tisch mit Freunden, zwei Frauen namens Maria und einem Önologen entstand die Idee für eine persönliche Auswahl italienischer Weine.",
    ],
    /* Ortsnamen der Reise — in allen Sprachen die jeweils gebräuchliche Form. */
    journey: ["Salento", "Apulien", "Kampanien", "Gardasee"],
    quote: "„Italian wine, personal selection, share the pleasure.“",
    /* Brief §6: der Link auf /geschichte hieß „Magazin" — er führt aber
       zur Markengeschichte, nicht ins Magazin. */
    cta: "Unsere Geschichte entdecken",
  },

  /* Brief §4 — die drei Weinherkünfte. Apulien und Kampanien sind
     Verwaltungsregionen, der Gardasee ist eine Weinregion (südliches
     Gardaseegebiet, Lombardei): deshalb „Weinherkünfte", nie „vier
     Regionen". Je Karte genau eine H3 und ein Bild mit Alt-Text. */
  regions: {
    eyebrow: "Herkunft",
    title: "Drei italienische Weinherkünfte, drei unverwechselbare Handschriften",
    description:
      "Unsere neun Weine führen von Apulien über Kampanien bis in das südliche Gardaseegebiet. Jede Herkunft steht für eigene Rebsorten, Landschaften und Menschen – persönlich ausgewählt für Maria Maria.",
    cta: "Alle Regionen",
    /* Rückfall-Beschriftung, falls eine Karte keine eigene CTA trägt */
    detailCta: "Mehr entdecken",
    items: {
      apulien: {
        name: "Apulien",
        tag: "Das Herz des Südens",
        long: "Sonnenverwöhnte Weine mit Wärme, Frucht und mediterranem Charakter – darunter unsere Primitivo- und Rosato-Auswahl.",
        cta: "Apulien entdecken",
        alt: "Trulli und Olivenbäume in Apulien",
      },
      kampanien: {
        name: "Kampanien",
        tag: "Zwischen Vulkan und Meer",
        long: "Mineralische, charaktervolle Weine aus Süditalien – geprägt von Rebsorten wie Greco, Falanghina und Aglianico.",
        cta: "Kampanien entdecken",
        alt: "Weinberge an der kampanischen Küste mit Vesuv",
      },
      garda: {
        name: "Gardaseegebiet (Lombardei)",
        tag: "Eleganz des Nordens",
        long: "Elegante, frische Weine aus dem südlichen Gardaseegebiet – mit Lugana DOC als klarer Herkunftsreferenz.",
        cta: "Weine vom Gardasee entdecken",
        alt: "Weinberge am Gardasee in der Lombardei",
      },
    },
  },

  /* Brief §5 — die drei Conversion-Segmente. Die CTAs führen auf
     /kontakt?anliegen=… und belegen dort das Anliegen im Formular vor
     (components/kontakt/intents.js); die Ziele stehen im Code. */
  segments: {
    title: "Persönlich ausgewählt – für Ihren Genuss, Ihr Sortiment und Ihren Anlass",
    intro:
      "Ob für Ihr Restaurant, Ihr Sortiment oder eine besondere Veranstaltung: Wir beraten persönlich und stellen eine Auswahl zusammen, die zu Konzept, Gästen und Anlass passt.",
    /* Local proof — die Zeile unter den drei Karten */
    proof: "Persönliche Beratung aus Mettmann bei Düsseldorf – in Nordrhein-Westfalen und darüber hinaus.",
    items: {
      gastronomie: {
        title: "Gastronomie & Feinkost",
        text: "Persönlich ausgewählte italienische Weine für Restaurants, Cafés, Weinbars und Feinkostläden – passend zu Küche, Stil und Gästen.",
        cta: "Sortiment für Gastronomie anfragen",
      },
      handel: {
        title: "Handel & Wiederverkauf",
        text: "Charaktervolle Weine mit nachvollziehbarer Herkunft und persönlicher Beratung für ausgewählte Handelspartner und Wiederverkäufer.",
        cta: "Handelspartnerschaft besprechen",
      },
      events: {
        title: "Events & Verkostungen",
        text: "Individuelle Weinauswahl für private Feiern, Firmenevents und geführte Verkostungen in Düsseldorf, Nordrhein-Westfalen und darüber hinaus.",
        cta: "Event oder Verkostung anfragen",
      },
    },
  },

  shopBand: {
    eyebrow: "Der offizielle Shop",
    title: "Bereit für den Geschmack, der",
    titleAccent: "Sie inspiriert?",
    /* Terra Vera ist der offizielle externe Shop — kein Versprechen eines
       Direktversands vom Weingut (Brief §3). */
    text: "Entdecken und bestellen Sie die Maria-Maria-Weine bequem über unseren offiziellen Onlineshop bei Terra Vera.",
    primary: "Zum offiziellen Shop",
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
