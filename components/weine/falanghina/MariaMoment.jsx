"use client";
import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useMotionTemplate,
} from "motion/react";
import { Eyebrow, GoldRule } from "@/components/Deco";
import { Aura } from "@/components/Atmosphere";
import { Arrow } from "@/components/Icons";
import { WINE_ICON } from "./WineIcons";

/* „Servieren & Genießen" + „Der Maria-Moment" — das Genuss-Kapitel jeder
   Weinseite: links das Ritual (Temperatur, Trinkfenster, Karaffe), rechts der
   emotionale Maria-Moment mit magnetischem CTA; darunter die Essenz-Karten
   (Geschmack / Herkunft / Rebsorte) und die Marken-Leiste. Rein
   wine.moment-getrieben — fehlt der Block, rendert die Sektion nicht. */

const ACCENT_FALLBACK = { base: "#C8B77A", deep: "#8A2B2F", light: "#E3D9B8" };
const SPRING = { type: "spring", stiffness: 90, damping: 19, mass: 0.9 };
const EASE = [0.16, 1, 0.3, 1];

/* Marken-Versprechen — bewusst für alle Weine identisch */
const TRUST = [
  { icon: "grapes", title: "Ausgewählte Weine", text: "mit Charakter" },
  { icon: "vineleaf", title: "Handverlesen", text: "von Familienweingütern" },
  { icon: "heart", title: "Für bewusste", text: "Genussmomente" },
];

/* Seiteneinflug — Karten kommen federgedämpft von links/rechts/unten */
function SlideIn({ children, x = 0, y = 0, delay = 0, className = "" }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{
        ...SPRING,
        delay,
        opacity: { duration: 0.6, delay, ease: EASE },
        filter: { duration: 0.65, delay, ease: EASE },
      }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

/* Magnetischer CTA — folgt dem Cursor innerhalb der Button-Grenzen */
function MagneticCta({ href, children, accent }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.34);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={reduced ? undefined : { x, y, willChange: "transform" }}
      className="inline-flex"
    >
      <motion.div whileTap={reduced ? undefined : { scale: 0.96 }} className="inline-flex">
        <Link
          href={href}
          className="group/cta relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-ivory/25 px-7 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors duration-400 ease-out-expo hover:text-espresso"
        >
          {/* Füllung wächst als Kreis aus der Mitte — reine Transform-Skalierung */}
          <span
            aria-hidden="true"
            className="absolute inset-0 scale-0 rounded-full transition-transform duration-400 ease-out-expo group-hover/cta:scale-105"
            style={{ background: `linear-gradient(120deg, ${accent.light}, ${accent.base})`, willChange: "transform" }}
          />
          <span className="relative">{children}</span>
          <Arrow className="relative h-4 w-4 transition-transform duration-400 ease-out-expo group-hover/cta:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* Ritualzeile in der Servieren-Karte */
function ServeRow({ item, isLast, accent }) {
  const Icon = WINE_ICON[item.icon];
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, x: -34, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          transition: { ...SPRING, opacity: { duration: 0.5 }, filter: { duration: 0.55 } },
        },
      }}
      className={`group/row flex items-center gap-5 py-5 ${isLast ? "" : "border-b border-espresso/[0.08]"}`}
    >
      <span
        className="ring-hairline inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/70 shadow-chip transition-transform duration-400 ease-out-expo group-hover/row:-translate-y-1 group-hover/row:scale-105"
        style={{ color: accent.deep, borderColor: `${accent.base}40` }}
      >
        {Icon && <Icon className="h-7 w-7" aria-hidden="true" />}
      </span>
      <span>
        <span className="block text-[10.5px] font-semibold uppercase tracking-[0.22em] text-charcoal/45">
          {item.title}
        </span>
        <span className="mt-1 block font-playfair text-[1.05rem] leading-snug text-charcoal lg:text-[1.15rem]">
          {item.text}
        </span>
      </span>
    </motion.li>
  );
}

/* Essenz-Karte (Geschmack / Herkunft / Rebsorte) — 3D-Tilt + Spotlight */
function EssenceCard({ item, accent }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const Icon = WINE_ICON[item.icon];
  const tone = item.tone || accent.base;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(0, { stiffness: 160, damping: 22, mass: 0.6 });
  const rotateY = useSpring(0, { stiffness: 160, damping: 22, mass: 0.6 });
  const spotX = useSpring(mx, { stiffness: 220, damping: 30 });
  const spotY = useSpring(my, { stiffness: 220, damping: 30 });
  const spotlight = useMotionTemplate`radial-gradient(220px circle at calc(${spotX} * 100%) calc(${spotY} * 100%), ${tone}30, transparent 70%)`;

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px);
    my.set(py);
    rotateX.set((0.5 - py) * 7);
    rotateY.set((px - 0.5) * 7);
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      style={
        reduced
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d", willChange: "transform" }
      }
      className="group relative h-full overflow-hidden rounded-card border border-stone/60 bg-gradient-to-br from-cream via-ivory to-cream p-7 shadow-luxe lg:p-9"
    >
      {/* Farb-Wash + wanderndes Spotlight — nur Opacity, kein Layout-Shift */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-400 ease-out-expo group-hover:opacity-100"
        style={{ background: `linear-gradient(155deg, ${tone}24, transparent 62%)` }}
      />
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-400 ease-out-expo group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      )}

      <div className="relative" style={{ transform: "translateZ(26px)" }}>
        <span
          className="ring-hairline inline-flex h-14 w-14 items-center justify-center rounded-full shadow-chip transition-transform duration-400 ease-out-expo group-hover:-translate-y-1 group-hover:scale-105"
          style={{ background: `${tone}1F`, color: item.toneDeep || accent.deep }}
        >
          {Icon && <Icon className="h-7 w-7" aria-hidden="true" />}
        </span>

        <p
          className="mt-6 text-[11px] font-semibold uppercase tracking-[0.26em]"
          style={{ color: item.toneDeep || accent.deep }}
        >
          {item.kicker}
        </p>
        {item.title && (
          <h3 className="mt-2 font-playfair text-[1.35rem] leading-snug text-charcoal">{item.title}</h3>
        )}
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-charcoal/70">{item.text}</p>

        <span
          className="mt-6 block h-px w-full origin-left scale-x-0 transition-transform duration-400 ease-out-expo group-hover:scale-x-100"
          style={{ background: `linear-gradient(90deg, ${tone}, transparent)` }}
        />
      </div>
    </motion.article>
  );
}

