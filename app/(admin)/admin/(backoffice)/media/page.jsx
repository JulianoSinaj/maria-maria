"use client";
import PageShell from "@/components/admin/PageShell";
import HeroContentManager from "@/components/admin/media/HeroContentManager";
import PageHeroManager from "@/components/admin/media/PageHeroManager";
import VideoLoopManager from "@/components/admin/media/VideoLoopManager";
import AssetGallery from "@/components/admin/media/AssetGallery";
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
        {t("mediaPage.heroPagesHeading")}
      </h3>
      <PageHeroManager />

      <h3 className="mb-4 mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
        {t("mediaPage.videoHeading")}
      </h3>
      <VideoLoopManager />

      <h3 className="mb-4 mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
        {t("mediaPage.galleryHeading")}
      </h3>
      <AssetGallery />
    </PageShell>
  );
}
