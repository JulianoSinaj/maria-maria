"use client";
import { useRef } from "react";
import WineCard from "./WineCard";
import Magnetic from "./motion/Magnetic";
import { Stagger, StaggerItem } from "./motion/Reveal";
import { ChevronRight } from "./Icons";

/* Horizontal snap rail of product cards with round paddle controls. */

export default function WineRail({ wines, className = "" }) {
  const railRef = useRef(null);

  const scroll = (dir) => {
    railRef.current?.scrollBy({ left: dir * 500, behavior: "smooth" });
  };

  const paddle = (dir, label) => (
    <Magnetic strength={0.25}>
      <button
        onClick={() => scroll(dir)}
        aria-label={label}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-stone bg-white/70 text-charcoal/70 shadow-luxe transition-all duration-300 hover:border-champagne hover:text-bordeaux active:scale-95"
      >
        <ChevronRight className={`h-4 w-4 ${dir < 0 ? "rotate-180" : ""}`} />
      </button>
    </Magnetic>
  );

  return (
    <div className={className}>
      <div
        ref={railRef}
        data-lenis-prevent
        className="no-scrollbar -mx-6 snap-x snap-mandatory overflow-x-auto scroll-px-6 px-6 lg:-mx-10 lg:scroll-px-10 lg:px-10"
      >
        <Stagger gap={0.06} className="flex w-max gap-5 pb-4 pt-2">
          {wines.map((w) => (
            <StaggerItem key={w.name} className="snap-start">
              <WineCard wine={w} variant="mini" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      <div className="mt-2 flex items-center justify-end gap-3">
        {paddle(-1, "Vorherige Weine")}
        {paddle(1, "Nächste Weine")}
      </div>
    </div>
  );
}
