"use client";
import { useEffect, useRef } from "react";

/* „Ist das der allererste Aufbau der Seite?" — true auf dem Server, während
   der Hydration und für den Rest genau dieses Mounts; ab der ersten
   clientseitigen Navigation false.

   WOZU. Die Eingangsanimationen (Route-Template, Hero-Reveals, SplitText)
   starten auf `opacity: 0` bzw. `y: 112%`. Beim ERSTEN Aufbau steht dieser
   Zustand im server-gerenderten HTML — und Chrome zählt vollständig
   transparente Inhalte nicht als Paint. Es gibt also kein First Contentful
   Paint, bis Motion hydriert ist UND den ersten Frame gerechnet hat.

   In einem Tab, der im Hintergrund lädt, läuft requestAnimationFrame gar
   nicht: Die Seite bleibt dann dauerhaft unsichtbar, und Lighthouse bricht
   alle fünf Metriken mit NO_FCP ab — genau der Bericht vom 26.08.2026.
   Nachgemessen an der Produktionsseite: 4,7 s nach `load` stand der
   Template-Wrapper noch auf opacity 0, 32 von 35 Reveals ebenfalls.

   Die Antwort ist nicht, die Animation zu entschärfen, sondern sie beim
   ersten Aufbau NICHT ZU BRAUCHEN: fertig ausliefern, was sofort sichtbar
   sein soll. Ab der ersten Navigation ist die Seite längst gemalt — dort
   kostet dieselbe Animation kein Paint mehr und läuft unverändert.

   HYDRATION. `hydrated` wird ausschließlich in useEffect gesetzt. Effekte
   laufen auf dem Server nie — das Modul steht dort für JEDEN Request auf
   false, es leckt also nichts zwischen Requests im geteilten Server-Prozess,
   und der erste Client-Render liest exakt denselben Wert wie der Server.
   Kein Mismatch.

   Das ist der Unterschied zu einem aus matchMedia abgeleiteten Zweig (siehe
   useReducedMotionSafe): Der weiß auf dem Client sofort mehr als der Server
   und muss deshalb über useSyncExternalStore eingebremst werden. Hier ist
   der Wert beim ersten Render auf beiden Seiten per Konstruktion gleich. */

let hydrated = false;

export default function useFirstLoad() {
  /* useRef friert den Wert für die Lebensdauer dieses Mounts ein — ein
     späterer Re-Render darf nicht mitten im Mount die Seite umschalten. */
  const first = useRef(!hydrated);

  useEffect(() => {
    hydrated = true;
  }, []);

  return first.current;
}
