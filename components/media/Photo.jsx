/* Ein <img>, das seine responsiven WebP-Varianten selbst findet.

   Die Seiten hier rendern ihre Bilder von Hand als <picture>/<img> statt über
   next/image — bewusst, weil die Hero-Strecken millimetergenaue Kontrolle über
   Preload, LQIP und Bildanker brauchen (siehe HeroPhoto, HomeHeroPhoto). Der
   Preis dieser Freiheit war, dass jedes gewöhnliche <img> daneben stillschwei-
   gend das Originalbild in voller Größe auslieferte: 1600 px breite Regionen-
   kacheln in 420-px-Slots, 1400 px breite Magazin-Aufmacher in 300-px-Karten.

   <Photo> schließt genau diese Lücke, ohne die Hero-Komponenten anzufassen:
   es schlägt den übergebenen `src` in components/media/photoManifest.js nach
   (erzeugt von scripts/optimize-pages.mjs) und baut daraus einen echten
   srcSet. Kennt das Manifest die Quelle nicht — neues Bild, Admin-Upload,
   Data-URI —, kommt unverändert ein nacktes <img> heraus. Nie ein 404, nie
   ein leerer Rahmen; das Bild wird beim nächsten optimize:pages-Lauf einfach
   von selbst schneller.

   Das Original bleibt der src des <img> und damit der Fallback für Engines
   ohne WebP. Bewusst kein srcSet am <img> selbst: sonst bekäme genau diese
   Minderheit doch wieder Dateien, die sie nicht dekodieren kann.

   `sizes` ist Pflicht, sobald es Varianten gibt — ohne die Angabe nimmt der
   Browser 100vw an und holt die größte Datei, womit der ganze Aufwand ins
   Leere liefe. Deshalb steht unten eine Entwicklungswarnung.

   Keine "use client"-Direktive: die Komponente hat keinen State und keine
   Effekte. So bleibt sie in Server-Komponenten eine Server-Komponente und
   fügt sich in Client-Komponenten ohne Grenzübertritt ein. */

import { PHOTO_MANIFEST } from "@/components/media/photoManifest";

export function photoSrcSet(src) {
  const entry = PHOTO_MANIFEST[src];
  if (!entry) return null;
  return entry.widths.map((w) => `${entry.base}-${w}.webp ${w}w`).join(", ");
}

export default function Photo({
  src,
  alt = "",
  sizes,
  /* Diese Seite lädt fast alles unter dem Falz — lazy ist die richtige
     Vorgabe. Die drei Hero-Fotos rendern ihr eigenes Markup und kommen hier
     gar nicht vorbei; wer sie doch braucht, überschreibt beides explizit. */
  loading = "lazy",
  decoding = "async",
  ...rest
}) {
  const srcSet = src ? photoSrcSet(src) : null;

  if (process.env.NODE_ENV !== "production" && srcSet && !sizes) {
    console.warn(
      `<Photo src="${src}"> hat Varianten, aber kein sizes — der Browser lädt die größte. ` +
        `Bitte die Anzeigebreite angeben, z. B. sizes="(min-width: 1024px) 33vw, 100vw".`
    );
  }

  const img = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={src} alt={alt} loading={loading} decoding={decoding} {...rest} />
  );

  if (!srcSet) return img;

  /* `display: contents` am <picture>: der Wrapper verschwindet aus dem Layout,
     das <img> bleibt direktes Kind seines Elternteils. Ohne das würde ein
     <Photo> in einem flex- oder grid-Container plötzlich eine zusätzliche
     Box einziehen und die Ausrichtung um Haaresbreite verschieben — genau
     die Art Sprung, die es hier nirgends geben darf. So verhält sich <Photo>
     überall exakt wie das <img>, das es ersetzt. */
  return (
    <picture className="contents">
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      {img}
    </picture>
  );
}
