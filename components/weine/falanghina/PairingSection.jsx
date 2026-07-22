import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import { Aura } from "@/components/Atmosphere";
import { WINE_ICON } from "./WineIcons";

/* „Passt zu" — die dunkle Pairing-Karte der Referenzseite, neu interpretiert:
   links Espresso-Karte mit Linienikonen, rechts das Aperitivo-Foto mit
   Serviertemperatur-Chip auf Glas. */

export default function PairingSection({ wine }) {
  const { pairing } = wine;
  const Thermometer = WINE_ICON.thermometer;
  const tempFact = wine.facts.find((f) => f.icon === "thermometer");

  return (
    <section className="py-6">
      <div className="mx-auto grid max-w-content items-stretch gap-6 px-6 lg:grid-cols-2 lg:gap-8 lg:px-10">
        <Reveal className="h-full">
          <div className="grain relative h-full overflow-hidden rounded-card-lg bg-espresso p-8 shadow-lift lg:p-12">
            <Aura tint="gold" className="right-[-18%] top-[-22%] h-96 w-96 opacity-25" />
            <div className="relative">
              <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-champagne">
                {pairing.kicker}
              </p>
              <h2 className="mt-3 text-balance font-playfair text-[clamp(1.8rem,3vw,2.4rem)] leading-[1.12] text-ivory">
                {pairing.title}
              </h2>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ivory/65">
                {pairing.text}
              </p>

              <Stagger className="mt-9" delay={0.08}>
                {pairing.items.map((item, i) => {
                  const Icon = WINE_ICON[item.icon];
                  return (
                    <StaggerItem
                      key={item.title}
                      className={`flex items-center gap-5 py-4 ${
                        i < pairing.items.length - 1 ? "border-b border-ivory/[0.07]" : ""
                      }`}
                    >
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ivory/15 text-champagne">
                        {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                      </span>
                      <span>
                        <span className="block text-[15px] font-medium text-ivory">{item.title}</span>
                        <span className="mt-0.5 block text-[13px] text-ivory/55">{item.text}</span>
                      </span>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="h-full">
          <div className="relative h-full min-h-[420px]">
            <Parallax
              speed={0.08}
              overscan
              className="h-full min-h-[420px] overflow-hidden rounded-card-lg shadow-lift"
            >
              <img
                src={pairing.photo}
                alt={pairing.photoAlt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </Parallax>
            {tempFact && (
              <div className="glass ring-hairline absolute bottom-6 left-6 flex items-center gap-3 rounded-full py-3 pl-4 pr-5 shadow-glass">
                <Thermometer className="h-5 w-5 text-acqua-deep" aria-hidden="true" />
                <span className="text-[13px] font-medium text-charcoal">
                  Serviert bei {tempFact.value}
                </span>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
