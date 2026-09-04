"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useAdminI18n } from "../i18n/AdminI18n";

/* One shape for the log, wherever it is shown: eight lines on the overview,
   the whole tail on /admin/benutzer.

   Each line answers the three questions in the order they get asked — WHAT
   happened, to WHAT, by WHOM — and holds the fourth (what it looked like
   before) folded away underneath, because "before and after" is what you need
   in the one case out of twenty where something went wrong, and noise in the
   nineteen others.

   Entries are rendered exactly as the log stored them. Nothing is recomputed
   here: a log that reinterprets itself at read time is not a log. */

const RELATIVE = [
  [60, 1, "second"],
  [3600, 60, "minute"],
  [86400, 3600, "hour"],
  [604800, 86400, "day"],
  [2629800, 604800, "week"],
  [31557600, 2629800, "month"],
  [Infinity, 31557600, "year"],
];

/* "vor 4 Minuten" / "4 minutes ago" / "4 minuti fa" — from the admin
   language, not from the server's locale: the reader chose one. */
function relative(iso, intl) {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const seconds = (then - Date.now()) / 1000;
  const abs = Math.abs(seconds);
  const [, divisor, unit] = RELATIVE.find(([limit]) => abs < limit) ?? RELATIVE.at(-1);
  return new Intl.RelativeTimeFormat(intl, { numeric: "auto" }).format(
    Math.round(seconds / divisor),
    unit,
  );
}

const exact = (iso, intl) => {
  try {
    return new Intl.DateTimeFormat(intl, { dateStyle: "medium", timeStyle: "short" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
};

/* An action's family decides its colour: access in the accent, content in the
   ink, so a page of entries can be skimmed for "who got in" without reading. */
const tone = (action) =>
  action.startsWith("auth.") || action.startsWith("user.") || action.startsWith("password.")
    ? "bg-a-accent/70"
    : "bg-champagne";

function Value({ children }) {
  if (children === null || children === undefined || children === "") {
    return <span className="italic text-a-ink/35">—</span>;
  }
  return <span className="break-words text-a-ink/70">{String(children)}</span>;
}

export default function AuditEntries({ entries = [], compact = false }) {
  const { t, tm, intl } = useAdminI18n();
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState(null);

  if (!entries.length) {
    return (
      <p className="py-6 text-[12.5px] text-a-ink/45">{t("activity.empty")}</p>
    );
  }

  return (
    <ul className="divide-y divide-a-ink/[0.07]">
      {entries.map((entry) => {
        const changes = entry.changes ? Object.entries(entry.changes) : [];
        const open = openId === entry.id;

        return (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : entry.id)}
              aria-expanded={changes.length ? open : undefined}
              disabled={!changes.length}
              className={`group/row flex w-full items-start gap-3 py-3 text-left ${
                changes.length ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${tone(entry.action)}`}
              />

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[12.5px] font-medium text-a-ink/85">
                    {tm("auditAction", entry.action)}
                  </span>
                  {entry.target && (
                    <span className="min-w-0 truncate text-[12px] text-a-ink/50">
                      {entry.target}
                    </span>
                  )}
                </span>

                <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10.5px] text-a-ink/40">
                  <span>
                    {t("activity.by")}{" "}
                    <span className="text-a-ink/60">{entry.actor?.name || t("audit.system")}</span>
                  </span>
                  {entry.actor?.via && <span>· {tm("via", entry.actor.via)}</span>}
                  {!compact && entry.summary && <span className="basis-full">{entry.summary}</span>}
                </span>
              </span>

              <time
                dateTime={entry.at}
                title={exact(entry.at, intl)}
                className="shrink-0 pt-0.5 text-[10.5px] tabular-nums text-a-ink/35"
              >
                {relative(entry.at, intl)}
              </time>
            </button>

            <AnimatePresence initial={false}>
              {open && changes.length > 0 && (
                <motion.div
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  className="overflow-hidden"
                >
                  <dl className="mb-3 ml-[18px] space-y-2 rounded-xl border border-a-ink/[0.07] bg-a-canvas/60 px-4 py-3 text-[11.5px]">
                    {changes.map(([field, { from, to }]) => (
                      <div key={field}>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-a-accent/55">
                          {field}
                        </dt>
                        <dd className="mt-1 grid gap-1 sm:grid-cols-2">
                          <span className="rounded-lg bg-a-ink/[0.04] px-2.5 py-1.5">
                            <span className="mr-1.5 text-[9.5px] uppercase tracking-[0.1em] text-a-ink/35">
                              {t("audit.before")}
                            </span>
                            <Value>{from}</Value>
                          </span>
                          <span className="rounded-lg bg-champagne/[0.18] px-2.5 py-1.5">
                            <span className="mr-1.5 text-[9.5px] uppercase tracking-[0.1em] text-a-ink/35">
                              {t("audit.after")}
                            </span>
                            <Value>{to}</Value>
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
