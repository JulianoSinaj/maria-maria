/* Server-Komponente — bewusst OHNE "use client".

   Gleiches Prinzip wie components/weine/falanghina/HeroPhoto: das <picture>
   steht im server-gerenderten Markup, damit der Preload-Scanner des Browsers
   das Hero-Foto in der ersten Netzwerk-Runde findet — nicht erst nach der
   Hydration. Der src des <img> ist bewusst die 1280er WebP-Variante, damit
   Reacts Auto-Preload (<link rel="preload"> aus server-gerendertem <img src>)
   auf ~52 KB zielt statt auf das 183-KB-JPEG. */

const SIZES = "100vw";
const BASE = "/img/home/hero";

/* Das Quellfoto ist 1600 px breit — mehr gibt es nicht, also endet der
   srcSet ehrlich bei 1600w statt bei den 1920w der Wein-Heroes. */
const WEBP_SRCSET = [
  `${BASE}-640.webp 640w`,
  `${BASE}-1280.webp 1280w`,
  `${BASE}-1600.webp 1600w`,
].join(", ");

/* LQIP: 20 px breite WebP-Vorschau als Data-URI (112 B), erzeugt mit den
   Einstellungen aus scripts/optimize-heroes.mjs (quality 28, effort 6).
   Bewusst hier statt in heroBlur.js — die Datei wird beim nächsten
   optimize:heroes-Lauf komplett aus public/img/wines neu generiert und
   würde einen Home-Eintrag stillschweigend verlieren. */
const BLUR =
  "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQBACdASoUAAsAPxl0sVCspqSisAgBkCMJQBOmUABfktEaDQuUthusAAD4/SkHb/7Bcz1UyDDfXU9YZmqqhdf7LzxG5XV4AGP3UgoPK3IHcY9UmQd6iqS5MgK2aAAA";

/* Bildanker leicht rechts der Mitte: so bleibt die Flasche auch im harten
   Hochkant-Ausschnitt des Handys im Bild, während die Frau links aus dem
   Schnitt wandern darf. */
const POSITION = "object-[58%_42%]";

export function HomeHeroPreload() {
  /* Kleingeschriebene Attribute wie in HeroPreload der Weinseiten — React 18
     kennt kein imageSrcSet-Mapping, der Scanner erwartet imagesrcset. */
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

export default function HomeHeroPhoto() {
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
          alt="Maria-Maria-Flasche und ein Glas Rotwein auf einer Steinterrasse über den Hügeln der Toskana im Abendlicht"
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
