"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Close } from "@/components/Icons";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";
import { useInterviewOptions, createInterview } from "@/lib/interviews/useInterviews";
import { slugify } from "@/lib/interviews/schema";
import { Field, TextInput, Select, primaryBtn } from "./editorFields";

/* The "new interview" dialog — just enough to create a draft record: a
   name (which seeds the slug), the wine and region it belongs to. Every
   other field lives in the full editor; this is the shortest path from
   "nothing" to "an editable draft with an address". */

export default function NewInterviewDialog({ open, onClose, onCreated }) {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();
  const { options } = useInterviewOptions();
  const closeRef = useRef(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [wine, setWine] = useState("");
  const [region, setRegion] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setName("");
    setSlug("");
    setSlugTouched(false);
    setWine("");
    setRegion("");
    setError(null);
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const record = await createInterview({
        slug: slug || slugify(name),
        wine: { slug: wine },
        region,
        locales: { de: { name, headline: "", eyebrow: "" } },
      });
      onCreated(record);
    } catch (err) {
      setError(err.details?.length ? err.details.join(" · ") : err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95]">
          <motion.button
            type="button"
            aria-label={t("common.close")}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="absolute inset-0 w-full cursor-default bg-espresso/55 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("magazine.new")}
            initial={reduced ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-1/2 top-1/2 w-[min(480px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-a-ink/[0.08] bg-a-canvas p-6 shadow-glass"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-playfair text-[20px] text-a-ink">{t("magazine.new")}</h3>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t("common.close")}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-a-ink/12 text-a-ink/70 transition-colors hover:border-champagne hover:text-a-accent"
              >
                <Close className="h-[16px] w-[16px]" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {error && (
                <p role="alert" className="rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
                  {error}
                </p>
              )}
              <Field label={t("magazine.editor.fields.name")} required>
                <TextInput
                  autoFocus
                  required
                  value={name}
                  onChange={(v) => {
                    setName(v);
                    if (!slugTouched) setSlug(slugify(v));
                  }}
                />
              </Field>
              <Field label={t("magazine.new_.slug")} hint={t("magazine.new_.slugHint")} required>
                <TextInput
                  required
                  value={slug}
                  onChange={(v) => {
                    setSlug(slugify(v));
                    setSlugTouched(true);
                  }}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t("magazine.new_.wine")}>
                  <Select value={wine} onChange={setWine}>
                    <option value="">—</option>
                    {(options?.wines ?? []).map((w) => (
                      <option key={w.slug} value={w.slug}>
                        {w.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label={t("magazine.new_.region")}>
                  <Select value={region} onChange={setRegion}>
                    <option value="">—</option>
                    {(options?.regions ?? []).map((r) => (
                      <option key={r} value={r}>
                        {t(`magazine.editor.pathIds.region`)} · {r}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="rounded-full px-4 py-2.5 text-[12px] tracking-[0.06em] text-a-ink/55 transition-colors hover:text-a-accent">
                  {t("common.cancel")}
                </button>
                <button type="submit" disabled={saving} className={primaryBtn}>
                  {saving ? t("common.saving") : t("common.create")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
