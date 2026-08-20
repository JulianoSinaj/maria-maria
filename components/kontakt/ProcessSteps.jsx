import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";

/* Sektion 03 — „So einfach finden wir Ihren Wein" (Handoff §6).

   Drei Schritte in einer Reihe ab lg, darunter gestapelt; runde Terrakotta-
   Zahlen, kurzer Text, sonst nichts (Handoff §12: „Nessun elemento
   superfluo"). Zwischen den Zahlen läuft ab lg eine Haarlinie als Pfad —
   das einzige Schmuckelement, und es erklärt die Reihenfolge.

   Keine "use client"-Direktive: reine Ausgabe. Stagger/StaggerItem sind
   Client-Primitive und dürfen aus einer Server-Komponente heraus gerendert
   werden. */

export default function ProcessSteps({ copy }) {
  const steps = copy.steps ?? [];
  return (
    <>
      <Stagger className="relative mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8" amount={0.2}>
        {/* Pfad zwischen den Zahlen — liegt hinter den Kreisen und endet in
            der Mitte der ersten und letzten Spalte */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-6 hidden h-px bg-gradient-to-r from-terracotta/0 via-terracotta/40 to-terracotta/0 lg:block"
        />
        {steps.map((step, i) => (
          <StaggerItem key={i} className="relative">
            <div className="flex gap-5 lg:flex-col lg:items-center lg:text-center">
              <span
                aria-hidden="true"
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-terracotta-deep font-playfair text-[17px] text-ivory shadow-[0_10px_24px_-12px_rgba(180,83,47,.55)] ring-4 ring-ivory"
              >
                {i + 1}
              </span>
              <div className="lg:mt-5 lg:max-w-[19rem]">
                <h3 className="font-playfair text-[19px] leading-snug text-charcoal">
                  {/* Schrittnummer auch für Screenreader — der Kreis ist aria-hidden */}
                  <span className="sr-only">{i + 1}. </span>
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-charcoal/70">{step.text}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      {copy.closing && (
        <Reveal delay={0.2}>
          <p className="mx-auto mt-12 max-w-2xl text-center font-playfair text-[17px] italic leading-relaxed text-charcoal/75">
            {copy.closing}
          </p>
        </Reveal>
      )}
    </>
  );
}
