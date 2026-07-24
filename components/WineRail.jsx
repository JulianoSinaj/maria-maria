"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import WineCard from "./WineCard";
import { Arrow, ChevronRight } from "./Icons";

/* Wine showcase (home page) with two viewport-specific layouts:
   - Phones (<sm): one wine at a time — paddles page through the filtered
     collection with a directional spring slide, a counter tracks position.
   - Desktop (sm+): a horizontal rail of several cards at once; the paddles
     scroll the track a page at a time and disable at either edge.
   The filter pills (Alle / Rot / Weiß / Rosé) drive both; the active pill is
   a shared layout element that glides between buttons. */

const FILTERS = [
  { label: "Alle Weine", type: null },
  { label: "Rotweine", type: "Rotwein" },
  { label: "Weißweine", type: "Weißwein" },
  { label: "Rosé", type: "Roséwein" },
];

const spring = { type: "spring", stiffness: 260, damping: 30 };
const tapSpring = { type: "spring", stiffness: 400, damping: 22 };

export default function WineRail({ wines, className = "" }) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState(null);
  // Phone pager: index = position in the filtered list; dir = slide direction.
  const [[index, dir], setIndex] = useState([0, 0]);

  const list = filter ? wines.filter((w) => w.type === filter) : wines;
  const count = list.length;
  const active = list[Math.min(index, count - 1)];

  const go = (step) => setIndex(([i]) => [(i + step + count) % count, step]);
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
    // Each card is sized to fit exactly 4 per view, so a page = 4 card widths
    // (incl. the 20px gap between them).
    const first = el.firstElementChild;
    const gap = 20; // matches gap-5
    const cardW = first ? first.getBoundingClientRect().width + gap : 300;
    el.scrollBy({ left: direction * cardW * 4, behavior: reduced ? "auto" : "smooth" });
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
      {/* ---- filter pills: edge-bleed swipe row on phones, plain row on sm+ ---- */}
      <div className="no-scrollbar -mx-6 overflow-x-auto px-6 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex w-max items-center gap-2 pb-1 sm:w-auto sm:flex-wrap sm:gap-2.5">
          {FILTERS.map((f) => {
            const on = filter === f.type;
            return (
              <motion.button
                key={f.label}
                onClick={() => pick(f.type)}
                aria-pressed={on}
                whileTap={{ scale: 0.96 }}
                transition={tapSpring}
                className={`relative h-10 shrink-0 rounded-full border px-5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
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
                <span className="relative z-10">{f.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          PHONE (<sm): single card with flanking / under paddles
          ============================================================ */}
      <div className="sm:hidden">
        <div className="relative mx-auto mt-8 w-full max-w-[340px]">
          {/* grid-stack: entering and exiting card share the cell, so the
              section never jumps in height mid-transition */}
          <div className="grid">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={`${filter ?? "alle"}-${active.slug}`}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={spring}
                className="col-start-1 row-start-1 will-transform"
              >
                <WineCard wine={active} className="w-full" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-6">
          {paddle({ onClick: () => go(-1), label: "Vorheriger Wein", flip: true, extra: "flex" })}
          <p aria-live="polite" className="text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
            <span className="font-semibold tabular-nums text-bordeaux">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-1.5">/</span>
            <span className="tabular-nums">{String(count).padStart(2, "0")}</span>
          </p>
          {paddle({ onClick: () => go(1), label: "Nächster Wein", extra: "flex" })}
        </div>
      </div>

      {/* ============================================================
          DESKTOP (sm+): horizontal rail of several cards, paged
          ============================================================ */}
      <div className="hidden sm:block">
        <div className="mt-10 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
            <span className="tabular-nums">{String(count).padStart(2, "0")}</span>
            <span className="mx-1.5">Weine</span>
          </p>
          <div className="flex items-center gap-3">
            {paddle({
              onClick: () => scrollRail(-1),
              label: "Zurück",
              flip: true,
              disabled: edges.start,
              extra: "flex",
            })}
            {paddle({
              onClick: () => scrollRail(1),
              label: "Weiter",
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
              /* exactly 4 cards per view: quarter of the track minus its
                 share of the 3 inter-card gaps (3 × 20px ÷ 4 = 15px) */
              className="w-[calc((100%-60px)/4)] shrink-0 snap-start"
            >
              <WineCard wine={wine} className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 text-center sm:mt-7">
        <Link
          href="/weine"
          className="group inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.16em] text-bordeaux"
        >
          Die ganze Kollektion
          <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
