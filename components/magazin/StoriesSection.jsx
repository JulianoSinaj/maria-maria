"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Parallax from "@/components/motion/Parallax";
import Photo from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle, GrapeRule } from "@/components/Deco";
import { Arrow } from "@/components/Icons";
import { WINE_PAGES, WINE_SLUGS } from "@/components/weine/wineRegistry";

/* „Die Geschichte“ — früher pro Wein-Landingpage eine eigene Sektion, jetzt
   gebündelt als Herkunftskapitel im Magazin. Links die Rebsorten-Leiste, rechts
   das aufgeschlagene Kapitel: Text und Parallax-Still wechseln zusammen.
   Datenquelle bleibt unverändert wine.story aus den wineData-Modulen. */

const STORIES = WINE_SLUGS.map((slug) => {
  const wine = WINE_PAGES[slug];
  return { slug, name: wine.name, story: wine.story };
}).filter((s) => s.story);

const FALLBACK_IMG = "/img/sotria.webp";

export default function StoriesSection() {
  const [active, setActive] = useState(0);
  const current = STORIES[active];
  if (!current) return null;

  const { story } = current;
  const titleWords = story.title.split(" ");
  const lastWord = titleWords.pop();

  return (
    <section className="relative mt-20">
      <SectionTitle
        align="left"
        eyebrow="Die Geschichte"
        description="Herkunft, Erziehung und Ausbau — die Kapitel hinter jeder Flasche, gesammelt an einem Ort."
      >
        Geschichten aus den Weinbergen
      </SectionTitle>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
        {/* ---- Rebsorten-Leiste ---- */}
        <Reveal y={18}>
          <div
            role="tablist"
            aria-label="Weine mit Herkunftsgeschichte"
            className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {STORIES.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.slug}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`group relative shrink-0 rounded-card border px-4 py-3 text-left transition-all duration-500 ease-out-expo lg:w-full ${
                    isActive
                      ? "border-champagne/70 bg-white/80 shadow-luxe"
                      : "border-stone/50 bg-white/45 hover:border-champagne/50 hover:bg-white/70"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="story-tab-marker"
                      aria-hidden="true"
                      className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-bordeaux"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span
                    className={`block whitespace-nowrap text-[12.5px] font-medium leading-snug transition-colors duration-300 lg:whitespace-normal ${
                      isActive ? "text-bordeaux" : "text-charcoal/70 group-hover:text-charcoal"
                    }`}
                  >
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ---- aufgeschlagenes Kapitel ---- */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-balance font-playfair text-[clamp(1.6rem,2.8vw,2.25rem)] leading-[1.1] text-charcoal">
                {titleWords.join(" ")} <span className="italic text-bordeaux">{lastWord}</span>
              </h3>
              <GrapeRule className="mt-5" />
              {story.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`mt-4 leading-relaxed text-charcoal/75 ${
                    i === 0 ? "text-[15.5px]" : "text-[14px]"
                  }`}
                >
                  {p}
                </p>
              ))}
              {story.quote && (
                <blockquote className="mt-6 border-l-2 border-champagne/70 pl-5">
                  <p className="font-playfair text-[15px] italic leading-relaxed text-charcoal/80">
                    „{story.quote.text}“
                  </p>
                  <cite className="mt-2 block text-[11px] not-italic uppercase tracking-[0.16em] text-charcoal/45">
                    {story.quote.attribution}
                  </cite>
                </blockquote>
              )}
              <Link
                href={`/unsere-weine/${current.slug}`}
                className="group mt-7 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
              >
                Zum Wein
                <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${current.slug}-img`}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <Parallax
                speed={0.09}
                overscan
                className={`overflow-hidden rounded-card-lg shadow-lift ${
                  story.image?.wide ? "aspect-[3/2]" : "aspect-[5/4] lg:aspect-[4/5]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Photo
                  src={story.image?.src ?? FALLBACK_IMG}
                  alt={
                    story.image?.alt ?? "Handlese der Trauben und Ausbau im Weinkeller"
                  }
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </Parallax>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
