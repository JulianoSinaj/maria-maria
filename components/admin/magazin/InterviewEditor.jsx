"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ExternalLink } from "@/components/admin/AdminIcons";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";
import {
  useInterview,
  useInterviewOptions,
  saveInterview,
  publishInterview,
  unpublishInterview,
  uploadInterviewImage,
} from "@/lib/interviews/useInterviews";
import {
  INTERVIEW_LOCALES,
  REQUIRED_LOCALE,
  PORTRAIT_POSITIONS,
  blankLocaleContent,
  isLocaleEmpty,
  localeCompleteness,
  validateRecord,
} from "@/lib/interviews/schema";
import { Field, TextInput, Select, Group, primaryBtn, ghostBtn } from "./editorFields";
import ImageField from "./ImageField";
import LocaleContentForm from "./LocaleContentForm";

const DOT = { complete: "bg-vine", partial: "bg-a-gold", missing: "bg-a-ink/15" };

/* The interview editor — everything one piece owns: the shared facts (slug
   identity shown but not editable, wine, region, portrait, ghost word), a
   language tab per locale with the full article form, and the publish
   controls. German is always present; another language tab starts blank
   and is dropped again on save if it stays that way — so opening a tab by
   mistake never creates an empty override the storefront would prefer over
   the German fallback. */

