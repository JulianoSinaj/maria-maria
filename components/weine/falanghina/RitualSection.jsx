"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useSpring, useReducedMotion } from "motion/react";
import { Eyebrow, GoldRule } from "@/components/Deco";
import { Aura } from "@/components/Atmosphere";
import Parallax from "@/components/motion/Parallax";
import { ACCENT_FALLBACK } from "./accent";
import { useTouchDevice } from "@/components/motion/useMediaQuery";
import { Arrow } from "@/components/Icons";
import { WINE_ICON } from "./WineIcons";

/* „Servieren & Genießen" — das Genuss-Kapitel als immersive Foto-Bühne im
   Stil des Herkunftskapitels (PlaceSection): keine Karten mehr, das Bild
   trägt die ganze Sektion. Darüber liegen ein Espresso-Farb-Grade für
   Lesbarkeit und weiche Kanten, die ins Elfenbein der Nachbarsektionen
   blenden.

   Dramaturgie von oben nach unten: Titel → das Ritual als graviertes
   Schritt-Band auf einer Goldhairline (nummeriert, nicht eingerahmt) →
   darunter der Maria-Moment als großes Zitat, das die Sektion emotional
   schließt. Beide lesen weiter denselben wine.moment-Block; fehlt
   moment.serve, rendert die Sektion nicht, fehlt moment.maria, entfällt
   das Zitat.

   Hintergrundbild: moment.photo überschreibt pro Wein, sonst das
   gemeinsame Abendlicht-Foto. Später genügt ein moment.photo im wineData,
   um jedem Wein sein eigenes Bild zu geben — an der Sektion ändert sich
   dafür nichts. */

const MOMENT_BG = "/img/home/moment-bg.jpg";

const SPRING = { type: "spring", stiffness: 90, damping: 19, mass: 0.9 };
const EASE = [0.16, 1, 0.3, 1];

/* Aufstieg aus der Tiefe — federgedämpft, auf Touch ohne Blur (animierter
   Blur kostet mobile GPUs zu viel). */
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

/* Ein Ritualschritt — Ziffer, Icon, Zeile. Hängt an einer Goldhairline, die
   die Schritte als Sequenz liest; auf Hover hebt sich der Schritt leicht und
   die Hairline darüber leuchtet auf. Kein Rahmen, kein Kartenkörper. */
