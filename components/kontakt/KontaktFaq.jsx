"use client";
import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Arrow, ChevronDown } from "@/components/Icons";
import { CTA_LINK } from "./styles";

/* Akkordeon der Kontakt-FAQ.

   Handoff §10: „La risposta deve essere presente nell'HTML iniziale, non
   caricata solo al click." Deshalb steht jede Antwort im Markup und wird
   beim Öffnen nur in der Höhe entfaltet — kein Fetch, kein Unmount.

   Im Mockup stehen vier Fragen und darunter „Alle Fragen ansehen". Der
   Schalter blendet die übrigen ein, statt auf eine zweite Seite zu führen,
   die es nicht gibt. Auch sie stehen von Anfang an im HTML; bis zum Klick
   sind sie nur nicht sichtbar.

   Eine Frage offen zur Zeit: zwei aufgeklappte Antworten schieben die dritte
   aus dem Bild, und der Nutzer scrollt hinter seiner eigenen Frage her. */

const VISIBLE = 4;

function Row({ item, open, onToggle, uid, reduced }) {
  const panelId = `${uid}-panel-${item.id}`;
  const buttonId = `${uid}-button-${item.id}`;

  return (
    <div className="border-b border-sand last:border-b-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-300 hover:bg-terracotta-soft/35 sm:px-6"
        >
          <span className="font-playfair text-[16.5px] leading-snug text-charcoal sm:text-[17.5px]">
            {item.q}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-terracotta transition-transform duration-400 ease-out-expo ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 pr-10 text-[13.5px] leading-[1.7] text-charcoal/72 sm:px-6 sm:pb-6">
          {item.a}
        </p>
      </motion.div>
    </div>
  );
}

export default function KontaktFaq({ copy }) {
  const uid = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const items = copy.items ?? [];
  const head = items.slice(0, VISIBLE);
  const tail = items.slice(VISIBLE);

  const row = (item) => (
    <Row
      key={item.id}
      item={item}
      uid={uid}
      reduced={reduced}
      open={open === item.id}
      onToggle={() => setOpen((current) => (current === item.id ? null : item.id))}
    />
  );

  return (
    <div>
      <div className="overflow-hidden rounded-[10px] border border-sand bg-white/70">
        {head.map(row)}

        {/* Die restlichen Fragen stehen im HTML und sind bis zum Klick nur
            nicht sichtbar — `hidden` nimmt sie sauber aus Tastaturreihenfolge
            und Screenreader, ohne sie dem Crawler vorzuenthalten. */}
        {tail.length > 0 && (
          <div hidden={!expanded} className="border-t border-sand first:border-t-0">
            {tail.map(row)}
          </div>
        )}
      </div>

      {tail.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`${CTA_LINK} mt-4 min-h-[44px]`}
        >
          {expanded ? copy.less : copy.more}
          <Arrow
            className={`h-3.5 w-3.5 transition-transform duration-500 ease-out-expo ${
              expanded ? "-rotate-90" : "group-hover/link:translate-x-1"
            }`}
          />
        </button>
      )}
    </div>
  );
}
