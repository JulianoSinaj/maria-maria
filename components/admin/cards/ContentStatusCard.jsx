"use client";
import { motion, useReducedMotion } from "motion/react";
import { MetricCard } from "../MetricCard";
import { useAdminI18n } from "../i18n/AdminI18n";
import { relativeTime } from "../anfragen/shared";
import { CardSkeleton, CardError } from "./shared";

/* Card 5 — what is unfinished.

   The other four cards count what happened. This one counts what has not:
   an interview written but never published, a page that exists in German
   and in no other language, a shop link that no longer lands on a bottle.
   None of it is visible by looking at the site, because the whole point is
   that it is missing from it.

   The link check is a button, not something that happens on load. It
   reaches terra-vera.com, and an overview that waits on a foreign server
   is an overview that is slow whenever somebody else's shop is. The last
   result is kept, so the page always has an answer even if it is an old
   one — and it says how old. */

function Chip({ tone, count, label }) {
  const { fmtNum } = useAdminI18n();
  const quiet = count === 0;

  return (
    <span
      className={`inline-flex items-baseline gap-2 rounded-full border px-3.5 py-1.5 ${
        quiet
          ? "border-a-ink/[0.08] bg-a-canvas/60 text-a-ink/45"
          : tone === "warn"
            ? "border-a-gold/30 bg-a-gold/[0.09] text-a-ink/75"
            : "border-a-accent/25 bg-a-accent/[0.07] text-a-accent"
      }`}
    >
      <span className="font-playfair text-[15px] leading-none tabular-nums">{fmtNum(count)}</span>
      <span className="text-[10.5px] uppercase tracking-[0.12em]">{label}</span>
    </span>
  );
}

