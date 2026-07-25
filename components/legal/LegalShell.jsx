import Link from "next/link";
import { Eyebrow, GrapeRule } from "@/components/Deco";
import Atmosphere from "@/components/Atmosphere";

/* Gemeinsame Hülle der Rechtsseiten — ruhige, editoriale Textseite im
   Ivory-Look. Inhalte kommen als Abschnitts-Array, damit alle drei Seiten
   identisch gebaut sind und auf Mobile sauber umbrechen. */

export default function LegalShell({ eyebrow, title, updated, intro, sections }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Atmosphere variant="warm" />
      <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-32 lg:pb-28 lg:pt-36">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 font-playfair text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.08] text-charcoal">
          {title}
        </h1>
        <GrapeRule className="mt-6" />
        {updated && (
          <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
            Stand: {updated}
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
            Fragen dazu? Schreiben Sie uns jederzeit über die{" "}
            <Link
              href="/kontakt"
              className="font-medium text-bordeaux underline decoration-bordeaux/30 underline-offset-2 transition-colors duration-300 hover:decoration-bordeaux"
            >
              Kontaktseite
            </Link>{" "}
            oder an{" "}
            <a
              href="mailto:info@maria-maria.wine"
              className="font-medium text-bordeaux underline decoration-bordeaux/30 underline-offset-2 transition-colors duration-300 hover:decoration-bordeaux"
            >
              info@maria-maria.wine
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
