"use client";
import { useCallback, useEffect, useState } from "react";

/* Client access layer for the interview API — the same shape as
   lib/inventory/useInventory: fetch/error/refetch in one place, mutations
   as plain async functions whose callers own the refetch. */

const BASE = "/api/admin/interviews";

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
  return body ?? null;
}

/** The admin list — every piece the site knows, code and store. */
export function useInterviewList() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ count: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    request(BASE, { signal: ctrl.signal })
      .then((body) => {
        setRows(body?.data ?? []);
        if (body?.meta) setMeta(body.meta);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { rows, meta, loading, error, refetch };
}

/** One record for the editor, with its meta (source, completeness, preview
    URLs, share image state). `slug` null → nothing is fetched. */
export function useInterview(slug) {
  const [state, setState] = useState({ record: null, meta: null, loading: !!slug, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!slug) {
      setState({ record: null, meta: null, loading: false, error: null });
      return undefined;
    }
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true }));
    request(`${BASE}/${encodeURIComponent(slug)}`, { signal: ctrl.signal })
      .then((body) => setState({ record: body?.data ?? null, meta: body?.meta ?? null, loading: false, error: null }))
      .catch((err) => {
        if (err.name !== "AbortError") setState({ record: null, meta: null, loading: false, error: err });
      });
    return () => ctrl.abort();
  }, [slug, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, refetch };
}

/** Wine list, regions, icons, image library — the editor's option lists. */
export function useInterviewOptions() {
  const [options, setOptions] = useState(null);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    request(`${BASE}?view=options`, { signal: ctrl.signal })
      .then((body) => setOptions(body?.data ?? null))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      });
    return () => ctrl.abort();
  }, [tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { options, error, refetch };
}

/* ---- mutations ---- */

export const createInterview = (record) =>
  request(BASE, { method: "POST", body: JSON.stringify(record) }).then((b) => b?.data);

export const saveInterview = (slug, record) =>
  request(`${BASE}/${encodeURIComponent(slug)}`, { method: "PUT", body: JSON.stringify(record) });

export const deleteInterview = (slug) =>
  request(`${BASE}/${encodeURIComponent(slug)}`, { method: "DELETE" });

export const publishInterview = (slug, publishedAt) =>
  request(`${BASE}/${encodeURIComponent(slug)}/publish`, {
    method: "POST",
    body: JSON.stringify({ action: "publish", ...(publishedAt ? { publishedAt } : {}) }),
  });

export const unpublishInterview = (slug) =>
  request(`${BASE}/${encodeURIComponent(slug)}/publish`, {
    method: "POST",
    body: JSON.stringify({ action: "unpublish" }),
  });

/** Upload an image from a File; resolves to { name, path, size, uploaded }. */
export async function uploadInterviewImage(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
  const body = await request(`${BASE}/upload`, {
    method: "POST",
    body: JSON.stringify({ name: file.name, dataUrl }),
  });
  return body?.data;
}

export const previewUrl = (slug, locale) =>
  `${BASE}/${encodeURIComponent(slug)}/preview?locale=${encodeURIComponent(locale)}`;
