import Link from "next/link";
import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { SectionTitle, Eyebrow, GoldRule, GrapeRule } from "@/components/Deco";
import { Arrow, Clock, GrapeVine, Plate, Mountains, Book, Sun } from "@/components/Icons";
import FilterPanel from "@/components/magazin/FilterPanel";
import NewsletterCard from "@/components/magazin/NewsletterCard";
import { Aura, GhostWord } from "@/components/Atmosphere";

export const metadata = {
  title: "Magazin — Maria Maria",
  description:
    "Weinwissen, Food Pairing, Regionen und Geschichten aus der Welt von Maria Maria — Inspiration für den nächsten Genussmoment.",
};

const FEATURED = {
  cat: "Geschichten",
  title: "Der Maria-Moment zuhause",
  min: "5 Min. Lesedauer",
  excerpt: "Warum die besonderen Momente oft ganz einfach sind – und wie Wein sie noch schöner macht.",
  img: "/img/stilllife.jpg",
};

const THEMES = [
  { cat: "Weinwissen", sub: "Wissen vertiefen", icon: GrapeVine, img: "/img/tasting.jpg" },
  { cat: "Food Pairing", sub: "Perfekt kombiniert", icon: Plate, img: "/img/food.jpg" },
  { cat: "Regionen", sub: "Italien entdecken", icon: Mountains, img: "/img/vineyard.jpg" },
  { cat: "Geschichten", sub: "Hinter den Kulissen", icon: Book, img: "/img/stilllife.jpg" },
  { cat: "Genussmomente", sub: "Inspiration genießen", icon: Sun, img: "/img/dinner.jpg" },
];

const LATEST = [
  {
    cat: "Weinwissen",
    title: "Was passt zu Primitivo?",
    min: "4 Min. Lesedauer",
    excerpt: "Tipps für harmonische Kombinationen mit Aromen, die begeistern.",
    img: "/img/food.jpg",
  },
  {
    cat: "Food Pairing",
    title: "Lugana und Fisch – eine elegante Kombination",
    min: "4 Min. Lesedauer",
    excerpt: "Frische, Mineralität und feine Aromen im perfekten Zusammenspiel.",
    img: "/img/aperitivo.jpg",
  },
  {
    cat: "Regionen",
    title: "Apulien: Sonne, Reben, Charakter",
    min: "6 Min. Lesedauer",
    excerpt: "Eine Reise in das Herz Süditaliens und seine unverwechselbaren Weine.",
    img: "/img/region-apulien.jpg",
  },
  {
    cat: "Geschichten",
    title: "Der Maria-Moment zuhause",
    min: "5 Min. Lesedauer",
    excerpt: "Warum die besonderen Momente oft ganz einfach sind – und wie Wein sie noch schöner macht.",
    img: "/img/stilllife.jpg",
  },
  {
    cat: "Genussmomente",
    title: "Sommerabend auf Italienisch",
    min: "3 Min. Lesedauer",
    excerpt: "Leichte Gerichte, gute Gespräche und der richtige Wein dazu.",
    img: "/img/dinner.jpg",
  },
];

const KATEGORIE = ["Alle Themen", "Weinwissen", "Food Pairing", "Regionen", "Geschichten", "Genussmomente"];
const LESEDAUER = ["Alle", "1–3 Min.", "4–6 Min.", "7+ Min."];

const TAGS = [
  "Primitivo",
  "Falanghina",
  "Apulien",
  "Food Pairing",
  "Verkostung",
  "Aglianico",
  "Süditalien",
  "Aperitivo",
  "Lugana",
  "Terroir",
];

const POPULAR = [
  { title: "Falanghina entdecken", min: "5 Min. Lesedauer", img: "/img/vineyard.jpg" },
  { title: "Primitivo 101 – Alles über die Rebsorte", min: "6 Min. Lesedauer", img: "/img/region-apulien.jpg" },
  { title: "Die Kunst der Weinverkostung", min: "4 Min. Lesedauer", img: "/img/tasting.jpg" },
  { title: "Wein & Käse – Klassiker neu gedacht", min: "5 Min. Lesedauer", img: "/img/food.jpg" },
];

