"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import Parallax from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle, GrapeRule, GoldRule } from "@/components/Deco";
import { Arrow, Plus, Pin, Grapes } from "@/components/Icons";
import { PUBLISHED_INTERVIEWS } from "@/components/magazin/interviewData";
import { WINES } from "@/components/data";

/* „Im Gespräch“ — die Stimmen hinter den Flaschen. Links die Portrait-Leiste,
   rechts das geöffnete Gespräch: Zitat, Anmoderation und ein aufklappbares
   Q&A. Aufbau bewusst parallel zur StoriesSection, damit sich das Magazin als
   ein Heft liest. Datenquelle: components/magazin/interviewData.js */

const EASE = [0.16, 1, 0.3, 1];

/* Solange keine Gespräche gepflegt sind, steht hier die redaktionelle
   Platzhalterkarte — die Sektion verschwindet nie stillschweigend. */
function EmptyState() {
  return (
    <Reveal y={20} className="mt-10">
      <div className="relative overflow-hidden rounded-card-lg border border-dashed border-champagne/60 bg-gradient-to-b from-white/80 to-cream p-10 text-center shadow-luxe sm:p-14">
        <Grapes aria-hidden="true" className="mx-auto h-7 w-7 text-champagne" />
        <p className="mt-5 font-playfair text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug text-charcoal">
          Die ersten Gespräche entstehen gerade.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
          Wir besuchen Winzerinnen, Kellermeister und Sommeliers in ihren Weinbergen und
          Kellern — und bringen ihre Antworten hierher: über Böden und Jahrgänge, über
          Geschmack, Handwerk und die Menschen hinter jeder Flasche.
        </p>
        <div className="mt-7 flex items-center justify-center gap-4">
          <GoldRule className="w-14 sm:w-20" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
            Bald hier zu lesen
          </span>
          <GoldRule className="w-14 sm:w-20" />
        </div>
      </div>
    </Reveal>
  );
}

