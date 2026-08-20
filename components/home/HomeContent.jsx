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
import WineRail from "@/components/WineRail";
import FaqSection from "@/components/faq/FaqSection";
import { Vineyard, Glasses, Plate, Conversation } from "@/components/Icons";
import { WINES, REGION_COUNT } from "@/components/data";
import Atmosphere, { Aura, GhostWord, Vines } from "@/components/Atmosphere";

/* Die Startseite — Hero, Philosophie, Origins, Weine-Rail, Regionen,
   Shop-CTA und Magazin-Teaser.

   Der gesamte Text kommt als `t` aus content/<sprache>/home.js; hier steht
   nur noch die Struktur — Reihenfolge, Ikonen, Bildpfade und die
   Bildausschnitte, die zu den Motiven gehören und keine Sprache kennen. */

/* Reihenfolge und Ikone je Philosophie-Karte; der Schlüssel holt Titel und
   Text aus dem Wörterbuch. */
const MOMENT_ICONS = [
  ["selection", <Glasses className="h-7 w-7" />],
  ["origin", <Vineyard className="h-7 w-7" />],
  ["occasion", <Plate className="h-7 w-7" />],
  ["guidance", <Conversation className="h-7 w-7" />],
];

/* Region-Struktur: Foto, Bildausschnitt und der Anker auf /regionen. Name,
   Kurzzeile und Fließtext stehen je Sprache im Wörterbuch. */
const REGION_SHAPE = [
  {
    key: "apulien",
    region: "apulien",
    img: "/img/home/region-apulien.webp",
    /* Trulli links im Bild; Crop hält die eingezeichnete Karte aus dem Schnitt */
    pos: "26% 50%",
  },
  {
    key: "kampanien",
    region: "kampanien",
    img: "/img/home/region-kampanien.webp",
    /* der Vesuv leicht links, damit die eingezeichnete Karte nicht anschneidet */
    pos: "40% 45%",
  },
  {
    key: "garda",
    region: "garda",
    img: "/img/home/region-garda.webp",
    /* See und Berge tragen das Bild; Karte bleibt außerhalb des Schnitts */
    pos: "38% 55%",
  },
];

/* Rebsorten im Laufband — Namen, keine Beschriftungen: bleiben in jeder
   Sprache stehen. */
const MARQUEE = ["Primitivo", "Lugana", "Falanghina", "Greco di Tufo", "Aglianico", "Rosato"];

export default function HomeContent({ t = {}, faq = [], souls }) {
  const hero = t.hero ?? {};
  const philosophy = t.philosophy ?? {};
  const collection = t.collection ?? {};
  const regionsCopy = t.regions ?? {};
  const band = t.shopBand ?? {};
  const faqCopy = t.faq ?? {};

  const regions = REGION_SHAPE.map((r) => ({ ...r, ...(regionsCopy.items?.[r.key] ?? {}) }));

  return (
    <div className="relative min-h-screen">
      {/* ============ HERO ============ */}
      <HomeHeroPreload />
      <section className="grain relative overflow-hidden">
        {/* Volle Foto-Bühne wie auf den Wein-Landingpages: das Terrassen-Foto
            trägt den Hero, die Headline steht links im Schleierlicht. */}
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
            läge die Statzeile mitten im Elfenbein-Verlauf und die helle Schrift
            verlöre ihren Grund */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-ivory sm:h-44" />

        {/* Telefon-Budget: Eyebrow + drei Headline-Zeilen + Lede + zwei
            gestapelte CTAs + Statzeile müssen in EIN 100svh passen — die
            Basiswerte sind deshalb enger, ab sm gelten wieder die alten. */}
        <div className="relative mx-auto flex min-h-[100svh] max-w-content flex-col justify-end px-6 pb-24 pt-24 sm:pt-32 lg:justify-center lg:px-10 lg:pb-16">
          <div className="lg:max-w-xl">
            <Reveal y={18} delay={0.05}>
              <Eyebrow tone="text-champagne-light">{hero.eyebrow}</Eyebrow>
            </Reveal>
            {/* Markenname und Claim bleiben in jeder Sprache stehen. */}
            <h1 className="mt-4 font-playfair text-[clamp(2.8rem,6vw,4.6rem)] leading-[1.05] tracking-[-0.015em] text-ivory sm:mt-6">
              <SplitText text="Maria Maria" className="block text-[1.15em]" delay={0.12} />
              <SplitText text="Il piacere del vino." className="mt-1 block text-[0.62em] italic tracking-[-0.005em] text-champagne" delay={0.3} />
            </h1>
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
                <Button href="/shop" variant="outline" size="lg" className="w-full sm:w-auto">
                  {hero.ctaShop}
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.78} y={12}>
              <dl className="mt-7 flex max-w-md items-center sm:mt-11">
                {[
                  [`${WINES.length}`, hero.statWines],
                  [`${REGION_COUNT}`, hero.statRegions],
                  ["2019", hero.statSince],
                ].map(([num, label], i) => (
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

      {/* ============ REGIONEN ============ */}
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

      {/* ============ SHOP CTA (liquid-glass band) ============ */}
      {/* Bauform liegt in components/ui/ShopCtaBand — dieses Band war die
          Vorlage, die übrigen Seiten teilen sie jetzt. */}
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
