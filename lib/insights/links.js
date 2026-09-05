/* Does every "Im Shop entdecken" still land on a bottle?
   ==================================================================
   Nine wines link to nine product pages in a shop that is not ours. Terra
   Vera can rename a handle, unpublish a product or sell out, and nothing in
   this repository would notice: the link keeps rendering, and the visitor
   who was ready to buy gets a 404 from a stranger's shop. That is the most
   expensive broken link on the site.

   Shopify answers `<product-url>.js` with public JSON for anyone — no API
   token, no app, no key (verified against terra-vera.com, 2026-09-04). It
   carries `available` and `price` alongside the title, so one request per
   wine answers three questions at once: does the page exist, is the bottle
   buyable, and does the price still match our catalogue.

   The check runs on demand from the backoffice and its result is cached in
   the insights store. It is deliberately NOT run while a page renders: the
   overview must not wait on a foreign server, and a shop that is briefly
   down must not make our own backoffice look broken. */

import { EXTERNAL_PRODUCT_URLS, EXTERNAL_SHOP_URL, PARTNER_SHOP_NAME } from "../shop/config.js";
import { SHOP_COLLECTION_KEY } from "./model.js";
import { bySlug } from "../../components/data.js";

const TIMEOUT_MS = 8000;

/* A real browser-ish header. Shopify serves the .js endpoint to anything,
   but an empty user agent is the first thing a WAF blocks, and a check that
   reports nine broken links because it was mistaken for a scraper is worse
   than no check at all. */
const HEADERS = {
  "User-Agent": "MariaMariaLinkCheck/1.0 (+https://www.maria-maria.de)",
  Accept: "application/json,text/javascript;q=0.9,*/*;q=0.8",
};

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: HEADERS,
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) return { status: res.status, body: null };
  return { status: res.status, body: await res.json().catch(() => null) };
}

/* Shopify prices are integer cents in the .js endpoint. */
const toEuro = (cents) => (typeof cents === "number" ? cents / 100 : null);

async function checkProduct(slug, url) {
  const wine = bySlug(slug);
  const row = {
    key: slug,
    kind: "product",
    name: wine?.name ?? slug,
    url,
    ok: false,
    status: null,
    available: null,
    price: null,
    ourPrice: wine?.price ?? null,
    priceMatches: null,
    error: null,
  };

  try {
    const { status, body } = await fetchJson(`${url}.js`);
    row.status = status;
    if (status !== 200 || !body) return row;

    row.ok = true;
    row.available = Boolean(body.available);
    row.price = toEuro(body.price);
    row.title = typeof body.title === "string" ? body.title : null;
    if (row.price != null && row.ourPrice != null) {
      /* A cent of float noise must not read as a price change. */
      row.priceMatches = Math.abs(row.price - row.ourPrice) < 0.005;
    }
  } catch (err) {
    row.error = err?.name === "TimeoutError" ? "timeout" : (err?.message ?? "unreachable");
  }
  return row;
}

async function checkCollection(url) {
  const row = {
    key: SHOP_COLLECTION_KEY,
    kind: "collection",
    name: `${PARTNER_SHOP_NAME} — Sammelseite`,
    url,
    ok: false,
    status: null,
    available: null,
    price: null,
    ourPrice: null,
    priceMatches: null,
    error: null,
  };

  try {
    /* A collection has no .js twin; ask for its product list instead, which
       is the same public JSON surface and proves the handle still exists. */
    const { status, body } = await fetchJson(`${url}/products.json?limit=1`);
    row.status = status;
    row.ok = status === 200 && Array.isArray(body?.products);
    if (row.ok) row.products = body.products.length;
  } catch (err) {
    row.error = err?.name === "TimeoutError" ? "timeout" : (err?.message ?? "unreachable");
  }
  return row;
}

/**
 * Check every outbound shop target. Returns the record stored in the
 * insights store and rendered by the overview.
 */
export async function runLinkCheck({ now = new Date() } = {}) {
  const products = Object.entries(EXTERNAL_PRODUCT_URLS);

  const items = await Promise.all([
    ...products.map(([slug, url]) => checkProduct(slug, url)),
    checkCollection(EXTERNAL_SHOP_URL),
  ]);

  return {
    checkedAt: now.toISOString(),
    shop: PARTNER_SHOP_NAME,
    items,
    counts: {
      total: items.length,
      broken: items.filter((i) => !i.ok).length,
      unavailable: items.filter((i) => i.ok && i.available === false).length,
      priceDrift: items.filter((i) => i.priceMatches === false).length,
    },
  };
}