export default function MagazinPage() {
  return (
    <div className="relative min-h-screen">
      <section className="relative overflow-hidden">
        {/* cream wash settling into the page colour — no big hero on this page */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[30rem] bg-gradient-to-b from-cream via-cream/60 to-transparent"
        />
        {/* faint editorial watermark */}
        <p
          aria-hidden="true"
          className="pointer-events-none absolute right-[-2vw] top-20 hidden select-none whitespace-nowrap font-playfair text-[9vw] italic leading-none text-charcoal/[0.035] xl:block"
        >
          Il piacere del vino
        </p>
        {/* ambient colour fields along the whole page */}
        <Aura tint="gold" className="-left-56 top-24 h-[38rem] w-[38rem]" />
        <Aura tint="blush" drift={2} className="-right-56 top-[26%] h-[34rem] w-[34rem]" />
        <Aura tint="olive" className="-left-48 top-[55%] h-[32rem] w-[32rem]" />
        <Aura tint="terracotta" drift={2} className="-right-48 bottom-[4%] h-[34rem] w-[34rem]" />
        <GhostWord className="left-[-2vw] top-[46%] text-[11vw]">Storie</GhostWord>
        <GhostWord className="right-[-2vw] bottom-[2%] text-[10vw]">Sapori</GhostWord>

        <div className="relative mx-auto max-w-[1440px] px-6 pb-24 pt-32 lg:px-12 lg:pt-36 2xl:px-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_21rem] lg:gap-14 xl:grid-cols-[1fr_23rem]">
            {/* ================= MAIN ================= */}
            <div>
              {/* ---- intro + featured ---- */}
              <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="flex flex-col justify-center">
                  <Reveal y={18} delay={0.05}>
                    <Eyebrow>Geschichten &amp; Weinwissen</Eyebrow>
                  </Reveal>
                  <h1 className="mt-5 font-playfair text-[clamp(2.6rem,5vw,3.8rem)] leading-[1.05] text-charcoal">
                    <SplitText text="Magazin" delay={0.12} />
                  </h1>
                  <Reveal delay={0.38} y={16}>
                    <GrapeRule className="mt-6" />
                    <p className="mt-6 max-w-md text-[14px] leading-relaxed text-charcoal/75">
                      Unser Magazin teilt Wissen über Wein, Inspiration für Genussmomente, kreative Food
                      Pairing-Ideen, spannende Regionen und Geschichten aus der Welt von Maria Maria.
                    </p>
                  </Reveal>
                  <Reveal delay={0.5} y={14}>
                    <Link
                      href="/"
                      className="group mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
                    >
                      Mehr über unsere Philosophie
                      <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                    </Link>
                  </Reveal>
                </div>

                {/* featured article */}
                <Reveal delay={0.2} y={24}>
                  <TiltCard className="group h-full" max={4} radius="rounded-card-lg">
                    <article className="relative h-[400px] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift sm:h-[430px]">
                      <Parallax speed={0.08} overscan className="absolute inset-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={FEATURED.img}
                          alt="Stillleben mit Wein, Gläsern und mediterranen Zutaten"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
                        />
                      </Parallax>
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/35 to-transparent"
                      />
                      <span className="glass absolute left-5 top-5 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                        {FEATURED.cat}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 p-7">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-champagne-light">Im Fokus</p>
                        <h2 className="mt-1.5 font-playfair text-[clamp(1.6rem,2.6vw,2.1rem)] leading-tight text-ivory">
                          {FEATURED.title}
                        </h2>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] text-ivory/70">
                          <Clock className="h-3.5 w-3.5" /> {FEATURED.min}
                        </p>
                        <p className="mt-2.5 max-w-md text-[12.5px] leading-relaxed text-ivory/80">
                          {FEATURED.excerpt}
                        </p>
                        <div className="mt-5">
                          <Button href="#" variant="glass" size="sm" magnetic={false}>
                            Artikel lesen
                          </Button>
                        </div>
                      </div>
                    </article>
                  </TiltCard>
                </Reveal>
              </div>

              {/* ---- Entdecken nach Themen ---- */}
              <section className="mt-20">
                <SectionTitle
                  align="left"
                  eyebrow="Themenwelten"
                  description="Fünf Wege durch unser Magazin – finden Sie Ihre Inspiration."
                >
                  Entdecken nach Themen
                </SectionTitle>
                <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" gap={0.07}>
                  {THEMES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <StaggerItem key={t.cat} className="h-full">
                        <Link href="#" className="group block h-full">
                          <article className="flex h-full flex-col overflow-hidden rounded-card border border-stone/50 bg-white/70 shadow-luxe transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-champagne/60 hover:shadow-lift">
                            <div className="relative h-24 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={t.img}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.08]"
                              />
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-t from-espresso/25 to-transparent"
                              />
                            </div>
                            <div className="flex flex-1 flex-col p-4">
                              <Icon className="h-6 w-6 text-champagne transition-colors duration-300 group-hover:text-bordeaux" />
                              <p className="mt-2.5 text-[9.5px] uppercase tracking-[0.14em] text-charcoal/50">
                                {t.cat}
                              </p>
                              <p className="mt-0.5 text-[12.5px] font-medium text-charcoal transition-colors duration-300 group-hover:text-bordeaux">
                                {t.sub}
                              </p>
                            </div>
                          </article>
                        </Link>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </section>

              {/* ---- Neueste Artikel ---- */}
              <section className="mt-20">
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <SectionTitle
                    align="left"
                    eyebrow="Frisch veröffentlicht"
                    description="Geschichten und Wissen für den nächsten Genussmoment."
                  >
                    Neueste Artikel
                  </SectionTitle>
                  <Reveal delay={0.15}>
                    <Button href="#" variant="outline" size="sm">
                      Alle Artikel anzeigen
                    </Button>
                  </Reveal>
                </div>
                {/* lead story — wide horizontal row for editorial hierarchy */}
                <Stagger className="mt-10 space-y-6">
                  <StaggerItem>
                    <Link href="#" className="group block">
                      <article className="grid grid-cols-1 overflow-hidden rounded-card-lg border border-stone/50 bg-white/70 shadow-luxe transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-champagne/60 hover:shadow-lift sm:grid-cols-[1.05fr_1fr]">
                        <div className="relative h-56 overflow-hidden sm:h-full sm:min-h-[280px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={LATEST[0].img}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
                          />
                          <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                            {LATEST[0].cat}
                          </span>
                        </div>
                        <div className="flex flex-col justify-center p-7 sm:p-9">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-bordeaux/70">Neu im Magazin</p>
                          <h3 className="mt-2 font-playfair text-[clamp(1.5rem,2.4vw,1.9rem)] leading-tight text-charcoal transition-colors duration-300 group-hover:text-bordeaux">
                            {LATEST[0].title}
                          </h3>
                          <p className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-charcoal/50">
                            <Clock className="h-3.5 w-3.5" /> {LATEST[0].min}
                          </p>
                          <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">{LATEST[0].excerpt}</p>
                          <div className="mt-6">
                            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-bordeaux">
                              Artikel lesen
                              <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </StaggerItem>

                  {/* remaining stories — balanced grid */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {LATEST.slice(1).map((a) => (
                      <StaggerItem key={a.title} className="h-full">
                        <Link href="#" className="group block h-full">
                          <article className="flex h-full flex-col overflow-hidden rounded-card border border-stone/50 bg-white/70 shadow-luxe transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-champagne/60 hover:shadow-lift">
                            <div className="relative h-44 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={a.img}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
                              />
                              <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                                {a.cat}
                              </span>
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                              <h3 className="font-playfair text-[19px] leading-snug text-charcoal transition-colors duration-300 group-hover:text-bordeaux">
                                {a.title}
                              </h3>
                              <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-charcoal/50">
                                <Clock className="h-3.5 w-3.5" /> {a.min}
                              </p>
                              <p className="mt-2.5 text-[12.5px] leading-relaxed text-charcoal/65">{a.excerpt}</p>
                              <div className="mt-auto pt-5">
                                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-bordeaux">
                                  Mehr lesen
                                  <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                                </span>
                              </div>
                            </div>
                          </article>
                        </Link>
                      </StaggerItem>
                    ))}
                  </div>
                </Stagger>
              </section>
            </div>

            {/* ================= SIDEBAR ================= */}
            <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
              <Reveal delay={0.1} y={22}>
                <FilterPanel categories={KATEGORIE} durations={LESEDAUER} />
              </Reveal>

              <Reveal delay={0.16} y={22}>
                <NewsletterCard />
              </Reveal>

              {/* popular */}
              <Reveal delay={0.22} y={22}>
                <div className="rounded-card-lg border border-stone/50 bg-white/70 p-6 shadow-luxe">
                  <h2 className="font-playfair text-[19px] text-charcoal">Beliebte Artikel</h2>
                  <GoldRule className="mt-3 w-full" />
                  <div className="mt-5 space-y-5">
                    {POPULAR.map((p) => (
                      <Link key={p.title} href="#" className="group flex items-center gap-3.5">
                        <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.img}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.1]"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[12.5px] font-medium leading-snug text-charcoal transition-colors duration-300 group-hover:text-bordeaux">
                            {p.title}
                          </span>
                          <span className="mt-1 flex items-center gap-1.5 text-[10.5px] text-charcoal/50">
                            <Clock className="h-3 w-3" /> {p.min}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button href="#" variant="outline" size="sm" magnetic={false} className="w-full">
                      Alle Artikel anzeigen
                    </Button>
                  </div>
                </div>
              </Reveal>

              {/* themen / tag cloud — gives the sidebar length & discovery */}
              <Reveal delay={0.28} y={22}>
                <div className="rounded-card-lg border border-stone/50 bg-gradient-to-b from-white/90 to-cream p-6 shadow-luxe">
                  <h2 className="font-playfair text-[19px] text-charcoal">Beliebte Themen</h2>
                  <GoldRule className="mt-3 w-full" />
                  <div className="mt-5 flex flex-wrap gap-2">
                    {TAGS.map((tag) => (
                      <Link
                        key={tag}
                        href="#"
                        className="inline-flex items-center rounded-full border border-stone/70 bg-white/60 px-3.5 py-2 text-[11px] font-medium tracking-[0.04em] text-charcoal/70 transition-colors duration-300 hover:border-champagne hover:bg-white hover:text-bordeaux"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
