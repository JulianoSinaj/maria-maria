/* Server-Komponente — bewusst OHNE "use client".

   Der Grund ist der Kern der Ladezeit-Optimierung: läge dieses <picture> im
   Client-Hero, existierte es im ausgelieferten HTML noch gar nicht. Der
   Preload-Scanner des Browsers — der das Dokument liest, lange bevor React
   hydriert — fände nichts, und der Download startete erst nach dem Ausführen
   des JS-Bundles. Genau das erzeugte das langsame Nachladen des Hero-Fotos.

   Hier steht das Bild direkt im Server-Markup: der Scanner findet es in der
   ersten Netzwerk-Runde, parallel zum JS. Der Client-Hero legt seine
   Scroll-Choreografie später nur noch über dieses fertige Element (siehe
   FalanghinaHero, motion.div-Wrapper). */

import { heroBlurFor } from "@/components/weine/heroBlur";

/* Muss zur Layout-Logik im Hero passen: das Foto füllt immer den vollen
   Viewport, deshalb 100vw. Ohne sizes lädt der Browser die größte Quelle. */
const SIZES = "100vw";

export function heroSources(slug) {
  const base = `/img/wines/${slug}/hero`;
  return {
    webpSrcSet: [`${base}-640.webp 640w`, `${base}-1280.webp 1280w`, `${base}-1920.webp 1920w`].join(", "),
    /* Wichtig: der src des <img> ist bewusst eine WebP-Variante, nicht das
       hero.jpg. React 18 (Float) hebt für jedes server-gerenderte <img src>
       automatisch einen <link rel="preload"> in den <head> — und versteht
       dabei <picture>/<source> NICHT. Stünde hier das Original, lüde jeder
       Besucher zusätzlich zum WebP noch die ~300 KB JPEG über den kritischen
       Pfad. Mit der 1280er WebP als src zielt der Auto-Preload auf ~60 KB.

       Kein JPEG-Fallback im Markup: WebP wird von jedem Browser unterstützt,
       der auch <picture> kennt (Safari ab 14, Edge ab 18) — ein zusätzlicher
       <source> würde nur den Auto-Preload wieder auf das Original lenken.
       Die hero.jpg bleibt als Quelldatei für scripts/optimize-heroes.mjs. */
    src: `${base}-1280.webp`,
    sizes: SIZES,
  };
}

export default function HeroPhoto({ wine, className = "" }) {
  const { webpSrcSet, src, sizes } = heroSources(wine.slug);
  const blur = heroBlurFor(wine.slug);

  return (
    <>
      {/* LQIP: ~145 Byte Data-URI, steht sofort im Markup und deckt die Bühne
          ab, solange das volle Foto noch fliegt — kein weißer Blitz. */}
      {blur && (
        <img
          src={blur}
          alt=""
          aria-hidden="true"
          draggable={false}
          className={`absolute inset-0 h-full w-full scale-[1.04] select-none object-cover object-[50%_42%] blur-xl ${className}`}
        />
      )}
      <picture>
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
        <img
          src={src}
          /* srcSet auch am <img>: so wählt der Browser die passende Breite
             selbst dann, wenn er das <source> überspringt — und trifft damit
             exakt die Datei, die der Preload schon geholt hat. */
          srcSet={webpSrcSet}
          sizes={sizes}
          alt={`${wine.name} – Flasche in der Kellerei`}
          /* fetchPriority high + eager: dieses Bild IST der LCP der Seite,
             es darf sich nicht hinter Fonts oder Chunks einreihen. */
          fetchPriority="high"
          loading="eager"
          decoding="async"
          draggable={false}
          className={`absolute inset-0 h-full w-full select-none object-cover object-[50%_42%] ${className}`}
        />
      </picture>
    </>
  );
}
