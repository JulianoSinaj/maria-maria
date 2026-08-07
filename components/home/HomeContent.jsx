import Link from "next/link";
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
import { HOME_FAQ } from "@/components/faq/faqData";
import { Vineyard, Glasses, Plate, Conversation, Arrow, Clock } from "@/components/Icons";
import { WINES, REGION_COUNT } from "@/components/data";
import Atmosphere, { Aura, GhostWord, Vines } from "@/components/Atmosphere";

/* Die Startseite — Hero, Philosophie, Origins, Weine-Rail, Regionen,
   Shop-CTA und Magazin-Teaser. */

const MOMENT = [
  {
    icon: <Glasses className="h-7 w-7" />,
    kicker: "Auswahl",
    title: "Persönlich kuratiert",
    text: "Jeder Wein wird persönlich verkostet und bewusst ausgewählt. So entsteht ein überschaubares Boutique-Sortiment, das Gastgeber sicher empfehlen und Genießer leicht entdecken können.",
    note: "Persönlich verkostet · Kuratiert",
  },
  {
    icon: <Vineyard className="h-7 w-7" />,
    kicker: "Herkunft",
    title: "Herkunft mit Handschrift",
    text: "Wir arbeiten mit ausgewählten, familiengeführten Weingütern in Italien. Region, Rebsorte und die Menschen hinter dem Wein geben jeder Flasche eine glaubwürdige und erzählenswerte Geschichte.",
    note: "Familiengeführt · Italien",
  },
  {
    icon: <Plate className="h-7 w-7" />,
    kicker: "Anlass",
    title: "Für Genussmomente gemacht",
    text: "Vom Aperitivo und Food Pairing bis zu Events und stilvollen Geschenken: Maria Maria verbindet Geschmack, Ästhetik und italienische Lebensart in Momenten, die in Erinnerung bleiben.",
    note: "Aperitivo · Events · Geschenke",
  },
  {
    icon: <Conversation className="h-7 w-7" />,
    kicker: "Begleitung",
    title: "Persönlich begleitet",
    text: "Ein klares Sortiment, verständliche Empfehlungen und der direkte Austausch erleichtern Auswahl und Einsatz – für eine persönliche Zusammenarbeit auf Augenhöhe.",
    note: "Direkter Austausch · Beratung",
  },
];

const REGIONS = [
  {
    name: "Apulien",
    tag: "Das Herz des Südens",
    desc: "Die Sonne des Südens und kraftvolle Aromen.",
    long: "Zwischen Salento und Gallipoli reifen Primitivo und Negroamaro unter der Sonne des Südens – kraftvolle, warme Weine mit mediterraner Seele.",
    grapes: ["Primitivo", "Negroamaro", "Rosato"],
    region: "apulien",
    img: "/img/home/region-apulien.webp",
    /* Trulli links im Bild; Crop hält die eingezeichnete Karte aus dem Schnitt */
    pos: "26% 50%",
  },
  {
    name: "Kampanien",
    tag: "Zwischen Vulkan und Meer",
    desc: "Vulkanische Böden, ursprüngliche Charaktere.",
    long: "Rund um Napoli und Salerno prägen die vulkanischen Böden des Vesuv Weine mit Tiefe und Ursprünglichkeit – von Falanghina bis Aglianico.",
    grapes: ["Falanghina", "Greco di Tufo", "Aglianico"],
    region: "kampanien",
    img: "/img/home/region-kampanien.webp",
    /* der Vesuv leicht links, damit die eingezeichnete Karte nicht anschneidet */
    pos: "40% 45%",
  },
  {
    name: "Gardasee / Lombardei",
    tag: "Eleganz des Nordens",
    desc: "Eleganz, Frische und mineralische Tiefe.",
    long: "Am Südufer des Gardasees entsteht Lugana – ein Weißwein von seltener Eleganz, getragen von Frische und mineralischer Tiefe.",
    grapes: ["Lugana", "Turbiana"],
    region: "garda",
    img: "/img/home/region-garda.webp",
    /* See und Berge tragen das Bild; Karte bleibt außerhalb des Schnitts */
    pos: "38% 55%",
  },
];

const MAGAZINE = [
  {
    cat: "Weinwissen",
    title: "Was passt zu Primitivo?",
    excerpt: "Tipps für harmonische Kombinationen mit Aromen, die begeistern.",
    min: "4 Min.",
    img: "/img/food.jpg",
  },
  {
    cat: "Regionen",
    title: "Apulien – Das Herz des Südens",
    excerpt: "Eine Reise in das Herz Süditaliens und seine unverwechselbaren Weine.",
    min: "6 Min.",
    img: "/img/magazin/weinlese.jpg",
  },
  {
    cat: "Weinwissen",
    title: "Rebsorten verstehen, Wein bewusster genießen",
    excerpt: "Die wichtigsten italienischen Rebsorten und ihre Besonderheiten.",
    min: "5 Min.",
    img: "/img/stilllife.jpg",
  },
];

