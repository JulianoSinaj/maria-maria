"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Close } from "@/components/Icons";
import { MEDIA_ALT_LOCALES, MEDIA_ALT_MAX, MEDIA_LICENSES, MEDIA_LIMITS } from "@/lib/media/rights";
import { useAdminI18n } from "../i18n/AdminI18n";

/* What a picture shows, who owns it, and in which formats it exists.
   ==================================================================
   The gallery could always say what a file is CALLED. Everything that
   actually matters about it lived nowhere: the sentence a screen reader
   announces, the agency that licensed it, the date that licence runs out, and
   whether the responsive widths behind it exist at all.

   Three things this panel takes seriously:

   DECORATIVE IS A DECISION. An image that carries no information of its own
   belongs in the page with alt="" so assistive technology skips it. Without
   the switch, "deliberately empty" and "nobody has written one yet" look
   identical, and the library would nag about a divider line forever.

   AN EXPIRED LICENCE IS A BILL, not a bug. The date is stored, and a stage
   whose term has run out says so in the list rather than in a letter.

   THE FORMATS ARE NOT ALL OURS TO BUILD. Uploads get their WebP/AVIF ladder
   here, on demand and at upload; tracked assets under public/img belong to
   scripts/optimize-*.mjs, and the panel names that command instead of
   offering a button that could not work on a read-only deployment. */

const FIELD =
  "w-full rounded-xl border border-a-ink/12 bg-a-canvas px-3 py-2 text-[12.5px] text-a-ink transition-colors duration-300 placeholder:text-a-ink/30 focus:border-champagne focus:outline-none";
const LEGEND = "mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55";
const CARD = "rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 p-4";

const isUpload = (path) => path.startsWith("/api/admin/");

