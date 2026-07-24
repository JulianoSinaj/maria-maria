"use client";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";
import { useTouchDevice } from "@/components/motion/useMediaQuery";

/* „Die Farbe" — links die Typo-Bühne, rechts eine moderne Glaskarte mit einem
   Motiv aus der Kunstgeschichte (oder einem Loop-Video), dessen Palette den
   Weinton spiegelt (wine.colorMoment.artwork). Die Karte schwebt federnd aus
   der rechten unteren Ecke in die Sektion und treibt beim Scrollen leicht mit
   (Parallaxe) — sie bleibt unter dem Cursor ruhig. Chips auf dem Bild (Farbton
   + Serviertemperatur) und die Bildleiste mit den Swatches greifen die
   Chip-Sprache der Sektion auf. */

const DRIFT_SPRING = { stiffness: 42, damping: 18 };
const ENTRY_SPRING = { type: "spring", stiffness: 48, damping: 14.5, mass: 1.05 };

const mixHex = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (sh) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

const FALLBACK_ARTWORK = {
  src: "/img/art/farbe-rot-fantin-latour.jpg",
  alt: "Ölgemälde „Roses in a Bowl“ von Henri Fantin-Latour",
  title: "Roses in a Bowl",
  artist: "Henri Fantin-Latour",
  year: "1883",
  focus: "50% 40%",
};

