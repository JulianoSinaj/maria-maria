import Link from "next/link";
import Parallax from "@/components/motion/Parallax";
import Photo from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, GoldRule } from "@/components/Deco";
import { Arrow } from "@/components/Icons";

/* Die Geschichte von Maria Maria — das Markenkapitel direkt unter dem
   Magazin-Auftakt: der Sommer 2019 im Salento, die zwei Seelen hinter dem
   Namen und die Reise hinauf zum Gardasee. Inhaltlich der Kanon aus
   „Le Origini" (Startseite), hier als Magazin-Kapitel mit Parallax-Still
   erzählt. */

const JOURNEY = ["Salento", "Apulien", "Kampanien", "Gardasee"];

export default function BrandStory({ className = "", headingId }) {
  return (
    <section
      aria-labelledby={headingId}
      className={`relative mx-auto max-w-content px-6 pb-20 lg:px-10 ${className}`}
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
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
            <p className="mt-5 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
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

          {/* die Reise — Salento → Gardasee */}
          <Reveal delay={0.12}>
            <ol className="mt-7 flex flex-wrap items-center gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/60">
              {JOURNEY.map((stop, i) => (
                <li key={stop} className="flex items-center">
                  {i > 0 && (
                    <span aria-hidden="true" className="mx-2.5 h-px w-5 bg-champagne sm:w-7" />
                  )}
                  <span className={i === 0 || i === JOURNEY.length - 1 ? "text-bordeaux" : ""}>
                    {stop}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex items-center gap-3">
              <GoldRule className="w-12" />
              <p className="font-playfair text-[19px] italic leading-snug text-vine">
                „Italian wine, personal selection, share the pleasure.“
              </p>
            </div>
            <Link
              href="/regionen"
              className="group mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
            >
              Die Reise durch die Regionen entdecken
              <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* ---- Kapitelbild ---- */}
        <Reveal delay={0.15} y={24}>
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
        </Reveal>
      </div>
    </section>
  );
}
