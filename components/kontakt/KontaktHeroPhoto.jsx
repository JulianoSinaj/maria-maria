/* Server-Komponente — bewusst OHNE "use client".

   Das Hero-Foto der Kontaktseite ist ihr LCP. Damit der Preload-Scanner des
   Browsers es in der ersten Netzwerk-Runde findet (und nicht erst nach der
   Hydration), steht das <picture> hier im server-gerenderten Markup — gleiche
   Bauweise wie components/home/HomeHeroPhoto.jsx.

   Der `src` des <img> ist die 1024er WebP-Variante, nicht das 1,7-MB-PNG:
   Reacts Auto-Preload aus server-gerendertem <img src> zielt damit auf ~24 KB.
   Den srcSet trägt das <img> selbst noch einmal, damit auch der Fallback-Pfad
   ohne <source> die passende Breite zieht (Handoff §17: „Hero responsive in
   WebP mit srcset/sizes und expliziten Maßen. Nicht lazy-loaden.").

   Bildanker rechts der Mitte: Il Rosso und Il Bianco stehen bei ~68–86 %
   Bildbreite, links ist Wand. Im hohen Desktop-Ausschnitt (50 vw × ~800 px)
   zeigt object-cover auf 1440 px nur die halbe Bildbreite — mit 76 % sind
   beide Flaschen ganz im Bild (Ausschnitt ≈ 38–88 %), die Gläser bleiben
   links davon, die Wand wandert aus dem Schnitt. */

import { photoSources } from "@/components/kontakt/kontaktPhotos";
import { kontaktBlurFor } from "@/components/kontakt/kontaktBlur";

const HERO = photoSources("hero");
const POSITION = "object-[76%_50%]";

export function KontaktHeroPreload() {
  /* Kleingeschriebene Attribute wie in HomeHeroPreload — React 18 kennt kein
     imageSrcSet-Mapping, der Scanner erwartet imagesrcset. */
  return (
    <link
      rel="preload"
      as="image"
      type="image/webp"
      imagesrcset={HERO.srcSet}
      imagesizes={HERO.sizes}
      fetchpriority="high"
    />
  );
}

export default function KontaktHeroPhoto({ alt = "" }) {
  const blur = kontaktBlurFor("hero");
  return (
    <>
      {/* LQIP: ~110 Byte Data-URI, deckt die Fläche sofort ab — kein
          cremefarbener Blitz, bevor das Foto da ist. */}
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
        <source type="image/webp" srcSet={HERO.srcSet} sizes={HERO.sizes} />
        <img
          src={HERO.src}
          srcSet={HERO.srcSet}
          sizes={HERO.sizes}
          width={HERO.width}
          height={HERO.height}
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
