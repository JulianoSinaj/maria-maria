import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Bottle from "@/components/Bottle";
import PhotoBlock from "@/components/PhotoBlock";
import ItalyMap from "@/components/ItalyMap";
import { SectionTitle, GrapeRule } from "@/components/Deco";
import { Arrow, Fields } from "@/components/Icons";
import { byName } from "@/components/data";

const REGIONS = [
  {
    name: "Apulien",
    region: "apulien",
    variant: "vineyard",
    img: "/img/region-apulien.jpg",
    label: "Weine aus Apulien",
    link: "Mehr über Apulien",
    desc: "Sonne, Meer und rote Erde. Apulien ist das Herz des Südens – weitläufige Ebenen, alte Reben und warme Brisen vom Ionischen und Adriatischen Meer prägen kraftvolle, fruchtbetonte Weine mit mediterraner Seele.",
    wines: ["Primitivo 14,5", "Primitivo 15,5", "Primitivo Salento IGP", "Rosato Puglia"],
  },
  {
    name: "Kampanien",
    region: "kampanien",
    variant: "vineyard",
    img: "/img/region-kampanien.jpg",
    label: "Weine aus Kampanien",
    link: "Mehr über Kampanien",
    desc: "Zwischen Vulkan und Meer. Die mineralischen Böden rund um den Vesuv schenken Weinen Spannung, Frische und Tiefe. Hier verbinden sich Tradition, Leidenschaft und ein unverwechselbares Terroir zu eleganten Klassikern.",
    wines: ["Greco di Tufo D.O.C.G.", "Falanghina", "Il Rosso – Aglianico", "Il Bianco – Greco Cuvée"],
  },
  {
    name: "Gardasee / Lugana",
    region: "garda",
    variant: "sea",
    img: "/img/region-garda.jpg",
    label: "Weine vom Gardasee",
    link: "Mehr über Lugana",
    desc: "Das milde Klima, die sanften Hügel und die kalkhaltigen Böden am Südufer des Gardasees schaffen Weine von großer Eleganz und Frische. Lugana steht für Mineralität, Feinheit und mediterrane Leichtigkeit.",
    wines: ["Lugana"],
  },
];

export default function RegionenPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Header active="Regionen Italiens" />

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[420px] w-full items-center overflow-hidden md:min-h-[500px] lg:min-h-[580px]">
        <PhotoBlock variant="vineyard" overlay="ivory-left" img="/img/regionen-hero.jpg" imgPos="right" className="absolute inset-0 h-full w-full" />
        <div className="relative mx-auto w-full max-w-content px-6 lg:px-10">
          <div className="max-w-xl py-14">
            <h1 className="font-playfair text-[2.8rem] leading-tight text-charcoal lg:text-[3.6rem]">Regionen Italiens</h1>
            <GrapeRule className="mt-4" />
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-charcoal/80">
              Maria Maria arbeitet mit ausgewählten, familiengeführten Weingütern in Italien zusammen. Jede Region bringt ihren eigenen Charakter, ihre Böden, ihr Klima – und Geschichten hervor, die man schmeckt.
            </p>
          </div>
        </div>
      </section>

      {/* ============ ENTDECKEN SIE UNSERE REGIONEN ============ */}
      <section className="mx-auto max-w-content px-6 py-14 lg:px-10">
        <SectionTitle mark={false}>Entdecken Sie unsere Regionen</SectionTitle>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {REGIONS.map((r) => (
            <div key={r.name}>
              <PhotoBlock variant={r.variant} img={r.img} className="h-44">
                <ItalyMap region={r.region} className="absolute right-3 top-1/2 w-24 -translate-y-1/2 opacity-90" />
              </PhotoBlock>
              <h3 className="mt-5 font-playfair text-[24px] text-charcoal">{r.name}</h3>
              <p className="mt-3 text-[12.5px] leading-relaxed text-charcoal/70">{r.desc}</p>
              <Link href="#" className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-bordeaux hover:underline">
                {r.link} <Arrow className="h-3.5 w-3.5" />
              </Link>

              <p className="mt-6 text-[10.5px] uppercase tracking-[0.14em] text-charcoal/50">{r.label}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex flex-1 gap-3 overflow-x-auto">
                  {r.wines.map((n) => {
                    const w = byName(n);
                    return (
                      <div key={n} className="flex w-[74px] shrink-0 flex-col items-center text-center">
                        <Bottle variant={w.variant} className="h-24" />
                        <p className="mt-2 text-[10px] leading-tight text-charcoal/70">{n}</p>
                      </div>
                    );
                  })}
                </div>
                <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone bg-ivory text-charcoal/70 transition-colors hover:border-champagne hover:text-bordeaux" aria-label="Weitere">
                  <Arrow className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ WARUM REGIONEN + CTA ============ */}
      <section className="mx-auto max-w-content px-6 pb-16 lg:px-10">
        <div className="grid grid-cols-1 items-stretch gap-6 border-t border-stone/60 pt-10 lg:grid-cols-2">
          <div className="flex gap-5">
            <Fields className="h-12 w-12 shrink-0 text-champagne" />
            <div>
              <h3 className="font-playfair text-[20px] text-charcoal">Warum Regionen wichtig sind</h3>
              <p className="mt-3 text-[12.5px] leading-relaxed text-charcoal/70">
                Jede Region Italiens hat ihre eigene Sprache: andere Böden, anderes Klima, andere Rebsorten – und Menschen, die mit Hingabe arbeiten. Wir glauben, dass Herkunft zählt. Sie verleiht unseren Weinen Authentizität, Charakter und Seele.
              </p>
            </div>
          </div>

          <PhotoBlock variant="feast" scene="table" overlay="dark-left" img="/img/stilllife.jpg" className="min-h-[160px]">
            <div className="flex h-full flex-col justify-center p-8">
              <h3 className="font-playfair text-[24px] text-ivory">Weine nach Region entdecken</h3>
              <Link href="/weine" className="mt-5 inline-flex w-fit items-center gap-2 bg-bordeaux px-5 py-3 text-[12.5px] tracking-wide text-ivory transition-colors hover:bg-bordeaux/90">
                Zu unseren Weinen <Arrow className="h-4 w-4" />
              </Link>
            </div>
          </PhotoBlock>
        </div>
      </section>

      <Footer />
    </div>
  );
}
