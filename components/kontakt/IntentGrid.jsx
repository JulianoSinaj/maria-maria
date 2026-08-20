"use client";
import { motion, useReducedMotion } from "motion/react";
import TiltCard from "@/components/motion/TiltCard";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Arrow } from "@/components/Icons";
import { Cutlery, ShoppingBag, Cheers, WineGlass } from "@/components/kontakt/KontaktIcons";
import { useKontaktIntent, CARD_INTENTS } from "@/components/kontakt/IntentContext";

/* Sektion 02 — die vier Gründe, Kontakt aufzunehmen (Handoff §5).

   Jede Karte klickt als Ganzes (Handoff: „Tutta la card deve essere
   cliccabile"), trägt aber eine echte <h3> — und eine Überschrift darf nicht
   in einem <button> stehen. Deshalb das „gestreckte Button"-Muster: die
   CTA-Zeile ist der einzige <button>, sein ::after-Pseudoelement deckt die
   ganze Karte ab. Ergebnis: gültiges HTML, EIN Tab-Stop je Karte, die ganze
   Fläche klickt, der zugängliche Name ist die CTA-Beschriftung.

   Klick = zum Formular scrollen + Anliegen vorbelegen + contact_intent_click
   (IntentContext). Reihenfolge und Icons liegen hier im Code, damit sie in
   allen vier Sprachen identisch sind; der Text kommt aus dem Wörterbuch.

   2×2 ab md, darunter eine Spalte (Handoff §12: „2×2 desktop, 1×4 mobile"). */

const ICONS = {
  gastronomie_feinkost: Cutlery,
  handel_wiederverkauf: ShoppingBag,
  event_feier: Cheers,
  verkostung: WineGlass,
};

const SECTION = "intents";

export default function IntentGrid({ copy }) {
  const { requestIntent } = useKontaktIntent();
  const reduced = useReducedMotion();

  return (
    <Stagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6" amount={0.12}>
      {CARD_INTENTS.map((key, i) => {
        const item = copy.items[key];
        const Icon = ICONS[key];
        if (!item) return null;
        return (
          <StaggerItem key={key} className="h-full">
            <TiltCard className="group h-full" max={3.5} radius="rounded-card">
              <motion.div
                whileTap={reduced ? undefined : { scale: 0.985 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className="relative flex h-full items-start gap-5 rounded-card border border-stone/70 bg-cream/80 p-6 transition-[border-color,background-color] duration-500 ease-out-expo focus-within:border-terracotta/60 group-hover:border-terracotta/45 group-hover:bg-cream sm:p-7"
              >
                {/* Icon im Kreis — linear, dünn, terrakotta */}
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-terracotta/25 bg-terracotta-light/45 text-terracotta transition-colors duration-500 group-hover:bg-terracotta-light"
                >
                  <Icon className="h-7 w-7" />
                </span>

                <div className="flex min-h-full flex-1 flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-terracotta/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1.5 font-playfair text-[19px] leading-snug text-charcoal sm:text-[20px]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-charcoal/70">{item.text}</p>

                  {/* Der eine Button der Karte — sein ::after füllt die ganze
                      Karte (relative-Elternteil oben), damit überall geklickt
                      werden kann. Sichtbarer Fokus: Ring auf dem Text, Rahmen
                      der Karte über focus-within. */}
                  <button
                    type="button"
                    onClick={() => requestIntent(key, { ctaLabel: item.cta, section: SECTION })}
                    className="mt-auto inline-flex min-h-[44px] items-center gap-1.5 self-start pt-4 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-terracotta after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-terracotta focus-visible:after:ring-offset-2 focus-visible:after:ring-offset-ivory"
                  >
                    <span className="relative">
                      {item.cta}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-terracotta transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                      />
                    </span>
                    <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </TiltCard>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