const MARQUEE = ["Primitivo", "Lugana", "Falanghina", "Greco di Tufo", "Aglianico", "Rosato"];

export default function HomeContent() {
  return (
    <div className="relative min-h-screen">
      {/* ============ HERO ============ */}
      <HomeHeroPreload />
      <section className="grain relative overflow-hidden">
        {/* Volle Foto-Bühne wie auf den Wein-Landingpages: das Terrassen-Foto
            trägt den Hero, die Headline steht links im Schleierlicht. */}
        <HomeHeroFx photo={<HomeHeroPhoto />} />

        {/* Schleier für Lesbarkeit: mobil von unten, ab lg von links */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-t from-ivory/90 via-ivory/35 via-35% to-transparent to-70% lg:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-ivory/90 via-ivory/30 via-35% to-transparent to-70% lg:block" />
        </div>

        {/* Elfenbein-Hauch oben, damit die Navigation über dem Abendhimmel
            lesbar bleibt */}
        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory/55 via-ivory/20 to-transparent"
          aria-hidden="true"
        />

        {/* settle into the page colour */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-content flex-col justify-end px-6 pb-24 pt-32 lg:justify-center lg:px-10 lg:pb-16">
          <div className="lg:max-w-xl">
            <Reveal y={18} delay={0.05}>
              <Eyebrow tone="text-vine">Italienische Boutique-Weine</Eyebrow>
            </Reveal>
            <h1 className="mt-6 font-playfair text-[clamp(2.8rem,6vw,4.6rem)] leading-[1.05] tracking-[-0.015em] text-charcoal">
              <SplitText text="Maria Maria" className="block" delay={0.12} />
              <SplitText
                text="Il piacere del vino."
                className="block italic"
                /* Gradient muss pro Wort liegen – der äußere Wrapper malt nicht
                   durch die overflow-clip-Spans von SplitText hindurch */
                wordClassName="bg-gradient-to-r from-bordeaux via-wine to-bordeaux bg-clip-text text-transparent"
                delay={0.3}
              />
            </h1>
            <Reveal delay={0.5} y={16}>
              <GrapeRule className="mt-6" />
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-charcoal/75">
                Handverlesene Weine kleiner Familienweingüter – für bewusst gewählte Genussmomente,
                vom Aperitivo bis zum großen Abend.
              </p>
            </Reveal>
            <Reveal delay={0.62} y={16}>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-3.5">
                <Button href="/unsere-weine" size="lg" className="w-full sm:w-auto">
                  Weine entdecken
                </Button>
                <Button href="/shop" variant="outline" size="lg" className="w-full sm:w-auto">
                  Zum Shop
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.78} y={12}>
              <dl className="mt-9 flex max-w-md items-center sm:mt-11">
                {[
                  [`${WINES.length}`, "Boutique-Weine"],
                  [`${REGION_COUNT}`, "Regionen Italiens"],
                  ["2019", "seit der Gründung"],
                ].map(([num, label], i) => (
                  <div key={label} className={`flex-1 ${i > 0 ? "border-l border-charcoal/10 pl-6" : ""}`}>
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <span className="font-playfair text-[26px] text-bordeaux">{num}</span>
                      <span className="mt-0.5 block text-[10.5px] uppercase tracking-[0.14em] text-charcoal/55">
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
        <SectionTitle
          eyebrow="Unsere Philosophie"
          description="Persönlich kuratiert, klar in ihrer Herkunft und ausgewählt für Gastronomie, Hospitality, Events und besondere Genussmomente."
        >
          Italienische Boutique-Weine, die sich leicht wählen, erzählen und erleben lassen.
        </SectionTitle>
        <Stagger className="mx-auto mt-7 grid w-full grid-cols-1 gap-5 sm:mt-9 sm:grid-cols-2 lg:grid-cols-4">
          {MOMENT.map((m, i) => (
            <StaggerItem key={m.title} className="h-full">
              <TiltCard className="group h-full" max={5} radius="rounded-card-lg">
                <div className="ring-hairline relative flex h-full flex-col overflow-hidden rounded-card-lg border border-stone/40 bg-white/70 p-5 shadow-luxe backdrop-blur-md transition-[box-shadow,border-color] duration-500 group-hover:border-champagne/60 group-hover:shadow-lift sm:p-6">
                  <div className="relative flex items-center gap-4 lg:block">
                    <IconChip>{m.icon}</IconChip>
                    <h3 className="font-playfair text-[18px] text-charcoal lg:mt-3.5">{m.title}</h3>
                  </div>
                  <p className="relative mt-3 text-[12.5px] leading-[1.6] text-charcoal/70 lg:mt-2.5">{m.text}</p>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
        {/* Abschluss der Philosophie: Zierlinie, Einordnung, Partner-Einstieg */}
        <Reveal className="mt-9 flex flex-col items-center gap-4 sm:mt-11">
          <GrapeRule />
          <p className="text-balance text-center text-[13px] leading-[1.6] text-charcoal/70">
            Für Gastronomie, Hospitality und besondere Konzepte
          </p>
          <Button href="/kontakt" size="lg">
            Maria Maria als Partner entdecken
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
          <SectionTitle
            align="left"
            eyebrow="Die Kollektion"
            description="Neun Charaktere aus vier Regionen – jeder mit eigener Geschichte."
          >
            Unsere Weine
          </SectionTitle>
          <WineRail wines={WINES} className="mt-8 sm:mt-10" />
        </div>
      </section>

      {/* ============ LE ORIGINI (Markengeschichte) ============ */}
      <OriginsSection />

      {/* ============ REGIONEN ============ */}
      <section className="relative overflow-hidden">
        <Atmosphere variant="olive" />
        <GhostWord className="right-[-3vw] top-14 text-[13vw]">Italia</GhostWord>
        <div className="relative mx-auto max-w-content px-6 py-16 sm:py-24 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            align="left"
            eyebrow="Herkunft"
            description="Boden, Licht und Klima prägen jede Traube – am Ende schmeckt man die Landschaft im Glas."
          >
            Wo unsere Weine zuhause sind
          </SectionTitle>
          <Reveal delay={0.15}>
            <Button href="/regionen" variant="outline" size="sm">
              Alle Regionen
            </Button>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="mt-10 sm:mt-12">
          <RegionExplorer regions={REGIONS} />
        </Reveal>
        </div>
      </section>

      {/* ============ SHOP CTA (liquid-glass band) ============ */}
      {/* Bauform liegt in components/ui/ShopCtaBand — dieses Band war die
          Vorlage, die übrigen Seiten teilen sie jetzt. */}
      <ShopCtaBand
        eyebrow="Der offizielle Shop"
        title={
          <>
            Bereit für den Geschmack, der <span className="italic text-champagne">Sie inspiriert?</span>
          </>
        }
        text="Entdecken und bestellen Sie unsere Weine bequem online – direkt vom Weingut zu Ihnen nach Hause."
        primary={{ label: "Zum Shop", href: "/shop" }}
        secondary={{ label: "Kontakt aufnehmen", href: "/kontakt" }}
      />

      {/* ============ MAGAZIN ============ */}
      <section className="relative overflow-hidden">
        <Atmosphere variant="dusk" />
        <GhostWord className="left-[-2vw] bottom-6 text-[12vw]">Storie</GhostWord>
        <div className="relative mx-auto max-w-content px-6 py-16 sm:py-24 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            align="left"
            eyebrow="Magazin"
            description="Geschichten, Weinwissen und Inspiration für den nächsten Genussmoment."
          >
            Weinwissen &amp; Genussmomente
          </SectionTitle>
          <Reveal delay={0.15}>
            <Button href="/magazin" variant="outline" size="sm">
              Zum Magazin
            </Button>
          </Reveal>
        </div>
        <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-3">
          {MAGAZINE.map((a) => (
            <StaggerItem key={a.title} className="h-full">
              <Link href="/magazin" className="group block h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-card border border-stone/50 bg-white/70 shadow-luxe transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-champagne/60 hover:shadow-lift">
                  <div className="relative h-52 overflow-hidden">
                    {/* Dreispaltiges Raster in max-w-content — die Karte wird
                        nie breiter als ~380 px, das Motiv liegt aber in 700–
                        1400 px vor. Ohne sizes lüde der Browser die größte. */}
                    <Photo
                      src={a.img}
                      alt=""
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
                    />
                    <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                      {a.cat}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-playfair text-[19px] leading-snug text-charcoal transition-colors duration-300 group-hover:text-bordeaux">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-charcoal/65">{a.excerpt}</p>
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-charcoal/50">
                        <Clock className="h-3.5 w-3.5" /> {a.min} Lesedauer
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-bordeaux">
                        Mehr lesen
                        <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        </div>
      </section>

      {/* ============ HÄUFIGE FRAGEN (Brand-FAQ) ============ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-cream via-champagne-light/25 to-ivory">
        <Vines className="inset-x-0 bottom-0 h-72 w-full" />
        <Aura tint="bordeaux" className="-right-56 -top-44 h-[34rem] w-[34rem]" />
        <FaqSection
          className="relative"
          pageType="home"
          eyebrow="Häufige Fragen"
          title={
            <>
              Maria Maria, <span className="italic text-bordeaux">kurz erklärt.</span>
            </>
          }
          description="Alles, was Sie über unsere Weine, den Einkauf und eine mögliche Zusammenarbeit mit Maria Maria wissen möchten."
          items={HOME_FAQ}
          layout="single"
          footer={{
            note: "Noch Fragen oder Interesse an einer Zusammenarbeit?",
            label: "Persönlich Kontakt aufnehmen",
            href: "/kontakt",
          }}
        />
      </div>
    </div>
  );
}
