/* Die neun Weine im Partner-Shop — als Handle, nicht als fertige Adresse.
   ==================================================================
   Ein Shopify-Handle ist der Teil hinter /products/:

     https://www.terra-vera.com/products/lugana-doc-maria-maria-0-7
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^

   Er ist der einzige veränderliche Teil des Kaufwegs, und er gehört Terra
   Vera: Wird ein Produkt dort umbenannt, ändert sich der Handle, und der
   Knopf „Im Shop entdecken" auf der Weinseite zeigt ins Leere — mit 404,
   ohne Fehlermeldung, ohne dass es jemandem auffällt. Genau deshalb steht
   hier der Handle und nicht die zusammengesetzte URL: Der Handle ist das,
   was das Backoffice pflegt, was der Abgleich prüft und was
   lib/shop/config.js zur Adresse zusammensetzt.

   Diese Tabelle ist die AUSGANGSLAGE, nicht die Wahrheit. Was die Redaktion
   im Backoffice einträgt, überschreibt sie zur Laufzeit
   (setHandleOverrides in lib/shop/config.js, gespeichert von
   lib/shop/persist.js). Ohne Eintrag — frische Installation, leeres
   data/-Verzeichnis — gilt, was hier steht.

   Diese Datei ist bewusst FREI von Node-Modulen: sie landet über
   lib/shop/config.js auch im Browser-Bundle und in der Edge-Middleware.
   Alles, was ein Dateisystem braucht, steht in lib/shop/persist.js. */

/* Die Domain des Partner-Shops. Steht hier und nicht in config.js, weil
   jede Produktadresse daraus entsteht; config.js reicht sie unter ihrem
   bisherigen Namen weiter, damit kein Aufrufer sich ändern muss. */
export const PARTNER_SHOP_ORIGIN = "https://www.terra-vera.com";

/* Ermittelt am 17.08.2026 über terra-vera.com/search?q=maria+maria, zuletzt
   bestätigt am 03.09.2026: alle neun antworten mit 200, alle neun führen
   genau eine Variante („Default Title"). Lugana und Primitivo 15,5 gibt es
   dort auch als Magnum (…-1-5) — verlinkt ist die 0,7-l-Flasche, die dem
   Katalogpreis entspricht. */
export const DEFAULT_PRODUCT_HANDLES = Object.freeze({
  "primitivo-15-5": "primitivo-15-5-0-7",
  lugana: "lugana-doc-maria-maria-0-7",
  "greco-di-tufo": "greco-di-tufo-docg",
  "primitivo-14-5": "primitivo-di-manduria-dop",
  "primitivo-salento": "primitivo-salento-igp-maria-maria",
  falanghina: "beneventano-falanghina-igp",
  "rosato-puglia": "rosato-negroamaro-salento-igp",
  "il-rosso-aglianico": "vino-rosso-maria-maria",
  "il-bianco-greco-cuvee": "vino-bianco-il-bianco-maria-maria",
});

/* Shopify erzeugt Handles aus Kleinbuchstaben, Ziffern und Bindestrichen.
   Die Prüfung ist keine Formsache: Was hier durchkommt, wird ohne weitere
   Kodierung in eine URL gesetzt — ein „/" oder ein „?" im Eingabefeld würde
   sonst die Adresse selbst umschreiben. */
export const HANDLE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isValidHandle = (handle) =>
  typeof handle === "string" &&
  handle.length > 0 &&
  handle.length <= 120 &&
  HANDLE_PATTERN.test(handle);

/* Die Produktseite — das Ziel jedes „Im Shop entdecken". */
export const productUrl = (handle) => `${PARTNER_SHOP_ORIGIN}/products/${handle}`;

/* Die zwei öffentlichen Datenformen derselben Produktseite. Beide brauchen
   keinen Schlüssel; der Unterschied entscheidet den Abgleich:

     .js    trägt `available` (Verfügbarkeit) und Preise in CENT
     .json  trägt keine Verfügbarkeit, dafür Preise als Dezimalstring

   Der Abgleich fragt deshalb zuerst .js und fällt auf .json zurück — siehe
   lib/shop/sync.js, wo diese Entscheidung ausführlich begründet steht. */
export const productDataUrl = (handle) => `${productUrl(handle)}.js`;
export const productJsonUrl = (handle) => `${productUrl(handle)}.json`;

/* Was die Redaktion einfügt, ist selten ein nackter Handle: meistens die
   ganze Adresse aus der Adresszeile, oft mit ?variant=… am Ende. Statt eine
   Fehlermeldung zu zeigen, holt diese Funktion den Handle heraus.

   Rückgabe: der Handle, oder null, wenn aus der Eingabe keiner zu gewinnen
   ist — dann darf das Formular meckern. */
export function handleFromInput(value) {
  if (typeof value !== "string") return null;
  let text = value.trim();
  if (!text) return null;

  /* Vollständige Adresse oder Pfad: der Teil hinter /products/ bis zum
     nächsten Trenner. Bewusst ohne Host-Prüfung — wer die Adresse eines
     anderen Shops einfügt, hat den Handle trotzdem richtig kopiert, und der
     Shop steht ohnehin an genau einer Stelle (PARTNER_SHOP_ORIGIN). */
  const match = text.match(/\/products\/([^/?#\s]+)/i);
  if (match) text = match[1];

  /* Ein „/collections/x/products/y"-Pfad ist damit schon aufgelöst; was
     jetzt noch trennt, ist Zierrat aus der Zwischenablage. */
  text = text.split(/[?#]/)[0].replace(/^\/+|\/+$/g, "").toLowerCase();

  return isValidHandle(text) ? text : null;
}
