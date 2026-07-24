import { SectionTitle } from "@/components/Deco";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import Atmosphere, { GhostWord } from "@/components/Atmosphere";
import { WINE_ICON } from "./WineIcons";

/* „Im Detail" — das technische Datenblatt als kuratiertes Masonry statt eines
   uniformen Rasters: eine Kopfkarte mit Flasche, ein asymmetrisches Zweispalter
   (Rebsorte/Herkunft gestapelt neben einer hohen Erziehungs-Karte mit
   Handskizze) und zwei Breitkarten (Vinifikation, Ausbau) mit Akzentbild
   rechts. Die restlichen Datenblatt-Fakten laufen als ruhige Chip-Leiste
   darunter — nichts geht verloren. Rein wine.detail-getrieben: fehlt ein Label,
   fällt die Karte weg. */

const ACCENT_FALLBACK = { base: "#45B3A2", deep: "#23786B", light: "#C9E8E1" };

/* Fakten, die als große Karten eigene Prominenz bekommen — der Rest wandert in
   die Chip-Leiste unten. */
const HEADLINE = new Set(["Bezeichnung", "Rebsorte", "Herkunft", "Erziehung", "Vinifikation", "Ausbau"]);

const pick = (detail, label) => detail.find((d) => d.label === label);

/* Handgezeichnete Rebe an „falangae“-Pfählen — die Namensskizze der Falanghina,
   als dekorative Illustration in der Erziehungs-Karte. */
function VineTrellis({ className = "", accent }) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Pfähle (die falangae) */}
      <path d="M30 132V26M90 132V26" strokeOpacity="0.55" />
      {/* Querdraht */}
      <path d="M18 52h84M18 84h84" strokeOpacity="0.35" />
      {/* Stamm, der sich am Pfahl emporwindet */}
      <path d="M60 132c0-14 6-20 3-30-3-9-9-13-6-24 3-10 10-14 7-26" />
      {/* Ranken */}
      <path d="M60 96c8-2 14-6 18-14M60 96c-9-1-15-5-19-13" strokeOpacity="0.7" />
      <path d="M63 62c9-1 16-5 21-13M63 62c-9 0-16-4-21-12" strokeOpacity="0.7" />
      {/* Blätter */}
      <path d="M84 78c5-2 8-6 8-12-6 0-10 2-12 7 1 2 2 4 4 5Z" style={{ fill: accent.light, fillOpacity: 0.5 }} strokeOpacity="0.7" />
      <path d="M36 46c-5-2-8-6-8-12 6 0 10 2 12 7-1 2-2 4-4 5Z" style={{ fill: accent.light, fillOpacity: 0.5 }} strokeOpacity="0.7" />
      {/* Traube */}
      <g strokeOpacity="0.8">
        <circle cx="52" cy="112" r="4" style={{ fill: accent.base, fillOpacity: 0.28 }} />
        <circle cx="60" cy="116" r="4" style={{ fill: accent.base, fillOpacity: 0.28 }} />
        <circle cx="68" cy="112" r="4" style={{ fill: accent.base, fillOpacity: 0.28 }} />
        <circle cx="56" cy="120" r="4" style={{ fill: accent.base, fillOpacity: 0.28 }} />
        <circle cx="64" cy="120" r="4" style={{ fill: accent.base, fillOpacity: 0.28 }} />
      </g>
    </svg>
  );
}

/* Kleine, ruhige Fakten-Karte (Rebsorte / Herkunft) — Label oben, Serifenwert. */
function FactCard({ item, icon }) {
  const Icon = icon ? WINE_ICON[icon] : null;
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-card bg-cream/90 p-5 ring-hairline sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/45 sm:text-[11px]">
          {item.label}
        </p>
        {Icon && <Icon className="h-6 w-6 shrink-0 text-acqua-deep/70 sm:h-7 sm:w-7" aria-hidden="true" />}
      </div>
      <p className="text-balance font-playfair text-[1.15rem] leading-snug text-charcoal sm:text-xl">
        {item.value}
      </p>
    </div>
  );
}

/* Breitkarte (Vinifikation / Ausbau) — Text links, dekoratives Akzentmotiv
   rechts als „background accent". */
function WideCard({ item, icon, accent }) {
  const Icon = icon ? WINE_ICON[icon] : null;
  return (
    <div className="group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-card bg-cream/90 p-6 ring-hairline sm:flex-row sm:items-center sm:gap-8 sm:p-8">
      <div className="relative max-w-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-acqua-deep sm:text-[11px]">
          {item.label}
        </p>
        <p className="mt-3 text-balance font-playfair text-[1.15rem] leading-snug text-charcoal sm:text-[1.35rem]">
          {item.value}
        </p>
      </div>

      {/* Akzentmotiv rechts — großes, angeschnittenes Icon als Wasserzeichen. */}
      {Icon && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -bottom-8 opacity-[0.14] transition-transform duration-500 ease-out-expo group-hover:scale-105 group-hover:opacity-20 sm:static sm:opacity-100 sm:group-hover:scale-100"
          style={{ color: accent.deep }}
        >
          <span
            className="hidden sm:flex ring-hairline h-24 w-24 shrink-0 items-center justify-center rounded-full"
            style={{ background: `${accent.base}18` }}
          >
            <Icon className="h-12 w-12" />
          </span>
          <Icon className="h-40 w-40 sm:hidden" />
        </div>
      )}
    </div>
  );
}

