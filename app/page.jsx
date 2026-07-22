import Link from "next/link";
import ShaderGradient from "@/components/motion/ShaderGradient";
import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import Marquee from "@/components/motion/Marquee";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { SectionTitle, Eyebrow, GrapeRule, IconChip } from "@/components/Deco";
import HeroVisual, { ScrollCue } from "@/components/home/HeroVisual";
import WineRail from "@/components/WineRail";
import ItalyMap from "@/components/ItalyMap";
import { Vineyard, Barrel, Glasses, Arrow, Clock } from "@/components/Icons";
import { WINES, REGION_COUNT } from "@/components/data";
import Atmosphere, { Aura, GhostWord, Vines } from "@/components/Atmosphere";

const MOMENT = [
  {
    icon: <Vineyard className="h-7 w-7" />,
    title: "Ausgewählte Weingüter",
    text: "Wir arbeiten mit kleinen, familiengeführten Weingütern in Italien zusammen – Menschen, die ihre Heimat, ihre Reben und ihre Handwerkskunst mit Leidenschaft pflegen.",
  },
  {
    icon: <Barrel className="h-7 w-7" />,
    title: "Limitierte Produktion",
    text: "Unsere Weine entstehen in begrenzten Mengen und spiegeln das Terroir und die Persönlichkeit ihrer Herkunft unverfälscht wider – echt, charakterstark, besonders.",
  },
  {
    icon: <Glasses className="h-7 w-7" />,
    title: "Gemeinsam genießen",
    text: "Ein Maria-Moment ist kein Anlass, sondern eine Entscheidung: den Augenblick zu wählen, den Wein zu öffnen und bewusst miteinander zu sein.",
  },
];

const REGIONS = [
  {
    name: "Apulien",
    tag: "Das Herz des Südens",
    desc: "Die Sonne des Südens und kraftvolle Aromen.",
    region: "apulien",
    img: "/img/region-apulien.jpg",
  },
  {
    name: "Kampanien",
    tag: "Zwischen Vulkan und Meer",
    desc: "Vulkanische Böden, ursprüngliche Charaktere.",
    region: "kampanien",
    img: "/img/region-kampanien.jpg",
  },
  {
    name: "Gardasee / Lugana",
    tag: "Eleganz des Nordens",
    desc: "Eleganz, Frische und mineralische Tiefe.",
    region: "garda",
    img: "/img/region-garda.jpg",
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
    img: "/img/vineyard.jpg",
  },
  {
    cat: "Weinwissen",
    title: "Rebsorten verstehen, Wein bewusster genießen",
    excerpt: "Die wichtigsten italienischen Rebsorten und ihre Besonderheiten.",
    min: "5 Min.",
    img: "/img/stilllife.jpg",
  },
];

