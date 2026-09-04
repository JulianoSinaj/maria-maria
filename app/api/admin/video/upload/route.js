import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { VIDEO_EXTENSIONS, VIDEO_MAX_BYTES, VIDEO_MIME } from "@/lib/video/slots";

/* Video upload — lands in data/uploads/video/, served back through
   ../file/[name].
   ==================================================================
   The image uploads in this backoffice take a base64 data URL inside a JSON
   body. That is fine for a 4 MB photo and wrong for a video: base64 inflates
   by a third, and the whole string has to be held in memory twice — as JSON
   text and as the decoded buffer. A 24 MB panorama would arrive as a 32 MB
   string inside a 32 MB request body.

   So this one takes the file itself as the request body, with the name in a
   header. Same guards as the image uploads, plus one they do not need: the
   first bytes are checked against the container's signature, because an
   extension and a Content-Type are both just claims made by the client. */
export const dynamic = "force-dynamic";

/* MP4 carries "ftyp" at byte 4; Matroska/WebM opens with the EBML magic. */
const SIGNATURES = {
  ".mp4": (buf) => buf.length > 8 && buf.subarray(4, 8).toString("latin1") === "ftyp",
  ".webm": (buf) =>
    buf.length > 4 && buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3,
};

export async function POST(request) {
  const raw = request.headers.get("x-upload-name") ?? "";
  const base = path.basename(raw).replace(/[^a-zA-Z0-9._-]/g, "-");
  const ext = path.extname(base).toLowerCase();

  if (!base || base.startsWith(".") || !VIDEO_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: "X-Upload-Name must be an mp4 or webm filename" },
      { status: 422 },
    );
  }

  const declared = (request.headers.get("content-type") ?? "").split(";")[0].trim();
  if (declared && declared !== VIDEO_MIME[ext] && declared !== "application/octet-stream") {
    return NextResponse.json(
      { error: `Content-Type "${declared}" does not match ${ext}` },
      { status: 415 },
    );
  }

  let buffer;
  try {
    buffer = Buffer.from(await request.arrayBuffer());
  } catch {
    return NextResponse.json({ error: "Request body could not be read" }, { status: 400 });
  }

  if (!buffer.length || buffer.length > VIDEO_MAX_BYTES) {
    return NextResponse.json(
      { error: `Video must be between 1 byte and ${Math.round(VIDEO_MAX_BYTES / 1024 / 1024)} MB` },
      { status: 422 },
    );
  }

  if (!SIGNATURES[ext](buffer)) {
    return NextResponse.json({ error: `This file is not a valid ${ext.slice(1)}` }, { status: 422 });
  }

  const dir = path.join(process.cwd(), "data", "uploads", "video");
  await fs.mkdir(dir, { recursive: true });

  /* Suffix rather than overwrite: a slot may still be pointing at the file
     that is already there under that name. */
  let file = base;
  let n = 1;
  while (await fs.access(path.join(dir, file)).then(() => true, () => false)) {
    file = base.replace(/(\.[^.]+)$/, `-${n}$1`);
    n += 1;
  }
  await fs.writeFile(path.join(dir, file), buffer);

  return NextResponse.json(
    {
      data: {
        name: file,
        path: `/api/admin/video/file/${file}`,
        size: buffer.length,
        uploaded: true,
      },
    },
    { status: 201 },
  );
}
