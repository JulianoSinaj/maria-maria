import { SectionTitle } from "@/components/Deco";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import Atmosphere, { GhostWord } from "@/components/Atmosphere";
import { WINE_ICON } from "./WineIcons";

/* „Im Detail" — das technische Datenblatt als Bento-Grid. Zwei dunkle
   Statement-Kacheln (Alkohol, Serviertemperatur) setzen Apple-typische
   Akzente, der Rest bleibt ruhig in Creme mit Haarlinien-Ring. */

function Cell({ item }) {
  const isAlcohol = item.label === "Alkoholgehalt";
  const isTemp = item.label === "Serviertemperatur";
  const Thermometer = WINE_ICON.thermometer;

  if (isAlcohol) {
    return (
      <div className="flex h-full flex-col justify-between rounded-card bg-acqua-ink p-6 text-ivory">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-acqua-light/75">
          {item.label}
        </p>
        <p className="mt-6 font-playfair text-3xl tabular-nums leading-none lg:text-[2.6rem]">
          {item.value}
        </p>
      </div>
    );
  }
  if (isTemp) {
    return (
      <div className="flex h-full flex-col justify-between rounded-card bg-espresso p-6 text-ivory">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne/85">
            {item.label}
          </p>
          <Thermometer className="h-8 w-8 shrink-0 text-champagne" aria-hidden="true" />
        </div>
        <p className="mt-6 font-playfair text-3xl tabular-nums leading-none lg:text-4xl">
          {item.value}
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-card bg-cream/90 p-6 ring-hairline">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
        {item.label}
      </p>
      <p className="text-balance font-playfair text-lg leading-snug text-charcoal lg:text-xl">
        {item.value}
      </p>
    </div>
  );
}

export default function DetailBento({ wine }) {
  return (
    <section id="details" className="relative scroll-mt-36 overflow-hidden py-24 lg:py-28">
      <Atmosphere variant="olive" />
      <GhostWord className="right-[-3vw] top-8 text-[12vw]">Dettagli</GhostWord>

      <div className="relative mx-auto max-w-content px-6 lg:px-10">
        <SectionTitle
          eyebrow="Im Detail"
          description="Das technische Datenblatt der Falanghina — klar, präzise, ohne Geheimnisse."
        >
          Alles Wesentliche. <span className="italic text-acqua-deep">Auf einen Blick.</span>
        </SectionTitle>

        <Stagger
          className="mt-14 grid auto-rows-[minmax(130px,auto)] grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5"
          gap={0.07}
        >
          {wine.detail.map((item) => (
            <StaggerItem
              key={item.label}
              className={item.span === "wide" ? "col-span-2" : "col-span-2 sm:col-span-1"}
            >
              <TiltCard max={4} lift={false} radius="rounded-card" className="group h-full shadow-luxe">
                <Cell item={item} />
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
