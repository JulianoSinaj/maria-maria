"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MAINLAND, SICILY, SARDINIA, HILITE, DOT } from "@/components/ItalyMap";
import {
  REGION_KEYS,
  REGION_META,
  LABEL_KEYS,
  LABEL_META,
} from "@/lib/map/store";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Regional Map Asset Manager.
   Left: a live preview assembled from the SAME path geometry the storefront's
   ItalyMap renders — imported, not copied, so the admin can never drift from
   the real coastline. Right: per-region highlight colours, the coastal sea
   backdrop, and the city labels with a Lecce/Napoli balance guard.

   Balance rule (mirrors lib/map/store.js): the two headline cities read as
   one system only when their colour matches and sizes differ by ≤1pt. The
   indicator warns live; „Angleichen" applies the mean size and Lecce's
   colour to both. */

/* swatch names address the admin dictionary */
const REGION_SWATCHES = [
  { hex: "#6B0F1A", label: "map.swatchBordeaux" },
  { hex: "#43090F", label: "map.swatchBordeauxDeep" },
  { hex: "#8A2B2F", label: "map.swatchWine" },
  { hex: "#55683F", label: "map.swatchVine" },
  { hex: "#C8B77A", label: "map.swatchChampagne" },
];

const LABEL_SWATCHES = [
  { hex: "#1B1B1B", label: "map.swatchCharcoal" },
  { hex: "#6B0F1A", label: "map.swatchBordeaux" },
  { hex: "#211511", label: "map.swatchEspresso" },
  { hex: "#F7F4EF", label: "map.swatchIvory" },
];

const SEA_TONES = [
  { hex: "#C9E8E1", label: "map.seaAcquaLight" },
  { hex: "#A4D3CB", label: "map.seaAcqua" },
  { hex: "#BFD7E4", label: "map.seaAdriatic" },
];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

