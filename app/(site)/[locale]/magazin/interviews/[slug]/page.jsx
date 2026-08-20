import { notFound } from "next/navigation";
import InterviewArticle from "@/components/magazin/interview/InterviewArticle";
import JsonLd from "@/components/seo/JsonLd";
import {
  INTERVIEW_SLUGS,
  findInterview,
  interviewPath,
} from "@/components/magazin/interviewRegistry";
import { bySlug } from "@/components/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, articleNode, personNode } from "@/lib/seo/jsonLd";

/* Ein Gespräch, eine Adresse: /magazin/interviews/<slug>

   Der Handoff (Seite 2) macht daraus die zentrale Entscheidung — der volle
   Text existiert genau hier, die Karte im Magazin und der Teaser auf
   /regionen verlinken beide auf DIESE URL. Deshalb ist die Seite eine echte
   Route und kein Modal-State: Sie ist teilbar, indexierbar und funktioniert
   ohne JavaScript.

   Der Slug ist in allen vier Sprachen gleich, die Sprache steht im Präfix.
   Damit bilden die vier Fassungen eine saubere hreflang-Gruppe, und
   pageMetadata() erzeugt sie wie auf jeder anderen Seite. */

/* Nur die Slugs — die Sprachen erzeugt bereits das Layout darüber. */
export function generateStaticParams() {
  return INTERVIEW_SLUGS.map((slug) => ({ slug }));
}

/* Alles außerhalb der Liste ist 404, keine leere fünfte Seite. */
export const dynamicParams = false;

/* Das Teaserbild fürs Teilen — erzeugt von scripts/og-images.mjs, benannt
   nach demselben Slug. */
const ogImage = (slug, alt) => ({
  url: `/img/og/interview-${slug}.jpg`,
  width: 1200,
  height: 630,
  alt,
});

export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  const interview = findInterview(dict, params.slug);
  if (!interview || interview.draft) return {};

  return pageMetadata({
    locale: params.locale,
    path: interviewPath(interview.slug),
    meta: interview.seo ?? { title: interview.headline, description: interview.deck },
    /* „article" statt „website": Das Stück ist redaktionell, und LinkedIn
       wie Facebook zeigen für diesen Typ Autor und Rubrik mit an. */
    type: "article",
    image: ogImage(interview.slug, interview.portrait?.alt),
  });
}

/* Article + Person + BreadcrumbList + WebPage in EINEM Graphen.

   Der Handoff (Seite 20) verlangt genau diese vier. Organization und WebSite
   liefert das Layout auf jeder Seite mit; ihre @ids sind hier nur verlinkt,
   nicht wiederholt — sonst stünden zwei konkurrierende Firmenknoten im
   Dokument. */
function InterviewJsonLd({ locale, dict, interview }) {
  const url = absoluteUrl(localePath(locale, interviewPath(interview.slug)));
  const ui = dict.interviews?.ui ?? {};
  const nav = dict.common?.nav ?? {};
  const localize = (href) => localePath(locale, href);

  const crumbs = breadcrumbNode(
    [
      { label: nav.home || "Home", href: "/" },
      { label: nav.magazine || ui.magazin, href: "/magazin" },
      { label: ui.interviews, href: "/magazin#interviste" },
      { label: interview.name },
    ],
    { url, localize }
  );

  const page = webPageNode({
    url,
    name: `${interview.name}: ${interview.headline}`,
    description: interview.deck,
    locale,
    type: "WebPage",
    image: { url: interview.portrait?.src, alt: interview.portrait?.alt },
    breadcrumbId: crumbs?.["@id"] ?? null,
  });

  const person = personNode({
    url,
    name: interview.profile?.name ?? interview.name,
    jobTitle: interview.profile?.role,
    /* Die Cantina ist ein fremdes Unternehmen — sie bekommt hier nur einen
       Namen, keinen @id-Verweis auf unsere Organisation. */
    worksFor: "Cantina Malavasi",
    sameAs: interview.profile?.link?.href,
    image: interview.portrait?.src,
  });

  return (
    <JsonLd
      data={graph(
        page,
        crumbs,
        person,
        articleNode({
          url,
          headline: `${interview.name}: ${interview.headline}`,
          description: interview.deck,
          locale,
          image: { url: interview.portrait?.src, alt: interview.portrait?.alt },
          authorName: interview.byline?.interview,
          intervieweeId: person?.["@id"] ?? null,
          /* Bleibt weg, solange die Redaktion kein Datum gesetzt hat. */
          datePublished: interview.byline?.date ?? null,
          section: ui.interviews,
          keywords: interview.badge?.split("·").map((k) => k.trim()),
          webPageId: page["@id"],
        })
      )}
    />
  );
}

export default async function InterviewPage({ params }) {
  const dict = await getDictionary(params.locale);
  const interview = findInterview(dict, params.slug);

  /* Entwürfe sind für Besucher nicht vorhanden — nicht bloß unsichtbar. */
  if (!interview || interview.draft) notFound();

  const wine = interview.wine?.slug ? bySlug(interview.wine.slug) : null;

  return (
    <>
      <InterviewJsonLd locale={params.locale} dict={dict} interview={interview} />
      {/* Bewusst KEIN <main> hier: StorefrontChrome legt bereits eines um
          jede Seite (components/StorefrontChrome.jsx). Ein zweites ergäbe
          verschachtelte Landmarks — der Handoff (Seite 22) verlangt
          ausdrücklich „un solo H1 e un solo main". */}
      <div className="relative -mb-12 min-h-screen bg-ivory lg:-mb-16">
        <InterviewArticle interview={interview} ui={dict.interviews?.ui ?? {}} wine={wine} />
      </div>
    </>
  );
}
