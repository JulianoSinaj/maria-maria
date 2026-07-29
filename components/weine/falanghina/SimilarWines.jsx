import { SectionTitle } from "@/components/Deco";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import Atmosphere from "@/components/Atmosphere";
import WineCard from "@/components/WineCard";
import Button from "@/components/ui/Button";
import { byName } from "@/components/data";

/* „Ähnliche Weine entdecken" — drei Empfehlungen aus der Kollektion,
   wie auf der Referenzseite der Kundin. */

export default function SimilarWines({ wine }) {
  const wines = wine.similar.names.map((n) => byName(n)).filter(Boolean);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <Atmosphere variant="rose" />
      <div className="relative mx-auto max-w-content px-6 lg:px-10">
        <SectionTitle
          eyebrow={wine.similar.kicker}
          description="Drei Weißweine aus unserer Kollektion, die denselben Ton treffen: hell, frisch, mediterran."
        >
          {wine.similar.title ?? (
            <>
              Wenn Ihnen die{" "}
              <span className="italic text-bordeaux">{wine.catalogName}</span> gefällt
            </>
          )}
        </SectionTitle>

        {/* Schwebende Einträge statt Karten — Reihen trennt nur eine Haarlinie
            (Border dauerhaft reserviert, nth-child färbt sie je Spaltenzahl) */}
        <Stagger className="mt-6 grid gap-x-8 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12" gap={0.09}>
          {wines.map((w, i) => (
            <StaggerItem
              key={w.name}
              className="h-full border-t border-transparent pb-6 pt-8 [&:nth-child(n+2)]:border-charcoal/10 sm:[&:nth-child(2)]:border-transparent lg:[&:nth-child(3)]:border-transparent"
            >
              <WineCard wine={w} index={i} className="h-full" />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12 flex justify-center">
          <Button href="/weine" variant="outline">
            Alle Weine ansehen
          </Button>
        </div>
      </div>
    </section>
  );
}
