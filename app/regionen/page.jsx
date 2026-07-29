import Link from "next/link";
import ShaderGradient from "@/components/motion/ShaderGradient";
import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { SectionTitle, Eyebrow, IconChip } from "@/components/Deco";
import RegionWineRail from "@/components/RegionWineRail";
import FaqSection from "@/components/faq/FaqSection";
import { REGIONEN_FAQ_GROUPS } from "@/components/faq/faqData";
import { Arrow, Check, Fields } from "@/components/Icons";
import { WINES } from "@/components/data";
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
    img: "/img/regions/apulien.png",
    label: "Weine aus Apulien",
    link: "Mehr über Apulien",
    desc: "Sonne, Meer und rote Erde. Apulien ist das Herz des Südens – weitläufige Ebenen, alte Reben und warme Brisen vom Ionischen und Adriatischen Meer prägen kraftvolle, fruchtbetonte Weine mit mediterraner Seele.",
    dataRegions: ["Apulien"],
  },
  {
    name: "Kampanien",
    tag: "Zwischen Vulkan und Meer",
    anchor: "kampanien",
    region: "kampanien",
    img: "/img/regions/kampanien.png",
    label: "Weine aus Kampanien & Basilikata",
    link: "Mehr über Kampanien",
    desc: "Zwischen Vulkan und Meer. Die mineralischen Böden rund um den Vesuv schenken Weinen Spannung, Frische und Tiefe. Unser Aglianico stammt aus der benachbarten Basilikata, vom Fuße des Monte Vulture – derselbe vulkanische Charakter, dieselbe Hingabe.",
    dataRegions: ["Kampanien", "Basilikata"],
  },
  {
    name: "Gardasee / Lombardei",
    tag: "Eleganz des Nordens",
    anchor: "garda",
    region: "garda",
    img: "/img/regions/lugana.png",
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
        {/* Volle Video-Bühne: das Weinberg-Panorama trägt den Hero.
            Raw-Markup statt JSX, damit `muted` im SSR-HTML landet (React 18
            lässt das Attribut sonst weg und Browser blocken das Autoplay). */}
        <div aria-hidden="true" className="absolute inset-0">
          <Parallax speed={0.1} overscan className="absolute inset-0">
            <div
              className="h-full w-full"
              dangerouslySetInnerHTML={{
                __html: `<video class="h-full w-full object-cover" autoplay loop muted playsinline preload="auto" src="/video/video1crop.mp4"></video>`,
              }}
            />
          </Parallax>
        </div>

        {/* dunkler Schleier für Lesbarkeit — dichter von links, wo der Text steht */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-espresso/70 via-espresso/30 to-transparent"
        />

        {/* Elfenbein-Hauch oben für die Navigation, unten der weiche Übergang in die Seite */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory/80 via-ivory/30 to-transparent"
        />
        {/* Eased-Scrim statt 3-Stop-Verlauf: viele Zwischenstufen entlang einer
            Smoothstep-Kurve, damit weder Anfangs- noch Endkante sichtbar ist */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(to_bottom,rgba(247,244,239,0)_0%,rgba(247,244,239,0.02)_14%,rgba(247,244,239,0.06)_27%,rgba(247,244,239,0.13)_39%,rgba(247,244,239,0.25)_50%,rgba(247,244,239,0.42)_61%,rgba(247,244,239,0.63)_73%,rgba(247,244,239,0.85)_86%,rgba(247,244,239,1)_100%)]"
        />

        <div className="relative mx-auto flex min-h-[100svh] max-w-content flex-col justify-center px-6 pb-24 pt-32 lg:px-10 lg:pt-36">
          <div className="max-w-2xl">
            <Reveal y={18} delay={0.05}>
              <span className="inline-flex items-center gap-4 text-[10.5px] font-semibold uppercase tracking-[0.3em] text-ivory/90">
                <span aria-hidden="true" className="h-px w-10 bg-champagne" />
                Italienische Weinregionen
              </span>
            </Reveal>
            <h1 className="mt-6 font-playfair text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[1.1] text-ivory">
              <SplitText text="Wo Italiens Weine" className="block" delay={0.12} />
              <SplitText text="ihren Charakter finden" className="block" delay={0.28} />
            </h1>
            <Reveal delay={0.55} y={14}>
              <a
                href="#apulien"
                className="group mt-10 inline-flex min-h-[44px] items-center gap-2 text-[14px] text-ivory/90 transition-colors duration-300 hover:text-champagne"
              >
                Den Ursprüngen folgen
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-out-expo group-hover:translate-y-1"
                >
                  ↓
                </span>
              </a>
            </Reveal>
          </div>
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

        <div className="mt-14 lg:mt-20">
          {REGIONS.map((r, i) => {
            const flipped = i % 2 === 1;
            return (
              <article
                key={r.name}
                id={r.anchor}
                className={`scroll-mt-32 ${i > 0 ? "mt-16 pt-16 lg:mt-24 lg:pt-24" : ""}`}
              >
                {/* photo + intro */}
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
                  <Reveal className={flipped ? "lg:order-2" : ""}>
                    <TiltCard className="group h-full" max={4} radius="rounded-card-lg">
                      <div className="relative aspect-[1672/941] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={r.img}
                          alt={`Landschaft der Region ${r.name}`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-transparent"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-champagne-light">{r.tag}</p>
                          <h3 className="mt-1.5 font-playfair text-[clamp(1.5rem,2.6vw,2.1rem)] text-ivory">
                            {r.name}
                          </h3>
                        </div>
                      </div>
                    </TiltCard>
                  </Reveal>

                  <Reveal delay={0.12} className={flipped ? "lg:order-1" : ""}>
                    <div>
                      <Eyebrow>{r.label}</Eyebrow>
                    </div>
                    <h2 className="mt-4 font-playfair text-[clamp(1.9rem,3.2vw,2.5rem)] leading-[1.12] text-charcoal">
                      {r.name}
                    </h2>
                    <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">{r.desc}</p>
                    <Link
                      href="/magazin"
                      className="group mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
                    >
                      {r.link}
                      <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                    </Link>
                  </Reveal>
                </div>

                {/* full-width wine rail for this region */}
                <Reveal delay={0.2} className="mt-10 lg:mt-12">
                  <RegionWineRail wines={WINES.filter((w) => r.dataRegions.includes(w.region))} />
                </Reveal>
              </article>
            );
          })}
        </div>
        </div>
      </section>

      {/* ============ HÄUFIGE FRAGEN (je Region, Index links) ============ */}
      <div className="relative overflow-hidden">
        <Atmosphere variant="warm" className="opacity-70" />
        <GhostWord className="left-[-2vw] bottom-8 text-[11vw]">Origini</GhostWord>
        <FaqSection
          className="relative"
          pageType="regionen"
          eyebrow="Häufige Fragen"
          title={
            <>
              Fragen zur <span className="italic text-bordeaux">Herkunft.</span>
            </>
          }
          description="Drei Herkünfte, drei Charaktere — wählen Sie links eine Region und entdecken Sie die häufigsten Fragen zu Rebsorten, Gebieten und unseren Weinen."
          groups={REGIONEN_FAQ_GROUPS}
          footer={{ label: "Mehr Wissen im Magazin entdecken", href: "/magazin" }}
        />
      </div>

      {/* ============ WARUM REGIONEN + CTA ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream via-champagne-light/25 to-ivory py-20 lg:py-24">
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
