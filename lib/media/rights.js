/* Alt text and image rights — schema and validation, no state.
   ==================================================================
   Two things the media library could not say about a picture until now:

     WHAT IT SHOWS   the alternative text, in the four storefront locales.
                     Not decoration: it is what a screen reader announces, what
                     stands in the page when a file 404s, and what a search
                     engine reads as the description of the image.
     WHO OWNS IT     the licence, the rights holder, where the file came from
                     and when the licence runs out. A stock photo whose term
                     expired is a bill, not a bug, and the only place that
                     knowledge can live is next to the file.

   `decorative` is the third state that alt text needs and that a plain text
   field cannot express: an image which carries no information of its own
   belongs in the page with alt="" so assistive technology skips it. Without
   the flag, "" and "nobody has written one yet" look identical — and the
   gallery would nag forever about a divider line.

   Client-safe (no fs). The store is in ./metaStore.js. */

/* Storefront locales (lib/i18n/config.js), not the three admin languages. */
export const MEDIA_ALT_LOCALES = ["de", "it", "en", "cs"];
export const MEDIA_ALT_MAX = 220;

/* What the licence field may say. The values are keys, not labels — the
   wording per admin language lives in the admin dictionary. */
export const MEDIA_LICENSES = ["owned", "licensed", "stock", "editorial", "unknown"];

export const MEDIA_LIMITS = { holder: 140, source: 300, note: 400 };

export function defaultMeta() {
  return {
    alt: Object.fromEntries(MEDIA_ALT_LOCALES.map((l) => [l, ""])),
    decorative: false,
    license: "unknown",
    holder: "",
    source: "",
    /* ISO date (YYYY-MM-DD) or null for "does not expire". */
    expires: null,
    note: "",
    updatedAt: null,
  };
}

/* Which paths the library can describe: the tracked assets under /img/ and
   the three upload file routes. Same shape rule as everywhere else — the API
   route additionally proves the file exists. */
export function isLegalAssetPath(value) {
  return (
    typeof value === "string" &&
    value.length <= 400 &&
    !value.includes("..") &&
    (value.startsWith("/img/") ||
      value.startsWith("/video/") ||
      value.startsWith("/api/admin/hero/file/") ||
      value.startsWith("/api/admin/video/file/") ||
      value.startsWith("/api/admin/gallery/file/") ||
      /^\/api\/admin\/assets\/[a-z0-9-]+\/file\//.test(value))
  );
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isRealDate = (value) => {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

/** Structural validation of a metadata patch. Empty array = valid. */
export function validateMetaPatch(patch) {
  const errs = [];
  if (!patch || typeof patch !== "object") return ["Patch must be an object"];

  if (patch.alt !== undefined) {
    if (typeof patch.alt !== "object" || patch.alt === null) {
      errs.push("alt must be an object keyed by storefront locale");
    } else {
      for (const [locale, value] of Object.entries(patch.alt)) {
        if (!MEDIA_ALT_LOCALES.includes(locale)) {
          errs.push(`alt.${locale} is not a storefront locale`);
        } else if (typeof value !== "string") {
          errs.push(`alt.${locale} must be a string`);
        } else if (value.length > MEDIA_ALT_MAX) {
          errs.push(`alt.${locale} exceeds ${MEDIA_ALT_MAX} characters (${value.length})`);
        }
      }
    }
  }

  if (patch.decorative !== undefined && typeof patch.decorative !== "boolean") {
    errs.push("decorative must be a boolean");
  }

  if (patch.license !== undefined && !MEDIA_LICENSES.includes(patch.license)) {
    errs.push(`license must be one of ${MEDIA_LICENSES.join(", ")}`);
  }

  for (const field of ["holder", "source", "note"]) {
    const value = patch[field];
    if (value === undefined) continue;
    if (typeof value !== "string") errs.push(`${field} must be a string`);
    else if (value.length > MEDIA_LIMITS[field]) {
      errs.push(`${field} exceeds ${MEDIA_LIMITS[field]} characters (${value.length})`);
    }
  }

  if (patch.expires !== undefined && patch.expires !== null) {
    if (typeof patch.expires !== "string" || !isRealDate(patch.expires)) {
      errs.push("expires must be a date as YYYY-MM-DD, or null");
    }
  }

  return errs;
}

/* How complete an entry is, as flags the gallery can badge and a future
   pre-flight check can count. `today` is a parameter so the caller — and the
   test suite — decides what "now" means. */
export function metaState(meta, today = new Date()) {
  const entry = { ...defaultMeta(), ...(meta ?? {}) };
  const alt = entry.alt ?? {};
  const hasGermanAlt = Boolean(alt.de?.trim());
  const missingLocales = MEDIA_ALT_LOCALES.filter((l) => !alt[l]?.trim());

  let expiry = null;
  if (entry.expires) {
    const due = new Date(`${entry.expires}T00:00:00Z`);
    const days = Math.floor((due - today) / 86_400_000);
    expiry = days < 0 ? "expired" : days <= 60 ? "soon" : "valid";
  }

  return {
    /* Decorative is a decision, and a decision counts as described. */
    described: entry.decorative || hasGermanAlt,
    decorative: entry.decorative,
    missingLocales: entry.decorative ? [] : missingLocales,
    /* Rights are settled once someone has said what the licence is; "unknown"
       is the state the field starts in, not an answer. */
    rightsKnown: entry.license !== "unknown",
    expiry,
  };
}
