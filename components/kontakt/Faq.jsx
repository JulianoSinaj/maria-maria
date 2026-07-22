"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "@/components/Icons";

/* FAQ-Akkordeon — eine offene Frage zur Zeit, weiche height-auto-Animation,
   rotierendes Plus als Zustandsmarker. */

const ITEMS = [
  {
    q: "Wie kann ich eine Weinverkostung buchen?",
    a: "Senden Sie uns einfach über das Kontaktformular oder per E-Mail Ihren Wunschtermin und die Anzahl der Gäste. Wir melden uns innerhalb von 1–2 Werktagen mit einem persönlichen Vorschlag zurück. Verkostungen sind privat ebenso wie für Firmenanlässe möglich.",
  },
  {
    q: "Bieten Sie internationalen Versand an?",
    a: "Ja, wir versenden unsere Weine in viele europäische Länder. Versandkosten und Lieferzeiten hängen vom Zielland ab und werden im Bestellprozess transparent ausgewiesen. Für Lieferungen außerhalb der EU kontaktieren Sie uns bitte vorab.",
  },
  {
    q: "Kann ich Ihre Weine im lokalen Handel finden?",
    a: "Unsere Weine sind bei ausgewählten Fachhändlern und in der Gastronomie erhältlich. Da unsere Produktion limitiert ist, nennen wir Ihnen auf Anfrage gerne einen Partner in Ihrer Nähe. Alternativ finden Sie das gesamte Sortiment im offiziellen Online-Shop.",
  },
];

export default function Faq({ className = "" }) {
  const [open, setOpen] = useState(0);

  return (
    <div className={`divide-y divide-stone/60 border-y border-stone/60 ${className}`}>
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        const triggerId = `faq-trigger-${i}`;
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
                className={`text-[14px] font-medium transition-colors duration-300 ${
                  isOpen ? "text-bordeaux" : "text-charcoal group-hover:text-bordeaux"
                }`}
              >
                {item.q}
              </span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                  isOpen
                    ? "border-champagne bg-champagne/15 text-bordeaux"
                    : "border-stone/80 text-charcoal/55 group-hover:border-champagne group-hover:text-bordeaux"
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
                  <p className="pb-6 pr-12 text-[13px] leading-relaxed text-charcoal/70">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
