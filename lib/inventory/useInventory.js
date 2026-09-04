"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* Client access layer for the inventory API.
   Keeps fetch/error/refetch handling in one place so section pages don't each
   re-derive it. An AbortController per request means a fast filter change
   cannot let a stale response overwrite a newer one. */

const BASE = "/api/admin/inventory";

async function request(url, init) {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  if (res.status === 204) return null;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.error ?? `Request failed (${res.status})`);
    err.status = res.status;
    err.details = body?.details;
    throw err;
  }
  return body?.data ?? null;
}

/** Same as request(), but keeps the envelope so callers can read `meta`. */
async function requestEnvelope(url, init) {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.error ?? `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body ?? { data: [], meta: {} };
}

const toQuery = (filters = {}) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
};

/** List inventory items, refetching whenever the filters change. */
export function useInventory(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ count: 0, categories: {}, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  /* serialise the filters so a fresh object literal each render doesn't
     retrigger the effect */
  const query = useMemo(() => toQuery(filters), [filters]);
  const abortRef = useRef(null);

  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    requestEnvelope(`${BASE}${query}`, { signal: ctrl.signal })
      .then((body) => {
        setItems(body.data ?? []);
        if (body.meta) setMeta(body.meta);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [query, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { items, meta, loading, error, refetch };
}

/** Aggregate counts for the overview cards. */
export function useInventoryStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    request(`${BASE}?view=stats`, { signal: ctrl.signal })
      .then(setStats)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      });
    return () => ctrl.abort();
  }, []);

  return { stats, error };
}

/* ---- mutations: plain async functions, callers own the refetch ---- */

export const createWine = (item) =>
  request(BASE, { method: "POST", body: JSON.stringify(item) });

export const updateWine = (id, patch) =>
  request(`${BASE}/${id}`, { method: "PATCH", body: JSON.stringify(patch) });

export const commitBottles = (id, commit) =>
  request(`${BASE}/${id}`, { method: "PATCH", body: JSON.stringify({ commit }) });

export const deleteWine = (id) => request(`${BASE}/${id}`, { method: "DELETE" });

export const archiveWine = (id) =>
  request(`${BASE}/${id}`, { method: "PATCH", body: JSON.stringify({ action: "archive" }) });

export const restoreWine = (id) =>
  request(`${BASE}/${id}`, { method: "PATCH", body: JSON.stringify({ action: "restore" }) });

/* ---- partner shop --------------------------------------------------------

   The sync lives on its own endpoint rather than as another PATCH action:
   it is the only operation here that talks to a third party, it can take a
   second, and the nightly job calls the same function from outside the
   session. Both variants keep the envelope — the caller needs `meta` to say
   what the run found (404s, renamed products, a price that drifted). */

const SHOP = "/api/admin/shop/sync";

/** Sync one wine. Returns { data: item, meta: { result, summary } }. */
export const syncWineShop = (id) =>
  requestEnvelope(SHOP, { method: "POST", body: JSON.stringify({ id }) });

/** Sync every wine that carries a handle.
    Returns { data: items, meta: { run, summary } }. */
export const syncAllShops = () => requestEnvelope(SHOP, { method: "POST", body: JSON.stringify({}) });

/** What the last sync found, without talking to the shop. */
export const shopSyncSummary = () => request(SHOP);
