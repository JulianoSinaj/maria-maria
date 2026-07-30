/* Zentrale FAQ-Quelle der Seiten-FAQs (Home, Weine-Hub, Regionen, Magazin,
   Shop, Kontakt) — eine Quelle, mehrere Ausgaben. Die Wein-FAQs leben bewusst
   weiter in der jeweiligen wineData.js (dort ist das Datenblatt die Quelle).

   Owner-Prinzip aus der FAQ-Guide: Jede Frage hat genau eine Seite mit der
   vollständigen Antwort. Andere Seiten dürfen höchstens einen Teaser mit Link
   auf den Owner tragen — deshalb verweisen z. B. die Kontakt-Antworten zu
   Versandfragen auf den Shop (Owner) statt sie zu duplizieren.

   Jede Frage: stabile `id` (Tracking/Deep-Link), `q`, `a` (erster Satz =
   direkte Antwort; vollständige Owner-Antworten typischerweise 40–90 Wörter,
   Teaser auf eine Owner-Seite bewusst kürzer), optional genau 1 interner
   Link mit beschreibendem Anchor. Nur bestätigte Fakten aus Datenblättern und
   bestehender, freigegebener Site-Copy — unbestätigte Angaben (z. B. Ablauf
   und Dauer der Verkostungen, Lugana-Stilarten) bleiben bewusst draußen,
   bis der Brand Owner sie freigibt. */

/* ---- Homepage: Brand-FAQ (Identität, Auswahl, Leitsatz) ---- */
export const HOME_FAQ = [
  {
    id: "home-was-ist",
    q: "Was ist Maria Maria?",
    a: "Maria Maria ist eine Boutique-Weinmarke mit Sitz in Düsseldorf: handverlesene italienische Weine kleiner, familiengeführter Weingüter — persönlich verkostet, in limitierten Mengen und für bewusst gewählte Genussmomente ausgewählt.",
    link: { label: "Unsere Weine entdecken", href: "/weine" },
  },
  {
    id: "home-auswahl",
    q: "Welche Weine gehören zur Maria-Maria-Auswahl?",
    a: "Neun Charaktere aus drei Regionen — Apulien, Kampanien und Gardasee: drei Primitivo und ein Rosato aus Apulien, die Weißweine Falanghina, Greco di Tufo und Il Bianco sowie die Rotwein-Cuvée Il Rosso aus Kampanien und der Lugana vom Gardasee. Den besten Überblick gibt die Kollektion.",
    link: { label: "Alle Weine ansehen", href: "/weine" },
  },
  {
    id: "home-auswahlkriterien",
    q: "Wie werden die Maria-Maria-Weine ausgewählt?",
    a: "Persönlich: Jede Flasche wird von uns verkostet, bevor sie in die Kollektion kommt. Wir arbeiten direkt mit kleinen, familiengeführten Weingütern und ihren Önologen zusammen — limitierte Produktion, echtes Terroir, keine große Distribution.",
    link: { label: "Die Regionen dahinter entdecken", href: "/regionen" },
  },
  {
    id: "home-piacere",
    q: "Was bedeutet „Il piacere del vino“?",
    a: "„Das Vergnügen des Weins“ — unser Leitsatz. Ein Maria-Moment ist kein Anlass, sondern eine Entscheidung: den Augenblick zu wählen, den Wein zu öffnen und bewusst miteinander zu sein.",
  },
];

/* ---- Weine-Hub: Wahl-FAQ (Commercial Research, führt zur Kollektion) ---- */
export const WEINE_FAQ = [
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
];

