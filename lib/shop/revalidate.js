/* Die Weinseiten neu bauen lassen, wenn sich ein Shop-Handle geändert hat.

   Die neun Weinseiten sind statisch vorgerendert: In ihrem HTML steht die
   Adresse, die zur BAUZEIT galt. Trägt die Redaktion einen neuen Handle ein,
   ändert das sofort die Auflösung im laufenden Prozess (handleFor in
   lib/shop/config.js) — aber nicht das bereits erzeugte HTML. Ohne diesen
   Anstoß zeigte der Knopf „Im Shop entdecken" bis zum nächsten Deploy
   weiter auf die tote Adresse, und die Korrektur im Backoffice wäre
   folgenlos geblieben.

   revalidatePath mit dem ROUTENMUSTER (nicht mit einer konkreten Adresse)
   trifft alle Sprachen und alle neun Slugs auf einmal — die Alternative
   wären 36 einzelne Aufrufe, die alle vier Locale-Segmente kennen müssten.

   Der Aufruf ist nur in einer Route bzw. Server Action erlaubt; außerhalb
   wirft Next. Deshalb der Fangblock: Ein misslungenes Revalidieren darf das
   Speichern nicht scheitern lassen — der Handle ist dann gesetzt, nur das
   HTML hinkt bis zum nächsten Build hinterher. */

import { revalidatePath } from "next/cache";

export function revalidateWinePages() {
  try {
    /* Die Detailseiten — dort sitzen Hero, Subnav, Maria-Moment und
       CTA-Band, die alle shopHref(slug) benutzen. */
    revalidatePath("/[locale]/unsere-weine/[slug]", "page");
    /* Die Übersicht verlinkt ebenfalls in den Shop. */
    revalidatePath("/[locale]/unsere-weine", "page");
    return true;
  } catch {
    return false;
  }
}
