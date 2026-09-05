/* Maria Maria — legal document schema.
   ==================================================================
   The SHAPE of Impressum, Datenschutzerklärung and AGB: a title, an
   optional intro, and an ORDERED list of sections, each with a title and
   one or more paragraphs. Exactly the shape the four content/<locale>/
   legal.js files already carry, so the seed and an edited document are the
   same thing and the storefront cannot tell them apart.

   A plain module without any Node dependency: the editor in the browser
   imports the limits and the paragraph helpers, the store and the API route
   import the validation. Persistence lives next door in store.js.

   The decisive difference to the generic Seiten editor (lib/pages): there,
   a value must keep the exact shape of the code, list lengths included —
   which is right for a page whose components expect five cards. A legal
   text is the opposite case. When Terra Vera becomes the seller, AGB §§ 4–7
   about prices, delivery, payment and withdrawal have to be rewritten, and
   some of them have to GO. Sections are therefore free to be added, removed
   and reordered, and only the shape of a single section is fixed. */

/* ---------------------------------------------------------------- enums ---- */

/** The three documents. Order = the order of the tabs in the editor. */
export const LEGAL_TYPES = Object.freeze(["impressum", "datenschutz", "agb"]);

export const isLegalType = (v) => LEGAL_TYPES.includes(v);

/* Which of the three carries a lede paragraph above the sections. Only the
   Datenschutzerklärung does today; the flag is read from the seed rather
   than hard-coded, so a document that grows one later is not a code change
   here. This list is only the EDITOR's hint about which field to offer. */
export const LEGAL_WITH_INTRO = Object.freeze(["datenschutz"]);

/** How a revision came to be. Recorded so the history reads as a story
    rather than a list of identical-looking saves. */
export const LEGAL_ACTIONS = Object.freeze(["edit", "restore", "reset"]);

export const isLegalAction = (v) => LEGAL_ACTIONS.includes(v);

/* ---------------------------------------------------------------- limits ---- */

/* Generous, because a legal text is allowed to be long — these are guards
   against a runaway paste, not editorial advice. The paragraph cap is the
   one an editor can actually reach: § 7 of the AGB (Widerrufsrecht) is
   already ~380 characters and the statutory Widerrufsbelehrung is longer
   than everything currently on the page. */
export const LEGAL_MAX = Object.freeze({
  title: 160,
  intro: 1600,
  sectionTitle: 200,
  paragraph: 6000,
  sections: 60,
  paragraphs: 40,
  author: 80,
});

/** Revisions kept per document. Fifty covers years of a text that changes
    a handful of times a year, and bounds the store file. */
export const LEGAL_MAX_REVISIONS = 50;

/* ------------------------------------------------------------- helpers ---- */

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** "YYYY-MM-DD" — the shape of the reviewedAt date. A date and not a
    timestamp: "we checked this text on the 4th" is a statement about a day,
    and a time of day would suggest a precision nobody has. */
export const isIsoDay = (v) =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

/** Today in the same shape, in local time — the editor's "heute" button and
    the default of a review stamp. */
export const isoToday = (now = new Date()) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;

/* --- paragraphs as one editable text ---------------------------------------

   A section's body is an ARRAY of paragraphs, because that is what
   LegalShell renders — one <p> each. Editing it as an array would mean a
   field per paragraph and a button to add one, which is the wrong shape for
   prose: nobody writes a Widerrufsbelehrung by first deciding how many
   paragraphs it will have.

   So the editor shows one textarea per section and a BLANK LINE separates
   paragraphs — the convention everyone already knows from writing anywhere
   else. These two functions are the whole contract, and they round-trip:
   splitParagraphs(joinParagraphs(body)) === body for any body this module
   would have accepted. */

