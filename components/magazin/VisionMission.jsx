import TiltCard from "@/components/motion/TiltCard";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Glasses, Vineyard } from "@/components/Icons";

/* Vision & Mission — das Leitbild als kompaktes Kartenpaar in der rechten
   Spalte der Cover Story. Gesetzt wie im Heft: goldenes Icon und Versal-
   Kicker in einer Zeile, darunter der Leitsatz — auf warmer Karte mit
   Haarlinien-Rand und federgedämpftem Tilt. */

/* Reihenfolge und Ikone bleiben im Code, Kicker und Leitsatz kommen je
   Sprache aus content/<sprache>/magazin.js (Abschnitt `vision`). */
const BLOCK_SHAPE = [
  { key: "vision", icon: <Glasses className="h-5 w-5" /> },
  { key: "mission", icon: <Vineyard className="h-5 w-5" /> },
];

export default function VisionMission({ className = "", headingId, t = {} }) {
  const blocks = BLOCK_SHAPE.map((b) => ({ ...b, ...(t.blocks?.[b.key] ?? {}) }));

  return (
    <section aria-labelledby={headingId} className={className}>
      {/* Die Überschrift trägt die Sektion in der Gliederung, bleibt aber
          sichtbar zurückgenommen: das Kartenpaar sagt visuell schon, worum es
          geht — im Screenreader-Outline fehlte dem Paar sonst jeder Name. */}
      <h2 id={headingId} className="sr-only">
        {t.srTitle}
      </h2>
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2" gap={0.08}>
        {blocks.map((b) => (
          <StaggerItem key={b.key} className="h-full">
            <TiltCard className="group h-full" max={4} radius="rounded-card">
              <article className="flex h-full flex-col rounded-card border border-stone/50 bg-ivory/70 p-5 shadow-luxe transition-[border-color,box-shadow] duration-500 ease-out-expo group-hover:border-champagne/60 group-hover:shadow-lift">
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="shrink-0 text-champagne-deep">
                    {b.icon}
                  </span>
                  <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-champagne-deep">
                    {b.kicker}
                  </h3>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-charcoal/70">{b.text}</p>
              </article>
            </TiltCard>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
