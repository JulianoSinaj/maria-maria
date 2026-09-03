"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import PageShell from "@/components/admin/PageShell";
import InquiryTable from "@/components/admin/anfragen/InquiryTable";
import InquiryPanel from "@/components/admin/anfragen/InquiryPanel";
import { IntentDot } from "@/components/admin/anfragen/shared";
import { Search } from "@/components/admin/AdminIcons";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";
import {
  useInquiries,
  getInquiry,
  updateInquiry,
  csvUrl,
} from "@/lib/inquiries/useInquiries";
import { INQUIRY_INTENTS, INQUIRY_STATUSES } from "@/lib/inquiries/schema";

/* Anfragen — the contact inbox.
   Every message sent through /kontakt, newest first, filtered by the six
   intents and the four desk statuses. Filters live in component state and
   are serialised into the request, so the server does the filtering and
   the pill counts always describe the whole inbox. */

const pill = (active) =>
  `inline-flex min-h-[36px] items-center gap-2 rounded-full border px-3.5 text-[11.5px] transition-colors duration-300 ${
    active
      ? "border-a-accent/30 bg-a-accent/10 text-a-accent"
      : "border-a-ink/12 text-a-ink/55 hover:border-champagne hover:text-a-ink"
  }`;

const Count = ({ n }) => (
  <span className="rounded-full bg-a-ink/[0.06] px-1.5 py-0.5 text-[10px] tabular-nums text-a-ink/50">
    {n ?? 0}
  </span>
);

export default function AnfragenPage() {
  const reduced = useReducedMotion();
  const { t, tm } = useAdminI18n();

  const [intent, setIntent] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  /* one round trip per pause in typing, not one per keystroke */
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const h = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(h);
  }, [search]);

  const filters = useMemo(
    () => ({
      intent: intent || undefined,
      status: status || undefined,
      search: debouncedSearch.trim() || undefined,
    }),
    [intent, status, debouncedSearch],
  );
  const filtered = Boolean(intent || status || debouncedSearch.trim());

  const { items, meta, loading, error, refetch } = useInquiries(filters);

  const [panel, setPanel] = useState({ open: false, item: null });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  /* deep link from the overview card: /admin/anfragen?id=anf-… — read off
     the address after mount so the page needs no Suspense boundary */
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;
    getInquiry(id)
      .then((item) => {
        if (item) setPanel({ open: true, item });
      })
      .catch(() => {});
  }, []);

  const flash = useCallback((message, tone = "ok") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const openItem = useCallback((item) => setPanel({ open: true, item }), []);
  const closePanel = useCallback(() => setPanel((p) => ({ ...p, open: false })), []);

  const handlePatch = async (id, patch) => {
    setBusy(true);
    try {
      const updated = await updateInquiry(id, patch);
      /* keep the open panel on the fresh record, then let the list catch up */
      setPanel((p) => (p.item?.id === id ? { ...p, item: updated } : p));
      refetch();
      flash(
        patch.status !== undefined
          ? t("inquiriesPage.statusSaved", { status: tm("inquiryStatus", updated.status) })
          : t("inquiriesPage.notesSaved"),
      );
      return updated;
    } catch (err) {
      flash(t("inquiriesPage.updateFailed", { message: err.message }), "error");
      throw err;
    } finally {
      setBusy(false);
    }
  };

  const countLabel = loading
    ? t("inquiriesPage.loading")
    : (meta.count ?? items.length) === 1
      ? t("inquiriesPage.countOne")
      : t("inquiriesPage.count", { n: meta.count ?? items.length });

  return (
    <PageShell
      title={t("inquiriesPage.title")}
      lede={t("inquiriesPage.lede")}
      actions={
        <motion.a
          href={csvUrl(filters)}
          download
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="inline-flex min-h-[40px] items-center rounded-full border border-a-ink/12 bg-a-surface/70 px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-a-ink transition-colors duration-300 hover:border-champagne hover:text-a-accent"
        >
          {t("inquiriesPage.export")}
        </motion.a>
      }
    >
      {meta.persistence === "memory" && (
        <p
          role="note"
          className="mb-5 rounded-xl border border-champagne/50 bg-champagne/15 px-4 py-3 text-[12px] leading-relaxed text-a-gold"
        >
          {t("inquiriesPage.memoryNote")}
        </p>
      )}

      {/* ---- filter bar ---- */}
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("inquiriesPage.colIntent")}>
          <button type="button" onClick={() => setIntent("")} aria-pressed={!intent} className={pill(!intent)}>
            {t("inquiriesPage.allIntents")}
            <Count n={meta.total} />
          </button>
          {INQUIRY_INTENTS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setIntent(intent === key ? "" : key)}
              aria-pressed={intent === key}
              className={pill(intent === key)}
            >
              <IntentDot intent={key} />
              {tm("inquiryIntent", key)}
              <Count n={meta.byIntent?.[key]} />
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("inquiriesPage.colStatus")}>
            <button type="button" onClick={() => setStatus("")} aria-pressed={!status} className={pill(!status)}>
              {t("inquiriesPage.allStatuses")}
            </button>
            {INQUIRY_STATUSES.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatus(status === key ? "" : key)}
                aria-pressed={status === key}
                className={pill(status === key)}
              >
                {tm("inquiryStatus", key)}
                <Count n={meta.byStatus?.[key]} />
              </button>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <label className="relative min-w-[220px] flex-1 sm:max-w-[320px]">
              <span className="sr-only">{t("inquiriesPage.searchSr")}</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-a-ink/35" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("inquiriesPage.searchPlaceholder")}
                className="h-11 w-full rounded-full border border-a-ink/12 bg-a-surface/70 pl-10 pr-4 text-[12.5px] text-a-ink transition-colors duration-300 placeholder:text-a-ink/35 focus:border-champagne focus:outline-none"
              />
            </label>
            <span className="shrink-0 text-[11.5px] text-a-ink/45 tabular-nums">{countLabel}</span>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-a-accent/10 px-4 py-3 text-[12.5px] text-a-accent">
          {t("inquiriesPage.loadError", { message: error.message })}
        </p>
      )}

      <div className="mt-5">
        <InquiryTable
          items={items}
          loading={loading}
          activeId={panel.open ? panel.item?.id : null}
          filtered={filtered}
          onOpen={openItem}
        />
      </div>

      <InquiryPanel
        open={panel.open}
        item={panel.item}
        busy={busy}
        onClose={closePanel}
        onPatch={handlePatch}
      />

      {/* ---- toast ---- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={`fixed bottom-6 left-1/2 z-[95] -translate-x-1/2 rounded-full px-6 py-3.5 text-[12.5px] shadow-glass ${
              toast.tone === "error" ? "bg-a-fill text-ivory" : "bg-espresso text-ivory"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
