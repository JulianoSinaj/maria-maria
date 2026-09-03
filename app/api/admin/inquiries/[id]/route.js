import { NextResponse } from "next/server";
import { getById, update, remove } from "@/lib/inquiries/store";

/* Inquiries API — single-record endpoints. */
export const dynamic = "force-dynamic";

const notFound = (id) =>
  NextResponse.json({ error: `No inquiry with id "${id}"` }, { status: 404 });

/** GET /api/admin/inquiries/:id */
export async function GET(_request, { params }) {
  const item = getById(params.id);
  return item ? NextResponse.json({ data: item }) : notFound(params.id);
}

/** PATCH /api/admin/inquiries/:id
    Body: `{ status?: "neu"|"in_bearbeitung"|"beantwortet"|"abgelehnt", notes?: string }`.
    Only the desk's own fields are writable — what the visitor wrote is a
    record, not a draft. Anything else in the body is ignored. */
export async function PATCH(request, { params }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const patch = {};
  if (body && "status" in body) patch.status = body.status;
  if (body && "notes" in body) patch.notes = body.notes;
  if (!Object.keys(patch).length) {
    return NextResponse.json(
      { error: "Nothing to update: send `status` and/or `notes`" },
      { status: 422 },
    );
  }

  try {
    const item = update(params.id, patch);
    return item ? NextResponse.json({ data: item }) : notFound(params.id);
  } catch (err) {
    if (err.code === "VALIDATION") {
      return NextResponse.json({ error: err.message, details: err.details }, { status: 422 });
    }
    throw err;
  }
}

/** DELETE /api/admin/inquiries/:id */
export async function DELETE(_request, { params }) {
  return remove(params.id) ? new NextResponse(null, { status: 204 }) : notFound(params.id);
}
