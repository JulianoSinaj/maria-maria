import TiltCard from "@/components/motion/TiltCard";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { IconChip } from "@/components/Deco";
import { Glasses, Vineyard } from "@/components/Icons";

/* Vision & Mission — das Leitbild als kompaktes Kartenpaar unter dem
   Magazin-Intro. Gleiche Kartensprache wie die Philosophie der Startseite
   (IconChip, weiße Glasfläche, federgedämpfter Tilt), nur dichter gesetzt,
   damit das Paar in der schmalen Intro-Spalte atmet. */

const BLOCKS = [
  {
    kicker: "Vision",
    title: "Momente, die bleiben",
    icon: <Glasses className="h-6 w-6" />,
    text: "Wein ist für uns kein Getränk, sondern ein Katalysator für Emotionen — unsere Vision sind Genussmomente, die in Erinnerung bleiben.",
  },
  {
    kicker: "Mission",
    title: "Handverlesen, ehrlich erzählt",
    icon: <Vineyard className="h-6 w-6" />,
    text: "Wir kuratieren Boutique-Weine kleiner Familienweingüter Italiens — persönlich verkostet, klar in ihrer Herkunft und leicht zu wählen.",
  },
];

export default function VisionMission({ className = "", headingId }) {
  return (
    <section aria-labelledby={headingId} className={className}>
      {/* Die Überschrift trägt die Sektion in der Gliederung, bleibt aber
          sichtbar zurückgenommen: das Kartenpaar sagt visuell schon, worum es
          geht — im Screenreader-Outline fehlte dem Paar sonst jeder Name. */}
      <h2 id={headingId} className="sr-only">
        Vision und Mission von Maria Maria
      </h2>
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2" gap={0.08}>
        {BLOCKS.map((b) => (
          <StaggerItem key={b.kicker} className="h-full">
            <TiltCard className="group h-full" max={4} radius="rounded-card">
              <article className="flex h-full flex-col rounded-card border border-stone/50 bg-white/70 p-5 shadow-luxe transition-[border-color,box-shadow] duration-500 ease-out-expo group-hover:border-champagne/60 group-hover:shadow-lift">
                <div className="flex items-center gap-3.5">
                  <IconChip className="!h-11 !w-11 shrink-0">{b.icon}</IconChip>
                  <div className="min-w-0">
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-bordeaux/70">
                      {b.kicker}
                    </p>
                    <h3 className="mt-0.5 font-playfair text-[16px] leading-snug text-charcoal">
                      {b.title}
                    </h3>
                  </div>
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
