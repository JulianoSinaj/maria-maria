import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle, Eyebrow, GrapeRule } from "@/components/Deco";
import Photo from "@/components/media/Photo";
import InterviewSection from "@/components/magazin/InterviewSection";
import NewsletterCard from "@/components/magazin/NewsletterCard";
import VisionMission from "@/components/magazin/VisionMission";
import BrandStory from "@/components/magazin/BrandStory";
import SocialBoard from "@/components/magazin/SocialBoard";
import CuriosityBand from "@/components/magazin/CuriosityBand";
import MagazinJsonLd from "@/components/magazin/MagazinJsonLd";
import MomentsSection from "@/components/weine/MomentsSection";
import FaqSection from "@/components/faq/FaqSection";
import { MAGAZIN_FAQ } from "@/components/faq/faqData";
import RegionWineRail from "@/components/RegionWineRail";
import { WINES } from "@/components/data";
import { Aura, GhostWord } from "@/components/Atmosphere";
import { PUBLISHED_INTERVIEWS } from "@/components/magazin/interviewData";
import { MAGAZIN_WINE_SLUGS } from "@/components/magazin/magazinData";

/* ============================================================================
   MAGAZIN — Seitenkomposition.
   ----------------------------------------------------------------------------
   Diese Datei ist bewusst nur noch Inhaltsverzeichnis: Sie ordnet die Kapitel
   und reicht Daten durch. Bauformen liegen in components/magazin/*, die
   Inhalte in components/magazin/magazinData.js.

   Dramaturgie in vier Kapiteln:
   1 — Auftakt      Intro + Vision & Mission links, das Marken-Still rechts,
                    darunter die Geschichte von Maria Maria.
   2 — Food Pairing die drei Anlass-Karten (Bauform geteilt mit /unsere-weine).
   3 — Bacheca      die Social-Pinnwand.
   4 — Curiosità    Abschlussband mit zweigleisiger Fußzeile.

   Zwischen 3 und 4 liegt das Archiv (#artikel): die Gespräche (sobald
   veröffentlicht), die Weine aus den Geschichten, der Newsletter und die FAQ.
   Kapitel 4 verlinkt dorthin zurück.

   Die Artikelstrecke (Themenwelten, „Neueste Artikel") und die Sektion
   „Geschichten aus den Weinbergen" sind bewusst entfernt: solange es keine
   Artikelrouten gibt, trug sie nur Karten ohne Ziel. Die Bauformen bleiben
   als Komponenten erhalten (ArticleCard, ThemeGrid, MagazinSidebar,
   StoriesSection) und lassen sich mit echten Artikeln wieder einsetzen.

   Überschriften-Gliederung: ein einziges <h1> („Magazin"), jedes Kapitel eine
   <section> mit <h2> (über SectionTitle bzw. aria-labelledby), Karten darunter
   <h3>. Deshalb tragen die Kapitel `headingId` — die Sektion benennt sich von
   ihrer eigenen Überschrift, statt namenlos zu bleiben.
   ========================================================================== */

const DESCRIPTION =
  "Weinwissen, Food Pairing, Regionen und Geschichten aus der Welt von Maria Maria — Inspiration für den nächsten Genussmoment.";

export const metadata = {
  /* Der Marken-Suffix kommt aus dem title.template des Root-Layouts */
  title: "Magazin",
  description: DESCRIPTION,
  keywords: [
    "Weinmagazin",
    "Weinwissen",
    "Food Pairing",
    "italienische Weine",
    "Genussmomente",
    "Maria Maria",
  ],
  alternates: { canonical: "/magazin" },
  openGraph: {
    type: "website",
    url: "/magazin",
    title: "Magazin — Maria Maria",
    description: DESCRIPTION,
    images: [
      {
        url: "/img/magazin/weinkeller.jpg",
        width: 1200,
        height: 630,
        alt: "Winzer prüft ein Glas Rotwein zwischen Barriquefässern im Keller",
      },
    ],
  },
  twitter: {
    title: "Magazin — Maria Maria",
    description: DESCRIPTION,
    images: ["/img/magazin/weinkeller.jpg"],
  },
};

