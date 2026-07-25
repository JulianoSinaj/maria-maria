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
   The map drifts on a scroll-driven spring (parallax depth) and sits behind
   vertical panels; the panel under the cursor grows while its siblings dim.

   Motion contract — one clock for the whole swap, so nothing ever stacks:
     phase 1 (0 → OUT)      outgoing card + incoming title fade OUT
     phase 2 (OUT → OUT+IN) incoming card + outgoing title fade IN
   Background layers (bloom, dim, gradient) and the flex-grow of the panel
   cross-fade across the full OUT+IN window on the same cubic-bezier, so the
   map highlight and the foreground card land together.
   Cards stay mounted and are driven by `animate` (no AnimatePresence on the
   desktop stage) — enter/exit overlap was what produced the ghost text. */

const EASE = [0.4, 0, 0.2, 1]; // cubic-bezier(0.4, 0, 0.2, 1)
const OUT = 0.16; // s — outgoing content clears first
const IN = 0.26; // s — incoming content follows
const SWAP_MS = 420; // (OUT + IN) * 1000 — CSS-driven layers use the same window
const GROW = 2.4; // hovered panel weight vs. 1 for the rest

const FADE_OUT = { duration: OUT, ease: EASE };
const FADE_IN = { duration: IN, delay: OUT, ease: EASE };
const INSTANT = { duration: 0 };

function DetailCard({ region, compact = false }) {
  return (
    <div className={`rounded-card bg-ivory shadow-lift ring-1 ring-stone/60 ${compact ? "p-5" : "p-6"}`}>
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

  // Scroll-driven parallax for the map behind the desktop stage.
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });
  // raw progress → gentle vertical drift, smoothed through a physics spring.
  // Scale is held constant: an second, independently timed zoom loop only added
  // repaint churn behind the cards.
  const driftRaw = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const drift = useSpring(driftRaw, { stiffness: 120, damping: 30, mass: 0.6 });

  const mapLayer = (parallax = false) => (
    <>
      {/* the photographic Sud-Italia relief — GPU transformed, never a layout shift */}
      <motion.img
        src={mapSrc}
        alt="Karte Süditaliens mit den Weinregionen"
        style={
          parallax && !reduced
            ? { y: drift, scale: 1.12, willChange: "transform" }
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
                style={{
                  flexGrow: isActive ? GROW : 1,
                  transition: `flex-grow ${SWAP_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  willChange: "flex-grow",
                }}
                className={`group relative min-w-0 basis-0 outline-none ${
                  i > 0 ? "border-l border-ivory/25" : ""
                }`}
              >
                {/* map highlight — a warm bloom marks the region under focus.
                    Opacity only: the old 6s scale loop restarted on every switch
                    and flickered whenever two panels overlapped mid-swap. */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_18%,theme(colors.champagne/25),transparent_60%)] transition-opacity duration-[420ms] ease-standard ${
                    isActive ? "opacity-75" : "opacity-0"
                  }`}
                />

                {/* dim siblings while one panel holds the stage (no backdrop
                    filter — it recomposited the whole map on every swap) */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-espresso/55 transition-opacity duration-[420ms] ease-standard ${
                    dimmed ? "opacity-100" : "opacity-0"
                  }`}
                />
                {/* readability gradient behind the resting title */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-espresso/90 via-espresso/40 to-transparent transition-opacity duration-[420ms] ease-standard ${
                    isActive ? "opacity-30" : "opacity-100"
                  }`}
                />

                {/* resting state — region name near the bottom.
                    Clears out before the card arrives, returns after it leaves. */}
                <motion.div
                  initial={false}
                  animate={{ opacity: isActive ? 0 : 1, y: isActive ? -8 : 0 }}
                  transition={reduced ? INSTANT : isActive ? FADE_OUT : FADE_IN}
                  style={{ willChange: "transform, opacity" }}
                  className="pointer-events-none absolute inset-x-0 bottom-0 p-6"
                >
                  <p className="truncate text-[10px] uppercase tracking-[0.22em] text-champagne-light">{r.tag}</p>
                  <h3 className="mt-1 truncate font-playfair text-[24px] text-ivory lg:text-[27px]">{r.name}</h3>
                </motion.div>

                {/* focus state — detail card. Fixed width so the panel's
                    flex-grow never reflows the text mid-transition. */}
                <motion.div
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
                  transition={reduced ? INSTANT : isActive ? FADE_IN : FADE_OUT}
                  inert={isActive ? undefined : ""}
                  style={{ willChange: "transform, opacity", pointerEvents: isActive ? "auto" : "none" }}
                  className="absolute bottom-5 left-5 w-[17rem] lg:bottom-7 lg:left-7 lg:w-[19rem]"
                >
                  <DetailCard region={r} />
                </motion.div>
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
                        className={`absolute h-[1.5px] w-3.5 rounded-full bg-charcoal/80 transition-transform duration-[420ms] ease-standard ${
                          isOpen ? "rotate-0" : "rotate-90"
                        }`}
                      />
                    </span>
                  </span>
                </button>

                {/* one row is open at a time: the closing row and the opening
                    row share the same height curve, and the card only fades in
                    once the outgoing one has gone. */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: reduced
                          ? INSTANT
                          : { height: { duration: 0.34, ease: EASE }, opacity: FADE_IN },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: reduced
                          ? INSTANT
                          : { height: { duration: 0.34, ease: EASE }, opacity: FADE_OUT },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5">
                        <DetailCard region={r} compact />
                      </div>
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
