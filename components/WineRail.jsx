"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import { useCommon, useLocalizedWines } from "@/lib/i18n/context";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import useMediaQuery from "@/components/motion/useMediaQuery";
import WineCard from "./WineCard";
import { Arrow, ChevronRight } from "./Icons";

/* Wine showcase (home page) with two viewport-specific layouts:
   - Phones (<sm): one wine at a time — paddles page through the filtered
     collection with a directional spring slide, a counter tracks position.
   - Desktop (sm+): a horizontal rail of several cards at once; the paddles
     scroll the track a page at a time and disable at either edge.
   The filter pills (Alle / Rot / Weiß / Rosé) drive both; the active pill is
   a shared layout element that glides between buttons.

   Nur EINE der beiden Bauformen steht im DOM (Homepage-Brief §7: „keine
   responsiven Klone"). Vorher lagen Pager und Rail beide im Baum und wurden
   nur per CSS umgeschaltet — der erste Wein stand damit zweimal auf der
   Seite: zwei H3 mit demselben Namen, zwei Packshots mit demselben Alt-Text.
   Jetzt entscheidet die Breite im Client, welche Bauform gerendert wird;
   der Server rendert die Rail mit allen neun Weinen (das ist die Fassung,
   die ein Crawler ohne JavaScript lesen soll), Telefone wechseln nach der
   Hydration zum Pager. Die CSS-Klassen (sm:hidden / hidden sm:block)
   bleiben als Sicherheitsnetz für den Moment vor der Hydration. */

/* Schlüssel statt Beschriftung: `w.type === "Rotwein"` hätte außerhalb des
   Deutschen nie getroffen und die Schiene bei jeder Auswahl leer laufen
   lassen. Die Beschriftung kommt aus dem Wörterbuch. */
const FILTERS = [null, "red", "white", "rose"];

const spring = { type: "spring", stiffness: 260, damping: 30 };
const tapSpring = { type: "spring", stiffness: 400, damping: 22 };

