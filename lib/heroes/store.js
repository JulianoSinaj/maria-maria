import { jsonStore } from "@/lib/admin/jsonStore";
import {
  HERO_ALT_LOCALES,
  HERO_PAGES,
  defaultHeroPageConfig,
  heroPage,
} from "./pages";

/* Per-page hero configuration — state and persistence.
   ==================================================================
   Server-only: it writes through to data/admin/hero-pages.json (see
   lib/admin/jsonStore.js for why these stores persist while the older ones do
   not). The catalogue, the limits and the validator live in ./pages.js, which
   the client may import.

   Only what an editor actually CHANGED is stored. A slot nobody has touched
   is absent from the document, and reading it produces the page's live values
   from the catalogue — so a later change to what the storefront ships is
   picked up here instead of being masked by a stale copy of the old value. */

const store = jsonStore("hero-pages", () => ({ version: 1, pages: {} }));

/** One slot, defaults filled in. Unknown key → null. */
function merge(key, stored) {
  const base = defaultHeroPageConfig(key);
  if (!base) return null;
  if (!stored) return base;
  return {
    key,
    image: {
      ...base.image,
      ...(stored.image ?? {}),
      focus: { ...base.image.focus, ...(stored.image?.focus ?? {}) },
    },
    alt: { ...base.alt, ...(stored.alt ?? {}) },
  };
}

/** Every slot in catalogue order, with stored edits applied. */
export async function getHeroPages() {
  const doc = await store.read();
  return HERO_PAGES.map((page) => merge(page.key, doc.pages?.[page.key]));
}

export async function getHeroPageConfig(key) {
  const doc = await store.read();
  return merge(key, doc.pages?.[key]);
}

/** Merge a validated patch into one slot and persist. */
export async function putHeroPageConfig(key, patch) {
  if (!heroPage(key)) return null;

  const doc = await store.update((current) => {
    const pages = current.pages ?? {};
    const previous = pages[key] ?? {};

    const image = {
      ...previous.image,
      ...(patch.image ?? {}),
      ...(patch.image?.focus || previous.image?.focus
        ? { focus: { ...previous.image?.focus, ...(patch.image?.focus ?? {}) } }
        : {}),
    };

    const alt = { ...previous.alt };
    for (const locale of HERO_ALT_LOCALES) {
      if (patch.alt && locale in patch.alt) alt[locale] = patch.alt[locale];
    }

    return {
      ...current,
      version: 1,
      pages: {
        ...pages,
        [key]: {
          ...(Object.keys(image).length ? { image } : {}),
          ...(Object.keys(alt).length ? { alt } : {}),
        },
      },
    };
  });

  return merge(key, doc.pages[key]);
}

/** Hand one slot (or all of them) back to the live values. */
export async function resetHeroPageConfig(key) {
  if (!key) {
    await store.reset();
    return;
  }
  await store.update((current) => {
    const pages = { ...(current.pages ?? {}) };
    delete pages[key];
    return { ...current, pages };
  });
}
