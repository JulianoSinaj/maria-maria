import { Eyebrow } from "@/components/Deco";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import ItalyMap from "@/components/ItalyMap";

/* „Die Herkunft" — ein immersives Panorama statt des alten Teal-Bandes: das
   Regionsfoto füllt die gesamte Karte, ein warmer Espresso-Verlauf (wie im
   „Passt zu"-Kapitel) trägt Erzählung, Italien-Silhouette und Kennzahlen.
   Kein Glas-Chip, kein Leerraum — eine kompakte Bühne, mobil wie am Desktop. */

export default function PlaceSection({ wine }) {
  const { place } = wine;
  const titleWords = place.title.split(" ");
  const lastWord = titleWords.pop();

  return (
    <section id="herkunft" className="scroll-mt-36 px-4 py-6">
      <div className="grain relative mx-auto max-w-[1280px] overflow-hidden rounded-card-lg bg-espresso shadow-lift">
        <Parallax speed={0.08} overscan className="absolute inset-0">
          <img
            src={place.photo}
            alt={place.photoAlt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </Parallax>
        {/* warm scrim — photo breathes above, text sits on solid espresso below */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(33,21,17,0.05)_0%,rgba(33,21,17,0.45)_30%,rgba(33,21,17,0.87)_56%,#211511_82%)] lg:bg-[linear-gradient(to_bottom,rgba(33,21,17,0)_0%,rgba(33,21,17,0.35)_40%,rgba(33,21,17,0.85)_66%,#211511_96%)]"
        />

        <div className="relative px-6 pb-9 pt-44 sm:px-10 sm:pb-11 sm:pt-56 lg:px-14 lg:pb-12 lg:pt-[19rem]">
          <div className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Reveal>
                <Eyebrow light>{place.kicker}</Eyebrow>
                <h2 className="mt-4 font-playfair text-[clamp(2.1rem,3.8vw,3rem)] leading-[1.08] text-ivory">
                  {titleWords.join(" ")} <span className="italic text-champagne-light">{lastWord}</span>
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ivory/75">{place.text}</p>
              </Reveal>
            </div>

            <Reveal delay={0.12}>
              <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:gap-3 lg:pr-2">
                <ItalyMap
                  ghost
                  region={place.region}
                  className="w-14 shrink-0 drop-shadow-lg sm:w-16 lg:w-24"
                />
                <div className="lg:text-center">
                  <p className="font-playfair text-lg leading-tight text-ivory lg:text-xl">
                    {place.chip.title}
                  </p>
                  <p className="mt-0.5 text-[12px] tracking-wide text-ivory/60">
                    {place.chip.subtitle}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Stagger className="mt-9 border-t border-ivory/15 pt-7 lg:mt-10" delay={0.08}>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-10">
              {place.stats.map((s) => (
                <StaggerItem key={s.label}>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-champagne/85">
                    {s.label}
                  </dt>
                  <dd className="mt-1.5 font-playfair text-[17px] leading-snug text-ivory">
                    {s.value}
                  </dd>
                </StaggerItem>
              ))}
            </dl>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
