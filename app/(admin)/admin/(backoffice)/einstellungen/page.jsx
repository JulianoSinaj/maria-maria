"use client";
import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import PageShell from "@/components/admin/PageShell";
import BusinessPanel from "@/components/admin/einstellungen/BusinessPanel";
import SocialPanel from "@/components/admin/einstellungen/SocialPanel";
import SeoPanel from "@/components/admin/einstellungen/SeoPanel";
import RedirectsPanel from "@/components/admin/einstellungen/RedirectsPanel";
import { Note } from "@/components/admin/einstellungen/shared";
import { SETTINGS_GROUPS } from "@/lib/settings/schema";
import { useSettings, saveSettings } from "@/lib/settings/useSettings";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";

/* Einstellungen — die Angaben über das Unternehmen und die Seite.

   Vier Gruppen auf einer Seite, aber nicht untereinander: Die SEO-Gruppe
   allein sind elf Seiten in vier Sprachen. Untereinander gestapelt wäre
   alles andere nur noch Vorspann. Der Umschalter oben ist derselbe wie in
   der Kollektion und im Sprachwechsel — eine gemeinsame Markierung, die
   zwischen den Reitern federt, statt vier Markierungen, die ein- und
   ausblenden.

   Jede Gruppe speichert für sich. Ein Speichern-Knopf für alles vier wäre
   ein Knopf, bei dem niemand weiß, was er gerade mitschickt. */

const SPRING = { type: "spring", stiffness: 340, damping: 32 };

export default function EinstellungenPage() {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();

  const [group, setGroup] = useState("firma");
  /* Steuert nur die Sprache der JSON-LD-Vorschau; der Inhalt der Seite hängt
     nicht daran. */
  const [previewLocale, setPreviewLocale] = useState(undefined);
  const { data, setData, loading, error } = useSettings(previewLocale);

  const handleSave = useCallback(
    async (patch) => {
      const next = await saveSettings(patch, previewLocale);
      setData(next);
      return next;
    },
    [previewLocale, setData],
  );

  if (loading && !data) {
    return (
      <PageShell title={t("settingsPage.title")} lede={t("settingsPage.lede")}>
        <div className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/50 p-10 text-center text-[12.5px] text-a-ink/45">
          {t("settingsPage.loading")}
        </div>
      </PageShell>
    );
  }

  if (error && !data) {
    return (
      <PageShell title={t("settingsPage.title")} lede={t("settingsPage.lede")}>
        <p
          role="alert"
          className="rounded-card-lg border border-a-accent/25 bg-a-accent/[0.06] p-8 text-[13px] text-a-accent"
        >
          {t("settingsPage.loadError", { message: error.message })}
        </p>
      </PageShell>
    );
  }

  const summary = data.summary;
  const changedCount = {
    firma: summary.firma.length,
    social: summary.social.length,
    seo: summary.seoCount,
    redirects: summary.redirectsChanged ? summary.redirects : 0,
  };

  return (
    <PageShell title={t("settingsPage.title")} lede={t("settingsPage.lede")}>
      {/* Auf einem Dateisystem ohne Schreibrecht — serverlose Container —
          überlebt hier nichts den nächsten Start. Das gehört über die
          Formulare und nicht in ein Protokoll, das niemand liest. */}
      {summary.persistence === "memory" && (
        <div className="mb-5">
          <Note tone="warn">{t("settingsPage.memoryWarning")}</Note>
        </div>
      )}

      <div
        role="tablist"
        aria-label={t("settingsPage.groupsAria")}
        className="no-scrollbar -mx-1 mb-6 flex gap-1.5 overflow-x-auto px-1 pb-1"
      >
        {SETTINGS_GROUPS.map((key) => {
          const active = key === group;
          const n = changedCount[key];
          return (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setGroup(key)}
              className={`group relative shrink-0 rounded-full px-5 py-2.5 transition-colors duration-300 ${
                active ? "text-ivory" : "text-a-ink/60 hover:text-a-accent"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="settings-group-pill"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2"
                  transition={reduced ? { duration: 0 } : SPRING}
                />
              )}
              {!active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-a-ink/12 transition-colors duration-300 group-hover:border-champagne"
                />
              )}
              <span className="relative z-10 flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-[12.5px] font-medium tracking-[0.02em]">
                  {t(`settings.groups.${key}`)}
                </span>
                {n > 0 && (
                  <span
                    className={`text-[10.5px] tabular-nums ${active ? "text-ivory/65" : "text-a-ink/35"}`}
                    title={t("settings.changedTitle", { n })}
                  >
                    {n}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* key: ein Gruppenwechsel setzt den Entwurf des Panels neu auf, statt
          ihn aus dem alten Zustand weiterzuschreiben */}
      {group === "firma" && (
        <BusinessPanel
          key={`firma-${data.previewLocale}`}
          record={data}
          social={data.social.value}
          onSaved={handleSave}
        />
      )}
      {group === "social" && <SocialPanel key="social" record={data} onSaved={handleSave} />}
      {group === "seo" && (
        <SeoPanel key="seo" record={data} onSaved={handleSave} onLocaleChange={setPreviewLocale} />
      )}
      {group === "redirects" && <RedirectsPanel key="redirects" record={data} onSaved={handleSave} />}

      <p className="mt-8 text-[11px] leading-relaxed text-a-ink/35">
        {t("settingsPage.wiringNote")}
      </p>
    </PageShell>
  );
}
