"use client";
import { motion, useReducedMotion } from "motion/react";
import { CATEGORIES } from "@/lib/inventory/schema";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Category tabs. The active indicator is one shared layoutId element that
   springs between tabs — same treatment as the sidebar rail, so selection
   reads consistently across the admin.

   Counts come from the list response's meta, so a badge can never disagree
   with the rows the tab actually shows. Labels come from the admin
   dictionary keyed on the schema's category key. */

export default function CategoryTabs({ value, onChange, counts = {} }) {
  const reduced = useReducedMotion();
  const { t } = useAdminI18n();

  return (
    <div
      role="tablist"
      aria-label={t("portfolio.tabsAria")}
      className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
    >
      {CATEGORIES.map((cat) => {
        const active = value === cat.key;
        const count = counts[cat.key];
        return (
          <button
            key={cat.key}
            role="tab"
            type="button"
            aria-selected={active}
            title={t(`category.${cat.key}.hint`)}
            onClick={() => onChange(cat.key)}
            className={`group relative shrink-0 rounded-full px-4 py-2.5 text-left transition-colors duration-300 ${
              active ? "text-ivory" : "text-a-ink/60 hover:text-a-accent"
            }`}
          >
            {active && (
              <motion.span
                layoutId="portfolio-tab-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                transition={
                  reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32 }
                }
              />
            )}
            {!active && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-a-ink/12 transition-colors duration-300 group-hover:border-champagne"
              />
            )}
            <span className="relative z-10 flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-[12.5px] font-medium tracking-[0.02em]">
                {t(`category.${cat.key}.label`)}
              </span>
              {count != null && (
                <span
                  className={`text-[10.5px] tabular-nums ${
                    active ? "text-ivory/65" : "text-a-ink/35"
                  }`}
                >
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
