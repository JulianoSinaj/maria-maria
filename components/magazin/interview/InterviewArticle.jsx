import Photo from "@/components/media/Photo";
import Button from "@/components/ui/Button";
import Parallax from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Aura, GhostWord } from "@/components/Atmosphere";
import InterviewHero from "@/components/magazin/interview/InterviewHero";
import {
  ArrowUpRight,
  Fish,
  Risotto,
  Stockfish,
  Poultry,
  Thermometer,
  Plate,
  Pin,
} from "@/components/Icons";
import { interviewPath } from "@/components/magazin/interviewRegistry";

/* Die Artikelstrecke eines Gesprächs — der kanonische Ort des Textes.

   Der Handoff (Seite 9) verlangt ausdrücklich, dass sich das Stück wie ein
   Artikel verhält und nicht wie eine Produktseite: eine Lesespalte von 65–72
   Zeichen, beschreibende H2, keine Karussells, kein Text in Bildern — und die
   Flasche erst am Schluss. Deshalb liegt das Wein-Band unter dem Fazit und
   nicht im Aufmacher, obwohl es die stärkste Konversion trüge.

   Gliederung: EIN <h1> (Name + Titel), jede Kapitelüberschrift ein <h2>. Die
   Sektion „Lugana am Tisch" und der Servierhinweis sind ebenfalls H2 — sie
   sind Kapitel des Gesprächs, keine Zusatzmodule.

   Die Komponente rendert serverseitig. Bewegung kommt ausschließlich über
   <Reveal>/<Parallax>, die ihre eigene Client-Grenze mitbringen und
   prefers-reduced-motion respektieren.

   Typografie: Die Seite führt seit jeher Playfair Display + Montserrat. Der
   Handoff nennt Cormorant Garamond + Inter (Seite 4) — das wäre ein zweites
   Schriftpaar allein für diese Strecke und ein Bruch mit den 87 übrigen
   Seiten. Bis die Marke sich global umentscheidet, bleibt es beim Bestand;
   Hierarchie, Größenstaffel und Zeilenlängen folgen dagegen dem Handoff. */

const PAIRING_ICONS = { fish: Fish, risotto: Risotto, stockfish: Stockfish, poultry: Poultry };

/* Volle Container-Breite: die Lesespalte fluchtet mit der Kapitelleiste
   des Aufmachers (beide leben im selben max-w-content-Rahmen). */
