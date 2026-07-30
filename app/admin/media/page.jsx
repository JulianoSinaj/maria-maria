"use client";
import PageShell from "@/components/admin/PageShell";
import Placeholder from "@/components/admin/Placeholder";
import Button from "@/components/ui/Button";
import { Media } from "@/components/admin/AdminIcons";

export default function MediaPage() {
  return (
    <PageShell
      title="Hero & Media Manager"
      lede="Bildwelten kuratieren: Hero-Motive, Videosequenzen und Bildmaterial der Kollektion."
      actions={
        <Button size="sm" iconType="none">
          Medien hochladen
        </Button>
      }
    >
      <Placeholder
        icon={Media}
        title="Bildwelten & Bewegtbild"
        items={[
          "Hero-Slots je Seite mit Bildausschnitt und Fokuspunkt",
          "Video-Loops für die Regionsköpfe inklusive Poster-Frame",
          "Asset-Bibliothek mit Alternativtexten und Bildrechten",
          "Automatische Ableitungen in AVIF und WebP für alle Breakpoints",
        ]}
      />
    </PageShell>
  );
}
