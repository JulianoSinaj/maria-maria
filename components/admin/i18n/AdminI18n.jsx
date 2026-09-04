"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ADMIN_DICTIONARY,
  ADMIN_DEFAULT_LOCALE,
  ADMIN_LOCALE_META,
  ADMIN_LOCALE_COOKIE,
  isAdminLocale,
} from "./dictionary";
import { ADMIN_MEDIA_DICTIONARY } from "./media";

/* Admin-only language context.
   ------------------------------------------------------------------
   Independent of the storefront's lib/i18n: the backoffice lives in its own
   root layout, outside the [locale] segment, and its language is a personal
   editor preference rather than a URL. The choice is stored in a cookie
   scoped to /admin (so the storefront's `mm_locale` cookie and middleware
   never see it) and mirrored to localStorage as a belt-and-braces fallback.

   The server layout reads the cookie and passes `initialLocale`, so the
   first paint already carries the right language — no flash from German. */

/* re-exported for client callers; the server layout imports them from
   ./dictionary directly (see the note there) */
export { ADMIN_LOCALE_COOKIE, isAdminLocale };

/* Core vocabulary plus the section modules, merged once at module load.

   dictionary.js holds what the whole backoffice says; a section that grows
   its own vocabulary — the media manager is the first — brings it along in
   its own file. The merge is deep, so a section may add keys to an existing
   block (mediaPage) without restating the block, and per language, so a
   missing Italian section still falls back key by key like everything else. */
function deepMerge(base, extra) {
  const merged = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    const mergeable =
      value && typeof value === "object" && !Array.isArray(value) &&
      merged[key] && typeof merged[key] === "object" && !Array.isArray(merged[key]);
    merged[key] = mergeable ? deepMerge(merged[key], value) : value;
  }
  return merged;
}

const DICTIONARY = Object.fromEntries(
  Object.entries(ADMIN_DICTIONARY).map(([locale, entries]) => [
    locale,
    deepMerge(entries, ADMIN_MEDIA_DICTIONARY[locale] ?? {}),
  ]),
);

const STORAGE_KEY = "mm-admin-locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const AdminI18nContext = createContext(null);

/* Walk "a.b.c" into a nested dictionary. Returns undefined when any hop is
   missing so the caller can fall back. */
function lookup(dict, path) {
  let cur = dict;
  for (const key of path.split(".")) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[key];
  }
  return cur;
}

function interpolate(str, vars) {
  if (!vars || typeof str !== "string") return str;
  return str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export function AdminI18nProvider({ initialLocale, children }) {
  const [locale, setLocaleState] = useState(
    isAdminLocale(initialLocale) ? initialLocale : ADMIN_DEFAULT_LOCALE,
  );

  /* If the cookie was absent (first visit, or blocked) but localStorage still
     remembers a choice, honour it after mount. */
  useEffect(() => {
    if (isAdminLocale(initialLocale)) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isAdminLocale(stored)) setLocaleState(stored);
    } catch {
      /* storage disabled — stay on the default */
    }
  }, [initialLocale]);

  /* keep <html lang> in step so screen readers switch pronunciation too */
  useEffect(() => {
    document.documentElement.lang = ADMIN_LOCALE_META[locale]?.html ?? locale;
  }, [locale]);

  const setLocale = useCallback((next) => {
    if (!isAdminLocale(next)) return;
    setLocaleState(next);
    try {
      document.cookie = `${ADMIN_LOCALE_COOKIE}=${next}; path=/admin; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    } catch {
      /* non-fatal */
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* non-fatal */
    }
  }, []);

  const value = useMemo(() => {
    const dict = DICTIONARY[locale] ?? DICTIONARY[ADMIN_DEFAULT_LOCALE];
    const base = DICTIONARY[ADMIN_DEFAULT_LOCALE];
    const meta = ADMIN_LOCALE_META[locale] ?? ADMIN_LOCALE_META[ADMIN_DEFAULT_LOCALE];

    /* t("table.colWine") → string; t("mediaPage.items") → array.
       Missing keys fall back to German, then to the key itself so a typo is
       visible on screen instead of rendering nothing. */
    const t = (path, vars) => {
      const hit = lookup(dict, path) ?? lookup(base, path);
      return hit === undefined ? path : interpolate(hit, vars);
    };

    /* tm("inquiryStatus", "neu") → translated, or the raw value when
       the group has no entry for it (proper nouns, unexpected data). */
    const tm = (group, raw) => {
      if (raw == null) return raw;
      const hit = lookup(dict, `${group}.${raw}`) ?? lookup(base, `${group}.${raw}`);
      return hit === undefined ? raw : hit;
    };

    const intl = meta.intl;
    const nf = new Intl.NumberFormat(intl);
    const eur0 = new Intl.NumberFormat(intl, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });
    const eur2 = new Intl.NumberFormat(intl, { style: "currency", currency: "EUR" });

    return {
      locale,
      setLocale,
      meta,
      t,
      tm,
      intl,
      fmtNum: (n) => nf.format(n),
      fmtEur: (n) => eur0.format(n),
      fmtEurExact: (n) => eur2.format(n),
      fmtPct: (n) => `${n > 0 ? "+" : ""}${n.toLocaleString(intl)} %`,
    };
  }, [locale, setLocale]);

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

/* Outside the provider (should not happen inside /admin) everything falls
   back to German so a stray component still renders. */
let fallback = null;
function buildFallback() {
  if (fallback) return fallback;
  const dict = DICTIONARY[ADMIN_DEFAULT_LOCALE];
  const meta = ADMIN_LOCALE_META[ADMIN_DEFAULT_LOCALE];
  const nf = new Intl.NumberFormat(meta.intl);
  const eur0 = new Intl.NumberFormat(meta.intl, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const eur2 = new Intl.NumberFormat(meta.intl, { style: "currency", currency: "EUR" });
  fallback = {
    locale: ADMIN_DEFAULT_LOCALE,
    setLocale: () => {},
    meta,
    t: (path, vars) => {
      const hit = lookup(dict, path);
      return hit === undefined ? path : interpolate(hit, vars);
    },
    tm: (group, raw) => lookup(dict, `${group}.${raw}`) ?? raw,
    intl: meta.intl,
    fmtNum: (n) => nf.format(n),
    fmtEur: (n) => eur0.format(n),
    fmtEurExact: (n) => eur2.format(n),
    fmtPct: (n) => `${n > 0 ? "+" : ""}${n.toLocaleString(meta.intl)} %`,
  };
  return fallback;
}

export function useAdminI18n() {
  return useContext(AdminI18nContext) ?? buildFallback();
}
