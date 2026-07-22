import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { GoldRule } from "@/components/Deco";
import { WINE_ICON } from "./WineIcons";

/* Schnellfakten-Leiste unter dem Hero — vier Kennzahlen mit Linienikonen,
   durch Haarlinien getrennt, wie auf der Referenzseite der Kundin. */

export default function FactStrip({ wine }) {
  return (
    <section id="ueberblick" className="scroll-mt-36">
      <div className="mx-auto max-w-content px-6 py-16 lg:px-10 lg:py-20">
        <Stagger className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4" gap={0.08}>
          {wine.facts.map((f, i) => {
            const Icon = WINE_ICON[f.icon];
            return (
              <StaggerItem
                key={f.label}
                className={i > 0 ? "lg:border-l lg:border-stone/70 lg:pl-10" : ""}
              >
                <div className="flex flex-col items-start gap-4">
                  <span className="ring-hairline inline-flex h-12 w-12 items-center justify-center rounded-full border border-acqua/25 bg-acqua-light/25 text-acqua-deep">
                    {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal/50">
                      {f.label}
                    </p>
                    <p className="mt-1.5 font-playfair text-lg leading-snug text-charcoal lg:text-xl">
                      {f.value}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
        <GoldRule className="mx-auto mt-16 max-w-3xl" />
      </div>
    </section>
  );
}
