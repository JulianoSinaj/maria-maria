import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal } from "@/components/motion/Reveal";
import ShopCtaBand from "@/components/ui/ShopCtaBand";
import { SectionTitle, Eyebrow } from "@/components/Deco";
import Photo from "@/components/media/Photo";
import RegionHeroVideo from "@/components/RegionHeroVideo";
import FaqSection from "@/components/faq/FaqSection";
import { REGIONEN_FAQ_GROUPS } from "@/components/faq/faqData";
import Atmosphere, { Aura, GhostWord } from "@/components/Atmosphere";
import TerroirManifest from "@/components/regionen/TerroirManifest";
import RegionCta from "@/components/regionen/RegionCta";

/* SEO-Snippet nach der Regionen-Guide (v1.0, 05.08.2026, Abschnitt 2):
   Title trägt die drei Herkünfte, die Description Rebsorten, Herkunft,
   Geschmack und Food Pairing. Ein einziges H1 („Italiens Weinregionen
   entdecken“) steht im Hero, die Regionen darunter sind H2. */
export const metadata = {
  /* `absolute`, weil der Titel die Marke schon selbst trägt — der Suffix aus
     app/layout.jsx würde sie sonst ein zweites Mal anhängen. */
  title: {
    absolute: "Italienische Weinregionen: Apulien, Kampanien & Lugana | Maria Maria",
  },
  description:
    "Entdecken Sie ausgewählte Weine aus Apulien, Kampanien und dem Lugana-Gebiet am Gardasee – mit Rebsorten, Herkunft, Geschmack und Food-Pairing-Tipps.",
  alternates: { canonical: "/regionen" },
};

/* Regionaltexte nach der Regionen-Guide (v1.0, Abschnitte 3–5). Verbindlich
   darin sind drei Korrekturen, die hier eingearbeitet sind:

   P0 — Kampanien wird nicht mehr pauschal auf die Böden rund um den Vesuv
        zurückgeführt: Greco di Tufo stammt aus Irpinien, die Falanghina ist
        auch im Beneventano stark vertreten.
   P0 — Lugana DOC liegt zwischen Lombardei und Venetien, nicht in einer der
        beiden Regionen allein.
   P1 — Primitivo heißt „eine der prägendsten Rebsorten Apuliens“, nicht
        „autochthone Rebsorte“.
   P1 — Jede CTA führt an ein eigenes Ziel; früher zeigten alle drei auf
        /magazin. `cta.type` unterscheidet in GA4 Wein- von Magazin-Zielen. */
const REGIONS = [
  {
    name: "Apulien",
    tag: "Das Herz des Südens",
    anchor: "apulien",
    region: "apulien",
    img: "/img/regions/apulien.webp",
    alt: "Weinberge auf roter Erde in Apulien im warmen Abendlicht",
    label: "Weine aus Apulien",
    desc: "Sonne, rote Böden und die Nähe zum Meer prägen den Weinbau Apuliens. Besonders Primitivo, eine der prägendsten Rebsorten der Region, steht für reife Frucht, Wärme und einen ausdrucksstarken Charakter. Maria Maria zeigt ausgewählte Weine aus Apulien, die Herkunft und italienische Lebensart genussvoll verbinden.",
    cta: {
      label: "Apuliens Weine entdecken",
      href: "/unsere-weine?region=apulien",
      type: "wine_overview",
    },
  },
  {
    name: "Kampanien",
    tag: "Höhenlagen und Küste",
    anchor: "kampanien",
    region: "kampanien",
    img: "/img/regions/kampanien.webp",
    alt: "Terrassierte Weinberge an der Küste Kampaniens im Abendlicht",
    label: "Weine aus Kampanien",
    desc: "In den Höhenlagen Irpiniens und in weiteren traditionsreichen Anbaugebieten Kampaniens entstehen charaktervolle Weine aus Rebsorten wie Greco, Falanghina und Aglianico. Unterschiedliche Höhenlagen, kalk- und tonhaltige Böden sowie deutliche Temperaturunterschiede verleihen ihnen Frische, Mineralität und aromatische Tiefe.",
    cta: {
      label: "Kampaniens Weißweine entdecken",
      href: "/unsere-weine/greco-di-tufo",
      type: "wine_detail",
    },
  },
  {
    name: "Lugana am Gardasee",
    tag: "Zwischen Lombardei und Venetien",
    /* Anker bleibt „garda“: die Lugana-Weinseite und der Regionen-Explorer
       der Startseite verlinken bereits auf /regionen#garda */
    anchor: "garda",
    region: "garda",
    img: "/img/regions/lugana.webp",
    alt: "Weinberge und sanfte Hügel südlich des Gardasees",
    label: "Lugana am Gardasee",
    desc: "Südlich des Gardasees, zwischen Lombardei und Venetien, liegt das Anbaugebiet Lugana DOC. Die Rebsorte Turbiana und die tonreichen Böden prägen Weißweine mit Frische, feiner Mineralität und elegantem Charakter – ideal für Aperitivo, leichte Küche und besondere Genussmomente.",
    cta: {
      label: "Lugana und seinen Charakter entdecken",
      href: "/unsere-weine/lugana",
      type: "wine_detail",
    },
  },
];

