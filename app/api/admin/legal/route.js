import { NextResponse } from "next/server";
import { LOCALES, isLocale } from "@/lib/i18n/config";
import { LEGAL_TYPES, isLegalType } from "@/lib/legal/schema";
import {
  getRecord,
  getRevision,
  getShell,
  overview,
  persistenceMode,
  resetDocument,
  saveDocument,
} from "@/lib/legal/store";
import { currentUser } from "@/lib/admin/credentials";
import { revalidateLegal } from "@/lib/legal/revalidate";

/* Rechtstexte-Editor API — Impressum, Datenschutz und AGB je Sprache.

   GET    /api/admin/legal                            Manifest: zwölf Dokumente mit Stand
   GET    /api/admin/legal?type=agb&locale=de         Dokument, Code-Fassung, Fassungsliste
   GET    /api/admin/legal?type=agb&locale=de&revision=3   Text einer alten Fassung
   PUT    /api/admin/legal  { type, locale, title, intro?, sections, reviewedAt? }
   DELETE /api/admin/legal?type=agb&locale=de         zurück zum Code

   Wiederherstellen liegt daneben in ./restore — es ist ein POST, weil es
   etwas anlegt (eine neue Fassung), und kein Ersatz für ein PUT. */
export const dynamic = "force-dynamic";

const fail = (error, status = 400, extra) =>
  NextResponse.json({ error, ...(extra ?? {}) }, { status });

/** Beide Parameter, einmal geprüft. Gibt einen Fehler-Response ODER die Werte. */
function params(searchParams) {
  const type = searchParams.get("type");
  const locale = searchParams.get("locale");
  if (!isLegalType(type)) return { error: fail(`Unknown document type "${type}"`, 404) };
  if (!isLocale(locale)) return { error: fail(`Unknown locale "${locale}"`, 400) };
  return { type, locale };
}

export async function GET(request) {
  const search = request.nextUrl.searchParams;

  /* ohne Parameter: das Manifest, aus dem der Editor seine Reiter baut */
  if (!search.get("type") && !search.get("locale")) {
    return NextResponse.json({
      data: {
        types: LEGAL_TYPES,
        locales: LOCALES,
        documents: await overview(),
        persistence: persistenceMode(),
      },
    });
  }

  const { type, locale, error } = params(search);
  if (error) return error;

  const revision = search.get("revision");
  if (revision !== null) {
    const found = await getRevision(type, locale, revision);
    if (!found) return fail(`Unknown revision ${revision} for ${type}/${locale}`, 404);
    return NextResponse.json({ data: { type, locale, revision: found } });
  }

  return NextResponse.json({
    data: {
      ...(await getRecord(type, locale)),
      /* der Rahmen der Seite (Kicker, „Stand:", Kontaktzeile) — die Vorschau
         soll aussehen wie die Seite, editiert wird er hier nicht */
      shell: await getShell(locale),
      persistence: persistenceMode(),
    },
  });
}

export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Request body must be valid JSON");
  }

  const { type, locale } = body ?? {};
  if (!isLegalType(type)) return fail(`Unknown document type "${type}"`, 422);
  if (!isLocale(locale)) return fail(`Unknown locale "${locale}"`, 422);

  try {
    const record = await saveDocument(type, locale, body, { who: await currentUser() });
    revalidateLegal(type);
    return NextResponse.json({
      data: { ...record, persistence: persistenceMode(), documents: await overview() },
    });
  } catch (err) {
    if (err?.code === "VALIDATION") return fail(err.message, 422, { details: err.details });
    throw err;
  }
}

export async function DELETE(request) {
  const { type, locale, error } = params(request.nextUrl.searchParams);
  if (error) return error;

  const record = await resetDocument(type, locale, { who: await currentUser() });
  revalidateLegal(type);
  return NextResponse.json({
    data: { ...record, persistence: persistenceMode(), documents: await overview() },
  });
}
