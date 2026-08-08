"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import TiltCard from "@/components/motion/TiltCard";
import SplitText from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, GrapeRule } from "@/components/Deco";
import { photoSrcSet } from "@/components/media/Photo";
import { SCROLL_SPRING } from "@/components/motion/springs";
import { Arrow } from "@/components/Icons";
import Button from "@/components/ui/Button";

/* Occasioni-Teaser — streamlined version:
   Instead of listing all 3 occasions, this version creates an editorial moment
   that introduces the concept and invites exploration. The hero image shifts
   based on scroll, and a single prominent CTA guides users to the magazine's
   food pairing section where all occasions are displayed interactively.
   
   This creates better narrative flow: "look at this beautiful moment" → 
   "discover the different wine pairings" → [magazine's interactive moments].
*/

const EASE = [0.4, 0, 0.2, 1];

export default function OccasioniTeaser({ moments, href, headingId, className = "" }) {
  const reduced = useReducedMotion();
  const [displayIndex, setDisplayIndex] = useState(0);

  /* Scroll-Parallax for the featured image */
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const driftRaw = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const drift = useSpring(driftRaw, SCROLL_SPRING);

  /* Rotate through moments based on scroll */
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setDisplayIndex(Math.floor(v * moments.length) % moments.length);
    });
    return unsubscribe;
  }, [scrollYProgress, moments.length]);

  const current = moments[displayIndex];

  return (
    <div className={`grid grid-cols-1 items-stretch gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16 ${className}`}>
      {/* ================= LEFT: EDITORIAL NARRATIVE ================= */}
      <div className="flex flex-col justify-center">
        <Reveal y={16} delay={0.05}>
          <Eyebrow>Occasioni</Eyebrow>
        </Reveal>

        <h2
          id={headingId}
          className="mt-5 font-playfair text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.08] tracking-[-0.01em] text-charcoal"
        >
          <SplitText text="Zu jedem Moment" className="block" delay={0.1} />
          <SplitText
            text="der richtige Wein."
            className="block italic"
            wordClassName="bg-gradient-to-r from-bordeaux via-wine to-bordeaux bg-clip-text text-transparent"
            delay={0.26}
          />
        </h2>

        <Reveal delay={0.42} y={14}>
          <GrapeRule className="mt-6" />
          <p className="mt-5 max-w-md text-[14px] leading-relaxed text-charcoal/75">
            Aperitivo im Abendlicht. Ein eleganter Dinner. Ein langer Abend mit Freunden. 
            Maria Maria hat für jeden dieser Momente die passenden Pairings kuratiert — 
            entdecken Sie im Magazin, welche Weine Ihre Anlässe begleiten.
          </p>
        </Reveal>

        <Reveal delay={0.55} y={14} className="mt-8">
          <Button
            href={href}
            variant="premium"
            size="md"
          >
            Die Pairings entdecken
          </Button>
        </Reveal>

        {/* Moment indicators — subtle dots showing the 3 occasions available */}
        <Reveal delay={0.65} y={12} className="mt-10">
          <div className="flex items-center gap-3">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-charcoal/50">
              3 Genussmomente
            </span>
            <div className="flex gap-2">
              {moments.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === displayIndex ? "w-5 bg-bordeaux" : "w-1.5 bg-champagne/50"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ================= RIGHT: FEATURED IMAGE ================= */}
      <div ref={cardRef} className="h-full">
        <Reveal delay={0.18} y={26} className="h-full">
          <TiltCard className="group h-full" max={5} radius="rounded-card-lg">
            <Link
              href={href}
              aria-label="Zu den Food-Pairing-Empfehlungen im Magazin"
              className="relative block h-[400px] overflow-hidden rounded-card-lg bg-espresso shadow-luxe transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-ivory group-hover:shadow-lift sm:h-[460px] lg:h-full lg:min-h-[540px]"
            >
              {/* Image stack - all moments remain mounted, fade between them */}
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
                        ? { opacity: displayIndex === i ? 1 : 0, scale: 1.04 }
                        : { opacity: displayIndex === i ? 1 : 0, scale: displayIndex === i ? 1.04 : 1.1 }
                    }
                    transition={{ duration: 0.56, ease: EASE }}
                    style={{ willChange: "transform, opacity" }}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                ))}
              </motion.div>

              {/* Readability scrim */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-espresso/85 via-espresso/30 to-transparent"
              />
              {/* Click feedback */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-ivory/10 opacity-0 transition-opacity duration-150 ease-out group-active:opacity-100"
              />

              <span className="glass absolute left-5 top-5 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                Magazin · Food Pairing
              </span>

              {/* Bottom card label */}
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
                      <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-light" style={{ opacity: 1, transform: "none" }}>
                        Moment {String(displayIndex + 1).padStart(2, "0")} · {current.title}
                      </p>
                      <h3 className="mt-1 font-playfair text-[clamp(20px,1.8vw,26px)] text-ivory">
                        Genussmoment
                      </h3>
                    </div>
                    <p className="inline-flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory">
                      <span className="hidden sm:inline">Entdecken</span>
                      <Arrow aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-[250ms] ease-out group-hover:translate-x-[5px]" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(420px, rgba(255, 246, 220, 0.28), transparent 62%)" }}
              />
            </Link>
          </TiltCard>
        </Reveal>
      </div>
    </div>
  );
}
