import SplitText from "@/components/motion/SplitText";
import TiltCard from "@/components/motion/TiltCard";
import Marquee from "@/components/motion/Marquee";
import Parallax from "@/components/motion/Parallax";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import ShopCtaBand from "@/components/ui/ShopCtaBand";
import { SectionTitle, Eyebrow, GrapeRule, IconChip } from "@/components/Deco";
import Photo from "@/components/media/Photo";
import HomeHeroPhoto, { HomeHeroPreload } from "@/components/home/HomeHeroPhoto";
import HomeHeroFx from "@/components/home/HomeHeroFx";
import OriginsSection from "@/components/home/OriginsSection";
import RegionExplorer from "@/components/home/RegionExplorer";
import SegmentCards from "@/components/home/SegmentCards";
import WineRail from "@/components/WineRail";
import FaqSection from "@/components/faq/FaqSection";
import { Vineyard, Glasses, Plate, Conversation, Pin } from "@/components/Icons";
import { WINES, REGION_COUNT } from "@/components/data";
import { INTENT_QUERY_PARAM, intentFromQuery } from "@/components/kontakt/intents";
import Atmosphere, { Aura, GhostWord, Vines } from "@/components/Atmosphere";

/* Die Startseite — Hero, Philosophie, Weine-Rail, Origins, die drei
   Weinherkünfte, die drei Conversion-Segmente, Shop-CTA und Marken-FAQ.

   Der gesamte Text kommt als `t` aus content/<sprache>/home.js; hier steht
   nur noch die Struktur — Reihenfolge, Ikonen, Bildpfade, Link-Ziele und die
   Bildausschnitte, die zu den Motiven gehören und keine Sprache kennen.

   Überschriften-Gliederung (Homepage-Brief §6, 24.08.2026): genau EINE H1
   im Hero, darunter je Sektion eine H2 — Philosophie, Unsere Weine, Zwei
   Seelen, Weinherkünfte (mit drei H3), Segmente (mit drei H3), Shop-Band,
   FAQ. Alles davon steht im server-gerenderten HTML; die Reveal-Hüllen
   blenden nur ein, sie fügen nichts nach. */

/* Reihenfolge und Ikone je Philosophie-Karte; der Schlüssel holt Titel und
   Text aus dem Wörterbuch. */
const MOMENT_ICONS = [
  ["selection", <Glasses className="h-7 w-7" />],
  ["origin", <Vineyard className="h-7 w-7" />],
  ["occasion", <Plate className="h-7 w-7" />],
  ["guidance", <Conversation className="h-7 w-7" />],
];

/* Herkunfts-Struktur: Foto, Bildausschnitt und der Anker auf /regionen. Name,
   Rubrik, Fließtext, CTA und Alt-Text stehen je Sprache im Wörterbuch.
   Die Dateinamen folgen dem Homepage-Brief §7 (weinregion-…); die alten
   region-*.webp liegen unverändert daneben. */
const REGION_SHAPE = [
  {
    key: "apulien",
    region: "apulien",
    img: "/img/home/weinregion-apulien-trulli-olivenbaeume.webp",
    /* Trulli links im Bild; Crop hält die eingezeichnete Karte aus dem Schnitt */
    pos: "26% 50%",
  },
  {
    key: "kampanien",
    region: "kampanien",
    img: "/img/home/weinregion-kampanien-vesuv-kueste.webp",
    /* der Vesuv leicht links, damit die eingezeichnete Karte nicht anschneidet */
    pos: "40% 45%",
  },
  {
    key: "garda",
    region: "garda",
    img: "/img/home/weinregion-gardasee-lombardei.webp",
    /* See und Berge tragen das Bild; Karte bleibt außerhalb des Schnitts */
    pos: "38% 55%",
  },
];

/* Die drei Conversion-Segmente (Homepage-Brief §5). Ikone wie auf der
   Kontaktseite; `query` ist der Wert von ?anliegen=, den die Kontaktseite
   auf ihr Formular-Anliegen abbildet (components/kontakt/intents.js) —
   dieselbe Tabelle, deshalb kann hier kein Ziel auseinanderlaufen. */
const SEGMENT_SHAPE = [
  { key: "gastronomie", icon: "Cutlery", query: "gastronomie-feinkost" },
  { key: "handel", icon: "Bag", query: "handel-wiederverkauf" },
  { key: "events", icon: "Cheers", query: "events-verkostungen" },
];

/* Rebsorten im Laufband — Namen, keine Beschriftungen: bleiben in jeder
   Sprache stehen. */
const MARQUEE = ["Primitivo", "Lugana", "Falanghina", "Greco di Tufo", "Aglianico", "Rosato"];

