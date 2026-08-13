import { SectionTitle } from "@/components/Deco";
import { Reveal } from "@/components/motion/Reveal";
import Atmosphere from "@/components/Atmosphere";
import PairingSelector from "@/components/magazin/PairingSelector";

/* „Gli abbinamenti" — das Food-Pairing-Kapitel des Magazins (Capitolo II).

   Frage → Antwort statt Karten-Basar (Redaktionsvorgabe 08/2026): fünf
   Anlass-Tasten — Aperitivo, Pasta-Abend, Fisch & Meer, Grillabend, Dinner
   mit Gästen — und darunter genau eine Antwort-Karte. Wer „Fisch & Meer"
   wählt, bekommt die Empfehlung für Fisch: das Gericht, den Wein (als Link
   auf seine Landingpage, wo der Maria-Maria-Moment das „Warum" erzählt) und
   ein bis zwei „Auch passend"-Weine aus der Kollektion.

   Inhalte und Fotos liegen in components/magazin/pairingCards.js, die
   Interaktion samt Motion-Vertrag in components/magazin/PairingSelector.
   Keine Aromen-Chips, keine Herkunfts-Zeilen, kein eigener Begründungstext —
   die frühere, vollere Fassung des Mockups war zu viel. */

export default function PairingMoments({ id, headingId, t = {}, className = "" }) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`grain relative scroll-mt-28 overflow-hidden ${className}`}
    >
      <Atmosphere variant="rose" className="opacity-60" />

      <div className="relative mx-auto max-w-content px-6 pb-14 pt-8 lg:px-10 lg:pt-10">
        <SectionTitle
          align="center"
          eyebrow={t.eyebrow}
          description={t.description}
          headingId={headingId}
        >
          {t.title} <span className="italic text-bordeaux">{t.titleAccent}</span>
        </SectionTitle>

        <Reveal y={16} delay={0.1}>
          <PairingSelector className="mt-10 lg:mt-12" t={t} />
        </Reveal>
      </div>
    </section>
  );
}
