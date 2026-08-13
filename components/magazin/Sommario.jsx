import Link from "@/components/i18n/LocaleLink";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Arrow } from "@/components/Icons";

/* Sommario — das Inhaltsverzeichnis des Magazins, gesetzt wie im Heft:
   vier nummerierte Kapitel zwischen zwei Haarlinien, jedes ein Anker in die
   Seite. Die Ziffer rollt beim Hover maskiert nach oben durch (gleiche
   Sprache wie der Label-Roll der Buttons), der Pfeil deutet den Sprung nach
   unten an. Lenis übernimmt die weiche Fahrt zum Kapitel. */

const CHAPTERS = [
  { num: "I", label: "La storia", href: "#storia" },
  { num: "II", label: "Genussmomente", href: "#food-pairing" },
  { num: "III", label: "Bacheca", href: "#bacheca" },
  { num: "IV", label: "Curiosità", href: "#curiosita" },
];

export default function Sommario({ className = "" }) {
  return (
    <nav aria-label="Sommario — die Kapitel dieser Seite" className={className}>
      {/* Kopfzeile des Verzeichnisses */}
      <div className="flex items-baseline justify-between border-b border-charcoal/10 pb-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-charcoal/50">
          Sommario
        </span>
        <span className="font-playfair text-[13px] italic text-charcoal/40">
          Quattro capitoli, una rivista
        </span>
      </div>

      <Stagger
        className="grid grid-cols-2 gap-x-6 border-b border-charcoal/10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-charcoal/10"
        gap={0.06}
      >
        {CHAPTERS.map((c) => (
          <StaggerItem key={c.href} y={14}>
            <Link
              href={c.href}
              className="group flex min-h-[44px] items-center gap-3 py-3.5 lg:justify-center lg:px-4 lg:py-4"
            >
              {/* maskierter Ziffern-Roll */}
              <span
                aria-hidden="true"
                className="relative block shrink-0 overflow-hidden font-playfair text-[19px] italic leading-none text-champagne"
              >
                <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-[115%]">
                  {c.num}
                </span>
                <span className="absolute inset-0 block translate-y-[115%] text-bordeaux transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                  {c.num}
                </span>
              </span>

              <span className="relative min-w-0">
                <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/70 transition-colors duration-300 group-hover:text-bordeaux">
                  {c.label}
                </span>
                {/* Unterstrich zieht sich von links auf */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-champagne transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                />
              </span>

              {/* der Sprung nach unten */}
              <Arrow
                aria-hidden="true"
                className="ml-auto h-3 w-3 shrink-0 rotate-45 text-champagne opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0.5 group-hover:opacity-100 lg:ml-0"
              />
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </nav>
  );
}
