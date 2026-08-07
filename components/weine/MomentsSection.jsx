import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { SectionTitle } from "@/components/Deco";
import Photo from "@/components/media/Photo";
import Atmosphere from "@/components/Atmosphere";

/* „Welcher Wein passt zu Ihrem Moment?" — die drei Anlass-Karten (Aperitivo,
   Dinner, Freunde). Lag zuerst fest auf /unsere-weine; jetzt teilen sich die
   Weine-Seite und das Magazin dieselbe Bauform.

   `layout` bestimmt die Bühne:
   „stage" (/unsere-weine) — das Flaschen-Stillleben trägt die Sektion, die
   Karten liegen als flache Streifen links davor, rechts bleibt das Foto frei.
   „row" (/magazin) — ohne Hintergrundfoto: drei gleich hohe Karten nebeneinander
   über die volle Sektionsbreite. Im Magazin steht die Sektion zwischen zwei
   ruhigen Kapiteln, ein zweites Vollbild-Motiv wäre dort ein Bild zu viel.

   `ctaHref` zeigt auf die Kollektion — auf der Weine-Seite der Anker
   #kollektion, von anderen Seiten aus die volle Route. */

const MOMENTS = [
  {
    title: "Aperitivo",
    text: "Leicht, frisch und bereichernd.",
    img: "/img/aperitivo-sunset.jpg",
  },
  {
    title: "Dinner",
    text: "Elegante Begleiter für besondere Gerichte.",
    img: "/img/dinner.webp",
  },
  {
    title: "Freunde",
    text: "Für gute Gespräche und unvergessliche Abende.",
    img: "/img/pranzo.webp",
  },
];

export default function MomentsSection({
  ctaHref = "#kollektion",
  layout = "stage",
  className = "",
  headingId,
}) {
  const row = layout === "row";

  return (
    <section
      aria-labelledby={headingId}
      className={`grain relative overflow-hidden ${className}`}
    >
      {/* Flaschen-Stillleben als weiche Bühne: federnder Parallax-Drift unter
          einem Elfenbein-Schleier, damit Titel und Karten lesbar bleiben und
          die Ränder nahtlos in die Nachbarsektionen übergehen */}
      {!row && (
        <div aria-hidden="true" className="absolute inset-0">
          <Parallax speed={0.08} overscan className="h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/weine/occasioni-bg-1523.webp"
              srcSet="/img/weine/occasioni-bg-640.webp 640w, /img/weine/occasioni-bg-1280.webp 1280w, /img/weine/occasioni-bg-1523.webp 1523w"
              sizes="100vw"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
          </Parallax>
          <div className="absolute inset-0 bg-ivory/25" />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ivory via-ivory/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ivory via-ivory/45 to-transparent" />
        </div>
      )}
      <Atmosphere variant="rose" className="opacity-60" />
      <div className={`relative mx-auto max-w-content px-6 lg:px-10 ${row ? "pt-16 lg:pt-20" : ""}`}>
      <SectionTitle
        eyebrow="Genussmomente"
        description="Drei Anlässe, drei Stimmungen – finden Sie den Wein, der Ihren Augenblick begleitet."
        headingId={headingId}
      >
        Welcher Wein passt zu <span className="italic text-bordeaux">Ihrem Moment?</span>
      </SectionTitle>
      </div>
      {/* stage: Karten als breite, flache Streifen übereinander ganz links am
          Viewport-Rand – rechts bleibt die Flaschen-Bühne des Fotos frei.
          row: drei Spalten im Inhaltsraster, volle Sektionsbreite. */}
      <div
        className={
          row
            ? "relative mx-auto max-w-content px-6 pb-20 lg:px-10"
            : "relative px-6 pb-24 lg:pl-24 lg:pr-10"
        }
      >
      <Stagger
        className={
          row
            ? "mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6"
            : "mt-8 flex flex-col gap-5 lg:max-w-[38rem]"
        }
      >
        {MOMENTS.map((m, i) => (
          <StaggerItem key={m.title} className="h-full">
            <TiltCard className="group h-full" max={5} radius="rounded-card-lg">
              {/* row: hochformatige Kachel, damit drei nebeneinander die Höhe
                  der Sektion tragen; stage: flacher Streifen */}
              <article
                className={`relative overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift ${
                  row ? "h-[300px] sm:h-[340px] lg:h-[380px]" : "h-[172px] sm:h-[184px]"
                }`}
              >
                {/* stage-Streifen sind auf lg:max-w-[38rem] gedeckelt, die
                    row-Kacheln füllen je ein Drittel des Inhaltsrasters */}
                <Photo
                  src={m.img}
                  alt=""
                  sizes={
                    row
                      ? "(min-width: 1024px) 33vw, (min-width: 768px) 33vw, 100vw"
                      : "(min-width: 1024px) 38rem, 100vw"
                  }
                  className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
                />
                {/* Schleier: im flachen Streifen von links, in der hohen Kachel
                    von unten – der Text sitzt jeweils dort, wo er steht */}
                <div
                  aria-hidden="true"
                  className={
                    row
                      ? "absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/35 to-transparent"
                      : "absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/40 to-transparent"
                  }
                />
                {!row && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-espresso/70 to-transparent"
                  />
                )}
                {/* Zählmarke nur auf der Bühne: dort ordnet sie die drei
                    gestapelten Streifen. In der Dreierreihe zählt das Auge
                    ohnehin von links nach rechts. */}
                {!row && (
                  <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                    Moment 0{i + 1}
                  </span>
                )}
                <div
                  className={
                    row
                      ? "absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6"
                      : "absolute inset-0 flex items-end justify-between gap-5 p-5 sm:p-6"
                  }
                >
                  <div className={row ? "" : "max-w-[17rem]"}>
                    <h3 className="font-playfair text-[22px] text-ivory">{m.title}</h3>
                    <p className="mt-1 text-[12.5px] leading-snug text-ivory/80">{m.text}</p>
                  </div>
                  <Button
                    href={ctaHref}
                    variant="glass"
                    size="sm"
                    magnetic={false}
                    className="shrink-0"
                    aria-label={`Passende Weine für ${m.title} entdecken`}
                  >
                    Weine finden
                  </Button>
                </div>
              </article>
            </TiltCard>
          </StaggerItem>
        ))}
      </Stagger>
      </div>
    </section>
  );
}
