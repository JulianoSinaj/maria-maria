import Link from "next/link";
import SplitText from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import Parallax from "@/components/motion/Parallax";
import Button from "@/components/ui/Button";
import Photo from "@/components/media/Photo";
import { Eyebrow } from "@/components/Deco";
import { Aura, GhostWord } from "@/components/Atmosphere";
import { Arrow } from "@/components/Icons";
import SoulCards from "@/components/SoulCards";
import StoryChapter from "@/components/geschichte/StoryChapter";
import StoryChapterNav from "@/components/geschichte/StoryChapterNav";
import StoryStats from "@/components/geschichte/StoryStats";
import StoryCta from "@/components/geschichte/StoryCta";
import { STORY_CHAPTERS, STORY_TODAY } from "@/components/geschichte/storyData";

/* ============================================================================
   GESCHICHTE — die Erzählseite der Marke, Sprungziel aus Capitolo I
   („La storia") des Magazins.
   ----------------------------------------------------------------------------
   Die Seite ist als Reise in sechs Kapiteln gesetzt:

   Auftakt        „Zwei Frauen. Zwei Generationen. Eine Haltung zum Wein."
                  — links der Kanon der Marke mit den beiden CTAs, rechts
                  das Foto „Persönlich ausgewählt".
   Der Name       „Zwei Marias. Erinnerung und Gegenwart." — die zwei
                  Generationen hinter dem Namen, daneben das Seelen-Paar
                  (SoulCards) mit dem goldenen „&".
   01–05          die Stationen der Reise als Bild/Text-Wechselgriff
                  (StoryChapter): der Anfang von Deutschland aus, Salento,
                  Kampanien, Gardasee, die Ankunft in Düsseldorf. Jedes
                  Kapitel verlinkt in die Tiefe (Regionen, Lugana,
                  Kollektion).
   06             „Die Auswahl" — Intro-Satz und die drei Prinzipien
                  zwischen Haarlinien (StoryStats).
   Passaggio      das Bordeaux-Schlussband (StoryCta) führt weiter in
                  die Regionen — derselbe Ausgang, den auch Startseite
                  und Magazin nehmen.

   Überschriften-Gliederung: ein <h1> (Zwei Frauen, zwei Generationen),
   jedes Kapitel eine <section> mit <h2> über aria-labelledby. Die Anker
   der Kapitel (#anfang … #auswahl) kommen aus storyData — dieselbe
   Quelle, aus der auch das Kapitel-Menü liest; die primäre Hero-CTA
   springt zu #der-name, dem Kapitel über den Namen.
   ========================================================================== */

const DESCRIPTION =
  "Zwei Frauen. Zwei Generationen. Eine Haltung zum Wein. Die Geschichte von Maria Maria führt von Lizzano im Salento über Irpinien und den Gardasee nach Düsseldorf — persönlich ausgewählte italienische Weine, seit 2019 in Deutschland zu Hause.";

