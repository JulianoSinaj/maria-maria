"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
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

/* „Der Geschmack" — das gepinnte Scrollytelling-Herzstück im Kino-Stil.
   Drei Kapitel (Farbe · Duft · Geschmack) als choreografierter Dialog
   zwischen einem gerahmten Gemälde und Text auf einer Bühne — die
   „Galerie der Sinne", die die Kunst-Direktion der Farb-Sektion
   (ColorBand) fortführt:

   · Kapitel 1 — Gemälde links, Text tritt von rechts ein, geht rechts ab
   · Kapitel 2 — Rahmen wandert nach rechts, Text kommt von links; im
                 Rahmen wird das nächste Gemälde von unten freigelegt
                 (ein Wisch wie einschenkender Wein)
   · Kapitel 3 — Rahmen zurück nach links, letzter Bildwechsel
   · Finale    — der Rahmen fährt in die Mitte und wächst leicht heran,
                 dann löst sich der Pin und die Seite läuft weiter

   Alles ist scroll-gescrubbt (rückwärts scrollen spult zurück) und läuft
   durch Federn — Rahmenposition, Bildwechsel, Texteintritte, Blur und
   Neigung. Der Rahmen lehnt sich träge gegen die Reiserichtung und dreht
   sich leicht in 3D zum Text hin; eine Museumsplakette nennt das jeweils
   sichtbare Werk. Hinter der Bühne atmet ein ShaderGradient in den
   Pastelltönen der Kapitel. Reduced motion erhält die drei Kapitel ruhig
   gestapelt. */

/* Anteil des Scrollwegs, der dem Finale (Mitte + Zoom) gehört */
const FINALE = 0.18;
const X_SPRING = { stiffness: 60, damping: 19, mass: 1.1 };
const TEXT_SPRING = { stiffness: 90, damping: 22, mass: 0.9 };
const REVEAL_SPRING = { stiffness: 64, damping: 21, mass: 1 };

/* Hex-Mischung für abgeleitete Töne (Pastell-Bühne, Rahmen-Echo) */
const mixHex = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (sh) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

/* Relative Luminanz eines Hex-Tons — entscheidet Weißwein- vs. Rotwein-Set */
const relLum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

/* ---- Galerie der Sinne: ein Gemälde pro Kapitel ----
   Jedes Kapitel kann in wineData ein eigenes `artwork` mitbringen
   (src/alt/title/artist/year/focus). Fehlt es, greift dieses kuratierte
   Fallback — gewählt nach der Luminanz des ersten Kapiteltons: helle
   Weine bekommen das Weißwein-Set, dunkle das Rotwein-Set. */
const TASTE_ART = {
  light: {
    farbe: {
      src: "/img/art/farbe-weizen-vangogh.jpg",
      alt: "Ölgemälde „Weizenfeld mit Zypressen“ von Vincent van Gogh: goldgelbes Kornfeld unter bewegtem Sommerhimmel",
      title: "Weizenfeld mit Zypressen",
      artist: "Vincent van Gogh",
      year: "1889",
      focus: "48% 72%",
      zoom: 1.4,
      origin: "46% 84%",
    },
    duft: {
      src: "/img/art/duft-bluete-vangogh.jpg",
      alt: "Ölgemälde „Mandelblüte“ von Vincent van Gogh: weiße Blüten an knorrigen Zweigen vor türkisblauem Grund",
      title: "Mandelblüte",
      artist: "Vincent van Gogh",
      year: "1890",
      focus: "48% 42%",
    },
    geschmack: {
      src: "/img/art/geschmack-stillleben-heda.jpg",
      alt: "Ölgemälde „Stillleben mit vergoldetem Pokal“ von Willem Claesz. Heda: Römer mit Weißwein, Zinn und geschälte Zitrone",
      title: "Stillleben mit vergoldetem Pokal",
      artist: "Willem Claesz. Heda",
      year: "1635",
      focus: "54% 34%",
    },
  },
  dark: {
    farbe: {
      src: "/img/art/farbe-kirschen-fantin-latour.jpg",
      alt: "Ölgemälde von Henri Fantin-Latour: Kristallschale mit rubinroten Kirschen neben Weißdornstrauß und Porzellan",
      title: "Weißdorn und Kirschen",
      artist: "Henri Fantin-Latour",
      year: "1872",
      focus: "36% 72%",
    },
    duft: {
      src: "/img/art/duft-pflaumen-fantin-latour.jpg",
      alt: "Ölgemälde „Ein Korb Pflaumen“ von Henri Fantin-Latour: dunkelviolette Pflaumen in einem Weidenkorb",
      title: "Ein Korb Pflaumen",
      artist: "Henri Fantin-Latour",
      focus: "50% 46%",
    },
    geschmack: {
      src: "/img/art/geschmack-fruechte-fantin-latour.jpg",
      alt: "Ölgemälde „Pfirsiche und Trauben“ von Henri Fantin-Latour: weiche Pfirsiche und Trauben auf einem Teller vor dunklem Grund",
      title: "Pfirsiche und Trauben",
      artist: "Henri Fantin-Latour",
      year: "1874",
      focus: "50% 46%",
    },
  },
};

