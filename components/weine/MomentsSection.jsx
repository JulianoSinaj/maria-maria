import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle } from "@/components/Deco";
import Atmosphere, { GhostWord, Vines } from "@/components/Atmosphere";
import MomentsExpander from "@/components/weine/MomentsExpander";
import OccasioniTeaser from "@/components/weine/OccasioniTeaser";

/* Food-Pairing-Sektion — zwei Fassungen:

   „expand" (/magazin, Kapitel 2: Food Pairing) — die drei Anlass-Karten
   (Aperitivo, Dinner, Freunde) nach der Bauform des Region-Explorers der
   Startseite: die Karte unter dem Cursor wächst auf, die Nachbarn schrumpfen
   (components/weine/MomentsExpander). `ctaHref` zeigt auf die Kollektion.
   `id` macht die Sektion als Sprungziel erreichbar (/magazin#food-pairing) —
   der Teaser der Weine-Seite landet genau hier, nicht am Seitenanfang.

   „stage" (/unsere-weine, Standard) — die redaktionelle Doppelseite
   „Occasioni": ein Zeitungskopf zwischen Haarlinien (das Echo der Rivista,
   in die die Sektion führt), links Schlagzeile und Anlass-Index, rechts die
   Antwort-Karte mit überblendenden Fotos (components/weine/OccasioniTeaser).
   Das frühere Flaschen-Stillleben ist bewusst gewichen — Atmosphäre,
   Ghost-Word und Reben-Lineatur tragen den Hintergrund, die Fotos leben
   jetzt in der Karte selbst. */

const MOMENTS = [
  {
    title: "Aperitivo",
    tag: "Moment 01",
    text: "Leicht, frisch und bereichernd.",
    img: "/img/magazin/imag3.jpeg",
  },
  {
    title: "Dinner",
    tag: "Moment 02",
    text: "Elegante Begleiter für besondere Gerichte.",
    img: "/img/magazin/imag3.jpeg",
  },
  {
    title: "Freunde",
    tag: "Moment 03",
    text: "Für gute Gespräche und unvergessliche Abende.",
    img: "/img/magazin/imag3.jpeg",
  },
];

/* Ziel des Occasioni-Teasers: das Food-Pairing-Kapitel des Magazins */
const PAIRING_HREF = "/magazin#food-pairing";

export default function MomentsSection({
  ctaHref = "#kollektion",
  layout = "stage",
  className = "",
  headingId,
  id,
}) {
  /* „expand": keine Foto-Bühne — nur Titel und die wachsende Karten-Reihe.
     Die Sektion bleibt so bewusst kurz und breit. */
  if (layout === "expand") {
    return (
      <section
        id={id}
        aria-labelledby={headingId}
        className={`grain relative scroll-mt-28 overflow-hidden ${className}`}
      >
        <Atmosphere variant="rose" className="opacity-60" />
        <div className="relative mx-auto max-w-content px-6 pb-14 pt-8 lg:px-10 lg:pt-10">
          <SectionTitle
            align="center"
            eyebrow="Genussmomente"
            description="Drei Anlässe, drei Stimmungen – finden Sie den Wein, der Ihren Augenblick begleitet."
            headingId={headingId}
          >
            Welcher Wein passt zu <span className="italic text-bordeaux">Ihrem Moment?</span>
          </SectionTitle>
          <div className="mt-8">
            <MomentsExpander moments={MOMENTS} ctaHref={ctaHref} />
          </div>
        </div>
      </section>
    );
  }

  /* „stage": die Occasioni-Doppelseite der Weine-Seite */
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`grain relative overflow-hidden ${className}`}
    >
      {/* Atmosphäre statt Foto-Bühne: Abendlicht-Auren, das treibende
          Ghost-Word und die Reben-Lineatur am Fuß — alles aria-hidden,
          alles GPU-freundlich */}
      <Atmosphere variant="dusk" className="opacity-80" />
      <GhostWord className="right-[-4vw] top-[6%] text-[13vw]">Occasioni</GhostWord>
      <Vines className="inset-x-0 -bottom-12 h-[280px] w-full opacity-35" />

      <div className="relative mx-auto max-w-content px-6 py-20 lg:px-10 lg:py-24">
        {/* Zeitungskopf zwischen Haarlinien — das Echo der Rivista, in die
            diese Sektion führt: wer die Zeile im Magazin wiedererkennt, weiß,
            dass er angekommen ist. */}
        <Reveal y={10} blur={false}>
          <div className="flex items-baseline justify-between gap-4 border-y border-charcoal/10 py-3 text-[9.5px] font-semibold uppercase tracking-[0.26em] text-charcoal/50">
            <span>Le occasioni</span>
            <span className="hidden font-playfair text-[12px] normal-case italic tracking-normal text-charcoal/45 sm:block">
              Il vino giusto per ogni momento
            </span>
            <span>
              Dal Magazin <span aria-hidden="true">·</span> Food Pairing
            </span>
          </div>
        </Reveal>

        <OccasioniTeaser
          moments={MOMENTS}
          href={PAIRING_HREF}
          headingId={headingId}
          className="mt-12 lg:mt-16"
        />
      </div>
    </section>
  );
}