/* ---- Regionen: Herkunfts-FAQ, gruppiert je Region (Index links) ---- */
export const REGIONEN_FAQ_GROUPS = [
  {
    key: "apulien",
    label: "Apulien",
    items: [
      {
        id: "reg-apulien-weine",
        q: "Welche Weine sind typisch für Apulien?",
        a: "Apulien ist das Land des Primitivo und des Negroamaro: kraftvolle, warme Rotweine mit mediterraner Seele. Aus der dunklen Negroamaro-Traube entstehen zudem elegante, frische Rosati.",
      },
      {
        id: "reg-apulien-primitivo",
        q: "Was ist Primitivo?",
        a: "Eine autochthone rote Rebsorte Apuliens mit intensivem Charakter und samtigem Abgang. Ihre bekannteste Herkunft ist Primitivo di Manduria D.O.P. — im Salento traditionell als Alberello-Buschrebe ohne Bewässerung erzogen.",
        link: { label: "Primitivo di Manduria entdecken", href: "/weine/primitivo-14-5" },
      },
      {
        id: "reg-apulien-mm",
        q: "Welche Maria-Maria-Weine kommen aus Apulien?",
        a: "Vier: der Primitivo 14,5 und der Primitivo 15,5 (beide Manduria D.O.P.), der Primitivo Salento IGP und der Rosato Puglia aus Negroamaro.",
        link: { label: "Alle Weine ansehen", href: "/weine" },
      },
      {
        id: "reg-apulien-salento",
        q: "Was bedeutet Salento IGP?",
        a: "Salento IGP ist die Herkunftsangabe unseres dritten Primitivo aus Apulien. Was hinter der Abkürzung steckt und wie sie sich von der Manduria-D.O.P. unterscheidet, erklärt die Seite des Primitivo Salento.",
        link: { label: "Zum Primitivo Salento IGP", href: "/weine/primitivo-salento" },
      },
    ],
  },
  {
    key: "kampanien",
    label: "Kampanien",
    items: [
      {
        id: "reg-kampanien-rebsorten",
        q: "Welche Rebsorten sind typisch für Kampanien?",
        a: "Die weißen Klassiker Falanghina und Greco sowie der rote Aglianico. Die vulkanischen Böden rund um den Vesuv geben den Weinen Spannung, Frische und Tiefe.",
      },
      {
        id: "reg-kampanien-greco",
        q: "Was ist Greco di Tufo DOCG?",
        a: "Einer der wenigen Weißweine Italiens mit D.O.C.G.-Status, der höchsten Herkunftsstufe des Landes. Er wächst auf vulkanischem Tuffgestein rund um das Dorf Tufo in Irpinien — daher seine Struktur und sein mineralischer Zug.",
        link: { label: "Greco di Tufo entdecken", href: "/weine/greco-di-tufo" },
      },
      {
        id: "reg-kampanien-falanghina",
        q: "Woher kommt Falanghina?",
        a: "Aus Kampanien: Die Falanghina zählt zu den ältesten Rebsorten der Region — unsere wächst im Beneventano. Die ganze Herkunftsgeschichte erzählt die Falanghina-Seite.",
        link: { label: "Falanghina entdecken", href: "/weine/falanghina" },
      },
      {
        id: "reg-kampanien-aglianico",
        q: "Wofür steht der Aglianico?",
        a: "Aglianico gilt als die große rote Rebsorte Süditaliens — spät reifend, tanninstark und auf vulkanischen Böden zu Hause. In unserer Kollektion steht sie im Il Rosso im Mittelpunkt: der Cuvée, die diese dunkle, würzige Seite Süditaliens ins Glas trägt.",
        link: { label: "Il Rosso entdecken", href: "/weine/il-rosso-aglianico" },
      },
    ],
  },
  {
    key: "garda",
    label: "Gardasee / Lugana",
    items: [
      {
        id: "reg-garda-gebiet",
        q: "Wo liegt das Lugana-Gebiet?",
        a: "Am Südufer des Gardasees. Unsere Trauben wachsen in den Turbiana-Weinbergen der Gemeinden Desenzano und Pozzolengo — mildes Klima, sanfte Hügel und kalkhaltige Böden.",
      },
      {
        id: "reg-garda-turbiana",
        q: "Was ist Turbiana?",
        a: "Die weiße Rebsorte des Lugana, auch Trebbiano di Lugana genannt. Sie steht für Eleganz, Frische und mineralische Tiefe — den Charakter des Nordens in unserer Kollektion.",
      },
      {
        id: "reg-garda-mm",
        q: "Welcher Maria-Maria-Wein kommt vom Gardasee?",
        a: "Der Lugana DOC: voll, warm und weich, mit intensivem floralem Duft und guter Persistenz — die Eleganz des Nordens als Gegenpol zum sonnigen Süden.",
        link: { label: "Zum Lugana", href: "/weine/lugana" },
      },
    ],
  },
];

