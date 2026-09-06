import { NextResponse } from "next/server";
import {
  getShowcaseConfig,
  putShowcaseConfig,
  isPersisted,
} from "@/lib/showcase/store";
import { audited } from "@/lib/admin/audited";
import { revalidateRegionPages } from "@/lib/regions/revalidate";
import { defaultShowcaseConfig, validateShowcasePatch } from "@/lib/showcase/schema";

/* Regional-Showcase — Layout-API des Regionen-Explorers. */
export const dynamic = "force-dynamic";


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
export const PUT = audited("showcase.update", async (request, { audit }) => {
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

  /* read before the write: the store merges into what it already holds,
     so a diff taken afterwards would compare the new state with itself */
  const before = structuredClone(await getShowcaseConfig());
  const config = await putShowcaseConfig(patch);
  audit({ target: "Regionen-Showcase", before, after: config });

  revalidateRegionPages();
  return NextResponse.json({ data: { config, persisted: isPersisted() } });
});
