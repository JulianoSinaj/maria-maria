/* Server-Komponente: schiebt einen <link rel="preload"> für das Hero-Foto in
   den <head>. Next hoistet <link>-Elemente aus dem Baum automatisch nach oben.

   Warum zusätzlich zum server-gerenderten <img>: der Preload startet den
   Download bereits beim Head-Parsing — also noch bevor der Body überhaupt
   gelesen wird. Zusammen mit imageSrcSet/imageSizes lädt der Browser exakt
   die Breite, die er gleich auch im <picture> verwenden wird (kein
   Doppel-Download).

   fetchPriority="high" hebt das Foto über die konkurrierenden JS-Chunks. */

import { heroSources } from "./HeroPhoto";

export default function HeroPreload({ wine }) {
  if (!wine.images?.hero) return null;
  const { webpSrcSet, sizes } = heroSources(wine.slug);

  /* Bewusst als roher HTML-String statt als <link …>-JSX:

     React 18 kennt für <link> kein `imageSrcSet`-Prop-Mapping und schreibt
     das Attribut camelCase ins Markup (imageSrcSet="…"). HTML-Attribute sind
     zwar case-insensitiv, aber der Preload-Scanner erwartet `imagesrcset` —
     camelCase im gerenderten String führte dazu, dass der Preload schlicht
     ignoriert wurde und wirkungslos blieb.

     dangerouslySetInnerHTML ist hier unbedenklich: die Werte stammen
     ausschließlich aus dem statischen wine.slug, keine Nutzereingabe. */
  const html = `<link rel="preload" as="image" type="image/webp" imagesrcset="${webpSrcSet}" imagesizes="${sizes}" fetchpriority="high">`;

  return <head dangerouslySetInnerHTML={{ __html: html }} />;
}
