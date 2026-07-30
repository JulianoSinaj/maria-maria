import { NextResponse } from "next/server";
import {
  getShowcaseConfig,
  putShowcaseConfig,
  defaultShowcaseConfig,
  validateShowcasePatch,
} from "@/lib/showcase/store";

/* Regional-Showcase layout/config API. */
export const dynamic = "force-dynamic";

/** GET /api/admin/showcase  (?fresh=1 → defaults, ignoring stored) */
export async function GET(request) {
  const fresh = request.nextUrl.searchParams.get("fresh") === "1";
  return NextResponse.json({
    data: { config: fresh ? defaultShowcaseConfig() : getShowcaseConfig() },
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

  return NextResponse.json({ data: { config: putShowcaseConfig(patch) } });
}
