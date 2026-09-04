/* Der Abgleichsstand des Partner-Shops auf der Platte.
   ==================================================================
   Was das Backoffice über den Shop weiß — der gepflegte Handle, der zuletzt
   gelesene Preis, die Verfügbarkeit, der Zeitpunkt und der Ausgang des
   letzten Abgleichs —, überlebt hier den Neustart des Servers.

   Warum überhaupt eine Datei, wo der Inventarspeicher doch im Arbeitsspeicher
   liegt? Weil dieser Teil ETWAS ANDERES ist als eine Musterbestandszahl: Der
   Handle ist die Adresse, an der der Kunde kauft. Ginge er beim Deploy
   verloren, fiele jeder Weinlink still auf den Seed zurück — also auf genau
   den Wert, den die Redaktion gerade korrigiert hat, und niemand sähe es.

   Dasselbe Verzeichnis wie die Zugangsdaten und die Uploads: data/. Es ist
   gitignoriert und MUSS auf dem Server ein persistentes Volume sein
   (prod.env.example sagt warum) — sonst ist dieser Speicher so vergänglich
   wie alles andere.

   WARUM DAS DATEISYSTEM NICHT IMPORTIERT WIRD:
   `import … from "node:fs"` wäre das Naheliegende und scheitert hier an
   etwas Konkretem — instrumentation.js zieht dieses Modul, und Next
   übersetzt instrumentation.js AUCH für die Edge-Runtime (weil es eine
   middleware.js gibt). Die Edge-Runtime hat kein Dateisystem, und schon der
   unbenutzte Import bricht die Übersetzung: „Reading from node:fs is not
   handled by plugins". Ein Laufzeit-Zugriff über process.getBuiltinModule
   steht dagegen in keinem Modulgraphen: In Node liefert er das echte fs, in
   der Edge-Runtime gibt es ihn nicht — dort bleibt der Stand eben leer, was
   genau richtig ist, weil dort auch niemand Handles pflegt.

   Node ≥ 22.3 (getBuiltinModule). Das Projekt verlangt ohnehin Node 22
   (package.json engines, nixpacks.toml). */

import { setHandleOverrides } from "./config";
import { isValidHandle } from "./handles";

/* Das Dateisystem, wenn es eines gibt. Einmal beschafft, danach gemerkt. */
let cachedFs;
function nodeFs() {
  if (cachedFs !== undefined) return cachedFs;
  cachedFs = globalThis.process?.getBuiltinModule?.("node:fs") ?? null;
  if (!cachedFs && globalThis.process?.versions?.node) {
    /* Node ohne getBuiltinModule (< 22.3): Der Abgleich funktioniert weiter,
       nur überlebt er den Neustart nicht. Das darf nicht stillschweigend
       passieren — die gepflegten Handles wären sonst nach jedem Deploy weg,
       und niemand wüsste warum. */
    console.warn(
      "[shop] process.getBuiltinModule fehlt (Node < 22.3) — Shop-Handles werden nicht gespeichert.",
    );
  }
  return cachedFs;
}

/* Pfade ohne node:path: zwei Segmente, ein Trenner. Node versteht "/" auch
   unter Windows, und mehr als ein Verzeichnis tief geht es hier nicht. */
const DIR = `${globalThis.process?.cwd?.() ?? "."}/data/shop`;
const FILE = `${DIR}/state.json`;

/* Ein Datensatz je Wein-Slug. `null` heißt durchweg „nicht bekannt" und
   niemals „null Euro" — die Unterscheidung trägt die ganze Anzeige im
   Backoffice: ein unbekannter Preis ist ein Hinweis, ein Preis von 0 wäre
   eine Falschaussage. */
const clean = (entry) => {
  if (!entry || typeof entry !== "object") return null;
  return {
    handle: isValidHandle(entry.handle) ? entry.handle : null,
    price: typeof entry.price === "number" && Number.isFinite(entry.price) ? entry.price : null,
    available: typeof entry.available === "boolean" ? entry.available : null,
    title: typeof entry.title === "string" && entry.title.trim() ? entry.title.trim() : null,
    sync: typeof entry.sync === "string" ? entry.sync : "never",
    syncedAt: typeof entry.syncedAt === "string" ? entry.syncedAt : null,
    error: typeof entry.error === "string" && entry.error.trim() ? entry.error.trim() : null,
  };
};

/** Der gespeicherte Stand, oder ein leeres Objekt. Wirft nie: ein defektes
    oder fehlendes File darf das Backoffice nicht am Starten hindern — dann
    gilt eben der Seed. */
export function readShopState() {
  const fs = nodeFs();
  if (!fs) return {};

  try {
    if (!fs.existsSync(FILE)) return {};
    const parsed = JSON.parse(fs.readFileSync(FILE, "utf8"));
    if (!parsed || typeof parsed !== "object") return {};

    const out = {};
    for (const [slug, entry] of Object.entries(parsed)) {
      const value = clean(entry);
      if (value) out[slug] = value;
    }
    return out;
  } catch {
    return {};
  }
}

/** Schreiben — atomar über eine Zwischendatei, damit ein Absturz mitten im
    Schreiben keine halbe JSON-Datei hinterlässt (die beim nächsten Start
    stillschweigend als „kein Stand" gälte). */
export function writeShopState(state) {
  const fs = nodeFs();
  if (!fs) return false;

  try {
    fs.mkdirSync(DIR, { recursive: true });
    const temporary = `${FILE}.${globalThis.process?.pid ?? "0"}.tmp`;
    fs.writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, "utf8");
    fs.renameSync(temporary, FILE);
    return true;
  } catch {
    /* Kein Wurf: Ein schreibgeschütztes data/ ist ein Betriebsproblem, aber
       kein Grund, die Bearbeitung im Backoffice scheitern zu lassen. Der
       Wert bleibt im Prozess gültig, bis der Container neu startet. */
    return false;
  }
}

/* Die Handles aus dem gespeicherten Stand in die Auflösung von shopHref()
   hängen. Muss laufen, BEVOR die erste Weinseite gerendert wird — dafür gibt
   es instrumentation.js; jeder schreibende Zugriff frischt sie danach mit
   auf. */
export function primeHandleOverrides(state = readShopState()) {
  const overrides = {};
  for (const [slug, entry] of Object.entries(state)) {
    if (entry?.handle) overrides[slug] = entry.handle;
  }
  setHandleOverrides(overrides);
  return overrides;
}

/* Weicht ein gepflegter Handle von dem ab, mit dem die Seiten GEBAUT wurden?

   Dann trägt das statisch erzeugte HTML der Weinseiten noch die alte
   Adresse, und nur ein Revalidieren bringt die Korrektur nach draußen. Nach
   einem Deploy ist das der Normalfall — deshalb prüft die erste
   Backoffice-Anfrage im Prozess genau das (siehe app/api/admin/inventory). */
export function storedHandlesDiffer(defaults) {
  const stored = readShopState();
  for (const [slug, entry] of Object.entries(stored)) {
    if (entry?.handle && entry.handle !== defaults[slug]) return true;
  }
  return false;
}
