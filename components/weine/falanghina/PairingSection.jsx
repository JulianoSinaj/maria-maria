"use client";
import { motion, useSpring, useReducedMotion, useMotionTemplate } from "motion/react";
import { Eyebrow, GoldRule } from "@/components/Deco";
import { ACCENT_FALLBACK } from "./accent";
import { useTouchDevice } from "@/components/motion/useMediaQuery";
import { WINE_ICON } from "./WineIcons";

/* „Passt zu" — aus der schwebenden Karte mit Beistellfoto wurde ein eigenes
   Kapitel, hell wie die Mehrzahl der Sektionen (Elfenbein statt Espresso).

   Dramaturgie in drei knappen Bändern statt einer langen Spalte:
   1) Opener — Titel links, Intro rechts, damit die Kopfzone nur eine
      Zeilenhöhe kostet statt drei gestapelter Blöcke.
   2) Das Prinzip — der Merksatz und daneben die Struktur-Achsen als
      kompakte Messreihe. Die Achsen sind das Vokabular, das die Notizen
      im Raster darunter benutzen; Balken und Text erklären dieselbe Sache
      zweimal, einmal visuell und einmal in Worten.
   3) Die Speisen — ein 2×2-Bento statt einer Liste. Halbe Höhe, und jede
      Kachel bekommt eine eigene Hierarchie: Kopfzeile (Icon + Titel +
      Beitext) über der Brücke zum Wein im Kachelfuß.

   Alles ist datengetrieben und degradiert sauber: ohne `pairing.why` bleibt
   die Sektion das reine Speisen-Raster, ohne `note` fehlt nur die
   Begründungszeile eines Eintrags. */

const SPRING = { type: "spring", stiffness: 90, damping: 19, mass: 0.9 };
const EASE = [0.16, 1, 0.3, 1];
/* Weicher als der Standard: die Balken sollen ankommen, nicht anschlagen */
const BAR_SPRING = { type: "spring", stiffness: 52, damping: 17, mass: 1 };
/* Magnetik der Kacheln — träge genug, dass die Neigung getragen wirkt */
const TILT_SPRING = { stiffness: 150, damping: 20, mass: 0.6 };

