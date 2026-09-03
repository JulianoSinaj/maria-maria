"use client";
import PageShell from "@/components/admin/PageShell";
import Placeholder from "@/components/admin/Placeholder";
import MapAssetManager from "@/components/admin/regionen/MapAssetManager";
import ShowcaseConfigurator from "@/components/admin/regionen/ShowcaseConfigurator";
import { MapPin } from "@/components/admin/AdminIcons";

export default function RegionenPage() {
  return (
    <PageShell
      title="Regionen-Storytelling"
      lede="Herkunft erzählen — und die Italien-Karte pflegen, die sie verortet: Hervorhebungen, Meer und Städte."
    >
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-bordeaux/55">
        Regionale Karten-Assets
      </h3>
      <MapAssetManager />

      <h3 className="mb-4 mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-bordeaux/55">
        Regional-Showcase — Layout & Texte
      </h3>
      <ShowcaseConfigurator />

      <div className="mt-8">
        <Placeholder
          icon={MapPin}
          title="Erzählungen & Herkunft"
          items={[
            "Kapitelweiser Editor für die Regionsseiten mit Vorschau",
            "Zuordnung von Weinen zu Region und Anbaugebiet",
            "Veröffentlichungsstatus je Region — Entwurf, geplant, live",
          ]}
        />
      </div>
    </PageShell>
  );
}
