import { NextResponse } from "next/server";
import { getById, remove, rename, update } from "@/lib/faq/store";
import { revalidateGroup } from "@/lib/faq/revalidate";

/* One question.

   GET    /api/admin/faq/<id>
   PATCH  /api/admin/faq/<id>   { text: { de: { q, a, link } }, status, subgroup … }
   PATCH  /api/admin/faq/<id>   { action: "rename", id: "neue-id", force?: true }
   DELETE /api/admin/faq/<id>

   Renaming is its own action rather than a patchable field: the id is the
   page anchor, the deep-link target and the faq_id in GA4, so changing it
   on a published question breaks links that exist. The store refuses
   unless `force` says the operator has seen the warning. */
export const dynamic = "force-dynamic";

const fail = (error, status = 400, extra) =>
  NextResponse.json({ error, ...(extra ?? {}) }, { status });

const failure = (err) => {
  if (err.code === "VALIDATION") return fail(err.message, 422, { details: err.details });
  if (err.code === "CONFLICT") return fail(err.message, 409);
  if (err.code === "ID_LOCKED") return fail(err.message, 409, { code: err.code });
  throw err;
};

export async function GET(_request, { params }) {
  const item = getById(params.id);
  return item ? NextResponse.json({ data: item }) : fail(`Unknown question "${params.id}"`, 404);
}

export async function PATCH(request, { params }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Request body must be valid JSON");
  }

  const current = getById(params.id);
  if (!current) return fail(`Unknown question "${params.id}"`, 404);

  try {
    if (body?.action === "rename") {
      const item = rename(params.id, body.id, { force: body.force === true });
      revalidateGroup(item.group);
      return NextResponse.json({ data: item });
    }

    const item = update(params.id, body ?? {});
    if (!item) return fail(`Unknown question "${params.id}"`, 404);
    revalidateGroup(item.group);
    /* a moved question changes two pages */
    if (item.group !== current.group) revalidateGroup(current.group);
    return NextResponse.json({ data: item });
  } catch (err) {
    return failure(err);
  }
}

export async function DELETE(_request, { params }) {
  const current = getById(params.id);
  if (!current) return fail(`Unknown question "${params.id}"`, 404);
  remove(params.id);
  revalidateGroup(current.group);
  return new NextResponse(null, { status: 204 });
}
