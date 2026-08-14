import Link from "@/components/i18n/LocaleLink";
import Photo from "@/components/media/Photo";
import SplitText from "@/components/motion/SplitText";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/Deco";
import { Aura, GhostWord } from "@/components/Atmosphere";
import { Pin } from "@/components/Icons";

/* Der Aufmacher der Gesprächsseite — die Landing über dem Fließtext.

   Was hier gilt (Handoff Seiten 2, 9, 22), unverändert zur alten Fassung:
   - EIN <h1>. Er trägt weiterhin „Name: Titel" — der Doppelpunkt steht als
     sr-only-Span zwischen den beiden Zeilen, damit die zugängliche
     Überschrift dieselbe bleibt wie vor dem Umbau.
   - Die Brotkrume ist dieselbe Kette, die der BreadcrumbList-Knoten der
     Seite beschreibt.
   - KEINE kommerzielle CTA im Aufmacher — die Flasche steht erst unter dem
     Fazit (siehe InterviewArticle).
   - Bewegung ausschließlich über die Motion-Primitiven (Reveal, Stagger,
     SplitText) — sie respektieren prefers-reduced-motion selbst. Das
     Aufmacherfoto steht bewusst still (kein Reveal, kein Parallax).

   Gliederung, von oben nach unten:
   1. Brotkrume
   2. Bühne — links Rubrik → Terroir-Chips → H1 → Vorspann → Byline-Leiste,
      rechts das Aufmacherfoto mit Identitäts-Chip
   3. Kapitelleiste — nummerierte Anker auf die H2-Kapitel des Artikels.
      Die Liste baut InterviewArticle zusammen und reicht sie herein: Der
      Artikel rendert die Kapitel, also besitzt er auch ihre IDs. */

/* Eigenes Aufmacherfoto — gilt NUR für die Artikelseite. Magazin-Karte,
   Regionen-Teaser, OG-Bild und JSON-LD greifen weiter auf `portrait` im
   Wörterbuch zu, damit dort nichts kippt. Deshalb steht die Zuordnung hier
   lokal und nach Slug, statt im Content. */
const ARTICLE_PORTRAITS = {
  "daniele-malavasi-lugana-doc": "/img/magazin/interviews/daniele-malavasi.jpg",
};

/* „Lugana DOC · Turbiana · Pozzolengo" → drei Chips. Dieselbe Trennung
   nutzt bereits der Article-Knoten im JSON-LD für seine keywords. */
const badgeChips = (badge) =>
  (badge ?? "")
    .split("·")
    .map((chip) => chip.trim())
    .filter(Boolean);

/* ---- 1. Brotkrume ------------------------------------------------------ */
/* min-h-6: Brotkrumen sind keine CTAs und brauchen die 44 px nicht — unter
   24 px fielen sie aber unter die Mindestgröße für Zeiger-Ziele
   (WCAG 2.2, 2.5.8). */
function Crumbs({ interview, ui }) {
  return (
    <Reveal y={10} blur={false}>
      <nav
        aria-label={ui.interviews}
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/45"
      >
        <Link
          href="/magazin"
          className="inline-flex min-h-6 items-center transition-colors duration-300 hover:text-bordeaux"
        >
          {ui.magazin}
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href="/magazin#interviste"
          className="inline-flex min-h-6 items-center transition-colors duration-300 hover:text-bordeaux"
        >
          {ui.interviews}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-charcoal/70">{interview.name}</span>
      </nav>
    </Reveal>
  );
}

