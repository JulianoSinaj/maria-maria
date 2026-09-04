import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/config";
import { isLegalType } from "@/lib/legal/schema";
import { overview, persistenceMode, restoreRevision } from "@/lib/legal/store";
import { currentUser } from "@/lib/admin/credentials";
import { revalidateLegal } from "@/lib/legal/revalidate";

/* POST /api/admin/legal/restore  { type, locale, revision }

   Eine frühere Fassung wieder online stellen. Bewusst ein POST: Es legt
   etwas an — eine NEUE Fassung, die festhält, aus welcher sie stammt. Die
   Geschichte wird dabei nicht zurückgedreht, und genau das macht sie als
   Nachweis brauchbar: Aus dem Verlauf bleibt ablesbar, dass an diesem Tag
   auf einen älteren Stand zurückgegangen wurde. */
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const { type, locale, revision } = body ?? {};
  if (!isLegalType(type)) {
    return NextResponse.json({ error: `Unknown document type "${type}"` }, { status: 422 });
  }
  if (!isLocale(locale)) {
    return NextResponse.json({ error: `Unknown locale "${locale}"` }, { status: 422 });
  }
  if (!Number.isInteger(Number(revision))) {
    return NextResponse.json({ error: "revision must be a number" }, { status: 422 });
  }

  try {
    const record = await restoreRevision(type, locale, Number(revision), {
      who: await currentUser(),
    });
    revalidateLegal(type);
    return NextResponse.json({
      data: { ...record, persistence: persistenceMode(), documents: await overview() },
    });
  } catch (err) {
    if (err?.code === "VALIDATION") {
      return NextResponse.json({ error: err.message, details: err.details }, { status: 422 });
    }
    throw err;
  }
}
