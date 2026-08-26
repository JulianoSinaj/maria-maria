"use client";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import Button from "@/components/ui/Button";
import ShaderGradient from "@/components/motion/ShaderGradient";
import SplitText from "@/components/motion/SplitText";
import { Eyebrow, GrapeRule } from "@/components/Deco";
import { Aura } from "@/components/Atmosphere";
import { useWines, useLocaleTools, useCommon } from "@/lib/i18n/context";
import { shopHref } from "@/lib/shop/config";
import FalanghinaBottle from "./FalanghinaBottle";

/* Gepinnter Apple-Stil-Hero in zwei Akten.

   Foto-Modus (wine.images.hero gesetzt): das echte Kellerei-Foto trägt die
   komplette Bühne. Akt 1 legt einen Elfenbein-Schleier über die linke Seite,
   Headline und CTAs stehen im Licht. Beim Scrollen fährt die Kamera langsam
   in die Szene (Feder-Zoom), der Schleier hebt sich, das Kino dunkelt ab und
   Akt 2 blendet drei Charakterworte in Elfenbein ein.

   Fallback (kein Foto): illustrierte Flasche im 3D-Raum über ShaderGradient —
   unverändert die Vorlage für Weine ohne Fotografie.

   Reduced motion erhält jeweils einen statischen, vollständigen Hero. */

const SPRING = { stiffness: 60, damping: 19, mass: 0.9 };

/* Alle Scroll-Opacities laufen durch useSpring: nicht nur für den Feder-Look —
   ein reines useTransform(scrollYProgress) würde Framer als ScrollTimeline-
   Animation an den Browser delegieren, und die projiziert bei target-basiertem
   useScroll auf die gesamte Seitenhöhe statt auf die Pin-Strecke (Akt 1 blieb
   dadurch den ganzen Hero über sichtbar). Die Feder erzwingt JS-getriebene
   Frames mit korrektem Fortschritt. */

function Act2Word({ progress, word, index, light = false }) {
  const start = 0.4 + index * 0.09;
  const opacity = useSpring(
    useTransform(progress, [start, start + 0.09, 0.84, 0.94], [0, 1, 1, 0]),
    SPRING
  );
  const y = useSpring(useTransform(progress, [start, start + 0.12], [44, 0]), SPRING);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`block font-playfair text-[clamp(2.8rem,7vw,5.6rem)] leading-[1.04] will-transform ${
        light ? "text-ivory drop-shadow-[0_2px_18px_rgba(20,20,18,0.5)]" : "text-charcoal"
      }`}
    >
      {word}
    </motion.span>
  );
}

/* `photo` kommt als Server-gerendertes <picture> von der Seite herein (siehe
   HeroPhoto). Als children-Prop über die Client-Grenze gereicht, bleibt es im
   initialen HTML — der Preload-Scanner findet das Hero-Foto sofort, statt auf
   die Hydration zu warten. Der Zoom läuft über den motion.div-Wrapper. */
