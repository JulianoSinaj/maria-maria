"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Der Verlauf eines Rechtstextes — was wann von wem online stand.

   Die Liste ist ANHÄNGEND, nie umgeschrieben (siehe lib/legal/store.js):
   Auch das Wiederherstellen erzeugt einen neuen Eintrag, der sagt, woher er
   stammt. Deshalb steht hier nie „rückgängig gemacht", sondern immer eine
   weitere Zeile — genau das macht die Liste als Nachweis brauchbar.

   Die unterste Zeile ist die Code-Fassung: der Text, der in
   content/<sprache>/legal.js steht. Sie ist der Anfang jeder Geschichte und
   lässt sich nicht wiederherstellen, sondern nur wieder einschalten
   („zurück zum Code") — dafür ist der Knopf im Editor zuständig. */

const ACTION_TONE = {
  edit: "bg-a-ink/[0.06] text-a-ink/60",
  restore: "bg-a-gold/15 text-a-gold",
  reset: "bg-a-accent/10 text-a-accent",
};

export default function LegalHistory({ revisions, active, onRestore, busy }) {
  const { t, intl } = useAdminI18n();
  const reduced = useReducedMotion();
  const [confirming, setConfirming] = useState(null);

  const stamp = (iso) =>
    new Intl.DateTimeFormat(intl, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  return (
    <div className="rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55">
        {t("legal.historyTitle")}
      </p>

      <ol className="flex flex-col gap-2">
        {revisions.map((rev) => {
          const live = active && rev.n === active;
          const asking = confirming === rev.n;
          return (
            <li
              key={rev.n}
              className={`rounded-xl border px-3.5 py-3 transition-colors duration-300 ${
                live ? "border-champagne/60 bg-champagne/[0.08]" : "border-a-ink/[0.07] bg-a-canvas/60"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="flex items-baseline gap-2">
                  <span className="font-playfair text-[14px] text-a-ink tabular-nums">
                    {t("legal.revisionN", { n: rev.n })}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${
                      ACTION_TONE[rev.action] ?? ACTION_TONE.edit
                    }`}
                  >
                    {t(`legal.action.${rev.action}`)}
                  </span>
                  {live && (
                    <span className="rounded-full bg-vine/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-vine">
                      {t("legal.live")}
                    </span>
                  )}
                </span>

                {!live && (
                  <span className="shrink-0">
                    {asking ? (
                      <span className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            setConfirming(null);
                            onRestore(rev.n);
                          }}
                          className="rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-3 py-1 text-[10.5px] font-medium text-ivory disabled:opacity-50"
                        >
                          {t("legal.restoreYes")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirming(null)}
                          className="text-[10.5px] text-a-ink/50 transition-colors hover:text-a-accent"
                        >
                          {t("common.cancel")}
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirming(rev.n)}
                        className="rounded-full border border-a-ink/12 px-3 py-1 text-[10.5px] text-a-ink/60 transition-colors hover:border-champagne hover:text-a-accent"
                      >
                        {t("legal.restore")}
                      </button>
                    )}
                  </span>
                )}
              </div>

              <p className="mt-1 text-[10.5px] text-a-ink/45 tabular-nums">
                {stamp(rev.savedAt)} · {rev.savedBy}
              </p>

              <p className="mt-0.5 text-[10px] text-a-ink/40">
                {t("legal.sectionsN", { n: rev.sections })} · {t("legal.wordsN", { n: rev.words })}
                {rev.from ? ` · ${t("legal.restoredFrom", { n: rev.from })}` : ""}
                {rev.reviewedAt ? ` · ${t("legal.reviewedOn", { date: rev.reviewedAt })}` : ""}
              </p>

              <AnimatePresence>
                {asking && (
                  <motion.p
                    initial={reduced ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden text-[10.5px] leading-relaxed text-a-accent"
                  >
                    <span className="mt-2 block">{t("legal.restoreConfirm", { n: rev.n })}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          );
        })}

        {/* Die Code-Fassung schließt die Liste nach unten ab */}
        <li className="rounded-xl border border-dashed border-a-ink/12 px-3.5 py-3">
          <span className="font-playfair text-[14px] text-a-ink/70">{t("legal.revisionCode")}</span>
          <p className="mt-1 text-[10.5px] leading-relaxed text-a-ink/45">
            {t("legal.revisionCodeHint")}
          </p>
        </li>
      </ol>
    </div>
  );
}
