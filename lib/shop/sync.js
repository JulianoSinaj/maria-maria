/* Der Abgleich mit dem Partner-Shop.
   ==================================================================
   Eine Frage an eine öffentliche Adresse, neunmal: Gibt es dieses Produkt
   noch, was kostet es, ist es lieferbar?

     https://www.terra-vera.com/products/<handle>.js

   KEIN Schlüssel, kein Token, keine Absprache nötig — Shopify liefert jede
   Produktseite auch als JSON aus. Genau deshalb steht hier ein Abgleich und
   keine Integration: Er kann nicht ablaufen, nicht entzogen werden und
   kostet den Partner nichts.

   WARUM .js UND NICHT .json (die Vorgabe nannte .json):
   Beide Adressen liefern dasselbe Produkt, aber nicht dieselben Felder.
   `.json` kennt KEINE Verfügbarkeit — gemessen am 03.09.2026: die Varianten
   dort tragen id, title, sku, price, grams, position und kein `available`.
   Ein Abgleich, der die Verfügbarkeit speichern soll, kann sie dort also
   nicht herbekommen. `.js` trägt `available` je Variante und für das
   Produkt, dazu die Preise in Cent (ganzzahlig, keine Rundungsfrage).
   Deshalb: `.js` zuerst, `.json` als Rückfallebene, wenn `.js` einmal nicht
   antwortet — dann bleibt die Verfügbarkeit unbekannt (null) statt falsch.

   Node-Runtime: der Abgleich schreibt in den Inventarspeicher. */

import { SHOP_SYNC } from "@/lib/inventory/schema";
import { list, recordShopSync } from "@/lib/inventory/store";
import { isValidHandle, productDataUrl, productJsonUrl } from "./handles";

/* Zehn Sekunden. Der Shop antwortet gemessen in 150–300 ms; was länger
   braucht, ist keine langsame Antwort mehr, sondern eine ausbleibende — und
   ein nächtlicher Lauf, der an einer hängenden Verbindung stehenbleibt,
   synchronisiert die restlichen acht Weine nie. */
export const SYNC_TIMEOUT_MS = 10_000;

/* Drei gleichzeitig. Neun Anfragen im Block wären für Shopify unauffällig,
   aber es gibt keinen Grund, sich wie ein Scraper zu verhalten: Der Lauf
   dauert so knapp eine Sekunde statt einer Drittelsekunde. */
export const SYNC_CONCURRENCY = 3;

/* Cent → Euro. Shopify rechnet in Ganzzahlen, damit 12,95 nicht als
   12.949999 auftaucht; hier wird genau einmal geteilt. */
const fromCents = (value) =>
  typeof value === "number" && Number.isFinite(value) ? Math.round(value) / 100 : null;

const asPrice = (value) => {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
};

/* Welche Variante den Preis stellt: die erste lieferbare, sonst die erste
   überhaupt. Die Maria-Maria-Weine führen dort je eine Variante („Default
   Title"); Lugana und Primitivo 15,5 gibt es zusätzlich als eigenes
   Magnum-PRODUKT, nicht als Variante — die Regel greift also erst, wenn
   Terra Vera das eines Tages umstellt. */
const pickVariant = (variants) =>
  (Array.isArray(variants) && (variants.find((v) => v.available) ?? variants[0])) || null;

/* Der Handle, auf dem die Antwort tatsächlich gelandet ist. Wird ein Produkt
   in Shopify umbenannt, legt der Shop eine Weiterleitung von der alten
   Adresse an — die Anfrage endet dann mit 200 unter einem ANDEREN Handle.
   Das ist der wertvollste Hinweis, den dieser Abgleich liefern kann: Der
   neue Handle steht in der Antwort, und die Redaktion muss ihn nicht
   suchen. */
