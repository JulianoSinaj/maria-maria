"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { VIDEO_MAX_BYTES, VIDEO_RATE_RANGE } from "@/lib/video/slots";
import { useAdminI18n } from "../i18n/AdminI18n";
import AssetPicker from "./AssetPicker";

/* Video loops and the stills that stand in for them.
   ==================================================================
   Three loops run on the public site and none of them had an editor: the
   region panorama that carries the whole /regionen hero, and the two pouring
   shots behind the colour chapter of every wine landing page.

   The poster frame is given the same weight as the file itself, because it is
   not a fallback for a slow line — it is what a large share of visitors
   actually see. Autoplay is refused on metered connections and in low-power
   mode, and RegionHeroVideo pauses the video outright for anyone who has
   asked for reduced motion. Swapping a loop without its still would leave
   those people looking at the previous take.

   The preview plays muted, looped and inline, at the rate the storefront
   uses, and can be flipped to the poster to check the two against each
   other — the seam between them is what the colour chapter cross-fades. */

const CARD = "rounded-card-lg border border-a-ink/[0.08] bg-a-surface/50 p-4 sm:p-5";
const LEGEND = "text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55";
const MB = Math.round(VIDEO_MAX_BYTES / 1024 / 1024);

function Slot({ slot, onSaved, t, reduced }) {
  const fileRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);

  const [draft, setDraft] = useState(() => structuredClone(slot.config));
  const [showPoster, setShowPoster] = useState(false);
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(null); // "upload" | "save" | null
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => setDraft(structuredClone(slot.config)), [slot.config]);

  /* playbackRate does not survive a source change and is not an attribute —
     it has to be set on the element, every time the source settles. */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.playbackRate = draft.rate;
  }, [draft.rate, draft.src, showPoster]);

  const dirty = JSON.stringify(slot.config) !== JSON.stringify(draft);

  const setFocus = (event) => {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    setDraft((current) => ({
      ...current,
      focus: {
        x: Math.round(((event.clientX - box.left) / box.width) * 100),
        y: Math.round(((event.clientY - box.top) / box.height) * 100),
      },
    }));
  };

  const upload = async (file) => {
    if (!file) return;
    setError(null);
    if (!/\.(mp4|webm)$/i.test(file.name)) return setError(new Error(t("videoLoop.typeError")));
    if (file.size > VIDEO_MAX_BYTES) return setError(new Error(t("videoLoop.sizeError", { mb: MB })));

    setBusy("upload");
    try {
      /* The file itself as the body, not a base64 data URL inside JSON: the
         detour would inflate a 24 MB panorama to 32 MB of text and hold it
         twice in memory. See app/api/admin/video/upload/route.js. */
      const res = await fetch("/api/admin/video/upload", {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream", "X-Upload-Name": file.name },
        body: file,
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.error ?? t("common.uploadFailed"));
      setDraft((current) => ({ ...current, src: payload.data.path }));
    } catch (e) {
      setError(e);
    } finally {
      setBusy(null);
    }
  };

  const save = async () => {
    setBusy("save");
    setError(null);
    try {
      const res = await fetch("/api/admin/video", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: slot.key, ...draft }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.error ?? t("common.saveFailed", { status: res.status }));
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2800);
      await onSaved();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(null);
    }
  };

  const reset = async () => {
    setBusy("save");
    try {
      await fetch(`/api/admin/video?key=${encodeURIComponent(slot.key)}`, { method: "DELETE" });
      await onSaved();
    } finally {
      setBusy(null);
    }
  };

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 24 }}
      className={CARD}
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-playfair text-[17px] text-a-ink">{t(`videoLoop.names.${slot.key}`)}</h4>
          <p className="mt-0.5 truncate text-[10.5px] text-a-ink/40">{slot.route}</p>
        </div>
        {slot.usedBy && (
          <span className="rounded-full border border-a-ink/12 px-2.5 py-1 text-[10px] text-a-ink/50">
            {slot.usedBy.length === 1
              ? t("videoLoop.usedByOne")
              : t("videoLoop.usedBy", { count: slot.usedBy.length })}
          </span>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* ---- stage ---- */}
        <div className="flex flex-col gap-2">
          <button
            ref={stageRef}
            type="button"
            onClick={setFocus}
            title={t("videoLoop.stageTitle")}
            style={{ aspectRatio: slot.ratio }}
            className="relative block w-full cursor-crosshair overflow-hidden rounded-card border border-a-ink/[0.08] bg-espresso"
          >
            {showPoster ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={draft.poster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: `${draft.focus.x}% ${draft.focus.y}%` }}
              />
            ) : (
              <video
                ref={videoRef}
                key={draft.src}
                src={draft.src}
                poster={draft.poster}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                disablePictureInPicture
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: `${draft.focus.x}% ${draft.focus.y}%` }}
              />
            )}

            {/* the veil the page actually draws over this stage */}
            {slot.veil === "dark" && (
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/40" />
            )}

            <span
              aria-hidden="true"
              className="pointer-events-none absolute z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ivory shadow-chip transition-[left,top] duration-300 ease-out-expo"
              style={{
                left: `${draft.focus.x}%`,
                top: `${draft.focus.y}%`,
                background: "rgba(107,15,26,0.55)",
              }}
            />
          </button>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowPoster((v) => !v)}
              className="rounded-full border border-a-ink/12 px-3 py-1.5 text-[11px] text-a-ink/60 transition-colors hover:border-champagne hover:text-a-accent"
            >
              {showPoster ? t("videoLoop.showVideo") : t("videoLoop.showPoster")}
            </button>
            <p className="text-[10.5px] text-a-ink/40 tabular-nums">
              {t("videoLoop.focusLabel")}: {draft.focus.x} % / {draft.focus.y} %
            </p>
          </div>

          {(slot.missing.video || slot.missing.poster) && (
            <p role="alert" className="rounded-xl bg-a-accent/10 px-3 py-2 text-[11px] text-a-accent">
              {slot.missing.video ? t("videoLoop.missingVideo") : t("videoLoop.missingPoster")}
            </p>
          )}
        </div>

        {/* ---- controls ---- */}
        <div className="flex flex-col gap-3">
          {error && (
            <p role="alert" className="rounded-xl bg-a-accent/10 px-3 py-2 text-[11.5px] text-a-accent">
              {error.message}
            </p>
          )}

          <div>
            <p className={LEGEND}>{t("videoLoop.video")}</p>
            <p className="mt-1 break-all text-[10.5px] text-a-ink/45">{draft.src}</p>
            <motion.button
              type="button"
              whileTap={reduced ? undefined : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              disabled={busy === "upload"}
              onClick={() => fileRef.current?.click()}
              className="mt-2 rounded-full border border-a-ink/12 px-4 py-2 text-[11.5px] text-a-ink/70 transition-colors hover:border-champagne hover:text-a-accent disabled:opacity-50"
            >
              {busy === "upload" ? t("videoLoop.uploading") : t("videoLoop.uploadVideo")}
            </motion.button>
            <input
              ref={fileRef}
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={(e) => {
                upload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>

          <div className="border-t border-a-ink/[0.07] pt-3">
            <p className={LEGEND}>{t("videoLoop.poster")}</p>
            <div className="mt-2 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draft.poster}
                alt=""
                className="h-12 w-16 shrink-0 rounded-lg border border-a-ink/[0.08] object-cover"
              />
              <button
                type="button"
                onClick={() => setPicking(true)}
                className="rounded-full border border-a-ink/12 px-3.5 py-1.5 text-[11.5px] text-a-ink/70 transition-colors hover:border-champagne hover:text-a-accent"
              >
                {t("videoLoop.choosePoster")}
              </button>
            </div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-a-ink/45">
              {t("videoLoop.posterWhy")}
            </p>
          </div>

          <label className="block border-t border-a-ink/[0.07] pt-3">
            <span className="mb-1 flex items-baseline justify-between">
              <span className="text-[10.5px] text-a-ink/50">
                {t("videoLoop.rate")}
                <span className="ml-1.5 text-a-ink/30">· {t("videoLoop.rateHint")}</span>
              </span>
              <span className="text-[10.5px] tabular-nums text-a-ink/45">
                {draft.rate.toFixed(2)}×
              </span>
            </span>
            <input
              type="range"
              min={VIDEO_RATE_RANGE.min * 100}
              max={VIDEO_RATE_RANGE.max * 100}
              step={5}
              value={Math.round(draft.rate * 100)}
              onChange={(e) =>
                setDraft((current) => ({ ...current, rate: Number(e.target.value) / 100 }))
              }
              aria-label={t("videoLoop.rate")}
              className="w-full accent-a-accent"
            />
          </label>

          <div className="flex items-center justify-between gap-2 border-t border-a-ink/[0.07] pt-3">
            <button
              type="button"
              onClick={reset}
              disabled={busy !== null}
              className="text-[11.5px] text-a-ink/50 transition-colors hover:text-a-accent disabled:opacity-50"
            >
              {t("common.reset")}
            </button>
            <div className="flex items-center gap-2.5">
              <AnimatePresence>
                {savedAt && (
                  <motion.span
                    role="status"
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] font-medium text-vine"
                  >
                    {t("common.saved")}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.button
                type="button"
                disabled={busy !== null || !dirty}
                onClick={save}
                whileTap={reduced ? undefined : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-5 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.12em] text-ivory transition-opacity disabled:opacity-40"
              >
                {busy === "save" ? t("common.saving") : t("common.save")}
              </motion.button>
            </div>
          </div>

          {slot.usedBy && (
            <p className="text-[10px] leading-relaxed text-a-ink/35">{t("videoLoop.captionNote")}</p>
          )}
        </div>
      </div>

      <AssetPicker
        open={picking}
        current={draft.poster}
        onClose={() => setPicking(false)}
        onPick={(path) => setDraft((current) => ({ ...current, poster: path }))}
      />
    </motion.article>
  );
}

export default function VideoLoopManager() {
  const reduced = useReducedMotion();
  const { t } = useAdminI18n();
  const [slots, setSlots] = useState(null);
  const [error, setError] = useState(null);

  const load = () =>
    fetch("/api/admin/video")
      .then((r) => r.json())
      .then((body) => {
        setSlots(body.data.slots);
        setError(null);
      })
      .catch(setError);

  useEffect(() => {
    load();
  }, []);

  if (!slots) {
    return (
      <div className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/50 p-10 text-center text-[12.5px] text-a-ink/45">
        {error ? t("videoLoop.loadError", { message: error.message }) : t("videoLoop.loading")}
      </div>
    );
  }

  return (
    <section aria-label={t("videoLoop.sectionAria")} className="flex flex-col gap-4">
      <p className="rounded-xl border border-a-ink/[0.08] bg-a-surface/40 px-4 py-2.5 text-[11.5px] leading-relaxed text-a-ink/60">
        {t("videoLoop.posterNote")}
      </p>
      {slots.map((slot) => (
        <Slot key={slot.key} slot={slot} onSaved={load} t={t} reduced={reduced} />
      ))}
    </section>
  );
}
