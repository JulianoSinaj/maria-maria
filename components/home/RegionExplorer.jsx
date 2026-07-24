"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Button from "@/components/ui/Button";
import ItalyMap from "@/components/ItalyMap";

/* Region explorer — one continuous Süditalien map as the stage.
   The map itself is the hero: a photographic parchment relief of Sud Italia
   that drifts on a scroll-driven spring (parallax depth) and slowly
   Ken-Burns-zooms behind whichever panel holds focus.
   Desktop: vertical panels over the map, separated by hairline dividers.
   Hovering a panel lets it breathe wider (flex-grow) while a white detail
   card springs up in 3D; siblings contract, dim and desaturate.
   Mobile: the same map behind stacked rows; tapping a row expands it
   vertically into the detail card (height-auto spring).
   All motion is GPU transform/opacity — panel widths are the only
   intentional layout motion. */

const SPRING = { type: "spring", stiffness: 240, damping: 26, mass: 0.9 };
const GROW = 2.4; // hovered panel weight vs. 1 for the rest

function DetailCard({ region, compact = false }) {
  return (
    <div className={`rounded-card bg-ivory/95 shadow-lift ring-1 ring-stone/60 backdrop-blur-sm ${compact ? "p-5" : "p-6"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-bordeaux">{region.tag}</p>
          <h3 className="mt-1 font-playfair text-[clamp(20px,2vw,26px)] text-charcoal">{region.name}</h3>
        </div>
        <span className="shrink-0 rounded-2xl bg-gradient-to-br from-espresso to-charcoal p-2">
          <ItalyMap region={region.region} ghost className="w-9" />
        </span>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">{region.long || region.desc}</p>
      {region.grapes?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {region.grapes.map((g) => (
            <span
              key={g}
              className="rounded-full border border-stone/70 bg-cream px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-charcoal/60"
            >
              {g}
            </span>
          ))}
        </div>
      )}
      <div className="mt-5">
        <Button href={`/regionen#${region.region}`} size="sm" magnetic={false}>
          Mehr entdecken
        </Button>
      </div>
    </div>
  );
}

export default function RegionExplorer({ regions, mapSrc = "/img/map-sud-italia.jpg" }) {
  const [active, setActive] = useState(null); // desktop hovered/focused panel
  const [open, setOpen] = useState(null); // mobile expanded row
  const reduced = useReducedMotion();
  const spring = reduced ? { duration: 0 } : SPRING;

  // Scroll-driven parallax for the map behind the desktop stage.
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });
  // raw progress → gentle vertical drift, smoothed through a physics spring
  const driftRaw = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.06, 1.12]);
  const drift = useSpring(driftRaw, { stiffness: 120, damping: 30, mass: 0.6 });
  const scale = useSpring(scaleRaw, { stiffness: 120, damping: 30, mass: 0.6 });

  const mapLayer = (parallax = false) => (
    <>
      {/* the photographic Sud-Italia relief — GPU transformed, never a layout shift */}
      <motion.img
        src={mapSrc}
        alt="Karte Süditaliens mit den Weinregionen"
        style={
          parallax && !reduced
            ? { y: drift, scale, willChange: "transform" }
            : { scale: 1.04 }
        }
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* readability wash — keeps ivory titles crisp over the bright parchment */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/15 to-espresso/35" />
    </>
  );

  return (
    <>
      {/* ============ DESKTOP — expanding vertical panels ============ */}
      <div
        ref={stageRef}
        className="relative hidden overflow-hidden rounded-card-lg bg-espresso shadow-luxe md:block"
        style={{ perspective: 1400 }}
      >
        {mapLayer(true)}
        <div className="relative flex h-[540px] lg:h-[600px]" onMouseLeave={() => setActive(null)}>
          {regions.map((r, i) => {
            const isActive = active === i;
            const dimmed = active !== null && !isActive;
            return (
              <div
                key={r.region}
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{ flexGrow: isActive ? GROW : 1, willChange: "flex-grow" }}
                className={`group relative min-w-0 basis-0 outline-none transition-[flex-grow] duration-[600ms] ease-out-expo ${
                  i > 0 ? "border-l border-ivory/25" : ""
                }`}
              >
                {/* Ken-Burns light bloom — a warm sheen breathes across the active slice */}
                <motion.div
                  aria-hidden="true"
                  initial={false}
                  animate={
                    reduced
                      ? { opacity: isActive ? 0.6 : 0 }
                      : {
                          opacity: isActive ? 0.75 : 0,
                          scale: isActive ? 1.25 : 1,
                        }
                  }
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { opacity: { duration: 0.5 }, scale: { duration: 6, ease: "linear" } }
                  }
                  style={{ willChange: "transform, opacity" }}
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_18%,theme(colors.champagne/25),transparent_60%)]"
                />

                {/* dim + desaturate siblings while one panel holds the stage */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-espresso/55 backdrop-saturate-[.55] transition-opacity duration-[600ms] ease-out-expo ${
                    dimmed ? "opacity-100" : "opacity-0"
                  }`}
                />
                {/* readability gradient behind the resting title */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-espresso/90 via-espresso/40 to-transparent transition-opacity duration-500 ${
                    isActive ? "opacity-30" : "opacity-100"
                  }`}
                />

                {/* resting state — region name near the bottom */}
                <div
                  className={`absolute inset-x-0 bottom-0 p-6 transition-[opacity,transform] duration-[400ms] ease-out-expo ${
                    isActive ? "-translate-y-3 opacity-0" : "translate-y-0 opacity-100"
                  }`}
                >
                  <p className="truncate text-[10px] uppercase tracking-[0.22em] text-champagne-light">{r.tag}</p>
                  <h3 className="mt-1 truncate font-playfair text-[24px] text-ivory lg:text-[27px]">{r.name}</h3>
                </div>

                {/* hover state — white detail card lifts up in 3D */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 34, scale: 0.94, rotateX: -12 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                      exit={{ opacity: 0, y: 18, scale: 0.97, rotateX: -6, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } }}
                      transition={spring}
                      style={{ willChange: "transform", transformPerspective: 1000 }}
                      className="absolute inset-x-5 bottom-5 lg:inset-x-7 lg:bottom-7"
                    >
                      <DetailCard region={r} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ MOBILE — stacked rows, tap to expand ============ */}
      <div className="relative overflow-hidden rounded-card-lg bg-espresso shadow-luxe md:hidden">
        {mapLayer(false)}
        <div className="relative">
          {regions.map((r, i) => {
            const isOpen = open === i;
            return (
              <div key={r.region} className={i > 0 ? "border-t border-ivory/20" : ""}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="relative block w-full text-left"
                >
                  {/* readability gradient behind the row title */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/35 to-transparent"
                  />
                  <span className="relative flex items-end justify-between gap-4 px-5 pb-4 pt-12">
                    <span className="min-w-0">
                      <span className="block truncate text-[9.5px] uppercase tracking-[0.22em] text-champagne-light">
                        {r.tag}
                      </span>
                      <span className="mt-0.5 block truncate font-playfair text-[22px] text-ivory">{r.name}</span>
                    </span>
                    {/* plus → minus toggle mark */}
                    <span
                      aria-hidden="true"
                      className="glass relative mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-full"
                    >
                      <span className="absolute h-[1.5px] w-3.5 rounded-full bg-charcoal/80" />
                      <span
                        className={`absolute h-[1.5px] w-3.5 rounded-full bg-charcoal/80 transition-transform duration-400 ease-out-expo ${
                          isOpen ? "rotate-0" : "rotate-90"
                        }`}
                      />
                    </span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={reduced ? { duration: 0 } : { ...SPRING, opacity: { duration: 0.3 } }}
                      className="relative overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: 18, scale: 0.97 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 12, scale: 0.98 }}
                        transition={spring}
                        className="px-4 pb-5"
                      >
                        <DetailCard region={r} compact />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