const MARQUEE = ["Primitivo", "Lugana", "Falanghina", "Greco di Tufo", "Aglianico", "Rosato", "Il piacere del vino"];

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* ============ HERO ============ */}
      <section className="grain relative overflow-hidden">
        <ShaderGradient palette="dawn" />
        {/* settle into the page colour */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory" />

        <div className="relative mx-auto grid min-h-[100svh] max-w-content grid-cols-1 items-center gap-16 px-6 pb-28 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-36">
          <div>
            <Reveal y={18} delay={0.05}>
              <Eyebrow>Italienische Boutique-Weine</Eyebrow>
            </Reveal>
            <h1 className="mt-6 font-playfair text-[clamp(2.8rem,6vw,4.6rem)] leading-[1.05] text-charcoal">
              <SplitText text="Maria Maria" className="block" delay={0.12} />
              <SplitText
                text="Il piacere del vino."
                className="block bg-gradient-to-r from-bordeaux via-wine to-bordeaux bg-clip-text italic text-transparent"
                delay={0.3}
              />
            </h1>
            <Reveal delay={0.5} y={16}>
              <GrapeRule className="mt-7" />
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/75">
                Handverlesene Weine kleiner Familienweingüter – für bewusst gewählte Genussmomente,
                vom Aperitivo bis zum großen Abend.
              </p>
            </Reveal>
            <Reveal delay={0.62} y={16}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href="/weine" size="lg">
                  Weine entdecken
                </Button>
                <Button href="#" external variant="outline" size="lg" iconType="up-right">
                  Zum Shop
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.78} y={12}>
              <dl className="mt-14 flex max-w-md items-center">
                {[
                  [`${WINES.length}`, "Boutique-Weine"],
                  [`${REGION_COUNT}`, "Regionen Italiens"],
                  ["250", "Jahre Tradition"],
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

          <HeroVisual />
        </div>

        <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 lg:block">
          <ScrollCue />
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <Marquee items={MARQUEE} className="border-y border-stone/40" />

      {/* ============ DER MARIA-MOMENT ============ */}
      <section className="relative overflow-hidden">
        <Atmosphere variant="warm" />
        <GhostWord className="right-[-2vw] top-10 text-[12vw]">Momenti</GhostWord>
        <div className="relative mx-auto max-w-content px-6 py-24 lg:px-10">
        <SectionTitle
          eyebrow="Unsere Philosophie"
          description="Drei Überzeugungen, die jede Flasche prägen – vom Weinberg bis ins Glas."
        >
          Der Maria-Moment
        </SectionTitle>
        <Stagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {MOMENT.map((m) => (
            <StaggerItem key={m.title} className="h-full">
              <TiltCard className="group h-full" max={5} radius="rounded-card-lg">
                <div className="ring-hairline flex h-full flex-col rounded-card-lg border border-stone/40 bg-white/70 p-8 shadow-luxe transition-[box-shadow,border-color] duration-500 group-hover:border-champagne/60 group-hover:shadow-lift">
                  <IconChip>{m.icon}</IconChip>
                  <h3 className="mt-6 font-playfair text-[19px] text-charcoal">{m.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">{m.text}</p>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
        </div>
      </section>

      {/* ============ UNSERE WEINE (rail) ============ */}
      <section className="relative overflow-hidden border-y border-stone/40 bg-gradient-to-b from-cream via-champagne-light/25 to-ivory py-20 lg:py-24">
        <Vines className="inset-x-0 bottom-0 h-72 w-full" />
        <Aura tint="bordeaux" className="-right-56 -top-44 h-[34rem] w-[34rem]" />
        <Aura tint="gold" drift={2} className="-left-48 bottom-0 h-[30rem] w-[30rem]" />
        <GhostWord className="left-[-1vw] top-6 text-[11vw]">Vini d&apos;Italia</GhostWord>
        <div className="relative mx-auto max-w-content px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle
              align="left"
              eyebrow="Die Kollektion"
              description="Neun Charaktere aus vier Regionen – jeder mit eigener Geschichte."
            >
              Unsere Weine
            </SectionTitle>
            <Reveal delay={0.15}>
              <Button href="/weine" variant="outline" size="sm">
                Alle Weine
              </Button>
            </Reveal>
          </div>
          <WineRail wines={WINES} className="mt-10" />
        </div>
      </section>

      {/* ============ REGIONEN ============ */}
      <section className="relative overflow-hidden">
        <Atmosphere variant="olive" />
        <GhostWord className="right-[-3vw] top-14 text-[13vw]">Italia</GhostWord>
        <div className="relative mx-auto max-w-content px-6 py-24 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            align="left"
            eyebrow="Herkunft"
            description="Jede Region spricht ihre eigene Sprache – man schmeckt sie im Glas."
          >
            Regionen Italiens entdecken
          </SectionTitle>
          <Reveal delay={0.15}>
            <Button href="/regionen" variant="outline" size="sm">
              Alle Regionen
            </Button>
          </Reveal>
        </div>
        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {REGIONS.map((r) => (
            <StaggerItem key={r.name} className="h-full">
              <TiltCard className="group h-full" max={4} radius="rounded-card-lg">
                <article className="relative h-[430px] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift">
                  <Parallax speed={0.07} overscan className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.img}
                      alt={`Landschaft der Region ${r.name}`}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
                    />
                  </Parallax>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-transparent"
                  />
                  <div className="glass absolute right-4 top-4 rounded-2xl p-2.5">
                    <ItalyMap region={r.region} className="w-11" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-champagne-light">{r.tag}</p>
                    <h3 className="mt-1.5 font-playfair text-[26px] text-ivory">{r.name}</h3>
                    <p className="mt-1.5 max-w-[85%] text-[12.5px] leading-snug text-ivory/80">{r.desc}</p>
                    <div className="mt-5">
                      <Button href={`/regionen#${r.region}`} variant="glass" size="sm" magnetic={false}>
                        Mehr entdecken
                      </Button>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
        </div>
      </section>

      {/* ============ SHOP CTA (shader band) ============ */}
      <section className="px-4 py-10 lg:px-8">
        <div className="grain relative overflow-hidden rounded-card-lg">
          <ShaderGradient palette="wine" />
          <div className="relative mx-auto max-w-3xl px-6 py-24 text-center lg:py-28">
            <Reveal>
              <Eyebrow light className="justify-center">
                Der offizielle Shop
              </Eyebrow>
              <h2 className="mt-4 text-balance font-playfair text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.1] text-ivory">
                Bereit für Ihren <span className="italic text-champagne">Maria-Moment?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-[13.5px] leading-relaxed text-ivory/70">
                Entdecken und bestellen Sie unsere Weine bequem online – direkt vom Weingut zu Ihnen nach Hause.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Button href="#" external variant="light" size="lg" iconType="up-right">
                  Zum Shop
                </Button>
                <Button href="/kontakt" variant="glass" size="lg">
                  Kontakt aufnehmen
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ MAGAZIN ============ */}
      <section className="relative overflow-hidden">
        <Atmosphere variant="dusk" />
        <GhostWord className="left-[-2vw] bottom-6 text-[12vw]">Storie</GhostWord>
        <div className="relative mx-auto max-w-content px-6 py-24 lg:px-10">
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
        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {MAGAZINE.map((a) => (
            <StaggerItem key={a.title} className="h-full">
              <Link href="/magazin" className="group block h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-card border border-stone/50 bg-white/70 shadow-luxe transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-champagne/60 hover:shadow-lift">
                  <div className="relative h-52 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.img}
                      alt=""
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
    </div>
  );
}
