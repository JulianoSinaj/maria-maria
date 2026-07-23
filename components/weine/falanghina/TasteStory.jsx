"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { Eyebrow, SectionTitle, GoldRule } from "@/components/Deco";
import { useLenis } from "@/components/motion/SmoothScroll";
import ShaderGradient from "@/components/motion/ShaderGradient";
import { WINE_ICON } from "./WineIcons";
import WineGlassGL from "./WineGlassGL";

/* „Der Geschmack" — das gepinnte Scrollytelling-Herzstück im Kino-Stil.
   Drei Kapitel (Farbe · Duft · Geschmack) als choreografierter Dialog
   zwischen Glas und Text auf einer Bühne:

   · Kapitel 1 — Glas links, Text tritt von rechts ein und geht nach rechts ab
   · Kapitel 2 — Glas wandert nach rechts, Text kommt von links, geht links ab
   · Kapitel 3 — Glas wandert zurück nach links, Text von rechts, ab nach rechts
   · Finale    — während der letzte Text abgeht, fährt das Glas in die Mitte
                 und die Kamera dollyt heran (u_zoom im Shader), dann löst
                 sich der Pin und die Seite läuft weiter

   Alles ist scroll-gescrubbt (rückwärts scrollen spult die Szene zurück) und
   läuft durch Federn — Glasposition, Texteintritte, Blur und Neigung. Hinter
   der Bühne atmet ein ShaderGradient in Pastelltönen der Kapitelfarben.
   Reduced motion erhält die drei Kapitel ruhig gestapelt. */

/* Anteil des Scrollwegs, der dem Finale (Mitte + Zoom) gehört */
const FINALE = 0.18;
const X_SPRING = { stiffness: 60, damping: 19, mass: 1.1 };
const TEXT_SPRING = { stiffness: 90, damping: 22, mass: 0.9 };

/* Hex-Mischung für abgeleitete Töne (Pastell-Bühne, SVG-Fallback-Schatten) */
const mixHex = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (sh) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

