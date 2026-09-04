"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { LOCALE_META } from "@/lib/i18n/config";
import {
  LEGAL_MAX,
  joinParagraphs,
  sameDocument,
  splitParagraphs,
  isoToday,
} from "@/lib/legal/schema";
import { ArrowDown, ArrowUp, Plus, Trash } from "../AdminIcons";
import { useAdminI18n } from "../i18n/AdminI18n";
import LegalPreview from "./LegalPreview";
import LegalHistory from "./LegalHistory";

/* Rechtstexte-Editor — Impressum, Datenschutz, AGB in vier Sprachen.

   Zwei Achsen, und sie werden bewusst getrennt gezeigt: WELCHES Dokument
   (drei Reiter) und in WELCHER Sprachfassung (vier Reiter). Die Sprache des
   Backoffice selbst — die Umschaltung oben rechts — hat damit nichts zu tun;
   deshalb steht über der zweiten Reihe eine eigene Überschrift und stehen
   die Sprachen in ihrer Eigenbezeichnung (Deutsch, Italiano, English,
   Čeština), so wie sie auch im Sprachumschalter der Website erscheinen.

   Ein Abschnitt wird als EIN Textfeld bearbeitet, in dem eine Leerzeile
   einen Absatz trennt — die Form, in der Menschen Fließtext schreiben. Die
   Umwandlung in das Absatz-Array, das die Seite rendert, macht
   splitParagraphs() und sie ist verlustfrei umkehrbar.

   Gespeichert wird gegen /api/admin/legal; jeder Speichervorgang legt eine
   neue Fassung im Archiv an (siehe lib/legal/store.js). */

const inputCls =
  "w-full rounded-xl border border-a-ink/12 bg-a-canvas px-3.5 py-2.5 text-[13px] leading-relaxed text-a-ink transition-colors duration-300 placeholder:text-a-ink/30 focus:border-champagne focus:outline-none";
const sectionCls = "rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 p-4";
const legendCls = "mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55";
const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-lg border border-a-ink/12 text-a-ink/55 transition-colors duration-300 hover:border-champagne hover:text-a-accent disabled:opacity-30 disabled:hover:border-a-ink/12 disabled:hover:text-a-ink/55";

const Count = ({ value, max }) => (
  <span
    className={`text-[10px] tabular-nums ${
      value.length > max * 0.9 ? "text-a-accent/80" : "text-a-ink/35"
    }`}
  >
    {value.length}/{max}
  </span>
);

/* Dokument ⇄ Entwurf. Der Entwurf hält je Abschnitt EINEN Text; das Array
   der Absätze entsteht erst beim Speichern und bei der Vorschau. */
const toDraft = (doc) => ({
  title: doc.title,
  ...(doc.intro !== undefined ? { intro: doc.intro } : {}),
  sections: doc.sections.map((s) => ({ title: s.title, text: joinParagraphs(s.body) })),
  reviewedAt: doc.reviewedAt ?? null,
});

const fromDraft = (draft) => ({
  title: draft.title,
  ...(draft.intro !== undefined ? { intro: draft.intro } : {}),
  sections: draft.sections.map((s) => ({ title: s.title, body: splitParagraphs(s.text) })),
  reviewedAt: draft.reviewedAt,
});

