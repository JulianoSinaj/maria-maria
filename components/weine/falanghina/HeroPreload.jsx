/* Server-Komponente: meldet das Hero-Foto als <link rel="preload"> an, damit
   der Download schon beim Head-Parsing startet — also bevor der Body gelesen
   ist. Zusammen mit imagesrcset/imagesizes holt der Browser exakt die Breite,
   die er gleich im <picture> verwendet (kein Doppel-Download).

   Die Attribute stehen bewusst klein geschrieben: React 18 kennt für <link>
   kein `imageSrcSet`-Mapping und schriebe camelCase wörtlich ins Markup
   (imageSrcSet="…"). Der Preload-Scanner erwartet aber `imagesrcset` — mit
   camelCase bliebe der Hinweis wirkungslos.

   Kein eigenes <head>-Element mehr (die frühere Lösung): React versuchte den
   zweiten <head> gegen den echten Browser-Head abzugleichen, in dem längst
   Nextens Stylesheets und Skripte stehen — das schlug als Hydration-Fehler
   fehl. Next hoistet ein nacktes <link> ohnehin selbst in den Head. */

import { heroSources } from "@/components/weine/pairingPhoto";

export default function HeroPreload({ wine }) {
  if (!wine.images?.hero) return null;
  const { webp, srcSet, sizes } = heroSources(wine.slug);
  if (!webp) return null;

  /* React 18 warnt im Dev-Modus über die kleingeschriebenen Attribute
     („Invalid DOM property `imagesrcset`"). Die Warnung ist hier gewollt in
     Kauf genommen: camelCase würde zwar nicht warnen, aber genau den Preload
     unbrauchbar machen. In der Produktion ist die Prüfung deaktiviert.

     type/href zeigen auf WebP, nicht mehr aufs Original-PNG: der Preload muss
     exakt die Datei anfordern, die das <picture> gleich auswählt — sonst lädt
     der Browser beides. `href` bleibt als Ziel für Engines ohne imagesrcset-
     Unterstützung stehen und nennt die mittlere Breite. */
  return (
    <link
      rel="preload"
      as="image"
      type="image/webp"
      href={webp}
      imagesrcset={srcSet}
      imagesizes={sizes}
      fetchpriority="high"
    />
  );
}
