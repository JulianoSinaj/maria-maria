import { NextResponse } from "next/server";
import { listInterviewImages } from "@/lib/interviews/files";

/* The image picker's library: public/img/magazin (+ one level), the root
   lifestyle shots under public/img, and the admin's own uploads. Scans the
   disk per request — a photo dropped into the folder appears immediately. */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: await listInterviewImages() });
}
