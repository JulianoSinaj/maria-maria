/* Weinseiten + Sprache zusammenführen.

   Die neun wineData.js-Module (components/weine/<slug>/wineData.js) tragen
   Struktur UND deutschen Text in einem Objekt — historisch gewachsen, und
   die Sektions-Components der Produktseite lesen alles aus diesem einen
   `wine`-Prop. Statt neun Dateien in Struktur und Text zu zerlegen (und
   dabei die deutsche Seite anzufassen, die zeichengleich bleiben muss),
   legt sich hier pro Sprache ein TEXT-OVERLAY über das deutsche Original:

     content/<sprache>/weine-pages/<slug>.js

   spiegelt die Struktur von wineData.js, enthält aber NUR die übersetzten
   Textschlüssel. Der Merge ersetzt Schlüssel für Schlüssel; alles, was das
   Overlay nicht nennt (Bildpfade, Farben, Preise, Slugs, Weinnamen), kommt
   unverändert aus wineData.js. Für Deutsch gibt es KEIN Overlay — das
   Original ist bereits die deutsche Fassung, der Merge ist ein No-op.

   Regeln des Merge:
   - Strings/Zahlen im Overlay ersetzen den Basiswert.
   - Listen aus Strings (heroWords, paragraphs …) ersetzen die Liste komplett —
     eine Übersetzung darf nicht Wort für Wort mit dem Deutschen verzahnt sein.
   - Listen aus Objekten (facts, taste, faq, subnav …) werden Position für
     Position gemerged: das Overlay nennt je Eintrag nur die Textfelder,
     Icons/IDs/Bilder bleiben aus der Basis. Die Overlays müssen deshalb
     dieselbe Reihenfolge und Länge führen wie wineData.js.
   - Fehlt ein Schlüssel im Overlay, bleibt der deutsche Text stehen. Das
     widerspricht bewusst der „lieber leer als deutsch"-Regel aus I18N.md:
     bei ~160 Strings je Wein wäre ein leeres Loch mitten im Fließtext
     schlimmer als ein deutscher Satz. Vollständigkeit sichert stattdessen
     der Strukturvergleich der drei Overlay-Sprachen untereinander. */

export function mergeText(base, overlay) {
  if (overlay === undefined || overlay === null) return base;

  if (Array.isArray(base) && Array.isArray(overlay)) {
    const hasObjects = base.some((item) => typeof item === "object" && item !== null);
    if (!hasObjects) return overlay;
    return base.map((item, i) => mergeText(item, overlay[i]));
  }

  if (
    typeof base === "object" &&
    base !== null &&
    typeof overlay === "object" &&
    !Array.isArray(overlay)
  ) {
    const merged = { ...base };
    for (const key of Object.keys(overlay)) {
      merged[key] = mergeText(base[key], overlay[key]);
    }
    return merged;
  }

  return overlay;
}

/* Ein Wein in der aktiven Sprache. `overlay` ist der Zweig
   dict.weinePages?.[slug] — fehlt er (Deutsch, oder Sprache noch nicht
   übersetzt), rendert die Seite das Original. */
export function localizeWinePage(wine, overlay) {
  if (!wine || !overlay) return wine;
  return mergeText(wine, overlay);
}
