/* Die Agentur hinter der Seite — der „Powered by"-Hinweis in der Fußzeile.

   Bewusst eine eigene Datei und nicht lib/site.js: Dort stehen die Angaben
   ZUR Marke Maria Maria (Impressum, JSON-LD, Canonicals). Hier steht, wer die
   Seite gebaut hat — eine andere Firma, eine andere Domain, ein anderer
   Lebenszyklus. Landete das im selben Objekt, zöge irgendwann jemand die
   Agentur-E-Mail versehentlich in die strukturierten Daten des Weinhändlers.

   Alle vier Sprachen lesen von hier; ein Domainwechsel berührt nur diese
   Datei. */

export const AGENCY = {
  name: "Omnexa",

  /* Die Vitrinen-Seite — steht noch aus.

     Leerer String heißt bewusst „gibt es noch nicht": Die Fußzeile setzt den
     Namen dann als reinen Text. Ein Platzhalter wie omnexa.example wäre ein
     toter Link im Live-Footer — sichtbar kaputt für jeden Besucher und
     nichts, was beim nächsten Deploy jemandem auffällt.

     Sobald die Seite steht, hier die Adresse eintragen; die Fußzeile
     verlinkt den Namen von allein (extern, target="_blank"). */
  url: "",

  /* Kontaktadresse für Anfragen an die Agentur, nicht an den Weinhändler.
     Die Adresse des Händlers steht in lib/site.js unter BUSINESS.email und
     bleibt in der Kontaktspalte darüber stehen.

     PLATZHALTER — vor dem Produktiv-Deploy durch die echte Adresse ersetzen.
     Leerer String blendet die Zeile aus. */
  email: "hello@omnexa.example",
};
