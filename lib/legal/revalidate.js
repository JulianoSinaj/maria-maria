/* Die Rechtsseiten brauchen KEIN revalidatePath — und dürfen es nicht haben.

   Der naheliegende Weg wäre: Die Storefront ist vorgerendert, also nach dem
   Speichern revalidatePath() rufen. Genau das zerstört die Seite.

   Gemessen am 2026-09-06 gegen einen echten Produktionsbau: Nach EINEM
   Speichern über /api/admin/legal antworteten /agb, /it/agb, /en/agb und
   /cs/agb dauerhaft mit 404 — auch die Sprachen, die niemand bearbeitet
   hatte, und auch über einen Neustart hinweg. Nur ein neuer Build holte sie
   zurück.

   Die Ursache liegt nicht hier, sondern eine Ebene höher:
   app/(site)/[locale]/layout.jsx setzt `dynamicParams = false`, damit
   /xx/agb keine leere fünfte Sprachversion rendert. Next prüft diesen
   Schalter aber nicht pro Segment, sondern einmal für die ganze Route.
   Sobald revalidatePath den vorgerenderten Eintrag entwertet, müsste Next
   ihn auf Anfrage neu erzeugen — und lehnt die Parameter genau deshalb ab.
   Übrig bleibt die Not-Found-Hülle.

   Die Lösung steht in den drei Seiten selbst: Sie sind seit demselben Tag
   `dynamic = "force-dynamic"` und werden gar nicht mehr vorgerendert. Damit
   gibt es keinen Cache-Eintrag, der entwertet werden müsste — jede Anfrage
   liest das Archiv ohnehin frisch, ein gespeicherter Text ist sofort
   draußen sichtbar, und dieser Aufruf hat nichts mehr zu tun.

   Die Funktion bleibt als benannte Stelle bestehen, damit die beiden Routen
   sie weiter aufrufen können und niemand die Zeile "hier fehlt doch ein
   revalidatePath" aus gutem Willen wieder einbaut. Wer sie doch braucht —
   etwa weil die Seiten eines Tages wieder statisch werden sollen —, muss
   zuerst dynamicParams im Sprach-Layout lösen. Siehe auch
   app/(site)/[locale]/magazin/interviews/[slug]/page.jsx, wo dieselbe
   Sperre denselben Weg erzwungen hat. */
export function revalidateLegal() {
  /* absichtlich leer — siehe oben */
}
