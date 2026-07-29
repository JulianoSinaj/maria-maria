import TiltCard from "@/components/motion/TiltCard";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { GoldRule } from "@/components/Deco";
import { Grapes } from "@/components/Icons";

/* Die zwei Seelen hinter dem Namen — als Etiketten-Paar gestaltet:
   Maria als dunkle Bordeaux-Karte (der Ursprung), Maria Pia als helle
   Elfenbein-Karte (die Gegenwart), verbunden durch ein goldenes „&". */

const SOULS = [
  {
    name: "Maria",
    tag: "Der Ursprung",
    traits: ["Wurzeln", "Wärme", "Gemeinsame Momente"],
    desc: "Die emotionale Wurzel von Maria Maria – verbunden mit Familie, Herkunft und der italienischen Kultur, Genuss miteinander zu teilen.",
    dark: true,
  },
  {
    name: "Maria",
    tag: "Die Gegenwart",
    traits: ["Unabhängigkeit", "Ästhetik", "Neue Perspektiven"],
    desc: "Der zeitgemäße Blick, der italienische Weinkultur auswählt, verbindet und für ein heutiges Publikum erlebbar macht.",
    dark: false,
  },
];

const CORNERS = [
  "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
  "right-0 top-0 translate-x-1/2 -translate-y-1/2",
  "left-0 bottom-0 -translate-x-1/2 translate-y-1/2",
  "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
];

function SoulCard({ soul }) {
  const { dark } = soul;
  return (
    <TiltCard className="group h-full" max={5} radius="rounded-card">
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-card p-2.5 shadow-luxe transition-shadow duration-500 group-hover:shadow-lift ${
          dark
            ? "bg-gradient-to-b from-bordeaux to-bordeaux-deep"
            : "ring-hairline border border-stone/50 bg-ivory"
        }`}
      >
        {/* the etiquette frame — hairline border with diamond corner marks */}
        <div
          className={`relative flex h-full flex-col items-center rounded-[1.125rem] border px-6 py-8 text-center sm:px-7 ${
            dark ? "border-champagne/45" : "border-champagne/55"
          }`}
        >
          {CORNERS.map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`absolute h-[5px] w-[5px] rotate-45 ${pos} ${
                dark ? "bg-champagne/70" : "bg-champagne/80"
              }`}
            />
          ))}
          <Grapes className="h-5 w-5 text-champagne" />
          <p
            className={`mt-5 text-[10px] font-semibold uppercase tracking-[0.28em] ${
              dark ? "text-champagne-light" : "text-champagne"
            }`}
          >
            {soul.tag}
          </p>
          <h3
            className={`mt-2.5 font-playfair text-[clamp(26px,2.6vw,32px)] leading-tight ${
              dark ? "text-ivory" : "text-charcoal"
            }`}
          >
            {soul.name}
          </h3>
          <GoldRule className="mt-4 w-16" />
          <p
            className={`mt-4 text-[9.5px] font-semibold uppercase leading-[1.9] tracking-[0.2em] ${
              dark ? "text-champagne-light" : "text-champagne"
            }`}
          >
            {soul.traits.join(" · ")}
          </p>
          <p
            className={`mt-5 max-w-[26ch] text-[12.5px] leading-relaxed ${
              dark ? "text-ivory/75" : "text-charcoal/70"
            }`}
          >
            {soul.desc}
          </p>
        </div>
      </div>
    </TiltCard>
  );
}

export default function SoulCards() {
  return (
    <div className="relative">
      <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2" gap={0.12}>
        {SOULS.map((soul) => (
          <StaggerItem key={soul.tag} className="h-full">
            <SoulCard soul={soul} />
          </StaggerItem>
        ))}
      </Stagger>
      {/* the union of both souls — a golden seal between the two cards */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-champagne to-[#A9945C] font-playfair text-[24px] italic text-cream shadow-chip ring-4 ring-cream/90 sm:flex"
      >
        &amp;
      </span>
    </div>
  );
}
