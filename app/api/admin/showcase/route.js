import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { LOCALES } from "@/lib/i18n/config";
import {
  getShowcaseConfig,
  putShowcaseConfig,
  isPersisted,
} from "@/lib/showcase/store";
import { defaultShowcaseConfig, validateShowcasePatch } from "@/lib/showcase/schema";

/* Regional-Showcase — Layout-API des Regionen-Explorers. */
export const dynamic = "force-dynamic";

/* Die Startseite ist statisch vorgerendert und liest diese Konfiguration
   beim Rendern. Ohne den Anstoß bliebe eine gespeicherte Bauform bis zum
   nächsten Deploy unsichtbar. Muster UND konkrete Pfade, weil Deutsch
   präfixlos an der Wurzel liegt und intern auf /de umgeschrieben wird. */
function revalidateHome() {
  const paths = ["/[locale]", ...LOCALES.map((locale) => `/${locale}`), "/"];
  for (const path of paths) {
    try {
      revalidatePath(path, path === "/[locale]" ? "page" : undefined);
    } catch {
      /* außerhalb eines Request-Kontexts (Tests importieren die Route nicht) */
    }
  }
}

/** GET /api/admin/showcase  (?fresh=1 → defaults, ignoring stored) */
export async function GET(request) {
  const fresh = request.nextUrl.searchParams.get("fresh") === "1";
  return NextResponse.json({
    data: {
      config: fresh ? defaultShowcaseConfig() : await getShowcaseConfig(),
      persisted: isPersisted(),
    },
  });
}

/** PUT /api/admin/showcase — partial config update. */
export async function PUT(request) {
  let patch;
  try {
    patch = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const errs = validateShowcasePatch(patch);
  if (errs.length) {
    return NextResponse.json({ error: errs.join("; "), details: errs }, { status: 422 });
  }

  const config = await putShowcaseConfig(patch);
  revalidateHome();
  return NextResponse.json({ data: { config, persisted: isPersisted() } });
}
