/* ============================================================================
   INTERVIEWS — echte Menschen, echte Stimmen.
   ----------------------------------------------------------------------------
   Hier werden die Gespräche gepflegt: Winzerinnen, Kellermeister, Sommeliers,
   Köche, Händler — alle, die etwas über den Wein, die Region und den Geschmack
   zu erzählen haben.

   So fügen Sie ein Interview hinzu:
   1. Ein Portrait nach /public/img/magazin/interviews/<slug>.jpg legen
      (Hochformat, ca. 900×1200 px, unter ~250 kB).
   2. Unten ein neues Objekt in INTERVIEWS eintragen. Nur `slug`, `name`,
      `role` und `quote` sind Pflicht — alles andere darf zunächst fehlen und
      wird von der Sektion sauber ausgeblendet.
   3. `draft: true` setzen, solange das Gespräch noch nicht freigegeben ist —
      solche Einträge erscheinen auf der Seite nicht.

   Feldreferenz
   ------------
   slug      eindeutiger Schlüssel (kebab-case)
   name      vollständiger Name der Person
   role      Funktion / Betrieb ("Winzerin, Masseria …")
   place     Ort oder Region ("Manduria, Apulien")
   topic     Themen-Chip ("Terroir", "Verkostung", "Food Pairing" …)
   portrait  { src, alt } — Portraitfoto
   quote     das Kernzitat, ohne Anführungszeichen (die setzt die Sektion)
   intro     1–2 Sätze Anmoderation vor dem Q&A
   qa        [{ q, a }] — beliebig viele Fragen und Antworten
   wines     Slugs aus components/data (verlinkt auf /weine/<slug>)
   date      "Juli 2026" — frei formatiert, erscheint klein unter dem Namen
   draft     true = noch nicht veröffentlicht
   ========================================================================== */

export const INTERVIEWS = [
  {
    slug: "beispiel-winzerin",
    name: "Name der Winzerin",
    role: "Winzerin, Name des Weinguts",
    place: "Region, Italien",
    topic: "Terroir",
    date: "Datum ergänzen",
    portrait: {
      src: "/img/magazin/interviews/placeholder.jpg",
      alt: "Portrait — Bild und Bildunterschrift noch zu ergänzen",
    },
    quote:
      "Hier steht später das Kernzitat aus dem Gespräch — der eine Satz, der die Haltung dieser Person zum Wein auf den Punkt bringt.",
    intro:
      "Kurze Anmoderation: Wer ist diese Person, wo haben wir sie getroffen und worüber haben wir gesprochen? Zwei Sätze genügen.",
    qa: [
      {
        q: "Was macht das Terroir Ihrer Region so besonders?",
        a: "Antwort aus dem Interview. Dieser Platzhalter zeigt Aufbau und Länge — ein bis zwei Absätze pro Antwort lesen sich am besten.",
      },
      {
        q: "Woran erkennt man einen guten Jahrgang?",
        a: "Antwort aus dem Interview.",
      },
      {
        q: "Wie trinken Sie Ihren Wein am liebsten?",
        a: "Antwort aus dem Interview.",
      },
    ],
    wines: [],
    draft: true,
  },
];

/* Nur freigegebene Gespräche gehen auf die Seite. */
export const PUBLISHED_INTERVIEWS = INTERVIEWS.filter((i) => !i.draft);
