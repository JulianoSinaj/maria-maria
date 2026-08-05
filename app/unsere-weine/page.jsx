import { Suspense } from "react";
import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { SectionTitle, Eyebrow, GrapeRule } from "@/components/Deco";
import Photo from "@/components/media/Photo";
import { WINES, REGION_COUNT } from "@/components/data";
import WineExplorer from "@/components/weine/WineExplorer";
import WeineHeroPhoto, { WeineHeroPreload } from "@/components/weine/WeineHeroPhoto";
import HelpStrip from "@/components/weine/HelpStrip";
import HomeHeroFx from "@/components/home/HomeHeroFx";
import FaqSection from "@/components/faq/FaqSection";
import { WEINE_FAQ } from "@/components/faq/faqData";
import Atmosphere, { GhostWord } from "@/components/Atmosphere";

export const metadata = {
  title: "Unsere Weine — Maria Maria",
  description:
    "Handverlesene italienische Boutique-Weine von kleinen Weingütern – Rotwein, Weißwein und Rosé aus Apulien, Kampanien und vom Gardasee.",
};

const MOMENTS = [
  {
    title: "Aperitivo",
    text: "Leicht, frisch und bereichernd.",
    img: "/img/aperitivo-sunset.jpg",
  },
  {
    title: "Dinner",
    text: "Elegante Begleiter für besondere Gerichte.",
    img: "/img/dinner.webp",
  },
  {
    title: "Freunde",
    text: "Für gute Gespräche und unvergessliche Abende.",
    img: "/img/pranzo.webp",
  },
];

export default function WeinePage() {
  return (
    <div className="relative min-h-screen">
      {/* ============ HERO ============ */}
      <WeineHeroPreload />
      <section className="grain relative overflow-hidden">
        {/* Volle Foto-Bühne wie auf der Startseite: die Neuner-Reihe trägt
            den Hero randlos, die Headline steht links im Schleierlicht. */}
        <HomeHeroFx photo={<WeineHeroPhoto />} />

        {/* Schleier für Lesbarkeit: mobil von unten, ab lg von links */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/45 to-transparent lg:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-ivory/90 via-ivory/30 via-35% to-transparent to-70% lg:block" />
        </div>

        {/* Elfenbein-Hauch oben, damit die Navigation über dem Abendhimmel
            lesbar bleibt */}
        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory/80 via-ivory/30 to-transparent"
          aria-hidden="true"
        />

        {/* settle into the page colour */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-content flex-col justify-end px-6 pb-24 pt-32 lg:justify-center lg:px-10 lg:pb-16">
          <div className="lg:max-w-xl">
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
              src="/img/weine/occasioni-bg-1523.webp"
              srcSet="/img/weine/occasioni-bg-640.webp 640w, /img/weine/occasioni-bg-1280.webp 1280w, /img/weine/occasioni-bg-1523.webp 1523w"
              sizes="100vw"
              alt=""
              loading="lazy"
              decoding="async"
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
                  {/* Die Streifen sind auf lg:max-w-[38rem] gedeckelt */}
                  <Photo
                    src={m.img}
                    alt=""
                    sizes="(min-width: 1024px) 38rem, 100vw"
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
      <HelpStrip />

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
