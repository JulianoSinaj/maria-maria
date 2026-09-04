"use client";
import PageShell from "@/components/admin/PageShell";
import MapAssetManager from "@/components/admin/regionen/MapAssetManager";
import RegionStateBoard from "@/components/admin/regionen/RegionStateBoard";
import ShowcaseConfigurator from "@/components/admin/regionen/ShowcaseConfigurator";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";

/* Alles, was an einer Herkunft kein Text ist — in der Reihenfolge, in der
   man es braucht: erst ob und mit welchen Weinen sie überhaupt erscheint,
   dann wie sie sich auf der Startseite bewegt, zuletzt die Karte, die sie
   verortet. Der Text selbst wird im Seiten-Editor gepflegt; beide Abschnitte
   verlinken dorthin, statt ihn ein zweites Mal anzubieten. */

export default function RegionenPage() {
  const { t } = useAdminI18n();

  return (
    <PageShell title={t("regionsPage.title")} lede={t("regionsPage.lede")}>
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
        {t("regionsPage.stateHeading")}
      </h3>
      <RegionStateBoard />

      <h3 className="mb-4 mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
        {t("regionsPage.showcaseHeading")}
      </h3>
      <ShowcaseConfigurator />

      <h3 className="mb-4 mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
        {t("regionsPage.mapHeading")}
      </h3>
      <MapAssetManager />
    </PageShell>
  );
}
