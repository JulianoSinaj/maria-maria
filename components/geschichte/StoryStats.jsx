import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Glasses, GrapeVine, Book, Sun } from "@/components/Icons";

/* Die Auswahl-Prinzipien — drei Stationen in einer offenen Dreispalten-Box
   mit subtilen Trennlinien, wie die Fakten-Zeile eines Heftrückens: Ikone,
   Prinzip-Nummer, Prinzip (als H3) und Grundsatz.

   Die Nummer ist reine Zier — die Reihenfolge steckt schon in der Liste,
   deshalb bleibt sie per aria-hidden Screenreadern verborgen. */

const ICONS = { glasses: Glasses, grapes: GrapeVine, book: Book, sun: Sun };

function StatFigure({ stat }) {
  const Icon = ICONS[stat.icon];
  return (
    <div className="flex h-full flex-col items-center px-6 py-6 text-center lg:py-2">
      {Icon && <Icon aria-hidden="true" className="h-6 w-6 text-champagne" />}
      {/* Prinzip-Nummer — dekorativ, zählt nicht hoch */}
      <p aria-hidden="true" className="mt-2.5 flex items-baseline gap-1.5 font-playfair text-charcoal">
        <span className="text-[clamp(1.9rem,3vw,2.4rem)] leading-none text-bordeaux">
          {stat.value}
        </span>
      </p>
      <h3 className="mt-2 text-[12px] font-semibold leading-snug text-charcoal">{stat.label}</h3>
      <p className="mt-1 text-[11.5px] leading-relaxed text-charcoal/55">{stat.detail}</p>
    </div>
  );
}

/* `stats` = Struktur (Ikone, Prinzip-Nummer) aus storyData, bereits mit dem
   Text der aktiven Sprache zusammengeführt — die Seite reicht sie herein. */
export default function StoryStats({ stats = [] }) {
  return (
    <Stagger
      className="grid grid-cols-1 gap-4 divide-y divide-charcoal/10 py-2 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-3 lg:py-4"
      gap={0.1}
    >
      {stats.map((stat) => (
        <StaggerItem key={stat.icon} y={18}>
          <StatFigure stat={stat} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
