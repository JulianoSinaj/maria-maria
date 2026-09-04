/* Regionen — Veröffentlichungsstatus und Weinzuordnung.
   ==========================================================================
   Diese Datei ist reine Struktur: Schlüssel, Zustände, Vorgaben, Prüfung.
   Kein `fs`, kein Server-Import — der Editor im Browser liest sie direkt,
   der Store (./store.js) und die Storefront (./content.js) benutzen
   dieselben Funktionen. Ein zweiter Satz Regeln im Client wäre ein zweiter
   Satz Regeln, der irgendwann abweicht.

   WAS HIER NICHT STEHT: der TEXT der Regionen. Namen, Rubriken,
   Beschreibungen und CTA-Beschriftungen liegen in content/<sprache>/
   (regionen.regions.<key> für die Regionenseite, home.regions.items.<key>
   für den Regionen-Explorer der Startseite) und werden im Seiten-Editor
   (/admin/seiten) in allen vier Sprachen gepflegt. Dieselben Sätze ein
   zweites Mal hier zu führen hieße, zwei Wahrheiten zu pflegen — genau der
   Zustand, den der Seiten-Editor beendet.

   Was hier steht, ist das, was KEIN Text ist:
     · ob eine Herkunft öffentlich sichtbar ist (Entwurf / geplant / live)
     · welche Weine zu ihr gehören und in welcher Reihenfolge */

import { WINES } from "@/components/data";

export const REGION_KEYS = ["apulien", "kampanien", "garda"];

export const isRegionKey = (key) => REGION_KEYS.includes(key);

/* Der Katalog kennt die Herkunft unter eigenen Schlüsseln (components/
   data.js: puglia / campania / garda), die Seiten unter ihren Ankern
   (/regionen#apulien). Beides sind gewachsene Namen, und beide bleiben —
   übersetzt wird an dieser einen Stelle. */
export const CATALOGUE_REGION = { puglia: "apulien", campania: "kampanien", garda: "garda" };

/* ------------------------------------------------------ Veröffentlichung ---- */

/* LIVE      — öffentlich sichtbar, der Normalfall.
   DRAFT     — die Herkunft verschwindet von /regionen und aus dem
               Regionen-Explorer der Startseite, bis sie freigegeben wird.
   SCHEDULED — wie DRAFT, aber mit einem Datum: ab diesem Zeitpunkt ist die
               Herkunft ohne weiteres Zutun live. Ein geplanter Termin ohne
               Datum ist ein Entwurf, kein Versprechen. */
export const PUBLISH = Object.freeze({
  LIVE: "live",
  DRAFT: "draft",
  SCHEDULED: "scheduled",
});

export const PUBLISH_STATES = Object.freeze([PUBLISH.LIVE, PUBLISH.DRAFT, PUBLISH.SCHEDULED]);

/* Der Zustand, der WIRKLICH gilt — „geplant" ist eine Absicht, keine
   Sichtbarkeit. Erst der Vergleich mit der Uhr macht daraus live oder
   Entwurf, und zwar bei jedem Rendern neu: Ein Termin, der während der
   Nacht fällig wird, braucht so keinen Job, der ihn umschaltet. */
export function effectiveState(publish, now = Date.now()) {
  const state = publish?.state ?? PUBLISH.LIVE;
  if (state === PUBLISH.LIVE) return PUBLISH.LIVE;
  if (state === PUBLISH.DRAFT) return PUBLISH.DRAFT;

  const due = Date.parse(publish?.scheduledAt ?? "");
  if (Number.isNaN(due)) return PUBLISH.DRAFT;
  return due <= now ? PUBLISH.LIVE : PUBLISH.DRAFT;
}

/** Sieht ein Besucher diese Herkunft? */
export const isVisible = (publish, now = Date.now()) =>
  effectiveState(publish, now) === PUBLISH.LIVE;

/* -------------------------------------------------------- Weinzuordnung ---- */

