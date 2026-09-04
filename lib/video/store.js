import { jsonStore } from "@/lib/admin/jsonStore";
import { VIDEO_SLOTS, defaultVideoConfig, videoSlot } from "./slots";

/* Video-loop configuration — state and persistence.
   ==================================================================
   Server-only (writes data/admin/video.json). Catalogue and validation are in
   ./slots.js, which the client imports.

   Same rule as the page heroes: only edits are stored, so an untouched slot
   always reports what the storefront actually ships. */

const store = jsonStore("video", () => ({ version: 1, slots: {} }));

function merge(key, stored) {
  const base = defaultVideoConfig(key);
  if (!base) return null;
  if (!stored) return base;
  return {
    ...base,
    ...stored,
    focus: { ...base.focus, ...(stored.focus ?? {}) },
    key,
  };
}

export async function getVideoConfigs() {
  const doc = await store.read();
  return VIDEO_SLOTS.map((slot) => merge(slot.key, doc.slots?.[slot.key]));
}

export async function getVideoConfig(key) {
  const doc = await store.read();
  return merge(key, doc.slots?.[key]);
}

export async function putVideoConfig(key, patch) {
  if (!videoSlot(key)) return null;

  const doc = await store.update((current) => {
    const slots = current.slots ?? {};
    const previous = slots[key] ?? {};
    const next = { ...previous };

    for (const field of ["src", "poster", "rate"]) {
      if (patch[field] !== undefined) next[field] = patch[field];
    }
    if (patch.focus !== undefined) {
      next.focus = { ...previous.focus, ...patch.focus };
    }

    return { ...current, version: 1, slots: { ...slots, [key]: next } };
  });

  return merge(key, doc.slots[key]);
}

export async function resetVideoConfig(key) {
  if (!key) {
    await store.reset();
    return;
  }
  await store.update((current) => {
    const slots = { ...(current.slots ?? {}) };
    delete slots[key];
    return { ...current, slots };
  });
}
