import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhotoBlock from "@/components/PhotoBlock";
import { GoldRule } from "@/components/Deco";
import { Arrow, GrapeVine, Plate, Mountains, Book, Sun, MailCircle } from "@/components/Icons";

const Clock = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);

const THEMES = [
  { cat: "Weinwissen", sub: "Wissen vertiefen", icon: GrapeVine, variant: "feast", scene: "table", img: "/img/tasting.jpg" },
  { cat: "Food Pairing", sub: "Perfekt kombiniert", icon: Plate, variant: "terracotta", scene: "still", img: "/img/food.jpg" },
  { cat: "Regionen", sub: "Italien entdecken", icon: Mountains, variant: "vineyard", scene: "vines", img: "/img/vineyard.jpg" },
  { cat: "Geschichten", sub: "Hinter den Kulissen", icon: Book, variant: "sunset", scene: "hills", img: "/img/stilllife.jpg" },
  { cat: "Genussmomente", sub: "Inspiration genießen", icon: Sun, variant: "feast", scene: "table", img: "/img/dinner.jpg" },
];

const LATEST = [
  { cat: "Weinwissen", title: "Was passt zu Primitivo?", min: "4 Min. Lesedauer", excerpt: "Tipps für harmonische Kombinationen mit Aromen, die begeistern.", variant: "feast", scene: "table", img: "/img/food.jpg" },
  { cat: "Food Pairing", title: "Lugana und Fisch – eine elegante Kombination", min: "4 Min. Lesedauer", excerpt: "Frische, Mineralität und feine Aromen im perfekten Zusammenspiel.", variant: "sea", scene: "lake", img: "/img/aperitivo.jpg" },
  { cat: "Regionen", title: "Apulien: Sonne, Reben, Charakter", min: "6 Min. Lesedauer", excerpt: "Eine Reise in das Herz Süditaliens und seine unverwechselbaren Weine.", variant: "vineyard", scene: "vines", img: "/img/region-apulien.jpg" },
  { cat: "Geschichten", title: "Der Maria-Moment zuhause", min: "5 Min. Lesedauer", excerpt: "Wie kleine Rituale mit einem guten Glas Wein besonders werden.", variant: "feast", scene: "table", img: "/img/stilllife.jpg" },
  { cat: "Genussmomente", title: "Sommerabend auf Italienisch", min: "3 Min. Lesedauer", excerpt: "Leichte Gerichte, gute Gespräche und der richtige Wein dazu.", variant: "terracotta", scene: "still", img: "/img/dinner.jpg" },
];

const KATEGORIE = ["Alle Themen", "Weinwissen", "Food Pairing", "Regionen", "Geschichten", "Genussmomente"];
const LESEDAUER = ["Alle", "1–3 Min.", "4–6 Min.", "7+ Min."];
const POPULAR = [
  { title: "Falanghina entdecken", min: "5 Min. Lesedauer", variant: "vineyard", img: "/img/vineyard.jpg" },
  { title: "Primitivo 101 – Alles über die Rebsorte", min: "6 Min. Lesedauer", variant: "feast", img: "/img/region-apulien.jpg" },
  { title: "Die Kunst der Weinverkostung", min: "4 Min. Lesedauer", variant: "terracotta", img: "/img/tasting.jpg" },
  { title: "Wein & Käse – Klassiker neu gedacht", min: "5 Min. Lesedauer", variant: "feast", img: "/img/food.jpg" },
];

