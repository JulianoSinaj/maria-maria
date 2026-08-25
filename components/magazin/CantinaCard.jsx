"use client";
import Link from "@/components/i18n/LocaleLink";
import { motion, useReducedMotion } from "motion/react";
import { Arrow } from "@/components/Icons";

/* Eine Karte der Cantina-Galerie — das Food-Pairing-Foto, das auf der
   Wein-Landingpage den Hero stellt, als Bühne; der Text auf einem
   Espresso-Schleier links, die ganze Karte ein Link.

   Typografie wie im Heft: die Karte nennt nur den Namen, ohne Zählmarke —
   die Reihenfolge liest das Auge aus dem Raster. Alle Karten sind gleich
   breit und gleich hoch; keine tritt vor eine andere.

   Die Motion folgt dem Food-Pairing-Card-Guide, nicht der 3D-Sprache der
   übrigen Karten (bewusst KEIN TiltCard, keine Perspektiv-Rotation):
   - Hover: Karte hebt sich 5 px, Schatten vertieft sich, das Bild skaliert
     dezent auf 1.035, der Schleier dunkelt für die Lesbarkeit nach.
   - CTA: der Pfeil wandert 5 px nach rechts, eine haarfeine Linie zieht
     sich von den Aromen-Worten Richtung Flasche (Opazität 0 → 100 %).
   - Klick: ein leichter Elfenbein-Schleier quittiert den Tap (150 ms),
     dann navigiert die Karte auf die Landingpage des Weins.
   - Alle Dauern 150–250 ms mit Ease-out; bei prefers-reduced-motion
     entfällt die Hebung, die Karte bleibt ein ruhiger Link. */

const LIFT_SPRING = { type: "spring", stiffness: 320, damping: 26, mass: 0.7 };

export default function CantinaCard({ wine }) {
  const reduced = useReducedMotion();

  return (
    /* Hover-Sensorik auf dem ruhenden Wrapper, gehoben wird das Kind — sonst
       flackern enter/leave an der Unterkante, sobald die Karte sich hebt. */
    <motion.div
      className="group relative h-full"
      initial="rest"
      {...(reduced ? {} : { whileHover: "hover", whileTap: "tap", animate: "rest" })}
    >
      <motion.div
        variants={
          reduced
            ? undefined
            : { rest: { y: 0, scale: 1 }, hover: { y: -5, scale: 1 }, tap: { y: -2, scale: 0.99 } }
        }
        transition={LIFT_SPRING}
        className="h-full"
        style={{ willChange: "transform" }}
      >
        <Link
          href={`/unsere-weine/${wine.slug}`}
          className="relative block h-[210px] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream group-hover:shadow-lift sm:h-[230px]"
        >
          <picture className="contents">
            <source
              type="image/webp"
              srcSet={wine.photoSrcSet}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wine.photoSrc}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[250ms] ease-out group-hover:scale-[1.035]"
            />
          </picture>

          {/* Schleier von links + Fuß — der Text sitzt dort, wo er steht */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/40 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-espresso/70 to-transparent"
          />
          {/* Hover: Schleier dunkelt für die Lesbarkeit nach */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-espresso/25 opacity-0 transition-opacity duration-[250ms] ease-out group-hover:opacity-100"
          />
          {/* Klick-Feedback: leichter Schleier vor der Navigation */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-ivory/10 opacity-0 transition-opacity duration-150 ease-out group-active:opacity-100"
          />

          <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
            <div className="max-w-[16rem]">
              <h3 className="font-playfair text-[clamp(1.15rem,1.6vw,1.35rem)] leading-snug text-ivory">
                {wine.name}
              </h3>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne-light">
                {wine.region} <span aria-hidden="true">·</span> {wine.color}
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-ivory/85">{wine.words}</p>
              {/* Konnektor-Linie: zieht sich beim Hover Richtung Flasche */}
              <span
                aria-hidden="true"
                className="mt-3 block h-px w-24 origin-left scale-x-0 bg-gradient-to-r from-champagne-light/80 to-transparent opacity-0 transition-[transform,opacity] duration-[250ms] ease-out group-hover:scale-x-100 group-hover:opacity-100"
              />
            </div>
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory">
              Wein entdecken
              <Arrow
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-[250ms] ease-out group-hover:translate-x-[5px]"
              />
            </p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
