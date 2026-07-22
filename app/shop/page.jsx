import ShaderGradient from "@/components/motion/ShaderGradient";
import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import Bottle from "@/components/Bottle";
import { SectionTitle, Eyebrow, GrapeRule, IconChip } from "@/components/Deco";
import { Arrow, Check } from "@/components/Icons";
import { Truck, Shield, Package, Gift } from "@/components/shop/ShopIcons";
import { WINES, REGION_COUNT } from "@/components/data";
import { BUNDLES } from "@/components/shop/shopData";
import { CartProvider } from "@/components/shop/CartContext";
import BundleCard from "@/components/shop/BundleCard";
import ShopExplorer from "@/components/shop/ShopExplorer";
import CartDrawer from "@/components/shop/CartDrawer";
import Atmosphere, { Aura, GhostWord, Vines } from "@/components/Atmosphere";
import Link from "next/link";

export const metadata = {
  title: "Shop — Maria Maria",
  description:
    "Der offizielle Maria Maria Online-Shop: Italienische Boutique-Weine und Probierpakete bequem online bestellen – ab 69 € versandkostenfrei, in 1–3 Werktagen bei Ihnen.",
};

const USPS = [
  { icon: <Truck className="h-6 w-6" />, text: "Versand in 1–3 Werktagen" },
  { icon: <Package className="h-6 w-6" />, text: "Bruchsicher & elegant verpackt" },
  { icon: <Shield className="h-6 w-6" />, text: "Sichere Bezahlung" },
  { icon: <Gift className="h-6 w-6" />, text: "Grußkarte auf Wunsch inklusive" },
];

const GIFT_POINTS = [
  "Persönliche Grußkarte mit Ihren Zeilen",
  "Elegante Geschenkverpackung",
  "Versand direkt an den Beschenkten",
];

const SERVICE = [
  {
    icon: <Truck className="h-7 w-7" />,
    title: "Versand & Lieferung",
    text: "Ihre Weine verlassen unser Lager sorgfältig verpackt und erreichen Sie in 1–3 Werktagen – ab 69 € versandkostenfrei.",
    link: "Fragen zum Versand",
    href: "/kontakt",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Sichere Bezahlung",
    text: "Bezahlen Sie bequem und sicher – alle gängigen Zahlungsarten, SSL-verschlüsselt und ohne Umwege.",
    link: "Mehr im FAQ",
    href: "/kontakt",
  },
  {
    icon: <Gift className="h-7 w-7" />,
    title: "Persönliche Beratung",
    text: "Unsicher, welcher Wein passt? Wir beraten Sie persönlich – für Ihren Moment, Ihr Menü oder Ihr Geschenk.",
    link: "Kontakt aufnehmen",
    href: "/kontakt",
  },
];

const HERO_BOTTLES = [
  { variant: "red", cls: "h-44 -mr-4 -rotate-[8deg]" },
  { variant: "white", cls: "z-10 h-56" },
  { variant: "rose", cls: "h-44 -ml-4 rotate-[8deg]" },
];

