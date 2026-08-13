"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_LOCALE, LOCALE_META } from "./config";
import { localePath } from "./routing";
import { formatPrice, joinList, formatDate, formatNumber } from "./format";
import { localizeWines } from "./catalogue";

/* Die Sprache für Client-Components.

   Der Provider trägt bewusst nur zwei Dinge: die aktive Locale und den
   `common`-Abschnitt (Navigation, Footer, Warenkorb, aria-Labels). Alles
   Seitenspezifische — Weinseiten, FAQ, Magazin, Rechtstexte — reicht die
   jeweilige Server-Component als Prop hinein. Andernfalls läge der komplette
   Redaktionstext einer Sprache in der RSC-Payload jeder einzelnen Seite.

   Die Locale kommt aus `params.locale` des Layouts, nicht aus `usePathname()`.
   Das ist Absicht: Deutsch läuft präfixlos, die Middleware schreibt „/shop"
   intern auf „/de/shop" um. Der Pfad im Browser verrät die Sprache also nicht
   zuverlässig — das Route-Segment schon. */

const I18nContext = createContext(null);

export function I18nProvider({ locale = DEFAULT_LOCALE, common = {}, children }) {
  const value = useMemo(() => ({ locale, common }), [locale, common]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18nContext() {
  const ctx = useContext(I18nContext);
  /* Kein Provider = ein Component außerhalb von app/[locale]/. Statt zu
     werfen (und damit eine ganze Seite zu killen, weil irgendwo ein Label
     fehlt) fällt alles auf Deutsch zurück. */
  return ctx ?? { locale: DEFAULT_LOCALE, common: {} };
}

export function useLocale() {
  return useI18nContext().locale;
}

/* Der gemeinsame Rahmen-Text. `useCommon("nav")` gibt den Navigations-Zweig,
   `useCommon()` das ganze Objekt. */
export function useCommon(section) {
  const { common } = useI18nContext();
  return section ? common?.[section] ?? {} : common;
}

/* Sprach-Metadaten der aktiven Locale (Eigenbezeichnung, html-lang …). */
export function useLocaleMeta() {
  const { locale } = useI18nContext();
  return LOCALE_META[locale] ?? LOCALE_META[DEFAULT_LOCALE];
}

/* Der Weinkatalog in der aktiven Sprache.

   Karten, Filterleisten, das Mega-Dropdown und der Warenkorb brauchen ihn
   alle im Browser — deshalb reist der `catalogue`-Zweig im Provider mit. Er
   ist klein (neun Weine, je drei Charakterworte und ein Satz) und es geht
   immer nur EINE Sprache über die Leitung, nicht alle vier. */
export function useWines() {
  const catalogue = useCommon("catalogue");
  return useMemo(() => localizeWines(catalogue), [catalogue]);
}

/* Eine vorgegebene Auswahl von Weinen in die aktive Sprache heben.

   Server-Components stellen Listen oft aus der reinen Struktur zusammen
   („diese vier Slugs, in dieser Reihenfolge") und reichen sie als Prop
   weiter. Diese Struktur trägt keinen Text — die Karten würden ohne Region
   und Charakterworte rendern. Statt jede Server-Component asynchron ans
   Wörterbuch zu hängen, holt sich die Client-Component den Text hier selbst
   über den Slug. Reihenfolge und Auswahl bleiben dabei Sache des Aufrufers. */
export function useLocalizedWines(wines) {
  const all = useWines();
  return useMemo(
    () => (wines ?? []).map((w) => all.find((l) => l.slug === w?.slug) ?? w),
    [wines, all]
  );
}

/* Formatierung und Pfadbau, schon an die aktive Sprache gebunden — damit
   Client-Components nicht jedes Mal `locale` durchreichen müssen. */
export function useLocaleTools() {
  const { locale } = useI18nContext();
  return useMemo(
    () => ({
      locale,
      href: (path) => localePath(locale, path),
      price: (value) => formatPrice(locale, value),
      list: (items) => joinList(locale, items),
      date: (iso) => formatDate(locale, iso),
      number: (value) => formatNumber(locale, value),
    }),
    [locale]
  );
}