/* Aufstieg aus der Tiefe — dieselbe Sprache wie im Genuss-Kapitel */
function Rise({ children, y = 26, delay = 0, className = "" }) {
  const reduced = useReducedMotion();
  const touch = useTouchDevice();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={touch ? { opacity: 0, y: 20 } : { opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transitionEnd: { filter: "none" },
      }}
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

/* Eine Struktur-Achse des Weins. Label und Hinweis teilen sich jetzt eine
   Zeile über dem Balken, der Balken selbst liegt direkt darunter — drei
   Achsen kosten so zusammen weniger Höhe als vorher eine einzelne.
   Die Skalierung läuft über transform (GPU), nicht über width; der Balken
   wächst deshalb aus dem linken Rand, ohne ein Layout auszulösen. */
function AffinityAxis({ axis, accent, index }) {
  const reduced = useReducedMotion();
  const pct = Math.max(0, Math.min(100, axis.value)) / 100;

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { ...SPRING, opacity: { duration: 0.5 } },
        },
      }}
      className="min-w-0"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/70">
          {axis.label}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-stone/60" />
      </div>

      {/* Schiene + Füllung. Die Füllung sitzt in einem overflow-hidden-Gleis,
          damit der Glanzstreifen an der Spitze nicht über den Wert hinausläuft. */}
      <div className="relative mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-stone/50">
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accent.deep}, ${accent.base} 62%, ${accent.light})`,
            willChange: "transform",
          }}
          initial={{ scaleX: reduced ? pct : 0 }}
          whileInView={{ scaleX: pct }}
          viewport={{ once: true, amount: 0.6 }}
          transition={reduced ? { duration: 0 } : { ...BAR_SPRING, delay: 0.18 + index * 0.1 }}
        />
      </div>

      {axis.hint && (
        <span className="mt-1.5 block text-[10.5px] italic leading-snug text-charcoal/45">
          {axis.hint}
        </span>
      )}
    </motion.li>
  );
}

/* Eine Speisen-Kachel im Bento. Kopfzeile trägt Icon, Titel und Beitext, der
   Kachelfuß die Brücke zum Wein — durch eine Haarlinie getrennt, die beim
   Hover in der Weinfarbe aufleuchtet. Die Kachel neigt sich dabei leicht zum
   Cursor: rotateX/rotateY über useSpring, nie linear. */
function PairingItem({ item, accent }) {
  const Icon = WINE_ICON[item.icon];
  const reduced = useReducedMotion();
  const touch = useTouchDevice();
  const flat = reduced || touch;

  const rx = useSpring(0, TILT_SPRING);
  const ry = useSpring(0, TILT_SPRING);
  /* Glanzpunkt folgt dem Cursor über dieselben Federn — ein Licht, das über
     die Kachel wandert statt eines harten Hover-Umschlags */
  const gx = useSpring(50, TILT_SPRING);
  const gy = useSpring(50, TILT_SPRING);
  const glow = useMotionTemplate`radial-gradient(120% 120% at ${gx}% ${gy}%, ${accent.base}14 0%, transparent 62%)`;

  function track(e) {
    if (flat) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    /* bewusst flach — die Kachel soll sich neigen, nicht kippen */
    ry.set((px - 0.5) * 7);
    rx.set((0.5 - py) * 5);
    gx.set(px * 100);
    gy.set(py * 100);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  }

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { ...SPRING, opacity: { duration: 0.5 }, filter: { duration: 0.55 } },
          transitionEnd: { filter: "none" },
        },
      }}
      className="group/item [perspective:1200px]"
    >
      <motion.div
        onPointerMove={track}
        onPointerLeave={reset}
        style={{
          rotateX: flat ? 0 : rx,
          rotateY: flat ? 0 : ry,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="ring-hairline relative flex h-full flex-col overflow-hidden rounded-card border border-stone/55 bg-cream/80 p-4 shadow-chip transition-colors duration-400 ease-out-expo group-hover/item:border-champagne/60 sm:p-5"
      >
        {/* Cursor-Licht in der Weinfarbe, nur beim Hover sichtbar */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 ease-out-expo group-hover/item:opacity-100"
          style={{ background: glow }}
        />

        <div className="relative flex items-center gap-3">
          {Icon && (
            <span
              className="ring-hairline inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 shadow-chip"
              style={{ color: accent.deep, transform: "translateZ(18px)" }}
            >
              <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
            </span>
          )}
          <span className="min-w-0" style={{ transform: "translateZ(12px)" }}>
            <span className="block text-[14px] font-medium leading-tight text-charcoal">
              {item.title}
            </span>
            <span className="mt-0.5 block text-[11.5px] leading-snug text-charcoal/50">
              {item.text}
            </span>
          </span>
        </div>

        {item.note && (
          <span
            className="relative mt-3 block border-t border-stone/50 pt-3 font-playfair text-[12.5px] italic leading-snug text-charcoal/70"
            style={{ transform: "translateZ(6px)" }}
          >
            {item.note}
          </span>
        )}
      </motion.div>
    </motion.li>
  );
}

export default function PairingSection({ wine }) {
  const { pairing } = wine;
  /* Dieselbe Reihenfolge wie im Genuss-Kapitel: der Wein bringt seinen Ton
     entweder oben mit oder — wie die meisten — im moment-Block. */
  const accent = wine.accent ?? wine.moment?.accent ?? ACCENT_FALLBACK;
  const why = pairing.why;
  const Thermometer = WINE_ICON.thermometer;
  const tempFact = (wine.facts ?? []).find((f) => f.icon === "thermometer");

  return (
    <section id="passt-zu" className="grain relative scroll-mt-36 overflow-hidden bg-ivory">
      {/* Hell und ruhig: nur eine sehr weiche Weinnote unten links und ein
          warmes Licht oben rechts, damit die Fläche nicht flach kippt */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 82% 0%, rgba(200,183,122,0.16) 0%, transparent 56%), radial-gradient(85% 65% at 6% 100%, rgba(138,43,47,0.07) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-content px-6 py-14 sm:py-16 lg:px-10 lg:py-20">
        {/* ---- Kapitel-Opener: Titel links, Intro rechts auf Grundlinie ----
            Statt drei gestapelter Blöcke teilt sich die Kopfzone zwei Spalten;
            das spart am Desktop rund eine halbe Bildschirmhöhe. */}
        <Rise>
          <div className="grid items-end gap-x-12 gap-y-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Eyebrow>{pairing.kicker}</Eyebrow>
              <h2 className="mt-3 text-balance font-playfair text-[clamp(1.75rem,3.1vw,2.4rem)] leading-[1.06] text-charcoal">
                {pairing.title}
              </h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-md text-[13px] leading-relaxed text-charcoal/65">
                {pairing.text}
              </p>
              <GoldRule className="mt-3 w-24" />
            </div>
          </div>
        </Rise>

        {/* ---- Das Prinzip: Merksatz und Struktur-Achsen nebeneinander ---- */}
        {why && (
          <Rise className="mt-8 lg:mt-10">
            <div className="ring-hairline rounded-card-lg border border-stone/55 bg-gradient-to-br from-cream via-ivory to-cream p-5 shadow-luxe sm:p-6">
              <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[1fr_1fr]">
                <div className="flex flex-col">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-champagne">
                    {why.kicker ?? "Warum das zusammenpasst"}
                  </p>
                  <p className="mt-3 text-balance font-playfair text-[clamp(1.05rem,1.7vw,1.3rem)] italic leading-[1.38] text-charcoal/85">
                    {why.principle}
                  </p>

                  {tempFact && (
                    <div className="ring-hairline mt-4 inline-flex w-fit items-center gap-2.5 rounded-full bg-white/70 py-1.5 pl-2 pr-3.5 shadow-chip">
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full"
                        style={{ backgroundColor: `${accent.base}1F`, color: accent.deep }}
                      >
                        <Thermometer className="h-[14px] w-[14px]" aria-hidden="true" />
                      </span>
                      <span className="flex items-baseline gap-2 leading-none">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
                          {tempFact.label}
                        </span>
                        <span className="text-[12px] font-semibold text-charcoal">
                          {tempFact.value}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Die Achsen als Messreihe — drei Spalten am Desktop, damit
                    das Vokabular des Weins auf einen Blick lesbar bleibt */}
                {why.axes?.length > 0 && (
                  <motion.ul
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.35, margin: "0px 0px -6% 0px" }}
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
                    }}
                    className="grid grid-cols-1 gap-x-7 gap-y-4 self-center sm:grid-cols-3 lg:gap-x-5"
                  >
                    {why.axes.map((axis, i) => (
                      <AffinityAxis key={axis.label} axis={axis} accent={accent} index={i} />
                    ))}
                  </motion.ul>
                )}
              </div>
            </div>
          </Rise>
        )}

        {/* ---- Die Speisen als Bento: 2×2 statt vier gestapelter Zeilen ---- */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -6% 0px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
          }}
          className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:mt-5 lg:gap-4"
        >
          {pairing.items.map((item) => (
            <PairingItem key={item.title} item={item} accent={accent} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
