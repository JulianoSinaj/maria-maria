"use client";
import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Eyebrow, GoldRule } from "@/components/Deco";
import { Reveal } from "@/components/motion/Reveal";
import { Plus, Arrow } from "@/components/Icons";

/* Wiederverwendbare FAQ-Sektion für alle Seiten — geteiltes „Index“-Layout:
   links der Sektionstext (Eyebrow, Titel, Beschreibung) samt Themen-Index bei
   gruppierten FAQs, rechts das Akkordeon. Eine Quelle, mehrere Ausgaben:
   flache Listen (`items`) oder Cluster (`groups`, z. B. Kontakt/Regionen).

   Regeln aus der FAQ-Guide:
   - Antworten stehen im initialen HTML (kein Fetch, kein Unmount — Panels
     werden nur auf Höhe 0 animiert), eine offene Frage pro Cluster.
   - Max. 1 interner Link pro Antwort (`item.link`), beschreibender Anchor.
   - Stabile IDs je Frage (`item.id`) für Deep-Links und dataLayer-Tracking
     (faq_open / faq_internal_link_click), niemals der Fragetext als Schlüssel.
   - Kein FAQPage-JSON-LD: seit Mai 2026 ohne Rich-Result-Effekt, bewusst P2. */

const INDICATOR_SPRING = { type: "spring", stiffness: 320, damping: 30 };

