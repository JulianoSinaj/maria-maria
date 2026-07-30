import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

/* Serves uploaded hero backgrounds from data/uploads/hero/ — reads the disk
   per request, so an upload is servable the moment it lands. */
export const dynamic = "force-dynamic";

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export async function GET(_request, { params }) {
  const file = path.basename(params.name);
  const type = MIME[path.extname(file).toLowerCase()];
  if (!type || file.startsWith(".")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  try {
    const buf = await fs.readFile(path.join(process.cwd(), "data", "uploads", "hero", file));
    return new NextResponse(buf, {
      headers: { "Content-Type": type, "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: `No such upload "${file}"` }, { status: 404 });
  }
}
