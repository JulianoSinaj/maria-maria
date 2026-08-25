"use client";
import { useRef } from "react";
import Link from "@/components/i18n/LocaleLink";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { Arrow, Plate, Mountains, Grapes } from "@/components/Icons";
import { Reveal } from "@/components/motion/Reveal";

/* Beratungs-Trio als dunkle Editorial-Bühne.

   Die Karten lagen vorher als flache weiße Kacheln auf hellem Grund –
   gleiche Fläche, gleiches Gewicht, kein Blickanker. Jetzt trägt ein
   espresso-getöntes Band die kompakte Reihe: gleich hohe Karten, jede
   kippt federgedämpft zum Cursor. */

/* Struktur des Beratungs-Trios: Ikone und Ziel. Titel, Text und
   Link-Beschriftung stehen je Sprache in content/<sprache>/weine.js. */
const HELP_SHAPE = [
  { key: "pairing", icon: Plate, href: "/magazin" },
  { key: "regions", icon: Mountains, href: "/regionen" },
];

/* Eine Karte: echter 3D-Viewport, Rotation und magnetische Nachführung laufen
   über Springs, niemals über rohe Cursorkoordinaten. */
function HelpCard({ item }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const Icon = item.icon;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  /* Magnetische Nachführung: der Inhalt wandert ein paar Pixel Richtung
     Cursor, gedämpft genug, dass nichts zappelt */
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);

  const soft = { stiffness: 150, damping: 20, mass: 0.6 };
  const srx = useSpring(rx, soft);
  const sry = useSpring(ry, soft);
  const stx = useSpring(tx, { stiffness: 200, damping: 22, mass: 0.5 });
  const sty = useSpring(ty, { stiffness: 200, damping: 22, mass: 0.5 });

  const onMove = (e) => {
    if (reduced || e.pointerType === "touch") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * 7);
    rx.set(-(py - 0.5) * 2 * 7);
    tx.set((px - 0.5) * 12);
    ty.set((py - 0.5) * 8);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    tx.set(0);
    ty.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ perspective: 1100 }}
      className="group relative h-full"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      variants={{ rest: {}, hover: {}, tap: {} }}
    >
      <motion.article
        variants={
          reduced
            ? undefined
            : { rest: { y: 0, scale: 1 }, hover: { y: -10, scale: 1.015 }, tap: { scale: 0.96 } }
        }
        transition={{ type: "spring", stiffness: 210, damping: 20 }}
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative flex h-full flex-col overflow-hidden rounded-card border border-champagne/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-sm"
      >
        {/* Statische Lichtkante am oberen Rand – gibt der Fläche Wölbung,
            ohne dem Cursor zu folgen */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50 transition-opacity duration-500 group-hover:opacity-90"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(227,217,184,0.5), transparent)",
          }}
        />

        <motion.div
          style={reduced ? undefined : { x: stx, y: sty, transformStyle: "preserve-3d" }}
          className="relative flex h-full flex-col"
        >
          {/* Icon-Scheibe: Ring zieht sich auf Hover zusammen, Chip hebt in z */}
          <motion.span
            variants={reduced ? undefined : { rest: { z: 0 }, hover: { z: 38 } }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/25 bg-gradient-to-br from-champagne/20 to-transparent text-champagne-light"
          >
            <Icon className="h-5 w-5" />
            <motion.span
              aria-hidden="true"
              variants={reduced ? undefined : { rest: { scale: 1, opacity: 0 }, hover: { scale: 1.35, opacity: 1 } }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 rounded-full border border-champagne/25"
            />
          </motion.span>

          <motion.h3
            variants={reduced ? undefined : { rest: { z: 0 }, hover: { z: 22 } }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
            className="mt-4 font-playfair text-[18px] text-ivory"
          >
            {item.title}
          </motion.h3>

          <p className="mt-2 text-[12.5px] leading-relaxed text-ivory/60">{item.text}</p>

          <div className="mt-auto pt-5">
            <Link
              href={item.href}
              className="relative inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-champagne-light"
            >
              {/* Unterstrich wird von links aufgezogen – geclippte Maske statt Farbwechsel */}
              <span className="relative">
                {item.link}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-champagne transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                />
              </span>
              <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-champagne/25">
                {/* Pfeil-Karussell: der alte fährt raus, ein zweiter kommt nach */}
                <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-6" />
                <Arrow className="absolute h-3.5 w-3.5 -translate-x-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
              </span>
            </Link>
          </div>
        </motion.div>
      </motion.article>
    </motion.div>
  );
}

export default function HelpStrip({ t = {} }) {
  const help = HELP_SHAPE.map((h) => ({ ...h, ...(t.cards?.[h.key] ?? {}) }));
  return (
    <section className="grain relative overflow-hidden bg-espresso py-14 lg:py-16">
      {/* Tiefe: warme Weinglut oben links, Champagnerschimmer unten rechts */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(107,15,26,0.55) 0%, rgba(107,15,26,0) 68%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -right-32 h-[32rem] w-[32rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(200,183,122,0.32) 0%, rgba(200,183,122,0) 70%)",
        }}
      />
      {/* Übergang zur hellen Nachbarsektion – keine harte Kante */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory/10 to-transparent"
      />

      <div className="relative mx-auto max-w-content px-6 lg:px-10">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-16">
          <Reveal className="max-w-xl">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-champagne">
              <Grapes className="h-4 w-4" />
              {t.eyebrow}
            </span>
            <h2 className="mt-3 text-balance font-playfair text-[clamp(1.7rem,3.2vw,2.5rem)] leading-[1.08] text-ivory">
              {t.title} <span className="italic text-champagne-light">{t.titleAccent}</span>
            </h2>
            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-ivory/60">{t.description}</p>
          </Reveal>
        </div>

        {/* Karten auf einer Linie, gleiche Höhe – die Reihe wirkt als Block */}
        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {help.map((h, i) => (
            <Reveal key={h.key} delay={i * 0.09} y={34} className="h-full">
              <HelpCard item={h} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