const MAGAZIN_WINES = MAGAZIN_WINE_SLUGS.map((slug) =>
  WINES.find((w) => w.slug === slug)
).filter(Boolean);

export default function MagazinPage() {
  /* Die Interview-Sektion und ihr Sprungziel erscheinen nur, wenn wirklich ein
     Gespräch veröffentlicht ist — sonst zeigte die Fußzeile von Kapitel 4 auf
     eine Platzhalterkarte. */
  const hasInterviews = PUBLISHED_INTERVIEWS.length > 0;

  return (
    <>
      <MagazinJsonLd description={DESCRIPTION} />

      <main className="relative min-h-screen">
        {/* ================= KAPITEL 1: AUFTAKT, VISION & GESCHICHTE ========= */}
        <section aria-labelledby="magazin-titel" className="relative overflow-hidden">
          {/* Cremeschleier oben — die Seite hat bewusst keinen Bild-Hero */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[30rem] bg-gradient-to-b from-cream via-cream/60 to-transparent"
          />
          <p
            aria-hidden="true"
            className="pointer-events-none absolute right-[-2vw] top-20 hidden select-none whitespace-nowrap font-playfair text-[9vw] italic leading-none text-charcoal/[0.035] xl:block"
          >
            Il piacere del vino
          </p>
          <Aura tint="gold" className="-left-56 top-24 h-[38rem] w-[38rem]" />
          <Aura tint="blush" drift={2} className="-right-56 top-[40%] h-[34rem] w-[34rem]" />
          <GhostWord className="left-[-2vw] bottom-[4%] text-[11vw]">La storia</GhostWord>

          <div className="relative mx-auto max-w-content px-6 pb-20 pt-32 lg:px-10 lg:pt-36">
            <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
              {/* ---- links: Intro + Vision & Mission ---- */}
              <div className="flex flex-col justify-center">
                <Reveal y={18} delay={0.05}>
                  <Eyebrow>Geschichten &amp; Weinwissen</Eyebrow>
                </Reveal>
                <h1
                  id="magazin-titel"
                  className="mt-5 font-playfair text-[clamp(2.6rem,5vw,3.8rem)] leading-[1.05] text-charcoal"
                >
                  <SplitText text="Magazin" delay={0.12} />
                </h1>
                <Reveal delay={0.38} y={16}>
                  <GrapeRule className="mt-6" />
                  <p className="mt-6 max-w-md text-[14px] leading-relaxed text-charcoal/75">
                    Unser Magazin teilt Wissen über Wein, Inspiration für Genussmomente, kreative
                    Food Pairing-Ideen, spannende Regionen und Geschichten aus der Welt von Maria
                    Maria.
                  </p>
                </Reveal>
                <VisionMission className="mt-10" headingId="magazin-leitbild" />
              </div>

              {/* ---- rechts: das Marken-Still ---- */}
              <Reveal delay={0.2} y={24}>
                <TiltCard className="group h-full" max={4} radius="rounded-card-lg">
                  <figure className="relative h-[420px] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift sm:h-[480px] lg:h-full lg:min-h-[560px]">
                    <Parallax speed={0.08} overscan className="absolute inset-0">
                      <Photo
                        src="/img/stilllife.jpg"
                        alt="Maria-Maria-Flasche mit Rotweinglas und Oliven auf einer sonnigen Steinterrasse"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
                      />
                    </Parallax>
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-espresso/80 via-espresso/25 to-transparent"
                    />
                    <span className="glass absolute left-5 top-5 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                      Maria Maria
                    </span>
                    <figcaption className="absolute inset-x-0 bottom-0 p-7">
                      <span className="block text-[10px] uppercase tracking-[0.22em] text-champagne-light">
                        Dal 2019
                      </span>
                      <span className="mt-1.5 block font-playfair text-[clamp(1.4rem,2.2vw,1.8rem)] italic leading-tight text-ivory">
                        Il piacere del vino.
                      </span>
                    </figcaption>
                  </figure>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---- die Geschichte von Maria Maria ---- */}
        <BrandStory headingId="magazin-geschichte" />

        {/* ================= KAPITEL 2: FOOD PAIRING ======================== */}
        {/* Bauform geteilt mit /unsere-weine — hier als Dreierreihe ohne
            Hintergrundfoto; der CTA führt in die Kollektion der Weine-Seite. */}
        <MomentsSection
          layout="row"
          ctaHref="/unsere-weine#kollektion"
          headingId="magazin-momente"
        />

        {/* ================= KAPITEL 3: BACHECA SOCIAL MEDIA ================ */}
        <SocialBoard headingId="magazin-bacheca" />

        {/* ================= ARCHIV (Sprungziel aus Kapitel 4) ============== */}
        <div id="artikel" className="relative scroll-mt-28 overflow-hidden">
          <Aura tint="olive" className="-left-48 top-[12%] h-[32rem] w-[32rem]" />
          <Aura tint="terracotta" drift={2} className="-right-48 bottom-[4%] h-[34rem] w-[34rem]" />
          <GhostWord className="left-[-2vw] top-[38%] text-[11vw]">Storie</GhostWord>
          <GhostWord className="right-[-2vw] bottom-[2%] text-[10vw]">Sapori</GhostWord>

          <div className="relative mx-auto max-w-content px-6 pb-24 pt-20 lg:px-10">
            {/* ---- Im Gespräch — nur mit veröffentlichten Interviews ---- */}
            {hasInterviews && (
              <div id="interviste" className="scroll-mt-28">
                <InterviewSection />
              </div>
            )}

            {/* ---- Die Weine aus den Geschichten ---- */}
            <section aria-labelledby="magazin-weine" className={hasInterviews ? "mt-20" : ""}>
              <SectionTitle
                align="left"
                eyebrow="Aus dem Magazin ins Glas"
                description="Die Flaschen, um die sich unsere Geschichten drehen – wischen Sie über ein Foto, um das Rückenetikett zu sehen."
                headingId="magazin-weine"
              >
                Die Weine aus unseren Geschichten
              </SectionTitle>
              <div className="mt-10">
                <RegionWineRail wines={MAGAZIN_WINES} label="Im Magazin verkostet" />
              </div>
            </section>

            {/* ---- Newsletter: der Anmeldeweg bleibt, jetzt mittig im Fluss ---- */}
            <Reveal delay={0.1} y={22} className="mx-auto mt-20 max-w-xl">
              <NewsletterCard />
            </Reveal>
          </div>
        </div>

        {/* ================= WEINWISSEN-FAQ ================================ */}
        <div className="relative overflow-hidden bg-gradient-to-b from-cream via-champagne-light/25 to-ivory">
          <GhostWord className="right-[-2vw] bottom-6 text-[11vw]">Sapere</GhostWord>
          <FaqSection
            className="relative"
            pageType="magazin"
            eyebrow="Weinwissen"
            title={
              <>
                Häufige Fragen aus dem <span className="italic text-bordeaux">Weinwissen.</span>
              </>
            }
            description="Die Evergreens rund um Temperatur, Glas, Lagerung und Herkunftsstufen — beantwortet aus den Datenblättern unserer Weine, ohne Fachchinesisch."
            items={MAGAZIN_FAQ}
            footer={{ label: "Eine Frage fehlt? Schreiben Sie uns", href: "/kontakt" }}
          />
        </div>

        {/* ================= KAPITEL 4: BOX CURIOSITÀ & PASSAGGIO =========== */}
        <CuriosityBand headingId="magazin-curiosita" showInterviewLink={hasInterviews} />
      </main>
    </>
  );
}
