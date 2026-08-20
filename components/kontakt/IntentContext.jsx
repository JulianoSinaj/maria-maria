"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useLenis } from "@/components/motion/SmoothScroll";
import { pushEvent, CONTACT_INTENT_CLICK } from "@/lib/analytics";

/* Das Anliegen reist zwischen den Sektionen der Kontaktseite.

   Hero-CTAs (Sektion 01), die vier Intent-Karten (Sektion 02) und das
   Formular (Sektion 05) sind getrennte Inseln im server-gerenderten Baum.
   Ein Klick auf „Event-Weine anfragen" muss trotzdem zwei Dinge auf einmal
   tun: zum Formular scrollen UND dort das Anliegen vorbelegen — sichtbar im
   Select, nicht nur im Hintergrund (Handoff §14, „Regola tecnica").

   Dieser Provider ist die Leitung dazwischen. Er hält nur die letzte
   ANFORDERUNG (`request`), nicht den Formularzustand: Das Formular bleibt
   Herr seiner Werte und übernimmt eine Anforderung genau einmal. `seq`
   zählt hoch, damit derselbe Intent zweimal hintereinander wieder wirkt —
   wer nach dem Abschicken erneut „Verkostung vereinbaren" drückt, soll
   wieder landen, wo er hinwollte.

   Stabile Schlüssel (Handoff §14): Beschriftungen sind Sprache, diese Werte
   sind Vertrag mit Backend, Analytics und Lead-Routing. */

export const INTENT_KEYS = [
  "gastronomie_feinkost",
  "handel_wiederverkauf",
  "event_feier",
  "verkostung",
  "individuelle_auswahl",
  "sonstiges",
];

/* Die vier Karten der Sektion 02, in Mockup-Reihenfolge. `individuelle_auswahl`
   und `sonstiges` gibt es nur im Select — sie haben keine Karte. */
export const CARD_INTENTS = ["gastronomie_feinkost", "handel_wiederverkauf", "event_feier", "verkostung"];

/* Anker des Formulars — Ziel aller CTAs (Handoff §14: „#anfrage"). */
export const FORM_ANCHOR = "anfrage";

/* Abstand zur fixierten Kopfzeile (Glas-Pille 64 px + Luft), damit die
   Überschrift des Formulars nicht darunter verschwindet. */
const SCROLL_OFFSET = -96;

/* Sanft zu einem Element scrollen — über Lenis, wenn es läuft, sonst nativ.

   Bewusst mit einer ZAHL als Ziel statt mit dem Element: Lenis berechnet
   Element-Ziele aus seinem internen `animatedScroll` und zieht zusätzlich
   die scroll-margin des Elements ab. Beides ist hier unpassend — der interne
   Stand kann nach einem nativen Scroll (Anker, scrollIntoView, Zurück-Taste)
   um einige Pixel hinterherhinken, und das Formular trägt für den Anker-
   Fallback ohne JavaScript bereits `scroll-mt-24`, der Abstand würde doppelt
   gerechnet. Die Dokumentposition aus getBoundingClientRect() + window.scrollY
   ist dagegen immer die Wahrheit. `lerp: 0` schaltet Lenis von der
   Wheel-Dämpfung auf die eingestellte Dauer mit Ease-out um — ein Klick soll
   berechenbar landen, nicht exponentiell austrudeln. */
export function smoothScrollTo(el, { lenis, reduced = false, offset = SCROLL_OFFSET, duration = 1.1 } = {}) {
  if (!el || typeof window === "undefined") return;
  if (reduced || !lenis) {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    return;
  }
  const top = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY + offset));
  /* Lenis auf die echte Position einnorden (unsichtbar), dann animieren —
     sonst startete die Animation von einem veralteten internen Stand. */
  lenis.scrollTo(window.scrollY, { immediate: true, force: true });
  lenis.scrollTo(top, { duration, lerp: 0, force: true });
}

const IntentContext = createContext(null);

export function KontaktIntentProvider({ children }) {
  const [request, setRequest] = useState({ intent: null, seq: 0 });
  const lenisRef = useLenis();
  const reduced = useReducedMotion();

  /* Sanft zum Formular — über Lenis, wenn es läuft (sonst stritten sich
     natives smooth-scroll und der Lenis-Loop um die Position); bei
     Reduced Motion ohne Animation, wie der Rest der Seite. */
  const scrollToForm = useCallback(() => {
    if (typeof document === "undefined") return;
    smoothScrollTo(document.getElementById(FORM_ANCHOR), { lenis: lenisRef?.current, reduced });
  }, [lenisRef, reduced]);

  /* `intent` null = „Beratung anfragen": nur scrollen und den Select
     fokussieren, nichts vorbelegen (Handoff §14). */
  const requestIntent = useCallback(
    (intent, { ctaLabel = null, section = null } = {}) => {
      pushEvent(CONTACT_INTENT_CLICK, {
        intent: intent ?? null,
        cta_label: ctaLabel,
        section,
      });
      setRequest((r) => ({ intent: intent ?? null, seq: r.seq + 1 }));
      scrollToForm();
    },
    [scrollToForm]
  );

  const value = useMemo(
    () => ({ request, requestIntent, scrollToForm }),
    [request, requestIntent, scrollToForm]
  );

  return <IntentContext.Provider value={value}>{children}</IntentContext.Provider>;
}

/* Ohne Provider (z. B. Formular einzeln eingebettet) bleibt alles still
   funktionsfähig: keine Vorbelegung, kein Scroll, kein Fehler. */
const NOOP = { request: { intent: null, seq: 0 }, requestIntent: () => {}, scrollToForm: () => {} };

export function useKontaktIntent() {
  return useContext(IntentContext) ?? NOOP;
}