function pushEvent(event, payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

export default function FaqSection({
  id = "fragen",
  eyebrow = "Häufige Fragen",
  title,
  description,
  items,
  groups,
  accent,
  pageType = "page",
  footer,
  className = "",
}) {
  const uid = useId();
  const reduced = useReducedMotion();

  /* flache Listen intern als Ein-Gruppen-Fall behandeln */
  const grouped = useMemo(
    () => groups ?? [{ key: "faq", label: null, items: items ?? [] }],
    [groups, items]
  );
  const hasIndex = grouped.length > 1;

  const [activeKey, setActiveKey] = useState(grouped[0]?.key);
  /* offene Frage je Gruppe — initial alle geschlossen (Antworten stehen
     dennoch im HTML, nur auf Höhe 0 gefaltet); so ist jedes faq_open eine
     echte Nutzerinteraktion und Position 1 wird nicht untererfasst */
  const [open, setOpen] = useState(() =>
    Object.fromEntries(grouped.map((g) => [g.key, null]))
  );

  /* Deep-Links: /seite#frage-id aktiviert den zugehörigen Cluster, öffnet
     das Panel und scrollt nach dem Einblenden zur Frage */
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    for (const g of grouped) {
      const idx = g.items.findIndex((it) => it.id === hash);
      if (idx === -1) continue;
      setActiveKey(g.key);
      setOpen((prev) => ({ ...prev, [g.key]: idx }));
      requestAnimationFrame(() =>
        document.getElementById(hash)?.scrollIntoView({ block: "start" })
      );
      break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Akzentfarben: Weinseiten liefern ihre Palette, sonst Bordeaux/Champagner */
  const ink = accent?.deep ?? "#6B0F1A";
  const ring = accent?.base ?? "#C8B77A";
  const wash = `${accent?.light ?? "#C8B77A"}${accent ? "59" : "26"}`;

  const toggle = (group, index, item) => {
    const willOpen = open[group.key] !== index;
    setOpen((prev) => ({ ...prev, [group.key]: willOpen ? index : null }));
    if (willOpen) {
      pushEvent("faq_open", {
        faq_id: item.id ?? `${pageType}-${group.key}-${index}`,
        question: item.q,
        cluster: group.label ?? group.key,
        page_type: pageType,
        position: index + 1,
      });
    }
  };

  const heightTransition = reduced
    ? { duration: 0 }
    : {
        height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section id={id} className={`relative scroll-mt-36 ${className}`}>
      <div className="mx-auto grid max-w-content grid-cols-1 gap-8 px-6 py-12 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 lg:px-10 lg:py-16">
        {/* ---- linke Spalte: Text + Themen-Index, haftet beim Scrollen ---- */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-3 text-balance font-playfair text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.1] text-charcoal">
              {title}
            </h2>
            {description && (
              <p className="mt-3 max-w-md text-[13.5px] leading-snug text-charcoal/70">
                {description}
              </p>
            )}
            <GoldRule className="mt-5 w-24" />
          </Reveal>

          {hasIndex && (
            <Reveal delay={0.1}>
              <nav aria-label="FAQ-Themen" className="mt-6">
                <ul className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:flex-col lg:gap-2 lg:px-0">
                  {grouped.map((g) => {
                    const isActive = g.key === activeKey;
                    return (
                      <li key={g.key} className="shrink-0 lg:shrink">
                        <button
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setActiveKey(g.key)}
                          className={`group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-full border px-4 py-2 text-left text-[12.5px] transition-colors duration-300 lg:rounded-2xl lg:px-4 lg:py-2.5 ${
                            isActive
                              ? "border-transparent bg-white shadow-luxe"
                              : "border-stone/70 bg-white/40 text-charcoal/65 hover:border-champagne/70 hover:text-charcoal"
                          }`}
                          style={isActive ? { borderColor: ring } : undefined}
                        >
                          {isActive && (
                            <motion.span
                              layoutId={`${uid}-faq-index`}
                              transition={reduced ? { duration: 0 } : INDICATOR_SPRING}
                              aria-hidden="true"
                              className="absolute inset-y-2 left-0 hidden w-[3px] rounded-full lg:block"
                              style={{ background: ink }}
                            />
                          )}
                          <span
                            className={`whitespace-nowrap font-medium lg:whitespace-normal ${
                              isActive ? "" : "font-normal"
                            }`}
                            style={isActive ? { color: ink } : undefined}
                          >
                            {g.label}
                          </span>
                          <span
                            className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[10.5px] tabular-nums ${
                              isActive ? "" : "bg-charcoal/[0.05] text-charcoal/55"
                            }`}
                            style={
                              isActive ? { backgroundColor: wash, color: ink } : undefined
                            }
                          >
                            {g.items.length}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </Reveal>
          )}

          {footer && (
            <Reveal delay={0.16}>
              <Link
                href={footer.href}
                className="group mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
              >
                {footer.label}
                <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
              </Link>
            </Reveal>
          )}
        </div>

        {/* ---- rechte Spalte: Akkordeon; inaktive Cluster bleiben im DOM ---- */}
        <Reveal delay={0.12} className="min-w-0">
          {grouped.map((group) => (
            <div key={group.key} hidden={hasIndex && group.key !== activeKey}>
              <div className="divide-y divide-stone/60 border-y border-stone/60">
                {group.items.map((item, i) => {
                  const isOpen = open[group.key] === i;
                  const itemKey = item.id ?? `${group.key}-${i}`;
                  const panelId = `${uid}-panel-${itemKey}`;
                  const triggerId = `${uid}-trigger-${itemKey}`;
                  return (
                    <div key={itemKey} id={item.id} className="scroll-mt-36">
                      <button
                        type="button"
                        id={triggerId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggle(group, i, item)}
                        className="group flex w-full items-center justify-between gap-5 py-3.5 text-left"
                      >
                        <span
                          className="text-[14.5px] font-medium leading-snug text-charcoal transition-colors duration-300"
                          style={isOpen ? { color: ink } : undefined}
                        >
                          {item.q}
                        </span>
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone/80 text-charcoal/55 transition-colors duration-300 group-hover:border-champagne"
                          style={
                            isOpen
                              ? { borderColor: ring, backgroundColor: wash, color: ink }
                              : undefined
                          }
                        >
                          <Plus
                            aria-hidden="true"
                            className={`h-4 w-4 transition-transform duration-500 ease-out-expo ${
                              isOpen ? "rotate-45" : ""
                            }`}
                          />
                        </span>
                      </button>
                      {/* Panel bleibt gemountet: Antwort steht im initialen
                          HTML und wird nur auf Höhe 0 zusammengefaltet */}
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
                        <div className="pb-4 pr-2 sm:pr-10">
                          <p className="text-[13.5px] leading-normal text-charcoal/70">
                            {item.a}
                          </p>
                          {item.link && (
                            <Link
                              href={item.link.href}
                              tabIndex={isOpen ? 0 : -1}
                              onClick={() =>
                                pushEvent("faq_internal_link_click", {
                                  faq_id: item.id ?? `${pageType}-${group.key}-${i}`,
                                  target_url: item.link.href,
                                  page_type: pageType,
                                })
                              }
                              className="group/faql mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-medium"
                              style={{ color: ink }}
                            >
                              {item.link.label}
                              <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover/faql:translate-x-1" />
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
