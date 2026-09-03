"use client";
import PageShell from "@/components/admin/PageShell";
import Button from "@/components/ui/Button";
import AllocationCard from "@/components/admin/cards/AllocationCard";
import RevenueCard from "@/components/admin/cards/RevenueCard";
import RegionCard from "@/components/admin/cards/RegionCard";
import OrdersCard from "@/components/admin/cards/OrdersCard";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";

/* Overview & Analytics.
   Four hero metrics in a 2×2 grid on desktop, single column on mobile. Wine
   names, types, regions and the two edition sizes come from the shared
   catalogue; the movement figures are seeded specimens until the orders
   backend exists — see components/admin/analyticsData.js. */

export default function AdminOverviewPage() {
  const { t } = useAdminI18n();

  return (
    <PageShell
      title={t("overview.title")}
      lede={t("overview.lede")}
      actions={
        <Button href="/admin/bestellungen" size="sm">
          {t("overview.ordersButton")}
        </Button>
      }
    >
      <p className="mb-5 text-[11px] uppercase tracking-[0.18em] text-a-accent/50">
        {t("overview.sampleNote")}
      </p>

      <div className="grid gap-5 xl:grid-cols-2">
        <AllocationCard delay={0} />
        <RevenueCard delay={0.08} />
        <RegionCard delay={0.16} />
        <OrdersCard delay={0.24} />
      </div>
    </PageShell>
  );
}
