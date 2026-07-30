"use client";
import PageShell from "@/components/admin/PageShell";
import Placeholder from "@/components/admin/Placeholder";
import Button from "@/components/ui/Button";
import { MapPin } from "@/components/admin/AdminIcons";

export default function RegionenPage() {
  return (
    <PageShell
      title="Regionen-Storytelling"
      lede="Herkunft erzählen: Landschaft, Menschen und Handwerk hinter jeder Flasche."
      actions={
        <Button size="sm" iconType="none">
          Region anlegen
        </Button>
      }
    >
      <Placeholder
        icon={MapPin}
        title="Erzählungen & Herkunft"
        items={[
          "Kapitelweiser Editor für die Regionsseiten mit Vorschau",
          "Zuordnung von Weinen zu Region und Anbaugebiet",
          "Kartenpunkte und Koordinaten für die Italien-Karte",
          "Veröffentlichungsstatus je Region — Entwurf, geplant, live",
        ]}
      />
    </PageShell>
  );
}