export function splitParagraphs(text) {
  if (typeof text !== "string") return [];
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    /* a single newline inside a paragraph is a soft wrap from the textarea,
       not a new paragraph — collapse it to a space so the rendered text
       reads as one block */
    .map((part) => part.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export const joinParagraphs = (body) => (Array.isArray(body) ? body.join("\n\n") : "");

/* ------------------------------------------------------------ sanitize ---- */

/**
 * Trim, cap and reshape what a client sent into the document shape.
 * Does NOT judge it — see validateDocument(); the two are separate so the
 * route can report every problem at once against the normalised value.
 *
 * `intro` is preserved as undefined when it was absent, so a document that
 * never had a lede does not grow an empty one.
 */
export function sanitizeDocument(input) {
  const out = {
    title: str(input?.title, LEGAL_MAX.title),
    sections: [],
  };

  if (input?.intro !== undefined && input?.intro !== null) {
    out.intro = str(input.intro, LEGAL_MAX.intro);
  }

  const sections = Array.isArray(input?.sections) ? input.sections : [];
  for (const raw of sections.slice(0, LEGAL_MAX.sections)) {
    /* the body arrives either as the editor's single text or already as an
       array — both are accepted, so a script can post the stored shape back
       unchanged */
    const body = Array.isArray(raw?.body)
      ? raw.body.map((p) => str(p, LEGAL_MAX.paragraph)).filter(Boolean)
      : splitParagraphs(raw?.body).map((p) => p.slice(0, LEGAL_MAX.paragraph));

    out.sections.push({
      title: str(raw?.title, LEGAL_MAX.sectionTitle),
      body: body.slice(0, LEGAL_MAX.paragraphs),
    });
  }

  /* Three states, and they must stay apart:
       undefined — not mentioned; the caller keeps whatever is stored
       null      — deliberately no review stamp
       a string  — a date, which validateDocument() then judges

     A malformed date is passed through UNCHANGED rather than folded into
     null. Folding it here would make it unreachable for validation, and a
     mistyped "04.09.2026" would silently clear a stamp instead of being
     refused — the one outcome an editor could not see happening. */
  if (input?.reviewedAt !== undefined) {
    out.reviewedAt =
      input.reviewedAt === null || isIsoDay(input.reviewedAt)
        ? input.reviewedAt
        : typeof input.reviewedAt === "string"
          ? input.reviewedAt.trim().slice(0, 40)
          : input.reviewedAt;
  }

  return out;
}

/* ------------------------------------------------------------ validate ---- */

/**
 * Structural validation of a sanitized document. Empty array = valid.
 * Same convention as the other admin stores, so the route can answer 422
 * with `details` and the editor can put a message next to a field.
 */
export function validateDocument(doc) {
  const errs = [];

  if (!doc?.title) errs.push("title must be a non-empty string");

  if (doc?.intro !== undefined && typeof doc.intro !== "string") {
    errs.push("intro must be a string");
  }

  if (!Array.isArray(doc?.sections) || doc.sections.length === 0) {
    /* an empty legal page is never what someone meant, and it is the one
       mistake with a legal consequence — an Impressum that renders nothing
       is a missing Impressum */
    errs.push("sections must contain at least one section");
    return errs;
  }

  if (doc.sections.length > LEGAL_MAX.sections) {
    errs.push(`sections must not exceed ${LEGAL_MAX.sections} entries`);
  }

  doc.sections.forEach((section, i) => {
    if (!section?.title) errs.push(`sections[${i}].title must be a non-empty string`);
    if (!Array.isArray(section?.body) || section.body.length === 0) {
      errs.push(`sections[${i}].body must contain at least one paragraph`);
      return;
    }
    if (section.body.length > LEGAL_MAX.paragraphs) {
      errs.push(`sections[${i}].body must not exceed ${LEGAL_MAX.paragraphs} paragraphs`);
    }
    section.body.forEach((p, j) => {
      if (typeof p !== "string" || !p.trim()) {
        errs.push(`sections[${i}].body[${j}] must be a non-empty string`);
      }
    });
  });

  if (doc.reviewedAt !== undefined && doc.reviewedAt !== null && !isIsoDay(doc.reviewedAt)) {
    errs.push("reviewedAt must be a YYYY-MM-DD date or null");
  }

  return errs;
}

/* --------------------------------------------------------------- shape ---- */

/** Are two documents the same text? Used to recognise "typed the original
    back" so the store can drop the override instead of storing a copy of
    the code, and to keep a save that changed nothing out of the history. */
export function sameDocument(a, b) {
  if (!a || !b) return false;
  if ((a.title ?? "") !== (b.title ?? "")) return false;
  if ((a.intro ?? "") !== (b.intro ?? "")) return false;
  if ((a.reviewedAt ?? null) !== (b.reviewedAt ?? null)) return false;
  const sa = a.sections ?? [];
  const sb = b.sections ?? [];
  if (sa.length !== sb.length) return false;
  return sa.every((s, i) => {
    const o = sb[i];
    return (
      s.title === o.title &&
      s.body.length === o.body.length &&
      s.body.every((p, j) => p === o.body[j])
    );
  });
}

/** Word count of the whole document — the one number that tells an editor
    at a glance whether a revision was a typo fix or a rewrite. */
export function countWords(doc) {
  const parts = [doc?.title ?? "", doc?.intro ?? ""];
  for (const s of doc?.sections ?? []) {
    parts.push(s.title ?? "");
    parts.push(...(s.body ?? []));
  }
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}