const Toggle = ({ on, onChange, label }) => (
  <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex items-center gap-2.5">
    <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-a-fill" : "bg-a-ink/15"}`}>
      <motion.span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow-chip"
        animate={{ left: on ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
    </span>
    <span className="text-[12px] text-a-ink/70">{label}</span>
  </button>
);

const Swatches = ({ options, value, onChange, name, t }) => (
  <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label={name}>
    {options.map((s) => (
      <button
        key={s.hex}
        type="button"
        role="radio"
        aria-checked={value?.toLowerCase() === s.hex.toLowerCase()}
        title={t(s.label)}
        onClick={() => onChange(s.hex)}
        className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-ivory transition-transform duration-300 ease-out-expo hover:scale-110 ${
          value?.toLowerCase() === s.hex.toLowerCase() ? "ring-2 ring-a-accent" : "ring-1 ring-a-ink/15"
        }`}
        style={{ background: s.hex }}
      />
    ))}
  </div>
);

const sectionCls = "rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 p-4";
const legendCls = "mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55";

export default function MapAssetManager() {
  const reduced = useReducedMotion();
  const { t, tm } = useAdminI18n();
  const [cfg, setCfg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  /* region display name — the store's German label, translated where the
     dictionary knows it (proper nouns like "Salento" pass through) */
  const regionName = (key) => tm("regionName", REGION_META[key].label);

  useEffect(() => {
    fetch("/api/admin/map")
      .then((r) => r.json())
      .then((b) => setCfg(b.data.config))
      .catch((e) => setError(e));
  }, []);

  const setRegion = (key, patch) =>
    setCfg((c) => ({ ...c, regions: { ...c.regions, [key]: { ...c.regions[key], ...patch } } }));
  const setLabel = (key, patch) =>
    setCfg((c) => ({ ...c, labels: { ...c.labels, [key]: { ...c.labels[key], ...patch } } }));
  const setSea = (patch) => setCfg((c) => ({ ...c, sea: { ...c.sea, ...patch } }));

  /* live balance — same rule the server enforces in lib/map/store.js */
  const balance = cfg
    ? {
        sizeDelta: Math.abs(cfg.labels.lecce.size - cfg.labels.napoli.size),
        colorMatch: cfg.labels.lecce.color.toLowerCase() === cfg.labels.napoli.color.toLowerCase(),
      }
    : null;
  const balanced = balance && balance.sizeDelta <= 1 && balance.colorMatch;

  const harmonise = () => {
    const size = Math.round((cfg.labels.lecce.size + cfg.labels.napoli.size) / 2);
    const color = cfg.labels.lecce.color;
    setLabel("lecce", { size, color });
    setLabel("napoli", { size, color });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/map", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cfg),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? t("common.saveFailed", { status: res.status }));
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2800);
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    const res = await fetch("/api/admin/map?fresh=1");
    const body = await res.json().catch(() => null);
    if (res.ok) setCfg(body.data.config);
  };

  if (!cfg) {
    return (
      <div className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/50 p-10 text-center text-[12.5px] text-a-ink/45">
        {error ? t("map.loadError", { message: error.message }) : t("map.loading")}
      </div>
    );
  }

  return (
    <section aria-label={t("map.sectionAria")} className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      {/* ---------------- live preview ---------------- */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 24 }}
        className="grain relative flex flex-col items-center justify-center rounded-card-lg border border-charcoal/[0.08] bg-gradient-to-b from-cream via-ivory to-stone/50 p-8"
      >
        <svg
          viewBox="0 0 240 285"
          data-map-preview
          className="w-full max-w-[430px]"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={t("map.svgAria")}
        >
          {/* coastal sea backdrop — sits behind the landmasses, so it reads
              as water along every coastline */}
          {cfg.sea.visible && (
            <rect
              data-sea
              x="0"
              y="0"
              width="240"
              height="285"
              rx="10"
              fill={cfg.sea.tone}
              fillOpacity={cfg.sea.opacity}
            />
          )}

          <path d={MAINLAND} fill="rgba(255,255,255,0.92)" stroke="rgba(255,255,255,0.95)" strokeWidth="1.1" strokeLinejoin="round" />
          <path d={SICILY} fill="rgba(255,255,255,0.92)" stroke="rgba(255,255,255,0.95)" strokeWidth="1.1" strokeLinejoin="round" />
          <path d={SARDINIA} fill="rgba(255,255,255,0.85)" stroke="rgba(255,255,255,0.95)" strokeWidth="1.1" strokeLinejoin="round" />

          {REGION_KEYS.map((key) =>
            cfg.regions[key].enabled ? (
              <path
                key={key}
                data-region={key}
                d={HILITE[key]}
                fill={cfg.regions[key].highlight}
                fillOpacity="0.92"
                stroke={cfg.regions[key].highlight}
                strokeWidth="1"
                strokeLinejoin="round"
                className="transition-[fill,stroke] duration-300"
              />
            ) : null,
          )}

          {REGION_KEYS.map((key) =>
            cfg.regions[key].enabled ? (
              <circle
                key={`dot-${key}`}
                cx={DOT[key][0]}
                cy={DOT[key][1]}
                r="3"
                fill={cfg.regions[key].highlight}
                stroke="#fff"
                strokeWidth="1"
              />
            ) : null,
          )}

          {/* city labels — ivory halo keeps them legible over sea or land */}
          {LABEL_KEYS.map((key) => {
            const l = cfg.labels[key];
            const meta = LABEL_META[key];
            if (!l.visible) return null;
            return (
              <text
                key={key}
                data-label={key}
                x={meta.x}
                y={meta.y}
                fontSize={l.size}
                fill={l.color}
                textAnchor={meta.anchor}
                fontFamily="var(--font-montserrat)"
                fontWeight="600"
                letterSpacing="0.4"
                stroke="#F7F4EF"
                strokeWidth="2.4"
                paintOrder="stroke"
              >
                {meta.text}
              </text>
            );
          })}
        </svg>

        <p className="mt-4 text-[10.5px] text-a-ink/40">
          {t("map.geometryNote")}
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
          <p role="alert" className="rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
            {error.message}
          </p>
        )}

        <div className={sectionCls}>
          <p className={legendCls}>{t("map.highlight")}</p>
          <ul className="flex flex-col gap-4">
            {REGION_KEYS.map((key) => (
              <li key={key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[12.5px] font-medium text-a-ink/85">
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 rounded-full ring-1 ring-a-ink/10"
                      style={{ background: cfg.regions[key].highlight }}
                    />
                    {regionName(key)}
                  </span>
                  <Toggle
                    on={cfg.regions[key].enabled}
                    onChange={(v) => setRegion(key, { enabled: v })}
                    label={cfg.regions[key].enabled ? t("common.on") : t("common.off")}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Swatches
                    t={t}
                    options={REGION_SWATCHES}
                    value={cfg.regions[key].highlight}
                    onChange={(hex) => setRegion(key, { highlight: hex })}
                    name={t("map.colorFor", { name: regionName(key) })}
                  />
                  {/* uncontrolled so partial hex can be typed without the
                      state fighting the cursor; applied on blur/Enter, and the
                      key remounts it when a swatch changes the value outside */}
                  <input
                    key={cfg.regions[key].highlight}
                    type="text"
                    defaultValue={cfg.regions[key].highlight}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (HEX_RE.test(v)) setRegion(key, { highlight: v });
                      else e.target.value = cfg.regions[key].highlight;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                    aria-label={t("map.hexAria", { name: regionName(key) })}
                    className="h-8 w-[86px] rounded-lg border border-a-ink/12 bg-a-canvas px-2 text-center text-[11px] text-a-ink tabular-nums focus:border-champagne focus:outline-none"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={sectionCls}>
          <p className={legendCls}>{t("map.sea")}</p>
          <Toggle
            on={cfg.sea.visible}
            onChange={(v) => setSea({ visible: v })}
            label={t("map.seaToggle")}
          />
          <div className={`mt-3 transition-opacity ${cfg.sea.visible ? "" : "pointer-events-none opacity-40"}`}>
            <div className="flex items-center justify-between gap-3">
              <Swatches t={t} options={SEA_TONES} value={cfg.sea.tone} onChange={(hex) => setSea({ tone: hex })} name={t("map.seaColor")} />
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={Math.round(cfg.sea.opacity * 100)}
                  onChange={(e) => setSea({ opacity: Number(e.target.value) / 100 })}
                  aria-label={t("map.seaOpacity")}
                  className="w-[90px]"
                  style={{ accentColor: cfg.sea.tone }}
                />
                <span className="w-9 text-right text-[11px] text-a-ink/50 tabular-nums">
                  {Math.round(cfg.sea.opacity * 100)} %
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={sectionCls}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className={`${legendCls} mb-0`}>{t("map.cities")}</p>
            <AnimatePresence mode="wait">
              {balanced ? (
                <motion.span
                  key="ok"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  data-balance="ok"
                  className="rounded-full bg-vine/12 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-vine"
                >
                  {t("map.balanced")}
                </motion.span>
              ) : (
                <motion.button
                  key="warn"
                  type="button"
                  onClick={harmonise}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  data-balance="warn"
                  title={
                    balance?.colorMatch
                      ? t("map.sizeDelta", { n: balance.sizeDelta })
                      : t("map.colorMismatch")
                  }
                  className="rounded-full bg-a-accent/10 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-a-accent transition-colors hover:bg-a-fill hover:text-ivory"
                >
                  {t("map.harmonise")}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <ul className="flex flex-col gap-4">
            {LABEL_KEYS.map((key) => (
              <li key={key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12.5px] font-medium text-a-ink/85">{LABEL_META[key].text}</span>
                  <Toggle
                    on={cfg.labels[key].visible}
                    onChange={(v) => setLabel(key, { visible: v })}
                    label={cfg.labels[key].visible ? t("common.visible") : t("common.off")}
                  />
                </div>
                <div
                  className={`flex items-center justify-between gap-3 transition-opacity ${
                    cfg.labels[key].visible ? "" : "pointer-events-none opacity-40"
                  }`}
                >
                  <Swatches
                    t={t}
                    options={LABEL_SWATCHES}
                    value={cfg.labels[key].color}
                    onChange={(hex) => setLabel(key, { color: hex })}
                    name={t("map.colorFor", { name: LABEL_META[key].text })}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="6"
                      max="16"
                      step="1"
                      value={cfg.labels[key].size}
                      onChange={(e) => setLabel(key, { size: Number(e.target.value) })}
                      aria-label={t("map.fontSize", { name: LABEL_META[key].text })}
                      className="w-[90px] accent-a-accent"
                    />
                    <span className="w-9 text-right text-[11px] text-a-ink/50 tabular-nums">
                      {cfg.labels[key].size} pt
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={reset}
            className="rounded-full px-4 py-2.5 text-[12px] tracking-[0.06em] text-a-ink/55 transition-colors hover:text-a-accent"
          >
            {t("common.reset")}
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
                  {t("common.saved")}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              type="button"
              disabled={saving}
              onClick={save}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-7 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-opacity disabled:opacity-50"
            >
              {saving ? t("common.saving") : t("common.save")}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
