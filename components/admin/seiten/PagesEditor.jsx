"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PAGE_ORDER } from "@/lib/pages/blocks";
import { LOCALES, LOCALE_META, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { useAdminI18n } from "../i18n/AdminI18n";
import BlockCard from "./BlockCard";

/* Seiten-Editor — the fixed text blocks of the storefront pages.

   One tab per page, one card per block, four storefront languages behind a
   segmented switch. Drafts are kept per page × language × block, so moving
   between tabs never loses a half-typed line; a beforeunload guard covers
   the browser tab itself. Data comes from /api/admin/pages, which also
   returns the override summary every time — the tab counters are never
   stale relative to the cards. */

const PILL_SPRING = { type: "spring", stiffness: 340, damping: 32 };
const JSON_HEADERS = { "Content-Type": "application/json" };

function PageTabs({ value, onChange, counts }) {
  const reduced = useReducedMotion();
  const { t } = useAdminI18n();
  return (
    <div
      role="tablist"
      aria-label={t("pagesPage.tabsAria")}
      className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
    >
      {PAGE_ORDER.map((key) => {
        const active = value === key;
        const count = counts[key];
        return (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={`group relative shrink-0 rounded-full px-4 py-2.5 text-left transition-colors duration-300 ${
              active ? "text-ivory" : "text-a-ink/60 hover:text-a-accent"
            }`}
          >
            {active && (
              <motion.span
                layoutId="pages-tab-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                transition={reduced ? { duration: 0 } : PILL_SPRING}
              />
            )}
            {!active && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-a-ink/12 transition-colors duration-300 group-hover:border-champagne"
              />
            )}
            <span className="relative z-10 flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-[12.5px] font-medium tracking-[0.02em]">
                {t(`pagesPage.tabs.${key}`)}
              </span>
              {count > 0 && (
                <span className={`text-[10.5px] tabular-nums ${active ? "text-ivory/65" : "text-a-accent/80"}`}>
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function LocaleSwitch({ value, onChange }) {
  const reduced = useReducedMotion();
  const { t } = useAdminI18n();
  return (
    <div
      role="radiogroup"
      aria-label={t("pagesPage.localeAria")}
      className="relative flex items-center gap-0.5 rounded-full border border-a-ink/12 bg-a-canvas p-1"
    >
      {LOCALES.map((locale) => {
        const active = value === locale;
        return (
          <button
            key={locale}
            type="button"
            role="radio"
            aria-checked={active}
            title={LOCALE_META[locale]?.native}
            onClick={() => onChange(locale)}
            className={`relative rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] transition-colors duration-300 ${
              active ? "text-ivory" : "text-a-ink/55 hover:text-a-accent"
            }`}
          >
            {active && (
              <motion.span
                layoutId="pages-locale-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                transition={reduced ? { duration: 0 } : PILL_SPRING}
              />
            )}
            <span className="relative z-10">{LOCALE_META[locale]?.short ?? locale.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function PagesEditor() {
  const { t } = useAdminI18n();
  const [page, setPage] = useState(PAGE_ORDER[0]);
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [blocks, setBlocks] = useState(null);
  const [reference, setReference] = useState(null);
  const [overrides, setOverrides] = useState({});
  const [drafts, setDrafts] = useState({});
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const draftKey = (blockKey) => `${page}:${locale}:${blockKey}`;

  const load = useCallback(async (nextPage, nextLocale) => {
    const id = ++requestId.current;
    setError(null);
    setBlocks(null);
    try {
      const [main, ref] = await Promise.all([
        fetch(`/api/admin/pages?page=${nextPage}&locale=${nextLocale}`),
        nextLocale !== DEFAULT_LOCALE
          ? fetch(`/api/admin/pages?page=${nextPage}&locale=${DEFAULT_LOCALE}`)
          : Promise.resolve(null),
      ]);
      const body = await main.json().catch(() => null);
      if (!main.ok) throw new Error(body?.error ?? `HTTP ${main.status}`);
      const refBody = ref ? await ref.json().catch(() => null) : null;
      if (id !== requestId.current) return; /* a newer tab/locale won */
      setBlocks(body.data.blocks);
      setOverrides(body.data.overrides ?? {});
      setReference(
        refBody?.data?.blocks
          ? Object.fromEntries(refBody.data.blocks.map((b) => [b.key, b.value]))
          : null,
      );
    } catch (e) {
      if (id === requestId.current) setError(e);
    }
  }, []);

  useEffect(() => {
    load(page, locale);
  }, [page, locale, load]);

  /* unsaved drafts across every tab and language */
  const dirtyCount = Object.keys(drafts).length;
  useEffect(() => {
    if (!dirtyCount) return undefined;
    const guard = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirtyCount]);

  const setDraft = (blockKey, value) =>
    setDrafts((all) => {
      const next = { ...all };
      if (value === undefined) delete next[draftKey(blockKey)];
      else next[draftKey(blockKey)] = value;
      return next;
    });

  const absorb = (blockKey, body) => {
    setBlocks((all) => all?.map((b) => (b.key === blockKey ? body.data.block : b)) ?? all);
    setOverrides(body.data.overrides ?? {});
    setDraft(blockKey, undefined);
  };

  const save = async (blockKey, value) => {
    const res = await fetch("/api/admin/pages", {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify({ page, block: blockKey, locale, value }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.error ?? t("common.saveFailed", { status: res.status }));
    absorb(blockKey, body);
  };

  const reset = async (blockKey) => {
    const query = new URLSearchParams({ page, block: blockKey, locale });
    const res = await fetch(`/api/admin/pages?${query}`, { method: "DELETE" });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.error ?? t("common.saveFailed", { status: res.status }));
    absorb(blockKey, body);
  };

  const counts = useMemo(
    () => Object.fromEntries(PAGE_ORDER.map((key) => [key, Object.keys(overrides[key] ?? {}).length])),
    [overrides],
  );

  const changed = blocks?.filter((b) => b.overridden).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <PageTabs value={page} onChange={setPage} counts={counts} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <LocaleSwitch value={locale} onChange={setLocale} />
          {locale !== DEFAULT_LOCALE && (
            <span className="text-[11.5px] text-a-ink/50">{t("pagesPage.referenceHint")}</span>
          )}
        </div>
        <p className="text-[11.5px] tabular-nums text-a-ink/50">
          {blocks && t("pagesPage.summary", { total: blocks.length, changed })}
          {dirtyCount > 0 && (
            <span className="text-a-accent"> · {t("pagesPage.unsaved", { count: dirtyCount })}</span>
          )}
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
          {t("pagesPage.loadError", { message: error.message })}
        </p>
      )}

      {!blocks && !error && (
        <div className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/50 p-10 text-center text-[12.5px] text-a-ink/45">
          {t("pagesPage.loading")}
        </div>
      )}

      {blocks && (
        <ul key={`${page}:${locale}`} className="flex flex-col gap-3.5">
          {blocks.map((block, i) => (
            <BlockCard
              key={block.key}
              index={i}
              page={page}
              block={block}
              reference={reference?.[block.key]}
              locale={locale}
              draft={drafts[draftKey(block.key)]}
              onDraft={(value) => setDraft(block.key, value)}
              onSave={(value) => save(block.key, value)}
              onReset={() => reset(block.key)}
              onDiscard={() => setDraft(block.key, undefined)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
