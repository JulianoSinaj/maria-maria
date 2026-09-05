import LegalShell from "@/components/legal/LegalShell";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { legalPageContent } from "@/lib/legal/storefront";

/* Rechtstext-Seite — Struktur in components/legal/LegalShell, Inhalt in
   content/<sprache>/legal.js bzw. aus dem Rechtstext-Archiv des Backoffice.
   Die deutsche Fassung ist die rechtlich verbindliche; die drei
   Übersetzungen weisen über `shell.bindingNotice` sichtbar darauf hin.

   Die Seite rendert DYNAMISCH, und das ist eine Notwendigkeit, keine
   Vorliebe: Das übergeordnete Layout ((site)/[locale]/layout.jsx) setzt
   `dynamicParams = false`, damit /xx/agb keine leere fünfte Sprachversion
   erzeugt. Next prüft diesen Schalter aber nicht pro Segment, sondern für
   die gesamte Route — sobald revalidatePath den vorgerenderten Eintrag
   entwertet, weigert sich Next, ihn neu zu erzeugen, und liefert von da an
   404 in ALLEN vier Sprachen, dauerhaft und über Neustarts hinweg (gemessen
   am 2026-09-05, siehe auch app/(site)/[locale]/magazin/interviews/[slug]).
   Ein im Backoffice geänderter Widerrufsparagraf hätte damit nicht die alte
   Fassung gezeigt, sondern gar keine Seite mehr.

   Ohne generateStaticParams und ohne eigenes `dynamicParams` entsteht die
   Seite bei der Anfrage; `revalidate` unten hält sie trotzdem im Cache. */

/* `revalidate` allein genügt hier NICHT: Die Seite bliebe vorgerendert
   (im Build-Report ●), und genau der vorgerenderte Eintrag ist es, den
   revalidatePath entwertet und Next anschließend nicht neu erzeugen darf.
   Gemessen am 2026-09-06: mit `revalidate = 300` allein war /agb nach dem
   ersten Speichern in allen vier Sprachen 404. Erst `force-dynamic` nimmt
   die Seite aus der statischen Erzeugung heraus — sie entsteht dann bei
   jeder Anfrage, wie /admin. Das ist für drei Rechtsseiten mit sehr wenig
   Verkehr der richtige Preis; die Alternative wäre eine Seite, die nach
   jeder Textänderung verschwindet. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "/agb",
    meta: dict.meta.agb,
  });
}

export default async function AgbPage({ params }) {
  const dict = await getDictionary(params.locale);
  /* Der Text kommt aus dem Rechtstext-Archiv, sofern dort einer gepflegt
     wurde — sonst wörtlich aus content/<sprache>/legal.js. Der Aufruf sieht
     in beiden Fällen gleich aus; siehe lib/legal/storefront.js. */
  const doc = await legalPageContent("agb", params.locale, dict.legal.agb);

  return (
    <>
      {/* Unternehmen, Marke, Website — kamen bis August 2026 aus dem
          Root-Layout; seit jede Seite genau einen JSON-LD-Block trägt,
          bringt die Rechtsseite ihn selbst mit. */}
      <SiteJsonLd locale={params.locale} dict={dict} />
      <LegalShell
        shell={dict.legal.shell}
        title={doc.title}
        intro={doc.intro}
        sections={doc.sections}
        updated={doc.updated}
        reviewed={doc.reviewed}
      />
    </>
  );
}
