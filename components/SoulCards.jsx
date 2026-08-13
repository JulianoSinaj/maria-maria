import TiltCard from "@/components/motion/TiltCard";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { GoldRule } from "@/components/Deco";
import { Grapes } from "@/components/Icons";

/* Die zwei Seelen hinter dem Namen — als Etiketten-Paar gestaltet:
   Maria als dunkle Bordeaux-Karte (der Ursprung), Maria Pia als helle
   Elfenbein-Karte (die Gegenwart), verbunden durch ein goldenes „&". */

<<<<<<< Updated upstream
/* Nur die Ruhelage steht hier — Name, Rubrik, Eigenschaften und Text kommen
   je Sprache aus common.souls und werden als `souls` hereingereicht. */
const SOUL_SHAPE = [
  { key: "roots", dark: true },
  { key: "today", dark: false },
=======
   Die beiden Karten stehen gerade nebeneinander; beim Hover tritt die
   jeweils andere Karte dezent einen Schritt zurück, ohne dass etwas im
   Layout springt. */

const SOULS = [
  {
    name: "Maria",
    tag: "Die Wurzeln",
    traits: ["Familie", "Gastfreundschaft", "Erinnerung"],
    desc: "In Lizzano beginnt die persönliche Geschichte hinter dem Namen – in einer Kultur, in der Wein, Essen und gemeinsam verbrachte Zeit zusammengehören.",
    dark: true,
    /* Anflugrichtung beim Einblenden — bewusst kurz gehalten */
    from: -14,
  },
  {
    name: "Maria",
    tag: "Der heutige Blick",
    traits: ["Auswahl", "Ästhetik", "Neue Perspektiven"],
    desc: "Italienische Weine bewusst auswählen, ihre Regionen erzählen und sie Menschen in verschiedenen Ländern näherbringen.",
    dark: false,
    from: 14,
  },
>>>>>>> Stashed changes
];

const CORNERS = [
  "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
  "right-0 top-0 translate-x-1/2 -translate-y-1/2",
  "left-0 bottom-0 -translate-x-1/2 translate-y-1/2",
  "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
];

<<<<<<< Updated upstream
function SoulCard({ soul }) {
=======
const SPRING = { type: "spring", stiffness: 120, damping: 18, mass: 0.9 };

function SoulCard({ soul, dimmed, onEnter, onLeave }) {
  const reduced = useReducedMotion();
>>>>>>> Stashed changes
  const { dark } = soul;
  return (
<<<<<<< Updated upstream
    <TiltCard className="group h-full" max={5} radius="rounded-card">
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-card p-2.5 shadow-luxe transition-shadow duration-500 group-hover:shadow-lift ${
          dark
            ? "bg-gradient-to-b from-bordeaux to-bordeaux-deep"
            : "ring-hairline border border-stone/50 bg-ivory"
        }`}
      >
        {/* the etiquette frame — hairline border with diamond corner marks */}
        <div
          className={`relative flex h-full flex-col items-center rounded-[1.125rem] border px-6 py-8 text-center sm:px-7 ${
            dark ? "border-champagne/45" : "border-champagne/55"
          }`}
        >
          {CORNERS.map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`absolute h-[5px] w-[5px] rotate-45 ${pos} ${
                dark ? "bg-champagne/70" : "bg-champagne/80"
=======
    <div className="h-full">
      <motion.div
        className="h-full"
        variants={
          reduced
            ? undefined
            : {
                hidden: { opacity: 0, x: soul.from, filter: "blur(6px)" },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                  transition: { ...SPRING, opacity: { duration: 0.6 }, filter: { duration: 0.6 } },
                  transitionEnd: { filter: "none" },
                },
              }
        }
      >
        <motion.div
          className="h-full"
          initial={false}
          animate={
            reduced
              ? undefined
              : { opacity: dimmed ? 0.85 : 1, scale: dimmed ? 0.99 : 1 }
          }
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          onPointerEnter={(e) => e.pointerType !== "touch" && onEnter()}
          onPointerLeave={(e) => e.pointerType !== "touch" && onLeave()}
        >
          <TiltCard className="group h-full" max={3} radius="rounded-card">
            <div
              className={`relative flex h-full flex-col overflow-hidden rounded-card p-2.5 shadow-luxe transition-shadow duration-500 group-hover:shadow-lift ${
                dark
                  ? "bg-gradient-to-b from-bordeaux to-bordeaux-deep"
                  : "ring-hairline border border-stone/50 bg-ivory"
>>>>>>> Stashed changes
              }`}
            />
          ))}
          <Grapes className="h-5 w-5 text-champagne" />
          <p
            className={`mt-5 text-[10px] font-semibold uppercase tracking-[0.28em] ${
              dark ? "text-champagne-light" : "text-champagne"
            }`}
          >
            {soul.tag}
          </p>
          <h3
            className={`mt-2.5 font-playfair text-[clamp(26px,2.6vw,32px)] leading-tight ${
              dark ? "text-ivory" : "text-charcoal"
            }`}
          >
            {soul.name}
          </h3>
          <GoldRule className="mt-4 w-16" />
          <p
            className={`mt-4 text-[9.5px] font-semibold uppercase leading-[1.9] tracking-[0.2em] ${
              dark ? "text-champagne-light" : "text-champagne"
            }`}
          >
            {(soul.traits ?? []).join(" · ")}
          </p>
          <p
            className={`mt-5 max-w-[26ch] text-[12.5px] leading-relaxed ${
              dark ? "text-ivory/75" : "text-charcoal/70"
            }`}
          >
            {soul.desc}
          </p>
        </div>
      </div>
    </TiltCard>
  );
}

