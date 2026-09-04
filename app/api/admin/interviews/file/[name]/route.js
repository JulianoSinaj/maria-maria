import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { UPLOAD_DIR } from "@/lib/interviews/files";

/* Serves uploaded interview images from data/uploads/interviews/.

   Public on purpose — the middleware exempts every /api/admin/<x>/file/
   address from the session check (UPLOADED_FILE), because these files are
   what the live article shows to readers. A day of cache with a week of
   stale-while-revalidate, the same policy next.config.js gives /img/*:
   the file name is fixed, a replaced motif keeps its name, so the cache
   must not be immutable. */
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
    const buf = await fs.readFile(path.join(UPLOAD_DIR(), file));
    return new NextResponse(buf, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: `No such upload "${file}"` }, { status: 404 });
  }
}
