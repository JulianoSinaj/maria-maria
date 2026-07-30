"use client";
import { MetricCard, Counter, Meter } from "../MetricCard";
import { REGIONS, fmtEur, fmtNum, fmtPct } from "../analyticsData";

/* Card 3 — regional performance.
   Indexed against the strongest region rather than against total revenue, so
   the comparison stays legible when one region dominates. Sub-zones (Salento,
   Sirmione) sit as detail lines — they are appellations inside a region, not
   peers of it. */

export default function RegionCard({ delay = 0 }) {
  const top = REGIONS[0];

  return (
    <MetricCard
      eyebrow="Regionen"
      title="Herkunft & Leistung"
      delay={delay}
      aside={
        <>
          <span className="block text-[11px] uppercase tracking-[0.12em] text-charcoal/40">
            Stärkste
          </span>
          <span className="mt-1 block font-playfair text-[17px] leading-none text-charcoal">
            {top?.region}
          </span>
        </>
      }
    >
      <div className="flex items-baseline gap-2">
        <Counter
          value={REGIONS.length}
          className="font-playfair text-[38px] leading-none text-charcoal"
        />
        <span className="text-[13px] text-charcoal/45">Anbaugebiete aktiv</span>
      </div>

      <ul className="mt-7 flex flex-1 flex-col justify-end gap-5">
        {REGIONS.map((r, i) => (
          <li key={r.region}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0">
                <span className="block truncate text-[12.5px] font-medium text-charcoal/85">
                  {r.region}
                </span>
                <span className="mt-0.5 block truncate text-[10.5px] tracking-[0.06em] text-charcoal/40">
                  {r.detail}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-[11.5px] text-charcoal/55 tabular-nums">
                  {fmtEur(r.revenue)}
                </span>
                <span
                  className={`mt-0.5 block text-[10.5px] font-semibold tabular-nums ${
                    r.trend >= 0 ? "text-vine" : "text-bordeaux/70"
                  }`}
                >
                  {fmtPct(r.trend)}
                </span>
              </span>
            </div>
            <Meter
              value={r.index}
              tone={r.trend >= 0 ? "#55683F" : "#8A2B2F"}
              delay={0.18 + i * 0.09}
              className="mt-2.5"
            />
            <p className="mt-2 text-[10.5px] text-charcoal/35 tabular-nums">
              {fmtNum(r.bottles)} Flaschen · {r.wines.length}{" "}
              {r.wines.length === 1 ? "Wein" : "Weine"}
            </p>
          </li>
        ))}
      </ul>
    </MetricCard>
  );
}
