import Link from "@/components/i18n/LocaleLink";
import SplitText from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
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
import { STORY_CHAPTERS, STORY_TODAY, STORY_STATS } from "@/components/geschichte/storyData";
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

export default async function GeschichtePage({ params }) {
  const dict = await getDictionary(params.locale);
  const t = dict.geschichte ?? {};
  const hero = t.hero ?? {};
  const name = t.name ?? {};
  const today = t.today ?? {};

  /* Struktur (Anker, Bilder, Rebsorten, Link-Ziele) aus storyData, Text je
     Sprache aus dem Wörterbuch — zusammengeführt über die Kapitel-ID. Der
     Kapitel-Kompass bekommt dieselbe Liste, damit Anker und Beschriftung
     nie auseinanderlaufen. */
  const chapters = STORY_CHAPTERS.map((chapter) => {
    const copy = t.chapters?.[chapter.id] ?? {};
    return {
      ...chapter,
      ...copy,
      link: chapter.link ? { ...chapter.link, label: copy.linkLabel ?? "" } : undefined,
    };
  });

  const stats = STORY_STATS.map((stat, i) => ({ ...stat, ...(t.stats?.[i] ?? {}) }));

  return (
    <main className="relative min-h-screen pt-[calc(96px+env(safe-area-inset-top))]">
      <GeschichteJsonLd locale={params.locale} dict={dict} />
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
                <Eyebrow>{hero.eyebrow}</Eyebrow>
              </Reveal>
              <h1
                id="geschichte-titel"
                className="mt-4 text-balance font-playfair text-[clamp(2.1rem,4.4vw,3.3rem)] leading-[1.08] text-charcoal"
              >
                {(hero.titleLines ?? []).map((line, i) => (
                  <SplitText
                    key={line}
                    as="span"
                    className="block"
                    text={line}
                    delay={0.12 + i * 0.12}
                  />
                ))}
              </h1>
              <Reveal delay={0.35} y={16}>
                {(hero.paragraphs ?? []).map((p, i) => (
                  <p
                    key={i}
                    className={`${i === 0 ? "mt-6" : "mt-4"} max-w-lg text-[13.5px] leading-relaxed text-charcoal/70`}
                  >
                    {p}
                  </p>
                ))}
              </Reveal>

              {/* die beiden Ausgänge: zum Namen, in die Auswahl */}
              <Reveal delay={0.45}>
                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <Button href="#der-name" variant="primary" size="md" iconType="none">
                    {hero.ctaStory}
                  </Button>
                  <Link
                    href="/unsere-weine"
                    className="group/link inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-semibold text-bordeaux"
                  >
                    {hero.ctaWines}
                    <Arrow className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </Reveal>

              {/* die Eckdaten der Marke — als stille Zeile unter den CTAs */}
              <Reveal delay={0.52}>
                <ol className="mt-7 flex flex-wrap items-center gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                  {(hero.journey ?? []).map((stop, i) => (
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
            <figure className="relative aspect-[4/3] overflow-hidden rounded-card-lg shadow-luxe">
              <Photo
                src="/img/magazin/tavolata.jpg"
                alt={hero.photoAlt ?? ""}
                sizes="(min-width: 1024px) 45vw, 100vw"
                width={915}
                height={686}
                loading="eager"
                fetchpriority="high"
                className="h-full w-full object-cover"
              />
            </figure>
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
                <Eyebrow>{name.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.1}>
                <h2
                  id="name-titel"
                  className="mt-4 text-balance font-playfair text-[clamp(1.8rem,3.6vw,2.7rem)] leading-[1.12] text-charcoal"
                >
                  {(name.titleLines ?? []).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
              </Reveal>
              <Reveal delay={0.2} y={16}>
                {(name.paragraphs ?? []).map((p, i) => (
                  <p
                    key={i}
                    className={`${i === 0 ? "mt-7" : "mt-4"} max-w-lg text-[13.5px] leading-relaxed text-charcoal/70`}
                  >
                    {p}
                  </p>
                ))}
              </Reveal>
              <Reveal delay={0.3}>
                <p className="mt-8 font-playfair text-[19px] italic leading-snug text-vine">
                  {name.quote}
                </p>
              </Reveal>
            </div>

            {/* ---- rechts: das Seelen-Paar ---- */}
            <SoulCards souls={dict.common?.souls} />
          </div>
        </div>
      </section>

      {/* ================= KAPITEL-KOMPASS (nur Telefone) =================
          Direktes Kind von <main>, damit die Sticky-Leiste bis zum Ende der
          Erzählung haftet — ein Wrapper würde sie auf seine eigene Höhe
          begrenzen. Ab md rendert die Komponente nichts Sichtbares. */}
      <StoryChapterNav chapters={chapters} today={{ ...STORY_TODAY, ...today }} t={t.nav} />

      {/* ================= KAPITEL 01–05: DIE REISE ======================= */}
      {chapters.map((chapter, i) => (
        <StoryChapter key={chapter.id} chapter={chapter} flipped={i % 2 === 1} />
      ))}

      {/* ================= PASSAGGIO: WEITER IN DIE REGIONEN ==============
          Das Bordeaux-Band schließt die Reise der fünf Stationen ab —
          danach klingt die Seite mit dem Zahlen-Kapitel „Heute" aus. */}
      <StoryCta t={t.cta} />

      {/* ================= KAPITEL 06: DIE AUSWAHL ========================
          Warum ein Wein zu Maria Maria kommt — im ruhigen, hellen Kleid
          der Seite. Der Intro-Satz („Nicht eine einzelne Stadt …") steht
          bewusst sichtbar vor den drei Prinzipien — er verhindert, dass
          Düsseldorf als Auswahlkriterium gelesen wird. */}
      <section
        id={STORY_TODAY.id}
        aria-labelledby="story-auswahl"
        className="relative -mb-12 scroll-mt-40 overflow-hidden lg:-mb-16"
      >
        <Aura tint="olive" className="-right-48 top-[10%] h-[30rem] w-[30rem]" />
        <GhostWord className="left-[-2vw] bottom-[-6%] text-[11vw]">selezione</GhostWord>

        <div className="relative mx-auto max-w-content px-6 pb-2 pt-8 lg:px-10 lg:pb-3 lg:pt-10">
          <Reveal className="text-center">
            <p className="flex items-center justify-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-champagne">
              <span className="text-bordeaux/80">{today.label}</span>
            </p>
            <h2
              id="story-auswahl"
              className="mx-auto mt-4 max-w-2xl text-balance font-playfair text-[clamp(1.6rem,3vw,2.35rem)] leading-[1.14] text-charcoal"
            >
              {today.title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[13.5px] leading-relaxed text-charcoal/70">
              {today.intro}
            </p>
          </Reveal>

          <div className="mt-6 lg:mt-8">
            <StoryStats stats={stats} />
          </div>
        </div>
      </section>
    </main>
  );
}
