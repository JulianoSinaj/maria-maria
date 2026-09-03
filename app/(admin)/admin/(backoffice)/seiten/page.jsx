"use client";
import PageShell from "@/components/admin/PageShell";
import PagesEditor from "@/components/admin/seiten/PagesEditor";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";

export default function SeitenPage() {
  const { t } = useAdminI18n();

  return (
    <PageShell title={t("pagesPage.title")} lede={t("pagesPage.lede")}>
      <PagesEditor />
    </PageShell>
  );
}
