/* Ein Ort für alle dataLayer-Events der Storefront.

   GA4 liest die Events über den Google Tag Manager; die Seiten kennen nur
   `pushEvent` und die Event-Namen hier. Ohne GTM auf der Seite läuft der
   Push ins Leere statt zu werfen — die Komponenten brauchen deshalb keine
   Fallunterscheidung.

   Warum zentral: der primäre Call-to-Action liegt auf neun Wein-Landingpages
   in derselben Bauform (components/ui/ShopCtaBand). Läge die Event-Logik in
   den Seiten, müsste jede Seite dieselbe Konvention wiederholen — und eine
   davon würde sie beim nächsten Text-Update verlieren. */

export function pushEvent(event, payload = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

/* Klick auf den primären Shop-CTA. `wine` ist der Slug der Landingpage
   (oder null auf den Übersichtsseiten), `location` die Sektion, in der der
   Button steht — damit lässt sich in GA4 trennen, ob das Abschlussband oder
   ein CTA weiter oben die Fahrt in den Shop auslöst. */
export const CTA_SHOP_CLICK = "cta_shop_click";
