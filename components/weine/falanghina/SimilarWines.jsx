import { SectionTitle } from "@/components/Deco";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import Atmosphere from "@/components/Atmosphere";
import WineCard from "@/components/WineCard";
import Button from "@/components/ui/Button";
import { byName } from "@/components/data";

/* „Ähnliche Weine entdecken" — drei Empfehlungen aus der Kollektion,
   wie auf der Referenzseite der Kundin. */

/* Zahlwörter statt Ziffern — die Unterzeile ist Fließtext, kein Datenfeld. */
const COUNT_WORD = ["Keine", "Ein", "Zwei", "Drei", "Vier", "Fünf", "Sechs"];

/* Plural der Katalog-Typen aus components/data.js („Rotwein" → „Rotweine"). */
const PLURAL = {
  Rotwein: "Rotweine",
  Weißwein: "Weißweine",
  Roséwein: "Roséweine",
};

/* Die Unterzeile beschrieb früher fest „Drei Weißweine …" — auf den Rotwein-
   und Rosé-Seiten war das schlicht falsch. Sie wird jetzt aus den tatsächlich
   gezeigten Karten abgeleitet: Sind alle Empfehlungen vom selben Typ, nennt der
   Text ihn („Drei Rotweine aus unserer Kollektion …"); ist die Auswahl gemischt
   (Il Rosso empfiehlt zwei Rote und einen Rosé), bleibt sie beim neutralen
   „Drei Weine". Der Charakter-Halbsatz kommt aus wine.similar.trait, damit jede
   Seite ihren eigenen Ton behalten kann. */
function describe(wines, trait) {
  if (!wines.length) return null;
  const types = [...new Set(wines.map((w) => w.type).filter(Boolean))];
  const noun =
    types.length === 1 && PLURAL[types[0]] ? PLURAL[types[0]] : "Weine";
  const count = COUNT_WORD[wines.length] ?? String(wines.length);
  const lead = `${count} ${noun} aus unserer Kollektion`;
  return trait ? `${lead}, ${trait}` : `${lead}.`;
}

export default function SimilarWines({ wine }) {
  const wines = wine.similar.names.map((n) => byName(n)).filter(Boolean);
  const description = describe(wines, wine.similar.trait);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <Atmosphere variant="rose" />
      <div className="relative mx-auto max-w-content px-6 lg:px-10">
        <SectionTitle
          eyebrow={wine.similar.kicker}
          description={description}
        >
          {wine.similar.title ?? (
            <>
              Wenn Ihnen die{" "}
              <span className="italic text-bordeaux">{wine.catalogName}</span> gefällt
            </>
          )}
        </SectionTitle>

        {/* Schwebende Einträge statt Karten — keine Trennlinien: alle drei
            Empfehlungen stehen gleichwertig nebeneinander, der Weißraum der
            Spalten trennt genug. Der Abstand zur Überschrift bleibt knapp,
            damit Flasche und Text zum Titel gehören. */}
        <Stagger className="mt-4 grid gap-x-8 gap-y-12 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12" gap={0.09}>
          {wines.map((w) => (
            <StaggerItem key={w.name} className="h-full">
              <WineCard wine={w} className="h-full" />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12 flex justify-center">
          <Button href="/unsere-weine" variant="outline">
            Alle Weine ansehen
          </Button>
        </div>
      </div>
    </section>
  );
}
