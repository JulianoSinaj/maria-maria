import Link from "@/components/i18n/LocaleLink";
import SplitText from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { Eyebrow, GrapeRule } from "@/components/Deco";
import { Aura, GhostWord } from "@/components/Atmosphere";
import { Arrow } from "@/components/Icons";
import HomeHeroFx from "@/components/home/HomeHeroFx";
import GeschichteHeroPhoto, {
  GeschichteHeroPreload,
} from "@/components/geschichte/GeschichteHeroPhoto";
import SoulCards from "@/components/SoulCards";
import StoryChapter from "@/components/geschichte/StoryChapter";
import StoryChapterNav from "@/components/geschichte/StoryChapterNav";
import StoryStats from "@/components/geschichte/StoryStats";
import StoryCta from "@/components/geschichte/StoryCta";
import { STORY_CHAPTERS, STORY_TODAY } from "@/components/geschichte/storyData";
import JsonLd from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, ORG_ID } from "@/lib/seo/jsonLd";

/* ============================================================================
   GESCHICHTE — die Erzählseite der Marke, Sprungziel aus Capitolo I
   („La storia") des Magazins.
   ----------------------------------------------------------------------------
   Die Seite ist als Reise in sechs Kapiteln gesetzt:

   Auftakt        „Zwei Frauen. Zwei Generationen. Eine Haltung zum Wein."
                  — dieselbe randlose Foto-Bühne wie auf Startseite und
                  Kollektion: die Tavolata trägt den Hero über volle
                  100svh, der Kanon der Marke steht links im Schleierlicht.
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

/* Titel und Description je Sprache aus dem Wörterbuch; hreflang,
   Canonical und OpenGraph baut pageMetadata() daraus auf. */
export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "/geschichte",
    meta: dict.meta.geschichte,
    /* Zeigte vorher auf /img/stilllife.jpg und behauptete 1200 × 630 — das
       Foto misst 700 × 676. Jetzt auf den echten Zuschnitt aus
       scripts/og-images.mjs, gleiches Motiv, gleiche Bildbeschreibung. */
    image: { url: "/img/og/geschichte.jpg", width: 1200, height: 630, alt: dict.meta.geschichte.ogImageAlt },
  });
}

/* Die Markenerzählung — als AboutPage ausgezeichnet und über `mainEntity`
   mit der Organisation verbunden. Das ist der Knoten, aus dem Google die
   Herkunftsgeschichte einer Marke zieht: zwei Generationen, Gründung 2019,
   Sitz Düsseldorf, Herkunft Italien. Für den Wissensgraph-Eintrag zählt
   nicht die Länge des Textes, sondern dass die Seite sich als „das hier
   handelt von diesem Unternehmen" zu erkennen gibt. */
function GeschichteJsonLd({ locale, dict }) {
  const url = absoluteUrl(localePath(locale, "/geschichte"));
  const nav = dict?.common?.nav ?? {};
  const localize = (href) => localePath(locale, href);

  const crumbs = breadcrumbNode(
    [
      { label: nav.home || "Home", href: "/" },
      { label: dict.meta.geschichte.title, href: "/geschichte" },
    ],
    { url, localize }
  );

  return (
    <JsonLd
      data={graph(
        {
          ...webPageNode({
            url,
            name: dict.meta.geschichte.title,
            description: dict.meta.geschichte.description,
            locale,
            type: "AboutPage",
            image: {
              url: "/img/og/geschichte.jpg",
              alt: dict.meta.geschichte.ogImageAlt,
            },
            breadcrumbId: crumbs?.["@id"] ?? null,
          }),
          mainEntity: { "@id": ORG_ID },
        },
        crumbs
      )}
    />
  );
}

/* Die Eckdaten der Marke — als Zeile unter dem Text */
const JOURNEY = ["Seit 2019 in Deutschland", "Sitz in Düsseldorf", "Italienische Herkunft"];

