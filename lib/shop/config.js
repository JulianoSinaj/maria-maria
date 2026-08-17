/* Der eigene Shop ist stillgelegt.

   Die Kasse dieses Projekts nimmt kein Geld an: Warenkorb, Versandrechnung
   und Bestellnummer sind Prototyp. Solange das so ist, darf keine Seite den
   Eindruck erwecken, hier ließe sich bestellen — verkauft wird im
   Partner-Shop, in dem die Zahlung tatsächlich funktioniert.

   Stillgelegt heißt ausdrücklich NICHT gelöscht: die Shop-Seite, der
   Warenkorb, die Produktkarten und die Probierpakete liegen unverändert im
   Code. Umgelegt wird genau ein Schalter:

   SHOP_ENABLED = true  → alles wie gebaut, /shop ist wieder eine Seite
   SHOP_ENABLED = false → vier Stellen greifen gleichzeitig
     1. components/i18n/LocaleLink  — jeder interne /shop-Link zeigt nach außen,
                                      Weinseiten via shopHref(slug) direkt auf
                                      die Produktseite des Weins
     2. middleware.js               — /shop selbst leitet nach außen weiter
     3. components/StorefrontChrome — der Warenkorb wird nicht mehr gerendert
     4. lib/seo/routes              — /shop fällt aus der Sitemap

   Alle vier lesen von hier. Wer den Shop wieder anschaltet, ändert diese
   eine Zeile — und nichts sonst. */

import { pathWithoutLocale } from "@/lib/i18n/routing";

export const SHOP_ENABLED = false;

/* Der Partner-Shop — dort funktioniert die Zahlung. Sammelseite aller Weine,
   das Ziel für jeden Link, der keinen bestimmten Wein meint. */
export const EXTERNAL_SHOP_URL = "https://www.terra-vera.com/collections/weine";

/* Die Produktseiten der neun Weine im Partner-Shop, nach Slug aus
   components/data.js. Wer auf einer Weinseite „Im Shop entdecken" drückt,
   soll vor der richtigen Flasche stehen — nicht vor der Sammelseite mit
   sechzig Weinen anderer Häuser.

   Ermittelt am 17.08.2026 über terra-vera.com/search?q=maria+maria; alle
   Adressen antworten mit 200. Lugana und Primitivo 15,5 gibt es dort auch als
   Magnum (…-1-5) — verlinkt ist die 0,7-l-Flasche, die dem Katalogpreis
   entspricht. Neuer Wein ohne Eintrag: shopHref fällt auf die Sammelseite
   zurück, nichts bricht.

   Übergangslösung: sobald der Shop-Code des Partners in dieses Projekt
   wandert, ersetzt eine echte Produktroute diese Tabelle. */
export const EXTERNAL_PRODUCT_URLS = {
  "primitivo-15-5": "https://www.terra-vera.com/products/primitivo-15-5-0-7",
  "lugana": "https://www.terra-vera.com/products/lugana-doc-maria-maria-0-7",
  "greco-di-tufo": "https://www.terra-vera.com/products/greco-di-tufo-docg",
  "primitivo-14-5": "https://www.terra-vera.com/products/primitivo-di-manduria-dop",
  "primitivo-salento": "https://www.terra-vera.com/products/primitivo-salento-igp-maria-maria",
  "falanghina": "https://www.terra-vera.com/products/beneventano-falanghina-igp",
  "rosato-puglia": "https://www.terra-vera.com/products/rosato-negroamaro-salento-igp",
  "il-rosso-aglianico": "https://www.terra-vera.com/products/vino-rosso-maria-maria",
  "il-bianco-greco-cuvee": "https://www.terra-vera.com/products/vino-bianco-il-bianco-maria-maria",
};

/* Produktseite eines Weins im Partner-Shop — oder die Sammelseite, wenn der
   Slug dort (noch) nicht gelistet ist. */
export function externalShopUrl(slug) {
  return (slug && EXTERNAL_PRODUCT_URLS[slug]) || EXTERNAL_SHOP_URL;
}

/* Kaufweg eines Weins als Link-Ziel für Hero, Subnav, Maria-Moment und
   CTA-Band der Weinseiten. Solange der eigene Shop stillgelegt ist: die
   Produktseite im Partner-Shop (absolute URL — LocaleLink öffnet sie in
   neuem Tab). Mit SHOP_ENABLED = true wieder schlicht "/shop", wie vor der
   Stilllegung. Ohne Slug dasselbe wie ein nackter "/shop"-Link. */
export function shopHref(slug) {
  return SHOP_ENABLED ? "/shop" : externalShopUrl(slug);
}

/* Absolute http(s)-Adresse? Solche Ziele kann LocaleLink nicht mit einem
   Sprachpräfix versehen — sie führen aus der Site hinaus. */
export function isExternalHref(href) {
  return typeof href === "string" && /^https?:\/\//i.test(href);
}

/* Ist dieser öffentliche Pfad eine Shop-Adresse?

   Das Sprachpräfix fällt vorher weg: /it/shop ist genauso eine Shop-Adresse
   wie /shop. Geprüft wird auf Segmentgrenze — „/shopping" ist kein Shop,
   „/shop#pakete" und „/shop?sort=bestseller" sind welche. */
export function isShopPath(path) {
  if (typeof path !== "string" || !path.startsWith("/")) return false;
  return /^\/shop([/?#]|$)/.test(pathWithoutLocale(path));
}
