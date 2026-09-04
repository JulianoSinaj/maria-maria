"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { PUBLISH, PUBLISH_STATES } from "@/lib/regions/schema";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Herkünfte — Sichtbarkeit und Weinzuordnung.

   Zwei Entscheidungen je Herkunft, beide keine Textarbeit: Ist sie
   öffentlich? Und welche Weine gehören zu ihr? Der TEXT (Name, Rubrik,
   Beschreibung, CTA) wird im Seiten-Editor in allen vier Sprachen
   gepflegt — die Karte verlinkt dorthin, statt dieselben Sätze ein zweites
   Mal zur Bearbeitung anzubieten.

   Der Status ist dreistufig, weil „geplant" etwas anderes ist als „live":
   Er trägt ein Datum, ab dem die Herkunft von selbst erscheint. Was davon
   WIRKLICH gilt, rechnet der Server bei jedem Rendern neu (effectiveState);
   die Karte zeigt es als Kennzeichen an, damit „geplant, aber längst
   fällig" nicht wie „unsichtbar" aussieht.

   Das Anbaugebiet steht je Wein, wird hier aber nur angezeigt: gepflegt
   wird es im Portfolio (appellation.zone). Zwei Eingabefelder für dieselbe
   Angabe wären zwei Wahrheiten. */

const sectionCls = "rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 p-4";
const legendCls = "mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55";
const SPRING = { type: "spring", stiffness: 340, damping: 32 };

/* ISO ↔ <input type="datetime-local">. Das Feld spricht Ortszeit ohne Zone,
   gespeichert wird UTC — sonst verschöbe sich ein Termin, sobald ihn jemand
   aus einer anderen Zeitzone ansieht. */
const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

const fromLocalInput = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

/* Vorschlag beim Wechsel auf „geplant": morgen früh. Ein Termin in der
   Vergangenheit wäre sofort live und damit kein Termin. */
function tomorrowMorning() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

