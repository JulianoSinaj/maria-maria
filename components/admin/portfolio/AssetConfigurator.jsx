"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { Close } from "@/components/Icons";
import { WINES } from "@/components/data";
import { ACCENT_META, WORDMARK } from "@/lib/inventory/schema";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Bottle Asset Configurator.
   ==================================================================
   Left: a live preview stage — single centred bottle or the 9-wine bundle.
   Right: asset picker (existing files + upload), accent-overlay treatment,
   and the corkscrew prop.

   The corkscrew is draggable through spring-damped motion values, and the
   MARIA MARIA wordmark band is a protected zone: dropping the prop on it
   makes the prop spring out to the nearest clear position on release, so a
   saved composition can never cover the logo.

   Zones are percentages of the stage, calibrated against the card-front
   packshots (bottle centred, stage 560×520). The Rosato's wordmark sits
   lower because its label has no black band — its zone differs. */

const STAGE_W = 560;
const STAGE_H = 520;
const OP_W = 64;
const OP_H = 132;
const PAD = 8;

/* logo protection zone, % of stage, per wordmark family */
const ZONES = {
  [WORDMARK.BANDED]: { x: 35, y: 56, w: 29, h: 13 },
  [WORDMARK.TINTED]: { x: 35, y: 66, w: 29, h: 13 },
};

/* accent-overlay band — the label field below the shoulder */
const ACCENT_BAND = { x: 33, y: 46, w: 33, h: 40 };

