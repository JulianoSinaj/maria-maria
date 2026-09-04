/* Basispfad an einer Stelle: der Handoff (Seite 10) legt
   /magazin/interviews/<slug> als kanonische Adresse fest, und beide Teaser,
   die Breadcrumb, die Sitemap und die Vorschau des Backoffice müssen
   dieselbe Form bilden.

   Eigene, abhängigkeitsfreie Datei: interviewRegistry.js liest seit dem
   Redaktionssystem den Interview-Speicher (fs) und gehört damit auf den
   Server. Wer nur die Adresse bilden will — Karten, Teaser, API-Routen —,
   importiert von hier und zieht kein Dateisystem mit. */

export const interviewPath = (slug) => `/magazin/interviews/${slug}`;