function Column({ title, children }) {
  return (
    <section className="min-w-0">
      <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-a-accent/50">
        {title}
      </h4>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

const Quiet = ({ children }) => (
  <p className="text-[12px] leading-relaxed text-a-ink/45">{children}</p>
);

export default function ContentStatusCard({
  content,
  links,
  loading,
  error,
  onCheckLinks,
  checking,
  delay = 0,
}) {
  const { t, tm, fmtNum, intl } = useAdminI18n();
  const reduced = useReducedMotion();

  const counts = content?.counts;
  const drafts = (content?.interviews ?? []).filter((i) => i.draft);
  const undated = (content?.interviews ?? []).filter((i) => !i.draft && i.undatedLocales.length);
  const missingInterviews = (content?.interviews ?? []).filter((i) => i.missingLocales.length);
  const translations = content?.translations?.rows ?? [];
  const winePages = content?.winePages ?? [];

  const linkItems = links?.items ?? [];
  const broken = linkItems.filter((l) => !l.ok);
  const unavailable = linkItems.filter((l) => l.ok && l.available === false);

  return (
    <MetricCard
      eyebrow={t("contentCard.eyebrow")}
      title={t("contentCard.title")}
      delay={delay}
      className="xl:col-span-2"
      aside={
        <motion.button
          type="button"
          onClick={onCheckLinks}
          disabled={checking}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="rounded-full border border-a-ink/[0.12] bg-a-canvas px-4 py-2 text-[11px] font-medium tracking-[0.04em] text-a-ink/70 transition-colors duration-300 hover:border-champagne hover:text-a-accent disabled:opacity-50"
        >
          {checking ? t("contentCard.checking") : t("contentCard.check")}
        </motion.button>
      }
    >
      {error ? (
        <CardError />
      ) : loading && !content ? (
        <CardSkeleton rows={3} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2.5">
            <Chip tone="warn" count={counts?.drafts ?? 0} label={t("contentCard.chipDrafts")} />
            <Chip
              tone="warn"
              count={counts?.missingTranslations ?? 0}
              label={t("contentCard.chipKeys")}
            />
            <Chip tone="alert" count={counts?.brokenLinks ?? 0} label={t("contentCard.chipLinks")} />
            <Chip
              tone="alert"
              count={counts?.unavailable ?? 0}
              label={t("contentCard.chipSoldOut")}
            />
          </div>

          <div className="mt-8 grid flex-1 gap-8 lg:grid-cols-3 lg:gap-7">
            {/* ------------------------------------------------ drafts -- */}
            <Column title={t("contentCard.editorial")}>
              {drafts.length === 0 && undated.length === 0 && missingInterviews.length === 0 ? (
                <Quiet>{t("contentCard.editorialClean")}</Quiet>
              ) : (
                <ul className="flex flex-col gap-3">
                  {drafts.map((i) => (
                    <li key={`d-${i.slug}`} className="flex items-baseline gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-a-gold"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] text-a-ink/85">{i.title}</span>
                        <span className="text-[10.5px] text-a-ink/45">
                          {t("contentCard.isDraft")}
                        </span>
                      </span>
                    </li>
                  ))}
                  {undated.map((i) => (
                    <li key={`u-${i.slug}`} className="flex items-baseline gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-a-ink/25"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] text-a-ink/85">{i.title}</span>
                        <span className="text-[10.5px] text-a-ink/45">
                          {t("contentCard.noDate", { langs: i.undatedLocales.join(", ").toUpperCase() })}
                        </span>
                      </span>
                    </li>
                  ))}
                  {missingInterviews.map((i) => (
                    <li key={`m-${i.slug}`} className="flex items-baseline gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-a-accent"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] text-a-ink/85">{i.title}</span>
                        <span className="text-[10.5px] text-a-accent/70">
                          {t("contentCard.missingIn", {
                            langs: i.missingLocales.join(", ").toUpperCase(),
                          })}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Column>

            {/* ------------------------------------------ translations -- */}
            <Column title={t("contentCard.translations")}>
              <ul className="flex flex-col gap-4">
                {translations.map((row, i) => (
                  <li key={row.locale}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[12.5px] font-medium text-a-ink/85">{row.label}</span>
                      <span className="shrink-0 text-[11px] tabular-nums text-a-ink/50">
                        {new Intl.NumberFormat(intl, {
                          style: "percent",
                          maximumFractionDigits: 0,
                        }).format(row.coverage)}
                      </span>
                    </div>
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-a-ink/[0.07]">
                      <span
                        className="block h-full"
                        style={{ width: `${Math.round(row.coverage * 100)}%` }}
                      >
                        <motion.span
                          className="block h-full rounded-full will-transform"
                          style={{
                            background: row.missing === 0 ? "#55683F" : "#C8B77A",
                            transformOrigin: "left",
                          }}
                          initial={reduced ? false : { scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 70,
                            damping: 20,
                            delay: reduced ? 0 : 0.2 + i * 0.08,
                          }}
                        />
                      </span>
                    </span>
                    <p className="mt-1.5 text-[10.5px] text-a-ink/45">
                      {row.missing === 0
                        ? t("contentCard.complete")
                        : t("contentCard.missingKeys", {
                            n: fmtNum(row.missing),
                            sections: row.sections
                              .slice(0, 3)
                              .map((s) => `${s.section} (${s.count})`)
                              .join(" · "),
                          })}
                    </p>
                  </li>
                ))}

                {winePages.length > 0 && (
                  <li className="text-[10.5px] leading-relaxed text-a-accent/70">
                    {t("contentCard.missingWinePages", {
                      n: fmtNum(winePages.reduce((s, w) => s + w.missingLocales.length, 0)),
                      slugs: winePages.map((w) => w.slug).join(", "),
                    })}
                  </li>
                )}
              </ul>
            </Column>

            {/* ------------------------------------------- shop links -- */}
            <Column title={t("contentCard.shopLinks")}>
              {!links ? (
                <Quiet>{t("contentCard.neverChecked")}</Quiet>
              ) : (
                <>
                  <p className="text-[10.5px] text-a-ink/40">
                    {t("contentCard.checkedAt", {
                      when: relativeTime(links.checkedAt, intl),
                      n: fmtNum(links.counts?.total ?? 0),
                    })}
                  </p>

                  {broken.length === 0 && unavailable.length === 0 ? (
                    <p className="mt-3 flex items-baseline gap-2 text-[12px] text-vine">
                      <span aria-hidden="true">✓</span>
                      {t("contentCard.linksClean")}
                    </p>
                  ) : (
                    <ul className="mt-3 flex flex-col gap-3">
                      {broken.map((l) => (
                        <li key={`b-${l.key}`} className="flex items-baseline gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-a-accent"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-[12.5px] text-a-ink/85">
                              {l.name}
                            </span>
                            <span className="text-[10.5px] text-a-accent/70">
                              {t("contentCard.broken", {
                                reason: l.error ? tm("linkError", l.error) : (l.status ?? "?"),
                              })}
                            </span>
                          </span>
                        </li>
                      ))}
                      {unavailable.map((l) => (
                        <li key={`s-${l.key}`} className="flex items-baseline gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-a-gold"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-[12.5px] text-a-ink/85">
                              {l.name}
                            </span>
                            <span className="text-[10.5px] text-a-ink/50">
                              {t("contentCard.soldOut")}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {(links.counts?.priceDrift ?? 0) > 0 && (
                    <p className="mt-3 text-[10.5px] leading-relaxed text-a-ink/50">
                      {t("contentCard.priceDrift", { n: fmtNum(links.counts.priceDrift) })}
                    </p>
                  )}
                </>
              )}
            </Column>
          </div>
        </>
      )}
    </MetricCard>
  );
}