const intersects = (a, b) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/* stylised waiter's-friend corkscrew — no photo asset exists in the repo */
const Corkscrew = (p) => (
  <svg viewBox="0 0 56 120" fill="none" aria-hidden="true" {...p}>
    <rect x="16" y="4" width="24" height="34" rx="7" fill="#211511" />
    <rect x="19" y="7" width="18" height="28" rx="5" fill="#3a2a22" />
    <rect x="40" y="10" width="7" height="52" rx="3.5" fill="#8a8a8a" />
    <rect x="41.5" y="12" width="2" height="48" rx="1" fill="#c9c9c9" />
    <path d="M28 40v14" stroke="#9b9b9b" strokeWidth="5" strokeLinecap="round" />
    <path
      d="M28 54c9 4 9 8 0 12s-9 8 0 12-9 8 0 12-9 8 0 12l0 8"
      stroke="#a8a8a8"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M28 54c9 4 9 8 0 12s-9 8 0 12-9 8 0 12-9 8 0 12"
      stroke="#d6d6d6"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const Toggle = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={() => onChange(!on)}
    className="flex items-center gap-2.5"
  >
    <span
      className={`relative h-6 w-10 rounded-full transition-colors duration-300 ${
        on ? "bg-a-fill" : "bg-a-ink/15"
      }`}
    >
      <motion.span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow-chip"
        animate={{ left: on ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
    </span>
    <span className="text-[12px] text-a-ink/70">{label}</span>
  </button>
);

const sectionCls = "rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 p-4";
const legendCls =
  "mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55";

export default function AssetConfigurator({ open, wine, onClose, onSaved }) {
  const reduced = useReducedMotion();
  const { t, tm } = useAdminI18n();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const stageRef = useRef(null);
  const fileRef = useRef(null);

  const [cfg, setCfg] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [overlap, setOverlap] = useState(false);
  const [showZone, setShowZone] = useState(false);

  /* corkscrew position, px within the stage. Raw values receive the pointer;
     springs render — dragging feels weighted, and the collision snap on
     release animates for free because the spring follows wherever raw goes. */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spr = { stiffness: 300, damping: 26, mass: 0.6 };
  const sx = useSpring(rawX, spr);
  const sy = useSpring(rawY, spr);
  const dragRef = useRef(null);

  const zone = ZONES[wine?.label?.wordmark] ?? ZONES[WORDMARK.BANDED];
  const accentHex = ACCENT_META[wine?.label?.accent]?.hex ?? "#E1140A";

  const zonePx = () => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return null;
    return {
      left: (zone.x / 100) * r.width,
      top: (zone.y / 100) * r.height,
      right: ((zone.x + zone.w) / 100) * r.width,
      bottom: ((zone.y + zone.h) / 100) * r.height,
      width: r.width,
      height: r.height,
    };
  };

  const placeOpener = (pctX, pctY) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = Math.min(Math.max((pctX / 100) * r.width - OP_W / 2, PAD), r.width - OP_W - PAD);
    const y = Math.min(Math.max((pctY / 100) * r.height - OP_H / 2, PAD), r.height - OP_H - PAD);
    rawX.jump(x);
    rawY.jump(y);
    sx.jump(x);
    sy.jump(y);
  };

  /* load config when a wine opens */
  useEffect(() => {
    if (!open || !wine) return;
    setLoading(true);
    setError(null);
    fetch(`/api/admin/assets/${wine.slug}`)
      .then((res) => res.json().then((b) => ({ ok: res.ok, b })))
      .then(({ ok, b }) => {
        if (!ok) throw new Error(b?.error ?? t("assetCfg.loadFailed"));
        setCfg(b.data.config);
        setAssets(b.data.assets);
        /* stage exists after this render tick */
        requestAnimationFrame(() =>
          placeOpener(b.data.config.opener.x, b.data.config.opener.y),
        );
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, wine?.slug]);

  /* dialog plumbing: focus in, trap Tab, Escape closes, page scroll locked */
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = panelRef.current?.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled])",
      );
      if (!els?.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  const openerRect = (x, y) => ({ left: x, top: y, right: x + OP_W, bottom: y + OP_H });

  const onPointerDown = (e) => {
    if (cfg?.mode !== "single" || !cfg?.opener?.visible) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { px: e.clientX, py: e.clientY, x: rawX.get(), y: rawY.get() };
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    const z = zonePx();
    if (!d || !z) return;
    const x = Math.min(Math.max(d.x + e.clientX - d.px, PAD), z.width - OP_W - PAD);
    const y = Math.min(Math.max(d.y + e.clientY - d.py, PAD), z.height - OP_H - PAD);
    rawX.set(x);
    rawY.set(y);
    setOverlap(intersects(openerRect(x, y), z));
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    const z = zonePx();
    if (!d || !z) return;
    let x = rawX.get();
    let y = rawY.get();
    if (intersects(openerRect(x, y), z)) {
      /* spring out of the logo zone: up when dropped on the upper half,
         down otherwise, clamped to the stage */
      const dropCentre = y + OP_H / 2;
      const zoneCentre = (z.top + z.bottom) / 2;
      y =
        dropCentre <= zoneCentre
          ? Math.max(z.top - OP_H - PAD, PAD)
          : Math.min(z.bottom + PAD, z.height - OP_H - PAD);
      rawX.set(x);
      rawY.set(y); // spring animates the evasion
    }
    setOverlap(false);
    setCfg((c) => ({
      ...c,
      opener: {
        ...c.opener,
        x: Math.round(((x + OP_W / 2) / z.width) * 1000) / 10,
        y: Math.round(((y + OP_H / 2) / z.height) * 1000) / 10,
      },
    }));
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
    const res = await fetch(`/api/admin/assets/${wine.slug}/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: file.name, dataUrl }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      setError(new Error(body?.error ?? t("common.uploadFailed")));
      return;
    }
    setAssets((a) => [...a, { ...body.data, uploaded: true }]);
    setCfg((c) => ({ ...c, asset: body.data.path }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/assets/${wine.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset: cfg.asset,
          mode: cfg.mode,
          accent: cfg.accent,
          opener: cfg.opener,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? t("common.saveFailed", { status: res.status }));
      onSaved?.(wine);
      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = async () => {
    const res = await fetch(`/api/admin/assets/${wine.slug}?fresh=1`);
    const body = await res.json().catch(() => null);
    if (res.ok) {
      setCfg(body.data.config);
      requestAnimationFrame(() =>
        placeOpener(body.data.config.opener.x, body.data.config.opener.y),
      );
    }
  };

  const single = cfg?.mode === "single";
  const accentName = wine?.label?.accent ? tm("accent", wine.label.accent) : null;

  return (
    <AnimatePresence>
      {open && wine && (
        <div className="fixed inset-0 z-[90]">
          <motion.button
            type="button"
            aria-label={t("common.close")}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="absolute inset-0 w-full cursor-default bg-espresso/50 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("assetCfg.ariaTitle", { name: wine.name })}
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={
              reduced ? { duration: 0 } : { type: "spring", stiffness: 250, damping: 34, mass: 0.9 }
            }
            className="absolute inset-y-0 right-0 flex w-full max-w-[1020px] flex-col bg-a-canvas will-transform"
          >
            <header className="flex items-start justify-between gap-4 border-b border-a-ink/[0.08] px-6 py-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
                  {t("assetCfg.eyebrow")}
                </p>
                <h2 className="mt-1 truncate font-playfair text-[21px] leading-tight text-a-ink">
                  {wine.name}
                </h2>
                <p className="mt-0.5 truncate text-[11.5px] text-a-ink/45">
                  {t("assetCfg.sub")}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t("common.close")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-a-ink/12 text-a-ink/70 transition-colors hover:border-champagne hover:text-a-accent"
              >
                <Close className="h-[18px] w-[18px]" />
              </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain p-6 lg:flex-row lg:overflow-hidden">
              {/* ---------------- preview stage ---------------- */}
              <div className="flex flex-col items-center gap-3 lg:flex-1 lg:overflow-y-auto">
                <div
                  ref={stageRef}
                  data-overlap={overlap}
                  className="grain relative shrink-0 overflow-hidden rounded-card-lg border border-charcoal/[0.08] bg-gradient-to-b from-ivory via-cream to-stone/60"
                  style={{ width: STAGE_W, height: STAGE_H, maxWidth: "100%" }}
                >
                  {loading ? (
                    <div className="absolute inset-0 grid place-items-center text-[12px] text-a-ink/40">
                      {t("assetCfg.loading")}
                    </div>
                  ) : single ? (
                    <>
                      {cfg?.asset && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cfg.asset}
                          alt={t("assetCfg.mockupAlt", { name: wine.name })}
                          className="absolute left-1/2 top-1/2 max-h-[92%] max-w-[88%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_24px_40px_rgba(33,21,17,0.28)]"
                        />
                      )}

                      {/* accent-overlay: a soft glow over the label field in
                          the wine's own accent colour */}
                      {cfg?.accent?.enabled && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute rounded-[40%]"
                          style={{
                            left: `${ACCENT_BAND.x}%`,
                            top: `${ACCENT_BAND.y}%`,
                            width: `${ACCENT_BAND.w}%`,
                            height: `${ACCENT_BAND.h}%`,
                            opacity: cfg.accent.opacity,
                            background: `radial-gradient(ellipse at center, ${accentHex} 0%, transparent 70%)`,
                            mixBlendMode: "overlay",
                          }}
                        />
                      )}

                      {/* logo protection zone */}
                      {(showZone || overlap) && (
                        <div
                          aria-hidden="true"
                          data-zone
                          className={`pointer-events-none absolute rounded-lg border-2 border-dashed transition-colors duration-300 ${
                            overlap ? "border-a-accent bg-a-accent/15" : "border-champagne/80 bg-champagne/10"
                          }`}
                          style={{
                            left: `${zone.x}%`,
                            top: `${zone.y}%`,
                            width: `${zone.w}%`,
                            height: `${zone.h}%`,
                          }}
                        >
                          <span
                            className={`absolute -top-5 left-0 text-[9px] font-semibold uppercase tracking-[0.14em] ${
                              overlap ? "text-a-accent" : "text-a-ink/45"
                            }`}
                          >
                            {t("assetCfg.logoZone")}
                          </span>
                        </div>
                      )}

                      {/* corkscrew prop */}
                      {cfg?.opener?.visible && (
                        <motion.div
                          data-opener
                          role="slider"
                          aria-label={t("assetCfg.openerAria")}
                          aria-valuetext={`${cfg.opener.x} % / ${cfg.opener.y} %`}
                          tabIndex={0}
                          onPointerDown={onPointerDown}
                          onPointerMove={onPointerMove}
                          onPointerUp={onPointerUp}
                          style={{ x: sx, y: sy, width: OP_W, height: OP_H, touchAction: "none" }}
                          className={`absolute left-0 top-0 cursor-grab will-transform active:cursor-grabbing ${
                            overlap ? "drop-shadow-[0_0_12px_rgba(107,15,26,0.55)]" : "drop-shadow-[0_14px_18px_rgba(33,21,17,0.3)]"
                          }`}
                        >
                          <Corkscrew className="h-full w-full" />
                        </motion.div>
                      )}
                    </>
                  ) : (
                    /* ---------- 9-wine bundle preview ---------- */
                    <div className="absolute inset-0 grid grid-cols-3 place-items-center gap-1 p-5">
                      {WINES.map((w) => (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          key={w.slug}
                          src={w.photos.front}
                          alt={w.name}
                          className={`max-h-[150px] w-auto object-contain drop-shadow-[0_10px_14px_rgba(33,21,17,0.25)] transition-transform duration-400 ease-out-expo ${
                            w.slug === wine.slug
                              ? "scale-110 rounded-lg ring-2 ring-champagne"
                              : "opacity-80"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-[10.5px] text-a-ink/40">
                  {single
                    ? overlap
                      ? t("assetCfg.overlapNote")
                      : t("assetCfg.readout", {
                          x: cfg?.opener?.x ?? "–",
                          y: cfg?.opener?.y ?? "–",
                          zone:
                            wine.label?.wordmark === WORDMARK.TINTED
                              ? t("assetCfg.zoneRosato")
                              : t("assetCfg.zoneBand"),
                        })
                    : t("assetCfg.bundleNote")}
                </p>
              </div>

              {/* ---------------- controls ---------------- */}
              <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[320px] lg:overflow-y-auto">
                {error && (
                  <p role="alert" className="rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
                    {error.message}
                  </p>
                )}

                <div className={sectionCls}>
                  <p className={legendCls}>{t("assetCfg.previewMode")}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "single", label: t("assetCfg.single") },
                      { key: "bundle", label: t("assetCfg.bundle") },
                    ].map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        aria-pressed={cfg?.mode === m.key}
                        onClick={() => setCfg((c) => ({ ...c, mode: m.key }))}
                        className={`rounded-xl border px-3 py-2.5 text-[12px] transition-colors duration-300 ${
                          cfg?.mode === m.key
                            ? "border-a-accent bg-a-fill text-ivory"
                            : "border-a-ink/12 text-a-ink/60 hover:border-champagne"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={sectionCls}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className={`${legendCls} mb-0`}>{t("assetCfg.chooseMockup")}</p>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-[11.5px] font-medium text-a-accent transition-colors hover:text-a-accent-deep"
                    >
                      {t("common.upload")}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      className="hidden"
                      onChange={(e) => pickUpload(e.target.files?.[0])}
                    />
                  </div>
                  <div className="grid max-h-[240px] grid-cols-3 gap-2 overflow-y-auto pr-1">
                    {assets.map((a) => (
                      <button
                        key={a.path}
                        type="button"
                        title={a.name}
                        aria-pressed={cfg?.asset === a.path}
                        onClick={() => setCfg((c) => ({ ...c, asset: a.path }))}
                        className={`group relative overflow-hidden rounded-xl border bg-a-canvas p-1 transition-colors duration-300 ${
                          cfg?.asset === a.path
                            ? "border-a-accent ring-1 ring-a-accent"
                            : "border-a-ink/[0.08] hover:border-champagne"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={a.path}
                          alt={a.name}
                          loading="lazy"
                          className="h-16 w-full object-contain"
                        />
                        <span className="mt-1 block truncate text-center text-[8.5px] text-a-ink/45">
                          {a.uploaded ? "▲ " : ""}
                          {a.name.replace("uploads/", "")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={`${sectionCls} transition-opacity ${single ? "" : "pointer-events-none opacity-40"}`}
                  aria-disabled={!single}
                >
                  <p className={legendCls}>{t("assetCfg.accentOverlay")}</p>
                  <Toggle
                    on={!!cfg?.accent?.enabled}
                    onChange={(v) => setCfg((c) => ({ ...c, accent: { ...c.accent, enabled: v } }))}
                    label={t("assetCfg.accentGlow", {
                      accent: accentName ?? t("assetCfg.accentFallback"),
                    })}
                  />
                  <div className="mt-3 flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      disabled={!cfg?.accent?.enabled}
                      value={Math.round((cfg?.accent?.opacity ?? 0) * 100)}
                      onChange={(e) =>
                        setCfg((c) => ({
                          ...c,
                          accent: { ...c.accent, opacity: Number(e.target.value) / 100 },
                        }))
                      }
                      className="flex-1"
                      style={{ accentColor: accentHex }}
                      aria-label={t("assetCfg.intensity")}
                    />
                    <span className="w-10 text-right text-[11px] text-a-ink/50 tabular-nums">
                      {Math.round((cfg?.accent?.opacity ?? 0) * 100)} %
                    </span>
                  </div>
                </div>

                <div
                  className={`${sectionCls} transition-opacity ${single ? "" : "pointer-events-none opacity-40"}`}
                  aria-disabled={!single}
                >
                  <p className={legendCls}>{t("assetCfg.opener")}</p>
                  <Toggle
                    on={!!cfg?.opener?.visible}
                    onChange={(v) => setCfg((c) => ({ ...c, opener: { ...c.opener, visible: v } }))}
                    label={t("assetCfg.showOpener")}
                  />
                  <div className="mt-3">
                    <Toggle on={showZone} onChange={setShowZone} label={t("assetCfg.showZone")} />
                  </div>
                  <p className="mt-3 text-[10.5px] leading-relaxed text-a-ink/40">
                    {t("assetCfg.dragNote")}
                  </p>
                </div>
              </div>
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-a-ink/[0.08] bg-a-canvas px-6 py-4">
              <button
                type="button"
                onClick={resetDefaults}
                className="rounded-full px-4 py-2.5 text-[12px] tracking-[0.06em] text-a-ink/55 transition-colors hover:text-a-accent"
              >
                {t("common.reset")}
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-4 py-2.5 text-[12px] tracking-[0.06em] text-a-ink/55 transition-colors hover:text-a-accent"
                >
                  {t("common.cancel")}
                </button>
                <motion.button
                  type="button"
                  disabled={saving || loading}
                  onClick={save}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-7 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-opacity disabled:opacity-50"
                >
                  {saving ? t("common.saving") : t("common.save")}
                </motion.button>
              </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
