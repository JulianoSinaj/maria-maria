"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  REDIRECT_KINDS,
  normalizeRedirect,
  resolveRedirect,
  validateRedirects,
} from "@/lib/settings/schema";
import { ArrowDown, ArrowUp, Plus, Trash } from "../AdminIcons";
import { useAdminI18n } from "../i18n/AdminI18n";
import { Note, Panel, SaveBar, boxCls, cardCls, inputCls, legendCls } from "./shared";

/* Gruppe „Weiterleitungen" — die Adressen aus der Zeit vor diesem System.

   Unter dieser Domain lief bis zum Umzug eine WordPress-Installation; deren
   Adressen sind seit 2019 indexiert, verlinkt und weitergegeben. Jede Zeile
   hier vererbt das Ranking einer alten Seite an ihre Entsprechung — eine
   gelöschte Zeile ist ein 404 für jeden, der dem alten Link folgt.

   DIE REIHENFOLGE ZÄHLT. Geprüft wird von oben nach unten, die erste
   passende Regel gewinnt, und das Ergebnis läuft erneut durch die Tabelle
   (bis zu vier Mal). Genau daraus entstehen Ketten wie
   "/weine/lugana-doc" → "/unsere-weine/lugana-doc" → "/unsere-weine/lugana",
   die middleware.js in EINE Antwort zusammenrechnet. Der Testknopf zeigt
   diesen Weg, weil man ihn der Tabelle sonst nicht ansieht.

   Der Test rechnet mit dem ENTWURF, nicht mit dem gespeicherten Stand: Eine
   Regel prüft man, bevor man sie live schaltet, nicht danach. */

