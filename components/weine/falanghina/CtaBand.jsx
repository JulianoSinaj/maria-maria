import ShaderGradient from "@/components/motion/ShaderGradient";
import SplitText from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { Vines } from "@/components/Atmosphere";
import Button from "@/components/ui/Button";

/* Abschlussband — „Noch mehr entdecken?" über dem dunklen Weinkeller-Verlauf,
   nach dem Muster des Shop-CTA-Bands. */

export default function CtaBand({ wine }) {
  return (
    <section className="px-4 pb-6 pt-10">
      <div className="grain relative mx-auto max-w-[1280px] overflow-hidden rounded-card-lg">
        <ShaderGradient palette="wine" speed={0.8} />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
          aria-hidden="true"
        />
        <Vines className="absolute inset-x-0 bottom-0 h-56 w-full opacity-[0.12]" stroke="#C8B77A" />

        <div className="relative px-6 py-16 text-center sm:py-20 lg:py-24">
          <h2 className="font-playfair text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.06] text-ivory">
            <SplitText text={wine.cta.title} delay={0.05} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ivory/80">
              {wine.cta.text}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mx-auto mt-8 flex max-w-xs flex-col items-stretch gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-3.5">
              <Button href={wine.cta.button.href} variant="light" size="lg" className="w-full sm:w-auto">
                {wine.cta.button.label}
              </Button>
              <Button href="/weine" variant="glass" size="lg" iconType="none" className="w-full sm:w-auto">
                Alle Weine ansehen
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
