/* The FAQ seed — today's files, read once into records.
   ==================================================================
   Nothing here is typed twice: the seed is built at runtime from the very
   modules the storefront ships — content/<locale>/faq.js for the seven page
   groups and, for the nine wines, components/weine/<slug>/wineData.js with
   the text overlays in content/<locale>/weine-pages/<slug>.js merged the
   same way lib/i18n/winePages.js merges them (position for position).

   Ids are identical across the four languages (see the header comment in
   content/de/faq.js), so the page groups are joined by id; the wine
   overlays carry no ids and are joined by position, exactly like the page
   itself does. Every seeded record is `published` — it is live today. */

import { faq as deFaq } from "@/content/de/faq";
import { faq as itFaq } from "@/content/it/faq";
/* /kontakt keeps its questions beside the rest of the page's copy, not in
   faq.js — see KONTAKT_SOURCE below. */
import { kontakt as deKontakt } from "@/content/de/kontakt";
import { kontakt as itKontakt } from "@/content/it/kontakt";
import { kontakt as enKontakt } from "@/content/en/kontakt";
import { kontakt as csKontakt } from "@/content/cs/kontakt";
import { faq as enFaq } from "@/content/en/faq";
import { faq as csFaq } from "@/content/cs/faq";
import itPages from "@/content/it/weine-pages";
import enPages from "@/content/en/weine-pages";
import csPages from "@/content/cs/weine-pages";
import { WINE_PAGES, WINE_SLUGS } from "@/components/weine/wineRegistry";
import { FAQ_LOCALES, FAQ_DEFAULT_LOCALE, PAGE_GROUP_KEYS, STATUS, wineGroup } from "./schema";

/* A fixed stamp keeps the seed deterministic: two processes seeding the
   same files produce byte-identical records. */
export const SEED_STAMP = "2026-09-03T00:00:00.000Z";

const CONTENT = { de: deFaq, it: itFaq, en: enFaq, cs: csFaq };

/* The one page whose FAQ lives elsewhere. app/(site)/[locale]/kontakt/page.jsx
   reads dict.kontakt.faq.items for both the accordion and faqNode(), and
   never touches dict.faq.kontakt — so that is the list the editor must own,
   or an edit would change nothing anyone can see. Flat, six questions. */
const KONTAKT = { de: deKontakt, it: itKontakt, en: enKontakt, cs: csKontakt };
const groupContent = (locale, group) =>
  group === "kontakt"
    ? (KONTAKT[locale]?.faq?.items ?? [])
    : (CONTENT[locale]?.[group] ?? []);
const OVERLAYS = { it: itPages, en: enPages, cs: csPages };

const isNested = (entries) => entries.some((e) => Array.isArray(e?.items));
const flatten = (entries) =>
  isNested(entries) ? entries.flatMap((s) => s.items ?? []) : entries;

const textOf = (item) => ({
  q: item?.q ?? "",
  a: item?.a ?? "",
  link: item?.link ? { label: item.link.label ?? "", href: item.link.href ?? "" } : null,
});

const record = (id, group, subgroup, order, text) => ({
  id,
  group,
  subgroup,
  order,
  status: STATUS.PUBLISHED,
  publishedAt: SEED_STAMP,
  updatedAt: SEED_STAMP,
  text,
});

/** Build { items, subgroups } from the shipped files. */
export function buildSeed() {
  const items = [];
  const subgroups = [];

  for (const group of PAGE_GROUP_KEYS) {
    const perLocale = Object.fromEntries(
      FAQ_LOCALES.map((l) => [l, groupContent(l, group)]),
    );
    const de = perLocale[FAQ_DEFAULT_LOCALE];
    const byId = Object.fromEntries(
      FAQ_LOCALES.map((l) => [l, new Map(flatten(perLocale[l]).map((i) => [i.id, i]))]),
    );
    const textsFor = (id) =>
      Object.fromEntries(FAQ_LOCALES.map((l) => [l, textOf(byId[l].get(id))]));

    if (isNested(de)) {
      de.forEach((cluster, s) => {
        subgroups.push({
          group,
          key: cluster.key,
          order: s,
          label: Object.fromEntries(
            FAQ_LOCALES.map((l) => [
              l,
              perLocale[l].find((c) => c.key === cluster.key)?.label ?? "",
            ]),
          ),
        });
        (cluster.items ?? []).forEach((item, i) =>
          items.push(record(item.id, group, cluster.key, i, textsFor(item.id))),
        );
      });
    } else {
      de.forEach((item, i) => items.push(record(item.id, group, null, i, textsFor(item.id))));
    }
  }

  for (const slug of WINE_SLUGS) {
    const base = WINE_PAGES[slug]?.faq ?? [];
    base.forEach((item, i) => {
      const text = { [FAQ_DEFAULT_LOCALE]: textOf(item) };
      for (const l of FAQ_LOCALES) {
        if (l === FAQ_DEFAULT_LOCALE) continue;
        /* same rule as mergeText(): the overlay names only the text fields,
           anything it leaves out stays German — including the link path */
        const ov = OVERLAYS[l]?.[slug]?.faq?.[i];
        text[l] = {
          q: ov?.q ?? item.q ?? "",
          a: ov?.a ?? item.a ?? "",
          link: item.link
            ? {
                label: ov?.link?.label ?? item.link.label ?? "",
                href: ov?.link?.href ?? item.link.href ?? "",
              }
            : null,
        };
      }
      items.push(record(item.id, wineGroup(slug), null, i, text));
    });
  }

  return { items, subgroups };
}

/** Display names of the wine pages, keyed by slug — language-neutral. */
export const wineNames = () =>
  Object.fromEntries(WINE_SLUGS.map((slug) => [slug, WINE_PAGES[slug]?.name ?? slug]));
