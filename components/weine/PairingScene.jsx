"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Button from "@/components/ui/Button";
import { useTouchDevice } from "@/components/motion/useMediaQuery";
import { heroBlurFor } from "@/components/weine/heroBlur";
import { PAIRING_PHOTO_SIZE, pairingPhotoSrc } from "@/components/weine/pairingPhoto";
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

   DAS FOTO: dasselbe Motiv, das oben die Hero-Bühne trägt (pairingPhoto.js).
   Der Hero zeigt es formatfüllend und angeschnitten als Raum, in den man
   hineinfährt; hier kehrt es als gerahmtes Objekt auf dem Tisch zurück —
   vollständig sichtbar, auf einem Elfenbein-Passepartout, leicht in den Raum
   gekippt. Reprise statt Wiederholung: gleiches Motiv, anderer Aggregat-
   zustand. Weil die URL identisch ist, kostet der zweite Auftritt kein Byte —
   der Browser bedient ihn aus dem Cache und das Bild steht sofort.
   `scene.image` sticht diese Vorgabe, falls je ein eigenes Motiv für die
   Sektion existiert; fehlt beides, entfällt die Bildspalte ersatzlos.

   `object-contain` statt `cover`: laut Guide dürfen Flasche, Glas, Korken-
   zieher und Teller an keiner Breite angeschnitten werden. Deshalb liegt auch
   die gesamte Choreografie auf dem Rahmen und nie auf dem Bildausschnitt —
   kein Zoom, der den Teller beschneidet. width/height stehen im Markup, damit
   beim Laden nichts springt (CLS), und das Foto lädt lazy, niemals als LCP.

   Bewegung (Desktop, Zeiger, keine reduzierte Bewegung):
   · Vorhang — der Rahmen wird beim Eintritt von oben nach unten aufgedeckt
     (clip-path), das Bild darin fängt sich aus einem Hauch Überzeichnung.
   · Drift — Bild und Copy laufen beim Scrollen mit unterschiedlichem Gewicht
     durchs Bild, beide durch dieselbe Feder; das erzeugt die Tiefe.
   · Neigung — der Rahmen folgt dem Zeiger in echtem 3D (perspective +
     preserve-3d), federgewichtet, nie linear.
   · Glanz — ein weicher Lichtstreifen wandert mit dem Zeiger über die
     Oberfläche, wie das Streiflicht auf einem Fotoabzug.

   Messung: `food_pairing_view` feuert einmal, sobald mindestens die Hälfte
   der Sektion sichtbar war; die beiden Links melden `wine_shop_click` mit
   cta_position „food_pairing" und `region_link_click`. */

const EASE = [0.16, 1, 0.3, 1];

/* Scroll-Drift: schwer und träge — die Szene soll ziehen, nicht rutschen. */
const DRIFT = { stiffness: 64, damping: 22, mass: 0.95 };
/* Zeiger-Neigung: leichter und wacher, damit der Rahmen am Cursor hängt. */
const TILT = { stiffness: 170, damping: 20, mass: 0.55 };

/* Der gerahmte Abzug. Eigene Komponente, weil sie eigene Zeiger-Federn hält —
   die dürfen nicht in der Sektion liegen, wo sie auch ohne Bild liefen. */
