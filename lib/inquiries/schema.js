/* Maria Maria — contact inquiry schema.
   ==================================================================
   The SHAPE of a record in the Anfragen inbox: what the /kontakt form sends,
   plus the desk's own fields (status, notes). A plain module without any
   Node dependency so the admin's client components can import the enums
   and helpers; the persistence lives next door in store.js.

   Intent values are the six stable keys of the contact hand-off
   (components/kontakt/intents.js). They are duplicated here on purpose —
   the inbox must never accept a value merely because a client module
   knows it — and the list is the filter axis of the admin page. */

/* ---------------------------------------------------------------- enums ---- */

export const INQUIRY_INTENTS = Object.freeze([
  "gastronomie_feinkost",
  "handel_wiederverkauf",
  "event_feier",
  "verkostung",
  "individuelle_auswahl",
  "sonstiges",
]);

/** Where an inquiry stands on the desk. Set by a person, never derived. */
export const INQUIRY_STATUS = Object.freeze({
  NEW: "neu",
  IN_PROGRESS: "in_bearbeitung",
  ANSWERED: "beantwortet",
  REJECTED: "abgelehnt",
});

/** Ordered for the filter bar and the status control. */
export const INQUIRY_STATUSES = Object.freeze(Object.values(INQUIRY_STATUS));

/** Languages the storefront speaks — the page an inquiry was sent from. */
export const INQUIRY_LANGUAGES = Object.freeze(["de", "it", "en", "cs"]);
export const INQUIRY_DEFAULT_LANGUAGE = "de";

/* ---------------------------------------------------------------- limits ---- */

