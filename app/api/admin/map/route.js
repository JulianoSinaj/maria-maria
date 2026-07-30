import { NextResponse } from "next/server";
import {
  getMapConfig,
  putMapConfig,
  defaultMapConfig,
  validateMapPatch,
  labelBalance,
} from "@/lib/map/store";

/* Italy-map overlay config API. `balance` rides along with every response so
   the UI's balance indicator can never disagree with the stored state. */
export const dynamic = "force-dynamic";

const envelope = (config) => ({ data: { config, balance: labelBalance(config) } });

/** GET /api/admin/map  (?fresh=1 → defaults, ignoring stored) */
export async function GET(request) {
  const fresh = request.nextUrl.searchParams.get("fresh") === "1";
  return NextResponse.json(envelope(fresh ? defaultMapConfig() : getMapConfig()));
}

/** PUT /api/admin/map — partial config update. */
export async function PUT(request) {
  let patch;
  try {
    patch = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const errs = validateMapPatch(patch);
  if (errs.length) {
    return NextResponse.json({ error: errs.join("; "), details: errs }, { status: 422 });
  }

  return NextResponse.json(envelope(putMapConfig(patch)));
}
