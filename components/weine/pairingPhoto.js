/* Eine Quelle für das Food-Pairing-Foto je Wein.

   Dasselbe Bild trägt zweimal auf der Landingpage: oben als Hero-Bühne
   (HeroPhoto/HeroPreload, server-gerendert) und weiter unten in der Sektion
   „Der Maria-Maria-Moment" (PairingScene, Client). Weil beide exakt denselben
   srcSet anfordern, kostet der zweite Auftritt kein einziges Byte extra — der
   Browser bedient ihn aus dem Cache, das Foto steht dort sofort.

   Deshalb liegen Dateiliste und URL-Bau hier und nicht in der Server-
   Komponente: ein Client-Import von HeroPhoto zöge sonst die Komponente
   mitsamt Markup ins Client-Bundle. Dieses Modul ist reine Datenlogik — und
   wird aus demselben Grund auch von scripts/optimize-pairing.mjs importiert,
   damit es im Projekt nur eine einzige Slug→Datei-Liste gibt. */

/* Die Dateinamen tragen Leerzeichen, Halbgeviertstriche, Umlaute und
   typografische Anführungszeichen; sie bleiben auf der Platte unverändert und
   werden erst beim Bauen der URL kodiert (siehe encodePairingFile). */
export const PAIRING_FILE = {
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

/* Alle Motive liegen im selben Seitenverhältnis vor. Die Maße stehen im
   Markup, damit beim Laden nichts springt (CLS). */
export const PAIRING_PHOTO_SIZE = { width: 1774, height: 887 };

const BASE = "/img/food-pairing";

/* Breiten decken Handy (1x/2x), Tablet und Desktop ab; 1774 ist die native
   Breite der Motive — mehr gibt das Original nicht her, also endet der srcSet
   ehrlich dort statt bei den 1920w der Kellerei-Heroes.
   Muss zu scripts/optimize-pairing.mjs passen; das Skript importiert diese
   Liste, damit beide Seiten nicht auseinanderlaufen können. */
export const PAIRING_WIDTHS = [640, 1280, 1774];

/* Dateiname einer optimierten Variante. Slug statt Original-Dateiname, weil
   ein srcSet seine Kandidaten am Komma trennt — und mehrere Originalnamen ein
   Komma tragen („Primitivo di Manduria 15,5 …“). Ein prozentkodiertes %2C
   wäre die Alternative, aber genau daran scheitert Nexts statischer Handler
   (siehe encodePairingFile). Slugs sind URL-sicher und brauchen gar keine
   Kodierung. */
export function pairingVariantFile(slug, width) {
  return `${slug}-${width}.webp`;
}

/* Kodiert einen Dateinamen für den URL-Pfad: encodeURIComponent() erwischt
   Leerzeichen, Halbgeviertstriche, Umlaute und typografische Anführungszeichen —
   kodiert aber auch das Komma zu %2C. Genau daran scheitert Nexts statischer
   Datei-Handler: er vergleicht gegen die nicht dekodierten Pfadsegmente und
   antwortet auf %2C mit 404, während das literale Komma sauber ausgeliefert
   wird. Das Komma wird deshalb wieder zurückgedreht; es ist in einem Pfad-
   segment ohnehin ein erlaubtes Zeichen (RFC 3986 sub-delims).
   Die Dateien auf der Platte bleiben unangetastet.

   Betrifft seit der WebP-Umstellung nur noch den PNG-Fallback. */
export function encodePairingFile(file) {
  return encodeURIComponent(file).replace(/%2C/g, ",");
}

/* URL des Original-PNGs oder null, falls für den Slug (noch) keines existiert.
   Der Null-Fall ist kein Fehler: die aufrufende Sektion lässt die Bildspalte
   dann einfach weg.

   Das PNG steht nur noch als <img>-Fallback im <picture>. Geladen wird es von
   keiner Engine der letzten Jahre — WebP versteht jeder relevante Browser seit
   2020; der Fallback ist Gürtel zum Hosenträger, kein Auslieferungspfad. */
export function pairingPhotoSrc(slug) {
  const file = PAIRING_FILE[slug];
  return file ? `${BASE}/${encodePairingFile(file)}` : null;
}

/* srcSet über die optimierten WebP-Breiten, oder null, wenn es für den Slug
   kein Motiv gibt. */
export function pairingSrcSet(slug) {
  if (!PAIRING_FILE[slug]) return null;
  return PAIRING_WIDTHS.map((w) => `${BASE}/${pairingVariantFile(slug, w)} ${w}w`).join(", ");
}

/* Muss zur Layout-Logik im Hero passen: das Foto füllt dort immer den vollen
   Viewport, deshalb 100vw. Ohne sizes lädt der Browser die größte Quelle. */
const HERO_SIZES = "100vw";

/* In der Sektion „Der Maria-Maria-Moment" steht das Foto in der 7/12-Spalte
   des Rasters (max-w-content 1200 px), mobil über die volle Breite. */
const SCENE_SIZES = "(min-width: 1024px) 58vw, 100vw";

/* Alles, was ein <picture> für dieses Motiv braucht.

   `webp` zeigt bewusst auf die mittlere Breite und nicht auf das PNG: React
   preloadet den src eines server-gerenderten <img> automatisch, und dieser
   Automatismus soll auf ~48 KB zielen statt auf die 3 MB des Originals.
   `fallback` hängt als <img>-src im <picture> und bleibt für die Browser übrig,
   die den WebP-<source> nicht anfassen. */
function sources(slug, sizes) {
  const has = Boolean(PAIRING_FILE[slug]);
  return {
    webp: has ? `${BASE}/${pairingVariantFile(slug, 1280)}` : null,
    srcSet: pairingSrcSet(slug),
    fallback: pairingPhotoSrc(slug),
    sizes,
  };
}

export function heroSources(slug) {
  return sources(slug, HERO_SIZES);
}

export function sceneSources(slug) {
  return sources(slug, SCENE_SIZES);
}
