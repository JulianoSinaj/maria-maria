"use client";
import { MetricCard, Counter, Meter } from "../MetricCard";
import { ALLOCATION, ALLOCATION_TOTALS, fmtNum } from "../analyticsData";

/* Card 1 — inventory & allocation.
   Reads as remaining-out-of-batch because that is the decision the number
   drives: how much of a limited edition is still sellable. */

export default function AllocationCard({ delay = 0 }) {
  const { batch, remaining } = ALLOCATION_TOTALS;
  const pct = batch ? Math.round((remaining / batch) * 100) : 0;

  return (
    <MetricCard
      eyebrow="Bestand & Kontingent"
      title="Verfügbare Flaschen"
      delay={delay}
      aside={
        <>
          <span className="block font-playfair text-[20px] leading-none text-charcoal tabular-nums">
            {pct}%
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-charcoal/40">
            frei
          </span>
        </>
      }
    >
      <div className="flex items-baseline gap-2">
        <Counter
          value={remaining}
          className="font-playfair text-[38px] leading-none text-charcoal"
        />
        <span className="text-[13px] text-charcoal/45">
          von {fmtNum(batch)} Flaschen
        </span>
      </div>

      <ul className="mt-7 flex flex-1 flex-col justify-end gap-6">
        {ALLOCATION.map((a, i) => (
          <li key={a.name}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-[12.5px] font-medium text-charcoal/85">
                {a.name}
              </span>
              <span className="shrink-0 text-[11px] tracking-[0.04em] text-charcoal/45 tabular-nums">
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
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-charcoal/40">
                {a.vessel}
              </span>
              <span
                className={`text-[10.5px] font-semibold tabular-nums ${
                  a.pct <= 25 ? "text-bordeaux/75" : "text-charcoal/40"
                }`}
              >
                {a.pct}% frei
                {a.pct <= 25 && " · knapp"}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* committed vs. free, so the headline number has a counterpart */}
      <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-charcoal/[0.07] bg-charcoal/[0.06]">
        <div className="bg-cream/80 px-4 py-3.5">
          <dt className="text-[10px] uppercase tracking-[0.14em] text-charcoal/40">Zugeteilt</dt>
          <dd className="mt-1 font-playfair text-[17px] leading-none text-charcoal tabular-nums">
            {fmtNum(batch - remaining)}
          </dd>
        </div>
        <div className="bg-cream/80 px-4 py-3.5">
          <dt className="text-[10px] uppercase tracking-[0.14em] text-charcoal/40">Editionen</dt>
          <dd className="mt-1 font-playfair text-[17px] leading-none text-charcoal tabular-nums">
            {ALLOCATION.length}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-[10.5px] leading-relaxed text-charcoal/40">
        Nur limitierte Editionen mit veröffentlichter Auflage werden gegen ein
        Kontingent geführt — die übrigen Weine kommen aus laufender Produktion.
      </p>
    </MetricCard>
  );
}
