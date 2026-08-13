import { Fragment } from "react";
import Link from "@/components/i18n/LocaleLink";
import SplitText from "@/components/motion/SplitText";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal } from "@/components/motion/Reveal";
import Photo from "@/components/media/Photo";
import VisionMission from "@/components/magazin/VisionMission";
import { Arrow } from "@/components/Icons";

/* CoverHero — die Titelseite des Magazins nach dem Vorbild klassischer
   Zeitschriften-Cover:

   1. Zeitungskopf   zentrierter Masthead — Dachzeile, große Serifen-Schlagzeile,
                     zweizeiliger Untertitel.
   2. Rubrikenleiste die vier Ressorts zwischen zwei Haarlinien — drei Anker
                     in die Seite, „Die Geschichte" führt auf /geschichte
                     (Interviews fällt aufs Archiv zurück, solange kein
                     Gespräch veröffentlicht ist).
   3. Cover Story    das Aufmacher-Duo: links das Titelfoto (Maria in der
                     Cantina, im Originalformat mit federgedämpftem Tilt),
                     rechts Rubrik,
                     Schlagzeile, Stationenzeile, CTA in die Geschichte und
                     darunter das Vision/Mission-Kartenpaar. */

const SUBLINE =
  "Im Magazin erzählt Maria Maria von Herkunft, Auswahl und Genussmomenten — mit Geschichten aus den Regionen, Food Pairings, Begegnungen und der Vision hinter dem Brand.";

const STATIONS = ["Salento", "Kampanien", "Gardasee", "Düsseldorf"];

export default function CoverHero({ hasInterviews = false }) {
  /* Die Rubriken der Leiste — Anker in die Kapitel der Seite; nur
     „Die Geschichte" führt hinaus auf die Erzählseite /geschichte, seit das
     Markenkapitel (BrandStory) nicht mehr im Heft steht */
  const RUBRIKEN = [
    { label: "Die Geschichte", href: "/geschichte" },
    { label: "Food Pairing", href: "#food-pairing" },
    { label: "Interviews", href: hasInterviews ? "#interviste" : "#artikel" },
    { label: "Events", href: "#bacheca" },
  ];

  return (
    <div className="relative">
      {/* ---- 1. Masthead: Dachzeile, Schlagzeile, Untertitel ---- */}
      <div className="relative mx-auto max-w-content px-6 pt-24 lg:px-10 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal y={12} blur={false}>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.32em] text-bordeaux/80">
              Maria Maria Magazin
            </p>
          </Reveal>
          <h1
            id="magazin-titel"
            className="mx-auto mt-5 max-w-[16ch] font-playfair text-[clamp(2.6rem,5.4vw,4.4rem)] leading-[1.06] text-charcoal"
          >
            <SplitText text="Geschichten, Menschen und Genuss aus Italien" delay={0.12} />
          </h1>
          <Reveal delay={0.45} y={14}>
            <p className="mx-auto mt-6 max-w-xl text-[14px] leading-relaxed text-charcoal/70">
              {SUBLINE}
            </p>
          </Reveal>
        </div>
      </div>

      {/* ---- 2. Rubrikenleiste zwischen zwei Haarlinien ---- */}
      <Reveal delay={0.55} y={10} blur={false}>
        <nav
          aria-label="Rubriken des Magazins"
          className="mt-10 border-y border-charcoal/10 bg-white/30"
        >
          <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-y-1 px-6 py-4">
            {RUBRIKEN.map((r, i) => (
              <Fragment key={r.label}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="mx-5 select-none text-[8px] text-champagne sm:mx-8"
                  >
                    ●
                  </span>
                )}
                <Link href={r.href} className="group relative py-1">
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.26em] text-charcoal/65 transition-colors duration-300 group-hover:text-bordeaux">
                    {r.label}
                  </span>
                  {/* Unterstrich zieht sich von links auf — gleiche Sprache
                      wie das Sommario zuvor */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-champagne transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                  />
                </Link>
              </Fragment>
            ))}
          </div>
        </nav>
      </Reveal>

      {/* ---- 3. Cover Story: Titelfoto + Aufmacher ---- */}
      <div className="relative mx-auto max-w-content px-6 pb-12 pt-10 lg:px-10 lg:pt-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* links: das Titelfoto — im Originalformat (875x823), ohne Beschnitt
              und ohne Overscan-Zoom: die ganze Cantina bleibt im Bild, Maria
              sitzt in der Tiefe des Raums */}
          <Reveal y={24} delay={0.15}>
            <TiltCard className="group" max={4} radius="rounded-card-lg">
              <figure className="relative aspect-[875/823] w-full max-w-[875px] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift">
                <Photo
                  src="/img/magazin/cover-story.jpg"
                  alt="Maria wählt in der Cantina drei Flaschen Maria Maria am Glastisch aus"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  loading="eager"
                  fetchpriority="high"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                />
              </figure>
            </TiltCard>
          </Reveal>

          {/* rechts: Rubrik, Schlagzeile, Stationen, CTA, Leitbild */}
          <div className="flex flex-col justify-center">
            <Reveal y={14} delay={0.2} blur={false}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-champagne-deep">
                Cover Story
              </p>
            </Reveal>
            {/* Zeilenfall der Schlagzeile ist redaktionell gesetzt — drei Zeilen,
                der Wort-Stagger läuft über die Zeilen hinweg weiter */}
            <h2 className="mt-4 font-playfair text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.05] text-charcoal">
              <SplitText className="block" text="Zwei Marias." delay={0.3} />
              <SplitText className="block" text="Eine Geschichte" delay={0.4} />
              <SplitText className="block" text="des Genusses." delay={0.5} />
            </h2>
            <Reveal delay={0.55} y={14}>
              <p className="mt-5 max-w-lg text-[14.5px] leading-relaxed text-charcoal/75">
                Ein Name, zwei Generationen und eine Reise durch italienische Weinwelten — vom
                Salento über Kampanien und den Gardasee bis nach Düsseldorf.
              </p>
            </Reveal>

            {/* die Stationen der Reise als goldene Streckenzeile */}
            <Reveal delay={0.62} y={12} blur={false}>
              <p className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-champagne-deep">
                {STATIONS.map((s, i) => (
                  <Fragment key={s}>
                    {i > 0 && <span aria-hidden="true"> — </span>}
                    <span>{s}</span>
                  </Fragment>
                ))}
              </p>
            </Reveal>

            {/* CTA in die Geschichte — übernimmt den Sprung des entfallenen
                Markenkapitels (BrandStory) auf die Erzählseite /geschichte */}
            <Reveal delay={0.7} y={12} blur={false}>
              <Link
                href="/geschichte"
                className="group mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
              >
                Die ganze Geschichte lesen
                <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
              </Link>
            </Reveal>

            {/* Vision & Mission — das Leitbild schließt die rechte Spalte */}
            <VisionMission className="mt-9" headingId="magazin-leitbild" />
          </div>
        </div>
      </div>
    </div>
  );
}
