import FaqSection from "@/components/faq/FaqSection";

/* Häufige Fragen der Wein-Landingpage — dünner Wrapper um die geteilte
   FAQ-Sektion (Text links, Akkordeon rechts). Inhalte kommen aus wine.faq,
   die Akzentfarben aus der Palette des Weins; die Sektion bleibt unter
   #fragen im Subnav-Index der Seite verankert. */

/* `t` ist der Zweig common.winePage der aktiven Sprache — die Seite reicht
   ihn herein, weil dieser Wrapper serverseitig rendert. */
export default function WineFaq({ wine, t = {} }) {
  const accent = wine.accent ?? wine.moment?.accent;

  return (
    <FaqSection
      className="-mb-12 lg:-mb-16"
      id="fragen"
      pageType={`wine:${wine.slug}`}
      eyebrow={t.faqEyebrow}
      title={
        <>
          {t.faqTitle}{" "}
          <span className="italic" style={accent ? { color: accent.deep } : undefined}>
            {t.faqTitleAccent}
          </span>
        </>
      }
      description={(t.faqDescription ?? "").replace("{wine}", wine.name)}
      items={wine.faq}
      accent={accent}
      footer={{ label: t.faqFooter, href: "/kontakt" }}
    />
  );
}
