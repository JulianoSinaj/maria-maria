import Button from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, GoldRule } from "@/components/Deco";
import Atmosphere, { GhostWord } from "@/components/Atmosphere";
import SoulCards from "@/components/SoulCards";

/* Le Origini auf der Startseite — die Markengeschichte gehört an den Anfang
   der Reise, nicht nur in den Shop: der Sommer 2019 im Salento, die zwei
   Seelen hinter dem Namen und der Weg vom Salento hinauf zum Gardasee.

   Text kommt als `t` aus content/<sprache>/home.js (Abschnitt `origins`);
   „Le Origini" und „Due anime" bleiben als italienische Marken-Setzungen
   in jeder Sprache stehen. */

export default function OriginsSection({ t = {}, souls }) {
  const journey = t.journey ?? [];

  return (
    <section className="relative overflow-hidden">
      <Atmosphere variant="olive" />
      <GhostWord className="right-[-3vw] top-10 text-[11vw]">Due anime</GhostWord>
      <div className="relative mx-auto max-w-content px-6 py-16 sm:py-24 lg:px-10">
        {/* Sprung ins Magazin — als elegante Champagne-Gold-Pille ganz oben rechts;
            auf Mobile wandert der Button unter den Text, wo Platz ist.
            Premium-Variante für Luxus-Appeal und visuellen Impact */}
        <div className="absolute right-6 top-8 z-10 hidden sm:top-10 sm:block lg:right-10">
          <Reveal delay={0.1}>
            <Button href="/geschichte" variant="premium" size="sm">
              {t.cta}
            </Button>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* story */}
          <div>
            <Reveal>
              <Eyebrow>Le Origini</Eyebrow>
              <h2 className="mt-4 text-balance font-playfair text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.12] text-charcoal">
                {t.title} <span className="italic text-bordeaux">{t.titleAccent}</span>
              </h2>
              {(t.paragraphs ?? []).map((text, i) => (
                <p
                  key={i}
                  className={`${i === 0 ? "mt-5" : "mt-4"} max-w-lg text-[13.5px] leading-relaxed text-charcoal/70`}
                >
                  {text}
                </p>
              ))}
            </Reveal>

            {/* the journey — Salento → Gardasee */}
            <Reveal delay={0.12}>
              <ol className="mt-7 flex flex-wrap items-center gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-bordeaux">
                {journey.map((stop, i) => (
                  <li key={stop} className="flex items-center">
                    {i > 0 && (
                      <span aria-hidden="true" className="mx-2.5 h-px w-[15px] bg-champagne sm:w-[21px]" />
                    )}
                    <span>{stop}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex items-center gap-3">
                <GoldRule className="w-12" />
                <p className="font-playfair text-[19px] italic leading-snug text-vine">{t.quote}</p>
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-8 sm:hidden">
                <Button href="/geschichte" variant="premium" size="sm">
                  {t.cta}
                </Button>
              </div>
            </Reveal>
          </div>

          {/* the double soul */}
          <SoulCards souls={souls} />
        </div>
      </div>
    </section>
  );
}
