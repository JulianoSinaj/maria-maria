"use client";
import { useMemo } from "react";
import Link from "next/link";
import { MetricCard, Counter } from "../MetricCard";
import { useAdminI18n } from "../i18n/AdminI18n";
import { useInquiries } from "@/lib/inquiries/useInquiries";
import { INQUIRY_STATUS } from "@/lib/inquiries/schema";
import { StatusChip, IntentDot, relativeTime } from "../anfragen/shared";

/* Card 4 — the last five inquiries.
   The one card on the overview that is live rather than seeded: it reads
   the Anfragen inbox (lib/inquiries) the /kontakt form writes to. The big
   number is what arrived in the last seven days — the question the desk
   actually asks on a Monday — and the aside counts what is still unread. */

export default function InquiriesCard({ delay = 0 }) {
  const { t, tm, intl } = useAdminI18n();
  const filters = useMemo(() => ({ limit: 5 }), []);
  const { items, meta, loading, error } = useInquiries(filters);

  const fresh = meta.byStatus?.[INQUIRY_STATUS.NEW] ?? 0;
  const fmt = (n) => Math.round(n).toLocaleString(intl);

  return (
    <MetricCard
      eyebrow={t("inquiriesCard.eyebrow")}
      title={t("inquiriesCard.title")}
      delay={delay}
      aside={
        <>
          <span className="block text-[11px] uppercase tracking-[0.12em] text-a-ink/40">
            {t("inquiriesCard.open")}
          </span>
          <span
            className={`mt-1 block font-playfair text-[17px] leading-none tabular-nums ${
              fresh > 0 ? "text-a-accent" : "text-a-ink"
            }`}
          >
            {fmt(fresh)}
          </span>
        </>
      }
    >
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <span className="flex items-baseline gap-2">
          <Counter
            value={meta.last7Days ?? 0}
            format={fmt}
            className="font-playfair text-[30px] leading-none text-a-ink"
          />
          <span className="text-[12px] text-a-ink/45">{t("inquiriesCard.week")}</span>
        </span>
        <span className="text-[11.5px] text-a-ink/45 tabular-nums">
          {t("inquiriesCard.total", { n: fmt(meta.total ?? 0) })}
        </span>
      </div>

      {error ? (
        <p role="alert" className="mt-6 rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
          {t("inquiriesCard.loadError")}
        </p>
      ) : loading && !items.length ? (
        <div className="mt-6 flex-1 space-y-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-11 animate-pulse rounded-xl bg-a-ink/[0.05]"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="mt-6 flex-1 text-[12.5px] leading-relaxed text-a-ink/50">
          {t("inquiriesCard.empty")}
        </p>
      ) : (
        <ul className="mt-6 flex-1 divide-y divide-a-ink/[0.07]">
          {items.map((i) => (
            <li key={i.id}>
              <Link
                href={`/admin/anfragen?id=${encodeURIComponent(i.id)}`}
                className="group/row flex w-full items-center gap-3.5 py-3.5 text-left transition-colors duration-300"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-a-ink/[0.08] bg-a-canvas transition-colors duration-300 group-hover/row:border-champagne">
                  <IntentDot intent={i.intent} className="h-2.5 w-2.5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span
                      className={`truncate text-[12.5px] text-a-ink/85 transition-colors duration-300 group-hover/row:text-a-accent ${
                        i.status === INQUIRY_STATUS.NEW ? "font-semibold" : ""
                      }`}
                    >
                      {i.name}
                    </span>
                    {i.company && (
                      <span className="hidden truncate text-[11px] text-a-ink/40 sm:inline">
                        {i.company}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-[10.5px] text-a-ink/40">
                    <span className="truncate">{tm("inquiryIntent", i.intent)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="shrink-0 whitespace-nowrap">{relativeTime(i.receivedAt, intl)}</span>
                  </span>
                </span>

                <StatusChip status={i.status} className="shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/admin/anfragen"
        className="mt-5 inline-flex w-fit items-center text-[11.5px] font-medium tracking-[0.04em] text-a-accent transition-colors duration-300 hover:text-a-accent-deep"
      >
        {t("inquiriesCard.all")}
      </Link>
    </MetricCard>
  );
}