export default function WineRail({ wines: incoming, className = "" }) {
  /* Die Liste kommt aus einer Server-Component und trägt nur Struktur —
     Region, Charakterworte und Speiseempfehlung holt der Hook dazu. */
  const wines = useLocalizedWines(incoming);
  const catalogue = useCommon("catalogue");
  const ui = useCommon("ui");
  const reduced = useReducedMotionSafe();
  /* Dieselbe Grenze wie Tailwinds `sm` — der Server nimmt Desktop an. */
  const wide = useMediaQuery("(min-width: 640px)", true);
  const [filter, setFilter] = useState(null);
  // Phone pager: index = position in the filtered list; dir = slide direction.
  const [[index, dir], setIndex] = useState([0, 0]);

  const list = filter ? wines.filter((w) => w.typeKey === filter) : wines;
  const count = list.length;
  /* Guard gegen leere Filterergebnisse: ohne ihn wäre `active` undefined
     (Crash in WineCard) und `% 0` ergäbe NaN */
  const shown = Math.min(index, Math.max(count - 1, 0));
  const active = count > 0 ? list[shown] : null;

  const go = (step) => {
    if (count < 1) return;
    setIndex(([i]) => [(i + step + count) % count, step]);
  };
  const pick = (type) => {
    setFilter(type);
    setIndex([0, 0]);
  };

  const variants = {
    enter: (d) => ({ opacity: 0, x: reduced ? 0 : d * 72, scale: reduced ? 1 : 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: reduced ? 0 : d * -72, scale: reduced ? 1 : 0.97 }),
  };

  // ---- desktop rail: scroll state + paddle paging ----
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  /* Telefon-Pager: nach einem Wisch darf der Kartentap nicht mehr als Klick
     auf den Karten-Link durchschlagen — Framer unterdrückt nur eigene Taps,
     nicht die nativen Klicks der verlinkten Kinder */
  const draggingRef = useRef(false);

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({
      start: el.scrollLeft <= 1,
      end: el.scrollLeft >= max - 1,
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  // Reset the rail to the start whenever the filtered collection changes.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: reduced ? "auto" : "smooth" });
    // syncEdges runs off the scroll event, but jump-to-0 may not fire one.
    requestAnimationFrame(syncEdges);
  }, [filter, reduced, syncEdges]);

  const scrollRail = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    // Each entry is sized to fit exactly 3 per view (the editorial layout is
    // horizontal and needs width), so a page = 3 entry widths incl. gap.
    const first = el.firstElementChild;
    const gap = 20; // matches gap-5
    const cardW = first ? first.getBoundingClientRect().width + gap : 300;
    el.scrollBy({ left: direction * cardW * 3, behavior: reduced ? "auto" : "smooth" });
  };

  // Shared paddle button. `onClick` + optional disabled state.
  const paddle = ({ onClick, label, flip = false, disabled = false, extra = "" }) => (
    <motion.button
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      transition={tapSpring}
      className={`h-11 w-11 items-center justify-center rounded-full border border-stone bg-white/70 text-charcoal/70 shadow-luxe transition-colors duration-300 hover:border-champagne hover:text-bordeaux disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-stone disabled:hover:text-charcoal/70 ${extra}`}
    >
      <ChevronRight className={`h-4 w-4 ${flip ? "rotate-180" : ""}`} />
    </motion.button>
  );

  return (
    <div className={className}>
      {/* ---- filter pills: edge-bleed swipe row on phones, plain row on sm+ ----
          Der Kantenfade (wie im SubNav) verrät, dass rechts weitere Pillen
          warten; data-lenis-prevent-horizontal lässt die Wischgeste nativ
          durch, statt dass Lenis sie schluckt. Ab sm ist nichts scrollbar —
          Maske weg, Snap inert. */}
      <div
        data-lenis-prevent-horizontal
        className="no-scrollbar -mx-6 snap-x overflow-x-auto scroll-pl-6 px-6 [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] sm:mx-0 sm:overflow-visible sm:px-0 sm:[mask-image:none]"
      >
        <div className="flex w-max items-center gap-2 pb-1 sm:w-auto sm:flex-wrap sm:gap-2.5">
          {FILTERS.map((f) => {
            const on = filter === f;
            /* null = „Alle Weine"; sonst der übersetzte Plural der Weinart. */
            const label = f ? catalogue.typesPlural?.[f] : catalogue.filters?.allWines;
            return (
              <motion.button
                key={f ?? "all"}
                onClick={() => pick(f)}
                aria-pressed={on}
                whileTap={{ scale: 0.96 }}
                transition={tapSpring}
                className={`relative h-10 shrink-0 snap-start rounded-full border px-5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                  on
                    ? "border-transparent text-ivory"
                    : "border-charcoal/20 bg-white/60 text-charcoal/70 hover:border-champagne hover:text-bordeaux"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="wine-filter-pill"
                    transition={reduced ? { duration: 0 } : spring}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-bordeaux to-wine shadow-chip"
                  />
                )}
                <span className="relative z-10">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          PHONE (<sm): single card with flanking / under paddles
          ============================================================ */}
      {!wide && (
      <div className="sm:hidden">
        <div className="relative mx-auto mt-8 w-full max-w-[340px]">
          {/* grid-stack: entering and exiting card share the cell, so the
              section never jumps in height mid-transition */}
          <div className="grid">
            <AnimatePresence initial={false} custom={dir}>
              {active && (
              /* Wischbar wie die Flaschenfotos: gleiche Schwellen, gleiche
                 Federn. Ein Zug im Foto blättert weiter dessen Seiten um
                 (das innere drag greift zuerst), daneben wischt die Karte. */
              <motion.div
                key={`${filter ?? "alle"}-${active.slug}`}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={spring}
                drag={reduced ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragStart={() => {
                  draggingRef.current = true;
                }}
                onDragEnd={(_, info) => {
                  const power = Math.abs(info.offset.x) * info.velocity.x;
                  if (info.offset.x < -48 || power < -6000) go(1);
                  else if (info.offset.x > 48 || power > 6000) go(-1);
                  requestAnimationFrame(() => {
                    draggingRef.current = false;
                  });
                }}
                onClickCapture={(e) => {
                  if (draggingRef.current) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="col-start-1 row-start-1 will-transform"
              >
                <WineCard wine={active} className="w-full" />
              </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-6">
          {paddle({ onClick: () => go(-1), label: ui.prevWine, flip: true, extra: "flex" })}
          <p aria-live="polite" className="text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
            <span className="font-semibold tabular-nums text-bordeaux">{String(shown + 1).padStart(2, "0")}</span>
            <span className="mx-1.5">/</span>
            <span className="tabular-nums">{String(count).padStart(2, "0")}</span>
          </p>
          {paddle({ onClick: () => go(1), label: ui.nextWine, extra: "flex" })}
        </div>
      </div>
      )}

      {/* ============================================================
          DESKTOP (sm+): horizontal rail of several cards, paged
          ============================================================ */}
      {wide && (
      <div className="hidden sm:block">
        <div className="mt-10 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
            <span className="tabular-nums">{String(count).padStart(2, "0")}</span>
            <span className="mx-1.5">{ui.winesLabel}</span>
          </p>
          <div className="flex items-center gap-3">
            {paddle({
              onClick: () => scrollRail(-1),
              label: ui.back,
              flip: true,
              disabled: edges.start,
              extra: "flex",
            })}
            {paddle({
              onClick: () => scrollRail(1),
              label: ui.next,
              disabled: edges.end,
              extra: "flex",
            })}
          </div>
        </div>

        {/* scroll track: cards flow left→right, snap to card starts. The
            negative inset + padding lets hover-lift shadows bleed past the
            content edge without being clipped by overflow-x. */}
        <div
          ref={trackRef}
          className="no-scrollbar -mx-2 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-2 pb-4 pt-1"
        >
          {list.map((wine) => (
            <div
              key={`${filter ?? "alle"}-${wine.slug}`}
              /* exactly 3 entries per view: a third of the track minus its
                 share of the 2 inter-entry gaps (2 × 20px ÷ 3) */
              className="w-[calc((100%-40px)/3)] shrink-0 snap-start"
            >
              <WineCard wine={wine} className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
      )}

      <div className="mt-5 text-center sm:mt-7">
        <Link
          href="/unsere-weine"
          className="group inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.16em] text-bordeaux"
        >
          {ui.wholeCollection}
          <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
