/* FAQ content model — shared by the store (server) and the editor (client).
   ==================================================================
   One record per question: which storefront page it belongs to (`group`),
   its cluster on nested pages (`subgroup`), its position (`order`), and per
   language the question, the answer and an optional link with label and
   path. The id is language-neutral and, once published, immutable: it is
   the DOM id FaqSection renders, the deep-link target (/kontakt#kontakt-
   versand) and the faq_id every GA4 event carries.

   Keep this file free of server-only imports AND of the wine registry: the
   admin bundle must not drag nine wineData.js modules along just to know
   the id pattern. Wine groups reach the editor through the API's meta. */

import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/config";

export const FAQ_LOCALES = LOCALES; // ["de", "it", "en", "cs"]
export const FAQ_DEFAULT_LOCALE = DEFAULT_LOCALE;

export const STATUS = { DRAFT: "draft", PUBLISHED: "published" };
export const STATUSES = Object.values(STATUS);

/* The storefront pages that carry a FAQ block, in the order the admin lists
   them. `nested` pages render clusters with an index column (FaqSection's
   `groups` prop); flat pages render a single accordion (`items`). The wine
   pages are added at runtime from the registry as `wine:<slug>`. */
export const PAGE_GROUPS = [
  { key: "home", path: "/", nested: false },
  { key: "weine", path: "/unsere-weine", nested: false },
  { key: "regionen", path: "/regionen", nested: true },
  { key: "magazin", path: "/magazin", nested: false },
  { key: "geschichte", path: "/geschichte", nested: true },
  { key: "shop", path: "/shop", nested: false },
  { key: "kontakt", path: "/kontakt", nested: true },
];
export const PAGE_GROUP_KEYS = PAGE_GROUPS.map((g) => g.key);
export const pageGroup = (key) => PAGE_GROUPS.find((g) => g.key === key) ?? null;
export const isNestedGroup = (key) => pageGroup(key)?.nested === true;

export const WINE_GROUP_PREFIX = "wine:";
export const wineGroup = (slug) => `${WINE_GROUP_PREFIX}${slug}`;
export const wineSlugOf = (group) =>
  typeof group === "string" && group.startsWith(WINE_GROUP_PREFIX)
    ? group.slice(WINE_GROUP_PREFIX.length)
    : null;

/* Ids and subgroup keys: lower-case kebab only — they end up in URLs. */
export const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const KEY_RE = ID_RE;

export const LIMITS = {
  id: 64,
  key: 40,
  q: 200,
  a: 1500,
  linkLabel: 120,
  href: 300,
  subgroupLabel: 80,
};

/* An internal path, a page anchor, or an absolute URL — the last one is what
   the Terra Vera hand-off needs (shipping answers pointing at their shop). */
export const HREF_RE = /^(?:\/(?!\/)\S*|#\S+|https?:\/\/\S+|mailto:\S+)$/;

export const emptyText = () => ({ q: "", a: "", link: null });
export const emptyTexts = () =>
  Object.fromEntries(FAQ_LOCALES.map((l) => [l, emptyText()]));

const str = (v) => (typeof v === "string" ? v : "");

/* A link counts as "started" once either field carries text; an all-empty
   link is normalised away so the editor may simply leave the fields blank. */
export const hasLink = (link) =>
  !!link && (str(link.label).trim() !== "" || str(link.href).trim() !== "");
export const linkComplete = (link) =>
  !!link && str(link.label).trim() !== "" && str(link.href).trim() !== "";

/** One language is complete when question and answer are there and a
    started link is finished. This is the marker the editor shows per tab. */
export function isComplete(text) {
  if (!text) return false;
  if (!str(text.q).trim() || !str(text.a).trim()) return false;
  if (hasLink(text.link) && !linkComplete(text.link)) return false;
  return true;
}

export const completeness = (record) =>
  Object.fromEntries(FAQ_LOCALES.map((l) => [l, isComplete(record?.text?.[l])]));

/** Trim a text block coming from the editor; an empty link becomes null. */
export function normalizeText(input = {}) {
  const q = str(input?.q).trim();
  const a = str(input?.a).trim();
  const link = hasLink(input?.link)
    ? { label: str(input.link.label).trim(), href: str(input.link.href).trim() }
    : null;
  return { q, a, link };
}

/**
 * Validate a full record. Returns an array of messages — empty when valid.
 * @param {object} rec
 * @param {{ groups: string[], subgroupKeys: (group: string) => string[] }} ctx
 */
export function validateRecord(rec, { groups, subgroupKeys }) {
  const errs = [];

  if (typeof rec.id !== "string" || !ID_RE.test(rec.id) || rec.id.length > LIMITS.id) {
    errs.push(
      `id must be lower-case kebab-case (a–z, 0–9, hyphens), at most ${LIMITS.id} characters`,
    );
  }

  if (!groups.includes(rec.group)) {
    errs.push(`group "${rec.group}" is unknown`);
  } else if (isNestedGroup(rec.group)) {
    const keys = subgroupKeys(rec.group);
    if (typeof rec.subgroup !== "string" || !keys.includes(rec.subgroup)) {
      errs.push(
        `subgroup must be one of ${keys.join(", ") || "(none defined yet)"} for group "${rec.group}"`,
      );
    }
  } else if (rec.subgroup != null) {
    errs.push(`subgroup must be empty for the flat group "${rec.group}"`);
  }

  if (!Number.isInteger(rec.order) || rec.order < 0) {
    errs.push("order must be a non-negative integer");
  }
  if (!STATUSES.includes(rec.status)) {
    errs.push(`status must be one of ${STATUSES.join(", ")}`);
  }

  if (typeof rec.text !== "object" || rec.text === null) {
    errs.push("text must be an object keyed by language");
  } else {
    for (const l of FAQ_LOCALES) {
      const t = rec.text[l];
      if (!t || typeof t !== "object") {
        errs.push(`text.${l} is missing`);
        continue;
      }
      if (typeof t.q !== "string" || t.q.length > LIMITS.q) {
        errs.push(`text.${l}.q must be a string of at most ${LIMITS.q} characters`);
      }
      if (typeof t.a !== "string" || t.a.length > LIMITS.a) {
        errs.push(`text.${l}.a must be a string of at most ${LIMITS.a} characters`);
      }
      if (t.link !== null && t.link !== undefined) {
        if (typeof t.link !== "object") {
          errs.push(`text.${l}.link must be an object or null`);
        } else {
          if (typeof t.link.label !== "string" || t.link.label.length > LIMITS.linkLabel) {
            errs.push(
              `text.${l}.link.label must be a string of at most ${LIMITS.linkLabel} characters`,
            );
          }
          if (typeof t.link.href !== "string" || t.link.href.length > LIMITS.href) {
            errs.push(`text.${l}.link.href must be a string of at most ${LIMITS.href} characters`);
          } else if (t.link.href && !HREF_RE.test(t.link.href)) {
            errs.push(
              `text.${l}.link.href must be an internal path (/…), an anchor (#…) or an http(s) URL`,
            );
          }
        }
      }
    }
  }

  /* A published question that is invisible everywhere is a mistake, not a
     choice: the default language must at least be complete. */
  if (rec.status === STATUS.PUBLISHED && !isComplete(rec.text?.[FAQ_DEFAULT_LOCALE])) {
    errs.push(
      `a published question needs a complete ${FAQ_DEFAULT_LOCALE.toUpperCase()} text (question and answer)`,
    );
  }

  return errs;
}
