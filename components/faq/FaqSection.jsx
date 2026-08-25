"use client";
import { useEffect, useId, useMemo, useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import { Eyebrow, GoldRule } from "@/components/Deco";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/Icons";
import { useCommon } from "@/lib/i18n/context";
import {
  pushEvent,
  pageLocation,
  FAQ_OPEN,
  FAQ_CTA_CLICK,
  REGION_TAB_VIEW,
} from "@/lib/analytics";

/* Wiederverwendbare FAQ-Sektion für alle Seiten — geteiltes „Index“-Layout:
   links der Sektionstext (Eyebrow, Titel, Beschreibung) samt Themen-Index bei
   gruppierten FAQs, rechts das Akkordeon. Eine Quelle, mehrere Ausgaben:
   flache Listen (`items`) oder Cluster (`groups`, z. B. Kontakt/Regionen).

   Regeln aus der FAQ-Guide:
   - Antworten stehen im initialen HTML (kein Fetch, kein Unmount — Panels
     werden nur auf Höhe 0 animiert), eine offene Frage pro Cluster.
   - Max. 1 interner Link pro Antwort (`item.link`), beschreibender Anchor.
   - Stabile IDs je Frage (`item.id`) für Deep-Links und dataLayer-Tracking
     (faq_open / cta_click), niemals der Fragetext als Schlüssel.
   - Fragen mind. 18 px, Antworten mind. 16 px, Touch-Target mind. 44 px,
     Icon `+` im geschlossenen und `–` im geöffneten Zustand.
   - Kein FAQPage-JSON-LD: seit Mai 2026 ohne Rich-Result-Effekt, bewusst P2. */

const INDICATOR_SPRING = { type: "spring", stiffness: 320, damping: 30 };

/* sichtbarer Fokus für Tastaturbedienung — gleiche Marke wie die Hover-Ringe */
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

export default function FaqSection({
  id = "fragen",
  /* kein deutscher Default — die Beschriftung kommt immer aus dem Wörterbuch
     der aufrufenden Seite, sonst bliebe eine Lücke unbemerkt deutsch */
  eyebrow,
  title,
  description,
  items,
  groups,
  accent,
  pageType = "page",
  /* „index“ = zweispaltig mit Themen-Index (Standard der Cluster-Seiten),
     „single“ = eine schmale Spalte von 760–860 px, wie die Homepage-FAQ-Guide
     sie für die Startseite vorgibt. Gruppierte FAQs brauchen den Index und
     bleiben deshalb immer zweispaltig. */
  layout = "index",
  /* Wert für `cta_position` in GA4; die Startseite trägt laut Guide
     „homepage_faq“, alle übrigen Seiten ihren eigenen Sektionsschlüssel */
  ctaPosition = pageType === "home"
    ? "homepage_faq"
    : `${pageType.replace(/[^a-z0-9]+/gi, "_")}_faq`,
  footer,
  className = "",
}) {
  const uid = useId();
  const reduced = useReducedMotionSafe();
  const ui = useCommon("ui");

  /* flache Listen intern als Ein-Gruppen-Fall behandeln */
  const grouped = useMemo(
    () => groups ?? [{ key: "faq", label: null, items: items ?? [] }],
    [groups, items]
  );
  const hasIndex = grouped.length > 1;
  const single = layout === "single" && !hasIndex;

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
      pushEvent(FAQ_OPEN, {
        faq_id: item.id ?? `${pageType}-${group.key}-${index}`,
        faq_question: item.q,
        page_location: pageLocation(),
        cluster: group.label ?? group.key,
        page_type: pageType,
        position: index + 1,
      });
    }
  };

  /* Cluster-Wechsel. Auf /regionen entspricht ein Cluster einer Region, die
     Regionen-Guide (Abschnitt 10) verlangt dafür `region_tab_view`. Das
     Event feuert nur beim tatsächlichen Wechsel — der erste Render zählt
     nicht, sonst stünde neben jedem Klick eine Dublette. */
  const selectGroup = (group) => {
    if (group.key === activeKey) return;
    setActiveKey(group.key);
    if (pageType === "regionen") {
      pushEvent(REGION_TAB_VIEW, {
        region_name: group.label ?? group.key,
        page_location: pageLocation(),
        page_type: pageType,
      });
    }
  };

  const trackCta = (text, href) =>
    pushEvent(FAQ_CTA_CLICK, {
      cta_text: text,
      cta_destination: href,
      cta_position: ctaPosition,
      page_type: pageType,
    });

  /* `footer.note` trägt die Frage über dem Link („Noch Fragen oder Interesse
     an einer Zusammenarbeit?“) — der Link selbst zählt als CTA und wird wie
     die Antwort-Links als cta_click erfasst */
  const footerCta = footer ? (
    <Reveal delay={0.16}>
      <div className="mt-5">
        {footer.note && (
          <p className="text-[16px] leading-snug text-charcoal/70">{footer.note}</p>
        )}
        <Link
          href={footer.href}
          onClick={() => trackCta(footer.label, footer.href)}
          className={`group inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-medium text-bordeaux ${FOCUS_RING}`}
        >
          {footer.label}
          <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </Link>
      </div>
    </Reveal>
  ) : null;

  const heightTransition = reduced
    ? { duration: 0 }
    : {
        height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section id={id} className={`relative scroll-mt-36 ${className}`}>
      <div
        className={
          single
            ? "mx-auto w-full max-w-[820px] px-6 py-12 sm:py-14 lg:px-10 lg:py-16"
            : "mx-auto grid max-w-content grid-cols-1 gap-8 px-6 py-12 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 lg:px-10 lg:py-16"
        }
      >
        {/* ---- linke Spalte: Text + Themen-Index, haftet beim Scrollen ---- */}
        <div className={single ? "" : "lg:sticky lg:top-32 lg:self-start"}>
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-3 text-balance font-playfair text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.1] text-charcoal">
              {title}
            </h2>
            {description && (
              <p
                className={`mt-3 text-[16px] leading-snug text-charcoal/70 ${
                  single ? "max-w-[54ch]" : "max-w-md"
                }`}
              >
                {description}
              </p>
            )}
            <GoldRule className="mt-5 w-24" />
          </Reveal>

          {hasIndex && (
            <Reveal delay={0.1}>
              <nav aria-label={ui.faqTopics} className="mt-6">
                {/* Kantenfade + nativer Wisch (data-lenis-prevent-horizontal)
                    wie im SubNav — unterhalb lg ist die Themenzeile scrollbar,
                    ab lg wird sie zur Spalte und die Maske verschwindet. */}
                <ul
                  data-lenis-prevent-horizontal
                  className="no-scrollbar -mx-6 flex snap-x gap-2 overflow-x-auto scroll-pl-6 px-6 [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] lg:mx-0 lg:flex-col lg:gap-2 lg:px-0 lg:[mask-image:none]"
                >
                  {grouped.map((g) => {
                    const isActive = g.key === activeKey;
                    return (
                      <li key={g.key} className="shrink-0 snap-start lg:shrink">
                        <button
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => selectGroup(g)}
                          className={`group relative flex min-h-[44px] w-full items-center justify-between gap-3 overflow-hidden rounded-full border px-4 py-2 text-left text-[14px] transition-colors duration-300 lg:rounded-2xl lg:px-4 lg:py-2.5 ${FOCUS_RING} ${
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

          {/* Abschluss-CTA: im Index-Layout unter dem Sektionstext, in der
              einspaltigen Fassung hinter der letzten Antwort */}
          {!single && footerCta}
        </div>

        {/* ---- rechte Spalte: Akkordeon; inaktive Cluster bleiben im DOM ---- */}
        <Reveal delay={0.12} className={single ? "mt-8 min-w-0" : "min-w-0"}>
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
                        className={`group flex min-h-[44px] w-full items-center justify-between gap-5 py-4 text-left ${FOCUS_RING}`}
                      >
                        <span
                          className="text-[18px] font-medium leading-snug text-charcoal transition-colors duration-300"
                          style={isOpen ? { color: ink } : undefined}
                        >
                          {item.q}
                        </span>
                        {/* + geschlossen, – geöffnet: der senkrechte Balken
                            fährt auf der GPU über scaleY ein statt zu rotieren */}
                        <span
                          aria-hidden="true"
                          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone/80 text-charcoal/55 transition-colors duration-300 group-hover:border-champagne"
                          style={
                            isOpen
                              ? { borderColor: ring, backgroundColor: wash, color: ink }
                              : undefined
                          }
                        >
                          <span className="absolute h-[1.5px] w-4 rounded-full bg-current" />
                          <span
                            className={`absolute h-4 w-[1.5px] origin-center rounded-full bg-current will-change-transform ${
                              reduced ? "" : "transition-transform duration-500 ease-out-expo"
                            } ${isOpen ? "scale-y-0" : "scale-y-100"}`}
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
                          <p className="text-[16px] leading-relaxed text-charcoal/70">
                            {item.a}
                          </p>
                          {item.link && (
                            <Link
                              href={item.link.href}
                              tabIndex={isOpen ? 0 : -1}
                              onClick={() => trackCta(item.link.label, item.link.href)}
                              className={`group/faql mt-1.5 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-medium ${FOCUS_RING}`}
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
          {single && footerCta}
        </Reveal>
      </div>
    </section>
  );
}
