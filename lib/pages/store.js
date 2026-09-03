/* Seiten-Editor — der Store der redaktionellen Textblöcke.
   ==========================================================================
   Schlüssel: Seite × Block × Sprache → vollständiger Block in der Form des
   Codes (siehe ./blocks.js). Saat sind die Inhaltsdateien selbst — ein
   Block ohne Eintrag hier IST der Code, ein Eintrag ersetzt ihn eins zu eins.
   Zurück zum Code heißt: Eintrag löschen.

   Die Storefront liest den Store über lib/i18n/dictionaries (getDictionary
   → applyPageOverrides), also überall, wo eine Seite ihr Wörterbuch holt.
   Speichern muss die statisch vorgerenderten Seiten anstoßen — das macht
   die API-Route mit revalidatePath, nicht der Store.

   Ein Eintrag, der dem Code gleicht, wird gar nicht erst gespeichert: Wer
   den Originaltext zurücktippt, hat wieder den Code — und die Karte sagt
   das dann auch.

   Gleiche globalThis-Semantik wie die anderen Admin-Stores (Bestand, Hero,
   Karte …): überlebt Hot Reloads, nicht den Neustart, und auf Vercel nicht
   den Wechsel der Instanz. Die Persistenz ist Phase 1 der Roadmap. */

import { PAGES, LOCKED_KEYS, isPage, findBlock } from "./blocks";
import { pathOf, getAt, deepEqual, applyOverrides, validateAgainstSeed } from "./merge";
import { LOCALES, isLocale } from "@/lib/i18n/config";

if (typeof window !== "undefined") {
  throw new Error(
    "lib/pages/store ist serverseitig — der Editor spricht mit /api/admin/pages, " +
      "Struktur und Helfer liegen in lib/pages/blocks und lib/pages/merge.",
  );
}

/* Dieselben vier Zweige wie in lib/i18n/dictionaries — dynamisch, damit
   pro Anfrage nur eine Sprache geladen wird. */
const SEEDS = {
  de: () => import("@/content/de"),
  it: () => import("@/content/it"),
  en: () => import("@/content/en"),
  cs: () => import("@/content/cs"),
};

export async function getSeedDictionary(locale) {
  const load = SEEDS[locale];
  if (!load) return null;
  const mod = await load();
  return mod.default ?? mod;
}

export async function getSeedBlock(page, blockKey, locale) {
  const dict = await getSeedDictionary(locale);
  if (!dict) return undefined;
  return getAt(dict[page], pathOf(blockKey));
}

/* state.overrides[page][blockKey][locale] = value */
globalThis.__mmPagesStore ??= { overrides: {} };
const state = globalThis.__mmPagesStore;

export function getOverride(page, blockKey, locale) {
  return state.overrides[page]?.[blockKey]?.[locale];
}

export function overrideLocales(page, blockKey) {
  const entry = state.overrides[page]?.[blockKey];
  return entry ? LOCALES.filter((locale) => entry[locale] !== undefined) : [];
}

/* { [page]: { [blockKey]: [locales] } } — für die Tab-Zähler des Editors. */
export function listOverrides() {
  const out = {};
  for (const [page, blocks] of Object.entries(state.overrides)) {
    for (const blockKey of Object.keys(blocks)) {
      const locales = overrideLocales(page, blockKey);
      if (locales.length) (out[page] ??= {})[blockKey] = locales;
    }
  }
  return out;
}

/* { [page]: { [blockKey]: value } } für genau eine Sprache, null wenn es
   nichts zu mischen gibt — der Normalfall, und der bleibt kostenlos. */
export function overridesForLocale(locale) {
  let out = null;
  for (const [page, blocks] of Object.entries(state.overrides)) {
    for (const [blockKey, byLocale] of Object.entries(blocks)) {
      const value = byLocale[locale];
      if (value === undefined) continue;
      ((out ??= {})[page] ??= {})[blockKey] = value;
    }
  }
  return out;
}

/** Wörterbuch einer Sprache mit den redaktionellen Blöcken — gibt das
    Original zurück, wenn nichts überschrieben ist. */
export function applyPageOverrides(dict, locale) {
  const overrides = overridesForLocale(locale);
  return overrides ? applyOverrides(dict, overrides) : dict;
}

async function recordFor(page, entry, locale, dict) {
  const seedDict = dict ?? (await getSeedDictionary(locale));
  const seed = getAt(seedDict?.[page], pathOf(entry.key));
  const override = getOverride(page, entry.key, locale);
  return {
    key: entry.key,
    num: entry.num ?? null,
    titleFrom: entry.titleFrom ?? null,
    editor: entry.editor ?? null,
    seed: seed ?? null,
    value: override ?? seed ?? null,
    overridden: override !== undefined,
    locales: overrideLocales(page, entry.key),
  };
}

export async function getBlockRecord(page, blockKey, locale) {
  const entry = findBlock(page, blockKey);
  return entry ? recordFor(page, entry, locale) : null;
}

export async function getPageBlocks(page, locale) {
  if (!isPage(page)) return [];
  const dict = await getSeedDictionary(locale);
  return Promise.all(PAGES[page].blocks.map((entry) => recordFor(page, entry, locale, dict)));
}

/** Block einer Sprache setzen. Rückgabe { errors } oder { value, overridden }. */
export async function putOverride(page, blockKey, locale, value) {
  if (!isPage(page)) return { errors: [`Unknown page "${page}"`] };
  const entry = findBlock(page, blockKey);
  if (!entry) return { errors: [`Unknown block "${blockKey}" on page "${page}"`] };
  if (entry.editor)
    return { errors: [`Block "${blockKey}" is maintained in its own editor (${entry.editor})`] };
  if (!isLocale(locale)) return { errors: [`Unknown locale "${locale}"`] };

  const seed = await getSeedBlock(page, blockKey, locale);
  if (seed === undefined) return { errors: [`No seed for ${page}.${blockKey} in "${locale}"`] };

  const errors = validateAgainstSeed(seed, value, { lockedKeys: LOCKED_KEYS });
  if (errors.length) return { errors };

  if (deepEqual(seed, value)) {
    deleteOverride(page, blockKey, locale);
    return { value: seed, overridden: false };
  }

  ((state.overrides[page] ??= {})[blockKey] ??= {})[locale] = value;
  return { value, overridden: true };
}

export function deleteOverride(page, blockKey, locale) {
  const byLocale = state.overrides[page]?.[blockKey];
  if (!byLocale) return false;
  const had = byLocale[locale] !== undefined;
  delete byLocale[locale];
  if (!Object.keys(byLocale).length) delete state.overrides[page][blockKey];
  if (!Object.keys(state.overrides[page]).length) delete state.overrides[page];
  return had;
}

export function resetPagesStore() {
  state.overrides = {};
}