/* ---- SVG-Fallback: Weinglas mit animiertem Inhalt (ohne WebGL) ---- */
function WineGlass({ progress, active, tint, reduced }) {
  const deep = mixHex(tint, "#000000", 0.42);
  const light = mixHex(tint, "#FFFFFF", 0.4);
  /* Füllstand steigt im ersten Kapitel */
  const level = useSpring(useTransform(progress, [0.02, 0.3], [196, 118]), {
    stiffness: 70,
    damping: 22,
  });
  /* Der Wein wirkt beim Einlaufen dünner und deckt erst mit Füllhöhe voll */
  const bodyOpacity = useTransform(progress, [0.02, 0.16, 0.3], [0.55, 0.8, 0.92]);

  return (
    <svg viewBox="0 0 220 300" className="h-full w-auto" aria-hidden="true">
      <defs>
        <clipPath id="tst-bowl">
          {/* Innenraum des Kelchs */}
          <path d="M66 44 C66 108 74 138 96 154 C102 158 118 158 124 154 C146 138 154 108 154 44 Z" />
        </clipPath>
        {/* Tiefe: an den Silhouettenkanten dunkler (längerer Lichtweg),
            farbneutral — funktioniert für Weiß-, Rosé- und Rotweine */}
        <linearGradient id="tst-wine-depth" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.26" />
          <stop offset="18%" stopColor="#FFFFFF" stopOpacity="0.10" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.22" />
          <stop offset="84%" stopColor="#000000" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
        </linearGradient>
        {/* Vertikaler Verlauf: heller Meniskus, dichter Bodensatz */}
        <linearGradient id="tst-wine-vert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="26%" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.36" />
        </linearGradient>
      </defs>

      {/* Wein im Glas */}
      <g clipPath="url(#tst-bowl)">
        {reduced ? (
          <>
            <rect x="60" y="128" width="100" height="80" fill={tint} />
            <rect x="60" y="128" width="100" height="80" fill="url(#tst-wine-depth)" />
          </>
        ) : (
          <>
            {/* Grundfarbe */}
            <motion.rect
              x="60"
              style={{ y: level, opacity: bodyOpacity }}
              width="100"
              height="180"
              fill={tint}
            />
            {/* Volumen- und Tiefenschichten wandern mit dem Füllstand */}
            <motion.rect
              x="60"
              style={{ y: level }}
              width="100"
              height="180"
              fill="url(#tst-wine-depth)"
            />
            <motion.rect
              x="60"
              style={{ y: level }}
              width="100"
              height="180"
              fill="url(#tst-wine-vert)"
            />
          </>
        )}
        {/* Meniskus: heller Farbsaum direkt an der Oberfläche */}
        {!reduced && (
          <>
            <motion.ellipse
              cx="110"
              style={{ cy: level }}
              rx="44"
              ry="5.5"
              fill={deep}
              opacity="0.85"
            />
            <motion.ellipse
              cx="110"
              style={{ cy: level }}
              rx="44"
              ry="5.5"
              fill="none"
              stroke={light}
              strokeWidth="1.1"
              opacity="0.6"
            />
            {/* Reflexstreifen auf der Weinoberfläche */}
            <motion.ellipse
              cx="96"
              style={{ cy: level }}
              rx="16"
              ry="2"
              fill="#FFFFFF"
              opacity="0.2"
            />
          </>
        )}
        {/* Duft-Perlen im zweiten Kapitel */}
        {!reduced && active === 1 && (
          <g>
            {[92, 110, 128].map((cx, i) => (
              <motion.circle
                key={cx}
                cx={cx}
                cy="150"
                r={2.2 + i * 0.4}
                fill={light}
                initial={{ opacity: 0 }}
                animate={{ cy: [150, 118], opacity: [0, 0.75, 0] }}
                transition={{
                  duration: 2.6,
                  delay: i * 0.55,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
          </g>
        )}
      </g>

      {/* Schwingungs-Ring im dritten Kapitel */}
      {!reduced && active === 2 && (
        <motion.ellipse
          cx="110"
          cy="120"
          rx="30"
          ry="4"
          fill="none"
          stroke={deep}
          strokeWidth="1.2"
          initial={{ opacity: 0 }}
          animate={{ rx: [30, 52], opacity: [0.7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Glaskörper */}
      <g fill="none" stroke="#1B1B1B" strokeOpacity="0.32" strokeWidth="1.6" strokeLinecap="round">
        <path d="M62 34 C62 106 72 140 94 157 C100 162 104 164 104 174 L104 244" />
        <path d="M158 34 C158 106 148 140 126 157 C120 162 116 164 116 174 L116 244" />
        <path d="M62 34 C62 30 66 28 70 28 L150 28 C154 28 158 30 158 34" strokeOpacity="0.22" />
        <path d="M74 258 C74 250 88 244 110 244 C132 244 146 250 146 258" />
        <path d="M74 258 C74 262 88 265 110 265 C132 265 146 262 146 258" strokeOpacity="0.22" />
      </g>
      {/* Lichtkante */}
      <path
        d="M74 48 C74 96 80 126 92 142"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.6"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <ellipse cx="110" cy="272" rx="42" ry="5" fill="#1B1B1B" opacity="0.08" />
    </svg>
  );
}

/* ---- Hintergrund-Tönung pro Kapitel — folgt der Glasseite ---- */
function ToneLayer({ progress, start, end, color, glassLeft }) {
  const span = end - start;
  const fade = span * 0.26;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const stops = [clamp(start - fade * 0.5), clamp(start + fade), clamp(end - fade), clamp(end + fade * 0.5)];
  const opacity = useTransform(progress, stops, [0, 1, 1, 0]);
  return (
    <motion.div
      aria-hidden="true"
      style={{
        opacity,
        background: `radial-gradient(60% 70% at ${glassLeft ? "30%" : "70%"} 50%, ${color}55, transparent 75%)`,
      }}
      className="absolute inset-0 will-transform"
    />
  );
}

/* ---- Fortschritts-Segment der Kapitel-Leiste ---- */
function SegmentFill({ progress, index, span }) {
  const scaleX = useTransform(progress, [index * span, (index + 1) * span], [0, 1]);
  return (
    <motion.span
      style={{ scaleX }}
      className="absolute inset-0 origin-left rounded-full bg-acqua-deep will-transform"
    />
  );
}

function ChapterPanel({ chapter, index }) {
  const Icon = WINE_ICON[chapter.icon];
  return (
    <div className="max-w-md">
      <p className="text-[13px] font-semibold tabular-nums tracking-[0.2em] text-charcoal/40">
        0{index + 1}
      </p>
      <div className="mt-3 inline-flex items-center gap-3">
        <span className="ring-hairline inline-flex h-12 w-12 items-center justify-center rounded-full bg-acqua-light/30 text-acqua-deep">
          {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
        </span>
        <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-acqua-deep">
          {chapter.kicker}
        </span>
      </div>
      <h3 className="mt-5 text-balance font-playfair text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.1] text-charcoal">
        {chapter.title}
      </h3>
      <p className="mt-5 text-[15px] leading-relaxed text-charcoal/70">{chapter.text}</p>
    </div>
  );
}

/* ---- Ein Kapiteltext auf der Bühne: tritt seitlich ein und geht zur selben
   Seite wieder ab, scroll-gescrubbt durch Federn (Position, Blur, 3D-Kippe).
   side = +1 → rechte Bühnenhälfte (Eintritt von rechts), -1 → linke. ---- */
function ChapterSlide({ chapter, index, side, start, end, progress, first }) {
  const span = end - start;
  const in0 = first ? 0.0001 : start + span * 0.05;
  const in1 = first ? span * 0.24 : start + span * 0.34;
  const out0 = end - span * 0.3;
  const out1 = end - span * 0.02;

  const opacity = useSpring(useTransform(progress, [in0, in1, out0, out1], [0, 1, 1, 0]), TEXT_SPRING);
  const xs = useSpring(
    useTransform(progress, [in0, in1, out0, out1], [side * 13, 0, 0, side * 15]),
    TEXT_SPRING
  );
  const x = useMotionTemplate`${xs}vw`;
  const blur = useSpring(useTransform(progress, [in0, in1, out0, out1], [12, 0, 0, 14]), TEXT_SPRING);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const rotateY = useSpring(
    useTransform(progress, [in0, in1, out0, out1], [side * -16, 0, 0, side * -10]),
    TEXT_SPRING
  );

  return (
    <motion.div
      style={{ x, opacity, filter, rotateY, transformPerspective: 1200, willChange: "transform, filter" }}
      className={[
        "pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center px-2",
        "lg:inset-y-0 lg:items-center",
        side === 1 ? "lg:left-[52%] lg:right-0 lg:justify-start lg:pl-4" : "lg:left-0 lg:right-[52%] lg:justify-end lg:pr-4",
      ].join(" ")}
    >
      <ChapterPanel chapter={chapter} index={index} />
    </motion.div>
  );
}

export default function TasteStory({ wine }) {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const [glFailed, setGlFailed] = useState(false);
  /* Reiseweite des Glases in vw — auf schmalen Viewports kürzer */
  const [amp, setAmp] = useState(22);
  const handleGlFail = useCallback(() => setGlFailed(true), []);
  const chapters = wine.taste;
  const n = chapters.length;
  const span = (1 - FINALE) / n;

  /* Farbe des Weins im Glas: explizit (glassColor) oder aus dem ersten
     Kapitelton — Strohgold bei der Falanghina, Granat beim Primitivo. */
  const liquid = wine.glassColor ?? chapters[0]?.tone ?? "#6E0F1D";

  /* Bühne in Pastell: Kapiteltöne weit Richtung Ivory gemischt, damit auch
     dunkle Rotwein-Töne als heller Kinohintergrund lesbar bleiben. */
  const bgColors = useMemo(() => {
    const ivory = "#F6F2E8";
    const t = (i) => chapters[i % n]?.tone ?? "#E8DC9A";
    return [ivory, mixHex(t(0), ivory, 0.5), mixHex(t(1), ivory, 0.55), mixHex(t(2), ivory, 0.6)];
  }, [chapters, n]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const set = () => setAmp(mq.matches ? 22 : 13);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ---- Glas-Choreografie: links → rechts → links → Mitte ---- */
  const { xStops, xVals } = useMemo(() => {
    const stops = [];
    const vals = [];
    for (let i = 0; i < n; i += 1) {
      const s0 = i * span;
      const s1 = (i + 1) * span;
      const rest = i % 2 === 0 ? -amp : amp;
      /* Rastpunkte pro Kapitel; die Übergänge dazwischen überlappen den
         Textabgang — Glas und Text wechseln die Seiten im selben Atemzug */
      stops.push(i === 0 ? 0 : s0 + span * 0.2, s1 - span * 0.2);
      vals.push(rest, rest);
    }
    stops.push(Math.min(1 - FINALE + FINALE * 0.5, 0.99), 1);
    vals.push(0, 0);
    return { xStops: stops, xVals: vals };
  }, [n, span, amp]);

  const glassX = useSpring(useTransform(scrollYProgress, xStops, xVals), X_SPRING);
  const glassXvw = useMotionTemplate`${glassX}vw`;
  /* Trägheits-Neigung: das Glas lehnt sich leicht gegen die Reiserichtung */
  const lean = useSpring(useTransform(useVelocity(glassX), [-60, 60], [5, -5], { clamp: true }), {
    stiffness: 110,
    damping: 17,
  });
  /* Die Kamera im Shader umkreist das Glas dezent, während es wandert */
  const yaw = useTransform(glassX, (v) => (amp ? -v / amp : 0));
  /* Finale: Dolly-Zoom im Shader + sanfte Container-Skalierung */
  const zoom = useSpring(useTransform(scrollYProgress, [1 - FINALE + 0.03, 0.97], [0, 1]), {
    stiffness: 55,
    damping: 18,
  });
  const glassScale = useTransform(zoom, [0, 1], [1, 1.18]);

  /* Uniform-Treiber für das WebGL-Glas: der Füllstand läuft über die drei
     Kapitel und ist voll, wenn das Finale beginnt. Alles bleibt als
     MotionValue außerhalb des React-Renderzyklus — der Shader liest im RAF. */
  const glFill = useTransform(scrollYProgress, [0.02, 1 - FINALE + 0.05], [0, 1]);
  const swirlFrom = (n - 1) * span;
  const glSwirl = useTransform(
    scrollYProgress,
    [swirlFrom, Math.min(swirlFrom + span * 0.35, 0.99), 1],
    [0, 1, 1]
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(n - 1, Math.max(0, Math.floor(v / span)));
    if (idx !== active) setActive(idx);
  });

  const jumpTo = (i) => {
    const el = sectionRef.current;
    if (!el) return;
    const pinDistance = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + (i + 0.5) * span * pinDistance;
    if (lenis?.current) lenis.current.scrollTo(top);
    else window.scrollTo({ top, behavior: "smooth" });
  };

  /* ---- Reduced motion: drei ruhige Kapitel untereinander ---- */
  if (reduced) {
    return (
      <section id="geschmack" className="scroll-mt-28 py-24">
        <div className="mx-auto max-w-content px-6 lg:px-10">
          <SectionTitle
            eyebrow="Der Geschmack"
            description={`Drei Kapitel, ein Charakter: Was ${wine.shortNameNom ?? "die Falanghina"} im Glas erzählt.`}
          >
            Was Sie <span className="italic text-acqua-deep">erwartet.</span>
          </SectionTitle>
          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {chapters.map((c, i) => (
              <div key={c.key} className="rounded-card bg-cream/90 p-8 shadow-luxe ring-hairline">
                <ChapterPanel chapter={c} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="geschmack"
      ref={sectionRef}
      className="relative scroll-mt-14"
      style={{ height: `${n * 120 + 80}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-gradient-to-b from-ivory via-cream to-ivory">
        {/* Kino-Rückwand: scroll-reaktives Shader-Feld in den Pastelltönen
            der Kapitel, darüber ein leichter Schleier für die Lesbarkeit */}
        <ShaderGradient colors={bgColors} speed={0.8} className="opacity-80" />
        <div aria-hidden="true" className="absolute inset-0 bg-white/30" />
        {chapters.map((c, i) => (
          <ToneLayer
            key={c.key}
            progress={scrollYProgress}
            start={i * span}
            end={(i + 1) * span}
            color={c.tone}
            glassLeft={i % 2 === 0}
          />
        ))}

        <div className="relative mx-auto flex h-full max-w-content flex-col px-6 lg:px-10">
          <div className="pt-24 text-center lg:pt-16">
            <Eyebrow className="justify-center">Der Geschmack</Eyebrow>
            <h2 className="sr-only">Der Geschmack {wine.shortNameGen ?? "der Falanghina"}</h2>
          </div>

          {/* Bühne */}
          <div className="relative min-h-0 flex-1" style={{ perspective: 1400 }}>
            {/* Glas-Rig: wandert über die Bühne, lehnt sich in die Bewegung,
                Finale mit Dolly-Zoom in der Mitte */}
            <motion.div
              style={{ x: glassXvw, rotate: lean, scale: glassScale, willChange: "transform" }}
              className="absolute left-1/2 top-[34%] z-10 lg:top-1/2"
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 blur-3xl"
                />
                {glFailed ? (
                  <div className="relative h-[30svh] lg:h-[52svh]">
                    <WineGlass progress={scrollYProgress} active={active} tint={liquid} reduced={false} />
                  </div>
                ) : (
                  /* Das Canvas hat kein intrinsisches Seitenverhältnis wie das
                     SVG — die Bühne bekommt daher eine eigene feste Höhe.
                     Bewusst ohne will-transform auf dem Canvas selbst: es ist
                     bereits GPU-gebunden, und die zusätzliche Compositing-
                     Ebene kostet auf manchen Treibern die Darstellung. */
                  <div className="relative h-[32svh] w-[24svh] lg:h-[56svh] lg:w-[42svh]">
                    <WineGlassGL
                      fill={glFill}
                      swirl={glSwirl}
                      zoom={zoom}
                      yaw={yaw}
                      wine={liquid}
                      onFail={handleGlFail}
                    />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Kapiteltexte: 01 rechts · 02 links · 03 rechts */}
            {chapters.map((c, i) => (
              <ChapterSlide
                key={c.key}
                chapter={c}
                index={i}
                side={i % 2 === 0 ? 1 : -1}
                start={i * span}
                end={(i + 1) * span}
                progress={scrollYProgress}
                first={i === 0}
              />
            ))}
          </div>

          {/* Kapitel-Leiste */}
          <div className="flex items-center justify-center gap-3 pb-8 lg:pb-10">
            {chapters.map((c, i) => (
              <button
                key={c.key}
                type="button"
                onClick={() => jumpTo(i)}
                aria-label={`Kapitel ${i + 1}: ${c.kicker}`}
                aria-current={active === i ? "true" : undefined}
                className="group flex h-11 items-center px-1"
              >
                <span className="relative block h-[3px] w-14 overflow-hidden rounded-full bg-stone/80 transition-colors duration-300 group-hover:bg-stone sm:w-20">
                  <SegmentFill progress={scrollYProgress} index={i} span={span} />
                </span>
              </button>
            ))}
          </div>
        </div>

        <GoldRule className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl" />
      </div>
    </section>
  );
}
