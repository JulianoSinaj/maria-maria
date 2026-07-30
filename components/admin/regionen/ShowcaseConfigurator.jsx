"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  SHOWCASE_REGION_KEYS,
  SHOWCASE_META,
  LIMITS,
  GROW_MIN,
  GROW_MAX,
} from "@/lib/showcase/store";

/* Regional-Showcase layout configurator.
   Preview left, controls + copy editors right. The desktop preview replays
   the storefront's exact motion contract — the hovered column grows on the
   same 560ms cubic-bezier the RegionExplorer uses, revealing the glass
   detail bar — with the photos the real section renders. The mobile preview
   sits in a phone frame and switches between today's stacked accordion and
   the horizontal snap rail.

   Copy edited here is the same name/tag/desc/long the storefront REGIONS
   array carries; defaults ARE that array, served by /api/admin/showcase. */

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const SWAP_MS = 560; // storefront RegionExplorer's clock

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

const sectionCls = "rounded-2xl border border-charcoal/[0.08] bg-ivory/50 p-4";
const legendCls = "mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/55";
const inputCls =
  "h-10 w-full rounded-xl border border-charcoal/12 bg-cream px-3 text-[12.5px] text-charcoal transition-colors duration-300 placeholder:text-charcoal/30 focus:border-champagne focus:outline-none";

/* character counter that warns as the limit nears */
const Count = ({ value, max }) => (
  <span
    className={`text-[10px] tabular-nums ${
      value.length > max * 0.9 ? "text-bordeaux/80" : "text-charcoal/35"
    }`}
  >
    {value.length}/{max}
  </span>
);

