"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import PageShell from "@/components/admin/PageShell";
import { Magazine, Plus, ExternalLink, Trash } from "@/components/admin/AdminIcons";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";
import { useInterviewList, deleteInterview, publishInterview, unpublishInterview } from "@/lib/interviews/useInterviews";
import { INTERVIEW_LOCALES } from "@/lib/interviews/schema";
import NewInterviewDialog from "@/components/admin/magazin/NewInterviewDialog";

/* Magazine — the list of every interview the site knows, code-shipped and
   editorial. One row per slug: status, which languages are complete, the
   linked wine, and the actions that don't need the full editor (preview,
   publish/withdraw). Opening a row goes to /admin/magazin/<slug> — the
   full-page editor, because an interview is a long article and a slide-over
   would just be a cramped copy of the page underneath it. */

const DOT = {
  complete: "bg-vine",
  partial: "bg-a-gold",
  missing: "bg-a-ink/15",
};

function LocaleDots({ completeness = {} }) {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {INTERVIEW_LOCALES.map((l) => (
        <span
          key={l}
          title={l.toUpperCase()}
          className={`h-1.5 w-1.5 rounded-full ${DOT[completeness[l]] ?? DOT.missing}`}
        />
      ))}
    </span>
  );
}

const STATUS_CHIP = {
  published: "bg-vine/12 text-vine",
  draft: "bg-a-ink/[0.07] text-a-ink/50",
};

export default function MagazinPage() {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();
  const { rows, meta, loading, error, refetch } = useInterviewList();
  const [busy, setBusy] = useState(null);
  const [toast, setToast] = useState(null);
  const [newOpen, setNewOpen] = useState(false);

  const flash = (message, tone = "ok") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  };

  const sorted = useMemo(
    () => [...rows].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")),
    [rows],
  );

  const togglePublish = async (row) => {
    setBusy(row.slug);
    try {
      if (row.status === "published") {
        await unpublishInterview(row.slug);
        flash(t("magazine.list.withdrawn", { name: row.name || row.slug }));
      } else {
        await publishInterview(row.slug);
        flash(t("magazine.list.published", { name: row.name || row.slug }));
      }
      refetch();
    } catch (err) {
      flash(err.details?.length ? err.details.join(" · ") : err.message, "error");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (row) => {
    if (row.source === "code") {
      flash(t("magazine.list.codeLocked"), "error");
      return;
    }
    setBusy(row.slug);
    try {
      await deleteInterview(row.slug);
      flash(t("magazine.list.deleted", { name: row.name || row.slug }));
      refetch();
    } catch (err) {
      flash(err.message, "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <PageShell
      title={t("magazine.title")}
      lede={t("magazine.lede")}
      actions={
        <motion.button
          type="button"
          onClick={() => setNewOpen(true)}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("magazine.new")}
        </motion.button>
      }
    >
      <p className="mb-5 flex flex-wrap items-center gap-4 text-[11.5px] text-a-ink/45">
        <span>{t("magazine.count", { n: meta.count ?? rows.length })}</span>
        <span aria-hidden="true">·</span>
        <span>{t("magazine.publishedCount", { n: meta.published ?? 0 })}</span>
        <span aria-hidden="true">·</span>
        <span>{t("magazine.draftCount", { n: meta.drafts ?? 0 })}</span>
      </p>

      {error && (
        <p role="alert" className="mb-5 rounded-xl bg-a-accent/10 px-4 py-3 text-[12.5px] text-a-accent">
          {t("magazine.loadError", { message: error.message })}
        </p>
      )}

      {loading && !rows.length ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-a-ink/[0.05]" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-card-lg border border-dashed border-a-ink/15 bg-a-surface/40 px-8 py-14 text-center">
          <Magazine className="mx-auto h-8 w-8 text-a-ink/25" />
          <p className="mt-4 font-playfair text-[19px] text-a-ink">{t("magazine.emptyTitle")}</p>
          <p className="mx-auto mt-2 max-w-[38ch] text-[12.5px] leading-relaxed text-a-ink/50">
            {t("magazine.emptyBody")}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {sorted.map((row) => (
              <motion.li
                key={row.slug}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="overflow-hidden rounded-2xl border border-a-ink/[0.08] bg-a-surface/60"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-a-canvas">
                    {row.portrait ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={row.portrait} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-a-ink/20">
                        <Magazine className="h-6 w-6" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/magazin/${row.slug}`}
                        className="truncate font-playfair text-[16px] text-a-ink transition-colors hover:text-a-accent"
                      >
                        {row.name || row.slug}
                      </Link>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] ${STATUS_CHIP[row.status]}`}>
                        {t(`magazine.status.${row.status}`)}
                      </span>
                      {row.source === "code" && (
                        <span className="shrink-0 rounded-full bg-a-ink/[0.06] px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-a-ink/45">
                          {t("magazine.list.sourceCode")}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-[12px] text-a-ink/50">{row.headline || "—"}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[10.5px] text-a-ink/40">
                      <span className="font-mono">/{row.slug}</span>
                      {row.wine && <span>{t("magazine.list.wine", { slug: row.wine })}</span>}
                      <LocaleDots completeness={row.completeness} />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <a
                      href={`/api/admin/interviews/${row.slug}/preview?locale=de`}
                      target="_blank"
                      rel="noreferrer"
                      title={t("magazine.list.preview")}
                      className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[11px] text-a-ink/55 transition-colors hover:bg-a-ink/[0.06] hover:text-a-ink"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t("magazine.list.preview")}
                    </a>
                    <Link
                      href={`/admin/magazin/${row.slug}`}
                      className="flex h-9 items-center rounded-lg px-2.5 text-[11px] text-a-ink/55 transition-colors hover:bg-a-ink/[0.06] hover:text-a-ink"
                    >
                      {t("magazine.list.edit")}
                    </Link>
                    <button
                      type="button"
                      disabled={busy === row.slug}
                      onClick={() => togglePublish(row)}
                      className={`h-9 rounded-lg px-2.5 text-[11px] font-medium transition-colors disabled:opacity-40 ${
                        row.status === "published"
                          ? "text-a-ink/55 hover:bg-a-ink/[0.06] hover:text-a-ink"
                          : "text-a-accent/80 hover:bg-a-accent/10 hover:text-a-accent"
                      }`}
                    >
                      {row.status === "published" ? t("magazine.list.withdraw") : t("magazine.list.publish")}
                    </button>
                    <button
                      type="button"
                      disabled={busy === row.slug || row.source === "code"}
                      title={row.source === "code" ? t("magazine.list.codeLocked") : t("magazine.list.delete")}
                      onClick={() => remove(row)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-a-ink/40 transition-colors hover:bg-a-accent/10 hover:text-a-accent disabled:opacity-30"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <NewInterviewDialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreated={(record) => {
          setNewOpen(false);
          refetch();
          flash(t("magazine.list.created", { name: record.slug }));
        }}
      />

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