<<<<<<< Updated upstream
export default function SoulCards({ souls: copy = {} }) {
  const souls = SOUL_SHAPE.map((s) => ({ ...s, ...(copy?.[s.key] ?? {}) }));
  return (
    <div className="relative">
      <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2" gap={0.12}>
        {souls.map((soul) => (
          <StaggerItem key={soul.key} className="h-full">
            <SoulCard soul={soul} />
          </StaggerItem>
        ))}
      </Stagger>
      {/* the union of both souls — a golden seal between the two cards */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-champagne to-[#A9945C] font-playfair text-[24px] italic text-cream shadow-chip ring-4 ring-cream/90 sm:flex"
      >
        &amp;
      </span>
    </div>
  );
}
=======
              {/* Glanz, der beim Hover einmal über das Etikett streicht — auf
                  dem Rückweg blendet er schnell aus, statt zurückzuwischen */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 opacity-0 transition-[transform,opacity] duration-300 ease-out-expo group-hover:translate-x-[400%] group-hover:opacity-100 group-hover:duration-[1300ms] ${
                  dark
                    ? "bg-gradient-to-r from-transparent via-champagne-light/20 to-transparent"
                    : "bg-gradient-to-r from-transparent via-champagne/25 to-transparent"
                }`}
              />

              {/* the etiquette frame — hairline border with diamond corner marks */}
              <div
                className={`relative flex h-full flex-col items-center rounded-[1.125rem] border px-6 py-7 text-center transition-colors duration-500 sm:px-7 ${
                  dark
                    ? "border-champagne/45 group-hover:border-champagne/75"
                    : "border-champagne/55 group-hover:border-champagne/85"
                }`}
              >
                {CORNERS.map((pos, i) => (
                  <span
                    key={pos}
                    aria-hidden="true"
                    style={{ transitionDelay: `${i * 60}ms` }}
                    className={`absolute h-[5px] w-[5px] rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-[225deg] group-hover:scale-150 ${pos} ${
                      dark ? "bg-champagne/70" : "bg-champagne/80"
                    }`}
                  />
                ))}

                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${
                    dark ? "text-champagne-light" : "text-champagne"
                  }`}
                >
                  {soul.tag}
                </p>
                <h3
                  className={`mt-2.5 font-playfair text-[clamp(26px,2.6vw,32px)] leading-tight transition-transform duration-500 ease-out-expo group-hover:scale-[1.06] ${
                    dark ? "text-ivory" : "text-charcoal"
                  }`}
                >
                  {soul.name}
                </h3>

                {/* die Eigenschaften heben sich nacheinander an, statt als
                    ein Block zu springen */}
                <p
                  className={`mt-6 text-[9.5px] font-semibold uppercase leading-[1.9] tracking-[0.2em] ${
                    dark ? "text-champagne-light" : "text-champagne"
                  }`}
                >
                  {soul.traits.map((trait, i) => (
                    <span
                      key={trait}
                      style={{ transitionDelay: `${i * 80}ms` }}
                      className="inline-block transition-transform duration-500 ease-out-expo group-hover:-translate-y-[3px]"
                    >
                      {trait}
                      {i < soul.traits.length - 1 && (
                        /* Leerzeichen im Text, nicht als Margin — sonst liest
                           der Screenreader „Familie·Gastfreundschaft" */
                        <span aria-hidden="true" className="opacity-60">
                          {" · "}
                        </span>
                      )}
                    </span>
                  ))}
                </p>

                <p
                  className={`mt-5 max-w-[26ch] text-[12.5px] leading-relaxed ${
                    dark ? "text-ivory/75" : "text-charcoal/70"
                  }`}
                >
                  {soul.desc}
                </p>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* Das Siegel zwischen den beiden Karten — ein langsam kreisender Ring aus
   Champagner-Strichen, der beim Hover einer Karte kurz aufatmet. */
function Seal({ awake }) {
  const reduced = useReducedMotion();
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
    >
      <motion.span
        className="relative flex h-14 w-14 items-center justify-center"
        variants={
          reduced
            ? undefined
            : {
                hidden: { scale: 0.4, opacity: 0, rotate: -60 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                  transition: { type: "spring", stiffness: 180, damping: 15, delay: 0.35 },
                },
              }
        }
      >
        {/* Die CSS-Rotation liegt auf der Hülle: eine laufende Keyframe-
            Animation schlägt jedes inline gesetzte `transform` von Motion. */}
        <span className="absolute -inset-[7px] animate-seal">
          <motion.span
            className="block h-full w-full rounded-full border border-dashed border-champagne/45"
            initial={false}
            animate={reduced ? undefined : { scale: awake ? 1.12 : 1, opacity: awake ? 0.95 : 0.6 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          />
        </span>
        <motion.span
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-champagne to-[#A9945C] font-playfair text-[24px] italic text-cream shadow-chip ring-4 ring-cream/90"
          initial={false}
          animate={reduced ? undefined : { scale: awake ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          &amp;
        </motion.span>
      </motion.span>
    </span>
  );
}

export default function SoulCards() {
  const reduced = useReducedMotion();
  /* Welche Karte der Zeiger gerade ansteuert — die andere tritt zurück */
  const [active, setActive] = useState(null);

  return (
    <motion.div
      className="relative"
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -6% 0px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {SOULS.map((soul, i) => (
          <SoulCard
            key={soul.tag}
            soul={soul}
            dimmed={active !== null && active !== i}
            onEnter={() => setActive(i)}
            onLeave={() => setActive(null)}
          />
        ))}
      </div>
      {/* die Vereinigung beider Seelen — ein goldenes Siegel dazwischen */}
      <Seal awake={active !== null} />
    </motion.div>
  );
}
>>>>>>> Stashed changes
