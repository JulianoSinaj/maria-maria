"use client";
import { MetricCard, Counter, Meter } from "../MetricCard";
import { ALLOCATION, ALLOCATION_TOTALS } from "../analyticsData";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Card 1 — inventory & allocation.
   Reads as remaining-out-of-batch because that is the decision the number
   drives: how much of a limited edition is still sellable. */

export default function AllocationCard({ delay = 0 }) {
  const { t, tm, fmtNum } = useAdminI18n();
  const { batch, remaining } = ALLOCATION_TOTALS;
  const pct = batch ? Math.round((remaining / batch) * 100) : 0;

  return (
    <MetricCard
      eyebrow={t("allocation.eyebrow")}
      title={t("allocation.title")}
      delay={delay}
      aside={
        <>
          <span className="block font-playfair text-[20px] leading-none text-a-ink tabular-nums">
            {pct}%
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-a-ink/40">
            {t("allocation.free")}
          </span>
        </>
      }
    >
      <div className="flex items-baseline gap-2">
        <Counter
          value={remaining}
          format={(n) => fmtNum(Math.round(n))}
          className="font-playfair text-[38px] leading-none text-a-ink"
        />
        <span className="text-[13px] text-a-ink/45">
          {t("allocation.ofBottles", { n: fmtNum(batch) })}
        </span>
      </div>

      <ul className="mt-7 flex flex-1 flex-col justify-end gap-6">
        {ALLOCATION.map((a, i) => (
          <li key={a.name}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-[12.5px] font-medium text-a-ink/85">
                {a.name}
              </span>
              <span className="shrink-0 text-[11px] tracking-[0.04em] text-a-ink/45 tabular-nums">
                {fmtNum(a.remaining)} / {fmtNum(a.batch)}
              </span>
            </div>
            <Meter
              value={a.remaining / a.batch}
              tone={a.short === "Amphore" ? "#8A5A3B" : "#6B0F1A"}
              delay={0.2 + i * 0.12}
              className="mt-2.5"
            />
            <div className="mt-2 flex items-baseline justify-between gap-3">
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-a-ink/40">
                {tm("vessel", a.vessel)}
              </span>
              <span
                className={`text-[10.5px] font-semibold tabular-nums ${
                  a.pct <= 25 ? "text-a-accent/75" : "text-a-ink/40"
                }`}
              >
                {t("allocation.pctFree", { pct: a.pct })}
                {a.pct <= 25 && t("allocation.scarce")}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* committed vs. free, so the headline number has a counterpart */}
      <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-a-ink/[0.07] bg-a-ink/[0.06]">
        <div className="bg-a-canvas/80 px-4 py-3.5">
          <dt className="text-[10px] uppercase tracking-[0.14em] text-a-ink/40">
            {t("allocation.committed")}
          </dt>
          <dd className="mt-1 font-playfair text-[17px] leading-none text-a-ink tabular-nums">
            {fmtNum(batch - remaining)}
          </dd>
        </div>
        <div className="bg-a-canvas/80 px-4 py-3.5">
          <dt className="text-[10px] uppercase tracking-[0.14em] text-a-ink/40">
            {t("allocation.editions")}
          </dt>
          <dd className="mt-1 font-playfair text-[17px] leading-none text-a-ink tabular-nums">
            {ALLOCATION.length}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-[10.5px] leading-relaxed text-a-ink/40">
        {t("allocation.note")}
      </p>
    </MetricCard>
  );
}
