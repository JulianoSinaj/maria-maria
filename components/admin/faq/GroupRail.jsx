"use client";
import { motion, useReducedMotion } from "motion/react";
import { useAdminI18n } from "../i18n/AdminI18n";

/* The FAQ, grouped by the page it appears on — seven storefront pages and
   the nine wines. Mirrors the storefront's own index column
   (components/faq/FaqSection.jsx): a scrollable row on phones, a column
   from lg up, with one shared indicator that springs between entries.

   Each row carries what the operator needs before opening it: how many
   questions, how many are still drafts, and how many languages are short. */

const SPRING = { type: "spring", stiffness: 320, damping: 30 };

export default function GroupRail({ groups = [], value, onChange }) {
  const { t, tm } = useAdminI18n();
  const reduced = useReducedMotion();

  const pages = groups.filter((g) => g.kind === "page");
  const wines = groups.filter((g) => g.kind === "wine");

  const Row = ({ group }) => {
    const active = group.key === value;
    const gaps = Object.values(group.missing ?? {}).reduce((n, v) => n + v, 0);

    return (
      <li className="shrink-0 snap-start lg:shrink">
        <button
          type="button"
          aria-pressed={active}
          onClick={() => onChange(group.key)}
          className={`group relative flex min-h-[44px] w-full items-center justify-between gap-3 overflow-hidden rounded-full border px-4 py-2 text-left transition-colors duration-300 lg:rounded-2xl lg:px-4 lg:py-2.5 ${
            active
              ? "border-champagne/60 bg-a-surface shadow-luxe"
              : "border-a-ink/10 bg-a-surface/40 hover:border-champagne/60"
          }`}
        >
          {active && (
            <motion.span
              layoutId="faq-group-indicator"
              aria-hidden="true"
              className="absolute inset-y-2 left-0 hidden w-[3px] rounded-full bg-a-fill lg:block"
              transition={reduced ? { duration: 0 } : SPRING}
            />
          )}

          <span className="min-w-0 lg:pl-1.5">
            <span
              className={`block truncate text-[12.5px] ${
                active ? "font-medium text-a-accent" : "text-a-ink/70"
              }`}
            >
              {group.name ?? tm("faqGroups", group.key)}
            </span>
            <span className="hidden truncate text-[10.5px] text-a-ink/35 lg:block">
              {group.path}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-1.5">
            {group.drafts > 0 && (
              <span
                title={t("faqPage.rail.drafts", { n: group.drafts })}
                className="rounded-full bg-a-ink/[0.07] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-a-ink/55"
              >
                {group.drafts}
              </span>
            )}
            {gaps > 0 && (
              <span
                title={t("faqPage.rail.gaps", { n: gaps })}
                aria-label={t("faqPage.rail.gaps", { n: gaps })}
                className="h-1.5 w-1.5 rounded-full bg-a-amber"
              />
            )}
            <span
              className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[10.5px] tabular-nums ${
                active ? "bg-a-accent/10 text-a-accent" : "bg-a-ink/[0.05] text-a-ink/50"
              }`}
            >
              {group.count}
            </span>
          </span>
        </button>
      </li>
    );
  };

  return (
    <nav aria-label={t("faqPage.rail.aria")} className="lg:sticky lg:top-28 lg:self-start">
      <ul
        data-lenis-prevent-horizontal
        className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] lg:mx-0 lg:flex-col lg:gap-1.5 lg:px-0 lg:[mask-image:none]"
      >
        {pages.map((group) => (
          <Row key={group.key} group={group} />
        ))}

        <li className="hidden lg:mt-4 lg:mb-1 lg:block">
          <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-a-accent/45">
            {t("faqPage.rail.wines")}
          </p>
        </li>

        {wines.map((group) => (
          <Row key={group.key} group={group} />
        ))}
      </ul>
    </nav>
  );
}