/* Ohne Zuordnung gilt der Katalog: jeder Wein liegt bei der Herkunft, die
   sein `regionKey` nennt. `null` im Store heißt deshalb nicht „keine
   Weine", sondern „die Vorgabe des Katalogs" — wer nie etwas zuordnet,
   bekommt automatisch dieselbe Aufteilung wie die Weinübersicht. */
export function defaultWines(key) {
  return WINES.filter((w) => CATALOGUE_REGION[w.regionKey] === key).map((w) => w.slug);
}

/** Die gültige Liste einer Herkunft: eigene Zuordnung, sonst der Katalog. */
export const resolveWines = (key, assigned) =>
  Array.isArray(assigned) ? assigned : defaultWines(key);

/* Der Anbaugebiets-Teil der Zuordnung (Manduria, Irpinien, Sirmione …)
   steht bewusst NICHT hier: er hängt am Wein, nicht an der Herkunft, und
   wird im Portfolio als `appellation.zone` gepflegt. Der Editor zeigt ihn
   je Wein an — geändert wird er an der einen Stelle, an der er lebt. */

export const KNOWN_SLUGS = WINES.map((w) => w.slug);

/* ------------------------------------------------------------- Vorgaben ---- */

export function defaultRegionState() {
  return { publish: { state: PUBLISH.LIVE, scheduledAt: null }, wines: null };
}

export function defaultRegionsConfig() {
  return Object.fromEntries(REGION_KEYS.map((key) => [key, defaultRegionState()]));
}

/* -------------------------------------------------------------- Prüfung ---- */

/** Strukturprüfung eines Patches. Leeres Array = gültig. */
export function validateRegionsPatch(patch) {
  const errs = [];

  for (const key of Object.keys(patch?.regions ?? {})) {
    if (!isRegionKey(key)) {
      errs.push(`unknown region "${key}"`);
      continue;
    }
    const region = patch.regions[key] ?? {};

    if (region.publish !== undefined) {
      const { state, scheduledAt } = region.publish ?? {};
      if (state !== undefined && !PUBLISH_STATES.includes(state)) {
        errs.push(`regions.${key}.publish.state must be one of ${PUBLISH_STATES.join(", ")}`);
      }
      if (scheduledAt !== undefined && scheduledAt !== null) {
        if (typeof scheduledAt !== "string" || Number.isNaN(Date.parse(scheduledAt))) {
          errs.push(`regions.${key}.publish.scheduledAt must be an ISO date or null`);
        }
      }
      /* Ein Termin ohne Datum wäre eine Herkunft, die niemals erscheint —
         der Editor käme in einen Zustand, den er selbst nicht auflösen
         kann, ohne den Status zu wechseln. Lieber hier abweisen. */
      const nextState = state ?? PUBLISH.LIVE;
      const nextDate = scheduledAt === undefined ? undefined : scheduledAt;
      if (nextState === PUBLISH.SCHEDULED && nextDate === null) {
        errs.push(`regions.${key}.publish.scheduledAt is required when the state is "scheduled"`);
      }
    }

    if (region.wines !== undefined && region.wines !== null) {
      if (!Array.isArray(region.wines)) {
        errs.push(`regions.${key}.wines must be an array of catalogue slugs or null`);
      } else {
        const seen = new Set();
        for (const slug of region.wines) {
          if (!KNOWN_SLUGS.includes(slug)) errs.push(`unknown wine "${slug}" in regions.${key}`);
          else if (seen.has(slug)) errs.push(`duplicate wine "${slug}" in regions.${key}`);
          seen.add(slug);
        }
      }
    }
  }

  return errs;
}

/* Weine, die nirgends liegen — die einzige Zuordnungslücke, die der
   Storefront wehtut: ein Wein ohne Herkunft taucht in keiner regionalen
   Auswahl auf. Der Editor warnt damit, statt es den Besucher merken zu
   lassen. */
export function unassignedWines(config) {
  const taken = new Set(REGION_KEYS.flatMap((key) => resolveWines(key, config?.[key]?.wines)));
  return KNOWN_SLUGS.filter((slug) => !taken.has(slug));
}
