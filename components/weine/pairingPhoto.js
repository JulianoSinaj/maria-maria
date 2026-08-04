/* Eine Quelle für das Food-Pairing-Foto je Wein.

   Dasselbe Bild trägt zweimal auf der Landingpage: oben als Hero-Bühne
   (HeroPhoto/HeroPreload, server-gerendert) und weiter unten in der Sektion
   „Der Maria-Maria-Moment" (PairingScene, Client). Weil beide exakt dieselbe
   URL anfordern, kostet der zweite Auftritt kein einziges Byte extra — der
   Browser bedient ihn aus dem Cache, das Foto steht dort sofort.

   Deshalb liegen Dateiliste und URL-Bau hier und nicht in der Server-
   Komponente: ein Client-Import von HeroPhoto zöge sonst die Komponente
   mitsamt Markup ins Client-Bundle. Dieses Modul ist reine Datenlogik. */

/* Die Dateinamen tragen Leerzeichen, Halbgeviertstriche, Umlaute und
   typografische Anführungszeichen; sie bleiben auf der Platte unverändert und
   werden erst beim Bauen der URL kodiert (siehe encodePairingFile). */
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

/* Alle Motive liegen im selben Seitenverhältnis vor. Die Maße stehen im
   Markup, damit beim Laden nichts springt (CLS). */
export const PAIRING_PHOTO_SIZE = { width: 1774, height: 887 };

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

/* URL des Pairing-Fotos oder null, falls für den Slug (noch) keines existiert.
   Der Null-Fall ist kein Fehler: die aufrufende Sektion lässt die Bildspalte
   dann einfach weg. */
export function pairingPhotoSrc(slug) {
  const file = PAIRING_FILE[slug];
  return file ? `/img/food-pairing/${encodePairingFile(file)}` : null;
}

/* Muss zur Layout-Logik im Hero passen: das Foto füllt dort immer den vollen
   Viewport, deshalb 100vw. Ohne sizes lädt der Browser die größte Quelle. */
const HERO_SIZES = "100vw";

export function heroSources(slug) {
  /* Kein srcSet: von diesen PNGs existieren keine vorab optimierten
     -640/-1280/-1920.webp-Varianten wie beim früheren Kellerei-Foto.
     Ein srcSet auf nicht existierende Dateien liefe in 404s. */
  return { src: pairingPhotoSrc(slug), sizes: HERO_SIZES };
}
