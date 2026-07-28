import { Eyebrow } from "@/components/Deco";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import ItalyMap from "@/components/ItalyMap";

/* „Die Herkunft" — ein immersives Foto-Kapitel: das Regionsfoto der Startseite
   (Region-Explorer) trägt die Bühne. Der Foto-Rahmen ist auf das exakte
   Seitenverhältnis der Datei verriegelt — kein Beschnitt, kein Zoom, kein
   Drift: die eingezeichnete Italien-Karte und jedes Detail der Landschaft
   bleiben auf jedem Viewport vollständig sichtbar. Nach unten blendet das
   Foto in massives Espresso, das Erzählung, Italien-Silhouette und
   Kennzahlen trägt. Das Foto wird über place.region aufgelöst. */

const REGION_PHOTO = {
  apulien: "/img/home/region-apulien.webp",
  kampanien: "/img/home/region-kampanien.webp",
  garda: "/img/home/region-garda.webp",
};

/* Fallback für Regionen ohne eigenes Foto: die vermattete Sud-Italia-Karte */
const MAP_BG = "/img/map-sud-italia.jpg";

export default function PlaceSection({ wine }) {
  const { place } = wine;
  const photo = REGION_PHOTO[place.region];
  const titleWords = place.title.split(" ");
  const lastWord = titleWords.pop();

  return (
    <section id="herkunft" className="scroll-mt-36 px-4 py-6">
      <div className="grain relative mx-auto max-w-[1280px] overflow-hidden rounded-card-lg bg-espresso shadow-lift">
        {/* Foto-Bühne im Original-Seitenverhältnis (1672×941) — der Rahmen ist
            deckungsgleich mit der Datei, es geht kein einziger Pixel verloren */}
        <div className="relative aspect-[1672/941] w-full">
          <img
            src={photo || MAP_BG}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover ${
              photo ? "" : "blur-[8px] saturate-[0.85]"
            }`}
            loading="lazy"
          />
          {/* weicher Übergang in den Espresso-Körper darunter */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent via-espresso/70 to-espresso"
          />
        </div>

        {/* Inhalt — schiebt sich in die verlaufsgedeckte untere Bildzone;
            mobil läuft er auf massivem Espresso unter dem Foto weiter */}
        <div className="relative -mt-14 px-6 pb-9 sm:-mt-24 sm:px-10 sm:pb-11 lg:-mt-40 lg:px-14 lg:pb-12">
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
