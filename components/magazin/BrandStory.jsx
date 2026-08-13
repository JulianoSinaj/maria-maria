import Link from "@/components/i18n/LocaleLink";
import Parallax from "@/components/motion/Parallax";
import Photo from "@/components/media/Photo";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Eyebrow, GoldRule } from "@/components/Deco";
import { GhostWord } from "@/components/Atmosphere";
import { Arrow } from "@/components/Icons";

/* Die Geschichte von Maria Maria — das Markenkapitel direkt unter der
   Titelseite: der Sommer 2019 im Salento, die zwei Seelen hinter dem Namen
   und die Reise hinauf zum Gardasee. Inhaltlich der Kanon aus „Le Origini"
   (Startseite), hier als Heftseite gesetzt: Initial im ersten Absatz
   (klassische Buchtypografie), die Reisestationen erscheinen nacheinander
   wie eine sich zeichnende Route, das Foto trägt Passepartout, Bildzeile
   und Folio wie ein aufgezogener Druck. */

const JOURNEY = ["Salento", "Apulien", "Kampanien", "Gardasee"];

export default function BrandStory({ className = "", headingId }) {
  return (
    <section
      aria-labelledby={headingId}
      className={`relative mx-auto max-w-content px-6 pb-14 lg:px-10 ${className}`}
    >
      <GhostWord className="right-[-1vw] top-[-4%] text-[9vw]">Salento</GhostWord>

      <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* ---- Kapiteltext ---- */}
        <div>
          <Reveal>
            <Eyebrow>La nostra storia</Eyebrow>
            <h2
              id={headingId}
              className="mt-4 text-balance font-playfair text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.12] text-charcoal"
            >
              Die Geschichte von <span className="italic text-bordeaux">Maria Maria</span>
            </h2>
            {/* das Initial öffnet das Kapitel wie eine Buchseite */}
            <p className="mt-5 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70 first-letter:float-left first-letter:mr-2.5 first-letter:mt-[0.35rem] first-letter:font-playfair first-letter:text-[3.3rem] first-letter:leading-[0.75] first-letter:text-bordeaux">
              Maria Maria beginnt im Salento, im Sommer 2019 — zwischen Kindheitserinnerungen und
              alten Rebzeilen wurde aus einem Moment eine Erleuchtung: Wein ist für uns kein
              Getränk, sondern ein Katalysator für Emotionen.
            </p>
            <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
              Seitdem führt unsere Reise von den sonnigen Rebzeilen des Salento über die
              Vulkanböden Kampaniens hinauf ans Südufer des Gardasees — jede Flasche eine Station,
              jede Region eine eigene Sprache.
            </p>
          </Reveal>

          {/* die Reise — Salento → Gardasee, Station für Station */}
          <Stagger gap={0.14} delay={0.1}>
            <ol className="mt-5 flex flex-wrap items-center gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/60">
              {JOURNEY.map((stop, i) => (
                <li key={stop} className="flex items-center">
                  <StaggerItem y={10} className="flex items-center">
                    {i > 0 && (
                      <span aria-hidden="true" className="mx-2.5 h-px w-5 bg-champagne sm:w-7" />
                    )}
                    <span className={i === 0 || i === JOURNEY.length - 1 ? "text-bordeaux" : ""}>
                      {stop}
                    </span>
                  </StaggerItem>
                </li>
              ))}
            </ol>
          </Stagger>

          <Reveal delay={0.18}>
            <div className="mt-6 flex items-center gap-3">
              <GoldRule className="w-12" />
              <p className="font-playfair text-[19px] italic leading-snug text-vine">
                „Italian wine, personal selection, share the pleasure.“
              </p>
            </div>
            {/* das Sprungziel des Kapitels: die Erzählseite /geschichte —
                dort geht die Reise Station für Station weiter */}
            <Link
              href="/geschichte"
              className="group mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
            >
              Die ganze Geschichte lesen
              <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* ---- Kapitelbild mit Passepartout, Bildzeile und Folio ---- */}
        <Reveal delay={0.15} y={24}>
          <figure className="relative">
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 z-10 hidden rounded-[2.4rem] border border-champagne/40 sm:block"
              />
              <Parallax
                speed={0.09}
                overscan
                className="overflow-hidden rounded-card-lg shadow-lift aspect-[5/4] lg:aspect-[4/5]"
              >
                <Photo
                  src="/img/sotria.webp"
                  alt="Handlese der Trauben — der Anfang jeder Maria-Maria-Geschichte"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </Parallax>
              <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                Est. 2019
              </span>
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4">
              <span className="font-playfair text-[12.5px] italic text-charcoal/55">
                La vendemmia — die Handlese, der Anfang jeder Geschichte.
              </span>
              <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.26em] text-charcoal/35">
                MM <span aria-hidden="true">·</span> Cap. I
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
