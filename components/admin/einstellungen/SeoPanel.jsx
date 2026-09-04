"use client";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LOCALE_META } from "@/lib/i18n/config";
import { SEO_ENTRIES, SEO_BUDGET, SEO_MAX, renderedTitle } from "@/lib/settings/schema";
import { useAdminI18n } from "../i18n/AdminI18n";
import { Budget, ChangedMark, Note, Panel, boxCls, inputCls, legendCls } from "./shared";

/* Gruppe „SEO" — Titel und Description je Seite und Sprache.

   VIER Sprachen, nicht drei: Die Storefront spricht Deutsch, Italienisch,
   Englisch und Tschechisch. Das Backoffice selbst spricht nur drei (DE/IT/EN,
   components/admin/i18n) — die Sprachumschalter oben rechts und hier haben
   deshalb nichts miteinander zu tun, und der Hinweis unter den Reitern sagt
   das auch.

   Die Ergebnisvorschau ist kein Schmuck. Ein Titel ist gut oder schlecht in
   der Zeile, in der er erscheint, nicht als Zeichenkette in einem Feld —
   und der Markenname, den das title.template anhängt, ist Teil dieser Zeile,
   zählt gegen die sechzig Zeichen und steht in keinem Eingabefeld. */

const SPRING = { type: "spring", stiffness: 340, damping: 32 };

/* Wie Google die Zeile beschneidet: hinten, mit Auslassungszeichen. Die
   Vorschau tut dasselbe, sonst zeigt sie einen Satz, den nie jemand sieht. */
const clamp = (text, budget) =>
  text.length > budget ? `${text.slice(0, budget - 1).trimEnd()}…` : text;

