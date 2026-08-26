"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import { photoSrcSet, photoSize } from "@/components/media/Photo";
import { useCommon } from "@/lib/i18n/context";

/* Swipe-Bühne für die echten Packshots einer Weinkarte.

   Zeigt Vorder- und Rückseite der Flasche (wine.photos aus data.js). Ein
   Wisch nach links/rechts — oder ein Tap aufs Foto bzw. die Punkte darunter —
   dreht die Flasche um; die neue Seite gleitet federnd herein, wie der
   Karten-Pager im WineRail.

   Die Packshots sind freigestellte WebPs mit Alpha (siehe
   scripts/crop-cards.mjs) — kein Blend-Trick nötig, der Kartenhintergrund
   scheint einfach durch.

   Die ganze Bühne liegt auf z-10 über dem gestreckten Karten-Link — ein
   Druck ins Foto blättert also nur, ein Druck daneben navigiert. */

const SPRING = { type: "spring", stiffness: 300, damping: 30 };

export default function WinePhotos({ wine, imgClass = "h-44", lift = true, className = "" }) {
  const reduced = useReducedMotionSafe();
  const ui = useCommon("ui");
  // side = 0 Vorderseite / 1 Rückseite; dir = Blätterrichtung für die Animation
  const [[side, dir], setSide] = useState([0, 0]);

  const shots = [
    {
      src: wine.photos.front,
      alt: (ui.bottleFrontAlt ?? "").replace("{name}", wine.name),
      label: ui.bottleFront ?? "",
    },
    {
      src: wine.photos.back,
      alt: (ui.bottleBackAlt ?? "").replace("{name}", wine.name),
      label: ui.bottleBack ?? "",
    },
  ];

  const paginate = (step) => setSide(([s]) => [(s + step + shots.length) % shots.length, step]);

  const variants = {
    enter: (d) => ({ opacity: 0, x: reduced ? 0 : d * 56, rotate: reduced ? 0 : d * 4 }),
    center: { opacity: 1, x: 0, rotate: 0 },
    exit: (d) => ({ opacity: 0, x: reduced ? 0 : d * -56, rotate: reduced ? 0 : d * -4 }),
  };

  return (
    <div className={`relative z-10 flex flex-col items-center ${className}`}>
      {/* Hover-Lift eine Ebene über den Fotos: die animieren selbst (Wisch,
          Seitenwechsel) und sollen sich nicht mit dem Lift überlagern */}
      <div
        className={`grid justify-items-center transition-transform duration-500 ease-out-expo ${
          lift ? "group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]" : ""
        }`}
      >
        <AnimatePresence initial={false} custom={dir}>
          {/* srcSet direkt am motion.img: das Element wird gezogen und
              gewischt (drag), muss also ein motion-Element bleiben — ein
              <picture> darum brächte nichts, die Packshots sind ohnehin WebP.

              `sizes`: die Flasche steht höchstens h-48 hoch (192 px) und ist
              bei 391x1400 damit ~54 px breit; 64 px lassen dem Browser Luft,
              auf Retina greift er zur 160er-Stufe. Vorher lieferte jede Karte
              die vollen 391 px aus — bei zehn Karten je Seite war das der
              größte Posten der Startseite, größer als das Hero-Foto. */}
          <motion.img
            key={side}
            src={shots[side].src}
            srcSet={photoSrcSet(shots[side].src) ?? undefined}
            sizes="64px"
            /* width/height aus dem Manifest: die Packshots sind alle 1400 px
               hoch, aber je Flasche 346–488 px breit — das Seitenverhältnis
               ist also je Datei ein anderes und gehört nicht als Konstante
               hierher. Die Anzeigehöhe setzt weiter die Klasse. */
            {...photoSize(shots[side].src)}
            alt={shots[side].alt}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SPRING}
            drag={reduced ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              const power = Math.abs(info.offset.x) * info.velocity.x;
              if (info.offset.x < -48 || power < -6000) paginate(1);
              else if (info.offset.x > 48 || power > 6000) paginate(-1);
            }}
            onTap={() => paginate(1)}
            draggable={false}
            loading="lazy"
            decoding="async"
            className={`col-start-1 row-start-1 w-auto select-none object-contain ${imgClass} ${
              reduced ? "" : "cursor-grab active:cursor-grabbing"
            }`}
          />
        </AnimatePresence>
      </div>

      {/* Seiten-Punkte: zeigen an, dass die Flasche zwei Seiten hat.
          Die unsichtbare Trefferfläche wächst per Pseudo-Element — unterhalb
          lg auf Daumenmaß (~44px), ab lg auf genau 24 × 24.

          Ab lg war sie vorher gar nicht da: Der Zusatz stand als `max-lg:`
          und ließ auf dem Desktop einen nackten 16-px-Punkt zurück. Genau
          daher rührte der Unterschied in der Lighthouse-Bewertung —
          Barrierefreiheit 100 auf dem Telefon, 96 auf dem Desktop.

          Der Irrtum dahinter ist naheliegend: „Touch-Ziel" klingt nach
          Fingern. WCAG 2.5.8 nennt aber 24 × 24 für JEDE Zeigereingabe, und
          gemeint sind ausdrücklich auch Mausnutzer mit eingeschränkter
          Feinmotorik — ein 16-px-Ziel ist mit zittriger Hand am Zeiger
          genauso schwer zu treffen wie mit dem Daumen.

          Die sichtbaren Punkte ändern sich nicht, sie sind ein <span> im
          Knopf. Nur der Abstand geht ab lg von 6 auf 8 px: Bei 16 px Knopf
          plus 8 px Lücke liegen die Mittelpunkte 24 px auseinander, die
          beiden 24-px-Flächen stoßen also exakt aneinander, statt sich zu
          überlappen — überlappende Ziele fallen sonst über die
          Abstandsprüfung derselben Richtlinie. */}
      <div className="mt-2 flex items-center gap-3 lg:gap-2">
        {shots.map((s, i) => (
          <button
            key={i}
            type="button"
            aria-label={(ui.showSide ?? "").replace("{side}", s.label)}
            aria-pressed={i === side}
            onClick={() => i !== side && paginate(i - side)}
            className="group/dot relative flex h-4 w-4 items-center justify-center before:absolute before:content-[''] max-lg:before:-inset-x-1.5 max-lg:before:-inset-y-3.5 lg:before:-inset-1"
          >
            <span
              className={`h-1.5 rounded-full transition-all duration-400 ease-out-expo ${
                i === side
                  ? "w-4 bg-bordeaux/80"
                  : "w-1.5 bg-charcoal/25 group-hover/dot:bg-champagne"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
