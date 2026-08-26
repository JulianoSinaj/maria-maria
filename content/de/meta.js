/* Suchmaschinen-Texte je Seite.

   Bewusst getrennt vom Seiteninhalt: Titel und Description sind eigene
   Textsorten mit eigenen Längenbudgets (~60 bzw. ~155 Zeichen) und werden
   anders gepflegt als Fließtext. Wer eine Description kürzt, will selten
   gleichzeitig die H1 ändern.

   Der Marken-Suffix („— Maria Maria") kommt aus dem title.template im
   Root-Layout und steht deshalb hier NICHT dabei. Ausnahme ist `absolute`
   bei /, /regionen und /kontakt, wo der Titel die Marke schon selbst trägt. */

export const meta = {
  siteTitle: "Maria Maria — Il piacere del vino",
  siteDescription: "Italienische Boutique-Weine für bewusst gewählte Genussmomente.",
  /* Beschreibung der Organisation im JSON-LD-Graphen (lib/seo/jsonLd) —
     liegt hier, weil sie auf jeder Sprachfassung mitgeliefert wird. */
  orgDescription:
    "Persönlich kuratierte italienische Boutique-Weine aus Apulien, Kampanien und vom Gardasee.",

  home: {
    /* Homepage SEO – Developer Brief (24.08.2026), §2 — unverändert
       übernehmen. `titleAbsolute`, weil der Titel die Marke selbst führt:
       Mit dem title.template stand vorher „Maria Maria — Il piacere del
       vino — Maria Maria" im Tab und in der Ergebniszeile. */
    titleAbsolute: "Italienische Boutique-Weine in Deutschland | Maria Maria",
    description:
      "Persönlich kuratierte Boutique-Weine aus Apulien, Kampanien und dem Gardaseegebiet – für Genuss, Gastronomie, Handel und besondere Anlässe.",
  },

  collection: {
    title: "Unsere Weine",
    description:
      "Handverlesene italienische Boutique-Weine von kleinen Weingütern – Rotwein, Weißwein und Rosé aus Apulien, Kampanien und vom Gardasee.",
  },

  shop: {
    title: "Shop",
    description:
      /* Der englische Markenclaim stand vorher an erster Stelle und belegte
         die 51 Zeichen, die in einem Suchergebnis am meisten wiegen —
         während „Online-Shop", „Boutique-Weine" und „versandkostenfrei",
         also die Wörter, nach denen auf Deutsch gesucht wird, hinten
         standen und abgeschnitten wurden. Reihenfolge getauscht, Claim
         bleibt erhalten. */
      "Der offizielle Maria Maria Online-Shop: Boutique-Weine in limitierter Auflage und Probierpakete, ab 69 € versandkostenfrei. Italian wine, personal selection.",
  },

  geschichte: {
    title: "Unsere Geschichte",
    description:
      /* 241 Zeichen vorher — Google zeigt rund 155 und schnitt mitten im
         Satz ab, ausgerechnet vor „persönlich ausgewählte italienische
         Weine". Gekürzt auf dieselbe Aussage in einem Satz, der ganz
         angezeigt wird. */
      "Zwei Frauen, zwei Generationen, eine Haltung zum Wein: von Lizzano im Salento über Irpinien und den Gardasee nach Düsseldorf — seit 2019 in Deutschland.",
    keywords: [
      "Maria Maria",
      "Geschichte",
      "italienische Weine",
      "Salento",
      "Lizzano",
      "Lago di Garda",
      "Kampanien",
      "Düsseldorf",
    ],
    ogImageAlt:
      "Maria-Maria-Flasche mit Rotweinglas und Oliven auf einer sonnigen Steinterrasse",
  },

  magazin: {
    title: "Magazin",
    description:
      "Weinwissen, Food Pairing, Regionen und Geschichten aus der Welt von Maria Maria — Inspiration für den nächsten Genussmoment.",
    keywords: [
      "Weinmagazin",
      "Weinwissen",
      "Food Pairing",
      "italienische Weine",
      "Genussmomente",
      "Maria Maria",
    ],
    ogImageAlt: "Winzer prüft ein Glas Rotwein zwischen Barriquefässern im Keller",
  },

  regionen: {
    /* trägt die Marke selbst — wird als `title.absolute` gesetzt */
    titleAbsolute: "Weinregionen: Apulien, Kampanien & Lugana | Maria Maria",
    description:
      "Entdecken Sie ausgewählte Weine aus Apulien, Kampanien und dem Lugana-Gebiet am Gardasee – mit Rebsorten, Herkunft, Geschmack und Food-Pairing-Tipps.",
  },

  kontakt: {
    /* Titel und Description nach dem freigegebenen SEO-Paket des Handoffs
       (§3). Der alte Titel war das blosse Wort „Kontakt“ — er beschrieb das
       Formular, nicht das Geschäft dahinter, und ließ in der Ergebniszeile
       vierzig Zeichen ungenutzt. Die Seite qualifiziert seit dem Relaunch
       vier kommerzielle Anliegen; genau die stehen jetzt im Titel.

       `titleAbsolute`, weil das Muster des Handoffs die Marke selbst trägt
       („… | Maria Maria“) — das title.template hängte sonst ein zweites Mal
       „— Maria Maria“ an. 67 Zeichen: Google schneidet im Zweifel hinten den
       Markennamen ab, und das ist die richtige Stelle dafür — die Suchwörter
       stehen alle in den ersten 53. */
    titleAbsolute: "Kontakt: Italienische Weine für Gastronomie | Maria Maria",
    description:
      /* Die alte Description stammte aus der Zeit vor dem Relaunch und nannte
         nur Verkostungen und Händleranfragen — Gastronomie, Feinkost und
         Events, also drei der vier Anliegen der Seite, fehlten darin. */
      "Italienische Boutique-Weine für Gastronomie, Feinkost, Handel, Events und Verkostungen in Düsseldorf & NRW. Persönliche Beratung und individuelle Weinauswahl.",
  },

  agb: {
    title: "AGB",
    description: "Allgemeine Geschäftsbedingungen für Bestellungen im Maria Maria Online-Shop.",
  },

  datenschutz: {
    title: "Datenschutzerklärung",
    description:
      "Informationen zur Verarbeitung personenbezogener Daten auf maria-maria.de gemäß DSGVO.",
  },

  impressum: {
    title: "Impressum",
    description: "Impressum und Anbieterkennzeichnung der Maria Maria Wines GmbH, Mettmann.",
  },

  /* Die neun Produktseiten. Anders als oben stehen hier keine fertigen
     Sätze, sondern Vorlagen: Name, Jahrgang, Weinart, Region, Charakterworte,
     Speiseempfehlung und Preis setzt lib/seo/wine.js aus dem übersetzten
     Katalog ein. Neun Weine × vier Sprachen wären sonst 36 handgepflegte
     Descriptions, die beim ersten Preiswechsel auseinanderlaufen.

     Der Markenname fehlt im `title` absichtlich — den hängt das
     title.template des Root-Layouts an. */
  wine: {
    /* Der Weinname steht vorn: Er ist das Suchwort, und wenn Google die
       Zeile abschneidet, fällt hinten der Markenname weg statt vorn der
       Name des Weins. */
    title: "{name} {year} · {type} · {region}",
    description: "{name} ({year}) — {type}, {region}. {notes}. {pairing}",
    /* Der Preissatz ist ABTRENNBAR: lib/seo/wine.js hängt ihn nur an, wenn
       die Description damit im Budget bleibt. Er fällt als Erstes, weil der
       Preis ohnehin im Offer-Markup steht — anders als Charakter und
       Speiseempfehlung, die es nirgendwo sonst gibt. */
    descriptionPrice: "Für {price} bei Maria Maria.",
    ogImageAlt: "Flasche {name} von Maria Maria — {type}, {region}",
  },

  notFound: {
    title: "Seite nicht gefunden",
  },
};

export default meta;
