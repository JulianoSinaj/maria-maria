"use client";
import { useAdminI18n } from "../i18n/AdminI18n";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { LOCKED_KEYS } from "@/lib/pages/blocks";
import { isPlainObject, labelOf } from "@/lib/pages/merge";

/* The field tree of one block.

   Rendered from the SEED's shape, never from the value: the seed is the code,
   and the code decides which fields exist, how many list entries there are
   and which leaves are structure (href, id). The value only supplies what is
   typed into each leaf. Field labels are the key paths themselves — the merge
   back into the dictionary is one to one, so the editor shows the real names.

   `reference` is the same block in German, shown under every field while
   another language is being edited — the translator sees what the line says
   without switching tabs. */

const inputCls =
  "w-full rounded-xl border border-a-ink/12 bg-a-canvas px-3 text-[12.5px] text-a-ink transition-colors duration-300 placeholder:text-a-ink/30 focus:border-champagne focus:outline-none";

function TextField({ path, seed, value, reference, locked, locale, onChange }) {
  const { t } = useAdminI18n();
  const label = labelOf(path);
  const text = typeof value === "string" ? value : "";
  const long = (seed?.length ?? 0) > 90 || text.length > 90 || /\n/.test(seed ?? "");
  const rows = Math.min(8, Math.max(2, Math.ceil(Math.max(seed?.length ?? 0, text.length) / 72)));
  const showReference = locale !== DEFAULT_LOCALE && typeof reference === "string";

  return (
    <label className="block min-w-0">
      <span className="mb-1 flex items-baseline justify-between gap-3">
        <span className="truncate font-mono text-[10.5px] tracking-[0.02em] text-a-ink/50">{label}</span>
        <span className="shrink-0 text-[10px] tabular-nums text-a-ink/35">{text.length}</span>
      </span>

      {locked ? (
        <span
          className="flex min-h-10 items-center gap-2 rounded-xl border border-dashed border-a-ink/12 px-3 py-2 text-[12.5px] text-a-ink/50"
          title={t("pagesPage.locked")}
        >
          <span className="truncate">{text}</span>
          <span className="ml-auto shrink-0 text-[9.5px] uppercase tracking-[0.12em] text-a-ink/35">
            {t("pagesPage.locked")}
          </span>
        </span>
      ) : long ? (
        <textarea
          className={`${inputCls} resize-y py-2 leading-relaxed`}
          rows={rows}
          value={text}
          onChange={(e) => onChange(path, e.target.value)}
          aria-label={label}
        />
      ) : (
        <input
          className={`${inputCls} h-10`}
          value={text}
          onChange={(e) => onChange(path, e.target.value)}
          aria-label={label}
        />
      )}

      {showReference && (
        <span className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-snug text-a-ink/45">
          <span className="mt-px shrink-0 rounded bg-a-ink/[0.07] px-1 py-px text-[8.5px] font-semibold tracking-[0.14em] text-a-ink/55">
            {t("pagesPage.reference")}
          </span>
          <span className="min-w-0 break-words">{reference || "—"}</span>
        </span>
      )}
    </label>
  );
}

function Group({ path, children }) {
  return (
    <fieldset className="min-w-0 rounded-xl border border-a-ink/[0.08] p-3.5">
      <legend className="px-1.5 font-mono text-[10.5px] tracking-[0.02em] text-a-accent/80">
        {labelOf(path)}
      </legend>
      <div className="flex flex-col gap-3">{children}</div>
    </fieldset>
  );
}

export default function FieldTree({ seed, value, reference, path = [], locale, onChange }) {
  if (typeof seed === "string") {
    const key = [...path].reverse().find((seg) => typeof seg === "string");
    return (
      <TextField
        path={path}
        seed={seed}
        value={value}
        reference={reference}
        locked={LOCKED_KEYS.includes(key)}
        locale={locale}
        onChange={onChange}
      />
    );
  }

  if (Array.isArray(seed)) {
    const items = seed.map((item, i) => (
      <FieldTree
        key={i}
        seed={item}
        value={Array.isArray(value) ? value[i] : undefined}
        reference={Array.isArray(reference) ? reference[i] : undefined}
        path={[...path, i]}
        locale={locale}
        onChange={onChange}
      />
    ));
    return path.length ? <Group path={path}>{items}</Group> : <>{items}</>;
  }

  if (isPlainObject(seed)) {
    const entries = Object.keys(seed).map((key) => (
      <FieldTree
        key={key}
        seed={seed[key]}
        value={isPlainObject(value) ? value[key] : undefined}
        reference={isPlainObject(reference) ? reference[key] : undefined}
        path={[...path, key]}
        locale={locale}
        onChange={onChange}
      />
    ));
    return path.length ? <Group path={path}>{entries}</Group> : <>{entries}</>;
  }

  return null;
}
