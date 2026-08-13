"use client";
import PageShell from "@/components/admin/PageShell";
import Placeholder from "@/components/admin/Placeholder";
import Button from "@/components/ui/Button";
import { Orders } from "@/components/admin/AdminIcons";

export default function BestellungenPage() {
  return (
    <PageShell
      title="Bestellungen"
      lede="Aufträge begleiten: von der Zahlung über die Kommissionierung bis zum Versand."
      actions={
        <Button size="sm" variant="outline" iconType="none">
          Export
        </Button>
      }
    >
      <Placeholder
        icon={Orders}
        title="Auftragsabwicklung"
        items={[
          "Auftragsliste mit Status, Zahlungsart und Lieferland",
          "Detailansicht mit Positionen, Adressen und Rechnungsdokument",
          "Versandetiketten und Sendungsverfolgung",
          "Retouren und Gutschriften",
        ]}
      />
    </PageShell>
  );
}
