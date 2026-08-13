/* Welche Gespräche es gibt — und wie man eines findet.

   Die Texte liegen in content/<locale>/interviews.js und damit hinter
   getDictionary(), also serverseitig. Zwei Dinge brauchen die Liste aber
   OHNE Wörterbuch:

   - generateStaticParams() der Route /magazin/interviews/[slug] läuft, bevor
     eine Sprache feststeht — sie erzeugt alle vier Sprachfassungen desselben
     Slugs.
   - die Sitemap zählt die Adressen auf, ohne einen Text zu lesen.

   Deshalb steht die Slug-Liste hier als nackte Konstante, genau wie
   WINE_SLUGS in components/weine/wineRegistry.js. Sie ist die einzige Stelle,
   an der ein neues Gespräch angemeldet werden muss — der Rest ergibt sich aus
   dem Wörterbuch.

   Ein Slug gehört nur dann hierher, wenn er in ALLEN vier Sprachdateien
   gepflegt ist. Fehlt er in einer, rendert diese Sprachfassung eine leere
   Seite statt 404 — und genau das soll nicht passieren. */

export const INTERVIEW_SLUGS = ["daniele-malavasi-lugana-doc"];

/* Basispfad an einer Stelle: der Handoff (Seite 10) legt
   /magazin/interviews/<slug> als kanonische Adresse fest, und beide Teaser
   sowie die Breadcrumb müssen dieselbe Form bilden. */
export const interviewPath = (slug) => `/magazin/interviews/${slug}`;

/* Ein Gespräch aus dem geladenen Wörterbuch holen.

   `draft: true` zählt hier bewusst NICHT als „nicht vorhanden": Die Route
   filtert Entwürfe selbst heraus (und liefert 404), die Teaser filtern über
   publishedInterviews(). Wer gezielt nach einem Slug fragt, soll den Entwurf
   in der Vorschau sehen können. */
export function findInterview(dict, slug) {
  return (dict?.interviews?.items ?? []).find((i) => i.slug === slug) ?? null;
}

/* Alles, was veröffentlicht ist — in Pflegereihenfolge der Wörterbuchdatei. */
export function publishedInterviews(dict) {
  return (dict?.interviews?.items ?? []).filter((i) => !i.draft);
}
