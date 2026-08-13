/* Die Gespräche — redaktionelle Langstrecke des Magazins.

   Ein Interview lebt an genau EINER Stelle: hier. Daraus speisen sich drei
   Oberflächen, ohne dass der Fließtext irgendwo ein zweites Mal steht —

     1. die Artikelseite   /magazin/interviews/<slug>   (der Kanonische)
     2. die Karte im Magazin       (components/magazin/InterviewSection)
     3. der Teaser auf /regionen   (components/regionen/InterviewTeaser)

   Genau das verlangt der Handoff „Interview Daniele Malavasi" (Maria Pia
   Tolo, 12.08.2026, Seite 2): ein Artikel, zwei Teaser, eine kanonische URL.
   Die beiden Teaser tragen deshalb eigene, kurze Felder (`teaserMagazin`,
   `teaserRegion`) — sie sind Anmoderationen, keine Auszüge. Wer den Artikel
   ändert, muss die Teaser bewusst nachziehen; das ist Absicht, denn ein
   automatisch gekürzter Anfang liest sich in einer Karte fast immer falsch.

   Der Slug ist in allen vier Sprachen derselbe. Die Sprache steht im Präfix
   (/it/magazin/interviews/…), nicht im Slug — sonst zerfiele die hreflang-
   Gruppe in vier unverbundene Adressen.

   Feldreferenz
   ------------
   slug          Schlüssel und URL-Segment, in allen Sprachen gleich
   eyebrow       Rubrikzeile über der H1
   badge         Herkunfts-Chip (Appellation · Rebsorte · Ort)
   name          Name der Person — steht in der H1 vor dem Doppelpunkt
   headline      der Titel OHNE Namen (die Karten setzen ihn allein)
   deck          Vorspann unter der H1, zugleich der OG-Teaser
   byline        { interview, editorial, date, readingTime }
   portrait      { src, alt } — Aufmacher und Kartenbild
   intro         Absätze vor dem ersten H2
   sections      [{ id, heading, paragraphs, quote?, media?, list? }]
   pairing       { heading, paragraphs, items } — „Lugana am Tisch"
   profile       { name, role, text, link } — Kasten am Fuß des Artikels
   paths         die drei Schlusswege (Wein, Region, Food Pairing)
   wine          Slug des Weins für das Abschlussband
   teaserMagazin { eyebrow, badge, title, teaser, meta, cta }
   teaserRegion  { region, eyebrow, title, paragraphs, pull, ctas }
   draft         true = erscheint nirgends (weder Karte noch Route)

   OFFEN (Handoff Seite 23, vor dem Go-live zu klären):
   - Freigabe der deutschen Fassung und der beiden Zitate durch Daniele
   - Veröffentlichungsdatum → `byline.date` ist bis dahin null
   - Originalfoto: `portrait.src` ist derzeit ein Ausschnitt aus dem
     Regionen-Mockup, kein geliefertes Bild. Ebenso fehlt das im Handoff
     (Seite 11) beschriebene Motiv „Maria Pia Tolo und Daniele Malavasi". */

