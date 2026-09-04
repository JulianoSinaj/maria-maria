"use client";
import { MetricCard, Counter } from "../MetricCard";
import { useAdminI18n } from "../i18n/AdminI18n";
import { INTENT_TONE, IntentDot } from "../anfragen/shared";
import { intentRows, trend } from "../analyticsData";
import { TrendPill, CardSkeleton, CardError, CardEmpty, BarRow } from "./shared";

/* Card 1 — what the week asked for.

   The inbox card next to it says how many and from whom; this one says
   what KIND, which is the question that changes a working day: three
   Gastronomie inquiries and three Sonstiges are the same number and not
   the same week.

   Intents with a count of nought stay in the list. "No trade inquiries
   this week" is an answer, and a row that disappears when it reaches zero
   makes it impossible to see that it did. */

export default function InquiryIntentCard({ inquiries, window, loading, error, delay = 0 }) {
  const { t, tm, fmtNum } = useAdminI18n();

  const rows = intentRows(inquiries);
  const total = inquiries?.total ?? 0;
  const change = trend(total, inquiries?.previous);
  const counted = rows.some((r) => r.count > 0);

  return (
    <MetricCard
      eyebrow={t("intentCard.eyebrow")}
      title={t("intentCard.title")}
      delay={delay}
      aside={
        <>
          <span className="block text-[11px] uppercase tracking-[0.12em] text-a-ink/40">
            {t("intentCard.inbox")}
          </span>
          <span className="mt-1 block font-playfair text-[17px] leading-none text-a-ink tabular-nums">
            {fmtNum(inquiries?.inbox ?? 0)}
          </span>
        </>
      }
    >
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <span className="flex items-baseline gap-2">
          <Counter
            value={total}
            format={(n) => fmtNum(Math.round(n))}
            className="font-playfair text-[38px] leading-none text-a-ink"
          />
          <span className="text-[13px] text-a-ink/45">
            {t("intentCard.inWindow", { days: window?.days ?? 7 })}
          </span>
        </span>
        <TrendPill value={change} />
      </div>

      {error ? (
        <CardError />
      ) : loading && !inquiries ? (
        <CardSkeleton rows={4} />
      ) : !counted ? (
        <CardEmpty>{t("intentCard.empty")}</CardEmpty>
      ) : (
        <ul className="mt-7 flex flex-1 flex-col justify-end gap-4">
          {rows.map((r, i) => (
            <BarRow
              key={r.intent}
              label={tm("inquiryIntent", r.intent)}
              count={r.count}
              share={r.share}
              tone={INTENT_TONE[r.intent] ?? "#7A6B63"}
              delay={0.18 + i * 0.08}
              dim={r.count === 0}
            >
              <IntentDot intent={r.intent} />
            </BarRow>
          ))}
        </ul>
      )}
    </MetricCard>
  );
}