/* Eine Frage-Antwort-Zeile: Frage bleibt sichtbar, Antwort klappt weich auf. */
function QaRow({ item, index, isOpen, onToggle, interviewSlug }) {
  const reduced = useReducedMotion();
  const panelId = `qa-${interviewSlug}-${index}`;

  return (
    <div className="border-b border-stone/50 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group flex w-full min-h-[44px] items-start gap-4 py-4 text-left"
      >
        <span
          aria-hidden="true"
          className="mt-[3px] shrink-0 font-playfair text-[13px] italic text-champagne"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`flex-1 text-[13.5px] font-medium leading-snug transition-colors duration-300 ${
            isOpen ? "text-bordeaux" : "text-charcoal group-hover:text-bordeaux"
          }`}
        >
          {item.q}
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
          className="mt-[2px] shrink-0 will-transform"
        >
          <Plus
            className={`h-3.5 w-3.5 transition-colors duration-300 ${
              isOpen ? "text-bordeaux" : "text-charcoal/40 group-hover:text-bordeaux"
            }`}
          />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: reduced ? 0 : 0.5, ease: EASE },
              opacity: { duration: reduced ? 0 : 0.35, ease: EASE },
            }}
            className="overflow-hidden"
          >
            <p className="pb-5 pl-9 pr-8 text-[13.5px] leading-relaxed text-charcoal/75">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InterviewSection() {
  const [active, setActive] = useState(0);
  const [openQa, setOpenQa] = useState(0);

  const people = PUBLISHED_INTERVIEWS;
  const current = people[active];

  const selectPerson = (i) => {
    setActive(i);
    setOpenQa(0);
  };

  /* verlinkte Weine auflösen — unbekannte Slugs fallen still weg */
  const linkedWines = (current?.wines ?? [])
    .map((slug) => WINES.find((w) => w.slug === slug))
    .filter(Boolean);

  return (
    <section className="relative mt-20">
      <SectionTitle
        align="left"
        eyebrow="Im Gespräch"
        description="Winzerinnen, Kellermeister, Sommeliers und Köche erzählen von ihrer Region, ihrem Handwerk und davon, was einen Wein wirklich ausmacht."
      >
        Menschen hinter dem Wein
      </SectionTitle>

      {!current ? (
        <EmptyState />
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
          {/* ---- Portrait-Leiste ---- */}
          <Reveal y={18}>
            <div
              role="tablist"
              aria-label="Interviewpartnerinnen und Interviewpartner"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {people.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.slug}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => selectPerson(i)}
                    className={`group relative flex shrink-0 items-center gap-3 rounded-card border px-3 py-3 text-left transition-all duration-500 ease-out-expo lg:w-full ${
                      isActive
                        ? "border-champagne/70 bg-white/80 shadow-luxe"
                        : "border-stone/50 bg-white/45 hover:border-champagne/50 hover:bg-white/70"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="interview-tab-marker"
                        aria-hidden="true"
                        className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-bordeaux"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-stone/60 bg-cream">
                      {p.portrait?.src && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.portrait.src}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.08]"
                          loading="lazy"
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block whitespace-nowrap text-[12.5px] font-medium leading-snug transition-colors duration-300 lg:whitespace-normal ${
                          isActive ? "text-bordeaux" : "text-charcoal/75 group-hover:text-charcoal"
                        }`}
                      >
                        {p.name}
                      </span>
                      {p.role && (
                        <span className="mt-0.5 block truncate text-[10.5px] leading-snug text-charcoal/50 lg:whitespace-normal">
                          {p.role}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* ---- geöffnetes Gespräch ---- */}
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            {/* Portrait */}
            <AnimatePresence mode="wait">
              <motion.figure
                key={`${current.slug}-portrait`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="lg:sticky lg:top-28"
              >
                <Parallax
                  speed={0.09}
                  overscan
                  className="relative overflow-hidden rounded-card-lg bg-cream shadow-lift aspect-[4/5]"
                >
                  {current.portrait?.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current.portrait.src}
                      alt={current.portrait.alt ?? `Portrait von ${current.name}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-full w-full items-center justify-center bg-gradient-to-b from-champagne-light/40 to-cream"
                    >
                      <Grapes className="h-8 w-8 text-champagne" />
                    </span>
                  )}
                  {current.topic && (
                    <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                      {current.topic}
                    </span>
                  )}
                </Parallax>
                <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-charcoal/55">
                  {current.place && (
                    <span className="inline-flex items-center gap-1.5">
                      <Pin className="h-3.5 w-3.5 text-champagne" />
                      {current.place}
                    </span>
                  )}
                  {current.date && (
                    <span className="uppercase tracking-[0.16em] text-charcoal/40">
                      {current.date}
                    </span>
                  )}
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            {/* Zitat + Q&A */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <blockquote>
                  <p className="text-balance font-playfair text-[clamp(1.4rem,2.5vw,2rem)] italic leading-[1.25] text-charcoal">
                    <span aria-hidden="true" className="text-champagne">„</span>
                    {current.quote}
                    <span aria-hidden="true" className="text-champagne">“</span>
                  </p>
                  <GrapeRule className="mt-6" />
                  <cite className="mt-5 block not-italic">
                    <span className="block text-[13px] font-medium text-charcoal">
                      {current.name}
                    </span>
                    {current.role && (
                      <span className="mt-0.5 block text-[11px] uppercase tracking-[0.16em] text-charcoal/45">
                        {current.role}
                      </span>
                    )}
                  </cite>
                </blockquote>

                {current.intro && (
                  <p className="mt-7 text-[14px] leading-relaxed text-charcoal/75">
                    {current.intro}
                  </p>
                )}

                {current.qa?.length > 0 && (
                  <div className="mt-8 rounded-card border border-stone/50 bg-white/70 px-6 py-2 shadow-luxe">
                    {current.qa.map((item, i) => (
                      <QaRow
                        key={item.q}
                        item={item}
                        index={i}
                        interviewSlug={current.slug}
                        isOpen={openQa === i}
                        onToggle={() => setOpenQa(openQa === i ? -1 : i)}
                      />
                    ))}
                  </div>
                )}

                {linkedWines.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
                      Im Gespräch verkostet
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {linkedWines.map((w) => (
                        <Link
                          key={w.slug}
                          href={`/unsere-weine/${w.slug}`}
                          className="group inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-stone/70 bg-white/60 px-4 py-2 text-[11.5px] font-medium text-charcoal/75 transition-colors duration-300 hover:border-champagne hover:bg-white hover:text-bordeaux"
                        >
                          {w.name}
                          <Arrow className="h-3 w-3 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
}
