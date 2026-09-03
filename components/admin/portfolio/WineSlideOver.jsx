"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Close } from "@/components/Icons";
import {
  AGING,
  STYLE,
  TIER,
  PAIRING,
  ACCENT,
  ACCENT_META,
  WORDMARK,
} from "@/lib/inventory/schema";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Slide-over editor for a single wine.
   Two modes: "quick" (allocation + price only — the frequent job) and "full"
   (every field, used for Add and for a deeper edit). Both post the same
   validated shape; the server is the authority, and its 422 details surface
   inline per field. */

const num = (v) => (v === "" || v == null ? "" : Number(v));

/* Empty draft for the Add flow — mirrors the schema's required fields so the
   form can never submit a structurally impossible record. */
const BLANK = {
  slug: "",
  name: "",
  fullName: "",
  vintage: new Date().getFullYear() - 1,
  appellation: { name: "", tier: TIER.IGP, region: "", zone: "" },
  style: STYLE.RED,
  aging: { vessel: AGING.STEEL, months: 12, detail: "" },
  batch: { size: null, committed: 0 },
  price: "",
  abv: "",
  pairings: [PAIRING.MEAT],
  pairingNotes: "",
  tastingNotes: [],
  tastingText: "",
  label: { wordmark: WORDMARK.BANDED, accent: ACCENT.RED, redAccent: true, ground: "" },
  status: "active",
};

const Field = ({ label, hint, error, children }) => (
  <label className="block">
    <span className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55">
        {label}
      </span>
      {hint && <span className="text-[10.5px] text-a-ink/35">{hint}</span>}
    </span>
    {children}
    {error && <span className="mt-1 block text-[10.5px] text-a-accent">{error}</span>}
  </label>
);

const inputCls =
  "h-11 w-full rounded-xl border border-a-ink/12 bg-a-surface/70 px-3.5 text-[13px] text-a-ink transition-colors duration-300 placeholder:text-a-ink/30 focus:border-champagne focus:outline-none";