export default function SeoPanel({ record, onSaved, onLocaleChange }) {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();

  const locales = record.locales;
  const [locale, setLocale] = useState(record.defaultLocale);
  const [draft, setDraft] = useState(() => structuredClone(record.seo));
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  const pages = draft[locale] ?? {};

  /* Was gegenüber dem GESPEICHERTEN Stand offen ist — nicht gegenüber dem
     Code. Der Unterschied zum Code steht am einzelnen Feld. */
  const pending = useMemo(() => {
    const out = [];
    for (const l of locales) {
      for (const key of Object.keys(draft[l] ?? {})) {
        const a = draft[l][key].value;
        const b = record.seo[l]?.[key]?.value ?? {};
        if (a.title !== b.title || a.description !== b.description) out.push({ locale: l, key });
      }
    }
    return out;
  }, [draft, record.seo, locales]);

  const set = (key, field, value) =>
    setDraft((d) => ({
      ...d,
      [locale]: {
        ...d[locale],
        [key]: { ...d[locale][key], value: { ...d[locale][key].value, [field]: value } },
      },
    }));

  const revert = (key, field) =>
    set(key, field, draft[locale][key].seed[field] ?? "");

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      /* Nur die Sprachen und Seiten, die sich geändert haben — ein Patch
         über alle 44 Paare wäre gültig, aber er würde jede Änderung
         mitschicken, die jemand anders inzwischen gespeichert hat. */
      const patch = {};
      for (const { locale: l, key } of pending) {
        (patch[l] ??= {})[key] = { ...draft[l][key].value };
      }
      const next = await onSaved({ seo: patch });
      setDraft(structuredClone(next.seo));
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2800);
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const switchLocale = (next) => {
    setLocale(next);
    onLocaleChange?.(next);
  };

  return (
    <Panel>
      {/* ------------------------- Sprache + Speichern ---------------------- */}
      <div className="sticky top-0 z-20 -mx-1 mb-5 bg-a-canvas/90 px-1 pb-4 pt-1 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label={t("settings.seo.localeAria")}
            className="no-scrollbar flex gap-1.5 overflow-x-auto"
          >
            {locales.map((code) => {
              const active = code === locale;
              /* Zahl der geänderten Felder, nicht der Seiten — dieselbe Zählung
                 wie im Gruppenreiter darüber, sonst widersprechen sich zwei
                 Zähler auf einem Bildschirm. */
              const changed = Object.values(record.summary.seo?.[code] ?? {}).reduce(
                (n, fields) => n + fields.length,
                0,
              );
              return (
                <button
                  key={code}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  lang={LOCALE_META[code]?.htmlLang}
                  onClick={() => switchLocale(code)}
                  className={`group relative shrink-0 rounded-full px-4 py-2.5 transition-colors duration-300 ${
                    active ? "text-ivory" : "text-a-ink/60 hover:text-a-accent"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="seo-locale-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                      transition={reduced ? { duration: 0 } : SPRING}
                    />
                  )}
                  {!active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-a-ink/12 transition-colors duration-300 group-hover:border-champagne"
                    />
                  )}
                  <span className="relative z-10 flex items-baseline gap-2 whitespace-nowrap">
                    <span className="text-[12.5px] font-medium">{LOCALE_META[code]?.native ?? code}</span>
                    {changed > 0 && (
                      <span
                        className={`text-[10.5px] tabular-nums ${active ? "text-ivory/65" : "text-a-ink/35"}`}
                        title={t("settings.seo.changedCount", { n: changed })}
                      >
                        {changed}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {error && (
              <span role="alert" className="max-w-[40ch] text-right text-[11.5px] leading-snug text-a-accent">
                {error.message}
              </span>
            )}
            {!error && savedAt && (
              <span role="status" className="text-[11.5px] font-medium text-vine">
                {t("common.saved")}
              </span>
            )}
            <motion.button
              type="button"
              disabled={saving || !pending.length}
              onClick={save}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-opacity disabled:opacity-40"
            >
              {saving
                ? t("common.saving")
                : pending.length
                  ? t("settings.seo.savePending", { n: pending.length })
                  : t("common.save")}
            </motion.button>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-a-ink/40">
          {t("settings.seo.localeNote")}
        </p>
      </div>

      {/* ------------------------------ Die Seiten -------------------------- */}
      <div className="flex flex-col gap-4">
        {SEO_ENTRIES.map((entry) => {
          const row = pages[entry.key];
          if (!row) return null;
          const { value, seed, absolute } = row;
          const suffix = absolute ? "" : record.brandSuffix;
          const shown = renderedTitle(value.title, { absolute, brandSuffix: record.brandSuffix });

          return (
            <section key={entry.key} className={boxCls}>
              <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="font-playfair text-[16px] text-a-ink">
                    {t(`settings.seo.pages.${entry.key}`)}
                  </h3>
                  {entry.route && (
                    <code className="text-[11px] text-a-ink/40">{entry.route}</code>
                  )}
                </div>
                {absolute && (
                  <span
                    className="rounded-full border border-a-ink/12 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-a-ink/45"
                    title={t("settings.seo.absoluteHint")}
                  >
                    {t("settings.seo.absolute")}
                  </span>
                )}
              </header>

              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start">
                <div className="flex flex-col gap-3.5">
                  {/* -------------------------- Titel ------------------------ */}
                  <label className="block">
                    <span className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-a-ink/50">
                          {t("settings.seo.title")}
                        </span>
                        {value.title !== seed.title && (
                          <ChangedMark onRevert={() => revert(entry.key, "title")} />
                        )}
                      </span>
                      <Budget
                        length={shown.length}
                        budget={SEO_BUDGET.title}
                        hardMax={SEO_MAX.title}
                      />
                    </span>
                    <input
                      value={value.title}
                      onChange={(e) => set(entry.key, "title", e.target.value)}
                      maxLength={SEO_MAX.title}
                      className={inputCls}
                    />
                    {suffix && (
                      <span className="mt-1.5 block text-[11px] text-a-ink/40">
                        {t("settings.seo.suffixNote", { suffix })}
                      </span>
                    )}
                  </label>

                  {/* ----------------------- Description --------------------- */}
                  <label className="block">
                    <span className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-a-ink/50">
                          {t("settings.seo.description")}
                        </span>
                        {value.description !== seed.description && (
                          <ChangedMark onRevert={() => revert(entry.key, "description")} />
                        )}
                      </span>
                      <Budget
                        length={value.description.length}
                        budget={SEO_BUDGET.description}
                        hardMax={SEO_MAX.description}
                      />
                    </span>
                    <textarea
                      rows={3}
                      value={value.description}
                      onChange={(e) => set(entry.key, "description", e.target.value)}
                      maxLength={SEO_MAX.description}
                      className={`${inputCls} h-auto py-2.5 leading-relaxed`}
                    />
                  </label>
                </div>

                {/* ------------------- Vorschau der Ergebniszeile ------------- */}
                <div
                  className="rounded-xl border border-a-ink/[0.08] bg-a-canvas p-4"
                  aria-label={t("settings.seo.previewAria")}
                >
                  <p className={legendCls}>{t("settings.seo.preview")}</p>
                  <p className="mt-3 truncate text-[11.5px] text-vine">
                    maria-maria.de
                    {locale === record.defaultLocale ? "" : `/${locale}`}
                    {entry.route === "/" ? "" : (entry.route ?? "")}
                  </p>
                  <p className="mt-1 text-[15px] leading-snug text-a-accent">
                    {clamp(shown, SEO_BUDGET.title) || t("settings.seo.empty")}
                  </p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-a-ink/60">
                    {clamp(value.description, SEO_BUDGET.description) || t("settings.seo.empty")}
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-5">
        <Note>{t("settings.seo.scopeNote")}</Note>
      </div>
    </Panel>
  );
}