/* ---- Hintergrund-Tönung pro Kapitel — folgt der Bildseite ---- */
function ToneLayer({ progress, start, end, color, artLeft }) {
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
        background: `radial-gradient(60% 70% at ${artLeft ? "30%" : "70%"} 50%, ${color}55, transparent 75%)`,
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
      <div className="mt-2 inline-flex items-center gap-3 sm:mt-3">
        <span className="ring-hairline inline-flex h-10 w-10 items-center justify-center rounded-full bg-acqua-light/30 text-acqua-deep sm:h-12 sm:w-12">
          {Icon && <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-acqua-deep sm:text-[12px]">
          {chapter.kicker}
        </span>
      </div>
      <h3 className="mt-3 text-balance font-playfair text-[clamp(1.55rem,3.4vw,2.8rem)] leading-[1.1] text-charcoal sm:mt-5">
        {chapter.title}
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-charcoal/70 sm:mt-5 sm:text-[15px]">{chapter.text}</p>
    </div>
  );
}

/* ---- Ein Kapiteltext auf der Bühne: tritt seitlich ein und geht zur selben
   Seite wieder ab, scroll-gescrubbt durch Federn (Position, Blur, 3D-Kippe).
   Der Text steht früh scharf (24 % des Kapitels) und bleibt lange lesbar
   (bis 84 %) — das klare Plateau trägt gut 60 % des Kapitelwegs.
   side = +1 → rechte Bühnenhälfte (Eintritt von rechts), -1 → linke. ---- */
