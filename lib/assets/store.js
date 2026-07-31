/* Bottle-asset configurator state.
   ==================================================================
   Per-wine presentation config: which mockup asset the storefront should
   lead with, how the preview is composed (single bottle vs. bundle), the
   accent-overlay treatment and where the corkscrew prop sits. Same
   in-memory singleton semantics as lib/inventory/store.js — restarting the
   server resets it; swapping in a database means reimplementing this file.

   Coordinates are stored as PERCENTAGES of the preview stage (opener.x/y =
   the prop's centre), so a config survives any stage pixel size. */

const MODES = ["single", "bundle"];

export function defaultConfig(slug, defaultAsset) {
  return {
    slug,
    asset: defaultAsset,
    mode: "single",
    accent: { enabled: true, opacity: 0.35 },
    /* bottom-right of the stage — well clear of both logo zones */
    opener: { visible: true, x: 78, y: 74 },
  };
}

/* on globalThis for the same reason as the inventory store: `next dev` builds
   each route into its own module graph, and a per-module Map would split the
   state between the config route and the upload route */
globalThis.__mmAssetConfigs ??= new Map();
const configs = globalThis.__mmAssetConfigs;

export const getConfig = (slug) => configs.get(slug) ?? null;

/** Structural validation of a config patch. Empty array = valid. */
export function validatePatch(slug, patch) {
  const errs = [];
  const num01 = (v) => typeof v === "number" && v >= 0 && v <= 1;
  const pct = (v) => typeof v === "number" && v >= 0 && v <= 100;

  if (patch.asset !== undefined) {
    /* three legal sources: the wine's tracked packshots under public/, its
       own mock uploads, or a wine-agnostic gallery upload. Another wine's
       packshot stays illegal — a Lugana photo must not land on a Primitivo. */
    const legal =
      typeof patch.asset === "string" &&
      !patch.asset.includes("..") &&
      (patch.asset.startsWith(`/img/wines/${slug}/`) ||
        patch.asset.startsWith(`/api/admin/assets/${slug}/file/`) ||
        patch.asset.startsWith("/api/admin/gallery/file/"));
    if (!legal) {
      errs.push(
        `asset must be under /img/wines/${slug}/, /api/admin/assets/${slug}/file/ or /api/admin/gallery/file/`,
      );
    }
  }
  if (patch.mode !== undefined && !MODES.includes(patch.mode)) {
    errs.push(`mode must be one of ${MODES.join(", ")}`);
  }
  if (patch.accent !== undefined) {
    if (patch.accent.enabled !== undefined && typeof patch.accent.enabled !== "boolean")
      errs.push("accent.enabled must be a boolean");
    if (patch.accent.opacity !== undefined && !num01(patch.accent.opacity))
      errs.push("accent.opacity must be a number between 0 and 1");
  }
  if (patch.opener !== undefined) {
    if (patch.opener.visible !== undefined && typeof patch.opener.visible !== "boolean")
      errs.push("opener.visible must be a boolean");
    if (patch.opener.x !== undefined && !pct(patch.opener.x))
      errs.push("opener.x must be a percentage between 0 and 100");
    if (patch.opener.y !== undefined && !pct(patch.opener.y))
      errs.push("opener.y must be a percentage between 0 and 100");
  }
  return errs;
}

/** Merge a validated patch over the current (or default) config and store it. */
export function putConfig(slug, patch, base) {
  const current = configs.get(slug) ?? base;
  const next = {
    ...current,
    ...patch,
    slug,
    accent: { ...current.accent, ...(patch.accent ?? {}) },
    opener: { ...current.opener, ...(patch.opener ?? {}) },
  };
  configs.set(slug, next);
  return next;
}

/** Reset a single wine (or everything) — used by tests. */
export function resetConfigs(slug) {
  if (slug) configs.delete(slug);
  else configs.clear();
}
