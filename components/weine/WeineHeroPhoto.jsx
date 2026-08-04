/* Server-Komponente — bewusst OHNE "use client".

   Gleiches Prinzip wie HomeHeroPhoto: das <picture> steht im server-
   gerenderten Markup, damit der Preload-Scanner des Browsers das Hero-Foto
   in der ersten Netzwerk-Runde findet — nicht erst nach der Hydration. */

const SIZES = "100vw";
const BASE = "/img/weine/hero";

/* Das Panorama-Quellfoto ist 1600 px breit. Der Hero füllt aber 100svh —
   auf Desktop streckt object-cover das Foto deutlich über 1600 px hinaus.
   Die 1920er/2560er Varianten sind deshalb vorab mit Lanczos hochskaliert
   und nachgeschärft, damit nicht der Browser weich hochrechnet. */
const WEBP_SRCSET = [
  `${BASE}-640.webp 640w`,
  `${BASE}-1280.webp 1280w`,
  `${BASE}-1600.webp 1600w`,
  `${BASE}-1920.webp 1920w`,
  `${BASE}-2560.webp 2560w`,
].join(", ");

/* LQIP: 20 px breite WebP-Vorschau als Data-URI (102 B), erzeugt mit den
   Einstellungen aus scripts/optimize-heroes.mjs (quality 28, effort 6). */
const BLUR =
  "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAABwAwCdASoUAAgAPxl2slEspySisAgBkCMJQBadBEAdxwewB+AA/ma//tj8kduJ36uChUQOWlyfpd/LPU3r5Zwyb+oeZC0umn9A3VkMAAA=";

/* Rosé-Flasche als Bildmitte: im schmalen Hochkant-Schnitt des Handys bleibt
   die Neuner-Reihe um ihre helle Mitte herum im Bild, der Himmel darf oben
   aus dem Schnitt wandern. */
const POSITION = "object-[50%_68%]";

export function WeineHeroPreload() {
  /* Kleingeschriebene Attribute — React 18 kennt kein imageSrcSet-Mapping,
     der Preload-Scanner erwartet imagesrcset. */
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

export default function WeineHeroPhoto() {
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
          src={`${BASE}-1600.webp`}
          srcSet={WEBP_SRCSET}
          sizes={SIZES}
          alt="Alle neun Maria-Maria-Weine aufgereiht auf einer Steinmauer vor süditalienischer Hügellandschaft im Abendlicht"
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
