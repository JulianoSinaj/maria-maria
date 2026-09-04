"use client";
import { useCallback, useEffect, useState } from "react";

/* Client-Zugriff auf die Einstellungen-API.
   Gleiche Form wie lib/inventory/useInventory.js und lib/inquiries/useInquiries.js,
   damit die Abschnittsseiten sich gleich lesen: ein Hook für den Datensatz,
   einfache async-Funktionen fürs Schreiben, und der Aufrufer entscheidet,
   wann neu geladen wird.

   Der Datensatz ist klein und wird als Ganzes geholt: Firma, Social, SEO in
   vier Sprachen, Weiterleitungen und die Vorschau der strukturierten Daten
   kommen in einer Antwort. Vier Gruppen, die auf einer Seite stehen, in vier
   Anfragen zu holen hieße nur, vier Ladezustände zeichnen zu müssen. */

const BASE = "/api/admin/settings";

async function request(url, init) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.error ?? `Request failed (${res.status})`);
    err.status = res.status;
    err.details = body?.details;
    throw err;
  }
  return body?.data ?? null;
}

/** Den ganzen Datensatz laden. `locale` steuert nur die Sprache der
    Vorschau der strukturierten Daten, nicht den Inhalt. */
export function useSettings(locale) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    request(`${BASE}${locale ? `?locale=${locale}` : ""}`, { signal: controller.signal })
      .then((payload) => {
        setData(payload);
        setError(null);
      })
      .catch((err) => {
        /* Ein abgebrochener Aufruf ist kein Fehler, sondern ein überholter. */
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [locale, tick]);

  return { data, setData, loading, error, refetch };
}

/** Partieller Patch — eine bis vier Gruppen. Antwort ist der neue Datensatz. */
export const saveSettings = (patch, locale) =>
  request(`${BASE}${locale ? `?locale=${locale}` : ""}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });

/** Eine Gruppe (oder alles) zurück auf die Werte des Codes. */
export const resetSettingsGroup = (group, locale) =>
  request(`${BASE}?${group ? `group=${group}&` : ""}${locale ? `locale=${locale}` : ""}`, {
    method: "DELETE",
  });
