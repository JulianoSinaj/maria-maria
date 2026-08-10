import Link from "next/link";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import Photo from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/Icons";

/* Ein Kapitel der Geschichte — Bild und Text im Wechselgriff, wie die
   Regionen-Showcases: gerade Kapitel tragen das Foto links, ungerade
   rechts. Auf Telefonen gilt die Leseordnung des Briefings: erst Eyebrow,
   Titel und Absätze (samt Rebsorten-Zeile und CTA), dann das Foto, zuletzt
   das Zitat. Am Desktop bleibt das Zitat unter dem Kapiteltext — dafür
   spannt das Foto über beide Grid-Zeilen.

   Das Foto fährt mit Parallax-Feder und kippt als 3D-Karte leicht zum
   Cursor. `micro` liegt als italienisches Kurzwort auf dem Bild,
   `caption` steht als Didascalia darunter. */

export default function StoryChapter({ chapter, flipped = false }) {
  const { id, label, title, paragraphs, quote, rebsorten, link, img, alt, micro, caption } =
    chapter;
  const headingId = `story-${id}`;
  /* Desktop-Spalten: das Foto wechselt die Seite, Text und Zitat nehmen
     die andere — explizit gesetzt, weil die DOM-Reihenfolge (Text zuerst)
     der mobilen Leseordnung gehört. */
  const textCol = flipped ? "lg:col-start-1" : "lg:col-start-2";
  const photoCol = flipped ? "lg:col-start-2" : "lg:col-start-1";

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-40 py-10 sm:py-12 lg:py-16"
    >
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-8 px-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0 lg:px-10">
        {/* ---- Kapiteltext ---- */}
        <div className={`${textCol} lg:row-start-1 ${quote ? "lg:self-end" : ""}`}>
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
            {rebsorten && (
              <p className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-bordeaux/80">
                {rebsorten}
              </p>
            )}
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

        {/* ---- Foto: Kurzwort auf dem Bild, Didascalia darunter ---- */}
        <Reveal className={`${photoCol} lg:row-start-1 ${quote ? "lg:row-span-2" : ""}`} y={24}>
          <figure>
            <TiltCard className="group" max={4} radius="rounded-card-lg">
              <div className="relative aspect-[16/10] overflow-hidden rounded-card-lg shadow-luxe transition-shadow duration-500 group-hover:shadow-lift">
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
                {micro && (
                  <span className="absolute bottom-0 left-0 p-5 font-playfair text-[12.5px] italic text-ivory/85 sm:p-6">
                    {micro}
                  </span>
                )}
              </div>
            </TiltCard>
            {caption && (
              <figcaption className="mt-3 px-1 text-[11.5px] italic leading-relaxed text-charcoal/55">
                {caption}
              </figcaption>
            )}
          </figure>
        </Reveal>

        {/* ---- Zitat: mobil nach dem Bild, am Desktop unter dem Text ---- */}
        {quote && (
          <Reveal className={`${textCol} lg:row-start-2 lg:self-start`}>
            <p className="max-w-lg font-playfair text-[19px] italic leading-snug text-vine lg:mt-5">
              {quote}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
