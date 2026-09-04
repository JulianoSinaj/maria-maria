"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Close } from "@/components/Icons";
import { Lock } from "@/components/admin/AdminIcons";
import { useAdminI18n } from "../i18n/AdminI18n";
import {
  FAQ_LOCALES,
  FAQ_DEFAULT_LOCALE,
  LIMITS,
  STATUS,
  emptyTexts,
  hasLink,
  isComplete,
  isNestedGroup,
} from "@/lib/faq/schema";

/* Slide-over editor for one question.

   Four language tabs over ONE record — not four records: the id, the group,
   the cluster and the position are language-neutral by design (they carry
   the deep links and the GA4 faq_id), and only question, answer and link
   text differ per language. The tab strip therefore switches the text block
   and nothing else, and every tab shows whether its language is finished.

   The id is the one field that is locked once a question is published. It
   is the anchor in /kontakt#kontakt-versand, the target of the deep links
   the wine pages carry, and the faq_id in GA4 — renaming it breaks the
   first two and splits the third in half. Unlocking is deliberate, spelled
   out, and sends `force` to the server, which refuses without it. */

const SPRING = { type: "spring", stiffness: 260, damping: 30 };

const inputCls =
  "h-11 w-full rounded-xl border border-a-ink/12 bg-a-surface/70 px-3.5 text-[13px] text-a-ink transition-colors duration-300 placeholder:text-a-ink/30 focus:border-champagne focus:outline-none";
const areaCls =
  "w-full rounded-xl border border-a-ink/12 bg-a-surface/70 px-3.5 py-3 text-[13px] leading-relaxed text-a-ink transition-colors duration-300 placeholder:text-a-ink/30 focus:border-champagne focus:outline-none";

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

/* Slug proposal for a new question: group prefix + the German question, so
   ids stay in the family they belong to (kontakt-versand, lugana-fisch). */
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 4)
    .join("-");

