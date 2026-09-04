/* Die Herkünfte, wie die Storefront sie sieht.
   ==========================================================================
   Eine Stelle, an der Struktur (Anker, Foto, Bildausschnitt — im Code der
   jeweiligen Seite), Text (content/<sprache>/, gepflegt im Seiten-Editor)
   und Zustand (dieser Store: sichtbar? welche Weine?) zusammenkommen.

   Die Reihenfolge ist die des Aufrufers: Die Seiten führen ihre Herkünfte
   in der Reihenfolge, in der sie dort stehen sollen. Dieser Helfer sortiert
   nicht um, er filtert und hängt an.

   Server-seitig: liest den Store, der eine Datei liest. Beide Seiten, die
   ihn benutzen (/ und /regionen), sind statisch vorgerendert — nach jedem
   Speichern stößt /api/admin/regions sie über revalidatePath neu an. */

import { getRegionsConfig } from "./store";
import { effectiveState, isVisible, resolveWines } from "./schema";

/**
 * Struktur + Zustand zusammenführen.
 *
 * @param {Array<{key: string}>} shape  Die Herkünfte der Seite, in ihrer
 *   Reihenfolge — jedes Element behält alles, was es mitbringt.
 * @param {Object} [options]
 * @param {boolean} [options.includeHidden] Entwürfe mitliefern (Vorschau).
 * @returns Dieselben Objekte, ergänzt um `publish`, `visible` und `wines`;
 *   unsichtbare Herkünfte fehlen, sofern nicht ausdrücklich verlangt.
 */
export async function withRegionState(shape, { includeHidden = false } = {}) {
  const config = await getRegionsConfig();
  const now = Date.now();

  return shape
    .map((entry) => {
      const region = config[entry.key];
      return {
        ...entry,
        publish: {
          state: region?.publish?.state ?? "live",
          scheduledAt: region?.publish?.scheduledAt ?? null,
          effective: effectiveState(region?.publish, now),
        },
        visible: isVisible(region?.publish, now),
        wines: resolveWines(entry.key, region?.wines),
      };
    })
    .filter((entry) => includeHidden || entry.visible);
}
