"use client";
import { EtiquettePair } from "@/components/SoulCards";
import { Glasses, Vineyard } from "@/components/Icons";

/* Vision & Mission — das Leitbild als Etiketten-Paar in der rechten Spalte
   der Cover Story, gesetzt wie die zwei Marias (components/SoulCards):
   Vision als dunkle Bordeaux-Karte, Mission als helle Elfenbein-Karte,
   verbunden durch das goldene „&". Statt Rubrik und Eigenschaften trägt
   jedes Etikett ein goldenes Icon über dem Leitwort — in der kompakten
   Größe (`compact`), damit das Paar in der schmalen Spalte klein bleibt. */

/* Reihenfolge, Farbe und Ikone bleiben im Code, Leitwort (`kicker`) und
   Leitsatz (`text`) kommen je Sprache aus content/<sprache>/magazin.js
   (Abschnitt `vision`). */
const BLOCK_SHAPE = [
  { key: "vision", dark: true, from: -14, icon: <Glasses className="h-5 w-5" /> },
  { key: "mission", dark: false, from: 14, icon: <Vineyard className="h-5 w-5" /> },
];

export default function VisionMission({ className = "", headingId, t = {} }) {
  const items = BLOCK_SHAPE.map((b) => {
    const copy = t.blocks?.[b.key] ?? {};
    return { ...b, name: copy.kicker, desc: copy.text };
  });

  return (
    <section aria-labelledby={headingId} className={className}>
      {/* Die Überschrift trägt die Sektion in der Gliederung, bleibt aber
          sichtbar zurückgenommen: das Kartenpaar sagt visuell schon, worum es
          geht — im Screenreader-Outline fehlte dem Paar sonst jeder Name. */}
      <h2 id={headingId} className="sr-only">
        {t.srTitle}
      </h2>
      <EtiquettePair items={items} compact />
    </section>
  );
}
