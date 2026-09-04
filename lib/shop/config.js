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
import {
  DEFAULT_PRODUCT_HANDLES,
  PARTNER_SHOP_ORIGIN,
  isValidHandle,
  productUrl,
} from "./handles";

export const SHOP_ENABLED = false;

/* Wer den Kaufvertrag schließt. Der Name steht sichtbar an jedem Shop-Link
   („Zum offiziellen Shop", Homepage-Brief §6) und maschinenlesbar als
   `seller` an jedem Angebot (lib/seo/jsonLd.js) — beide müssen dieselbe
   Firma nennen, sonst behauptet das Markup einen anderen Händler als die
   Seite. Origin ohne Pfad, weil daraus die @id des Händler-Knotens wird. */
export const PARTNER_SHOP_NAME = "Terra Vera";

/* Die Domain steht seit dem Shop-Abgleich in lib/shop/handles.js — dort, wo
   auch die Produkt-Handles liegen, aus denen jede Produktadresse entsteht.
   Hier wird sie unter ihrem bisherigen Namen weitergereicht, damit kein
   Aufrufer (lib/seo/jsonLd.js, middleware.js) sich ändern muss. */
export { PARTNER_SHOP_ORIGIN };

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

/* --- Der Weg nach draußen führt über die eigene Tür --------------------

   Seit der Übergabe an Terra Vera ist der Klick, der die Seite verlässt,
   das Nächste, was diese Site an einem Verkauf hat. Gezählt werden kann er
   nur an einer Stelle, die der Browser passieren MUSS, bevor er drüben
   ankommt — deshalb zeigen die sichtbaren Shop-Links nicht mehr direkt auf
   terra-vera.com, sondern auf /api/out/shop/<key>, das zählt und dann
   weiterleitet (app/api/out/shop/[key]/route.js).

   Ein Tag-Manager täte es nicht: Er bräuchte ein Einwilligungsbanner
   (TTDSG §25) und verlöre die Klicks, bei denen der Browser den Tab schon
   verlässt, bevor das Skript gefeuert hat. Eine Weiterleitung verliert
   keinen.

   WICHTIG — externalShopUrl() bleibt unangetastet: Die Produktadresse im
   JSON-LD (lib/seo/jsonLd.js, Offer.url) muss die ECHTE Adresse der
   Flasche im Partner-Shop nennen. Strukturierte Daten, die auf eine
   Weiterleitung zeigen, sind für Google ein Fehler in der eigenen Datei.
   Gezählt wird der Mensch, nicht der Crawler. */

export const SHOP_OUT_PATH = "/api/out/shop";

/* Die zwei Ziele ohne eigene Flasche. Getrennt gehalten, obwohl beide
   heute dieselbe Sammelseite meinen: Der Knopf in der Kopfzeile und ein
   „Zum Shop" im Fließtext beantworten verschiedene Fragen, und wenn die
   Zahlen je auseinanderlaufen sollen, müssen es die Schlüssel schon
   vorher tun. */
export const SHOP_COLLECTION_KEY = "collection";
export const SHOP_TOPSELLER_KEY = "topseller";

/* Der Zählpfad zu einem Ziel. Ohne Sprache — die hängt LocaleLink beim
   Rendern an, weil ein Modul auf Dateiebene nicht weiß, in welcher Sprache
   die Seite später steht. */
export const outHref = (key) => `${SHOP_OUT_PATH}/${key}`;

/* Ist das ein Link durch die eigene Zähltür? */
export const isOutHref = (href) =>
  typeof href === "string" && href.startsWith(`${SHOP_OUT_PATH}/`);

/* Die Produktseiten der neun Weine im Partner-Shop, nach Slug aus
   components/data.js. Wer auf einer Weinseite „Im Shop entdecken" drückt,
   soll vor der richtigen Flasche stehen — nicht vor der Sammelseite mit
   sechzig Weinen anderer Häuser.

   Zusammengesetzt aus den Handles in lib/shop/handles.js: Nur der Handle
   ändert sich je Wein, die Adresse drumherum ist immer dieselbe. Neuer Wein
   ohne Eintrag: shopHref fällt auf die Sammelseite zurück, nichts bricht.

   Diese Tabelle ist die AUSGANGSLAGE. Was die Redaktion im Backoffice
   pflegt, geht ihr vor — siehe handleFor() gleich darunter.

   Übergangslösung: sobald der Shop-Code des Partners in dieses Projekt
   wandert, ersetzt eine echte Produktroute diese Tabelle. */
