"use client";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  AGING,
  AGING_LABEL,
  STATUS,
  STATUS_LABEL,
  ACCENT_META,
  STYLE_LABEL,
} from "@/lib/inventory/schema";

/* Portfolio table.
   A real <table> so it stays semantic and keyboard/screen-reader navigable;
   the horizontal scroll lives on a wrapper so the page body never scrolls
   sideways. Rows carry the actions rather than a hidden overflow menu — the
   jobs here (quick stock/price edit, edit, archive) are frequent enough to
   deserve one click each. */

const STATUS_CHIP = {
  [STATUS.ACTIVE]: "bg-vine/12 text-vine",
  [STATUS.LOW]: "bg-champagne/30 text-[#7a6420]",
  [STATUS.SOLD_OUT]: "bg-bordeaux/10 text-bordeaux/80",
  [STATUS.DRAFT]: "bg-charcoal/[0.07] text-charcoal/50",
  [STATUS.ARCHIVED]: "bg-charcoal/[0.07] text-charcoal/45",
};

const fmt = (n) => n?.toLocaleString("de-DE") ?? "—";
const eur = (n) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

const th = "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/45";
const td = "px-4 py-3.5 align-middle";

export default function WineTable({ items, loading, onQuickEdit, onEdit, onArchive, onRestore }) {
  const reduced = useReducedMotion();

  if (loading && !items.length) {
    return (
      <div className="rounded-card-lg border border-charcoal/[0.08] bg-ivory/50 p-8">
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-charcoal/[0.05]"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
        <span className="sr-only">Weine werden geladen …</span>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-card-lg border border-dashed border-charcoal/15 bg-ivory/40 px-8 py-14 text-center">
        <p className="font-playfair text-[19px] text-charcoal">Keine Weine in dieser Auswahl</p>
        <p className="mx-auto mt-2 max-w-[38ch] text-[12.5px] leading-relaxed text-charcoal/50">
          Andere Kategorie wählen, die Suche zurücksetzen — oder einen neuen Wein anlegen.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card-lg border border-charcoal/[0.08] bg-ivory/60">
      {/* the scroll lives here, so the page body never moves sideways */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse">
          <caption className="sr-only">
            Weinportfolio — Bestand, Preis und Etikett je Wein
          </caption>
          <thead>
            <tr className="border-b border-charcoal/[0.08]">
              <th scope="col" className={th}>Wein</th>
              <th scope="col" className={th}>Jahrgang</th>
              <th scope="col" className={th}>Herkunft</th>
              <th scope="col" className={th}>Ausbau</th>
              <th scope="col" className={`${th} text-right`}>Bestand</th>
              <th scope="col" className={`${th} text-right`}>Preis</th>
              <th scope="col" className={th}>Etikett</th>
              <th scope="col" className={th}>Status</th>
              <th scope="col" className={`${th} text-right`}>
                <span className="sr-only">Aktionen</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {items.map((w, i) => {
                const archived = w.status === STATUS.ARCHIVED;
                const accent = ACCENT_META[w.label?.accent];
                return (
                  <motion.tr
                    key={w.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: archived ? 0.55 : 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 28,
                      delay: reduced ? 0 : Math.min(i * 0.025, 0.2),
                    }}
                    className="group border-b border-charcoal/[0.05] last:border-0 hover:bg-champagne/[0.07]"
                  >
                    <td className={td}>
                      <span className="flex items-center gap-3">
                        {/* accent chip doubles as the label-colour indicator */}
                        <span
                          aria-hidden="true"
                          className="h-8 w-1.5 shrink-0 rounded-full"
                          style={{ background: accent?.hex ?? "#6B0F1A" }}
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium text-charcoal">
                            {w.name}
                          </span>
                          <span className="block truncate text-[10.5px] text-charcoal/40">
                            {STYLE_LABEL[w.style]}
                            {w.abv ? ` · ${String(w.abv).replace(".", ",")} % vol.` : ""}
                          </span>
                        </span>
                      </span>
                    </td>

                    <td className={`${td} text-[12.5px] text-charcoal/70 tabular-nums`}>
                      {w.vintage}
                    </td>

                    <td className={td}>
                      <span className="block text-[12.5px] text-charcoal/75">
                        {w.appellation?.region}
                      </span>
                      <span className="block text-[10.5px] text-charcoal/40">
                        {w.appellation?.tier}
                        {w.appellation?.zone ? ` · ${w.appellation.zone}` : ""}
                      </span>
                    </td>

                    <td className={td}>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-medium ${
                          w.aging?.vessel === AGING.AMPHORA
                            ? "bg-[#8A5A3B]/12 text-[#7a4e33]"
                            : w.aging?.vessel === AGING.OAK
                              ? "bg-vine/12 text-vine"
                              : "bg-charcoal/[0.06] text-charcoal/55"
                        }`}
                      >
                        {AGING_LABEL[w.aging?.vessel]}
                      </span>
                      <span className="mt-1 block text-[10px] text-charcoal/35">
                        {w.aging?.months} Mon.
                      </span>
                    </td>

                    <td className={`${td} text-right`}>
                      {w.remaining == null ? (
                        <span className="text-[12px] text-charcoal/35">laufend</span>
                      ) : (
                        <>
                          <span className="block text-[12.5px] font-medium text-charcoal/80 tabular-nums">
                            {fmt(w.remaining)}
                          </span>
                          <span className="block text-[10px] text-charcoal/35 tabular-nums">
                            von {fmt(w.batch?.size)}
                          </span>
                        </>
                      )}
                    </td>

                    <td className={`${td} text-right text-[12.5px] text-charcoal/80 tabular-nums`}>
                      {eur(w.price)}
                    </td>

                    <td className={td}>
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-charcoal/10"
                          style={{ background: accent?.hex }}
                        />
                        <span className="min-w-0">
                          <span className="block text-[11.5px] text-charcoal/55">
                            {accent?.label}
                          </span>
                          {/* wordmark treatment — the Rosato is the one label
                              without the white-on-black band */}
                          <span className="block text-[9.5px] uppercase tracking-[0.1em] text-charcoal/35">
                            {w.label?.wordmark === "banded-white-on-black" ? "weiß/Band" : "Linien"}
                          </span>
                        </span>
                      </span>
                    </td>

                    <td className={td}>
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] ${
                          STATUS_CHIP[w.status] ?? STATUS_CHIP[STATUS.ACTIVE]
                        }`}
                      >
                        {STATUS_LABEL[w.status]}
                      </span>
                    </td>

                    <td className={`${td} text-right`}>
                      <span className="flex items-center justify-end gap-1">
                        {archived ? (
                          <button
                            type="button"
                            onClick={() => onRestore(w)}
                            className="rounded-lg px-2.5 py-1.5 text-[11px] text-charcoal/55 transition-colors hover:bg-vine/10 hover:text-vine"
                          >
                            Wiederherstellen
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => onQuickEdit(w)}
                              title="Bestand & Preis schnell ändern"
                              className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-bordeaux/80 transition-colors hover:bg-bordeaux/10 hover:text-bordeaux"
                            >
                              Bestand
                            </button>
                            <button
                              type="button"
                              onClick={() => onEdit(w)}
                              className="rounded-lg px-2.5 py-1.5 text-[11px] text-charcoal/55 transition-colors hover:bg-charcoal/[0.06] hover:text-charcoal"
                            >
                              Bearbeiten
                            </button>
                            <button
                              type="button"
                              onClick={() => onArchive(w)}
                              className="rounded-lg px-2.5 py-1.5 text-[11px] text-charcoal/45 transition-colors hover:bg-bordeaux/10 hover:text-bordeaux"
                            >
                              Archivieren
                            </button>
                          </>
                        )}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
