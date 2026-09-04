"use client";
import PageShell from "@/components/admin/PageShell";
import LegalEditor from "@/components/admin/legal/LegalEditor";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";

/* Rechtstexte — Impressum, Datenschutzerklärung und AGB.

   Der Grund, warum diese Seite existiert: Mit Terra Vera als Verkäuferin
   stimmen die AGB §§ 4–7 (Preise, Lieferung, Zahlung, Widerruf) und
   Datenschutz § 4 (Bestellungen im Online-Shop) nicht mehr — und sie werden
   sich noch mehrfach ändern, während sich die Partnerschaft setzt. Für eine
   Änderung, die mehrfach kommt, ist ein Deploy der falsche Weg. */

export default function RechtstextePage() {
  const { t } = useAdminI18n();

  return (
    <PageShell title={t("legalPage.title")} lede={t("legalPage.lede")}>
      <LegalEditor />
    </PageShell>
  );
}
