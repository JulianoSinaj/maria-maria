import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle, GoldRule } from "@/components/Deco";
import { Grapes } from "@/components/Icons";
import InterviewCard from "@/components/magazin/InterviewCard";

/* „Menschen hinter dem Wein" — die Interview-Rubrik des Magazins.

   Die Sektion zeigt Teaser, keinen Text: Jede Karte führt auf den Artikel
   unter /magazin/interviews/<slug>. Vorher stand hier ein aufklappbares Q&A
   mit eigenem Textbestand — damit hätte dasselbe Gespräch an zwei Orten
   gelegen, was der Handoff (Seite 2, „il corpo completo esiste una sola
   volta") ausdrücklich ausschließt.

   Datenquelle ist das Wörterbuch: die Seite reicht die veröffentlichten
   Gespräche als Prop herein, damit diese Komponente serverseitig bleibt und
   die Redaktionstexte nicht ins Client-Bundle wandern.

   Ein einzelnes Gespräch bekommt die breite Bühne (Foto links, Text rechts —
   so zeigt es das Mockup). Ab dem zweiten laufen die Karten als Raster mit
   gleicher Höhe, wie es der Handoff für die drei geplanten Interviews
   vorsieht. */

function EmptyState({ t = {} }) {
  return (
    <Reveal y={20} className="mt-10">
      <div className="relative overflow-hidden rounded-card-lg border border-dashed border-champagne/60 bg-gradient-to-b from-white/80 to-cream p-10 text-center shadow-luxe sm:p-14">
        <Grapes aria-hidden="true" className="mx-auto h-7 w-7 text-champagne" />
        <p className="mt-5 font-playfair text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug text-charcoal">
          {t.title}
        </p>
        <p className="mx-auto mt-4 max-w-lg text-[13.5px] leading-relaxed text-charcoal/70">
          {t.text}
        </p>
        <div className="mt-7 flex items-center justify-center gap-4">
          <GoldRule className="w-14 sm:w-20" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
            {t.badge}
          </span>
          <GoldRule className="w-14 sm:w-20" />
        </div>
      </div>
    </Reveal>
  );
}

export default function InterviewSection({ interviews = [], section = {}, empty, headingId }) {
  const featured = interviews.length === 1;

  return (
    <section className="relative mt-20">
      <SectionTitle
        align="left"
        eyebrow={section.eyebrow}
        description={section.description}
        headingId={headingId}
      >
        {section.title}
      </SectionTitle>

      {interviews.length === 0 ? (
        <EmptyState t={empty} />
      ) : (
        <div
          className={`mt-10 ${
            featured ? "" : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {interviews.map((interview, i) => (
            <InterviewCard
              key={interview.slug}
              interview={interview}
              featured={featured}
              delay={i * 0.08}
            />
          ))}
        </div>
      )}
    </section>
  );
}
