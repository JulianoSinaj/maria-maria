import Parallax from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { photoSources } from "@/components/kontakt/kontaktPhotos";
import { kontaktBlurFor } from "@/components/kontakt/kontaktBlur";

/* Sektion 04 — Emotional Brand Bridge (Handoff §7).

   Ab lg: Full-bleed-Foto (Lugana & Rosato am gedeckten Abendtisch), darüber
   ein dunkler Verlauf, der LINKS dicht ist und nach rechts ausläuft — der
   Text steht links und bleibt lesbar, die Flaschen rechts der Mitte bleiben
   frei (Handoff: „Il copy deve restare leggibile e non sovrapporsi alle
   bottiglie").

   Unter lg wäre derselbe Aufbau ein Widerspruch: Ein 2,4:1-Panorama zeigt im
   Hochkant-Ausschnitt nur ein Viertel seiner Breite, und der Text läge
   zwangsläufig auf den Flaschen. Deshalb stapelt die Sektion dort: Foto
   oben (Ausschnitt auf die Flaschen), Text darunter auf Espresso, mit einem
   senkrechten Verlauf als Übergang. Reihenfolge und Inhalt bleiben dieselben
   (Handoff §1: „Le proporzioni possono adattarsi al responsive").

   Das Foto driftet leicht im Scroll (Parallax mit Überscan, Feder statt
   roher Koordinaten), bei Reduced Motion steht es still. Es liegt unter dem
   Falz: lazy, mit LQIP als Platzhalter. Keine "use client"-Direktive —
   Parallax und Reveal sind Client-Primitive, der Rest ist Markup. */

const BRIDGE = photoSources("bridge");

/* Bildanker: unter lg mittig auf die beiden Flaschen (≈ 66 % Bildbreite),
   ab lg etwas links davon, damit Gläser und Kerze rechts mit ins Bild kommen */
const POSITION = "object-[66%_50%] lg:object-[60%_50%]";

export default function BrandBridge({ copy }) {
  const blur = kontaktBlurFor("bridge");
  return (
    <section
      aria-labelledby="kontakt-bridge-title"
      className="relative isolate overflow-hidden bg-espresso text-ivory"
    >
      {/* Foto: gestapelt über dem Text, ab lg als Bühne dahinter */}
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[2/1] lg:absolute lg:inset-0 lg:aspect-auto">
        <Parallax speed={0.07} overscan className="h-full w-full">
          {blur && (
            <img
              src={blur}
              alt=""
              aria-hidden="true"
              draggable={false}
              className={`absolute inset-0 h-full w-full scale-[1.04] select-none object-cover blur-xl ${POSITION}`}
            />
          )}
          <picture>
            <source type="image/webp" srcSet={BRIDGE.srcSet} sizes={BRIDGE.sizes} />
            <img
              src={BRIDGE.fallback}
              width={BRIDGE.width}
              height={BRIDGE.height}
              alt={copy.imageAlt}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={`absolute inset-0 h-full w-full select-none object-cover ${POSITION}`}
            />
          </picture>
        </Parallax>
        {/* Lesbarkeits-Verlauf: unter lg von unten ins Espresso des Textfelds,
            ab lg von links (dicht) nach rechts (offen) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/25 to-transparent lg:bg-gradient-to-r lg:from-espresso/85 lg:via-espresso/40 lg:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-espresso/50 to-transparent lg:block"
        />
      </div>

      <div className="relative mx-auto -mt-16 max-w-content px-6 pb-16 sm:-mt-20 lg:mt-0 lg:px-10 lg:py-36">
        <Reveal className="max-w-[34rem]">
          <h2
            id="kontakt-bridge-title"
            className="text-balance font-playfair text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.12] text-ivory"
          >
            {copy.title}
          </h2>
          <p className="mt-5 max-w-[30rem] text-[14.5px] leading-relaxed text-ivory/85 sm:text-[15px]">
            {copy.text}
          </p>
          <p className="mt-7 font-playfair text-[17px] italic text-champagne-light sm:text-[18px]">
            {copy.tagline}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
