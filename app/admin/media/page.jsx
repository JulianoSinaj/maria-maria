"use client";
import PageShell from "@/components/admin/PageShell";
import Placeholder from "@/components/admin/Placeholder";
import HeroContentManager from "@/components/admin/media/HeroContentManager";
import { Media } from "@/components/admin/AdminIcons";

export default function MediaPage() {
  return (
    <PageShell
      title="Hero & Media Manager"
      lede="Den Auftritt der Startseite pflegen: Hero-Motiv, Bildanker und Markenbotschaft."
    >
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-bordeaux/55">
        Startseiten-Hero — Bild & Botschaft
      </h3>
      <HeroContentManager />

      <div className="mt-8">
        <Placeholder
          icon={Media}
          title="Weitere Bildwelten"
          items={[
            "Hero-Slots der Unterseiten mit Bildausschnitt und Fokuspunkt",
            "Video-Loops für die Regionsköpfe inklusive Poster-Frame",
            "Asset-Bibliothek mit Alternativtexten und Bildrechten",
            "Automatische Ableitungen in AVIF und WebP für alle Breakpoints",
          ]}
        />
      </div>
    </PageShell>
  );
}
