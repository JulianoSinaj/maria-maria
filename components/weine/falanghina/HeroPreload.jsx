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

import { heroSources } from "./HeroPhoto";

export default function HeroPreload({ wine }) {
  if (!wine.images?.hero) return null;
  const { src, sizes } = heroSources(wine.slug);

  /* React 18 warnt im Dev-Modus über die kleingeschriebenen Attribute
     („Invalid DOM property `imagesrcset`"). Die Warnung ist hier gewollt in
     Kauf genommen: camelCase würde zwar nicht warnen, aber genau den Preload
     unbrauchbar machen. In der Produktion ist die Prüfung deaktiviert. */
  return (
    <link
      rel="preload"
      as="image"
      type="image/png"
      href={src}
      imagesizes={sizes}
      fetchpriority="high"
    />
  );
}
