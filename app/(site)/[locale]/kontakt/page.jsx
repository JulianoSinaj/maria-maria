import SplitText from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/Deco";
import Atmosphere, { Aura } from "@/components/Atmosphere";
import JsonLd from "@/components/seo/JsonLd";
import KontaktHeroPhoto, { KontaktHeroPreload } from "@/components/kontakt/KontaktHeroPhoto";
import HeroActions from "@/components/kontakt/HeroActions";
import IntentGrid from "@/components/kontakt/IntentGrid";
import ProcessSteps from "@/components/kontakt/ProcessSteps";
import BrandBridge from "@/components/kontakt/BrandBridge";
import ContactForm from "@/components/kontakt/ContactForm";
import KontaktFaq from "@/components/kontakt/KontaktFaq";
import { KontaktIntentProvider, FORM_ANCHOR } from "@/components/kontakt/IntentContext";
import { Calendar, Storefront, Heart } from "@/components/kontakt/KontaktIcons";
import { photoSources, KONTAKT_DIR, variantFile } from "@/components/kontakt/kontaktPhotos";
import { kontaktBlurFor } from "@/components/kontakt/kontaktBlur";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, faqNode, ORG_ID } from "@/lib/seo/jsonLd";

/* /kontakt — Relaunch nach dem Kontakt-Handoff vom 18.08.2026 (v2.0).

   Sechs Sektionen in fester Reihenfolge (Handoff §1, §18): Hero 50/50 →
   Intent-Raster 2×2 → Prozess in drei Schritten → fotografische Brand Bridge
   → Lead-Formular (Split-Layout) → FAQ mit Bild → Footer (global). Das
   Formular kommt bewusst ERST nach Intents und Prozess: Wer es erreicht, weiß
   warum er schreibt und was er davon hat (Handoff §2, „Regola UX").

   Farbe: Terrakotta für CTAs, Zahlen, Linien und Icon-Kreise — die Akzent-
   farbe des freigegebenen Mockups (§13); Schrift bleibt Playfair/Montserrat
   aus dem Design-System. Kontaktdaten (E-Mail, Telefon) kommen ausschließlich
   aus lib/site.js — dieselbe Quelle wie Footer, Rechtstexte und JSON-LD.

   Der Intent-Provider verbindet Hero-CTAs, Karten und Formular: Klick →
   sanfter Scroll zu #anfrage → Anliegen sichtbar im Select (Handoff §14). */

/* Titel und Description je Sprache aus dem Wörterbuch; hreflang, Canonical
   und OpenGraph baut pageMetadata() daraus auf. Das OG-Bild ist das Hero-
   Motiv in seiner größten Breite. */
export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  const hero = photoSources("hero");
  return pageMetadata({
    locale: params.locale,
    path: "/kontakt",
    meta: dict.meta.kontakt,
    image: {
      url: `${KONTAKT_DIR}/${variantFile("hero", 1672)}`,
      width: hero.width,
      height: hero.height,
      alt: dict.kontakt?.hero?.imageAlt,
    },
  });
}

/* ContactPage, an die Organisation gebunden: E-Mail (und Telefon, sobald
   bestätigt) stehen im Organisationsknoten des Layouts — nicht ein zweites
   Mal hier, zwei Kontaktangaben unter zwei @ids wären zwei Unternehmen.
   Die FAQ-Knoten beschreiben exakt die sechs Fragen, die im Akkordeon unten
   im initialen HTML stehen — ein Schema, kein doppeltes aus Plugin + Code. */
function KontaktJsonLd({ locale, dict }) {
  const url = absoluteUrl(localePath(locale, "/kontakt"));
  const nav = dict?.common?.nav ?? {};
  const meta = dict.meta.kontakt;
  const localize = (href) => localePath(locale, href);

  const crumbs = breadcrumbNode(
    [
      { label: nav.home || "Home", href: "/" },
      { label: nav.contact || "Kontakt", href: "/kontakt" },
    ],
    { url, localize }
  );

  return (
    <JsonLd
      data={graph(
        {
          ...webPageNode({
            url,
            name: meta.titleAbsolute ?? meta.title,
            description: meta.description,
            locale,
            type: "ContactPage",
            image: {
              url: `${KONTAKT_DIR}/${variantFile("hero", 1672)}`,
              alt: dict.kontakt?.hero?.imageAlt,
            },
            breadcrumbId: crumbs?.["@id"] ?? null,
          }),
          mainEntity: { "@id": ORG_ID },
        },
        crumbs,
        faqNode({ url, items: dict.faq?.kontakt ?? [] })
      )}
    />
  );
}

