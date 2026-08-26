"use client";
import { useEffect } from "react";
import { useIntentTarget } from "./IntentContext";
import { INTENT_QUERY_PARAM, intentFromQuery } from "./intents";

/* Belegt das Anliegen im Formular aus der Adresse vor — /kontakt?anliegen=…
   ist das Ziel der drei Segment-Karten der Startseite (Homepage-Brief §5).

   Bewusst `window.location.search` im Effekt statt `useSearchParams()`: Die
   Kontaktseite ist statisch vorgerendert, und useSearchParams zwingt in
   Next 14 entweder zu einer Suspense-Grenze oder — vergessen — die ganze
   Seite in clientseitiges Rendern. Ein einmaliges Lesen nach der Hydration
   braucht nichts davon; der Server kennt die Query ohnehin nicht.

   Nur vorbelegen, nicht scrollen: Die Reihenfolge der Kontaktseite (Hero →
   Anlässe → Ablauf → Formular) ist Absicht, das Formular kommt, „nachdem
   der Nutzer verstanden hat, warum". Wer über eine Karte kommt, findet sein
   Anliegen unten bereits ausgewählt, samt der passenden Zusatzfelder.

   Kein Analytics-Ereignis: contact_intent_click misst Klicks, und der Klick
   fällt auf der Seite, die den Link setzt – nicht hier. */
export default function IntentFromQuery() {
  const { setIntent } = useIntentTarget();

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get(INTENT_QUERY_PARAM);
    const value = intentFromQuery(raw);
    if (value) setIntent(value);
  }, [setIntent]);

  return null;
}