export default async function GeschichtePage({ params }) {
  const dict = await getDictionary(params.locale);

  return (
    /* Kein eigenes <main> mehr: StorefrontChrome setzt bereits eines um die
       Seite, und der Hero läuft jetzt randlos unter dem Header hindurch —
       die frühere Kopfhöhen-Polsterung würde ihn nach unten wegdrücken. */
    <div className="relative min-h-screen">
      <GeschichteJsonLd locale={params.locale} dict={dict} />
      {/* ================= AUFTAKT: LE ORIGINI ============================ */}
      <GeschichteHeroPreload />
      <section
        id="geschichte"
        aria-labelledby="geschichte-titel"
        className="grain relative overflow-hidden"
      >
        {/* Volle Foto-Bühne wie auf Startseite und Kollektion: die Tavolata
            trägt den Hero randlos, HomeHeroFx liefert den federgewichteten
            Zoom beim Verlassen des Heros und den Scroll-Cue.

            Die Bühne ist auf dem Telefon auf EIN 100svh gedeckelt, statt wie
            dort der ganzen Sektion zu folgen. Der Grund: der Kanon dieser
            Seite ist länger als der der anderen Heroes, die Sektion wächst
            im Hochkant über den Bildschirm hinaus — und ein Foto, das über
            volle 1100 px hochkant zieht, schneidet vom 4:3-Original nur noch
            ein Viertel der Bildbreite heraus. Gedeckelt bleibt der Schnitt
            breit genug für beide Gesichter; darunter läuft der Text auf dem
            Elfenbein der Seite weiter. */}
        <div className="absolute inset-x-0 top-0 h-[100svh] lg:h-full">
          <HomeHeroFx photo={<GeschichteHeroPhoto />} />

          {/* Schleier für Lesbarkeit: mobil von unten, ab lg als Lichtpfütze
              in der UNTEREN RECHTEN Ecke — gespiegelt und abgesenkt gegenüber
              Startseite und Kollektion. Der Grund steht im Foto: die beiden
              Marias sitzen links und in der oberen Bildhälfte. Der übliche
              Schleier von links würde ausgerechnet die zwei Gesichter
              auswaschen, um die es auf dieser Seite geht; die Pfütze legt
              sich stattdessen über die auslaufende Tafel. Gemessen liegt der
              Kontrast von Charcoal auf diesem Grund bei mindestens 4,8:1, im
              Mittel über 9:1.

              Als radial-gradient() in eckigen Klammern statt als
              bg-gradient-to-*: Tailwinds Verlaufs-Kurzformen kennen nur
              lineare Verläufe. Die Prozentwerte der linearen Fassung müssen
              dagegen auf dem Fünferraster liegen — via-52% o. ä. fällt still
              aus dem Kompilat. */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-t from-ivory from-40% via-ivory/65 via-45% to-transparent to-50% lg:hidden" />
            <div className="absolute inset-0 hidden bg-[radial-gradient(115%_105%_at_88%_100%,rgba(247,244,239,0.98)_0%,rgba(247,244,239,0.93)_45%,rgba(247,244,239,0)_80%)] lg:block" />
          </div>

          {/* Elfenbein-Hauch oben, damit die Navigation über der Pergola
              lesbar bleibt */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory/80 via-ivory/30 to-transparent"
            aria-hidden="true"
          />

          {/* settle into the page colour */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ivory sm:h-44"
          />
        </div>

        {/* Der Textblock steht auf ALLEN Breiten unten (kein
            lg:justify-center wie in den anderen Heroes): oben im Bild sitzen
            die Gesichter, unten die Tafel — nur dort trägt der Schleier
            Text.

            Im Hochkant hält das pt-[58svh] den Block unter den beiden
            Gesichtern — genau dort, wo der Schleier bereits deckt. Der Kanon dieser Seite ist länger als der der anderen
            Heroes (vier Headline-Zeilen, zwei Absätze, zwei CTAs, die
            Eckdaten) — in EIN Telefon-100svh passt er zusammen mit dem
            Foto nicht, ohne den Frauen ins Gesicht zu schreiben. Also darf
            die Sektion auf dem Telefon über den Bildschirm hinauswachsen:
            erst das Foto, dann der Text auf Elfenbein. */}
        <div className="relative mx-auto flex min-h-[100svh] max-w-content flex-col justify-end px-6 pb-24 pt-[58svh] lg:px-10 lg:pb-16 lg:pt-32">
          <div className="lg:ml-auto lg:max-w-lg">
            <Reveal y={12} blur={false}>
              <Eyebrow>Maria Maria · Unsere Geschichte</Eyebrow>
            </Reveal>
            <h1
              id="geschichte-titel"
              /* Obergrenze 3,1 rem: „Zwei Generationen." muss in die 32 rem
                 breite Spalte der Lichtpfütze passen, ohne zu brechen. */
              className="mt-4 text-balance font-playfair text-[clamp(2.1rem,4.2vw,3.1rem)] leading-[1.07] tracking-[-0.015em] text-charcoal sm:mt-6"
            >
              <SplitText as="span" className="block" text="Zwei Frauen." delay={0.12} />
              <SplitText as="span" className="block" text="Zwei Generationen." delay={0.24} />
              <SplitText
                as="span"
                className="block italic"
                wordClassName="bg-gradient-to-r from-bordeaux via-wine to-bordeaux bg-clip-text text-transparent"
                text="Eine Haltung"
                delay={0.36}
              />
              <SplitText
                as="span"
                className="block italic"
                wordClassName="bg-gradient-to-r from-bordeaux via-wine to-bordeaux bg-clip-text text-transparent"
                text="zum Wein."
                delay={0.48}
              />
            </h1>
            <Reveal delay={0.35} y={16}>
              <GrapeRule className="mt-6 hidden sm:flex" />
              <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-charcoal/75">
                Der Name Maria Maria verbindet Erinnerung und Gegenwart. Persönliche Wurzeln im
                Salento prägen eine Haltung, die Herkunft, Charakter und gemeinsamen Genuss
                verbindet.
              </p>
              <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-charcoal/75">
                Seit 2019 ist Maria Maria in Deutschland aktiv, mit Sitz in Düsseldorf und einer
                Auswahl, die für Deutschland und weitere Länder gedacht ist.
              </p>
            </Reveal>

            {/* die beiden Ausgänge: zum Namen, in die Auswahl */}
            <Reveal delay={0.45}>
              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4 sm:mt-8">
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
              <ol className="mt-6 flex flex-wrap items-center gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/60 sm:mt-8">
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
    </div>
  );
}
