"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useMediaQuery";
import { Reveal } from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";
import { useCommon } from "@/lib/i18n/context";

/* „Die Farbe" — eine Bühne statt einer Karte. Der Clip vom eingeschenkten
   Wein läuft randlos über die ganze Sektion, in halber Geschwindigkeit, und
   die Typo liegt darin. Es gibt bewusst keinen Rahmen mehr: die Aufnahme
   steht auf hellem Grau, und über Schleier in Elfenbein läuft sie an allen
   Kanten in die Seite aus — das Glas steht am Ende in einer Lichtinsel,
   nicht in einem Kasten.

   Die Kadrierung folgt dem Motiv: das Glas sitzt mittig im Clip und füllt
   ihn fast über die volle Höhe. Beschnitten wird darum quer, nie hoch. Ab lg
   rückt das Bild nach rechts (translate), damit das Glas neben der Typo
   steht statt hinter ihr — und das Sternchen, das unten rechts im Material
   steckt, aus dem Bild läuft. Darunter besorgt der schmalere Ausschnitt das
   Gleiche; wo er es knapp verfehlt, deckt der Schleier an der Kante zu.

   Die Serviertemperatur bleibt als schmale Zeile unter dem Text. Die
   Farbtöne wandern ab lg auf die rechte Seite der Bühne: dort stehen sie
   untereinander in der Lichtinsel neben dem Glas — die Textspalte wird
   leichter, und die leere Kante trägt wieder Inhalt. Unterhalb lg gibt es
   diese Kante nicht; dort stehen die Töne als eigene Zeile aus Chips unter
   der Temperatur — in derselben Sprache wie die Pille, und sie umbrechen
   sauber, wo die Etiketten (it: „Giallo paglierino") nicht in eine Zeile
   passen. */

/* Halbes Tempo — der Guss soll fallen, nicht stürzen */
const POUR_RATE = 0.55;
/* Der Clip beginnt mit leerem und endet mit vollem Glas. Am Schnitt würde
   das Glas hart zurückspringen. Darum liegt das Standbild (= letztes Bild
   des Clips, volles Glas) dauerhaft UNTER dem Video: kurz vor dem Schnitt
   blendet das Video auf das identische Standbild aus — unsichtbare Übergabe —
   und nach dem Rücksprung löst sich der neue Guss weich daraus. Der Vorlauf
   ist Medienzeit: die Blende (FADE_MS Wanduhr) muss bei POUR_RATE vor dem
   Schnitt fertig sein, also LEAD ≳ FADE_MS/1000 × RATE. */
const FADE_MS = 700;
const SEAM_LEAD = 0.45;

/* Video und Standbild müssen deckungsgleich stehen — eine Kadrierung für
   beide, damit die Naht-Blende keine Kante verschiebt. */
const MEDIA_CLASS =
  "h-full w-full origin-[50%_24%] scale-[1.16] object-cover [object-position:50%_50%] sm:scale-[1.2] sm:[object-position:40%_50%] lg:origin-[46%_22%] lg:translate-x-[9%] lg:scale-[1.26]";
const MEDIA_FILTER = { filter: "saturate(1.12) contrast(1.03)" };

