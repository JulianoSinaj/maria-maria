import { SectionTitle } from "@/components/Deco";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import Atmosphere from "@/components/Atmosphere";
import WineCard from "@/components/WineCard";
import Button from "@/components/ui/Button";
import { byName } from "@/components/data";

/* „Ähnliche Weine entdecken" — drei Empfehlungen aus der Kollektion,
   wie auf der Referenzseite der Kundin. */

/* Zahlwörter, Substantive und Satzbau kommen aus common.winePage — die
   Unterzeile ist Fließtext und muss deshalb in der Sprache der Seite stehen.
   Vorher standen sie als deutsche Konstanten hier, wodurch jede übersetzte
   Weinseite einen deutschen Hauptsatz vor den übersetzten Halbsatz setzte. */

/* Die Unterzeile beschrieb früher fest „Drei Weißweine …" — auf den Rotwein-
   und Rosé-Seiten war das schlicht falsch. Sie wird jetzt aus den tatsächlich
   gezeigten Karten abgeleitet: Sind alle Empfehlungen vom selben Typ, nennt der
   Text ihn („Drei Rotweine aus unserer Kollektion …"); ist die Auswahl gemischt
   (Il Rosso empfiehlt zwei Rote und einen Rosé), bleibt sie beim neutralen
   „Drei Weine". Der Charakter-Halbsatz kommt aus wine.similar.trait, damit jede
   Seite ihren eigenen Ton behalten kann.

   Der Typ wird über `typeKey` gelesen, nicht über `type`: components/data.js
   führt seit der Umstellung auf Schlüssel nur noch `typeKey` („red"), womit
   die frühere Abfrage ins Leere lief — auch die deutsche Seite sagte deshalb
   „Drei Weine", wo sie „Drei Weißweine" meinte. */
function describe(wines, trait, t) {
  if (!wines.length || !t?.similarLead) return null;
  const types = [...new Set(wines.map((w) => w.typeKey).filter(Boolean))];
  const nouns = t.similarNouns ?? {};
  const noun = (types.length === 1 && nouns[types[0]]) || nouns.all || "";
  const count = t.similarCounts?.[wines.length] ?? String(wines.length);
  const lead = t.similarLead.replace("{count}", count).replace("{noun}", noun);
  return trait ? `${lead}${t.similarJoin ?? ", "}${trait}` : `${lead}.`;
}

export default function SimilarWines({ wine, t }) {
  const wines = wine.similar.names.map((n) => byName(n)).filter(Boolean);
  const description = describe(wines, wine.similar.trait, t);

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
            {t?.allWinesCta}
          </Button>
        </div>
      </div>
    </section>
  );
}
