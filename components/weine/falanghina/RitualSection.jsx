"use client";
import { motion, useReducedMotion } from "motion/react";
import { Eyebrow, GoldRule } from "@/components/Deco";
import { Aura } from "@/components/Atmosphere";
import Parallax from "@/components/motion/Parallax";
import { useTouchDevice } from "@/components/motion/useMediaQuery";

/* „Servieren & Genießen" — das Genuss-Kapitel als harte Zweiteilung:
   links eine massive Espresso-Texttafel, rechts das Foto randlos über die
   halbe Bandbreite. Kein Scrim über dem Motiv, keine Karten — die Kante
   zwischen Tafel und Bild trägt die Sektion.

   Die Tafel ist bewusst schmal gehalten: Eyebrow → Serif-Titel → der
   Maria-Moment als Fließtext, mehr nicht. Keine Badges, kein CTA — dadurch
   bleibt die Sektion flach. Sie liest weiter den wine.moment-Block; fehlt
   moment.serve, rendert sie nicht, fehlt moment.maria, entfällt der Text.

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

export default function RitualSection({ wine }) {
  const moment = wine.moment;
  if (!moment?.serve) return null;
  const photo = moment.photo ?? MOMENT_BG;

  const title = moment.title ?? `So schmeckt ${wine.shortNameNom ?? "dieser Wein"} am besten`;

  return (
    <section
      id="servieren"
      className="relative scroll-mt-36 overflow-hidden bg-espresso"
    >
      {/* Zweiteilung: unter lg stapeln Tafel und Foto, ab lg stehen sie als
          harte Kante nebeneinander — beide Hälften gleich hoch, weil das
          Grid die Zeile streckt. */}
      <div className="grid lg:grid-cols-2">
        {/* ---- Linke Hälfte: die Espresso-Texttafel ---- */}
        <div className="grain relative flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-11 lg:py-12 lg:pl-[max(2.5rem,calc((100vw-1200px)/2))] lg:pr-14">
          {/* warme Goldnote in der Tafel, damit die Fläche nicht tot wirkt */}
          <Aura tint="gold" className="left-[-22%] top-[-18%] h-[26rem] w-[26rem] opacity-[0.18]" />
          <Aura tint="wine" drift={2} className="bottom-[-24%] left-[-16%] h-[24rem] w-[24rem] opacity-25" />

          <div className="relative max-w-[34rem]">
            <Rise>
              <Eyebrow light>Servieren &amp; Genießen</Eyebrow>
              <h2 className="mt-3 text-balance font-playfair text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.06] text-ivory">
                {title}
              </h2>
              <GoldRule className="mt-4 w-28" />
            </Rise>

            {/* Der Maria-Moment — in der Referenz der ruhige Fließtext unter
                der Headline, kein Zitatkörper */}
            {moment.maria?.text && (
              <Rise delay={0.08} className="mt-5">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.26em] text-champagne">
                  Der Maria-Moment
                </p>
                <p className="mt-2 max-w-[30rem] text-[14px] leading-[1.6] text-ivory/75">
                  {moment.maria.text}
                </p>
              </Rise>
            )}
          </div>
        </div>

        {/* ---- Rechte Hälfte: das Foto, randlos und ungefiltert ----
             Kein Scrim mehr über dem Motiv: die Lesbarkeit trägt jetzt die
             Tafel links. Nur an der Kante zur Tafel ein schmaler Verlauf,
             damit der Schnitt nicht hart abreißt. Beim gestapelten Layout
             gibt eine feste Höhe dem Bild seine Bühne, ab lg füllt es die
             Zeile (inset-0 über der gestreckten Zelle). */}
        <div className="relative min-h-[13rem] sm:min-h-[15rem] lg:min-h-0">
          <div className="absolute inset-0 overflow-hidden">
            <Parallax speed={0.08} overscan className="h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </Parallax>
            {/* weiche Naht an der Schnittkante — oben im gestapelten,
                links im geteilten Layout */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-20 lg:hidden"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(33,21,17,0.85) 0%, rgba(33,21,17,0.3) 55%, rgba(33,21,17,0) 100%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 hidden w-24 lg:block"
              style={{
                background:
                  "linear-gradient(to right, rgba(33,21,17,0.8) 0%, rgba(33,21,17,0.28) 55%, rgba(33,21,17,0) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