export default function MariaMoment({ wine }) {
  const moment = wine.moment;
  if (!moment) return null;
  const accent = moment.accent ?? wine.accent ?? ACCENT_FALLBACK;

  return (
    <section id="geniessen" className="relative scroll-mt-36 overflow-hidden py-16 lg:py-24">
      {/* Ambient-Farbe hinter der ganzen Sektion */}
      <Aura tint="gold" drift={1} className="-left-56 top-0 h-[36rem] w-[36rem]" />
      <Aura tint="blush" drift={2} className="-right-48 bottom-0 h-[32rem] w-[32rem] opacity-70" />

      <div className="relative mx-auto max-w-content px-6 lg:px-10">
        <SlideIn y={26} className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
          <div>
            <Eyebrow>Servieren &amp; Genießen</Eyebrow>
            <h2 className="mt-3 text-balance font-playfair text-[clamp(1.7rem,3.2vw,2.5rem)] leading-[1.1] text-charcoal">
              {moment.title ?? `So schmeckt ${wine.shortNameNom ?? "dieser Wein"} am besten`}
            </h2>
          </div>
          <GoldRule className="mb-2 hidden w-40 lg:block" />
        </SlideIn>

        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Ritual-Karte — fliegt von links ein, Zeilen folgen gestaffelt */}
          <SlideIn x={-64} className="h-full">
            <div className="glass ring-hairline relative h-full overflow-hidden rounded-card-lg p-8 shadow-glass lg:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
                style={{ background: `${accent.light}55` }}
              />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: accent.deep }}>
                  Das Ritual
                </p>
                <h3 className="mt-2 font-playfair text-[1.5rem] leading-snug text-charcoal lg:text-[1.7rem]">
                  {moment.serve.title}
                </h3>

                <motion.ul
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3, margin: "0px 0px -6% 0px" }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
                  className="mt-6"
                >
                  {moment.serve.items.map((item, i) => (
                    <ServeRow
                      key={item.title}
                      item={item}
                      isLast={i === moment.serve.items.length - 1}
                      accent={accent}
                    />
                  ))}
                </motion.ul>
              </div>
            </div>
          </SlideIn>

          {/* Maria-Moment — fliegt von rechts ein, dunkle Bühne mit Gold-Aura */}
          <SlideIn x={64} delay={0.08} className="h-full">
            <div className="grain relative flex h-full flex-col justify-between overflow-hidden rounded-card-lg bg-espresso p-8 shadow-lift lg:p-12">
              <Aura tint="gold" className="right-[-20%] top-[-24%] h-96 w-96 opacity-30" />
              <Aura tint="wine" drift={2} className="bottom-[-30%] left-[-15%] h-80 w-80 opacity-40" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-champagne">
                  Der Maria-Moment
                </p>
                <p className="mt-5 font-playfair text-[clamp(1.4rem,2.4vw,1.9rem)] italic leading-[1.35] text-ivory">
                  {moment.maria.text}
                </p>
              </div>
              <div className="relative mt-10">
                <MagneticCta href={moment.maria.link?.href ?? "/shop"} accent={accent}>
                  {moment.maria.link?.label ?? "Mehr entdecken"}
                </MagneticCta>
              </div>
            </div>
          </SlideIn>
        </div>

        {/* Essenz-Trio: Geschmack / Herkunft / Rebsorte — Einflug von den Seiten */}
        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-3 lg:gap-8">
          {moment.essence.map((item, i) => (
            <SlideIn
              key={item.kicker}
              x={i === 0 ? -56 : i === 2 ? 56 : 0}
              y={i === 1 ? 56 : 0}
              delay={i * 0.09}
              className="h-full"
            >
              <EssenceCard item={item} accent={accent} />
            </SlideIn>
          ))}
        </div>

        {/* Marken-Leiste — das stille Versprechen unter jedem Wein */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="mt-14 lg:mt-20"
        >
          <GoldRule className="mx-auto max-w-3xl" />
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {TRUST.map((badge) => {
              const Icon = WINE_ICON[badge.icon];
              return (
                <motion.div
                  key={badge.title}
                  variants={{
                    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { ...SPRING, opacity: { duration: 0.5 }, filter: { duration: 0.55 } },
                    },
                  }}
                  className="flex items-center justify-center gap-4 text-center sm:text-left"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-champagne/50 text-wine">
                    {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal">
                      {badge.title}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] text-charcoal/60">{badge.text}</span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
