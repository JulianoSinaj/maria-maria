"use client";
import PageShell from "@/components/admin/PageShell";
import Placeholder from "@/components/admin/Placeholder";
import HeroContentManager from "@/components/admin/media/HeroContentManager";
import AssetGallery from "@/components/admin/media/AssetGallery";
import { Media } from "@/components/admin/AdminIcons";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";

export default function MediaPage() {
  const { t } = useAdminI18n();

  return (
    <PageShell title={t("mediaPage.title")} lede={t("mediaPage.lede")}>
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
        {t("mediaPage.heroHeading")}
      </h3>
      <HeroContentManager />

      <h3 className="mb-4 mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
        {t("mediaPage.galleryHeading")}
      </h3>
      <AssetGallery />

      <div className="mt-8">
        <Placeholder
          icon={Media}
          title={t("mediaPage.placeholderTitle")}
          items={t("mediaPage.items")}
        />
      </div>
    </PageShell>
  );
}
