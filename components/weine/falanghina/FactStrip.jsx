"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, useMotionTemplate } from "motion/react";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";
import { Eyebrow, GoldRule } from "@/components/Deco";
import { WINE_ICON } from "./WineIcons";

/* Schnellfakten unter dem Hero — schmales "Auf einen Blick"-Band:
   horizontale Fakten (Icon links, Label + Wert daneben) in einer flachen
   gerahmten Leiste mit Haarlinien-Trennern und physikbasiertem Hover
   (Spotlight + sanfter 3D-Tilt).
   Akzentfarbe pro Wein via wine.accent = { base, deep, light } überschreibbar. */

/* Markenneutraler Fallback (Champagner/Bordeaux) für Weine ohne eigenen Akzent */
const ACCENT_FALLBACK = { base: "#C8B77A", deep: "#8A2B2F", light: "#E3D9B8" };
const SPRING = { stiffness: 160, damping: 22, mass: 0.6 };

function FactTile({ fact, index, accent }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const Icon = WINE_ICON[fact.icon];

  /* Cursor-Tracking → federgedämpfter Tilt + wanderndes Spotlight */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const spotX = useSpring(mx, { stiffness: 220, damping: 30 });
  const spotY = useSpring(my, { stiffness: 220, damping: 30 });
  const spotlight = useMotionTemplate`radial-gradient(180px circle at calc(${spotX} * 100%) calc(${spotY} * 100%), ${accent.light}55, transparent 70%)`;

  const onMove = (e) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px);
    my.set(py);
    rotateX.set((0.5 - py) * 4);
    rotateY.set((px - 0.5) * 4);
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      style={
        reduced
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d", willChange: "transform" }
      }
      className="group relative h-full rounded-[1.25rem] px-5 py-4 lg:px-6 lg:py-5"
    >
      {/* Hover-Wash + Spotlight — reine Opacity/Transform, kein Layout-Shift */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.25rem] opacity-0 transition-opacity duration-400 ease-out-expo group-hover:opacity-100"
        style={{ background: `linear-gradient(160deg, ${accent.light}2E, transparent 65%)` }}
      />
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[1.25rem] opacity-0 transition-opacity duration-400 ease-out-expo group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      )}

      <div className="relative flex h-full items-center gap-0 sm:gap-4" style={{ transform: "translateZ(24px)" }}>
        <span
          className="ring-hairline hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white/60 shadow-chip transition-transform duration-400 ease-out-expo group-hover:-translate-y-0.5 group-hover:scale-105 sm:inline-flex lg:h-11 lg:w-11"
          style={{ borderColor: `${accent.base}40`, color: accent.deep }}
        >
          {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
        </span>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal/45">
            {fact.label}
          </p>
          <p className="mt-1 font-playfair text-[1.02rem] leading-snug text-charcoal lg:text-[1.1rem]">
            {fact.value}
          </p>
          {/* Unterstrich zeichnet sich beim Hover — feste Höhe, nur scaleX */}
          <span
            className="mt-2 block h-px w-full origin-left scale-x-0 transition-transform duration-400 ease-out-expo group-hover:scale-x-100"
            style={{ background: `linear-gradient(90deg, ${accent.base}, transparent)` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function FactStrip({ wine }) {
  const accent = wine.accent ?? ACCENT_FALLBACK;

  return (
    <section id="ueberblick" className="scroll-mt-36">
      <div className="mx-auto max-w-content px-6 py-12 lg:px-10 lg:py-16">
        <Reveal className="mb-8 flex items-end justify-between gap-6 lg:mb-10">
          <div>
            <Eyebrow>Auf einen Blick</Eyebrow>
            <h2 className="mt-3 font-playfair text-[clamp(1.6rem,3vw,2.3rem)] leading-tight text-charcoal">
              Das Wichtigste {wine.shortNameGen ?? "dieses Weins"} im Überblick
            </h2>
          </div>
          <GoldRule className="mb-2 hidden w-40 lg:block" />
        </Reveal>

        <div>
          <Stagger
            className="ring-hairline relative grid grid-cols-1 overflow-hidden rounded-card-lg border border-stone/60 bg-gradient-to-br from-cream via-ivory to-cream shadow-luxe sm:grid-cols-2 lg:grid-cols-4"
            gap={0.1}
          >
            {/* zarte Akzent-Aura im Panelhintergrund */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full blur-3xl"
              style={{ background: `${accent.light}4D` }}
            />
            {wine.facts.map((f, i) => (
              <StaggerItem
                key={f.label}
                y={20}
                className={[
                  "relative",
                  i > 0 ? "border-t border-stone/50 sm:border-t-0" : "",
                  i % 2 === 1 ? "sm:border-l sm:border-stone/50" : "",
                  i >= 2 ? "sm:border-t sm:border-stone/50 lg:border-t-0" : "",
                  i > 0 ? "lg:border-l lg:border-stone/50" : "",
                ].join(" ")}
              >
                <FactTile fact={f} index={i} accent={accent} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <GoldRule className="mx-auto mt-12 max-w-3xl" />
      </div>
    </section>
  );
}
