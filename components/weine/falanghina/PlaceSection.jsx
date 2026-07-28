import { Eyebrow, GoldRule } from "@/components/Deco";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import { Aura } from "@/components/Atmosphere";

/* „Die Herkunft" — immersives Vollbild-Kapitel im Stil des Maria-Moments:
   das Regionsfoto trägt als leicht weichgezeichneter Hintergrund die ganze
   Sektion (federnder Parallax-Drift), darüber liegen Espresso-Schleier für
   Lesbarkeit. Die Erzählung liegt links, die Kennzahlen ruhen unten auf
   einer Hairline. Ober- und Unterkante blenden in das Elfenbein der
   Nachbarsektionen. Das Foto wird über place.photo bzw. place.region
   aufgelöst. */

const REGION_PHOTO = {
  apulien: "/img/home/region-apulien.webp",
  kampanien: "/img/home/region-kampanien.webp",
  garda: "/img/home/region-garda.webp",
};

/* Fallback für Regionen ohne eigenes Foto: die vermattete Sud-Italia-Karte */
const MAP_BG = "/img/map-sud-italia.jpg";

export default function PlaceSection({ wine }) {
  const { place } = wine;
  const photo = place.photo || REGION_PHOTO[place.region];
  const titleWords = place.title.split(" ");
  const lastWord = titleWords.pop();

  return (
    <section id="herkunft" className="grain relative scroll-mt-36 overflow-hidden">
      {/* ---- Foto-Bühne: weichgezeichnet, federnd driftend, abgedunkelt ---- */}
      <div aria-hidden="true" className="absolute inset-0">
        <Parallax speed={0.08} overscan className="h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo || MAP_BG}
            alt=""
            loading="lazy"
            className={`h-full w-full object-cover ${
              photo ? "blur-[3px] brightness-[0.95] saturate-[1.12]" : "blur-[10px] saturate-[0.85]"
            }`}
          />
        </Parallax>
        {/* Warmer Farb-Grade statt flachem Schleier: ein espresso-bordeaux-
            getönter Lese-Scrim von links, eine weiche Rand-Vignette und ein
            geerdeter Boden unter den Kennzahlen — alle Verläufe mehrstufig
            entschärft, damit nirgends eine sichtbare Kante entsteht */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(112deg, rgba(33,21,17,0.78) 0%, rgba(48,22,20,0.52) 30%, rgba(58,24,23,0.28) 56%, rgba(33,21,17,0.12) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(115% 95% at 50% 42%, transparent 52%, rgba(33,21,17,0.38) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-56"
          style={{
            background:
              "linear-gradient(to top, rgba(33,21,17,0.72) 0%, rgba(33,21,17,0.5) 30%, rgba(33,21,17,0.24) 62%, rgba(33,21,17,0) 100%)",
          }}
        />
        {/* Kanten blenden weich ins Elfenbein der Nachbarsektionen */}
        <div
          className="absolute inset-x-0 top-0 h-28"
          style={{
            background:
              "linear-gradient(to bottom, #F7F4EF 0%, rgba(247,244,239,0.55) 38%, rgba(247,244,239,0.18) 72%, rgba(247,244,239,0) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{
            background:
              "linear-gradient(to top, #F7F4EF 0%, rgba(247,244,239,0.55) 38%, rgba(247,244,239,0.18) 72%, rgba(247,244,239,0) 100%)",
          }}
        />
      </div>

      {/* warme Goldnote über dem Abendlicht */}
      <Aura tint="gold" className="right-[-12%] top-[-22%] h-96 w-96 opacity-25" />

      {/* ---- Inhalt ---- */}
      <div className="relative mx-auto max-w-content px-6 py-20 sm:py-24 lg:px-10 lg:py-28">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow light>{place.kicker}</Eyebrow>
            <h2 className="mt-4 font-playfair text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.08] text-ivory">
              {titleWords.join(" ")} <span className="italic text-champagne-light">{lastWord}</span>
            </h2>
            <GoldRule className="mt-6 w-40" />
            <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-ivory/80">{place.text}</p>
          </Reveal>
        </div>

        {/* Kennzahlen auf ruhiger Hairline */}
        <Stagger className="mt-12 border-t border-ivory/15 pt-7 lg:mt-16" delay={0.08}>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-10">
            {place.stats.map((s) => (
              <StaggerItem key={s.label}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne/90">
                  {s.label}
                </dt>
                <dd className="mt-1.5 font-playfair text-[16px] leading-snug text-ivory">{s.value}</dd>
              </StaggerItem>
            ))}
          </dl>
        </Stagger>
      </div>
    </section>
  );
}
