import SplitText from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, GoldRule } from "@/components/Deco";
import { Aura, GhostWord } from "@/components/Atmosphere";
import SoulCards from "@/components/SoulCards";
import StoryChapterNav from "@/components/geschichte/StoryChapterNav";
import StoryChapter from "@/components/geschichte/StoryChapter";
import StoryStats from "@/components/geschichte/StoryStats";
import StoryCta from "@/components/geschichte/StoryCta";
import { STORY_CHAPTERS, STORY_TODAY } from "@/components/geschichte/storyData";

/* ============================================================================
   GESCHICHTE — die Erzählseite der Marke, Sprungziel aus Capitolo I
   („La storia") des Magazins.
   ----------------------------------------------------------------------------
   Die Seite ist als Reise in sechs Kapiteln gesetzt, geführt vom
   Kapitel-Menü (StoryChapterNav), das als Glas-Leiste unter dem Header
   haftet und per Scrollspy die Station in Lesehöhe markiert:

   Auftakt        Le Origini — „Zwei Seelen, ein Name": der Kanon der
                  Startseite (Sommer 2019, die Reisestationen, das Motto),
                  daneben das Seelen-Paar (SoulCards) mit dem goldenen „&".
   01–05          die Stationen der Reise als Bild/Text-Wechselgriff
                  (StoryChapter): der Anfang in Italien, Salento, Gardasee,
                  Campania, die Ankunft in Düsseldorf. Jedes Kapitel
                  verlinkt in die Tiefe (Regionen, Lugana, Kollektion).
   06             „Heute" — die Auswahl in Zahlen (StoryStats) mit
                  federnd aufrollenden Kennzahlen.
   Passaggio      das Bordeaux-Schlussband (StoryCta) führt weiter in
                  die Regionen — derselbe Ausgang, den auch Startseite
                  und Magazin nehmen.

   Überschriften-Gliederung: ein <h1> (Zwei Seelen, ein Name), jedes
   Kapitel eine <section> mit <h2> über aria-labelledby. Die Anker der
   Kapitel (#anfang … #heute) kommen aus storyData — dieselbe Quelle,
   aus der auch das Kapitel-Menü liest.
   ========================================================================== */

const DESCRIPTION =
  "Vom Sommer 2019 im Salento über den Gardasee und Kampanien bis nach Düsseldorf — die Geschichte von Maria Maria: zwei Seelen, ein Name und eine kuratierte Auswahl italienischer Weine.";

export const metadata = {
  /* Der Marken-Suffix kommt aus dem title.template des Root-Layouts */
  title: "Unsere Geschichte",
  description: DESCRIPTION,
  keywords: [
    "Maria Maria",
    "Geschichte",
    "italienische Weine",
    "Salento",
    "Lago di Garda",
    "Kampanien",
    "Düsseldorf",
  ],
  alternates: { canonical: "/geschichte" },
  openGraph: {
    type: "website",
    url: "/geschichte",
    title: "Unsere Geschichte — Maria Maria",
    description: DESCRIPTION,
    images: [
      {
        url: "/img/stilllife.jpg",
        width: 1200,
        height: 630,
        alt: "Maria-Maria-Flasche mit Rotweinglas und Oliven auf einer sonnigen Steinterrasse",
      },
    ],
  },
  twitter: {
    title: "Unsere Geschichte — Maria Maria",
    description: DESCRIPTION,
    images: ["/img/stilllife.jpg"],
  },
};

/* Die Stationen der Reise — wie im Kapitel-Menü, als Zeile unter dem Text */
const JOURNEY = ["Salento", "Lago di Garda", "Campania", "Düsseldorf"];