export default function ShopPage() {
  return (
    <CartProvider>
      <div className="relative min-h-screen">
        {/* ============ HERO ============ */}
        <section className="grain relative overflow-hidden">
          <ShaderGradient palette="dawn" />
          {/* settle into the page colour */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory" />

          <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-14 px-6 pb-24 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-36">
            <div>
              <Reveal y={18} delay={0.05}>
                <Eyebrow>Der offizielle Shop</Eyebrow>
              </Reveal>
              <h1 className="mt-6 font-playfair text-[clamp(2.6rem,5.4vw,4.1rem)] leading-[1.06] text-charcoal">
                <SplitText text="Enoteca Maria Maria" className="block" delay={0.12} />
                <SplitText
                  text="Italien für Zuhause."
                  className="block bg-gradient-to-r from-bordeaux via-wine to-champagne bg-clip-text italic text-transparent"
                  delay={0.3}
                />
              </h1>
              <Reveal delay={0.5} y={16}>
                <GrapeRule className="mt-7" />
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/75">
                  Handverlesene Boutique-Weine kleiner Familienweingüter – sorgfältig verpackt und in
                  wenigen Tagen bei Ihnen. Ab 69 € liefern wir versandkostenfrei.
                </p>
              </Reveal>
              <Reveal delay={0.62} y={16}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Button href="#sortiment" size="lg">
                    Jetzt entdecken
                  </Button>
                  <Button href="#pakete" variant="outline" size="lg">
                    Probierpakete
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={0.78} y={12}>
                <dl className="mt-14 flex max-w-md items-center">
                  {[
                    [`${WINES.length}`, "Boutique-Weine"],
                    [`${REGION_COUNT}`, "Regionen Italiens"],
                    ["1–3", "Werktage Lieferzeit"],
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
                    {HERO_BOTTLES.map((b) => (
                      <Bottle
                        key={b.variant}
                        variant={b.variant}
                        className={`${b.cls} origin-bottom will-transform transition-transform duration-700 ease-out-expo group-hover:-translate-y-2`}
                      />
                    ))}
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
                    <Truck className="h-4 w-4 text-bordeaux" /> Versandkostenfrei ab 69 €
                  </span>
                  <span className="glass absolute right-5 top-24 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70 shadow-glass">
                    <Shield className="h-4 w-4 text-bordeaux" /> Sicher bezahlen
                  </span>
                  <span className="glass absolute bottom-6 left-7 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70 shadow-glass">
                    <Package className="h-4 w-4 text-bordeaux" /> Sorgfältig verpackt
                  </span>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </section>

        {/* ============ USP STRIP ============ */}
        <section className="relative">
          <div className="mx-auto max-w-content px-6 lg:px-10">
            <Stagger className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-stone/40 py-7 lg:grid-cols-4">
              {USPS.map((u) => (
                <StaggerItem key={u.text}>
                  <p className="flex items-center gap-3 text-[11.5px] font-medium uppercase tracking-[0.12em] text-charcoal/70">
                    <span className="text-bordeaux">{u.icon}</span>
                    {u.text}
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
              eyebrow="Probierpakete"
              description="Kuratierte Pakete zum Vorteilspreis – der schönste Weg, Maria Maria kennenzulernen. Das große Paket reist versandkostenfrei."
            >
              Italien im Paket <span className="italic text-bordeaux">entdecken</span>
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
              eyebrow="Das Sortiment"
              description="Neun Charaktere aus vier Regionen – jeder Wein handverlesen, jede Flasche eine Einladung."
            >
              Alle Weine im Shop
            </SectionTitle>
            <div className="mt-12">
              <ShopExplorer />
            </div>
          </div>
        </section>

        {/* ============ GESCHENKMOMENTE ============ */}
        <section className="relative overflow-hidden border-y border-stone/40 bg-gradient-to-b from-cream via-champagne-light/25 to-ivory py-20 lg:py-24">
          <Vines className="inset-x-0 bottom-0 h-72 w-full" />
          <Aura tint="bordeaux" className="-left-56 -top-44 h-[34rem] w-[34rem]" />
          <Aura tint="gold" drift={2} className="-right-48 bottom-0 h-[30rem] w-[30rem]" />
          <GhostWord className="right-[-2vw] bottom-4 text-[11vw]">Un regalo</GhostWord>
          <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-10">
            <Reveal y={24}>
              <div className="group ring-hairline relative overflow-hidden rounded-card-lg shadow-luxe">
                <Parallax speed={0.09} overscan className="aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/gift.jpg"
                    alt="Elegant verpackte Weinflasche als Geschenk mit Grußkarte"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                </Parallax>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent"
                />
                <span className="glass absolute bottom-4 left-4 rounded-full px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                  Geschenkmomente
                </span>
              </div>
            </Reveal>
            <div>
              <Reveal>
                <Eyebrow>Verschenken</Eyebrow>
                <h2 className="mt-4 text-balance font-playfair text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.12] text-charcoal">
                  Wein sagt mehr als <span className="italic text-bordeaux">tausend Worte</span>
                </h2>
                <p className="mt-5 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                  Ob Dankeschön, Einladung oder besonderer Anlass – eine Flasche Maria Maria ist ein
                  Geschenk mit Herkunft und Geschichte. Wir kümmern uns um den Rest.
                </p>
              </Reveal>
              <Stagger className="mt-7 space-y-3.5" gap={0.08}>
                {GIFT_POINTS.map((g) => (
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
                    Paket verschenken
                  </Button>
                  <Button href="/kontakt" variant="outline" size="md">
                    Persönlich beraten lassen
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
              eyebrow="Gut zu wissen"
              description="Bestellen ohne offene Fragen – Versand, Bezahlung und Beratung auf einen Blick."
            >
              Sorglos bestellen
            </SectionTitle>
            <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {SERVICE.map((s) => (
                <StaggerItem key={s.title} className="h-full">
                  <div className="ring-hairline flex h-full flex-col rounded-card-lg border border-stone/40 bg-white/70 p-8 shadow-luxe transition-[box-shadow,border-color] duration-500 hover:border-champagne/60 hover:shadow-lift">
                    <IconChip>{s.icon}</IconChip>
                    <h3 className="mt-6 font-playfair text-[19px] text-charcoal">{s.title}</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">{s.text}</p>
                    <div className="mt-auto pt-6">
                      <Link
                        href={s.href}
                        className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-bordeaux"
                      >
                        {s.link}
                        <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ============ CROSS-LINK CTA (shader band) ============ */}
        <section className="px-4 pb-6 lg:px-8">
          <div className="grain relative overflow-hidden rounded-card-lg">
            <ShaderGradient palette="wine" />
            <div className="relative mx-auto max-w-3xl px-6 py-24 text-center lg:py-28">
              <Reveal>
                <Eyebrow light className="justify-center">
                  Noch unentschlossen?
                </Eyebrow>
                <h2 className="mt-4 text-balance font-playfair text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.1] text-ivory">
                  Jeder Wein erzählt <span className="italic text-champagne">eine Geschichte</span>
                </h2>
                <p className="mx-auto mt-5 max-w-md text-[13.5px] leading-relaxed text-ivory/70">
                  Lernen Sie die Weingüter, Rebsorten und Regionen hinter unserem Sortiment kennen –
                  und kehren Sie mit Ihrem Favoriten zurück.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                  <Button href="/weine" variant="light" size="lg">
                    Unsere Weine
                  </Button>
                  <Button href="/regionen" variant="glass" size="lg">
                    Regionen entdecken
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* cart drawer + floating pill */}
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
