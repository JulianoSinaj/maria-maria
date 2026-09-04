import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { buildDerivatives, derivativeSummary } from "@/lib/media/derivatives";

/* Mockup upload — writes into data/uploads/<slug>/ (OUTSIDE public/, because
   `next start` snapshots public/ at build time and would 404 anything added
   afterwards). Files are served back through ../file/[name].
   Dev/mock quality: no image processing, a 4 MB cap, extension whitelist and
   a hard filename sanitise so nothing can escape the wine's directory. */
export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9-]+$/;
const EXT_RE = /\.(png|jpe?g|webp|avif)$/i;
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request, { params }) {
  const { slug } = params;
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  /* only wines that actually exist (have a packshot dir) accept uploads */
  try {
    await fs.access(path.join(process.cwd(), "public", "img", "wines", slug));
  } catch {
    return NextResponse.json({ error: `No asset directory for "${slug}"` }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const { name, dataUrl } = body ?? {};
  if (typeof name !== "string" || typeof dataUrl !== "string") {
    return NextResponse.json({ error: "name and dataUrl are required" }, { status: 422 });
  }

  /* strip any path components, then whitelist the remaining characters */
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

  const uploads = path.join(process.cwd(), "data", "uploads", slug);
  await fs.mkdir(uploads, { recursive: true });
  /* suffix with a counter rather than overwriting a same-named file */
  let file = base;
  let n = 1;
  while (
    await fs.access(path.join(uploads, file)).then(() => true, () => false)
  ) {
    file = base.replace(EXT_RE, (ext) => `-${n}${ext}`);
    n += 1;
  }
  await fs.writeFile(path.join(uploads, file), buf);

  /* Responsive WebP + AVIF beside the original, with the settings the build
     scripts use — see lib/media/derivatives.js. */
  const webBase = `/api/admin/assets/${slug}/file`;
  const assetPath = `${webBase}/${file}`;
  const derivatives = await buildDerivatives({ dir: uploads, file, webBase, assetPath });

  return NextResponse.json(
    {
      data: {
        name: file,
        path: assetPath,
        size: buf.length,
        uploaded: true,
        derivatives: derivativeSummary(derivatives),
      },
    },
    { status: 201 },
  );
}