export const INQUIRY_MAX = Object.freeze({
  name: 120,
  email: 200,
  company: 160,
  city: 120,
  phone: 60,
  message: 4000,
  intentLabel: 80,
  notes: 4000,
  details: 6,
  detailKey: 40,
  detailLabel: 80,
  detailValue: 200,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ------------------------------------------------------------- helpers ---- */

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** "de-DE" / "it" / "cs-CZ" → one of the four storefront codes; anything
    else is treated as German, the storefront's default. */
export function normalizeLanguage(raw) {
  if (typeof raw !== "string") return INQUIRY_DEFAULT_LANGUAGE;
  const base = raw.trim().toLowerCase().split(/[-_]/)[0];
  return INQUIRY_LANGUAGES.includes(base) ? base : INQUIRY_DEFAULT_LANGUAGE;
}

export const isInquiryIntent = (v) => INQUIRY_INTENTS.includes(v);
export const isInquiryStatus = (v) => INQUIRY_STATUSES.includes(v);

/**
 * Trim, cap and reshape what a client sent. Does not validate — see
 * validateSubmission(); the two are separate so a route can report every
 * problem at once after the payload has been normalised.
 */
export function sanitizeSubmission(body) {
  const out = {
    intent: str(body?.intent, 40),
    intentLabel: str(body?.intentLabel, INQUIRY_MAX.intentLabel),
    name: str(body?.name, INQUIRY_MAX.name),
    email: str(body?.email, INQUIRY_MAX.email),
    company: str(body?.company, INQUIRY_MAX.company),
    city: str(body?.city, INQUIRY_MAX.city),
    phone: str(body?.phone, INQUIRY_MAX.phone),
    message: str(body?.message, INQUIRY_MAX.message),
    language: normalizeLanguage(body?.language),
  };

  out.details = Array.isArray(body?.details)
    ? body.details
        .slice(0, INQUIRY_MAX.details)
        .map((d) => ({
          key: str(d?.key, INQUIRY_MAX.detailKey),
          label: str(d?.label, INQUIRY_MAX.detailLabel),
          value: str(d?.value, INQUIRY_MAX.detailValue),
        }))
        .filter((d) => d.label && d.value)
    : [];

  return out;
}

/** German messages: the storefront form shows its own translated copy and
    only needs the status code; the text is for logs and API consumers. */
export function validateSubmission(d) {
  if (!isInquiryIntent(d.intent)) return "Anliegen fehlt oder ist unbekannt.";
  if (!d.name) return "Name fehlt.";
  if (!EMAIL_RE.test(d.email)) return "E-Mail-Adresse ist ungültig.";
  if (!d.message) return "Nachricht fehlt.";
  return null;
}

/**
 * Structural validation of a stored record — the write path of the store
 * runs it so a malformed inquiry can never enter the inbox. Returns a list
 * of human-readable problems; empty means valid.
 */
export function validateInquiry(item) {
  const errs = [];
  const req = (cond, msg) => {
    if (!cond) errs.push(msg);
  };

  req(typeof item?.id === "string" && item.id, "id is required");
  req(typeof item?.receivedAt === "string" && !Number.isNaN(Date.parse(item.receivedAt)),
    "receivedAt must be an ISO date");
  req(isInquiryIntent(item?.intent), `intent must be one of ${INQUIRY_INTENTS.join(", ")}`);
  req(isInquiryStatus(item?.status), `status must be one of ${INQUIRY_STATUSES.join(", ")}`);
  req(INQUIRY_LANGUAGES.includes(item?.language),
    `language must be one of ${INQUIRY_LANGUAGES.join(", ")}`);
  req(typeof item?.name === "string" && item.name.trim(), "name is required");
  req(typeof item?.email === "string" && EMAIL_RE.test(item.email), "email must be valid");
  req(typeof item?.message === "string" && item.message.trim(), "message is required");
  req(typeof item?.notes === "string", "notes must be a string");
  req(Array.isArray(item?.details), "details must be an array");
  (item?.details ?? []).forEach((d, i) => {
    req(typeof d?.label === "string" && d.label, `details[${i}].label is required`);
    req(typeof d?.value === "string" && d.value, `details[${i}].value is required`);
  });

  return errs;
}

/** Throwing variant for the write path. */
export function assertInquiry(item) {
  const errs = validateInquiry(item);
  if (errs.length) {
    const err = new Error(`Invalid inquiry: ${errs.join("; ")}`);
    err.code = "VALIDATION";
    err.details = errs;
    throw err;
  }
  return item;
}

/* --------------------------------------------------------------- reply ---- */

/* Subject line of the reply, in the language the visitor wrote in — the
   intent label already arrived in that language from the form. The id at
   the end lets the desk match the answer to the record later. */
const REPLY_SUBJECT = {
  de: "Ihre Anfrage an Maria Maria",
  it: "La Sua richiesta a Maria Maria",
  en: "Your inquiry to Maria Maria",
  cs: "Vaše poptávka u Maria Maria",
};

export function replySubject(inquiry) {
  const base = REPLY_SUBJECT[inquiry?.language] ?? REPLY_SUBJECT.de;
  const label = inquiry?.intentLabel || inquiry?.intent || "";
  return `Re: ${base}${label ? ` – ${label}` : ""} [${inquiry?.id ?? ""}]`;
}

export function replyMailto(inquiry) {
  const to = encodeURIComponent(inquiry?.email ?? "");
  const subject = encodeURIComponent(replySubject(inquiry));
  return `mailto:${to}?subject=${subject}`;
}

/* ----------------------------------------------------------------- CSV ---- */

/* Semicolon-separated with a UTF-8 BOM: that is what a German Excel opens
   into columns without an import dialog. CRLF row endings per RFC 4180. */
export const CSV_COLUMNS = Object.freeze([
  "id",
  "receivedAt",
  "status",
  "intent",
  "name",
  "email",
  "company",
  "city",
  "phone",
  "language",
  "message",
  "details",
  "notes",
  "delivery",
]);

const csvCell = (v) => {
  const s = v == null ? "" : String(v);
  return /[;"\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(items) {
  const rows = [CSV_COLUMNS.join(";")];
  for (const i of items) {
    rows.push(
      CSV_COLUMNS.map((col) => {
        if (col === "details") {
          return csvCell((i.details ?? []).map((d) => `${d.label}: ${d.value}`).join(" | "));
        }
        return csvCell(i[col]);
      }).join(";"),
    );
  }
  return `﻿${rows.join("\r\n")}\r\n`;
}