function ChapterSlide({ chapter, index, side, start, end, progress, first, enableBlur }) {
  const span = end - start;
  const in0 = first ? 0.0001 : start + span * 0.04;
  const in1 = first ? span * 0.16 : start + span * 0.24;
  const out0 = end - span * 0.16;
  const out1 = end - span * 0.02;

  const opacity = useSpring(useTransform(progress, [in0, in1, out0, out1], [0, 1, 1, 0]), TEXT_SPRING);
  const xs = useSpring(
    useTransform(progress, [in0, in1, out0, out1], [side * 12, 0, 0, side * 15]),
    TEXT_SPRING
  );
  const x = useMotionTemplate`${xs}vw`;
  const blur = useSpring(useTransform(progress, [in0, in1, out0, out1], [9, 0, 0, 13]), TEXT_SPRING);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const rotateY = useSpring(
    useTransform(progress, [in0, in1, out0, out1], [side * -14, 0, 0, side * -10]),
    TEXT_SPRING
  );

  /* scrubbed blur repaints every frame — desktop only, phones keep the
     spring travel and stay at 60fps. Wichtig: auf dem Telefon wird der
     Filter explizit auf "none" gesetzt statt den Style-Key wegzulassen —
     der erste Render läuft mit dem Desktop-Default (blur 9px), und Motion
     räumt entfernte Style-Keys nicht auf. Ohne das friert der Text mobil
     dauerhaft verschwommen ein. */
  return (
    <motion.div
      style={{
        x,
        opacity,
        rotateY,
        transformPerspective: 1200,
        filter: enableBlur ? filter : "none",
        willChange: enableBlur ? "transform, filter" : "transform",
      }}
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

/* ---- Eine Leinwand-Schicht im Rahmen: wird beim Kapitelwechsel von unten
   freigelegt (Wisch + weiches Eintrüben der Kante) und zieht über die
   Kapiteldauer langsam heraus (Ken-Burns). Spätere Kapitel liegen über
   früheren — jede Schicht braucht nur ihren eigenen Auftritt. ---- */
function ArtLayer({ progress, start, span, art, tone, first }) {
  const covered = useSpring(
    useTransform(progress, [start - span * 0.18, start + span * 0.1], [100, 0]),
    REVEAL_SPRING
  );
  const clip = useMotionTemplate`inset(${covered}% 0% 0% 0%)`;
  const opacity = useSpring(
    useTransform(progress, [start - span * 0.18, start - span * 0.04], [0, 1]),
    REVEAL_SPRING
  );
  /* art.zoom vergrößert den Ausschnitt um art.origin — so trägt auch ein
     Querformat-Gemälde einen Hochformat-Rahmen mit dem richtigen Motiv */
  const z = art.zoom ?? 1;
  const scale = useTransform(
    progress,
    [Math.max(start - span * 0.18, 0), start + span],
    [1.14 * z, 1.03 * z]
  );

  return (
    <motion.div
      className="absolute inset-0 will-transform"
      style={first ? undefined : { clipPath: clip, opacity }}
    >
      <motion.img
        src={art.src}
        alt={art.alt ?? `${art.title} — ${art.artist}`}
        className="h-full w-full object-cover"
        style={{
          objectPosition: art.focus ?? "50% 50%",
          transformOrigin: art.origin ?? "50% 50%",
          scale,
          willChange: "transform",
        }}
      />
      {/* Vignette im Kapitelton verankert das Gemälde in der Szene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(165deg, transparent 55%, ${tone}40 100%)`,
          mixBlendMode: "multiply",
        }}
      />
    </motion.div>
  );
}

export default function TasteStory({ wine }) {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  /* Desktop vs. Telefon steuert Reiseweite (vw), Pin-Länge und Blur */
  const [isDesktop, setIsDesktop] = useState(true);
  const amp = isDesktop ? 22 : 13;
  const chapters = wine.taste;
  const n = chapters.length;
  const span = (1 - FINALE) / n;

  /* Gemälde pro Kapitel: explizit aus wineData oder kuratiertes Fallback
     nach Weinfamilie (hell/dunkel über die Luminanz des Farbkapitel-Tons) */
  const artworks = useMemo(() => {
    const family = relLum(chapters[0]?.tone ?? "#888888") > 0.55 ? "light" : "dark";
    return chapters.map((c) => c.artwork ?? TASTE_ART[family][c.key] ?? TASTE_ART[family].farbe);
  }, [chapters]);

  /* Bühne in Pastell: Kapiteltöne weit Richtung Ivory gemischt, damit auch
     dunkle Rotwein-Töne als heller Kinohintergrund lesbar bleiben. */
  const bgColors = useMemo(() => {
    const ivory = "#F6F2E8";
    const t = (i) => chapters[i % n]?.tone ?? "#E8DC9A";
    return [ivory, mixHex(t(0), ivory, 0.5), mixHex(t(1), ivory, 0.55), mixHex(t(2), ivory, 0.6)];
  }, [chapters, n]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const set = () => setIsDesktop(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ---- Rahmen-Choreografie: links → rechts → links → Mitte ---- */
  const { xStops, xVals } = useMemo(() => {
    const stops = [];
    const vals = [];
    for (let i = 0; i < n; i += 1) {
      const s0 = i * span;
      const s1 = (i + 1) * span;
      const rest = i % 2 === 0 ? -amp : amp;
      /* Rastpunkte pro Kapitel; die Übergänge dazwischen überlappen den
         Textabgang — Rahmen und Text wechseln die Seiten im selben Atemzug,
         während im Rahmen das nächste Gemälde freigelegt wird */
      stops.push(i === 0 ? 0 : s0 + span * 0.2, s1 - span * 0.2);
      vals.push(rest, rest);
    }
    stops.push(Math.min(1 - FINALE + FINALE * 0.5, 0.99), 1);
    vals.push(0, 0);
    return { xStops: stops, xVals: vals };
  }, [n, span, amp]);

  const artX = useSpring(useTransform(scrollYProgress, xStops, xVals), X_SPRING);
  const artXvw = useMotionTemplate`${artX}vw`;
  /* Trägheits-Neigung: der Rahmen lehnt sich leicht gegen die Reiserichtung */
  const lean = useSpring(useTransform(useVelocity(artX), [-60, 60], [4, -4], { clamp: true }), {
    stiffness: 110,
    damping: 17,
  });
  /* 3D-Drehung zum Text hin, gespeist aus der (bereits gefederten) Position */
  const rotateY = useTransform(artX, (v) => (amp ? (-v / amp) * 8 : 0));
  /* Firnis-Schimmer wandert gegenläufig zur Reise über die Leinwand */
  const shineX = useTransform(artX, [-25, 25], [72, 28]);
  const sheen = useMotionTemplate`radial-gradient(farthest-corner at ${shineX}% 26%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 38%, transparent 64%)`;
  /* Finale: der Rahmen fährt in die Mitte und wächst sanft heran */
  const zoom = useSpring(useTransform(scrollYProgress, [1 - FINALE + 0.03, 0.97], [0, 1]), {
    stiffness: 55,
    damping: 18,
  });
  const frameScale = useTransform(zoom, [0, 1], [1, 1.15]);

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

  /* Konstante Rahmentöne: Museumsleiste in Bronze-Umbra, Echo-Tafel aus den
     Kapiteltönen des Weins — wirkt für helle wie dunkle Weine */
  const echoFrom = chapters[0]?.tone ?? "#C8B77A";
  const echoTo = chapters[n - 1]?.tone ?? "#8A2B2F";
  const activeArt = artworks[active];
  const activeTone = chapters[active]?.tone ?? "#C8B77A";

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
      /* kürzerer Pin auf dem Telefon — die Geschichte bleibt komplett,
         verlangt aber weniger Daumenweg pro Kapitel */
      style={{ height: `${n * (isDesktop ? 145 : 118) + (isDesktop ? 80 : 50)}vh` }}
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
            artLeft={i % 2 === 0}
          />
        ))}

        <div className="relative mx-auto flex h-full max-w-content flex-col px-6 lg:px-10">
          <div className="pt-24 text-center lg:pt-16">
            <Eyebrow className="justify-center">Der Geschmack</Eyebrow>
            <h2 className="sr-only">Der Geschmack {wine.shortNameGen ?? "der Falanghina"}</h2>
          </div>

          {/* Bühne */}
          <div className="relative min-h-0 flex-1" style={{ perspective: 1400 }}>
            {/* Galerie-Rig: der gerahmte Bildwechsler wandert über die Bühne,
                lehnt sich in die Bewegung und dreht sich leicht zum Text */}
            <motion.div
              style={{ x: artXvw, rotate: lean, scale: frameScale, willChange: "transform" }}
              className="absolute left-1/2 top-[34%] z-10 lg:top-1/2"
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2" style={{ perspective: 1200 }}>
                {/* weiche Lichtaura im Ton des aktiven Kapitels */}
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-colors duration-700"
                  style={{ backgroundColor: `${activeTone}4D` }}
                />
                <motion.figure
                  className="relative will-transform"
                  style={{ rotateY, transformStyle: "preserve-3d", willChange: "transform" }}
                >
                  {/* Echo-Tafel hinter dem Rahmen — die Töne des Weins */}
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-4 -right-4 h-full w-full rounded-[6px] opacity-75"
                    style={{
                      background: `linear-gradient(135deg, ${echoFrom}, ${echoTo})`,
                      transform: "translateZ(-70px) rotate(4deg)",
                    }}
                  />

                  {/* Galerierahmen: Bronze-Umbra-Leiste → Passepartout → Leinwand */}
                  <div
                    className="relative rounded-[6px] p-[9px] sm:p-[11px]"
                    style={{
                      background: "linear-gradient(150deg, #46403A, #14120F)",
                      boxShadow: `0 34px 70px -26px ${echoTo}8C, 0 16px 30px -14px rgba(27,27,27,0.32)`,
                    }}
                  >
                    <div
                      className="rounded-[3px] bg-[#FBF7EF] p-2.5 sm:p-4"
                      style={{ boxShadow: "inset 0 1px 4px rgba(27,27,27,0.2)" }}
                    >
                      <div className="relative aspect-[4/5] h-[30svh] overflow-hidden rounded-[2px] lg:h-[46svh]">
                        {chapters.map((c, i) => (
                          <ArtLayer
                            key={c.key}
                            progress={scrollYProgress}
                            start={i * span}
                            span={span}
                            art={artworks[i]}
                            tone={c.tone}
                            first={i === 0}
                          />
                        ))}
                        {/* Firnis-Schimmer wandert mit der Reise des Rahmens */}
                        <motion.div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0"
                          style={{ background: sheen, mixBlendMode: "soft-light" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Museumsplakette — nennt das sichtbare Werk */}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.figcaption
                      key={chapters[active].key}
                      initial={{ opacity: 0, y: 14, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                      className="absolute -bottom-8 -left-3 z-10 hidden rounded-xl border border-charcoal/10 bg-white/85 px-4 py-2.5 shadow-chip backdrop-blur-md sm:-left-6 sm:block"
                    >
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-charcoal/50">
                        {activeArt.medium ?? "Öl auf Leinwand"}
                      </span>
                      <span className="block max-w-[52vw] font-playfair text-[13px] italic leading-snug text-charcoal sm:max-w-none">
                        „{activeArt.title}“
                      </span>
                      <span className="block text-[10px] text-charcoal/60">
                        {activeArt.artist}
                        {activeArt.year ? `, ${activeArt.year}` : ""}
                      </span>
                    </motion.figcaption>
                  </AnimatePresence>
                </motion.figure>
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
                enableBlur={isDesktop}
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
