/* Zentrale FAQ-Quelle der Seiten-FAQs (Home, Weine-Hub, Regionen, Magazin,
   Shop, Kontakt) — eine Quelle, mehrere Ausgaben. Die Wein-FAQs leben in
   content/<sprache>/wines.js beim jeweiligen Datenblatt.

   Owner-Prinzip aus der FAQ-Guide: Jede Frage hat genau eine Seite mit der
   vollständigen Antwort. Andere Seiten dürfen höchstens einen Teaser mit Link
   auf den Owner tragen — deshalb verweisen z. B. die Kontakt-Antworten zu
   Versandfragen auf den Shop (Owner) statt sie zu duplizieren.

   Jede Frage: stabile `id` (Tracking/Deep-Link), `q`, `a` (erster Satz =
   direkte Antwort), optional genau 1 interner Link mit beschreibendem Anchor.
   Die IDs sind KEIN Text und in allen vier Sprachen identisch — sie tragen
   die Deep-Links der Weinseiten und die faq_id in GA4. Die Pfade in `link`
   ebenso: LocaleLink hängt das Sprachpräfix an. */

export const faq = {
  /* ---- Startseite: Brand-FAQ (Identität, Sortiment, Anlass, Partner) ---- */
  home: [
    {
      id: "home-was-ist",
      q: "Was ist Maria Maria?",
      a: "Maria Maria steht für persönlich kuratierte Boutique-Weine aus Italien. Das ausgewählte Sortiment verbindet authentische Herkunft, charaktervolle Rebsorten und italienische Lebensart – für Menschen und Gastgeber, die Wein bewusst auswählen und genießen möchten.",
    },
    {
      id: "home-sortiment",
      q: "Welche Weine bietet Maria Maria an?",
      a: "Das Sortiment umfasst neun ausgewählte Weiß-, Rosé- und Rotweine aus Kampanien, Apulien und der Region rund um den Gardasee. Dazu gehören unter anderem Lugana, Falanghina, Greco di Tufo, Aglianico und verschiedene Primitivo-Weine.",
      link: { label: "Alle Weine entdecken", href: "/unsere-weine" },
    },
    {
      id: "home-anlass",
      q: "Welcher Maria-Maria-Wein passt zu meinem Anlass?",
      a: "Ob Aperitivo, Dinner, Food Pairing, Veranstaltung oder stilvolles Geschenk: Auf den einzelnen Weinseiten finden Sie Informationen zu Geschmack, Charakter, Serviertemperatur und passenden Speisen. Bei einer persönlichen Frage helfen wir Ihnen gerne bei der Auswahl.",
      link: { label: "Den passenden Wein entdecken", href: "/unsere-weine" },
    },
    {
      id: "home-partner",
      q: "Arbeitet Maria Maria mit Gastronomie, Hospitality und Lifestyle-Partnern zusammen?",
      a: "Ja. Maria Maria richtet sich auch an ausgewählte Partner aus Gastronomie, Hospitality, Events, Retail und Lifestyle, die italienische Boutique-Weine in ihr Konzept integrieren möchten. Anfragen und mögliche Kooperationen besprechen wir persönlich.",
      link: { label: "Maria Maria als Partner entdecken", href: "/kontakt#kontakt-haendler" },
    },
    {
      id: "home-kontakt",
      q: "Wie kann ich Maria Maria kontaktieren?",
      a: "Nutzen Sie unser Kontaktformular, wenn Sie eine Frage zu unseren Weinen, einer Zusammenarbeit oder einem besonderen Anlass haben. Wir melden uns persönlich bei Ihnen zurück.",
      link: { label: "Kontakt aufnehmen", href: "/kontakt" },
    },
  ],

  /* ---- Weine-Hub: Wahl-FAQ (führt zur Kollektion) ---- */
  weine: [
    {
      id: "weine-wahl-farbe",
      q: "Wie wähle ich zwischen Rotwein, Weißwein und Rosato?",
      a: "Folgen Sie dem Moment, nicht der Regel: kraftvolle Rotweine wie der Primitivo für kräftige Küche und lange Abende, frische Weißweine wie Lugana, Greco oder Falanghina zu Fisch, heller Küche und als Aperitivo — und der Rosato, wenn es leicht und mediterran bleiben soll.",
      link: { label: "Zur Kollektion", href: "#kollektion" },
    },
    {
      id: "weine-anlass",
      q: "Welcher Wein passt zu welchem Anlass?",
      a: "Für den Aperitivo: Rosato Puglia, Falanghina oder Il Bianco, gut gekühlt. Für das Dinner: Lugana oder Greco di Tufo zu Fisch — Primitivo oder Il Rosso zu Fleisch und kräftigen Primi. Für gute Gespräche unter Freunden: der Wein, dessen Geschichte Sie erzählen möchten.",
    },
    {
      id: "weine-geschenk",
      q: "Welcher Wein eignet sich als Geschenk?",
      a: "Für Kenner: der Primitivo 15,5 aus der Terrakotta-Amphore oder der Greco di Tufo mit D.O.C.G.-Status. Für Einsteiger: die zugängliche Falanghina oder der Primitivo Salento IGP. Und sicher ist ein kuratiertes Probierpaket — elegant verpackt, auf Wunsch mit Grußkarte.",
      link: { label: "Zu den Probierpaketen", href: "/shop#pakete" },
    },
    {
      id: "weine-essen",
      q: "Wie finde ich den passenden Wein zu einem Gericht?",
      a: "Entscheidend ist die Zubereitung, nicht die Zutat allein — bei Pasta zum Beispiel zählt die Sauce: Helle, feine Zubereitungen verlangen frische Weißweine, kräftige Ragùs einen strukturierten Rotwein. Auf jeder Weinseite finden Sie die Empfehlungen aus dem Datenblatt des Weins.",
      link: { label: "Food-Pairing im Magazin", href: "/magazin" },
    },
  ],

  /* ---- Regionen: Herkunfts-FAQ, gruppiert je Region (Index links) ---- */
  regionen: [
    {
      key: "apulien",
      label: "Apulien",
      items: [
        {
          id: "reg-apulien-weine",
          q: "Was prägt den Charakter apulischer Weine?",
          a: "Viel Sonne, warme Temperaturen, rote und kalkhaltige Böden sowie die Nähe zum Meer prägen viele Weine aus Apulien. Je nach Rebsorte und Ausbau entstehen fruchtbetonte, würzige und kraftvolle Weine, die dennoch sehr unterschiedlich ausfallen können.",
          link: { label: "Weine aus Apulien ansehen", href: "/unsere-weine?region=apulien" },
        },
        {
          id: "reg-apulien-primitivo",
          q: "Was ist Primitivo und wie schmeckt er?",
          a: "Primitivo ist eine der prägendsten Rebsorten Apuliens. Typisch sind Aromen reifer dunkler Früchte, eine warme Würze und ein voller Körper. Stil und Süßegrad unterscheiden sich jedoch je nach Herkunft und Vinifikation.",
          link: { label: "Primitivo di Manduria entdecken", href: "/unsere-weine/primitivo-14-5" },
        },
        {
          id: "reg-apulien-salento",
          q: "Was bedeutet Salento IGP?",
          a: "Salento IGP ist eine geschützte geografische Angabe für Weine aus dem südlichen Teil Apuliens. Sie bezeichnet die Herkunft, nicht automatisch einen bestimmten Geschmack oder eine einzelne Rebsorte.",
          link: { label: "Zum Primitivo Salento IGP", href: "/unsere-weine/primitivo-salento" },
        },
        {
          id: "reg-apulien-pairing",
          q: "Zu welchen Speisen passen apulische Rotweine?",
          a: "Kräftige apulische Rotweine passen häufig zu Schmorgerichten, gegrilltem Fleisch, würziger Pasta und gereiftem Käse. Entscheidend sind Intensität, Würzung und Zubereitung des Gerichts; die konkrete Empfehlung finden Sie auf der jeweiligen Weinseite.",
          link: { label: "Primitivo 15,5 und sein Food Pairing", href: "/unsere-weine/primitivo-15-5" },
        },
      ],
    },
    {
      key: "kampanien",
      label: "Kampanien",
      items: [
        {
          id: "reg-kampanien-rebsorten",
          q: "Was macht Kampanien als Weinregion besonders?",
          a: "Kampanien vereint unterschiedliche Anbaugebiete, Höhenlagen und Böden. In Irpinien entstehen unter anderem Greco di Tufo und Aglianico, während Falanghina auch im Beneventano eine wichtige Rolle spielt. Diese Vielfalt sorgt für sehr unterschiedliche Weincharaktere.",
          link: { label: "Weine aus Kampanien ansehen", href: "/unsere-weine?region=kampanien" },
        },
        {
          id: "reg-kampanien-greco",
          q: "Wie unterscheiden sich Greco di Tufo und Falanghina?",
          a: "Greco di Tufo wirkt häufig strukturierter, mineralischer und intensiver. Falanghina zeigt sich oft frischer, duftiger und zugänglicher. Der genaue Stil hängt immer von Herkunft, Jahrgang und Ausbau ab.",
          link: { label: "Greco di Tufo entdecken", href: "/unsere-weine/greco-di-tufo" },
        },
        {
          id: "reg-kampanien-falanghina",
          q: "Woher kommt die Falanghina?",
          a: "Die Falanghina zählt zu den ältesten Rebsorten Kampaniens und ist besonders im Beneventano stark vertreten. Unsere Falanghina wächst dort in den Hügeln — frisch, duftig und mediterran im Ausdruck.",
          link: { label: "Falanghina entdecken", href: "/unsere-weine/falanghina" },
        },
        {
          id: "reg-kampanien-aglianico",
          q: "Was ist Aglianico und welchen Stil hat „Il Rosso“?",
          a: "Aglianico ist eine bedeutende rote Rebsorte Süditaliens. „Il Rosso“ von Maria Maria besteht aus 100 % Aglianico – nicht aus einer Cuvée – und steht für einen charaktervollen Rotweinstil mit Struktur und würziger Tiefe.",
          link: { label: "Il Rosso entdecken", href: "/unsere-weine/il-rosso-aglianico" },
        },
      ],
    },
    {
      key: "garda",
      label: "Lugana am Gardasee",
      items: [
        {
          id: "reg-garda-gebiet",
          q: "Wo liegt das Lugana-Weingebiet?",
          a: "Das Lugana-Weingebiet liegt am südlichen Gardasee und erstreckt sich über Teile der Lombardei und Venetiens. Zur abgegrenzten DOC-Zone gehören Gebiete in den Provinzen Brescia und Verona. Pozzolengo ist einer der Orte, an denen die lehmigen Moränenböden und der Einfluss des Sees besonders prägend sind.",
        },
        {
          id: "reg-garda-turbiana",
          q: "Welche Rebsorte prägt den Lugana DOC?",
          a: "Die wichtigste Rebsorte des Lugana DOC ist Turbiana, lokal auch Trebbiano di Lugana genannt. Nach dem Produktionsreglement muss Lugana DOC zu mindestens 90 Prozent aus Turbiana bestehen; andere zugelassene, nicht aromatische weiße Rebsorten dürfen zusammen höchstens 10 Prozent ausmachen. In der Wahrnehmung des Weins steht Turbiana klar im Mittelpunkt.",
          link: { label: "Zum Lugana", href: "/unsere-weine/lugana" },
        },
        {
          id: "reg-garda-geschmack",
          q: "Wie schmeckt Lugana?",
          a: "Lugana zeigt sich häufig frisch, elegant und fein mineralisch, mit Aromen von Zitrusfrüchten, weißen Blüten und je nach Stil auch reiferem Kernobst. Alter, Ausbau und Jahrgang beeinflussen das Profil.",
        },
        {
          id: "reg-garda-aperitif",
          q: "Warum ist Lugana mehr als ein Aperitifwein?",
          a: "Lugana wird oft als frischer Wein zum Aperitif wahrgenommen. Daniele Malavasi betont jedoch seine Struktur, Salzigkeit und sein Entwicklungspotenzial. Gerade diese Eigenschaften machen ihn zu einem gastronomisch vielseitigen Weißwein, der nicht nur vor dem Essen, sondern als Begleiter über das Menü hinweg funktioniert.",
          link: {
            label: "Das Gespräch mit Daniele Malavasi lesen",
            href: "/magazin/interviews/daniele-malavasi-lugana-doc",
          },
        },
        {
          id: "reg-garda-mm",
          q: "Zu welchen Speisen passt Lugana?",
          a: "Zu Lugana passen Fisch aus dem Gardasee, Risotto, cremig aufgeschlagener Stockfisch und helles Fleisch mit leichten Saucen. Entscheidend ist weniger eine starre Regel als das Gleichgewicht zwischen Frische, Salzigkeit und der Textur des Gerichts.",
          link: { label: "Food Pairings im Magazin entdecken", href: "/magazin#food-pairing" },
        },
        {
          id: "reg-garda-temperatur",
          q: "Warum sollte Lugana nicht zu kalt serviert werden?",
          a: "Wenn Lugana zu kalt serviert wird, können genau jene Eigenschaften weniger deutlich wahrgenommen werden, die seine Identität prägen: Salzigkeit, Mineralität und aromatische Feinheit. Deshalb sollte er nicht eiskalt ins Glas kommen. Die genaue Serviertemperatur richtet sich nach Stil und Herstellerempfehlung.",
        },
      ],
    },
  ],

  /* ---- Magazin: Weinwissen-FAQ (Evergreens) ---- */
  magazin: [
    {
      id: "wissen-temperatur",
      q: "Welche Trinktemperatur ist ideal?",
      a: "Als Faustregel aus unseren Datenblättern: der Lugana bei 8–10 °C, Greco und Falanghina bei ca. 10 °C, der Rosato bei 12–14 °C, kräftige Rotweine wie Primitivo und Il Rosso bei 16–18 °C. Im Zweifel lieber etwas kühler servieren — im Glas erwärmt sich der Wein von selbst.",
    },
    {
      id: "wissen-dekantieren",
      q: "Muss Primitivo dekantiert werden?",
      a: "Nein, ein Muss ist es nicht. Kräftige, junge Rotweine profitieren aber von etwas Luft vor dem Servieren — die konkrete Empfehlung aus dem Datenblatt finden Sie auf der Seite des jeweiligen Weins.",
      link: { label: "Zur Servierempfehlung des Primitivo 15,5", href: "/unsere-weine/primitivo-15-5" },
    },
    {
      id: "wissen-glas",
      q: "Welches Glas für welchen Wein?",
      a: "Kräftige Rotweine mögen ein großes Rotweinglas mit viel Luftraum, Weißweine ein schlankeres Glas, das die Frische bündelt. Bei aromatischen Weißen wie der Greco-Cuvée lohnt ein bauchiges Weißweinglas — dort entfaltet sich das Bouquet am schönsten.",
    },
    {
      id: "wissen-lagerung",
      q: "Wie lagert man Wein richtig?",
      a: "Kühl, dunkel und ruhig — ideal sind konstante Temperaturen ohne starke Schwankungen, Flaschen mit Naturkorken liegend. Unsere Weine sind auf Genuss ausgelegt: Die Servierempfehlungen finden Sie auf jeder Weinseite im Kapitel „Geschmack“.",
    },
    {
      id: "wissen-docg",
      q: "Was ist der Unterschied zwischen DOC, DOCG und IGP?",
      a: "Drei Stufen des italienischen Herkunftssystems: IGP (geschützte geografische Angabe) ist die weiteste, DOC bzw. DOP (geschützte Ursprungsbezeichnung) enger gefasst, DOCG die höchste Stufe — kontrolliert und garantiert. In unserer Kollektion reicht das Spektrum vom Salento IGP bis zum Greco di Tufo DOCG.",
      link: { label: "Die Kollektion nach Herkunft entdecken", href: "/unsere-weine" },
    },
    {
      id: "wissen-rebsorten",
      q: "Welche italienischen Rebsorten sollte man kennen?",
      a: "Aus unserer Kollektion: Primitivo und Negroamaro aus Apulien, Aglianico aus dem Süden, die weißen Falanghina und Greco aus Kampanien sowie Turbiana vom Gardasee. Jede Weinseite stellt ihre Rebsorte mit Herkunft und Charakter ausführlich vor.",
      link: { label: "Rebsorten in der Kollektion entdecken", href: "/unsere-weine" },
    },
  ],

  /* ---- Shop: Service-FAQ (Owner für Kauf-, Versand- und Geschenkfragen) ---- */
  shop: [
    {
      id: "shop-kaufen",
      q: "Wo kann ich Maria-Maria-Weine kaufen?",
      a: "Direkt hier im offiziellen Online-Shop — mit dem gesamten Sortiment und kuratierten Probierpaketen zum Vorteilspreis. Gern beraten wir Sie persönlich bei der Auswahl für Ihren Moment, Ihr Menü oder Ihr Geschenk.",
    },
    {
      id: "shop-versand",
      q: "Wie schnell wird geliefert — und was kostet der Versand?",
      a: "Ihre Weine erreichen Sie in 1–3 Werktagen, bruchsicher und elegant verpackt. Ab 69 € Bestellwert liefern wir versandkostenfrei.",
    },
    {
      id: "shop-international",
      q: "Versenden Sie auch international?",
      a: "Ja — neben Deutschland liefern wir in ausgewählte europäische Länder. Versandkosten und Lieferzeiten hängen vom Zielland ab und werden im Bestellprozess transparent ausgewiesen. Ob wir Ihr Land beliefern, klären wir gern vorab — kontaktieren Sie uns einfach.",
    },
    {
      id: "shop-bezahlung",
      q: "Wie kann ich im Shop bezahlen?",
      a: "Bequem und sicher: Wir akzeptieren alle gängigen Zahlungsarten — SSL-verschlüsselt und ohne Umwege. Die verfügbaren Optionen werden im Bestellprozess transparent ausgewiesen.",
    },
    {
      id: "shop-geschenk",
      q: "Kann ich Wein als Geschenk versenden lassen?",
      a: "Ja — mit persönlicher Grußkarte, eleganter Geschenkverpackung und Versand direkt an den Beschenkten. Vermerken Sie Ihre Wünsche einfach bei der Bestellung.",
    },
    {
      id: "shop-beratung",
      q: "Wer hilft mir bei Bestellung oder Weinauswahl?",
      a: "Wir persönlich: Über das Kontaktformular oder per E-Mail beraten wir Sie zu Menü, Anlass oder Geschenk — und helfen ebenso bei Fragen rund um Ihre Bestellung. Wir antworten innerhalb von 1–2 Werktagen.",
      link: { label: "Kontakt aufnehmen", href: "/kontakt" },
    },
  ],

  /* ---- Kontakt: Service-FAQ in Clustern (Index links nach Anliegen) ---- */
  kontakt: [
    {
      key: "allgemein",
      label: "Allgemeine Fragen",
      items: [
        {
          id: "kontakt-erreichen",
          q: "Wie kann ich Maria Maria kontaktieren?",
          a: "Am schnellsten über das Kontaktformular — wählen Sie dort einfach Ihr Anliegen. Alternativ erreichen Sie uns per E-Mail an info@maria-maria.wine. Wir antworten innerhalb von 1–2 Werktagen.",
        },
        {
          id: "kontakt-weininfo",
          q: "Wo finde ich Informationen zu den Weinen?",
          a: "Jeder Wein hat eine eigene Seite mit Geschmacksprofil, Herkunft, technischen Daten, Food-Pairing und häufigen Fragen — vom Primitivo bis zum Lugana.",
          link: { label: "Zu unseren Weinen", href: "/unsere-weine" },
        },
      ],
    },
    {
      key: "verkostungen",
      label: "Verkostungen",
      items: [
        {
          id: "kontakt-verkostung-buchen",
          q: "Wie kann ich eine Weinverkostung in Düsseldorf buchen?",
          a: "Wählen Sie im Kontaktformular einfach „Verkostungsanfrage“ — dann können Sie Wunschtermin und Gästezahl direkt angeben. Wir melden uns innerhalb von 1–2 Werktagen mit einem persönlichen Vorschlag zurück.",
        },
        {
          id: "kontakt-verkostung-ort",
          q: "Wo finden die Verkostungen statt?",
          a: "In Düsseldorf und Umgebung. Ort und Format stimmen wir persönlich mit Ihnen ab — schildern Sie uns einfach Ihren Anlass über das Formular.",
        },
        {
          id: "kontakt-verkostung-privat",
          q: "Kann ich eine private Weinprobe buchen?",
          a: "Ja — private Verkostungen sind ebenso möglich wie Termine für Firmen. Geben Sie im Formular Wunschtermin und Gästezahl an; wir antworten mit einem persönlichen Vorschlag.",
        },
        {
          id: "kontakt-verkostung-corporate",
          q: "Bietet Maria Maria Corporate-Verkostungen an?",
          a: "Ja, für Firmenanlässe und Teams. Erzählen Sie uns kurz von Anlass und Gruppengröße — wir gestalten einen passenden Vorschlag und melden uns innerhalb von 1–2 Werktagen.",
        },
        {
          id: "kontakt-verkostung-kaufen",
          q: "Kann ich die verkosteten Weine anschließend kaufen?",
          a: "Ja — alle Weine der Kollektion finden Sie im offiziellen Online-Shop. Gern beraten wir Sie nach der Verkostung persönlich zu Ihren Favoriten.",
          link: { label: "Zum offiziellen Shop", href: "/shop" },
        },
      ],
    },
    {
      key: "haendler",
      label: "Händler",
      items: [
        {
          id: "kontakt-haendler",
          q: "Wie nehme ich Maria-Maria-Weine in mein Sortiment auf?",
          a: "Wählen Sie im Formular „Händleranfrage“ und erzählen Sie uns kurz von Ihrem Geschäft oder Ihrer Gastronomie und Ihrer Region. Wir melden uns persönlich mit allen Details.",
        },
        {
          id: "kontakt-haendler-finden",
          q: "Kann ich die Weine im lokalen Handel finden?",
          a: "Unsere Weine sind bei ausgewählten Fachhändlern und in der Gastronomie erhältlich. Da unsere Produktion limitiert ist, nennen wir Ihnen auf Anfrage gerne einen Partner in Ihrer Nähe.",
        },
      ],
    },
    {
      key: "presse",
      label: "Presse & Kooperationen",
      items: [
        {
          id: "kontakt-presse",
          q: "An wen richte ich Presseanfragen?",
          a: "Direkt an uns: über das Kontaktformular (Anliegen „Presse & Kooperationen“) oder per E-Mail an info@maria-maria.wine. Wir melden uns persönlich zurück.",
        },
        {
          id: "kontakt-kooperationen",
          q: "Ist Maria Maria offen für Kooperationen?",
          a: "Ja — für Kooperationen und gemeinsame Projekte sind wir offen. Beschreiben Sie uns kurz Ihre Idee; wir antworten innerhalb von 1–2 Werktagen.",
        },
      ],
    },
    {
      key: "shop",
      label: "Shop & Versand",
      items: [
        {
          id: "kontakt-kaufen",
          q: "Wo kann ich die Weine kaufen?",
          a: "Im offiziellen Online-Shop von Maria Maria. Alle Details zu Sortiment, Probierpaketen und Bestellung beantwortet die Service-FAQ direkt im Shop.",
          link: { label: "Zur Shop-FAQ", href: "/shop#fragen" },
        },
        {
          id: "kontakt-versand",
          q: "Bieten Sie internationalen Versand an?",
          a: "Ja — neben Deutschland liefern wir in ausgewählte europäische Länder. Alle Details zu Lieferzeiten und Versandkosten beantwortet die Service-FAQ direkt im Shop und im Bestellprozess.",
          link: { label: "Zur Shop-FAQ", href: "/shop#fragen" },
        },
      ],
    },
  ],
};

export default faq;
