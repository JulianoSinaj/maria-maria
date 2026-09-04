import { WINES } from "@/components/data";
import { pairingVariantFile } from "@/components/weine/pairingPhoto";

/* The hero stages of the storefront — catalogue and validation, no state.
   ==================================================================
   Until now exactly one hero had an editor: the homepage (lib/hero/store.js).
   Every other page carried its motif, its crop and its alt text inside a
   server component, where the editorial desk could not reach it. This module
   is the list of those stages.

   Client-safe on purpose (no fs): the picker UI, the API route and the
   validator all read the same catalogue, so a slot cannot exist in one place
   and be missing in another. The state that belongs to it lives next door in
   ./store.js, which does touch the filesystem and is therefore server-only.

   Every entry records WHAT THE LIVE PAGE DOES TODAY:

     image.src    the file the browser actually loads at desktop width — not
                  the source original beside it. `hero-1600.webp` is what
                  ships; `hero.jpg` is only the fallback for engines without
                  WebP, and pointing the editor at it would show a crop of a
                  file nobody is served.
     image.focus  the component's object-position, as percentages. The three
                  stages that centre their motif carry 50/50, which is the
                  browser default and therefore genuinely what they do.
     ratio        the aspect ratio of the STAGE, not of the photo. A focal
                  point only means something against a known crop: the
                  full-bleed heroes are cut to the viewport, the Geschichte
                  figure to 4:3, the Magazin cover to its original 875x823.
     alt          where the live alternative text comes from. Two kinds:
                  a dictionary path (resolved per storefront locale by the API
                  route, so the editor shows the real sentence in all four
                  languages) or a template baked into a component.

   An untouched config therefore means "exactly what ships today", the same
   promise lib/hero/store.js makes for the homepage. */

/* Alt text is storefront content, so it exists in the FOUR storefront locales
   (lib/i18n/config.js) — not in the three admin languages. The two sets are
   unrelated: an Italian editor may well be writing the Czech alt text. */
export const HERO_ALT_LOCALES = ["de", "it", "en", "cs"];

/* Long enough for a descriptive sentence, short enough that it stays an alt
   text: screen readers read it in one breath and do not offer a way to pause.
   The longest live alt text on the site is 118 characters. */
export const HERO_ALT_MAX = 220;

export const HERO_FOCUS_RANGE = { min: 0, max: 100 };

/* Grouping for the UI: the five standalone pages first, then the nine wine
   landing pages, which share one component and one shape. */
export const HERO_GROUPS = ["page", "wine"];

const FOOD_PAIRING_DIR = "/img/food-pairing";

/* --- the five standalone stages ---------------------------------------- */

const PAGE_HEROES = [
  {
    key: "home",
    group: "page",
    route: "/",
    source: "components/home/HomeHeroPhoto.jsx",
    image: {
      src: "/img/home/maria-maria-boutique-wein-mittelmeerkueste-1280.webp",
      focus: { x: 76, y: 45 },
    },
    ratio: "16 / 9",
    alt: { kind: "dictionary", section: "home", path: "hero.photoAlt" },
    /* The homepage hero has had its own editor since the backoffice was
       built — motif, veil and the whole copy block. It is listed here so the
       overview is complete and so its alt text becomes editable like every
       other one; the image and focus fields are read-only in the UI and point
       at that editor instead of offering a second, competing one. */
    ownedBy: "hero-content-manager",
  },
  {
    key: "weine",
    group: "page",
    route: "/unsere-weine",
    source: "components/weine/WeineHeroPhoto.jsx",
    image: { src: "/img/weine/hero-1600.webp", focus: { x: 50, y: 68 } },
    ratio: "16 / 9",
    alt: { kind: "dictionary", section: "weine", path: "hero.photoAlt" },
  },
  {
    key: "kontakt",
    group: "page",
    route: "/kontakt",
    source: "components/kontakt/KontaktHeroPhoto.jsx",
    image: { src: "/img/kontakt/kontakt-hero-375ml-1600.webp", focus: { x: 75, y: 50 } },
    ratio: "16 / 9",
    alt: { kind: "dictionary", section: "kontakt", path: "hero.imageAlt" },
  },
  {
    key: "geschichte",
    group: "page",
    route: "/geschichte",
    source: "app/(site)/[locale]/geschichte/page.jsx",
    /* Not a full-bleed stage: the motif stands in a 4:3 figure beside the
       opening text, rendered through <Photo> with plain object-cover. */
    image: { src: "/img/magazin/tavolata.jpg", focus: { x: 50, y: 50 } },
    ratio: "4 / 3",
    alt: { kind: "dictionary", section: "geschichte", path: "hero.photoAlt" },
  },
  {
    key: "magazin",
    group: "page",
    route: "/magazin",
    source: "components/magazin/CoverHero.jsx",
    /* The cover story photo runs in its native 875x823 without a crop — the
       whole cantina stays in frame. A focal point therefore changes nothing
       here until the motif is replaced by one with a different ratio. */
    image: { src: "/img/magazin/cover-story.jpg", focus: { x: 50, y: 50 } },
    ratio: "875 / 823",
    alt: { kind: "dictionary", section: "magazin", path: "cover.photoAlt" },
  },
];

