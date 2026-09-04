/* Welche Gespräche es gibt — und wie man eines findet.

   Bis September 2026 stand hier eine nackte Slug-Konstante: ein neues
   Gespräch hieß vier Sprachdateien anfassen, die Liste ergänzen und
   deployen. Seit dem Redaktionssystem ist die Liste eine ABFRAGE über zwei
   Quellen, die lib/interviews/store.js zusammenführt:

     1. content/<locale>/interviews.js — die vom Entwickler ausgelieferten
        Stücke, unverändert an ihrem Ort;
     2. data/interviews/interviews.json — was die Redaktion unter
        /admin/magazin anlegt oder überarbeitet (gleicher Slug = Override).

   Drei Oberflächen lesen ausschließlich hierüber: die Artikelseite, die
   Karte im Magazin und der Teaser auf /regionen — plus die Sitemap. Wer
   eine vierte baut, fragt hier und nicht die Dateien.

   Alle Funktionen sind async und serverseitig (der Speicher ist eine
   Datei). Wer nur die Adresse eines Gesprächs bilden will, nimmt
   ./interviewPath — die Datei ohne Dateisystem. */

import { listRecords, mergeInterviews, listInterviewSlugs } from "@/lib/interviews/store";

export { interviewPath } from "./interviewPath";
export { listInterviewSlugs };

/* Alle Gespräche einer Sprache — Code-Stücke in Dateireihenfolge, jedes
   durch seinen Override ersetzt, dann die Stücke der Redaktion. Eine
   Sprache ohne eigene Fassung erhält den deutschen Text (siehe
   toDictionaryItem in lib/interviews/schema.js): ein Slug, der in einer
   Sprache fehlt, rendert damit nie mehr eine leere Seite. */
export async function allInterviews(dict, locale = "de", { includeDrafts = false } = {}) {
  const records = await listRecords();
  return mergeInterviews(dict?.interviews?.items ?? [], records, locale, { includeDrafts });
}

/* Ein Gespräch aus dem geladenen Wörterbuch holen.

   `draft: true` zählt hier bewusst NICHT als „nicht vorhanden": Die Route
   filtert Entwürfe selbst heraus (und liefert 404, außer im Draft Mode der
   Vorschau), die Teaser filtern über publishedInterviews(). Wer gezielt
   nach einem Slug fragt, soll den Entwurf in der Vorschau sehen können. */
export async function findInterview(dict, slug, locale = "de") {
  const all = await allInterviews(dict, locale, { includeDrafts: true });
  return all.find((i) => i.slug === slug) ?? null;
}

/* Alles, was veröffentlicht ist — in Pflegereihenfolge. */
export async function publishedInterviews(dict, locale = "de") {
  return allInterviews(dict, locale);
}
