"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/* Das Kapitel-Menü der Geschichte — sechs nummerierte Stationen zwischen
   zwei Haarlinien, wie der Zeitungskopf des Magazins. Die Leiste haftet
   unter dem fixierten Header (gleicher Offset wie die SubNav der
   Wein-Landingpages) und begleitet die ganze Erzählung.

   Scrollspy nach dem Muster der SubNav: das Kapitel in Lesehöhe wird
   markiert, der Champagner-Unterstrich gleitet per layoutId federgedämpft
   von Station zu Station statt hart umzuspringen. Auf Telefonen läuft die
   Leiste seitlich durch, der Mask-Fade deutet die weiteren Kapitel an. */

/* `chapters` und `today` kommen schon mit dem Text der aktiven Sprache aus
   der Seite — dieselbe Zusammenführung, aus der auch die Kapitel selbst
   rendern. Damit können Anker und Beschriftung nicht auseinanderlaufen. */
export default function StoryChapterNav({ chapters = [], today, t = {} }) {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(null);
  const stops = [...chapters, ...(today ? [today] : [])].map((c) => ({
    id: c.id,
    label: c.label,
  }));
  const ids = stops.map((s) => s.id).join(",");

  useEffect(() => {
    const targets = ids
      .split(",")
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveId(e.target.id);
      },
      { rootMargin: "-38% 0px -52% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [ids]);

  return (
    /* md:hidden: die Leiste ist der Kapitel-Kompass der Telefone — der
       Desktop erzählt die Geschichte wie bisher ohne sie und bleibt
       pixelgleich unverändert. */
    <div className="sticky top-[calc(86px+env(safe-area-inset-top))] z-30 px-3 md:hidden lg:px-6">
      <motion.nav
        aria-label={t.ariaLabel}
        initial={reduced ? false : { opacity: 0, y: -10 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="glass mx-auto w-full max-w-[1060px] rounded-full px-4 shadow-glass sm:px-6"
      >
        <ul
          data-lenis-prevent-horizontal
          className="no-scrollbar flex h-14 snap-x items-center justify-start gap-1 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] sm:justify-center lg:[mask-image:none]"
        >
          {stops.map((stop, i) => {
            const isActive = activeId === stop.id;
            return (
              <li key={stop.id} className="flex shrink-0 snap-start items-center">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="mx-1.5 h-[3px] w-[3px] rounded-full bg-charcoal/20 sm:mx-2.5"
                  />
                )}
                <a
                  href={`#${stop.id}`}
                  aria-current={isActive ? "location" : undefined}
                  /* h-11: die Leiste existiert nur noch auf Telefonen —
                     Daumen brauchen 44px */
                  className={`group relative inline-flex h-11 items-center gap-2 rounded-full px-3 transition-colors duration-300 ${
                    isActive ? "text-bordeaux" : "text-charcoal/65 hover:text-bordeaux"
                  }`}
                >
                  {/* aktives Kapitel: eine Pille, die federnd mitwandert */}
                  {isActive && (
                    <motion.span
                      layoutId="story-chapter-pill"
                      aria-hidden="true"
                      className="absolute inset-0 -z-[1] rounded-full bg-gradient-to-r from-champagne/30 to-bordeaux/[0.09] ring-1 ring-inset ring-champagne/40"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-[0.18em]">
                    {stop.label}
                    {/* ruhender Zustand: Unterstrich zieht sich von links auf */}
                    {!isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 rounded-full bg-champagne/70 transition-transform duration-400 ease-out-expo group-hover:scale-x-100"
                      />
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </div>
  );
}
