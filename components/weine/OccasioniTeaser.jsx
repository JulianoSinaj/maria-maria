"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import TiltCard from "@/components/motion/TiltCard";
import SplitText from "@/components/motion/SplitText";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Eyebrow, GrapeRule } from "@/components/Deco";
import { photoSrcSet } from "@/components/media/Photo";
import { SCROLL_SPRING } from "@/components/motion/springs";
import { Arrow } from "@/components/Icons";

/* Occasioni-Teaser — die redaktionelle Doppelseite der Weine-Seite:
   links die Schlagzeile und ein Index der drei Anlässe, rechts eine hohe
   Foto-Karte, die auf den Index antwortet. Wer eine Index-Zeile berührt,
   blendet das Kartenfoto auf den Anlass um — Liste und Bild führen ein
   Gespräch, bevor beide gemeinsam ins Food-Pairing-Kapitel des Magazins
   springen (`href`).

   Motion-Vertrag:
   - Foto-Überblendung: 560 ms auf cubic-bezier(0.4, 0, 0.2, 1) — dieselbe
     Uhr wie der Moments-Expander im Magazin; der eingehende Anlass kommt
     aus einem leichten Overscan (scale 1.1 → 1.04) zur Ruhe.
   - Scroll-Drift: das Foto hängt an einer SCROLL_SPRING-Feder (±5 % der
     Kartenhöhe), nie an rohen Scroll-Koordinaten.
   - Index-Zeilen: Ziffer färbt sich Bordeaux, der Titel gleitet 6 px, eine
     Champagner-Linie zieht sich zum Rand, der Pfeil taucht auf — alles
     transform/opacity, kein Layout-Shift.
   - Karte: TiltCard-Perspektive mit Glare, Schatten vertieft sich.
   Bei prefers-reduced-motion stehen Fotos und Zeilen still. */

const EASE = [0.4, 0, 0.2, 1];
const SWAP = { duration: 0.56, ease: EASE };
const INSTANT = { duration: 0 };

