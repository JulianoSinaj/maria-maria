"use client";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BUSINESS_FIELDS, applyIdentityToNode } from "@/lib/settings/schema";
import { useAdminI18n } from "../i18n/AdminI18n";
import { Field, Note, Panel, SaveBar, cardCls, legendCls } from "./shared";

/* Gruppe „Firma" — die Angaben des Unternehmens, mit der Vorschau der
   strukturierten Daten daneben.

   Die Vorschau ist der eigentliche Grund, warum diese Felder ein eigenes
   Panel bekommen: Was hier steht, ist nicht nur Text auf einer Seite,
   sondern der Organization-Knoten, den Google in den Wissensgraph übernimmt.
   Wer die Anschrift ändert, soll dabei sehen, was die Suchmaschine daraus
   liest — nicht erst nach dem Deploy in der Rich-Results-Prüfung.

   Der Knoten kommt aus lib/seo/jsonLd.js über die API; hier werden nur die
   Werte des Entwurfs darübergelegt. Die Struktur der Vorschau kann deshalb
   nicht gegen die echte auseinanderlaufen. */

export default function BusinessPanel({ record, social, onSaved }) {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();

  const seed = record.firma.seed;
  const [draft, setDraft] = useState(record.firma.value);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  const dirty = BUSINESS_FIELDS.some((f) => (draft[f.key] ?? "") !== (record.firma.value[f.key] ?? ""));

  const preview = useMemo(
    () => applyIdentityToNode(record.jsonLd, draft, social),
    [record.jsonLd, draft, social],
  );

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSaved({ firma: draft });
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2800);
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-start">
      {/* ------------------------------- Felder ------------------------------ */}
      <section className={cardCls}>
        <p className={legendCls}>{t("settings.firma.legend")}</p>
        <h3 className="mt-1.5 font-playfair text-[19px] leading-tight text-a-ink">
          {t("settings.firma.title")}
        </h3>
        <p className="mt-2 text-[12.5px] leading-relaxed text-a-ink/55">
          {t("settings.firma.lede")}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {BUSINESS_FIELDS.map((f) => {
            const value = draft[f.key] ?? "";
            const changed = value !== (seed[f.key] ?? "");
            /* Straße und Rechtsname brauchen die ganze Breite, die kurzen
               Felder (PLZ, Ort) stehen nebeneinander. */
            const wide = f.key === "legalName" || f.key === "street" || f.key === "email";
            return (
              <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
                <Field
                  label={t(`settings.firma.fields.${f.key}`)}
                  hint={t(`settings.firma.hints.${f.key}`)}
                  value={value}
                  onChange={(v) => set(f.key, v)}
                  changed={changed}
                  onRevert={() => set(f.key, seed[f.key] ?? "")}
                  maxLength={f.max}
                  inputMode={f.kind === "phone" ? "tel" : undefined}
                  type={f.kind === "email" ? "email" : "text"}
                  placeholder={f.kind === "phone" ? t("settings.firma.phonePlaceholder") : undefined}
                />
              </div>
            );
          })}
        </div>

        {/* Was zur Anschrift gehört, aber hier nicht geändert wird. */}
        <div className="mt-5">
          <Note>
            {t("settings.firma.fixed", {
              region: record.firma.fixed.region,
              country: record.firma.fixed.countryName,
            })}
          </Note>
        </div>

        <SaveBar
          onReset={() => setDraft(seed)}
          onSave={save}
          saving={saving}
          savedAt={savedAt}
          dirty={dirty}
          error={error}
          resetLabel={t("settings.resetToCode")}
        />
      </section>

      {/* --------------------- Vorschau strukturierte Daten ------------------ */}
      <motion.section
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 24, delay: reduced ? 0 : 0.06 }}
        className={`${cardCls} lg:sticky lg:top-4`}
        aria-label={t("settings.firma.previewAria")}
      >
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className={legendCls}>{t("settings.firma.previewLegend")}</p>
            <h3 className="mt-1.5 font-playfair text-[17px] leading-tight text-a-ink">
              {t("settings.firma.previewTitle")}
            </h3>
          </div>
          <span className="shrink-0 rounded-full border border-a-ink/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-a-ink/45">
            {record.previewLocale}
          </span>
        </div>

        {/* Die Telefonnummer ist der Grund, warum diese Vorschau hier steht:
            ohne Nummer fehlt das Feld ganz, mit Nummer erscheint es an zwei
            Stellen. Das ist im Rohtext sichtbar und sonst nirgends. */}
        {!draft.phone?.trim() && (
          <div className="mt-4">
            <Note tone="warn">{t("settings.firma.noPhone")}</Note>
          </div>
        )}

        <pre
          className="mt-4 max-h-[52vh] overflow-auto rounded-xl border border-a-ink/[0.08] bg-a-canvas p-4 text-[11px] leading-relaxed text-a-ink/75"
          /* Der Knoten ist Daten, keine Sprache — kein lang-Attribut, und
             die Zeilen brechen nicht um, damit die Struktur lesbar bleibt. */
        >
          <code>{JSON.stringify(preview, null, 2)}</code>
        </pre>

        <p className="mt-3 text-[11px] leading-relaxed text-a-ink/40">
          {t("settings.firma.previewNote")}
        </p>
      </motion.section>
    </Panel>
  );
}
