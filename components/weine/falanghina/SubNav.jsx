"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import { useWines, useLocaleTools } from "@/lib/i18n/context";

/* Apple-Produktseiten-Subnav: eine schlanke Glas-Pille, die nach dem Hero
   andockt und für den Rest der Seite haften bleibt. Scrollspy markiert das
   aktive Kapitel; rechts Preis und Mini-CTA. Sitzt unter dem fixierten
   Header (Pill-Zustand: pt-3 + h-16 = 76px) — plus 10px Luft ergibt den
   Sticky-Offset von 86px.

   Die Leiste ist bewusst als Zwilling des Headers gebaut, nicht als eigene
   Komponente mit eigener Sprache: gleiche Glasfläche, gleiche Breite
   (max-w-[1060px]), gleiche Drei-Zonen-Ordnung — Identität links, Navigation
   mittig, Aktion rechts. Das aktive Kapitel trägt denselben Champagner-zu-
   Bordeaux-Verlauf wie der Header-Unterstrich und gleitet per layoutId
   federgedämpft von Punkt zu Punkt, statt hart umzuspringen. */

export default function SubNav({ wine }) {
  const { price: fmtPrice } = useLocaleTools();
  const wines = useWines();
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(null);
  const catalog = wines.find((w) => w.name === wine.catalogName);
  const ids = wine.subnav.map((l) => l.href.slice(1));

  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveId(e.target.id);
      },
      { rootMargin: "-38% 0px -52% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wine]);

  return (
    <div className="sticky top-[calc(86px+env(safe-area-inset-top))] z-30 px-3 lg:px-6">
      <motion.nav
        aria-label="Abschnitte dieser Seite"
        initial={reduced ? false : { opacity: 0, y: -10 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="glass mx-auto flex h-16 w-full max-w-[1060px] items-center gap-3 rounded-full px-4 shadow-glass sm:px-6"
      >
        {/* Identitätszone – spiegelt das Logo im Header */}
        <span className="hidden min-w-0 shrink items-baseline gap-2 md:flex lg:basis-[190px]">
          <span className="truncate text-[12.5px] font-semibold tracking-[0.01em] text-charcoal">
            {wine.heroTitle.join(" ")}
          </span>
        </span>

        {/* Navigationszone – mittig wie die Hauptnavigation im Header.
            Der Fade deutet auf Telefonen an, dass hinter der Kante weitere
            Kapitel warten. */}
        <ul className="no-scrollbar flex flex-1 items-center justify-center gap-1 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] md:[mask-image:none]">
          {wine.subnav.map((link) => {
            const isActive = activeId === link.href.slice(1);
            return (
              <li key={link.href} className="shrink-0">
                <a
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  /* h-11 unterhalb md: 44px Trefferfläche für Daumen — die
                     36px-Pille bleibt dem Desktop-Cursor vorbehalten */
                  className={`group relative inline-flex h-11 items-center rounded-full px-3.5 text-[12.5px] tracking-[0.02em] transition-colors duration-300 md:h-9 ${
                    isActive ? "font-semibold text-bordeaux" : "text-charcoal/70 hover:text-bordeaux"
                  }`}
                >
                  {/* aktives Kapitel: eine Pille, die federnd mitwandert */}
                  {isActive && (
                    <motion.span
                      layoutId="subnav-pill"
                      aria-hidden="true"
                      className="absolute inset-0 -z-[1] rounded-full bg-gradient-to-r from-champagne/30 to-bordeaux/[0.09] ring-1 ring-inset ring-champagne/40"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative">
                    {link.label}
                    {/* ruhender Zustand: Unterstrich zieht sich von links auf –
                        dieselbe Geste wie in der Hauptnavigation */}
                    {!isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] origin-left scale-x-0 rounded-full bg-champagne/70 transition-transform duration-400 ease-out-expo group-hover:scale-x-100"
                      />
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Aktionszone – spiegelt „Zum Shop" im Header: gleiche Größe,
            gleiche Kante. basis == Identitätszone, damit die Kapitel optisch
            mittig sitzen und nicht nach links kippen. */}
        <div className="flex shrink-0 items-center justify-end gap-3 lg:basis-[190px]">
          {catalog && (
            <span className="hidden whitespace-nowrap text-[12.5px] font-semibold tabular-nums text-bordeaux lg:block">
              {fmtPrice(catalog.price)}
            </span>
          )}
          <span className="hidden sm:block">
            <Button href="/shop" size="sm">
              Entdecken
            </Button>
          </span>
        </div>
      </motion.nav>
    </div>
  );
}
