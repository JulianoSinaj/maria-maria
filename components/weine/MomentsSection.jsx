import { Reveal } from "@/components/motion/Reveal";
import Atmosphere, { GhostWord, Vines } from "@/components/Atmosphere";
import OccasioniTeaser from "@/components/weine/OccasioniTeaser";

/* Food-Pairing-Teaser der Weine-Seite — die redaktionelle Doppelseite
   „Occasioni": ein Zeitungskopf zwischen Haarlinien (das Echo der Rivista,
   in die die Sektion führt), links Schlagzeile und Anlass-Index, rechts die
   Antwort-Karte mit überblendenden Fotos (components/weine/OccasioniTeaser).
   Das frühere Flaschen-Stillleben ist bewusst gewichen — Atmosphäre,
   Ghost-Word und Reben-Lineatur tragen den Hintergrund, die Fotos leben
   jetzt in der Karte selbst.

   Die frühere „expand"-Fassung (drei wachsende Anlass-Karten als Kapitel II
   des Magazins, components/weine/MomentsExpander) ist mit der
   Redaktionsvorgabe 08/2026 entfallen: das Magazin trägt dort jetzt den
   Anlass-Schalter aus components/magazin/PairingMoments — fünf Tasten,
   eine Antwort-Karte, jeder Wein verlinkt auf seine Landingpage. */

/* Struktur der drei Motive: Reihenfolge und Foto. Titel und Zeile kommen je
   Sprache aus content/<sprache>/weine.js (Abschnitt `occasioni.moments`). */
const MOMENT_SHAPE = [
  { key: "aperitivo", img: "/img/aperitivo-sunset.jpg" },
  { key: "dinner", img: "/img/dinner.webp" },
  { key: "friends", img: "/img/pranzo.webp" },
];

/* Ziel des Occasioni-Teasers: das Food-Pairing-Kapitel des Magazins */
const PAIRING_HREF = "/magazin#food-pairing";

export default function MomentsSection({ t = {}, className = "", headingId, id }) {
  /* die Occasioni-Doppelseite der Weine-Seite */
  const moments = MOMENT_SHAPE.map((m) => ({ ...m, ...(t.moments?.[m.key] ?? {}) }));
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
          t={t}
          moments={moments}
          href={PAIRING_HREF}
          headingId={headingId}
          className="mt-12 lg:mt-16"
        />
      </div>
    </section>
  );
}