export default function RedirectsPanel({ record, onSaved }) {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();

  const seed = record.redirects.seed;
  const [rows, setRows] = useState(() => record.redirects.value.map((r) => ({ ...r })));
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  const [probe, setProbe] = useState("");
  const [result, setResult] = useState(null);

  const problems = useMemo(() => validateRedirects(rows.map(normalizeRedirect)), [rows]);

  const dirty = useMemo(() => {
    const a = rows.map(normalizeRedirect);
    const b = record.redirects.value.map(normalizeRedirect);
    return (
      a.length !== b.length ||
      a.some((r, i) => r.from !== b[i].from || r.to !== b[i].to || r.kind !== b[i].kind)
    );
  }, [rows, record.redirects.value]);

  const set = (i, patch) =>
    setRows((list) => list.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const remove = (i) => setRows((list) => list.filter((_, idx) => idx !== i));

  const move = (i, delta) =>
    setRows((list) => {
      const next = [...list];
      const target = i + delta;
      if (target < 0 || target >= next.length) return list;
      [next[i], next[target]] = [next[target], next[i]];
      return next;
    });

  const add = () => setRows((list) => [...list, { from: "", to: "", kind: "exact" }]);

  const runTest = () => {
    if (!probe.trim()) {
      setResult(null);
      return;
    }
    setResult(
      resolveRedirect(probe, rows.map(normalizeRedirect), { defaultLocale: record.defaultLocale }),
    );
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const next = await onSaved({ redirects: rows.map(normalizeRedirect) });
      setRows(next.redirects.value.map((r) => ({ ...r })));
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2800);
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)] xl:items-start">
      {/* ------------------------------ Die Tabelle ------------------------- */}
      <section className={cardCls}>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className={legendCls}>{t("settings.redirects.legend")}</p>
            <h3 className="mt-1.5 font-playfair text-[19px] leading-tight text-a-ink">
              {t("settings.redirects.title")}
            </h3>
          </div>
          <span className="text-[11px] tabular-nums text-a-ink/40">
            {t("settings.redirects.count", { n: rows.length })}
          </span>
        </div>
        <p className="mt-2 max-w-[68ch] text-[12.5px] leading-relaxed text-a-ink/55">
          {t("settings.redirects.lede")}
        </p>

        <ul className="mt-6 flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {rows.map((row, i) => (
              <motion.li
                key={`${i}-${row.from}`}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 rounded-xl border border-a-ink/[0.07] bg-a-canvas/60 p-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
              >
                <label className="block min-w-0">
                  <span className="sr-only">{t("settings.redirects.from")}</span>
                  <input
                    value={row.from}
                    onChange={(e) => set(i, { from: e.target.value })}
                    placeholder="/alte-adresse"
                    aria-label={t("settings.redirects.from")}
                    className={`${inputCls} h-10 text-[12.5px]`}
                  />
                </label>

                <label className="block min-w-0">
                  <span className="sr-only">{t("settings.redirects.to")}</span>
                  <input
                    value={row.to}
                    onChange={(e) => set(i, { to: e.target.value })}
                    placeholder="/neue-adresse"
                    aria-label={t("settings.redirects.to")}
                    className={`${inputCls} h-10 text-[12.5px]`}
                  />
                </label>

                <div className="col-span-2 flex items-center justify-between gap-1.5 sm:col-span-1 sm:justify-end">
                  {/* exact / prefix — bei „prefix" wandert auch alles unterhalb
                      mit, samt Rest des Pfades. */}
                  <label className="mr-1">
                    <span className="sr-only">{t("settings.redirects.kind")}</span>
                    <select
                      value={row.kind}
                      onChange={(e) => set(i, { kind: e.target.value })}
                      aria-label={t("settings.redirects.kind")}
                      className="h-10 rounded-xl border border-a-ink/12 bg-a-canvas px-2 text-[11.5px] text-a-ink/70 focus:border-champagne focus:outline-none"
                    >
                      {REDIRECT_KINDS.map((k) => (
                        <option key={k} value={k}>
                          {t(`settings.redirects.kinds.${k}`)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={t("settings.redirects.up")}
                    className="grid h-9 w-9 place-items-center rounded-lg text-a-ink/40 transition-colors hover:text-a-accent disabled:opacity-25"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === rows.length - 1}
                    aria-label={t("settings.redirects.down")}
                    className="grid h-9 w-9 place-items-center rounded-lg text-a-ink/40 transition-colors hover:text-a-accent disabled:opacity-25"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label={t("settings.redirects.remove")}
                    className="grid h-9 w-9 place-items-center rounded-lg text-a-ink/40 transition-colors hover:text-a-accent"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <button
          type="button"
          onClick={add}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-a-ink/12 px-4 py-2.5 text-[12px] tracking-[0.06em] text-a-ink/65 transition-colors hover:border-champagne hover:text-a-accent"
        >
          <Plus className="h-4 w-4" />
          {t("settings.redirects.add")}
        </button>

        {problems.length > 0 && (
          <ul className="mt-4 space-y-1.5 rounded-xl border border-a-accent/25 bg-a-accent/[0.06] px-4 py-3">
            {problems.map((p) => (
              <li key={p} className="text-[11.5px] leading-relaxed text-a-accent">
                {p}
              </li>
            ))}
          </ul>
        )}

        <SaveBar
          onReset={() => setRows(seed.map((r) => ({ ...r })))}
          onSave={save}
          saving={saving}
          savedAt={savedAt}
          dirty={dirty && !problems.length}
          error={error}
          resetLabel={t("settings.resetToCode")}
        />
      </section>

      {/* -------------------------------- Der Test -------------------------- */}
      <section className={`${cardCls} xl:sticky xl:top-4`}>
        <p className={legendCls}>{t("settings.redirects.testLegend")}</p>
        <h3 className="mt-1.5 font-playfair text-[17px] leading-tight text-a-ink">
          {t("settings.redirects.testTitle")}
        </h3>
        <p className="mt-2 text-[12px] leading-relaxed text-a-ink/55">
          {t("settings.redirects.testLede")}
        </p>

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            runTest();
          }}
        >
          <label className="min-w-0 flex-1">
            <span className="sr-only">{t("settings.redirects.testInput")}</span>
            <input
              value={probe}
              onChange={(e) => setProbe(e.target.value)}
              placeholder="/galerie"
              aria-label={t("settings.redirects.testInput")}
              className={`${inputCls} h-10 text-[12.5px]`}
            />
          </label>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="shrink-0 rounded-xl bg-gradient-to-br from-a-fill to-a-fill-2 px-4 text-[12px] font-medium uppercase tracking-[0.1em] text-ivory"
          >
            {t("settings.redirects.testRun")}
          </motion.button>
        </form>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.input + result.target}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className={`${boxCls} mt-4`}
            >
              {result.loop ? (
                <p className="text-[12px] leading-relaxed text-a-accent">
                  {t("settings.redirects.loop")}
                </p>
              ) : !result.changed ? (
                <p className="text-[12px] leading-relaxed text-a-ink/60">
                  {t("settings.redirects.noMatch")}
                </p>
              ) : (
                <>
                  <p className={legendCls}>
                    {t("settings.redirects.hops", { n: result.hops })}
                  </p>
                  <ol className="mt-3 flex flex-col gap-1.5">
                    {result.chain.map((step, i) => (
                      <li key={`${step}-${i}`} className="flex items-baseline gap-2">
                        <span
                          aria-hidden="true"
                          className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                            i === result.chain.length - 1 ? "bg-vine" : "bg-a-ink/25"
                          }`}
                        />
                        <code
                          className={`min-w-0 break-all text-[12px] ${
                            i === result.chain.length - 1
                              ? "font-medium text-a-ink"
                              : "text-a-ink/45 line-through"
                          }`}
                        >
                          {step}
                        </code>
                      </li>
                    ))}
                  </ol>
                  {result.hops > 1 && (
                    <p className="mt-3 text-[11px] leading-relaxed text-a-ink/45">
                      {t("settings.redirects.chainNote")}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4">
          <Note tone="warn">{t("settings.redirects.edgeNote")}</Note>
        </div>
      </section>
    </Panel>
  );
}
