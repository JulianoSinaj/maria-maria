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

/* Wer den Kaufvertrag schließt. Der Name steht sichtbar an jedem Shop-Link
   („Zum offiziellen Shop", Homepage-Brief §6) und maschinenlesbar als
   `seller` an jedem Angebot (lib/seo/jsonLd.js) — beide müssen dieselbe
   Firma nennen, sonst behauptet das Markup einen anderen Händler als die
   Seite. Origin ohne Pfad, weil daraus die @id des Händler-Knotens wird. */
export const PARTNER_SHOP_NAME = "Terra Vera";
export const PARTNER_SHOP_ORIGIN = "https://www.terra-vera.com";

/* Der Partner-Shop — dort funktioniert die Zahlung. Die Topseller-Collection
   versammelt genau die Maria-Maria-Weine; die allgemeine Weinliste
   (/collections/weine) zeigt daneben sechzig Weine anderer Häuser und ist
   deshalb bewusst NICHT das Ziel. Hierhin führt jeder Link, der keinen
   bestimmten Wein meint. */
export const EXTERNAL_SHOP_URL = "https://www.terra-vera.com/collections/unsere-topseller-weine";

/* Die Topseller-Auswahl des Partner-Shops — Ziel des Shop-Knopfes in der
   Kopfzeile (Desktop wie Menü). Die Kopfzeile begleitet den Besucher über
   jede Seite; wer sie drückt, hat sich noch für keine Flasche entschieden
   und ist vor sechzig Weinen schlechter aufgehoben als vor den meist
   gekauften. Alle übrigen „Zum Shop"-Links (Hero, Fußzeile, CTA-Bänder)
   bleiben auf der vollständigen Sammelseite. */
export const EXTERNAL_TOPSELLER_URL = "https://www.terra-vera.com/collections/unsere-topseller-weine";

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

/* Ziel des Shop-Knopfes in der Kopfzeile. Mit SHOP_ENABLED = true wieder
   schlicht "/shop", damit der Wiederanschalt-Schalter auch hier greift. */
export function topsellerHref() {
  return SHOP_ENABLED ? "/shop" : EXTERNAL_TOPSELLER_URL;
}

/* Absolute http(s)-Adresse? Solche Ziele kann LocaleLink nicht mit einem
   Sprachpräfix versehen — sie führen aus der Site hinaus. */
export function isExternalHref(href) {
  return typeof href === "string" && /^https?:\/\//i.test(href);
}

/* Führt dieser Link in den Partner-Shop? */
export function isPartnerShopHref(href) {
  return typeof href === "string" && href.startsWith(PARTNER_SHOP_ORIGIN);
}

/* Das rel-Attribut für einen Link, der aus der Site hinausführt.

   `noopener` steht immer: Es kappt den Zugriff der Zielseite auf
   window.opener und ist der einzige Teil des Paares, der überhaupt etwas
   mit Sicherheit zu tun hat.

   `noreferrer` steht NICHT am Partner-Shop — und das ist der ganze Punkt.
   Es unterdrückt den Referer-Header; Terra Vera sähe jeden Besucher, den
   diese Site schickt, als „Direktzugriff". Der Shop ist der einzige Ort, an
   dem Geld fließt: Ausgerechnet den Weg dorthin unmessbar zu machen, heißt,
   den Ertrag der ganzen Site nicht belegen zu können. Für fremde Ziele
   (Instagram, Facebook) bleibt es stehen — dort ist die Herkunft niemandes
   Geschäft.

   Der Homepage-Brief §6 schreibt den Ankertext dieser Links vor, sagt zum
   rel-Attribut aber nichts; die Regel steht deshalb hier (Brief-Nachtrag
   §6a, siehe SEO-BRIEF-NACHTRAG.md). */
export function outwardRel(href) {
  return isPartnerShopHref(href) ? "noopener" : "noopener noreferrer";
}

/* Ist dieser öffentliche Pfad eine Shop-Adresse?

   Das Sprachpräfix fällt vorher weg: /it/shop ist genauso eine Shop-Adresse
   wie /shop. Geprüft wird auf Segmentgrenze — „/shopping" ist kein Shop,
   „/shop#pakete" und „/shop?sort=bestseller" sind welche. */
export function isShopPath(path) {
  if (typeof path !== "string" || !path.startsWith("/")) return false;
  return /^\/shop([/?#]|$)/.test(pathWithoutLocale(path));
}