export default function RegionenPage() {
  return (
    <div className="relative min-h-screen">
      {/* ============ HERO ============ */}
      <section className="grain relative overflow-hidden">
        {/* Volle Video-Bühne: das Weinberg-Panorama trägt den Hero.
            speed 0.08 statt 0.1 hält den Overscan-Zoom klein — je weniger
            das Video hochskaliert wird, desto schärfer bleibt es. */}
        <div aria-hidden="true" className="absolute inset-0">
          <Parallax speed={0.08} overscan className="absolute inset-0">
            <RegionHeroVideo
              src="/video/regionen-hero-720.mp4"
              poster="/img/regions/regionen-hero-poster.webp"
              className="h-full w-full object-cover"
            />
          </Parallax>
        </div>

        {/* dunkler Schleier für Lesbarkeit — dichter von links, wo der Text steht */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-espresso/70 via-espresso/30 to-transparent"
        />

        {/* Kino-Vignette: Ränder sacht abdunkeln gibt dem Bild Tiefe und Fassung */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_38%,transparent_55%,rgba(33,21,17,0.38)_100%)]"
        />

        {/* Elfenbein-Hauch oben für die Navigation, unten der weiche Übergang in die Seite */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory/80 via-ivory/30 to-transparent"
        />
        {/* Eased-Scrim statt 3-Stop-Verlauf: viele Zwischenstufen entlang einer
            Smoothstep-Kurve, damit weder Anfangs- noch Endkante sichtbar ist */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(to_bottom,rgba(247,244,239,0)_0%,rgba(247,244,239,0.02)_14%,rgba(247,244,239,0.06)_27%,rgba(247,244,239,0.13)_39%,rgba(247,244,239,0.25)_50%,rgba(247,244,239,0.42)_61%,rgba(247,244,239,0.63)_73%,rgba(247,244,239,0.85)_86%,rgba(247,244,239,1)_100%)]"
        />

        <div className="relative mx-auto flex min-h-[100svh] max-w-content flex-col justify-center px-6 pb-24 pt-32 lg:px-10 lg:pt-36">
          <div className="max-w-2xl">
            <Reveal y={18} delay={0.05}>
              <span className="inline-flex items-center gap-4 text-[10.5px] font-semibold uppercase tracking-[0.3em] text-ivory/90">
                <span aria-hidden="true" className="h-px w-10 bg-champagne" />
                Italienische Weinregionen
              </span>
            </Reveal>
            {/* Einziges H1 der Seite (Guide Abschnitt 2 und 9) */}
            <h1 className="mt-6 font-playfair text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[1.1] text-ivory">
              <SplitText text="Wo Italiens Weine" className="block" delay={0.12} />
              <SplitText text="ihren Charakter finden" className="block" delay={0.28} />
            </h1>
            <Reveal delay={0.45} y={14}>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ivory/80">
                Drei Herkunftsgebiete, unterschiedliche Landschaften und charaktervolle
                Rebsorten: Entdecken Sie, wie Apulien, Kampanien und das Lugana-Gebiet am
                Gardasee den Stil der ausgewählten Maria-Maria-Weine prägen.
              </p>
            </Reveal>
            <Reveal delay={0.6} y={14}>
              <a
                href="#apulien"
                className="group mt-10 inline-flex min-h-[44px] items-center gap-2 text-[14px] text-ivory/90 transition-colors duration-300 hover:text-champagne"
              >
                Den Ursprüngen folgen
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-out-expo group-hover:translate-y-1"
                >
                  ↓
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ REGION SHOWCASES ============ */}
      <section className="relative overflow-hidden">
        <Atmosphere variant="olive" />
        <Aura tint="blush" drift={2} className="-left-56 top-[45%] h-[32rem] w-[32rem]" />
        <Aura tint="terracotta" className="-right-56 top-[70%] h-[34rem] w-[34rem]" />
        <GhostWord className="right-[-3vw] top-10 text-[13vw]">Terroir</GhostWord>
        <GhostWord className="left-[-2vw] top-[62%] text-[11vw]">Vigneti</GhostWord>
        <div className="relative mx-auto max-w-content px-6 py-24 lg:px-10">
        <SectionTitle
          eyebrow="Drei Herkunftsgebiete"
          description="Apulien, Kampanien und Lugana am Gardasee – jede Herkunft mit eigenen Böden, Rebsorten und einem eigenen Stil im Glas."
        >
          Entdecken Sie unsere Regionen
        </SectionTitle>

        <div className="mt-14 lg:mt-20">
          {REGIONS.map((r, i) => {
            const flipped = i % 2 === 1;
            return (
              <article
                key={r.name}
                id={r.anchor}
                className={`scroll-mt-32 ${i > 0 ? "mt-16 pt-16 lg:mt-24 lg:pt-24" : ""}`}
              >
                {/* photo + intro */}
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
                  <Reveal className={flipped ? "lg:order-2" : ""}>
                    <TiltCard className="group h-full" max={4} radius="rounded-card-lg">
                      <div className="relative aspect-[1672/941] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift">
                        {/* Zweispaltig ab lg, darunter volle Breite */}
                        <Photo
                          src={r.img}
                          alt={r.alt}
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-transparent"
                        />
                        {/* Bildunterschrift, bewusst kein <h3>: die Region
                            trägt daneben bereits ihr H2, ein zweites Heading
                            mit demselben Text bräche die Gliederung (Guide,
                            Abschnitt 9). */}
                        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-champagne-light">{r.tag}</p>
                          <p className="mt-1.5 font-playfair text-[clamp(1.5rem,2.6vw,2.1rem)] text-ivory">
                            {r.name}
                          </p>
                        </div>
                      </div>
                    </TiltCard>
                  </Reveal>

                  <Reveal delay={0.12} className={flipped ? "lg:order-1" : ""}>
                    <div>
                      <Eyebrow>{r.label}</Eyebrow>
                    </div>
                    <h2 className="mt-4 font-playfair text-[clamp(1.9rem,3.2vw,2.5rem)] leading-[1.12] text-charcoal">
                      {r.name}
                    </h2>
                    <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-charcoal/70">{r.desc}</p>
                    <RegionCta
                      region={r.name}
                      label={r.cta.label}
                      href={r.cta.href}
                      destinationType={r.cta.type}
                    />
                  </Reveal>
                </div>

                {/* Hier folgt die Interview-Sektion zu dieser Region. */}
              </article>
            );
          })}
        </div>
        </div>
      </section>

      {/* ============ TERROIR-MANIFEST ============
          Steht bewusst vor dem Shop-Band: erst das Argument, warum Herkunft
          zählt — dann der Weg in die Kollektion, danach die Detailfragen. */}
      <TerroirManifest />

      <ShopCtaBand
        eyebrow="Die Kollektion"
        title={
          <>
            Weine nach <span className="italic text-champagne">Region</span> entdecken
          </>
        }
        text="Vom kraftvollen Primitivo aus Apulien bis zum mineralischen Lugana vom Gardasee – finden Sie den Wein, dessen Herkunft Sie schmecken möchten."
        primary={{ label: "Alle Maria-Maria-Weine entdecken", href: "/unsere-weine" }}
        secondary={{ label: "Persönlich Kontakt aufnehmen", href: "/kontakt" }}
      />

      {/* ============ HÄUFIGE FRAGEN (je Region, Index links) ============ */}
      <div className="relative overflow-hidden">
        <Atmosphere variant="warm" className="opacity-70" />
        <GhostWord className="left-[-2vw] bottom-8 text-[11vw]">Origini</GhostWord>
        <FaqSection
          className="relative"
          pageType="regionen"
          eyebrow="Häufige Fragen"
          title={
            <>
              Fragen zur <span className="italic text-bordeaux">Herkunft.</span>
            </>
          }
          description="Wählen Sie eine Region und finden Sie Antworten zu Gebieten, Rebsorten, Geschmack und Food Pairing – als Orientierung für die Wahl des passenden Weins."
          groups={REGIONEN_FAQ_GROUPS}
          footer={{ label: "Food Pairings im Magazin entdecken", href: "/magazin" }}
        />
      </div>
    </div>
  );
}
