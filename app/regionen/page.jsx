import Link from "next/link";
import ShaderGradient from "@/components/motion/ShaderGradient";
import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { SectionTitle, Eyebrow, GrapeRule, IconChip } from "@/components/Deco";
import WineCard from "@/components/WineCard";
import ItalyMap from "@/components/ItalyMap";
import { Arrow, Check, Fields } from "@/components/Icons";
import { WINES, REGION_COUNT } from "@/components/data";
import Atmosphere, { Aura, GhostWord, Vines } from "@/components/Atmosphere";

export const metadata = {
  title: "Regionen Italiens — Maria Maria",
  description:
    "Apulien, Kampanien & Basilikata und der Gardasee: die Herkunftsregionen unserer familiengeführten Weingüter in Italien.",
};

const REGIONS = [
  {
    name: "Apulien",
    tag: "Das Herz des Südens",
    anchor: "apulien",
    region: "apulien",
    img: "/img/region-apulien.jpg",
    label: "Weine aus Apulien",
    link: "Mehr über Apulien",
    desc: "Sonne, Meer und rote Erde. Apulien ist das Herz des Südens – weitläufige Ebenen, alte Reben und warme Brisen vom Ionischen und Adriatischen Meer prägen kraftvolle, fruchtbetonte Weine mit mediterraner Seele.",
    dataRegions: ["Apulien"],
  },
  {
    name: "Kampanien & Basilikata",
    tag: "Zwischen Vulkan und Meer",
    anchor: "kampanien",
    region: "kampanien",
    img: "/img/region-kampanien.jpg",
    label: "Weine aus Kampanien & Basilikata",
    link: "Mehr über Kampanien",
    desc: "Zwischen Vulkan und Meer. Die mineralischen Böden rund um den Vesuv schenken Weinen Spannung, Frische und Tiefe. Unser Aglianico stammt aus der benachbarten Basilikata, vom Fuße des Monte Vulture – derselbe vulkanische Charakter, dieselbe Hingabe.",
    dataRegions: ["Kampanien", "Basilikata"],
  },
  {
    name: "Gardasee / Lugana",
    tag: "Eleganz des Nordens",
    anchor: "garda",
    region: "garda",
    img: "/img/region-garda.jpg",
    label: "Weine vom Gardasee",
    link: "Mehr über Lugana",
    desc: "Das milde Klima, die sanften Hügel und die kalkhaltigen Böden am Südufer des Gardasees schaffen Weine von großer Eleganz und Frische. Lugana steht für Mineralität, Feinheit und mediterrane Leichtigkeit.",
    dataRegions: ["Gardasee"],
  },
];

const TERROIR = [
  "Familiengeführte Weingüter mit Geschichte",
  "Autochthone Rebsorten und echtes Terroir",
  "Handverlesene Qualität in limitierter Menge",
];

