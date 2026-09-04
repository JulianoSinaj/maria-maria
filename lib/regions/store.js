/* Der Regionen-Store — Sichtbarkeit und Weinzuordnung je Herkunft.
   ==========================================================================
   Anders als die übrigen Admin-Stores hält dieser seinen Zustand NICHT nur
   in `globalThis`. Der Grund ist der Inhalt: Wer eine Herkunft auf Entwurf
   setzt, nimmt sie öffentlich vom Netz. Ein Neustart, der das vergisst,
   stellt sie stillschweigend wieder online — der eine Zustand, in dem ein
   verlorener Speicher nicht „nur" Arbeit kostet, sondern das Gegenteil
   dessen tut, was jemand angeordnet hat.

   Deshalb: JSON-Datei unter data/regions.json, im Prozess gepuffert.
   `data/` ist git-ignoriert (dort liegen auch die Uploads und das Passwort
   der Kundin) und muss auf dem Server ein dauerhaftes Volume sein. Ist das
   Dateisystem schreibgeschützt — der Normalfall auf Vercel außerhalb von
   /tmp —, bleibt der Zustand im Speicher gültig und die API meldet
   `persisted: false`, statt den Schreibfehler als Speicherfehler
   auszugeben. Das Panel sagt es dann, statt es zu verschweigen.

   Nur Server: liest und schreibt Dateien. Der Editor spricht über
   /api/admin/regions, die gemeinsamen Regeln stehen in ./schema.js. */

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  REGION_KEYS,
  PUBLISH,
  PUBLISH_STATES,
  defaultRegionsConfig,
  defaultRegionState,
} from "./schema";

if (typeof window !== "undefined") {
  throw new Error(
    "lib/regions/store ist serverseitig — im Browser stattdessen /api/admin/regions " +
      "aufrufen und die Regeln aus lib/regions/schema importieren.",
  );
}

const FILE = path.join(process.cwd(), "data", "regions.json");

/* Ein Store pro Prozess: `next dev` baut jede Route in ihren eigenen
   Modulgraphen, eine modul-lokale Variable läge sonst mehrfach vor und die
   API-Route schriebe in eine andere Kopie, als die Seite liest. */
globalThis.__mmRegionsStore ??= { config: null, loaded: false, persisted: true };
const state = globalThis.__mmRegionsStore;

/* Was von der Platte kommt, ist Eingabe wie jede andere: eine von Hand
   editierte oder halb geschriebene Datei darf die Seite nicht umwerfen.
   Deshalb wird gelesen und dann Feld für Feld auf die bekannte Form
   gebracht, statt dem Inhalt zu glauben. */
function sanitise(raw) {
  const out = defaultRegionsConfig();
  for (const key of REGION_KEYS) {
    const entry = raw?.regions?.[key];
    if (!entry) continue;

    const stateValue = entry.publish?.state;
    if (PUBLISH_STATES.includes(stateValue)) out[key].publish.state = stateValue;

    const scheduledAt = entry.publish?.scheduledAt;
    if (typeof scheduledAt === "string" && !Number.isNaN(Date.parse(scheduledAt))) {
      out[key].publish.scheduledAt = scheduledAt;
    }
    /* „geplant" ohne gültiges Datum kann nicht fällig werden und wäre ein
       dauerhaft unsichtbarer Zustand — zurück auf Entwurf, das ist die
       ehrliche Lesart. */
    if (out[key].publish.state === PUBLISH.SCHEDULED && !out[key].publish.scheduledAt) {
      out[key].publish.state = PUBLISH.DRAFT;
    }

    if (Array.isArray(entry.wines)) {
      out[key].wines = entry.wines.filter((slug) => typeof slug === "string");
    }
  }
  return out;
}

async function load() {
  if (state.loaded) return state.config;
  try {
    state.config = sanitise(JSON.parse(await fs.readFile(FILE, "utf8")));
  } catch {
    /* Nicht da, unlesbar, kein JSON — dieselbe Antwort: die Vorgaben. Ein
       fehlender Store ist der Normalzustand einer frischen Installation,
       kein Fehler. */
    state.config = defaultRegionsConfig();
  }
  state.loaded = true;
  return state.config;
}

async function persist(config) {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, `${JSON.stringify({ version: 1, regions: config }, null, 2)}\n`, "utf8");
    state.persisted = true;
  } catch {
    /* Schreibgeschütztes Dateisystem: der Zustand gilt im Prozess weiter,
       überlebt aber den nächsten Neustart nicht. Das meldet die API. */
    state.persisted = false;
  }
  return state.persisted;
}

/** Der gültige Zustand aller Herkünfte. */
export async function getRegionsConfig() {
  return structuredClone(await load());
}

/** Wurde der letzte Schreibvorgang dauerhaft gespeichert? */
export const isPersisted = () => state.persisted;

/** Teil-Patch einmischen (regions.<key>.publish / .wines) und speichern. */
export async function putRegionsConfig(patch) {
  const current = await load();
  const next = defaultRegionsConfig();

  for (const key of REGION_KEYS) {
    const base = current[key] ?? defaultRegionState();
    const over = patch?.regions?.[key] ?? {};

    next[key] = {
      publish: { ...base.publish, ...(over.publish ?? {}) },
      /* `null` ist hier eine Aussage und kein fehlender Wert: „zurück zur
         Aufteilung des Katalogs". Deshalb wird auf `undefined` geprüft. */
      wines: over.wines === undefined ? base.wines : over.wines,
    };

    /* Wer auf live oder Entwurf schaltet, lässt den alten Termin nicht als
       Blindgänger stehen — er würde beim nächsten Wechsel auf „geplant"
       wieder auftauchen und niemand erwartete ihn. */
    if (next[key].publish.state !== PUBLISH.SCHEDULED) next[key].publish.scheduledAt = null;
  }

  state.config = next;
  state.loaded = true;
  await persist(next);
  return structuredClone(next);
}

/** Zurück auf die Vorgaben — alles live, Zuordnung nach Katalog. */
export async function resetRegionsConfig() {
  state.config = defaultRegionsConfig();
  state.loaded = true;
  await persist(state.config);
  return structuredClone(state.config);
}
