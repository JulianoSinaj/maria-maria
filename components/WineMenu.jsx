"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { WINES, wineHref, fmtPrice } from "./data";
import { Arrow, ChevronRight, Grapes } from "./Icons";

/* "Unsere Weine" mega-dropdown.
   The panel is viewport-fixed and centred so it reads as a sheet belonging to
   the header, not to the nav item — the trigger sits far left in the flex row,
   so anchoring to it would push the panel off-screen.

   Opens on hover (pointer-fine) with a short close delay plus an invisible
   bridge, and on focus/click for keyboard and touch. Motion is transform and
   opacity only, spring-driven; the header row never reflows. */

const byType = (t) => WINES.filter((w) => w.type === t);

const COLUMNS = [
  { title: "Rotweine", art: "rot", accent: "#6B0F1A", wines: byType("Rotwein") },
  { title: "Weißweine", art: "weiss", accent: "#C8B77A", wines: byType("Weißwein") },
  { title: "Roséweine", art: "rose", accent: "#c67f78", wines: byType("Roséwein") },
];

const OVERVIEW = [
  { label: "Alle Weine", href: "/weine", hint: "Die komplette Kollektion" },
  { label: "Bestseller", href: "/shop?sort=bestseller", hint: "Was am häufigsten im Glas landet" },
  { label: "Regionen Italiens", href: "/regionen", hint: "Herkunft und Terroir" },
];

const PANEL_SPRING = { type: "spring", stiffness: 300, damping: 30, mass: 0.55 };
const CLOSE_DELAY = 160;