export default function QuestionEditor({
  open,
  mode, // "create" | "edit"
  item,
  group,
  groups = [],
  saving,
  error,
  onClose,
  onSave,
  onDelete,
  onRename,
}) {
  const reduced = useReducedMotion();
  const { t, tm } = useAdminI18n();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  const isCreate = mode === "create";
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState(FAQ_DEFAULT_LOCALE);
  const [unlocked, setUnlocked] = useState(false);
  const [idDraft, setIdDraft] = useState("");
  const [renaming, setRenaming] = useState(false);

  const summary = useMemo(
    () => groups.find((g) => g.key === (draft?.group ?? group)) ?? null,
    [groups, draft?.group, group],
  );

  useEffect(() => {
    if (!open) return;
    setTab(FAQ_DEFAULT_LOCALE);
    setUnlocked(false);
    setRenaming(false);
    if (isCreate) {
      const target = groups.find((g) => g.key === group);
      setDraft({
        id: "",
        group,
        subgroup: target?.nested ? (target.subgroups?.[0]?.key ?? null) : null,
        status: STATUS.DRAFT,
        text: emptyTexts(),
      });
      setIdDraft("");
    } else {
      setDraft(structuredClone(item));
      setIdDraft(item?.id ?? "");
    }
  }, [open, isCreate, item, group, groups]);

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

  if (!open || !draft) return null;

  const nested = isNestedGroup(draft.group);
  const published = !isCreate && item?.status === STATUS.PUBLISHED;
  const idLocked = published && !unlocked;

  const setText = (locale, field, value) =>
    setDraft((d) => ({
      ...d,
      text: { ...d.text, [locale]: { ...d.text[locale], [field]: value } },
    }));

  const setLink = (locale, field, value) =>
    setDraft((d) => {
      const link = { label: "", href: "", ...(d.text[locale].link ?? {}), [field]: value };
      return {
        ...d,
        text: {
          ...d.text,
          [locale]: { ...d.text[locale], link: hasLink(link) ? link : null },
        },
      };
    });

  /* map the server's per-field messages onto the tab they belong to */
  const fieldErrors = useMemo(() => {
    const map = {};
    for (const detail of error?.details ?? []) {
      const key = detail.split(" ")[0];
      map[key] = detail;
    }
    return map;
  }, [error]);

  const submit = (e) => {
    e.preventDefault();
    const payload = structuredClone(draft);
    if (isCreate) {
      payload.id =
        idDraft.trim() ||
        [draft.group.replace(/^wine:/, ""), slugify(draft.text[FAQ_DEFAULT_LOCALE].q)]
          .filter(Boolean)
          .join("-");
    } else {
      delete payload.id;
    }
    onSave(payload);
  };

  const commitRename = async () => {
    const next = idDraft.trim();
    if (!next || next === item.id) return;
    setRenaming(true);
    try {
      await onRename(item.id, next, { force: published });
      setUnlocked(false);
    } finally {
      setRenaming(false);
    }
  };

  const text = draft.text[tab];

  return (
    <AnimatePresence>
      <motion.div
        key="scrim"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-[80] bg-espresso/40 backdrop-blur-[2px]"
      />
      <motion.aside
        key="panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={
          isCreate ? t("faqPage.editor.createTitle") : t("faqPage.editor.editTitle", { id: item?.id })
        }
        initial={reduced ? false : { x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={reduced ? { duration: 0 } : SPRING}
        className="fixed inset-y-0 right-0 z-[85] flex w-full max-w-[620px] flex-col bg-a-canvas shadow-glass will-change-transform"
      >
        {/* ---- head ---- */}
        <div className="flex items-start justify-between gap-4 border-b border-a-ink/[0.08] px-6 py-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-a-accent/55">
              {summary?.name ?? tm("faqGroups", draft.group)}
            </p>
            <h2 className="mt-1 truncate font-playfair text-[22px] leading-tight text-a-ink">
              {isCreate ? t("faqPage.editor.createTitle") : (item?.id ?? "")}
            </h2>
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
        </div>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            {/* ---- identity ---- */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("faqPage.editor.id")}
                hint={idLocked ? t("faqPage.editor.idLockedHint") : t("faqPage.editor.idHint")}
                error={fieldErrors.id}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={idDraft}
                    disabled={idLocked}
                    onChange={(e) => setIdDraft(e.target.value)}
                    placeholder={t("faqPage.editor.idPlaceholder")}
                    className={`${inputCls} ${idLocked ? "cursor-not-allowed opacity-60" : ""}`}
                  />
                  {published && !unlocked && (
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-a-ink/12 text-a-ink/45"
                    >
                      <Lock className="h-[17px] w-[17px]" />
                    </span>
                  )}
                </div>
              </Field>

              <Field label={t("faqPage.editor.status")}>
                <select
                  value={draft.status}
                  onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                  className={inputCls}
                >
                  <option value={STATUS.DRAFT}>{t("faqPage.status.draft")}</option>
                  <option value={STATUS.PUBLISHED}>{t("faqPage.status.published")}</option>
                </select>
              </Field>
            </div>

            {/* ---- the block on renaming a published id ---- */}
            {published && (
              <div className="mt-3 rounded-xl border border-a-ink/10 bg-a-surface/60 px-4 py-3">
                {unlocked ? (
                  <>
                    <p className="text-[11.5px] leading-relaxed text-a-ink/70">
                      {t("faqPage.editor.renameWarning")}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        disabled={renaming || !idDraft.trim() || idDraft.trim() === item.id}
                        onClick={commitRename}
                        className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-4 py-2 text-[11.5px] font-medium uppercase tracking-[0.12em] text-ivory disabled:opacity-40"
                      >
                        {renaming ? t("common.saving") : t("faqPage.editor.renameConfirm")}
                      </motion.button>
                      <button
                        type="button"
                        onClick={() => {
                          setUnlocked(false);
                          setIdDraft(item.id);
                        }}
                        className="rounded-full border border-a-ink/12 px-4 py-2 text-[11.5px] text-a-ink/60 transition-colors hover:border-champagne"
                      >
                        {t("common.cancel")}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[11.5px] leading-relaxed text-a-ink/60">
                      {t("faqPage.editor.idLocked")}
                    </p>
                    <button
                      type="button"
                      onClick={() => setUnlocked(true)}
                      className="shrink-0 rounded-full border border-a-ink/12 px-4 py-2 text-[11.5px] text-a-accent transition-colors hover:border-champagne"
                    >
                      {t("faqPage.editor.idUnlock")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ---- placement ---- */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label={t("faqPage.editor.group")} error={fieldErrors.group}>
                <select
                  value={draft.group}
                  onChange={(e) => {
                    const next = e.target.value;
                    const target = groups.find((g) => g.key === next);
                    setDraft((d) => ({
                      ...d,
                      group: next,
                      subgroup: target?.nested ? (target.subgroups?.[0]?.key ?? null) : null,
                    }));
                  }}
                  className={inputCls}
                >
                  {groups.map((g) => (
                    <option key={g.key} value={g.key}>
                      {g.name ?? tm("faqGroups", g.key)}
                    </option>
                  ))}
                </select>
              </Field>

              {nested && (
                <Field label={t("faqPage.editor.subgroup")} error={fieldErrors.subgroup}>
                  <select
                    value={draft.subgroup ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, subgroup: e.target.value }))}
                    className={inputCls}
                  >
                    {(summary?.subgroups ?? []).map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label?.[FAQ_DEFAULT_LOCALE] || s.key}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </div>

            {/* ---- language tabs ---- */}
            <div
              role="tablist"
              aria-label={t("faqPage.editor.languages")}
              className="mt-7 flex gap-1.5 border-b border-a-ink/[0.08] pb-3"
            >
              {FAQ_LOCALES.map((locale) => {
                const done = isComplete(draft.text[locale]);
                const active = tab === locale;
                return (
                  <button
                    key={locale}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(locale)}
                    className={`group relative rounded-full px-4 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
                      active ? "text-ivory" : "text-a-ink/55 hover:text-a-accent"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="faq-lang-pill"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {locale.toUpperCase()}
                      {/* completeness marker per language */}
                      <span
                        aria-label={
                          done ? t("faqPage.complete") : t("faqPage.incomplete")
                        }
                        title={done ? t("faqPage.complete") : t("faqPage.incomplete")}
                        className={`h-1.5 w-1.5 rounded-full ${
                          done
                            ? active
                              ? "bg-ivory/80"
                              : "bg-a-gold"
                            : active
                              ? "bg-ivory/35"
                              : "bg-a-ink/20"
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ---- the text of one language ---- */}
            <div className="mt-5 grid gap-4">
              <Field
                label={t("faqPage.editor.question")}
                hint={`${text.q.length}/${LIMITS.q}`}
                error={fieldErrors[`text.${tab}.q`]}
              >
                <input
                  type="text"
                  value={text.q}
                  maxLength={LIMITS.q}
                  onChange={(e) => setText(tab, "q", e.target.value)}
                  placeholder={t("faqPage.editor.questionPlaceholder")}
                  className={inputCls}
                />
              </Field>

              <Field
                label={t("faqPage.editor.answer")}
                hint={`${text.a.length}/${LIMITS.a}`}
                error={fieldErrors[`text.${tab}.a`]}
              >
                <textarea
                  rows={7}
                  value={text.a}
                  maxLength={LIMITS.a}
                  onChange={(e) => setText(tab, "a", e.target.value)}
                  placeholder={t("faqPage.editor.answerPlaceholder")}
                  className={areaCls}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={t("faqPage.editor.linkLabel")}
                  hint={t("faqPage.editor.linkOptional")}
                  error={fieldErrors[`text.${tab}.link.label`]}
                >
                  <input
                    type="text"
                    value={text.link?.label ?? ""}
                    maxLength={LIMITS.linkLabel}
                    onChange={(e) => setLink(tab, "label", e.target.value)}
                    placeholder={t("faqPage.editor.linkLabelPlaceholder")}
                    className={inputCls}
                  />
                </Field>
                <Field
                  label={t("faqPage.editor.linkHref")}
                  hint={t("faqPage.editor.linkHrefHint")}
                  error={fieldErrors[`text.${tab}.link.href`]}
                >
                  <input
                    type="text"
                    value={text.link?.href ?? ""}
                    maxLength={LIMITS.href}
                    onChange={(e) => setLink(tab, "href", e.target.value)}
                    placeholder="/unsere-weine"
                    className={inputCls}
                  />
                </Field>
              </div>

              <p className="text-[11px] leading-relaxed text-a-ink/45">
                {t("faqPage.editor.oneLinkNote")}
              </p>
            </div>
          </div>

          {/* ---- foot ---- */}
          <div className="border-t border-a-ink/[0.08] px-6 py-4">
            {error && !error.details?.length && (
              <p role="alert" className="mb-3 rounded-xl bg-a-accent/10 px-4 py-2.5 text-[12px] text-a-accent">
                {error.message}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {!isCreate ? (
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="text-[11.5px] text-a-ink/45 underline-offset-4 transition-colors hover:text-a-accent hover:underline"
                >
                  {t("faqPage.editor.delete")}
                </button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-a-ink/12 px-5 py-2.5 text-[12px] text-a-ink/60 transition-colors hover:border-champagne"
                >
                  {t("common.cancel")}
                </button>
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-ivory disabled:opacity-50"
                >
                  {saving ? t("common.saving") : isCreate ? t("common.create") : t("common.save")}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </motion.aside>
    </AnimatePresence>
  );
}
