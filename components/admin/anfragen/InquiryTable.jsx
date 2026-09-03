"use client";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronRight } from "@/components/Icons";
import { INQUIRY_STATUS } from "@/lib/inquiries/schema";
import { useAdminI18n } from "../i18n/AdminI18n";
import { StatusChip, IntentTag, LanguageTag, relativeTime, absoluteTime } from "./shared";

/* The inbox list — newest first, one row per message.
   A real <table> so it stays semantic and keyboard/screen-reader navigable;
   the horizontal scroll lives on a wrapper so the page body never scrolls
   sideways. The whole row is a click target for the mouse; the trailing
   button is the same action for the keyboard. Unread ("neu") rows carry a
   heavier name, the way a mail client marks what still needs eyes. */

const th = "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-a-ink/45";
const td = "px-4 py-3.5 align-middle";

export default function InquiryTable({ items, loading, activeId, filtered, onOpen }) {
  const reduced = useReducedMotion();
  const { t, intl } = useAdminI18n();

  if (loading && !items.length) {
    return (
      <div className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/50 p-8">
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-a-ink/[0.05]"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
        <span className="sr-only">{t("inquiriesPage.loading")}</span>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-card-lg border border-dashed border-a-ink/15 bg-a-surface/40 px-8 py-14 text-center">
        <p className="font-playfair text-[19px] text-a-ink">
          {filtered ? t("inquiriesPage.emptyTitle") : t("inquiriesPage.emptyInbox")}
        </p>
        <p className="mx-auto mt-2 max-w-[44ch] text-[12.5px] leading-relaxed text-a-ink/55">
          {filtered ? t("inquiriesPage.emptyBody") : t("inquiriesPage.emptyInboxBody")}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card-lg border border-a-ink/[0.08] bg-a-surface/60">
      {/* the scroll lives here, so the page body never moves sideways */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse">
          <caption className="sr-only">{t("inquiriesPage.caption")}</caption>
          <thead>
            <tr className="border-b border-a-ink/[0.08]">
              <th scope="col" className={th}>{t("inquiriesPage.colIntent")}</th>
              <th scope="col" className={th}>{t("inquiriesPage.colName")}</th>
              <th scope="col" className={th}>{t("inquiriesPage.colCompany")}</th>
              <th scope="col" className={th}>{t("inquiriesPage.colDate")}</th>
              <th scope="col" className={th}>{t("inquiriesPage.colStatus")}</th>
              <th scope="col" className={`${th} text-right`}>
                <span className="sr-only">{t("inquiriesPage.colOpen")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {items.map((i, idx) => {
                const active = i.id === activeId;
                const unread = i.status === INQUIRY_STATUS.NEW;
                return (
                  <motion.tr
                    key={i.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 28,
                      delay: reduced ? 0 : Math.min(idx * 0.025, 0.2),
                    }}
                    onClick={() => onOpen(i)}
                    aria-selected={active || undefined}
                    className={`group cursor-pointer border-b border-a-ink/[0.05] transition-colors duration-300 last:border-0 ${
                      active ? "bg-champagne/[0.14]" : "hover:bg-champagne/[0.07]"
                    }`}
                  >
                    <td className={td}>
                      <IntentTag intent={i.intent} className="max-w-[220px]" />
                    </td>

                    <td className={td}>
                      <span className="block max-w-[260px]">
                        <span
                          className={`block truncate text-[13px] text-a-ink ${
                            unread ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {i.name}
                        </span>
                        <span className="block truncate text-[10.5px] text-a-ink/40">{i.email}</span>
                      </span>
                    </td>

                    <td className={td}>
                      <span className="block max-w-[240px]">
                        <span className="block truncate text-[12.5px] text-a-ink/75">
                          {i.company || t("inquiriesPage.noCompany")}
                        </span>
                        {i.city && (
                          <span className="block truncate text-[10.5px] text-a-ink/40">{i.city}</span>
                        )}
                      </span>
                    </td>

                    <td className={td}>
                      <span className="flex items-center gap-2.5">
                        <span className="min-w-0">
                          <span className="block whitespace-nowrap text-[12.5px] text-a-ink/75 tabular-nums">
                            {absoluteTime(i.receivedAt, intl)}
                          </span>
                          <span className="block whitespace-nowrap text-[10.5px] text-a-ink/40">
                            {relativeTime(i.receivedAt, intl)}
                          </span>
                        </span>
                        <LanguageTag language={i.language} />
                      </span>
                    </td>

                    <td className={td}>
                      <span className="flex flex-col items-start gap-1">
                        <StatusChip status={i.status} />
                        {i.delivery === "failed" && (
                          <span className="text-[9.5px] uppercase tracking-[0.1em] text-a-accent/70">
                            {t("inquiriesPage.deliveryFailed")}
                          </span>
                        )}
                      </span>
                    </td>

                    <td className={`${td} text-right`}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen(i);
                        }}
                        aria-label={`${t("inquiriesPage.open")}: ${i.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-a-ink/12 text-a-ink/60 transition-colors duration-300 hover:border-champagne hover:text-a-accent group-hover:border-champagne/70"
                      >
                        <ChevronRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
