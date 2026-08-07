import Link from "next/link";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { Eyebrow } from "@/components/Deco";
import Photo from "@/components/media/Photo";
import { Arrow, Grapes } from "@/components/Icons";

/* Box Curiosità — das Abschlussband des Magazins auf dunkler Editorial-Bühne:
   links eine Wein-Kuriosität als Appetizer, rechts das kippende Kellerstill —
   beide führen in die Kollektion. Darunter die zweigleisige Fußzeile:
   links zu den Interviews (Winzer & Kunden), rechts der Passaggio zurück in
   die Artikel des Magazins. */

const INTERVIEW_LINK = {
  kicker: "Interviste",
  label: "Winzer & Kunden im Gespräch",
  href: "#interviste",
  align: "left",
};

const MAGAZINE_LINK = {
  kicker: "Passaggio al Magazine",
  label: "Weiter zu den Artikeln",
  href: "#artikel",
  align: "right",
};

function FooterLink({ item }) {
  const right = item.align === "right";
  return (
    <Link
      href={item.href}
      className={`group inline-flex min-h-[44px] flex-col justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-4 focus-visible:ring-offset-espresso ${
        right ? "items-start sm:items-end sm:text-right" : "items-start"
      }`}
    >
      <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-champagne/80">
        {item.kicker}
      </span>
      <span
        className={`mt-1 inline-flex items-center gap-2 text-[13px] font-medium text-ivory transition-colors duration-300 group-hover:text-champagne-light ${
          right ? "sm:flex-row-reverse" : ""
        }`}
      >
        {/* Unterstrich wird von links aufgezogen – geclippte Maske statt Farbwechsel */}
        <span className="relative">
          {item.label}
          <span
            aria-hidden="true"
            className={`absolute -bottom-1 left-0 h-px w-full scale-x-0 bg-champagne transition-transform duration-500 ease-out-expo group-hover:scale-x-100 ${
              right ? "origin-right" : "origin-left"
            }`}
          />
        </span>
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-champagne/25">
          {/* Pfeil-Karussell: der alte fährt raus, ein zweiter kommt nach */}
          <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-6" />
          <Arrow className="absolute h-3.5 w-3.5 -translate-x-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
        </span>
      </span>
    </Link>
  );
}

export default function CuriosityBand({
  className = "",
  headingId,
  /* Der Interview-Link erscheint nur, wenn wirklich ein Gespräch
     veröffentlicht ist — sonst zeigte er auf eine leere Platzhalterkarte.
     Ohne ihn rückt der Magazin-Link allein nach rechts. */
  showInterviewLink = true,
}) {
  return (
    <section
      aria-labelledby={headingId}
      className={`grain relative overflow-hidden bg-espresso py-16 lg:py-20 ${className}`}
    >
      {/* Tiefe: warme Weinglut oben rechts, Champagnerschimmer unten links */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(107,15,26,0.55) 0%, rgba(107,15,26,0) 68%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -left-32 h-[32rem] w-[32rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(200,183,122,0.32) 0%, rgba(200,183,122,0) 70%)",
        }}
      />
      {/* Übergang zur hellen Nachbarsektion – keine harte Kante */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory/10 to-transparent"
      />

      <div className="relative mx-auto max-w-content px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* ---- die Kuriosität ---- */}
          <Reveal className="max-w-xl">
            <Eyebrow light>Curiosità</Eyebrow>
            <h2
              id={headingId}
              className="mt-3 text-balance font-playfair text-[clamp(1.7rem,3.2vw,2.5rem)] leading-[1.08] text-ivory"
            >
              Wussten Sie <span className="italic text-champagne-light">schon?</span>
            </h2>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ivory/70">
              Primitivo trägt seinen Namen, weil er als eine der ersten Rebsorten Italiens reift —
              <span className="italic"> „primo“</span>, der Erste. Im Glas: die Sonne des Salento,
              samtige Frucht und dunkle Würze.
            </p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ivory/50">
              Neun Charaktere aus vier Regionen warten darauf, entdeckt zu werden — jede Flasche
              mit einer eigenen Geschichte.
            </p>
            <div className="mt-7">
              <Button href="/unsere-weine" variant="light" size="md">
                Unsere Weine entdecken
              </Button>
            </div>
          </Reveal>

          {/* ---- das Kellerstill als Einladung ---- */}
          <Reveal delay={0.15} y={26}>
            <Link href="/unsere-weine" aria-label="Zur Kollektion — Unsere Weine" className="group block">
              <TiltCard className="h-full" max={6} radius="rounded-card-lg">
                <article className="relative aspect-[4/3] overflow-hidden rounded-card-lg border border-champagne/15 lg:aspect-[16/10]">
                  <Photo
                    src="/img/magazin/weinkeller.jpg"
                    alt="Winzer prüft ein Glas Rotwein zwischen Barriquefässern im Keller"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent"
                  />
                  <span className="glass-dark absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-champagne-light">
                    <Grapes className="h-3.5 w-3.5" />
                    Box Curiosità
                  </span>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                    <p className="max-w-[16rem] font-playfair text-[17px] italic leading-snug text-ivory">
                      Die Flaschen hinter den Geschichten
                    </p>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-champagne-light">
                      Zur Kollektion
                      <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              </TiltCard>
            </Link>
          </Reveal>
        </div>

        {/* ---- zweigleisige Fußzeile: Interviews links, Magazin rechts ---- */}
        <Reveal delay={0.1}>
          <div className="mt-12 border-t border-champagne/15 pt-8 lg:mt-14">
            <div
              className={`flex flex-col gap-5 sm:flex-row sm:items-center ${
                showInterviewLink ? "sm:justify-between" : "sm:justify-end"
              }`}
            >
              {showInterviewLink && <FooterLink item={INTERVIEW_LINK} />}
              <FooterLink item={MAGAZINE_LINK} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
