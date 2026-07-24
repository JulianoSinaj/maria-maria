"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionTitle } from "@/components/Deco";
import { Reveal } from "@/components/motion/Reveal";
import { Plus } from "@/components/Icons";

/* Häufige Fragen — datengetriebenes Akkordeon nach dem Muster von
   kontakt/Faq.jsx: eine offene Frage zur Zeit, weiche height-auto-Animation,
   rotierendes Plus. Inhalte kommen aus wine.faq. */

export default function WineFaq({ wine }) {
  const [open, setOpen] = useState(0);
  const uid = useId();

  return (
    <section id="fragen" className="scroll-mt-36 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionTitle eyebrow="Häufige Fragen">
          Gut zu <span className="italic text-acqua-deep">wissen.</span>
        </SectionTitle>

        <Reveal className="mt-12">
          <div className="divide-y divide-stone/60 border-y border-stone/60">
            {wine.faq.map((item, i) => {
              const isOpen = open === i;
              const panelId = `${uid}-panel-${i}`;
              const triggerId = `${uid}-trigger-${i}`;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={`text-[15px] font-medium transition-colors duration-300 ${
                        isOpen ? "text-acqua-deep" : "text-charcoal group-hover:text-acqua-deep"
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        isOpen
                          ? "border-acqua/60 bg-acqua-light/25 text-acqua-deep"
                          : "border-stone/80 text-charcoal/55 group-hover:border-acqua/50 group-hover:text-acqua-deep"
                      }`}
                    >
                      <Plus
                        aria-hidden="true"
                        className={`h-4 w-4 transition-transform duration-500 ease-out-expo ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                        }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-2 text-[13.5px] leading-relaxed text-charcoal/70 sm:pr-12">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
