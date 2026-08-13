import LegalShell from "@/components/legal/LegalShell";
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
    path: "/agb",
    meta: dict.meta.agb,
  });
}

export default async function AgbPage({ params }) {
  const dict = await getDictionary(params.locale);
  const doc = dict.legal.agb;

  return (
    <LegalShell
      shell={dict.legal.shell}
      title={doc.title}
      intro={doc.intro}
      sections={doc.sections}
    />
  );
}
