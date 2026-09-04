"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Close } from "@/components/Icons";
import { Image as ImageIcon, Search } from "@/components/admin/AdminIcons";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";
import { uploadInterviewImage } from "@/lib/interviews/useInterviews";
import { legendCls, ghostBtn } from "./editorFields";

/* One image slot: a thumbnail of what is assigned, and two ways to change
   it — pick from the library (public/img/magazin + uploads) or upload a new
   file. The value is the web path the storefront will render; the server
   checks it exists on save, so a typo can never reach a live page.

   The picker is a modal over the editor, not a slide-over: an image choice
   is a short detour, and the editor's own scroll position must survive it. */

export default function ImageField({
  label,
  hint,
  value,
  onChange,
  images = [],
  onUploaded,
  required = false,
  aspect = "aspect-[4/3]",
}) {
  const { t } = useAdminI18n();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded = await uploadInterviewImage(file);
      onUploaded?.(uploaded);
      onChange(uploaded.path);
    } catch (err) {
      setError(err.message ?? t("common.uploadFailed"));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className={legendCls}>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-a-accent">
              *
            </span>
          )}
        </span>
        {hint && <span className="text-[10.5px] text-a-ink/35">{hint}</span>}
      </span>

      <div className="flex items-start gap-3">
        <div className={`relative w-24 shrink-0 overflow-hidden rounded-xl border border-a-ink/10 bg-a-canvas ${aspect}`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-a-ink/25">
              <ImageIcon className="h-6 w-6" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[11px] text-a-ink/55" title={value || ""}>
            {value || t("magazine.image.none")}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setOpen(true)} className={ghostBtn}>
              {t("magazine.image.choose")}
            </button>
            <label className={`${ghostBtn} cursor-pointer`}>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => upload(e.target.files?.[0])}
              />
              {uploading ? t("magazine.image.uploading") : t("magazine.image.upload")}
            </label>
            {value && (
              <button type="button" onClick={() => onChange("")} className={`${ghostBtn} text-a-ink/45`}>
                {t("magazine.image.remove")}
              </button>
            )}
          </div>
          {error && <p className="mt-1.5 text-[10.5px] text-a-accent">{error}</p>}
        </div>
      </div>

      <ImagePicker
        open={open}
        images={images}
        value={value}
        onClose={() => setOpen(false)}
        onPick={(path) => {
          onChange(path);
          setOpen(false);
        }}
      />
    </div>
  );
}

function ImagePicker({ open, images, value, onClose, onPick }) {
  const reduced = useReducedMotion();
  const { t } = useAdminI18n();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return images.filter(
      (img) =>
        (tab === "all" || (tab === "uploads" ? img.uploaded : !img.uploaded)) &&
        (!q || img.path.toLowerCase().includes(q)),
    );
  }, [images, query, tab]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95]">
          <motion.button
            type="button"
            aria-label={t("common.close")}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="absolute inset-0 w-full cursor-default bg-espresso/55 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("magazine.image.library")}
            data-lenis-prevent
            initial={reduced ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-1/2 top-1/2 flex max-h-[86vh] w-[min(920px,92vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-a-ink/[0.08] bg-a-canvas shadow-glass will-transform"
          >
            <header className="flex items-center gap-3 border-b border-a-ink/[0.08] px-5 py-4">
              <h3 className="font-playfair text-[19px] text-a-ink">{t("magazine.image.library")}</h3>
              <div className="ml-auto flex items-center gap-1 rounded-full border border-a-ink/12 p-1">
                {["all", "library", "uploads"].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    aria-pressed={tab === key}
                    className={`h-8 rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                      tab === key ? "bg-a-fill text-ivory" : "text-a-ink/55 hover:text-a-accent"
                    }`}
                  >
                    {t(`magazine.image.tab_${key}`)}
                  </button>
                ))}
              </div>
              <label className="relative">
                <span className="sr-only">{t("magazine.image.search")}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-a-ink/35" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("magazine.image.search")}
                  className="h-10 w-[200px] rounded-full border border-a-ink/12 bg-a-surface/70 pl-9 pr-3 text-[12px] text-a-ink focus:border-champagne focus:outline-none"
                />
              </label>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t("common.close")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-a-ink/12 text-a-ink/70 transition-colors hover:border-champagne hover:text-a-accent"
              >
                <Close className="h-[18px] w-[18px]" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
              {shown.length === 0 ? (
                <p className="py-10 text-center text-[12.5px] text-a-ink/45">{t("magazine.image.empty")}</p>
              ) : (
                <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {shown.map((img) => {
                    const active = img.path === value;
                    return (
                      <li key={img.path}>
                        <button
                          type="button"
                          onClick={() => onPick(img.path)}
                          title={img.path}
                          className={`group block w-full overflow-hidden rounded-xl border text-left transition-colors ${
                            active ? "border-a-accent" : "border-a-ink/10 hover:border-champagne"
                          }`}
                        >
                          <span className="relative block aspect-[4/3] bg-a-surface">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.path}
                              alt=""
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
                            />
                            {img.uploaded && (
                              <span className="absolute left-1.5 top-1.5 rounded-full bg-espresso/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ivory">
                                {t("magazine.image.tab_uploads")}
                              </span>
                            )}
                          </span>
                          <span className="block truncate px-2 py-1.5 font-mono text-[10px] text-a-ink/55">
                            {img.name}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
