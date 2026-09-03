"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* Client access layer for the inquiries API — the Anfragen inbox.
   Same shape as lib/inventory/useInventory.js so the section pages read
   alike: one hook for the list (with an AbortController per request so a
   fast filter change cannot let a stale response overwrite a newer one),
   plain async functions for mutations; callers own the refetch. */

const BASE = "/api/admin/inquiries";

async function request(url, init) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
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
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.error ?? `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body ?? { data: [], meta: {} };
}

export const toQuery = (filters = {}) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
};

const EMPTY_META = {
  count: 0,
  total: 0,
  byStatus: {},
  byIntent: {},
  open: 0,
  last7Days: 0,
  persistence: null,
};

/** List inquiries, refetching whenever the filters change.
    `filters`: { intent, status, language, search, sort, limit } */
export function useInquiries(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(EMPTY_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

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
        if (body.meta) setMeta({ ...EMPTY_META, ...body.meta });
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

/* ---- single records & mutations: callers own the refetch ---- */

export const getInquiry = (id) => request(`${BASE}/${encodeURIComponent(id)}`);

export const updateInquiry = (id, patch) =>
  request(`${BASE}/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) });

export const deleteInquiry = (id) =>
  request(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });

/** Download address of the CSV export for the current filters. */
export const csvUrl = (filters = {}) => `${BASE}${toQuery({ ...filters, format: "csv" })}`;
