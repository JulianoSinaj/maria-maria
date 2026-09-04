"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* Client access layer for the FAQ API.
   Same shape as lib/inquiries/useInquiries.js and lib/inventory/useInventory.js
   so the section pages read alike: one hook for the list (an AbortController
   per request, so a fast group switch cannot let a stale response overwrite a
   newer one), plain async functions for mutations, callers own the refetch. */

const BASE = "/api/admin/faq";

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
    err.code = body?.code;
    throw err;
  }
  return body?.data ?? null;
}

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

const toQuery = (filters = {}) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
};

const EMPTY_META = {
  count: 0,
  published: 0,
  drafts: 0,
  groups: [],
  locales: ["de", "it", "en", "cs"],
  missing: {},
  persistence: null,
};

/** The questions of one group, plus the manifest every response carries. */
export function useFaq(filters) {
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

  /* Optimistic list order for the drag: the server is still the authority,
     but the row must not spring back under the cursor while it answers. */
  const setOrder = useCallback((next) => setItems(next), []);

  return { items, meta, loading, error, refetch, setOrder };
}

/* ---- mutations ---------------------------------------------------------- */

export const createQuestion = (record) =>
  request(BASE, { method: "POST", body: JSON.stringify(record) });

export const updateQuestion = (id, patch) =>
  request(`${BASE}/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) });

export const deleteQuestion = (id) =>
  request(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });

/** Rename — refused for a published question unless `force` is set, because
    the id carries every deep link and the faq_id in GA4. */
export const renameQuestion = (id, nextId, { force = false } = {}) =>
  request(`${BASE}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ action: "rename", id: nextId, force }),
  });

export const reorderQuestions = (group, subgroup, ids) =>
  request(BASE, {
    method: "PATCH",
    body: JSON.stringify({ action: "reorder", group, subgroup, ids }),
  });

export const saveSubgroup = (group, key, label, order) =>
  request(BASE, {
    method: "PATCH",
    body: JSON.stringify({ action: "subgroup", group, key, label, order }),
  });

export const deleteSubgroup = (group, subgroup) =>
  request(`${BASE}${toQuery({ group, subgroup })}`, { method: "DELETE" });
