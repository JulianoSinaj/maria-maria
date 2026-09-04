import { revalidatePath } from "next/cache";
import { LOCALES } from "@/lib/i18n/config";

/* Den vorgerenderten Rechtstext auffrischen.

   Die Storefront ist statisch vorgerendert (generateStaticParams im
   Sprach-Layout). Ohne diesen Anstoß bliebe ein gespeicherter Rechtstext bis
   zum nächsten Deploy unsichtbar — bei einer Widerrufsbelehrung ist das
   nicht bloß unbequem, sondern der Unterschied zwischen der Fassung, die
   gilt, und der, die zu sehen ist.

   Muster UND konkrete Pfade: Deutsch liegt präfixlos an der Wurzel (/agb)
   und wird von der Middleware intern auf /de/agb umgeschrieben, es gibt für
   dieselbe Seite also zwei Einträge im Cache. Dieselbe Vorgehensweise wie
   in /api/admin/pages.

   Eine eigene Datei und kein Export aus der Route: Next prüft die Exporte
   eines route.js gegen eine feste Liste — ein zusätzlicher Name daneben ist
   kein sicherer Ort für geteilten Code. */
export function revalidateLegal(type) {
  try {
    revalidatePath(`/[locale]/${type}`, "page");
  } catch {
    /* außerhalb eines Request-Kontexts (Tests importieren die Route nicht) */
  }
  for (const path of [...LOCALES.map((locale) => `/${locale}/${type}`), `/${type}`]) {
    try {
      revalidatePath(path);
    } catch {
      /* dito */
    }
  }
}
