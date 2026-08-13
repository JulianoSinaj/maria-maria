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
import JsonLd from "@/components/seo/JsonLd";
import { wineHref } from "@/components/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import { graph, webPageNode, itemListNode, breadcrumbNode, faqNode } from "@/lib/seo/jsonLd";

/* Titel und Description je Sprache aus dem Wörterbuch; hreflang,
   Canonical und OpenGraph baut pageMetadata() daraus auf. */
export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "/unsere-weine",
    meta: dict.meta.collection,
    image: {
      url: "/img/og/collection.jpg",
      width: 1200,
      height: 630,
      alt: dict.meta.collection.description,
    },
  });
}

/* Die Kollektion beschreibt sich als CollectionPage mit der geordneten Liste
   ihrer neun Produkte — nicht als Textseite.

   Der Unterschied ist praktisch: Ohne ItemList konkurriert /unsere-weine mit
   den Produktseiten um dieselben Suchwörter („italienische Weine",
   „Primitivo"), und Google entscheidet selbst, welche der zehn Adressen es
   zeigt. Mit ItemList ist die Rolle geklärt — die Übersicht ist der
   Verteiler, die Produktseite das Ziel.

   Die Filter-Varianten (?art=rot, ?region=apulien) tragen denselben
   Canonical wie diese Seite und bekommen deshalb bewusst KEINEN eigenen
   Listen-Knoten: Sie sind Ansichten derselben Sammlung, keine eigenen. */
function CollectionJsonLd({ locale, dict, wines }) {
  const url = absoluteUrl(localePath(locale, "/unsere-weine"));
  const nav = dict?.common?.nav ?? {};
  const localize = (href) => localePath(locale, href);

  const crumbs = breadcrumbNode(
    [
      { label: nav.home || "Home", href: "/" },
      { label: nav.wines || "Unsere Weine", href: "/unsere-weine" },
    ],
    { url, localize }
  );

  return (
    <JsonLd
      data={graph(
        webPageNode({
          url,
          name: dict.meta.collection.title,
          description: dict.meta.collection.description,
          locale,
          type: "CollectionPage",
          breadcrumbId: crumbs?.["@id"] ?? null,
        }),
        itemListNode({
          url,
          name: dict.meta.collection.title,
          items: wines.map((w) => ({ name: w.name, url: localePath(locale, wineHref(w)) })),
        }),
        crumbs,
        /* WEINE_FAQ ist noch deutsch — dieselbe Regel wie auf der
           Startseite: Markup nur dort, wo der Besucher den Text auch liest. */
        locale === "de" ? faqNode({ url, items: WEINE_FAQ }) : null
      )}
    />
  );
}

export default async function WeinePage({ params }) {
  const dict = await getDictionary(params.locale);

  return (
    <div className="relative min-h-screen">
      <CollectionJsonLd locale={params.locale} dict={dict} wines={WINES} />
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

      {/* ============ OCCASIONI — FOOD-PAIRING-TEASER ============ */}
      {/* Bauform liegt in components/weine/MomentsSection — die redaktionelle
          Doppelseite „Occasioni": Anlass-Index links, Antwort-Karte rechts,
          beide springen ins Food-Pairing-Kapitel des Magazins
          (/magazin#food-pairing). */}
      <MomentsSection headingId="weine-pairing" />

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