function Prose({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Paragraphs({ items = [], className = "" }) {
  return items.map((text, i) => (
    <p
      key={i}
      className={`text-[17px] leading-[1.68] text-charcoal/80 lg:text-[18px] ${
        i > 0 ? "mt-5" : ""
      } ${className}`}
    >
      {text}
    </p>
  ));
}

/* Zitat — höchstens zwei im ganzen Stück (Handoff Seite 9). Bewusst ohne
   Anführungszeichen im Text: die setzt die Auszeichnung, damit die Zitate im
   Wörterbuch übersetzbar bleiben, ohne dass jemand Zeichen mitpflegen muss. */
function PullQuote({ children }) {
  return (
    <Reveal y={16}>
      <figure className="my-10 border-l-2 border-bordeaux/40 pl-6 sm:pl-8">
        <blockquote>
          <p className="text-balance font-playfair text-[clamp(1.3rem,2.4vw,1.85rem)] italic leading-[1.3] text-bordeaux">
            <span aria-hidden="true">„</span>
            {children}
            <span aria-hidden="true">“</span>
          </p>
        </blockquote>
      </figure>
    </Reveal>
  );
}

/* Bildstrecke im Fließtext. `caption` steht als echte <figcaption> darunter —
   nie im Bild, damit sie übersetzbar und vorlesbar bleibt.

   Zwei Rahmen-Modi:
   - Ohne `media.aspect`: redaktioneller 16:9-Beschnitt, die Parallaxe treibt
     das Foto INNERHALB des Rahmens (overscan schließt die Drift-Lücken).
   - Mit `media.aspect`: der Rahmen übernimmt die native Ratio des Fotos und
     nichts wird beschnitten. Overscan verbietet sich dann — er zoomt ins
     Bild —, deshalb driftet stattdessen die ganze Karte gegen den Fließtext. */
const NATIVE_ASPECTS = {
  "4/3": "aspect-[4/3]",
};

function SectionMedia({ media, priority = false }) {
  if (!media?.src) return null;
  const nativeAspect = NATIVE_ASPECTS[media.aspect];

  const photo = (
    <Photo
      src={media.src}
      alt={media.alt ?? ""}
      sizes="(min-width: 1200px) 1000px, 100vw"
      loading={priority ? "eager" : "lazy"}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );

  return (
    <Reveal y={20} className="my-12">
      <figure>
        {nativeAspect ? (
          <Parallax speed={0.05}>
            <div className={`relative ${nativeAspect} overflow-hidden rounded-card-lg bg-cream`}>
              {photo}
            </div>
          </Parallax>
        ) : (
          <Parallax
            speed={0.06}
            overscan
            className="relative aspect-[16/9] overflow-hidden rounded-card-lg bg-cream"
          >
            {photo}
          </Parallax>
        )}
        {media.caption && (
          <figcaption className="mt-3 text-center text-[12px] leading-relaxed text-charcoal/55">
            {media.caption}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}

export default function InterviewArticle({ interview, ui = {}, wine = null, headingId = "interview-titel" }) {
  const { portrait = {}, profile = {}, pairing, serving, outro } = interview;

  /* Die Kapitelleiste des Aufmachers. Sie entsteht HIER und nicht im Hero,
     weil dieser Artikel die Kapitel samt IDs rendert — „pairing",
     „servieren" und „fazit" sind unten fest vergeben. So kann die Leiste
     nie auf Anker zeigen, die es auf der Seite nicht gibt. */
  const chapters = [
    ...(interview.sections ?? []).map((s) => ({ id: s.id, heading: s.heading })),
    pairing && { id: "pairing", heading: pairing.heading },
    serving && { id: "servieren", heading: serving.heading },
    outro && { id: "fazit", heading: outro.heading },
  ].filter(Boolean);

  return (
    <article className="relative overflow-hidden">
      <Aura tint="gold" className="-left-56 top-20 h-[36rem] w-[36rem]" />
      <Aura tint="olive" drift={2} className="-right-56 top-[38%] h-[34rem] w-[34rem]" />
      <GhostWord className="left-[-2vw] top-[52%] text-[11vw]">Terroir</GhostWord>

      {/* ================= AUFMACHER =================
          Die gesamte Landing lebt in InterviewHero — Brotkrume, Bühne,
          Kapitelleiste. Alles ab dem Fließtext bleibt die Strecke, die der
          Handoff abgenommen hat. */}
      <InterviewHero interview={interview} ui={ui} chapters={chapters} headingId={headingId} />

      {/* ================= FLIESSTEXT ================= */}
      <div className="relative mx-auto max-w-content px-6 pb-4 pt-10 lg:px-10 lg:pt-14">
        <Prose>
          <Reveal y={14}>
            <div className="border-t border-champagne/30 pt-10">
              <Paragraphs items={interview.intro ?? []} />
            </div>
          </Reveal>
        </Prose>

        {(interview.sections ?? []).map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <Prose className="mt-14">
              <Reveal y={14}>
                <h2 className="text-balance font-playfair text-[clamp(1.55rem,3vw,2.25rem)] leading-[1.16] text-charcoal">
                  {section.heading}
                </h2>
                <div className="mt-6">
                  <Paragraphs items={section.paragraphs ?? []} />
                </div>
              </Reveal>
            </Prose>

            {section.media && <SectionMedia media={section.media} />}

            {section.list && (
              <Prose>
                <Reveal y={16}>
                  <div className="my-10 rounded-card border border-champagne/40 bg-white/60 px-7 py-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal/45">
                      {section.list.label}
                    </p>
                    <ul className="mt-5 space-y-3.5">
                      {(section.list.items ?? []).map((item) => (
                        <li key={item} className="flex items-start gap-3.5">
                          <span
                            aria-hidden="true"
                            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-bordeaux/70"
                          />
                          <span className="text-[15px] leading-relaxed text-charcoal/80">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </Prose>
            )}

            {section.quote && (
              <Prose>
                <PullQuote>{section.quote}</PullQuote>
              </Prose>
            )}

            {section.after?.length > 0 && (
              <Prose>
                <Reveal y={14}>
                  <Paragraphs items={section.after} />
                </Reveal>
              </Prose>
            )}
          </section>
        ))}
      </div>

      {/* ================= LUGANA AM TISCH ================= */}
      {pairing && (
        <section
          id="pairing"
          aria-labelledby="interview-pairing"
          className="relative scroll-mt-28 bg-gradient-to-b from-transparent via-champagne-light/20 to-transparent py-16 lg:py-20"
        >
          <div className="mx-auto max-w-content px-6 lg:px-10">
            <Prose>
              <Reveal y={14}>
                <h2
                  id="interview-pairing"
                  className="text-balance font-playfair text-[clamp(1.55rem,3vw,2.25rem)] leading-[1.16] text-charcoal"
                >
                  {pairing.heading}
                </h2>
                <div className="mt-6">
                  <Paragraphs items={pairing.paragraphs ?? []} />
                </div>
              </Reveal>
            </Prose>

            {pairing.media && (
              <div className="mx-auto max-w-4xl">
                <SectionMedia media={pairing.media} />
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(pairing.items ?? []).map((item, i) => {
                const Icon = PAIRING_ICONS[item.icon] ?? Plate;
                return (
                  <Reveal key={item.title} y={16} delay={i * 0.06}>
                    <div className="h-full rounded-card border border-champagne/40 bg-white/70 px-6 py-7 text-center">
                      <Icon aria-hidden="true" className="mx-auto h-8 w-8 text-bordeaux/75" />
                      <p className="mt-4 font-playfair text-[17px] leading-snug text-charcoal">
                        {item.title}
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-charcoal/65">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= SERVIEREN ================= */}
      {serving && (
        <section
          id="servieren"
          aria-labelledby="interview-servieren"
          className="relative mx-auto max-w-content scroll-mt-28 px-6 py-10 lg:px-10"
        >
          <Prose>
            <Reveal y={14}>
              <div className="flex items-start gap-6">
                <Thermometer
                  aria-hidden="true"
                  className="mt-1 hidden h-11 w-11 shrink-0 text-bordeaux/70 sm:block"
                />
                <div>
                  <h2
                    id="interview-servieren"
                    className="text-balance font-playfair text-[clamp(1.55rem,3vw,2.25rem)] leading-[1.16] text-charcoal"
                  >
                    {serving.heading}
                  </h2>
                  <div className="mt-6">
                    <Paragraphs items={serving.paragraphs ?? []} />
                  </div>
                </div>
              </div>
            </Reveal>
          </Prose>
        </section>
      )}

      {/* ================= FAZIT ================= */}
      {outro && (
        <section
          id="fazit"
          aria-labelledby="interview-fazit"
          className="relative mx-auto max-w-content scroll-mt-28 px-6 py-10 lg:px-10"
        >
          <Prose>
            <Reveal y={14}>
              <h2
                id="interview-fazit"
                className="text-balance font-playfair text-[clamp(1.55rem,3vw,2.25rem)] leading-[1.16] text-charcoal"
              >
                {outro.heading}
              </h2>
              <div className="mt-6">
                <Paragraphs items={outro.paragraphs ?? []} />
              </div>
            </Reveal>
          </Prose>
        </section>
      )}

      {/* ================= PROFIL DES GESPRÄCHSPARTNERS ================= */}
      {profile.name && (
        <section
          aria-labelledby="interview-profil"
          className="relative mx-auto max-w-content px-6 py-10 lg:px-10"
        >
          <Prose>
            <Reveal y={16}>
              <div className="rounded-card-lg border border-champagne/40 bg-cream/70 px-7 py-8 sm:px-9">
                <p
                  id="interview-profil"
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal/45"
                >
                  {ui.aboutPerson}
                </p>
                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-champagne/60 bg-white">
                    <Photo
                      src={portrait.src}
                      alt=""
                      sizes="128px"
                      /* object-top: der Bildausschnitt ist eine Ganzfigur —
                         ohne Anker säße im Kreis der Bauch statt des Kopfs. */
                      className="h-full w-full object-cover object-top"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="font-playfair text-[20px] leading-snug text-charcoal">
                      {profile.name}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.14em] text-charcoal/50">
                      <Pin aria-hidden="true" className="h-3.5 w-3.5 text-champagne" />
                      {profile.role}
                    </p>
                    <p className="mt-4 max-w-[52ch] text-[14.5px] leading-relaxed text-charcoal/75">
                      {profile.text}
                    </p>
                    {profile.link?.href && (
                      /* Externes Ziel: bewusst ein nacktes <a>, kein
                         LocaleLink — die Cantina hat keine /it-Fassung
                         unserer Domain. */
                      <a
                        href={profile.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-4 inline-flex min-h-[48px] lg:min-h-[44px] items-center gap-1.5 text-[13px] font-medium text-bordeaux underline decoration-bordeaux/30 underline-offset-4 transition-colors duration-300 hover:decoration-bordeaux"
                      >
                        {profile.link.label}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          </Prose>
        </section>
      )}

      {/* ================= DER WEIN — erst hier, nie im Aufmacher =========
          Handoff Seite 2 und 9: Das Stück ist redaktionell. Die einzige
          kommerzielle CTA steht am Ende, nach dem Fazit und dem Profil.

          Flasche und Standschatten treiben zusammen durch die Parallaxe.
          Alles transform/opacity, nichts verschiebt Layout. */}
      {interview.wine && wine && (
        <section
          aria-labelledby="interview-wein"
          className="relative overflow-hidden border-y border-champagne/25 bg-gradient-to-b from-cream via-champagne-light/25 to-cream py-16 lg:py-20"
        >
          <Aura tint="gold" className="-left-44 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2" />
          <Aura tint="blush" drift={2} className="-right-52 -top-32 h-[28rem] w-[28rem]" />
          {/* Der Katalogname als Geisterwort — klingt aus, wo das Stück
              endet, und wird von overflow-hidden beschnitten wie überall. */}
          <GhostWord className="bottom-[-0.14em] right-[-2vw] text-[12vw] lg:text-[9.5rem]">
            {wine.name}
          </GhostWord>

          <div className="relative mx-auto max-w-content px-6 lg:px-10">
            {/* `group` auf dem Raster: Wer irgendwo im Band verweilt, hebt
                die Flasche einen Hauch an — der Schatten bleibt liegen und
                wird dabei etwas schmaler, als würde sie angehoben. */}
            <div className="group mx-auto grid max-w-4xl grid-cols-[8rem_1fr] items-center gap-8 sm:grid-cols-[11rem_1fr] sm:gap-12 lg:gap-14">
              <Reveal y={18}>
                {/* Flasche samt Standschatten in einer bewegten Ebene. ±6 %
                    der Flaschenhöhe bleiben deutlich unter dem py-16-Polster —
                    nichts läuft je in die Bandkante. */}
                <Parallax speed={0.06} className="relative">
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1.5 left-1/2 h-3.5 w-24 -translate-x-1/2 rounded-full transition-[transform,opacity] duration-700 ease-out-expo group-hover:scale-x-[0.92] group-hover:opacity-70 sm:w-32"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(31,29,26,0.28) 0%, transparent 70%)",
                      }}
                    />
                    {/* Freigestelltes Karten-Packshot (391 × 1400) —
                        dieselbe Datei, die auch die Weinkarten tragen. */}
                    <Photo
                      src={wine.photos.front}
                      alt=""
                      sizes="(min-width: 640px) 176px, 128px"
                      draggable={false}
                      className="relative mx-auto h-auto w-full max-w-[11rem] select-none object-contain will-transform transition-transform duration-700 ease-out-expo group-hover:-translate-y-1.5 group-hover:rotate-[0.5deg]"
                    />
                  </div>
                </Parallax>
              </Reveal>
              <Reveal y={16} delay={0.08}>
                {/* Die Rubrikzeile lag seit jeher unbenutzt im Wörterbuch —
                    alle vier Sprachen tragen sie bereits. */}
                {ui.tasted && (
                  <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal/45">
                    <span aria-hidden="true" className="h-px w-8 bg-bordeaux/40" />
                    {ui.tasted}
                  </p>
                )}
                <h2
                  id="interview-wein"
                  className="mt-3.5 text-balance font-playfair text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.18] text-charcoal"
                >
                  {interview.wine.heading}
                </h2>
                <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-charcoal/70">
                  {interview.wine.text}
                </p>
                <Button
                  href={`/unsere-weine/${interview.wine.slug}`}
                  variant="primary"
                  size="md"
                  className="mt-7"
                  data-interview-cta="wine"
                >
                  {interview.wine.cta}
                </Button>
              </Reveal>
            </div>
          </div>
        </section>
      )}

    </article>
  );
}

/* Der kanonische Pfad des Stücks — Teaser und JSON-LD greifen darauf zu. */
export { interviewPath };
