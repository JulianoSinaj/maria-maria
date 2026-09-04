import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  VIDEO_EXTENSIONS,
  VIDEO_SLOTS,
  defaultVideoConfig,
  validateVideoPatch,
  videoSlot,
} from "@/lib/video/slots";
import { getVideoConfig, getVideoConfigs, putVideoConfig, resetVideoConfig } from "@/lib/video/store";
import { assetExists } from "@/lib/media/paths";

/* Video loops and their poster frames.
   ==================================================================
   Three slots (lib/video/slots.js), each a file plus the still that stands in
   for it — while it loads, when autoplay is refused, and permanently for
   anyone who asked for reduced motion.

   The endpoint also enumerates what a slot can be pointed at: the tracked
   files under public/video and the backoffice's own uploads in
   data/uploads/video. Posters come from the media library and are picked
   through /api/admin/gallery, which already scans it. */
export const dynamic = "force-dynamic";

const trackedDir = () => path.join(process.cwd(), "public", "video");
const uploadDir = () => path.join(process.cwd(), "data", "uploads", "video");

async function listVideos() {
  const out = [];

  const read = async (dir, toPath, uploaded) => {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) continue;
      if (!VIDEO_EXTENSIONS.some((ext) => entry.name.toLowerCase().endsWith(ext))) continue;
      const stat = await fs.stat(path.join(dir, entry.name));
      out.push({ name: entry.name, path: toPath(entry.name), size: stat.size, uploaded });
    }
  };

  await read(trackedDir(), (n) => `/video/${n}`, false);
  await read(uploadDir(), (n) => `/api/admin/video/file/${n}`, true);
  return out;
}

/** GET /api/admin/video  (?fresh=1 → the live values, ignoring stored edits) */
export async function GET(request) {
  const fresh = request.nextUrl.searchParams.get("fresh") === "1";
  const configs = fresh ? VIDEO_SLOTS.map((s) => defaultVideoConfig(s.key)) : await getVideoConfigs();

  const slots = await Promise.all(
    VIDEO_SLOTS.map(async (slot, index) => {
      const config = configs[index];
      return {
        key: slot.key,
        route: slot.route,
        source: slot.source,
        ratio: slot.ratio,
        veil: slot.veil,
        ...(slot.usedBy ? { usedBy: slot.usedBy } : {}),
        config,
        live: { ...defaultVideoConfig(slot.key) },
        /* Both halves are checked: a missing poster is the quieter failure and
           the one that hits exactly the visitors who never see the video. */
        missing: {
          video: !(await assetExists(config.src)),
          poster: !(await assetExists(config.poster)),
        },
      };
    }),
  );

  return NextResponse.json({ data: { slots, videos: await listVideos() } });
}

/** PUT /api/admin/video — patch one slot: { key, src?, poster?, rate?, focus? } */
export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const { key, ...patch } = body ?? {};
  if (!videoSlot(key)) {
    return NextResponse.json({ error: `Unknown video slot "${key}"` }, { status: 404 });
  }

  const errs = validateVideoPatch(key, patch);
  if (errs.length) {
    return NextResponse.json({ error: errs.join("; "), details: errs }, { status: 422 });
  }

  for (const field of ["src", "poster"]) {
    if (patch[field] !== undefined && !(await assetExists(patch[field]))) {
      return NextResponse.json({ error: `${field} "${patch[field]}" does not exist` }, { status: 422 });
    }
  }

  return NextResponse.json({ data: { config: await putVideoConfig(key, patch) } });
}

/** DELETE /api/admin/video?key=… — back to what the storefront ships. */
export async function DELETE(request) {
  const key = request.nextUrl.searchParams.get("key");
  if (key && !videoSlot(key)) {
    return NextResponse.json({ error: `Unknown video slot "${key}"` }, { status: 404 });
  }
  await resetVideoConfig(key ?? undefined);
  return NextResponse.json({
    data: { config: key ? await getVideoConfig(key) : null, cleared: key ?? "all" },
  });
}
