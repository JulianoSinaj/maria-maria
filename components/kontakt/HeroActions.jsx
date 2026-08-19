"use client";
import { useIntentTarget } from "./IntentContext";
import { CTA_OUTLINE, CTA_PRIMARY } from "./styles";

/* Die beiden Hero-Schaltflächen. Handoff §14:

     Beratung anfragen      → #anfrage, kein Anliegen vorbelegt, Fokus in die
                              Auswahl (der Nutzer sagt selbst, worum es geht)
     Verkostung vereinbaren → #anfrage mit intent=verkostung

   Nur dieser Streifen ist eine Client-Komponente; Überschrift, Fließtext und
   Kontaktzeilen der Hero bleiben serverseitig. */

export default function HeroActions({ primary, secondary }) {
  const { requestIntent } = useIntentTarget();

  return (
    <div className="mt-9 flex flex-wrap items-center gap-3.5">
      <button type="button" className={CTA_PRIMARY} onClick={() => requestIntent(null)}>
        {primary}
      </button>
      <button
        type="button"
        className={CTA_OUTLINE}
        onClick={() => requestIntent("verkostung")}
      >
        {secondary}
      </button>
    </div>
  );
}