export default function ShowcaseConfigurator() {
  const reduced = useReducedMotion();
  const [cfg, setCfg] = useState(null);
  const [view, setView] = useState("desktop"); // which preview is shown
  const [hovered, setHovered] = useState(null); // desktop preview column
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/admin/showcase")
      .then((r) => r.json())
      .then((b) => setCfg(b.data.config))
      .catch((e) => setError(e));
  }, []);

  const setRegion = (key, patch) =>
    setCfg((c) => ({ ...c, regions: { ...c.regions, [key]: { ...c.regions[key], ...patch } } }));
  const setDesktop = (patch) =>
    setCfg((c) => ({ ...c, layout: { ...c.layout, desktop: { ...c.layout.desktop, ...patch } } }));
  const setMobile = (patch) =>
    setCfg((c) => ({ ...c, layout: { ...c.layout, mobile: { ...c.layout.mobile, ...patch } } }));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/showcase", {
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
    const res = await fetch("/api/admin/showcase?fresh=1");
    const body = await res.json().catch(() => null);
    if (res.ok) setCfg(body.data.config);
  };

  if (!cfg) {
    return (
      <div className="rounded-card-lg border border-charcoal/[0.08] bg-ivory/50 p-10 text-center text-[12.5px] text-charcoal/45">
        {error ? `Konfiguration konnte nicht geladen werden: ${error.message}` : "Showcase-Konfiguration wird geladen …"}
      </div>
    );
  }

  const { hoverExpand, grow } = cfg.layout.desktop;
  const variant = cfg.layout.mobile.variant;

  return (
    <section aria-label="Regional-Showcase Layout" className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
      {/* ---------------- preview ---------------- */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 24 }}
        className="flex flex-col gap-3"
      >
        {/* viewport switch */}
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-2 gap-1 rounded-full border border-charcoal/12 p-1" role="tablist" aria-label="Vorschau-Viewport">
            {[
              { key: "desktop", label: "Desktop" },
              { key: "mobile", label: "Mobil" },
            ].map((v) => (
              <button
                key={v.key}
                role="tab"
                type="button"
                aria-selected={view === v.key}
                onClick={() => setView(v.key)}
                className={`relative rounded-full px-4 py-1.5 text-[11.5px] transition-colors duration-300 ${
                  view === v.key ? "text-ivory" : "text-charcoal/55 hover:text-bordeaux"
                }`}
              >
                {view === v.key && (
                  <motion.span
                    layoutId="showcase-view-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-bordeaux to-wine"
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{v.label}</span>
              </button>
            ))}
          </div>
          <span className="text-[10.5px] text-charcoal/40">
            {view === "desktop"
              ? hoverExpand
                ? "Vertikale Fenster — Hover öffnet das Territorium"
                : "Vertikale Fenster — Ausdehnung deaktiviert"
              : variant === "rail"
                ? "Horizontale Schiene — seitlich wischen"
                : "Gestapelte Karten — Tippen klappt auf"}
          </span>
        </div>

        {view === "desktop" ? (
          /* ---- desktop: vertical windows, hover-grow on the 560ms clock ---- */
          <div
            data-preview-desktop
            onMouseLeave={() => setHovered(null)}
            className="flex aspect-[2.2/1] gap-2.5 overflow-hidden rounded-card-lg"
          >
            {SHOWCASE_REGION_KEYS.map((key, i) => {
              const r = cfg.regions[key];
              const active = hoverExpand && hovered === i;
              const dimmed = hoverExpand && hovered !== null && !active;
              return (
                <div
                  key={key}
                  data-card={key}
                  tabIndex={0}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  style={{
                    flexGrow: active ? grow : 1,
                    transition: reduced ? "none" : `flex-grow ${SWAP_MS}ms ${EASE}`,
                    willChange: "flex-grow",
                  }}
                  className="group relative min-w-0 basis-0 overflow-hidden rounded-card bg-espresso outline-none focus-visible:ring-2 focus-visible:ring-champagne/80"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SHOWCASE_META[key].img}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      objectPosition: active ? "50% 50%" : SHOWCASE_META[key].pos,
                      transform: active ? "scale(1.02)" : "scale(1.1)",
                      transition: reduced ? "none" : `transform ${SWAP_MS}ms ${EASE}, object-position ${SWAP_MS}ms ${EASE}`,
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-espresso/85 via-espresso/30 to-transparent"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-espresso/50 transition-opacity"
                    style={{ opacity: dimmed ? 1 : 0, transitionDuration: `${SWAP_MS}ms` }}
                  />

                  {/* resting title */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 p-4 transition-opacity"
                    style={{ opacity: active || dimmed ? 0 : 1, transitionDuration: "180ms" }}
                  >
                    <p className="truncate text-[8.5px] uppercase tracking-[0.2em] text-champagne-light">{r.tag}</p>
                    <h4 className="mt-0.5 truncate font-playfair text-[17px] text-ivory">{r.name}</h4>
                  </div>

                  {/* territory detail — the reveal the hover pays for */}
                  <div
                    data-detail={key}
                    className="absolute inset-x-2.5 bottom-2.5 transition-opacity"
                    style={{
                      opacity: active ? 1 : 0,
                      transitionDuration: `${SWAP_MS}ms`,
                      pointerEvents: active ? "auto" : "none",
                    }}
                  >
                    <div className="glass-dark relative overflow-hidden rounded-2xl px-4 py-3">
                      <p className="text-[8.5px] uppercase tracking-[0.22em] text-champagne-light">{r.tag}</p>
                      <h4 className="mt-0.5 font-playfair text-[16px] text-ivory">{r.name}</h4>
                      <p className="mt-1 line-clamp-2 text-[10.5px] leading-relaxed text-ivory/75">{r.long}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ---- mobile: phone frame, stack vs. horizontal snap rail ---- */
          <div className="mx-auto w-[340px] max-w-full rounded-[28px] border border-charcoal/12 bg-espresso p-2.5 shadow-glass">
            <div className="overflow-hidden rounded-[20px] bg-cream">
              <div className="flex h-8 items-center justify-center">
                <span className="h-1 w-16 rounded-full bg-charcoal/15" />
              </div>
              {variant === "rail" ? (
                <div
                  data-preview-rail
                  className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-5"
                >
                  {SHOWCASE_REGION_KEYS.map((key) => {
                    const r = cfg.regions[key];
                    return (
                      <div
                        key={key}
                        data-rail-card={key}
                        className="relative w-[76%] shrink-0 snap-center overflow-hidden rounded-card bg-espresso"
                      >
                        <div className="relative aspect-[4/5]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={SHOWCASE_META[key].img}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                            style={{ objectPosition: SHOWCASE_META[key].pos }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/25 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-4">
                            <p className="text-[8.5px] uppercase tracking-[0.2em] text-champagne-light">{r.tag}</p>
                            <h4 className="mt-0.5 font-playfair text-[18px] text-ivory">{r.name}</h4>
                            <p className="mt-1 text-[10.5px] leading-relaxed text-ivory/75">{r.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div data-preview-stack className="space-y-2.5 px-3.5 pb-5">
                  {SHOWCASE_REGION_KEYS.map((key) => {
                    const r = cfg.regions[key];
                    return (
                      <div key={key} className="relative h-24 overflow-hidden rounded-card bg-espresso">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={SHOWCASE_META[key].img}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                          style={{ objectPosition: SHOWCASE_META[key].pos }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-espresso/75 via-espresso/30 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3.5">
                          <div className="min-w-0">
                            <p className="truncate text-[8.5px] uppercase tracking-[0.2em] text-champagne-light">{r.tag}</p>
                            <h4 className="truncate font-playfair text-[16px] text-ivory">{r.name}</h4>
                          </div>
                          <span className="glass grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] text-charcoal/80">
                            +
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* ---------------- controls + editors ---------------- */}
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
          <p className={legendCls}>Desktop — vertikale Fenster</p>
          <Toggle
            on={hoverExpand}
            onChange={(v) => setDesktop({ hoverExpand: v })}
            label="Hover öffnet das Regionalfenster"
          />
          <div className={`mt-3 flex items-center gap-3 transition-opacity ${hoverExpand ? "" : "pointer-events-none opacity-40"}`}>
            <span className="text-[11px] text-charcoal/50">Ausdehnung</span>
            <input
              type="range"
              min={GROW_MIN}
              max={GROW_MAX}
              step="0.5"
              value={grow}
              onChange={(e) => setDesktop({ grow: Number(e.target.value) })}
              aria-label="Ausdehnung des geöffneten Fensters"
              className="flex-1 accent-bordeaux"
            />
            <span className="w-9 text-right text-[11px] text-charcoal/50 tabular-nums">{grow}×</span>
          </div>
        </div>

        <div className={sectionCls}>
          <p className={legendCls}>Mobil — Touch-Layout</p>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Mobile Layout-Variante">
            {[
              { key: "stack", label: "Gestapelt", hint: "Tippen klappt auf" },
              { key: "rail", label: "Horizontale Schiene", hint: "seitlich wischen" },
            ].map((v) => (
              <button
                key={v.key}
                type="button"
                role="radio"
                aria-checked={variant === v.key}
                onClick={() => {
                  setMobile({ variant: v.key });
                  setView("mobile");
                }}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors duration-300 ${
                  variant === v.key
                    ? "border-bordeaux bg-bordeaux text-ivory"
                    : "border-charcoal/12 text-charcoal/60 hover:border-champagne"
                }`}
              >
                <span className="block text-[12px] font-medium">{v.label}</span>
                <span className={`block text-[10px] ${variant === v.key ? "text-ivory/60" : "text-charcoal/35"}`}>
                  {v.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={sectionCls}>
          <p className={legendCls}>Regionale Texte</p>
          <div className="flex flex-col gap-5">
            {SHOWCASE_REGION_KEYS.map((key) => {
              const r = cfg.regions[key];
              return (
                <fieldset key={key} className="rounded-xl border border-charcoal/[0.07] bg-cream/60 p-3">
                  <legend className="px-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-bordeaux/60">
                    {r.name}
                  </legend>
                  <div className="flex flex-col gap-2.5">
                    <label className="block">
                      <span className="mb-1 flex items-baseline justify-between">
                        <span className="text-[10.5px] text-charcoal/50">Titel</span>
                        <Count value={r.name} max={LIMITS.name} />
                      </span>
                      <input
                        className={inputCls}
                        maxLength={LIMITS.name}
                        value={r.name}
                        onChange={(e) => setRegion(key, { name: e.target.value })}
                        aria-label={`Titel ${key}`}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 flex items-baseline justify-between">
                        <span className="text-[10.5px] text-charcoal/50">Unterzeile</span>
                        <Count value={r.tag} max={LIMITS.tag} />
                      </span>
                      <input
                        className={inputCls}
                        maxLength={LIMITS.tag}
                        value={r.tag}
                        onChange={(e) => setRegion(key, { tag: e.target.value })}
                        aria-label={`Unterzeile ${key}`}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 flex items-baseline justify-between">
                        <span className="text-[10.5px] text-charcoal/50">Kurzbeschreibung (mobil)</span>
                        <Count value={r.desc} max={LIMITS.desc} />
                      </span>
                      <input
                        className={inputCls}
                        maxLength={LIMITS.desc}
                        value={r.desc}
                        onChange={(e) => setRegion(key, { desc: e.target.value })}
                        aria-label={`Kurzbeschreibung ${key}`}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 flex items-baseline justify-between">
                        <span className="text-[10.5px] text-charcoal/50">Territorium (Detail)</span>
                        <Count value={r.long} max={LIMITS.long} />
                      </span>
                      <textarea
                        className={`${inputCls} h-auto py-2`}
                        rows={3}
                        maxLength={LIMITS.long}
                        value={r.long}
                        onChange={(e) => setRegion(key, { long: e.target.value })}
                        aria-label={`Territoriumsbeschreibung ${key}`}
                      />
                    </label>
                  </div>
                </fieldset>
              );
            })}
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
