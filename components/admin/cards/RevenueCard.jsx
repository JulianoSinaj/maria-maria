"use client";
import { MetricCard, Counter, Meter } from "../MetricCard";
import { REVENUE } from "../analyticsData";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Card 2 — revenue by wine type.
   Share bars rather than a pie: four series compared against each other read
   faster as aligned lengths, and it degrades gracefully to one column. */

export default function RevenueCard({ delay = 0 }) {
  const { t, tm, fmtEur, fmtNum } = useAdminI18n();

  return (
    <MetricCard
      eyebrow={t("revenue.eyebrow")}
      title={t("revenue.title")}
      delay={delay}
      aside={
        <>
          <span className="block text-[11px] uppercase tracking-[0.12em] text-a-ink/40">
            {t("revenue.bottles")}
          </span>
          <span className="mt-1 block font-playfair text-[17px] leading-none text-a-ink tabular-nums">
            {fmtNum(REVENUE.bottles)}
          </span>
        </>
      }
    >
      <Counter
        value={REVENUE.total}
        format={(n) => fmtEur(n)}
        className="font-playfair text-[38px] leading-none text-a-ink"
      />

      <ul className="mt-7 flex flex-1 flex-col justify-end gap-4">
        {REVENUE.rows.map((r, i) => (
          <li key={r.key}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: r.tone }}
                />
                <span className="truncate text-[12.5px] font-medium text-a-ink/85">
                  {tm("wineType", r.label)}
                </span>
              </span>
              <span className="shrink-0 text-[11.5px] text-a-ink/50 tabular-nums">
                {fmtEur(r.revenue)}
                <span className="ml-2 text-a-ink/35">
                  {Math.round(r.share * 100)}%
                </span>
              </span>
            </div>
            <Meter value={r.share} tone={r.tone} delay={0.18 + i * 0.1} className="mt-2" />
          </li>
        ))}
      </ul>

      <p className="mt-6 border-t border-a-ink/[0.07] pt-4 text-[10.5px] leading-relaxed text-a-ink/40">
        {t("revenue.note")}
      </p>
    </MetricCard>
  );
}