export default function ColorBand({ wine }) {
  const reduced = useReducedMotionSafe();
  const winePage = useCommon("winePage");
  const c = wine.colorMoment;
  const art = c.artwork ?? {};
  /* Den Clip (~4 MB) erst mounten, wenn die Sektion in Sichtweite kommt —
     sonst lädt jede Weinseite ihn schon beim Seitenaufruf. Bis dahin und bei
     Reduced Motion steht das Standbild aus demselben Material. */
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const nearView = useInView(sectionRef, { once: true, margin: "0px 0px 700px 0px" });
  const hasVideo = Boolean(art.video) && !reduced && nearView;
  const [atSeam, setAtSeam] = useState(false);

  const accent = wine.accent ?? { base: "#C8B77A", deep: "#8A2B2F", light: "#E3D9B8" };
  const [s1, s2] = [c.swatches[1], c.swatches[2] ?? c.swatches[1]];
  const tempFact = (wine.facts ?? []).find((f) => f.icon === "thermometer");
  /* Standbild aus demselben Clip (public/img/pour) — nicht artwork.src: die
     Gemälde, die dort stehen, liegen nicht im Repo und laufen ins 404. */
  const poster = art.videoPoster;

  /* playbackRate überlebt keinen Quellenwechsel und steht vor dem Laden der
     Metadaten noch nicht — darum bei jedem Start neu setzen. */
  const slowDown = useCallback(() => {
    const v = videoRef.current;
    if (v) v.playbackRate = POUR_RATE;
  }, []);

  useEffect(() => {
    if (hasVideo) slowDown();
  }, [hasVideo, slowDown]);

  /* timeupdate feuert nur ~4×/s — zu grob, die Naht ruckte sichtbar. Ein
     rAF-Wächter liest die Abspielzeit bildgenau; setState greift nur am
     Zustandswechsel, dazwischen rendert nichts neu. */
  useEffect(() => {
    if (!hasVideo) return;
    let raf;
    const tick = () => {
      const v = videoRef.current;
      if (v && v.duration) setAtSeam(v.duration - v.currentTime < SEAM_LEAD);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasVideo]);

  return (
    <section
      ref={sectionRef}
      id="geschmack"
      className="relative isolate scroll-mt-36 overflow-hidden bg-ivory"
    >
      {/* ---------- Typo in der Bühne ---------- */}
      <div className="relative z-10 mx-auto grid max-w-content px-6 pb-2 pt-12 sm:pt-14 lg:min-h-[min(88vh,880px)] lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-10 lg:pb-14 lg:pt-14">
        <div>
          <Reveal blur={false}>
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: accent.deep }}
            >
              {c.kicker}
            </span>
          </Reveal>
          <h2 className="mt-3 font-playfair text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.03] text-charcoal">
            <SplitText text={c.lines[0]} className="block" delay={0.08} />
            <SplitText
              text={c.lines[1]}
              className="block italic"
              wordClassName="bg-clip-text text-transparent"
              wordStyle={{ backgroundImage: `linear-gradient(95deg, ${accent.deep}, #2B2724)` }}
              delay={0.24}
            />
          </h2>
          <Reveal delay={0.15} y={18}>
            <p
              className="mt-5 max-w-md border-l pl-5 text-[14.5px] leading-relaxed text-charcoal/75"
              style={{ borderColor: `${accent.base}59` }}
            >
              {c.text}
            </p>
          </Reveal>

          {/* Serviertemperatur und Farbtöne in einer Zeile — die Sachangaben
              des Kapitels, ohne sie in eine Karte zu sperren */}
          <Reveal delay={0.24} y={14} blur={false}>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              {tempFact && (
                <span className="inline-flex items-center gap-3 rounded-full border border-charcoal/10 bg-white/70 py-2 pl-3 pr-5 shadow-chip backdrop-blur-sm">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full"
                    style={{ backgroundColor: `${s1.hex}66`, color: accent.deep }}
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M12 4a2 2 0 0 0-2 2v7.2a4 4 0 1 0 4 0V6a2 2 0 0 0-2-2Z" />
                      <path d="M12 11v5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/50">
                      {tempFact.label}
                    </span>
                    <span className="text-[13px] font-semibold text-charcoal">{tempFact.value}</span>
                  </span>
                </span>
              )}

              {/* Unterhalb lg: die Töne als eigene Zeile (basis-full) aus
                  Chips — nie neben der Pille eingequetscht, und bei langen
                  Etiketten bricht ein ganzer Chip um, nicht ein Wort. */}
              <span
                className="flex basis-full flex-wrap items-center gap-2 lg:hidden"
                aria-label={winePage.tones}
              >
                {c.swatches.map((s) => (
                  <span
                    key={s.hex}
                    className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/70 py-1.5 pl-1.5 pr-3 shadow-chip backdrop-blur-sm"
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full shadow-sm ring-1 ring-white/80"
                      style={{ backgroundColor: s.hex }}
                    />
                    <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/60">
                      {s.label}
                    </span>
                  </span>
                ))}
              </span>
            </div>
          </Reveal>
        </div>

        {/* Farbtöne an der rechten Kante — untereinander, rechtsbündig auf
            den Schleier gesetzt, der das Bild dort ohnehin in Elfenbein
            auslaufen lässt. Nur ab lg: darunter existiert diese Kante nicht. */}
        <div
          className="hidden lg:flex lg:flex-col lg:items-end lg:gap-5 lg:justify-self-end"
          aria-label={winePage.tones}
        >
          {c.swatches.map((s, i) => (
            <Reveal key={s.hex} delay={0.3 + i * 0.12} y={14} blur={false}>
              <span className="flex items-center gap-2.5">
                <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50">
                  {s.label}
                </span>
                <span
                  className="h-4 w-4 rounded-full border border-white/70 shadow-sm"
                  style={{ backgroundColor: s.hex }}
                />
              </span>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ---------- Die Bühne ---------- */}
      {/* Unterhalb lg steht der Guss als hohes Bild unter dem Text — dort
          liegt das Glas mittig im Bild und hätte die Typo sonst im Rücken.
          Ab lg füllt dieselbe Aufnahme die ganze Sektion.

          Die Bühne schneidet unterhalb lg selbst: die Aufnahme ist um den
          Punkt 50 %/24 % vergrößert und ragte sonst oben über den Rahmen —
          genau dorthin, wo die Schleier (inset-0) nicht mehr hinreichen. Das
          gab einen grauen Streifen hinter den Tönen und eine harte Kante am
          Beginn der Bühne. Ab lg liegt die Bühne in der Sektion, die ohnehin
          schneidet — dort bleibt alles, wie es war. */}
      <div className="relative z-0 aspect-[4/5] w-full overflow-hidden sm:aspect-[3/2] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:overflow-visible">
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { scale: 1.06 }}
          whileInView={reduced ? undefined : { scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Das Standbild liegt immer unten: Fallback ohne Video und
              Auffangfläche für die Naht-Blende — das Glas verschwindet nie. */}
          {poster && (
            <img
              src={poster}
              alt={art.videoTitle ?? `${wine.name} im Glas`}
              loading="lazy"
              className={MEDIA_CLASS}
              style={MEDIA_FILTER}
            />
          )}
          {hasVideo && (
            <video
              ref={videoRef}
              src={art.video}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedMetadata={slowDown}
              onPlay={slowDown}
              aria-label={art.videoTitle ?? `${wine.name} wird eingeschenkt`}
              className={`absolute inset-0 ${MEDIA_CLASS} transition-opacity ease-out will-change-[opacity] ${
                atSeam ? "opacity-0" : "opacity-100"
              }`}
              style={{ ...MEDIA_FILTER, transitionDuration: `${FADE_MS}ms` }}
            />
          )}
        </motion.div>

        {/* Wärme: das Material steht auf neutralem Grau, die Seite auf
            Elfenbein — ein Hauch Weinton legt beide auf dieselbe Temperatur */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(125deg, ${s1.hex}66, transparent 42%, ${s2.hex}4D)`,
            mixBlendMode: "soft-light",
          }}
        />

        {/* Lichtinsel: von der Mitte nach außen läuft das Bild in Elfenbein
            aus — an der rechten Kante am dichtesten. Ab lg ist das Bild um
            9 % nach rechts gerückt (siehe oben), damit das Glas rechts der
            Typo steht; das Sternchen im Material wandert dabei aus dem Bild.
            Darunter, wo die Kadrierung es noch erwischt, deckt der Schleier
            an der Kante es zu. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(126% 100% at 58% 46%, transparent 34%, rgba(251,249,244,0.26) 64%, rgba(251,249,244,0.78) 88%, #FBF9F4 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to left, #FBF9F4 1%, rgba(251,249,244,0.92) 9%, rgba(251,249,244,0.45) 22%, transparent 38%)",
          }}
        />
        {/* Ober- und Unterkante lösen sich in die Nachbarkapitel auf */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #FBF9F4 0%, rgba(251,249,244,0.35) 14%, transparent 34%, transparent 68%, rgba(251,249,244,0.5) 88%, #FBF9F4 100%)",
          }}
        />
        {/* Ab lg liegt die Typo im Bild: die linke Hälfte wird zur Lesefläche */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(100deg, #FBF9F4 6%, rgba(251,249,244,0.93) 30%, rgba(251,249,244,0.55) 46%, transparent 62%)",
          }}
        />
      </div>
    </section>
  );
}
