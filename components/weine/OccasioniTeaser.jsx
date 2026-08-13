"use client";

import { useRef, useState, useEffect } from "react";
import Link from "@/components/i18n/LocaleLink";
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
   that introduces the concept and invites exploration. The hero image cycles
   through the moments on a timer, and a single prominent CTA guides users to
   the magazine's food pairing section where all occasions are displayed
   interactively.
   
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

  /* Rotate through the moments every 2 seconds.
     Bei Reduced Motion steht der Timer komplett still — bisher war nur der
     Zoom gedämpft, das Foto wechselte trotzdem alle 2 s weiter. */
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setDisplayIndex((i) => (i + 1) % moments.length);
    }, 2000);
    return () => clearInterval(id);
  }, [moments.length, reduced]);

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