export default function LegalEditor() {
  const { t, intl } = useAdminI18n();
  const reduced = useReducedMotion();

  const [manifest, setManifest] = useState(null);
  const [type, setType] = useState("impressum");
  const [locale, setLocale] = useState("de");
  const [record, setRecord] = useState(null);
  const [draft, setDraft] = useState(null);
  const [view, setView] = useState("preview");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null); // Reiterwechsel mit offenen Änderungen
  const [resetting, setResetting] = useState(false); // „zurück zum Code" — Rückfrage

  /* Der zuletzt angeforderte Schlüssel. Ein langsamer Abruf darf einen
     schnelleren nicht überschreiben, wenn jemand zügig durch die Reiter geht. */
  const wanted = useRef(`${type}:${locale}`);

  const loadRecord = useCallback(async (nextType, nextLocale) => {
    const stamp = `${nextType}:${nextLocale}`;
    wanted.current = stamp;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/legal?type=${nextType}&locale=${nextLocale}`,
      );
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? t("common.saveFailed", { status: res.status }));
      if (wanted.current !== stamp) return; // veraltete Antwort
      setRecord(body.data);
      setDraft(toDraft(body.data.document));
    } catch (e) {
      if (wanted.current === stamp) setError(e);
    } finally {
      if (wanted.current === stamp) setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetch("/api/admin/legal")
      .then((r) => r.json())
      .then((b) => setManifest(b.data))
      .catch((e) => setError(e));
  }, []);

  useEffect(() => {
    loadRecord(type, locale);
  }, [type, locale, loadRecord]);

  const dirty = useMemo(
    () => Boolean(record && draft && !sameDocument(record.document, fromDraft(draft))),
    [record, draft],
  );

  /* Reiterwechsel: mit offenen Änderungen erst fragen. Ein neu getippter
     Widerrufsabsatz darf nicht an einem Klick auf „IT" verloren gehen. */
  const go = (nextType, nextLocale) => {
    if (nextType === type && nextLocale === locale) return;
    if (dirty) {
      setPending({ type: nextType, locale: nextLocale });
      return;
    }
    setType(nextType);
    setLocale(nextLocale);
  };

  const discard = () => {
    if (!pending) return;
    setType(pending.type);
    setLocale(pending.locale);
    setPending(null);
  };

  /* --- Entwurfsbearbeitung --- */
  const setSection = (i, patch) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s, j) => (j === i ? { ...s, ...patch } : s)),
    }));

  const moveSection = (i, delta) =>
    setDraft((d) => {
      const next = d.sections.slice();
      const target = i + delta;
      if (target < 0 || target >= next.length) return d;
      [next[i], next[target]] = [next[target], next[i]];
      return { ...d, sections: next };
    });

  const removeSection = (i) =>
    setDraft((d) => ({ ...d, sections: d.sections.filter((_, j) => j !== i) }));

  const addSection = () =>
    setDraft((d) => ({ ...d, sections: [...d.sections, { title: "", text: "" }] }));

  /* --- Schreiben --- */
  const send = async (url, init, label) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(url, init);
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? t("common.saveFailed", { status: res.status }));
      setRecord(body.data);
      setDraft(toDraft(body.data.document));
      if (body.data.documents) setManifest((m) => (m ? { ...m, documents: body.data.documents } : m));
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2800);
      return true;
    } catch (e) {
      setError(e);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const save = () =>
    send("/api/admin/legal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, locale, ...fromDraft(draft) }),
    });

  const backToCode = async () => {
    setResetting(false);
    await send(`/api/admin/legal?type=${type}&locale=${locale}`, { method: "DELETE" });
  };

  const restore = (n) =>
    send("/api/admin/legal/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, locale, revision: n }),
    });

  /* --- Ableitungen für die Anzeige --- */
  const previewDoc = draft ? fromDraft(draft) : null;
  const edited = record?.document?.source === "edited";
  const memoryOnly = record?.persistence === "memory" || manifest?.persistence === "memory";

  const editedLocales = useMemo(() => {
    const set = new Set();
    for (const d of manifest?.documents ?? []) {
      if (d.type === type && d.source === "edited") set.add(d.locale);
    }
    return set;
  }, [manifest, type]);

  const editedTypes = useMemo(() => {
    const set = new Set();
    for (const d of manifest?.documents ?? []) if (d.source === "edited") set.add(d.type);
    return set;
  }, [manifest]);

  /* Verlauf und Statuszeile sprechen die Sprache des BACKOFFICE — sie sind
     Werkzeug. */
  const stamp = (iso) =>
    new Intl.DateTimeFormat(intl, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  /* Die Vorschau dagegen spricht die Sprache der SEITE, sonst zeigt sie
     etwas anderes als das, was draußen stehen wird — dieselben zwei Formate
     wie in lib/legal/storefront.js. */
  const pageIntl = LOCALE_META[locale]?.htmlLang ?? locale;
  const previewMonth = (iso) =>
    new Intl.DateTimeFormat(pageIntl, { month: "long", year: "numeric" }).format(new Date(iso));
  const previewDay = (iso) =>
    new Intl.DateTimeFormat(pageIntl, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${iso}T12:00:00Z`));

  const types = manifest?.types ?? ["impressum", "datenschutz", "agb"];
  const locales = manifest?.locales ?? ["de", "it", "en", "cs"];

  return (
    <section className="flex flex-col gap-5" aria-label={t("legal.sectionAria")}>
      {/* ---------------- Reiter: Dokument ---------------- */}
      <div className="flex flex-col gap-4">
        <div
          className="flex flex-wrap gap-1.5 rounded-full border border-a-ink/12 p-1"
          role="tablist"
          aria-label={t("legal.typeTabsAria")}
        >
          {types.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={type === key}
              onClick={() => go(key, locale)}
              className={`relative rounded-full px-5 py-2 text-[12.5px] transition-colors duration-300 ${
                type === key ? "text-ivory" : "text-a-ink/60 hover:text-a-accent"
              }`}
            >
              {type === key && (
                <motion.span
                  layoutId="legal-type-pill"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                  transition={
                    reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32 }
                  }
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {t(`legal.types.${key}`)}
                {editedTypes.has(key) && (
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${
                      type === key ? "bg-champagne-light" : "bg-champagne"
                    }`}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* ---------------- Reiter: Sprachfassung ---------------- */}
        <div>
          <p className={legendCls}>{t("legal.localeHeading")}</p>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label={t("legal.localeTabsAria")}
          >
            {locales.map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={locale === key}
                onClick={() => go(type, key)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12px] transition-colors duration-300 ${
                  locale === key
                    ? "border-a-accent bg-a-fill text-ivory"
                    : "border-a-ink/12 text-a-ink/60 hover:border-champagne"
                }`}
              >
                <span className="font-semibold tracking-[0.08em]">
                  {LOCALE_META[key]?.short ?? key.toUpperCase()}
                </span>
                <span className={locale === key ? "text-ivory/70" : "text-a-ink/40"}>
                  {LOCALE_META[key]?.native ?? key}
                </span>
                {editedLocales.has(key) && (
                  <span
                    aria-hidden="true"
                    title={t("legal.editedDot")}
                    className={`h-1.5 w-1.5 rounded-full ${
                      locale === key ? "bg-champagne-light" : "bg-champagne"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- Hinweise ---------------- */}
      {memoryOnly && (
        <p
          role="status"
          className="rounded-xl border border-a-accent/25 bg-a-accent/[0.06] px-4 py-3 text-[12px] leading-relaxed text-a-accent"
        >
          {t("legal.memoryWarning")}
        </p>
      )}

      {locale !== "de" && (
        <p className="rounded-xl border border-champagne/40 bg-champagne/[0.09] px-4 py-3 text-[12px] leading-relaxed text-a-gold">
          {t("legal.translationHint")}
        </p>
      )}

      <AnimatePresence>
        {pending && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alertdialog"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-a-accent/30 bg-a-accent/[0.07] px-4 py-3"
          >
            <p className="text-[12px] text-a-accent">{t("legal.switchWarning")}</p>
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={discard}
                className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-4 py-1.5 text-[11.5px] font-medium text-ivory"
              >
                {t("legal.switchDiscard")}
              </button>
              <button
                type="button"
                onClick={() => setPending(null)}
                className="text-[11.5px] text-a-ink/55 transition-colors hover:text-a-accent"
              >
                {t("legal.switchStay")}
              </button>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p role="alert" className="rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
          {error.message}
        </p>
      )}

      {loading || !draft || !record ? (
        <div className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/50 p-10 text-center text-[12.5px] text-a-ink/45">
          {t("legal.loading")}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          {/* ---------------- Editor ---------------- */}
          <motion.div
            key={`${type}-${locale}`}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 24 }}
            className="flex flex-col gap-4"
          >
            {/* Stand des Dokuments */}
            <div className={`${sectionCls} flex flex-wrap items-center justify-between gap-3`}>
              <div className="min-w-0">
                <p className="text-[12px] text-a-ink/70">
                  {edited
                    ? t("legal.statusEdited", {
                        n: record.document.revision,
                        date: stamp(record.document.updatedAt),
                        who: record.document.updatedBy,
                      })
                    : t("legal.statusCode")}
                </p>
                <p className="mt-0.5 text-[10.5px] text-a-ink/40">
                  {t("legal.sectionsN", { n: draft.sections.length })} ·{" "}
                  {t("legal.revisionsN", { n: record.revisions.length })}
                </p>
              </div>
              {edited && (
                <span className="shrink-0">
                  {resetting ? (
                    <span className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={backToCode}
                        className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-4 py-1.5 text-[11.5px] font-medium text-ivory disabled:opacity-50"
                      >
                        {t("legal.backToCodeYes")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setResetting(false)}
                        className="text-[11.5px] text-a-ink/55 transition-colors hover:text-a-accent"
                      >
                        {t("common.cancel")}
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setResetting(true)}
                      className="rounded-full border border-a-ink/12 px-4 py-1.5 text-[11.5px] text-a-ink/60 transition-colors hover:border-champagne hover:text-a-accent"
                    >
                      {t("legal.backToCode")}
                    </button>
                  )}
                </span>
              )}
            </div>

            {resetting && (
              <p className="rounded-xl border border-a-accent/25 bg-a-accent/[0.06] px-4 py-3 text-[11.5px] leading-relaxed text-a-accent">
                {t("legal.backToCodeConfirm")}
              </p>
            )}

            {/* Titel + Lede */}
            <div className={sectionCls}>
              <label className="block">
                <span className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55">
                    {t("legal.fieldTitle")}
                  </span>
                  <Count value={draft.title} max={LEGAL_MAX.title} />
                </span>
                <input
                  className={inputCls}
                  maxLength={LEGAL_MAX.title}
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                />
              </label>

              {draft.intro !== undefined && (
                <label className="mt-4 block">
                  <span className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55">
                      {t("legal.fieldIntro")}
                    </span>
                    <Count value={draft.intro} max={LEGAL_MAX.intro} />
                  </span>
                  <textarea
                    className={inputCls}
                    rows={3}
                    maxLength={LEGAL_MAX.intro}
                    value={draft.intro}
                    onChange={(e) => setDraft((d) => ({ ...d, intro: e.target.value }))}
                  />
                </label>
              )}
            </div>

            {/* Abschnitte */}
            <div className={sectionCls}>
              <p className={legendCls}>{t("legal.sectionsHeading")}</p>
              <p className="-mt-1 mb-4 text-[11px] leading-relaxed text-a-ink/45">
                {t("legal.bodyHint")}
              </p>

              <ol className="flex flex-col gap-4">
                {draft.sections.map((s, i) => {
                  const paragraphs = splitParagraphs(s.text).length;
                  return (
                    <li
                      key={i}
                      className="rounded-xl border border-a-ink/[0.07] bg-a-canvas/60 p-3.5"
                    >
                      <div className="mb-2.5 flex items-center justify-between gap-2">
                        <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-a-accent/60 tabular-nums">
                          {t("legal.sectionN", { n: i + 1 })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className={iconBtn}
                            disabled={i === 0}
                            aria-label={t("legal.moveUp")}
                            title={t("legal.moveUp")}
                            onClick={() => moveSection(i, -1)}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className={iconBtn}
                            disabled={i === draft.sections.length - 1}
                            aria-label={t("legal.moveDown")}
                            title={t("legal.moveDown")}
                            onClick={() => moveSection(i, 1)}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className={`${iconBtn} hover:border-a-accent hover:text-a-accent`}
                            disabled={draft.sections.length === 1}
                            aria-label={t("legal.removeSection")}
                            title={
                              draft.sections.length === 1
                                ? t("legal.removeLast")
                                : t("legal.removeSection")
                            }
                            onClick={() => removeSection(i)}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </span>
                      </div>

                      <label className="block">
                        <span className="sr-only">{t("legal.fieldSection")}</span>
                        <input
                          className={inputCls}
                          maxLength={LEGAL_MAX.sectionTitle}
                          placeholder={t("legal.sectionTitlePlaceholder")}
                          value={s.title}
                          onChange={(e) => setSection(i, { title: e.target.value })}
                        />
                      </label>

                      <label className="mt-2.5 block">
                        <span className="sr-only">{t("legal.fieldBody")}</span>
                        <textarea
                          className={inputCls}
                          rows={Math.min(18, Math.max(4, s.text.split("\n").length + 2))}
                          placeholder={t("legal.bodyPlaceholder")}
                          value={s.text}
                          onChange={(e) => setSection(i, { text: e.target.value })}
                        />
                      </label>

                      <p className="mt-1.5 text-[10px] text-a-ink/40">
                        {t(paragraphs === 1 ? "legal.paragraphOne" : "legal.paragraphsN", {
                          n: paragraphs,
                        })}
                      </p>
                    </li>
                  );
                })}
              </ol>

              <motion.button
                type="button"
                onClick={addSection}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-a-ink/15 py-3 text-[12px] text-a-ink/55 transition-colors duration-300 hover:border-champagne hover:text-a-accent"
              >
                <Plus className="h-4 w-4" />
                {t("legal.addSection")}
              </motion.button>
            </div>

            {/* Prüfdatum */}
            <div className={sectionCls}>
              <p className={legendCls}>{t("legal.reviewHeading")}</p>
              <p className="-mt-1 mb-3 text-[11px] leading-relaxed text-a-ink/45">
                {t("legal.reviewHint")}
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="date"
                  className={`${inputCls} w-auto`}
                  value={draft.reviewedAt ?? ""}
                  aria-label={t("legal.reviewHeading")}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, reviewedAt: e.target.value || null }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, reviewedAt: isoToday() }))}
                  className="rounded-full border border-a-ink/12 px-4 py-2 text-[11.5px] text-a-ink/60 transition-colors hover:border-champagne hover:text-a-accent"
                >
                  {t("legal.reviewToday")}
                </button>
                {draft.reviewedAt && (
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, reviewedAt: null }))}
                    className="text-[11.5px] text-a-ink/45 transition-colors hover:text-a-accent"
                  >
                    {t("legal.reviewClear")}
                  </button>
                )}
              </div>
            </div>

            {/* Speichern */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <AnimatePresence>
                {dirty && (
                  <motion.span
                    initial={reduced ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11.5px] text-a-accent"
                  >
                    {t("legal.unsaved")}
                  </motion.span>
                )}
              </AnimatePresence>
              <div className="ml-auto flex items-center gap-3">
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
                  className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-7 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-opacity disabled:opacity-40"
                >
                  {saving ? t("common.saving") : t("legal.publish")}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ---------------- Vorschau / Verlauf ---------------- */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 24, delay: reduced ? 0 : 0.06 }}
            className="flex flex-col gap-3 lg:sticky lg:top-2 lg:self-start"
          >
            <div
              className="grid grid-cols-2 gap-1 rounded-full border border-a-ink/12 p-1"
              role="tablist"
              aria-label={t("legal.viewAria")}
            >
              {[
                { key: "preview", label: t("legal.viewPreview") },
                { key: "history", label: t("legal.viewHistory") },
              ].map((v) => (
                <button
                  key={v.key}
                  type="button"
                  role="tab"
                  aria-selected={view === v.key}
                  onClick={() => setView(v.key)}
                  className={`relative rounded-full px-4 py-1.5 text-[11.5px] transition-colors duration-300 ${
                    view === v.key ? "text-ivory" : "text-a-ink/55 hover:text-a-accent"
                  }`}
                >
                  {view === v.key && (
                    <motion.span
                      layoutId="legal-view-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                      transition={
                        reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32 }
                      }
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    {v.label}
                    {v.key === "history" && record.revisions.length > 0 && (
                      <span
                        className={`rounded-full px-1.5 text-[9.5px] tabular-nums ${
                          view === v.key ? "bg-ivory/20 text-ivory" : "bg-a-ink/[0.08] text-a-ink/50"
                        }`}
                      >
                        {record.revisions.length}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>

            {view === "preview" ? (
              <LegalPreview
                shell={record.shell}
                title={previewDoc.title}
                intro={previewDoc.intro}
                sections={previewDoc.sections}
                /* Was NACH dem Speichern dort stünde: Bei offenen Änderungen
                   wäre der Stand heute, sonst der der laufenden Fassung.
                   Unverändert bleibt es das Datum aus der Inhaltsdatei. */
                updated={
                  dirty
                    ? previewMonth(new Date().toISOString())
                    : edited
                      ? previewMonth(record.document.updatedAt)
                      : undefined
                }
                reviewed={draft.reviewedAt ? previewDay(draft.reviewedAt) : undefined}
              />
            ) : record.revisions.length ? (
              <LegalHistory
                revisions={record.revisions}
                active={edited ? record.document.revision : null}
                onRestore={restore}
                busy={saving}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-a-ink/12 p-8 text-center text-[12px] leading-relaxed text-a-ink/45">
                {t("legal.historyEmpty")}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}