export default function OccasioniTeaser({ moments, href, headingId, className = "" }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  /* Scroll-Parallax des Kartenfotos — eigene Feder, Overscan liegt im
     Foto-Stack (-inset-y), damit der Drift nie eine Kante freigibt. */
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const driftRaw = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const drift = useSpring(driftRaw, SCROLL_SPRING);

  const current = moments[active];

  return (
    <div
      className={`grid grid-cols-1 items-stretch gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16 ${className}`}
    >
      {/* ================= LINKS: SCHLAGZEILE & ANLASS-INDEX ============== */}
      <div className="flex flex-col justify-center">
        <Reveal y={16} delay={0.05}>
          <Eyebrow>Occasioni</Eyebrow>
        </Reveal>

        <h2
          id={headingId}
          className="mt-5 font-playfair text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.08] tracking-[-0.01em] text-charcoal"
        >
          <SplitText text="Jeder Anlass" className="block" delay={0.1} />
          <SplitText
            text="hat seinen Wein."
            className="block italic"
            wordClassName="bg-gradient-to-r from-bordeaux via-wine to-bordeaux bg-clip-text text-transparent"
            delay={0.26}
          />
        </h2>

        <Reveal delay={0.42} y={14}>
          <GrapeRule className="mt-6" />
          <p className="mt-5 max-w-md text-[14px] leading-relaxed text-charcoal/75">
            Was Maria Maria zu Ihrem Anlass empfiehlt — vom ersten Aperitivo im Abendlicht bis
            zum langen Abend mit Freunden. Die passenden Pairings kuratieren wir im Magazin.
          </p>
        </Reveal>

        {/* Der Index: drei Zeilen, Haarlinien dazwischen — jede Zeile ist der
            Link ins Magazin und stellt im Vorbeigehen das Kartenfoto um. */}
        <Stagger className="mt-9 border-t border-charcoal/10" delay={0.2} gap={0.09}>
          {moments.map((m, i) => {
            const isActive = active === i;
            return (
              <StaggerItem key={m.title}>
                <Link
                  href={href}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-label={`${m.title} — Empfehlungen im Magazin entdecken`}
                  className="group/row relative flex items-center gap-5 border-b border-charcoal/10 py-4 outline-none focus-visible:ring-2 focus-visible:ring-champagne/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:py-5"
                >
                  <span
                    className={`w-7 shrink-0 font-playfair text-[15px] italic transition-colors duration-300 ${
                      isActive ? "text-bordeaux" : "text-champagne"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`flex items-baseline gap-4 font-playfair text-[20px] transition-[transform,color] duration-500 ease-out-expo sm:text-[22px] ${
                        isActive ? "translate-x-1.5 text-bordeaux" : "translate-x-0 text-charcoal"
                      }`}
                      style={{ willChange: "transform" }}
                    >
                      {m.title}
                      {/* Konnektor-Linie: zieht sich zur Karte hinüber */}
                      <span
                        aria-hidden="true"
                        className={`h-px max-w-[76px] flex-1 origin-left bg-gradient-to-r from-champagne to-transparent transition-[transform,opacity] duration-500 ease-out-expo ${
                          isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                        }`}
                      />
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-charcoal/55">
                      {m.text}
                    </span>
                  </span>
                  <Arrow
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-bordeaux transition-[transform,opacity] duration-500 ease-out-expo ${
                      isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                    }`}
                  />
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>

      {/* ================= RECHTS: DIE ANTWORT-KARTE ====================== */}
      <div ref={cardRef} className="h-full">
        <Reveal delay={0.18} y={26} className="h-full">
          <TiltCard className="group h-full" max={5} radius="rounded-card-lg">
            <Link
              href={href}
              aria-label="Zu den Food-Pairing-Empfehlungen im Magazin"
              className="relative block h-[400px] overflow-hidden rounded-card-lg bg-espresso shadow-luxe transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-ivory group-hover:shadow-lift sm:h-[460px] lg:h-full lg:min-h-[540px]"
            >
              {/* Foto-Stack: alle drei Anlässe bleiben gemountet und blenden
                  über — der Drift-Wrapper trägt den Overscan */}
              <motion.div
                aria-hidden="true"
                style={reduced ? undefined : { y: drift, willChange: "transform" }}
                className="absolute -inset-y-[6%] inset-x-0"
              >
                {moments.map((m, i) => (
                  <motion.img
                    key={m.title}
                    src={m.img}
                    srcSet={photoSrcSet(m.img) ?? undefined}
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    initial={false}
                    animate={
                      reduced
                        ? { opacity: active === i ? 1 : 0, scale: 1.04 }
                        : { opacity: active === i ? 1 : 0, scale: active === i ? 1.04 : 1.1 }
                    }
                    transition={reduced ? INSTANT : SWAP}
                    style={{ willChange: "transform, opacity" }}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                ))}
              </motion.div>

              {/* Lesbarkeits-Scrim hinter der Glas-Leiste */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-espresso/85 via-espresso/30 to-transparent"
              />
              {/* Klick-Feedback: leichter Schleier vor der Navigation */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-ivory/10 opacity-0 transition-opacity duration-150 ease-out group-active:opacity-100"
              />

              <span className="glass absolute left-5 top-5 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                Magazin · Food Pairing
              </span>

              {/* Dunkle Liquid-Glass-Leiste — dieselbe Handschrift wie die
                  Detail-Leiste des Moments-Expanders im Magazin */}
              <div className="absolute inset-x-4 bottom-4 lg:inset-x-5 lg:bottom-5">
                <div className="glass-dark relative overflow-hidden rounded-[22px] px-6 py-5 lg:px-7">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-1/4 -top-3/4 h-[170%] w-2/3 rotate-12 bg-gradient-to-b from-white/10 to-transparent blur-2xl"
                  />
                  <div className="relative flex items-center justify-between gap-6">
                    <div className="min-w-0">
                      {/* Die Zeile antwortet dem Index: Tag und Anlass des
                          gerade aktiven Moments */}
                      <motion.p
                        key={active}
                        initial={reduced ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className="truncate text-[10px] uppercase tracking-[0.25em] text-champagne-light"
                      >
                        {current.tag} <span aria-hidden="true">·</span> {current.title}
                      </motion.p>
                      <h3 className="mt-1 font-playfair text-[clamp(20px,1.8vw,26px)] text-ivory">
                        Pairings
                      </h3>
                    </div>
                    <p className="inline-flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory">
                      <span className="hidden sm:inline">Zu den Empfehlungen</span>
                      <span className="sm:hidden">Entdecken</span>
                      <Arrow
                        aria-hidden="true"
                        className="h-3.5 w-3.5 transition-transform duration-[250ms] ease-out group-hover:translate-x-[5px]"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </TiltCard>
        </Reveal>
      </div>
    </div>
  );
}
