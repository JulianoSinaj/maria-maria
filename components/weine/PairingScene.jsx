"use client";
import { useEffect, useRef, useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Button from "@/components/ui/Button";
import { useTouchDevice } from "@/components/motion/useMediaQuery";
import { pairingBlurFor } from "@/components/weine/pairingBlur";
import { PAIRING_PHOTO_SIZE, sceneSources } from "@/components/weine/pairingPhoto";
import { CARD_PHOTO_SIZE, PAIRING_CARDS, cardPhotoSrc, cardSrcSet } from "@/components/magazin/pairingCards";
import { cardBlurFor } from "@/components/magazin/pairingCardsBlur";
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

   DAS FOTO: im Regelfall dasselbe Motiv, das oben die Hero-Bühne trägt
   (pairingPhoto.js). Der Hero zeigt es formatfüllend und angeschnitten als
   Raum, in den man hineinfährt; hier kehrt es als gerahmtes Objekt auf dem
   Tisch zurück — vollständig sichtbar, auf einem Elfenbein-Passepartout,
   leicht in den Raum gekippt. Reprise statt Wiederholung: gleiches Motiv,
   anderer Aggregatzustand. Weil die URL identisch ist, kostet der zweite
   Auftritt kein Byte — der Browser bedient ihn aus dem Cache.

   Zwei Ausnahmen stechen die Reprise, in dieser Reihenfolge:
   · `scene.cardKey` holt das Anlass-Motiv der Magazine-Card
     (magazin/pairingCards.js, 4:3) mitsamt WebP-Breiten und LQIP — für
     Weine, deren Hero noch das alte Gericht zeigt, während Copy und
     /magazin-Karte schon das neue tragen. Der Hero bleibt dabei unberührt.
   · `scene.image` setzt ein freies Einzelmotiv ohne Varianten.
   Fehlt alles, entfällt die Bildspalte ersatzlos.

   `object-contain` statt `cover`: laut Guide dürfen Flasche, Glas, Korken-
   zieher und Teller an keiner Breite angeschnitten werden. Deshalb liegt auch
   die gesamte Choreografie auf dem Rahmen und nie auf dem Bildausschnitt —
   kein Zoom, der den Teller beschneidet. width/height stehen im Markup, damit
   beim Laden nichts springt (CLS), und das Foto lädt lazy, niemals als LCP.

   Bewegung (Desktop, Zeiger, keine reduzierte Bewegung):
   · Vorhang — eine Elfenbein-Blende fährt beim Eintritt nach unten aus dem
     Passepartout und gibt das Bild frei, das sich zugleich aus einem Hauch
     Überzeichnung fängt.
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
function PairingPhoto({ src, srcSet, sizes, blur, alt, size, drift, animate }) {
  /* Zeigerposition, normalisiert auf −0.5 … +0.5 vom Rahmenmittelpunkt */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const near = useMotionValue(0);

  /* Der Vorhang ist bewusst ausfallsicher gebaut, und das ist die Lehre aus
     der Vorgängerfassung: die hatte den Rahmen mit `initial opacity 0` plus
     animiertem clip-path aufgedeckt. Feuerte die whileInView-Animation nicht,
     blieb an dieser Stelle exakt nichts stehen — kein Bild, kein Rahmen, eine
     leere Spalte. Genau das ist passiert.

     Jetzt gilt: das Foto ist immer sichtbar. Die Blende ist ein zusätzliches
     Element, das nur nach der Hydration existiert und nur dann, wenn die
     Sektion beim Hydrieren noch unter dem Falz liegt — steht sie schon im
     Bild, gibt es keinen Vorhang statt eines Aufblitzens. Fällt JS aus,
     entsteht sie gar nicht erst. Sie bewegt sich ausschließlich über
     transform, nicht über clip-path: das ist GPU-Arbeit und hat keine
     zerbrechliche Wertesyntax. */
  const frameRef = useRef(null);
  const [armed, setArmed] = useState(false);
  const inView = useInView(frameRef, { once: true, amount: 0.3 });
  const revealed = !armed || inView;

  useEffect(() => {
    if (!animate) return;
    const el = frameRef.current;
    if (!el) return;
    if (el.getBoundingClientRect().top > window.innerHeight * 0.9) setArmed(true);
  }, [animate]);

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
      <picture>
        {/* Derselbe srcSet wie oben im Hero (pairingPhoto.js) — nur mit einem
            `sizes`, das die 7/12-Spalte beschreibt statt des vollen Viewports.
            Der Browser wählt daraus dieselbe Datei, die er für den Hero schon
            geholt hat: der zweite Auftritt kostet null Byte. Ohne srcSet wäre
            das `sizes` von vorher wirkungslos gewesen und die Sektion hätte
            das 3-MB-PNG nachgeladen. */}
        {srcSet && <source type="image/webp" srcSet={srcSet} sizes={sizes} />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={size.width}
          height={size.height}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="relative h-full w-full select-none object-contain"
        />
      </picture>
    </>
  );

  /* Passepartout: heller Karton, Haarlinie in Champagner, kein Schlagschatten —
     die Bildsprache der Seite kennt keine Kartenschatten (shadow-luxe ist
     bewusst flach), Tiefe entsteht hier über Licht und Perspektive. */
  const frameClass =
    "ring-hairline relative overflow-hidden rounded-card-lg bg-cream p-2 sm:p-2.5";
  const plateClass = "relative w-full overflow-hidden rounded-[1.35rem] bg-ivory";
  /* Seitenverhältnis aus den Motivmaßen statt als feste Utility: die
     Hero-Motive tragen 2:1, die Magazine-Card-Motive 4:3 — der Teller passt
     sich dem Motiv an, damit object-contain keine Elfenbein-Balken lässt. */
  const plateStyle = { aspectRatio: `${size.width} / ${size.height}` };

  if (!animate) {
    return (
      <figure className={frameClass}>
        <div className={plateClass} style={plateStyle}>
          {photo}
        </div>
      </figure>
    );
  }

  /* Passepartout mit Bild, Blende und Streiflicht — in beiden Zuständen
     identisch aufgebaut, nur die Blende kommt hinzu. */
  const print = (
    <figure ref={frameRef} className={frameClass}>
      <div className={plateClass} style={plateStyle}>
        <motion.div
          animate={{ scale: revealed ? 1 : 1.06 }}
          transition={{ duration: 1.5, ease: EASE }}
          className="absolute inset-0 will-transform"
        >
          {photo}
        </motion.div>

        {armed && (
          <motion.div
            aria-hidden="true"
            initial={{ y: "0%" }}
            animate={{ y: revealed ? "102%" : "0%" }}
            transition={{ duration: 1, ease: EASE }}
            className="absolute inset-0 z-10 bg-ivory will-transform"
          />
        )}
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
    </figure>
  );

  return (
    /* Drei Ebenen, jede mit genau einer Aufgabe:
       Kamera (perspective + Scroll-Drift) → Bühne (Kippung, preserve-3d,
       hält Licht und Abzug in echter Tiefe) → Abzug (Rahmen mit Blende).

       Warum das Licht neben und nicht im Rahmen liegt: der Rahmen trägt
       `overflow-hidden` (die Blende muss an seiner Kante enden), und eine
       Gruppierungs-Eigenschaft zwingt das transform-style der eigenen Kinder
       auf `flat`. Im Rahmen wäre das translateZ des Lichts wirkungslos. So
       bleibt die Bühne frei davon und die z-Achse echt. */
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

        {print}
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
  /* Motiv-Auflösung nach der Rangfolge aus dem Kopfkommentar: Magazine-Card
     (cardKey, mit WebP-Breiten und LQIP) → freies Einzelmotiv (scene.image,
     ohne Varianten — srcSet bleibt leer, das <picture> fällt aufs nackte
     <img> zurück) → Reprise des Hero-Fotos (pairingPhoto.js). Ohne alles
     keine leere Spalte: das Raster fällt auf eine Spalte zurück und die Copy
     bekommt eine Lesebreite statt der halben Bühne. `photo.sizes` beschreibt
     die 7/12-Spalte und gilt für jedes Motiv gleichermaßen. */
  const card = scene.cardKey
    ? PAIRING_CARDS.find((c) => c.key === scene.cardKey) ?? null
    : null;
  const photo = sceneSources(wine.slug);
  const image = card ? cardPhotoSrc(card) : scene.image ?? photo.fallback;
  const srcSet = card ? cardSrcSet(card) : scene.image ? null : photo.srcSet;
  const imageAlt = scene.imageAlt ?? `${wine.name} – das passende Gericht`;
  const blur = card ? cardBlurFor(card.key) : scene.image ? null : pairingBlurFor(wine.slug);
  const size = card ? CARD_PHOTO_SIZE : PAIRING_PHOTO_SIZE;

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

      {/* Bandhöhe: die Sektion trug py-16/20/24 aus der Zeit, als sie zwischen
          zwei dunklen Kapiteln lag und Luft zum Atmen brauchte. Jetzt steht sie
          direkt unter dem Faktenband, und die Szene selbst bringt über
          Passepartout und Scroll-Drift genug Ruhe mit — der zusätzliche Rand
          las sich nur noch als Loch über und unter dem Bild. Der Rest (64 px
          ab lg) bleibt bewusst größer als die Drift-Amplitude von 44 px, damit
          der Abzug beim Scrollen nie an die Sektionskante stößt. */}
      <div className="relative mx-auto max-w-content px-6 py-10 sm:py-12 lg:px-10 lg:py-16">
        {/* Zwei nahezu gleich schwere Spalten statt der ursprünglichen 7/12 zu
            5/12: bei 7/12 blieben der Copy rund 445 px, und darin wurde alles
            eng — der Fließtext lief auf sieben Wörter pro Zeile, der sekundäre
            Link stapelte sich auf drei Zeilen und die primäre CTA brach
            dreizeilig um. Das Foto trägt 2:1 und verliert bei etwas weniger
            Breite nichts; der Text gewinnt eine echte Lesebreite.
            Mobil steht das Bild oben und der Text darunter. */}
        <div
          className={
            image
              ? "grid items-center gap-10 lg:grid-cols-[1.04fr_1fr] lg:gap-14"
              : "grid items-center gap-8"
          }
        >
          {image && (
            <PairingPhoto
              src={image}
              srcSet={srcSet}
              sizes={photo.sizes}
              blur={blur}
              alt={imageAlt}
              size={size}
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
              <h3 className="mt-3.5 font-playfair text-[clamp(1.05rem,1.5vw,1.25rem)] italic leading-snug text-bordeaux">
                {scene.dish}
              </h3>
              {/* 14,5 px auf 1.85 statt 13,5 px auf 1.7: in der breiteren
                  Spalte trägt der Absatz jetzt rund 70 Zeichen pro Zeile und
                  bekommt die Luft, die der Rest der Seite auch hat. */}
              <p className="mt-5 max-w-prose text-[14.5px] leading-[1.85] text-charcoal/70">
                {scene.copy}
              </p>

              {/* flex-wrap statt starrer Zeile: wird es doch einmal eng (lg-
                  Einstieg, lange Weinnamen), rutscht der Regionen-Link unter
                  die CTA, statt beide gegeneinander zu quetschen. */}
              <div className="mt-8 flex flex-col items-stretch gap-x-5 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
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
                  {/* Gekürzt von „Diesen Wein im offiziellen Shop entdecken":
                      41 Zeichen brauchten 466 px und brachen zwischen 1024 und
                      1130 px zweizeilig um. „Diesen Wein" trug dabei nichts —
                      die ganze Sektion spricht über genau diesen Wein — und
                      dieselbe Formulierung steht schon im Hero. */}
                  Im offiziellen Shop entdecken
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
                    /* whitespace-nowrap: der Link ist eine Zeile oder er
                       wandert ganz in die nächste — dreizeilig gestapelt sah
                       er aus wie ein Fehler, nicht wie ein Angebot. */
                    className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full text-[12.5px] text-charcoal/70 underline-offset-4 transition-colors hover:text-bordeaux hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux"
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