/* ---- Magazin: Weinwissen-FAQ (Evergreens, erst Antwort, dann Wein) ---- */
export const MAGAZIN_FAQ = [
  {
    id: "wissen-temperatur",
    q: "Welche Trinktemperatur ist ideal?",
    a: "Als Faustregel aus unseren Datenblättern: der Lugana bei 8–10 °C, Greco und Falanghina bei ca. 10 °C, der Rosato bei 12–14 °C, kräftige Rotweine wie Primitivo und Il Rosso bei 16–18 °C. Im Zweifel lieber etwas kühler servieren — im Glas erwärmt sich der Wein von selbst.",
  },
  {
    id: "wissen-dekantieren",
    q: "Muss Primitivo dekantiert werden?",
    a: "Nein, ein Muss ist es nicht. Kräftige, junge Rotweine profitieren aber von etwas Luft vor dem Servieren — die konkrete Empfehlung aus dem Datenblatt finden Sie auf der Seite des jeweiligen Weins.",
    link: { label: "Zur Servierempfehlung des Primitivo 15,5", href: "/weine/primitivo-15-5" },
  },
  {
    id: "wissen-glas",
    q: "Welches Glas für welchen Wein?",
    a: "Kräftige Rotweine mögen ein großes Rotweinglas mit viel Luftraum, Weißweine ein schlankeres Glas, das die Frische bündelt. Bei aromatischen Weißen wie der Greco-Cuvée lohnt ein bauchiges Weißweinglas — dort entfaltet sich das Bouquet am schönsten.",
  },
  {
    id: "wissen-lagerung",
    q: "Wie lagert man Wein richtig?",
    a: "Kühl, dunkel und ruhig — ideal sind konstante Temperaturen ohne starke Schwankungen, Flaschen mit Naturkorken liegend. Unsere Weine sind auf Genuss ausgelegt: Die Servierempfehlungen finden Sie auf jeder Weinseite unter „Servieren & Genießen“.",
  },
  {
    id: "wissen-docg",
    q: "Was ist der Unterschied zwischen DOC, DOCG und IGP?",
    a: "Drei Stufen des italienischen Herkunftssystems: IGP (geschützte geografische Angabe) ist die weiteste, DOC bzw. DOP (geschützte Ursprungsbezeichnung) enger gefasst, DOCG die höchste Stufe — kontrolliert und garantiert. In unserer Kollektion reicht das Spektrum vom Salento IGP bis zum Greco di Tufo DOCG.",
    link: { label: "Die Kollektion nach Herkunft entdecken", href: "/weine" },
  },
  {
    id: "wissen-rebsorten",
    q: "Welche italienischen Rebsorten sollte man kennen?",
    a: "Aus unserer Kollektion: Primitivo und Negroamaro aus Apulien, Aglianico aus dem Süden, die weißen Falanghina und Greco aus Kampanien sowie Turbiana vom Gardasee. Jede Weinseite stellt ihre Rebsorte mit Herkunft und Charakter ausführlich vor.",
    link: { label: "Rebsorten in der Kollektion entdecken", href: "/weine" },
  },
];

/* ---- Shop: Service-FAQ (Owner für Kauf-, Versand- und Geschenkfragen) ---- */
export const SHOP_FAQ = [
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
    a: "Wir persönlich: Über das Kontaktformular oder telefonisch beraten wir Sie zu Menü, Anlass oder Geschenk — und helfen ebenso bei Fragen rund um Ihre Bestellung. Wir antworten innerhalb von 1–2 Werktagen.",
    link: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },
];

/* ---- Kontakt: Service-FAQ in Clustern (Index links nach Anliegen) ----
   Verkostungs-Detailfragen (Ablauf, Dauer, Teilnehmerzahl, Vorkenntnisse)
   bleiben laut Guide unveröffentlicht, bis das Angebot bestätigt ist. */
export const KONTAKT_FAQ_GROUPS = [
  {
    key: "allgemein",
    label: "Allgemeine Fragen",
    items: [
      {
        id: "kontakt-erreichen",
        q: "Wie kann ich Maria Maria kontaktieren?",
        a: "Am schnellsten über das Kontaktformular — wählen Sie dort einfach Ihr Anliegen. Alternativ erreichen Sie uns per E-Mail an info@maria-maria.wine oder telefonisch unter +49 211 976 420. Wir antworten innerhalb von 1–2 Werktagen.",
      },
      {
        id: "kontakt-weininfo",
        q: "Wo finde ich Informationen zu den Weinen?",
        a: "Jeder Wein hat eine eigene Seite mit Geschmacksprofil, Herkunft, technischen Daten, Food-Pairing und häufigen Fragen — vom Primitivo bis zum Lugana.",
        link: { label: "Zu unseren Weinen", href: "/weine" },
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
];
