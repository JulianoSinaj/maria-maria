import Link from "@/components/i18n/LocaleLink";
import Photo from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/Icons";
import { interviewPath } from "@/components/magazin/interviewRegistry";

/* Die Interview-Karte im Magazin — Teaser 1 von zwei.

   Handoff Seite 6, wörtlich: Die Karte stellt die Person und das Thema vor.
   Sie darf NICHT wie eine Produktkarte aussehen und trägt keinen Kauf-Button.
   Ziel ist immer der Artikel-Permalink, nie eine Kopie des Textes.

   Ganze Karte klickbar UND ein sichtbarer Fokus für die Tastatur — beides
   verlangt der Handoff (Punkte 5 und 6). Gelöst über den „stretched link":
   Es gibt genau EIN <a>, das per ::after die ganze Karte überdeckt. Ein
   zweiter, unsichtbarer Wrapper-Link würde denselben Artikel doppelt in den
   Tab-Fokus legen und Screenreadern zwei identische Ziele melden.

   Zwei Bauformen, eine Komponente:
   - `featured` (ein einzelnes Gespräch): Foto links, Text rechts — die
     Bühne, die das Mockup zeigt.
   - Standard (ab zwei Gesprächen): Hochkarte im Raster, Bild 3:2 über der
     vollen Kartenbreite. `h-full` hält die Höhen gleich, sobald die drei
     Karten des Handoffs nebeneinander stehen. */

export default function InterviewCard({ interview, featured = false, delay = 0 }) {
  const t = interview.teaserMagazin ?? {};
  const href = interviewPath(interview.slug);

  const name = (
    <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-charcoal/70">
      {interview.name}
    </p>
  );

  const title = (
    <h3
      className={`text-balance font-playfair leading-[1.14] text-charcoal ${
        featured ? "text-[clamp(1.7rem,3.2vw,2.6rem)]" : "text-[clamp(1.35rem,2.2vw,1.7rem)]"
      }`}
    >
      {t.title}
    </h3>
  );

  const teaser = (
    <p className="text-[14.5px] leading-relaxed text-charcoal/70">{t.teaser}</p>
  );

  /* Der einzige Link der Karte. `after:absolute after:inset-0` zieht seine
     Klickfläche über die gesamte Karte; der Fokusring bleibt trotzdem am
     Knopf, wo er sichtbar ist. */
  const cta = (
    <Link
      href={href}
      className="group/cta relative z-[1] inline-flex min-h-[48px] lg:min-h-[44px] items-center gap-2.5 rounded-full bg-gradient-to-br from-bordeaux to-wine px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ivory transition-shadow duration-300 after:absolute after:inset-0 after:z-[2] after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux"
    >
      {t.cta}
      <Arrow
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover/cta:translate-x-1"
      />
    </Link>
  );

  const meta = t.meta && (
    <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/45">{t.meta}</p>
  );

  const portraitPosition =
    interview.slug === "daniele-malavasi-lugana-doc" ? "object-top" : "object-center";

  const photo = (
    <Photo
      src={interview.portrait?.src}
      alt={interview.portrait?.alt ?? ""}
      sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
      className={`absolute inset-0 h-full w-full object-cover ${portraitPosition} transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]`}
    />
  );

  return (
    <Reveal y={20} delay={delay} className={featured ? "" : "h-full"}>
      <article
        className={`group relative h-full overflow-hidden rounded-card-lg border border-champagne/45 bg-white/70 transition-colors duration-500 hover:border-champagne ${
          featured ? "grid grid-cols-1 lg:grid-cols-2" : "flex flex-col"
        }`}
      >
        <div
          className={`relative overflow-hidden bg-cream ${
            featured ? "aspect-[4/5] lg:aspect-auto lg:min-h-[26rem]" : "aspect-[3/2]"
          }`}
        >
          {photo}
        </div>

        <div
          className={`flex flex-1 flex-col gap-5 ${
            featured ? "px-7 py-8 sm:px-10 sm:py-12 lg:justify-center" : "px-6 py-7"
          }`}
        >
          <div className="space-y-3">
            {name}
            {title}
          </div>
          {teaser}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-2">
            {meta}
            {cta}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
