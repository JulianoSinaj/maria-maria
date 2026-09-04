"use client";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Gemeinsame Bausteine der vier Einstellungsgruppen.

   Sie liegen hier und nicht in jeder Gruppe noch einmal, weil die vier
   Gruppen auf EINER Seite stehen: Ein Eingabefeld, das in der Gruppe Firma
   anders aussieht als in der Gruppe SEO, macht aus einer Seite vier. */

export const cardCls =
  "rounded-card-lg border border-a-ink/[0.08] bg-a-surface/60 p-6 sm:p-7";
export const boxCls = "rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 p-4";
export const legendCls =
  "text-[10px] font-semibold uppercase tracking-[0.2em] text-a-accent/55";
export const inputCls =
  "h-11 w-full rounded-xl border border-a-ink/12 bg-a-canvas px-3.5 text-[13px] text-a-ink transition-colors duration-300 placeholder:text-a-ink/30 focus:border-champagne focus:outline-none";

/* Ein Feld, das vom Code abweicht, bekommt einen Punkt und einen
   Zurück-Knopf. Beides sitzt in der Beschriftungszeile und niemals im Feld
   selbst: Ein Knopf, der beim Tippen erscheint, verschiebt den Cursor. */
export function ChangedMark({ onRevert }) {
  const { t } = useAdminI18n();
  return (
    <span className="flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-a-accent"
      />
      <button
        type="button"
        onClick={onRevert}
        className="text-[10px] uppercase tracking-[0.1em] text-a-accent/70 underline-offset-2 transition-colors hover:text-a-accent hover:underline"
      >
        {t("settings.revert")}
      </button>
    </span>
  );
}

/**
 * Zeichenzähler mit Budget.
 *
 * Drei Zustände, und der mittlere ist der eigentliche Zweck: knapp unter dem
 * Budget ist ein Text gut, darüber schneidet Google ab. Die Leiste zeigt das
 * Verhältnis, die Zahl den Rest — wer kürzt, sieht beim Tippen, wie weit.
 */
export function Budget({ length, budget, hardMax }) {
  const { t } = useAdminI18n();
  const ratio = Math.min(length / budget, 1);
  const over = length > budget;
  const near = !over && length > budget * 0.9;

  const tone = over ? "bg-a-accent" : near ? "bg-a-gold" : "bg-vine";
  const text = over ? "text-a-accent" : near ? "text-a-gold" : "text-a-ink/40";

  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-1 w-16 overflow-hidden rounded-full bg-a-ink/10"
      >
        <motion.span
          className={`block h-full rounded-full ${tone}`}
          initial={false}
          animate={{ scaleX: ratio }}
          style={{ transformOrigin: "left" }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        />
      </span>
      <span
        className={`text-[10px] tabular-nums ${text}`}
        title={t("settings.budgetHint", { budget, max: hardMax })}
      >
        {length}/{budget}
      </span>
    </span>
  );
}

/** Beschriftung, Feld und rechts davon, was über das Feld zu sagen ist. */
export function Field({
  label,
  hint,
  value,
  onChange,
  changed,
  onRevert,
  aside,
  textarea = false,
  rows = 3,
  ...rest
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="flex items-center gap-2">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-a-ink/50">
            {label}
          </span>
          {changed && <ChangedMark onRevert={onRevert} />}
        </span>
        {aside}
      </span>
      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} h-auto py-2.5 leading-relaxed`}
          {...rest}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} {...rest} />
      )}
      {hint && <span className="mt-1.5 block text-[11px] leading-relaxed text-a-ink/40">{hint}</span>}
    </label>
  );
}

/**
 * Fuß jeder Gruppe: zurück auf den Code links, speichern rechts.
 *
 * „Zurücksetzen" heißt hier wirklich zurück auf den Code und nicht auf den
 * zuletzt gespeicherten Stand — die Saat ist das, was ohne Backoffice
 * ausgeliefert würde, und dorthin muss man immer zurückkommen können.
 */
export function SaveBar({ onReset, onSave, saving, savedAt, dirty, error, resetLabel }) {
  const { t } = useAdminI18n();

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-a-ink/[0.08] pt-5">
      <button
        type="button"
        onClick={onReset}
        className="rounded-full px-4 py-2.5 text-[12px] tracking-[0.06em] text-a-ink/55 transition-colors hover:text-a-accent"
      >
        {resetLabel ?? t("settings.resetGroup")}
      </button>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {error && (
            <motion.span
              role="alert"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-[46ch] text-right text-[11.5px] leading-snug text-a-accent"
            >
              {error.message}
            </motion.span>
          )}
          {!error && savedAt && (
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
          onClick={onSave}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-7 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-opacity disabled:opacity-40"
        >
          {saving ? t("common.saving") : t("common.save")}
        </motion.button>
      </div>
    </div>
  );
}

/** Einheitlicher Auftritt der Gruppen-Panels. */
export function Panel({ children, className = "" }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 24 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Hinweiszeile über einem Panel — Erklärung, kein Fehler. */
export function Note({ children, tone = "neutral" }) {
  const cls =
    tone === "warn"
      ? "border-a-gold/40 bg-a-gold/[0.08] text-a-ink/75"
      : "border-a-ink/[0.08] bg-a-canvas/70 text-a-ink/55";
  return (
    <p className={`rounded-xl border px-4 py-3 text-[11.5px] leading-relaxed ${cls}`}>{children}</p>
  );
}
