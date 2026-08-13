"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { localePath, pathWithoutLocale } from "@/lib/i18n/routing";
import { useLocale, useCommon } from "@/lib/i18n/context";
import { ChevronRight } from "@/components/Icons";

/* Sprachumschalter.

   Zwei Auftritte, eine Logik:
   - "menu"   — Glas-Pille mit Aufklapp-Panel für die Desktop-Kopfzeile
   - "inline" — flache Reihe für das mobile Menü und den Footer, wo ein
                zweites Overlay im Overlay nur im Weg wäre

   Zielpfad ist immer DIESELBE Seite in der anderen Sprache: Wer auf
   /it/unsere-weine steht und Deutsch wählt, landet auf /unsere-weine — nicht
   auf der Startseite. Das ist der Unterschied zwischen einem Sprachwechsel
   und einem Rauswurf.

   Bewusst `next/link` statt LocaleLink: Die Ziele tragen ihr Präfix hier
   schon selbst, LocaleLink würde die aktive Sprache ein zweites Mal
   davorsetzen.

   Der Suchstring wird nicht mitgenommen. Ihn zu erhalten hieße
   useSearchParams(), und das zwingt jede Seite mit Kopfzeile aus dem
   statischen Rendering in dynamisches — ein hoher Preis dafür, dass ein
   gesetzter Filter einen Sprachwechsel überlebt. */

const LOCALE_COOKIE = "mm_locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/* Die Wahl SOFORT im Cookie festhalten, nicht erst über die Middleware der
   Zielseite: Die Middleware schreibt das Cookie nur noch, wenn keines da ist
   oder es zur besuchten Sprache passt — ein Deep Link in eine andere Sprache
   überschreibt die Wahl also nicht mehr. Damit ist dieser Klick die einzige
   Stelle, an der ein Mensch seine Sprache wirklich WÄHLT, und genau deshalb
   muss er hier verbindlich gespeichert werden. */
const rememberChoice = (locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
};

export default function LanguageSwitcher({ variant = "menu", className = "" }) {
  const locale = useLocale();
  const t = useCommon("language");
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const bare = pathWithoutLocale(pathname || "/");

  /* Schließen bei Escape und bei Klick nach außen — dieselbe Erwartung, die
     das Wein-Dropdown daneben bedient. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, [open]);

  /* ---------- flache Reihe (mobiles Menü, Footer) ---------- */
  if (variant === "inline") {
    return (
      <nav aria-label={t.ariaLabel} className={`flex flex-wrap items-center gap-2 ${className}`}>
        {LOCALES.map((l) => {
          const active = l === locale;
          return (
            <NextLink
              key={l}
              href={localePath(l, bare)}
              hrefLang={LOCALE_META[l].hreflang}
              onClick={() => rememberChoice(l)}
              aria-current={active ? "true" : undefined}
              className={`rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                active
                  ? "border-champagne bg-champagne/15 text-champagne"
                  : "border-ivory/20 text-ivory/70 hover:border-champagne hover:text-champagne"
              }`}
            >
              {LOCALE_META[l].short}
              <span className="sr-only"> — {LOCALE_META[l].native}</span>
            </NextLink>
          );
        })}
      </nav>
    );
  }

  /* ---------- Glas-Pille mit Panel (Desktop-Kopfzeile) ---------- */
  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.ariaLabel}
        aria-expanded={open}
        aria-haspopup="true"
        /* h-11 unterhalb md: dort steht die Pille neben dem Menü-Knopf und
           muss dessen Höhe und das 44px-Touch-Ziel teilen. Ab md bleibt sie
           bei h-9 — die Desktop-Kopfzeile ist unverändert. */
        className="flex h-11 items-center gap-1.5 rounded-full border border-charcoal/15 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/75 transition-colors duration-300 hover:border-champagne hover:text-bordeaux md:h-9"
      >
        {LOCALE_META[locale].short}
        <ChevronRight
          aria-hidden="true"
          className={`h-3 w-3 transition-transform duration-400 ease-out-expo ${open ? "-rotate-90" : "rotate-90"}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 300, damping: 30, mass: 0.55 }}
            style={{ transformOrigin: "top right", willChange: "transform, opacity" }}
            className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-card border border-white/70 bg-cream shadow-[0_2px_8px_rgba(43,20,14,.08),0_20px_40px_-16px_rgba(43,20,14,.22)] ring-1 ring-espresso/[0.06]"
          >
            <span
              aria-hidden="true"
              className="block h-[3px] w-full bg-gradient-to-r from-bordeaux via-champagne to-bordeaux"
            />
            <ul className="p-1.5" role="list">
              {LOCALES.map((l) => {
                const active = l === locale;
                return (
                  <li key={l}>
                    <NextLink
                      href={localePath(l, bare)}
                      hrefLang={LOCALE_META[l].hreflang}
                      onClick={() => {
                        rememberChoice(l);
                        setOpen(false);
                      }}
                      aria-current={active ? "true" : undefined}
                      className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-[13px] transition-colors duration-300 ${
                        active
                          ? "bg-white font-semibold text-bordeaux"
                          : "text-charcoal/75 hover:bg-white hover:text-bordeaux"
                      }`}
                    >
                      {LOCALE_META[l].native}
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/35">
                        {LOCALE_META[l].short}
                      </span>
                    </NextLink>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