function RitualStep({ item, index }) {
  const Icon = WINE_ICON[item.icon];
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { ...SPRING, opacity: { duration: 0.5 }, filter: { duration: 0.55 } },
        },
      }}
      className="group/step relative pt-5"
    >
      {/* Hairline über dem Schritt — der Faden, auf dem die Sequenz läuft */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-ivory/20 transition-colors duration-400 ease-out-expo group-hover/step:bg-champagne/70"
      />
      {/* Gravierte Schrittziffer, die auf der Hairline sitzt */}
      <span
        aria-hidden="true"
        className="absolute -top-[9px] left-0 pr-3 font-playfair text-[13px] italic leading-none text-champagne/70 transition-colors duration-400 ease-out-expo group-hover/step:text-champagne"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex items-start gap-3.5 transition-transform duration-400 ease-out-expo group-hover/step:-translate-y-1">
        {Icon && (
          <span
            className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ivory/15 bg-ivory/[0.06] text-champagne transition-colors duration-400 ease-out-expo group-hover/step:border-champagne/40"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-[9.5px] font-semibold uppercase tracking-[0.2em] text-champagne/80">
            {item.title}
          </span>
          <span className="mt-1 block font-playfair text-[0.95rem] leading-snug text-ivory">
            {item.text}
          </span>
        </span>
      </div>
    </motion.li>
  );
}

/* Magnetischer CTA — folgt dem Cursor innerhalb der Button-Grenzen. Auf der
   Foto-Bühne als Outline-Pille, die sich beim Hover in Gold füllt. */
function MagneticCta({ href, children, accent }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMove = (e) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
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
          <span
            aria-hidden="true"
            className="absolute inset-0 scale-0 rounded-full transition-transform duration-400 ease-out-expo group-hover/cta:scale-105"
            style={{
              background: `linear-gradient(120deg, ${accent.light}, ${accent.base})`,
              willChange: "transform",
            }}
          />
          <span className="relative">{children}</span>
          <Arrow className="relative h-4 w-4 transition-transform duration-400 ease-out-expo group-hover/cta:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function RitualSection({ wine }) {
  const moment = wine.moment;
  if (!moment?.serve) return null;
  const accent = moment.accent ?? wine.accent ?? ACCENT_FALLBACK;
  const photo = moment.photo ?? MOMENT_BG;

  return (
    <section id="servieren" className="grain relative scroll-mt-36 overflow-hidden">
      {/* ---- Foto-Bühne: federnd driftend, warm abgedunkelt ---- */}
      <div aria-hidden="true" className="absolute inset-0">
        <Parallax speed={0.08} overscan className="h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover brightness-[0.92] saturate-[1.08]"
          />
        </Parallax>
        {/* Warmer Farb-Grade statt flachem Schleier: der Lese-Scrim liegt
            jetzt seitlich — links, wo Titel und Zitat stehen, deckt er am
            stärksten und öffnet nach rechts das Motiv (die Flasche im
            freien Kanal zwischen den Spalten). Darunter ein sanfter
            Vertikalverlauf, der die Ritual-Spalte rechts trägt; alle
            Verläufe mehrstufig, damit nirgends eine Kante entsteht */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(33,21,17,0.9) 0%, rgba(38,21,18,0.82) 30%, rgba(48,22,20,0.6) 56%, rgba(33,21,17,0.42) 78%, rgba(33,21,17,0.34) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(33,21,17,0.3) 0%, rgba(33,21,17,0.1) 42%, rgba(33,21,17,0.46) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 38%, transparent 48%, rgba(33,21,17,0.42) 100%)",
          }}
        />
        {/* Kanten blenden weich ins Elfenbein der Nachbarsektionen */}
        <div
          className="absolute inset-x-0 top-0 h-16"
          style={{
            background:
              "linear-gradient(to bottom, #F7F4EF 0%, rgba(247,244,239,0.55) 38%, rgba(247,244,239,0.18) 72%, rgba(247,244,239,0) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-14"
          style={{
            background:
              "linear-gradient(to top, #F7F4EF 0%, rgba(247,244,239,0.55) 38%, rgba(247,244,239,0.18) 72%, rgba(247,244,239,0) 100%)",
          }}
        />
      </div>

      {/* warme Goldnote über dem Abendlicht */}
      <Aura tint="gold" className="right-[-14%] top-[-20%] h-[34rem] w-[34rem] opacity-25" />
      <Aura tint="wine" drift={2} className="bottom-[-26%] left-[-12%] h-[30rem] w-[30rem] opacity-30" />

      {/* ---- Inhalt ----
           Zweispaltiger Verbund statt drei gestapelter Halbbreiten-Blöcke:
           links die Erzählung (Titel → Zitat → CTA), rechts als schmale
           Spalte das Ritual, dessen Schritte jetzt untereinander laufen.
           Dadurch trägt der Satz die volle Rahmenbreite, die Sektion wird
           deutlich flacher — und zwischen den Spalten bleibt der Kanal frei,
           in dem die Flasche des Fotos steht. */}
      <div className="relative mx-auto max-w-content px-6 py-14 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_clamp(15rem,24vw,19rem)] lg:items-start lg:gap-x-16">
          {/* ---- Linke Spalte: Titel, Zitat, CTA ---- */}
          <div>
            <Rise>
              <Eyebrow light>Servieren &amp; Genießen</Eyebrow>
              <h2 className="mt-3.5 text-balance font-playfair text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.06] text-ivory">
                {moment.title ?? `So schmeckt ${wine.shortNameNom ?? "dieser Wein"} am besten`}
              </h2>
              <GoldRule className="mt-5 w-32" />
            </Rise>

            {/* Der Maria-Moment schließt direkt an den Titel an — großes
                Zitat, kein Kartenkörper */}
            {moment.maria?.text && (
              <Rise delay={0.08} className="mt-9 lg:mt-11">
                <div className="relative">
                  {/* übergroßes Anführungszeichen als stille Marke */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-1 -top-9 select-none font-playfair text-[6.5rem] leading-none text-champagne/15 lg:-left-6 lg:-top-12 lg:text-[8.5rem]"
                  >
                    &ldquo;
                  </span>
                  <p className="relative text-[11px] font-semibold uppercase tracking-[0.26em] text-champagne">
                    Der Maria-Moment
                  </p>
                  <blockquote className="relative mt-4 max-w-[38rem] text-balance font-playfair text-[clamp(1.35rem,2.5vw,2rem)] italic leading-[1.28] text-ivory">
                    {moment.maria.text}
                  </blockquote>
                  <div className="relative mt-7">
                    <MagneticCta href={moment.maria.link?.href ?? "/shop"} accent={accent}>
                      {moment.maria.link?.label ?? "Mehr entdecken"}
                    </MagneticCta>
                  </div>
                </div>
              </Rise>
            )}
          </div>

          {/* ---- Rechte Spalte: das Ritual als gravierte Schritt-Leiste ---- */}
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -6% 0px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
            }}
            className="flex flex-col gap-6 sm:gap-7 lg:gap-8"
          >
            {moment.serve.items.map((item, i) => (
              <RitualStep key={item.title} item={item} index={i} />
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