function PairingPhoto({ src, blur, alt, drift, animate }) {
  /* Zeigerposition, normalisiert auf −0.5 … +0.5 vom Rahmenmittelpunkt */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const near = useMotionValue(0);

  /* Jede Zeiger-Koordinate läuft durch eine Feder, keine rohen Werte */
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7.5, 7.5]), TILT);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5.5, -5.5]), TILT);
  /* Der Lichtstreifen wandert gegenläufig zur Neigung — so wirkt er wie eine
     Reflexion der Raumlampe und nicht wie ein mitgeschleppter Sticker. */
  const glareX = useSpring(useTransform(px, [-0.5, 0.5], [180, -180]), TILT);
  const glareOpacity = useSpring(near, TILT);
  /* Das Umgebungslicht hinter dem Rahmen atmet mit der Nähe des Zeigers */
  const auraOpacity = useSpring(useTransform(near, [0, 1], [0.55, 1]), TILT);

  const track = (event) => {
    const r = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - r.left) / r.width - 0.5);
    py.set((event.clientY - r.top) / r.height - 0.5);
    near.set(1);
  };

  const release = () => {
    px.set(0);
    py.set(0);
    near.set(0);
  };

  const photo = (
    <>
      {/* LQIP aus derselben Quelle wie der Hero: deckt die Fläche, falls das
          Foto wider Erwarten doch nicht im Cache liegt — kein weißer Kasten. */}
      {blur && (
        <img
          src={blur}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover blur-lg"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={PAIRING_PHOTO_SIZE.width}
        height={PAIRING_PHOTO_SIZE.height}
        loading="lazy"
        decoding="async"
        draggable={false}
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="relative h-full w-full select-none object-contain"
      />
    </>
  );

  /* Passepartout: heller Karton, Haarlinie in Champagner, kein Schlagschatten —
     die Bildsprache der Seite kennt keine Kartenschatten (shadow-luxe ist
     bewusst flach), Tiefe entsteht hier über Licht und Perspektive. */
  const frameClass =
    "ring-hairline relative overflow-hidden rounded-card-lg bg-cream p-2 sm:p-2.5";
  const plateClass =
    "relative aspect-[2/1] w-full overflow-hidden rounded-[1.35rem] bg-ivory";

  if (!animate) {
    return (
      <figure className={frameClass}>
        <div className={plateClass}>{photo}</div>
      </figure>
    );
  }

  return (
    /* Drei Ebenen, jede mit genau einer Aufgabe:
       Kamera (perspective + Scroll-Drift) → Bühne (Kippung, preserve-3d,
       hält Licht und Abzug in echter Tiefe) → Abzug (Vorhang, Rahmen).

       Warum Licht und Abzug getrennte Kinder der Bühne sind: sobald ein
       Element ein clip-path trägt — und der Vorhang tut das dauerhaft —
       zwingt die Spezifikation sein transform-style auf `flat`. Läge das
       Licht im Rahmen, wäre sein translateZ wirkungslos. So bleibt die
       Bühne frei von Gruppierungs-Eigenschaften und die z-Achse echt. */
    <motion.div style={{ y: drift }} className="relative [perspective:1500px] will-transform">
      <motion.div
        onPointerMove={track}
        onPointerLeave={release}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ z: 26 }}
        transition={{ type: "spring", ...TILT }}
        className="relative will-transform"
      >
        {/* Umgebungslicht, echte 80 px hinter dem Abzug — Tiefe über Licht
            statt über Schatten: die Bildsprache der Seite kennt keine
            Kartenschatten (shadow-luxe löst bewusst flach auf). */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: auraOpacity,
            z: -80,
            background:
              "radial-gradient(60% 55% at 50% 50%, rgba(200,183,122,0.30) 0%, rgba(138,43,47,0.10) 45%, transparent 72%)",
          }}
          className="pointer-events-none absolute -inset-6 blur-2xl sm:-inset-10"
        />

        <motion.figure
          initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0% round 2rem)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 2rem)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.05, ease: EASE }}
          className={frameClass}
        >
          <div className={plateClass}>
            {/* Das Bild fängt sich aus einem Hauch Überzeichnung in seine
                Endgröße — die Bewegung endet exakt bei 1, also unbeschnitten. */}
            <motion.div
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.5, ease: EASE }}
              className="absolute inset-0 will-transform"
            >
              {photo}
            </motion.div>
          </div>

          {/* Streiflicht: wandert mit dem Zeiger, liegt vor dem Karton und
              bleibt für Zeiger und Screenreader unsichtbar. Neigung und
              Zentrierung stehen bewusst in der style-Prop und nicht als
              Tailwind-Klasse: Framer schreibt `transform` komplett neu und
              würde eine Utility-Rotation stillschweigend überschreiben. */}
          <motion.div
            aria-hidden="true"
            style={{ x: glareX, rotate: 14, opacity: glareOpacity }}
            className="pointer-events-none absolute -inset-y-12 left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-md"
          />
        </motion.figure>
      </motion.div>
    </motion.div>
  );
}

export default function PairingScene({ wine }) {
  const scene = wine.pairing?.scene;
  const reduced = useReducedMotion();
  const touch = useTouchDevice();
  const ref = useRef(null);
  const seen = useRef(false);

  /* Der Drift läuft über die volle Sichtbarkeitsstrecke der Sektion: 0 beim
     Eintritt von unten, 1 beim Verlassen nach oben. Feder statt roher
     Scroll-Koordinate — sonst delegiert Framer an die ScrollTimeline des
     Browsers, und die läuft hier zu hart. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const photoDrift = useSpring(useTransform(scrollYProgress, [0, 1], [44, -44]), DRIFT);
  /* Die Copy zieht flacher mit — die Differenz ist die Tiefe. */
  const copyDrift = useSpring(useTransform(scrollYProgress, [0, 1], [16, -16]), DRIFT);

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
  /* Eigenes Sektionsmotiv sticht; sonst das Hero-Foto des Weins. Ohne beides
     keine leere Spalte: das Raster fällt auf eine Spalte zurück und die Copy
     bekommt eine Lesebreite statt der halben Bühne. */
  const image = scene.image ?? pairingPhotoSrc(wine.slug);
  const imageAlt = scene.imageAlt ?? `${wine.name} – das passende Gericht`;
  const blur = scene.image ? null : heroBlurFor(wine.slug);

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
            image
              ? "grid items-center gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12"
              : "grid items-center gap-8"
          }
        >
          {image && (
            <PairingPhoto
              src={image}
              blur={blur}
              alt={imageAlt}
              drift={photoDrift}
              animate={animate}
            />
          )}

          {/* Zwei Ebenen mit Absicht: außen der Scroll-Drift (Motion Value in
              `style`), innen der Auftritt (initial/whileInView). Beides auf
              einem Element hieße zweimal `y` auf derselben Ebene — der Motion
              Value gewänne und der Auftritt verlöre seinen Anstieg. */}
          <motion.div
            style={animate ? { y: copyDrift } : undefined}
            className={animate ? "will-transform" : undefined}
          >
            <motion.div
              initial={animate ? { opacity: 0, y: 22 } : false}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
