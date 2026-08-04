"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import { useTouchDevice } from "@/components/motion/useMediaQuery";
import {
  pushEvent,
  WINE_SHOP_CLICK,
  FOOD_PAIRING_VIEW,
  REGION_LINK_CLICK,
  CTA_POSITION,
  pageLanguage,
} from "@/lib/analytics";

/* „Der Maria-Maria-Moment" — die eine Szene, die den Wein greifbar macht.

   Aufbau exakt nach der redaktionellen Hierarchie der Landing-Guide:
   Eyebrow → H2 („Wozu passt …?") → H3 (Name des Gerichts) → Fließtext mit
   60–90 Wörtern → primäre Shop-CTA und sekundärer Regionen-Link.

   Bewusst eine Szene und keine Galerie: Maria Maria ist kein Rezeptbuch.
   Das Bild ist Gebrauchsbeweis für den Wein, nicht Motiv für sich — deshalb
   genau ein Foto pro Landingpage, nie die ganze Serie.

   Bild: 2:1 (1774 × 887), width/height stehen im Markup, damit beim Laden
   nichts springt (CLS). Es liegt unterhalb des Heros und lädt deshalb lazy —
   niemals das LCP-Bild. `object-contain` statt `cover`: laut Guide dürfen
   Flasche, Glas, Korkenzieher und Teller an keiner Breite angeschnitten
   werden, also skaliert die Szene vollständig statt formatfüllend.

   PHOTO DROP-IN: `scene.image` steht pro Wein auf null, solange das Foto
   fehlt. Dann entfällt die Bildspalte und die Copy trägt die Sektion allein
   über die volle Breite — kein Platzhalter, kein gebrochenes Bild. Sobald
   die Datei unter public/img/pairing/ liegt, genügt der Pfad im wineData;
   an dieser Komponente ändert sich dafür nichts.

   Messung: `food_pairing_view` feuert einmal, sobald mindestens die Hälfte
   der Sektion sichtbar war; die beiden Links melden `wine_shop_click` mit
   cta_position „food_pairing" und `region_link_click`. */

const EASE = [0.16, 1, 0.3, 1];

export default function PairingScene({ wine }) {
  const scene = wine.pairing?.scene;
  const reduced = useReducedMotion();
  const touch = useTouchDevice();
  const ref = useRef(null);
  const seen = useRef(false);

  /* ≥50 % sichtbar → einmalig melden. IntersectionObserver statt Scroll-
     Listener, damit die Messung die Interaktionslatenz nicht belastet. */
  useEffect(() => {
    const el = ref.current;
    if (!el || !scene || seen.current) return;
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !seen.current) {
            seen.current = true;
            pushEvent(FOOD_PAIRING_VIEW, {
              wine_name: wine.name,
              pairing_name: scene.dish,
            });
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scene, wine.name]);

  if (!scene) return null;

  const titleId = `pairing-${wine.slug}-title`;
  const animate = !reduced && !touch;
  /* Ohne Foto keine leere Spalte: das Raster fällt auf eine Spalte zurück
     und die Copy bekommt eine Lesebreite statt der halben Bühne. */
  const hasImage = Boolean(scene.image);

  return (
    <section
      ref={ref}
      id="maria-moment"
      aria-labelledby={titleId}
      className="grain relative scroll-mt-36 overflow-hidden bg-ivory"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 80% at 88% 0%, rgba(200,183,122,0.14) 0%, transparent 58%), radial-gradient(80% 60% at 4% 100%, rgba(138,43,47,0.06) 0%, transparent 62%)",
        }}
      />

      <div className="relative mx-auto max-w-content px-6 py-14 sm:py-16 lg:px-10 lg:py-20">
        {/* Desktop 7/12 Bild + 5/12 Copy laut Wireframe; mobil steht das
            Bild oben und der Text darunter. */}
        <div
          className={
            hasImage
              ? "grid items-center gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12"
              : "grid items-center gap-8"
          }
        >
          {hasImage && (
            <motion.div
              initial={animate ? { opacity: 0, y: 24 } : false}
              whileInView={animate ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="ring-hairline overflow-hidden rounded-card-lg bg-cream shadow-luxe"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scene.image}
                alt={scene.imageAlt}
                width={1774}
                height={887}
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="h-auto w-full object-contain"
              />
            </motion.div>
          )}

          <motion.div
            initial={animate ? { opacity: 0, y: 20 } : false}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.26em] text-champagne">
              Der Maria-Maria-Moment
            </p>
            <h2
              id={titleId}
              className="mt-3 text-balance font-playfair text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.08] text-charcoal"
            >
              Wozu passt {wine.name}?
            </h2>
            <h3 className="mt-3 font-playfair text-[clamp(1rem,1.5vw,1.2rem)] italic leading-snug text-bordeaux">
              {scene.dish}
            </h3>
            <p className="mt-4 max-w-prose text-[13.5px] leading-[1.7] text-charcoal/70">
              {scene.copy}
            </p>

            <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button
                href={wine.cta.button.href}
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
                onClick={() =>
                  pushEvent(WINE_SHOP_CLICK, {
                    wine_name: wine.name,
                    cta_position: CTA_POSITION.foodPairing,
                    language: pageLanguage(),
                  })
                }
              >
                Diesen Wein im offiziellen Shop entdecken
              </Button>

              {scene.regionLink && (
                <Link
                  href={scene.regionLink.href}
                  onClick={() =>
                    pushEvent(REGION_LINK_CLICK, {
                      wine_name: wine.name,
                      region: scene.regionLink.region ?? null,
                    })
                  }
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full px-2 text-[12.5px] text-charcoal/70 underline-offset-4 transition-colors hover:text-bordeaux hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux"
                >
                  {scene.regionLink.label}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
