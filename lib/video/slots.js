/* The moving pictures of the storefront — catalogue and validation, no state.
   ==================================================================
   Three loops run on the public site, and none of them had an editor: the
   region panorama that carries the whole /regionen hero, and the two pouring
   shots behind the colour chapter of every wine landing page.

   A video loop is never just a file. Each one ships with a POSTER FRAME — the
   still the browser paints while the video is still in flight, on every phone
   that refuses autoplay, and for everyone who has asked for reduced motion
   (RegionHeroVideo pauses the video outright in that case, so the poster is
   what those visitors see for good). A manager that let someone swap the
   video without the poster would quietly break the page for exactly the
   people who need it to work.

   Client-safe (no fs): the UI, the API route and the validator share this
   list. State lives in ./store.js.

   ON EXTRACTING THE POSTER AUTOMATICALLY: decoding a frame out of an MP4
   needs a video decoder — ffmpeg — and there is none in this runtime; sharp
   reads images only. So the poster is chosen from the media library or
   uploaded beside the video, and the UI says so instead of offering a button
   that cannot work. */

export const VIDEO_RATE_RANGE = { min: 0.25, max: 1.5 };
export const VIDEO_FOCUS_RANGE = { min: 0, max: 100 };

/* MP4 (H.264) is what the three files are and what every browser plays.
   WebM is accepted as a second source because it is the one format that can
   be meaningfully smaller at the same quality. */
export const VIDEO_EXTENSIONS = [".mp4", ".webm"];
export const VIDEO_MIME = { ".mp4": "video/mp4", ".webm": "video/webm" };

/* 32 MB. The three live loops are 0.5–2.6 MB; the cap is generous enough for
   a longer panorama and small enough that nobody uploads a master file by
   accident. Worth knowing before this runs on Vercel: their serverless
   request limit is 4.5 MB, so a bigger upload has to go to blob storage
   there — one more thing the mock-upload architecture (data/uploads) owes the
   hand-off. */
export const VIDEO_MAX_BYTES = 32 * 1024 * 1024;

export const VIDEO_SLOTS = [
  {
    key: "regionen",
    route: "/regionen",
    source: "app/(site)/[locale]/regionen/page.jsx",
    component: "components/RegionHeroVideo.jsx",
    /* Full-bleed stage under a dark veil, played at 0.75x to take the hurry
       out of the panorama, and parallaxed at speed 0.08 with overscan. */
    ratio: "16 / 9",
    veil: "dark",
    video: {
      src: "/video/regionen-hero-720.mp4",
      poster: "/img/regions/regionen-hero-poster.webp",
      rate: 0.75,
      focus: { x: 50, y: 50 },
    },
  },
  {
    key: "pour-red",
    route: "/unsere-weine/<rotwein>",
    source: "components/weine/falanghina/ColorBand.jsx",
    component: "components/weine/falanghina/ColorBand.jsx",
    /* The pouring shot of the colour chapter. Five wines lead with it; the
       chapter cross-fades to the still at the seam of the loop, which is why
       poster and video have to be the same take. */
    ratio: "3 / 2",
    veil: "light",
    video: {
      src: "/video/wine-red-720.mp4",
      poster: "/img/pour/wine-red-still.webp",
      rate: 0.55,
      focus: { x: 50, y: 50 },
    },
    /* The caption above the video ("Rubinrot im Glas") is per wine and lives
       in components/weine/<slug>/wineData.js — not a property of the file. */
    usedBy: ["il-rosso-aglianico", "primitivo-14-5", "primitivo-15-5", "primitivo-salento"],
  },
  {
    key: "pour-white",
    route: "/unsere-weine/<weisswein>",
    source: "components/weine/falanghina/ColorBand.jsx",
    component: "components/weine/falanghina/ColorBand.jsx",
    ratio: "3 / 2",
    veil: "light",
    video: {
      src: "/video/wine-white-720.mp4",
      poster: "/img/pour/wine-white-still.webp",
      rate: 0.55,
      focus: { x: 50, y: 50 },
    },
    usedBy: [
      "falanghina",
      "greco-di-tufo",
      "il-bianco-greco-cuvee",
      "lugana",
      "rosato-puglia",
    ],
  },
];

export const VIDEO_SLOT_KEYS = VIDEO_SLOTS.map((s) => s.key);

export const videoSlot = (key) => VIDEO_SLOTS.find((s) => s.key === key) ?? null;

export function defaultVideoConfig(key) {
  const slot = videoSlot(key);
  if (!slot) return null;
  return {
    key,
    src: slot.video.src,
    poster: slot.video.poster,
    rate: slot.video.rate,
    focus: { ...slot.video.focus },
  };
}

/* Legal video sources: the tracked files under /video/ and the backoffice's
   own uploads. */
export function isLegalVideoSrc(src) {
  return (
    typeof src === "string" &&
    !src.includes("..") &&
    (src.startsWith("/video/") || src.startsWith("/api/admin/video/file/")) &&
    VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().endsWith(ext))
  );
}

/* A poster is an image, so it may come from anywhere in the media library —
   the same rule the hero backgrounds follow. */
export function isLegalPosterSrc(src) {
  return (
    typeof src === "string" &&
    !src.includes("..") &&
    (src.startsWith("/img/") ||
      src.startsWith("/api/admin/hero/file/") ||
      src.startsWith("/api/admin/gallery/file/") ||
      /^\/api\/admin\/assets\/[a-z0-9-]+\/file\//.test(src))
  );
}

/** Structural validation of a patch for one slot. Empty array = valid. */
export function validateVideoPatch(key, patch) {
  const errs = [];
  if (!videoSlot(key)) return [`Unknown video slot "${key}"`];

  if (patch.src !== undefined && !isLegalVideoSrc(patch.src)) {
    errs.push("src must be an mp4 or webm under /video/ or /api/admin/video/file/");
  }
  if (patch.poster !== undefined && !isLegalPosterSrc(patch.poster)) {
    errs.push("poster must be under /img/ or an upload file route");
  }
  if (patch.rate !== undefined) {
    const { min, max } = VIDEO_RATE_RANGE;
    if (!(typeof patch.rate === "number" && patch.rate >= min && patch.rate <= max)) {
      errs.push(`rate must be a number between ${min} and ${max}`);
    }
  }
  if (patch.focus !== undefined) {
    for (const axis of ["x", "y"]) {
      const v = patch.focus[axis];
      if (v === undefined) continue;
      if (!(typeof v === "number" && v >= 0 && v <= 100)) {
        errs.push(`focus.${axis} must be a percentage between 0 and 100`);
      }
    }
  }
  return errs;
}
