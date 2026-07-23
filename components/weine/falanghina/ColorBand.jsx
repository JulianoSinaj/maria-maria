"use client";
import { useRef, useId } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";

/* „Die Farbe" — kompaktes, realistisches Farb-Kapitel: links die Typo-Bühne,
   rechts ein fotorealistisch gezeichnetes Weinglas, das sich beim Scrollen
   federnd mit dem echten Weinton aus dem Datenblatt füllt. Das Glas neigt
   sich magnetisch zum Cursor — die Weinoberfläche bleibt dabei physikalisch
   korrekt waagerecht (Gegenrotation um den Glasfuß). Alle Töne (Flüssigkeit,
   Menisken, Headline-Gradient, Kaustik) werden aus wine.colorMoment.swatches
   abgeleitet, sodass Weiß-, Rosé- und Rotweine dieselbe Sektion teilen. */

const TILT_SPRING = { stiffness: 130, damping: 16, mass: 0.6 };
const FILL_SPRING = { stiffness: 46, damping: 17 };

const mixHex = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (sh) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

/* Innere Kelchkontur (Tulpe) — dient als ClipPath für die Flüssigkeit */
const BOWL_INNER =
  "M105 65 C95 101 87 131 87 165 C87 212 115 244 150 257 C185 244 213 212 213 165 C213 131 205 101 195 65 Z";
/* Äußere Kelchkontur — Glaskörper, Kontur und Glanz */
const BOWL_OUTER =
  "M100 64 C90 100 82 130 82 165 C82 215 112 248 150 263 C188 248 218 215 218 165 C218 130 210 100 200 64";