const interviews = {
  /* Rubrik-Kopf im Magazin — die Sektion trägt diesen Titel schon heute. */
  section: {
    eyebrow: "Interviews · Im Gespräch",
    title: "Menschen hinter dem Wein",
    description:
      "Winzerinnen, Kellermeister und Erzeuger erzählen von ihrer Region, ihrem Handwerk und davon, was einen Wein wirklich ausmacht.",
  },

  /* Beschriftungen der Artikelseite und des Lesefensters. */
  ui: {
    magazin: "Magazin",
    interviews: "Interviews",
    interview: "Interview",
    editorial: "Redaktion",
    readingProgress: "Lesefortschritt",
    close: "Gespräch schließen",
    readDirectly: "Artikel direkt lesen",
    aboutPerson: "Über den Gesprächspartner",
    continueReading: "Weiterlesen",
    tasted: "Im Gespräch verkostet",
  },

  items: [
    {
      slug: "daniele-malavasi-lugana-doc",
      draft: false,

      eyebrow: "Maria Maria × Lago di Garda · Im Gespräch",
      badge: "Lugana DOC · Turbiana · Pozzolengo",
      name: "Daniele Malavasi",
      headline: "Lugana entsteht aus dem Terroir, nicht aus dem Etikett",
      deck: "Von Pozzolengo bis zum Gardasee: Daniele Malavasi erklärt, wie Moränenböden, das milde Seeklima und die Turbiana den Lugana prägen – und warum dieser Wein am Tisch weit mehr kann als nur Aperitif.",

      /* Suchergebnis-Zeile — Handoff Seite 12. Der Markenname steht hier
         NICHT dabei: das title.template des Root-Layouts hängt „ — Maria
         Maria" ohnehin an. Der Handoff notiert „| Maria Maria"; die Seite
         führt seit jeher den Gedankenstrich, deshalb bleibt es bei ihm. */
      seo: {
        title: "Daniele Malavasi über Lugana DOC & Terroir",
        description:
          "Daniele Malavasi erklärt, wie Turbiana, Moränenböden und das Klima am Gardasee den Lugana DOC prägen – und warum er mehr als Aperitif ist.",
      },

      byline: {
        interview: "Maria Pia Tolo",
        editorial: "Maria Maria",
        /* Handoff Seite 23: Datum MANCANTE. Bleibt null, bis die Redaktion
           es setzt — die Byline blendet den Punkt dann still aus, statt
           „[Datum ergänzen]" zu veröffentlichen. */
        date: null,
        readingTime: "6 Min. Lesezeit",
      },

      portrait: {
        src: "/img/magazin/interviews/daniele-malavasi.jpg",
        alt: "Daniele Malavasi mit einem Glas Lugana und seinem Hund zwischen den Rebzeilen seines Weinbergs in Pozzolengo",
      },

      intro: [
        "Manche Weine versteht man nicht allein über eine Rebsorte oder ein Etikett. Man versteht sie, wenn man den Ort kennt, an dem sie entstehen – und die Menschen, die dort jeden Tag Entscheidungen treffen. Für Daniele Malavasi beginnt die Geschichte des Lugana deshalb nicht im Glas, sondern in Pozzolengo: in den lehmigen Moränenböden südlich des Gardasees, in der Turbiana und in einem Klima, das dem Wein Zeit gibt, seinen eigenen Charakter zu entwickeln.",
        "Daniele ist Inhaber der Cantina Malavasi in Pozzolengo. Seine Perspektive verbindet tägliche Arbeit im Weinberg mit einer langjährigen Beziehung zu Maria Maria. Im Gespräch erzählt er, warum Vertrauen die Grundlage der Zusammenarbeit ist, weshalb Authentizität wichtiger bleibt als jede Mode und warum Lugana als ernsthafter Speisenbegleiter neu entdeckt werden sollte.",
      ],

      sections: [
        {
          id: "vertrauen",
          heading: "Eine Zusammenarbeit, die mit Vertrauen beginnt",
          paragraphs: [
            "Was Daniele vom Projekt Maria Maria überzeugt hat, war zunächst keine Marketingidee, sondern eine über Jahre gewachsene Verbindung zu Maria und Valerio. Aus persönlichem Vertrauen wurde eine Zusammenarbeit, die sich nach seiner Einschätzung für beide Seiten stetig weiterentwickelt hat.",
            "Zu dieser gemeinsamen Geschichte gehört auch eine sehr persönliche Erinnerung: seine Mutter Ames. Sie empfing Maria und Valerio stets mit großer Herzlichkeit. Für Daniele ist diese Gastfreundschaft bis heute Teil der Verbindung – und ein Beleg dafür, dass das Verhältnis lange vor diesem Interview bestand.",
            "Doch Nähe allein erklärt seine Entscheidung nicht. Entscheidend war für ihn auch die Art, wie Maria Maria Wein erzählen möchte: nicht als isoliertes Produkt, sondern als Ergebnis eines konkreten Umfelds.",
          ],
          /* Zitat 1 von zwei — Handoff Seite 9: „Massimo due, tradotte e
             approvate da Daniele." */
          quote:
            "Maria Maria wählt nicht nur ein Produkt aus, sondern auch den Kontext, aus dem es entsteht: den Gardasee, die Lugana und die Menschen, die dort jeden Tag arbeiten.",
          after: [
            "So wird aus der Auswahl eines Weins eine bewusste Entscheidung für einen Ort, eine Arbeitsweise und die Menschen dahinter.",
          ],
        },
        {
          id: "authentizitaet",
          heading: "Authentizität vor Mode",
          paragraphs: [
            "Unter den Werten von Maria Maria erkennt Daniele vor allem zwei wieder: Authentizität und eine Auswahl mit klaren Kriterien. In seiner Arbeit in der Cantina folgt er demselben Prinzip. Wenige, bewusste Entscheidungen sollen Rebsorte und Boden sichtbar lassen, statt sie hinter einem inszenierten Bild verschwinden zu lassen.",
            "Für ein Weinprojekt, das italienische Regionen einem Publikum in Deutschland näherbringen möchte, ist dieser Gedanke zentral. Authentizität entsteht nicht durch romantische Behauptungen über Italien, sondern durch nachvollziehbare Auswahl: Wer erzeugt den Wein? Wo wachsen die Trauben? Welche Eigenschaften kommen aus dem Gebiet – und welche Entscheidungen prägen den Stil?",
            "Daniele fasst diese Haltung knapp zusammen: Der Ort soll deutlicher sprechen als die Technik im Keller.",
          ],
        },
        {
          id: "terroir",
          heading: "Was den Lugana im Glas erkennbar macht",
          media: {
            src: "/img/magazin/interviews/terroir-pozzolengo.jpg",
            alt: "Weinberge bei Pozzolengo mit Blick über die Moränenhügel bis zum Gardasee",
            caption:
              "Die Weinberge von Pozzolengo und der Blick über die Moränenhügel bis zum Gardasee.",
          },
          paragraphs: [
            "Das Gebiet des Lugana liegt südlich des Gardasees zwischen der Lombardei und Venetien. Pozzolengo gehört zu den Gemeinden der geschützten Herkunftsbezeichnung. Für Daniele entsteht die besondere Identität des Weins aus dem Zusammenspiel von Böden, See und Rebsorte.",
            "Die lehmigen Böden sind moränischen Ursprungs und wurden durch die geologische Geschichte des Gebiets geprägt. Gleichzeitig beeinflusst die Nähe zum Gardasee das Klima. Daniele beschreibt den See als Wärmespeicher: Im Sommer nimmt er Wärme auf und gibt sie in Herbst und Winter wieder ab. Dadurch werden starke Temperaturschwankungen gemildert und die Reifephase kann sich verlängern.",
            "Auch der Lehm übernimmt eine wichtige Funktion. Er hält Wasser zurück und trägt nach Danieles Erfahrung zu Struktur und einer deutlich wahrnehmbaren salzigen Spannung im Wein bei. Die Lage und Ausrichtung der einzelnen Weinberge beeinflussen wiederum die aromatische Feinheit.",
            "Im Zentrum steht die Turbiana, die charakteristische Rebsorte des Lugana DOC. Im Glas sucht Daniele nicht nach vordergründiger Wirkung, sondern nach Balance: zwischen Säure und salziger Spannung, zwischen sauberer Frucht und einem trockenen, präzisen Eindruck. Ein überzeugender Lugana soll für ihn nicht zuerst von Kellertechnik erzählen, sondern von seinem Gebiet.",
          ],
          /* Die vier Merkmale sind kein zusätzlicher Inhalt, sondern die
             Kurzfassung des Absatzes darüber — im Mockup (Seite 5 des
             Handoffs) als Merkzeile neben dem Fließtext gesetzt. */
          list: {
            label: "Woran Daniele einen überzeugenden Lugana erkennt",
            items: [
              "Balance zwischen Säure und salziger Spannung",
              "Saubere Frucht ohne vordergründige Süße",
              "Struktur aus den lehmigen Moränenböden",
              "Ein Wein, der vom Ort erzählt statt von der Kellertechnik",
            ],
          },
        },
        {
          id: "mehr-als-aperitif",
          heading: "Mehr als ein frischer, unkomplizierter Weißwein",
          media: {
            src: "/img/magazin/interviews/turbiana-trauben.jpg",
            alt: "Reife Turbiana-Trauben an der Rebe in einem Weinberg bei Pozzolengo",
            caption: "Turbiana — die charakteristische Rebsorte des Lugana DOC.",
          },
          paragraphs: [
            "Wird Lugana nur als frischer, leicht zugänglicher Weißwein vom Gardasee wahrgenommen, greift das für Daniele zu kurz. Diese Beschreibung lässt genau jene Eigenschaften außer Acht, die den Wein interessant machen: Struktur, Entwicklungsfähigkeit und eine klare territoriale Identität.",
            "Er würde Lugana einem deutschen Publikum deshalb als Weißwein vorstellen, der reifen und sich weiterentwickeln kann. Nicht als beliebigen „Easy Drinking“-Wein, sondern als ernsthaften Speisenbegleiter – vergleichbar in seinem Anspruch mit charaktervollen Weißweinen, die viele deutsche Weintrinker bereits schätzen.",
            "Diese Perspektive verändert auch den Moment des Genusses. Der Wein muss nicht auf Terrasse, Sommer und Aperitif begrenzt bleiben. Seine Säure, Struktur und salzige Spannung eröffnen ihm einen festen Platz am Esstisch.",
          ],
          /* Zitat 2 von zwei. */
          quote:
            "Lugana ist nicht nur ein Aperitifwein. Seine Struktur und seine salzige Spannung tragen auch anspruchsvollere Gerichte.",
        },
      ],

      pairing: {
        heading: "Lugana am Tisch: vom Gardasee bis zur italienischen Küche",
        media: {
          src: "/img/magazin/interviews/lugana-risotto.jpg",
          alt: "Cremiges Risotto mit Gardasee-Fisch, Zitrone und Kräutern neben einem Glas Lugana",
        },
        paragraphs: [
          "Bei der Speisenbegleitung beginnt Daniele dort, wo auch der Wein beginnt: am Gardasee. Zu seinen Empfehlungen gehören heimische Süßwasserfische wie Lavarello und getrocknete Sardinen sowie fein abgestimmte Risotti.",
          "Gleichzeitig kann Lugana mehr Gewicht aufnehmen, als viele erwarten. Daniele nennt Baccalà mantecato – cremig aufgeschlagenen Stockfisch – und weißes Fleisch mit einer leichten Sauce. Entscheidend ist dabei nicht die Schwere eines Gerichts allein, sondern das Zusammenspiel von Textur, Würze und der salzigen Frische des Weins.",
          "Für Maria Maria ist dieser Hinweis besonders wertvoll: Food Pairing wird damit nicht zur dekorativen Ergänzung eines Produkts, sondern zu einer verständlichen Übersetzung des Weins in den Alltag. Wer erlebt, wie sich ein Lugana zu einem Risotto, Fischgericht oder hellem Fleisch verändert, versteht seine Vielseitigkeit unmittelbarer als über technische Daten allein.",
        ],
        items: [
          {
            icon: "fish",
            title: "Fisch aus dem Gardasee",
            text: "Lavarello und getrocknete Sardinen.",
          },
          { icon: "risotto", title: "Risotto", text: "Fein abgestimmte, delikate Risotti." },
          {
            icon: "stockfish",
            title: "Baccalà mantecato",
            text: "Cremig aufgeschlagener Stockfisch.",
          },
          { icon: "poultry", title: "Helles Fleisch", text: "Mit einer leichten Sauce." },
        ],
      },

      serving: {
        heading: "Der häufigste Fehler: zu kalt servieren",
        paragraphs: [
          "Ein Lugana kann viel von seinem Ausdruck verlieren, wenn er zu kalt ins Glas kommt. Daniele bezeichnet das als einen der häufigsten Fehler beim Servieren. Zu niedrige Temperatur glättet gerade jene Eigenschaften, die den Wein prägen sollen: seine salzige Spannung, die mineralisch wirkende Frische und die aromatische Feinheit.",
          "Der zweite Fehler folgt oft direkt daraus: den Wein ausschließlich als Aperitif zu behandeln. Wer ihn nur sehr kalt und vor dem Essen serviert, nimmt ihm die Gelegenheit, seine Struktur in Verbindung mit komplexeren Gerichten zu zeigen.",
          "Die Empfehlung ist daher keine starre Temperaturzahl, sondern ein bewusster Umgang: kühl servieren, aber nicht so kalt, dass der Wein verschlossen bleibt. Im Glas darf er Zeit bekommen, sich zu öffnen.",
        ],
      },

      outro: {
        heading: "Ein genau bestimmter Ort – kein beliebiger Weißwein",
        paragraphs: [
          "Was soll das Publikum von Maria Maria nach diesem Gespräch mitnehmen? Für Daniele vor allem eine Erkenntnis: Hinter einem Lugana steht ein präzise bestimmtes Gebiet. Er ist kein generischer Weißwein aus Norditalien, sondern Ausdruck eines Zusammenspiels aus Turbiana, moränisch geprägten Böden, Seeklima und täglicher Arbeit.",
          "Es lohnt sich deshalb, Lugana mit derselben Neugier zu begegnen, die man den großen Weißweinen Europas entgegenbringt. Nicht weil jeder Lugana gleich sein muss, sondern gerade weil Herkunft, Weinberg und Entscheidungen Unterschiede sichtbar machen können.",
          "Auch seine zukünftige Rolle bei Maria Maria versteht Daniele in diesem Sinn. Er möchte den Blick eines Produzenten einbringen, der das Gebiet täglich erlebt – und dadurch nicht nur über Wein sprechen kann, sondern über die Menschen und Entscheidungen, die hinter ihm stehen.",
          "Für Maria Maria schließt sich damit der Kreis: Das Etikett macht einen Wein erkennbar. Seine Bedeutung entsteht jedoch dort, wo Boden, Klima, Rebsorte und Menschen zusammenkommen.",
        ],
      },

      profile: {
        name: "Daniele Malavasi",
        role: "Inhaber der Cantina Malavasi, Pozzolengo",
        text: "Die Kellerei liegt im Gebiet des Lugana, mit Weinbergen zwischen Pozzolengo und Desenzano del Garda.",
        link: { label: "Cantina Malavasi", href: "https://www.malavasivini.com/it/azienda" },
      },

      /* Der Wein des Abschlussbands — Packshot und Preis kommen aus
         components/data.js, nicht aus dem Wörterbuch. */
      wine: {
        slug: "lugana",
        heading: "Lugana DOC von Maria Maria entdecken",
        text: "Entdecken Sie den Lugana DOC von Maria Maria – vinifiziert von Daniele Malavasi in Pozzolengo. Ein Wein, der Herkunft, Rebsorte und Handwerk in Balance vereint.",
        cta: "Zum Lugana",
      },

      /* Die drei Schlusswege — Handoff Seite 17. Jede CTA ein eigenes Ziel. */
      paths: [
        {
          id: "region",
          icon: "region",
          title: "Region Gardasee",
          text: "Entdecken Sie das Terroir.",
          href: "/regionen#garda",
        },
        {
          id: "pairing",
          icon: "pairing",
          title: "Food Pairing",
          text: "Inspirationen für den Tisch.",
          href: "/magazin#food-pairing",
        },
        {
          id: "interviews",
          icon: "interviews",
          title: "Weitere Interviews",
          text: "Alle Gespräche lesen.",
          href: "/magazin#interviste",
        },
      ],

      /* ---- Teaser 1: Karte im Magazin (Handoff Seite 6) ---- */
      teaserMagazin: {
        eyebrow: "Interviews · Im Gespräch",
        badge: "Lugana DOC · Pozzolengo",
        title: "Lugana entsteht aus dem Terroir, nicht aus dem Etikett",
        teaser:
          "Über Turbiana, lehmige Moränenböden und das Klima am Gardasee – und darüber, warum Lugana am Tisch mehr kann als nur Aperitif.",
        meta: "Interview · 6 Min. Lesezeit",
        cta: "Gespräch lesen",
      },

      /* ---- Teaser 2: Box auf /regionen unter dem Gardasee-Block ----
         Handoff Seite 7. Der Text setzt beim Gebiet an, nicht bei der
         Person; die zweite CTA führt bewusst NICHT zum Artikel. */
      teaserRegion: {
        region: "garda",
        eyebrow: "Menschen & Herkunft · Lugana DOC",
        title: "Daniele Malavasi: Der Mensch hinter dem Lugana",
        paragraphs: [
          "Für Daniele beginnt Lugana nicht beim Etikett, sondern in Pozzolengo: bei Moränenböden, Turbiana, Seeklima und den Menschen, die dort arbeiten.",
        ],
        pull: "Der Wein soll eher vom Ort erzählen als von der Technik im Keller.",
        ctaPrimary: "Das Gespräch lesen",
        ctaSecondary: "Lugana entdecken",
      },
    },
  ],
};

export default interviews;
