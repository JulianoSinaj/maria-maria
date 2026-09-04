"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MetricCard } from "../MetricCard";
import AuditEntries from "../audit/AuditEntries";
import { useAdminUser } from "../AdminUser";
import { useAdminI18n } from "../i18n/AdminI18n";
import { canManageUsers } from "@/lib/admin/roles";

/* Card 5 — what has been happening.

   The overview showed stock, revenue, origin and the inbox: four cards about
   the WEBSITE. This one is about the people who change it, and it earns its
   place on the same screen for a plain reason — with several colleagues
   signing in, "what did somebody just do?" became a question the dashboard
   could not answer at all.

   Eight entries, newest first. Anything more belongs on /admin/benutzer,
   which shows the whole tail. */

const LIMIT = 8;

export default function ActivityCard({ delay = 0, className = "" }) {
  const { t } = useAdminI18n();
  /* the full log lives on the owner-only access page; offering the link to
     someone the middleware would bounce is a promise we cannot keep */
  const owner = canManageUsers(useAdminUser()?.role);
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/api/admin/audit?limit=${LIMIT}`, { signal: ctrl.signal })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error ?? String(res.status));
        setEntries(body.data ?? []);
        setTotal(body.meta?.total ?? null);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, []);

  return (
    <MetricCard
      eyebrow={t("activity.eyebrow")}
      title={t("activity.title")}
      delay={delay}
      className={className}
      aside={
        total != null && (
          <span className="block text-[11px] tabular-nums text-a-ink/40">
            {t("activity.entries", { n: total })}
          </span>
        )
      }
    >
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-9 animate-pulse rounded-xl bg-a-ink/[0.05]"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      ) : error ? (
        <p role="alert" className="text-[12.5px] text-a-accent">
          {t("activity.loadError")}
        </p>
      ) : (
        <>
          <div className="flex-1">
            <AuditEntries entries={entries} compact />
          </div>
          {owner && entries.length > 0 && (
            <Link
              href="/admin/benutzer"
              className="mt-4 inline-block text-[11.5px] text-a-accent transition-colors hover:text-a-accent-deep"
            >
              {t("activity.viewAll")} →
            </Link>
          )}
        </>
      )}
    </MetricCard>
  );
}
