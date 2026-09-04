import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { buildDerivatives, derivativeSummary } from "@/lib/media/derivatives";

/* Hero background upload — same contract as the bottle-asset upload:
   base64 data URL in, file lands in data/uploads/hero/ (outside public/),
   served back through ../file/[name]. 4 MB cap, extension whitelist,
   filename sanitised so nothing escapes the upload directory. */
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

  const { name, dataUrl } = body ?? {};
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

  const uploads = path.join(process.cwd(), "data", "uploads", "hero");
  await fs.mkdir(uploads, { recursive: true });
  let file = base;
  let n = 1;
  while (await fs.access(path.join(uploads, file)).then(() => true, () => false)) {
    file = base.replace(EXT_RE, (ext) => `-${n}${ext}`);
    n += 1;
  }
  await fs.writeFile(path.join(uploads, file), buf);

  /* The storefront never serves an original — every tracked photo goes out as
     a WebP of roughly the width it is shown at. Uploads used to be the one
     exception: a 4 MB phone photo assigned as a hero background reached
     visitors as a 4 MB phone photo. Now the same ladder the build scripts
     produce is written beside the file, plus AVIF. Details and the graceful
     path when sharp is missing: lib/media/derivatives.js. */
  const assetPath = `/api/admin/hero/file/${file}`;
  const derivatives = await buildDerivatives({
    dir: uploads,
    file,
    webBase: "/api/admin/hero/file",
    assetPath,
  });

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
