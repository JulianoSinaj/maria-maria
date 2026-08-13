/* Gemeinsamer Rahmen: Navigation, Footer, Warenkorb, Hilfstexte.

   Dieser Abschnitt — und nur dieser — geht über den I18nProvider ins
   Client-Bundle. Er ist deshalb bewusst klein gehalten: Alles, was nur eine
   einzelne Seite braucht, liegt in der jeweiligen Seitendatei nebenan.

   Deutsch ist die Ausgangssprache. Die Formulierungen hier sind 1:1 aus den
   Komponenten übernommen — die deutsche Seite muss nach der Umstellung
   zeichengleich rendern. */

export const common = {
  /* Ziel-Pfade stehen im Code, nicht hier: Ein Wörterbuch soll Text
     enthalten, keine Routen. Der Schlüssel verbindet beide Seiten. */
  nav: {
    home: "Home",
    wines: "Unsere Weine",
    regions: "Regionen",
    magazine: "Magazin",
    contact: "Kontakt",
    shop: "Zum Shop",
    wineTypes: {
      red: "Rotweine",
      white: "Weißweine",
      rose: "Roséweine",
    },
  },

  /* Alles, was nur Screenreader und Tastatur erreichen. Wird gern vergessen
     und ist der Teil, an dem eine halbe Übersetzung am deutlichsten auffällt. */
  a11y: {
    skipToContent: "Zum Inhalt springen",
    homeLink: "Maria Maria — Startseite",
    mainNav: "Hauptnavigation",
    mobileNav: "Mobile Navigation",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    menuDialog: "Menü",
  },

  /* Das Mega-Dropdown hinter „Unsere Weine". */
  wineMenu: {
    eyebrow: "Die Kollektion",
    overview: {
      all: { label: "Alle Weine", hint: "Die komplette Kollektion" },
      bestseller: { label: "Bestseller", hint: "Was am häufigsten im Glas landet" },
      regions: { label: "Regionen Italiens", hint: "Herkunft und Terroir" },
    },
    shop: "Zum Shop",
    note: "Handverlesen von kleinen italienischen Weingütern.",
    /* {count} setzt die Komponente ein — die Zahl steht je nach Sprache an
       anderer Stelle im Satz. */
    seeAll: "Alle {count} Weine ansehen",
  },

  footer: {
    newsletter: {
      title: "Geschichten aus Italien,",
      /* kursiv gesetzter Nachsatz — im Markup ein eigenes <span> */
      titleAccent: "direkt ins Postfach",
      text: "Neuigkeiten, exklusive Angebote und Genussmomente — etwa einmal im Monat, ohne Lärm.",
      success: "Danke! Bitte bestätigen Sie Ihre Anmeldung im Posteingang.",
      emailLabel: "E-Mail-Adresse",
      placeholder: "E-Mail-Adresse eingeben",
      submit: "Anmelden",
    },
    tagline: "Italienische Boutique-Weine für bewusst gewählte Genussmomente.",
    exploreHeading: "Entdecken",
    explore: {
      wines: "Unsere Weine",
      regions: "Regionen Italiens",
      magazine: "Magazin",
      contact: "Kontakt",
    },
    contactHeading: "Kontakt",
    shopHeading: "Offizieller Shop",
    shopText: "Entdecken und bestellen Sie unsere Weine direkt im Maria Maria Shop.",
    shopLink: "Zum Shop",
    legal: {
      privacy: "Datenschutz",
      imprint: "Impressum",
      terms: "AGB",
    },
    /* Jahr und Marke setzt die Komponente ein — im Text steht nur der Rest,
       damit die Wortstellung pro Sprache frei bleibt. */
    copyright: "Maria Maria Wines — Il piacere del vino",
  },

  /* Der sichtbare Text des Weinkatalogs. Die Struktur (Preis, Jahrgang,
     typeKey, regionKey) steht in components/data.js — hier steht nur, wie
     die Schlüssel in dieser Sprache heißen.

     `notes` ist eine Liste, kein Satz: Karten setzen die Worte mit „·"
     getrennt, Fließtext braucht sie mit Konjunktion. joinList() in
     lib/i18n/format baut daraus „Intensiv, kraftvoll und ausgewogen". */
  catalogue: {
    types: { red: "Rotwein", white: "Weißwein", rose: "Roséwein" },
    typesPlural: { red: "Rotweine", white: "Weißweine", rose: "Roséweine" },
    regions: { puglia: "Apulien", campania: "Kampanien", garda: "Gardasee" },
    filters: {
      allWines: "Alle Weine",
      allRegions: "Alle Regionen",
      reset: "Zurücksetzen",
      /* Deutsch unterscheidet Singular/Plural, andere Sprachen auch — der
         Zähler wählt anhand der Anzahl. */
      wineOne: "Wein",
      wineMany: "Weine",
      byType: "Weine nach Weinart filtern",
      byRegion: "Weine nach Region filtern",
      emptyTitle: "Für diese Auswahl führen wir",
      emptyTitleAccent: "derzeit keinen Wein.",
      emptyText:
        "Probieren Sie eine andere Kombination aus Weinart und Region – oder entdecken Sie die gesamte Kollektion.",
    },
    wines: {
      "primitivo-15-5": {
        notes: ["intensiv", "kraftvoll", "ausgewogen"],
        pairing: "Zu geschmortem Fleisch, Wild und gereiftem Käse.",
      },
      lugana: {
        notes: ["elegant", "frisch", "mineralisch"],
        pairing: "Ideal zu Fisch, Pasta mit Pesto oder hellem Fleisch.",
      },
      "greco-di-tufo": {
        notes: ["strukturiert", "fein", "aromatisch"],
        pairing: "Zu Meeresfrüchten, gegrilltem Fisch und feiner Küche.",
      },
      "primitivo-14-5": {
        notes: ["weich", "vollmundig", "harmonisch"],
        pairing: "Ideal zu Pasta, Grillgerichten und reifem Käse.",
      },
      "primitivo-salento": {
        notes: ["fruchtig", "rund", "zugänglich"],
        pairing: "Unkompliziert zu Pizza, Pasta und geselligen Abenden.",
      },
      falanghina: {
        notes: ["frisch", "fruchtig", "lebendig"],
        pairing: "Perfekt zum Aperitivo, zu Meeresfrüchten oder Salaten.",
      },
      "rosato-puglia": {
        notes: ["zart", "fruchtig", "erfrischend"],
        pairing: "Herrlich zu Antipasti, Salaten oder gegrilltem Gemüse.",
      },
      "il-rosso-aglianico": {
        notes: ["tiefgründig", "würzig", "charakterstark"],
        pairing: "Ein Begleiter zu Pasta al forno, Grillfleisch und Käse.",
      },
      "il-bianco-greco-cuvee": {
        notes: ["frisch", "elegant", "ausgewogen"],
        pairing: "Ein Genuss zu Antipasti, Fisch und leichten Gerichten.",
      },
    },
  },

  /* Warenkorb — läuft site-weit mit, daher im gemeinsamen Abschnitt. */
  cart: {
    title: "Ihr Warenkorb",
    items: "Artikel",
    open: "Warenkorb öffnen",
    close: "Warenkorb schließen",
    label: "Warenkorb",
    /* {name} ersetzt die Komponente — die Wortstellung ist je Sprache anders. */
    increase: "Menge von {name} erhöhen",
    decrease: "Menge von {name} verringern",
    remove: "{name} aus dem Warenkorb entfernen",
    empty: {
      title: "Noch ganz",
      titleAccent: "leer.",
      text: "Entdecken Sie unsere Boutique-Weine und Probierpakete – Ihr Maria-Moment wartet schon.",
      cta: "Weine entdecken",
    },
    success: {
      title: "Grazie",
      titleAccent: "mille!",
      text: "Vielen Dank für Ihre Bestellung. Eine Bestätigung ist unterwegs in Ihr Postfach.",
      orderNumber: "Bestellnummer",
      cta: "Weiter stöbern",
    },
    /* {amount} wird hervorgehoben gesetzt — die Komponente teilt den Satz
       an der Marke, damit die Betonung in jeder Sprache an der richtigen
       Stelle sitzt. */
    missingForFreeShipping: "Noch {amount} bis zum kostenfreien Versand",
    freeShippingReached: "Ihre Bestellung ist versandkostenfrei",
    summary: {
      subtotal: "Zwischensumme",
      shipping: "Versand",
      free: "Kostenfrei",
      total: "Gesamt",
      vat: "inkl. MwSt.",
      checkout: "Zur Kasse",
      secure: "Sichere Bezahlung · SSL-verschlüsselt",
    },
  },

  /* Shop-Beiwerk: Badges, Auflagen, Probierpakete. Liegt im gemeinsamen
     Abschnitt, weil der Warenkorb auf jeder Seite mitläuft und die
     Unterzeilen seiner Einträge daraus baut. */
  shop: {
    badges: {
      bestseller: "Bestseller",
      limited: "Limitiert",
      popular: "Beliebt",
      summer: "Sommerwein",
    },
    edition: "{count} Flaschen",
    bottles: "{count} Flaschen",
    limitedEdition: "Limitierte Auflage · {count} Flaschen",
    scarce: "Nur noch wenige Flaschen",
    single: "Einzeln",
    save: "Sie sparen {amount}",
    bundleSub: "Probierpaket · {count} Flaschen",
    bundles: {
      "paket-trio-rosso": {
        tag: "Die Kraft des Südens",
        desc: "Drei charakterstarke Rotweine aus Apulien und Kampanien – vom weichen Primitivo bis zum würzigen Aglianico.",
      },
      "paket-grande-selezione": {
        tag: "Beliebteste Wahl",
        desc: "Sechs Weine, vier Regionen – die ganze Vielfalt Italiens in einem Paket. Versandkostenfrei zu Ihnen nach Hause.",
      },
      "paket-trio-bianco": {
        tag: "Frische & Eleganz",
        desc: "Drei elegante Weißweine vom Gardasee und aus Kampanien – mineralisch, fein und lebendig im Glas.",
      },
    },
  },

  /* Kleinteil, das in Client-Components steckt: Karten-Beschriftungen,
     Blätter-Knöpfe, Warenkorb-Labels, Bild-Alternativtexte. Alles hier ist
     entweder sichtbar oder wird vorgelesen — {name} und {side} setzt die
     jeweilige Komponente ein. */
  ui: {
    discoverWine: "Wein kennenlernen",
    wineDetails: "{name} — Details ansehen",
    bottleAlt: "Flasche {name}",
    bottleFront: "Vorderseite",
    bottleBack: "Rückseite",
    bottleFrontAlt: "Flasche {name} – Vorderseite",
    bottleBackAlt: "Flasche {name} – Rückseite",
    showSide: "{side} zeigen",
    prevWine: "Vorheriger Wein",
    nextWine: "Nächster Wein",
    prevWines: "Vorherige Weine",
    moreWines: "Weitere Weine",
    back: "Zurück",
    next: "Weiter",
    wholeCollection: "Die ganze Kollektion",
    winesLabel: "Weine",
    addToCart: "{name} in den Warenkorb legen",
    removeBottle: "Eine Flasche {name} entfernen",
    addBottle: "Eine weitere Flasche {name} hinzufügen",
    addBundle: "Paket in den Warenkorb",
    added: "Hinzugefügt",
    viewCart: "Warenkorb ansehen",
    priceNote: "Alle Preise inkl. MwSt., zzgl. Versand",
    perBottle: "/ 0,75 l",
    faqTopics: "FAQ-Themen",
    discoverMore: "Mehr entdecken",
  },

  /* Die zwei Seelen hinter dem Namen (components/SoulCards) — steht auf
     Startseite, Shop und Geschichte, deshalb im gemeinsamen Abschnitt.
     Neigung, Versatz und Reihenfolge bleiben im Code. */
  souls: {
    roots: {
      name: "Maria",
      tag: "Die Wurzeln",
      traits: ["Familie", "Gastfreundschaft", "Erinnerung"],
      desc: "In Lizzano beginnt die persönliche Geschichte hinter dem Namen – in einer Kultur, in der Wein, Essen und gemeinsam verbrachte Zeit zusammengehören.",
    },
    today: {
      name: "Maria",
      tag: "Der heutige Blick",
      traits: ["Auswahl", "Ästhetik", "Neue Perspektiven"],
      desc: "Italienische Weine bewusst auswählen, ihre Regionen erzählen und sie Menschen in verschiedenen Ländern näherbringen.",
    },
  },

  /* Sprachumschalter — neu mit der Mehrsprachigkeit. */
  language: {
    label: "Sprache",
    ariaLabel: "Sprache wählen",
    current: "Aktuelle Sprache",
  },

  /* Fehler- und Leerzustände, die überall auftauchen können. */
  errors: {
    title: "Das war nicht unser",
    titleAccent: "bester Jahrgang.",
    eyebrow: "Ein Fehler ist aufgetreten",
    text: "Etwas ist schiefgelaufen. Versuchen Sie es bitte erneut — oder kehren Sie zur Startseite zurück.",
    retry: "Erneut versuchen",
    home: "Zur Startseite",
  },

  notFound: {
    eyebrow: "Seite nicht gefunden",
    title: "Diese Flasche ist",
    titleAccent: "nicht in unserem Keller.",
    text: "Die gesuchte Seite existiert nicht oder wurde verschoben. Entdecken Sie stattdessen unsere Weine — da liegt ohnehin das Beste.",
    wines: "Unsere Weine",
    home: "Zur Startseite",
  },
};

export default common;
