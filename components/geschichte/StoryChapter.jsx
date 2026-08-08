import Link from "next/link";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import Photo from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/Icons";

/* Ein Kapitel der Geschichte — Bild und Text im Wechselgriff, wie die
   Regionen-Showcases: gerade Kapitel tragen das Foto links, ungerade
   rechts. Das Foto fährt mit Parallax-Feder und kippt als 3D-Karte leicht 
   zum Cursor. */

export default function StoryChapter({ chapter, flipped = false }) {
  const { id, label, title, paragraphs, link, img, alt, caption } = chapter;
  const headingId = `story-${id}`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-40 py-10 sm:py-12 lg:py-16"
    >
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-8 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        {/* ---- Foto ---- */}
        <Reveal className={flipped ? "lg:order-2" : ""} y={24}>
          <TiltCard className="group h-full" max={4} radius="rounded-card-lg">
            <figure className="relative aspect-[16/10] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift">
              <Parallax speed={0.08} overscan className="absolute inset-0">
                <Photo
                  src={img}
                  alt={alt}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                />
              </Parallax>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-espresso/70 via-espresso/20 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-4 p-5 sm:p-6">
                <span className="font-playfair text-[12.5px] italic text-ivory/85">{caption}</span>
              </figcaption>
            </figure>
          </TiltCard>
        </Reveal>

        {/* ---- Kapiteltext ---- */}
        <div className={flipped ? "lg:order-1" : ""}>
          <Reveal>
            {/* Kapitelmarke: Stationsname */}
            <p className="flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-champagne">
              <span className="text-bordeaux/80">{label}</span>
            </p>
            <h2
              id={headingId}
              className="mt-4 max-w-xl text-balance font-playfair text-[clamp(1.6rem,3vw,2.35rem)] leading-[1.14] text-charcoal"
            >
              {title}
            </h2>
            {paragraphs.map((text) => (
              <p key={text} className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
                {text}
              </p>
            ))}
            {link && (
              <Link
                href={link.href}
                className="group/link mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
              >
                {link.label}
                <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover/link:translate-x-1" />
              </Link>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
