/* Die Herkunfts-Seiten brauchen KEIN revalidatePath — und dürfen es nicht
   haben.

   Der naheliegende Weg wäre: Startseite und /regionen sind vorgerendert,
   also nach dem Speichern revalidatePath("/[locale]", "page") rufen. Genau
   das nimmt beide Seiten vom Netz.

   Die Ursache liegt eine Ebene höher, in app/(site)/[locale]/layout.jsx:
   `dynamicParams = false` sorgt dafür, dass /xx/regionen keine leere fünfte
   Sprachversion rendert. Next prüft diesen Schalter aber nicht pro Segment,
   sondern einmal für die ganze Route. Sobald revalidatePath den
   vorgerenderten Eintrag entwertet, müsste Next ihn auf Anfrage neu
   erzeugen — und lehnt die Parameter genau deshalb ab. Übrig bleibt die
   Not-Found-Hülle, dauerhaft, in allen vier Sprachen und über einen
   Neustart hinweg. Gemessen am 2026-09-06 gegen einen Produktionsbau für
   /agb (siehe lib/legal/revalidate.js) und für die Interview-Route; die
   Sperre ist dieselbe, also wäre es hier dasselbe Ergebnis.

   Die Lösung steht in den beiden Seiten selbst: Sie sind seit dem
   2026-09-06 `dynamic = "force-dynamic"` und werden nicht mehr
   vorgerendert. Damit gibt es keinen Cache-Eintrag, der entwertet werden
   müsste — jede Anfrage liest den Zustand ohnehin frisch. Ein Entwurf ist
   sofort verschwunden, ein fälliger Termin sofort da, und dieser Aufruf hat
   nichts mehr zu tun.

   Das ist bei der STARTSEITE ein spürbarer Preis: Sie war statisch und
   rendert jetzt je Anfrage. Die Alternative wäre gewesen, sie statisch zu
   lassen und Sichtbarkeit erst beim nächsten Deploy wirken zu lassen — also
   eine Herkunft, die auf „Entwurf" steht und trotzdem öffentlich im
   Explorer liegt. Zwischen „langsamer" und „zeigt, was nicht gezeigt werden
   soll" ist das keine schwere Wahl.

   Die Funktion bleibt als benannte Stelle bestehen, damit die Routen sie
   aufrufen können und niemand die Zeile „hier fehlt doch ein
   revalidatePath" aus gutem Willen wieder einbaut. Wer sie doch braucht —
   etwa weil die Seiten eines Tages wieder statisch werden sollen —, muss
   zuerst dynamicParams im Sprach-Layout lösen. */
export function revalidateRegionPages() {
  /* absichtlich leer — siehe oben */
}
