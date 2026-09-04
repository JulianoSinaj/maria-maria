/* Regional-Showcase — das Layout des Regionen-Explorers.
   ==================================================================
   Steuert, wie sich die drei Herkunftskarten auf der Startseite verhalten:
   das Aufziehen unter dem Cursor am Desktop und die Bauform auf dem
   Telefon. Die Vorgaben bilden das ab, was heute ausgeliefert wird
   (components/home/RegionExplorer.jsx) — eine unangetastete Konfiguration
   heißt also „genau die Seite von heute".

   layout.desktop.grow entspricht der GROW-Konstante der Komponente: das
   Flex-Gewicht der offenen Karte gegen 1 je Nachbar (10.5 ≈ die offene
   Karte landet auf der 2.2:1-Bühne bei ~16:9).

   layout.mobile.variant:
     "stack" — das Verhalten von heute: gestapelte Karten, Tippen klappt auf
     "rail"  — waagerechte Schiene, die Karten werden seitlich gewischt

   TEXT STEHT HIER NICHT MEHR. Bis September 2026 führte dieser Store die
   deutschen Namen, Rubriken und Beschreibungen der drei Herkünfte — als
   zweite Fassung neben content/<sprache>/home.js, und nur auf Deutsch. Der
   Seiten-Editor (/admin/seiten) pflegt jetzt genau diese Felder in allen
   vier Sprachen an ihrer Quelle; eine zweite Kopie hier hätte über kurz
   oder lang etwas anderes behauptet als die Seite. Was bleibt, ist das,
   was kein Text ist: Bauform und Bewegung.

   Seit die Startseite diese Konfiguration WIRKLICH liest, überlebt sie den
   Neustart. Solange sie nur die Vorschau im Panel steuerte, war ein
   vergessener Wert folgenlos — jetzt wäre er eine Startseite, die
   stillschweigend in die Vorgabe zurückfällt. Also: JSON-Datei unter
   data/showcase.json, im Prozess gepuffert, und bei schreibgeschütztem
   Dateisystem (Vercel außerhalb von /tmp) gilt der Zustand wenigstens im
   laufenden Prozess weiter — `isPersisted()` sagt, was davon zutrifft.

   Nur Server. Die gemeinsamen Regeln stehen in ./schema.js, das auch der
   Konfigurator im Browser liest. */

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  GROW_MIN,
  GROW_MAX,
  MOBILE_VARIANTS,
  defaultShowcaseConfig,
} from "./schema";

if (typeof window !== "undefined") {
  throw new Error(
    "lib/showcase/store ist serverseitig — im Browser stattdessen /api/admin/showcase " +
      "aufrufen und die Konstanten aus lib/showcase/schema importieren.",
  );
}

const FILE = path.join(process.cwd(), "data", "showcase.json");

/* Ein Store pro Prozess: `next dev` baut jede Route in ihren eigenen
   Modulgraphen, eine modul-lokale Variable läge sonst mehrfach vor. */
globalThis.__mmShowcaseConfig ??= { config: null, loaded: false, persisted: true };
const state = globalThis.__mmShowcaseConfig;

/* Was von der Platte kommt, wird auf die bekannte Form gebracht statt
   geglaubt — eine von Hand editierte Datei darf die Startseite nicht
   umwerfen. */
function sanitise(raw) {
  const out = defaultShowcaseConfig();
  const d = raw?.layout?.desktop ?? {};
  if (typeof d.hoverExpand === "boolean") out.layout.desktop.hoverExpand = d.hoverExpand;
  if (typeof d.grow === "number" && d.grow >= GROW_MIN && d.grow <= GROW_MAX) {
    out.layout.desktop.grow = d.grow;
  }
  const variant = raw?.layout?.mobile?.variant;
  if (MOBILE_VARIANTS.includes(variant)) out.layout.mobile.variant = variant;
  return out;
}

async function load() {
  if (state.loaded) return state.config;
  try {
    state.config = sanitise(JSON.parse(await fs.readFile(FILE, "utf8")));
  } catch {
    /* nicht da, unlesbar, kein JSON — die Vorgaben, also die Seite von heute */
    state.config = defaultShowcaseConfig();
  }
  state.loaded = true;
  return state.config;
}

async function persist(config) {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, `${JSON.stringify({ version: 1, ...config }, null, 2)}\n`, "utf8");
    state.persisted = true;
  } catch {
    state.persisted = false;
  }
  return state.persisted;
}

/** Wurde der letzte Schreibvorgang dauerhaft gespeichert? */
export const isPersisted = () => state.persisted;

export async function getShowcaseConfig() {
  return structuredClone(await load());
}

/** Merge a validated patch (layout.desktop / layout.mobile). */
export async function putShowcaseConfig(patch) {
  const cur = await load();
  state.config = {
    layout: {
      desktop: { ...cur.layout.desktop, ...(patch.layout?.desktop ?? {}) },
      mobile: { ...cur.layout.mobile, ...(patch.layout?.mobile ?? {}) },
    },
  };
  state.loaded = true;
  await persist(state.config);
  return structuredClone(state.config);
}

export async function resetShowcaseConfig() {
  state.config = defaultShowcaseConfig();
  state.loaded = true;
  await persist(state.config);
  return structuredClone(state.config);
}

/* Weiterhin von hier re-exportiert, damit bestehende Server-Importe
   (API-Route, Tests) eine Adresse behalten. Client-Komponenten importieren
   aus ./schema — dieses Modul zieht `node:fs` nach sich. */
export {
  SHOWCASE_REGION_KEYS,
  MOBILE_VARIANTS,
  GROW_MIN,
  GROW_MAX,
  SHOWCASE_META,
  defaultShowcaseConfig,
  validateShowcasePatch,
} from "./schema";
