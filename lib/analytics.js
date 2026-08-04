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

/* ---- Events des Maria-Maria-Moments (components/weine/PairingScene) ---- */

/* Feuert einmal pro Seitenaufruf, sobald die Pairing-Sektion mindestens zur
   Hälfte sichtbar war. Nutzlast: `wine_name` und `pairing_name` (der Titel
   des Gerichts) — damit lässt sich auswerten, welche Szene die Leute
   überhaupt erreichen, bevor man über CTA-Raten spricht. */
export const FOOD_PAIRING_VIEW = "food_pairing_view";

/* Klick auf den Shop-CTA einer Wein-Landingpage. Getrennt von
   CTA_SHOP_CLICK, weil hier `cta_position` die Sektion trägt statt
   `location` — so bleibt das Band-Event unverändert auswertbar. */
export const WINE_SHOP_CLICK = "wine_shop_click";

/* Klick auf den sekundären Regionen-Link neben dem Shop-CTA. */
export const REGION_LINK_CLICK = "region_link_click";

/* Erlaubte Werte für `cta_position`. Als Konstante statt als Literal, damit
   die neun Landingpages sich nicht auf neun Schreibweisen aufteilen. */
export const CTA_POSITION = {
  hero: "hero",
  foodPairing: "food_pairing",
  ctaBand: "cta_band",
};

/* Sprache des Dokuments für die Auswertung — die Storefront ist deutsch,
   bleibt aber vorbereitet, falls später eine zweite Sprache dazukommt. */
export function pageLanguage() {
  if (typeof document === "undefined") return null;
  return document.documentElement.lang || null;
}
