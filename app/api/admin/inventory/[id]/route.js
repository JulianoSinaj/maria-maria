import { NextResponse } from "next/server";
import {
  getById,
  update,
  remove,
  commitBottles,
  archive,
  restore,
} from "@/lib/inventory/store";
import { revalidateWinePages } from "@/lib/shop/revalidate";
import { audited } from "@/lib/admin/audited";

/* Mock inventory API — single-item endpoints. */
export const dynamic = "force-dynamic";

const notFound = (id) =>
  NextResponse.json({ error: `No inventory item with id "${id}"` }, { status: 404 });

/** GET /api/admin/inventory/:id */
export async function GET(_request, { params }) {
  const item = getById(params.id);
  return item ? NextResponse.json({ data: item }) : notFound(params.id);
}

/** PATCH /api/admin/inventory/:id
    Body is a partial item; nested objects merge one level deep.
    `{ "commit": n }`     books n bottles against the batch.
    `{ "action": "archive" | "restore" }` toggles the editorial state. */
export const PATCH = audited("inventory.update", async (request, { params, audit }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  /* the state before the write, for the diff the log stores */
  const before = getById(params.id);

  try {
    if (body.action === "archive" || body.action === "restore") {
      const item = (body.action === "archive" ? archive : restore)(params.id);
      if (item) {
        audit({
          target: item.name ?? params.id,
          summary: body.action === "archive" ? "archiviert" : "zurückgeholt",
          changes: { status: { from: before?.status ?? null, to: item.status } },
        });
      }
      return item ? NextResponse.json({ data: item }) : notFound(params.id);
    }
    if (typeof body.commit === "number") {
      const item = commitBottles(params.id, body.commit);
      if (item) {
        audit({
          target: item.name ?? params.id,
          summary: `${body.commit} Flaschen zugeteilt`,
          before,
          after: item,
        });
      }
      return item ? NextResponse.json({ data: item }) : notFound(params.id);
    }
    const item = update(params.id, body);
    if (item) audit({ target: item.name ?? params.id, before, after: item });
    /* The shop handle is the one field on this record that the PUBLIC site
       reads: it is the address behind "Im Shop entdecken". The wine pages
       are statically rendered, so a corrected handle would sit in the store
       without reaching a single visitor until the next deploy. */
    if (item && body.shop && "handle" in body.shop) revalidateWinePages();
    return item ? NextResponse.json({ data: item }) : notFound(params.id);
  } catch (err) {
    if (err.code === "VALIDATION") {
      return NextResponse.json({ error: err.message, details: err.details }, { status: 422 });
    }
    if (err.code === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
});

/** DELETE /api/admin/inventory/:id */
export const DELETE = audited("inventory.delete", async (_request, { params, audit }) => {
  const before = getById(params.id);
  if (!remove(params.id)) return notFound(params.id);

  audit({ target: before?.name ?? params.id, before, after: null });
  return new NextResponse(null, { status: 204 });
});
