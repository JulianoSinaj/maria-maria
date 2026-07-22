import Link from "next/link";
import ShaderGradient from "@/components/motion/ShaderGradient";
import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { SectionTitle, Eyebrow, GrapeRule, IconChip } from "@/components/Deco";
import { Arrow, Plate, GrapeVine, Book } from "@/components/Icons";
import { WINES, REGION_COUNT } from "@/components/data";
import WineExplorer from "@/components/weine/WineExplorer";
import Atmosphere, { Aura, GhostWord, Vines } from "@/components/Atmosphere";

export const metadata = {
  title: "Unsere Weine — Maria Maria",
  description:
    "Handverlesene italienische Boutique-Weine von kleinen Weingütern – Rotwein, Weißwein und Rosé aus Apulien, Kampanien, der Basilikata und vom Gardasee.",
};

const MOMENTS = [
  {
    title: "Aperitivo",
    text: "Leicht, frisch und bereichernd.",
    img: "/img/aperitivo.jpg",
  },
  {
    title: "Dinner",
    text: "Elegante Begleiter für besondere Gerichte.",
    img: "/img/dinner.jpg",
  },
  {
    title: "Freunde",
    text: "Für gute Gespräche und unvergessliche Abende.",
    img: "/img/tasting.jpg",
  },
  {
    title: "Geschenk",
    text: "Stilvoll schenken – Freude, die bleibt.",
    img: "/img/gift.jpg",
  },
];

const HELP = [
  {
    icon: <Plate className="h-7 w-7" />,
    title: "Food Pairing",
    text: "Entdecken Sie passende Speisen zu unseren Weinen – für den perfekten Genussmoment.",
    link: "Mehr erfahren",
    href: "/magazin",
  },
  {
    icon: <GrapeVine className="h-7 w-7" />,
    title: "Rebsorten",
    text: "Lernen Sie die wichtigsten italienischen Rebsorten kennen und ihre Besonderheiten.",
    link: "Mehr erfahren",
    href: "/magazin",
  },
  {
    icon: <Book className="h-7 w-7" />,
    title: "FAQ",
    text: "Häufige Fragen rund um Wein, Bestellung und Versand – kurz beantwortet.",
    link: "Zu den FAQs",
    href: "/kontakt",
  },
];

export default function WeinePage() {
  return (
    <div className="relative min-h-screen">
      {/* ============ HERO ============ */}
      <section className="grain relative overflow-hidden">
        <ShaderGradient palette="dawn" />
        {/* settle into the page colour */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory" />

        <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-14 px-6 pb-24 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-36">
          <div>
            <Reveal y={18} delay={0.05}>
              <Eyebrow>Die Kollektion</Eyebrow>
            </Reveal>
            <h1 className="mt-6 font-playfair text-[clamp(2.6rem,5.4vw,4.1rem)] leading-[1.06] text-charcoal">
              <SplitText text="Unsere Weine" className="block" delay={0.12} />
              <SplitText
                text="Neun Charaktere."
                className="block bg-gradient-to-r from-bordeaux via-wine to-champagne bg-clip-text italic text-transparent"
                delay={0.3}
              />
            </h1>
            <Reveal delay={0.5} y={16}>
              <GrapeRule className="mt-7" />
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/75">
                Maria Maria steht für handverlesene italienische Boutique-Weine von kleinen Weingütern – ausgewählt
                für bewusste Momente und echten Genuss.
              </p>
            </Reveal>
            <Reveal delay={0.62} y={16}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href="#kollektion" size="lg">
                  Zur Kollektion
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
                  ["3", "Weinarten"],
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

          {/* photo frame */}
          <Reveal delay={0.35} y={26} className="hidden lg:block">
            <div className="group ring-hairline relative overflow-hidden rounded-card-lg shadow-luxe">
              <Parallax speed={0.1} overscan className="aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/weine-hero.jpg"
                  alt="Stillleben mit italienischen Boutique-Weinen im warmen Abendlicht"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                />
              </Parallax>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-espresso/45 via-transparent to-transparent"
              />
              <span className="glass absolute bottom-4 left-4 rounded-full px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                Aus kleinen Familienweingütern
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ WINE EXPLORER ============ */}
      <section id="kollektion" className="relative scroll-mt-28 overflow-hidden">
        <Atmosphere variant="warm" />
        <GhostWord className="right-[-2vw] top-4 text-[11vw]">La Cantina</GhostWord>
        <div className="relative mx-auto max-w-content px-6 pb-24 pt-2 lg:px-10">
          <h2 className="sr-only">Die Kollektion</h2>
          <WineExplorer />
        </div>
      </section>

      {/* ============ WELCHER WEIN PASST ZU IHREM MOMENT ============ */}
      <section className="relative overflow-hidden">
        <Atmosphere variant="rose" />
        <GhostWord className="left-[-2vw] top-8 text-[12vw]">Occasioni</GhostWord>
        <div className="relative mx-auto max-w-content px-6 pb-24 lg:px-10">
        <SectionTitle
          eyebrow="Genussmomente"
          description="Vier Anlässe, vier Stimmungen – finden Sie den Wein, der Ihren Augenblick begleitet."
        >
          Welcher Wein passt zu <span className="italic text-bordeaux">Ihrem Moment?</span>
        </SectionTitle>
        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MOMENTS.map((m, i) => (
            <StaggerItem key={m.title} className="h-full">
              <TiltCard className="group h-full" max={5} radius="rounded-card-lg">
                <article className="relative h-[300px] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.img}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-transparent"
                  />
                  <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                    Moment 0{i + 1}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-playfair text-[24px] text-ivory">{m.title}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-snug text-ivory/80">{m.text}</p>
                    <div className="mt-5">
                      <Button
                        href="#kollektion"
                        variant="glass"
                        size="sm"
                        magnetic={false}
                        aria-label={`Passende Weine für ${m.title} entdecken`}
                      >
                        Weine finden
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

      {/* ============ HELP STRIP ============ */}
      <section className="relative overflow-hidden border-y border-stone/40 bg-gradient-to-b from-cream via-champagne-light/25 to-ivory py-20 lg:py-24">
        <Vines className="inset-x-0 bottom-0 h-72 w-full" />
        <Aura tint="bordeaux" className="-left-56 -top-44 h-[34rem] w-[34rem]" />
        <Aura tint="gold" drift={2} className="-right-48 bottom-0 h-[30rem] w-[30rem]" />
        <div className="relative mx-auto max-w-content px-6 lg:px-10">
          <SectionTitle
            align="left"
            eyebrow="Gut zu wissen"
            description="Wissen und Antworten rund um Ihre Auswahl – vom passenden Gericht bis zur richtigen Rebsorte."
          >
            Gut beraten genießen
          </SectionTitle>
          <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {HELP.map((h) => (
              <StaggerItem key={h.title} className="h-full">
                <div className="ring-hairline flex h-full flex-col rounded-card-lg border border-stone/40 bg-white/70 p-8 shadow-luxe transition-[box-shadow,border-color] duration-500 hover:border-champagne/60 hover:shadow-lift">
                  <IconChip>{h.icon}</IconChip>
                  <h3 className="mt-6 font-playfair text-[19px] text-charcoal">{h.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">{h.text}</p>
                  <div className="mt-auto pt-6">
                    <Link
                      href={h.href}
                      className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-bordeaux"
                    >
                      {h.link}
                      <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