export default function WineSlideOver({ open, mode, item, onClose, onSave, onFull, saving, error }) {
  const reduced = useReducedMotion();
  const { t, tm, intl } = useAdminI18n();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const [draft, setDraft] = useState(BLANK);

  const isCreate = mode === "create";
  const isQuick = mode === "quick";

  /* reseed whenever a different record opens */
  useEffect(() => {
    if (!open) return;
    setDraft(isCreate ? { ...BLANK } : structuredClone(item ?? BLANK));
  }, [open, item, isCreate]);

  /* focus in, trap Tab, Escape closes, focus returns to the trigger */
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = panelRef.current?.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
      );
      if (!els?.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  const set = (path, value) =>
    setDraft((d) => {
      const next = structuredClone(d);
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i += 1) cur = cur[keys[i]];
      cur[keys.at(-1)] = value;
      return next;
    });

  /* map the server's per-field validation messages onto inputs */
  const fieldErrors = useMemo(() => {
    const map = {};
    for (const d of error?.details ?? []) {
      const key = d.split(" ")[0];
      map[key] = d;
    }
    return map;
  }, [error]);

  const remaining =
    draft.batch?.size == null ? null : draft.batch.size - (draft.batch.committed ?? 0);

  const submit = (e) => {
    e.preventDefault();
    /* coerce the numeric text inputs before they reach the schema */
    const payload = structuredClone(draft);
    payload.price = num(payload.price);
    payload.vintage = num(payload.vintage);
    if (payload.abv === "") delete payload.abv;
    else payload.abv = num(payload.abv);
    payload.batch.committed = num(payload.batch.committed) || 0;
    payload.batch.size = payload.batch.size === "" || payload.batch.size == null
      ? null
      : num(payload.batch.size);
    payload.aging.months = num(payload.aging.months) || 0;
    if (typeof payload.tastingNotes === "string") {
      payload.tastingNotes = payload.tastingNotes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    payload.label.redAccent = payload.label.accent === ACCENT.RED;
    onSave(payload);
  };

  /* accessible name for the dialog — the visible heading is the wine itself */
  const title = isCreate
    ? t("editor.createTitle")
    : `${draft.name || t("editor.wineFallback")} ${
        isQuick ? t("editor.quickSuffix") : t("editor.editSuffix")
      }`;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]">
          <motion.button
            type="button"
            aria-label={t("common.close")}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="absolute inset-0 w-full cursor-default bg-espresso/50 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={
              reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 34, mass: 0.9 }
            }
            className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col bg-a-canvas will-transform"
          >
            <header className="flex items-start justify-between gap-4 border-b border-a-ink/[0.08] px-6 py-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
                  {isQuick
                    ? t("editor.eyebrowQuick")
                    : isCreate
                      ? t("editor.eyebrowCreate")
                      : t("editor.eyebrowEdit")}
                </p>
                {/* the wine's own name is the heading — in quick mode the mode
                    label moves to the eyebrow, so it is always clear WHICH
                    bottle is being edited */}
                <h2 className="mt-1 truncate font-playfair text-[21px] leading-tight text-a-ink">
                  {isCreate ? t("editor.createTitle") : draft.name || t("editor.editTitle")}
                </h2>
                {!isCreate && draft.appellation?.name && (
                  <p className="mt-0.5 truncate text-[11.5px] text-a-ink/45">
                    {draft.vintage} · {draft.appellation.name}
                  </p>
                )}
              </div>
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

            <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-6 py-6">
                {error && !Object.keys(fieldErrors).length && (
                  <p role="alert" className="rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
                    {error.message}
                  </p>
                )}

                {/* ---- always shown: the quick-edit fields ---- */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label={t("editor.price")} hint={t("editor.priceHint")} error={fieldErrors.price}>
                    <input
                      className={inputCls}
                      type="number"
                      step="0.10"
                      min="0"
                      required
                      value={draft.price ?? ""}
                      onChange={(e) => set("price", e.target.value)}
                    />
                  </Field>
                  <Field label={t("editor.vintage")} error={fieldErrors.vintage}>
                    <input
                      className={inputCls}
                      type="number"
                      min="1900"
                      max="2100"
                      required
                      value={draft.vintage ?? ""}
                      onChange={(e) => set("vintage", e.target.value)}
                    />
                  </Field>
                </div>

                <fieldset className="rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 p-4">
                  <legend className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55">
                    {t("editor.allocation")}
                  </legend>
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label={t("editor.batchSize")}
                      hint={t("editor.batchHint")}
                      error={fieldErrors["batch.size"]}
                    >
                      <input
                        className={inputCls}
                        type="number"
                        min="1"
                        placeholder="—"
                        value={draft.batch?.size ?? ""}
                        onChange={(e) =>
                          set("batch.size", e.target.value === "" ? null : e.target.value)
                        }
                      />
                    </Field>
                    <Field label={t("editor.committed")} error={fieldErrors["batch.committed"]}>
                      <input
                        className={inputCls}
                        type="number"
                        min="0"
                        value={draft.batch?.committed ?? 0}
                        onChange={(e) => set("batch.committed", e.target.value)}
                      />
                    </Field>
                  </div>
                  {/* live meter: the number and the bar move as you type, so
                      the consequence of an allocation change is visible before
                      it is saved */}
                  {remaining != null && draft.batch?.size > 0 && (
                    <span
                      aria-hidden="true"
                      className="mt-3 block h-1.5 overflow-hidden rounded-full bg-a-ink/[0.07]"
                    >
                      <span
                        className="block h-full rounded-full transition-[width,background-color] duration-500 ease-out-expo"
                        style={{
                          width: `${Math.max(0, Math.min(1, remaining / draft.batch.size)) * 100}%`,
                          background: remaining / draft.batch.size <= 0.25 ? "#8A2B2F" : "#6B0F1A",
                        }}
                      />
                    </span>
                  )}
                  <p className="mt-3 text-[11.5px] text-a-ink/50">
                    {remaining == null ? (
                      t("editor.noBatch")
                    ) : (
                      <>
                        {t("editor.available")}{" "}
                        <span
                          className={`font-semibold tabular-nums ${
                            remaining < 0 ? "text-a-accent" : "text-a-ink/70"
                          }`}
                        >
                          {remaining.toLocaleString(intl)}
                        </span>{" "}
                        {t("editor.bottles")}
                        {remaining < 0 && t("editor.overCommitted")}
                      </>
                    )}
                  </p>
                </fieldset>

                {isQuick && (
                  <div className="rounded-2xl border border-a-ink/[0.08] bg-a-surface/40 px-4 py-3.5">
                    <p className="text-[11.5px] leading-relaxed text-a-ink/45">
                      {t("editor.quickNote")}
                    </p>
                    <button
                      type="button"
                      onClick={onFull}
                      className="mt-2 text-[11.5px] font-medium text-a-accent transition-colors hover:text-a-accent-deep"
                    >
                      {t("editor.allFields")}
                    </button>
                  </div>
                )}

                {/* ---- full form only ---- */}
                {!isQuick && (
                  <>
                    <Field label={t("editor.name")} error={fieldErrors.name}>
                      <input
                        className={inputCls}
                        required
                        value={draft.name}
                        onChange={(e) => set("name", e.target.value)}
                      />
                    </Field>

                    {isCreate && (
                      <Field label={t("editor.slug")} hint={t("editor.slugHint")} error={fieldErrors.slug}>
                        <input
                          className={inputCls}
                          required
                          placeholder={t("editor.slugPlaceholder")}
                          value={draft.slug}
                          onChange={(e) => set("slug", e.target.value)}
                        />
                      </Field>
                    )}

                    <Field label={t("editor.fullName")} hint={t("editor.fullNameHint")}>
                      <input
                        className={inputCls}
                        value={draft.fullName ?? ""}
                        onChange={(e) => set("fullName", e.target.value)}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label={t("editor.style")}>
                        <select
                          className={inputCls}
                          value={draft.style}
                          onChange={(e) => set("style", e.target.value)}
                        >
                          {Object.values(STYLE).map((s) => (
                            <option key={s} value={s}>
                              {tm("style", s)}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label={t("editor.aging")}>
                        <select
                          className={inputCls}
                          value={draft.aging?.vessel}
                          onChange={(e) => set("aging.vessel", e.target.value)}
                        >
                          {Object.values(AGING).map((a) => (
                            <option key={a} value={a}>
                              {tm("aging", a)}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label={t("editor.months")}
                        hint={t("editor.monthsHint")}
                        error={fieldErrors["aging.months"]}
                      >
                        <input
                          className={inputCls}
                          type="number"
                          min="0"
                          value={draft.aging?.months ?? 0}
                          onChange={(e) => set("aging.months", e.target.value)}
                        />
                      </Field>
                      <Field label={t("editor.abv")} hint={t("editor.abvHint")}>
                        <input
                          className={inputCls}
                          type="number"
                          step="0.1"
                          min="0"
                          value={draft.abv ?? ""}
                          onChange={(e) => set("abv", e.target.value)}
                        />
                      </Field>
                    </div>

                    <fieldset className="rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 p-4">
                      <legend className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55">
                        {t("editor.origin")}
                      </legend>
                      <div className="space-y-4">
                        <Field label={t("editor.appellation")} error={fieldErrors["appellation.name"]}>
                          <input
                            className={inputCls}
                            required
                            placeholder={t("editor.appellationPlaceholder")}
                            value={draft.appellation?.name ?? ""}
                            onChange={(e) => set("appellation.name", e.target.value)}
                          />
                        </Field>
                        <div className="grid grid-cols-3 gap-3">
                          <Field label={t("editor.tier")}>
                            <select
                              className={inputCls}
                              value={draft.appellation?.tier}
                              onChange={(e) => set("appellation.tier", e.target.value)}
                            >
                              {Object.values(TIER).map((tier) => (
                                <option key={tier} value={tier}>
                                  {tier}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label={t("editor.region")} error={fieldErrors["appellation.region"]}>
                            <input
                              className={inputCls}
                              required
                              value={draft.appellation?.region ?? ""}
                              onChange={(e) => set("appellation.region", e.target.value)}
                            />
                          </Field>
                          <Field label={t("editor.zone")}>
                            <input
                              className={inputCls}
                              value={draft.appellation?.zone ?? ""}
                              onChange={(e) => set("appellation.zone", e.target.value)}
                            />
                          </Field>
                        </div>
                      </div>
                    </fieldset>

                    <Field
                      label={t("editor.pairings")}
                      hint={t("editor.pairingsHint")}
                      error={fieldErrors.pairings}
                    >
                      <div className="flex flex-wrap gap-2">
                        {Object.values(PAIRING).map((p) => {
                          const on = draft.pairings?.includes(p);
                          return (
                            <button
                              key={p}
                              type="button"
                              aria-pressed={on}
                              onClick={() =>
                                set(
                                  "pairings",
                                  on
                                    ? draft.pairings.filter((x) => x !== p)
                                    : [...(draft.pairings ?? []), p],
                                )
                              }
                              className={`rounded-full border px-3.5 py-2 text-[11.5px] transition-colors duration-300 ${
                                on
                                  ? "border-a-accent bg-a-fill text-ivory"
                                  : "border-a-ink/12 text-a-ink/60 hover:border-champagne"
                              }`}
                            >
                              {tm("pairing", p)}
                            </button>
                          );
                        })}
                      </div>
                    </Field>

                    <Field label={t("editor.pairingNotes")}>
                      <textarea
                        className={`${inputCls} h-auto py-2.5`}
                        rows={2}
                        value={draft.pairingNotes ?? ""}
                        onChange={(e) => set("pairingNotes", e.target.value)}
                      />
                    </Field>

                    <Field
                      label={t("editor.tasting")}
                      hint={t("editor.tastingHint")}
                      error={fieldErrors.tastingNotes}
                    >
                      <input
                        className={inputCls}
                        placeholder={t("editor.tastingPlaceholder")}
                        value={
                          Array.isArray(draft.tastingNotes)
                            ? draft.tastingNotes.join(", ")
                            : draft.tastingNotes ?? ""
                        }
                        onChange={(e) => set("tastingNotes", e.target.value)}
                      />
                    </Field>

                    <fieldset className="rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 p-4">
                      <legend className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55">
                        {t("editor.label")}
                      </legend>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label={t("editor.wordmark")}>
                          <select
                            className={inputCls}
                            value={draft.label?.wordmark}
                            onChange={(e) => set("label.wordmark", e.target.value)}
                          >
                            {Object.values(WORDMARK).map((w) => (
                              <option key={w} value={w}>
                                {tm("wordmark", w)}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label={t("editor.accent")}>
                          <select
                            className={inputCls}
                            value={draft.label?.accent}
                            onChange={(e) => set("label.accent", e.target.value)}
                          >
                            {Object.values(ACCENT).map((a) => (
                              <option key={a} value={a}>
                                {tm("accent", a)}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <div className="mt-3 flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className="h-5 w-5 rounded-full ring-1 ring-a-ink/10"
                          style={{ background: ACCENT_META[draft.label?.accent]?.hex }}
                        />
                        <span className="text-[11.5px] text-a-ink/50">
                          {draft.label?.accent === ACCENT.RED
                            ? t("editor.redAccent")
                            : t("editor.accentSuffix", { accent: tm("accent", draft.label?.accent) })}
                        </span>
                      </div>
                    </fieldset>
                  </>
                )}
              </div>

              <footer className="flex items-center justify-between gap-3 border-t border-a-ink/[0.08] bg-a-canvas px-6 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-4 py-2.5 text-[12px] tracking-[0.06em] text-a-ink/55 transition-colors hover:text-a-accent"
                >
                  {t("common.cancel")}
                </button>
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-7 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-opacity disabled:opacity-50"
                >
                  {saving ? t("common.saving") : isCreate ? t("common.create") : t("common.save")}
                </motion.button>
              </footer>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
