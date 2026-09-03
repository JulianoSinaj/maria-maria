"use client";
import PageShell from "@/components/admin/PageShell";
import Placeholder from "@/components/admin/Placeholder";
import Button from "@/components/ui/Button";
import { Orders } from "@/components/admin/AdminIcons";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";

export default function BestellungenPage() {
  const { t } = useAdminI18n();

  return (
    <PageShell
      title={t("ordersPage.title")}
      lede={t("ordersPage.lede")}
      actions={
        <Button size="sm" variant="outline" iconType="none">
          {t("ordersPage.export")}
        </Button>
      }
    >
      <Placeholder
        icon={Orders}
        title={t("ordersPage.placeholderTitle")}
        items={t("ordersPage.items")}
      />
    </PageShell>
  );
}
