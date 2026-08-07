import Button from "@/components/ui/Button";
import { SectionTitle } from "@/components/Deco";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Aura, GhostWord } from "@/components/Atmosphere";
import { WINE_PAGES } from "@/components/weine/wineRegistry";
import { WINES } from "@/components/data";
import { pairingPhotoSrc, pairingSrcSet } from "@/components/weine/pairingPhoto";
import { MAGAZIN_CANTINA_SLUGS } from "./magazinData";
import CantinaCard from "./CantinaCard";

/* „La Cantina" — die Galerie aller Wein-Landingpages als Kartenwand.
   Jede Karte trägt dasselbe Food-Pairing-Foto, das oben auf ihrer
   Landingpage den Hero stellt (Gericht, Flasche und Glas am Fenster —
   Quelle: pairingPhoto.js, dieselbe Pipeline wie HeroPhoto), und führt
   per Klick dorthin. Die Inhalte sind vollständig abgeleitet: Name,
   Region und Farbe aus dem Katalog (components/data.js), die Aromen-Worte
   aus dem jeweiligen wineData-Modul — hier wird nichts doppelt gepflegt.

   Die Wand ist ein gleichförmiges 3×3-Raster: neun Weine, drei Reihen zu
   drei Karten, alle in derselben Breite und Höhe. Keine Karte tritt vor
   eine andere — die Kollektion liest sich als geschlossene Serie, und das
   Auge findet jeden Wein an der Stelle, an der es ihn erwartet.

   Die Karten-Motion (Hebung, Zoom, Konnektor-Linie) lebt in CantinaCard
   und folgt dem Food-Pairing-Card-Guide: dezent, 150–250 ms, kein 3D. */

const COLOR_LABEL = { Rotwein: "Rot", Weißwein: "Weiß", Roséwein: "Rosé" };

const CANTINA_WINES = MAGAZIN_CANTINA_SLUGS.map((slug) => {
  const page = WINE_PAGES[slug];
  const catalog = WINES.find((w) => w.slug === slug);
  const photoSrc = pairingPhotoSrc(slug);
  if (!photoSrc || !catalog) return null;
  return {
    slug,
    name: catalog.name,
    region: catalog.region,
    color: COLOR_LABEL[catalog.type] || catalog.type,
    words: Array.isArray(page?.heroWords) ? page.heroWords.join(" ") : catalog.notes,
    photoSrc,
    photoSrcSet: pairingSrcSet(slug),
  };
}).filter(Boolean);

export default function CantinaSection({ headingId, className = "" }) {
  const regionCount = new Set(CANTINA_WINES.map((w) => w.region)).size;

  return (
    <section aria-labelledby={headingId} className={`relative overflow-hidden ${className}`}>
      <Aura tint="gold" className="-right-56 top-16 h-[36rem] w-[36rem]" />
      <GhostWord className="right-[-2vw] top-[4%] text-[10vw]">Cantina</GhostWord>

      <div className="relative mx-auto max-w-content px-6 pb-16 pt-8 lg:px-10 lg:pt-10">
        <SectionTitle
          align="left"
          eyebrow="La Cantina"
          description="Neun Weine, neun Geschichten — jede Flasche hat ihre eigene Seite mit Herkunft, Geschmack und dem passenden Gericht. Ein Klick auf eine Karte führt direkt dorthin."
          headingId={headingId}
        >
          Was kommt heute <span className="italic text-bordeaux">ins Glas?</span>
        </SectionTitle>

        <Reveal delay={0.12} y={14}>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="glass rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
              {CANTINA_WINES.length} Weine · {regionCount} Regionen
            </span>
            <Button href="/unsere-weine" variant="dark" size="sm">
              Alle Weine entdecken
            </Button>
          </div>
        </Reveal>

        {/* Mobile-Scroll-Reveal aus dem Guide: fade + translateY, gestaffelt.
            Neun Karten in drei Spalten ergeben genau drei volle Reihen; auf
            sm zwei Spalten, mobil eine — die Karten bleiben überall gleich
            groß. */}
        <Stagger className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" gap={0.07}>
          {CANTINA_WINES.map((wine) => (
            <StaggerItem key={wine.slug} y={16} className="h-full">
              <CantinaCard wine={wine} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