export const metadata = {
  /* Der Marken-Suffix kommt aus dem title.template des Root-Layouts */
  title: "Unsere Geschichte",
  description: DESCRIPTION,
  keywords: [
    "Maria Maria",
    "Geschichte",
    "italienische Weine",
    "Salento",
    "Lizzano",
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

/* Die Eckdaten der Marke — als Zeile unter dem Text */
const JOURNEY = ["Seit 2019 in Deutschland", "Sitz in Düsseldorf", "Italienische Herkunft"];

export default function GeschichtePage() {
  return (
    <main className="relative min-h-screen pt-[calc(96px+env(safe-area-inset-top))]">
      {/* ================= AUFTAKT: LE ORIGINI ============================ */}
      <section id="geschichte" aria-labelledby="geschichte-titel" className="relative overflow-hidden">
        <Aura tint="gold" className="-left-56 top-16 h-[38rem] w-[38rem]" />
        <Aura tint="blush" drift={2} className="-right-56 top-[45%] h-[34rem] w-[34rem]" />
        {/* der Geisterzug hinter den Karten — wie „Due anime" der Startseite */}
        <GhostWord className="right-[-3vw] top-8 text-[13vw]">storia</GhostWord>

        <div className="relative mx-auto max-w-content px-6 pb-14 pt-10 lg:px-10 lg:pb-20 lg:pt-14">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* ---- links: der Kanon der Marke ---- */}
            <div>
              <Reveal y={12} blur={false}>
                <Eyebrow>Maria Maria · Unsere Geschichte</Eyebrow>
              </Reveal>
              <h1
                id="geschichte-titel"
                className="mt-4 text-balance font-playfair text-[clamp(2.1rem,4.4vw,3.3rem)] leading-[1.08] text-charcoal"
              >
                <SplitText as="span" className="block" text="Zwei Frauen." delay={0.12} />
                <SplitText as="span" className="block" text="Zwei Generationen." delay={0.24} />
                <SplitText as="span" className="block" text="Eine Haltung" delay={0.36} />
                <SplitText as="span" className="block" text="zum Wein." delay={0.48} />
              </h1>
              <Reveal delay={0.35} y={16}>
                <p className="mt-6 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                  Der Name Maria Maria verbindet Erinnerung und Gegenwart. Persönliche Wurzeln im
                  Salento prägen eine Haltung, die Herkunft, Charakter und gemeinsamen Genuss
                  verbindet.
                </p>
                <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                  Seit 2019 ist Maria Maria in Deutschland aktiv, mit Sitz in Düsseldorf und einer
                  Auswahl, die für Deutschland und weitere Länder gedacht ist.
                </p>
              </Reveal>

              {/* die beiden Ausgänge: zum Namen, in die Auswahl */}
              <Reveal delay={0.45}>
                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <Button href="#der-name" variant="primary" size="md" iconType="none">
                    Geschichte entdecken
                  </Button>
                  <Link
                    href="/unsere-weine"
                    className="group/link inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-semibold text-bordeaux"
                  >
                    Unsere Weine kennenlernen
                    <Arrow className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </Reveal>

              {/* die Eckdaten der Marke — als stille Zeile unter den CTAs */}
              <Reveal delay={0.52}>
                <ol className="mt-7 flex flex-wrap items-center gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                  {JOURNEY.map((stop, i) => (
                    <li key={stop} className="flex items-center">
                      {i > 0 && (
                        <span aria-hidden="true" className="mx-2.5 text-charcoal/35">
                          ·
                        </span>
                      )}
                      <span>{stop}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>

            {/* ---- rechts: das Foto „Persönlich ausgewählt" ----
                Das einzige Bild über dem Falz: es lädt eager mit hoher
                Priorität, alles Weitere bleibt bei der lazy-Vorgabe von
                <Photo>. width/height sichern das Seitenverhältnis gegen
                Layoutsprünge ab. */}
            <Reveal y={24}>
              <TiltCard className="group" max={4} radius="rounded-card-lg">
                <figure className="relative aspect-[10/11] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift">
                  <Parallax speed={0.08} overscan className="absolute inset-0">
                    <Photo
                      src="/img/magazin/cover-story.jpg"
                      alt="Maria mit originalen Maria-Maria-Weinflaschen an einem gedeckten Tisch"
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      width={875}
                      height={823}
                      loading="eager"
                      fetchpriority="high"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                    />
                  </Parallax>
                  {/* das Siegel der Auswahl — als stilles Etikett auf dem Foto */}
                  <figcaption className="absolute bottom-5 left-5 rounded-full bg-ivory/90 px-4 py-2 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-bordeaux shadow-chip backdrop-blur-sm">
                    Persönlich ausgewählt
                  </figcaption>
                </figure>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= DER NAME: ZWEI MARIAS ==========================
          Sprungziel der primären Hero-CTA — scroll-mt hält den Titel unter
          dem fixierten Header frei. */}
      <section
        id="der-name"
        aria-labelledby="name-titel"
        className="relative scroll-mt-28 overflow-hidden"
      >
        <div className="relative mx-auto max-w-content px-6 py-14 lg:px-10 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* ---- links: die zwei Generationen hinter dem Namen ---- */}
            <div>
              <Reveal y={12} blur={false}>
                <Eyebrow>Der Name</Eyebrow>
              </Reveal>
              <Reveal delay={0.1}>
                <h2
                  id="name-titel"
                  className="mt-4 text-balance font-playfair text-[clamp(1.8rem,3.6vw,2.7rem)] leading-[1.12] text-charcoal"
                >
                  <span className="block">Zwei Marias.</span>
                  <span className="block">Erinnerung und Gegenwart.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2} y={16}>
                <p className="mt-7 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                  Der Name Maria Maria trägt die Verbindung zwischen zwei Frauen und zwei
                  Generationen in sich.
                </p>
                <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                  Die ältere Maria steht für Lizzano, Familie, Gastfreundschaft und eine
                  Weinkultur, die am gemeinsamen Tisch gelebt wird.
                </p>
                <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                  Die jüngere Maria führt diese Haltung in die Gegenwart: mit einem zeitgemäßen
                  Blick und einer persönlichen Auswahl italienischer Weine.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="mt-8 font-playfair text-[19px] italic leading-snug text-vine">
                  „Was bleibt, wird mit einer neuen Perspektive weitergetragen.“
                </p>
              </Reveal>
            </div>

            {/* ---- rechts: das Seelen-Paar ---- */}
            <SoulCards />
          </div>
        </div>
      </section>

      {/* ================= KAPITEL-KOMPASS (nur Telefone) =================
          Direktes Kind von <main>, damit die Sticky-Leiste bis zum Ende der
          Erzählung haftet — ein Wrapper würde sie auf seine eigene Höhe
          begrenzen. Ab md rendert die Komponente nichts Sichtbares. */}
      <StoryChapterNav />

      {/* ================= KAPITEL 01–05: DIE REISE ======================= */}
      {STORY_CHAPTERS.map((chapter, i) => (
        <StoryChapter key={chapter.id} chapter={chapter} flipped={i % 2 === 1} />
      ))}

      {/* ================= PASSAGGIO: WEITER IN DIE REGIONEN ==============
          Das Bordeaux-Band schließt die Reise der fünf Stationen ab —
          danach klingt die Seite mit dem Zahlen-Kapitel „Heute" aus. */}
      <StoryCta />

      {/* ================= KAPITEL 06: DIE AUSWAHL ========================
          Warum ein Wein zu Maria Maria kommt — im ruhigen, hellen Kleid
          der Seite. Der Intro-Satz („Nicht eine einzelne Stadt …") steht
          bewusst sichtbar vor den drei Prinzipien — er verhindert, dass
          Düsseldorf als Auswahlkriterium gelesen wird. */}
      <section
        id={STORY_TODAY.id}
        aria-labelledby="story-auswahl"
        className="relative scroll-mt-40 overflow-hidden"
      >
        <Aura tint="olive" className="-right-48 top-[10%] h-[30rem] w-[30rem]" />
        <GhostWord className="left-[-2vw] bottom-[-6%] text-[11vw]">selezione</GhostWord>

        <div className="relative mx-auto max-w-content px-6 pb-4 pt-8 lg:px-10 lg:pb-5 lg:pt-10">
          <Reveal className="text-center">
            <p className="flex items-center justify-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-champagne">
              <span className="text-bordeaux/80">{STORY_TODAY.label}</span>
            </p>
            <h2
              id="story-auswahl"
              className="mx-auto mt-4 max-w-2xl text-balance font-playfair text-[clamp(1.6rem,3vw,2.35rem)] leading-[1.14] text-charcoal"
            >
              {STORY_TODAY.title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[13.5px] leading-relaxed text-charcoal/70">
              {STORY_TODAY.intro}
            </p>
          </Reveal>

          <div className="mt-6 lg:mt-8">
            <StoryStats />
          </div>
        </div>
      </section>
    </main>
  );
}
