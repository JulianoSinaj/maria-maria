import Marquee from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle } from "@/components/Deco";
import { Grapes } from "@/components/Icons";
import InterviewSection from "@/components/magazin/InterviewSection";
import CoverHero from "@/components/magazin/CoverHero";
import SocialBoard from "@/components/magazin/SocialBoard";
import CuriosityBand from "@/components/magazin/CuriosityBand";
import ChapterBreak from "@/components/magazin/ChapterBreak";
import InkQuote from "@/components/magazin/InkQuote";
import MagazinJsonLd from "@/components/magazin/MagazinJsonLd";
import PairingMoments from "@/components/magazin/PairingMoments";
import FaqSection from "@/components/faq/FaqSection";
import { MAGAZIN_FAQ } from "@/components/faq/faqData";
import RegionWineRail from "@/components/RegionWineRail";
import { WINES } from "@/components/data";
import { Aura, GhostWord } from "@/components/Atmosphere";
import { publishedInterviews } from "@/components/magazin/interviewRegistry";
import { MAGAZIN_WINE_SLUGS } from "@/components/magazin/magazinData";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";

/* ============================================================================
   MAGAZIN — Seitenkomposition.
   ----------------------------------------------------------------------------
   Diese Datei ist bewusst nur noch Inhaltsverzeichnis: Sie ordnet die Kapitel
   und reicht Daten durch. Bauformen liegen in components/magazin/*, die
   Inhalte in components/magazin/magazinData.js.

   Die Seite ist als Rivista gesetzt — mit den Mitteln eines gedruckten Hefts:
   - Titelseite     zentrierter Masthead, Rubrikenleiste zwischen Haarlinien
                    und die Cover Story („Zwei Marias") mit Titelfoto,
                    Stationenzeile und Vision/Mission (siehe CoverHero).
   - Kapitelmarken  ChapterBreak („Capitolo II…IV") mit treibender Ziffer —
                    die Falze, an denen sich das Heft blättert.
   - Zwischenspiel  das Tinten-Zitat (InkQuote), das das Food-Pairing-Kapitel
                    beschließt und sich beim Scrollen Wort für Wort füllt,
                    und der Marquee mit den Leitworten.

   Dramaturgie in vier Kapiteln:
   I   — La storia   Titelseite, Vision & Mission, Marquee.
   II  — Momente     der Anlass-Schalter des Food Pairings: fünf Tasten,
                     eine Antwort-Karte — Gericht, Wein und „Auch passend",
                     jeder Wein verlinkt auf seine Landingpage. Das
                     Tinten-Zitat (Soldati) setzt den Schlusspunkt.
   III — Bacheca     die Social-Pinnwand.
   IV  — Curiosità   Abschlussband mit zweigleisiger Fußzeile.

   Zwischen III und IV liegt das Archiv (#artikel): die Gespräche (sobald
   veröffentlicht), die Weine aus den Geschichten und der Newsletter. Die FAQ
   schließt die Seite nach Kapitel IV ab. Kapitel IV verlinkt ins Archiv zurück.

   Die Artikelstrecke (Themenwelten, „Neueste Artikel") und die Sektion
   „Geschichten aus den Weinbergen" sind bewusst nicht Teil der Seite: solange
   es keine Artikelrouten gibt, trügen sie nur Karten ohne Ziel. Auch das
   Markenkapitel „Die Geschichte von Maria Maria" (BrandStory) entfällt hier:
   es erzählte wortgleich „Le Origini" der Startseite — die Rubrik
   „Die Geschichte" führt stattdessen direkt auf /geschichte.

   Überschriften-Gliederung: ein einziges <h1> („Magazin"), jedes Kapitel eine
   <section> mit <h2> (über SectionTitle bzw. aria-labelledby). Deshalb tragen
   die Kapitel `headingId` — die Sektion benennt sich von ihrer eigenen
   Überschrift, statt namenlos zu bleiben.

   Anker der Rubrikenleiste: #bacheca und #curiosita liegen
   auf schlanken Wrappern mit scroll-mt; Kapitel II nutzt #food-pairing direkt
   an der Sektion — dieselbe Marke, auf die auch der Pairing-Teaser der
   Weine-Seite springt (/magazin#food-pairing).
   ========================================================================== */

const DESCRIPTION =
  "Weinwissen, Food Pairing, Regionen und Geschichten aus der Welt von Maria Maria — Inspiration für den nächsten Genussmoment.";

/* Titel und Description je Sprache aus dem Wörterbuch; hreflang,
   Canonical und OpenGraph baut pageMetadata() daraus auf. */
export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "/magazin",
    meta: dict.meta.magazin,
    /* Zeigte vorher direkt auf /img/magazin/weinkeller.jpg und behauptete
       1200 × 630 — die Datei misst 641 × 403. Jetzt der echte Zuschnitt aus
       scripts/og-images.mjs, gleiches Motiv. */
    image: { url: "/img/og/magazin.jpg", width: 1200, height: 630, alt: dict.meta.magazin.ogImageAlt },
  });
}

const MAGAZIN_WINES = MAGAZIN_WINE_SLUGS.map((slug) =>
  WINES.find((w) => w.slug === slug)
).filter(Boolean);

/* Die Leitworte des Hefts — laufen als langsames Band unter La storia */
const MARQUEE_WORDS = [
  "Storie di vino",
  "Quattro regioni",
  "Boutique-Winzer",
  "Food Pairing",
  "La dolce vita",
  "Handverlesen",
];

