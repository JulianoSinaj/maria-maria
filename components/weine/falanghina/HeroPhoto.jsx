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
/* Dateiliste und URL-Bau liegen in pairingPhoto.js, weil dieselbe Datei auch
   die Sektion „Der Maria-Maria-Moment" trägt (PairingScene, Client-Komponente).
   Sie darf dafür nicht diese Server-Komponente importieren müssen. */
import { heroSources } from "@/components/weine/pairingPhoto";

export default function HeroPhoto({ wine, className = "" }) {
  const { src, sizes } = heroSources(wine.slug);
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
        <img
          src={src}
          sizes={sizes}
          alt={`${wine.name} – das passende Gericht`}
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
