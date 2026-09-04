import { LOCALE_META } from "@/lib/i18n/config";
import { resolveDocument } from "./store";

/* Was die drei Rechtsseiten rendern — Code oder Backoffice, in einer Zeile.

   Die Seiten unter app/(site)/[locale]/{impressum,datenschutz,agb} lasen
   bisher `dict.legal.<typ>` direkt. Sie lesen weiterhin denselben Text,
   nur nicht mehr zwingend aus der Datei: Liegt im Archiv (lib/legal/store)
   eine gepflegte Fassung, gilt die. Ist dort nichts, IST das Ergebnis die
   Inhaltsdatei, Zeichen für Zeichen — eine unbearbeitete Seite sieht also
   exakt aus wie vorher.

   Dazu kommen die zwei Daten, die eine Rechtsseite glaubwürdig machen:

     „Stand:"          wann der Text zuletzt GEÄNDERT wurde. Solange er der
                       Code ist, bleibt die statische Angabe aus der
                       Inhaltsdatei stehen („Juli 2026") — ein Build-Datum
                       wäre an dieser Stelle eine schlechtere Antwort als
                       die, die der Jurist aufgeschrieben hat.
     „Zuletzt geprüft:" wann zuletzt jemand HINGESEHEN und bestätigt hat,
                       dass der Text noch stimmt. Das ist die häufigere
                       Tätigkeit — eine Prüfung ohne Änderung —, und ohne
                       eigenes Datum bliebe sie unsichtbar.

   Beide Daten werden in der Sprache der Seite formatiert, nicht in der des
   Backoffice: Sie stehen auf der öffentlichen Seite. */

const intlTag = (locale) => LOCALE_META[locale]?.htmlLang ?? locale;

/* „September 2026" — der Monat genügt für einen Stand, und ein tagesgenaues
   Änderungsdatum würde eine Aktualität behaupten, die eine Kommakorrektur
   nicht rechtfertigt. */
const monthYear = (locale, iso) =>
  new Intl.DateTimeFormat(intlTag(locale), { month: "long", year: "numeric" }).format(new Date(iso));

/* Die Prüfung dagegen ist tagesgenau — sie ist ein Vorgang, kein Zeitraum.
   Mittags-UTC, damit ein reines Datum nicht je nach Zeitzone einen Tag
   zurückrutscht. */
const fullDay = (locale, iso) =>
  new Intl.DateTimeFormat(intlTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00Z`));

/**
 * Die Props für LegalShell — Titel, Lede, Abschnitte und die beiden Daten.
 *
 * @param {"impressum"|"datenschutz"|"agb"} type
 * @param {string} locale
 * @param {object} fallback  dict.legal[type], falls das Archiv nichts liefert
 */
export async function legalPageContent(type, locale, fallback) {
  const doc = await resolveDocument(type, locale);
  if (!doc) return { ...fallback, updated: undefined, reviewed: undefined };

  return {
    title: doc.title,
    intro: doc.intro,
    sections: doc.sections,
    /* undefined und nicht null: LegalShell fällt damit auf `shell.updated`
       zurück, ohne die Fallunterscheidung zu kennen */
    updated: doc.updatedAt ? monthYear(locale, doc.updatedAt) : undefined,
    reviewed: doc.reviewedAt ? fullDay(locale, doc.reviewedAt) : undefined,
  };
}
