import LegalShell from "@/components/legal/LegalShell";

export const metadata = {
  title: "AGB — Maria Maria",
  description:
    "Allgemeine Geschäftsbedingungen für Bestellungen im Maria Maria Online-Shop.",
};

const SECTIONS = [
  {
    title: "§ 1 Geltungsbereich",
    body: [
      "Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über den Online-Shop der Maria Maria Wines GmbH, Kaiserswerther Straße 12, 40477 Düsseldorf (nachfolgend „Maria Maria“), durch Verbraucher und Unternehmer.",
    ],
  },
  {
    title: "§ 2 Vertragsschluss",
    body: [
      "Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Bestellung. Mit dem Absenden der Bestellung geben Sie ein verbindliches Angebot ab; der Vertrag kommt mit unserer Bestellbestätigung per E-Mail zustande.",
    ],
  },
  {
    title: "§ 3 Abgabe nur an Volljährige",
    body: [
      "Wir verkaufen alkoholische Getränke ausschließlich an Personen, die das 18. Lebensjahr vollendet haben. Mit der Bestellung versichern Sie Ihre Volljährigkeit. Die Zustellung erfolgt nur gegen Alterssichtprüfung durch den Zusteller.",
    ],
  },
  {
    title: "§ 4 Preise und Versandkosten",
    body: [
      "Alle Preise verstehen sich in Euro inklusive der gesetzlichen Mehrwertsteuer zuzüglich Versandkosten. Die jeweils anfallenden Versandkosten werden im Bestellprozess vor Abgabe der Bestellung transparent ausgewiesen.",
    ],
  },
  {
    title: "§ 5 Lieferung und limitierte Editionen",
    body: [
      "Die Lieferung erfolgt innerhalb Deutschlands sowie in ausgewählte europäische Länder. Unsere Weine entstehen in bewusst limitierter Auflage; ein Angebot gilt daher nur, solange der Vorrat reicht. Sollte ein bestellter Wein nicht mehr verfügbar sein, informieren wir Sie unverzüglich und erstatten bereits geleistete Zahlungen.",
    ],
  },
  {
    title: "§ 6 Zahlung",
    body: [
      "Die Zahlung erfolgt über die im Bestellprozess angebotenen Zahlungsarten. Bei Auswahl einer über einen Zahlungsdienstleister abgewickelten Zahlungsart gelten ergänzend dessen Nutzungsbedingungen.",
    ],
  },
  {
    title: "§ 7 Widerrufsrecht",
    body: [
      "Verbrauchern steht ein gesetzliches Widerrufsrecht von 14 Tagen zu. Die Frist beginnt mit Erhalt der Ware. Zur Ausübung genügt eine eindeutige Erklärung an info@maria-maria.wine. Die Kosten der Rücksendung trägt der Käufer, sofern die gelieferte Ware der bestellten entspricht.",
    ],
  },
  {
    title: "§ 8 Gewährleistung und Haftung",
    body: [
      "Es gelten die gesetzlichen Gewährleistungsrechte. Für leichte Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten und begrenzt auf den vorhersehbaren, vertragstypischen Schaden.",
    ],
  },
  {
    title: "§ 9 Schlussbestimmungen",
    body: [
      "Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gegenüber Verbrauchern gilt diese Rechtswahl nur, soweit der Schutz zwingender Bestimmungen des Staates ihres gewöhnlichen Aufenthalts nicht entzogen wird.",
    ],
  },
];

export default function AgbPage() {
  return (
    <LegalShell
      eyebrow="Rechtliches"
      title="Allgemeine Geschäftsbedingungen"
      updated="Juli 2026"
      sections={SECTIONS}
    />
  );
}