/* Überschriften-Stil der Sektionen 02–06 — zentriert, serif, eine Zeile
   Beschreibung darunter. Als Funktion statt SectionTitle aus Deco, weil die
   Kontaktseite ohne Eyebrow auskommt (Mockup) und die Zahlen-/Linienakzente
   in Terrakotta statt Champagner trägt. */
function SectionHeading({ id, title, intro, light = false }) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <h2
        id={id}
        className={`text-balance font-playfair text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.12] ${
          light ? "text-ivory" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      <span aria-hidden="true" className="mx-auto mt-5 block h-px w-12 bg-terracotta/70" />
      {intro && (
        <p
          className={`mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed ${
            light ? "text-ivory/70" : "text-charcoal/70"
          }`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

const FAQ_PHOTO = photoSources("faq");

export default async function KontaktPage({ params }) {
  const dict = await getDictionary(params.locale);
  const t = dict.kontakt;
  const faqItems = dict.faq?.kontakt ?? [];
  const faqBlur = kontaktBlurFor("faq");

  return (
    <KontaktIntentProvider>
      <div className="relative">
        <KontaktHeroPreload />
        <KontaktJsonLd locale={params.locale} dict={dict} />

        {/* ============ 01 — HERO (50/50, Copy links, Foto bis zum Rand) ============
            Handoff §1 nennt „hero 50/50", §12 „48/52 circa" — 50/50, weil die
            beiden CTAs auf 1440 px sonst untereinander rutschen (48 % minus
            Container-Einzug lassen ~490 px, die Pillen brauchen ~505). */}
        <section aria-labelledby="kontakt-hero-title" className="relative overflow-hidden pt-20 lg:pt-24">
          <div className="relative grid grid-cols-1 lg:min-h-[min(calc(100svh-6rem),820px)] lg:grid-cols-2">
            {/* ---- Copy ---- */}
            <div className="relative flex items-center px-6 pb-14 pt-10 sm:px-10 lg:py-16 lg:pl-[max(2.5rem,calc((100vw-75rem)/2+2.5rem))] lg:pr-10">
              {/* ein ruhiger warmer Schein hinter dem Text — keine flache Fläche,
                  aber auch kein Farbfeld, das mit dem Foto konkurriert */}
              <Aura tint="terracotta" drift={1} className="-left-40 -top-32 h-[30rem] w-[30rem] opacity-60" />
              <Aura tint="gold" drift={2} className="-bottom-48 left-1/3 h-[28rem] w-[28rem] opacity-60" />

              <div className="relative w-full max-w-[36rem]">
                <Reveal y={14} delay={0.05}>
                  <Eyebrow tone="text-terracotta">{t.hero.eyebrow}</Eyebrow>
                </Reveal>
                <h1
                  id="kontakt-hero-title"
                  className="mt-5 font-playfair text-[clamp(2rem,3vw,2.65rem)] leading-[1.1] text-charcoal"
                >
                  <SplitText text={t.hero.title} className="block" delay={0.12} />
                  <SplitText text={t.hero.titleAccent} className="block italic text-terracotta" delay={0.3} />
                </h1>
                <Reveal delay={0.42} y={14}>
                  <p className="mt-6 max-w-[30rem] text-[15px] leading-relaxed text-charcoal/75">{t.hero.text}</p>
                </Reveal>
                <Reveal delay={0.54} y={12}>
                  <HeroActions copy={t.hero} details={t.details} />
                </Reveal>
              </div>
            </div>

            {/* ---- Foto: edge-to-edge rechts, LCP ---- */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand sm:aspect-[16/9] lg:aspect-auto lg:min-h-[520px]">
              <KontaktHeroPhoto alt={t.hero.imageAlt} />
            </div>
          </div>
        </section>

        {/* ============ 02 — WARUM MÖCHTEN SIE UNS KONTAKTIEREN? (2×2) ============ */}
        <section aria-labelledby="kontakt-intents-title" className="relative overflow-hidden bg-cream">
          <Atmosphere variant="dusk" className="opacity-60" />
          <div className="relative mx-auto max-w-content px-6 py-20 lg:px-10 lg:py-28">
            <SectionHeading id="kontakt-intents-title" title={t.intents.title} intro={t.intents.intro} />
            <IntentGrid copy={t.intents} />
          </div>
        </section>

        {/* ============ 03 — SO EINFACH FINDEN WIR IHREN WEIN (3 Schritte) ============ */}
        <section aria-labelledby="kontakt-process-title" className="relative overflow-hidden">
          <div className="relative mx-auto max-w-content px-6 py-20 lg:px-10 lg:py-28">
            <SectionHeading id="kontakt-process-title" title={t.process.title} />
            <ProcessSteps copy={t.process} />
          </div>
        </section>

        {/* ============ 04 — EMOTIONAL BRAND BRIDGE (full-bleed) ============ */}
        <BrandBridge copy={t.bridge} />

        {/* ============ 05 — LEAD FORM (Split 30/70) ============ */}
        <section
          id={FORM_ANCHOR}
          aria-labelledby="kontakt-form-title"
          className="relative scroll-mt-24 overflow-hidden bg-cream"
        >
          <Atmosphere variant="warm" className="opacity-50" />
          <div className="relative mx-auto grid max-w-content grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-[30fr_70fr] lg:gap-14 lg:px-10 lg:py-28">
            {/* ---- Panel links: H2, Intro, Hinweiskästen, Vertrauenszeile ---- */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Reveal>
                <h2
                  id="kontakt-form-title"
                  className="font-playfair text-[clamp(1.75rem,3vw,2.4rem)] leading-[1.12] text-charcoal"
                >
                  {t.form.title}
                </h2>
                <p className="mt-4 max-w-md text-[14px] leading-relaxed text-charcoal/70">{t.form.intro}</p>

                <ul className="mt-8 space-y-3">
                  {[
                    { key: "event", Icon: Calendar },
                    { key: "trade", Icon: Storefront },
                  ].map(({ key, Icon }) => {
                    const hint = t.form.hints?.[key];
                    if (!hint) return null;
                    return (
                      <li
                        key={key}
                        className="flex items-start gap-3.5 rounded-xl border border-stone/60 bg-sand/70 px-4 py-3.5"
                      >
                        <Icon aria-hidden="true" className="mt-px h-6 w-6 shrink-0 text-terracotta" />
                        <p className="text-[12.5px] leading-snug text-charcoal/75">
                          <span className="font-semibold text-charcoal">{hint.label}</span> {hint.text}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-8 inline-flex items-center gap-2.5 font-playfair text-[15px] italic text-charcoal/75">
                  <Heart aria-hidden="true" className="h-5 w-5 shrink-0 text-terracotta" />
                  {t.form.trust}
                </p>
              </Reveal>
            </div>

            {/* ---- Formular rechts ---- */}
            <Reveal delay={0.1} y={20} className="min-w-0">
              <ContactForm copy={t.form} />
            </Reveal>
          </div>
        </section>

        {/* ============ 06 — HÄUFIGE FRAGEN (Akkordeon + Bild) ============ */}
        <section id="fragen" aria-labelledby="kontakt-faq-title" className="relative scroll-mt-24 overflow-hidden">
          <div className="relative mx-auto max-w-content px-6 py-20 lg:px-10 lg:py-28">
            <SectionHeading id="kontakt-faq-title" title={t.faq.title} />
            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr] lg:gap-14">
              <Reveal delay={0.08} className="min-w-0">
                <KontaktFaq items={faqItems} copy={t.faq} />
              </Reveal>
              {/* Mobile: FAQ zuerst, Bild darunter (Handoff §12) */}
              <Reveal delay={0.16} className="lg:sticky lg:top-32 lg:self-start">
                <figure className="relative aspect-[4/3] overflow-hidden rounded-card bg-sand">
                  {faqBlur && (
                    <img
                      src={faqBlur}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      className="absolute inset-0 h-full w-full scale-[1.04] select-none object-cover blur-xl"
                    />
                  )}
                  <picture>
                    <source type="image/webp" srcSet={FAQ_PHOTO.srcSet} sizes={FAQ_PHOTO.sizes} />
                    <img
                      src={FAQ_PHOTO.fallback}
                      width={FAQ_PHOTO.width}
                      height={FAQ_PHOTO.height}
                      alt={t.faq.imageAlt}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="absolute inset-0 h-full w-full select-none object-cover"
                    />
                  </picture>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>
      </div>
    </KontaktIntentProvider>
  );
}
