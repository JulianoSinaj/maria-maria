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
      "Winzer, Weinexperten und Menschen aus den Regionen erzählen von Herkunft, Handwerk und davon, was einen Wein wirklich ausmacht.",
  },

  /* Beschriftungen der Artikelseite. */
  ui: {
    magazin: "Magazin",
    interviews: "Interviews",
    interview: "Interview",
    editorial: "Redaktion",
    aboutPerson: "Über den Gesprächspartner",
    continueReading: "Weiterlesen",
    tasted: "Im Gespräch verkostet",
    inThisConversation: "In diesem Gespräch",
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
        src: "/img/magazin/daniele-solo.jpeg",
        alt: "Daniele Malavasi mit einem Glas Lugana und seinem Hund zwischen den Rebzeilen seines Weinbergs in Pozzolengo",
        /* Ganzfigur: im 3:2-Ausschnitt der Magazin-Karte muss der Kopf oben
           hängen bleiben. Stand bis zum zweiten Gespräch als Slug-Vergleich
           in InterviewCard. */
        position: "object-top",
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
          /* Native Ratio des Fotos — zeigt das volle Bild statt des 16:9-Beschnitts. */
          aspect: "4/3",
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
        /* Für den Person-Knoten der Seite. Ein fremdes Unternehmen — es
           trägt hier nur seinen Namen. */
        worksFor: "Cantina Malavasi",
        text: "Die Kellerei liegt im Gebiet des Lugana, mit Weinbergen zwischen Pozzolengo und Desenzano del Garda.",
        link: { label: "Cantina Malavasi", href: "https://www.malavasivini.com/it/azienda" },
      },

      /* Der Wein des Abschlussbands — Preis und Ziel-Link kommen aus
         components/data.js, nicht aus dem Wörterbuch. `photo` ersetzt den
         Katalog-Freisteller durch das eigene (ebenfalls freigestellte)
         Magazin-Foto des Stücks; fehlt es, fällt das Band auf
         wine.photos.front zurück. */
      wine: {
        slug: "lugana",
        photo: {
          src: "/img/magazin/interviews/lugana-vino-bianco-magazine-cutout.png",
          alt: "Flasche Lugana DOC von Maria Maria",
        },
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
        /* Eigenes Bild für die Leiste auf /regionen: das Artikelfoto zeigt
           Daniele in Ganzfigur und wird in der schmalen Hochformat-Spalte
           winzig. Stand bis zum zweiten Gespräch als Konstante in
           InterviewTeaser. */
        portrait: { src: "/img/daniele222.jpeg" },
        eyebrow: "Stimmen aus der Region · Lugana DOC",
        title: "Echte Menschen erzählen Lugana",
        paragraphs: [
          "Was macht diesen Weißwein vom Gardasee so besonders? Daniele Malavasi erzählt von Moränenböden, Turbiana, Seeklima — und von dem Lugana, der es aus seinem Keller in die Maria-Maria-Kollektion geschafft hat.",
        ],
        pull: "Der Wein soll eher vom Ort erzählen als von der Technik im Keller.",
        ctaPrimary: "Das Gespräch lesen",
        ctaSecondary: "Lugana entdecken",
      },
    },

    {
      slug: "francesco-de-stefano-irpinien-weissweine",
      draft: false,

      /* Der Slug bleibt in allen vier Sprachen der deutsche. Die
         Master-Source (Seite 11) nennt für Italienisch zusätzlich einen
         übersetzten Pfad (/it/magazin/interviste/…-irpinia-vini-bianchi).
         Das wäre ein zweites Adressschema neben dem der übrigen Seiten:
         Hier steht die Sprache im Präfix, nie im Slug — sonst zerfiele die
         hreflang-Gruppe in vier unverbundene Adressen. Bis die Marke sich
         global umentscheidet, bleibt es beim Bestand; dieselbe Abwägung wie
         beim Schriftpaar des ersten Handoffs. */

      eyebrow: "Maria Maria × Kampanien · Im Gespräch",
      badge: "Greco di Tufo DOCG · Fiano di Avellino DOCG · Falanghina",
      name: "Francesco De Stefano",
      headline: "Drei Weißweine, drei Charaktere – was Irpinien so besonders macht",
      deck: "Von den Höhenlagen Irpiniens bis zum gedeckten Tisch: Francesco De Stefano spricht über Greco di Tufo, Fiano di Avellino und Falanghina – und darüber, warum Herkunft, Charakter und Food Pairing bei der Wahl eines Weines zusammengehören.",

      /* Das Geisterwort dieses Stücks. Danieles Gespräch handelt vom
         Terroir, dieses von einer Landschaft mit Namen. */
      ghost: "Irpinia",

      seo: {
        title: "Francesco De Stefano über Irpinien & kampanische Weißweine",
        description:
          "Greco di Tufo, Fiano di Avellino und Falanghina: Francesco De Stefano spricht über Irpinien, Food Pairing und die bewusste Wahl des Weins.",
      },

      byline: {
        interview: "Maria Pia Tolo",
        editorial: "Maria Maria",
        /* Die Master-Source nennt kein Datum. Bleibt null, bis die Redaktion
           eines setzt — die Byline blendet den Punkt dann still aus. */
        date: null,
        readingTime: "6 Min. Lesezeit",
      },

      portrait: {
        src: "/img/magazin/interviews/francesco-de-stefano.jpg",
        alt: "Francesco De Stefano schenkt im Abendlicht einen Weißwein von Maria Maria in ein Glas ein",
        position: "object-top",
      },

      intro: [
        "Wer einen Wein verstehen möchte, muss nicht nur auf die Rebsorte schauen. Herkunft, Stil, Servierweise und das Gericht am Tisch verändern, wie wir einen Wein wahrnehmen. Für Francesco De Stefano ist genau diese bewusste Auswahl entscheidend.",
        "Im Gespräch mit Maria Maria führt er durch Kampanien und besonders Irpinien. Im Mittelpunkt stehen Greco di Tufo, Fiano di Avellino und Falanghina – drei Weißweine, die für Francesco unterschiedliche Charaktere und unterschiedliche Momente am Tisch besitzen.",
      ],

      sections: [
        {
          id: "gemeinsame-werte",
          heading: "Eine Zusammenarbeit, die mit gemeinsamen Werten beginnt",
          paragraphs: [
            "Was Francesco am Projekt Maria Maria überzeugt hat, sind zunächst die Menschen dahinter. Er nennt die Hingabe an das Projekt, die Ernsthaftigkeit von Valerio und Maria und ihre Kompetenz als entscheidende Gründe für seine Bereitschaft, den Weg von Maria Maria zu begleiten.",
            "Dazu kommt eine gemeinsame Haltung: dieselbe Leidenschaft und dieselbe Suche nach Qualität, die nach Francescos Worten auch seine eigene Arbeit prägen.",
          ],
          /* Zitat 1 von zwei. Das zweite steht im Fazit. */
          quote:
            "Mich haben vor allem die Hingabe an das Projekt und die Ernsthaftigkeit beeindruckt, die Valerio und Maria zeigen.",
        },
        {
          id: "irpinien",
          heading: "Irpinien: drei DOCG in einer Provinz",
          paragraphs: [
            "Kampanien ist für Francesco seit jeher ein Symbolgebiet des italienischen Weinbaus, insbesondere im Süden Italiens. Er verweist auf eine Weintradition, die bis in die römische Zeit zurückreicht, und hebt innerhalb der Region besonders Irpinien hervor.",
            "Dass allein diese Provinz drei DOCG-Herkünfte vorweisen kann, ist für ihn ein wichtiges Zeichen für die Bedeutung und die besondere Weinbau-Eignung des Gebiets. Hinzu kommt mit Aglianico del Taburno eine weitere DOCG im Gebiet von Benevento.",
          ],
        },
        {
          id: "hoehe-und-klima",
          heading: "Was Höhe und Klima im Glas verändern",
          /* MEDIA FEHLT: Das Kapitel trägt bei Daniele ein Landschaftsfoto —
             die Master-Source verlangt denselben Bildrhythmus. Für Irpinien
             liegt noch keines vor; sobald es da ist, kommt hier ein
             `media`-Block nach dem Muster des Lugana-Stücks hinein. */
          paragraphs: [
            "Francesco führt den Charakter der Weine vor allem auf Klima und Höhenlage zurück. Beide Faktoren tragen nach seiner Erklärung zu einer höheren Säure bei. Das Ergebnis sind Weine mit mehr Struktur und einem entschiedeneren Charakter.",
            "Gerade für ein Publikum, das kampanische Weißweine neu entdeckt, ist diese Perspektive hilfreich: Nicht alle Weißweine aus dem Süden Italiens sind weich oder unkompliziert.",
          ],
        },
        {
          id: "drei-charaktere",
          heading: "Greco, Fiano und Falanghina: drei unterschiedliche Charaktere",
          paragraphs: [
            "Francesco betrachtet Greco di Tufo, Fiano di Avellino und Falanghina nicht als austauschbare Varianten. Greco di Tufo beschreibt er im Vergleich als stärker mineralisch.",
            "Fiano wirkt für ihn weicher und vielseitiger und wäre seine Empfehlung für Menschen, die diese Weinstile zum ersten Mal entdecken. Falanghina zeigt in seinem Vergleich eine trockenere Tendenz und findet einen natürlichen Platz beim Aperitivo.",
          ],
          /* Wie bei Daniele kein zusätzlicher Inhalt, sondern die Merkzeile
             zum Absatz darüber. Drei Weine, drei Zeilen. */
          list: {
            label: "Wie Francesco die drei Weine unterscheidet",
            items: [
              "Greco di Tufo — im Vergleich stärker mineralisch",
              "Fiano di Avellino — weicher und vielseitiger, sein Vorschlag für den Einstieg",
              "Falanghina — trockenere Tendenz, mit einem natürlichen Platz beim Aperitivo",
            ],
          },
        },
      ],

      pairing: {
        heading: "Kampanische Weißweine am Tisch",
        /* MEDIA FEHLT — siehe Kapitel „Was Höhe und Klima im Glas
           verändern". Ein Tischmotiv aus Kampanien steht noch aus. */
        paragraphs: [
          "Fiano di Avellino würde Francesco zu einem nicht zu kräftigen Fischgericht servieren, zum Beispiel zu Garnelen oder Forelle.",
          "Greco di Tufo besitzt für ihn eine ausgeprägtere mineralische Komponente und kann deshalb etwas komplexere Fischgerichte oder weißes Fleisch begleiten. Besonders hebt er Greco di Tufo mit Mozzarella di Bufala hervor.",
          "Falanghina sieht er auch zum Aperitivo, beispielsweise zu einer Frisella mit San-Marzano-Tomaten.",
        ],
        items: [
          { icon: "fish", title: "Fiano di Avellino", text: "Zu Garnelen oder Forelle." },
          {
            icon: "stockfish",
            title: "Greco di Tufo",
            text: "Zu komplexeren Fischgerichten und weißem Fleisch.",
          },
          {
            icon: "plate",
            title: "Mozzarella di Bufala",
            text: "Die Empfehlung, die Francesco besonders hervorhebt.",
          },
          {
            icon: "glasses",
            title: "Falanghina zum Aperitivo",
            text: "Zum Beispiel zu einer Frisella mit San-Marzano-Tomaten.",
          },
        ],
      },

      serving: {
        heading: "Der häufigste Fehler beginnt bei der Temperatur",
        paragraphs: [
          "Ein häufiger Fehler liegt für Francesco bereits beim Servieren. Weißwein kann zu kalt, aber auch zu warm ins Glas kommen. Eine konkrete Gradzahl nennt er nicht.",
          "Dasselbe gilt für das Pairing: Wer die stärkere Mineralität des Greco oder die größere Weichheit des Fiano ignoriert, behandelt sehr unterschiedliche Weine, als wären sie gleich.",
        ],
      },

      outro: {
        heading: "Warum die Wahl eines Weines nie banal ist",
        paragraphs: [
          "Am Ende führt Francesco alle Themen auf einen Gedanken zurück: Die Wahl eines Weines ist nie banal. Herkunft, Stil, Gericht und Servierweise beeinflussen sich gegenseitig.",
          "Für Maria Maria sieht Francesco seine Rolle darin, die vorhandene Kompetenz von Valerio und Maria mit seiner Erfahrung zu ergänzen und so zur weiteren Entwicklung des Projekts beizutragen.",
        ],
        /* Zitat 2 von zwei — es beschließt das Stück und ist zugleich die
           Zeile, die der Regionen-Teaser trägt. */
        quote: "Die Wahl eines Weines ist nie banal.",
      },

      /* Die fünf Fragen der Master-Source (Seite 7). Jede Antwort bleibt an
         das gebunden, was Francesco im Gespräch gesagt hat — auch dort, wo
         eine Gradzahl die bequemere Antwort wäre. */
      faq: {
        eyebrow: "Häufige Fragen",
        title: "Kampanische Weißweine —",
        titleAccent: "kurz beantwortet.",
        description:
          "Einstieg, Unterschiede, Abbinamenti und Temperatur: die fünf Fragen, die nach diesem Gespräch am häufigsten offenbleiben.",
        items: [
          {
            id: "francesco-einsteiger",
            q: "Welcher kampanische Weißwein eignet sich für Einsteiger?",
            a: "Francesco würde Fiano empfehlen. Er beschreibt ihn als weicher und vielseitiger als Greco di Tufo und weniger trocken wirkend als Falanghina.",
          },
          {
            id: "francesco-unterschied",
            q: "Was ist der Unterschied zwischen Greco di Tufo, Fiano und Falanghina?",
            a: "Greco wirkt für Francesco stärker mineralisch, Fiano weicher und vielseitiger und Falanghina zeigt im Vergleich eine trockenere Tendenz.",
          },
          {
            id: "francesco-greco-pairing",
            q: "Was passt zu Greco di Tufo?",
            a: "Etwas komplexere Fischgerichte, weißes Fleisch und besonders Mozzarella di Bufala.",
          },
          {
            id: "francesco-fisch",
            q: "Welcher kampanische Weißwein passt zu Fisch?",
            a: "Für leichtere Fischgerichte nennt Francesco Fiano di Avellino; Greco di Tufo kann auch strukturiertere Fischgerichte begleiten.",
          },
          {
            id: "francesco-temperatur",
            q: "Warum ist die Serviertemperatur wichtig?",
            a: "Zu niedrige oder zu hohe Temperaturen gehören für Francesco zu den häufigsten Fehlern. Eine konkrete Gradzahl nennt er nicht.",
          },
        ],
      },

      profile: {
        name: "Francesco De Stefano",
        /* OFFEN: Die Master-Source führt die Berufsbezeichnung viermal als
           „[erst nach Bestätigung ergänzen]". Solange sie fehlt, bleibt das
           Feld weg — der Artikel blendet die Zeile dann aus und der
           Person-Knoten trägt kein jobTitle. Dasselbe gilt für `worksFor`:
           Francesco führt keine eigene Kellerei. Eine ausführlichere
           Biografie darf erst ergänzt werden, wenn die Angaben verifiziert
           sind. */
        text: "Francesco begleitet Maria Maria mit seiner Erfahrung und seiner Kenntnis der kampanischen Weinwelt.",
      },

      /* Das Abschlussband. Anders als bei Daniele steht am Ende KEIN
         einzelner Wein: Das Gespräch führt drei kampanische Weiße zusammen,
         und die Master-Source (Seite 7) verlangt ausdrücklich, nur
         tatsächlich verfügbare kampanische Weine zu verlinken und nicht zu
         suggerieren, Francesco sei deren Produzent. Deshalb zeigt die
         Flasche den Greco di Tufo — den Wein, den das Gespräch am
         häufigsten nennt —, während die CTA auf die nach Herkunft
         gefilterte Kollektion führt: dieselbe Adresse, die auch der
         Kampanien-Knopf auf /regionen ansteuert. */
      wine: {
        slug: "greco-di-tufo",
        href: "/unsere-weine?region=kampanien",
        heading: "Kampaniens Weißweine bei Maria Maria entdecken",
        text: "Greco di Tufo, Fiano di Avellino und Falanghina — die kampanischen Weißweine der Kollektion, jeder mit dem eigenen Charakter, von dem Francesco im Gespräch erzählt.",
        cta: "Kampaniens Weine entdecken",
      },

      paths: [
        {
          id: "region",
          icon: "region",
          title: "Region Kampanien",
          text: "Entdecken Sie das Terroir.",
          href: "/regionen#kampanien",
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

      /* ---- Teaser 1: Karte im Magazin (Master-Source Seite 4) ---- */
      teaserMagazin: {
        eyebrow: "Interviews · Im Gespräch",
        badge: "Irpinien · Kampanien",
        title: "Drei Weißweine, drei Charaktere: Was Irpinien so besonders macht",
        teaser:
          "Über Greco di Tufo, Fiano di Avellino und Falanghina – und darüber, warum Herkunft, Food Pairing und die bewusste Wahl des Weines zusammengehören.",
        meta: "Interview · 6 Min. Lesezeit",
        cta: "Gespräch lesen",
      },

      /* ---- Teaser 2: Box auf /regionen unter dem Kampanien-Block ----
         Master-Source Seite 3. Der Text setzt beim Gebiet an, nicht bei der
         Person; die zweite CTA führt bewusst NICHT zum Artikel. */
      teaserRegion: {
        region: "kampanien",
        portrait: { src: "/img/magazin/interviews/francesco-de-stefano.jpg" },
        eyebrow: "Stimmen aus der Region · Irpinien",
        title: "Echte Menschen erzählen Kampanien",
        paragraphs: [
          "Was macht die Weißweine Kampaniens so unterschiedlich? Francesco De Stefano erzählt von Irpinien, Greco di Tufo, Fiano di Avellino und Falanghina — und davon, warum Herkunft, Charakter und das richtige Food Pairing bei der Wahl eines Weines zusammengehören.",
        ],
        pull: "Die Wahl eines Weines ist nie banal.",
        ctaPrimary: "Das Gespräch lesen",
        ctaSecondary: "Greco di Tufo entdecken",
      },
    },
  ],
};

export default interviews;
