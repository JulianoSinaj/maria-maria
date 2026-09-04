"use client";
import { MetricCard, Counter } from "../MetricCard";
import { useAdminI18n } from "../i18n/AdminI18n";
import { shopClickRows, trend, measuringSince } from "../analyticsData";
import { TrendPill, Sparkline, CardSkeleton, CardError, CardEmpty, BarRow } from "./shared";

/* Card 2 — the clicks that leave for Terra Vera.

   Since the hand-off this is the closest thing the site has to a sale, and
   until now it was the one thing nobody counted: the links went straight
   out of the house. They now pass through /api/out/shop, which tallies and
   redirects — see lib/shop/config.js for why that is a redirect and not a
   tag manager.

   The aside is the ratio that turns a bare count into a judgement: clicks
   per hundred page opens. A hundred clicks off ten thousand visits and a
   hundred off three hundred are the same number and opposite news. */

export default function ShopClicksCard({ traffic, window, loading, error, delay = 0 }) {
  const { t, fmtNum, intl } = useAdminI18n();

  const rows = shopClickRows(traffic);
  const total = traffic?.shopClicks?.total ?? 0;
  const views = traffic?.pageviews?.total ?? 0;
  const change = trend(total, traffic?.shopClicks?.previous);
  const since = measuringSince(traffic);

  const per100 = views > 0 ? (total / views) * 100 : null;
  const wines = rows.filter((r) => !r.generic);
  const generic = rows.filter((r) => r.generic);

  return (
    <MetricCard
      eyebrow={t("clicksCard.eyebrow")}
      title={t("clicksCard.title")}
      delay={delay}
      aside={
        <>
          <span className="block text-[11px] uppercase tracking-[0.12em] text-a-ink/40">
            {t("clicksCard.per100")}
          </span>
          <span className="mt-1 block font-playfair text-[17px] leading-none text-a-ink tabular-nums">
            {per100 === null
              ? "—"
              : new Intl.NumberFormat(intl, { maximumFractionDigits: 1 }).format(per100)}
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
            {t("clicksCard.inWindow", { days: window?.days ?? 7 })}
          </span>
        </span>
        <TrendPill value={change} />
      </div>

      <Sparkline series={traffic?.shopClicks?.series ?? []} tone="#6B0F1A" className="mt-4" />

      {error ? (
        <CardError />
      ) : loading && !traffic ? (
        <CardSkeleton rows={4} />
      ) : total === 0 ? (
        <CardEmpty>
          {since ? t("clicksCard.quiet") : t("clicksCard.notYetMeasured")}
        </CardEmpty>
      ) : (
        <>
          <ul className="mt-6 flex flex-1 flex-col justify-end gap-3.5">
            {wines.map((r, i) => (
              <BarRow
                key={r.key}
                label={r.name ?? r.key}
                count={r.count}
                share={r.share}
                tone={r.tone}
                delay={0.18 + i * 0.06}
                dim={r.count === 0}
              />
            ))}
          </ul>

          {generic.length > 0 && (
            <ul className="mt-5 flex flex-col gap-3.5 border-t border-a-ink/[0.07] pt-5">
              {generic.map((r, i) => (
                <BarRow
                  key={r.key}
                  label={t(`clicksCard.${r.key}`)}
                  sub={t("clicksCard.noBottle")}
                  count={r.count}
                  share={r.share}
                  tone="#8A5A3B"
                  delay={0.3 + i * 0.06}
                  dim
                />
              ))}
            </ul>
          )}
        </>
      )}
    </MetricCard>
  );
}
