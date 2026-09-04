/* Maria Maria — interview record schema.
   ==================================================================
   The SHAPE of an interview as the backoffice stores it, and the two
   translations between that shape and what the storefront reads:

     record  ──toDictionaryItem(locale)──▶  dict.interviews.items[] entry
     record  ◀──fromDictionaryItems()────  the four content/<locale> entries

   A plain module without any Node dependency so the admin's client
   components can import the enums, blank factories and the validator;
   persistence lives next door in store.js.

   Why one record and not four? The slug, the linked wine, the region, the
   portrait and the publish state are shared facts — a language must not be
   able to disagree about which wine the piece is about. Everything a reader
   sees as text lives per language under `locales`, German being required
   and the other three optional. A missing language falls back to German at
   read time, so a slug can never render an empty page (which is exactly the
   failure the hand-written registry warned about).

   Field reference for the per-language block: see the header comment of
   content/de/interviews.js — every key here mirrors one there. */

/* ---------------------------------------------------------------- enums ---- */

export const INTERVIEW_LOCALES = Object.freeze(["de", "it", "en", "cs"]);
export const REQUIRED_LOCALE = "de";

export const INTERVIEW_STATUS = Object.freeze({
  DRAFT: "draft",
  PUBLISHED: "published",
});

/* `teaserRegion.region` — the anchor keys of REGION_SHAPE on /regionen. */
export const INTERVIEW_REGIONS = Object.freeze(["garda", "kampanien", "apulien"]);

/* Glyphs the article's pairing cards know (InterviewArticle PAIRING_ICONS);
   an unknown key falls back to `plate` there, so the list is advisory. */
export const PAIRING_ICONS = Object.freeze([
  "fish",
  "risotto",
  "stockfish",
  "poultry",
  "plate",
  "glasses",
]);

export const PORTRAIT_POSITIONS = Object.freeze(["object-top", "object-center"]);

/* The three closing paths are fixed in number and order — every piece
   offers the region, the pairing chapter and the other conversations. */
export const PATH_IDS = Object.freeze(["region", "pairing", "interviews"]);

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/* Where an image may come from: the tracked library under public/img plus
   the admin upload routes. Anything else (data URIs, remote hosts,
   traversal) is refused. */
export const IMAGE_PREFIXES = Object.freeze([
  "/img/",
  "/api/admin/interviews/file/",
  "/api/admin/gallery/file/",
  "/api/admin/hero/file/",
]);

export const isImagePath = (v) =>
  typeof v === "string" && !v.includes("..") && IMAGE_PREFIXES.some((p) => v.startsWith(p));

/* Soft limits the editor shows as counters. The server does not enforce
   them — a long deck is a judgement call, not an error. */
export const LIMITS = Object.freeze({
  seoTitle: 70,
  seoDescription: 170,
  deck: 420,
  teaser: 260,
  pull: 160,
});

/* ------------------------------------------------------------ factories ---- */

export const blankMedia = () => ({ src: "", alt: "", caption: "", aspect: "" });

export const blankSection = () => ({
  id: "",
  heading: "",
  paragraphs: [],
  quote: "",
  after: [],
  media: null,
  list: null,
});

export const blankList = () => ({ label: "", items: [] });

export const blankPairingItem = () => ({ icon: "plate", title: "", text: "" });

export const blankFaqItem = () => ({ id: "", q: "", a: "" });

const blankPaths = () =>
  PATH_IDS.map((id) => ({ id, icon: id, title: "", text: "", href: "" }));

/** Empty per-language block — every key the article can read, in order. */
export function blankLocaleContent() {
  return {
    eyebrow: "",
    badge: "",
    name: "",
    headline: "",
    deck: "",
    seo: { title: "", description: "" },
    byline: { interview: "", editorial: "Maria Maria", readingTime: "" },
    portraitAlt: "",
    winePhotoAlt: "",
    intro: [],
    sections: [],
    pairing: { heading: "", paragraphs: [], media: null, items: [] },
    serving: null,
    outro: null,
    faq: null,
    profile: { name: "", role: "", worksFor: "", text: "", link: { label: "", href: "" } },
    wine: { heading: "", text: "", cta: "" },
    paths: blankPaths(),
    teaserMagazin: { eyebrow: "", badge: "", title: "", teaser: "", meta: "", cta: "" },
    teaserRegion: { eyebrow: "", title: "", paragraphs: [], pull: "", ctaPrimary: "", ctaSecondary: "" },
  };
}

