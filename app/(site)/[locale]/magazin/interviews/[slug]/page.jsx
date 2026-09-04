import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import InterviewArticle from "@/components/magazin/interview/InterviewArticle";
import JsonLd from "@/components/seo/JsonLd";
import {
  listInterviewSlugs,
  findInterview,
  interviewPath,
} from "@/components/magazin/interviewRegistry";
import { ogExists, ogPath } from "@/lib/interviews/og";
import { bySlug } from "@/components/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import {
  graph,
  siteNodes,
  webPageNode,
  breadcrumbNode,
  articleNode,
  personNode,
  faqNode,
} from "@/lib/seo/jsonLd";

/* Ein Gespräch, eine Adresse: /magazin/interviews/<slug>

   Der Handoff (Seite 2) macht daraus die zentrale Entscheidung — der volle
   Text existiert genau hier, die Karte im Magazin und der Teaser auf
   /regionen verlinken beide auf DIESE URL. Deshalb ist die Seite eine echte
   Route und kein Modal-State: Sie ist teilbar, indexierbar und funktioniert
   ohne JavaScript.

   Der Slug ist in allen vier Sprachen gleich, die Sprache steht im Präfix.
   Damit bilden die vier Fassungen eine saubere hreflang-Gruppe, und
   pageMetadata() erzeugt sie wie auf jeder anderen Seite.

   Seit dem Redaktionssystem kommen die Gespräche aus zwei Quellen (siehe
   components/magazin/interviewRegistry.js): den Sprachdateien und dem
   Speicher der Redaktion. Ein Stück, das nach dem Build veröffentlicht
   wird, hat zur Bauzeit keinen statischen Pfad — deshalb `dynamicParams =
   true`: Die Seite entsteht beim ersten Aufruf und wird dann wie die
   gebauten gecacht; das Veröffentlichen im Backoffice ruft revalidatePath
   auf (lib/interviews/revalidate.js). Unbekannte Slugs bleiben 404. */

/* Nur die Slugs — die Sprachen erzeugt bereits das Layout darüber. */
export async function generateStaticParams() {
  const slugs = await listInterviewSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

/* Das Teaserbild fürs Teilen — erzeugt von scripts/og-images.mjs (Code-
   Stücke) bzw. lib/interviews/og.js beim Veröffentlichen, benannt nach
   demselben Slug. Fehlt die Datei (Rendering fehlgeschlagen, frischer
   Container ohne Volume), trägt das Portrait die Vorschau — ein Bild ist
   immer besser als eine leere Kachel. */
async function ogImage(interview) {
  const alt = interview.portrait?.alt;
  if (await ogExists(interview.slug)) {
    return { url: ogPath(interview.slug), width: 1200, height: 630, alt };
  }
  return interview.portrait?.src ? { url: interview.portrait.src, alt } : null;
}

export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  const interview = await findInterview(dict, params.slug, params.locale);
  const preview = draftMode().isEnabled;
  if (!interview || (interview.draft && !preview)) return {};

  return pageMetadata({
    locale: params.locale,
    path: interviewPath(interview.slug),
    meta: interview.seo ?? { title: interview.headline, description: interview.deck },
    /* „article" statt „website": Das Stück ist redaktionell, und LinkedIn
       wie Facebook zeigen für diesen Typ Autor und Rubrik mit an. */
    type: "article",
    image: await ogImage(interview),
    /* Eine Vorschau darf nie in den Index — auch nicht, wenn jemand den
       Link mit gesetztem Cookie teilt. */
    robots: interview.draft ? { index: false, follow: false } : null,
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

  /* Nur bestätigte Angaben. `jobTitle` und `worksFor` kommen aus dem
     Wörterbuch und fehlen, solange sie dort fehlen — personNode() lässt
     leere Felder still weg. Die Master-Source verlangt das ausdrücklich
     („Person solo con dati verificati"): Was hier steht, ist belegt — bei
     Daniele die Cantina Malavasi, bei Francesco die Cantine Moras, beide
     über die eigene Firmenseite der Kellerei.

     Ein Arbeitgeber ist ein fremdes Unternehmen — er bekommt hier nur einen
     Namen, keinen @id-Verweis auf unsere Organisation. */
  const person = personNode({
    url,
    name: interview.profile?.name ?? interview.name,
    jobTitle: interview.profile?.role,
    worksFor: interview.profile?.worksFor,
    sameAs: interview.profile?.link?.href,
    image: interview.portrait?.src,
  });

  return (
    <JsonLd
      data={graph(
        siteNodes({ locale, description: dict.meta?.orgDescription }),
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
          /* Bleibt weg, solange die Redaktion kein Datum gesetzt hat. Stücke
             aus dem Redaktionssystem tragen das Datum zusätzlich als ISO-
             Wert (`dateIso`) — der gehört in den Graphen, nicht die
             sprachliche Form. */
          datePublished: interview.byline?.dateIso ?? interview.byline?.date ?? null,
          section: ui.interviews,
          keywords: interview.badge?.split("·").map((k) => k.trim()),
          webPageId: page["@id"],
        }),
        /* Die Fragen am Fuß des Stücks. Sie stehen nur hier vollständig —
           kein anderer Ort der Domain beantwortet sie —, deshalb trägt
           dieses Dokument den FAQPage-Knoten. Fehlt der Block, liefert
           faqNode() null und graph() lässt ihn weg. */
        faqNode({ url, items: interview.faq?.items ?? [] })
      )}
    />
  );
}

/* Die Leiste, die NUR die Redaktion sieht: Draft Mode ist an, also ist
   diese Anfrage eine Vorschau aus dem Backoffice. Besucher bekommen die
   gecachte Seite ohne dieses Element. Nackte <a>, kein LocaleLink — beide
   Ziele liegen außerhalb der Sprachpfade. */
function PreviewBar({ draft, slug }) {
  return (
    <div
      role="status"
      className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-4 rounded-full border border-champagne/60 bg-espresso/90 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory shadow-lift backdrop-blur-md"
    >
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-champagne" />
        {draft ? "Vorschau · Entwurf" : "Vorschau"}
      </span>
      <a
        href={`/admin/magazin/${slug}`}
        className="text-champagne transition-colors duration-300 hover:text-ivory"
      >
        Bearbeiten
      </a>
      <a
        href="/api/admin/interviews/preview/exit?to=/admin/magazin"
        className="text-ivory/60 transition-colors duration-300 hover:text-ivory"
      >
        Vorschau beenden
      </a>
    </div>
  );
}

export default async function InterviewPage({ params }) {
  const dict = await getDictionary(params.locale);
  const interview = await findInterview(dict, params.slug, params.locale);
  const preview = draftMode().isEnabled;

  /* Entwürfe sind für Besucher nicht vorhanden — nicht bloß unsichtbar.
     Nur die Vorschau der Redaktion (Draft Mode) sieht sie. */
  if (!interview || (interview.draft && !preview)) notFound();

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
      {preview && <PreviewBar draft={interview.draft} slug={interview.slug} />}
    </>
  );
}
