"use client";
import Button from "@/components/ui/Button";
import { useIntentTarget } from "./IntentContext";

/* Die beiden Hero-Schaltflächen. Handoff §14:

     Beratung anfragen      → #anfrage, kein Anliegen vorbelegt, Fokus in die
                              Auswahl (der Nutzer sagt selbst, worum es geht)
     Verkostung vereinbaren → #anfrage mit intent=verkostung

   Seit dem Angleich an die Storefront (20.08.2026) sind es die Pillen aus
   components/ui/Button — primär gefüllt, sekundär als Bordeaux-Kontur —
   statt der Terrakotta-Rechtecke des Mockups. `section`/`label` wandern in
   das contact_intent_click-Event, das der Provider beim Klick meldet.

   Nur dieser Streifen ist eine Client-Komponente; Überschrift, Fließtext und
   Kontaktzeilen der Hero bleiben serverseitig. */

export default function HeroActions({ primary, secondary }) {
  const { requestIntent } = useIntentTarget();

  return (
    <div className="mt-9 flex flex-wrap items-center gap-3.5">
      <Button
        type="button"
        variant="primary"
        iconType="none"
        onClick={() => requestIntent(null, { label: primary, section: "hero" })}
      >
        {primary}
      </Button>
      <Button
        type="button"
        variant="outline"
        iconType="none"
        onClick={() => requestIntent("verkostung", { label: secondary, section: "hero" })}
      >
        {secondary}
      </Button>
    </div>
  );
}
