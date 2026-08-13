/* Sprachabhängige Formatierung.

   Vorher steckten zwei deutsche Annahmen fest im Katalog (components/data.js):
   `fmtPrice` schrieb das Komma als Dezimaltrenner hart in den String, und
   `tasteWords` zerlegte die Charakterworte, indem es den Fließtext am Wort
   „und" aufschnitt. Beides bricht, sobald eine zweite Sprache dazukommt —
   „Intense, powerful and balanced" enthält kein „und".

   Deshalb: Charakterworte liegen in den Wörterbüchern als Liste vor, und der
   Fließtext entsteht hier. Nicht umgekehrt.

   Bewusst ohne Intl.NumberFormat: Preise werden schon beim Server-Render in
   den HTML-Stream geschrieben und danach im Browser rehydriert. Weicht die
   ICU-Datenbank von Node auch nur im Leerzeichen vom Browser ab, meldet React
   einen Hydration-Mismatch. Vier Regeln, die wir selbst kontrollieren, sind
   hier verlässlicher als eine Bibliothek, die auf beiden Seiten identisch
   sein muss. Für Deutsch ist die Ausgabe zeichengleich mit vorher. */

import { DEFAULT_LOCALE } from "./config";

const PRICE = {
  /* Deutsch, Italienisch, Tschechisch: Dezimalkomma, Symbol hinten mit
     schmalem Abstand. Englisch: Dezimalpunkt, Symbol vorn ohne Abstand. */
  de: (n) => `${n.toFixed(2).replace(".", ",")} €`,
  it: (n) => `${n.toFixed(2).replace(".", ",")} €`,
  cs: (n) => `${n.toFixed(2).replace(".", ",")} €`,
  en: (n) => `€${n.toFixed(2)}`,
};

export function formatPrice(locale, value) {
  const fmt = PRICE[locale] || PRICE[DEFAULT_LOCALE];
  return fmt(Number(value) || 0);
}

/* Tausendertrennzeichen. Die Auflagenzahlen im Shop („18.000 Flaschen")
   standen vorher als fertiger String im Code — mit deutschem Punkt, der im
   Englischen als Dezimaltrenner gelesen wird: „18.000 bottles" heißt dort
   achtzehn, nicht achtzehntausend. */
const THOUSANDS = { de: ".", it: ".", en: ",", cs: " " };

export function formatNumber(locale, value) {
  const sep = THOUSANDS[locale] ?? THOUSANDS[DEFAULT_LOCALE];
  return String(Math.round(Number(value) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

/* Die Konjunktion vor dem letzten Listenglied. */
const AND = { de: "und", it: "e", en: "and", cs: "a" };

/* ["intensiv", "kraftvoll", "ausgewogen"] → "Intensiv, kraftvoll und ausgewogen"
   Ein einzelnes Wort bleibt ein Wort, zwei werden nur verbunden. */
export function joinList(locale, items = []) {
  const words = items.filter(Boolean);
  if (!words.length) return "";
  const and = AND[locale] || AND[DEFAULT_LOCALE];
  const sentence =
    words.length === 1
      ? words[0]
      : `${words.slice(0, -1).join(", ")} ${and} ${words[words.length - 1]}`;
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

/* Datumsangaben im Magazin. Auch hier feste Muster statt Intl — dieselbe
   Hydration-Überlegung, und die Monatsnamen sind ohnehin Redaktionstext. */
const MONTHS = {
  de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  cs: ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"],
};

/* ISO-String rein, Anzeigedatum raus. Englisch stellt den Monat voran,
   Tschechisch verlangt den Genitiv (deshalb „ledna" statt „leden" oben). */
export function formatDate(locale, iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const months = MONTHS[locale] || MONTHS[DEFAULT_LOCALE];
  const day = d.getUTCDate();
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  if (locale === "en") return `${month} ${day}, ${year}`;
  if (locale === "cs") return `${day}. ${month} ${year}`;
  return `${day}. ${month} ${year}`;
}
