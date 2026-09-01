import Link from "@/components/i18n/LocaleLink";
import Photo from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/Icons";
import { interviewPath } from "@/components/magazin/interviewRegistry";

/* Die Stimmen-Leiste unter einem Regionenblock — Teaser 2 von zwei.

   Früher stand hier eine zweispaltige Bühne mit einem Portrait über die
   volle Blockhöhe (rund 27rem). Damit bekam ein einzelnes Gespräch auf
   /regionen dasselbe Gewicht wie eine Region selbst, obwohl die Seite von
   Herkunft handelt und nicht von Personen.

   Jetzt trägt das Zitat den Block, und das Portrait kehrt klein zurück:
   ein Rundbild von 6.5rem in der rechten Spalte, das dem Zitat ein Gesicht
   gibt, ohne eine Bildbühne zu eröffnen. Die beiden Wege stehen darunter
   in einer eigenen Fußzeile — abgesetzt durch eine Haarlinie, damit sie
   in voller Größe lesbar bleiben statt in die Spalte gequetscht zu werden.

   Was aus dem Handoff (Seite 7) unverändert gilt:

   1. Der Text setzt beim GEBIET an, nicht bei der Person — eigene Absätze
      aus `teaserRegion`, kein Auszug aus dem Artikel. Der vollständige Text
      wird auf /regionen nicht dupliziert.
   2. Zwei CTAs, zwei Ziele: „Das Gespräch lesen" öffnet den Artikel,
      „Lugana entdecken" führt auf die Weinseite. Beide auf dasselbe Ziel zu
      legen ist ausdrücklich untersagt — der Block hätte dann zwei Knöpfe
      und nur einen Zweck. Die data-Attribute bleiben, GA4 misst weiter
      dieselben Wege.
   3. Der Block ist NICHT als Ganzes klickbar: bei zwei gleichwertigen
      Zielen wäre unklar, wohin ein Klick daneben führt.

   Der Block steht unmittelbar unter dem Gardasee-Block und vor dem
   Terroir-Manifest; die Gardasee-FAQ folgt weiter unten auf derselben
   Seite, genau in der vom Handoff verlangten Reihenfolge.

   Er soll dabei als FORTSETZUNG des Gardasee-Blocks gelesen werden, nicht
   als eigene Station: daher der knappe Abstand nach oben (`mt-6`) und die
   kurze Verbindungslinie, die ab lg vom Regionentext in die Karte führt. */

/* Eigenes Teaserbild statt `interview.portrait`. Das Artikelbild zeigt
   Daniele in Ganzfigur samt Hund; in einer 18rem breiten Hochformat-Spalte
   wird er darin winzig. Gebraucht wird ein nahes Motiv, in dem Gesicht und
   Glas die Fläche tragen.

   Die Zuordnung stand bis zum zweiten Gespräch als Konstante hier — mit
   der Folge, dass JEDER Regionenblock Danieles Gesicht getragen hätte,
   auch der kampanische. Sie gehört deshalb ins Wörterbuch, direkt neben
   die übrigen Felder des Teasers (`teaserRegion.portrait`). Fehlt sie,
   fällt der Block still auf das Artikelbild zurück; fehlt auch das,
   bleibt die Bildspalte weg statt einen leeren Rahmen zu zeigen. */

