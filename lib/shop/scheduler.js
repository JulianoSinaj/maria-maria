/* Der nächtliche Abgleich — im Prozess, ohne fremden Dienst.
   ==================================================================
   Die Anforderung lautet „ein nächtlicher Lauf". Dieses Projekt läuft als
   ein einzelner Node-Container hinter Coolify (nixpacks.toml); es gibt
   keinen Cron-Dienst, keine Vercel-Crons und keine Job-Queue, in die sich
   etwas eintragen ließe. Ein Timer im laufenden Prozess ist deshalb nicht
   die schwächere Lösung, sondern die einzige, die ohne zusätzliche
   Infrastruktur zuverlässig läuft — und sie ist beim ersten Deploy da,
   ohne dass jemand im Panel etwas einrichten muss.

   Wer lieber von außen anstößt (Coolify Scheduled Task, systemd-Timer,
   Uptime-Monitor), nimmt /api/cron/shop-sync mit CRON_SECRET und schaltet
   diesen Timer mit SHOP_SYNC_CRON=0 ab. Beide Wege rufen dieselbe Funktion.

   Was der Timer NICHT kann, offen gesagt: Ein Container, der nachts nicht
   läuft (Scale-to-zero), führt den Lauf nicht aus, und bei mehreren
   Instanzen läuft er mehrfach. Das erste ist hier nicht der Fall, das
   zweite ist folgenlos — der Abgleich ist idempotent, er liest fremde
   Preise und schreibt sie auf. */

import { syncAllWines } from "./sync";

/* Kurz nach drei. Der Shop ist um diese Zeit unbelastet, und die Redaktion
   findet den Stand morgens vor, ohne dass ihr jemand beim Arbeiten in die
   Daten schreibt. Die krumme Minute ist Absicht: Punkt drei ist die Zeit,
   zu der jeder zweite Job der Welt startet. */
const HOUR = 3;
const MINUTE = 17;

const DAY_MS = 24 * 60 * 60 * 1000;

/* Millisekunden bis zum nächsten Lauf — in LOKALER Zeit des Containers, mit
   Sommerzeit, weil `setDate/setHours` auf einem Date-Objekt rechnen und
   nicht auf einer festen Zahl von Millisekunden. */
function untilNextRun(now = new Date()) {
  const next = new Date(now);
  next.setHours(HOUR, MINUTE, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}

/** Soll der Timer laufen? Produktion ja, Entwicklung nur auf Ansage —
    sonst spräche jeder `next dev` beim Start mit einem fremden Shop. */
export function nightlySyncEnabled() {
  const flag = process.env.SHOP_SYNC_CRON;
  if (flag === "0" || flag === "false") return false;
  if (flag === "1" || flag === "true") return true;
  return process.env.NODE_ENV === "production";
}

/* Ein Prozess, ein Timer. `next build` und der laufende Server importieren
   dieses Modul unter Umständen mehrfach; ohne diese Sperre stünden am Ende
   mehrere Wecker auf dieselbe Uhrzeit. */
const g = globalThis;

export function startNightlyShopSync() {
  if (!nightlySyncEnabled()) return null;
  if (g.__mmShopSyncTimer) return g.__mmShopSyncTimer;

  const schedule = (delay) => {
    const timer = setTimeout(async () => {
      try {
        const run = await syncAllWines();
        console.log(
          `[shop-sync] ${run.checked} Weine geprüft — ${run.ok} ok, ${run.missing} nicht gefunden, ${run.error} Fehler (${run.durationMs} ms)`,
        );
        if (run.renamed.length) {
          for (const entry of run.renamed) {
            console.warn(`[shop-sync] „${entry.name}" wird weitergeleitet: ${entry.handle} → ${entry.resolvedHandle}`);
          }
        }
      } catch (error) {
        /* Ein gescheiterter Lauf darf den nächsten nicht verhindern — sonst
           beendet ein einzelner Netzfehler den Abgleich für immer. */
        console.error("[shop-sync] Lauf fehlgeschlagen:", error?.message ?? error);
      }
      schedule(DAY_MS);
    }, delay);

    /* unref: Der Wecker hält den Prozess nicht am Leben. Ohne das würde ein
       Container beim Herunterfahren bis zu 24 Stunden auf diesen Timer
       warten. */
    timer.unref?.();
    g.__mmShopSyncTimer = timer;
    return timer;
  };

  const delay = untilNextRun();
  console.log(`[shop-sync] nächtlicher Abgleich aktiv — nächster Lauf in ${Math.round(delay / 60000)} min`);
  return schedule(delay);
}
