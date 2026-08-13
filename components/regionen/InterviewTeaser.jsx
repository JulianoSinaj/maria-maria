import Link from "@/components/i18n/LocaleLink";
import Photo from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/Icons";
import { interviewPath } from "@/components/magazin/interviewRegistry";

/* Der Interview-Teaser unter einem Regionenblock — Teaser 2 von zwei.

   Handoff Seite 7. Zwei Punkte daraus sind hier tragend:

   1. Der Text setzt beim GEBIET an, nicht bei der Person — deshalb eigene
      Absätze aus `teaserRegion` statt eines Auszugs aus dem Artikel. Der
      vollständige Text wird auf /regionen nicht dupliziert.
   2. Zwei CTAs, zwei Ziele: „Das Gespräch lesen" öffnet den Artikel,
      „Lugana entdecken" führt auf die echte Weinseite. Beide auf dasselbe
      Ziel zu legen ist im Handoff ausdrücklich untersagt — der Block hätte
      dann zwei Knöpfe und nur einen Zweck.

   Anders als die Magazin-Karte ist dieser Block NICHT als Ganzes klickbar:
   Bei zwei gleichwertigen Zielen wäre unklar, wohin ein Klick daneben führt.

   Der Block steht unmittelbar unter dem Gardasee-Block und vor dem
   Terroir-Manifest; die Gardasee-FAQ folgt weiter unten auf derselben Seite,
   genau in der vom Handoff verlangten Reihenfolge. */

export default function InterviewTeaser({ interview, wineHref = "/unsere-weine/lugana" }) {
  const t = interview?.teaserRegion;
  if (!t) return null;

  return (
    <Reveal y={22} className="mt-14 lg:mt-20">
      <article className="overflow-hidden rounded-card-lg border border-champagne/45 bg-gradient-to-b from-white/80 to-cream/60">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ---- Portrait ---- */}
          <div className="relative aspect-[4/5] overflow-hidden bg-cream lg:aspect-auto lg:min-h-[27rem]">
            <Photo
              src={interview.portrait?.src}
              alt={interview.portrait?.alt ?? ""}
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* ---- Text ---- */}
          <div className="flex flex-col justify-center px-7 py-9 sm:px-10 sm:py-12">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-bordeaux">
              {t.eyebrow}
            </p>

            {/* H3, nicht H2: Der Block liegt innerhalb des Regionen-Artikels,
                dessen H2 die Region selbst trägt. Eine zweite H2 an dieser
                Stelle risse die Gliederung der Seite auseinander. */}
            <h3 className="mt-4 text-balance font-playfair text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.14] text-charcoal">
              {t.title}
            </h3>

            <div className="mt-5 space-y-4">
              {(t.paragraphs ?? []).map((text, i) => (
                <p key={i} className="max-w-[52ch] text-[15px] leading-relaxed text-charcoal/75">
                  {text}
                </p>
              ))}
            </div>

            {t.pull && (
              <p className="mt-7 rounded-card bg-bordeaux/[0.06] px-6 py-4 font-playfair text-[clamp(1rem,1.7vw,1.2rem)] italic leading-snug text-bordeaux">
                {t.pull}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={interviewPath(interview.slug)}
                data-interview-card={interview.slug}
                data-interview-source="regionen"
                className="group inline-flex min-h-[48px] lg:min-h-[44px] items-center gap-2.5 rounded-full bg-gradient-to-br from-bordeaux to-wine px-7 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ivory transition-shadow duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux"
              >
                {t.ctaPrimary}
                <Arrow
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                />
              </Link>

              {/* Sekundär und bewusst anders gebaut: ein Textlink führt auf
                  die Weinseite, nicht ein zweiter gefüllter Knopf. */}
              <Link
                href={wineHref}
                data-interview-cta="wine"
                className="group inline-flex min-h-[48px] lg:min-h-[44px] items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/70 transition-colors duration-300 hover:text-bordeaux"
              >
                {t.ctaSecondary}
                <Arrow
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
