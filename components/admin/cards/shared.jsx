"use client";
import { motion, useReducedMotion } from "motion/react";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Bits the four overview cards share.

   They all answer the same shape of question — a number for a window, a
   comparison with the window before it, and a list underneath — so the
   states that number can be in (still loading, failed, never measured)
   belong here rather than four times over. */

/* ------------------------------------------------------------- trend ---- */

/* Up is not automatically good and down is not automatically bad, but for
   every number on this page it happens to be: more inquiries, more clicks
   to the shop, more articles read. Vine for growth, bordeaux for decline,
   and neither shouts. */
export function TrendPill({ value, className = "" }) {
  const { t, intl } = useAdminI18n();

  if (value === null || value === undefined) {
    return (
      <span className={`text-[10.5px] uppercase tracking-[0.12em] text-a-ink/35 ${className}`}>
        {t("overview.noComparison")}
      </span>
    );
  }

  const up = value >= 0;
  const formatted = new Intl.NumberFormat(intl, {
    style: "percent",
    maximumFractionDigits: 0,
    signDisplay: "exceptZero",
  }).format(value);

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10.5px] font-semibold tabular-nums ${
        up ? "text-vine" : "text-a-accent/75"
      } ${className}`}
    >
      <span aria-hidden="true">{up ? "↑" : "↓"}</span>
      {formatted}
    </span>
  );
}

/* --------------------------------------------------------- sparkline ---- */

/* The window's shape in one line. Not a chart: no axis, no grid, no
   tooltip — it exists so a flat week and a week with one spike do not read
   as the same number. */
export function Sparkline({ series = [], tone = "#6B0F1A", className = "" }) {
  const reduced = useReducedMotion();
  if (series.length < 2) return null;

  const max = Math.max(1, ...series.map((p) => p.count));
  const w = 100;
  const h = 22;
  const step = w / (series.length - 1);
  const points = series
    .map((p, i) => `${(i * step).toFixed(2)},${(h - (p.count / max) * (h - 2) - 1).toFixed(2)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`h-[22px] w-full ${className}`}
    >
      <motion.polyline
        points={points}
        fill="none"
        stroke={tone}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.75 }}
        transition={{ type: "spring", stiffness: 45, damping: 18, delay: reduced ? 0 : 0.25 }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------ states ---- */

/** Three bars that look like the list about to replace them. */
export function CardSkeleton({ rows = 4 }) {
  return (
    <div className="mt-6 flex-1 space-y-4" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-1/2 animate-pulse rounded bg-a-ink/[0.06]" />
          <div className="h-1.5 w-full animate-pulse rounded-full bg-a-ink/[0.05]" />
        </div>
      ))}
    </div>
  );
}

export function CardError({ children }) {
  const { t } = useAdminI18n();
  return (
    <p role="alert" className="mt-6 rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
      {children ?? t("overview.loadError")}
    </p>
  );
}

/** Nothing to show — and which kind of nothing it is. */
export function CardEmpty({ children }) {
  return (
    <p className="mt-6 flex-1 text-[12.5px] leading-relaxed text-a-ink/50">{children}</p>
  );
}

/* -------------------------------------------------------------- rows ---- */

/** One labelled bar: name on the left, count on the right, meter beneath. */
export function BarRow({ label, sub, count, share, tone, delay = 0, dim = false, children }) {
  const { fmtNum } = useAdminI18n();
  const reduced = useReducedMotion();

  return (
    <li>
      <div className="flex items-baseline justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2.5">
          {children}
          <span className="min-w-0">
            <span
              className={`block truncate text-[12.5px] font-medium ${
                dim ? "text-a-ink/55" : "text-a-ink/85"
              }`}
            >
              {label}
            </span>
            {sub && (
              <span className="mt-0.5 block truncate text-[10.5px] tracking-[0.04em] text-a-ink/40">
                {sub}
              </span>
            )}
          </span>
        </span>
        <span
          className={`shrink-0 text-[12px] tabular-nums ${
            count > 0 ? "text-a-ink/70" : "text-a-ink/30"
          }`}
        >
          {fmtNum(count)}
        </span>
      </div>
      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-a-ink/[0.07]">
        <span className="block h-full" style={{ width: `${Math.round(share * 100)}%` }}>
          <motion.span
            className="block h-full rounded-full will-transform"
            style={{ background: tone, transformOrigin: "left" }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: "spring", stiffness: 70, damping: 20, delay: reduced ? 0 : delay }}
          />
        </span>
      </span>
    </li>
  );
}

/* ------------------------------------------------------- persistence ---- */

/* Where the disk is not ours, the counters live in memory and start again
   at the next cold start. Better said out loud on the card than discovered
   when a number goes backwards. */
export function MemoryNote({ mode }) {
  const { t } = useAdminI18n();
  if (mode !== "memory") return null;
  return (
    <p className="mt-4 rounded-xl border border-a-gold/25 bg-a-gold/[0.07] px-3.5 py-2.5 text-[10.5px] leading-relaxed text-a-ink/60">
      {t("overview.memoryOnly")}
    </p>
  );
}