/** Empty record for the "new interview" flow. */
export function blankRecord() {
  return {
    slug: "",
    status: INTERVIEW_STATUS.DRAFT,
    publishedAt: null,
    createdAt: null,
    updatedAt: null,
    wine: { slug: "", href: "" },
    region: "",
    ghost: "",
    portrait: { src: "", position: "object-top", article: "" },
    teaserPortrait: "",
    winePhoto: "",
    og: "",
    locales: { de: blankLocaleContent(), it: null, en: null, cs: null },
  };
}

/* ------------------------------------------------------------- helpers ---- */

const str = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));
const trim = (v) => str(v).trim();

/** Text area → paragraphs: blank-line separated, trimmed, empties dropped. */
export const splitParagraphs = (text) =>
  str(text)
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

export const joinParagraphs = (items) => (Array.isArray(items) ? items.join("\n\n") : "");

/** Text area → list items: one per line. */
export const splitLines = (text) =>
  str(text)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** "Was den Lugana im Glas erkennbar macht" → "was-den-lugana-im-glas-erkennbar-macht" */
export function slugify(text) {
  return str(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const cleanStrings = (arr) =>
  Array.isArray(arr) ? arr.map(trim).filter(Boolean) : [];

const cleanMedia = (m) => {
  if (!m || typeof m !== "object") return null;
  const src = trim(m.src);
  if (!src) return null;
  return { src, alt: trim(m.alt), caption: trim(m.caption), aspect: trim(m.aspect) };
};

/* ---------------------------------------------------------- normalise ---- */

/** Trim, drop empties, derive missing ids — the shape the store keeps.
    Runs on every write so the file never holds half-typed state. */
export function normalizeLocaleContent(input) {
  const base = blankLocaleContent();
  const c = { ...base, ...(input && typeof input === "object" ? input : {}) };

  const usedIds = new Set();
  const sectionId = (s, i) => {
    let id = slugify(s.id) || slugify(s.heading) || `kapitel-${i + 1}`;
    /* the article's chapter anchors are fixed: "pairing", "servieren", "fazit",
       "faq" — a section must not shadow them */
    if (["pairing", "servieren", "fazit", "faq"].includes(id)) id = `${id}-${i + 1}`;
    let unique = id;
    let n = 2;
    while (usedIds.has(unique)) unique = `${id}-${n++}`;
    usedIds.add(unique);
    return unique;
  };

  const sections = (Array.isArray(c.sections) ? c.sections : [])
    .filter((s) => s && typeof s === "object")
    .map((s, i) => {
      const list = s.list && typeof s.list === "object" ? s.list : null;
      const listItems = list ? cleanStrings(list.items) : [];
      return {
        id: sectionId(s, i),
        heading: trim(s.heading),
        paragraphs: cleanStrings(s.paragraphs),
        quote: trim(s.quote),
        after: cleanStrings(s.after),
        media: cleanMedia(s.media),
        list: listItems.length ? { label: trim(list.label), items: listItems } : null,
      };
    })
    /* a block with neither heading nor text is an accident of the editor */
    .filter((s) => s.heading || s.paragraphs.length);

  const pairingItems = (Array.isArray(c.pairing?.items) ? c.pairing.items : [])
    .map((it) => ({
      icon: PAIRING_ICONS.includes(it?.icon) ? it.icon : "plate",
      title: trim(it?.title),
      text: trim(it?.text),
    }))
    .filter((it) => it.title || it.text);

  const headingBlock = (b) => {
    if (!b || typeof b !== "object") return null;
    const out = { heading: trim(b.heading), paragraphs: cleanStrings(b.paragraphs) };
    if ("quote" in b) out.quote = trim(b.quote);
    return out.heading || out.paragraphs.length || out.quote ? out : null;
  };

  const faqItems = (Array.isArray(c.faq?.items) ? c.faq.items : [])
    .map((it, i) => ({
      id: slugify(it?.id) || slugify(it?.q).slice(0, 48) || `frage-${i + 1}`,
      q: trim(it?.q),
      a: trim(it?.a),
    }))
    .filter((it) => it.q || it.a);
  const faq =
    faqItems.length || trim(c.faq?.title)
      ? {
          eyebrow: trim(c.faq?.eyebrow),
          title: trim(c.faq?.title),
          titleAccent: trim(c.faq?.titleAccent),
          description: trim(c.faq?.description),
          items: faqItems,
        }
      : null;

  const pathsIn = Array.isArray(c.paths) ? c.paths : [];
  const paths = PATH_IDS.map((id) => {
    const p = pathsIn.find((x) => x?.id === id) ?? {};
    return { id, icon: id, title: trim(p.title), text: trim(p.text), href: trim(p.href) };
  });

  return {
    eyebrow: trim(c.eyebrow),
    badge: trim(c.badge),
    name: trim(c.name),
    headline: trim(c.headline),
    deck: trim(c.deck),
    seo: { title: trim(c.seo?.title), description: trim(c.seo?.description) },
    byline: {
      interview: trim(c.byline?.interview),
      editorial: trim(c.byline?.editorial),
      readingTime: trim(c.byline?.readingTime),
    },
    portraitAlt: trim(c.portraitAlt),
    winePhotoAlt: trim(c.winePhotoAlt),
    intro: cleanStrings(c.intro),
    sections,
    pairing: {
      heading: trim(c.pairing?.heading),
      paragraphs: cleanStrings(c.pairing?.paragraphs),
      media: cleanMedia(c.pairing?.media),
      items: pairingItems,
    },
    serving: headingBlock(c.serving ? { heading: c.serving.heading, paragraphs: c.serving.paragraphs } : null),
    outro: headingBlock(c.outro),
    faq,
    profile: {
      name: trim(c.profile?.name),
      role: trim(c.profile?.role),
      worksFor: trim(c.profile?.worksFor),
      text: trim(c.profile?.text),
      link: { label: trim(c.profile?.link?.label), href: trim(c.profile?.link?.href) },
    },
    wine: { heading: trim(c.wine?.heading), text: trim(c.wine?.text), cta: trim(c.wine?.cta) },
    paths,
    teaserMagazin: {
      eyebrow: trim(c.teaserMagazin?.eyebrow),
      badge: trim(c.teaserMagazin?.badge),
      title: trim(c.teaserMagazin?.title),
      teaser: trim(c.teaserMagazin?.teaser),
      meta: trim(c.teaserMagazin?.meta),
      cta: trim(c.teaserMagazin?.cta),
    },
    teaserRegion: {
      eyebrow: trim(c.teaserRegion?.eyebrow),
      title: trim(c.teaserRegion?.title),
      paragraphs: cleanStrings(c.teaserRegion?.paragraphs),
      pull: trim(c.teaserRegion?.pull),
      ctaPrimary: trim(c.teaserRegion?.ctaPrimary),
      ctaSecondary: trim(c.teaserRegion?.ctaSecondary),
    },
  };
}

/** Is a per-language block effectively empty (never filled in)? */
export function isLocaleEmpty(c) {
  if (!c) return true;
  return !(
    c.name ||
    c.headline ||
    c.deck ||
    c.intro?.length ||
    c.sections?.length ||
    c.teaserMagazin?.title
  );
}

export function normalizeRecord(input) {
  const base = blankRecord();
  const r = { ...base, ...(input && typeof input === "object" ? input : {}) };
  const locales = {};
  for (const l of INTERVIEW_LOCALES) {
    const raw = r.locales?.[l];
    if (l === REQUIRED_LOCALE) locales[l] = normalizeLocaleContent(raw);
    else if (raw && typeof raw === "object" && !isLocaleEmpty(raw)) locales[l] = normalizeLocaleContent(raw);
    else locales[l] = null;
  }
  return {
    slug: trim(r.slug).toLowerCase(),
    status: r.status === INTERVIEW_STATUS.PUBLISHED ? INTERVIEW_STATUS.PUBLISHED : INTERVIEW_STATUS.DRAFT,
    publishedAt: trim(r.publishedAt) || null,
    createdAt: r.createdAt ?? null,
    updatedAt: r.updatedAt ?? null,
    wine: { slug: trim(r.wine?.slug), href: trim(r.wine?.href) },
    region: trim(r.region),
    ghost: trim(r.ghost),
    portrait: {
      src: trim(r.portrait?.src),
      position: PORTRAIT_POSITIONS.includes(r.portrait?.position) ? r.portrait.position : "object-top",
      article: trim(r.portrait?.article),
    },
    teaserPortrait: trim(r.teaserPortrait),
    winePhoto: trim(r.winePhoto),
    og: trim(r.og),
    locales,
  };
}

/* ------------------------------------------------------------ validate ---- */

/**
 * Structural validation. Returns an array of "field message" strings —
 * empty means valid. `forPublish` adds the completeness rules a live page
 * needs; a draft may be as unfinished as it likes.
 * @param {object} record  normalised record
 * @param {object} [opts]
 * @param {string[]} [opts.wineSlugs]  legal wine slugs (server passes the registry)
 * @param {boolean} [opts.forPublish]
 */
export function validateRecord(record, { wineSlugs = null, forPublish = false } = {}) {
  const errs = [];
  const r = record ?? {};

  if (!SLUG_RE.test(r.slug ?? "") || r.slug.length < 3 || r.slug.length > 80) {
    errs.push("slug must be 3–80 characters of a-z, 0-9 and single hyphens");
  }
  if (!Object.values(INTERVIEW_STATUS).includes(r.status)) errs.push("status is invalid");
  if (r.publishedAt != null && !DATE_RE.test(r.publishedAt)) {
    errs.push("publishedAt must be an ISO date (YYYY-MM-DD)");
  }
  if (r.wine?.slug && Array.isArray(wineSlugs) && !wineSlugs.includes(r.wine.slug)) {
    errs.push(`wine.slug must be one of ${wineSlugs.join(", ")}`);
  }
  if (r.wine?.href && !r.wine.href.startsWith("/")) errs.push("wine.href must be a site path");
  if (r.region && !INTERVIEW_REGIONS.includes(r.region)) {
    errs.push(`region must be one of ${INTERVIEW_REGIONS.join(", ")}`);
  }
  for (const [key, val] of [
    ["portrait.src", r.portrait?.src],
    ["portrait.article", r.portrait?.article],
    ["teaserPortrait", r.teaserPortrait],
    ["winePhoto", r.winePhoto],
    ["og", r.og],
  ]) {
    if (val && !isImagePath(val)) errs.push(`${key} must be an image under /img/ or an upload route`);
  }

  const de = r.locales?.[REQUIRED_LOCALE];
  if (!de) errs.push("locales.de is required");

  for (const l of INTERVIEW_LOCALES) {
    const c = r.locales?.[l];
    if (!c) continue;
    (c.sections ?? []).forEach((s, i) => {
      if (s.media && !isImagePath(s.media.src)) {
        errs.push(`locales.${l}.sections[${i}].media.src must be an image under /img/ or an upload route`);
      }
    });
    if (c.pairing?.media && !isImagePath(c.pairing.media.src)) {
      errs.push(`locales.${l}.pairing.media.src must be an image under /img/ or an upload route`);
    }
    if (c.profile?.link?.href && !/^(https?:\/\/|\/)/.test(c.profile.link.href)) {
      errs.push(`locales.${l}.profile.link.href must be an absolute URL or a site path`);
    }
  }

  if (forPublish && de) {
    const need = (cond, key) => {
      if (!cond) errs.push(`locales.de.${key} is required to publish`);
    };
    need(de.name, "name");
    need(de.headline, "headline");
    need(de.deck, "deck");
    need(de.eyebrow, "eyebrow");
    need(de.intro?.length, "intro");
    need(de.sections?.length, "sections");
    need(de.sections?.every((s) => s.heading && s.paragraphs.length), "sections[].heading+paragraphs");
    need(de.teaserMagazin?.title, "teaserMagazin.title");
    need(de.teaserMagazin?.teaser, "teaserMagazin.teaser");
    need(de.teaserMagazin?.cta, "teaserMagazin.cta");
    need(de.profile?.name, "profile.name");
    need(de.portraitAlt, "portraitAlt");
    if (!r.portrait?.src) errs.push("portrait.src is required to publish");
    if (r.region && !(de.teaserRegion?.title && de.teaserRegion?.ctaPrimary && de.teaserRegion?.ctaSecondary)) {
      errs.push("locales.de.teaserRegion.title/ctaPrimary/ctaSecondary are required when a region is set");
    }
  }

  return errs;
}

/** Per-language completeness — what the list's four dots show.
    "complete" = the publish rules pass for that block, "partial" = something
    is there, "missing" = nothing. */
export function localeCompleteness(record) {
  const out = {};
  for (const l of INTERVIEW_LOCALES) {
    const c = record?.locales?.[l];
    if (!c || isLocaleEmpty(c)) {
      out[l] = "missing";
      continue;
    }
    const ok =
      c.name &&
      c.headline &&
      c.deck &&
      c.eyebrow &&
      c.intro?.length &&
      c.sections?.length &&
      c.sections.every((s) => s.heading && s.paragraphs.length) &&
      c.teaserMagazin?.title &&
      c.teaserMagazin?.teaser &&
      c.teaserMagazin?.cta &&
      c.profile?.name &&
      c.portraitAlt;
    out[l] = ok ? "complete" : "partial";
  }
  return out;
}

/* -------------------------------------------------- record → dictionary ---- */

const DATE_LOCALE = { de: "de-DE", it: "it-IT", en: "en-GB", cs: "cs-CZ" };

/** "2026-08-12" → "12. August 2026" (de) / "12 agosto 2026" (it) … */
export function formatPublishDate(iso, locale) {
  if (!iso || !DATE_RE.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  try {
    return new Intl.DateTimeFormat(DATE_LOCALE[locale] ?? "de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, d)));
  } catch {
    return iso;
  }
}

const mediaOut = (m) =>
  m?.src
    ? {
        src: m.src,
        alt: m.alt || "",
        ...(m.caption ? { caption: m.caption } : {}),
        ...(m.aspect ? { aspect: m.aspect } : {}),
      }
    : null;

/**
 * The entry the storefront reads: the same shape as an item in
 * content/<locale>/interviews.js. A language without its own block gets the
 * German text — a translated URL must never open an empty page.
 */
export function toDictionaryItem(record, locale) {
  const r = record;
  const own = r.locales?.[locale];
  const c = own && !isLocaleEmpty(own) ? own : r.locales?.[REQUIRED_LOCALE];
  if (!c) return null;
  const fallback = !own || isLocaleEmpty(own);

  const sections = (c.sections ?? []).map((s) => ({
    id: s.id,
    heading: s.heading,
    paragraphs: s.paragraphs,
    ...(s.media?.src ? { media: mediaOut(s.media) } : {}),
    ...(s.list?.items?.length ? { list: { label: s.list.label, items: s.list.items } } : {}),
    ...(s.quote ? { quote: s.quote } : {}),
    ...(s.after?.length ? { after: s.after } : {}),
  }));

  const item = {
    slug: r.slug,
    draft: r.status !== INTERVIEW_STATUS.PUBLISHED,
    /* which language the text actually is in — the page can tell readers
       when they are looking at the German original */
    contentLocale: fallback ? REQUIRED_LOCALE : locale,

    eyebrow: c.eyebrow,
    badge: c.badge,
    name: c.name,
    headline: c.headline,
    deck: c.deck,
    ...(r.ghost ? { ghost: r.ghost } : {}),

    ...(c.seo?.title || c.seo?.description
      ? { seo: { title: c.seo.title || c.headline, description: c.seo.description || c.deck } }
      : {}),

    byline: {
      interview: c.byline?.interview || null,
      editorial: c.byline?.editorial || null,
      date: formatPublishDate(r.publishedAt, locale),
      dateIso: r.publishedAt ?? null,
      readingTime: c.byline?.readingTime || null,
    },

    portrait: {
      src: r.portrait?.src || null,
      alt: c.portraitAlt || "",
      position: r.portrait?.position || "object-top",
      ...(r.portrait?.article ? { article: r.portrait.article } : {}),
    },

    intro: c.intro ?? [],
    sections,

    ...(c.pairing?.heading || c.pairing?.items?.length
      ? {
          pairing: {
            heading: c.pairing.heading,
            ...(c.pairing.media?.src ? { media: mediaOut(c.pairing.media) } : {}),
            paragraphs: c.pairing.paragraphs ?? [],
            items: c.pairing.items ?? [],
          },
        }
      : {}),

    ...(c.serving ? { serving: { heading: c.serving.heading, paragraphs: c.serving.paragraphs } } : {}),

    ...(c.outro
      ? {
          outro: {
            heading: c.outro.heading,
            paragraphs: c.outro.paragraphs,
            ...(c.outro.quote ? { quote: c.outro.quote } : {}),
          },
        }
      : {}),

    ...(c.faq?.items?.length ? { faq: c.faq } : {}),

    profile: {
      name: c.profile?.name || c.name,
      ...(c.profile?.role ? { role: c.profile.role } : {}),
      ...(c.profile?.worksFor ? { worksFor: c.profile.worksFor } : {}),
      text: c.profile?.text || "",
      ...(c.profile?.link?.href
        ? { link: { label: c.profile.link.label || c.profile.link.href, href: c.profile.link.href } }
        : {}),
    },

    ...(r.wine?.slug
      ? {
          wine: {
            slug: r.wine.slug,
            ...(r.wine.href ? { href: r.wine.href } : {}),
            ...(r.winePhoto ? { photo: { src: r.winePhoto, alt: c.winePhotoAlt || "" } } : {}),
            heading: c.wine?.heading || "",
            text: c.wine?.text || "",
            cta: c.wine?.cta || "",
          },
        }
      : {}),

    paths: (c.paths ?? []).filter((p) => p.title).map((p) => ({ ...p })),

    teaserMagazin: {
      eyebrow: c.teaserMagazin?.eyebrow || c.eyebrow,
      badge: c.teaserMagazin?.badge || c.badge,
      title: c.teaserMagazin?.title || c.headline,
      teaser: c.teaserMagazin?.teaser || c.deck,
      meta: c.teaserMagazin?.meta || "",
      cta: c.teaserMagazin?.cta || "",
    },

    ...(r.region
      ? {
          teaserRegion: {
            region: r.region,
            ...(r.teaserPortrait ? { portrait: { src: r.teaserPortrait } } : {}),
            eyebrow: c.teaserRegion?.eyebrow || "",
            title: c.teaserRegion?.title || "",
            paragraphs: c.teaserRegion?.paragraphs ?? [],
            pull: c.teaserRegion?.pull || "",
            ctaPrimary: c.teaserRegion?.ctaPrimary || "",
            ctaSecondary: c.teaserRegion?.ctaSecondary || "",
          },
        }
      : {}),
  };

  return item;
}

/* -------------------------------------------------- dictionary → record ---- */

/** One content/<locale> entry → the per-language block of a record. */
export function localeContentFromItem(item) {
  if (!item) return null;
  return normalizeLocaleContent({
    eyebrow: item.eyebrow,
    badge: item.badge,
    name: item.name,
    headline: item.headline,
    deck: item.deck,
    seo: item.seo,
    byline: {
      interview: item.byline?.interview,
      editorial: item.byline?.editorial,
      readingTime: item.byline?.readingTime,
    },
    portraitAlt: item.portrait?.alt,
    winePhotoAlt: item.wine?.photo?.alt,
    intro: item.intro,
    sections: item.sections,
    pairing: item.pairing,
    serving: item.serving,
    outro: item.outro,
    faq: item.faq,
    profile: item.profile,
    wine: { heading: item.wine?.heading, text: item.wine?.text, cta: item.wine?.cta },
    paths: item.paths,
    teaserMagazin: item.teaserMagazin,
    teaserRegion: item.teaserRegion,
  });
}

/**
 * The four content/<locale> entries of one slug → a record. Shared facts come
 * from the German entry; a language whose entry is missing stays null.
 * @param {{de: object, it?: object, en?: object, cs?: object}} items
 */
export function fromDictionaryItems(items) {
  const de = items?.de;
  if (!de) return null;
  const locales = {};
  for (const l of INTERVIEW_LOCALES) locales[l] = localeContentFromItem(items[l]);
  return normalizeRecord({
    slug: de.slug,
    status: de.draft ? INTERVIEW_STATUS.DRAFT : INTERVIEW_STATUS.PUBLISHED,
    publishedAt: de.byline?.dateIso ?? null,
    wine: { slug: de.wine?.slug ?? "", href: de.wine?.href ?? "" },
    region: de.teaserRegion?.region ?? "",
    ghost: de.ghost ?? "",
    portrait: {
      src: de.portrait?.src ?? "",
      position: de.portrait?.position ?? "object-top",
      article: de.portrait?.article ?? "",
    },
    teaserPortrait: de.teaserRegion?.portrait?.src ?? "",
    winePhoto: de.wine?.photo?.src ?? "",
    og: "",
    locales,
  });
}