export default async function MagazinPage({ params }) {
  const dict = await getDictionary(params.locale);

  /* Die Interview-Sektion und ihr Sprungziel erscheinen nur, wenn wirklich ein
     Gespräch veröffentlicht ist — sonst zeigte die Fußzeile von Kapitel IV auf
     eine Platzhalterkarte. Die Texte kommen aus dem Wörterbuch der jeweiligen
     Sprache (content/<sprache>/interviews.js). */
  const interviews = publishedInterviews(dict);
  const hasInterviews = interviews.length > 0;

  return (
    <>
      <MagazinJsonLd locale={params.locale} dict={dict} faq={MAGAZIN_FAQ} />

      <main className="relative min-h-screen">
        {/* ================= CAPITOLO I: TITELSEITE, VISION & GESCHICHTE ==== */}
        <section aria-labelledby="magazin-titel" className="relative overflow-hidden">
          {/* Cremeschleier oben — die Seite hat bewusst keinen Vollbild-Hero */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[30rem] bg-gradient-to-b from-cream via-cream/60 to-transparent"
          />
          <Aura tint="gold" className="-left-56 top-24 h-[38rem] w-[38rem]" />
          <Aura tint="blush" drift={2} className="-right-56 top-[40%] h-[34rem] w-[34rem]" />
          <GhostWord className="left-[-2vw] bottom-[4%] text-[11vw]">La storia</GhostWord>

          {/* Masthead, Rubrikenleiste und Cover Story — Aufbau siehe CoverHero */}
          <CoverHero hasInterviews={hasInterviews} />
        </section>

        {/* ---- Leitworte des Hefts als langsames Laufband ---- */}
        <div className="border-y border-champagne/25">
          <Marquee items={MARQUEE_WORDS} />
        </div>

        {/* ================= CAPITOLO II: GENUSSMOMENTE ===================== */}
        <ChapterBreak number="II" title="Genussmomente" word="Gli abbinamenti" />
        {/* Der Anlass-Schalter: fünf Tasten, eine Antwort-Karte — wer
            „Fisch & Meer" wählt, sieht die Empfehlung für Fisch (Bauform und
            Inhalte in components/magazin/PairingMoments bzw. pairingCards.js).
            `id="food-pairing"` ist das Sprungziel des Pairing-Teasers der
            Weine-Seite (/magazin#food-pairing) und zugleich der
            Sommario-Anker von Capitolo II. */}
        <PairingMoments headingId="magazin-momente" id="food-pairing" />

        {/* ---- Schlusspunkt des Food-Pairing-Kapitels: das Tinten-Zitat ---- */}
        <InkQuote
          className="pb-8 lg:pb-10"
          text="Il vino è la poesia della terra."
          translation="Der Wein ist die Poesie der Erde."
          cite="Mario Soldati"
        />

        {/* ================= CAPITOLO III: BACHECA SOCIAL MEDIA ============= */}
        <ChapterBreak number="III" title="Bacheca" word="Dalla community" className="pb-6" />
        <div id="bacheca" className="scroll-mt-24">
          <SocialBoard headingId="magazin-bacheca" />
        </div>

        {/* ================= ARCHIV (Sprungziel aus Kapitel III) ============ */}
        <div id="artikel" className="relative scroll-mt-28 overflow-hidden">
          <Aura tint="olive" className="-left-48 top-[12%] h-[32rem] w-[32rem]" />
          <Aura tint="terracotta" drift={2} className="-right-48 bottom-[4%] h-[34rem] w-[34rem]" />
          <GhostWord className="left-[-2vw] top-[38%] text-[11vw]">Storie</GhostWord>
          <GhostWord className="right-[-2vw] bottom-[2%] text-[10vw]">Sapori</GhostWord>

          <div className="relative mx-auto max-w-content px-6 pb-16 pt-10 lg:px-10">
            {/* ---- Ornament-Auftakt: das Archiv stellt sich vor ---- */}
            <Reveal y={12} blur={false}>
              <div aria-hidden="true" className="flex items-center gap-4 pb-5">
                <span className="h-px flex-1 bg-charcoal/10" />
                <span className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-charcoal/45">
                  <Grapes className="h-3.5 w-3.5 text-champagne" />
                  Archivio del Magazin
                </span>
                <span className="h-px flex-1 bg-charcoal/10" />
              </div>
            </Reveal>

            {/* ---- Im Gespräch — nur mit veröffentlichten Interviews ---- */}
            {hasInterviews && (
              <div id="interviste" className="scroll-mt-28">
                <InterviewSection
                  interviews={interviews}
                  section={dict.interviews?.section ?? {}}
                  headingId="magazin-interviews"
                />
              </div>
            )}

            {/* ---- Die Weine aus den Geschichten ---- */}
            <section aria-labelledby="magazin-weine" className={hasInterviews ? "mt-14" : "mt-5"}>
              <SectionTitle
                align="left"
                eyebrow="Aus dem Magazin ins Glas"
                description="Die Flaschen, um die sich unsere Geschichten drehen – wischen Sie über ein Foto, um das Rückenetikett zu sehen."
                headingId="magazin-weine"
              >
                Die Weine aus unseren Geschichten
              </SectionTitle>
              <div className="mt-8">
                <RegionWineRail wines={MAGAZIN_WINES} label="Im Magazin verkostet" />
              </div>
            </section>

            {/* Newsletter läuft ausschließlich über das Band im Footer — keine Dublette hier. */}
          </div>
        </div>

        {/* ================= CAPITOLO IV: BOX CURIOSITÀ & PASSAGGIO ========= */}
        <ChapterBreak number="IV" title="Curiosità" word="Il congedo" className="pb-6" />
        <div id="curiosita" className="scroll-mt-12">
          <CuriosityBand
            headingId="magazin-curiosita"
            showInterviewLink={hasInterviews}
            className="py-8 lg:py-10"
          />
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
      </main>
    </>
  );
}
