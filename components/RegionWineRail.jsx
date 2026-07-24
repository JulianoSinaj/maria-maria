"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import WineCard from "@/components/WineCard";
import { ChevronRight } from "@/components/Icons";

/* Region wine rail — full-width, snap-scrolling strip of mini wine cards.
   Card widths are responsive: a fixed peek-width on mobile (so the next card
   hints at more content), then 2 / 3 / 4 cards per view as the viewport grows.
   Paging arrows appear only when the track actually overflows and advance by
   one full visible page. */

export default function RegionWineRail({ wines, label = "Unsere Weine aus dieser Region" }) {
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflowing(max > 4);
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync, wines]);

  const page = useCallback(
    (dir) => {
      const el = trackRef.current;
      if (!el) return;
      el.scrollBy({ left: dir * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced]
  );

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/50">
          {label}
        </p>
        {overflowing && (
          <div className="flex shrink-0 items-center gap-2">
            <RailArrow dir="prev" disabled={atStart} onClick={() => page(-1)} />
            <RailArrow dir="next" disabled={atEnd} onClick={() => page(1)} />
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        onScroll={sync}
        data-lenis-prevent-horizontal
        className="no-scrollbar -mx-6 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 pt-1 lg:mx-0 lg:px-0"
        style={{ scrollBehavior: reduced ? "auto" : "smooth" }}
      >
        {wines.map((w, i) => (
          <motion.div
            key={w.name}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 240, damping: 26, delay: i * 0.06 }}
            className="w-[228px] shrink-0 snap-start sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-32px)/3)] xl:w-[calc((100%-48px)/4)]"
          >
            <WineCard wine={w} variant="mini" className="h-full w-full" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RailArrow({ dir, disabled, onClick }) {
  const isPrev = dir === "prev";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Vorherige Weine" : "Weitere Weine"}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      className={`grid h-9 w-9 place-items-center rounded-full border border-stone/60 bg-cream text-charcoal transition-[opacity,background-color,border-color,box-shadow] duration-300 ${
        disabled
          ? "cursor-not-allowed opacity-35"
          : "opacity-100 hover:border-champagne/70 hover:bg-white hover:shadow-lift"
      }`}
    >
      <ChevronRight className={`h-4 w-4 ${isPrev ? "rotate-180" : ""}`} />
    </motion.button>
  );
}
