import { Eyebrow, GrapeRule } from "@/components/Deco";
import { Reveal } from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import Photo from "@/components/media/Photo";
import Atmosphere, { GhostWord } from "@/components/Atmosphere";

/* „Die Geschichte" — Herkunftserzählung links, rechts ein Parallax-Still aus
   dem Weinberg. Die überlappende Zitatkarte ist entfallen; das Kapitel bleibt
   in voller Sektionsbreite, fällt aber flacher aus. */

export default function StorySection({ wine }) {
  const { story } = wine;
  const titleWords = story.title.split(" ");
  const lastWord = titleWords.pop();

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
      <Atmosphere variant="warm" />
      <GhostWord className="left-[-2vw] top-8 text-[11vw]">La Storia</GhostWord>

      <div className="relative mx-auto grid max-w-content items-center gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10">
        <div>
          <Reveal>
            <Eyebrow>{story.kicker}</Eyebrow>
            <h2 className="mt-3 text-balance font-playfair text-[clamp(1.75rem,3vw,2.45rem)] leading-[1.1] text-charcoal">
              {titleWords.join(" ")} <span className="italic text-bordeaux">{lastWord}</span>
            </h2>
            <GrapeRule className="mt-5" />
          </Reveal>
          {story.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.08 + i * 0.08}>
              <p
                className={`mt-4 leading-relaxed text-charcoal/75 ${
                  i === 0 ? "text-[16px]" : "text-[14.5px]"
                }`}
              >
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <Parallax
            speed={0.09}
            overscan
            className={`overflow-hidden rounded-card-lg shadow-lift ${
              story.image?.wide ? "aspect-[3/2]" : "aspect-[5/4] lg:aspect-[4/5]"
            }`}
          >
            <Photo
              src={story.image?.src ?? "/img/sotria.webp"}
              alt={story.image?.alt ?? "Handlese der Trauben und Ausbau im Weinkeller"}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
