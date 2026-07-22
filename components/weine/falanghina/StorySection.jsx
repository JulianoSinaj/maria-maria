import { Eyebrow, GrapeRule, GoldRule } from "@/components/Deco";
import { Reveal } from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import Atmosphere, { GhostWord } from "@/components/Atmosphere";
import { Grapes } from "@/components/Icons";

/* „Die Geschichte" — Herkunftserzählung links, rechts ein Parallax-Still aus
   dem Weinberg mit dem überlappenden Maria-Moment-Zitat auf Glas. */

export default function StorySection({ wine }) {
  const { story } = wine;
  const titleWords = story.title.split(" ");
  const lastWord = titleWords.pop();

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <Atmosphere variant="warm" />
      <GhostWord className="left-[-2vw] top-10 text-[13vw]">La Storia</GhostWord>

      <div className="relative mx-auto grid max-w-content items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10">
        <div>
          <Reveal>
            <Eyebrow>{story.kicker}</Eyebrow>
            <h2 className="mt-4 text-balance font-playfair text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.1] text-charcoal">
              {titleWords.join(" ")} <span className="italic text-bordeaux">{lastWord}</span>
            </h2>
            <GrapeRule className="mt-7" />
          </Reveal>
          {story.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.08 + i * 0.08}>
              <p
                className={`mt-6 leading-relaxed text-charcoal/75 ${
                  i === 0 ? "text-[16.5px]" : "text-[14.5px]"
                }`}
              >
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="pb-10">
          <Reveal delay={0.1}>
            <div className="relative">
              <Parallax
                speed={0.09}
                overscan
                className="aspect-[4/5] overflow-hidden rounded-card-lg shadow-lift"
              >
                <img
                  src="/img/vineyard.jpg"
                  alt="Reben im Abendlicht in Kampanien"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </Parallax>

              <Reveal delay={0.22} className="relative z-10 mx-5 -mt-24 lg:mx-9">
                <figure className="glass ring-hairline rounded-card p-7 shadow-glass">
                  <Grapes className="h-6 w-6 text-champagne" aria-hidden="true" />
                  <blockquote className="mt-4 font-playfair text-xl italic leading-snug text-charcoal lg:text-2xl">
                    „{story.quote.text}“
                  </blockquote>
                  <GoldRule className="mt-5 w-16" />
                  <figcaption className="mt-3 font-playfair italic text-bordeaux">
                    {story.quote.attribution}
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
