"use client";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { SectionTitle } from "@/components/Deco";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import Atmosphere, { GhostWord } from "@/components/Atmosphere";

/* „Im Detail" — das technische Datenblatt als eine einzige, ruhige Komposition
   statt verstreuter Bento-Karten: links eine dunkle Identitätstafel mit dem
   freigestellten Packshot (Karten-WebP mit Alpha — kein weißer Fotokasten),
   rechts ein präzises Ledger mit Haarlinien, Laufnummern und Serifenwerten.
   Die Kurzfakten (Boden, Serviertemperatur, Füllmenge …) laufen als
   Fine-Print-Band unter beiden Spalten — nichts geht verloren.

   Keine Icon-Badges mehr: die Laufnummer in Playfair-Kursive trägt die
   Orientierung, die Typografie die Hierarchie. Rein wine.detail-getrieben —
   fehlt ein Label, fällt die Zeile weg. Akzent pro Wein über wine.accent,
   sonst wine.moment.accent (jede Weinseite hat einen). */

const ACCENT_FALLBACK = { base: "#C8B77A", deep: "#8A2B2F", light: "#E3D9B8" };

/* Prozess-Fakten mit eigener Ledger-Zeile — alles Übrige wird Fine-Print. */
const LEDGER = new Set(["Rebsorte", "Uvaggio", "Herkunft", "Lese", "Erziehung", "Vinifikation", "Ausbau"]);

const SPRING_FLOAT = { stiffness: 90, damping: 20, mass: 0.9 };
const SPRING_MAGNET = { stiffness: 150, damping: 20, mass: 0.6 };

/* Einheitliches Etikett — identische Typo in Ledger und Fine-Print. */
function SheetLabel({ children, className = "" }) {
  return (
    <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/45 sm:text-[11px] ${className}`}>
      {children}
    </p>
  );
}

/* Gravur-Ringe hinter der Flasche — feine konzentrische Linien im Weinakzent,
   wie ein Prägestempel auf dunklem Papier. */
function EngravedRings({ accent }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      fill="none"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-auto -translate-x-1/2 -translate-y-1/2"
      style={{ color: accent.light }}
    >
      <circle cx="200" cy="200" r="74" stroke="currentColor" strokeOpacity="0.16" />
      <circle cx="200" cy="200" r="116" stroke="currentColor" strokeOpacity="0.11" />
      <circle cx="200" cy="200" r="158" stroke="currentColor" strokeOpacity="0.07" />
      <circle
        cx="200"
        cy="200"
        r="192"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeDasharray="1 7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Dunkle Identitätstafel — Eyebrow, Bezeichnung und die frei schwebende
   Flasche. Der Packshot fährt beim Scrollen federgedämpft mit (Parallax) und
   folgt dem Cursor magnetisch; beides reine GPU-Transforms. */
function SheetIdentity({ wine, accent, title }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const floatY = useSpring(useTransform(scrollYProgress, [0, 1], [26, -26]), SPRING_FLOAT);
  const floatR = useSpring(useTransform(scrollYProgress, [0, 1], [2.5, -2.5]), SPRING_FLOAT);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const magX = useSpring(mx, SPRING_MAGNET);
  const magY = useSpring(my, SPRING_MAGNET);

  const onMove = (e) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const bottle = wine.slug ? `/img/wines/${wine.slug}/card-front.webp` : wine.images?.front;

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="grain relative flex h-full flex-col overflow-hidden bg-espresso p-7 text-ivory sm:p-9 lg:p-10"
    >
      {/* Akzent-Aura + warmes Gegenlicht */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full blur-3xl"
        style={{ background: `${accent.base}30` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-28 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "rgba(200,183,122,0.14)" }}
      />

      <div className="relative">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-champagne/85 sm:text-[11px]">
          Das Datenblatt
        </p>
        <h3 className="mt-3 text-balance font-playfair text-[1.55rem] leading-[1.08] sm:text-[1.85rem] lg:text-[2rem]">
          {title}
        </h3>
        <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ivory/60">
          Herkunft, Rebsorte und Handwerk — die Kennzahlen hinter jedem Glas.
        </p>
      </div>

      {/* Flaschenbühne */}
      <div className="relative mt-6 flex min-h-[15rem] flex-1 items-center justify-center py-4 sm:min-h-[17rem] lg:py-8">
        <EngravedRings accent={accent} />
        {/* weiches Gegenlicht hinter der Flasche — bindet die freigestellte
            Kante an den dunklen Grund */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: `radial-gradient(closest-side, ${accent.light}30, transparent 72%)` }}
        />
        {bottle && (
          <motion.div
            style={reduced ? undefined : { y: floatY, rotate: floatR, willChange: "transform" }}
          >
            <motion.img
              src={bottle}
              alt={`Flasche ${wine.name ?? ""}`}
              style={reduced ? undefined : { x: magX, y: magY }}
              className="h-52 w-auto select-none object-contain drop-shadow-[0_30px_38px_rgba(0,0,0,0.55)] sm:h-60 lg:h-72"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </motion.div>
        )}
      </div>

      <div className="relative mt-auto flex items-center gap-4 pt-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-ivory/40">
        <span aria-hidden="true" className="h-px flex-1 bg-ivory/15" />
        {wine.eyebrow ?? "Maria Maria"}
      </div>
    </div>
  );
}

/* Ledger-Zeile: Laufnummer in Playfair-Kursive, Etikett, Serifenwert.
   Hover zeichnet eine Akzentkante und tönt die Nummer — nur Transform und
   Opacity, kein Layout-Shift. */
function LedgerRow({ item, index, accent }) {
  return (
    <div
      className="group relative flex h-full items-center px-6 py-5 sm:px-8 lg:px-10 lg:py-6"
      style={{ "--acc": accent.deep }}
    >
      {/* Hover-Wash + Akzentkante */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out-expo group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, ${accent.light}26, transparent 55%)` }}
      />
      <span
        aria-hidden="true"
        className="absolute left-0 top-1/2 h-9 w-[2px] origin-center -translate-y-1/2 scale-y-0 rounded-full transition-transform duration-500 ease-out-expo will-transform group-hover:scale-y-100"
        style={{ background: accent.base }}
      />

      <div className="relative grid w-full grid-cols-[2.5rem_1fr] items-start gap-x-3 gap-y-1.5 sm:grid-cols-[3rem_10rem_1fr] sm:gap-x-6">
        <span
          aria-hidden="true"
          className="pt-0.5 font-playfair text-[15px] italic leading-none text-charcoal/30 transition-colors duration-400 group-hover:text-[color:var(--acc)]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <SheetLabel className="sm:pt-1">{item.label}</SheetLabel>
        <p className="col-start-2 font-playfair text-[1.05rem] leading-snug text-charcoal transition-transform duration-500 ease-out-expo will-transform group-hover:translate-x-1 sm:col-start-3 sm:text-[1.12rem]">
          {item.value}
        </p>
      </div>
    </div>
  );
}