export default function ColorBand({ wine }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const c = wine.colorMoment;
  const accent = wine.accent ?? { base: "#C8B77A", deep: "#8A2B2F", light: "#E3D9B8" };
  const [s0, s1, s2] = [c.swatches[0], c.swatches[1], c.swatches[2] ?? c.swatches[1]];

  /* abgeleitete Töne — funktionieren für helle wie dunkle Weine */
  const deep = mixHex(s2.hex, "#1B1B1B", 0.4);
  const meniscus = mixHex(s0.hex, "#FFFFFF", 0.5);
  const inkFrom = mixHex(s2.hex, "#1B1B1B", 0.5);
  const inkTo = mixHex(s2.hex, "#1B1B1B", 0.75);
  const tempFact = (wine.facts ?? []).find((f) => f.icon === "thermometer");

  /* Füllstand: Wein steigt federnd, während die Sektion ins Bild scrollt.
     Oberfläche wandert von y=232 (Einschenkbeginn) auf y=152 (Idealfüllung
     am breitesten Punkt des Kelchs); der Meniskus wächst mit der Kelchbreite. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const surfaceY = useSpring(useTransform(scrollYProgress, [0.18, 0.85], [232, 152]), FILL_SPRING);
  const surfaceRx = useSpring(useTransform(scrollYProgress, [0.18, 0.85], [40, 63]), FILL_SPRING);
  const surfaceRy = useTransform(surfaceRx, (v) => v * 0.11);

  /* Magnetische Neigung: das Glas pendelt um den Fuß zum Cursor; die
     Flüssigkeit rotiert gegenläufig um denselben Punkt und bleibt waagerecht */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sway = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), TILT_SPRING);
  const negSway = useTransform(sway, (v) => -v);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), TILT_SPRING);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), TILT_SPRING);
  const magX = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), TILT_SPRING);
  const magY = useSpring(useTransform(my, [-0.5, 0.5], [-6, 6]), TILT_SPRING);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #FBF9F4 0%, ${s0.hex}26 62%, ${s0.hex}45 100%)`,
      }}
    >
      <div className="mx-auto grid max-w-content items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-10 lg:py-24">
        {/* ---------- Typo-Bühne ---------- */}
        <div className="relative z-10">
          <Reveal blur={false}>
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: accent.deep }}
            >
              {c.kicker}
            </span>
          </Reveal>
          <h2 className="mt-4 font-playfair text-[clamp(2.1rem,4.2vw,3.4rem)] leading-[1.05] text-charcoal">
            <SplitText text={c.lines[0]} className="block" delay={0.08} />
            <SplitText
              text={c.lines[1]}
              className="block italic"
              wordClassName="bg-clip-text text-transparent"
              wordStyle={{ backgroundImage: `linear-gradient(95deg, ${inkFrom}, ${inkTo})` }}
              delay={0.24}
            />
          </h2>
          <Reveal delay={0.15} y={18}>
            <p
              className="mt-6 max-w-md border-l pl-5 text-[14px] leading-relaxed text-charcoal/70"
              style={{ borderColor: `${accent.base}59` }}
            >
              {c.text}
            </p>
          </Reveal>
          {tempFact && (
            <Reveal delay={0.24} y={14} blur={false}>
              <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-charcoal/10 bg-white/70 py-2 pl-3 pr-5 shadow-chip backdrop-blur-sm">
                <span
                  className="grid h-8 w-8 place-items-center rounded-full"
                  style={{ backgroundColor: `${s1.hex}66`, color: inkTo }}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 4a2 2 0 0 0-2 2v7.2a4 4 0 1 0 4 0V6a2 2 0 0 0-2-2Z" />
                    <path d="M12 11v5" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/50">
                    {tempFact.label}
                  </span>
                  <span className="text-[13px] font-semibold text-charcoal">{tempFact.value}</span>
                </span>
              </div>
            </Reveal>
          )}
        </div>

        {/* ---------- Das Glas ---------- */}
        <div
          className="relative flex items-center justify-center"
          style={{ perspective: "1100px" }}
          onPointerMove={reduced ? undefined : onMove}
          onPointerLeave={reduced ? undefined : onLeave}
        >
          {/* weiche Lichtaura hinter dem Glas */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: `radial-gradient(closest-side, ${s1.hex}66, transparent 72%)` }}
          />
          <motion.div
            className="relative will-transform"
            style={
              reduced
                ? undefined
                : {
                    rotate: sway,
                    rotateX: rotX,
                    rotateY: rotY,
                    x: magX,
                    y: magY,
                    transformOrigin: "50% 82%",
                    transformStyle: "preserve-3d",
                  }
            }
          >
            <svg
              viewBox="0 0 300 470"
              className="h-[340px] w-auto sm:h-[400px] lg:h-[460px]"
              role="img"
              aria-label={`Weinfarbe im Glas: ${c.lines.join(" ")}`}
            >
              <defs>
                <clipPath id={`bowl-${uid}`}>
                  <path d={BOWL_INNER} />
                </clipPath>
                {/* Weinkörper: an der Oberfläche hell, zur Kelchmitte dicht */}
                <linearGradient id={`liquid-${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={s0.hex} />
                  <stop offset="0.1" stopColor={s0.hex} />
                  <stop offset="0.22" stopColor={s1.hex} />
                  <stop offset="0.34" stopColor={s2.hex} />
                  <stop offset="0.5" stopColor={deep} />
                  <stop offset="1" stopColor={deep} />
                </linearGradient>
                <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
                  <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0.12" />
                  <stop offset="0.7" stopColor="#FFFFFF" stopOpacity="0.06" />
                  <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
                <filter id={`blur3-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
                <filter id={`blur5-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" />
                </filter>
              </defs>

              {/* Bodenschatten + Kaustik — das Licht fällt durch den Wein */}
              <ellipse cx="150" cy="396" rx="64" ry="8" fill="#1B1B1B" opacity="0.1" filter={`url(#blur5-${uid})`} />
              <ellipse cx="180" cy="392" rx="34" ry="6" fill={s2.hex} opacity="0.45" filter={`url(#blur3-${uid})`} />

              {/* Wein — auf den Kelch beschnitten; bleibt beim Neigen waagerecht */}
              <g clipPath={`url(#bowl-${uid})`}>
                <motion.g
                  style={
                    reduced
                      ? undefined
                      : { rotate: negSway, transformBox: "view-box", transformOrigin: "150px 385px" }
                  }
                >
                  <motion.g className="will-transform" style={{ y: reduced ? 152 : surfaceY }}>
                    <rect x="62" y="0" width="176" height="290" fill={`url(#liquid-${uid})`} />
                    {/* Meniskus: Oberflächenlinse + heller Lichtsaum */}
                    <motion.ellipse
                      cx="150"
                      cy="0"
                      rx={reduced ? 63 : surfaceRx}
                      ry={reduced ? 7 : surfaceRy}
                      fill={meniscus}
                      opacity="0.9"
                    />
                    <motion.ellipse
                      cx="150"
                      cy="0"
                      rx={reduced ? 63 : surfaceRx}
                      ry={reduced ? 7 : surfaceRy}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeOpacity="0.55"
                      strokeWidth="0.8"
                    />
                  </motion.g>
                  {!reduced && (
                    <motion.rect
                      x="70"
                      y="60"
                      width="64"
                      height="210"
                      fill={`url(#shine-${uid})`}
                      opacity="0.8"
                      style={{ mixBlendMode: "soft-light" }}
                      animate={{ x: [-50, 130] }}
                      transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
                    />
                  )}
                </motion.g>
              </g>

              {/* Glaskörper über dem Wein — Sheen, Kontur, Glanzlichter */}
              <path d={BOWL_OUTER} fill={`url(#glass-${uid})`} fillOpacity="0.55" />
              <path d={BOWL_OUTER} fill="none" stroke="#1B1B1B" strokeOpacity="0.16" strokeWidth="2" />
              <ellipse cx="150" cy="64" rx="50" ry="8" fill="none" stroke="#1B1B1B" strokeOpacity="0.18" strokeWidth="1.6" />
              <path d="M100 64 A50 8 0 0 1 200 64" fill="none" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.2" />
              <path
                d="M103 88 C95 116 91 142 91 168 C91 196 100 220 116 238"
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.65"
                strokeWidth="5"
                strokeLinecap="round"
                filter={`url(#blur3-${uid})`}
              />
              <path
                d="M199 90 C205 116 208 138 208 162"
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.35"
                strokeWidth="3"
                strokeLinecap="round"
                filter={`url(#blur3-${uid})`}
              />

              {/* Stiel + Fuß */}
              <rect x="146.6" y="262" width="6.8" height="118" rx="3" fill={`url(#glass-${uid})`} stroke="#1B1B1B" strokeOpacity="0.14" strokeWidth="1.4" />
              <ellipse cx="150" cy="384" rx="58" ry="9.5" fill={`url(#glass-${uid})`} stroke="#1B1B1B" strokeOpacity="0.16" strokeWidth="1.8" />
              <ellipse cx="150" cy="382" rx="38" ry="4.5" fill="none" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.2" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
