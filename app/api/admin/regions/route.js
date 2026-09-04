import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LOCALES } from "@/lib/i18n/config";
import { getBySlug } from "@/lib/inventory/store";
import { WINES } from "@/components/data";
import {
  REGION_KEYS,
  CATALOGUE_REGION,
  defaultWines,
  defaultRegionsConfig,
  effectiveState,
  isVisible,
  resolveWines,
  unassignedWines,
  validateRegionsPatch,
} from "@/lib/regions/schema";
import {
  getRegionsConfig,
  putRegionsConfig,
  resetRegionsConfig,
  isPersisted,
} from "@/lib/regions/store";

/* Herkünfte — Sichtbarkeit und Weinzuordnung.

   GET  /api/admin/regions           Zustand, Katalog und Anzeigetexte
   GET  /api/admin/regions?fresh=1   die Vorgaben, ohne den Store zu ändern
   PUT  /api/admin/regions           Teil-Patch (regions.<key>.publish/.wines)
   DELETE /api/admin/regions         zurück auf die Vorgaben

   Der Text der Herkünfte gehört NICHT hierher — er wird im Seiten-Editor
   gepflegt. Was diese Route mitliefert, sind Namen und Rubriken als
   ANZEIGETEXT für Panel und Vorschau, gelesen über getDictionary(). Damit
   zeigt die Vorschau automatisch das, was im Seiten-Editor zuletzt
   gespeichert wurde, sobald dessen Merge in getDictionary greift — ohne
   dass diese Route davon wissen muss. */
export const dynamic = "force-dynamic";

/* Die beiden Seiten, auf denen eine Herkunft erscheint. Beide sind statisch
   vorgerendert; ohne diesen Anstoß bliebe ein Entwurf bis zum nächsten
   Deploy sichtbar — also genau so lange, wie er es nicht sein soll.
   Muster UND konkrete Pfade, weil Deutsch präfixlos an der Wurzel liegt und
   intern auf /de/… umgeschrieben wird. */
const ROUTES = ["/[locale]", "/[locale]/regionen"];

function revalidateRegions() {
  for (const route of ROUTES) {
    try {
      revalidatePath(route, "page");
    } catch {
      /* außerhalb eines Request-Kontexts (Tests importieren die Route nicht) */
    }
    for (const locale of LOCALES) {
      try {
        revalidatePath(route.replace("[locale]", locale));
      } catch {
        /* dito */
      }
    }
    try {
      revalidatePath(route.replace("/[locale]", "") || "/");
    } catch {
      /* dito */
    }
  }
}

/* Anzeigetexte je Sprache — read-only, siehe Kopf. */
async function copyByLocale() {
  const out = {};
  for (const locale of LOCALES) {
    const dict = await getDictionary(locale);
    out[locale] = Object.fromEntries(
      REGION_KEYS.map((key) => {
        const page = dict.regionen?.regions?.[key] ?? {};
        const home = dict.home?.regions?.items?.[key] ?? {};
        return [
          key,
          {
            page: { name: page.name ?? "", tag: page.tag ?? "", label: page.label ?? "" },
            home: {
              name: home.name ?? "",
              tag: home.tag ?? "",
              desc: home.desc ?? "",
              long: home.long ?? "",
            },
          },
        ];
      }),
    );
  }
  return out;
}

/* Der Katalog, wie ihn der Zuordnungs-Editor braucht: Name und Weinart aus
   components/data.js, das Anbaugebiet aus dem Bestand. Das Gebiet wird hier
   nur ANGEZEIGT — gepflegt wird es im Portfolio als appellation.zone, wo es
   hingehört; zwei Eingabefelder für dieselbe Angabe wären zwei Wahrheiten. */
function catalogue() {
  return WINES.map((wine) => {
    const item = getBySlug(wine.slug);
    return {
      slug: wine.slug,
      name: wine.name,
      typeKey: wine.typeKey,
      year: wine.year,
      defaultRegion: CATALOGUE_REGION[wine.regionKey] ?? null,
      zone: item?.appellation?.zone ?? null,
      appellation: item?.appellation?.name ?? null,
    };
  });
}

function payload(config, copy) {
  const now = Date.now();
  return {
    regions: REGION_KEYS.map((key) => {
      const region = config[key];
      return {
        key,
        publish: {
          state: region.publish.state,
          scheduledAt: region.publish.scheduledAt,
          effective: effectiveState(region.publish, now),
        },
        visible: isVisible(region.publish, now),
        wines: resolveWines(key, region.wines),
        defaultWines: defaultWines(key),
        /* `custom` sagt dem Panel, ob „Zurücksetzen" überhaupt etwas täte */
        custom: Array.isArray(region.wines),
        copy: Object.fromEntries(LOCALES.map((locale) => [locale, copy[locale][key]])),
      };
    }),
    catalogue: catalogue(),
    unassigned: unassignedWines(config),
    locales: LOCALES,
    persisted: isPersisted(),
  };
}

export async function GET(request) {
  const fresh = request.nextUrl.searchParams.get("fresh") === "1";
  const config = fresh ? defaultRegionsConfig() : await getRegionsConfig();
  return NextResponse.json({ data: payload(config, await copyByLocale()) });
}

export async function PUT(request) {
  let patch;
  try {
    patch = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const errs = validateRegionsPatch(patch);
  if (errs.length) {
    return NextResponse.json({ error: errs.join("; "), details: errs }, { status: 422 });
  }

  const config = await putRegionsConfig(patch);
  revalidateRegions();
  return NextResponse.json({ data: payload(config, await copyByLocale()) });
}

export async function DELETE() {
  const config = await resetRegionsConfig();
  revalidateRegions();
  return NextResponse.json({ data: payload(config, await copyByLocale()) });
}
