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
     1. components/i18n/LocaleLink  — jeder interne /shop-Link zeigt nach außen
     2. middleware.js               — /shop selbst leitet nach außen weiter
     3. components/StorefrontChrome — der Warenkorb wird nicht mehr gerendert
     4. lib/seo/routes              — /shop fällt aus der Sitemap

   Alle vier lesen von hier. Wer den Shop wieder anschaltet, ändert diese
   eine Zeile — und nichts sonst. */

import { pathWithoutLocale } from "@/lib/i18n/routing";

export const SHOP_ENABLED = false;

/* Der Partner-Shop — dort funktioniert die Zahlung. */
export const EXTERNAL_SHOP_URL = "https://www.terra-vera.com/collections/weine";

/* Ist dieser öffentliche Pfad eine Shop-Adresse?

   Das Sprachpräfix fällt vorher weg: /it/shop ist genauso eine Shop-Adresse
   wie /shop. Geprüft wird auf Segmentgrenze — „/shopping" ist kein Shop,
   „/shop#pakete" und „/shop?sort=bestseller" sind welche. */
export function isShopPath(path) {
  if (typeof path !== "string" || !path.startsWith("/")) return false;
  return /^\/shop([/?#]|$)/.test(pathWithoutLocale(path));
}
