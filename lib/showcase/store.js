/* Regional-Showcase layout config.
   ==================================================================
   Drives the admin's configurator for the homepage RegionExplorer: the
   desktop hover-expand behaviour, the mobile layout variant, and the
   editorial copy per region. Defaults reproduce the storefront's REGIONS
   array (components/home/HomeContent.jsx) verbatim, so an untouched config
   means "exactly what ships today".

   layout.desktop.grow mirrors the component's GROW constant — the flex
   weight of the hovered card against 1 for each neighbour (10.5 ≈ the open
   card landing at ~16:9 on the 2.2:1 stage).

   layout.mobile.variant:
     "stack" — today's storefront behaviour: stacked cards, tap to expand
     "rail"  — horizontal snap rail, cards swiped side-to-side by touch

   Same globalThis singleton semantics as the other admin stores. */

export const SHOWCASE_REGION_KEYS = ["apulien", "kampanien", "garda"];
export const MOBILE_VARIANTS = ["stack", "rail"];

export const GROW_MIN = 3;
export const GROW_MAX = 14;

/* editorial field limits — generous, but a hard stop before copy overflows
   the glass detail bar */
export const LIMITS = { name: 40, tag: 60, desc: 120, long: 320 };

/* photo per region — geometry/asset side of the showcase, not editable here */
export const SHOWCASE_META = {
  apulien: { img: "/img/home/region-apulien.webp", pos: "26% 50%" },
  kampanien: { img: "/img/home/region-kampanien.webp", pos: "40% 45%" },
  garda: { img: "/img/home/region-garda.webp", pos: "38% 55%" },
};

export function defaultShowcaseConfig() {
  return {
    layout: {
      desktop: { hoverExpand: true, grow: 10.5 },
      mobile: { variant: "stack" },
    },
    regions: {
      apulien: {
        name: "Apulien",
        tag: "Das Herz des Südens",
        desc: "Die Sonne des Südens und kraftvolle Aromen.",
        long: "Zwischen Salento und Gallipoli reifen Primitivo und Negroamaro unter der Sonne des Südens – kraftvolle, warme Weine mit mediterraner Seele.",
      },
      kampanien: {
        name: "Kampanien",
        tag: "Zwischen Vulkan und Meer",
        desc: "Vulkanische Böden, ursprüngliche Charaktere.",
        long: "Rund um Napoli und Salerno prägen die vulkanischen Böden des Vesuv Weine mit Tiefe und Ursprünglichkeit – von Falanghina bis Aglianico.",
      },
      garda: {
        name: "Gardasee / Lombardei",
        tag: "Eleganz des Nordens",
        desc: "Eleganz, Frische und mineralische Tiefe.",
        long: "Am Südufer des Gardasees entsteht Lugana – ein Weißwein von seltener Eleganz, getragen von Frische und mineralischer Tiefe.",
      },
    },
  };
}

/** Structural validation of a config patch. Empty array = valid. */
export function validateShowcasePatch(patch) {
  const errs = [];

  const d = patch.layout?.desktop;
  if (d) {
    if (d.hoverExpand !== undefined && typeof d.hoverExpand !== "boolean")
      errs.push("layout.desktop.hoverExpand must be a boolean");
    if (
      d.grow !== undefined &&
      !(typeof d.grow === "number" && d.grow >= GROW_MIN && d.grow <= GROW_MAX)
    )
      errs.push(`layout.desktop.grow must be between ${GROW_MIN} and ${GROW_MAX}`);
  }
  const m = patch.layout?.mobile;
  if (m?.variant !== undefined && !MOBILE_VARIANTS.includes(m.variant))
    errs.push(`layout.mobile.variant must be one of ${MOBILE_VARIANTS.join(", ")}`);

  for (const key of Object.keys(patch.regions ?? {})) {
    if (!SHOWCASE_REGION_KEYS.includes(key)) {
      errs.push(`unknown region "${key}"`);
      continue;
    }
    const r = patch.regions[key];
    for (const [field, max] of Object.entries(LIMITS)) {
      const v = r[field];
      if (v === undefined) continue;
      if (typeof v !== "string" || !v.trim())
        errs.push(`regions.${key}.${field} must be a non-empty string`);
      else if (v.length > max)
        errs.push(`regions.${key}.${field} exceeds ${max} characters (${v.length})`);
    }
  }

  return errs;
}

globalThis.__mmShowcaseConfig ??= { config: null };
const state = globalThis.__mmShowcaseConfig;

export const getShowcaseConfig = () => state.config ?? defaultShowcaseConfig();

/** Merge a validated patch (layout.desktop / layout.mobile / regions.X). */
export function putShowcaseConfig(patch) {
  const cur = getShowcaseConfig();
  state.config = {
    layout: {
      desktop: { ...cur.layout.desktop, ...(patch.layout?.desktop ?? {}) },
      mobile: { ...cur.layout.mobile, ...(patch.layout?.mobile ?? {}) },
    },
    regions: Object.fromEntries(
      SHOWCASE_REGION_KEYS.map((k) => [
        k,
        { ...cur.regions[k], ...(patch.regions?.[k] ?? {}) },
      ]),
    ),
  };
  return state.config;
}

export function resetShowcaseConfig() {
  state.config = null;
}
