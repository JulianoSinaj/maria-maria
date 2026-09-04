"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Close } from "@/components/Icons";
import { GALLERY_CATEGORIES } from "@/lib/gallery/categories";
import { useAdminI18n } from "../i18n/AdminI18n";

/* One way to choose a picture, wherever the backoffice needs one.
   ==================================================================
   The hero stages and the video posters both point at a file in the media
   library, and both used to have no way to say which — the gallery could push
   an asset TO the hero, but the hero could not pull one FROM the gallery.
   This is that direction: a modal over the same scan the gallery lists, with
   the category tabs it already has and a name filter, because "which of the
   nine landscape shots" is a question a thumbnail grid answers and a path
   field does not.

   The library is fetched when the dialog first opens and kept for the rest of
   the session — several hundred rows, and nothing about them changes while a
   focal point is being nudged. */

const CATEGORY_KEYS = ["all", ...GALLERY_CATEGORIES.map((c) => c.key)];

export default function AssetPicker({ open, current, onPick, onClose }) {
  const reduced = useReducedMotion();
  const { t } = useAdminI18n();
  const closeRef = useRef(null);
  const [assets, setAssets] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open || assets) return;
    let alive = true;
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((body) => {
        if (alive) setAssets(body.data.assets);
      })
      .catch((e) => alive && setError(e));
    return () => {
      alive = false;
    };
  }, [open, assets]);

  /* Escape closes, and the close button takes focus so the dialog is
     reachable from the keyboard the moment it appears. */
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const visible = useMemo(() => {
    if (!assets) return [];
    const needle = query.trim().toLowerCase();
    return assets.filter(
      (a) =>
        (tab === "all" || a.category === tab) &&
        (!needle || a.name.toLowerCase().includes(needle)),
    );
  }, [assets, tab, query]);

  const pick = useCallback(
    (asset) => {
      onPick(asset.path);
      onClose();
    },
    [onPick, onClose],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          className="fixed inset-0 z-[96] grid place-items-center bg-espresso/55 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={t("picker.aria")}
        >
          <motion.div
            data-asset-picker
            initial={reduced ? false : { y: 18, scale: 0.985 }}
            animate={{ y: 0, scale: 1 }}
            exit={reduced ? {} : { y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="flex max-h-[86vh] w-full max-w-[900px] flex-col overflow-hidden rounded-card-lg bg-a-canvas shadow-glass"
          >
            <div className="flex items-start justify-between gap-4 border-b border-a-ink/[0.08] px-5 py-4">
              <div className="min-w-0">
                <h3 className="font-playfair text-[18px] text-a-ink">{t("picker.title")}</h3>
                {assets && (
                  <p className="mt-0.5 text-[10.5px] text-a-ink/45 tabular-nums">
                    {t("picker.count", { count: visible.length })}
                  </p>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t("common.close")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-a-ink/12 text-a-ink/60 transition-colors hover:border-champagne hover:text-a-accent"
              >
                <Close className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-a-ink/[0.06] px-5 py-3">
              <div role="tablist" className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
                {CATEGORY_KEYS.map((key) => {
                  const active = tab === key;
                  return (
                    <button
                      key={key}
                      role="tab"
                      type="button"
                      aria-selected={active}
                      onClick={() => setTab(key)}
                      className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-[11.5px] transition-colors duration-300 ${
                        active ? "text-ivory" : "text-a-ink/60 hover:text-a-accent"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="picker-tab-pill"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                          transition={
                            reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32 }
                          }
                        />
                      )}
                      <span className="relative z-10 whitespace-nowrap">
                        {t(`gallery.${key}.label`)}
                      </span>
                    </button>
                  );
                })}
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={t("picker.search")}
                placeholder={t("picker.searchPlaceholder")}
                className="ml-auto h-9 w-full min-w-0 rounded-xl border border-a-ink/12 bg-a-surface/60 px-3 text-[12px] text-a-ink placeholder:text-a-ink/30 focus:border-champagne focus:outline-none sm:w-[220px]"
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {error ? (
                <p role="alert" className="rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
                  {error.message}
                </p>
              ) : !assets ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-card bg-a-ink/[0.05]" />
                  ))}
                </div>
              ) : visible.length === 0 ? (
                <p className="py-10 text-center text-[12.5px] text-a-ink/45">{t("picker.empty")}</p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                  {visible.map((asset) => {
                    const active = asset.path === current;
                    return (
                      <motion.button
                        key={asset.path}
                        type="button"
                        whileTap={reduced ? undefined : { scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        onClick={() => pick(asset)}
                        title={asset.path}
                        aria-pressed={active}
                        className={`group overflow-hidden rounded-card border bg-a-surface/60 p-1 text-left transition-colors duration-300 ${
                          active
                            ? "border-a-accent ring-1 ring-a-accent"
                            : "border-a-ink/[0.08] hover:border-champagne"
                        }`}
                      >
                        <span className="relative block aspect-square overflow-hidden rounded-xl bg-a-canvas">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset.path}
                            alt=""
                            loading="lazy"
                            className={`h-full w-full transition-transform duration-500 ease-out-expo group-hover:scale-[1.04] ${
                              asset.category === "bottle" || asset.category === "logo"
                                ? "object-contain p-1.5"
                                : "object-cover"
                            }`}
                          />
                          {active && (
                            <span className="absolute inset-x-1 bottom-1 rounded-lg bg-espresso/85 px-2 py-1 text-center text-[9px] uppercase tracking-[0.14em] text-ivory">
                              {t("picker.current")}
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block truncate px-1 pb-0.5 text-[9.5px] text-a-ink/55">
                          {asset.uploaded ? "▲ " : ""}
                          {asset.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
