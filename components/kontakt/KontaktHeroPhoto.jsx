/* Server-Komponente — bewusst OHNE "use client".

   Gleiches Prinzip wie HomeHeroPhoto und WeineHeroPhoto: das <picture>
   steht im server-gerenderten Markup, damit der Preload-Scanner des
   Browsers das Hero-Foto in der ersten Netzwerk-Runde findet — nicht erst
   nach der Hydration. Seit dem 20.08.2026 trägt das Motiv die Kontaktseite
   als volle Foto-Bühne wie auf Startseite, Weinen und Regionen, statt als
   rechte Spalte eines 48/52-Splits. */

import { kontaktBlurFor } from "./kontaktBlur";

const SIZES = "100vw";
const BASE = "/img/kontakt/kontakt-hero-375ml";

/* Die Breitenleiter aus components/media/photoManifest.js (optimize:pages).
   Das Quellfoto ist 1672 px breit — wie das Home-Motiv endet der srcSet
   ehrlich dort statt bei hochgerechneten 1920w. */
const WEBP_SRCSET = [
  `${BASE}-320.webp 320w`,
  `${BASE}-640.webp 640w`,
  `${BASE}-1024.webp 1024w`,
  `${BASE}-1600.webp 1600w`,
  `${BASE}-1672.webp 1672w`,
].join(", ");

/* LQIP aus kontaktBlur.js (optimize:kontakt) — dasselbe Motiv, 20 px breit. */
const BLUR = kontaktBlurFor("hero");

/* Bildanker rechts der Mitte: Die beiden Flaschen stehen bei ~68–87 % der
   Bildbreite, die Gläser davor ab ~51 %. Im harten Hochkant-Ausschnitt des
   Telefons (Fenster ≈ 26 % der Quellbreite) bleiben mit 75 % beide Flaschen
   im Bild, die leere Wand links wandert aus dem Schnitt. Auf dem Desktop
   bleibt links trotzdem genug Wand für den Text unter dem Schleier. */
const POSITION = "object-[75%_50%]";

export function KontaktHeroPreload() {
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

export default function KontaktHeroPhoto({ alt = "" }) {
  return (
    <>
      {BLUR && (
        <img
          src={BLUR}
          alt=""
          aria-hidden="true"
          draggable={false}
          className={`absolute inset-0 h-full w-full scale-[1.04] select-none object-cover blur-xl ${POSITION}`}
        />
      )}
      <picture>
        <source type="image/webp" srcSet={WEBP_SRCSET} sizes={SIZES} />
        <img
          src={`${BASE}-1600.webp`}
          srcSet={WEBP_SRCSET}
          sizes={SIZES}
          alt={alt}
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
