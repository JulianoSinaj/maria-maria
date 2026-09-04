"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import PageShell from "@/components/admin/PageShell";
import GroupRail from "@/components/admin/faq/GroupRail";
import QuestionList from "@/components/admin/faq/QuestionList";
import QuestionEditor from "@/components/admin/faq/QuestionEditor";
import { Search } from "@/components/admin/AdminIcons";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";
import {
  useFaq,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  renameQuestion,
  reorderQuestions,
} from "@/lib/faq/useFaq";
import { FAQ_LOCALES, STATUS } from "@/lib/faq/schema";

/* FAQ — the editor for every question the site answers.

   The list is scoped to one group at a time, because a group is a page and
   a page is what an operator has in mind ("the shipping answers on
   /kontakt"). Order, cluster and language completeness are all visible in
   the row, so the work that follows a hand-off — rewriting the shipping
   answers, filling a language — needs no second screen to find. */

export default function FaqPage() {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();

  const [group, setGroup] = useState("kontakt");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [incomplete, setIncomplete] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(search), 250);
    return () => window.clearTimeout(id);
  }, [search]);

  /* Hand-off from the header search: /admin/faq?group=kontakt&q=kontakt-
     versand opens the right group with the question already filtered out of
     it — the list search matches the id, so one parameter is enough to point
     at exactly one row. Read after mount, like the inbox reads ?id=. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("group");
    const q = params.get("q");
    if (target) setGroup(target);
    if (q) {
      setSearch(q);
      setDebounced(q);
    }
  }, []);

  const filters = useMemo(
    () => ({
      group,
      search: debounced.trim() || undefined,
      incomplete: incomplete || undefined,
    }),
    [group, debounced, incomplete],
  );

  const { items, meta, loading, error, refetch } = useFaq(filters);

  const [panel, setPanel] = useState({ open: false, mode: "edit", item: null });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [toast, setToast] = useState(null);

  const flash = useCallback((message, tone = "ok") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const active = meta.groups?.find((g) => g.key === group) ?? null;

  const openPanel = (mode, item = null) => {
    setSaveError(null);
    setPanel({ open: true, mode, item });
  };
  const closePanel = () => setPanel((p) => ({ ...p, open: false }));

  const handleSave = async (payload) => {
    setSaving(true);
    setSaveError(null);
    try {
      if (panel.mode === "create") {
        const created = await createQuestion(payload);
        flash(t("faqPage.created", { id: created.id }));
      } else {
        await updateQuestion(panel.item.id, payload);
        flash(t("faqPage.saved", { id: panel.item.id }));
      }
      closePanel();
      refetch();
    } catch (err) {
      /* keep the panel open so the editor can fix what the server rejected */
      setSaveError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRename = async (id, nextId, options) => {
    setSaveError(null);
    try {
      const renamed = await renameQuestion(id, nextId, options);
      flash(t("faqPage.renamed", { id: renamed.id }));
      setPanel((p) => ({ ...p, item: renamed }));
      refetch();
    } catch (err) {
      setSaveError(err);
      throw err;
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(t("faqPage.deleteConfirm", { id: item.id }))) return;
    try {
      await deleteQuestion(item.id);
      flash(t("faqPage.deleted", { id: item.id }));
      closePanel();
      refetch();
    } catch (err) {
      flash(err.message, "error");
    }
  };

  const handleReorder = async (subgroup, ids) => {
    try {
      await reorderQuestions(group, subgroup, ids);
      refetch();
    } catch (err) {
      flash(err.message, "error");
      refetch();
    }
  };

  return (
    <PageShell
      title={t("faqPage.title")}
      lede={t("faqPage.lede")}
      actions={
        <motion.button
          type="button"
          onClick={() => openPanel("create")}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory"
        >
          {t("faqPage.addQuestion")}
        </motion.button>
      }
    >
      {/* the store says plainly whether edits survive a restart */}
      {meta.persistence === "memory" && (
        <p className="mb-5 rounded-xl border border-a-amber/40 bg-a-amber/10 px-4 py-3 text-[12px] leading-relaxed text-a-ink/75">
          {t("faqPage.memoryWarning")}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10">
        <GroupRail groups={meta.groups ?? []} value={group} onChange={setGroup} />

        <div className="min-w-0">
          {/* ---- filters ---- */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <label className="relative min-w-[200px] flex-1 sm:max-w-[300px]">
              <span className="sr-only">{t("faqPage.searchSr")}</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-a-ink/35" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("faqPage.searchPlaceholder")}
                className="h-11 w-full rounded-full border border-a-ink/12 bg-a-surface/70 pl-10 pr-4 text-[12.5px] text-a-ink transition-colors duration-300 placeholder:text-a-ink/35 focus:border-champagne focus:outline-none"
              />
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-a-ink/40">{t("faqPage.filterGaps")}</span>
              {FAQ_LOCALES.map((locale) => {
                const on = incomplete === locale;
                return (
                  <button
                    key={locale}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setIncomplete(on ? "" : locale)}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-300 ${
                      on
                        ? "border-a-accent/40 bg-a-accent/10 text-a-accent"
                        : "border-a-ink/12 text-a-ink/50 hover:border-champagne"
                    }`}
                  >
                    {locale}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p role="alert" className="mb-4 rounded-xl bg-a-accent/10 px-4 py-3 text-[12.5px] text-a-accent">
              {t("faqPage.loadError", { message: error.message })}
            </p>
          )}

          <QuestionList
            group={active}
            items={items}
            loading={loading}
            onOpen={(record) => openPanel("edit", record)}
            onReorder={handleReorder}
          />

          {/* what the group amounts to, in one line under the list */}
          {!loading && items.length > 0 && (
            <p className="mt-5 text-[11.5px] text-a-ink/40">
              {t("faqPage.summary", {
                n: items.length,
                published: items.filter((i) => i.status === STATUS.PUBLISHED).length,
              })}
            </p>
          )}
        </div>
      </div>

      <QuestionEditor
        open={panel.open}
        mode={panel.mode}
        item={panel.item}
        group={group}
        groups={meta.groups ?? []}
        saving={saving}
        error={saveError}
        onClose={closePanel}
        onSave={handleSave}
        onDelete={handleDelete}
        onRename={handleRename}
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
