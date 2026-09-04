import { NextResponse } from "next/server";
import { list as listWines } from "@/lib/inventory/store";
import { list as listInquiries } from "@/lib/inquiries/store";
import { list as listFaq, groupSummaries } from "@/lib/faq/store";
import { STATUS as FAQ_STATUS, FAQ_DEFAULT_LOCALE } from "@/lib/faq/schema";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routing";
import { publishedInterviews } from "@/components/magazin/interviewRegistry";
import { interviewPath } from "@/components/magazin/interviewPath";

/* Global admin search — one query across the four bodies of content the
   backoffice is responsible for.
   ==================================================================
   The header box used to be decoration: an input that filtered nothing.
   This is what stands behind it now.

     wines       lib/inventory/store   → /admin/portfolio, search pre-filled
     inquiries   lib/inquiries/store   → /admin/anfragen,  record opened
     FAQ         lib/faq/store         → /admin/faq,       group + question
     interviews  the interview registry → the article on the storefront

   Three of the four have an editing surface in here, so their results stay
   inside the backoffice. Interviews do not have one yet — their results open
   the published article instead, which is honest: the search finds the piece
   and shows it where a reader sees it. When the magazine section lands, only
   the href in searchInterviews() changes.

   Every source is read through the same store the section pages read, so a
   result can never be staler — or fresher — than the page it links to. That
   is also why FAQ drafts are included: they are editable records with a
   place to be edited, and finding them is the point.

   `force-dynamic` for the usual reason: the stores are process singletons
   and must not be captured at build time. */
export const dynamic = "force-dynamic";

/* Below two characters every query matches half the catalogue; the palette
   asks for more instead of rendering noise. */
const MIN_QUERY = 2;

/* Per source, so one very common word ("wein") cannot push the other three
   sources off the panel. What is cut off is reported as `more`. */
const PER_GROUP = 5;

/* ------------------------------------------------------------ matching ---- */

/* Fold away everything that only looks like a difference: case, the accents
   of Italian (perché) and the German ß. "grosse" then finds "Große", and
   "falanghina" finds "Falanghìna" — an editor should not have to reproduce
   diacritics to find a record they can see on screen. */
const fold = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** Every term must appear somewhere in the haystack — "lugana 2023" narrows
    rather than widens, which is how people expect a search box to behave. */
const terms = (query) => fold(query).split(/\s+/).filter(Boolean);

/**
 * Score a record, or 0 when it does not match at all.
 * The title is worth more than the body, and a hit at the start of a word is
 * worth more than one in the middle — so "prim" ranks "Primitivo" above a FAQ
 * answer that happens to mention it.
 */
function score(needles, title, body = "") {
  const t = fold(title);
  const b = fold(body);
  let total = 0;

  for (const needle of needles) {
    const inTitle = t.indexOf(needle);
    const inBody = b.indexOf(needle);
    if (inTitle === -1 && inBody === -1) return 0;

    if (inTitle === 0) total += 100;
    else if (inTitle > 0) total += /\W/.test(t[inTitle - 1] ?? "") ? 60 : 30;
    else total += /\W/.test(b[inBody - 1] ?? "") || inBody === 0 ? 12 : 6;
  }
  return total;
}

/** Cut a snippet around the first hit, so the row shows WHY it matched. */
function excerpt(text, needles, length = 110) {
  const plain = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!plain) return "";
  const folded = fold(plain);
  const at = needles
    .map((n) => folded.indexOf(n))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b)[0];

  if (at === undefined || at < length * 0.6) {
    return plain.length > length ? `${plain.slice(0, length)} …` : plain;
  }
  const start = Math.max(0, at - Math.round(length * 0.35));
  return `… ${plain.slice(start, start + length).trim()} …`;
}

const rank = (rows, limit = PER_GROUP) => {
  rows.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  return {
    items: rows.slice(0, limit).map((r) => r.item),
    more: Math.max(0, rows.length - limit),
  };
};

/* -------------------------------------------------------------- sources ---- */

/* Wines land on the portfolio with its search box pre-filled — that section
   owns the editing, so the palette hands over instead of duplicating it. */
const portfolioHref = (name) => `/admin/portfolio?q=${encodeURIComponent(name)}`;

function searchWines(needles) {
  const rows = [];
  /* archived wines are included on purpose: "where did the Chiaretto go" is
     exactly the question a search gets asked */
  for (const wine of listWines({ includeArchived: true })) {
    const body = [
      wine.fullName,
      wine.slug,
      wine.appellation?.name,
      wine.appellation?.region,
      wine.appellation?.zone,
      wine.vintage,
      ...(wine.tastingNotes ?? []),
    ]
      .filter(Boolean)
      .join(" · ");

    const value = score(needles, wine.name, body);
    if (!value) continue;

    rows.push({
      score: value,
      item: {
        id: `wine:${wine.id}`,
        kind: "wine",
        title: wine.name,
        subtitle: [wine.appellation?.name, wine.appellation?.region].filter(Boolean).join(" · "),
        meta: String(wine.vintage ?? ""),
        badge: { group: "status", value: wine.status },
        href: portfolioHref(wine.name),
        external: false,
      },
    });
  }
  return rank(rows);
}

