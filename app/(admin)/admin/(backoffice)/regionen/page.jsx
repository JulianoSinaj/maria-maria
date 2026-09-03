"use client";
import PageShell from "@/components/admin/PageShell";
import Placeholder from "@/components/admin/Placeholder";
import MapAssetManager from "@/components/admin/regionen/MapAssetManager";
import ShowcaseConfigurator from "@/components/admin/regionen/ShowcaseConfigurator";
import { MapPin } from "@/components/admin/AdminIcons";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";

export default function RegionenPage() {
  const { t } = useAdminI18n();

  return (
    <PageShell title={t("regionsPage.title")} lede={t("regionsPage.lede")}>
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
        {t("regionsPage.mapHeading")}
      </h3>
      <MapAssetManager />

      <h3 className="mb-4 mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
        {t("regionsPage.showcaseHeading")}
      </h3>
      <ShowcaseConfigurator />

      <div className="mt-8">
        <Placeholder
          icon={MapPin}
          title={t("regionsPage.placeholderTitle")}
          items={t("regionsPage.items")}
        />
      </div>
    </PageShell>
  );
}