export default function HomeContent({ t = {}, faq = [], souls }) {
  const hero = t.hero ?? {};
  const philosophy = t.philosophy ?? {};
  const collection = t.collection ?? {};
  const regionsCopy = t.regions ?? {};
  const segments = t.segments ?? null;
  const band = t.shopBand ?? {};
  const faqCopy = t.faq ?? {};

  const regions = REGION_SHAPE.map((r) => ({ ...r, ...(regionsCopy.items?.[r.key] ?? {}) }));

  /* Die Segment-Sektion gibt es nur, wo das Wörterbuch sie führt (Deutsch,
     nach dem Brief). Die übrigen Sprachen zeigen die Seite ohne sie, statt
     unübersetzte oder erfundene Texte zu tragen. */
  const segmentItems = segments
    ? SEGMENT_SHAPE.map((s) => ({
        ...s,
        ...(segments.items?.[s.key] ?? {}),
        href: `/kontakt?${INTENT_QUERY_PARAM}=${s.query}`,
        intent: intentFromQuery(s.query),
      }))
    : [];

  /* Die Statzeile (Weine · Herkünfte · seit …) erscheint nur, wenn die
     Sprache ihre Beschriftungen führt — die deutsche Fassung hat sie mit dem
     Brief abgegeben (siehe content/de/home.js). */
  const stats = hero.statWines
    ? [
        [`${WINES.length}`, hero.statWines],
        [`${REGION_COUNT}`, hero.statRegions],
        ["2019", hero.statSince],
      ]
    : null;

  return (
    <div className="relative -mb-12 min-h-screen lg:-mb-16">
      {/* ============ HERO ============ */}
      <HomeHeroPreload />
      <section className="grain relative overflow-hidden">
        {/* Volle Foto-Bühne wie auf den Wein-Landingpages: das Küstenfoto
            trägt den Hero, die Headline steht links im Schleierlicht. Das
            <picture> ist server-gerendert und per Preload das einzige
            priorisierte Bild der Seite (LCP). */}
        <HomeHeroFx photo={<HomeHeroPhoto alt={hero.photoAlt ?? ""} />} />

        {/* Schleier für Lesbarkeit: mobil von unten, ab lg von links.
            Espresso statt Elfenbein — die Headline steht in Weiß, also muss der
            Schleier abdunkeln statt aufzuhellen. Als Radial statt Linear, damit
            die obere Bildkante hell bleibt und die Navigation dort weiter auf
            dem Elfenbein-Hauch (unten) lesbar ist. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(160%_110%_at_50%_100%,rgba(33,21,17,0.94)_0%,rgba(33,21,17,0.72)_42%,rgba(33,21,17,0)_82%)] lg:hidden" />
          <div className="absolute inset-0 hidden bg-[radial-gradient(140%_115%_at_18%_55%,rgba(33,21,17,0.94)_0%,rgba(33,21,17,0.7)_38%,rgba(33,21,17,0)_74%)] lg:block" />
        </div>

        {/* Elfenbein-Hauch oben, damit die Navigation über dem Abendhimmel
            lesbar bleibt */}
        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory/70 via-ivory/25 to-transparent"
          aria-hidden="true"
        />

        {/* settle into the page colour — auf dem Telefon kurz gehalten, sonst
            läge die letzte Zeile mitten im Elfenbein-Verlauf und die helle
            Schrift verlöre ihren Grund */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-ivory sm:h-44" />

        {/* Telefon-Budget: Eyebrow + drei Headline-Zeilen + Claim + Lede + zwei
            gestapelte CTAs müssen in EIN 100svh passen — die Basiswerte sind
            deshalb enger, ab sm gelten wieder die alten. */}
        <div className="relative mx-auto flex min-h-[100svh] max-w-content flex-col justify-end px-6 pb-24 pt-24 sm:pt-32 lg:justify-center lg:px-10 lg:pb-16">
          <div className="lg:max-w-xl">
            <Reveal y={18} delay={0.05}>
              <Eyebrow tone="text-champagne-light">{hero.eyebrow}</Eyebrow>
            </Reveal>
            {/* Genau EINE H1 — Marke plus Hauptkeyword (Brief §3). Der
                italienische Claim steht darunter als eigener Absatz mit
                lang="it": zwei Knoten, damit im DOM nie „Maria MariaIl
                piacere del vino." entsteht. Die Schriftgröße ist die der
                zweizeiligen Wein-Hero-Titel — der alte Grad war für zwei
                Wörter gemacht, hier stehen fünf. */}
            <h1 className="mt-4 font-playfair text-[clamp(2.6rem,5.4vw,4.1rem)] leading-[1.06] tracking-[-0.015em] text-ivory sm:mt-6">
              <SplitText text={hero.title ?? "Maria Maria"} className="block" delay={0.12} />
            </h1>
            <p
              lang="it"
              className="mt-3 font-playfair text-[clamp(1.5rem,3.1vw,2.4rem)] italic leading-[1.15] text-champagne"
            >
              <SplitText text={hero.claim ?? "Il piacere del vino."} className="block" delay={0.3} />
            </p>
            <Reveal delay={0.5} y={16}>
              {/* wie im Wein-Hero: die Zierlinie weicht auf Telefonen dem Platz */}
              <GrapeRule className="mt-6 hidden sm:flex" />
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ivory/80">{hero.lede}</p>
            </Reveal>
            <Reveal delay={0.62} y={16}>
              <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-3.5">
                <Button href="/unsere-weine" size="lg" className="w-full sm:w-auto">
                  {hero.ctaWines}
                </Button>
                {/* Zweite CTA: persönliche Beratung (Brief §3), sofern die
                    Sprache sie führt — sonst wie bisher der Shop. */}
                {hero.ctaContact ? (
                  <Button href="/kontakt" variant="outline" size="lg" className="w-full sm:w-auto">
                    {hero.ctaContact}
                  </Button>
                ) : (
                  <Button href="/shop" variant="outline" size="lg" className="w-full sm:w-auto">
                    {hero.ctaShop}
                  </Button>
                )}
              </div>
            </Reveal>
            {stats && (
              <Reveal delay={0.78} y={12}>
                <dl className="mt-7 flex max-w-md items-center sm:mt-11">
                  {stats.map(([num, label], i) => (
                    <div key={label} className={`flex-1 ${i > 0 ? "border-l border-ivory/20 pl-6" : ""}`}>
                      <dt className="sr-only">{label}</dt>
                      <dd>
                        <span className="font-playfair text-[26px] text-champagne">{num}</span>
                        <span className="mt-0.5 block text-[10.5px] uppercase tracking-[0.14em] text-ivory/65">
                          {label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <Marquee items={MARQUEE} />

      {/* ============ DER MARIA-MOMENT ============ */}
      <section className="grain relative overflow-hidden">
        {/* Terrassen-Foto als weiche Bühne: federnd im Parallax-Drift, unter
            einem Elfenbein-Schleier, damit Titel und Karten lesbar bleiben und
            die Ränder nahtlos in Marquee und Weine-Band übergehen */}
        <div aria-hidden="true" className="absolute inset-0">
          <Parallax speed={0.08} overscan className="h-full w-full">
            <Photo
              src="/img/home/moment-bg.jpg"
              alt=""
              sizes="100vw"
              className="h-full w-full object-cover object-center"
            />
          </Parallax>
          <div className="absolute inset-0 bg-ivory/65" />
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ivory via-ivory/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ivory via-ivory/70 to-transparent" />
        </div>
        <Atmosphere variant="warm" className="opacity-60" />
        <div className="relative mx-auto max-w-content px-6 py-10 sm:py-14 lg:px-10">
        <SectionTitle eyebrow={philosophy.eyebrow} description={philosophy.description}>
          {philosophy.title}
        </SectionTitle>
        <Stagger className="mx-auto mt-7 grid w-full grid-cols-1 gap-5 sm:mt-9 sm:grid-cols-2 lg:grid-cols-4">
          {MOMENT_ICONS.map(([key, icon]) => {
            const m = philosophy.moments?.[key] ?? {};
            return (
              <StaggerItem key={key} className="h-full">
                <TiltCard className="group h-full" max={5} radius="rounded-card-lg">
                  <div className="ring-hairline relative flex h-full flex-col overflow-hidden rounded-card-lg border border-stone/40 bg-white/70 p-5 shadow-luxe backdrop-blur-md transition-[box-shadow,border-color] duration-500 group-hover:border-champagne/60 group-hover:shadow-lift sm:p-6">
                    <div className="relative flex items-center gap-4 lg:block">
                      <IconChip>{icon}</IconChip>
                      <h3 className="font-playfair text-[18px] text-charcoal lg:mt-3.5">{m.title}</h3>
                    </div>
                    <p className="relative mt-3 text-[12.5px] leading-[1.6] text-charcoal/70 lg:mt-2.5">{m.text}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </Stagger>
        {/* Abschluss der Philosophie: Zierlinie, Einordnung, Partner-Einstieg */}
        <Reveal className="mt-9 flex flex-col items-center gap-4 sm:mt-11">
          <GrapeRule />
          <p className="text-balance text-center text-[13px] leading-[1.6] text-charcoal/70">
            {philosophy.note}
          </p>
          <Button href="/kontakt" size="lg">
            {philosophy.cta}
          </Button>
        </Reveal>
        </div>
      </section>

      {/* ============ UNSERE WEINE (rail) ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream via-champagne-light/25 to-ivory py-16 sm:py-20 lg:py-24">
        <Vines className="inset-x-0 bottom-0 h-72 w-full" />
        <Aura tint="bordeaux" className="-right-56 -top-44 h-[34rem] w-[34rem]" />
        <Aura tint="gold" drift={2} className="-left-48 bottom-0 h-[30rem] w-[30rem]" />
        <GhostWord className="left-[-1vw] top-6 text-[11vw]">Vini d&apos;Italia</GhostWord>
        <div className="relative mx-auto max-w-content px-6 lg:px-10">
          <SectionTitle align="left" eyebrow={collection.eyebrow} description={collection.description}>
            {collection.title}
          </SectionTitle>
          <WineRail wines={WINES} className="mt-8 sm:mt-10" />
        </div>
      </section>

      {/* ============ LE ORIGINI (Markengeschichte) ============ */}
      <OriginsSection t={t.origins} souls={souls} />

      {/* ============ DIE DREI WEINHERKÜNFTE ============ */}
      <section className="relative overflow-hidden">
        <Atmosphere variant="olive" />
        <GhostWord className="right-[-3vw] top-14 text-[13vw]">Italia</GhostWord>
        <div className="relative mx-auto max-w-content px-6 py-16 sm:py-24 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle align="left" eyebrow={regionsCopy.eyebrow} description={regionsCopy.description}>
            {regionsCopy.title}
          </SectionTitle>
          <Reveal delay={0.15}>
            <Button href="/regionen" variant="premium" size="sm">
              {regionsCopy.cta}
            </Button>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="mt-10 sm:mt-12">
          <RegionExplorer regions={regions} ctaLabel={regionsCopy.detailCta} />
        </Reveal>
        </div>
      </section>

      {/* ============ DIE DREI SEGMENTE (Conversion) ============ */}
      {/* Zwischen Herkünften und Shop-Band, wie die Gliederung des Briefs es
          vorsieht: erst die Weine und woher sie kommen, dann für wen. */}
      {segments && (
        <section className="relative overflow-hidden bg-gradient-to-b from-ivory via-cream to-ivory">
          <Atmosphere variant="warm" className="opacity-50" />
          <Aura tint="gold" drift={2} className="-right-40 top-10 h-[28rem] w-[28rem]" />
          <div className="relative mx-auto max-w-content px-6 py-16 sm:py-24 lg:px-10">
            <SectionTitle description={segments.intro}>{segments.title}</SectionTitle>
            <SegmentCards items={segmentItems} />
            {/* Local proof — Mettmann bei Düsseldorf, NRW und darüber hinaus */}
            <Reveal delay={0.1} className="mt-8 flex items-start justify-center gap-2.5 sm:mt-10">
              <Pin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-bordeaux" />
              <p className="text-balance text-center text-[13px] leading-relaxed text-charcoal/70">
                {segments.proof}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ SHOP CTA (liquid-glass band) ============ */}
      {/* Bauform liegt in components/ui/ShopCtaBand — dieses Band war die
          Vorlage, die übrigen Seiten teilen sie jetzt. /shop führt über
          LocaleLink zum offiziellen externen Shop (Terra Vera). */}
      <ShopCtaBand
        eyebrow={band.eyebrow}
        title={
          <>
            {band.title} <span className="italic text-champagne">{band.titleAccent}</span>
          </>
        }
        text={band.text}
        primary={{ label: band.primary, href: "/shop" }}
        secondary={{ label: band.secondary, href: "/kontakt" }}
      />

      {/* ============ HÄUFIGE FRAGEN (Brand-FAQ) ============ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-cream via-champagne-light/25 to-ivory">
        <Vines className="inset-x-0 bottom-0 h-72 w-full" />
        <Aura tint="bordeaux" className="-right-56 -top-44 h-[34rem] w-[34rem]" />
        <FaqSection
          className="relative"
          pageType="home"
          eyebrow={faqCopy.eyebrow}
          title={
            <>
              {faqCopy.title} <span className="italic text-bordeaux">{faqCopy.titleAccent}</span>
            </>
          }
          description={faqCopy.description}
          items={faq}
          layout="single"
          footer={{
            note: faqCopy.footerNote,
            label: faqCopy.footerLabel,
            href: "/kontakt",
          }}
        />
      </div>
    </div>
  );
}
