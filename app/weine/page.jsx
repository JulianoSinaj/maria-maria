import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Bottle from "@/components/Bottle";
import PhotoBlock from "@/components/PhotoBlock";
import { SectionTitle, GrapeRule } from "@/components/Deco";
import { Arrow, ChevronDown, Plate, GrapeVine, Book } from "@/components/Icons";
import { WINES } from "@/components/data";

const TABS = ["Alle Weine", "Rotwein", "Weißwein", "Roséwein"];

const MOMENTS = [
  { title: "Aperitivo", text: "Leicht, frisch und bereichernd.", img: "/img/aperitivo.jpg" },
  { title: "Dinner", text: "Elegante Begleiter für besondere Gerichte.", img: "/img/dinner.jpg" },
  { title: "Freunde", text: "Für gute Gespräche und unvergessliche Abende.", img: "/img/dinner.jpg" },
  { title: "Geschenk", text: "Stilvoll schenken – Freude, die bleibt.", img: "/img/gift.jpg" },
];

const HELP = [
  { icon: <Plate className="h-8 w-8 text-champagne" />, title: "Food Pairing", text: "Entdecken Sie passende Speisen zu unseren Weinen – für den perfekten Genussmoment.", link: "Mehr erfahren", href: "/magazin" },
  { icon: <GrapeVine className="h-8 w-8 text-champagne" />, title: "Rebsorten", text: "Lernen Sie die wichtigsten italienischen Rebsorten kennen und ihre Besonderheiten.", link: "Mehr erfahren", href: "/magazin" },
  { icon: <Book className="h-8 w-8 text-champagne" />, title: "FAQ", text: "Häufige Fragen rund um Wein, Bestellung und Versand – kurz beantwortet.", link: "Zu den FAQs", href: "/kontakt" },
];

export default function WeinePage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Header active="Unsere Weine" />

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[420px] w-full items-center overflow-hidden md:min-h-[500px] lg:min-h-[580px]">
        <PhotoBlock variant="sunset" overlay="ivory-left" img="/img/weine-hero.jpg" imgPos="right center" className="absolute inset-0 h-full w-full" />
        <div className="relative mx-auto w-full max-w-content px-6 lg:px-10">
          <div className="max-w-lg py-14">
            <h1 className="font-playfair text-[2.6rem] leading-tight text-charcoal lg:text-[3.2rem]">Unsere Weine</h1>
            <GrapeRule className="mt-4" />
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-charcoal/80">
              Maria Maria steht für handverlesene italienische Boutique-Weine von kleinen Weingütern – ausgewählt für bewusste Momente und echten Genuss.
            </p>
          </div>
        </div>
      </section>

      {/* ============ FILTER BAR ============ */}
      <div className="border-y border-stone/60 bg-ivory">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <div className="flex items-center gap-7 text-[13px] tracking-wide">
            {TABS.map((t, i) =>
              i === 0 ? (
                <button key={t} className="relative font-medium text-bordeaux">
                  {t}<span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-bordeaux" />
                </button>
              ) : (
                <button key={t} className="text-charcoal/70 hover:text-bordeaux">{t}</button>
              )
            )}
          </div>
          <div className="flex items-center gap-6 border-l border-stone/70 pl-6 text-[13px] text-charcoal/70">
            <button className="inline-flex items-center gap-1.5 hover:text-bordeaux">Nach Anlass <ChevronDown className="h-3.5 w-3.5" /></button>
            <button className="inline-flex items-center gap-1.5 hover:text-bordeaux">Nach Region <ChevronDown className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>

      {/* ============ WINE GRID ============ */}
      <section className="mx-auto max-w-content px-6 py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {WINES.map((w) => (
            <div key={w.name} className="flex gap-3 border border-stone/60 bg-white/40 p-4">
              <div className="flex shrink-0 items-center">
                <Bottle variant={w.variant} className="h-32" />
              </div>
              <div className="flex min-w-0 flex-col">
                <h3 className="font-playfair text-[15px] leading-tight text-charcoal">{w.name}</h3>
                <p className="mt-1 text-[11px] font-medium text-champagne">{w.region}</p>
                <p className="mt-2 text-[11.5px] leading-snug text-charcoal/70">{w.notes}</p>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-charcoal/70">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: w.dot }} /> Trocken
                </p>
                <Link href="#" className="mt-3 inline-flex w-fit items-center gap-1.5 border border-stone px-3 py-1.5 text-[11px] tracking-wide text-charcoal transition-colors hover:border-champagne hover:text-bordeaux">
                  Zum Wein <Arrow className="h-3.5 w-3.5 text-champagne" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ WELCHER WEIN PASST ZU IHREM MOMENT ============ */}
      <section className="mx-auto max-w-content px-6 pb-4 lg:px-10">
        <SectionTitle mark={false}>Welcher Wein passt zu Ihrem Moment?</SectionTitle>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MOMENTS.map((m) => (
            <PhotoBlock key={m.title} variant="feast" scene="table" overlay="dark" img={m.img} className="h-40">
              <div className="flex h-full flex-col p-5">
                <h3 className="font-playfair text-[19px] text-ivory">{m.title}</h3>
                <p className="mt-1.5 max-w-[80%] text-[12px] leading-snug text-ivory/80">{m.text}</p>
                <span className="mt-auto flex h-8 w-8 items-center justify-center rounded-full border border-ivory/50 text-ivory">
                  <Arrow className="h-4 w-4" />
                </span>
              </div>
            </PhotoBlock>
          ))}
        </div>
      </section>

      {/* ============ HELP STRIP ============ */}
      <section className="mx-auto max-w-content px-6 py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-8 border border-stone/60 bg-white/30 p-8 md:grid-cols-3">
          {HELP.map((h, i) => (
            <div key={h.title} className={`flex gap-4 ${i > 0 ? "md:border-l md:border-stone/70 md:pl-8" : ""}`}>
              <div className="shrink-0">{h.icon}</div>
              <div>
                <h3 className="text-[13px] font-semibold tracking-wide text-charcoal">{h.title}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-charcoal/70">{h.text}</p>
                <Link href={h.href} className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-bordeaux hover:underline">
                  {h.link} <Arrow className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
