/* Die vier Sprachen der Storefront — eine einzige Quelle der Wahrheit.

   Deutsch ist die Ausgangssprache UND die Default-Locale: Die Seite ist seit
   2019 unter deutschen URLs indexiert (/shop, /unsere-weine/lugana …). Ein
   Umzug auf /de/shop hätte jede dieser URLs weitergeleitet und das Ranking
   zurückgesetzt. Deutsch bleibt deshalb ohne Präfix an der Wurzel, die drei
   weiteren Sprachen bekommen eines: /it/shop, /en/shop, /cs/shop.

   `htmlLang` ist die Region-Variante fürs <html lang>-Attribut, `hreflang`
   die neutrale Sprachform für die Alternates (Google will dort keine Region,
   solange es nur eine Variante pro Sprache gibt), `ogLocale` das
   Unterstrich-Format, das OpenGraph verlangt. */

export const DEFAULT_LOCALE = "de";

export const LOCALES = ["de", "it", "en", "cs"];

export const LOCALE_META = {
  de: {
    label: "Deutsch",
    /* Eigenbezeichnung — im Sprachumschalter steht jede Sprache so da, wie
       ihre Sprecher sie schreiben. Wer die Seite auf Tschechisch sucht,
       erkennt „Čeština" auch dann, wenn er kein Wort Deutsch liest. */
    native: "Deutsch",
    short: "DE",
    htmlLang: "de-DE",
    /* Sprache-Region statt nur Sprache (Homepage-Brief §2: de-DE, it-IT,
       en-US, cs-CZ). Trägt auch `inLanguage` im JSON-LD. */
    hreflang: "de-DE",
    ogLocale: "de_DE",
  },
  it: {
    label: "Italienisch",
    native: "Italiano",
    short: "IT",
    htmlLang: "it-IT",
    hreflang: "it-IT",
    ogLocale: "it_IT",
  },
  en: {
    label: "Englisch",
    native: "English",
    short: "EN",
    htmlLang: "en",
    hreflang: "en-US",
    ogLocale: "en_US",
  },
  cs: {
    label: "Tschechisch",
    native: "Čeština",
    short: "CS",
    htmlLang: "cs-CZ",
    hreflang: "cs-CZ",
    ogLocale: "cs_CZ",
  },
};

export const isLocale = (value) => LOCALES.includes(value);

/* Fällt ein unbekannter Wert herein (manipulierte URL, alter Cookie),
   antwortet die Seite auf Deutsch statt zu werfen. */
export const toLocale = (value) => (isLocale(value) ? value : DEFAULT_LOCALE);
