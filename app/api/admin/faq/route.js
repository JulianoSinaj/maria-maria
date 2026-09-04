import { NextResponse } from "next/server";
import {
  create,
  groupSummaries,
  list,
  persistenceMode,
  putSubgroup,
  removeSubgroup,
  reorder,
  stats,
} from "@/lib/faq/store";
import { revalidateGroup } from "@/lib/faq/revalidate";
import { FAQ_LOCALES, LIMITS } from "@/lib/faq/schema";

/* FAQ API — collection endpoints of the question editor.

   GET    /api/admin/faq                     groups, counts, languages
   GET    /api/admin/faq?group=kontakt       the questions of one group
   POST   /api/admin/faq                     create a question
   PATCH  /api/admin/faq                     reorder a cluster, or edit a cluster label
   DELETE /api/admin/faq?group=&subgroup=    remove an empty cluster

   Behind the same guard as every other /api/admin route (middleware.js).
   The store is a process singleton reading a JSON file, so this route must
   never be statically optimised. */
export const dynamic = "force-dynamic";

const fail = (error, status = 400, extra) =>
  NextResponse.json({ error, ...(extra ?? {}) }, { status });

const failure = (err) => {
  if (err.code === "VALIDATION") return fail(err.message, 422, { details: err.details });
  if (err.code === "CONFLICT") return fail(err.message, 409);
  if (err.code === "ID_LOCKED") return fail(err.message, 409, { code: err.code });
  throw err;
};

/** Everything the editor's rail needs, plus the store's honesty about disk. */
const manifest = () => ({
  groups: groupSummaries(),
  locales: FAQ_LOCALES,
  limits: LIMITS,
  persistence: persistenceMode(),
  ...stats(),
});

export async function GET(request) {
  const p = request.nextUrl.searchParams;

  if (p.get("view") === "groups") return NextResponse.json({ data: manifest() });

  const group = p.get("group") ?? undefined;
  const items = list({
    group,
    status: p.get("status") ?? undefined,
    search: p.get("search") ?? undefined,
    incomplete: p.get("incomplete") ?? undefined,
  });

  return NextResponse.json({ data: items, meta: { count: items.length, ...manifest() } });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Request body must be valid JSON");
  }

  try {
    const item = create(body);
    revalidateGroup(item.group);
    return NextResponse.json({ data: item, meta: manifest() }, { status: 201 });
  } catch (err) {
    return failure(err);
  }
}

/** PATCH — two cluster operations, told apart by `action`.

    { action: "reorder",  group, subgroup, ids: [...] }
    { action: "subgroup", group, key, label: { de, it, en, cs }, order? } */
export async function PATCH(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Request body must be valid JSON");
  }

  const { action, group } = body ?? {};
  if (typeof group !== "string") return fail("group is required", 422);

  try {
    if (action === "reorder") {
      const items = reorder(group, body.subgroup ?? null, body.ids);
      revalidateGroup(group);
      return NextResponse.json({ data: items, meta: manifest() });
    }

    if (action === "subgroup") {
      const subgroups = putSubgroup(group, body.key, { label: body.label, order: body.order });
      revalidateGroup(group);
      return NextResponse.json({ data: subgroups, meta: manifest() });
    }
  } catch (err) {
    return failure(err);
  }

  return fail(`Unknown action "${action}"`, 422);
}

export async function DELETE(request) {
  const p = request.nextUrl.searchParams;
  const group = p.get("group");
  const subgroup = p.get("subgroup");
  if (!group || !subgroup) return fail("group and subgroup are required", 422);

  try {
    const removed = removeSubgroup(group, subgroup);
    if (!removed) return fail(`Unknown cluster "${subgroup}" in group "${group}"`, 404);
    revalidateGroup(group);
    return NextResponse.json({ data: { group, subgroup }, meta: manifest() });
  } catch (err) {
    return failure(err);
  }
}
