import Link from "@/components/i18n/LocaleLink";
import { Eyebrow, GrapeRule } from "@/components/Deco";
import Atmosphere from "@/components/Atmosphere";

/* Gemeinsame Hülle der Rechtsseiten — ruhige, editoriale Textseite im
   Ivory-Look. Inhalte kommen als Abschnitts-Array, damit alle drei Seiten
   identisch gebaut sind und auf Mobile sauber umbrechen.

   `shell` trägt die wiederkehrenden Beschriftungen (Kicker, „Stand:", der
   Kontaktsatz am Fuß) in der aktiven Sprache. `shell.bindingNotice` erscheint
   nur in den übersetzten Fassungen: Verbindlich ist die deutsche Version, und
   das gehört sichtbar auf die Seite, nicht in einen Kommentar. */

export default function LegalShell({ shell, title, intro, sections }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Atmosphere variant="warm" />
      <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-32 lg:pb-28 lg:pt-36">
        <Eyebrow>{shell.eyebrow}</Eyebrow>
        <h1 className="mt-5 font-playfair text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.08] text-charcoal">
          {title}
        </h1>
        <GrapeRule className="mt-6" />
        {shell.updated && (
          <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
            {shell.updatedLabel} {shell.updated}
          </p>
        )}

        {shell.bindingNotice && (
          <p className="mt-6 rounded-card border border-champagne/40 bg-champagne/10 px-5 py-4 text-[12.5px] leading-relaxed text-charcoal/75">
            {shell.bindingNotice}
          </p>
        )}

        {intro && (
          <p className="mt-6 text-[14.5px] leading-relaxed text-charcoal/75">{intro}</p>
        )}

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-playfair text-[20px] leading-snug text-charcoal">{s.title}</h2>
              <span aria-hidden="true" className="mt-3 block h-px w-10 bg-champagne/80" />
              <div className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-charcoal/75">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-card border border-stone/50 bg-white/50 p-6 shadow-luxe">
          <p className="text-[12.5px] leading-relaxed text-charcoal/70">
            {shell.contactPre}{" "}
            <Link
              href="/kontakt"
              className="font-medium text-bordeaux underline decoration-bordeaux/30 underline-offset-2 transition-colors duration-300 hover:decoration-bordeaux"
            >
              {shell.contactLink}
            </Link>{" "}
            {shell.contactMid}{" "}
            <a
              href="mailto:info@maria-maria.de"
              className="font-medium text-bordeaux underline decoration-bordeaux/30 underline-offset-2 transition-colors duration-300 hover:decoration-bordeaux"
            >
              info@maria-maria.de
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
