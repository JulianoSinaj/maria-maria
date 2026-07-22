import { Eyebrow } from "@/components/Deco";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import { Aura, Vines } from "@/components/Atmosphere";
import ItalyMap from "@/components/ItalyMap";

/* „Die Herkunft" — das Luogo-Kapitel als dunkles, meergrünes Band: links die
   Erzählung mit Kennzahlen, rechts das Regionsfoto mit schwebender
   Italien-Karte. Der Farbwechsel markiert den Ortswechsel im Scroll-Film. */

export default function PlaceSection({ wine }) {
  const { place } = wine;
  const titleWords = place.title.split(" ");
  const lastWord = titleWords.pop();

  return (
    <section id="herkunft" className="scroll-mt-36 px-4 py-6">
      <div className="grain relative mx-auto max-w-[1280px] overflow-hidden rounded-card-lg bg-acqua-ink shadow-lift">
        <Aura tint="sea" className="left-[-12%] top-[-18%] h-[34rem] w-[34rem] opacity-40" />
        <Aura tint="olive" drift={2} className="bottom-[-20%] right-[-10%] h-[30rem] w-[30rem] opacity-30" />
        <Vines className="absolute inset-x-0 bottom-0 h-64 w-full opacity-[0.13]" stroke="#C9E8E1" />

        <div className="relative grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:p-16">
          <div>
            <Reveal>
              <Eyebrow light>{place.kicker}</Eyebrow>
              <h2 className="mt-4 font-playfair text-[clamp(2.2rem,4vw,3.2rem)] leading-[1.08] text-ivory">
                {titleWords.join(" ")} <span className="italic text-acqua-light">{lastWord}</span>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ivory/70">{place.text}</p>
            </Reveal>

            <Stagger className="mt-9 border-t border-ivory/10 pt-7" delay={0.1}>
              <dl className="grid grid-cols-2 gap-x-10 gap-y-6">
                {place.stats.map((s) => (
                  <StaggerItem key={s.label}>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-acqua-light/70">
                      {s.label}
                    </dt>
                    <dd className="mt-1.5 font-playfair text-lg leading-snug text-ivory">
                      {s.value}
                    </dd>
                  </StaggerItem>
                ))}
              </dl>
            </Stagger>
          </div>

          <Reveal delay={0.12}>
            <div className="relative pb-8">
              <Parallax
                speed={0.08}
                overscan
                className="aspect-[5/4] overflow-hidden rounded-card shadow-lift"
              >
                <img
                  src={place.photo}
                  alt={place.photoAlt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </Parallax>
              <div className="glass ring-hairline absolute bottom-0 left-6 flex items-center gap-4 rounded-card px-5 py-4 shadow-glass">
                <ItalyMap region={place.region} className="w-14" />
                <div>
                  <p className="font-playfair text-lg leading-tight text-charcoal">
                    {place.chip.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-charcoal/60">{place.chip.subtitle}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
