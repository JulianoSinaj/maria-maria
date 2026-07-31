import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { GALLERY_KEYS } from "@/lib/gallery/categories";

/* Gallery upload — lands in data/uploads/gallery/<category>/ (outside
   public/, because `next start` snapshots public/ at build time). Same
   contract as the hero/asset uploads: base64 data URL, 4 MB cap, extension
   whitelist, filename sanitised, duplicate names suffixed. */
export const dynamic = "force-dynamic";

const EXT_RE = /\.(png|jpe?g|webp|avif)$/i;
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const { category, name, dataUrl } = body ?? {};
  if (!GALLERY_KEYS.includes(category)) {
    return NextResponse.json(
      { error: `category must be one of ${GALLERY_KEYS.join(", ")}` },
      { status: 422 },
    );
  }
  if (typeof name !== "string" || typeof dataUrl !== "string") {
    return NextResponse.json({ error: "name and dataUrl are required" }, { status: 422 });
  }

  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "-");
  if (!EXT_RE.test(base) || base.startsWith(".")) {
    return NextResponse.json(
      { error: "Only png, jpg, webp or avif files are accepted" },
      { status: 422 },
    );
  }

  const match = dataUrl.match(/^data:image\/(png|jpe?g|webp|avif);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "dataUrl must be a base64 image data URL" }, { status: 422 });
  }
  const buf = Buffer.from(match[2], "base64");
  if (!buf.length || buf.length > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be between 1 byte and 4 MB" }, { status: 422 });
  }

  const dir = path.join(process.cwd(), "data", "uploads", "gallery", category);
  await fs.mkdir(dir, { recursive: true });
  let file = base;
  let n = 1;
  while (await fs.access(path.join(dir, file)).then(() => true, () => false)) {
    file = base.replace(EXT_RE, (ext) => `-${n}${ext}`);
    n += 1;
  }
  await fs.writeFile(path.join(dir, file), buf);

  return NextResponse.json(
    {
      data: {
        name: file,
        path: `/api/admin/gallery/file/${category}/${file}`,
        category,
        size: buf.length,
        uploaded: true,
      },
    },
    { status: 201 },
  );
}
