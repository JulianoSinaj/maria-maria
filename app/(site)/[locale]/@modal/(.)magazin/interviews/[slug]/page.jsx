import { notFound } from "next/navigation";
import InterviewArticle from "@/components/magazin/interview/InterviewArticle";
import InterviewDialog from "@/components/magazin/interview/InterviewDialog";
import { findInterview } from "@/components/magazin/interviewRegistry";
import { bySlug } from "@/components/data";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* Abgefangener Klick auf ein Gespräch — das Lesefenster.

   `(.)magazin/interviews/[slug]` fängt Navigationen ab, die INNERHALB der
   App auf diese Adresse zeigen: den Klick auf die Magazin-Karte und den auf
   den Teaser unter /regionen. Alles andere — Direktlink, Reload, Treffer aus
   der Suche, geteilte Nachricht, abgeschaltetes JavaScript — läuft an
   dieser Route vorbei auf die echte Seite unter
   app/(site)/[locale]/magazin/interviews/[slug].

   Damit ist die Bedingung des Handoffs (Seite 2) erfüllt, ohne den Text zu
   verdoppeln: Fenster und Seite rendern dieselbe <InterviewArticle> aus
   derselben Wörterbuchquelle. Es gibt keine zweite Fassung, die auseinander
   laufen könnte.

   Kein eigenes generateMetadata und kein JSON-LD: Beim Abfangen bleibt der
   <head> der Ausgangsseite stehen — das Fenster ist ein Zustand des
   Magazins, kein eigenes Dokument. Die Metadaten des Artikels gehören zur
   Artikelseite, und genau die bekommt jeder Crawler zu sehen. */

export default async function InterviewModal({ params }) {
  const dict = await getDictionary(params.locale);
  const interview = findInterview(dict, params.slug);
  if (!interview || interview.draft) notFound();

  const wine = interview.wine?.slug ? bySlug(interview.wine.slug) : null;
  const titleId = `interview-dialog-${interview.slug}`;

  return (
    <InterviewDialog slug={interview.slug} ui={dict.interviews?.ui ?? {}} labelledBy={titleId}>
      <InterviewArticle
        interview={interview}
        ui={dict.interviews?.ui ?? {}}
        wine={wine}
        headingId={titleId}
      />
    </InterviewDialog>
  );
}
