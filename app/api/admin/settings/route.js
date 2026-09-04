import { NextResponse } from "next/server";
import { organizationNode } from "@/lib/seo/jsonLd";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { applyIdentityToNode, isSettingsGroup } from "@/lib/settings/schema";
import {
  effectiveBusiness,
  effectiveSocial,
  getSettingsRecord,
  putSettings,
  resetSettings,
} from "@/lib/settings/store";

/* Einstellungen-API — Firma, Social, SEO und Weiterleitungen.

   GET    /api/admin/settings              der ganze Datensatz (Saat + Wert)
   GET    /api/admin/settings?locale=it    dieselbe Antwort, Vorschau auf Italienisch
   PUT    /api/admin/settings              partieller Patch, eine bis vier Gruppen
   DELETE /api/admin/settings?group=firma  eine Gruppe zurück auf den Code
   DELETE /api/admin/settings              alles zurück auf den Code

   Der Store ist ein Prozess-Singleton mit Datei dahinter — niemals statisch
   optimieren, sonst friert Next die Antwort zur Bauzeit ein. */
export const dynamic = "force-dynamic";

const fail = (error, status = 400, extra) =>
  NextResponse.json({ error, ...(extra ?? {}) }, { status });

/* Die Vorschau der strukturierten Daten.

   Gebaut wird sie vom ECHTEN organizationNode() aus lib/seo/jsonLd.js —
   nicht von einer nachgebauten Fassung. Der Knoten liest seine Werte aus
   den Konstanten in lib/site.js; die Einstellungen werden anschließend
   darüber gelegt (applyIdentityToNode). So stammt die Struktur immer aus
   der Quelle, die die Seite tatsächlich ausliefert, und nur die Werte
   kommen von hier. Eine handgeschriebene Kopie des Knotens wäre am Tag
   ihrer Erstellung richtig und danach nie wieder. */
async function structuredDataPreview(locale) {
  const description = await orgDescription(locale);
  const node = organizationNode({ description });
  return applyIdentityToNode(node, effectiveBusiness(), effectiveSocial());
}

/* meta.orgDescription der gewählten Sprache — sie beschreibt das
   Unternehmen im Graphen und reist je Sprachfassung mit. */
const META = {
  de: () => import("@/content/de/meta"),
  it: () => import("@/content/it/meta"),
  en: () => import("@/content/en/meta"),
  cs: () => import("@/content/cs/meta"),
};

async function orgDescription(locale) {
  const load = META[locale] ?? META[DEFAULT_LOCALE];
  const mod = await load();
  const meta = mod.meta ?? mod.default ?? {};
  return meta.orgDescription ?? "";
}

export async function GET(request) {
  const locale = request.nextUrl.searchParams.get("locale") ?? DEFAULT_LOCALE;
  if (!isLocale(locale)) return fail(`Unknown locale "${locale}"`, 400);

  const data = await getSettingsRecord();
  return NextResponse.json({
    data: { ...data, jsonLd: await structuredDataPreview(locale), previewLocale: locale },
  });
}

export async function PUT(request) {
  let patch;
  try {
    patch = await request.json();
  } catch {
    return fail("Request body must be valid JSON");
  }
  if (patch === null || typeof patch !== "object" || Array.isArray(patch)) {
    return fail("Request body must be an object", 422);
  }

  const { errors } = await putSettings(patch);
  if (errors?.length) return fail(errors.join("; "), 422, { details: errors });

  const locale = request.nextUrl.searchParams.get("locale") ?? DEFAULT_LOCALE;
  const data = await getSettingsRecord();
  return NextResponse.json({
    data: {
      ...data,
      jsonLd: await structuredDataPreview(isLocale(locale) ? locale : DEFAULT_LOCALE),
      previewLocale: isLocale(locale) ? locale : DEFAULT_LOCALE,
    },
  });
}

export async function DELETE(request) {
  const group = request.nextUrl.searchParams.get("group");
  if (group && !isSettingsGroup(group)) return fail(`Unknown settings group "${group}"`, 422);

  resetSettings(group ?? undefined);

  const data = await getSettingsRecord();
  return NextResponse.json({
    data: { ...data, jsonLd: await structuredDataPreview(DEFAULT_LOCALE), previewLocale: DEFAULT_LOCALE },
  });
}