function handleOfUrl(url) {
  const match = String(url ?? "").match(/\/products\/([^/?#.]+)/i);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Ein Produkt am Partner-Shop nachschlagen.
 *
 * Wirft nie. Die Rückgabe hat genau die Form, die recordShopSync() erwartet,
 * plus `resolvedHandle` — dieses eine Feld wird NICHT gespeichert, es ist ein
 * Hinweis für die Oberfläche.
 *
 * @param {string} handle
 * @returns {Promise<{sync: string, price: number|null, available: boolean|null,
 *                    title: string|null, error: string|null,
 *                    resolvedHandle: string|null, source: string|null}>}
 */
export async function fetchShopProduct(handle) {
  if (!isValidHandle(handle)) {
    return {
      sync: SHOP_SYNC.ERROR,
      price: null,
      available: null,
      title: null,
      error: "Kein gültiger Handle",
      resolvedHandle: null,
      source: null,
    };
  }

  /* .js zuerst — nur dort steht die Verfügbarkeit. */
  const primary = await request(productDataUrl(handle));
  if (primary.ok) {
    const product = primary.body;
    const variant = pickVariant(product?.variants);
    return {
      sync: SHOP_SYNC.OK,
      price: fromCents(variant?.price ?? product?.price),
      available:
        typeof product?.available === "boolean"
          ? product.available
          : typeof variant?.available === "boolean"
            ? variant.available
            : null,
      title: typeof product?.title === "string" ? product.title : null,
      error: null,
      resolvedHandle: handleOfUrl(primary.url) ?? handle,
      source: ".js",
    };
  }

  /* 404 ist die eine Antwort, die eindeutig etwas über das Produkt sagt:
     Es gibt es unter diesem Handle nicht (mehr). Alles andere sagt etwas
     über die Verbindung — und darf den Wein nicht als „weg" markieren. */
  if (primary.status === 404) {
    return {
      sync: SHOP_SYNC.MISSING,
      price: null,
      available: null,
      title: null,
      error: "404 — Produktseite existiert nicht (mehr)",
      resolvedHandle: null,
      source: ".js",
    };
  }

  /* Rückfallebene: dieselbe Produktseite als .json. Kennt keine
     Verfügbarkeit — die bleibt dann unbekannt statt geraten. */
  const fallback = await request(productJsonUrl(handle));
  if (fallback.ok) {
    const product = fallback.body?.product;
    const variant = pickVariant(product?.variants);
    return {
      sync: SHOP_SYNC.OK,
      price: asPrice(variant?.price),
      available: null,
      title: typeof product?.title === "string" ? product.title : null,
      error: null,
      resolvedHandle: handleOfUrl(fallback.url) ?? handle,
      source: ".json",
    };
  }
  if (fallback.status === 404) {
    return {
      sync: SHOP_SYNC.MISSING,
      price: null,
      available: null,
      title: null,
      error: "404 — Produktseite existiert nicht (mehr)",
      resolvedHandle: null,
      source: ".json",
    };
  }

  return {
    sync: SHOP_SYNC.ERROR,
    price: null,
    available: null,
    title: null,
    error: fallback.error ?? primary.error ?? "Shop nicht erreichbar",
    resolvedHandle: null,
    source: null,
  };
}

/* Eine Anfrage, ohne Ausnahmen nach außen. */
async function request(url) {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(SYNC_TIMEOUT_MS),
    });

    if (!response.ok) {
      return { ok: false, status: response.status, error: `HTTP ${response.status}`, url: response.url };
    }
    return { ok: true, status: response.status, body: await response.json(), url: response.url };
  } catch (error) {
    const timeout = error?.name === "TimeoutError" || error?.name === "AbortError";
    return {
      ok: false,
      status: 0,
      error: timeout ? `Zeitüberschreitung nach ${SYNC_TIMEOUT_MS / 1000} s` : String(error?.message ?? error),
      url,
    };
  }
}

/* -------------------------------------------------------------- Läufe ---- */

/**
 * Einen Wein abgleichen und das Ergebnis im Inventar festhalten.
 * @returns {Promise<{item: object|null, result: object|null, skipped?: string}>}
 */
export async function syncWine(item) {
  const handle = item?.shop?.handle;
  if (!handle) return { item, result: null, skipped: "no-handle" };

  const result = await fetchShopProduct(handle);
  const { resolvedHandle, source, ...persisted } = result;
  const updated = recordShopSync(item.id, persisted);

  return { item: updated ?? item, result };
}

/**
 * Alle Weine mit Handle abgleichen — der Knopf „Shop-Sync" und der
 * nächtliche Lauf gehen beide hier durch.
 *
 * Archivierte bleiben außen vor: Sie stehen nicht zum Verkauf, ihr Shop-Link
 * ist niemandes Problem, und ein nächtlicher Lauf soll nicht wegen einer
 * ausgelisteten Flasche eine Warnung erzeugen.
 */
export async function syncAllWines() {
  const items = list({ sort: "name" }).filter((item) => item.shop?.handle);
  const started = Date.now();
  const results = [];

  for (let i = 0; i < items.length; i += SYNC_CONCURRENCY) {
    const slice = items.slice(i, i + SYNC_CONCURRENCY);
    /* eslint-disable no-await-in-loop -- drei gleichzeitig, absichtlich */
    const done = await Promise.all(slice.map((item) => syncWine(item)));
    results.push(...done);
  }

  const tally = { ok: 0, missing: 0, error: 0 };
  for (const { result } of results) {
    if (result?.sync && result.sync in tally) tally[result.sync] += 1;
  }

  return {
    checked: results.length,
    ...tally,
    durationMs: Date.now() - started,
    finishedAt: new Date().toISOString(),
    /* umbenannte Produkte: alter Handle → neuer Handle */
    renamed: results
      .filter(({ item, result }) => result?.resolvedHandle && result.resolvedHandle !== item?.shop?.handle)
      .map(({ item, result }) => ({ id: item.id, name: item.name, handle: item.shop.handle, resolvedHandle: result.resolvedHandle })),
    items: results.map(({ item }) => item),
  };
}
