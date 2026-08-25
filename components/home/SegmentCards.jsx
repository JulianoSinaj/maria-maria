"use client";
import Button from "@/components/ui/Button";
import TiltCard from "@/components/motion/TiltCard";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { IconChip } from "@/components/Deco";
import { Cutlery, Bag, Cheers } from "@/components/kontakt/icons";
import { pushEvent, CONTACT_INTENT_CLICK } from "@/lib/analytics";

/* Die drei Conversion-Segmente der Startseite (Homepage-Brief §5):
   Gastronomie & Feinkost · Handel & Wiederverkauf · Events & Verkostungen.

   Jede Karte ist eine echte Inhaltskarte mit eigener H3 (Brief §6) und
   genau einer CTA, die auf /kontakt?anliegen=… führt und dort das Anliegen
   im Formular vorbelegt. Text und Ziele kommen fertig aus HomeContent
   (Server) — hier liegt nur, was einen Klick braucht: Karten-Physik
   (TiltCard) und das contact_intent_click-Ereignis, dieselbe
   Mikro-Konversion, die auch die Anliegen-Karten der Kontaktseite melden
   (lib/analytics.js). Nutzlast ohne personenbezogene Daten: Schlüssel,
   CTA-Beschriftung, Sektion.

   Bauform wie die Philosophie-Karten weiter oben (IconChip, Haarlinien-
   Ring, Weißglas), damit die Sektion zur Seite gehört und nicht wie ein
   angeflanschtes Formular wirkt; die Ikonen sind die der Kontaktseite —
   dieselben Anliegen, dieselben Zeichen. */

const ICONS = { Cutlery, Bag, Cheers };

export default function SegmentCards({ items = [] }) {
  return (
    <Stagger className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3 sm:mt-11" gap={0.08}>
      {items.map((s) => {
        const Icon = ICONS[s.icon] ?? Cutlery;
        return (
          <StaggerItem key={s.key} className="h-full">
            <TiltCard className="group h-full" max={4} radius="rounded-card-lg">
              <div className="ring-hairline relative flex h-full flex-col overflow-hidden rounded-card-lg border border-stone/40 bg-white/70 p-6 shadow-luxe backdrop-blur-md transition-[box-shadow,border-color] duration-500 group-hover:border-champagne/60 group-hover:shadow-lift sm:p-7">
                <IconChip>
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </IconChip>
                <h3 className="mt-4 font-playfair text-[19px] leading-snug text-charcoal">{s.title}</h3>
                <p className="mt-2.5 text-[13px] leading-[1.65] text-charcoal/70">{s.text}</p>
                {/* mt-auto: die drei Texte sind verschieden lang, die drei
                    CTAs stehen trotzdem auf einer Linie */}
                <div className="mt-auto pt-6">
                  <Button
                    href={s.href}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      pushEvent(CONTACT_INTENT_CLICK, {
                        intent: s.intent ?? null,
                        cta_label: s.cta,
                        section: "home_segments",
                      })
                    }
                  >
                    {s.cta}
                  </Button>
                </div>
              </div>
            </TiltCard>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
