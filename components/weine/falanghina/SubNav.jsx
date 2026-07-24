"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import { byName, fmtPrice } from "@/components/data";

/* Apple-Produktseiten-Subnav: eine schlanke Glas-Pille, die nach dem Hero
   andockt und für den Rest der Seite haften bleibt. Scrollspy markiert das
   aktive Kapitel; rechts Preis und Mini-CTA. Sitzt unter dem fixierten
   Header (Pill-Zustand: h-16) — daher der Sticky-Offset von 84px. */

export default function SubNav({ wine }) {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(null);
  const catalog = byName(wine.catalogName);
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
    <div className="sticky top-[calc(84px+env(safe-area-inset-top))] z-30 px-4">
      <motion.nav
        aria-label="Abschnitte dieser Seite"
        initial={reduced ? false : { opacity: 0, y: -10 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="glass ring-hairline mx-auto flex h-12 w-full max-w-fit items-center gap-1 rounded-full px-2 shadow-glass"
      >
        <span className="hidden max-w-[180px] truncate pl-3 pr-2 text-[13px] font-semibold text-charcoal md:block">
          {wine.heroTitle.join(" ")}
        </span>
        <span className="hidden h-5 w-px bg-stone/80 md:block" aria-hidden="true" />

        {/* the fade hints that more chapters wait beyond the edge (phones) */}
        <ul className="no-scrollbar flex items-center gap-0.5 overflow-x-auto px-1 [mask-image:linear-gradient(to_right,black,black_calc(100%-28px),transparent)] md:[mask-image:none]">
          {wine.subnav.map((link) => {
            const isActive = activeId === link.href.slice(1);
            return (
              <li key={link.href} className="shrink-0">
                <a
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`inline-flex h-9 items-center rounded-full px-3.5 text-[13px] transition-colors duration-300 ${
                    isActive
                      ? "bg-charcoal/[0.07] font-medium text-charcoal"
                      : "text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {catalog && (
          <>
            <span className="hidden h-5 w-px bg-stone/80 lg:block" aria-hidden="true" />
            <span className="hidden whitespace-nowrap px-2 text-[13px] font-semibold tabular-nums text-bordeaux lg:block">
              {fmtPrice(catalog.price)}
            </span>
          </>
        )}
        <span className="hidden pl-1 sm:block">
          <Button href="/shop" size="sm" iconType="none">
            Entdecken
          </Button>
        </span>
      </motion.nav>
    </div>
  );
}
