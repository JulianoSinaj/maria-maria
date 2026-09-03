"use client";
import { MetricCard, Counter } from "../MetricCard";
import { ORDERS, ORDER_SUMMARY } from "../analyticsData";
import { Orders as OrdersIcon } from "../AdminIcons";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Card 4 — recent orders & inquiries.
   Orders and inquiries share one stream because that is how the desk works
   them: both are things awaiting a reply. The kind is carried by the status
   chip's tone, so the two never get confused. */

const CHIP = {
  versandbereit: "bg-vine/12 text-vine",
  versandt: "bg-a-ink/[0.07] text-a-ink/50",
  bezahlt: "bg-vine/12 text-vine",
  "in Bearbeitung": "bg-champagne/25 text-a-gold",
};
const INQUIRY_CHIP = "bg-a-accent/10 text-a-accent/80";

export default function OrdersCard({ delay = 0 }) {
  const { t, tm, fmtEurExact } = useAdminI18n();

  return (
    <MetricCard
      eyebrow={t("ordersCard.eyebrow")}
      title={t("ordersCard.title")}
      delay={delay}
      aside={
        <>
          <span className="block text-[11px] uppercase tracking-[0.12em] text-a-ink/40">
            {t("ordersCard.open")}
          </span>
          <span className="mt-1 block font-playfair text-[17px] leading-none text-a-ink tabular-nums">
            {ORDER_SUMMARY.open + ORDER_SUMMARY.inquiries}
          </span>
        </>
      }
    >
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <span className="flex items-baseline gap-2">
          <Counter
            value={ORDER_SUMMARY.value}
            format={(n) => fmtEurExact(n)}
            className="font-playfair text-[30px] leading-none text-a-ink"
          />
          <span className="text-[12px] text-a-ink/45">{t("ordersCard.orderValue")}</span>
        </span>
        <span className="text-[11.5px] text-a-ink/45 tabular-nums">
          {t("ordersCard.summary", {
            orders: ORDER_SUMMARY.open,
            inquiries: ORDER_SUMMARY.inquiries,
          })}
        </span>
      </div>

      <ul className="mt-6 flex-1 divide-y divide-a-ink/[0.07]">
        {ORDERS.map((o) => (
          <li key={o.ref}>
            <button
              type="button"
              className="group/row flex w-full items-center gap-3.5 py-3.5 text-left transition-colors duration-300"
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition-colors duration-300 ${
                  o.kind === "inquiry"
                    ? "border-a-accent/15 bg-a-accent/[0.06] text-a-accent/70"
                    : "border-a-ink/[0.08] bg-a-canvas text-a-ink/55"
                } group-hover/row:border-champagne`}
              >
                {o.kind === "inquiry" ? (
                  <span className="text-[13px] leading-none">?</span>
                ) : (
                  <OrdersIcon className="h-[15px] w-[15px]" />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="shrink-0 text-[11px] font-semibold tracking-[0.06em] text-a-ink/40 tabular-nums">
                    {o.ref}
                  </span>
                  <span className="truncate text-[12.5px] text-a-ink/85 transition-colors duration-300 group-hover/row:text-a-accent">
                    {o.who}
                  </span>
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] ${
                      o.kind === "inquiry" ? INQUIRY_CHIP : CHIP[o.status] ?? INQUIRY_CHIP
                    }`}
                  >
                    {tm("orderStatus", o.status)}
                  </span>
                  <span className="text-[10.5px] text-a-ink/35">{tm("when", o.when)}</span>
                </span>
              </span>

              <span className="shrink-0 text-right">
                {o.total != null ? (
                  <>
                    <span className="block text-[12px] font-medium text-a-ink/80 tabular-nums">
                      {fmtEurExact(o.total)}
                    </span>
                    <span className="mt-0.5 block text-[10.5px] text-a-ink/35 tabular-nums">
                      {t("ordersCard.bottlesShort", { n: o.items })}
                    </span>
                  </>
                ) : (
                  <span className="block text-[11px] text-a-ink/35">{t("ordersCard.pending")}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </MetricCard>
  );
}
