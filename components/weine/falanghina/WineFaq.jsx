import FaqSection from "@/components/faq/FaqSection";

/* Häufige Fragen der Wein-Landingpage — dünner Wrapper um die geteilte
   FAQ-Sektion (Text links, Akkordeon rechts). Inhalte kommen aus wine.faq,
   die Akzentfarben aus der Palette des Weins; die Sektion bleibt unter
   #fragen im Subnav-Index der Seite verankert. */

export default function WineFaq({ wine }) {
  const accent = wine.accent ?? wine.moment?.accent;

  return (
    <FaqSection
      id="fragen"
      pageType={`wine:${wine.slug}`}
      eyebrow="Häufige Fragen"
      title={
        <>
          Gut zu{" "}
          <span className="italic" style={accent ? { color: accent.deep } : undefined}>
            wissen.
          </span>
        </>
      }
      description={`Antworten auf die häufigsten Fragen zu ${wine.name} — von Geschmack und Herkunft bis zum Servieren. Die technischen Angaben stammen aus dem Datenblatt des Weins.`}
      items={wine.faq}
      accent={accent}
      footer={{ label: "Ihre Frage ist nicht dabei? Schreiben Sie uns", href: "/kontakt" }}
    />
  );
}