export default function InterviewTeaser({ interview, wineHref = "/unsere-weine/lugana" }) {
  const t = interview?.teaserRegion;
  if (!t) return null;

  const role = interview.profile?.role;
  const teaserPortrait = t.portrait?.src ?? interview.portrait?.src ?? null;

  return (
    <Reveal y={22} className="relative mt-6 lg:mt-7">
      {/* Verbindungslinie nach oben in den Lugana-Block */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-7 left-10 hidden h-7 w-px bg-gradient-to-b from-transparent to-champagne lg:block"
      />

      <aside className="group/teaser relative overflow-hidden rounded-card-lg border border-champagne/45 bg-gradient-to-br from-white/85 via-cream/55 to-champagne/[0.13]">
        {/* Bordeaux-Kante links: markiert die Leiste als eingeschobene
            Stimme, ohne ihr eine eigene Bühne zu geben. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-bordeaux/70 via-bordeaux/40 to-transparent"
        />

        {/* Feste Bildspalte rechts, der Text nimmt den Rest. Seit die
            CTAs in der Textspalte stehen, füllt sie die Bildhöhe fast
            selbst aus; `items-stretch` plus `justify-center` fängt den
            Rest ab, damit keine Spalte oben klebt. */}
        <div className="relative flex flex-col gap-7 px-7 py-6 sm:px-9 sm:py-7 lg:flex-row lg:items-center lg:gap-12 lg:px-10 lg:py-7">
          {/* ---- Die Stimme ---- */}
          <div className="flex flex-col lg:min-w-0 lg:flex-1 lg:justify-center">
            {/* Die Rubrikzeile („Stimmen aus der Region · Lugana DOC")
                steht bewusst nicht mehr über dem Titel: der Block sitzt
                bereits im Gardasee-Abschnitt, die Herkunft ist damit
                gesetzt. `t.eyebrow` bleibt im Wörterbuch — die
                Magazin-Karte nutzt dieselbe Zeile weiter.

                H3, nicht H2: Der Block liegt innerhalb des Regionen-
                Artikels, dessen H2 die Region selbst trägt. Eine zweite
                H2 risse die Gliederung der Seite auseinander. */}
            <h3 className="text-balance font-playfair text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.16] text-charcoal">
              {t.title}
            </h3>

            {/* Das Zitat trägt den Block — es ersetzt das Portrait als
                Grund, stehenzubleiben. */}
            {t.pull && (
              <figure className="mt-4 border-l-2 border-champagne pl-5 sm:pl-6">
                <blockquote className="font-playfair text-[clamp(1.05rem,1.8vw,1.3rem)] italic leading-snug text-bordeaux">
                  {`„${t.pull}“`}
                </blockquote>
                <figcaption className="mt-2.5 text-[12px] tracking-wide text-charcoal/60">
                  {role ? `${interview.name}, ${role}` : interview.name}
                </figcaption>
              </figure>
            )}

            <div className="mt-4 space-y-3">
              {(t.paragraphs ?? []).map((text, i) => (
                <p key={i} className="max-w-[58ch] text-[14.5px] leading-relaxed text-charcoal/75">
                  {text}
                </p>
              ))}
            </div>

            {/* ---- Die beiden Wege ----
                Direkt unter der letzten Textzeile statt in einer eigenen
                Fußzeile: die Leerfläche, die neben dem Bild ohnehin
                entstand, trägt jetzt die Knöpfe — der Block wird dadurch
                spürbar flacher, ohne dass die CTAs an Größe verlieren. */}
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link
                href={interviewPath(interview.slug)}
                data-interview-source="regionen"
                className="group inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-gradient-to-br from-bordeaux to-wine px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-ivory transition-shadow duration-300 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux"
              >
                {t.ctaPrimary}
                <Arrow
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                />
              </Link>

              {/* Sekundär und bewusst anders gebaut: ein Textlink führt auf
                  die Weinseite, nicht ein zweiter gefüllter Knopf. */}
              <Link
                href={wineHref}
                data-interview-cta="wine"
                className="group inline-flex min-h-[48px] items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal/70 transition-colors duration-300 hover:text-bordeaux"
              >
                {t.ctaSecondary}
                <Arrow
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* ---- Das Bild zur Stimme ----
              Feste Spaltenbreite (13.5rem) im Hochformat, bewusst NICHT
              `interview.portrait`: das Artikelbild ist eine Ganzkörper-
              Aufnahme, in der Daniele im Hochformat winzig wird. Hier
              steht ein nahes Portrait — Gesicht und Glas füllen das Bild
              und geben dem Zitat einen erkennbaren Absender. Das
              Artikelbild und die Magazin-Karte bleiben unberührt.

              `order-first` auf Mobil: dort stapelt sich alles unter-
              einander, und da die CTAs in der Textspalte sitzen, stünde
              das Bild sonst HINTER den Knöpfen — der Block endete mit
              einem Nachklapp. Oben gesetzt führt es in den Text und die
              Knöpfe schließen ab. Ab lg gilt wieder Text links, Bild
              rechts. */}
          <div className="order-first w-full max-w-[13rem] shrink-0 lg:order-none lg:w-[13.5rem] lg:max-w-none">
            {teaserPortrait && (
              <div
                aria-hidden="true"
                className="relative aspect-[4/5] overflow-hidden rounded-card border border-champagne/60 bg-cream shadow-luxe"
              >
                <Photo
                  src={teaserPortrait}
                  alt=""
                  sizes="(min-width: 1024px) 216px, 100vw"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover/teaser:scale-[1.04] motion-reduce:transition-none"
                />
                {/* Zarter Fuß-Verlauf, damit das Bild unten in die Karte
                    übergeht statt hart abzuschneiden. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream/70 to-transparent"
                />
              </div>
            )}
          </div>
        </div>

      </aside>
    </Reveal>
  );
}