export default function InterviewEditor({ slug }) {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();
  const { record: loaded, meta, loading, error: loadError, refetch } = useInterview(slug);
  const { options } = useInterviewOptions();

  const [record, setRecord] = useState(null);
  const [tab, setTab] = useState(REQUIRED_LOCALE);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [toast, setToast] = useState(null);
  const [publishDate, setPublishDate] = useState("");

  useEffect(() => {
    if (loaded) {
      setRecord(structuredClone(loaded));
      setDirty(false);
      setPublishDate(loaded.publishedAt ?? "");
    }
  }, [loaded]);

  const flash = (message, tone = "ok") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  };

  const set = (path, v) => {
    setRecord((r) => {
      const next = structuredClone(r);
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i += 1) cur = cur[keys[i]];
      cur[keys.at(-1)] = v;
      return next;
    });
    setDirty(true);
  };

  const setLocale = (locale, content) => {
    setRecord((r) => ({ ...r, locales: { ...r.locales, [locale]: content } }));
    setDirty(true);
  };

  const completeness = useMemo(() => (record ? localeCompleteness(record) : {}), [record]);
  const clientErrors = useMemo(
    () => (record ? validateRecord(record, { wineSlugs: options?.wineSlugs ?? null }) : []),
    [record, options],
  );

  const save = async () => {
    if (!record) return;
    setSaving(true);
    setSaveError(null);
    try {
      const body = await saveInterview(record.slug, record);
      setRecord(structuredClone(body.data));
      setDirty(false);
      flash(t("magazine.editor.saved"));
      refetch();
    } catch (err) {
      setSaveError(err);
      flash(err.details?.length ? err.details.join(" · ") : err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      if (dirty) await saveInterview(record.slug, record);
      const body = await publishInterview(record.slug, publishDate || undefined);
      setRecord(structuredClone(body.data));
      setDirty(false);
      const og = body.meta?.og;
      flash(
        og && !og.ok
          ? t("magazine.editor.publishedNoOg", { reason: og.error ?? "" })
          : t("magazine.editor.published"),
        og && !og.ok ? "warn" : "ok",
      );
      refetch();
    } catch (err) {
      setSaveError(err);
      flash(err.details?.length ? err.details.join(" · ") : err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const withdraw = async () => {
    setSaving(true);
    try {
      const body = await unpublishInterview(record.slug);
      setRecord(structuredClone(body.data));
      setDirty(false);
      flash(t("magazine.editor.withdrawn"));
      refetch();
    } catch (err) {
      flash(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !record) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-a-ink/[0.05]" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
    );
  }

  if (loadError || !record) {
    return (
      <div className="rounded-card-lg border border-dashed border-a-ink/15 bg-a-surface/40 px-8 py-14 text-center">
        <p className="font-playfair text-[19px] text-a-ink">{t("magazine.editor.notFound")}</p>
        <Link href="/admin/magazin" className="mt-4 inline-block text-[12.5px] text-a-accent">
          {t("magazine.editor.backToList")}
        </Link>
      </div>
    );
  }

  const activeLocales = INTERVIEW_LOCALES.filter((l) => l === REQUIRED_LOCALE || record.locales[l]);
  const inactiveLocales = INTERVIEW_LOCALES.filter((l) => !activeLocales.includes(l));

  return (
    <div className="space-y-6 pb-24">
      {/* ---- identity strip ---- */}
      <div className="rounded-2xl border border-a-ink/[0.08] bg-a-surface/60 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[12px] text-a-ink/50">/{record.slug}</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] ${
              record.status === "published" ? "bg-vine/12 text-vine" : "bg-a-ink/[0.07] text-a-ink/50"
            }`}
          >
            {t(`magazine.status.${record.status}`)}
          </span>
          {meta?.source === "code" && (
            <span className="rounded-full bg-a-ink/[0.06] px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-a-ink/45">
              {t("magazine.list.sourceCode")}
            </span>
          )}
          <span className="ml-auto flex items-center gap-3">
            {activeLocales.map((l) => (
              <span key={l} className="flex items-center gap-1.5" title={l.toUpperCase()}>
                <span className={`h-1.5 w-1.5 rounded-full ${DOT[completeness[l]] ?? DOT.missing}`} />
                <span className="text-[10px] uppercase tracking-[0.1em] text-a-ink/45">{l}</span>
              </span>
            ))}
          </span>
        </div>
        {meta?.source === "code" && (
          <p className="mt-2 text-[11.5px] text-a-ink/45">{t("magazine.editor.codeNote")}</p>
        )}
      </div>

      {/* ---- shared facts ---- */}
      <Group title={t("magazine.editor.groups.shared")} hint={t("magazine.editor.groupHints.shared")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("magazine.editor.fields.wine")} hint={t("magazine.editor.fieldHints.wine")}>
            <Select value={record.wine?.slug} onChange={(v) => set("wine.slug", v)}>
              <option value="">—</option>
              {(options?.wines ?? []).map((w) => (
                <option key={w.slug} value={w.slug}>
                  {w.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("magazine.editor.fields.wineHref")} hint={t("magazine.editor.fieldHints.wineHref")}>
            <TextInput value={record.wine?.href} onChange={(v) => set("wine.href", v)} placeholder="/unsere-weine?region=…" />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("magazine.editor.fields.region")} hint={t("magazine.editor.fieldHints.region")}>
            <Select value={record.region} onChange={(v) => set("region", v)}>
              <option value="">—</option>
              {(options?.regions ?? []).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("magazine.editor.fields.ghost")} hint={t("magazine.editor.fieldHints.ghost")}>
            <TextInput value={record.ghost} onChange={(v) => set("ghost", v)} placeholder="Terroir" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageField
            label={t("magazine.editor.fields.portrait")}
            hint={t("magazine.editor.fieldHints.portrait")}
            value={record.portrait?.src}
            onChange={(v) => set("portrait.src", v)}
            images={options?.images ?? []}
            required
            aspect="aspect-square"
          />
          <div className="space-y-4">
            <Field label={t("magazine.editor.fields.portraitPosition")}>
              <Select value={record.portrait?.position} onChange={(v) => set("portrait.position", v)}>
                {PORTRAIT_POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {t(`magazine.editor.portraitPositions.${p}`)}
                  </option>
                ))}
              </Select>
            </Field>
            <ImageField
              label={t("magazine.editor.fields.portraitArticle")}
              hint={t("magazine.editor.fieldHints.portraitArticle")}
              value={record.portrait?.article}
              onChange={(v) => set("portrait.article", v)}
              images={options?.images ?? []}
              aspect="aspect-square"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageField
            label={t("magazine.editor.fields.teaserPortrait")}
            hint={t("magazine.editor.fieldHints.teaserPortrait")}
            value={record.teaserPortrait}
            onChange={(v) => set("teaserPortrait", v)}
            images={options?.images ?? []}
            aspect="aspect-[4/5]"
          />
          <ImageField
            label={t("magazine.editor.fields.winePhoto")}
            hint={t("magazine.editor.fieldHints.winePhoto")}
            value={record.winePhoto}
            onChange={(v) => set("winePhoto", v)}
            images={options?.images ?? []}
          />
        </div>

        <ImageField
          label={t("magazine.editor.fields.og")}
          hint={t("magazine.editor.fieldHints.og")}
          value={record.og}
          onChange={(v) => set("og", v)}
          images={options?.images ?? []}
          aspect="aspect-[1.91/1]"
        />
        {meta?.og && (
          <p className="text-[11px] text-a-ink/45">
            {meta.og.exists
              ? t("magazine.editor.ogExists", { path: meta.og.path })
              : t("magazine.editor.ogMissing")}
          </p>
        )}
      </Group>

      {/* ---- language tabs ---- */}
      <div className="sticky top-[76px] z-10 -mx-1 flex flex-wrap items-center gap-2 border-b border-a-ink/[0.08] bg-a-canvas/95 px-1 py-3 backdrop-blur">
        {activeLocales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setTab(l)}
            aria-current={tab === l ? "true" : undefined}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] transition-colors ${
              tab === l ? "bg-a-fill text-ivory" : "border border-a-ink/12 text-a-ink/60 hover:border-champagne"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${tab === l ? "bg-ivory" : DOT[completeness[l]] ?? DOT.missing}`} />
            {l.toUpperCase()}
            {l === REQUIRED_LOCALE && <span className="text-[9px] opacity-60">•</span>}
          </button>
        ))}
        {inactiveLocales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => {
              setLocale(l, blankLocaleContent());
              setTab(l);
            }}
            className="flex items-center gap-1.5 rounded-full border border-dashed border-a-ink/15 px-3.5 py-2 text-[11px] text-a-ink/40 transition-colors hover:border-champagne hover:text-a-accent"
          >
            + {l.toUpperCase()}
          </button>
        ))}
        <a
          href={`/api/admin/interviews/${record.slug}/preview?locale=${tab}`}
          target="_blank"
          rel="noreferrer"
          className={`${ghostBtn} ml-auto`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t("magazine.list.preview")}
        </a>
      </div>

      {/* ---- the active language's content ---- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
        >
          {tab !== REQUIRED_LOCALE && isLocaleEmpty(record.locales[tab]) && (
            <p className="mb-4 rounded-xl border border-champagne/40 bg-champagne/10 px-4 py-3 text-[12px] text-a-ink/65">
              {t("magazine.editor.fallbackNote")}
            </p>
          )}
          <LocaleContentForm
            locale={tab}
            value={record.locales[tab] ?? blankLocaleContent()}
            onChange={(next) => setLocale(tab, next)}
            options={options}
            onUploaded={() => refetch()}
            resetKey={record.slug}
            region={record.region}
            hasWine={!!record.wine?.slug}
          />
          {tab !== REQUIRED_LOCALE && (
            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={() => {
                  setLocale(tab, null);
                  setTab(REQUIRED_LOCALE);
                }}
                className="text-[11.5px] text-a-ink/40 transition-colors hover:text-a-accent"
              >
                {t("magazine.editor.dropLocale", { locale: tab.toUpperCase() })}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {clientErrors.length > 0 && (
        <div className="rounded-xl border border-a-accent/25 bg-a-accent/[0.06] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-a-accent">
            {t("magazine.editor.issues", { n: clientErrors.length })}
          </p>
          <ul className="mt-2 space-y-1 text-[11.5px] text-a-ink/65">
            {clientErrors.slice(0, 8).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- publish controls, fixed at the foot ---- */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-a-ink/[0.08] bg-a-canvas/95 px-5 py-4 backdrop-blur lg:pl-[calc(276px+1.25rem)] lg:pr-9">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-3">
          <span className="text-[11px] text-a-ink/40">
            {dirty ? t("magazine.editor.unsaved") : t("magazine.editor.upToDate")}
          </span>
          <span className="ml-auto flex flex-wrap items-center gap-3">
            {record.status !== "published" && (
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="h-11 rounded-xl border border-a-ink/12 bg-a-surface/70 px-3 text-[12.5px] text-a-ink focus:border-champagne focus:outline-none"
              />
            )}
            <button type="button" onClick={save} disabled={saving} className={ghostBtn}>
              {saving ? t("common.saving") : t("common.save")}
            </button>
            {record.status === "published" ? (
              <button type="button" onClick={withdraw} disabled={saving} className={`${ghostBtn} border-a-accent/30 text-a-accent`}>
                {t("magazine.editor.withdraw")}
              </button>
            ) : (
              <button type="button" onClick={publish} disabled={saving} className={primaryBtn}>
                {t("magazine.editor.publish")}
              </button>
            )}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={`fixed bottom-24 left-1/2 z-[95] -translate-x-1/2 rounded-full px-6 py-3.5 text-[12.5px] shadow-glass ${
              toast.tone === "error" ? "bg-a-fill text-ivory" : toast.tone === "warn" ? "bg-a-gold text-espresso" : "bg-espresso text-ivory"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
