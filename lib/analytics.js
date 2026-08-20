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

/* ---- Events der FAQ-Sektionen (components/faq/FaqSection) ---- */

/* Öffnen einer Antwort. Nutzlast nach der Homepage-FAQ-Guide: `faq_id`,
   `faq_question`, `page_location` — dazu `cluster`, `page_type` und
   `position`, damit sich Reihenfolge und Themenblock auswerten lassen. */
export const FAQ_OPEN = "faq_open";

/* Klick auf einen CTA innerhalb einer FAQ-Sektion (Antwort-Link oder
   Abschluss-CTA). Nutzlast: `cta_text`, `cta_destination`, `cta_position`
   (z. B. „homepage_faq“). Ersetzt das frühere `faq_internal_link_click` —
   bestehende GTM-Trigger auf den alten Namen müssen umgestellt werden. */
export const FAQ_CTA_CLICK = "cta_click";

/* ---- Events der Regionen-Seite (Regionen-Guide v1.0, Abschnitt 10) ----

   Alle Namen und Parameter in lowercase_snake_case, ohne personenbezogene
   Daten. `region_tab_view` und `faq_open` teilen sich die Regionen-FAQ: das
   Öffnen einer Antwort meldet FAQ_OPEN (oben), der Wechsel des Clusters
   REGION_TAB_VIEW — beide feuern nur auf Interaktion, nie beim ersten
   Rendern, damit keine Dubletten entstehen. */

/* Wechsel auf einen Regions-Tab im FAQ-Index. */
export const REGION_TAB_VIEW = "region_tab_view";

/* Klick auf die CTA eines Regionsblocks. `destination_type` trennt Wein-,
   Magazin- und Kontaktziele, weil die drei Regionen bewusst nicht mehr
   gemeinsam auf /magazin zeigen. */
export const REGION_CTA_CLICK = "region_cta_click";

/* ---- Events der Kontaktseite (Kontakt-Handoff 18.08.2026, Abschnitt 16) ----

   Der Funnel in der Reihenfolge, in der ein Besucher ihn durchläuft. Alle
   Nutzlasten ohne personenbezogene Daten: Name, E-Mail, Telefon und der
   Nachrichtentext gehen NIE in den dataLayer — nur Schlüssel (intent),
   Beschriftungen von CTAs, Sektionsnamen und die Sprache. */

/* Klick auf eine Intent-Karte oder eine CTA, die das Formular vorbelegt.
   Nutzlast: `intent` (stabiler Schlüssel, z. B. gastronomie_feinkost — oder
   null bei „Beratung anfragen"), `cta_label`, `section`. Die Mikro-Konversion
   vor dem eigentlichen Lead. */
export const CONTACT_INTENT_CLICK = "contact_intent_click";

/* Erste echte Interaktion mit dem Formular (Tippen oder Auswahl) — einmal
   pro Seitenaufruf. Nutzlast: `form_name`, `initial_intent`. */
export const FORM_START = "form_start";

/* Absende-Versuch, unabhängig vom Ergebnis — die Diagnosezahl neben dem
   Lead. Nutzlast: `form_name`, `intent`. */
export const FORM_SUBMIT = "form_submit";

/* Der Lead selbst: feuert GENAU EINMAL und erst nach der Erfolgsantwort des
   Endpunkts — nicht beim Klick auf den Button. Nutzlast: `lead_type`
   (= intent), `form_name`, `source_section`, `language`. Das ist das
   Key Event in GA4. */
export const GENERATE_LEAD = "generate_lead";

/* Direkter Kontakt an der Formularlogik vorbei. Nutzlast: `location`
   (hero, footer …), `language`. */
export const CLICK_EMAIL = "click_email";
export const CLICK_PHONE = "click_phone";

/* Stabiler Formularname für alle vier Events — die Auswertung in GA4
   filtert darauf, deshalb hier EINMAL notiert. */
export const CONTACT_FORM_NAME = "kontakt_anfrage";

/* Aktuelle URL für `page_location`; im SSR-Fall null statt Fehler. */
export function pageLocation() {
  if (typeof window === "undefined") return null;
  return window.location.href;
}

/* Sprache des Dokuments für die Auswertung — die Storefront ist deutsch,
   bleibt aber vorbereitet, falls später eine zweite Sprache dazukommt. */
export function pageLanguage() {
  if (typeof document === "undefined") return null;
  return document.documentElement.lang || null;
}