export default function ColorBand({ wine }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const touch = useTouchDevice();
  const c = wine.colorMoment;
  const art = c.artwork ?? FALLBACK_ARTWORK;
  const hasVideo = Boolean(art.video) && !reduced;
  const accent = wine.accent ?? { base: "#C8B77A", deep: "#8A2B2F", light: "#E3D9B8" };
  const [s0, s1, s2] = [c.swatches[0], c.swatches[1], c.swatches[2] ?? c.swatches[1]];

  /* abgeleitete Töne — funktionieren für helle wie dunkle Weine */
  const inkFrom = mixHex(s2.hex, "#1B1B1B", 0.5);
  const inkTo = mixHex(s2.hex, "#1B1B1B", 0.75);
  const frameDeep = mixHex(s2.hex, "#1B1B1B", 0.72);
  const tempFact = (wine.facts ?? []).find((f) => f.icon === "thermometer");

  /* Parallaxe: das gerahmte Bild treibt beim Scrollen federnd durch die
     Sektion — auf dem Telefon mit kürzerem Weg, damit nichts „schwimmt" */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const driftY = useSpring(
    useTransform(scrollYProgress, [0, 1], touch ? [26, -18] : [64, -46]),
    DRIFT_SPRING
  );

  /* Auftritt aus der rechten unteren Ecke — federnd, mit leichtem Eindrehen;
     auf schmalen Screens deutlich kürzer, sonst wirkt der Einflug ruckhaft */
  const entryV = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
      }
    : {
        hidden: touch
          ? { opacity: 0, x: 44, y: 84, rotate: 4, scale: 0.94 }
          : { opacity: 0, x: 140, y: 170, rotate: 7, scale: 0.88 },
        visible: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, transition: ENTRY_SPRING },
      };
  const plaqueV = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { ...ENTRY_SPRING, delay: 0.28 } },
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

        {/* ---------- Das Gemälde ---------- */}
        <div className="relative flex items-center justify-center pb-4 lg:pb-2">
          {/* weiche Lichtaura hinter dem Rahmen */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: `radial-gradient(closest-side, ${s1.hex}59, transparent 72%)` }}
          />
          <motion.div className="will-transform" style={reduced ? undefined : { y: driftY }}>
            <motion.figure
              variants={entryV}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              className="relative will-transform"
            >
              {/* weicher Farbschein hinter der Karte — greift den Weinton auf */}
              <div
                aria-hidden="true"
                className="absolute -bottom-8 -right-8 h-[85%] w-[85%] rounded-[48px] blur-2xl"
                style={{
                  background: `linear-gradient(135deg, ${s1.hex}, ${s2.hex})`,
                  opacity: 0.55,
                }}
              />

              {/* Moderne Glaskarte: Gradient-Haarlinie → frostiges Panel → Bild.
                  Spricht dieselbe Sprache wie die Chips der Sektion (weißes
                  Glas, weiche Radien, Weinton-Akzente). */}
              {/* Die Karte trägt die Breite; Video/Bild füllen sie mit w-full.
                  Läge die Breite auf dem Medium, könnte die Bildleiste die
                  Karte auf schmalen Screens breiter drücken als das Video —
                  rechts bliebe ein leerer Streifen. */}
              <div
                className="relative w-[min(88vw,352px)] max-w-full rounded-[26px] p-[1.5px] sm:w-[367px] lg:w-[407px]"
                style={{
                  background: `linear-gradient(140deg, rgba(255,255,255,0.95), ${s1.hex}66 45%, ${s2.hex}99)`,
                  boxShadow: `0 30px 64px -24px ${s2.hex}73, 0 12px 26px -14px rgba(27,27,27,0.2)`,
                }}
              >
                <div className="rounded-[24.5px] border border-white/50 bg-white/60 p-2.5 backdrop-blur-xl sm:p-3">
                  <div
                    className="relative overflow-hidden rounded-[18px]"
                    style={{ border: `1px solid ${frameDeep}24` }}
                  >
                    {/* Bewegte Leinwand: liegt in artwork.video ein Clip (mp4/webm),
                        läuft er stumm in Endlosschleife im Rahmen — das Gemälde
                        (artwork.src) bleibt Poster und Reduced-Motion-Fallback */}
                    {hasVideo ? (
                      <video
                        src={art.video}
                        poster={art.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={art.alt}
                        className="block aspect-[4/5] w-full object-cover"
                        style={{ objectPosition: art.videoFocus ?? art.focus ?? "50% 50%" }}
                      />
                    ) : (
                      <img
                        src={art.src}
                        alt={art.alt}
                        loading="lazy"
                        className="block aspect-[4/5] w-full object-cover"
                        style={{ objectPosition: art.focus ?? "50% 50%" }}
                      />
                    )}
                    {/* Vignette im Weinton verankert das Bild in der Sektion */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `linear-gradient(160deg, transparent 55%, ${s2.hex}2E 100%)`,
                        mixBlendMode: "multiply",
                      }}
                    />

                    {/* Farb-Chip — Echo der Kicker/Swatch-Sprache links */}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-3 py-1.5 shadow-chip backdrop-blur-md">
                      <span
                        className="h-2.5 w-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: s0.hex }}
                      />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-charcoal/70">
                        {s0.label}
                      </span>
                    </span>

                    {/* Temperatur-Chip — Echo des Serviertemperatur-Chips links */}
                    {tempFact && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/75 px-3 py-1.5 shadow-chip backdrop-blur-md">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" style={{ color: accent.deep }}>
                          <path d="M12 4a2 2 0 0 0-2 2v7.2a4 4 0 1 0 4 0V6a2 2 0 0 0-2-2Z" />
                          <path d="M12 11v5" strokeLinecap="round" />
                        </svg>
                        <span className="text-[10px] font-semibold text-charcoal/80">{tempFact.value}</span>
                      </span>
                    )}
                  </div>

                  {/* Bildleiste — verbindet Motiv und Weinfarbe, sitzt in der Karte */}
                  <motion.div
                    variants={plaqueV}
                    className="flex items-center justify-between gap-3 px-2.5 pb-1 pt-2.5 sm:px-3"
                  >
                    <span className="min-w-0 leading-tight">
                      <span
                        className="block text-[8.5px] font-semibold uppercase tracking-[0.22em]"
                        style={{ color: accent.deep }}
                      >
                        Farbverwandt · {hasVideo ? "Bewegtbild in Schleife" : art.medium ?? "Öl auf Leinwand"}
                      </span>
                      <span className="mt-0.5 block truncate font-playfair text-[13.5px] italic text-charcoal">
                        „{hasVideo && art.videoTitle ? art.videoTitle : art.title}"{" "}
                        {!(hasVideo && art.videoTitle) && (
                          <span className="font-sans text-[10.5px] not-italic text-charcoal/55">
                            — {art.artist}
                            {art.year ? `, ${art.year}` : ""}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5" aria-label="Die Töne des Weins">
                      {c.swatches.map((s) => (
                        <span
                          key={s.hex}
                          title={s.label}
                          className="h-3 w-3 rounded-full border border-white/70 shadow-sm"
                          style={{ backgroundColor: s.hex }}
                        />
                      ))}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.figure>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
