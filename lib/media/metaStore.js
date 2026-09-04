import { jsonStore } from "@/lib/admin/jsonStore";
import { MEDIA_ALT_LOCALES, defaultMeta } from "./rights";

/* Alt text and image rights — state and persistence.
   ==================================================================
   Server-only (writes data/admin/media-meta.json). Keyed by the asset's web
   path, which is what every other admin store already speaks: the same string
   the hero config saves, the gallery copies to the clipboard and the
   storefront would render.

   Entries are only created for assets somebody has actually described. The
   library is scanned from disk (lib/gallery/scan.js) and holds several
   hundred files; a document with an empty record for each of them would be
   mostly noise, and would go stale the moment a file is renamed. */

const store = jsonStore("media-meta", () => ({ version: 1, assets: {} }));

/** Every stored entry, as a path → meta map. Assets nobody described are
    absent; callers fall back to defaultMeta(). */
export async function getAllMeta() {
  const doc = await store.read();
  return doc.assets ?? {};
}

export async function getMeta(assetPath) {
  const assets = await getAllMeta();
  return assets[assetPath] ? { ...defaultMeta(), ...assets[assetPath] } : defaultMeta();
}

/** Merge a validated patch into one asset's entry and persist it. */
export async function putMeta(assetPath, patch) {
  const doc = await store.update((current) => {
    const assets = current.assets ?? {};
    const previous = { ...defaultMeta(), ...(assets[assetPath] ?? {}) };

    const alt = { ...previous.alt };
    for (const locale of MEDIA_ALT_LOCALES) {
      if (patch.alt && locale in patch.alt) alt[locale] = patch.alt[locale];
    }

    const next = {
      ...previous,
      ...patch,
      alt,
      updatedAt: new Date().toISOString(),
    };

    return { ...current, version: 1, assets: { ...assets, [assetPath]: next } };
  });

  return { ...defaultMeta(), ...doc.assets[assetPath] };
}

/** Drop one asset's entry (or the whole document). */
export async function resetMeta(assetPath) {
  if (!assetPath) {
    await store.reset();
    return;
  }
  await store.update((current) => {
    const assets = { ...(current.assets ?? {}) };
    delete assets[assetPath];
    return { ...current, assets };
  });
}
