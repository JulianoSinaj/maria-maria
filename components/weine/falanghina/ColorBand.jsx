"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";

/* „Die Farbe" — ein immersiver Typo-Moment im Apple-Stil: zwei riesige
   Displayzeilen, dahinter wandern strohgelbe und meergrüne Lichtkugeln
   federnd mit dem Scroll. Darunter die drei Farbtöne des Weins als Chips. */

export default function ColorBand({ wine }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const orbScale = useSpring(useTransform(scrollYProgress, [0, 1], [0.7, 1.18]), {
    stiffness: 60,
    damping: 20,
  });
  const orbY = useSpring(useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]), {
    stiffness: 60,
    damping: 20,
  });
  const counterY = useSpring(useTransform(scrollYProgress, [0, 1], ["-16%", "14%"]), {
    stiffness: 55,
    damping: 22,
  });

  const c = wine.colorMoment;

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-ivory via-cream to-ivory">
      {/* Lichtkugeln */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { scale: orbScale, y: orbY }}
        className="absolute left-1/2 top-1/2 h-[64vw] max-h-[760px] w-[64vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#F3ECC0_0%,#E8DC9A_38%,transparent_72%)] opacity-70 blur-3xl will-transform"
      />
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: counterY }}
        className="absolute right-[4%] top-[16%] h-[26vw] max-h-[320px] w-[26vw] max-w-[320px] rounded-full bg-[radial-gradient(closest-side,#C9E8E1_0%,transparent_70%)] opacity-70 blur-2xl will-transform"
      />

      <div className="relative mx-auto flex min-h-[72vh] max-w-4xl flex-col items-center justify-center px-6 py-28 text-center">
        <Reveal blur={false}>
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-acqua-deep">
            {c.kicker}
          </span>
        </Reveal>
        <h2 className="mt-6 font-playfair text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.04] text-charcoal">
          <SplitText text={c.lines[0]} className="block" delay={0.08} />
          <SplitText
            text={c.lines[1]}
            className="block bg-gradient-to-r from-[#8F7A1E] via-[#B49B3A] to-acqua-deep bg-clip-text italic text-transparent"
            delay={0.3}
          />
        </h2>
        <Reveal delay={0.15} className="mt-7 max-w-xl">
          <p className="text-[15px] leading-relaxed text-charcoal/70">{c.text}</p>
        </Reveal>

        <Stagger className="mt-12 flex items-end justify-center gap-8 sm:gap-12" delay={0.1}>
          {c.swatches.map((s) => (
            <StaggerItem key={s.hex}>
              <motion.div
                whileHover={reduced ? undefined : { scale: 1.08, y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="flex flex-col items-center gap-3"
              >
                <span
                  className="ring-hairline block h-14 w-14 rounded-full shadow-luxe"
                  style={{ backgroundColor: s.hex }}
                  aria-hidden="true"
                />
                <span className="text-[12px] text-charcoal/55">{s.label}</span>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
