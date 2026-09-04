"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import PageShell from "@/components/admin/PageShell";
import CategoryTabs from "@/components/admin/portfolio/CategoryTabs";
import WineTable from "@/components/admin/portfolio/WineTable";
import WineSlideOver from "@/components/admin/portfolio/WineSlideOver";
import AssetConfigurator from "@/components/admin/portfolio/AssetConfigurator";
import { Search } from "@/components/admin/AdminIcons";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";
import {
  useInventory,
  createWine,
  updateWine,
  archiveWine,
  restoreWine,
} from "@/lib/inventory/useInventory";
import { CATEGORY } from "@/lib/inventory/schema";

/* Wine portfolio — the CRUD surface over the inventory API.
   Filters live in component state and are serialised into the request, so the
   server does the filtering and the tab counts always describe the same
   population the rows come from. */

export default function PortfolioPage() {
  const reduced = useReducedMotion();
  const { t } = useAdminI18n();
  const [category, setCategory] = useState(CATEGORY.ALL);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  /* Debounce the query the request is built from: typing "lugana" should cost
     one round trip, not one per keystroke. The input stays controlled by
     `search` so it never lags behind the cursor. */
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(t);
  }, [search]);

  /* Hand-off from the header search: /admin/portfolio?q=Lugana lands here
     with the box already filled. Read off the address after mount, like the
     inbox reads ?id=, so this page needs no Suspense boundary. The debounced
     value is set along with it — a hand-off should show its result at once,
     not a quarter of a second later. */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (!q) return;
    setSearch(q);
    setDebouncedSearch(q);
  }, []);

  const [panel, setPanel] = useState({ open: false, mode: "edit", item: null });
  const [assetPanel, setAssetPanel] = useState({ open: false, wine: null });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [toast, setToast] = useState(null);

  /* memoised so a fresh object literal per render doesn't refetch in a loop */
  const filters = useMemo(
    () => ({
      category: category === CATEGORY.ALL ? undefined : category,
      search: debouncedSearch.trim() || undefined,
      includeArchived: showArchived ? true : undefined,
      sort: "name",
    }),
    [category, debouncedSearch, showArchived],
  );

  const { items, meta, loading, error, refetch } = useInventory(filters);

  const flash = useCallback((message, tone = "ok") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

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
        await createWine(payload);
        flash(t("portfolio.created", { name: payload.name }));
      } else {
        await updateWine(panel.item.id, payload);
        flash(t("portfolio.saved", { name: payload.name }));
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

  const handleArchive = async (wine) => {
    try {
      await archiveWine(wine.id);
      flash(t("portfolio.archived", { name: wine.name }));
      refetch();
    } catch (err) {
      flash(err.message, "error");
    }
  };

  const handleRestore = async (wine) => {
    try {
      await restoreWine(wine.id);
      flash(t("portfolio.restored", { name: wine.name }));
      refetch();
    } catch (err) {
      flash(err.message, "error");
    }
  };

  return (
    <PageShell
      title={t("portfolio.title")}
      lede={t("portfolio.lede")}
      actions={
        <motion.button
          type="button"
          onClick={() => openPanel("create")}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory"
        >
          {t("portfolio.addWine")}
        </motion.button>
      }
    >
      {/* ---- filter bar ---- */}
      <div className="flex flex-col gap-4">
        <CategoryTabs value={category} onChange={setCategory} counts={meta.categories} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="relative min-w-[220px] flex-1 sm:max-w-[320px]">
            <span className="sr-only">{t("portfolio.searchSr")}</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-a-ink/35" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("portfolio.searchPlaceholder")}
              className="h-11 w-full rounded-full border border-a-ink/12 bg-a-surface/70 pl-10 pr-4 text-[12.5px] text-a-ink transition-colors duration-300 placeholder:text-a-ink/35 focus:border-champagne focus:outline-none"
            />
          </label>

          <div className="flex items-center gap-4">
            <span className="text-[11.5px] text-a-ink/45 tabular-nums">
              {loading
                ? t("portfolio.loading")
                : t("portfolio.count", { n: meta.count ?? items.length })}
            </span>
            {meta.archived > 0 && (
              <button
                type="button"
                onClick={() => setShowArchived((v) => !v)}
                aria-pressed={showArchived}
                className={`rounded-full border px-4 py-2 text-[11.5px] transition-colors duration-300 ${
                  showArchived
                    ? "border-a-accent/30 bg-a-accent/10 text-a-accent"
                    : "border-a-ink/12 text-a-ink/55 hover:border-champagne"
                }`}
              >
                {t("portfolio.archive", { n: meta.archived })}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-a-accent/10 px-4 py-3 text-[12.5px] text-a-accent">
          {t("portfolio.loadError", { message: error.message })}
        </p>
      )}

      <div className="mt-5">
        <WineTable
          items={items}
          loading={loading}
          onQuickEdit={(w) => openPanel("quick", w)}
          onEdit={(w) => openPanel("edit", w)}
          onAssets={(w) => setAssetPanel({ open: true, wine: w })}
          onArchive={handleArchive}
          onRestore={handleRestore}
        />
      </div>

      <WineSlideOver
        open={panel.open}
        mode={panel.mode}
        item={panel.item}
        saving={saving}
        error={saveError}
        onClose={closePanel}
        onSave={handleSave}
        /* escalate from quick edit to the full form without losing the record */
        onFull={() => setPanel((p) => ({ ...p, mode: "edit" }))}
      />

      <AssetConfigurator
        open={assetPanel.open}
        wine={assetPanel.wine}
        onClose={() => setAssetPanel((p) => ({ ...p, open: false }))}
        onSaved={(w) => flash(t("portfolio.assetsSaved", { name: w.name }))}
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
              toast.tone === "error"
                ? "bg-a-fill text-ivory"
                : "bg-espresso text-ivory"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
