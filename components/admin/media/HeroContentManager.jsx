"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { HERO_LIMITS, VEIL_RANGES, veilGradient } from "@/lib/hero/store";

/* Hero Section Content Manager.
   Left: a live miniature of the landing hero — the chosen photo under the
   same ivory readability veil the homepage draws, with the real copy block
   (eyebrow, two-line Playfair title with the italic gradient line, lede,
   CTA pair) laid over it. Clicking the photo sets the focal anchor; the
   marker and object-position follow live.

   Right: background picker (tracked photos from public/img/home/ plus mock
   uploads), and the brand-copy editors with the limits the hero column can
   hold. Defaults ARE the live homepage hero, served by /api/admin/hero. */

const Toggle = ({ on, onChange, label }) => (
  <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex items-center gap-2.5">
    <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-bordeaux" : "bg-charcoal/15"}`}>
      <motion.span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow-chip"
        animate={{ left: on ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
    </span>
    <span className="text-[12px] text-charcoal/70">{label}</span>
  </button>
);

const Count = ({ value, max }) => (
  <span
    className={`text-[10px] tabular-nums ${
      value.length > max * 0.9 ? "text-bordeaux/80" : "text-charcoal/35"
    }`}
  >
    {value.length}/{max}
  </span>
);

const sectionCls = "rounded-2xl border border-charcoal/[0.08] bg-ivory/50 p-4";
const legendCls = "mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/55";
const inputCls =
  "h-10 w-full rounded-xl border border-charcoal/12 bg-cream px-3 text-[12.5px] text-charcoal transition-colors duration-300 placeholder:text-charcoal/30 focus:border-champagne focus:outline-none";

const FIELDS = [
  { key: "eyebrow", label: "Eyebrow" },
  { key: "titleLine1", label: "Titel — Zeile 1" },
  { key: "titleLine2", label: "Titel — Zeile 2 (kursiv)" },
  { key: "lede", label: "Markenbotschaft", textarea: true },
  { key: "ctaPrimary", label: "Primärer Button" },
  { key: "ctaSecondary", label: "Sekundärer Button" },
];

export default function HeroContentManager() {
  const reduced = useReducedMotion();
  const stageRef = useRef(null);
  const fileRef = useRef(null);
  const [cfg, setCfg] = useState(null);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = () =>
      fetch("/api/admin/hero")
        .then((r) => r.json())
        .then((b) => {
          setCfg(b.data.config);
          setImages(b.data.images);
        })
        .catch((e) => setError(e));
    load();
    /* the Asset Gallery below dispatches this after assigning a background */
    window.addEventListener("mm:hero-config-changed", load);
    return () => window.removeEventListener("mm:hero-config-changed", load);
  }, []);

  const setCopy = (field, value) =>
    setCfg((c) => ({ ...c, copy: { ...c.copy, [field]: value } }));
  const setVeil = (patch) => setCfg((c) => ({ ...c, veil: { ...c.veil, ...patch } }));
  const setImage = (patch) =>
    setCfg((c) => ({ ...c, image: { ...c.image, ...patch, focus: { ...c.image.focus, ...(patch.focus ?? {}) } } }));

  /* click on the stage anchors the focal point there */
  const onStageClick = (e) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    setImage({
      focus: {
        x: Math.round(((e.clientX - r.left) / r.width) * 100),
        y: Math.round(((e.clientY - r.top) / r.height) * 100),
      },
    });
  };

  const pickUpload = async (file) => {
    if (!file) return;
    setError(null);
    const dataUrl = await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
    const res = await fetch("/api/admin/hero/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: file.name, dataUrl }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      setError(new Error(body?.error ?? "Upload fehlgeschlagen"));
      return;
    }
    setImages((a) => [...a, body.data]);
    setImage({ src: body.data.path });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cfg),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? `Speichern fehlgeschlagen (${res.status})`);
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2800);
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    const res = await fetch("/api/admin/hero?fresh=1");
    const body = await res.json().catch(() => null);
    if (res.ok) setCfg(body.data.config);
  };

  if (!cfg) {
    return (
      <div className="rounded-card-lg border border-charcoal/[0.08] bg-ivory/50 p-10 text-center text-[12.5px] text-charcoal/45">
        {error ? `Hero konnte nicht geladen werden: ${error.message}` : "Hero-Konfiguration wird geladen …"}
      </div>
    );
  }

  const { focus } = cfg.image;
  /* a dark shadow veil flips the copy to ivory, as the storefront would */
  const darkVeil = cfg.veil.enabled && cfg.veil.tone === "espresso";

  return (
    <section aria-label="Hero-Inhalte" className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
      {/* ---------------- live hero preview ---------------- */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 24 }}
        className="flex flex-col gap-2.5"
      >
        <button
          ref={stageRef}
          type="button"
          data-hero-preview
          onClick={onStageClick}
          title="Klick setzt den Bildanker"
          className="group relative block aspect-[16/9] w-full cursor-crosshair overflow-hidden rounded-card-lg border border-charcoal/[0.08] bg-espresso text-left"
        >
          {cfg.image.src && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              data-hero-img
              src={cfg.image.src}
              alt="Hero-Hintergrund Vorschau"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}

          {/* configurable readability veil — an eased multi-stop ramp instead
              of the storefront's three hard stops, so the fade carries no
              vertical seam; disabled = the left block is gone entirely */}
          {veilGradient(cfg.veil) && (
            <span
              aria-hidden="true"
              data-veil
              className="pointer-events-none absolute inset-0"
              style={{ background: veilGradient(cfg.veil) }}
            />
          )}
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-ivory/55 via-ivory/20 to-transparent" />

          {/* focal-point marker */}
          <span
            aria-hidden="true"
            data-focus-marker
            className="pointer-events-none absolute z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ivory shadow-chip transition-[left,top] duration-300 ease-out-expo"
            style={{ left: `${focus.x}%`, top: `${focus.y}%`, background: "rgba(107,15,26,0.55)" }}
          />

          {/* the copy block, as the homepage lays it out */}
          <span className="pointer-events-none absolute inset-0 flex flex-col justify-center p-7 lg:p-9">
            <span className="max-w-[55%]">
              <span className={`text-[9px] font-semibold uppercase tracking-[0.24em] ${darkVeil ? "text-champagne-light" : "text-vine"}`}>
                {cfg.copy.eyebrow}
              </span>
              <span data-hero-title className={`mt-2.5 block font-playfair text-[clamp(22px,3vw,34px)] leading-[1.05] tracking-[-0.015em] ${darkVeil ? "text-ivory" : "text-charcoal"}`}>
                {cfg.copy.titleLine1}
                <span className={`block bg-gradient-to-r bg-clip-text italic text-transparent ${darkVeil ? "from-champagne via-champagne-light to-champagne" : "from-bordeaux via-wine to-bordeaux"}`}>
                  {cfg.copy.titleLine2}
                </span>
              </span>
              <span data-hero-lede className={`mt-2.5 block max-w-[42ch] text-[11px] leading-relaxed ${darkVeil ? "text-ivory/80" : "text-charcoal/75"}`}>
                {cfg.copy.lede}
              </span>
              <span className="mt-4 flex items-center gap-2.5">
                <span className="rounded-full bg-gradient-to-br from-bordeaux to-wine px-4 py-2 text-[9px] font-medium uppercase tracking-[0.14em] text-ivory">
                  {cfg.copy.ctaPrimary}
                </span>
                <span className={`rounded-full border px-4 py-2 text-[9px] font-medium uppercase tracking-[0.14em] ${darkVeil ? "border-ivory/40 text-ivory" : "border-charcoal/25 text-charcoal"}`}>
                  {cfg.copy.ctaSecondary}
                </span>
              </span>
            </span>
          </span>
        </button>

        <p className="text-[10.5px] text-charcoal/40" data-focus-readout>
          Bildanker: {focus.x} % / {focus.y} % — Klick auf die Vorschau verschiebt ihn.
          Schleier und Textspalte entsprechen dem Live-Hero.
        </p>
      </motion.div>

      {/* ---------------- controls ---------------- */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 24, delay: reduced ? 0 : 0.06 }}
        className="flex flex-col gap-4"
      >
        {error && (
          <p role="alert" className="rounded-xl bg-bordeaux/10 px-4 py-3 text-[12px] text-bordeaux">
            {error.message}
          </p>
        )}

        <div className={sectionCls}>
          <div className="mb-3 flex items-center justify-between">
            <p className={`${legendCls} mb-0`}>Hintergrundbild</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-[11.5px] font-medium text-bordeaux transition-colors hover:text-bordeaux-deep"
            >
              Hochladen +
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="hidden"
              onChange={(e) => pickUpload(e.target.files?.[0])}
            />
          </div>
          <div className="grid max-h-[250px] grid-cols-3 gap-2 overflow-y-auto pr-1">
            {images.map((img) => (
              <button
                key={img.path}
                type="button"
                title={img.name}
                aria-pressed={cfg.image.src === img.path}
                onClick={() => setImage({ src: img.path })}
                className={`group relative overflow-hidden rounded-xl border bg-cream p-1 transition-colors duration-300 ${
                  cfg.image.src === img.path
                    ? "border-bordeaux ring-1 ring-bordeaux"
                    : "border-charcoal/[0.08] hover:border-champagne"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.path} alt={img.name} loading="lazy" className="h-14 w-full rounded-lg object-cover" />
                <span className="mt-1 block truncate text-center text-[8.5px] text-charcoal/45">
                  {img.uploaded ? "▲ " : ""}
                  {img.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={sectionCls}>
          <p className={legendCls}>Schleier & Schatten</p>
          <Toggle
            on={cfg.veil.enabled}
            onChange={(v) => setVeil({ enabled: v })}
            label={cfg.veil.enabled ? "Farbfläche links aktiv" : "Farbfläche links entfernt"}
          />

          <div className={`mt-3 flex flex-col gap-3 transition-opacity ${cfg.veil.enabled ? "" : "pointer-events-none opacity-40"}`}>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Schleierton">
              {[
                { key: "ivory", label: "Hell (Ivory)", hint: "wie der Live-Hero" },
                { key: "espresso", label: "Schatten", hint: "dunkles Overlay" },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="radio"
                  aria-checked={cfg.veil.tone === t.key}
                  onClick={() => setVeil({ tone: t.key })}
                  className={`rounded-xl border px-3 py-2 text-left transition-colors duration-300 ${
                    cfg.veil.tone === t.key
                      ? "border-bordeaux bg-bordeaux text-ivory"
                      : "border-charcoal/12 text-charcoal/60 hover:border-champagne"
                  }`}
                >
                  <span className="block text-[11.5px] font-medium">{t.label}</span>
                  <span className={`block text-[9.5px] ${cfg.veil.tone === t.key ? "text-ivory/60" : "text-charcoal/35"}`}>
                    {t.hint}
                  </span>
                </button>
              ))}
            </div>

            {[
              {
                key: "opacity",
                label: "Deckkraft",
                min: 0, max: 100, step: 5,
                toUi: (v) => Math.round(v * 100),
                fromUi: (v) => v / 100,
                unit: "%",
              },
              {
                key: "softness",
                label: "Weichheit",
                min: VEIL_RANGES.softness.min * 10, max: VEIL_RANGES.softness.max * 10, step: 1,
                toUi: (v) => Math.round(v * 10),
                fromUi: (v) => v / 10,
                unit: "", hint: "höher = weicherer Verlauf",
              },
              {
                key: "distance",
                label: "Übergangsdistanz",
                min: VEIL_RANGES.distance.min, max: VEIL_RANGES.distance.max, step: 5,
                toUi: (v) => v,
                fromUi: (v) => v,
                unit: "%", hint: "wie weit der Verlauf ins Bild reicht",
              },
            ].map((s) => (
              <label key={s.key} className="block">
                <span className="mb-1 flex items-baseline justify-between">
                  <span className="text-[10.5px] text-charcoal/50">
                    {s.label}
                    {s.hint && <span className="ml-1.5 text-charcoal/30">· {s.hint}</span>}
                  </span>
                  <span className="text-[10.5px] text-charcoal/45 tabular-nums">
                    {s.toUi(cfg.veil[s.key])}{s.unit}
                  </span>
                </span>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={s.toUi(cfg.veil[s.key])}
                  onChange={(e) => setVeil({ [s.key]: s.fromUi(Number(e.target.value)) })}
                  aria-label={s.label}
                  className="w-full accent-bordeaux"
                />
              </label>
            ))}
          </div>
        </div>

        <div className={sectionCls}>
          <p className={legendCls}>Markenbotschaft</p>
          <div className="flex flex-col gap-3">
            {FIELDS.map((f) => (
              <label key={f.key} className="block">
                <span className="mb-1 flex items-baseline justify-between">
                  <span className="text-[10.5px] text-charcoal/50">{f.label}</span>
                  <Count value={cfg.copy[f.key]} max={HERO_LIMITS[f.key]} />
                </span>
                {f.textarea ? (
                  <textarea
                    className={`${inputCls} h-auto py-2`}
                    rows={3}
                    maxLength={HERO_LIMITS[f.key]}
                    value={cfg.copy[f.key]}
                    onChange={(e) => setCopy(f.key, e.target.value)}
                    aria-label={f.label}
                  />
                ) : (
                  <input
                    className={inputCls}
                    maxLength={HERO_LIMITS[f.key]}
                    value={cfg.copy[f.key]}
                    onChange={(e) => setCopy(f.key, e.target.value)}
                    aria-label={f.label}
                  />
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={reset}
            className="rounded-full px-4 py-2.5 text-[12px] tracking-[0.06em] text-charcoal/55 transition-colors hover:text-bordeaux"
          >
            Zurücksetzen
          </button>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {savedAt && (
                <motion.span
                  role="status"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11.5px] font-medium text-vine"
                >
                  Gespeichert ✓
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              type="button"
              disabled={saving}
              onClick={save}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="rounded-full bg-gradient-to-br from-bordeaux to-wine px-7 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-opacity disabled:opacity-50"
            >
              {saving ? "Speichert …" : "Speichern"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