export default function WineMenu({ active, scrolled = false }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const closeTimer = useRef(null);
  const wrapRef = useRef(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* Only the trigger may OPEN the menu. The overlay merely holds it open
     (cancel) and releases it (schedule) — if it could open too, the invisible
     exiting sheet would resurrect the menu on any stray mouse move. */
  const hoverProps = {
    onPointerEnter: (e) => {
      if (e.pointerType === "touch") return;
      cancelClose();
      setOpen(true);
    },
    onPointerLeave: (e) => {
      if (e.pointerType === "touch") return;
      scheduleClose();
    },
  };
  const holdProps = {
    onPointerEnter: (e) => {
      if (e.pointerType === "touch") return;
      cancelClose();
    },
    onPointerLeave: (e) => {
      if (e.pointerType === "touch") return;
      scheduleClose();
    },
  };

  const close = () => setOpen(false);

  return (
    <div
      ref={wrapRef}
      className="relative"
      {...hoverProps}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <Link
        href="/weine"
        aria-current={active ? "page" : undefined}
        aria-expanded={open}
        className={`group relative flex items-center gap-1.5 py-2 text-[12.5px] tracking-[0.08em] transition-colors duration-300 ${
          active || open ? "font-semibold text-bordeaux" : "text-charcoal/75 hover:text-bordeaux"
        }`}
      >
        Unsere Weine
        <ChevronRight
          aria-hidden="true"
          className={`h-3 w-3 transition-transform duration-400 ease-out-expo ${
            open ? "-rotate-90" : "rotate-90"
          }`}
        />
        {active ? (
          <motion.span
            layoutId="nav-underline"
            className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-champagne to-bordeaux"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        ) : (
          <span
            className={`absolute -bottom-0.5 left-0 right-0 h-[2px] origin-left rounded-full bg-champagne/70 transition-transform duration-400 ease-out-expo ${
              open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            }`}
          />
        )}
      </Link>

      <AnimatePresence>
        {/* viewport-centred sheet + hover bridge back up to the header */}
        {open && (
          <div
            {...holdProps}
            className={`fixed inset-x-0 top-0 z-40 flex h-screen justify-center px-4 ${
              scrolled ? "pt-[5.125rem]" : "pt-[5.375rem] lg:pt-[6.375rem]"
            }`}
            style={{ pointerEvents: "none" }}
          >
            {/* bridge — thin strip covering the gap between the nav row and
                the sheet so crossing it never schedules a close. Sits below
                the header so other nav links stay clickable. */}
            <span
              aria-hidden="true"
              onPointerEnter={cancelClose}
              style={{ pointerEvents: "auto" }}
              className={`absolute inset-x-0 h-[0.625rem] ${
                scrolled ? "top-[4.625rem]" : "top-[4.875rem] lg:top-[5.875rem]"
              }`}
            />
              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1, pointerEvents: "auto" }}
                exit={
                  reduced
                    ? { opacity: 0, pointerEvents: "none" }
                    : { opacity: 0, y: -10, scale: 0.985, pointerEvents: "none" }
                }
                transition={reduced ? { duration: 0.15 } : PANEL_SPRING}
                style={{ pointerEvents: "auto", willChange: "transform, opacity", transformOrigin: "top center" }}
                className="grain relative w-full max-w-[980px] self-start overflow-hidden rounded-card-lg border border-white/70 bg-cream shadow-[0_2px_8px_rgba(43,20,14,.08),0_24px_48px_-16px_rgba(43,20,14,.22),0_56px_120px_-32px_rgba(43,20,14,.3)] ring-1 ring-espresso/[0.06]"
              >
                {/* hairline of house colour along the top edge */}
                <span
                  aria-hidden="true"
                  className="block h-[3px] w-full bg-gradient-to-r from-bordeaux via-champagne to-bordeaux"
                />

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.86fr)_minmax(0,2fr)]">
                  {/* ---------- overview rail ---------- */}
                  <div className="relative border-b border-stone/50 bg-gradient-to-b from-ivory to-[#F1ECE1] p-7 md:border-b-0 md:border-r">
                    <div className="flex items-center gap-2">
                      <Grapes className="h-4 w-4 text-champagne" />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-bordeaux">
                        Die Kollektion
                      </p>
                    </div>

                    <ul className="mt-5 space-y-1">
                      {OVERVIEW.map((o) => (
                        <li key={o.label}>
                          <Link
                            href={o.href}
                            onClick={close}
                            className="group/o relative block rounded-2xl px-3 py-2.5 transition-colors duration-300 hover:bg-white"
                          >
                            <span className="flex items-center justify-between gap-3 text-[13.5px] font-semibold text-charcoal transition-colors duration-300 group-hover/o:text-bordeaux">
                              {o.label}
                              <Arrow className="h-3.5 w-3.5 shrink-0 -translate-x-1.5 text-bordeaux opacity-0 transition-all duration-400 ease-out-expo group-hover/o:translate-x-0 group-hover/o:opacity-100" />
                            </span>
                            <span className="mt-0.5 block text-[11.5px] leading-snug text-charcoal/50">
                              {o.hint}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/shop"
                      onClick={close}
                      className="group/s mt-6 flex items-center justify-between gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-bordeaux to-wine px-4 py-3.5 shadow-chip"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory">
                        Zum Shop
                      </span>
                      <Arrow className="h-4 w-4 text-ivory transition-transform duration-500 ease-out-expo group-hover/s:translate-x-1" />
                    </Link>
                  </div>

                  {/* ---------- type columns ---------- */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-7 p-7 sm:grid-cols-3">
                    {COLUMNS.map((c) => (
                      <div key={c.title} className="min-w-0">
                        <Link
                          href={`/weine?art=${c.art}#kollektion`}
                          onClick={close}
                          className="group/c flex items-center gap-2 border-b border-stone/60 pb-2.5"
                        >
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 shrink-0 rounded-full ring-2 ring-white transition-transform duration-400 ease-out-expo group-hover/c:scale-125"
                            style={{ backgroundColor: c.accent }}
                          />
                          <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-charcoal transition-colors duration-300 group-hover/c:text-bordeaux">
                            {c.title}
                          </span>
                          <span className="ml-auto font-playfair text-[13px] tabular-nums text-charcoal/35">
                            {String(c.wines.length).padStart(2, "0")}
                          </span>
                        </Link>

                        <ul className="mt-2.5 space-y-0.5">
                          {c.wines.map((w) => (
                            <li key={w.slug}>
                              <Link
                                href={wineHref(w)}
                                onClick={close}
                                className="group/w flex items-baseline justify-between gap-3 rounded-xl px-2.5 py-2 transition-colors duration-300 hover:bg-white"
                              >
                                <span className="min-w-0 text-[12.5px] leading-snug text-charcoal/75 transition-colors duration-300 group-hover/w:text-bordeaux">
                                  {w.name}
                                </span>
                                <span className="shrink-0 text-[11px] tabular-nums text-charcoal/35 transition-colors duration-300 group-hover/w:text-champagne">
                                  {fmtPrice(w.price)}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ---------- footer strip ---------- */}
                <div className="flex items-center justify-between gap-4 border-t border-stone/50 bg-ivory/70 px-7 py-3.5">
                  <p className="font-playfair text-[13.5px] italic text-charcoal/55">
                    Handverlesen von kleinen italienischen Weingütern.
                  </p>
                  <Link
                    href="/weine"
                    onClick={close}
                    className="group/a flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-bordeaux"
                  >
                    <span className="relative">
                      Alle {WINES.length} Weine ansehen
                      <span className="absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-bordeaux transition-transform duration-400 ease-out-expo group-hover/a:scale-x-100" />
                    </span>
                    <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover/a:translate-x-1" />
                  </Link>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
