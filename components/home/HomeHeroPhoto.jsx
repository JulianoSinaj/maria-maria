/* Server-Komponente — bewusst OHNE "use client".

   Gleiches Prinzip wie components/weine/falanghina/HeroPhoto: das <picture>
   steht im server-gerenderten Markup, damit der Preload-Scanner des Browsers
   das Hero-Foto in der ersten Netzwerk-Runde findet — nicht erst nach der
   Hydration. Der src des <img> ist bewusst die 1280er WebP-Variante, damit
   Reacts Auto-Preload (<link rel="preload"> aus server-gerendertem <img src>)
   auf ~79 KB zielt statt auf das 185-KB-JPEG. */

const SIZES = "100vw";
const BASE = "/img/home/hero";

/* Das Quellfoto (hero111.png) ist 1596 px breit und wird beim Ableiten
   minimal auf 1600 px normalisiert (0,25 % — unsichtbar), damit Dateinamen
   und Deskriptoren zusammenpassen. Mehr gibt es nicht, also endet der
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
  "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAADQAwCdASoUAAkAPxl2slEspySisAgBkCMJQBWABD0hiiyTJ2NKPgAA/ORL9QItOrTtHNAE7WqWkNAikEKyZmx0lQ7VfAL2xN6bJ+Btpc+ZXIxqg/zonZ3lT05YL0MII7IXQAAA";

/* Bildanker deutlich rechts der Mitte: das Foto ist mit 1600×685 sehr breit,
   der Hochkant-Ausschnitt des Handys schneidet also viel weg. Bei 68 % bleiben
   die Nonna und die beiden Flaschen im Bild, während das leere Tischende links
   aus dem Schnitt wandern darf. */
const POSITION = "object-[68%_50%]";

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
          alt="Große italienische Familientafel unter einer Loggia: drei Generationen essen und lachen gemeinsam, dazwischen Flaschen Maria Maria und gefüllte Weingläser"
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
