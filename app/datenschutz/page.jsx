import LegalShell from "@/components/legal/LegalShell";

export const metadata = {
  title: "Datenschutzerklärung — Maria Maria",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten auf maria-maria.wine gemäß DSGVO.",
};

const SECTIONS = [
  {
    title: "1. Verantwortlicher",
    body: [
      "Verantwortlich für die Datenverarbeitung auf dieser Website ist die Maria Maria Wines GmbH, Kaiserswerther Straße 12, 40477 Düsseldorf, Deutschland, E-Mail: info@maria-maria.wine, Telefon: +49 211 976 420.",
    ],
  },
  {
    title: "2. Erhebung und Speicherung personenbezogener Daten",
    body: [
      "Beim Besuch dieser Website werden durch den Server automatisch technische Informationen erfasst (z. B. IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Browsertyp). Diese Daten dienen ausschließlich der Sicherstellung eines störungsfreien Betriebs und werden nicht mit anderen Datenquellen zusammengeführt.",
      "Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der sicheren Bereitstellung der Website).",
    ],
  },
  {
    title: "3. Kontaktformular und Verkostungsanfragen",
    body: [
      "Wenn Sie uns über das Kontaktformular schreiben, verarbeiten wir die von Ihnen angegebenen Daten (Name, E-Mail-Adresse, Betreff, Anliegen, Nachricht sowie bei Verkostungsanfragen Wunschtermin und Gästezahl) ausschließlich zur Bearbeitung Ihrer Anfrage.",
      "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO. Die Daten werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
    ],
  },
  {
    title: "4. Bestellungen im Online-Shop",
    body: [
      "Zur Abwicklung von Bestellungen verarbeiten wir die für Vertragsschluss, Lieferung und Bezahlung erforderlichen Daten (Name, Anschrift, E-Mail-Adresse, Zahlungsdaten). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.",
      "Eine Weitergabe erfolgt nur an die zur Abwicklung eingebundenen Dienstleister (z. B. Versand- und Zahlungsdienstleister) und nur im jeweils erforderlichen Umfang.",
    ],
  },
  {
    title: "5. Newsletter",
    body: [
      "Für den Newsletter-Versand verwenden wir das Double-Opt-in-Verfahren: Sie erhalten nach Ihrer Anmeldung eine E-Mail, in der Sie die Anmeldung bestätigen. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO; Sie können diese jederzeit über den Abmeldelink im Newsletter widerrufen.",
    ],
  },
  {
    title: "6. Cookies und lokale Speicherung",
    body: [
      "Diese Website verwendet keine Tracking- oder Marketing-Cookies. Zur Bereitstellung der Warenkorb-Funktion wird der lokale Speicher Ihres Browsers (localStorage) genutzt; dabei werden keine personenbezogenen Daten an uns übertragen.",
    ],
  },
  {
    title: "7. Ihre Rechte",
    body: [
      "Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch gegen die Verarbeitung (Art. 21 DSGVO).",
      "Zudem besteht ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde, in Nordrhein-Westfalen: Landesbeauftragte für Datenschutz und Informationsfreiheit NRW.",
    ],
  },
];

export default function DatenschutzPage() {
  return (
    <LegalShell
      eyebrow="Rechtliches"
      title="Datenschutzerklärung"
      updated="Juli 2026"
      intro="Der Schutz Ihrer persönlichen Daten ist uns wichtig. Hier erfahren Sie, welche Daten wir zu welchem Zweck verarbeiten — so knapp und verständlich wie möglich."
      sections={SECTIONS}
    />
  );
}
