"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { HERO_ALT_MAX } from "@/lib/heroes/pages";
import { useAdminI18n } from "../i18n/AdminI18n";
import AssetPicker from "./AssetPicker";

/* Hero stages of the subpages — motif, focal point and alt text.
   ==================================================================
   Until now exactly one hero had an editor: the homepage. Every other stage
   carried its motif, its crop and its alternative text inside a server
   component, out of reach of the desk that is responsible for them.

   Master and detail rather than fourteen stacked cards: thirteen stages, nine
   of which are wine landing pages that differ only in their motif. A rail of
   thumbnails on the left, one full editor on the right — and only one preview
   image in flight at a time.

   The preview is cut to the RATIO OF THE REAL STAGE, not to a convenient box.
   A focal point is a promise about what survives the crop, and a 16:9 preview
   of a 4:3 figure would keep that promise on screen and break it on the page. */

const CARD = "rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 p-4";
const LEGEND = "mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55";
const FIELD =
  "w-full rounded-xl border border-a-ink/12 bg-a-canvas px-3 py-2 text-[12.5px] text-a-ink transition-colors duration-300 placeholder:text-a-ink/30 focus:border-champagne focus:outline-none";

/* A dot per slot: green once the four alt texts are there, amber while one is
   missing, bordeaux when the file behind the motif is gone. */