/* --- the nine wine landing pages --------------------------------------- */

/* All nine share components/weine/falanghina/HeroPhoto.jsx, which builds its
   sources from the slug (components/weine/pairingPhoto.js) and anchors every
   motif at 50%/42%. The alt text is assembled in that component from the wine
   name — in German, on all four storefront locales. The editor shows that as
   it is; an override per locale is exactly what this catalogue makes possible. */
const WINE_HEROES = WINES.map((wine) => ({
  key: `wein-${wine.slug}`,
  group: "wine",
  slug: wine.slug,
  label: wine.name,
  route: `/unsere-weine/${wine.slug}`,
  source: "components/weine/falanghina/HeroPhoto.jsx",
  image: {
    src: `${FOOD_PAIRING_DIR}/${pairingVariantFile(wine.slug, 1280)}`,
    focus: { x: 50, y: 42 },
  },
  ratio: "16 / 9",
  alt: { kind: "generated", template: "{name} – das passende Gericht", name: wine.name },
}));

export const HERO_PAGES = [...PAGE_HEROES, ...WINE_HEROES];

export const HERO_PAGE_KEYS = HERO_PAGES.map((p) => p.key);

export const heroPage = (key) => HERO_PAGES.find((p) => p.key === key) ?? null;

/** The live alt text of a slot whose text is generated rather than editorial. */
export function generatedAlt(page) {
  if (page?.alt?.kind !== "generated") return null;
  return page.alt.template.replace("{name}", page.alt.name);
}

/** The untouched config of one slot: what the page ships today. */
export function defaultHeroPageConfig(key) {
  const page = heroPage(key);
  if (!page) return null;
  return {
    key,
    image: { src: page.image.src, focus: { ...page.image.focus } },
    /* null, not "" — an override that has never been set is a different thing
       from one that was deliberately emptied, and only the first may fall
       back to the page's editorial text. */
    alt: Object.fromEntries(HERO_ALT_LOCALES.map((l) => [l, null])),
  };
}

/* Which sources may back a hero. Same rule as the homepage hero: anything in
   the tracked media library plus the three upload routes. The API route still
   checks the file on disk — this only rules out shapes. */
export function isLegalHeroSrc(src) {
  return (
    typeof src === "string" &&
    !src.includes("..") &&
    (src.startsWith("/img/") ||
      src.startsWith("/api/admin/hero/file/") ||
      src.startsWith("/api/admin/gallery/file/") ||
      /^\/api\/admin\/assets\/[a-z0-9-]+\/file\//.test(src))
  );
}

/** Structural validation of a patch for ONE slot. Empty array = valid. */
export function validateHeroPagePatch(key, patch) {
  const errs = [];
  const page = heroPage(key);
  if (!page) return [`Unknown hero slot "${key}"`];

  if (patch.image !== undefined) {
    if (page.ownedBy) {
      /* The homepage motif belongs to /api/admin/hero. Accepting it here too
         would give one value two owners and two ways to disagree. */
      errs.push(`image of "${key}" is owned by the homepage hero editor`);
    }
    const { src, focus } = patch.image;
    if (src !== undefined && !isLegalHeroSrc(src)) {
      errs.push("image.src must be under /img/ or an upload file route");
    }
    if (focus !== undefined) {
      for (const axis of ["x", "y"]) {
        const v = focus[axis];
        if (v === undefined) continue;
        if (!(typeof v === "number" && v >= HERO_FOCUS_RANGE.min && v <= HERO_FOCUS_RANGE.max)) {
          errs.push(`image.focus.${axis} must be a percentage between 0 and 100`);
        }
      }
    }
  }

  if (patch.alt !== undefined) {
    if (typeof patch.alt !== "object" || patch.alt === null) {
      errs.push("alt must be an object keyed by storefront locale");
    } else {
      for (const [locale, value] of Object.entries(patch.alt)) {
        if (!HERO_ALT_LOCALES.includes(locale)) {
          errs.push(`alt.${locale} is not a storefront locale`);
          continue;
        }
        /* null clears the override and hands the slot back to the page's own
           text; a string replaces it. Nothing else is meaningful. */
        if (value === null) continue;
        if (typeof value !== "string") errs.push(`alt.${locale} must be a string or null`);
        else if (value.length > HERO_ALT_MAX) {
          errs.push(`alt.${locale} exceeds ${HERO_ALT_MAX} characters (${value.length})`);
        }
      }
    }
  }

  return errs;
}
