import ShaderGradient from "@/components/motion/ShaderGradient";
import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import ShopCtaBand from "@/components/ui/ShopCtaBand";
import Bottle from "@/components/Bottle";
import Photo from "@/components/media/Photo";
import { SectionTitle, Eyebrow, GrapeRule, GoldRule, IconChip } from "@/components/Deco";
import { Arrow, Check, Grapes, Vineyard } from "@/components/Icons";
import { Truck, Shield, Package, Gift, Amphora } from "@/components/shop/ShopIcons";
import { WINES, REGION_COUNT } from "@/components/data";
import { BUNDLES } from "@/components/shop/shopData";
import BundleCard from "@/components/shop/BundleCard";
import ShopExplorer from "@/components/shop/ShopExplorer";
import SoulCards from "@/components/SoulCards";
import FaqSection from "@/components/faq/FaqSection";
import Atmosphere, { Aura, GhostWord, Vines } from "@/components/Atmosphere";
import Link from "@/components/i18n/LocaleLink";
import JsonLd from "@/components/seo/JsonLd";
import { wineHref } from "@/components/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import { graph, siteNodes, webPageNode, itemListNode, breadcrumbNode, faqNode } from "@/lib/seo/jsonLd";

/* Titel und Description je Sprache aus dem Wörterbuch; hreflang,
   Canonical und OpenGraph baut pageMetadata() daraus auf. */
export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "/shop",
    meta: dict.meta.shop,
    image: {
      url: "/img/og/shop.jpg",
      width: 1200,
      height: 630,
      alt: dict.meta.shop.description,
    },
  });
}

/* Der Shop führt dieselben neun Weine wie die Kollektion — deshalb hier
   KEINE zweiten Product-Knoten. Jedes Produkt hat genau eine Adresse, unter
   der es vollständig beschrieben wird (die Landingpage); ein zweiter
   Product-Knoten mit derselben sku unter einer anderen URL macht aus einem
   Wein zwei Produkte und teilt die Signale zwischen beiden auf.

   Der Shop beschreibt sich stattdessen als das, was er ist: eine
   CollectionPage, die auf die neun Produktseiten verteilt. Die Probierpakete
   stehen bewusst nicht in der Liste — sie haben keine eigene Adresse, und
   ein Listeneintrag ohne Ziel-URL ist für Google ein toter Eintrag. */
function ShopJsonLd({ locale, dict, wines }) {
  const url = absoluteUrl(localePath(locale, "/shop"));
  const nav = dict?.common?.nav ?? {};
  const localize = (href) => localePath(locale, href);

  const crumbs = breadcrumbNode(
    [
      { label: nav.home || "Home", href: "/" },
      { label: dict.meta.shop.title, href: "/shop" },
    ],
    { url, localize }
  );

  return (
    <JsonLd
      data={graph(
        siteNodes({ locale, description: dict.meta?.orgDescription }),
        webPageNode({
          url,
          name: dict.meta.shop.title,
          description: dict.meta.shop.description,
          locale,
          type: "CollectionPage",
          breadcrumbId: crumbs?.["@id"] ?? null,
        }),
        itemListNode({
          url,
          name: dict.meta.shop.title,
          items: wines.map((w) => ({ name: w.name, url: localePath(locale, wineHref(w)) })),
        }),
        crumbs,
        /* Die Service-FAQ beantwortet Versand, Zahlung und Rückgabe — genau
           die Fragen, die KI-Antwortmaschinen vor einem Kauf stellen. */
        faqNode({ url, items: dict.faq?.shop ?? [] })
      )}
    />
  );
}

/* Struktur (Icons, Ziele, Reihenfolge) bleibt im Code — der sichtbare Text
   kommt pro Schlüssel aus content/<sprache>/shop.js. */
const USPS = [
  { key: "delivery", icon: <Truck className="h-6 w-6" /> },
  { key: "packaging", icon: <Package className="h-6 w-6" /> },
  { key: "payment", icon: <Shield className="h-6 w-6" /> },
  { key: "card", icon: <Gift className="h-6 w-6" /> },
];

