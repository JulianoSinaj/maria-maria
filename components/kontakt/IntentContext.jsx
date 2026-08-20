"use client";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useLenis } from "@/components/motion/SmoothScroll";
import { pushEvent, CONTACT_INTENT_CLICK } from "@/lib/analytics";
import { FORM_ANCHOR } from "./intents";

/* Verbindet die vier Anliegen-Karten mit dem Formular weiter unten.

   Handoff §14: „Dopo il click su una card il valore selezionato deve
   risultare visibile nel form." Die Karten stehen in einer Sektion, das
   Formular in einer anderen — ohne gemeinsamen Zustand müsste eine der
   beiden die andere kennen. Der Provider hängt stattdessen um die ganze
   Seite; Karten und Formular reden nur mit ihm.

   Der Provider ist eine Client-Komponente mit `children`. Die Seite selbst
   bleibt dadurch eine Server-Komponente: durchgereichte Kinder werden auf
   dem Server gerendert und als fertige Baumstücke übergeben, sie wandern
   nicht ins Browser-Bundle. */

const IntentContext = createContext(null);

export function useIntentTarget() {
  const ctx = useContext(IntentContext);
  if (!ctx) {
    throw new Error(
      "useIntentTarget() außerhalb von <IntentProvider> — Karten und Formular der Kontaktseite brauchen beide den Provider."
    );
  }
  return ctx;
}

export default function IntentProvider({ children }) {
  const [intent, setIntent] = useState("");
  const lenis = useLenis();
  /* Das Formular meldet hier seinen Fokus-Einstieg an: nach dem Klick auf
     eine Karte soll die Auswahl nicht nur gesetzt, sondern auch sichtbar
     angesprungen sein. */
  const focusRef = useRef(null);

  /* Klick auf eine Karte oder einen Hero-CTA: Wert setzen, zum Formular
     scrollen, Fokus in die Auswahl.

     `scrollTo` von Lenis statt scrollIntoView, weil die Storefront das
     Wurzel-Scrolling an Lenis abgegeben hat — natives Smooth-Scrolling ist
     dabei per CSS abgeschaltet und würde hart springen. Läuft Lenis nicht
     (Reduced Motion, noch nicht montiert), übernimmt scrollIntoView. */
  const requestIntent = useCallback(
    (value, meta = {}) => {
      /* Handoff §16: die Mikro-Konversion vor dem Lead. Hier statt in den
         Karten und Hero-CTAs einzeln — jeder Weg zum Formular läuft durch
         diese Funktion, also kann keiner das Event verlieren. Nutzlast ohne
         personenbezogene Daten: Schlüssel, CTA-Beschriftung, Sektion. */
      pushEvent(CONTACT_INTENT_CLICK, {
        intent: value ?? null,
        cta_label: meta.label ?? null,
        section: meta.section ?? null,
      });

      if (value) setIntent(value);

      const target = document.getElementById(FORM_ANCHOR);
      if (!target) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const instance = lenis?.current;
      if (instance && !reduced) {
        instance.scrollTo(target, { offset: -96, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }

      /* Fokus erst nach dem Scrollen — ein sofortiger focus() zieht die
         Seite selbst an die Zielposition und würde die Animation von Lenis
         im ersten Frame überholen. `preventScroll` hält den zweiten Sprung
         zusätzlich auf. */
      window.setTimeout(() => {
        focusRef.current?.focus?.({ preventScroll: true });
      }, reduced ? 0 : 700);
    },
    [lenis]
  );

  const value = useMemo(
    () => ({ intent, setIntent, requestIntent, focusRef }),
    [intent, requestIntent]
  );

  return <IntentContext.Provider value={value}>{children}</IntentContext.Provider>;
}