export default function FalanghinaHero({ wine, photo }) {
  const { price: fmtPrice } = useLocaleTools();
  const wines = useWines();
  const winePage = useCommon("winePage");
  const ui = useCommon("ui");
  const sectionRef = useRef(null);
  /* Hydration-sicher: Beide reduzierten Zweige unten (Foto-Hero und
     Standard-Hero) bauen einen anderen DOM als das Server-HTML. */
  const reduced = useReducedMotionSafe();
  const catalog = wines.find((w) => w.name === wine.catalogName);
  const hasPhoto = Boolean(wine.images.hero);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Akt 1 verabschiedet sich nach etwa einem Drittel der Pin-Strecke */
  const act1Opacity = useSpring(useTransform(scrollYProgress, [0, 0.26], [1, 0]), SPRING);
  const act1Y = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, -70]), SPRING);
  const act1Pointer = useTransform(scrollYProgress, (v) => (v > 0.22 ? "none" : "auto"));

  /* Foto-Choreografie — langsamer Kamerazoom in den Keller, federgewichtet */
  const photoScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.04, 1.17]), SPRING);
  const photoY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -28]), SPRING);
  /* Der Elfenbein-Schleier hebt sich, sobald Akt 1 abtritt */
  const veilOpacity = useSpring(useTransform(scrollYProgress, [0, 0.3], [1, 0]), SPRING);
  /* Kino-Abdunklung für Akt 2 — und Aufhellen zum Ausstieg */
  const dimOpacity = useSpring(
    useTransform(scrollYProgress, [0.3, 0.46, 0.86, 0.96], [0, 1, 1, 0]),
    SPRING
  );

  /* Flaschen-Choreografie (Fallback) — Federn statt roher Scroll-Koordinaten */
  const rotateY = useSpring(useTransform(scrollYProgress, [0, 1], [-9, 16]), SPRING);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 1], [3.5, -2]), SPRING);
  const bottleY = useSpring(useTransform(scrollYProgress, [0, 1], [26, -44]), SPRING);
  const bottleScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.02, 0.94]), SPRING);

  /* Der Foto-Hero spiegelt die Textspalte nach rechts (Schleier läuft dort von
     rechts herein). Der Flaschen-Fallback behält die linke Spalte — dort steht
     die Flasche rechts, eine Spiegelung würde Text und Flasche kollidieren
     lassen. `mirror` schaltet deshalb nur die lg-Ausrichtung um. */
  const mirror = hasPhoto;
  const m = (cls) => (mirror ? cls : "");

  const act1Content = (
    <>
      {/* Der Eyebrow ist ein inline-flex-Kasten — `lg:text-right` der Textspalte
          greift bei ihm nicht. Ohne eigene Ausrichtung klebte er im Foto-Modus
          am linken Spaltenrand, während Titel, Rule und CTAs rechts standen.
          Die Flex-Zeile richtet ihn in beiden Modi mit der Headline aus. */}
      <div className={`flex ${m("lg:justify-end")}`}>
        <Eyebrow>{wine.eyebrow}</Eyebrow>
      </div>
      <h1 className="mt-4 font-playfair text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[1.05] text-charcoal">
        <SplitText priority text={wine.heroTitle[0]} className="block" delay={0.12} />
        <SplitText priority
          text={wine.heroTitle[1]}
          className="block italic"
          wordClassName={`bg-gradient-to-r bg-clip-text text-transparent ${
            wine.titleGradient ?? "from-acqua-deep via-[#5E8F53] to-champagne"
          }`}
          delay={0.3}
        />
      </h1>
      <GrapeRule className={`mt-7 hidden sm:flex ${m("lg:justify-end")}`} />
      <p className={`mt-5 max-w-md text-[14px] leading-relaxed text-charcoal/75 sm:mt-6 sm:text-[15px] ${m("lg:ml-auto")}`}>
        {wine.lede}
      </p>
      <div className={`mt-8 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-3.5 ${m("lg:justify-end")}`}>
        <Button href={shopHref(wine.slug)} size="lg" className="w-full sm:w-auto">
          {winePage.heroCtaShop}
        </Button>
        <Button href="#geschmack" variant="outline" size="lg" iconType="none" className="w-full sm:w-auto">
          {winePage.heroCtaTaste}
        </Button>
      </div>
      {catalog && (
        <p className="mt-6 text-[13px] text-charcoal/60">
          <span className="font-semibold tabular-nums text-bordeaux">{fmtPrice(catalog.price)}</span>
          {` ${ui.perBottle ?? ""} · ${winePage.vintage ?? ""} `}
          <span className="tabular-nums">{catalog.year}</span>
        </p>
      )}
      {wine.edition && (
        <p className={`mt-3.5 inline-flex items-center gap-2.5 self-start rounded-full border border-champagne/60 bg-ivory/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/75 backdrop-blur-sm ${m("lg:self-end")}`}>
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-bordeaux" />
          {winePage.limitedEdition} <span className="tabular-nums">{wine.edition}</span>
        </p>
      )}
    </>
  );

  /* ================= Foto-Modus: das echte Kellerfoto als Kino-Bühne ================= */
  if (hasPhoto) {
    /* Schleier für Lesbarkeit: mobil von unten, ab lg von rechts — gespiegelt
       zur Textspalte, damit die Headline auf der hellen Seite steht */
    const veilLayers = (
      <>
        <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/60 to-ivory/10 lg:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-l from-ivory via-ivory/55 to-transparent lg:block" />
      </>
    );

    /* Statischer Hauch Elfenbein am oberen Rand, damit die Navigation
       auch über den dunklen Regalen des Fotos lesbar bleibt */
    const topFade = (
      <div
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory/80 via-ivory/30 to-transparent"
        aria-hidden="true"
      />
    );

    if (reduced) {
      return (
        <section className="grain relative overflow-hidden">
          {photo}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {veilLayers}
          </div>
          {topFade}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory" aria-hidden="true" />
          <div className="relative mx-auto flex min-h-[100svh] max-w-content flex-col justify-end px-6 pb-24 pt-32 lg:justify-center lg:px-10 lg:pb-16">
            <div className="lg:ml-auto lg:max-w-xl">{act1Content}</div>
          </div>
        </section>
      );
    }

    return (
      /* svh statt vh: die einklappende iOS-Adressleiste ändert 1vh mitten im
         Scrollen — die Pin-Strecke wanderte unter dem Daumen und der Fortschritt
         sprang. svh bleibt konstant (Desktop: identisch mit vh). Auf Telefonen
         ist die Strecke kürzer, damit weniger Scroll-Weg vor dem Inhalt liegt. */
      <section ref={sectionRef} className="relative h-[210svh] max-md:h-[175svh]">
        <div className="grain sticky top-0 h-[100svh] overflow-hidden">
          {/* Die Bühne: echtes Foto, langsamer Feder-Zoom in die Szene.
              Der Zoom sitzt auf diesem Wrapper, nicht auf dem <img> selbst —
              so bleibt das Foto server-gerendert und trotzdem animiert. */}
          <motion.div
            style={{ scale: photoScale, y: photoY }}
            className="absolute inset-0 will-transform"
          >
            {photo}
          </motion.div>

          {/* Akt 1 — Elfenbein-Schleier, hebt sich mit der Headline */}
          <motion.div
            style={{ opacity: veilOpacity }}
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            {veilLayers}
          </motion.div>

          {/* Akt 2 — das Kino dunkelt ab, damit die Worte im Licht stehen */}
          <motion.div
            style={{ opacity: dimOpacity }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-l from-charcoal/80 via-charcoal/45 to-charcoal/15"
            aria-hidden="true"
          />

          {topFade}

          {/* Übergang in den Elfenbein-Seitenhintergrund */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory" aria-hidden="true" />

          <div className="relative mx-auto h-full max-w-content px-6 lg:px-10">
            {/* Akt 1 — Headline, Lede, CTAs im Schleierlicht */}
            <motion.div
              style={{ opacity: act1Opacity, y: act1Y, pointerEvents: act1Pointer }}
              className="absolute inset-x-6 inset-y-0 flex flex-col justify-end pb-24 will-transform lg:inset-x-0 lg:ml-auto lg:max-w-xl lg:justify-center lg:pb-10 lg:text-right"
            >
              {act1Content}
            </motion.div>

            {/* Akt 2 — drei Charakterworte in Elfenbein über dem Keller */}
            <div
              className="pointer-events-none absolute inset-x-6 inset-y-0 flex flex-col justify-end pb-24 lg:inset-x-0 lg:justify-center lg:pb-10 lg:text-right"
              aria-hidden="true"
            >
              {wine.heroWords.map((w, i) => (
                <Act2Word key={w} progress={scrollYProgress} word={w} index={i} light />
              ))}
            </div>
          </div>

        </div>
      </section>
    );
  }

  /* ================= Fallback: illustrierte Flasche im 3D-Raum ================= */

  const backdrop = (
    <>
      <ShaderGradient palette="vigna" speed={0.8} />
      <Aura tint="sea" drift={2} className="right-[-12%] top-[-14%] h-[46vw] w-[46vw] opacity-60" />
      <Aura tint="gold" className="bottom-[8%] left-[-10%] h-[38vw] w-[38vw] opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory" aria-hidden="true" />
    </>
  );

  const bottleStage = (
    <div className="relative flex h-full items-center justify-center [perspective:1400px]">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[58%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(69,179,162,0.28),rgba(200,183,122,0.14),transparent)] blur-2xl"
      />
      <motion.div
        style={
          reduced
            ? undefined
            : { rotateY, rotateX, y: bottleY, scale: bottleScale, transformStyle: "preserve-3d" }
        }
        className="will-transform"
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -9, 0] }}
          transition={reduced ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FalanghinaBottle
            photoSrc={wine.images.front}
            className="h-[46vh] drop-shadow-[0_44px_44px_rgba(30,36,16,0.32)] sm:h-[52vh] lg:h-[62vh]"
          />
        </motion.div>
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute bottom-[6%] left-1/2 h-4 w-44 -translate-x-1/2 rounded-[100%] bg-charcoal/20 blur-md"
      />
    </div>
  );

  /* ---- Reduced motion: ein ruhiger, vollständiger Hero ohne Pin ---- */
  if (reduced) {
    return (
      <section className="grain relative overflow-hidden">
        {backdrop}
        <div className="relative mx-auto grid min-h-[100svh] max-w-content grid-cols-1 items-center gap-10 px-6 pb-16 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-36">
          <div>{act1Content}</div>
          <div className="h-[60vh]">{bottleStage}</div>
        </div>
      </section>
    );
  }

  return (
    /* svh + kürzere Telefon-Strecke — gleiche Begründung wie im Foto-Modus */
    <section ref={sectionRef} className="relative h-[210svh] max-md:h-[175svh]">
      <div className="grain sticky top-0 h-[100svh] overflow-hidden">
        {backdrop}

        <div className="relative mx-auto grid h-full max-w-content grid-cols-1 grid-rows-[42svh_1fr] lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-1 lg:px-10">
          {/* linke Spalte — Akt 1 und Akt 2 übereinander */}
          <div className="relative order-2 min-h-0 lg:order-1">
            <motion.div
              style={{ opacity: act1Opacity, y: act1Y, pointerEvents: act1Pointer }}
              className="absolute inset-x-6 bottom-6 top-4 flex flex-col justify-center will-transform lg:inset-x-0 lg:bottom-8 lg:top-28"
            >
              {act1Content}
            </motion.div>

            <div
              className="pointer-events-none absolute inset-x-6 bottom-6 top-4 flex flex-col justify-center lg:inset-x-0 lg:bottom-8 lg:top-28"
              aria-hidden="true"
            >
              {wine.heroWords.map((w, i) => (
                <Act2Word key={w} progress={scrollYProgress} word={w} index={i} />
              ))}
            </div>
          </div>

          {/* rechte Spalte — die Flasche bleibt während des gesamten Pins präsent */}
          <div className="order-1 h-full min-h-0 pt-20 lg:order-2 lg:pt-24">{bottleStage}</div>
        </div>

      </div>
    </section>
  );
}
