/* Italy-map overlay config.
   ==================================================================
   Drives the admin's map preview and, once wired, the storefront's
   ItalyMap: per-region highlight colours, the coastal sea backdrop and the
   city labels. Geometry itself lives in components/ItalyMap.jsx and is NOT
   configurable — this store only styles it.

   Defaults reproduce today's storefront exactly (bordeaux #6B0F1A
   highlights, no sea, no labels were rendered before so labels default to
   the house charcoal at equal sizes). Same globalThis singleton semantics
   as the other admin stores: one process, one store, reset on restart. */

export const REGION_KEYS = ["apulien", "kampanien", "garda"];
export const LABEL_KEYS = ["lecce", "napoli", "sirmione"];

export const REGION_META = {
  apulien: { label: "Apulien · Salento", city: "lecce" },
  kampanien: { label: "Kampanien", city: "napoli" },
  garda: { label: "Gardasee", city: "sirmione" },
};

/* label anchors in the map's 240×285 viewBox, placed off the origin dots */
export const LABEL_META = {
  /* anchored end, below-left of the heel — anchored start it would run past
     the 240-unit viewBox edge and clip */
  lecce: { text: "Lecce", x: 212, y: 194, anchor: "end" },
  napoli: { text: "Napoli", x: 150, y: 153, anchor: "end" },
  sirmione: { text: "Sirmione", x: 88, y: 44, anchor: "start" },
};

export function defaultMapConfig() {
  return {
    regions: {
      apulien: { highlight: "#6B0F1A", enabled: true },
      kampanien: { highlight: "#6B0F1A", enabled: true },
      garda: { highlight: "#6B0F1A", enabled: true },
    },
    sea: { visible: false, tone: "#C9E8E1", opacity: 0.55 },
    labels: {
      lecce: { size: 9, color: "#1B1B1B", visible: true },
      napoli: { size: 9, color: "#1B1B1B", visible: true },
      sirmione: { size: 9, color: "#1B1B1B", visible: true },
    },
  };
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const SIZE_MIN = 6;
const SIZE_MAX = 16;

/** Structural validation of a config patch. Empty array = valid. */
export function validateMapPatch(patch) {
  const errs = [];
  const hex = (v, what) => {
    if (!HEX_RE.test(v ?? "")) errs.push(`${what} must be a #rrggbb colour`);
  };

  for (const key of Object.keys(patch.regions ?? {})) {
    if (!REGION_KEYS.includes(key)) {
      errs.push(`unknown region "${key}"`);
      continue;
    }
    const r = patch.regions[key];
    if (r.highlight !== undefined) hex(r.highlight, `regions.${key}.highlight`);
    if (r.enabled !== undefined && typeof r.enabled !== "boolean")
      errs.push(`regions.${key}.enabled must be a boolean`);
  }

  if (patch.sea !== undefined) {
    if (patch.sea.visible !== undefined && typeof patch.sea.visible !== "boolean")
      errs.push("sea.visible must be a boolean");
    if (patch.sea.tone !== undefined) hex(patch.sea.tone, "sea.tone");
    if (
      patch.sea.opacity !== undefined &&
      !(typeof patch.sea.opacity === "number" && patch.sea.opacity >= 0 && patch.sea.opacity <= 1)
    )
      errs.push("sea.opacity must be a number between 0 and 1");
  }

  for (const key of Object.keys(patch.labels ?? {})) {
    if (!LABEL_KEYS.includes(key)) {
      errs.push(`unknown label "${key}"`);
      continue;
    }
    const l = patch.labels[key];
    if (l.color !== undefined) hex(l.color, `labels.${key}.color`);
    if (
      l.size !== undefined &&
      !(typeof l.size === "number" && l.size >= SIZE_MIN && l.size <= SIZE_MAX)
    )
      errs.push(`labels.${key}.size must be between ${SIZE_MIN} and ${SIZE_MAX}`);
    if (l.visible !== undefined && typeof l.visible !== "boolean")
      errs.push(`labels.${key}.visible must be a boolean`);
  }

  return errs;
}

/* one store per process — `next dev` compiles each route into its own module
   graph, so a module-local binding would split state between routes */
globalThis.__mmMapConfig ??= { config: null };
const state = globalThis.__mmMapConfig;

export const getMapConfig = () => state.config ?? defaultMapConfig();

/** Merge a validated patch two levels deep (regions.X, sea, labels.X). */
export function putMapConfig(patch) {
  const cur = getMapConfig();
  const mergeKeyed = (base, over = {}) =>
    Object.fromEntries(
      Object.keys(base).map((k) => [k, { ...base[k], ...(over[k] ?? {}) }]),
    );
  state.config = {
    regions: mergeKeyed(cur.regions, patch.regions),
    sea: { ...cur.sea, ...(patch.sea ?? {}) },
    labels: mergeKeyed(cur.labels, patch.labels),
  };
  return state.config;
}

export function resetMapConfig() {
  state.config = null;
}

/* ---- balance: the label pair the brief calls out ----
   Lecce and Napoli are the two headline cities; they read as one system only
   when their type matches. Balanced = same colour, sizes within 1pt. */
export function labelBalance(config) {
  const a = config.labels.lecce;
  const b = config.labels.napoli;
  const sizeDelta = Math.abs(a.size - b.size);
  const colorMatch = a.color.toLowerCase() === b.color.toLowerCase();
  return {
    balanced: sizeDelta <= 1 && colorMatch,
    sizeDelta,
    colorMatch,
  };
}
