/* Wie der Shop-Zustand eines Weins aussieht — einmal, für Tabelle und
   Slide-over.

   Beide zeigen dasselbe: einen Punkt in einer Farbe, einen Satz dazu und
   ggf. eine Warnung. Stünde das zweimal im Code, hätte spätestens die
   nächste Änderung zwei Wahrheiten darüber erzeugt, was „nicht gefunden"
   rot macht und was nur gelb ist.

   Reine Funktionen, kein React: sie werden in beiden Komponenten während
   des Renderns aufgerufen. */

import { SHOP_SYNC, shopOf, shopPriceDrift, shopWarning } from "@/lib/inventory/schema";

/* Die Farbe folgt dem Gewicht, nicht dem Zustand:

     rot     — der Kaufweg ist kaputt (404). Das ist der einzige Fall, in
               dem ein Besucher auf eine tote Seite klickt.
     bernstein — etwas stimmt nicht, aber der Link funktioniert:
               Preisabweichung, ausverkauft, Abgleich fehlgeschlagen.
     grün    — abgeglichen und stimmig.
     grau    — noch nie abgeglichen; keine Aussage, keine Warnung. */
export const SHOP_TONE = {
  missing: {
    dot: "bg-a-accent",
    chip: "bg-a-accent/10 text-a-accent",
    text: "text-a-accent",
  },
  error: {
    dot: "bg-a-amber",
    chip: "bg-champagne/25 text-a-amber",
    text: "text-a-amber",
  },
  unavailable: {
    dot: "bg-a-amber",
    chip: "bg-champagne/25 text-a-amber",
    text: "text-a-amber",
  },
  drift: {
    dot: "bg-a-gold",
    chip: "bg-champagne/25 text-a-gold",
    text: "text-a-gold",
  },
  ok: {
    dot: "bg-vine",
    chip: "bg-vine/12 text-vine",
    text: "text-vine",
  },
  never: {
    dot: "bg-a-ink/25",
    chip: "bg-a-ink/[0.06] text-a-ink/50",
    text: "text-a-ink/45",
  },
};

/**
 * Der Shop-Zustand eines Weins, fertig zum Anzeigen.
 *
 * @returns {{shop: object, handle: string|null, warning: string|null,
 *            tone: object, statusKey: string, drift: number|null,
 *            synced: boolean}}
 */
export function shopState(item) {
  const shop = shopOf(item);
  const warning = shopWarning(item);
  const synced = shop.sync === SHOP_SYNC.OK;

  /* Ohne Handle gibt es nichts zu melden — der Wein verlinkt dann auf die
     Sammelseite, was eine Rückfallebene ist und kein Fehler. */
  const key = !shop.handle ? "never" : (warning ?? (synced ? "ok" : "never"));

  return {
    shop,
    handle: shop.handle,
    warning,
    tone: SHOP_TONE[key] ?? SHOP_TONE.never,
    statusKey: shop.sync,
    drift: shopPriceDrift(item),
    synced,
  };
}

/* „vor 3 Std." statt eines Zeitstempels, in der Sprache des Backoffice.

   Intl.RelativeTimeFormat kann das in allen drei Sprachen, ohne dass für
   „gestern" und „vorgestern" Wörter im Wörterbuch stehen müssten. Die
   Einheit wird von oben gewählt: Wer heute Morgen abgeglichen hat, will
   „vor 4 Std." lesen und nicht „vor 240 Min.". */
const UNITS = [
  ["year", 365 * 24 * 60 * 60_000],
  ["month", 30 * 24 * 60 * 60_000],
  ["day", 24 * 60 * 60_000],
  ["hour", 60 * 60_000],
  ["minute", 60_000],
];

export function relativeTime(iso, intl, justNow) {
  if (!iso) return null;
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return null;

  const diff = then - Date.now();
  const abs = Math.abs(diff);

  /* Unter einer Minute ist jede Zahl gelogen — dort steht ein Wort. */
  if (abs < 60_000) return justNow;

  const format = new Intl.RelativeTimeFormat(intl, { numeric: "auto" });
  for (const [unit, ms] of UNITS) {
    if (abs >= ms) return format.format(Math.round(diff / ms), unit);
  }
  return justNow;
}
