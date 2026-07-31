/* Homepage-hero content config.
   ==================================================================
   Drives the admin's Hero Section Content Manager: which background photo
   the landing hero leads with, its focal anchor, and the brand copy laid
   over it. Defaults reproduce the live homepage hero verbatim
   (components/home/HomeContent.jsx + HomeHeroPhoto.jsx) — an untouched
   config means "exactly what ships today".

   image.focus mirrors HomeHeroPhoto's object-position (58% 42%: bottle
   stays in frame on portrait crops while the figure may leave the cut).

   Same globalThis singleton semantics as the other admin stores. */

/* ---- readability veil (the "left-side white block") ----
   The live hero draws `linear-gradient(to right, ivory/90, ivory/30 35%,
   transparent 70%)` — three hard stops, which is exactly what produces a
   visible vertical band edge on some photos. The configurable veil replaces
   that with an EASED multi-stop ramp: opacity falls along (1-t)^softness
   across `distance` % of the stage, so the fade has no abrupt seam.

   Defaults approximate today's storefront veil closely (peak .9, ~70%
   travel); tone "espresso" turns the light ivory veil into a dark shadow
   overlay for bright photos. */

export const VEIL_TONES = ["ivory", "espresso"];
export const VEIL_RANGES = {
  opacity: { min: 0, max: 1 },
  softness: { min: 0.5, max: 4 },
  distance: { min: 20, max: 100 },
};

const TONE_RGB = { ivory: "247,244,239", espresso: "33,21,17" };

/** CSS background for a veil config — null when the veil is removed.
    Nine eased stops: smooth to the eye, cheap to paint. */
export function veilGradient(veil) {
  if (!veil?.enabled) return null;
  const rgb = TONE_RGB[veil.tone] ?? TONE_RGB.ivory;
  const N = 9;
  const stops = [];
  for (let i = 0; i < N; i += 1) {
    const t = i / (N - 1);
    const alpha = veil.opacity * (1 - t) ** veil.softness;
    stops.push(`rgba(${rgb},${alpha.toFixed(3)}) ${(t * veil.distance).toFixed(1)}%`);
  }
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

export const HERO_LIMITS = {
  eyebrow: 60,
  titleLine1: 40,
  titleLine2: 60,
  lede: 240,
  ctaPrimary: 30,
  ctaSecondary: 30,
};

export function defaultHeroConfig() {
  return {
    image: {
      src: "/img/home/hero-1280.webp",
      focus: { x: 58, y: 42 },
    },
    copy: {
      eyebrow: "Italienische Boutique-Weine",
      titleLine1: "Maria Maria",
      titleLine2: "Il piacere del vino.",
      lede: "Handverlesene Weine kleiner Familienweingüter – für bewusst gewählte Genussmomente, vom Aperitivo bis zum großen Abend.",
      ctaPrimary: "Weine entdecken",
      ctaSecondary: "Zum Shop",
    },
    veil: {
      enabled: true,
      tone: "ivory",
      opacity: 0.9,
      softness: 1.5,
      distance: 70,
    },
  };
}

/** Structural validation of a config patch. Empty array = valid.
    Image existence is checked at the route (it owns the filesystem). */
export function validateHeroPatch(patch) {
  const errs = [];

  if (patch.image !== undefined) {
    const src = patch.image.src;
    if (src !== undefined) {
      /* the whole media library qualifies as a hero background: any tracked
         /img/ asset plus the hero and gallery upload routes. The route still
         verifies the file exists on disk before accepting. */
      const legal =
        typeof src === "string" &&
        !src.includes("..") &&
        (src.startsWith("/img/") ||
          src.startsWith("/api/admin/hero/file/") ||
          src.startsWith("/api/admin/gallery/file/"));
      if (!legal)
        errs.push("image.src must be under /img/ or an upload file route");
    }
    const f = patch.image.focus;
    if (f !== undefined) {
      for (const axis of ["x", "y"]) {
        if (f[axis] !== undefined && !(typeof f[axis] === "number" && f[axis] >= 0 && f[axis] <= 100))
          errs.push(`image.focus.${axis} must be a percentage between 0 and 100`);
      }
    }
  }

  for (const [field, max] of Object.entries(HERO_LIMITS)) {
    const v = patch.copy?.[field];
    if (v === undefined) continue;
    if (typeof v !== "string" || !v.trim()) errs.push(`copy.${field} must be a non-empty string`);
    else if (v.length > max) errs.push(`copy.${field} exceeds ${max} characters (${v.length})`);
  }

  if (patch.veil !== undefined) {
    if (patch.veil.enabled !== undefined && typeof patch.veil.enabled !== "boolean")
      errs.push("veil.enabled must be a boolean");
    if (patch.veil.tone !== undefined && !VEIL_TONES.includes(patch.veil.tone))
      errs.push(`veil.tone must be one of ${VEIL_TONES.join(", ")}`);
    for (const [field, { min, max }] of Object.entries(VEIL_RANGES)) {
      const v = patch.veil[field];
      if (v === undefined) continue;
      if (!(typeof v === "number" && v >= min && v <= max))
        errs.push(`veil.${field} must be a number between ${min} and ${max}`);
    }
  }

  return errs;
}

globalThis.__mmHeroConfig ??= { config: null };
const state = globalThis.__mmHeroConfig;

export const getHeroConfig = () => {
  if (!state.config) return defaultHeroConfig();
  /* a config stored before the veil existed heals to the default veil */
  if (!state.config.veil) state.config.veil = defaultHeroConfig().veil;
  return state.config;
};

/** Merge a validated patch (image / image.focus / copy). */
export function putHeroConfig(patch) {
  const cur = getHeroConfig();
  state.config = {
    image: {
      ...cur.image,
      ...(patch.image ?? {}),
      focus: { ...cur.image.focus, ...(patch.image?.focus ?? {}) },
    },
    copy: { ...cur.copy, ...(patch.copy ?? {}) },
    veil: { ...cur.veil, ...(patch.veil ?? {}) },
  };
  return state.config;
}

export function resetHeroConfig() {
  state.config = null;
}
