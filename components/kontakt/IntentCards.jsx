"use client";
import { Arrow } from "@/components/Icons";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { useIntentTarget } from "./IntentContext";
import { INTENT_CARDS } from "./intents";
import { Bag, Cheers, Cutlery, WineGlass } from "./icons";
import { CARD, CTA_LINK } from "./styles";

/* Die 2×2-Kachel „Warum möchten Sie uns kontaktieren?".

   Die ganze Karte ist ein <button>, nicht eine Karte mit einem Link darin:
   Handoff §12 verlangt „Tutta la card deve essere cliccabile" und §17
   „card cliccabili con semantica button/link reale". Ein <div onClick> sähe
   identisch aus und wäre für Tastatur und Screenreader nicht vorhanden; ein
   Link in einer klickbaren Karte wäre ein Ziel in einem Ziel.

   Deshalb ist die Terrakotta-Zeile unten KEIN eigener Link, sondern die
   Beschriftung derselben Schaltfläche — sie sagt, was der Klick tut. */

const ICONS = { Cutlery, Bag, Cheers, WineGlass };

export default function IntentCards({ copy }) {
  const { requestIntent } = useIntentTarget();

  return (
    <Stagger className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2" gap={0.08}>
      {INTENT_CARDS.map(({ key, value, icon }) => {
        const item = copy.items[key];
        const Icon = ICONS[icon];

        return (
          <StaggerItem key={key} className="h-full">
            <button
              type="button"
              onClick={() => requestIntent(value)}
              className={`${CARD} group flex h-full w-full items-start gap-5 p-6 text-left transition-colors duration-400 hover:border-terracotta/35 hover:bg-white sm:gap-6 sm:p-7`}
            >
              <span className="mt-0.5 flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full border border-terracotta/25 text-terracotta transition-colors duration-400 group-hover:border-terracotta/50 sm:h-[64px] sm:w-[64px]">
                <Icon className="h-[28px] w-[28px]" aria-hidden="true" />
              </span>

              {/* Spalte mit `mt-auto` an der CTA: In einer Reihe sind die
                  Karten gleich hoch, die Texte aber verschieden lang. Ohne
                  das steht die Terrakotta-Zeile in jeder Karte auf einer
                  anderen Höhe — im Mockup liegen sie auf einer Linie. */}
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="block font-playfair text-[18.5px] leading-snug text-charcoal">
                  {item.title}
                </span>
                <span className="mt-2 block text-[13px] leading-[1.6] text-charcoal/70">
                  {item.text}
                </span>
                {/* Keine eigene Mindesthöhe: Das Ziel ist die ganze Karte,
                    nicht diese Zeile. Ein 44-px-Kasten um eine Beschriftung,
                    die gar kein eigenes Ziel ist, bläht nur die Karte auf. */}
                <span className={`${CTA_LINK} mt-auto pt-4`}>
                  {item.cta}
                  <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                </span>
              </span>
            </button>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