function StatusDot({ tone }) {
  const colour =
    tone === "missing" ? "bg-a-accent" : tone === "partial" ? "bg-champagne" : "bg-vine";
  return <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${colour}`} />;
}

export default function PageHeroManager() {
  const reduced = useReducedMotion();
  const { t } = useAdminI18n();
  const stageRef = useRef(null);

  const [pages, setPages] = useState(null);
  const [altLocales, setAltLocales] = useState(["de", "it", "en", "cs"]);
  const [error, setError] = useState(null);
  const [group, setGroup] = useState("page");
  const [selected, setSelected] = useState("weine");
  const [draft, setDraft] = useState(null);
  const [altLocale, setAltLocale] = useState("de");
  const [picking, setPicking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const load = () =>
    fetch("/api/admin/heroes")
      .then((r) => r.json())
      .then((body) => {
        setPages(body.data.pages);
        setAltLocales(body.data.altLocales);
        setError(null);
      })
      .catch(setError);

  useEffect(() => {
    load();
  }, []);

  const page = useMemo(() => pages?.find((p) => p.key === selected) ?? null, [pages, selected]);

  /* A fresh draft whenever a different slot opens, so an unsaved edit never
     leaks into the next one. */
  useEffect(() => {
    if (!page) return;
    setDraft(structuredClone(page.config));
    setSavedAt(null);
  }, [page?.key]); // eslint-disable-line react-hooks/exhaustive-deps

  const inGroup = useMemo(() => pages?.filter((p) => p.group === group) ?? [], [pages, group]);

  const dirty = useMemo(
    () => Boolean(page && draft) && JSON.stringify(page.config) !== JSON.stringify(draft),
    [page, draft],
  );

  const toneFor = (entry) => {
    if (entry.missing) return "missing";
    const resolved = altLocales.map((l) => entry.config.alt[l] ?? entry.live.alt[l]);
    return resolved.every((text) => text?.trim()) ? "ok" : "partial";
  };

  const setFocus = (event) => {
    if (page?.ownedBy) return;
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    setDraft((current) => ({
      ...current,
      image: {
        ...current.image,
        focus: {
          x: Math.round(((event.clientX - box.left) / box.width) * 100),
          y: Math.round(((event.clientY - box.top) / box.height) * 100),
        },
      },
    }));
  };

  const save = async () => {
    if (!draft || !page) return;
    setSaving(true);
    setError(null);
    try {
      /* The homepage motif belongs to the hero editor above; sending it here
         would give one value two owners, and the API refuses it. */
      const body = page.ownedBy
        ? { key: page.key, alt: draft.alt }
        : { key: page.key, image: draft.image, alt: draft.alt };
      const res = await fetch("/api/admin/heroes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.error ?? t("common.saveFailed", { status: res.status }));
      await load();
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2800);
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!page) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/heroes?key=${encodeURIComponent(page.key)}`, { method: "DELETE" });
      await load();
      const fresh = await fetch("/api/admin/heroes")
        .then((r) => r.json())
        .then((b) => b.data.pages.find((p) => p.key === page.key));
      if (fresh) setDraft(structuredClone(fresh.config));
    } finally {
      setSaving(false);
    }
  };

  if (!pages || !draft || !page) {
    return (
      <div className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/50 p-10 text-center text-[12.5px] text-a-ink/45">
        {error ? t("pageHero.loadError", { message: error.message }) : t("pageHero.loading")}
      </div>
    );
  }

  const focus = draft.image.focus;
  const liveAlt = page.live.alt[altLocale] ?? "";
  const override = draft.alt[altLocale];

  return (
    <section aria-label={t("pageHero.sectionAria")} className="flex flex-col gap-4">
      <p className="rounded-xl border border-champagne/40 bg-champagne/[0.08] px-4 py-2.5 text-[11.5px] leading-relaxed text-a-ink/70">
        {t("pageHero.notLive")}
      </p>

      <div className="grid gap-5 xl:grid-cols-[270px_1fr]">
        {/* ---------------- the rail of stages ---------------- */}
        <div className="flex flex-col gap-3">
          <div role="tablist" aria-label={t("pageHero.listAria")} className="flex gap-1.5">
            {["page", "wine"].map((key) => {
              const active = group === key;
              return (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => {
                    setGroup(key);
                    const first = pages.find((p) => p.group === key);
                    if (first) setSelected(first.key);
                  }}
                  className={`relative flex-1 rounded-full px-3 py-2 text-[11.5px] transition-colors duration-300 ${
                    active ? "text-ivory" : "text-a-ink/60 hover:text-a-accent"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="hero-group-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                      transition={
                        reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32 }
                      }
                    />
                  )}
                  {!active && (
                    <span aria-hidden="true" className="absolute inset-0 rounded-full border border-a-ink/12" />
                  )}
                  <span className="relative z-10">
                    {key === "page" ? t("pageHero.groupPage") : t("pageHero.groupWine")}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex max-h-[430px] flex-col gap-1.5 overflow-y-auto pr-1">
            {inGroup.map((entry) => {
              const active = entry.key === selected;
              return (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => setSelected(entry.key)}
                  aria-current={active}
                  className={`flex items-center gap-3 rounded-xl border p-2 text-left transition-colors duration-300 ${
                    active
                      ? "border-a-accent bg-a-surface"
                      : "border-a-ink/[0.08] hover:border-champagne"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.config.image.src}
                    alt=""
                    loading="lazy"
                    className="h-10 w-14 shrink-0 rounded-lg object-cover"
                    style={{
                      objectPosition: `${entry.config.image.focus.x}% ${entry.config.image.focus.y}%`,
                    }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <StatusDot tone={toneFor(entry)} />
                      <span className="truncate text-[12px] text-a-ink">
                        {entry.label ?? t(`pageHero.names.${entry.key}`)}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] text-a-ink/40">
                      {entry.route}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------- the editor ---------------- */}
        <div className="flex flex-col gap-4">
          {error && (
            <p role="alert" className="rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
              {error.message}
            </p>
          )}

          <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
            {/* stage preview, cut like the real one */}
            <div className="flex flex-col gap-2">
              <motion.button
                key={page.key}
                ref={stageRef}
                type="button"
                onClick={setFocus}
                title={page.ownedBy ? undefined : t("pageHero.stageTitle")}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 24 }}
                style={{ aspectRatio: page.ratio }}
                className={`relative block w-full overflow-hidden rounded-card-lg border border-a-ink/[0.08] bg-espresso ${
                  page.ownedBy ? "cursor-default" : "cursor-crosshair"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.image.src}
                  alt={t("pageHero.imgAlt", { route: page.route })}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
                />
                {!page.ownedBy && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ivory shadow-chip transition-[left,top] duration-300 ease-out-expo"
                    style={{
                      left: `${focus.x}%`,
                      top: `${focus.y}%`,
                      background: "rgba(107,15,26,0.55)",
                    }}
                  />
                )}
              </motion.button>

              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[10.5px] text-a-ink/40">
                  {page.ownedBy
                    ? t("pageHero.ratioNote", { ratio: page.ratio })
                    : t("pageHero.readout", { x: focus.x, y: focus.y })}
                </p>
                {dirty && (
                  <span className="text-[10px] uppercase tracking-[0.14em] text-a-accent/70">
                    {t("assetMeta.unsaved")}
                  </span>
                )}
              </div>

              {page.missing && (
                <p role="alert" className="rounded-xl bg-a-accent/10 px-3 py-2 text-[11px] text-a-accent">
                  {t("pageHero.missing")}
                </p>
              )}
            </div>

            {/* motif + provenance */}
            <div className="flex flex-col gap-4">
              <div className={CARD}>
                <p className={LEGEND}>{t("pageHero.motif")}</p>
                {page.ownedBy ? (
                  <p className="text-[11.5px] leading-relaxed text-a-ink/55">
                    {t("pageHero.ownedByHero")}
                  </p>
                ) : (
                  <>
                    <p className="mb-2 break-all text-[10.5px] text-a-ink/45">{draft.image.src}</p>
                    <motion.button
                      type="button"
                      whileTap={reduced ? undefined : { scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      onClick={() => setPicking(true)}
                      className="rounded-full border border-a-ink/12 px-4 py-2 text-[11.5px] text-a-ink/70 transition-colors hover:border-champagne hover:text-a-accent"
                    >
                      {t("pageHero.choose")}
                    </motion.button>
                  </>
                )}
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[10.5px]">
                  <dt className="text-a-ink/40">{t("pageHero.route")}</dt>
                  <dd className="truncate text-a-ink/65">{page.route}</dd>
                  <dt className="text-a-ink/40">{t("pageHero.component")}</dt>
                  <dd className="truncate text-a-ink/65">{page.source}</dd>
                </dl>
              </div>
            </div>
          </div>

          {/* ---------------- alt text, per storefront locale ---------------- */}
          <div className={CARD}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className={`${LEGEND} mb-0`}>{t("pageHero.altHeading")}</p>
              <div role="tablist" className="flex gap-1">
                {altLocales.map((locale) => {
                  const active = locale === altLocale;
                  const resolved = draft.alt[locale] ?? page.live.alt[locale];
                  return (
                    <button
                      key={locale}
                      role="tab"
                      type="button"
                      aria-selected={active}
                      onClick={() => setAltLocale(locale)}
                      className={`relative rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                        active ? "text-ivory" : "text-a-ink/55 hover:text-a-accent"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="hero-alt-pill"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                          transition={
                            reduced
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 340, damping: 32 }
                          }
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        {locale}
                        {!resolved?.trim() && (
                          <span
                            aria-hidden="true"
                            className={`h-1 w-1 rounded-full ${active ? "bg-ivory/80" : "bg-champagne"}`}
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-a-ink/[0.06] bg-a-canvas/60 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.14em] text-a-ink/40">
                {t("pageHero.altLive")}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-a-ink/70">
                {liveAlt || <span className="italic text-a-ink/35">{t("pageHero.altEmptyLive")}</span>}
              </p>
              {page.altKind === "generated" && (
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-a-ink/45">
                  {t("pageHero.altGeneratedNote")}
                </p>
              )}
            </div>

            <label className="mt-3 block">
              <span className="mb-1 flex items-baseline justify-between">
                <span className="text-[10.5px] text-a-ink/50">{t("pageHero.altOverride")}</span>
                <span className="text-[10px] tabular-nums text-a-ink/35">
                  {override === null
                    ? t("pageHero.altUnset")
                    : `${override.length}/${HERO_ALT_MAX}`}
                </span>
              </span>
              <textarea
                rows={2}
                maxLength={HERO_ALT_MAX}
                value={override ?? ""}
                placeholder={t("pageHero.altPlaceholder")}
                onChange={(e) =>
                  setDraft((current) => ({
                    ...current,
                    alt: { ...current.alt, [altLocale]: e.target.value },
                  }))
                }
                aria-label={`${t("pageHero.altOverride")} ${altLocale}`}
                className={FIELD}
              />
            </label>

            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    alt: { ...current.alt, [altLocale]: liveAlt },
                  }))
                }
                className="text-[11px] text-a-accent transition-colors hover:text-a-accent-deep"
              >
                {t("pageHero.altUseLive")}
              </button>
              {override !== null && (
                <button
                  type="button"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      alt: { ...current.alt, [altLocale]: null },
                    }))
                  }
                  className="text-[11px] text-a-ink/45 transition-colors hover:text-a-accent"
                >
                  {t("pageHero.altClear")}
                </button>
              )}
            </div>
          </div>

          {/* ---------------- actions ---------------- */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={reset}
              disabled={saving}
              className="rounded-full px-4 py-2.5 text-[12px] tracking-[0.06em] text-a-ink/55 transition-colors hover:text-a-accent disabled:opacity-50"
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
                disabled={saving || !dirty}
                onClick={save}
                whileTap={reduced ? undefined : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-7 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-opacity disabled:opacity-40"
              >
                {saving ? t("common.saving") : t("common.save")}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AssetPicker
        open={picking}
        current={draft.image.src}
        onClose={() => setPicking(false)}
        onPick={(path) =>
          setDraft((current) => ({ ...current, image: { ...current.image, src: path } }))
        }
      />
    </section>
  );
}
