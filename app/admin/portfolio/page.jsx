"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import PageShell from "@/components/admin/PageShell";
import CategoryTabs from "@/components/admin/portfolio/CategoryTabs";
import WineTable from "@/components/admin/portfolio/WineTable";
import WineSlideOver from "@/components/admin/portfolio/WineSlideOver";
import { Search } from "@/components/admin/AdminIcons";
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

  const [panel, setPanel] = useState({ open: false, mode: "edit", item: null });
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
        flash(`„${payload.name}" angelegt.`);
      } else {
        await updateWine(panel.item.id, payload);
        flash(`„${payload.name}" gespeichert.`);
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
      flash(`„${wine.name}" archiviert.`);
      refetch();
    } catch (err) {
      flash(err.message, "error");
    }
  };

  const handleRestore = async (wine) => {
    try {
      await restoreWine(wine.id);
      flash(`„${wine.name}" wiederhergestellt.`);
      refetch();
    } catch (err) {
      flash(err.message, "error");
    }
  };

  return (
    <PageShell
      title="Weinportfolio"
      lede="Die Kollektion pflegen: Jahrgänge, Herkunft, Kontingente und Preise."
      actions={
        <motion.button
          type="button"
          onClick={() => openPanel("create")}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="rounded-full bg-gradient-to-br from-bordeaux to-wine px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory"
        >
          Wein anlegen
        </motion.button>
      }
    >
      {/* ---- filter bar ---- */}
      <div className="flex flex-col gap-4">
        <CategoryTabs value={category} onChange={setCategory} counts={meta.categories} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="relative min-w-[220px] flex-1 sm:max-w-[320px]">
            <span className="sr-only">Weine durchsuchen</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-charcoal/35" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, Herkunft oder Bezeichnung …"
              className="h-11 w-full rounded-full border border-charcoal/12 bg-ivory/70 pl-10 pr-4 text-[12.5px] text-charcoal transition-colors duration-300 placeholder:text-charcoal/35 focus:border-champagne focus:outline-none"
            />
          </label>

          <div className="flex items-center gap-4">
            <span className="text-[11.5px] text-charcoal/45 tabular-nums">
              {loading ? "lädt …" : `${meta.count ?? items.length} Weine`}
            </span>
            {meta.archived > 0 && (
              <button
                type="button"
                onClick={() => setShowArchived((v) => !v)}
                aria-pressed={showArchived}
                className={`rounded-full border px-4 py-2 text-[11.5px] transition-colors duration-300 ${
                  showArchived
                    ? "border-bordeaux/30 bg-bordeaux/10 text-bordeaux"
                    : "border-charcoal/12 text-charcoal/55 hover:border-champagne"
                }`}
              >
                Archiv ({meta.archived})
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-bordeaux/10 px-4 py-3 text-[12.5px] text-bordeaux">
          Portfolio konnte nicht geladen werden: {error.message}
        </p>
      )}

      <div className="mt-5">
        <WineTable
          items={items}
          loading={loading}
          onQuickEdit={(w) => openPanel("quick", w)}
          onEdit={(w) => openPanel("edit", w)}
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
                ? "bg-bordeaux text-ivory"
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
