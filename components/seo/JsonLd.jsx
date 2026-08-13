/* Der einzige Ort, an dem strukturierte Daten ins Dokument geschrieben werden.

   Zwei Dinge, die sonst leicht schiefgehen:

   1. `</script>` im Datenstrom. Steht in irgendeinem Feld — einer Antwort in
      der FAQ, einer Beschreibung — die Zeichenfolge "</script>", beendet der
      Browser das Script-Tag mitten im JSON. Der Rest des Objekts landet als
      sichtbarer Text auf der Seite, und im schlimmsten Fall ist es eine
      Lücke, durch die fremdes Markup einsteigt. `<` als < zu schreiben
      ist die dokumentierte Gegenmaßnahme; das JSON bleibt gültig, weil \u
      -Escapes in JSON-Strings erlaubt sind.

   2. Zeilenumbrüche im Markup. JSON.stringify ohne Einrückung hält die
      Nutzlast klein — bei neun Produktseiten × vier Sprachen summiert sich
      hübsch formatiertes JSON-LD auf spürbare Kilobytes, die kein Mensch
      je liest.

   Die Komponente rendert bewusst ohne `key`-Umweg direkt im Server-Baum: Der
   Block gehört zum HTML, nicht zur Hydration, und Client-Komponenten dürfen
   ihn nicht anfassen. */

export default function JsonLd({ data }) {
  if (!data) return null;

  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
