"use client";
import { INQUIRY_STATUS } from "@/lib/inquiries/schema";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Bits the inquiry table, the detail panel and the overview card share, so
   an intent or a status looks the same wherever it appears. Labels come
   from the admin dictionary keyed on the schema's enum VALUES — the schema
   stays untouched. */

export const STATUS_CHIP = {
  [INQUIRY_STATUS.NEW]: "bg-a-accent/10 text-a-accent",
  [INQUIRY_STATUS.IN_PROGRESS]: "bg-champagne/30 text-a-gold",
  [INQUIRY_STATUS.ANSWERED]: "bg-vine/12 text-vine",
  [INQUIRY_STATUS.REJECTED]: "bg-a-ink/[0.07] text-a-ink/45",
};

/* One hue per intent for the leading dot — scanning a list by colour is
   faster than reading six similar labels. Bordeaux for the trade the house
   lives from, vine for resale, champagne for celebrations, acqua for
   tastings, amber for bespoke selections; "other" stays neutral. */
export const INTENT_TONE = {
  gastronomie_feinkost: "#6B0F1A",
  handel_wiederverkauf: "#55683F",
  event_feier: "#C8B77A",
  verkostung: "#45B3A2",
  individuelle_auswahl: "#8A5A3B",
};

/* ------------------------------------------------------------- time ---- */

const UNITS = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** "vor 2 Stunden" / "2 ore fa" / "yesterday" — in the admin language. */
export function relativeTime(iso, intl, now = Date.now()) {
  const diff = (Date.parse(iso) - now) / 1000;
  if (Number.isNaN(diff)) return "";
  const rtf = new Intl.RelativeTimeFormat(intl, { numeric: "auto" });
  const abs = Math.abs(diff);
  for (const [unit, secs] of UNITS) {
    if (abs >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return rtf.format(0, "second");
}

/** "3. Sept. 2026, 14:07" — the exact stamp, for the record. */
export function absoluteTime(iso, intl) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(intl, { dateStyle: "medium", timeStyle: "short" }).format(d);
}

/* ------------------------------------------------------------ chips ---- */

export function StatusChip({ status, className = "" }) {
  const { tm } = useAdminI18n();
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] ${
        STATUS_CHIP[status] ?? STATUS_CHIP[INQUIRY_STATUS.REJECTED]
      } ${className}`}
    >
      {tm("inquiryStatus", status)}
    </span>
  );
}

export function IntentDot({ intent, className = "" }) {
  const tone = INTENT_TONE[intent];
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${tone ? "" : "bg-a-ink/30"} ${className}`}
      style={tone ? { background: tone } : undefined}
    />
  );
}

export function IntentTag({ intent, className = "" }) {
  const { tm } = useAdminI18n();
  return (
    <span className={`inline-flex items-center gap-2 text-[12px] text-a-ink/75 ${className}`}>
      <IntentDot intent={intent} />
      <span className="truncate">{tm("inquiryIntent", intent)}</span>
    </span>
  );
}

/** Two-letter code with the full language name for assistive tech. */
export function LanguageTag({ language, className = "" }) {
  const { tm } = useAdminI18n();
  if (!language) return null;
  return (
    <span
      title={tm("inquiryLanguage", language)}
      aria-label={tm("inquiryLanguage", language)}
      className={`inline-flex items-center rounded-md border border-a-ink/12 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-a-ink/50 ${className}`}
    >
      {language}
    </span>
  );
}