export default function RegionenPage() {
  return (
    <div className="relative min-h-screen">
      {/* ============ HERO ============ */}
      <section className="grain relative overflow-hidden">
        <ShaderGradient palette="vigna" />
        {/* soften the shader to a quiet, sunlit presence */}
        <div aria-hidden="true" className="absolute inset-0 bg-ivory/55" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory" />

        <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-14 px-6 pb-20 pt-32 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-36">
          <div>
            <Reveal y={18} delay={0.05}>
              <Eyebrow>Herkunft</Eyebrow>
            </Reveal>
            <h1 className="mt-6 font-playfair text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[1.05] text-charcoal">
              <SplitText text="Regionen" className="block" delay={0.12} />
              <SplitText
                text="Italiens."
                className="block bg-gradient-to-r from-bordeaux via-wine to-champagne bg-clip-text italic text-transparent"
                delay={0.28}
              />
            </h1>
            <Reveal delay={0.48} y={16}>
              <GrapeRule className="mt-7" />
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/75">
                Maria Maria arbeitet mit ausgewählten, familiengeführten Weingütern in Italien zusammen. Jede
                Region bringt ihren eigenen Charakter, ihre Böden, ihr Klima – und Geschichten hervor, die man
                schmeckt.
              </p>
            </Reveal>
            <Reveal delay={0.6} y={16}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href="#apulien" size="lg">
                  Regionen entdecken
                </Button>
                <Button href="/weine" variant="outline" size="lg">
                  Zu unseren Weinen
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.75} y={12}>
              <dl className="mt-14 flex max-w-md items-center">
                {[
                  [`${REGION_COUNT}`, "Weinregionen"],
                  [`${WINES.length}`, "Boutique-Weine"],
                  ["100 %", "Familiengeführt"],
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

          <Reveal delay={0.3} y={24} className="relative">
            <div className="ring-hairline relative h-[400px] overflow-hidden rounded-card-lg shadow-luxe lg:h-[540px]">
              <Parallax speed={0.1} overscan className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/regionen-hero.jpg"
                  alt="Weinberge unter italienischer Sonne"
                  className="h-full w-full object-cover"
                />
              </Parallax>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-espresso/45 via-transparent to-transparent"
              />
              <span className="glass absolute bottom-5 left-5 rounded-full px-4 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                Apulien · Kampanien · Basilikata · Gardasee
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ REGION SHOWCASES ============ */}
      <section className="relative overflow-hidden">
        <Atmosphere variant="olive" />
        <Aura tint="blush" drift={2} className="-left-56 top-[45%] h-[32rem] w-[32rem]" />
        <Aura tint="terracotta" className="-right-56 top-[70%] h-[34rem] w-[34rem]" />
        <GhostWord className="right-[-3vw] top-10 text-[13vw]">Terroir</GhostWord>
        <GhostWord className="left-[-2vw] top-[62%] text-[11vw]">Vigneti</GhostWord>
        <div className="relative mx-auto max-w-content px-6 py-24 lg:px-10">
        <SectionTitle
          eyebrow="Drei Charaktere"
          description="Vom sonnenverwöhnten Süden bis an die kühlen Ufer des Nordens – jede Herkunft spricht ihre eigene Sprache."
        >
          Entdecken Sie unsere Regionen
        </SectionTitle>

        <div className="mt-16 space-y-24 lg:mt-20 lg:space-y-32">
          {REGIONS.map((r, i) => {
            const flipped = i % 2 === 1;
            return (
              <article
                key={r.name}
                id={r.anchor}
                className="grid scroll-mt-32 grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                {/* photo side */}
                <Reveal className={flipped ? "lg:order-2" : ""}>
                  <TiltCard className="group h-full" max={4} radius="rounded-card-lg">
                    <div className="relative h-[420px] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift">
                      <Parallax speed={0.09} overscan className="absolute inset-0">
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
                        <ItalyMap region={r.region} className="w-12" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-7">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-champagne-light">{r.tag}</p>
                        <h3 className="mt-1.5 font-playfair text-[clamp(1.7rem,2.6vw,2.1rem)] text-ivory">
                          {r.name}
                        </h3>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>

                {/* text + mini rail side */}
                <Reveal delay={0.12} className={flipped ? "lg:order-1" : ""}>
                  <Eyebrow>{r.label}</Eyebrow>
                  <h2 className="mt-4 font-playfair text-[clamp(1.9rem,3.2vw,2.5rem)] leading-[1.12] text-charcoal">
                    {r.name}
                  </h2>
                  <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">{r.desc}</p>
                  <Link
                    href="/magazin"
                    className="group mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
                  >
                    {r.link}
                    <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                  </Link>

                  <p className="mt-6 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/50">
                    Unsere Weine aus dieser Region
                  </p>
                  <div data-lenis-prevent className="no-scrollbar -mx-6 mt-4 snap-x overflow-x-auto px-6 lg:mx-0 lg:px-0">
                    <Stagger gap={0.06} className="flex w-max gap-4 pb-3 pt-1">
                      {WINES.filter((w) => r.dataRegions.includes(w.region)).map((w) => (
                        <StaggerItem key={w.name} className="snap-start">
                          <WineCard wine={w} variant="mini" />
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
        </div>
      </section>

      {/* ============ WARUM REGIONEN + CTA ============ */}
      <section className="relative overflow-hidden border-y border-stone/40 bg-gradient-to-b from-cream via-champagne-light/25 to-ivory py-20 lg:py-24">
        <Vines className="inset-x-0 bottom-0 h-72 w-full" />
        <Aura tint="bordeaux" className="-right-56 -top-44 h-[34rem] w-[34rem]" />
        <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <Reveal>
            <IconChip size="lg">
              <Fields className="h-7 w-7" />
            </IconChip>
            <h2 className="mt-6 font-playfair text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.12] text-charcoal">
              Warum Regionen <span className="italic text-bordeaux">wichtig</span> sind
            </h2>
            <p className="mt-5 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
              Jede Region Italiens hat ihre eigene Sprache: andere Böden, anderes Klima, andere Rebsorten – und
              Menschen, die mit Hingabe arbeiten. Wir glauben, dass Herkunft zählt. Sie verleiht unseren Weinen
              Authentizität, Charakter und Seele.
            </p>
            <ul className="mt-7 space-y-3">
              {TERROIR.map((t) => (
                <li key={t} className="flex items-center gap-3 text-[13px] text-charcoal/75">
                  <span className="ring-hairline flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cream to-champagne-light/40 text-bordeaux">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12} className="h-full">
            <div className="grain relative flex h-full min-h-[360px] overflow-hidden rounded-card-lg shadow-luxe">
              <ShaderGradient palette="wine" />
              <div className="relative flex flex-col justify-center p-10 lg:p-14">
                <Eyebrow light>Die Kollektion</Eyebrow>
                <h3 className="mt-4 text-balance font-playfair text-[clamp(1.7rem,3vw,2.3rem)] leading-[1.12] text-ivory">
                  Weine nach <span className="italic text-champagne">Region</span> entdecken
                </h3>
                <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-ivory/70">
                  Vom kraftvollen Primitivo aus Apulien bis zum mineralischen Lugana vom Gardasee – finden Sie
                  den Wein, dessen Herkunft Sie schmecken möchten.
                </p>
                <div className="mt-8">
                  <Button href="/weine" variant="light" size="lg">
                    Zu unseren Weinen
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
