import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

/* Serves uploaded mockups from data/uploads/<slug>/. A dedicated route,
   because public/ is snapshotted at build time by `next start` — this reads
   the disk on every request, so an upload is servable the moment it lands. */
export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9-]+$/;

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export async function GET(_request, { params }) {
  const { slug, name } = params;
  /* basename() collapses any traversal; the extension gates the whitelist */
  const file = path.basename(name);
  const type = MIME[path.extname(file).toLowerCase()];
  if (!SLUG_RE.test(slug) || !type || file.startsWith(".")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  try {
    const buf = await fs.readFile(path.join(process.cwd(), "data", "uploads", slug, file));
    return new NextResponse(buf, {
      headers: { "Content-Type": type, "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: `No such upload "${file}"` }, { status: 404 });
  }
}