export default function AssetMetaDrawer({ asset, onClose, onSaved }) {
  const reduced = useReducedMotion();
  const { t } = useAdminI18n();
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  const [draft, setDraft] = useState(null);
  const [derivatives, setDerivatives] = useState(null);
  const [locale, setLocale] = useState("de");
  const [busy, setBusy] = useState(null); // "save" | "build" | null
  const [error, setError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);

  /* Load the stored record fresh rather than trusting the row that was
     clicked: the gallery list may be a minute old, and this is where somebody
     is about to overwrite it. */
  useEffect(() => {
    if (!asset) return;
    setDraft(null);
    setError(null);
    fetch(`/api/admin/media?path=${encodeURIComponent(asset.path)}`)
      .then((r) => r.json())
      .then((body) => {
        setDraft(body.data.meta);
        setDerivatives(body.data.derivatives ?? asset.derivatives ?? null);
      })
      .catch(setError);
  }, [asset]);

  /* Escape closes, focus starts inside, Tab stays in the panel. */
  useEffect(() => {
    if (!asset) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll(
        'button:not([disabled]),input:not([disabled]),select,textarea,a[href]',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [asset, onClose]);

  const set = (patch) => setDraft((current) => ({ ...current, ...patch }));

  const save = async () => {
    setBusy("save");
    setError(null);
    try {
      const res = await fetch("/api/admin/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: asset.path,
          alt: draft.alt,
          decorative: draft.decorative,
          license: draft.license,
          holder: draft.holder,
          source: draft.source,
          expires: draft.expires || null,
          note: draft.note,
        }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.error ?? t("common.saveFailed", { status: res.status }));
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2600);
      onSaved?.();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(null);
    }
  };

  const build = async () => {
    setBusy("build");
    setError(null);
    try {
      const res = await fetch("/api/admin/media/derivatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: asset.path }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.error ?? t("common.saveFailed", { status: res.status }));
      setDerivatives(payload.data.derivatives);
      onSaved?.();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(null);
    }
  };

  const formatsLine = () => {
    if (!derivatives || !derivatives.count) {
      const reason = derivatives?.skipped;
      if (reason === "small") return t("assetMeta.skippedSmall");
      if (reason === "no-encoder") return t("assetMeta.skippedNoEncoder");
      if (reason === "unreadable") return t("assetMeta.skippedUnreadable");
      return t("assetMeta.formatsNone");
    }
    if (derivatives.source === "manifest") {
      return t("assetMeta.formatsManifest", { count: derivatives.widths.length });
    }
    return t("assetMeta.formatsCount", {
      count: derivatives.count,
      widths: derivatives.widths.length,
      formats: derivatives.formats.map((f) => f.toUpperCase()).join(" + "),
    });
  };

  return (
    <AnimatePresence>
      {asset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          className="fixed inset-0 z-[95] flex justify-end bg-espresso/45 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t("assetMeta.title")}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panelRef}
            initial={reduced ? false : { x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduced ? {} : { x: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="flex h-full w-full max-w-[460px] flex-col bg-a-canvas shadow-glass"
          >
            {/* ---- head ---- */}
            <div className="flex items-start justify-between gap-3 border-b border-a-ink/[0.08] px-5 py-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
                  {t("assetMeta.title")}
                </p>
                <h3 className="mt-1 truncate font-playfair text-[17px] text-a-ink">{asset.name}</h3>
                <p className="mt-0.5 truncate text-[10px] text-a-ink/40">{t("assetMeta.subtitle")}</p>
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

            {/* ---- body ---- */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="overflow-hidden rounded-card border border-a-ink/[0.08] bg-a-surface/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.path}
                  alt=""
                  className={`h-40 w-full ${
                    asset.category === "bottle" || asset.category === "logo"
                      ? "object-contain p-3"
                      : "object-cover"
                  }`}
                />
              </div>
              <p className="mt-1.5 break-all text-[10px] text-a-ink/40">{asset.path}</p>

              {error && (
                <p role="alert" className="mt-3 rounded-xl bg-a-accent/10 px-3 py-2 text-[11.5px] text-a-accent">
                  {error.message}
                </p>
              )}

              {!draft ? (
                <div className="mt-4 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-xl bg-a-ink/[0.05]" />
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-4">
                  {/* ---- alt text ---- */}
                  <div className={CARD}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className={`${LEGEND} mb-0`}>{t("assetMeta.alt")}</p>
                      <div role="tablist" className="flex gap-1">
                        {MEDIA_ALT_LOCALES.map((code) => {
                          const active = code === locale;
                          return (
                            <button
                              key={code}
                              role="tab"
                              type="button"
                              aria-selected={active}
                              onClick={() => setLocale(code)}
                              className={`relative rounded-full px-2.5 py-1 text-[10.5px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                                active ? "text-ivory" : "text-a-ink/55 hover:text-a-accent"
                              }`}
                            >
                              {active && (
                                <motion.span
                                  layoutId="meta-alt-pill"
                                  aria-hidden="true"
                                  className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                                  transition={
                                    reduced
                                      ? { duration: 0 }
                                      : { type: "spring", stiffness: 340, damping: 32 }
                                  }
                                />
                              )}
                              <span className="relative z-10 flex items-center gap-1">
                                {code}
                                {!draft.decorative && !draft.alt[code]?.trim() && (
                                  <span
                                    aria-hidden="true"
                                    className={`h-1 w-1 rounded-full ${
                                      active ? "bg-ivory/80" : "bg-champagne"
                                    }`}
                                  />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="block">
                      <span className="mb-1 flex items-baseline justify-between">
                        <span className="text-[10.5px] text-a-ink/45">{t("assetMeta.altHint")}</span>
                        <span className="text-[10px] tabular-nums text-a-ink/35">
                          {(draft.alt[locale] ?? "").length}/{MEDIA_ALT_MAX}
                        </span>
                      </span>
                      <textarea
                        rows={2}
                        maxLength={MEDIA_ALT_MAX}
                        disabled={draft.decorative}
                        value={draft.alt[locale] ?? ""}
                        placeholder={t("assetMeta.altPlaceholder")}
                        onChange={(e) => set({ alt: { ...draft.alt, [locale]: e.target.value } })}
                        aria-label={`${t("assetMeta.alt")} ${locale}`}
                        className={`${FIELD} ${draft.decorative ? "opacity-40" : ""}`}
                      />
                    </label>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={draft.decorative}
                      onClick={() => set({ decorative: !draft.decorative })}
                      className="mt-3 flex items-start gap-2.5 text-left"
                    >
                      <span
                        className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${
                          draft.decorative ? "bg-a-fill" : "bg-a-ink/15"
                        }`}
                      >
                        <motion.span
                          className="absolute top-0.5 h-4 w-4 rounded-full bg-ivory shadow-chip"
                          animate={{ left: draft.decorative ? 18 : 2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        />
                      </span>
                      <span>
                        <span className="block text-[12px] text-a-ink/75">
                          {t("assetMeta.decorative")}
                        </span>
                        <span className="block text-[10.5px] leading-relaxed text-a-ink/40">
                          {t("assetMeta.decorativeHint")}
                        </span>
                      </span>
                    </button>
                  </div>

                  {/* ---- rights ---- */}
                  <div className={CARD}>
                    <p className={LEGEND}>{t("assetMeta.rights")}</p>
                    <div className="flex flex-col gap-3">
                      <label className="block">
                        <span className="mb-1 block text-[10.5px] text-a-ink/50">
                          {t("assetMeta.license")}
                        </span>
                        <select
                          value={draft.license}
                          onChange={(e) => set({ license: e.target.value })}
                          className={FIELD}
                        >
                          {MEDIA_LICENSES.map((key) => (
                            <option key={key} value={key}>
                              {t(`assetMeta.licenses.${key}`)}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-[10.5px] text-a-ink/50">
                          {t("assetMeta.holder")}
                        </span>
                        <input
                          value={draft.holder}
                          maxLength={MEDIA_LIMITS.holder}
                          placeholder={t("assetMeta.holderPlaceholder")}
                          onChange={(e) => set({ holder: e.target.value })}
                          className={FIELD}
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-[10.5px] text-a-ink/50">
                          {t("assetMeta.source")}
                        </span>
                        <input
                          value={draft.source}
                          maxLength={MEDIA_LIMITS.source}
                          placeholder={t("assetMeta.sourcePlaceholder")}
                          onChange={(e) => set({ source: e.target.value })}
                          className={FIELD}
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 flex items-baseline justify-between">
                          <span className="text-[10.5px] text-a-ink/50">{t("assetMeta.expires")}</span>
                          <span className="text-[10px] text-a-ink/35">
                            {t("assetMeta.expiresHint")}
                          </span>
                        </span>
                        <input
                          type="date"
                          value={draft.expires ?? ""}
                          onChange={(e) => set({ expires: e.target.value || null })}
                          className={FIELD}
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-[10.5px] text-a-ink/50">
                          {t("assetMeta.note")}
                        </span>
                        <textarea
                          rows={2}
                          maxLength={MEDIA_LIMITS.note}
                          value={draft.note}
                          onChange={(e) => set({ note: e.target.value })}
                          className={FIELD}
                        />
                      </label>
                    </div>
                  </div>

                  {/* ---- formats ---- */}
                  <div className={CARD}>
                    <p className={LEGEND}>{t("assetMeta.formats")}</p>
                    <p className="text-[11.5px] leading-relaxed text-a-ink/65">{formatsLine()}</p>
                    {derivatives?.widths?.length > 0 && (
                      <p className="mt-1 text-[10px] tabular-nums text-a-ink/40">
                        {derivatives.widths.join(" · ")} px
                      </p>
                    )}
                    {isUpload(asset.path) ? (
                      <motion.button
                        type="button"
                        whileTap={reduced ? undefined : { scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        disabled={busy !== null}
                        onClick={build}
                        className="mt-3 rounded-full border border-a-ink/12 px-4 py-2 text-[11.5px] text-a-ink/70 transition-colors hover:border-champagne hover:text-a-accent disabled:opacity-50"
                      >
                        {busy === "build" ? t("assetMeta.formatsBuilding") : t("assetMeta.formatsBuild")}
                      </motion.button>
                    ) : (
                      <p className="mt-2 text-[10.5px] leading-relaxed text-a-ink/40">
                        {t("assetMeta.formatsTracked")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ---- foot ---- */}
            <div className="flex items-center justify-between gap-3 border-t border-a-ink/[0.08] px-5 py-4">
              <AnimatePresence>
                {savedAt && (
                  <motion.span
                    role="status"
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11.5px] font-medium text-vine"
                  >
                    {t("common.saved")}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.button
                type="button"
                disabled={!draft || busy !== null}
                onClick={save}
                whileTap={reduced ? undefined : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="ml-auto rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-opacity disabled:opacity-40"
              >
                {busy === "save" ? t("common.saving") : t("common.save")}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
