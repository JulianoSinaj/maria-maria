"use client";

import { useRef, useState, useEffect } from "react";
import Link from "@/components/i18n/LocaleLink";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import TiltCard from "@/components/motion/TiltCard";
import SplitText from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, GrapeRule } from "@/components/Deco";
import { photoSrcSet } from "@/components/media/Photo";
import { CARD_PHOTO_SIZE as MOMENT_PHOTO_SIZE } from "@/components/magazin/pairingCards";
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

export default function OccasioniTeaser({ t = {}, moments, href, headingId, className = "" }) {
  const reduced = useReducedMotionSafe();
  const [displayIndex, setDisplayIndex] = useState(0);

  /* Scroll-Parallax für die Karte.

     Die Amplitude steht in Pixeln und nicht mehr in Prozent: solange der Drift
     auf einer überstehenden Bildebene lag (-inset-y-[6%]), waren ±5 % genau
     der Weg innerhalb dieses Überstands. Die Ebene deckt sich jetzt mit dem
     Rahmen — dieselben ±5 % wären ±5 % der Kartenhöhe und würden das Motiv aus
     dem Rahmen schieben. 22 px sind Tiefe, die man spürt, ohne dass die Karte
     in die Sektionsränder läuft. */
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const driftRaw = useTransform(scrollYProgress, [0, 1], [22, -22]);
  const drift = useSpring(driftRaw, SCROLL_SPRING);

  /* Rotate through the moments every 3 seconds.
     Bei Reduced Motion steht der Timer komplett still — bisher war nur der
     Zoom gedämpft, das Foto wechselte trotzdem weiter. */
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setDisplayIndex((i) => (i + 1) % (moments?.length || 1));
    }, 3000);
    return () => clearInterval(id);
  }, [moments?.length, reduced]);

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
          <SplitText text={t.title ?? ""} className="block" delay={0.1} />
          <SplitText
            text={t.titleAccent ?? ""}
            className="block italic"
            wordClassName="bg-gradient-to-r from-bordeaux via-wine to-bordeaux bg-clip-text text-transparent"
            delay={0.26}
          />
        </h2>

        <Reveal delay={0.42} y={14}>
          <GrapeRule className="mt-6" />
          <p className="mt-5 max-w-md text-[14px] leading-relaxed text-charcoal/75">{t.text}</p>
        </Reveal>

        <Reveal delay={0.55} y={14} className="mt-8">
          <Button
            href={href}
            variant="premium"
            size="md"
          >
            {t.cta}
          </Button>
        </Reveal>
      </div>

      {/* ================= RIGHT: FEATURED IMAGE ================= */}
      {/* items-center statt der vollen Spaltenhöhe: die Karte trägt jetzt das
          Seitenverhältnis der Motive und darf nicht mehr auf die Höhe der
          Copy-Spalte gedehnt werden — sonst wäre der Zuschnitt zurück. */}
      <div ref={cardRef} className="flex items-center">
        <Reveal delay={0.18} y={26} className="w-full">
          {/* Der Drift trägt die ganze Karte statt einer Bildebene in ihrem
              Inneren: der Rahmen ist deckungsgleich mit dem Motiv, eine
              Verschiebung darin wäre unter `overflow-hidden` unsichtbar — und
              sichtbar gemacht würde sie wieder anschneiden. Die Karte selbst
              schwebt: dieselbe Tiefe, unversehrtes Bild. */}
          <motion.div
            style={reduced ? undefined : { y: drift, willChange: "transform" }}
            className="w-full"
          >
            <TiltCard className="group w-full" max={5} radius="rounded-card-lg">
              <Link
                href={href}
                aria-label={t.ctaAria}
                /* Die Karte hat die Form des Fotos (4:3 aus den Maßen der
                   Pairing-Cards) statt einer festen Höhe: das Motiv liegt
                   vollständig im Rahmen — kein object-cover-Zuschnitt, kein
                   angeschnittener Teller. Der Wert steht als style, weil er aus
                   den Bildmaßen kommt und nicht als Utility geraten werden
                   soll. */
                style={{ aspectRatio: `${MOMENT_PHOTO_SIZE.width} / ${MOMENT_PHOTO_SIZE.height}` }}
                /* Grund in Elfenbein statt Espresso: hinter `object-contain`
                   kann der Grund an den Rändern stehen, sobald ein Motiv vom
                   4:3 abweicht. Ein dunkler Streifen läse sich als Fehler,
                   Elfenbein als Passepartout — wie beim gerahmten Abzug der
                   PairingScene. */
                className="relative block w-full overflow-hidden rounded-card-lg bg-ivory shadow-luxe transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-ivory group-hover:shadow-lift"
              >
                {/* Image stack - all moments remain mounted, fade between them.
                    Die Ebene deckt sich exakt mit dem Rahmen: kein Überstand
                    mehr (-inset-y-[6%] kostete oben und unten je 6 %). */}
                <div aria-hidden="true" className="absolute inset-0">
                  {(moments ?? []).map((m, i) => (
                    <motion.img
                      key={m.key}
                      src={m.img}
                      /* Die Pairing-Cards bringen ihre eigenen WebP-Breiten
                         mit; photoSrcSet bleibt für andere Motive stehen. */
                      srcSet={m.srcSet ?? photoSrcSet(m.img) ?? undefined}
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      width={MOMENT_PHOTO_SIZE.width}
                      height={MOMENT_PHOTO_SIZE.height}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      initial={false}
                      /* Kein Zoom auf dem aktiven Motiv: scale 1.04 schnitt
                         ringsum 2 % weg. Das abtretende Bild darf weiter leicht
                         zurückweichen — im Übergang ist es ohnehin schon
                         durchsichtig. */
                      animate={
                        reduced
                          ? { opacity: displayIndex === i ? 1 : 0, scale: 1 }
                          : { opacity: displayIndex === i ? 1 : 0, scale: displayIndex === i ? 1 : 1.05 }
                      }
                      transition={{ duration: 0.56, ease: EASE }}
                      style={{ willChange: "transform, opacity" }}
                      className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                    />
                  ))}
                </div>

                {/* Der Lesbarkeits-Schleier am Fuß ist entfallen: er stammt aus
                    der Zeit, als der Zuschnitt den unteren Bildrand ohnehin
                    verschluckte. Über einem vollständig sichtbaren Motiv legte
                    er sich als dunkler Balken über echtes Bild — und Text, den
                    er lesbar halten müsste, trägt die Karte keinen. */}
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
          </motion.div>
        </Reveal>
      </div>
    </div>
  );
}