export default function GeschichtePage() {
  return (
    <main className="relative min-h-screen pt-[calc(96px+env(safe-area-inset-top))]">
      {/* Kapitel-Menü — haftet ab hier für die ganze Erzählung */}
      <StoryChapterNav />

      {/* ================= AUFTAKT: LE ORIGINI ============================ */}
      <section aria-labelledby="geschichte-titel" className="relative overflow-hidden">
        <Aura tint="gold" className="-left-56 top-16 h-[38rem] w-[38rem]" />
        <Aura tint="blush" drift={2} className="-right-56 top-[45%] h-[34rem] w-[34rem]" />
        {/* der Geisterzug hinter den Karten — wie „Due anime" der Startseite */}
        <GhostWord className="right-[-3vw] top-8 text-[13vw]">Due anime</GhostWord>

        <div className="relative mx-auto max-w-content px-6 pb-14 pt-10 lg:px-10 lg:pb-20 lg:pt-14">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* ---- links: der Kanon der Marke ---- */}
            <div>
              <Reveal y={12} blur={false}>
                <Eyebrow>Le Origini</Eyebrow>
              </Reveal>
              <h1
                id="geschichte-titel"
                className="mt-4 text-balance font-playfair text-[clamp(2.1rem,4.4vw,3.3rem)] leading-[1.08] text-charcoal"
              >
                <SplitText text="Zwei Seelen," delay={0.12} />{" "}
                <SplitText
                  text="ein Name"
                  delay={0.3}
                  wordClassName="italic text-bordeaux"
                />
              </h1>
              <Reveal delay={0.35} y={16}>
                <p className="mt-6 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                  Maria Maria beginnt im Salento, im Sommer 2019 — zwischen Kindheitserinnerungen
                  und alten Rebzeilen wurde aus einem Moment eine Entscheidung: Wein ist für uns
                  kein Getränk, sondern ein Katalysator für Emotionen.
                </p>
                <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                  Seitdem führt unsere Reise von den sonnenverwöhnten Rebsorten des Südens über die
                  stillen Ufer des Gardasees bis nach Düsseldorf — jede Flasche eine Station, jede
                  Region eine eigene Sprache.
                </p>
              </Reveal>

              {/* die Reise — Station für Station, wie das Kapitel-Menü */}
              <Reveal delay={0.45}>
                <ol className="mt-7 flex flex-wrap items-center gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/60">
                  {JOURNEY.map((stop, i) => (
                    <li key={stop} className="flex items-center">
                      {i > 0 && (
                        <span aria-hidden="true" className="mx-2.5 h-px w-5 bg-champagne sm:w-7" />
                      )}
                      <span className={i === 0 || i === JOURNEY.length - 1 ? "text-bordeaux" : ""}>
                        {stop}
                      </span>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal delay={0.52}>
                <div className="mt-8 flex items-center gap-3">
                  <GoldRule className="w-12" />
                  <p className="font-playfair text-[19px] italic leading-snug text-vine">
                    „Italian wine, personal selection, share the pleasure.“
                  </p>
                </div>
              </Reveal>
            </div>

            {/* ---- rechts: das Seelen-Paar ---- */}
            <SoulCards />
          </div>
        </div>
      </section>

      {/* ================= KAPITEL 01–05: DIE REISE ======================= */}
      {STORY_CHAPTERS.map((chapter, i) => (
        <StoryChapter key={chapter.id} chapter={chapter} flipped={i % 2 === 1} />
      ))}

      {/* ================= PASSAGGIO: WEITER IN DIE REGIONEN ==============
          Das Bordeaux-Band schließt die Reise der fünf Stationen ab —
          danach klingt die Seite mit dem Zahlen-Kapitel „Heute" aus. */}
      <StoryCta />

      {/* ================= KAPITEL 06: HEUTE ============================== */}
      <section
        id={STORY_TODAY.id}
        aria-labelledby="story-heute"
        className="relative scroll-mt-40 overflow-hidden"
      >
        <Aura tint="olive" className="-right-48 top-[10%] h-[30rem] w-[30rem]" />
        <GhostWord className="left-[-2vw] bottom-[-6%] text-[11vw]">Oggi</GhostWord>

        <div className="relative mx-auto max-w-content px-6 pb-6 pt-10 lg:px-10 lg:pb-8 lg:pt-16">
          <Reveal className="text-center">
            <p className="flex items-center justify-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-champagne">
              <span aria-hidden="true" className="font-playfair text-[15px] italic tracking-normal">
                {STORY_TODAY.num}
              </span>
              <span aria-hidden="true" className="h-px w-7 bg-champagne/70" />
              <span className="text-bordeaux/80">{STORY_TODAY.label}</span>
            </p>
            <h2
              id="story-heute"
              className="mx-auto mt-4 max-w-2xl text-balance font-playfair text-[clamp(1.6rem,3vw,2.35rem)] leading-[1.14] text-charcoal"
            >
              {STORY_TODAY.title}
            </h2>
          </Reveal>

          <div className="mt-10 lg:mt-12">
            <StoryStats />
          </div>

          <Reveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-md text-center text-[12.5px] leading-relaxed text-charcoal/60">
              {STORY_TODAY.footer}
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
