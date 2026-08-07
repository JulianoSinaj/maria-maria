import { Suspense } from "react";
import SplitText from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { Eyebrow, GrapeRule } from "@/components/Deco";
import { WINES, REGION_COUNT } from "@/components/data";
import WineExplorer from "@/components/weine/WineExplorer";
import MomentsSection from "@/components/weine/MomentsSection";
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
      {/* Bauform liegt in components/weine/MomentsSection — das Magazin teilt
          sie; hier zeigt der CTA auf den Kollektions-Anker dieser Seite. */}
      <MomentsSection />

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
