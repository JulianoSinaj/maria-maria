import Link from "next/link";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Eyebrow, GoldRule } from "@/components/Deco";
import { Arrow } from "@/components/Icons";
import Atmosphere, { GhostWord } from "@/components/Atmosphere";

/* Le Origini auf der Startseite — die Markengeschichte gehört an den Anfang
   der Reise, nicht nur in den Shop: der Sommer 2019 im Salento, die zwei
   Seelen hinter dem Namen und der Weg vom Salento hinauf zum Gardasee. */

const SOULS = [
  {
    name: "Maria",
    tag: "Die Gegenwart",
    traits: ["Moderne", "Unabhängigkeit", "Pure Ästhetik"],
  },
  {
    name: "Maria",
    tag: "Der Ursprung",
    traits: ["Wurzeln", "Familie", "Wärme geteilter Momente"],
  },
];

const JOURNEY = ["Salento", "Manduria", "Kampanien", "Gardasee"];

export default function OriginsSection() {
  return (
    <section className="relative overflow-hidden">
      <Atmosphere variant="olive" />
      <GhostWord className="right-[-3vw] top-10 text-[11vw]">Due anime</GhostWord>
      <div className="relative mx-auto max-w-content px-6 py-16 sm:py-24 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* story */}
          <div>
            <Reveal>
              <Eyebrow>Le Origini</Eyebrow>
              <h2 className="mt-4 text-balance font-playfair text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.12] text-charcoal">
                Zwei Seelen, <span className="italic text-bordeaux">ein Name</span>
              </h2>
              <p className="mt-5 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                Maria Maria beginnt im Salento, im Sommer 2019 — zwischen Kindheitserinnerungen und
                alten Rebzeilen wurde aus einem Moment eine Erleuchtung: Wein ist für uns kein
                Getränk, sondern ein Katalysator für Emotionen.
              </p>
              <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                Seitdem führt unsere Reise von den sonnigen Rebzeilen des Salento über die
                Vulkanböden Kampaniens hinauf ans Südufer des Gardasees — jede Flasche eine Station,
                jede Region eine eigene Sprache.
              </p>
            </Reveal>

            {/* the journey — Salento → Gardasee */}
            <Reveal delay={0.12}>
              <ol className="mt-7 flex flex-wrap items-center gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/60">
                {JOURNEY.map((stop, i) => (
                  <li key={stop} className="flex items-center">
                    {i > 0 && (
                      <span aria-hidden="true" className="mx-2.5 h-px w-5 bg-champagne sm:w-7" />
                    )}
                    <span className={i === 0 || i === JOURNEY.length - 1 ? "text-bordeaux" : ""}>
                      {stop}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex items-center gap-3">
                <GoldRule className="w-12" />
                <p className="font-playfair text-[19px] italic leading-snug text-vine">
                  „Italian wine, personal selection, share the pleasure.“
                </p>
              </div>
              <Link
                href="/regionen"
                className="group mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
              >
                Die Reise durch die Regionen entdecken
                <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          {/* the double soul */}
          <div className="relative">
            <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2" gap={0.12}>
              {SOULS.map((s) => (
                <StaggerItem key={s.name} className="h-full">
                  <TiltCard className="group h-full" max={5} radius="rounded-card-lg">
                    <div className="ring-hairline relative flex h-full flex-col overflow-hidden rounded-card-lg border border-stone/40 bg-white/70 p-7 shadow-luxe transition-[box-shadow,border-color] duration-500 group-hover:border-champagne/60 group-hover:shadow-lift">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-champagne">{s.tag}</p>
                      <h3 className="mt-2 font-playfair text-[24px] text-charcoal">{s.name}</h3>
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {s.traits.map((t) => (
                          <li
                            key={t}
                            className="rounded-full border border-stone/60 bg-cream/80 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/65"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </Stagger>
            {/* the union of both souls */}
            <span
              aria-hidden="true"
              className="glass absolute left-1/2 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-playfair text-[22px] italic text-bordeaux shadow-glass sm:flex"
            >
              &amp;
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
