import { Suspense } from "react";
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
import FaqSection from "@/components/faq/FaqSection";
import { WEINE_FAQ } from "@/components/faq/faqData";
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
    title: "Service-FAQ",
    text: "Häufige Fragen rund um Bestellung, Versand und Kontakt – kurz beantwortet.",
    link: "Zu den Service-FAQs",
    href: "/kontakt#fragen",
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
            <h1 className="mt-6 font-playfair text-[clamp(2.6rem,5.4vw,4.1rem)] leading-[1.06] tracking-[-0.015em] text-charcoal">
              <SplitText text="Unsere Weine" className="block" delay={0.12} />
              <SplitText
                text="Neun Charaktere."
                className="block italic"
                wordClassName="bg-gradient-to-r from-bordeaux via-wine to-bordeaux bg-clip-text text-transparent"
                delay={0.3}
              />
            </h1>
            <Reveal delay={0.5} y={16}>
              <GrapeRule className="mt-6" />
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-charcoal/75">
                Maria Maria steht für handverlesene italienische Boutique-Weine von kleinen Weingütern – ausgewählt
                für bewusste Momente und echten Genuss.
              </p>
            </Reveal>
            <Reveal delay={0.62} y={16}>
              {/* CTAs gestapelt – gleiche Breite, eine vertikale Achse mit
                  Eyebrow, Titel und Textblock */}
              <div className="mt-7 flex w-full max-w-[17.5rem] flex-col items-stretch gap-2.5 sm:mt-8">
                <Button href="#kollektion" size="lg">
                  Zur Kollektion
                </Button>
                <Button href="/shop" variant="outline" size="lg">
                  Zum Shop
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.78} y={12}>
              <dl className="mt-9 flex max-w-md items-start sm:mt-11">
                {[
                  [`${WINES.length}`, "Ausgewählte Weine"],
                  [`${REGION_COUNT}`, "Regionen aus Italien"],
                  ["seit 2019", "Für bewusste Genussmomente"],
                ].map(([num, label], i) => (
                  <div key={label} className={`flex-1 ${i > 0 ? "border-l border-charcoal/10 pl-6" : ""}`}>
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <span
                        className={`font-playfair text-bordeaux ${
                          /^\d+$/.test(num) ? "text-[26px]" : "text-[19px] italic"
                        }`}
                      >
                        {num}
                      </span>
                      <span className="mt-0.5 block text-[10.5px] uppercase leading-[1.5] tracking-[0.14em] text-charcoal/55">
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
          <Suspense fallback={null}>
            <WineExplorer />
          </Suspense>
        </div>
      </section>

      {/* ============ WELCHER WEIN PASST ZU IHREM MOMENT ============ */}
      <section className="grain relative overflow-hidden">
        {/* Flaschen-Stillleben als weiche Bühne: federnder Parallax-Drift unter
            einem Elfenbein-Schleier, damit Titel und Karten lesbar bleiben und
            die Ränder nahtlos in die Nachbarsektionen übergehen */}
        <div aria-hidden="true" className="absolute inset-0">
          <Parallax speed={0.08} overscan className="h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/weine/occasioni-bg.jpg"
              alt=""
              loading="lazy"
              className="h-full w-full object-cover object-center"
            />
          </Parallax>
          <div className="absolute inset-0 bg-ivory/25" />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ivory via-ivory/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ivory via-ivory/45 to-transparent" />
        </div>
        <Atmosphere variant="rose" className="opacity-60" />
        <div className="relative mx-auto max-w-content px-6 lg:px-10">
        <SectionTitle
          eyebrow="Genussmomente"
          description="Drei Anlässe, drei Stimmungen – finden Sie den Wein, der Ihren Augenblick begleitet."
        >
          Welcher Wein passt zu <span className="italic text-bordeaux">Ihrem Moment?</span>
        </SectionTitle>
        </div>
        {/* Karten als breite, flache Streifen übereinander ganz links am
            Viewport-Rand – rechts bleibt die Flaschen-Bühne des Fotos frei */}
        <div className="relative px-6 pb-24 lg:pl-24 lg:pr-10">
        <Stagger className="mt-8 flex flex-col gap-5 lg:max-w-[38rem]">
          {MOMENTS.map((m, i) => (
            <StaggerItem key={m.title} className="h-full">
              <TiltCard className="group h-full" max={5} radius="rounded-card-lg">
                <article className="relative h-[172px] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift sm:h-[184px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.img}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
                  />
                  {/* Schleier von links + weicher Boden, damit Titel und Text
                      auf dem breiten, flachen Format lesbar bleiben */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/40 to-transparent"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-espresso/70 to-transparent"
                  />
                  <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                    Moment 0{i + 1}
                  </span>
                  <div className="absolute inset-0 flex items-end justify-between gap-5 p-5 sm:p-6">
                    <div className="max-w-[17rem]">
                      <h3 className="font-playfair text-[22px] text-ivory">{m.title}</h3>
                      <p className="mt-1 text-[12.5px] leading-snug text-ivory/80">{m.text}</p>
                    </div>
                    <Button
                      href="#kollektion"
                      variant="glass"
                      size="sm"
                      magnetic={false}
                      className="shrink-0"
                      aria-label={`Passende Weine für ${m.title} entdecken`}
                    >
                      Weine finden
                    </Button>
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
                <div className="ring-hairline relative z-10 flex h-full flex-col rounded-card-lg border border-stone/40 bg-white p-8 shadow-luxe transition-[box-shadow,border-color] duration-500 hover:border-champagne/60 hover:shadow-lift">
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

      {/* ============ HÄUFIGE FRAGEN (Wahl-FAQ) ============ */}
      <div className="relative overflow-hidden">
        <Atmosphere variant="warm" className="opacity-70" />
        <GhostWord className="right-[-2vw] bottom-8 text-[11vw]">Quale vino?</GhostWord>
        <FaqSection
          className="relative"
          pageType="wine-hub"
          eyebrow="Häufige Fragen"
          title={
            <>
              Welcher Wein <span className="italic text-bordeaux">darf es sein?</span>
            </>
          }
          description="Orientierung für Ihre Wahl — von Farbe und Anlass bis zum passenden Geschenk. Jede Antwort führt Sie einen Schritt näher zur richtigen Flasche."
          items={WEINE_FAQ}
          footer={{ label: "Persönliche Beratung? Schreiben Sie uns", href: "/kontakt" }}
        />
      </div>
    </div>
  );
}
