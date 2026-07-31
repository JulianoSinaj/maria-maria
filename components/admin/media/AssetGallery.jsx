"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Close } from "@/components/Icons";
import { WINES } from "@/components/data";
import { GALLERY_CATEGORIES } from "@/lib/gallery/categories";

/* Media & Asset Gallery.
   The library view over every image the project actually holds — scanned
   from disk per request, classified into the five merchandising tabs. Each
   card carries the three quick actions: copy the path, open the
   full-resolution lightbox, or assign the asset to the hero section / a
   wine's mockup slot (both go through the existing admin APIs, so all their
   validation still applies — a foreign wine's packshot is still refused). */

const TABS = [{ key: "all", label: "Alle", hint: "Gesamte Bibliothek" }, ...GALLERY_CATEGORIES];

const fmtSize = (b) =>
  b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;

export default function AssetGallery() {
  const reduced = useReducedMotion();
  const fileRef = useRef(null);
  const [assets, setAssets] = useState([]);
  const [counts, setCounts] = useState({});
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null); // asset | null
  const [assignFor, setAssignFor] = useState(null); // asset | null
  const [assignWine, setAssignWine] = useState(WINES[0]?.slug ?? "");
  const [toast, setToast] = useState(null);

  const flash = (message, tone = "ok") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    setLoading(true);
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((b) => {
        setAssets(b.data.assets);
        setCounts(b.data.counts);
        setError(null);
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const visible = useMemo(
    () => (tab === "all" ? assets : assets.filter((a) => a.category === tab)),
    [assets, tab],
  );

  /* Escape closes whichever layer is open */
  useEffect(() => {
    if (!lightbox && !assignFor) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setLightbox(null);
        setAssignFor(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, assignFor]);

  const copyPath = async (asset) => {
    try {
      await navigator.clipboard.writeText(asset.path);
    } catch {
      /* clipboard API blocked (http/permissions) — legacy fallback */
      const ta = document.createElement("textarea");
      ta.value = asset.path;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    flash(`Pfad kopiert: ${asset.path}`);
  };

  const assignHero = async (asset) => {
    const res = await fetch("/api/admin/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: { src: asset.path } }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) return flash(body?.error ?? "Zuweisung fehlgeschlagen", "error");
    setAssignFor(null);
    /* the Hero Manager sits on the same page — tell it to refetch so its
       preview shows the newly assigned background immediately */
    window.dispatchEvent(new CustomEvent("mm:hero-config-changed"));
    flash(`„${asset.name}" ist jetzt Hero-Hintergrund.`);
  };

  const assignWineMockup = async (asset, slug) => {
    const res = await fetch(`/api/admin/assets/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asset: asset.path }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) return flash(body?.error ?? "Zuweisung fehlgeschlagen", "error");
    setAssignFor(null);
    const wine = WINES.find((w) => w.slug === slug);
    flash(`„${asset.name}" ist jetzt Mockup von ${wine?.name ?? slug}.`);
  };

  const pickUpload = async (file) => {
    if (!file) return;
    const category = tab === "all" ? "lifestyle" : tab;
    const dataUrl = await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
    const res = await fetch("/api/admin/gallery/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, name: file.name, dataUrl }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) return flash(body?.error ?? "Upload fehlgeschlagen", "error");
    flash(`„${body.data.name}" hochgeladen (${TABS.find((t) => t.key === category)?.label}).`);
    load();
  };

  const actionBtn =
    "rounded-lg px-2 py-1.5 text-[10px] font-medium tracking-[0.04em] transition-colors duration-300";

  return (
    <section aria-label="Media & Asset-Galerie" className="flex flex-col gap-4">
      {/* ---- tabs + upload ---- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Asset-Kategorien" className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={active}
                title={t.hint}
                onClick={() => setTab(t.key)}
                className={`relative shrink-0 rounded-full px-4 py-2 transition-colors duration-300 ${
                  active ? "text-ivory" : "text-charcoal/60 hover:text-bordeaux"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="gallery-tab-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-bordeaux to-wine"
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32 }}
                  />
                )}
                {!active && (
                  <span aria-hidden="true" className="absolute inset-0 rounded-full border border-charcoal/12" />
                )}
                <span className="relative z-10 flex items-baseline gap-1.5 whitespace-nowrap text-[12px]">
                  {t.label}
                  <span className={`text-[10px] tabular-nums ${active ? "text-ivory/65" : "text-charcoal/35"}`}>
                    {counts[t.key] ?? "–"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="shrink-0 rounded-full border border-charcoal/12 px-4 py-2 text-[11.5px] text-charcoal/60 transition-colors hover:border-champagne hover:text-bordeaux"
        >
          Hochladen + {tab !== "all" && `(${TABS.find((t) => t.key === tab)?.label})`}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            pickUpload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-bordeaux/10 px-4 py-3 text-[12px] text-bordeaux">
          Galerie konnte nicht geladen werden: {error.message}
        </p>
      )}

      {/* ---- grid ---- */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-card bg-charcoal/[0.05]" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-card-lg border border-dashed border-charcoal/15 bg-ivory/40 px-8 py-12 text-center">
          <p className="font-playfair text-[18px] text-charcoal">Noch keine Assets in dieser Kategorie</p>
          <p className="mx-auto mt-2 max-w-[44ch] text-[12.5px] leading-relaxed text-charcoal/50">
            {tab === "bundle"
              ? "Es existieren noch keine 9er-Showcase-Kompositionen — die erste lässt sich direkt hier hochladen."
              : "Über „Hochladen +” landet ein Bild direkt in diesem Tab."}
          </p>
        </div>
      ) : (
        <div data-gallery-grid className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {visible.map((a) => (
            <div
              key={a.path}
              data-asset={a.path}
              className="group relative overflow-hidden rounded-card border border-charcoal/[0.08] bg-ivory/60"
            >
              <div className="relative aspect-square overflow-hidden bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.path}
                  alt={a.name}
                  loading="lazy"
                  className={`h-full w-full transition-transform duration-500 ease-out-expo group-hover:scale-[1.04] ${
                    a.category === "bottle" || a.category === "logo" ? "object-contain p-2" : "object-cover"
                  }`}
                />
                {/* hover action bar */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-espresso/85 to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                  <button type="button" onClick={() => copyPath(a)} title="Pfad kopieren"
                    className={`${actionBtn} bg-ivory/15 text-ivory hover:bg-ivory hover:text-charcoal`}>
                    Pfad
                  </button>
                  <button type="button" onClick={() => setLightbox(a)} title="Vollbild-Vorschau"
                    className={`${actionBtn} bg-ivory/15 text-ivory hover:bg-ivory hover:text-charcoal`}>
                    Vollbild
                  </button>
                  <button type="button" onClick={() => { setAssignFor(a); setAssignWine(a.wine ?? WINES[0]?.slug); }}
                    title="Hero oder Wein zuweisen"
                    className={`${actionBtn} bg-champagne/90 text-espresso hover:bg-champagne`}>
                    Zuweisen
                  </button>
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-2 px-2.5 py-2">
                <span className="min-w-0 truncate text-[10.5px] text-charcoal/70">
                  {a.uploaded ? "▲ " : ""}
                  {a.name}
                </span>
                <span className="shrink-0 text-[9.5px] text-charcoal/35">
                  {a.wine ?? fmtSize(a.size)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- full-resolution lightbox ---- */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            data-lightbox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="fixed inset-0 z-[95] flex flex-col bg-espresso/92 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`Vollbild: ${lightbox.name}`}
          >
            <button
              type="button"
              aria-label="Vorschau schließen"
              onClick={() => setLightbox(null)}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-champagne hover:text-champagne"
            >
              <Close className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Schließen" onClick={() => setLightbox(null)}
              className="flex min-h-0 flex-1 cursor-zoom-out items-center justify-center p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightbox.path} alt={lightbox.name} className="max-h-full max-w-full rounded-lg object-contain" />
            </button>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ivory/10 px-6 py-4">
              <div className="min-w-0">
                <p className="truncate text-[13px] text-ivory">{lightbox.name}</p>
                <p className="truncate text-[10.5px] text-ivory/45 tabular-nums">
                  {lightbox.path} · {fmtSize(lightbox.size)}
                  {lightbox.wine ? ` · ${lightbox.wine}` : ""}
                </p>
              </div>
              <button type="button" onClick={() => copyPath(lightbox)}
                className="shrink-0 rounded-full bg-ivory/10 px-4 py-2 text-[11px] text-ivory transition-colors hover:bg-ivory hover:text-charcoal">
                Pfad kopieren
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- assign dialog ---- */}
      <AnimatePresence>
        {assignFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="fixed inset-0 z-[96] grid place-items-center bg-espresso/50 p-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`Zuweisen: ${assignFor.name}`}
          >
            <motion.div
              data-assign-dialog
              initial={reduced ? false : { y: 16, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="w-full max-w-[400px] rounded-card-lg bg-cream p-5 shadow-glass"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bordeaux/55">Zuweisen</p>
                  <p className="mt-1 truncate font-playfair text-[17px] text-charcoal">{assignFor.name}</p>
                </div>
                <button type="button" onClick={() => setAssignFor(null)} aria-label="Schließen"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-charcoal/12 text-charcoal/60 hover:border-champagne hover:text-bordeaux">
                  <Close className="h-4 w-4" />
                </button>
              </div>

              <button type="button" onClick={() => assignHero(assignFor)}
                className="mt-4 w-full rounded-xl bg-gradient-to-br from-bordeaux to-wine px-4 py-3 text-left text-[12.5px] font-medium text-ivory transition-opacity hover:opacity-90">
                Als Hero-Hintergrund der Startseite
              </button>

              <div className="mt-3 rounded-xl border border-charcoal/[0.08] bg-ivory/50 p-3">
                <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
                  Als Wein-Mockup
                </p>
                <div className="flex gap-2">
                  <select
                    value={assignWine}
                    onChange={(e) => setAssignWine(e.target.value)}
                    aria-label="Ziel-Wein"
                    className="h-10 min-w-0 flex-1 rounded-xl border border-charcoal/12 bg-cream px-2.5 text-[12px] text-charcoal focus:border-champagne focus:outline-none"
                  >
                    {WINES.map((w) => (
                      <option key={w.slug} value={w.slug}>{w.name}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => assignWineMockup(assignFor, assignWine)}
                    className="shrink-0 rounded-xl border border-bordeaux px-4 text-[11.5px] font-medium text-bordeaux transition-colors hover:bg-bordeaux hover:text-ivory">
                    Zuweisen
                  </button>
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-charcoal/40">
                  Packshots eines anderen Weins lehnt die Prüfung ab — Galerie-Uploads sind frei zuweisbar.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- toast ---- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={`fixed bottom-6 left-1/2 z-[97] max-w-[90vw] -translate-x-1/2 truncate rounded-full px-6 py-3.5 text-[12.5px] shadow-glass ${
              toast.tone === "error" ? "bg-bordeaux text-ivory" : "bg-espresso text-ivory"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
