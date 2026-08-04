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

/* Kodiert einen Dateinamen für den URL-Pfad: encodeURIComponent() erwischt
   Leerzeichen, Halbgeviertstriche, Umlaute und typografische Anführungszeichen —
   kodiert aber auch das Komma zu %2C. Genau daran scheitert Nexts statischer
   Datei-Handler: er vergleicht gegen die nicht dekodierten Pfadsegmente und
   antwortet auf %2C mit 404, während das literale Komma sauber ausgeliefert
   wird. Das Komma wird deshalb wieder zurückgedreht; es ist in einem Pfad-
   segment ohnehin ein erlaubtes Zeichen (RFC 3986 sub-delims).
   Die Dateien auf der Platte bleiben unangetastet. */
export function encodePairingFile(file) {
  return encodeURIComponent(file).replace(/%2C/g, ",");
}

/* Food-Pairing-Foto je Wein — das Gericht, das der jeweilige Wein begleitet,
   trägt jetzt die Hero-Bühne. Die Dateinamen tragen Leerzeichen, Halbgeviert-
   striche, Umlaute und typografische Anführungszeichen; sie bleiben auf der
   Platte unverändert und werden beim Bauen der URL kodiert (siehe unten). */
const PAIRING_FILE = {
  falanghina: "Beneventano Falanghina IGP – Bernsteinmakrele „all’acqua pazza“ mit Kirschtomaten.png",
  "greco-di-tufo": "Greco di Tufo DOCG – Spaghetti mit Venusmuscheln.png",
  "il-bianco-greco-cuvee": "Il Bianco – Campania Bianco IGP – Paccheri mit Garnelen, Zucchini und Zitrone.png",
  "il-rosso-aglianico": "Il Rosso – Aglianico – Irpinisches Ofenlamm mit Kartoffeln und Rosmarin.png",
  lugana: "Lugana DOC – Risotto mit Gardasee-Felchen, Zitrone und Kräutern.png",
  "primitivo-14-5": "Primitivo di Manduria DOP 14,5 – Orecchiette mit Braciole-Ragù und Cacioricotta.png",
  "primitivo-15-5": "Primitivo di Manduria 15,5 –geschmorte Rinderbacke mit Kartoffelcreme.png",
  "primitivo-salento": "Primitivo Salento IGP – Gegrillte apulische Bombette mit Caciocavallo.png",
  "rosato-puglia": "Rosato Puglia IGP – Salentinischer Oktopus mit Tomaten und Kartoffeln.png",
};

export function heroSources(slug) {
  const src = `/img/food-pairing/${encodePairingFile(PAIRING_FILE[slug])}`;
  /* Kein srcSet: von diesen PNGs existieren keine vorab optimierten
     -640/-1280/-1920.webp-Varianten wie beim früheren Kellerei-Foto.
     Ein srcSet auf nicht existierende Dateien liefe in 404s. */
  return { src, sizes: SIZES };
}

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