export default function RegionStateBoard() {
  const reduced = useReducedMotion();
  const { t, locale, intl } = useAdminI18n();
  const [data, setData] = useState(null);
  const [draft, setDraft] = useState(null); // key → { publish, wines }
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  const adopt = (body) => {
    setData(body.data);
    setDraft(
      Object.fromEntries(
        body.data.regions.map((r) => [
          r.key,
          { publish: { ...r.publish }, wines: [...r.wines], custom: r.custom },
        ]),
      ),
    );
  };

  useEffect(() => {
    fetch("/api/admin/regions")
      .then((r) => r.json())
      .then(adopt)
      .catch(setError);
  }, []);

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(intl, { dateStyle: "medium", timeStyle: "short" }),
    [intl],
  );

  const setPublish = (key, patch) =>
    setDraft((d) => ({ ...d, [key]: { ...d[key], publish: { ...d[key].publish, ...patch } } }));

  const toggleWine = (key, slug) =>
    setDraft((d) => {
      const current = d[key].wines;
      const wines = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
      return { ...d, [key]: { ...d[key], wines, custom: true } };
    });

  const resetWines = (key) => {
    const region = data.regions.find((r) => r.key === key);
    setDraft((d) => ({ ...d, [key]: { ...d[key], wines: [...region.defaultWines], custom: false } }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const regions = Object.fromEntries(
        Object.entries(draft).map(([key, value]) => [
          key,
          {
            publish: {
              state: value.publish.state,
              scheduledAt: value.publish.state === PUBLISH.SCHEDULED ? value.publish.scheduledAt : null,
            },
            /* Deckt sich die Auswahl mit dem Katalog, wird sie als „keine
               eigene Zuordnung" gespeichert: ein neuer Wein landet dann
               automatisch bei seiner Herkunft, statt zu fehlen. */
            wines: value.custom ? value.wines : null,
          },
        ]),
      );
      const res = await fetch("/api/admin/regions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regions }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? t("common.saveFailed", { status: res.status }));
      adopt(body);
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2800);
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/regions", { method: "DELETE" });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? t("common.saveFailed", { status: res.status }));
      adopt(body);
    } catch (e) {
      setError(e);
    }
  };

  if (!data || !draft) {
    return (
      <div className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/50 p-10 text-center text-[12.5px] text-a-ink/45">
        {error ? t("regionState.loadError", { message: error.message }) : t("regionState.loading")}
      </div>
    );
  }

  const unassigned = data.catalogue.filter(
    (w) => !Object.values(draft).some((r) => r.wines.includes(w.slug)),
  );

  return (
    <section aria-label={t("regionState.sectionAria")} className="flex flex-col gap-5">
      {error && (
        <p role="alert" className="rounded-xl bg-a-accent/10 px-4 py-3 text-[12px] text-a-accent">
          {error.message}
        </p>
      )}

      {/* Ein Wein ohne Herkunft taucht in keiner regionalen Auswahl auf —
          das sagt die Leiste, solange es so ist. */}
      <AnimatePresence initial={false}>
        {unassigned.length > 0 && (
          <motion.p
            role="status"
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-a-gold/30 bg-a-amber/10 px-4 py-3 text-[12px] text-a-ink/75"
          >
            {t("regionState.unassigned", {
              n: unassigned.length,
              names: unassigned.map((w) => w.name).join(", "),
            })}
          </motion.p>
        )}
      </AnimatePresence>

      {!data.persisted && (
        <p className="rounded-xl border border-a-ink/[0.08] bg-a-surface/60 px-4 py-3 text-[11.5px] leading-relaxed text-a-ink/55">
          {t("regionState.ephemeral")}
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        {data.regions.map((region, i) => {
          const state = draft[region.key];
          const copy = region.copy[locale] ?? region.copy.de;
          const effective =
            state.publish.state === PUBLISH.SCHEDULED
              ? Date.parse(state.publish.scheduledAt ?? "") <= Date.now()
                ? PUBLISH.LIVE
                : PUBLISH.DRAFT
              : state.publish.state;
          const live = effective === PUBLISH.LIVE;

          return (
            <motion.article
              key={region.key}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 24, delay: reduced ? 0 : i * 0.05 }}
              className="flex flex-col gap-4 rounded-card-lg border border-a-ink/[0.08] bg-a-surface/60 p-5"
            >
              {/* ---- Kopf: Name, Rubrik, wirklicher Zustand ---- */}
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[10px] uppercase tracking-[0.2em] text-a-accent/55">
                    {copy.page.tag || copy.home.tag}
                  </p>
                  <h4 className="mt-0.5 truncate font-playfair text-[19px] text-a-ink">
                    {copy.page.name || copy.home.name || region.key}
                  </h4>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[10.5px] font-medium ${
                    live ? "bg-vine/12 text-vine" : "bg-a-ink/[0.07] text-a-ink/50"
                  }`}
                >
                  {live ? t("regionState.visible") : t("regionState.hidden")}
                </span>
              </header>

              {/* ---- Sichtbarkeit ---- */}
              <div className={sectionCls}>
                <p className={legendCls}>{t("regionState.publishLegend")}</p>
                <div
                  className="grid grid-cols-3 gap-1 rounded-full border border-a-ink/12 p-1"
                  role="radiogroup"
                  aria-label={t("regionState.publishLegend")}
                >
                  {PUBLISH_STATES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={state.publish.state === value}
                      onClick={() =>
                        setPublish(region.key, {
                          state: value,
                          scheduledAt:
                            value === PUBLISH.SCHEDULED
                              ? state.publish.scheduledAt ?? tomorrowMorning()
                              : state.publish.scheduledAt,
                        })
                      }
                      className={`relative rounded-full px-2 py-1.5 text-[11px] transition-colors duration-300 ${
                        state.publish.state === value ? "text-ivory" : "text-a-ink/55 hover:text-a-accent"
                      }`}
                    >
                      {state.publish.state === value && (
                        <motion.span
                          layoutId={`publish-${region.key}`}
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                          transition={reduced ? { duration: 0 } : SPRING}
                        />
                      )}
                      <span className="relative z-10">{t(`regionState.state.${value}`)}</span>
                    </button>
                  ))}
                </div>

                {/* Das Datum klappt nur für „geplant" auf — und trägt die
                    Höhe, damit die Karte beim Wechsel nicht springt. */}
                <motion.div
                  initial={false}
                  animate={{
                    height: state.publish.state === PUBLISH.SCHEDULED ? "auto" : 0,
                    opacity: state.publish.state === PUBLISH.SCHEDULED ? 1 : 0,
                  }}
                  transition={reduced ? { duration: 0 } : { duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <label className="mt-3 block">
                    <span className="mb-1 block text-[10.5px] text-a-ink/50">
                      {t("regionState.scheduledAt")}
                    </span>
                    <input
                      type="datetime-local"
                      value={toLocalInput(state.publish.scheduledAt)}
                      onChange={(e) =>
                        setPublish(region.key, { scheduledAt: fromLocalInput(e.target.value) })
                      }
                      className="h-10 w-full rounded-xl border border-a-ink/12 bg-a-canvas px-3 text-[12.5px] text-a-ink transition-colors duration-300 focus:border-champagne focus:outline-none"
                    />
                  </label>
                  {state.publish.scheduledAt && (
                    <p className="mt-1.5 text-[10.5px] text-a-ink/45">
                      {live
                        ? t("regionState.dueSince", {
                            date: dateFmt.format(new Date(state.publish.scheduledAt)),
                          })
                        : t("regionState.dueOn", {
                            date: dateFmt.format(new Date(state.publish.scheduledAt)),
                          })}
                    </p>
                  )}
                </motion.div>

                {!live && (
                  <p className="mt-3 text-[10.5px] leading-relaxed text-a-ink/45">
                    {t("regionState.hiddenNote")}
                  </p>
                )}
              </div>

              {/* ---- Weine dieser Herkunft ---- */}
              <div className={sectionCls}>
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <p className={`${legendCls} mb-0`}>{t("regionState.winesLegend")}</p>
                  <span className="text-[10.5px] tabular-nums text-a-ink/40">
                    {t("regionState.assigned", { n: state.wines.length })}
                  </span>
                </div>

                <ul className="flex flex-col gap-1.5">
                  {data.catalogue.map((wine) => {
                    const on = state.wines.includes(wine.slug);
                    const elsewhere =
                      !on &&
                      Object.entries(draft).some(
                        ([key, value]) => key !== region.key && value.wines.includes(wine.slug),
                      );
                    return (
                      <li key={wine.slug}>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={on}
                          onClick={() => toggleWine(region.key, wine.slug)}
                          className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors duration-300 ${
                            on
                              ? "border-a-accent/30 bg-a-accent/[0.07]"
                              : "border-transparent hover:border-a-ink/12"
                          } ${elsewhere ? "opacity-45" : ""}`}
                        >
                          <span
                            aria-hidden="true"
                            className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border transition-colors duration-300 ${
                              on ? "border-a-accent bg-a-fill text-ivory" : "border-a-ink/25"
                            }`}
                          >
                            {on && (
                              <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                                <path
                                  d="M2.5 6.2 4.8 8.5 9.5 3.8"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12px] text-a-ink/80">{wine.name}</span>
                            <span className="block truncate text-[10px] text-a-ink/40">
                              {wine.zone || t("regionState.zoneUnknown")}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-a-ink/35">
                    {state.custom ? t("regionState.customBadge") : t("regionState.defaultBadge")}
                  </span>
                  {state.custom && (
                    <button
                      type="button"
                      onClick={() => resetWines(region.key)}
                      className="text-[11px] text-a-ink/50 transition-colors hover:text-a-accent"
                    >
                      {t("regionState.resetWines")}
                    </button>
                  )}
                </div>
              </div>

              {/* Der Text liegt woanders — und die Karte sagt, wo. */}
              <p className="text-[10.5px] leading-relaxed text-a-ink/45">
                {t("regionState.textHint")}{" "}
                <a
                  href={`/admin/seiten?page=regionen&block=regions.${region.key}`}
                  className="text-a-accent underline decoration-a-accent/30 underline-offset-2 transition-colors hover:decoration-a-accent"
                >
                  {t("regionState.textLink")}
                </a>
              </p>
            </motion.article>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
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
    </section>
  );
}
