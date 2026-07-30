"use client";
import PageShell from "@/components/admin/PageShell";
import Button from "@/components/ui/Button";
import AllocationCard from "@/components/admin/cards/AllocationCard";
import RevenueCard from "@/components/admin/cards/RevenueCard";
import RegionCard from "@/components/admin/cards/RegionCard";
import OrdersCard from "@/components/admin/cards/OrdersCard";

/* Overview & Analytics.
   Four hero metrics in a 2×2 grid on desktop, single column on mobile. Wine
   names, types, regions and the two edition sizes come from the shared
   catalogue; the movement figures are seeded specimens until the orders
   backend exists — see components/admin/analyticsData.js. */

export default function AdminOverviewPage() {
  return (
    <PageShell
      title="Buongiorno, Maria"
      lede="Bestand, Erlös und Herkunft auf einen Blick — der Puls des Hauses."
      actions={
        <Button href="/admin/bestellungen" size="sm">
          Bestellungen
        </Button>
      }
    >
      <p className="mb-5 text-[11px] uppercase tracking-[0.18em] text-bordeaux/50">
        Verkaufszahlen sind Beispieldaten — Anbindung folgt
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
