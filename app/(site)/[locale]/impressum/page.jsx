import LegalShell from "@/components/legal/LegalShell";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";

/* Rechtstext-Seite — Struktur in components/legal/LegalShell, Inhalt in
   content/<sprache>/legal.js. Die deutsche Fassung ist die rechtlich
   verbindliche; die drei Übersetzungen weisen über `shell.bindingNotice`
   sichtbar darauf hin. */

export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "/impressum",
    meta: dict.meta.impressum,
  });
}

export default async function ImpressumPage({ params }) {
  const dict = await getDictionary(params.locale);
  const doc = dict.legal.impressum;

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
      />
    </>
  );
}