/* ---- 2a. Rubrik, Chips, H1, Vorspann, Byline --------------------------- */
function Masthead({ interview, ui, headingId }) {
  const { byline = {} } = interview;
  const chips = badgeChips(interview.badge);

  /* „Interview: Maria Pia Tolo · Redaktion: Maria Maria · 6 Min. Lesezeit" —
     jeder Teil fällt still weg, wenn er fehlt. Das Datum ist bis zur
     Freigabe null (siehe Kopf von content/de/interviews.js). */
  const bylineParts = [
    byline.interview && `${ui.interview}: ${byline.interview}`,
    byline.editorial && `${ui.editorial}: ${byline.editorial}`,
    byline.date,
    byline.readingTime,
  ].filter(Boolean);

  return (
    <div className="lg:pt-3">
      <Reveal y={12} delay={0.04}>
        <Eyebrow tone="text-bordeaux">{interview.eyebrow}</Eyebrow>
      </Reveal>

      {chips.length > 0 && (
        <Stagger className="mt-5 flex flex-wrap gap-2" gap={0.06} delay={0.08}>
          {chips.map((chip) => (
            <StaggerItem key={chip} y={10}>
              <span className="inline-flex rounded-full border border-champagne/70 bg-white/60 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                {chip}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      {/* Das einzige H1 der Seite. Innerhalb einer Überschrift ist nur
          Phrasing-Content erlaubt — deshalb animieren beide Zeilen über
          SplitText (Spans), nicht über Reveal (ein <div>). */}
      <h1 id={headingId} className="mt-6 text-charcoal">
        <SplitText
          text={interview.name}
          as="span"
          className="block text-[12px] font-semibold uppercase tracking-[0.32em] text-charcoal/60"
          delay={0.05}
          stagger={0.06}
        />
        <span className="sr-only">: </span>
        <SplitText
          text={interview.headline}
          as="span"
          className="mt-4 block font-playfair text-[clamp(2.1rem,4.6vw,3.55rem)] leading-[1.06]"
          delay={0.14}
          stagger={0.045}
        />
      </h1>

      <Reveal y={14} delay={0.22}>
        <p className="mt-6 max-w-[58ch] text-[16.5px] leading-[1.65] text-charcoal/75">
          {interview.deck}
        </p>
      </Reveal>

      {bylineParts.length > 0 && (
        <Reveal y={12} delay={0.28} blur={false}>
          <p className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-y border-champagne/35 py-3.5 text-[11.5px] text-charcoal/55">
            {bylineParts.map((part, i) => (
              <span key={i} className="inline-flex items-center gap-2.5">
                {i > 0 && (
                  <span aria-hidden="true" className="text-champagne">
                    ·
                  </span>
                )}
                {part}
              </span>
            ))}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ---- 2b. Aufmacherfoto ------------------------------------------------- */
function PortraitFigure({ interview }) {
  const { portrait = {}, profile = {} } = interview;
  const src = ARTICLE_PORTRAITS[interview.slug] ?? portrait.src;

  return (
    <figure className="relative lg:mt-14">
      {/* Versetzter Haarlinien-Rahmen — reine Zier, verschiebt nichts. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 hidden rounded-card-lg border border-champagne/45 lg:block"
      />

      <div className="relative aspect-square overflow-hidden rounded-card-lg bg-cream shadow-luxe">
        <Photo
          src={src}
          alt={portrait.alt ?? ""}
          sizes="(min-width: 1024px) 44vw, 100vw"
          /* Der Aufmacher ist der LCP dieser Seite — er lädt sofort. */
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-card-lg bg-gradient-to-t from-espresso/50 via-espresso/15 to-transparent"
      />
      {profile.name && (
        <figcaption className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
          <span className="inline-flex max-w-full flex-col rounded-card border border-white/25 bg-white/10 px-4 py-3 backdrop-blur-md">
            <span className="font-playfair text-[16px] leading-snug text-ivory">
              {profile.name}
            </span>
            {profile.role && (
              <span className="mt-1 inline-flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-ivory/80">
                <Pin aria-hidden="true" className="h-3 w-3 shrink-0 text-champagne" />
                {profile.role}
              </span>
            )}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

/* ---- 3. Kapitelleiste -------------------------------------------------- */
/* Nummerierte Anker auf die H2-Kapitel darunter. Bewusst nackte <a> statt
   LocaleLink: Die Ziele sind Fragmente derselben Seite. */
function ChapterIndex({ chapters, label }) {
  if (chapters.length < 2 || !label) return null;

  return (
    <nav aria-label={label} className="mt-14 lg:mt-16">
      <Reveal y={12} blur={false}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal/45">
          {label}
        </p>
      </Reveal>
      <Stagger className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4" gap={0.05}>
        {chapters.map((chapter, i) => (
          <StaggerItem key={chapter.id} y={14} className="h-full">
            <a
              href={`#${chapter.id}`}
              className="group flex h-full min-h-[48px] flex-col gap-2.5 border-t border-champagne/50 pt-3.5 transition-colors duration-400 hover:border-bordeaux/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bordeaux lg:min-h-[44px]"
            >
              <span className="text-[10.5px] font-semibold tracking-[0.2em] text-champagne transition-colors duration-400 group-hover:text-bordeaux">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-playfair text-[15px] leading-snug text-charcoal/75 transition-colors duration-400 group-hover:text-charcoal">
                {chapter.heading}
              </span>
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </nav>
  );
}

export default function InterviewHero({ interview, ui = {}, chapters = [], headingId }) {
  return (
    <header className="relative mx-auto max-w-content px-6 pb-4 pt-28 lg:px-10 lg:pt-32">
      <Aura tint="champagne" drift={2} className="-right-48 -top-24 h-[32rem] w-[32rem]" />
      <GhostWord className="right-[-2vw] top-[2%] hidden text-[9vw] lg:block">
        {ui.interview}
      </GhostWord>

      <Crumbs interview={interview} ui={ui} />

      <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:mt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <Masthead interview={interview} ui={ui} headingId={headingId} />
        <PortraitFigure interview={interview} />
      </div>

      <ChapterIndex chapters={chapters} label={ui.inThisConversation} />
    </header>
  );
}
