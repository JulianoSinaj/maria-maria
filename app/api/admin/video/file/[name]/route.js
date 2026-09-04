import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { VIDEO_MIME } from "@/lib/video/slots";

/* Serves uploaded loops from data/uploads/video/.
   ==================================================================
   Like the other upload file routes, and for the same reason: `next start`
   snapshots public/ at build time, so anything written afterwards has to be
   read off the disk per request.

   Unlike them, this one answers RANGE REQUESTS. A <video> element does not
   simply download its source: it asks for the first few hundred kilobytes,
   reads the container header and then seeks. Safari refuses to play a source
   that answers a Range request with the whole file, and every browser
   downloads far more than it needs. Twenty lines here are the difference
   between a preview that plays and one that spins.

   These addresses are exempt from the backoffice guard (UPLOADED_FILE in
   middleware.js) — an uploaded file that a public page renders is website,
   not backoffice. */
export const dynamic = "force-dynamic";

const RANGE = /^bytes=(\d*)-(\d*)$/;

export async function GET(request, { params }) {
  const file = path.basename(params.name);
  const type = VIDEO_MIME[path.extname(file).toLowerCase()];
  if (!type || file.startsWith(".")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const absolute = path.join(process.cwd(), "data", "uploads", "video", file);
  let size;
  try {
    size = (await fs.stat(absolute)).size;
  } catch {
    return NextResponse.json({ error: `No such upload "${file}"` }, { status: 404 });
  }

  const headers = {
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store",
  };

  const match = RANGE.exec(request.headers.get("range") ?? "");
  if (!match) {
    return new NextResponse(Readable.toWeb(createReadStream(absolute)), {
      headers: { ...headers, "Content-Length": String(size) },
    });
  }

  /* "bytes=500-" (from here on) and "bytes=-500" (the last 500) are both
     legal spellings, and a browser uses each of them. */
  const [, rawStart, rawEnd] = match;
  const start = rawStart ? Number(rawStart) : Math.max(size - Number(rawEnd || 0), 0);
  const end = rawStart ? Math.min(Number(rawEnd || size - 1), size - 1) : size - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) {
    return new NextResponse(null, {
      status: 416,
      headers: { ...headers, "Content-Range": `bytes */${size}` },
    });
  }

  return new NextResponse(Readable.toWeb(createReadStream(absolute, { start, end })), {
    status: 206,
    headers: {
      ...headers,
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": String(end - start + 1),
    },
  });
}