export default function DetailBento({ wine }) {
  const detail = wine.detail ?? [];
  const accent = wine.accent ?? ACCENT_FALLBACK;

  const bezeichnung = pick(detail, "Bezeichnung");
  const rebsorte = pick(detail, "Rebsorte");
  const herkunft = pick(detail, "Herkunft");
  const erziehung = pick(detail, "Erziehung");
  const vinifikation = pick(detail, "Vinifikation");
  const ausbau = pick(detail, "Ausbau");

  /* Übrig gebliebene Datenblatt-Werte → kompakte Chip-Leiste. */
  const chips = detail.filter((d) => !HEADLINE.has(d.label));

  const bottle = wine.images?.front;

  return (
    <section id="details" className="relative scroll-mt-36 overflow-hidden py-16 sm:py-24 lg:py-28">
      <Atmosphere variant="olive" />
      <GhostWord className="right-[-3vw] top-8 text-[12vw]">Dettagli</GhostWord>

      <div className="relative mx-auto max-w-content px-6 lg:px-10">
        <SectionTitle
          eyebrow="Im Detail"
          description={`Das technische Datenblatt ${wine.shortNameGen ?? "der Falanghina"} — klar, präzise, ohne Geheimnisse.`}
        >
          Alles Wesentliche. <span className="italic text-acqua-deep">Auf einen Blick.</span>
        </SectionTitle>

        <Stagger className="mt-10 flex flex-col gap-3 sm:mt-14 sm:gap-4" gap={0.08}>
          {/* 1 — Kopfkarte: Flasche links, Titel rechts. */}
          <StaggerItem>
            <TiltCard max={3} lift={false} radius="rounded-card-lg" className="group shadow-luxe">
              <div className="relative flex items-center gap-5 overflow-hidden rounded-card-lg bg-espresso p-6 text-ivory sm:gap-10 sm:p-9">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
                  style={{ background: `${accent.base}30` }}
                />
                {bottle && (
                  <div className="relative shrink-0">
                    <img
                      src={bottle}
                      alt={wine.name ?? ""}
                      className="h-28 w-auto object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)] sm:h-44 lg:h-52"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                )}
                <div className="relative">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-champagne/85 sm:text-[11px]">
                    Das Datenblatt
                  </p>
                  <h3 className="mt-3 text-balance font-playfair text-[1.5rem] leading-[1.1] sm:text-[2rem] lg:text-[2.4rem]">
                    {bezeichnung?.value ?? wine.name}
                  </h3>
                  <p className="mt-3 max-w-md text-[13px] leading-relaxed text-ivory/65 sm:text-sm">
                    Herkunft, Rebsorte und Handwerk — die Kennzahlen hinter jedem Glas.
                  </p>
                </div>
              </div>
            </TiltCard>
          </StaggerItem>

          {/* 2 — Asymmetrisches Zweispalter: links zwei kleine Karten gestapelt,
                 rechts eine hohe Erziehungs-Karte über volle Höhe. */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              {rebsorte && (
                <StaggerItem className="h-full">
                  <TiltCard max={4} lift={false} radius="rounded-card" className="group h-full shadow-md">
                    <FactCard item={rebsorte} icon="grapes" />
                  </TiltCard>
                </StaggerItem>
              )}
              {herkunft && (
                <StaggerItem className="h-full">
                  <TiltCard max={4} lift={false} radius="rounded-card" className="group h-full shadow-md">
                    <FactCard item={herkunft} icon="pin" />
                  </TiltCard>
                </StaggerItem>
              )}
            </div>

            {erziehung && (
              <StaggerItem className="h-full">
                <TiltCard max={4} lift={false} radius="rounded-card" className="group h-full shadow-md">
                  <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-card bg-gradient-to-br from-cream via-ivory to-cream p-5 ring-hairline sm:p-6">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-60"
                      style={{ background: `radial-gradient(120% 90% at 100% 0%, ${accent.light}55, transparent 60%)` }}
                    />
                    <div className="relative">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/45 sm:text-[11px]">
                        {erziehung.label}
                      </p>
                      <p className="mt-3 text-balance font-playfair text-[1.15rem] leading-snug text-charcoal sm:text-xl">
                        {erziehung.value}
                      </p>
                    </div>
                    <VineTrellis
                      className="relative mx-auto mt-5 h-32 w-auto self-center sm:h-40"
                      accent={accent}
                    />
                  </div>
                </TiltCard>
              </StaggerItem>
            )}
          </div>

          {/* 3 — Breitkarten: Vinifikation, dann Ausbau. */}
          {vinifikation && (
            <StaggerItem>
              <TiltCard max={3} lift={false} radius="rounded-card" className="group shadow-md">
                <WideCard item={vinifikation} icon="tank" accent={accent} />
              </TiltCard>
            </StaggerItem>
          )}
          {ausbau && (
            <StaggerItem>
              <TiltCard max={3} lift={false} radius="rounded-card" className="group shadow-md">
                <WideCard item={ausbau} icon="hourglass" accent={accent} />
              </TiltCard>
            </StaggerItem>
          )}

          {/* 4 — Restliche Kennzahlen als ruhige Chip-Leiste. */}
          {chips.length > 0 && (
            <StaggerItem>
              <div className="flex flex-wrap gap-x-8 gap-y-4 rounded-card bg-cream/70 px-6 py-5 ring-hairline sm:px-8">
                {chips.map((c) => (
                  <div key={c.label} className="min-w-[7rem]">
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-charcoal/40 sm:text-[10px]">
                      {c.label}
                    </p>
                    <p className="mt-1 font-playfair text-[0.98rem] leading-snug text-charcoal sm:text-[1.05rem]">
                      {c.value}
                    </p>
                  </div>
                ))}
              </div>
            </StaggerItem>
          )}
        </Stagger>
      </div>
    </section>
  );
}
