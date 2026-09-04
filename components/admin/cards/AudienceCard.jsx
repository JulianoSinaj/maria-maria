"use client";
import { MetricCard, Counter } from "../MetricCard";
import { useAdminI18n } from "../i18n/AdminI18n";
import { readRows, languageRows, trend, measuringSince } from "../analyticsData";
import { TrendPill, CardSkeleton, CardError, CardEmpty, BarRow } from "./shared";

/* Card 3 — who reads, and in which language.

   Two counts in one frame because they answer one question. The magazine
   is a product of this site now, not a garnish, and the four languages are
   an investment that until today nobody could see the return on: the site
   has spoken Italian, English and Czech for weeks without anyone being
   able to say whether a single person read a page in Czech.

   A READ is not an open: the storefront reports it only once the foot of
   the article has genuinely been on screen (components/insights/ReadBeacon).
   Interviews with no reads stay listed — a published article nobody
   finishes is the more useful piece of news. */

export default function AudienceCard({ traffic, interviews, window, loading, error, delay = 0 }) {
  const { t, fmtNum, intl } = useAdminI18n();

  const reads = readRows(traffic, interviews ?? []);
  const languages = languageRows(traffic);
  const totalReads = traffic?.reads?.total ?? 0;
  const totalViews = traffic?.pageviews?.total ?? 0;
  const change = trend(totalReads, traffic?.reads?.previous);
  const since = measuringSince(traffic);

  const pct = (n) =>
    new Intl.NumberFormat(intl, { style: "percent", maximumFractionDigits: 0 }).format(n);

  return (
    <MetricCard
      eyebrow={t("audienceCard.eyebrow")}
      title={t("audienceCard.title")}
      delay={delay}
      aside={
        <>
          <span className="block text-[11px] uppercase tracking-[0.12em] text-a-ink/40">
            {t("audienceCard.pageviews")}
          </span>
          <span className="mt-1 block font-playfair text-[17px] leading-none text-a-ink tabular-nums">
            {fmtNum(totalViews)}
          </span>
        </>
      }
    >
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <span className="flex items-baseline gap-2">
          <Counter
            value={totalReads}
            format={(n) => fmtNum(Math.round(n))}
            className="font-playfair text-[38px] leading-none text-a-ink"
          />
          <span className="text-[13px] text-a-ink/45">
            {t("audienceCard.readsIn", { days: window?.days ?? 7 })}
          </span>
        </span>
        <TrendPill value={change} />
      </div>

      {error ? (
        <CardError />
      ) : loading && !traffic ? (
        <CardSkeleton rows={5} />
      ) : (
        <>
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-a-accent/50">
            {t("audienceCard.interviews")}
          </p>
          {reads.length === 0 ? (
            <CardEmpty>{t("audienceCard.noInterviews")}</CardEmpty>
          ) : (
            <ul className="mt-3.5 flex flex-col gap-3.5">
              {reads.map((r, i) => (
                <BarRow
                  key={r.slug}
                  label={r.title}
                  count={r.count}
                  share={r.share}
                  tone="#C8B77A"
                  delay={0.18 + i * 0.08}
                  dim={r.count === 0}
                />
              ))}
            </ul>
          )}

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-a-accent/50">
            {t("audienceCard.languages")}
          </p>
          {totalViews === 0 ? (
            <CardEmpty>
              {since ? t("audienceCard.quiet") : t("audienceCard.notYetMeasured")}
            </CardEmpty>
          ) : (
            <ul className="mt-3.5 flex flex-1 flex-col justify-end gap-3.5">
              {languages.map((l, i) => (
                <BarRow
                  key={l.locale}
                  label={l.label}
                  sub={totalViews ? pct(l.count / totalViews) : null}
                  count={l.count}
                  share={l.share}
                  tone={l.locale === "de" ? "#6B0F1A" : "#45B3A2"}
                  delay={0.24 + i * 0.07}
                  dim={l.count === 0}
                >
                  <span className="w-[22px] shrink-0 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-a-ink/35">
                    {l.short}
                  </span>
                </BarRow>
              ))}
            </ul>
          )}
        </>
      )}
    </MetricCard>
  );
}
