/* Server-Komponente — bewusst OHNE "use client".

   Gleiches Prinzip wie HomeHeroPhoto und WeineHeroPhoto: das <picture> steht
   im server-gerenderten Markup, damit der Preload-Scanner des Browsers das
   Hero-Foto in der ersten Netzwerk-Runde findet — nicht erst nach der
   Hydration.

   Die Varianten erzeugt scripts/optimize-geschichte-hero.mjs aus
   public/img/magazin/tavolata.jpg (915 px breit); die Breiten darüber sind
   dort vorab mit Lanczos hochgerechnet und nachgeschärft. */

const SIZES = "100vw";
const BASE = "/img/geschichte/hero";

const WEBP_SRCSET = [
  `${BASE}-640.webp 640w`,
  `${BASE}-1280.webp 1280w`,
  `${BASE}-1600.webp 1600w`,
  `${BASE}-1920.webp 1920w`,
].join(", ");

/* LQIP: 20 px breite WebP-Vorschau als Data-URI (136 B), erzeugt vom
   Skript oben (quality 28, effort 6). */
const BLUR =
  "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAADwAwCdASoUAA8APxl0slEspqSisAgBkCMJYwCdACLGS/Yetb3y4H4AAP58ItJpqdz1x7L1ERqjrTRMe9JuAy6LJw77/VyNth0YGDYa2RYLhlelnSuRmZtpobS2c+ShZpvaDreeuAMpsy1XxeQAg4AGQgAAAA==";

/* Bildanker. Zwei Werte, zwei getrennte Aufgaben — das Foto ist 4:3, also
   greift im Querformat NUR die Y-Achse (beschnitten wird oben/unten) und im
   Hochkant des Telefons nur die X-Achse:

   100 % vertikal (Unterkante) — auf dem Desktop wandert das Pergola-Dach
   aus dem oberen Rand. Das hebt die beiden Gesichter in die obere Bildhälfte
   und macht darunter die Tafel frei, auf der der Schleier und der Text
   liegen. Mit dem früheren Wert saß die Nonna genau unter der Headline.
   32 % horizontal — im Hochkant passt nur gut ein Drittel der Bildbreite in
   den Schnitt; dieser Ausschnitt hält beide Gesichter darin, die jüngere
   Maria links, die Nonna rechts. */
const POSITION = "object-[32%_100%]";

export function GeschichteHeroPreload() {
  /* Kleingeschriebene Attribute wie in den anderen Preloads — React 18 kennt
     kein imageSrcSet-Mapping, der Scanner erwartet imagesrcset. */
  return (
    <link
      rel="preload"
      as="image"
      type="image/webp"
      imagesrcset={WEBP_SRCSET}
      imagesizes={SIZES}
      fetchpriority="high"
    />
  );
}

export default function GeschichteHeroPhoto() {
  return (
    <>
      <img
        src={BLUR}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`absolute inset-0 h-full w-full scale-[1.04] select-none object-cover blur-xl ${POSITION}`}
      />
      <picture>
        <source type="image/webp" srcSet={WEBP_SRCSET} sizes={SIZES} />
        <img
          src={`${BASE}-1280.webp`}
          srcSet={WEBP_SRCSET}
          sizes={SIZES}
          alt="Zwei Generationen an einer langen Tafel unter der Pergola, davor zwei Flaschen Maria Maria"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          draggable={false}
          className={`absolute inset-0 h-full w-full select-none object-cover ${POSITION}`}
        />
      </picture>
    </>
  );
}
