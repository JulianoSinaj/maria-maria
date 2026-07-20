import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Bottle from "@/components/Bottle";
import PhotoBlock from "@/components/PhotoBlock";
import ItalyMap from "@/components/ItalyMap";
import { SectionTitle, GrapeRule } from "@/components/Deco";
import { Arrow as Ar, Vineyard, Barrel, Glasses } from "@/components/Icons";
import { WINES } from "@/components/data";

const MOMENT = [
  {
    icon: <Vineyard className="h-10 w-10 text-champagne" />,
    title: "Ausgewählte Weingüter",
    text: "Wir arbeiten mit kleinen, familiengeführten Weingütern in Italien zusammen – Menschen, die ihre Heimat, ihre Reben und ihre Handwerkskunst mit Leidenschaft pflegen.",
  },
  {
    icon: <Barrel className="h-10 w-10 text-champagne" />,
    title: "Limitierte Produktion",
    text: "Unsere Weine entstehen in begrenzten Mengen und spiegeln das Terroir und die Persönlichkeit ihrer Herkunft unverfälscht wider – echt, charakterstark, besonders.",
  },
  {
    icon: <Glasses className="h-10 w-10 text-champagne" />,
    title: "Gemeinsam genießen",
    text: "Ein Maria-Moment ist kein Anlass, sondern eine Entscheidung: den Augenblick zu wählen, den Wein zu öffnen und bewusst miteinander zu sein.",
  },
];

const REGIONS = [
  { name: "Apulien", desc: "Die Sonne des Südens und kraftvolle Aromen.", variant: "vineyard", region: "apulien", img: "/img/region-apulien.jpg" },
  { name: "Kampanien", desc: "Vulkanische Böden, ursprüngliche Charaktere.", variant: "vineyard", region: "kampanien", img: "/img/region-kampanien.jpg" },
  { name: "Gardasee / Lugana", desc: "Eleganz, Frische und mineralische Tiefe.", variant: "sea", region: "garda", img: "/img/region-garda.jpg" },
];

const MAGAZINE = [
  { cat: "Food Pairing", title: "Was passt zu Primitivo?", variant: "feast", scene: "table", img: "/img/food.jpg" },
  { cat: "Herkunft", title: "Apulien – Das Herz des Südens", variant: "vineyard", scene: "vines", img: "/img/vineyard.jpg" },
  { cat: "Weinwissen", title: "Rebsorten verstehen, Wein bewusster genießen.", variant: "terracotta", scene: "still", img: "/img/stilllife.jpg" },
];

