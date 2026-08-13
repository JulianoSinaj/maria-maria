/* Shop-Seite /shop — Hero, USP-Leiste, Probierpakete, Sortiment,
   Le Origini, Geschenkmomente, Service und Service-FAQ.

   Badges, Auflagen und die Beschreibungen der Probierpakete liegen NICHT
   hier, sondern in common.shop: der Warenkorb läuft auf jeder Seite mit und
   baut seine Unterzeilen daraus. „Enoteca Maria Maria", „Share the pleasure."
   und die Paketnamen sind Marken-Setzungen und bleiben stehen. */

export const shop = {
  hero: {
    eyebrow: "Der offizielle Shop",
    lede: "Italienischer Wein, persönlich ausgewählt: Boutique-Weine in limitierter Auflage, entstanden in direkter Zusammenarbeit mit lokalen Familien und Önologen. Ab 69 € liefern wir versandkostenfrei.",
    ctaDiscover: "Jetzt entdecken",
    ctaBundles: "Probierpakete",
    statWines: "Boutique-Weine",
    statRegions: "Regionen Italiens",
    statDeliveryValue: "1–3",
    statDelivery: "Werktage Lieferzeit",
    /* die drei Vertrauens-Chips an der Flaschenbühne */
    chipShipping: "Versandkostenfrei ab 69 €",
    chipPayment: "Sicher bezahlen",
    chipPacking: "Sorgfältig verpackt",
  },

  usps: {
    delivery: "Versand in 1–3 Werktagen",
    packaging: "Bruchsicher & elegant verpackt",
    payment: "Sichere Bezahlung",
    card: "Grußkarte auf Wunsch inklusive",
  },

  bundles: {
    eyebrow: "Probierpakete",
    title: "Italien im Paket",
    titleAccent: "entdecken",
    description:
      "Kuratierte Pakete zum Vorteilspreis – der schönste Weg, Maria Maria kennenzulernen. Das große Paket reist versandkostenfrei.",
  },

  assortment: {
    eyebrow: "Das Sortiment",
    title: "Die Maria Maria",
    titleAccent: "Selection",
    description:
      "Entdecken Sie die ganze Selection – corposo, elegante und fresco. Jede Flasche eine persönliche Auswahl.",
  },

  origins: {
    title: "Zwei Seelen,",
    titleAccent: "ein Name",
    paragraphs: [
      "Maria Maria beginnt im Salento, im Sommer 2019 – zwischen Kindheitserinnerungen und alten Rebzeilen wurde aus einem Moment eine Erleuchtung: Wein ist für uns kein Getränk, sondern ein Katalysator für Emotionen.",
      "Der Name trägt zwei Frauen in sich – die Gegenwart und den Ursprung. Jede Flasche verbindet beide Seelen zu einem eigenen Charakter.",
    ],
    quote: "„Italian wine, personal selection, share the pleasure.“",
    craft: {
      amphora: {
        title: "Terrakotta-Amphoren",
        text: "Ausbau nach traditioneller Handwerkskunst – Wein, der in Terrakotta-Amphoren reift, gewinnt Tiefe und Charakter.",
      },
      direct: {
        title: "Direkte Zusammenarbeit",
        text: "Keine große Distribution: Unsere Weine entstehen gemeinsam mit lokalen Familien und Önologen vor Ort.",
      },
      limited: {
        title: "Limitierte Auflagen",
        text: "Vom Primitivo 14,5 existieren nur 18.000 Flaschen, vom Primitivo 15,5 sogar nur 12.000 – Exklusivität ab dem Weinberg.",
      },
    },
  },

  gift: {
    badge: "Geschenkmomente",
    eyebrow: "Verschenken",
    title: "Wein sagt mehr als",
    titleAccent: "tausend Worte",
    text: "Ob Dankeschön, Einladung oder besonderer Anlass – eine Flasche Maria Maria ist ein Geschenk mit Herkunft und Geschichte. Wir kümmern uns um den Rest.",
    photoAlt: "Elegant verpackte Weinflasche als Geschenk mit Grußkarte",
    points: [
      "Persönliche Grußkarte mit Ihren Zeilen",
      "Elegante Geschenkverpackung",
      "Versand direkt an den Beschenkten",
    ],
    ctaPrimary: "Paket verschenken",
    ctaSecondary: "Persönlich beraten lassen",
  },

  service: {
    eyebrow: "Gut zu wissen",
    title: "Sorglos bestellen",
    description: "Bestellen ohne offene Fragen – Versand, Bezahlung und Beratung auf einen Blick.",
    cards: {
      shipping: {
        title: "Versand & Lieferung",
        text: "Ihre Weine verlassen unser Lager sorgfältig verpackt und erreichen Sie in 1–3 Werktagen – ab 69 € versandkostenfrei.",
        link: "Fragen zum Versand",
      },
      payment: {
        title: "Sichere Bezahlung",
        text: "Bezahlen Sie bequem und sicher – alle gängigen Zahlungsarten, SSL-verschlüsselt und ohne Umwege.",
        link: "Mehr im FAQ",
      },
      advice: {
        title: "Persönliche Beratung",
        text: "Unsicher, welcher Wein passt? Wir beraten Sie persönlich – für Ihren Moment, Ihr Menü oder Ihr Geschenk.",
        link: "Kontakt aufnehmen",
      },
    },
  },

  band: {
    eyebrow: "Die sensorische Reise",
    title: "Vom Salento bis zum",
    titleAccent: "Gardasee",
    text: "Unsere Selection zeichnet eine Reise durch Italien – vom sonnigen Süden Apuliens über Kampanien hinauf ans Ufer des Gardasees.",
    primary: "Unsere Weine",
    secondary: "Regionen entdecken",
  },

  faq: {
    eyebrow: "Häufige Fragen",
    title: "Fragen zur",
    titleAccent: "Bestellung.",
    description:
      "Versand, Bezahlung, Geschenke und persönliche Beratung — alles Wichtige vor dem Checkout, kurz und verbindlich beantwortet.",
    footerLabel: "Ihre Frage ist nicht dabei? Kontakt aufnehmen",
  },
};

export default shop;