export const EXTERNAL_PRODUCT_URLS = Object.freeze(
  Object.fromEntries(
    Object.entries(DEFAULT_PRODUCT_HANDLES).map(([slug, handle]) => [slug, productUrl(handle)]),
  ),
);

/* --- Der Handle, den die Redaktion pflegt --------------------------------

   Benennt Terra Vera ein Produkt um, ändert sich sein Handle — und der
   Knopf „Im Shop entdecken" auf genau dieser Weinseite führt ins Leere.
   Bemerkt wird das im Backoffice (Weinportfolio → Spalte „Shop", 404), und
   dort wird der neue Handle auch eingetragen. Diese Auflösung ist die
   Stelle, an der die Korrektur wirkt: OHNE Deploy, ohne Änderung im Code.

   Warum über globalThis und nicht über einen Import? Weil diese Datei über
   LocaleLink und die neun wineData-Module auch im BROWSER-Bundle und in der
   Edge-Middleware landet. Ein Import von node:fs wäre dort ein Baufehler.
   Der Serverprozess legt die gepflegten Handles hier ab
   (lib/shop/persist.js → primeHandleOverrides, gestartet von
   instrumentation.js), im Browser bleibt die Ablage leer und es gilt die
   Tabelle oben — dieselbe, mit der die Seite gebaut wurde. Damit kann
   Server- und Client-Auflösung nicht auseinanderlaufen.

   Statisch vorgerenderte Seiten tragen den Stand ihres Builds; deshalb
   stößt die Backoffice-Route nach einer Handle-Änderung revalidatePath()
   für die Weinseiten an (app/api/admin/shop/sync/route.js). */
const OVERRIDE_KEY = "__mmShopHandles";

/** Die gepflegten Handles setzen (Serverprozess). Nur gültige Handles
    kommen durch — ein „/" in der Ablage würde die Adresse umschreiben. */
export function setHandleOverrides(map) {
  const clean = {};
  for (const [slug, handle] of Object.entries(map ?? {})) {
    if (isValidHandle(handle)) clean[slug] = handle;
  }
  globalThis[OVERRIDE_KEY] = clean;
  return clean;
}

/** Der Handle eines Weins: gepflegt, sonst Tabelle, sonst null. */
export function handleFor(slug) {
  if (!slug) return null;
  const stored = globalThis[OVERRIDE_KEY]?.[slug];
  if (isValidHandle(stored)) return stored;
  return DEFAULT_PRODUCT_HANDLES[slug] ?? null;
}

/* Produktseite eines Weins im Partner-Shop — oder die Sammelseite, wenn der
   Slug dort (noch) nicht gelistet ist. */
export function externalShopUrl(slug) {
  const handle = handleFor(slug);
  return handle ? productUrl(handle) : EXTERNAL_SHOP_URL;
}

/* Kaufweg eines Weins als Link-Ziel für Hero, Subnav, Maria-Moment und
   CTA-Band der Weinseiten. Solange der eigene Shop stillgelegt ist: die
   Produktseite im Partner-Shop (absolute URL — LocaleLink öffnet sie in
   neuem Tab). Mit SHOP_ENABLED = true wieder schlicht "/shop", wie vor der
   Stilllegung. Ohne Slug dasselbe wie ein nackter "/shop"-Link. */
export function shopHref(slug) {
  if (SHOP_ENABLED) return "/shop";
  /* Ein Slug ohne Eintrag im Partner-Shop landet auf der Sammelseite — wie
     vorher bei externalShopUrl(), nur eben gezählt. */
  return outHref(slug && EXTERNAL_PRODUCT_URLS[slug] ? slug : SHOP_COLLECTION_KEY);
}

/* Ziel des Shop-Knopfes in der Kopfzeile. Mit SHOP_ENABLED = true wieder
   schlicht "/shop", damit der Wiederanschalt-Schalter auch hier greift. */
export function topsellerHref() {
  return SHOP_ENABLED ? "/shop" : outHref(SHOP_TOPSELLER_KEY);
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