/* Rasterkanten des Fine-Print-Bands — mobil eine Quittungs-Spalte,
   ab sm 2, ab lg 4 Spalten. */
const finePrintBorders = (i) => [
  i > 0 ? "border-t border-stone/50" : "",
  i === 1 ? "sm:border-t-0" : "",
  i % 2 === 1 ? "sm:border-l sm:border-stone/50" : "",
  i % 4 !== 0 ? "lg:border-l lg:border-stone/50" : "lg:border-l-0",
  i >= 4 ? "lg:border-t" : "lg:border-t-0",
].join(" ");

export default function DetailBento({ wine }) {
  const detail = wine.detail ?? [];
  const accent = wine.accent ?? wine.moment?.accent ?? ACCENT_FALLBACK;

  const title = detail.find((d) => d.label === "Bezeichnung")?.value ?? wine.name;
  const rows = detail.filter((d) => LEDGER.has(d.label));
  const finePrint = detail.filter((d) => d.label !== "Bezeichnung" && !LEDGER.has(d.label));

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

        <Stagger className="mt-10 sm:mt-14" gap={0.07} amount={0.1}>
          <div className="ring-hairline overflow-hidden rounded-card-lg border border-stone/60 bg-cream/90 shadow-luxe">
            <div className="grid lg:grid-cols-[5fr_7fr]">
              <StaggerItem className="relative h-full">
                <SheetIdentity wine={wine} accent={accent} title={title} />
              </StaggerItem>

              {/* Das Ledger — jede Zeile eine Kennzahl, getrennt durch Haarlinien.
                  flex-1 verteilt die Zeilen über die volle Tafelhöhe. */}
              <div className="flex flex-col">
                {rows.map((item, i) => (
                  <StaggerItem
                    key={item.label}
                    y={18}
                    className="flex-1 border-t border-stone/50 first:border-t-0"
                  >
                    <LedgerRow item={item} index={i} accent={accent} />
                  </StaggerItem>
                ))}
              </div>
            </div>

            {/* Fine-Print-Band: die Kurzfakten als ruhige Fußzeile der Tafel. */}
            {finePrint.length > 0 && (
              <div className="grid grid-cols-1 border-t border-stone/60 sm:grid-cols-2 lg:grid-cols-4">
                {finePrint.map((c, i) => (
                  <StaggerItem key={c.label} y={14} className={finePrintBorders(i)}>
                    <div className="flex items-baseline justify-between gap-4 px-6 py-3.5 sm:block sm:px-8 sm:py-5">
                      <SheetLabel className="shrink-0">{c.label}</SheetLabel>
                      <p className="text-right font-playfair text-[0.98rem] leading-snug text-charcoal sm:mt-1.5 sm:text-left sm:text-[1.05rem]">
                        {c.value}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            )}
          </div>
        </Stagger>
      </div>
    </section>
  );
}
