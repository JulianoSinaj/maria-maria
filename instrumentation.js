/* Was einmal beim Start des Servers passieren muss.

   Next ruft register() genau einmal je Serverprozess auf, bevor die erste
   Anfrage beantwortet wird. Zwei Dinge hängen daran, beide aus dem
   Shop-Abgleich:

   1. Die gepflegten Produkt-Handles aus data/shop/state.json in die
      Auflösung von shopHref() hängen. Ohne diesen Schritt liefe die erste
      gerenderte Weinseite nach einem Neustart noch auf den Seed-Handle —
      also womöglich auf die Adresse, die die Redaktion gerade korrigiert
      hat.

   2. Den nächtlichen Abgleich stellen (lib/shop/scheduler.js).

   Nur in der Node-Runtime: Die Edge-Runtime hat kein Dateisystem, und die
   Middleware braucht von beidem nichts — sie liest keine Handles.

   Die Importe stehen absichtlich INNERHALB der Funktion: eine statische
   Einbindung von node:fs würde auch in das Edge-Bundle wandern, das Next
   aus dieser Datei ebenfalls erzeugt. */

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { primeHandleOverrides } = await import("./lib/shop/persist");
    primeHandleOverrides();
  } catch (error) {
    console.error("[shop] Handles konnten nicht geladen werden:", error?.message ?? error);
  }

  try {
    const { startNightlyShopSync } = await import("./lib/shop/scheduler");
    startNightlyShopSync();
  } catch (error) {
    console.error("[shop-sync] Zeitplan konnte nicht gestellt werden:", error?.message ?? error);
  }
}
