"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { HERO_EDITOR_HREF } from "@/lib/pages/blocks";
import { getAt, setAt, countStrings, deepEqual } from "@/lib/pages/merge";
import { useAdminI18n } from "../i18n/AdminI18n";
import FieldTree from "./FieldTree";

/* One text block of one page in one language.

   Collapsed: title, key, field count and the four language dots (lit where
   that language overrides the code). Open: the field tree plus the actions
   row. Save writes the whole block — same shape as the code — and reset
   deletes the override, so the storefront falls back to the code. */

const CARD_SPRING = { type: "spring", stiffness: 190, damping: 26 };

function LocaleDots({ locales, current }) {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {LOCALES.map((locale) => {
        const lit = locales.includes(locale);
        return (
          <span
            key={locale}
            title={LOCALE_META[locale]?.native}
            className={`grid h-5 w-6 place-items-center rounded-md text-[8.5px] font-semibold tracking-[0.08em] transition-colors duration-300 ${
              lit ? "bg-a-fill text-ivory" : "bg-a-ink/[0.05] text-a-ink/35"
            } ${locale === current ? "ring-1 ring-champagne ring-offset-1 ring-offset-a-surface" : ""}`}
          >
            {LOCALE_META[locale]?.short}
          </span>
        );
      })}
    </span>
  );
}

const cardCls =
  "relative overflow-hidden rounded-card-lg border bg-a-surface/60 transition-colors duration-300";

export default function BlockCard({
  page,
  block,
  reference,
  locale,
  draft,
  onDraft,
  onSave,
  onReset,
  onDiscard,
  index = 0,
}) {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  const value = draft ?? block.value;
  const dirty = draft !== undefined && !deepEqual(draft, block.value);
  const fieldCount = useMemo(() => countStrings(block.seed), [block.seed]);

  const group = block.key.split(".")[0];
  const groupLabel = t(`pagesPage.blocks.${page}.${group}.label`);
  const groupHint = t(`pagesPage.blocks.${page}.${group}.hint`);
  const own = block.titleFrom ? getAt(block.value, [block.titleFrom]) : null;
  const title = block.num
    ? `${t("pagesPage.chapter", { num: block.num })} · ${own || groupLabel}`
    : own || groupLabel;
  const hint = block.num && block.titleFrom ? t("pagesPage.chapterHint") : groupHint;

  const change = (path, text) => {
    const next = setAt(value, path, text);
    onDraft(deepEqual(next, block.value) ? undefined : next);
  };

  const flash = () => {
    setSavedAt(Date.now());
    window.setTimeout(() => setSavedAt(null), 2600);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(value);
      flash();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!window.confirm(t("pagesPage.resetConfirm"))) return;
    setSaving(true);
    setError(null);
    try {
      await onReset();
      flash();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const entrance = {
    initial: reduced ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { ...CARD_SPRING, delay: reduced ? 0 : Math.min(index, 8) * 0.035 },
  };

  /* ---------- the homepage hero lives in Hero & Media ---------- */
  if (block.editor === "media") {
    return (
      <motion.li {...entrance} className={`${cardCls} border-a-ink/[0.08]`}>
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="font-playfair text-[17px] text-a-ink">{t("pagesPage.heroLink.title")}</p>
            <p className="mt-1 max-w-[60ch] text-[12px] leading-relaxed text-a-ink/55">
              {t("pagesPage.heroLink.text")}
            </p>
          </div>
          <Link
            href={HERO_EDITOR_HREF}
            className="shrink-0 rounded-full border border-a-ink/15 px-5 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-a-ink/75 transition-colors duration-300 hover:border-champagne hover:text-a-accent"
          >
            {t("pagesPage.heroLink.cta")} →
          </Link>
        </div>
      </motion.li>
    );
  }

  return (
    <motion.li
      {...entrance}
      className={`${cardCls} ${
        dirty ? "border-a-accent/45" : block.overridden ? "border-champagne/60" : "border-a-ink/[0.08]"
      }`}
    >
      {/* champagne hairline marks a block that overrides the code */}
      {block.overridden && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-champagne via-a-accent/70 to-champagne"
        />
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 text-left"
      >
        <span className="min-w-0 flex-1 basis-[28ch]">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-playfair text-[17px] leading-tight text-a-ink">{title}</span>
            <span className="font-mono text-[10px] tracking-[0.02em] text-a-ink/40">
              {page}.{block.key}
            </span>
          </span>
          <span className="mt-1 block text-[11.5px] text-a-ink/50">{hint}</span>
        </span>

        <span className="flex shrink-0 items-center gap-4">
          <span className="text-[10.5px] tabular-nums text-a-ink/40">
            {t("pagesPage.fields", { count: fieldCount })}
          </span>
          <AnimatePresence initial={false}>
            {dirty && (
              <motion.span
                key="dirty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-full bg-a-accent/12 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-a-accent"
              >
                {t("pagesPage.dirty")}
              </motion.span>
            )}
          </AnimatePresence>
          <LocaleDots locales={block.locales} current={locale} />
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 180 : 0 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 24 }}
            className="grid h-7 w-7 place-items-center rounded-full border border-a-ink/12 text-a-ink/55"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : CARD_SPRING}
            className="overflow-hidden"
          >
            <div className="border-t border-a-ink/[0.08] px-5 pb-5 pt-4">
              <div className="grid gap-3.5 lg:grid-cols-2">
                <FieldTree
                  seed={block.seed}
                  value={value}
                  reference={reference}
                  locale={locale}
                  onChange={change}
                />
              </div>

              {error && (
                <p role="alert" className="mt-4 rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
                  {error.message}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-a-ink/45">
                  {block.overridden ? t("pagesPage.overridden") : t("pagesPage.fromCode")}
                  {block.locales.length > 0 && (
                    <>
                      {" · "}
                      {t("pagesPage.changedIn", {
                        locales: block.locales.map((l) => LOCALE_META[l]?.short ?? l).join(", "),
                      })}
                    </>
                  )}
                </span>

                <div className="flex flex-wrap items-center gap-2.5">
                  {dirty && (
                    <button
                      type="button"
                      onClick={onDiscard}
                      className="rounded-full px-4 py-2.5 text-[12px] tracking-[0.06em] text-a-ink/55 transition-colors hover:text-a-accent"
                    >
                      {t("pagesPage.discard")}
                    </button>
                  )}
                  {block.overridden && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={reset}
                      className="rounded-full border border-a-ink/15 px-4 py-2.5 text-[12px] tracking-[0.06em] text-a-ink/65 transition-colors hover:border-champagne hover:text-a-accent disabled:opacity-50"
                    >
                      {t("pagesPage.resetToCode")}
                    </button>
                  )}
                  <AnimatePresence>
                    {savedAt && (
                      <motion.span
                        role="status"
                        initial={{ opacity: 0, x: 8 }}
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
                    disabled={saving || !dirty}
                    onClick={save}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-6 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-ivory transition-opacity disabled:opacity-40"
                  >
                    {saving ? t("common.saving") : t("common.save")}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