function searchInquiries(needles) {
  const rows = [];
  /* The inbox is small and lives in one file; filtering here rather than in
     the store keeps folding and ranking identical across all four sources.
     If it ever grows past a few thousand records, this is the place to push
     the needle down into store.list(). */
  for (const inquiry of listInquiries()) {
    const body = [
      inquiry.id,
      inquiry.email,
      inquiry.company,
      inquiry.city,
      inquiry.phone,
      inquiry.intentLabel,
      inquiry.message,
      ...(inquiry.details ?? []).map((d) => `${d.label} ${d.value}`),
      inquiry.notes,
    ]
      .filter(Boolean)
      .join(" · ");

    const value = score(needles, inquiry.name, body);
    if (!value) continue;

    rows.push({
      score: value,
      item: {
        id: `inquiry:${inquiry.id}`,
        kind: "inquiry",
        title: inquiry.name,
        subtitle: excerpt(inquiry.message, needles, 90),
        meta: inquiry.email,
        at: inquiry.receivedAt,
        badge: { group: "inquiryStatus", value: inquiry.status },
        /* the inbox opens the record itself — the page already reads ?id= */
        href: `/admin/anfragen?id=${encodeURIComponent(inquiry.id)}`,
        external: false,
      },
    });
  }
  /* among equally good matches the newest message wins, unlike the other
     sources where alphabetical order is the calmer answer */
  rows.sort((a, b) => b.score - a.score || String(b.item.at).localeCompare(String(a.item.at)));
  return {
    items: rows.slice(0, PER_GROUP).map((r) => r.item),
    more: Math.max(0, rows.length - PER_GROUP),
  };
}

function searchFaq(needles, locale) {
  /* the editor's own rail data: display name, page path and whether a group
     is a page or a wine — no second source to keep in step */
  const summaries = Object.fromEntries(groupSummaries().map((g) => [g.key, g]));
  const rows = [];

  for (const record of listFaq()) {
    /* the admin language, falling back to German where a translation is
       still empty — the same rule the storefront overlays follow */
    const text = record.text?.[locale]?.q ? record.text[locale] : record.text?.[FAQ_DEFAULT_LOCALE];
    if (!text?.q) continue;

    const value = score(needles, text.q, `${text.a ?? ""} ${record.id}`);
    if (!value) continue;

    const summary = summaries[record.group];
    rows.push({
      score: value,
      item: {
        id: `faq:${record.id}`,
        kind: "faq",
        title: text.q,
        subtitle: excerpt(text.a, needles),
        /* the client translates a page key; a wine name is a proper noun */
        groupKey: summary?.kind === "wine" ? null : (summary?.key ?? record.group),
        groupName: summary?.kind === "wine" ? (summary.name ?? summary.slug) : null,
        meta: null,
        /* the FAQ editor scopes to one group and its search matches the id,
           so both parameters together open exactly this question */
        badge:
          record.status === FAQ_STATUS.DRAFT ? { group: "status", value: "draft" } : null,
        href: `/admin/faq?group=${encodeURIComponent(record.group)}&q=${encodeURIComponent(record.id)}`,
        external: false,
      },
    });
  }
  return rank(rows);
}

async function searchInterviews(needles, locale) {
  const dict = await getDictionary(locale);
  /* code pieces and the desk's own records, merged and published-only —
     the same list the magazine and the article route read */
  const interviews = await publishedInterviews(dict, locale);
  const rows = [];

  for (const interview of interviews) {
    const title = `${interview.name} — ${interview.headline}`;
    const body = [interview.deck, interview.badge, interview.eyebrow, interview.slug]
      .filter(Boolean)
      .join(" · ");

    const value = score(needles, title, body);
    if (!value) continue;

    rows.push({
      score: value,
      item: {
        id: `interview:${interview.slug}`,
        kind: "interview",
        title: interview.name,
        subtitle: interview.headline,
        meta: interview.badge ?? null,
        /* no editor for the magazine yet: the piece opens where a reader
           sees it, in a second tab, so the search stays where it was */
        href: localePath(locale, interviewPath(interview.slug)),
        external: true,
      },
    });
  }
  return rank(rows);
}

/* ---------------------------------------------------------------- route ---- */

/** GET /api/admin/search?q=…&locale=de|it|en
    → { data: { query, groups: [{ key, items, more }], total } } */
export async function GET(request) {
  const p = request.nextUrl.searchParams;
  const query = (p.get("q") ?? "").trim();
  /* The admin language, not the storefront's: it decides which translation
     of a FAQ answer or an interview is searched, and which prefix a
     storefront link carries. "cs" never arrives — the backoffice speaks
     three languages — and an unknown value falls back to German inside
     getDictionary() and localePath(). */
  const locale = p.get("locale") ?? FAQ_DEFAULT_LOCALE;

  if (query.length < MIN_QUERY) {
    return NextResponse.json({ data: { query, groups: [], total: 0, short: true } });
  }

  const needles = terms(query);
  const wines = searchWines(needles);
  const inquiries = searchInquiries(needles);
  const faq = searchFaq(needles, locale);
  const interviews = await searchInterviews(needles, locale);

  /* Fixed order, not by hit count: what the backoffice can act on comes
     first, so the panel always answers "what can I do here" before "what
     else mentions this". */
  const groups = [
    { key: "wines", ...wines },
    { key: "inquiries", ...inquiries },
    { key: "faq", ...faq },
    { key: "interviews", ...interviews },
  ].filter((g) => g.items.length);

  return NextResponse.json({
    data: {
      query,
      groups,
      total: groups.reduce((sum, g) => sum + g.items.length + g.more, 0),
    },
  });
}