const SERVICE = [
  { key: "shipping", icon: <Truck className="h-7 w-7" />, href: "#fragen" },
  { key: "payment", icon: <Shield className="h-7 w-7" />, href: "#fragen" },
  { key: "advice", icon: <Gift className="h-7 w-7" />, href: "/kontakt" },
];

const CRAFT = [
  { key: "amphora", icon: <Amphora className="h-7 w-7" /> },
  { key: "direct", icon: <Vineyard className="h-7 w-7" /> },
  { key: "limited", icon: <Grapes className="h-7 w-7" /> },
];

const HERO_CHIPS = [
  { key: "chipShipping", icon: Truck },
  { key: "chipPayment", icon: Shield },
  { key: "chipPacking", icon: Package },
];

/* Drei echte Packshots als Hero-Still — Rot, Weiß, Rosé */
const HERO_BOTTLES = [
  { slug: "primitivo-14-5", cls: "h-44 -mr-4 -rotate-[8deg]" },
  { slug: "lugana", cls: "z-10 h-56" },
  { slug: "rosato-puglia", cls: "h-44 -ml-4 rotate-[8deg]" },
];

const heroWine = (slug) => WINES.find((w) => w.slug === slug);

export default async function ShopPage({ params }) {
  const dict = await getDictionary(params.locale);
  const t = dict.shop ?? {};

  return (
      <div className="relative -mb-12 min-h-screen lg:-mb-16">
        <ShopJsonLd locale={params.locale} dict={dict} wines={WINES} />
        {/* ============ HERO ============ */}
        <section className="grain relative overflow-hidden">
          <ShaderGradient palette="dawn" />
          {/* settle into the page colour */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory" />

          <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-14 px-6 pb-24 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-36">
            <div>
              <Reveal y={18} delay={0.05}>
                <Eyebrow>{t.hero?.eyebrow}</Eyebrow>
              </Reveal>
              <h1 className="mt-6 font-playfair text-[clamp(2.6rem,5.4vw,4.1rem)] leading-[1.06] tracking-[-0.015em] text-charcoal">
                <SplitText text="Enoteca Maria Maria" className="block" delay={0.12} />
                <SplitText
                  text="Share the pleasure."
                  className="block italic"
                  /* Gradient muss pro Wort liegen – der äußere Wrapper malt nicht
                     durch die overflow-clip-Spans von SplitText hindurch */
                  wordClassName="bg-gradient-to-r from-bordeaux via-wine to-bordeaux bg-clip-text text-transparent"
                  delay={0.3}
                />
              </h1>
              <Reveal delay={0.5} y={16}>
                <GrapeRule className="mt-6" />
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-charcoal/75">
                  {t.hero?.lede}
                </p>
              </Reveal>
              <Reveal delay={0.62} y={16}>
                {/* CTAs gestapelt – gleiche Breite, eine vertikale Achse mit
                    Eyebrow, Titel und Textblock */}
                <div className="mt-7 flex w-full max-w-[17.5rem] flex-col items-stretch gap-2.5 sm:mt-8">
                  <Button href="#sortiment" size="lg">
                    {t.hero?.ctaDiscover}
                  </Button>
                  <Button href="#pakete" variant="outline" size="lg">
                    {t.hero?.ctaBundles}
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={0.78} y={12}>
                <dl className="mt-9 flex max-w-md items-center sm:mt-11">
                  {[
                    [`${WINES.length}`, t.hero?.statWines],
                    [`${REGION_COUNT}`, t.hero?.statRegions],
                    [t.hero?.statDeliveryValue ?? "1–3", t.hero?.statDelivery],
                  ].map(([num, label], i) => (
                    <div key={label} className={`flex-1 ${i > 0 ? "border-l border-charcoal/10 pl-6" : ""}`}>
                      <dt className="sr-only">{label}</dt>
                      <dd>
                        <span className="font-playfair text-[26px] text-bordeaux">{num}</span>
                        <span className="mt-0.5 block text-[10.5px] uppercase tracking-[0.14em] text-charcoal/55">
                          {label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              {/* Die drei Vertrauens-Chips schweben ab lg an der Flaschenbühne —
                  unterhalb lg existiert die Bühne nicht, und mit ihr verschwanden
                  Versand-, Zahlungs- und Verpackungsversprechen komplett. Hier
                  stehen sie deshalb als kompakte Zeile unter den Statzahlen. */}
              <Reveal delay={0.9} y={10} className="lg:hidden">
                <ul className="mt-7 flex flex-wrap gap-2">
                  {HERO_CHIPS.map(({ key, icon: Icon }) => (
                    <li
                      key={key}
                      className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70 shadow-glass"
                    >
                      <Icon className="h-4 w-4 text-bordeaux" /> {t.hero?.[key]}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* boutique still — 3D stage with floating trust chips */}
            <Reveal delay={0.35} y={26} className="hidden lg:block">
              <TiltCard className="group" max={6} radius="rounded-card-lg">
                <div className="ring-hairline relative h-[440px] overflow-hidden rounded-card-lg bg-gradient-to-b from-white/80 via-cream to-champagne-light/40 shadow-luxe">
                  <Aura tint="gold" className="-right-24 -top-24 h-80 w-80" />
                  <Aura tint="blush" drift={2} className="-bottom-28 -left-24 h-80 w-80" />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 select-none font-playfair text-[6rem] italic leading-none text-bordeaux/[0.06]"
                  >
                    Vino
                  </span>

                  <div
                    className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-14"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute bottom-10 left-1/2 h-24 w-72 -translate-x-1/2 rounded-full opacity-80"
                      style={{ background: "radial-gradient(closest-side, rgba(200,183,122,0.45), transparent 75%)" }}
                    />
                    {HERO_BOTTLES.map((b) => {
                      const w = heroWine(b.slug);
                      return w?.photos ? (
                        <Photo
                          key={b.slug}
                          src={w.photos.front}
                          alt={(dict.common?.ui?.bottleAlt ?? "{name}").replace("{name}", w.name)}
                          draggable={false}
                          sizes="220px"
                          className={`${b.cls} relative w-auto select-none object-contain origin-bottom will-transform transition-transform duration-700 ease-out-expo group-hover:-translate-y-2`}
                        />
                      ) : (
                        <Bottle
                          key={b.slug}
                          variant={w?.variant ?? "red"}
                          className={`${b.cls} origin-bottom will-transform transition-transform duration-700 ease-out-expo group-hover:-translate-y-2`}
                        />
                      );
                    })}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-11 left-1/2 h-2.5 w-60 -translate-x-1/2 rounded-full bg-charcoal/15 blur-[6px]"
                    />
                  </div>
                </div>

                {/* floating trust chips — outside the clipped card so the
                    translateZ pop survives (overflow-hidden flattens 3D) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ transform: "translateZ(55px)" }}
                >
                  <span className="glass absolute left-5 top-6 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70 shadow-glass">
                    <Truck className="h-4 w-4 text-bordeaux" /> {t.hero?.chipShipping}
                  </span>
                  <span className="glass absolute right-5 top-24 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70 shadow-glass">
                    <Shield className="h-4 w-4 text-bordeaux" /> {t.hero?.chipPayment}
                  </span>
                  <span className="glass absolute bottom-6 left-7 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70 shadow-glass">
                    <Package className="h-4 w-4 text-bordeaux" /> {t.hero?.chipPacking}
                  </span>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </section>

        {/* ============ USP STRIP ============ */}
        <section className="relative">
          <div className="mx-auto max-w-content px-6 lg:px-10">
            <Stagger className="grid grid-cols-2 gap-x-6 gap-y-5 py-7 lg:grid-cols-4">
              {USPS.map((u) => (
                <StaggerItem key={u.key}>
                  <p className="flex items-center gap-3 text-[11.5px] font-medium uppercase tracking-[0.12em] text-charcoal/70">
                    <span className="text-bordeaux">{u.icon}</span>
                    {t.usps?.[u.key]}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ============ PROBIERPAKETE ============ */}
        <section id="pakete" className="relative scroll-mt-28 overflow-hidden">
          <Atmosphere variant="warm" />
          <GhostWord className="right-[-3vw] top-8 text-[11vw]">Degustazione</GhostWord>
          <div className="relative mx-auto max-w-content px-6 py-24 lg:px-10">
            <SectionTitle
              eyebrow={t.bundles?.eyebrow}
              description={t.bundles?.description}
            >
              {t.bundles?.title} <span className="italic text-bordeaux">{t.bundles?.titleAccent}</span>
            </SectionTitle>
            <Stagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {BUNDLES.map((b) => (
                <StaggerItem key={b.id} className="h-full">
                  <BundleCard bundle={b} className="h-full" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ============ SORTIMENT ============ */}
        <section id="sortiment" className="relative scroll-mt-28 overflow-hidden">
          <Atmosphere variant="rose" />
          <GhostWord className="left-[-2vw] top-10 text-[12vw]">Enoteca</GhostWord>
          <div className="relative mx-auto max-w-content px-6 pb-24 lg:px-10">
            <SectionTitle
              align="left"
              eyebrow={t.assortment?.eyebrow}
              description={t.assortment?.description}
            >
              {t.assortment?.title} <span className="italic text-bordeaux">{t.assortment?.titleAccent}</span>
            </SectionTitle>
            <div className="mt-12">
              <ShopExplorer />
            </div>
          </div>
        </section>

        {/* ============ LE ORIGINI (Markengeschichte) ============ */}
        <section className="relative overflow-hidden">
          <Atmosphere variant="olive" />
          <GhostWord className="right-[-3vw] top-10 text-[11vw]">Due anime</GhostWord>
          <div className="relative mx-auto max-w-content px-6 pb-24 lg:px-10">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              {/* story */}
              <div>
                <Reveal>
                  <Eyebrow>Le Origini</Eyebrow>
                  <h2 className="mt-4 text-balance font-playfair text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.12] text-charcoal">
                    {t.origins?.title} <span className="italic text-bordeaux">{t.origins?.titleAccent}</span>
                  </h2>
                  {(t.origins?.paragraphs ?? []).map((p, i) => (
                    <p
                      key={i}
                      className={`${i === 0 ? "mt-5" : "mt-4"} max-w-lg text-[13.5px] leading-relaxed text-charcoal/70`}
                    >
                      {p}
                    </p>
                  ))}
                </Reveal>
                <Reveal delay={0.15}>
                  <div className="mt-8 flex items-center gap-3">
                    <GoldRule className="w-12" />
                    <p className="font-playfair text-[19px] italic leading-snug text-vine">
                      {t.origins?.quote}
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* the double soul */}
              <SoulCards souls={dict.common?.souls} />
            </div>

            {/* craft facts */}
            <Stagger className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {CRAFT.map((c) => (
                <StaggerItem key={c.key} className="h-full">
                  <div className="ring-hairline flex h-full flex-col rounded-card-lg border border-stone/40 bg-white/70 p-8 shadow-luxe transition-[box-shadow,border-color] duration-500 hover:border-champagne/60 hover:shadow-lift">
                    <IconChip>{c.icon}</IconChip>
                    <h3 className="mt-6 font-playfair text-[19px] text-charcoal">{t.origins?.craft?.[c.key]?.title}</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">{t.origins?.craft?.[c.key]?.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ============ GESCHENKMOMENTE ============ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cream via-champagne-light/25 to-ivory py-20 lg:py-24">
          <Vines className="inset-x-0 bottom-0 h-72 w-full" />
          <Aura tint="bordeaux" className="-left-56 -top-44 h-[34rem] w-[34rem]" />
          <Aura tint="gold" drift={2} className="-right-48 bottom-0 h-[30rem] w-[30rem]" />
          <GhostWord className="right-[-2vw] bottom-4 text-[11vw]">Un regalo</GhostWord>
          <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-10">
            <Reveal y={24}>
              <div className="group ring-hairline relative overflow-hidden rounded-card-lg shadow-luxe">
                <Parallax speed={0.09} overscan className="aspect-[4/3]">
                  <Photo
                    src="/img/gift.jpg"
                    alt={t.gift?.photoAlt ?? ""}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                </Parallax>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent"
                />
                <span className="glass absolute bottom-4 left-4 rounded-full px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                  {t.gift?.badge}
                </span>
              </div>
            </Reveal>
            <div>
              <Reveal>
                <Eyebrow>{t.gift?.eyebrow}</Eyebrow>
                <h2 className="mt-4 text-balance font-playfair text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.12] text-charcoal">
                  {t.gift?.title} <span className="italic text-bordeaux">{t.gift?.titleAccent}</span>
                </h2>
                <p className="mt-5 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                  {t.gift?.text}
                </p>
              </Reveal>
              <Stagger className="mt-7 space-y-3.5" gap={0.08}>
                {(t.gift?.points ?? []).map((g) => (
                  <StaggerItem key={g}>
                    <p className="flex items-center gap-3 text-[13.5px] text-charcoal/80">
                      <span className="ring-hairline flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cream to-champagne-light/40 text-bordeaux shadow-luxe">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {g}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal delay={0.2}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Button href="#pakete" size="md">
                    {t.gift?.ctaPrimary}
                  </Button>
                  <Button href="/kontakt" variant="outline" size="md">
                    {t.gift?.ctaSecondary}
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ SERVICE ============ */}
        <section className="relative overflow-hidden">
          <Atmosphere variant="dusk" />
          <GhostWord className="left-[-2vw] top-8 text-[12vw]">Servizio</GhostWord>
          <div className="relative mx-auto max-w-content px-6 py-24 lg:px-10">
            <SectionTitle
              align="left"
              eyebrow={t.service?.eyebrow}
              description={t.service?.description}
            >
              {t.service?.title}
            </SectionTitle>
            <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {SERVICE.map((s) => {
                const card = t.service?.cards?.[s.key] ?? {};
                return (
                  <StaggerItem key={s.key} className="h-full">
                    <div className="ring-hairline flex h-full flex-col rounded-card-lg border border-stone/40 bg-white/70 p-8 shadow-luxe transition-[box-shadow,border-color] duration-500 hover:border-champagne/60 hover:shadow-lift">
                      <IconChip>{s.icon}</IconChip>
                      <h3 className="mt-6 font-playfair text-[19px] text-charcoal">{card.title}</h3>
                      <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">{card.text}</p>
                      <div className="mt-auto pt-6">
                        <Link
                          href={s.href}
                          className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-bordeaux"
                        >
                          {card.link}
                          <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* ============ CROSS-LINK CTA (shader band) ============ */}
        <ShopCtaBand
          eyebrow={t.band?.eyebrow}
          title={
            <>
              {t.band?.title} <span className="italic text-champagne">{t.band?.titleAccent}</span>
            </>
          }
          text={t.band?.text}
          primary={{ label: t.band?.primary, href: "/unsere-weine" }}
          secondary={{ label: t.band?.secondary, href: "/regionen" }}
        />

        {/* ============ HÄUFIGE FRAGEN (Service-FAQ) ============ */}
        <div className="relative overflow-hidden bg-gradient-to-b from-cream via-champagne-light/25 to-ivory">
          <Vines className="inset-x-0 bottom-0 h-72 w-full" />
          <Aura tint="gold" drift={2} className="-left-56 -top-44 h-[34rem] w-[34rem]" />
          <FaqSection
            className="relative"
            pageType="shop"
            eyebrow={t.faq?.eyebrow}
            title={
              <>
                {t.faq?.title} <span className="italic text-bordeaux">{t.faq?.titleAccent}</span>
              </>
            }
            description={t.faq?.description}
            items={dict.faq?.shop ?? []}
            footer={{ label: t.faq?.footerLabel, href: "/kontakt" }}
          />
        </div>

      </div>
  );
}