function RoundBtn({ children }) {
  return (
    <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone bg-ivory text-charcoal/70 transition-colors hover:border-champagne hover:text-bordeaux">
      {children}
    </button>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Header active="Home" />

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[420px] w-full items-center overflow-hidden border-b border-stone/60 md:min-h-[500px] lg:min-h-[580px]">
        <PhotoBlock variant="sunset" overlay="ivory-left" img="/img/hero.jpg" imgPos="right center" className="absolute inset-0 h-full w-full" />
        <div className="relative mx-auto w-full max-w-content px-6 lg:px-10">
          <div className="max-w-xl py-14">
            <h1 className="font-playfair text-[2.7rem] leading-[1.12] text-charcoal lg:text-[3.5rem]">
              Maria Maria –<br />Il piacere del vino
            </h1>
            <GrapeRule className="mt-4" />
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-charcoal/80">
              Italienische Boutique-Weine für bewusst gewählte Genussmomente.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/weine" className="inline-flex items-center gap-2 bg-bordeaux px-6 py-3 text-[13px] tracking-wide text-ivory transition-colors hover:bg-bordeaux/90">
                Unsere Weine entdecken
              </Link>
              <a href="#" className="inline-flex items-center gap-2 border border-charcoal/25 bg-ivory/60 px-6 py-3 text-[13px] tracking-wide text-charcoal transition-colors hover:border-champagne">
                Zum offiziellen Shop <Ar className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DER MARIA-MOMENT ============ */}
      <section className="mx-auto max-w-content px-6 py-16 lg:px-10">
        <SectionTitle>Der Maria-Moment</SectionTitle>
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
          {MOMENT.map((m, i) => (
            <div key={m.title} className={i > 0 ? "md:border-l md:border-stone/70 md:pl-10" : ""}>
              {m.icon}
              <h3 className="mt-4 text-[14px] font-semibold tracking-wide text-charcoal">{m.title}</h3>
              <p className="mt-3 text-[12.5px] leading-relaxed text-charcoal/70">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ UNSERE WEINE (carousel) ============ */}
      <section className="mx-auto max-w-content px-6 pb-4 lg:px-10">
        <div className="border border-stone/60 bg-white/30 px-6 py-8 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="font-playfair text-[22px] text-charcoal">Unsere Weine</h2>
            <Link href="/weine" className="inline-flex items-center gap-1.5 text-[12px] text-champagne hover:text-bordeaux">
              Alle Weine ansehen <Ar className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <RoundBtn><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg></RoundBtn>
            <div className="flex flex-1 justify-between gap-2 overflow-x-auto pb-1">
              {WINES.map((w) => (
                <div key={w.name} className="flex w-[11%] min-w-[92px] flex-col items-center text-center">
                  <Bottle variant={w.variant} className="h-28" />
                  <p className={`mt-3 text-[11px] leading-tight ${w.name === "Primitivo Salento IGP" ? "font-semibold text-charcoal" : "text-charcoal/75"}`}>{w.name}</p>
                </div>
              ))}
            </div>
            <RoundBtn><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg></RoundBtn>
          </div>
        </div>
      </section>

      {/* ============ REGIONEN ITALIENS ENTDECKEN ============ */}
      <section className="mx-auto max-w-content px-6 py-12 lg:px-10">
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-[22px] text-charcoal">Regionen Italiens entdecken</h2>
          <Link href="/regionen" className="inline-flex items-center gap-1.5 text-[12px] text-champagne hover:text-bordeaux">
            Alle Regionen ansehen <Ar className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {REGIONS.map((r) => (
            <PhotoBlock key={r.name} variant={r.variant} overlay="dark-left" img={r.img} className="h-52">
              <ItalyMap region={r.region} className="absolute right-4 top-1/2 w-16 -translate-y-1/2 opacity-80" />
              <div className="flex h-full flex-col justify-end p-5">
                <h3 className="font-playfair text-[22px] text-ivory">{r.name}</h3>
                <p className="mt-1.5 max-w-[70%] text-[12px] leading-snug text-ivory/85">{r.desc}</p>
                <a href="/regionen" className="mt-3 inline-flex w-fit items-center gap-1.5 border border-ivory/40 px-3 py-1.5 text-[11px] tracking-wide text-ivory transition-colors hover:bg-ivory hover:text-charcoal">
                  Mehr entdecken
                </a>
              </div>
            </PhotoBlock>
          ))}
        </div>
      </section>

      {/* ============ WEINWISSEN & GENUSSMOMENTE ============ */}
      <section className="mx-auto max-w-content px-6 pb-16 lg:px-10">
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-[22px] text-charcoal">Weinwissen &amp; Genussmomente</h2>
          <Link href="/magazin" className="inline-flex items-center gap-1.5 text-[12px] text-champagne hover:text-bordeaux">
            Zum Magazin <Ar className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {MAGAZINE.map((a) => (
            <div key={a.title} className="flex overflow-hidden border border-stone/60 bg-white/40">
              <PhotoBlock variant={a.variant} scene={a.scene} img={a.img} className="w-[42%] shrink-0" />
              <div className="flex flex-col p-5">
                <span className="text-[10.5px] uppercase tracking-[0.14em] text-charcoal/50">{a.cat}</span>
                <h3 className="mt-2 font-playfair text-[17px] leading-snug text-charcoal">{a.title}</h3>
                <a href="/magazin" className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[12px] text-champagne hover:text-bordeaux">
                  Mehr lesen <Ar className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
