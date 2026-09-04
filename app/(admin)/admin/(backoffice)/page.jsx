"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import PageShell from "@/components/admin/PageShell";
import InquiryIntentCard from "@/components/admin/cards/InquiryIntentCard";
import InquiriesCard from "@/components/admin/cards/InquiriesCard";
import ShopClicksCard from "@/components/admin/cards/ShopClicksCard";
import AudienceCard from "@/components/admin/cards/AudienceCard";
import ContentStatusCard from "@/components/admin/cards/ContentStatusCard";
import ActivityCard from "@/components/admin/cards/ActivityCard";
import { MemoryNote } from "@/components/admin/cards/shared";
import { useOverview, windowLabel, WINDOWS, DEFAULT_WINDOW } from "@/components/admin/analyticsData";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";

/* Übersicht.

   Rebuilt in September 2026. It used to lead with four cards of invented
   sales figures — bottles sold, revenue by wine type, an order book —
   under a line that admitted they were Beispieldaten. They described a shop
   this site does not run: customers buy at Terra Vera, and revenue, orders
   and allocation are Terra Vera's numbers now.

   What stands here instead is measured, and each card names where its
   number comes from:

     Anliegen   the /kontakt inbox                  lib/inquiries
     Eingang    the same inbox, most recent first   lib/inquiries
     Klicks     the pass-through to Terra Vera      /api/out/shop
     Publikum   reads and languages                 /api/beacon
     Inhalt     drafts, translations, dead links    lib/insights

   One request feeds every card but the inbox list, so four numbers about
   one week cannot disagree about which week that is. */

function WindowSwitch({ days, onChange }) {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();

  return (
    <div
      role="group"
      aria-label={t("overview.windowAria")}
      className="flex items-center gap-1 rounded-full border border-a-ink/[0.1] bg-a-surface/70 p-1"
    >
      {WINDOWS.map((value) => {
        const active = value === days;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={active}
            className="relative rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-[0.04em] transition-colors duration-300"
          >
            {active && (
              <motion.span
                layoutId="mm-overview-window"
                className="absolute inset-0 rounded-full bg-a-fill"
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
              />
            )}
            <span className={`relative ${active ? "text-ivory" : "text-a-ink/55"}`}>
              {t("overview.windowDays", { n: value })}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function AdminOverviewPage() {
  const { t, intl } = useAdminI18n();
  const [days, setDays] = useState(DEFAULT_WINDOW);
  const { data, meta, loading, error, checkLinks, checking } = useOverview({ days });

  return (
    <PageShell
      title={t("overview.title")}
      lede={t("overview.lede")}
      actions={<WindowSwitch days={days} onChange={setDays} />}
    >
      <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-a-accent/50">
          {t("overview.window", {
            range: windowLabel(data?.window, intl),
            week: data?.window?.week ?? "",
          })}
        </p>
        {data?.traffic?.firstDay && (
          <p className="text-[11px] tracking-[0.04em] text-a-ink/35">
            {t("overview.since", { day: data.traffic.firstDay })}
          </p>
        )}
      </div>

      <MemoryNote mode={meta?.persistence} />

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <InquiryIntentCard
          inquiries={data?.inquiries}
          window={data?.window}
          loading={loading}
          error={error}
          delay={0}
        />
        <InquiriesCard delay={0.08} />
        <ShopClicksCard
          traffic={data?.traffic}
          window={data?.window}
          loading={loading}
          error={error}
          delay={0.16}
        />
        <AudienceCard
          traffic={data?.traffic}
          interviews={data?.content?.interviews}
          window={data?.window}
          loading={loading}
          error={error}
          delay={0.24}
        />
        <ContentStatusCard
          content={data?.content}
          links={data?.links}
          loading={loading}
          error={error}
          onCheckLinks={checkLinks}
          checking={checking}
          delay={0.32}
        />
        {/* Who changed what, and when. Full width: a log is a column of
            sentences, and two columns of them read like two conversations at
            once. Its numbers are the only ones on this page that describe the
            people rather than the visitors. */}
        <ActivityCard delay={0.4} className="xl:col-span-2" />
      </div>
    </PageShell>
  );
}