export default function MagazinPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Header active="Magazin" />

      <div className="mx-auto max-w-content px-6 py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_20rem]">
          {/* ================= MAIN ================= */}
          <main>
            {/* intro + featured */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.4fr]">
              <div>
                <h1 className="font-playfair text-[2.6rem] leading-tight text-charcoal lg:text-[3rem]">Magazin</h1>
                <p className="mt-5 text-[13.5px] leading-relaxed text-charcoal/75">
                  Unser Magazin teilt Wissen über Wein, Inspiration für Genussmomente, kreative Food Pairing-Ideen, spannende Regionen und Geschichten aus der Welt von Maria Maria.
                </p>
                <Link href="#" className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] text-bordeaux hover:underline">
                  Mehr über unsere Philosophie <Arrow className="h-3.5 w-3.5" />
                </Link>
              </div>

              <PhotoBlock variant="terracotta" scene="still" overlay="ivory-left" img="/img/stilllife.jpg" imgPos="right" className="min-h-[300px]">
                <div className="flex h-full flex-col justify-center p-7">
                  <span className="text-[10.5px] uppercase tracking-[0.16em] text-charcoal/55">Geschichten</span>
                  <h2 className="mt-2 max-w-[70%] font-playfair text-[26px] leading-tight text-charcoal">Der Maria-Moment zuhause</h2>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-charcoal/60"><Clock className="h-3.5 w-3.5" /> 5 Min. Lesedauer</p>
                  <p className="mt-3 max-w-[62%] text-[12.5px] leading-relaxed text-charcoal/75">
                    Warum die besonderen Momente oft ganz einfach sind – und wie Wein sie noch schöner macht.
                  </p>
                  <Link href="#" className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-bordeaux hover:underline">
                    Artikel lesen <Arrow className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </PhotoBlock>
            </div>

            {/* Entdecken nach Themen */}
            <section className="mt-14">
              <h3 className="font-playfair text-[20px] text-charcoal">Entdecken nach Themen</h3>
              <GoldRule className="mt-3 w-full" />
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {THEMES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <Link key={t.cat} href="#" className="group block overflow-hidden border border-stone/60 bg-white/40">
                      <PhotoBlock variant={t.variant} scene={t.scene} img={t.img} className="h-24" />
                      <div className="p-3">
                        <Icon className="h-6 w-6 text-champagne" />
                        <p className="mt-2 text-[9.5px] uppercase tracking-[0.12em] text-charcoal/55">{t.cat}</p>
                        <p className="text-[12px] text-charcoal group-hover:text-bordeaux">{t.sub}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Neueste Artikel */}
            <section className="mt-12">
              <div className="flex items-center justify-between">
                <h3 className="font-playfair text-[20px] text-charcoal">Neueste Artikel</h3>
                <Link href="#" className="inline-flex items-center gap-1.5 text-[12px] text-champagne hover:text-bordeaux">
                  Alle Artikel anzeigen <Arrow className="h-3.5 w-3.5" />
                </Link>
              </div>
              <GoldRule className="mt-3 w-full" />
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {LATEST.map((a) => (
                  <article key={a.title} className="flex flex-col">
                    <PhotoBlock variant={a.variant} scene={a.scene} img={a.img} className="h-28" />
                    <p className="mt-3 text-[9.5px] uppercase tracking-[0.12em] text-charcoal/55">{a.cat}</p>
                    <h4 className="mt-1 font-playfair text-[14px] leading-snug text-charcoal">{a.title}</h4>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-charcoal/55"><Clock className="h-3 w-3" /> {a.min}</p>
                    <p className="mt-2 text-[11px] leading-snug text-charcoal/65">{a.excerpt}</p>
                  </article>
                ))}
              </div>
            </section>
          </main>

          {/* ================= SIDEBAR ================= */}
          <aside className="lg:pt-1">
            <div className="border border-stone/60 bg-white/40 p-6">
              <h3 className="text-[13px] font-semibold tracking-wide text-charcoal">THEMEN &amp; FILTER</h3>
              <GoldRule className="mt-3 w-full" />

              <p className="mt-5 text-[10.5px] uppercase tracking-[0.14em] text-charcoal/55">Kategorie</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {KATEGORIE.map((k, i) => (
                  <button
                    key={k}
                    className={`px-3 py-1.5 text-[11px] tracking-wide transition-colors ${
                      i === 0 ? "bg-bordeaux text-ivory" : "border border-stone bg-ivory text-charcoal/75 hover:border-champagne"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              <p className="mt-6 text-[10.5px] uppercase tracking-[0.14em] text-charcoal/55">Lesedauer</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {LESEDAUER.map((l) => (
                  <button key={l} className="border border-stone bg-ivory px-3 py-1.5 text-[11px] tracking-wide text-charcoal/75 hover:border-champagne">
                    {l}
                  </button>
                ))}
              </div>

              {/* newsletter */}
              <div className="mt-6 border border-stone/70 p-5 text-center">
                <MailCircle className="mx-auto h-8 w-8 text-champagne" />
                <h4 className="mt-3 font-playfair text-[17px] text-charcoal">Bleiben Sie inspiriert</h4>
                <p className="mt-2 text-[11px] leading-relaxed text-charcoal/65">
                  Erhalten Sie regelmäßig neue Artikel, Weinwissen und exklusive Empfehlungen.
                </p>
                <input className="mt-4 w-full border border-stone bg-ivory px-3 py-2 text-[11.5px] outline-none focus:border-champagne" placeholder="E-Mail-Adresse eingeben" />
                <button className="mt-3 w-full bg-bordeaux px-4 py-2.5 text-[12px] tracking-wide text-ivory transition-colors hover:bg-bordeaux/90">
                  Jetzt anmelden
                </button>
              </div>
            </div>

            {/* popular */}
            <div className="mt-8">
              <h3 className="text-[13px] font-semibold tracking-wide text-charcoal">BELIEBTE ARTIKEL</h3>
              <GoldRule className="mt-3 w-full" />
              <div className="mt-4 space-y-4">
                {POPULAR.map((p) => (
                  <Link key={p.title} href="#" className="group flex items-center gap-3">
                    <PhotoBlock variant={p.variant} img={p.img} className="h-12 w-16 shrink-0" />
                    <div>
                      <p className="text-[12px] font-medium leading-snug text-charcoal group-hover:text-bordeaux">{p.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-charcoal/55"><Clock className="h-2.5 w-2.5" /> {p.min}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="#" className="mt-6 flex items-center justify-center gap-2 border border-stone px-4 py-2.5 text-[12px] tracking-wide text-charcoal transition-colors hover:border-champagne hover:text-bordeaux">
                Alle Artikel anzeigen <Arrow className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
