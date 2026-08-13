import LegalShell from "@/components/legal/LegalShell";

export const metadata = {
  title: "Impressum — Maria Maria",
  description: "Impressum und Anbieterkennzeichnung der Maria Maria Wines GmbH, Düsseldorf.",
};

const SECTIONS = [
  {
    title: "Angaben gemäß § 5 TMG",
    body: [
      "Maria Maria Wines GmbH",
      "Kaiserswerther Straße 12, 40477 Düsseldorf, Deutschland",
      "Vertreten durch die Geschäftsführung.",
    ],
  },
  {
    title: "Kontakt",
    body: ["Telefon: +49 211 976 420", "E-Mail: info@maria-maria.wine"],
  },
  {
    title: "Registereintrag",
    body: [
      "Eintragung im Handelsregister. Registergericht: Amtsgericht Düsseldorf.",
      "Registernummer und Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz werden nach Abschluss der Eintragung an dieser Stelle ergänzt.",
    ],
  },
  {
    title: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV",
    body: ["Maria Maria Wines GmbH, Kaiserswerther Straße 12, 40477 Düsseldorf."],
  },
  {
    title: "Jugendschutz",
    body: [
      "Der Verkauf von alkoholischen Getränken erfolgt ausschließlich an Personen ab 18 Jahren. Mit Ihrer Bestellung bestätigen Sie, dass Sie das 18. Lebensjahr vollendet haben. Wir behalten uns vor, einen Altersnachweis zu verlangen.",
    ],
  },
  {
    title: "Streitschlichtung",
    body: [
      "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr. Unsere E-Mail-Adresse finden Sie oben im Impressum.",
      "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
    ],
  },
  {
    title: "Haftung für Inhalte und Links",
    body: [
      "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Für die Inhalte externer Links übernehmen wir keine Gewähr; für den Inhalt der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.",
    ],
  },
];

export default function ImpressumPage() {
  return (
    <LegalShell
      eyebrow="Rechtliches"
      title="Impressum"
      updated="Juli 2026"
      sections={SECTIONS}
    />
  );
}
