"use client";
import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "@/components/i18n/LocaleLink";
import { Arrow } from "@/components/Icons";
import { useLocale } from "@/lib/i18n/context";
import { pushEvent, pageLocation, FAQ_OPEN, FAQ_CTA_CLICK } from "@/lib/analytics";

/* Sektion 06 — Akkordeon „Häufige Fragen" der Kontaktseite (Handoff §10).

   Warum nicht FaqSection: die teilt sich das Zwei-Spalten-Layout mit
   Sektionstext und Themen-Index. Das Mockup will etwas anderes — zentrierte
   H2, Akkordeon links, Foto rechts, vier Fragen sichtbar und „Alle Fragen
   ansehen". Dieses Stück ist NUR das Akkordeon; das Raster und das Foto
   setzt die Seite.

   Regeln (Handoff §15/§17 + FAQ-Guide):
   - Alle sechs Antworten stehen im initialen HTML. Geschlossene Panels sind
     auf Höhe 0 gefaltet, nicht ausgehängt; die Fragen 5–6 liegen in einem
     zweiten gefalteten Block, den „Alle Fragen ansehen" aufklappt. Crawler
     lesen alles, Besucher sehen erst vier.
   - <button> + aria-expanded/aria-controls, Panel als role="region".
   - Stabile IDs je Frage (`item.id`) für Deep-Links (/kontakt#kontakt-
     haendler kommt von der Startseiten-FAQ) und für faq_id im dataLayer.
   - faq_open trägt faq_id, category, language (Handoff §16) — kein Fragetext
     nötig, die ID ist sprachneutral.
   - Eine offene Frage zugleich; Touch-Ziel ≥ 44 px; + geschlossen, – offen. */

const VISIBLE = 4;
const CATEGORY = "kontakt";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

export default function KontaktFaq({ items = [], copy }) {
  const uid = useId();
  const reduced = useReducedMotion();
  const locale = useLocale();
  const [open, setOpen] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const head = items.slice(0, VISIBLE);
  const tail = items.slice(VISIBLE);

  /* Deep-Link: /kontakt#<id> öffnet die Frage — liegt sie hinter der
     Vierergrenze, klappt zuerst der Rest auf. */
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const idx = items.findIndex((it) => it.id === hash);
    if (idx === -1) return;
    if (idx >= VISIBLE) setExpanded(true);
    setOpen(idx);
    requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (index, item) => {
    const willOpen = open !== index;
    setOpen(willOpen ? index : null);
    if (willOpen) {
      pushEvent(FAQ_OPEN, {
        faq_id: item.id ?? `${CATEGORY}-${index}`,
        category: CATEGORY,
        language: locale,
        page_type: CATEGORY,
        position: index + 1,
        page_location: pageLocation(),
      });
    }
  };

  const trackCta = (text, href) =>
    pushEvent(FAQ_CTA_CLICK, {
      cta_text: text,
      cta_destination: href,
      cta_position: `${CATEGORY}_faq`,
      page_type: CATEGORY,
    });

  const heightTransition = reduced
    ? { duration: 0 }
    : {
        height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
      };

  const renderItem = (item, index, { reachable = true } = {}) => {
    const isOpen = open === index;
    const itemKey = item.id ?? `faq-${index}`;
    const panelId = `${uid}-panel-${itemKey}`;
    const triggerId = `${uid}-trigger-${itemKey}`;
    return (
      <div key={itemKey} id={item.id} className="scroll-mt-36">
        <h3 className="m-0">
          <button
            type="button"
            id={triggerId}
            aria-expanded={isOpen}
            aria-controls={panelId}
            tabIndex={reachable ? 0 : -1}
            onClick={() => toggle(index, item)}
            className={`group flex min-h-[44px] w-full items-center justify-between gap-5 py-4 text-left ${FOCUS}`}
          >
            <span
              className={`font-playfair text-[17px] leading-snug transition-colors duration-300 sm:text-[18px] ${
                isOpen ? "text-terracotta" : "text-charcoal group-hover:text-terracotta"
              }`}
            >
              {item.q}
            </span>
            {/* + geschlossen, – geöffnet: der senkrechte Balken fährt über
                scaleY ein — Transform, kein Layout */}
            <span
              aria-hidden="true"
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                isOpen
                  ? "border-terracotta/50 bg-terracotta-light/60 text-terracotta"
                  : "border-stone/80 text-charcoal/55 group-hover:border-terracotta/50 group-hover:text-terracotta"
              }`}
            >
              <span className="absolute h-[1.5px] w-4 rounded-full bg-current" />
              <span
                className={`absolute h-4 w-[1.5px] origin-center rounded-full bg-current will-change-transform ${
                  reduced ? "" : "transition-transform duration-500 ease-out-expo"
                } ${isOpen ? "scale-y-0" : "scale-y-100"}`}
              />
            </span>
          </button>
        </h3>
        {/* Panel bleibt gemountet: Antwort steht im HTML, wird nur gefaltet */}
        <motion.div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          aria-hidden={!isOpen}
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={heightTransition}
          className="overflow-hidden"
        >
          <div className="pb-5 pr-2 sm:pr-12">
            <p className="text-[15px] leading-relaxed text-charcoal/70">{item.a}</p>
            {item.link && (
              <Link
                href={item.link.href}
                tabIndex={isOpen && reachable ? 0 : -1}
                onClick={() => trackCta(item.link.label, item.link.href)}
                className={`group/faql mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-terracotta ${FOCUS}`}
              >
                {item.link.label}
                <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover/faql:translate-x-1" />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const toggleId = `${uid}-faq-more`;

  return (
    <div>
      <div className="divide-y divide-stone/60 border-y border-stone/60">
        {head.map((item, i) => renderItem(item, i))}
      </div>

      {tail.length > 0 && (
        <>
          {/* Fragen 5–6: im HTML, aber gefaltet, bis „Alle Fragen ansehen"
              gedrückt wird. Geschlossen aus der Tab-Reihenfolge genommen. */}
          <motion.div
            id={toggleId}
            aria-hidden={!expanded}
            initial={false}
            animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
            transition={heightTransition}
            className="overflow-hidden"
          >
            <div className="divide-y divide-stone/60 border-b border-stone/60">
              {tail.map((item, i) => renderItem(item, VISIBLE + i, { reachable: expanded }))}
            </div>
          </motion.div>

          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={toggleId}
            onClick={() => setExpanded((v) => !v)}
            className={`group mt-5 inline-flex min-h-[44px] items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-terracotta ${FOCUS}`}
          >
            <span className="relative">
              {expanded ? copy.showLess : copy.showAll}
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-terracotta transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
              />
            </span>
            <Arrow
              className={`h-3.5 w-3.5 transition-transform duration-500 ease-out-expo ${
                expanded ? "-rotate-90" : "rotate-90 group-hover:translate-y-0.5"
              }`}
            />
          </button>
        </>
      )}
    </div>
  );
}
