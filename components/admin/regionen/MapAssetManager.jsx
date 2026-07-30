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

/* Regional Map Asset Manager.
   Left: a live preview assembled from the SAME path geometry the storefront's
   ItalyMap renders — imported, not copied, so the admin can never drift from
   the real coastline. Right: per-region highlight colours, the coastal sea
   backdrop, and the city labels with a Lecce/Napoli balance guard.

   Balance rule (mirrors lib/map/store.js): the two headline cities read as
   one system only when their colour matches and sizes differ by ≤1pt. The
   indicator warns live; „Angleichen" applies the mean size and Lecce's
   colour to both. */

const REGION_SWATCHES = [
  { hex: "#6B0F1A", label: "Bordeaux" },
  { hex: "#43090F", label: "Bordeaux tief" },
  { hex: "#8A2B2F", label: "Wein" },
  { hex: "#55683F", label: "Rebgrün" },
  { hex: "#C8B77A", label: "Champagner" },
];

const LABEL_SWATCHES = [
  { hex: "#1B1B1B", label: "Charcoal" },
  { hex: "#6B0F1A", label: "Bordeaux" },
  { hex: "#211511", label: "Espresso" },
  { hex: "#F7F4EF", label: "Ivory" },
];

const SEA_TONES = [
  { hex: "#C9E8E1", label: "Acqua hell" },
  { hex: "#A4D3CB", label: "Acqua" },
  { hex: "#BFD7E4", label: "Adriablau" },
];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

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

const Swatches = ({ options, value, onChange, name }) => (
  <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label={name}>
    {options.map((s) => (
      <button
        key={s.hex}
        type="button"
        role="radio"
        aria-checked={value?.toLowerCase() === s.hex.toLowerCase()}
        title={s.label}
        onClick={() => onChange(s.hex)}
        className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-ivory transition-transform duration-300 ease-out-expo hover:scale-110 ${
          value?.toLowerCase() === s.hex.toLowerCase() ? "ring-2 ring-bordeaux" : "ring-1 ring-charcoal/15"
        }`}
        style={{ background: s.hex }}
      />
    ))}
  </div>
);

const sectionCls = "rounded-2xl border border-charcoal/[0.08] bg-ivory/50 p-4";
const legendCls = "mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/55";

export default function MapAssetManager() {
  const reduced = useReducedMotion();
  const [cfg, setCfg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

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
    const res = await fetch("/api/admin/map?fresh=1");
    const body = await res.json().catch(() => null);
    if (res.ok) setCfg(body.data.config);
  };

  if (!cfg) {
    return (
      <div className="rounded-card-lg border border-charcoal/[0.08] bg-ivory/50 p-10 text-center text-[12.5px] text-charcoal/45">
        {error ? `Karte konnte nicht geladen werden: ${error.message}` : "Karten-Konfiguration wird geladen …"}
      </div>
    );
  }

  return (
    <section aria-label="Regionale Karten-Assets" className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
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
          aria-label="Vorschau der Italien-Karte mit Regionen, Meer und Städten"
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

        <p className="mt-4 text-[10.5px] text-charcoal/40">
          Geometrie identisch mit der Storefront-Karte — Änderungen hier stylen dieselben Pfade.
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
          <p className={legendCls}>Regionale Hervorhebung</p>
          <ul className="flex flex-col gap-4">
            {REGION_KEYS.map((key) => (
              <li key={key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[12.5px] font-medium text-charcoal/85">
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 rounded-full ring-1 ring-charcoal/10"
                      style={{ background: cfg.regions[key].highlight }}
                    />
                    {REGION_META[key].label}
                  </span>
                  <Toggle
                    on={cfg.regions[key].enabled}
                    onChange={(v) => setRegion(key, { enabled: v })}
                    label={cfg.regions[key].enabled ? "aktiv" : "aus"}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Swatches
                    options={REGION_SWATCHES}
                    value={cfg.regions[key].highlight}
                    onChange={(hex) => setRegion(key, { highlight: hex })}
                    name={`Farbe ${REGION_META[key].label}`}
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
                    aria-label={`Hex-Farbe für ${REGION_META[key].label} (mit Enter übernehmen)`}
                    className="h-8 w-[86px] rounded-lg border border-charcoal/12 bg-cream px-2 text-center text-[11px] text-charcoal tabular-nums focus:border-champagne focus:outline-none"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={sectionCls}>
          <p className={legendCls}>Küsten-Meer</p>
          <Toggle
            on={cfg.sea.visible}
            onChange={(v) => setSea({ visible: v })}
            label="Meeresfläche hinter den Küsten zeigen"
          />
          <div className={`mt-3 transition-opacity ${cfg.sea.visible ? "" : "pointer-events-none opacity-40"}`}>
            <div className="flex items-center justify-between gap-3">
              <Swatches options={SEA_TONES} value={cfg.sea.tone} onChange={(hex) => setSea({ tone: hex })} name="Meeresfarbe" />
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={Math.round(cfg.sea.opacity * 100)}
                  onChange={(e) => setSea({ opacity: Number(e.target.value) / 100 })}
                  aria-label="Deckkraft des Meeres"
                  className="w-[90px]"
                  style={{ accentColor: cfg.sea.tone }}
                />
                <span className="w-9 text-right text-[11px] text-charcoal/50 tabular-nums">
                  {Math.round(cfg.sea.opacity * 100)} %
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={sectionCls}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className={`${legendCls} mb-0`}>Städte-Beschriftung</p>
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
                  Ausgewogen
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
                      ? `Größen weichen um ${balance.sizeDelta}pt ab`
                      : "Lecce und Napoli haben unterschiedliche Farben"
                  }
                  className="rounded-full bg-bordeaux/10 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-bordeaux transition-colors hover:bg-bordeaux hover:text-ivory"
                >
                  Unausgewogen — Angleichen
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <ul className="flex flex-col gap-4">
            {LABEL_KEYS.map((key) => (
              <li key={key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12.5px] font-medium text-charcoal/85">{LABEL_META[key].text}</span>
                  <Toggle
                    on={cfg.labels[key].visible}
                    onChange={(v) => setLabel(key, { visible: v })}
                    label={cfg.labels[key].visible ? "sichtbar" : "aus"}
                  />
                </div>
                <div
                  className={`flex items-center justify-between gap-3 transition-opacity ${
                    cfg.labels[key].visible ? "" : "pointer-events-none opacity-40"
                  }`}
                >
                  <Swatches
                    options={LABEL_SWATCHES}
                    value={cfg.labels[key].color}
                    onChange={(hex) => setLabel(key, { color: hex })}
                    name={`Farbe ${LABEL_META[key].text}`}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="6"
                      max="16"
                      step="1"
                      value={cfg.labels[key].size}
                      onChange={(e) => setLabel(key, { size: Number(e.target.value) })}
                      aria-label={`Schriftgröße ${LABEL_META[key].text}`}
                      className="w-[90px] accent-bordeaux"
                    />
                    <span className="w-9 text-right text-[11px] text-charcoal/50 tabular-nums">
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
