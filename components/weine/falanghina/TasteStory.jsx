"use client";
import { useCallback, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { Eyebrow, SectionTitle, GoldRule } from "@/components/Deco";
import { useLenis } from "@/components/motion/SmoothScroll";
import { WINE_ICON } from "./WineIcons";
import WineGlassGL from "./WineGlassGL";

/* „Der Geschmack" — das gepinnte Scrollytelling-Herzstück im Apple-Stil.
   Drei Kapitel (Farbe · Duft · Geschmack) scrollen durch einen fixierten
   Viewport: links ein Weinglas, das sich füllt, duftet und schwingt; rechts
   wechseln die Kapiteltexte im Crossfade. Eine klickbare Kapitel-Leiste
   zeigt den Fortschritt. Reduced motion erhält die drei Kapitel gestapelt. */

const SPRING = { type: "spring", stiffness: 90, damping: 20, mass: 1 };

/* Rotwein-Palette: von hellem Rubin am Rand bis zu dunklem Granat im Kern.
   Die Kapitel verschieben den Ton nur leicht — Rotwein bleibt Rotwein. */
const WINE_REDS = ["#7B1220", "#6E0F1D", "#5C0C18"];

/* ---- Weinglas mit animiertem Inhalt ---- */
function WineGlass({ progress, active, tones, reduced }) {
  /* Füllstand steigt im ersten Kapitel, Farbton wandert mit den Kapiteln */
  const level = useSpring(useTransform(progress, [0.02, 0.3], [196, 118]), {
    stiffness: 70,
    damping: 22,
  });
  /* Farbverlauf über die Kapitel — Stützstellen aus der Tönungsanzahl
     abgeleitet, damit sie immer streng aufsteigend sind. */
  const reds = tones.map((_, i) => WINE_REDS[Math.min(i, WINE_REDS.length - 1)]);
  const fillStops = tones.map((_, i) => 0.1 + (i * 0.75) / Math.max(1, tones.length - 1));
  const fill = useTransform(progress, fillStops, reds);
  /* Der Wein wirkt beim Einlaufen dünner und deckt erst mit Füllhöhe voll */
  const bodyOpacity = useTransform(progress, [0.02, 0.16, 0.3], [0.62, 0.85, 0.94]);

  return (
    <svg viewBox="0 0 220 300" className="h-full w-auto" aria-hidden="true">
      <defs>
        <clipPath id="tst-bowl">
          {/* Innenraum des Kelchs */}
          <path d="M66 44 C66 108 74 138 96 154 C102 158 118 158 124 154 C146 138 154 108 154 44 Z" />
        </clipPath>
        {/* Tiefe: an den Rändern lichtdurchlässig, im Kern granatdunkel */}
        <linearGradient id="tst-wine-depth" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.28" />
          <stop offset="18%" stopColor="#B4243A" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#2E040C" stopOpacity="0.45" />
          <stop offset="84%" stopColor="#4A0812" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.34" />
        </linearGradient>
        {/* Vertikaler Verlauf: dichter Bodensatz, transparenter Meniskus */}
        <linearGradient id="tst-wine-vert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C0304A" stopOpacity="0.34" />
          <stop offset="26%" stopColor="#7A1122" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#2A050B" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Wein im Glas */}
      <g clipPath="url(#tst-bowl)">
        {reduced ? (
          <>
            <rect x="60" y="128" width="100" height="80" fill={WINE_REDS[0]} />
            <rect x="60" y="128" width="100" height="80" fill="url(#tst-wine-depth)" />
          </>
        ) : (
          <>
            {/* Grundfarbe */}
            <motion.rect
              x="60"
              style={{ y: level, fill, opacity: bodyOpacity }}
              width="100"
              height="180"
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
        {/* Meniskus: heller Rubinrand direkt an der Oberfläche */}
        {!reduced && (
          <>
            <motion.ellipse
              cx="110"
              style={{ cy: level }}
              rx="44"
              ry="5.5"
              fill="#8E1B2C"
              opacity="0.9"
            />
            <motion.ellipse
              cx="110"
              style={{ cy: level }}
              rx="44"
              ry="5.5"
              fill="none"
              stroke="#D4526A"
              strokeWidth="1.1"
              opacity="0.55"
            />
            {/* Reflexstreifen auf der Weinoberfläche */}
            <motion.ellipse
              cx="96"
              style={{ cy: level }}
              rx="16"
              ry="2"
              fill="#FFFFFF"
              opacity="0.16"
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
                fill="#D4526A"
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
          stroke="#8E1B2C"
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

/* ---- Hintergrund-Tönung pro Kapitel ---- */
function ToneLayer({ progress, index, count, color }) {
  /* Ein- und Ausblendung relativ zur Kapitelbreite — feste Randwerte würden
     sich bei mehreren Kapiteln überlappen und die Offsets absteigend machen,
     was die WAAPI ablehnt. Alles bleibt monoton steigend in [0, 1]. */
  const span = 1 / count;
  const fade = span * 0.26;
  const start = index * span;
  const end = start + span;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const stops = [
    clamp(start - fade),
    clamp(start + fade),
    clamp(end - fade),
    clamp(end + fade),
  ];
  const opacity = useTransform(progress, stops, [0, 1, 1, 0]);
  return (
    <motion.div
      aria-hidden="true"
      style={{
        opacity,
        background: `radial-gradient(60% 70% at 30% 50%, ${color}55, transparent 75%)`,
      }}
      className="absolute inset-0 will-transform"
    />
  );
}

/* ---- Fortschritts-Segment der Kapitel-Leiste ---- */
function SegmentFill({ progress, index, count }) {
  const scaleX = useTransform(progress, [index / count, (index + 1) / count], [0, 1]);
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

export default function TasteStory({ wine }) {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const [glFailed, setGlFailed] = useState(false);
  const handleGlFail = useCallback(() => setGlFailed(true), []);
  const chapters = wine.taste;
  const tones = chapters.map((c) => c.tone);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Uniform-Treiber für das WebGL-Glas: der Füllstand läuft linear über die
     komplette Sektion — derselbe Scroll, der die drei Kapitel durchliest,
     füllt auch das Glas. Es steht damit an keiner Stelle still und ist erst
     am Ende des letzten Kapitels voll. Beides bleibt als MotionValue außer-
     halb des React-Renderzyklus — der Shader liest die Werte im RAF. */
  const glFill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  /* Stützstellen in [0, 1] halten und streng aufsteigend: bei nur einem
     Kapitel läge der Einblendbeginn sonst im Negativen, was die WAAPI
     mit „Offsets must be monotonically non-decreasing" ablehnt. */
  const swirlStart = (chapters.length - 1) / chapters.length;
  const swirlFrom = Math.max(0, swirlStart - 0.06);
  const swirlTo = Math.min(1, Math.max(swirlFrom + 0.02, swirlStart + 0.06));
  const glSwirl = useTransform(scrollYProgress, [swirlFrom, swirlTo, 1], [0, 1, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(chapters.length - 1, Math.max(0, Math.floor(v * chapters.length)));
    if (idx !== active) setActive(idx);
  });

  const jumpTo = (i) => {
    const el = sectionRef.current;
    if (!el) return;
    const pinDistance = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + ((i + 0.5) / chapters.length) * pinDistance;
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
            description="Drei Kapitel, ein Charakter: Was die Falanghina im Glas erzählt."
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
      style={{ height: `${chapters.length * 110 + 30}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-gradient-to-b from-ivory via-cream to-ivory">
        {chapters.map((c, i) => (
          <ToneLayer
            key={c.key}
            progress={scrollYProgress}
            index={i}
            count={chapters.length}
            color={c.tone}
          />
        ))}

        <div className="relative mx-auto flex h-full max-w-content flex-col px-6 lg:px-10">
          <div className="pt-24 text-center lg:pt-16">
            <Eyebrow className="justify-center">Der Geschmack</Eyebrow>
            <h2 className="sr-only">Der Geschmack der Falanghina</h2>
          </div>

          <div className="grid min-h-0 flex-1 grid-rows-[0.85fr_1.15fr] items-center gap-2 lg:grid-cols-2 lg:grid-rows-1 lg:gap-10">
            {/* Glas-Bühne */}
            <div className="relative flex h-full min-h-0 items-center justify-center py-2">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-3xl"
              />
              {glFailed ? (
                <div className="relative h-full max-h-[30svh] lg:max-h-[52svh]">
                  <WineGlass
                    progress={scrollYProgress}
                    active={active}
                    tones={tones}
                    reduced={false}
                  />
                </div>
              ) : (
                /* Das Canvas hat kein intrinsisches Seitenverhältnis wie das
                   SVG — die Bühne bekommt daher eine eigene feste Höhe.
                   Bewusst ohne will-transform: das Canvas ist bereits
                   GPU-gebunden, und die zusätzliche Compositing-Ebene kostet
                   auf manchen Treibern die Darstellung komplett. */
                <div className="relative h-[30svh] w-[22svh] lg:h-[52svh] lg:w-[39svh]">
                  <WineGlassGL fill={glFill} swirl={glSwirl} onFail={handleGlFail} />
                </div>
              )}
            </div>

            {/* Kapitel-Texte im Crossfade */}
            <div className="relative flex items-start justify-center pb-6 lg:items-center lg:pb-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={chapters[active].key}
                  initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { ...SPRING, opacity: { duration: 0.4 } },
                  }}
                  exit={{ opacity: 0, y: -16, transition: { duration: 0.22, ease: "easeIn" } }}
                  className="will-transform"
                >
                  <ChapterPanel chapter={chapters[active]} index={active} />
                </motion.div>
              </AnimatePresence>
            </div>
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
                  <SegmentFill progress={scrollYProgress} index={i} count={chapters.length} />
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
