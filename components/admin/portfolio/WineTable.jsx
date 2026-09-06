"use client";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { AGING, STATUS, ACCENT_META } from "@/lib/inventory/schema";
import { useAdminI18n } from "../i18n/AdminI18n";
import { relativeTime, shopState } from "./shopMeta";

/* Portfolio table.
   A real <table> so it stays semantic and keyboard/screen-reader navigable;
   the horizontal scroll lives on a wrapper so the page body never scrolls
   sideways. Rows carry the actions rather than a hidden overflow menu — the
   jobs here (quick stock/price edit, edit, archive) are frequent enough to
   deserve one click each.

   Enum labels (style, aging, status, accent) come from the admin dictionary
   keyed on the schema's enum values — the schema itself stays untouched.

   The "Shop" column is the one thing here that describes a system we do not
   own. It carries a warning rather than a value because that is the failure
   it exists for: when Terra Vera renames a product, the wine page goes on
   rendering its button and the button goes on answering 404. Nothing else
   in this backoffice would ever say so. */

const STATUS_CHIP = {
  [STATUS.ACTIVE]: "bg-vine/12 text-vine",
  [STATUS.LOW]: "bg-champagne/30 text-a-gold",
  [STATUS.SOLD_OUT]: "bg-a-accent/10 text-a-accent/80",
  [STATUS.DRAFT]: "bg-a-ink/[0.07] text-a-ink/50",
  [STATUS.ARCHIVED]: "bg-a-ink/[0.07] text-a-ink/45",
};

const th = "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-a-ink/45";
const td = "px-4 py-3.5 align-middle";

export default function WineTable({
  items,
  loading,
  onQuickEdit,
  onEdit,
  onAssets,
  onArchive,
  onRestore,
  onSyncShop,
  syncingId,
}) {
  const reduced = useReducedMotion();
  const { t, tm, intl, fmtEurExact } = useAdminI18n();

  const fmt = (n) => n?.toLocaleString(intl) ?? "—";
  const abv = (v) => {
    const s = String(v);
    /* decimal mark follows the language: 14,5 in de/it, 14.5 in en */
    return intl.startsWith("en") ? s.replace(",", ".") : s.replace(".", ",");
  };

  if (loading && !items.length) {
    return (
      <div className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/50 p-8">
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-a-ink/[0.05]"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
        <span className="sr-only">{t("table.loadingSr")}</span>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-card-lg border border-dashed border-a-ink/15 bg-a-surface/40 px-8 py-14 text-center">
        <p className="font-playfair text-[19px] text-a-ink">{t("table.emptyTitle")}</p>
        <p className="mx-auto mt-2 max-w-[38ch] text-[12.5px] leading-relaxed text-a-ink/50">
          {t("table.emptyBody")}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card-lg border border-a-ink/[0.08] bg-a-surface/60">
      {/* the scroll lives here, so the page body never moves sideways */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse">
          <caption className="sr-only">{t("table.caption")}</caption>
          <thead>
            <tr className="border-b border-a-ink/[0.08]">
              <th scope="col" className={th}>{t("table.colWine")}</th>
              <th scope="col" className={th}>{t("table.colVintage")}</th>
              <th scope="col" className={th}>{t("table.colOrigin")}</th>
              <th scope="col" className={th}>{t("table.colAging")}</th>
              <th scope="col" className={`${th} text-right`}>{t("table.colStock")}</th>
              <th scope="col" className={`${th} text-right`}>{t("table.colPrice")}</th>
              <th scope="col" className={th}>{t("table.colShop")}</th>
              <th scope="col" className={th}>{t("table.colLabel")}</th>
              <th scope="col" className={th}>{t("table.colStatus")}</th>
              <th scope="col" className={`${th} text-right`}>
                <span className="sr-only">{t("table.colActions")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {items.map((w, i) => {
                const archived = w.status === STATUS.ARCHIVED;
                const accent = ACCENT_META[w.label?.accent];
                const shop = shopState(w);
                const syncing = syncingId === w.id;
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
                    className="group border-b border-a-ink/[0.05] last:border-0 hover:bg-champagne/[0.07]"
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
                          <span className="block truncate text-[13px] font-medium text-a-ink">
                            {w.name}
                          </span>
                          <span className="block truncate text-[10.5px] text-a-ink/40">
                            {tm("style", w.style)}
                            {w.abv ? ` · ${abv(w.abv)} ${t("table.abv")}` : ""}
                          </span>
                        </span>
                      </span>
                    </td>

                    <td className={`${td} text-[12.5px] text-a-ink/70 tabular-nums`}>
                      {w.vintage}
                    </td>

                    <td className={td}>
                      <span className="block text-[12.5px] text-a-ink/75">
                        {w.appellation?.region}
                      </span>
                      <span className="block text-[10.5px] text-a-ink/40">
                        {w.appellation?.tier}
                        {w.appellation?.zone ? ` · ${w.appellation.zone}` : ""}
                      </span>
                    </td>

                    <td className={td}>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-medium ${
                          w.aging?.vessel === AGING.AMPHORA
                            ? "bg-[#8A5A3B]/12 text-a-amber"
                            : w.aging?.vessel === AGING.OAK
                              ? "bg-vine/12 text-vine"
                              : "bg-a-ink/[0.06] text-a-ink/55"
                        }`}
                      >
                        {tm("aging", w.aging?.vessel)}
                      </span>
                      <span className="mt-1 block text-[10px] text-a-ink/35">
                        {t("table.months", { n: w.aging?.months })}
                      </span>
                    </td>

                    <td className={`${td} text-right`}>
                      {w.remaining == null ? (
                        <span className="text-[12px] text-a-ink/35">{t("table.ongoing")}</span>
                      ) : (
                        <>
                          <span className="block text-[12.5px] font-medium text-a-ink/80 tabular-nums">
                            {fmt(w.remaining)}
                          </span>
                          <span className="block text-[10px] text-a-ink/35 tabular-nums">
                            {t("table.of", { n: fmt(w.batch?.size) })}
                          </span>
                        </>
                      )}
                    </td>

                    <td className={`${td} text-right text-[12.5px] text-a-ink/80 tabular-nums`}>
                      {fmtEurExact(w.price)}
                    </td>

                    <td className={`${td} w-[210px]`}>
                      {!shop.handle ? (
                        <span
                          title={t("shop.noHandleHint")}
                          className="text-[11.5px] text-a-ink/35"
                        >
                          {t("shop.noHandle")}
                        </span>
                      ) : (
                        <span className="flex w-[186px] items-start gap-2">
                          {/* the dot carries the state; its accessible name
                              is the state, so a screen reader does not read
                              out a decorative circle */}
                          <span
                            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${shop.tone.dot}`}
                            role="img"
                            aria-label={tm("shopStatus", shop.statusKey)}
                          />
                          <span className="min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => onSyncShop?.(w)}
                              disabled={syncing || archived}
                              title={t("shop.syncNow")}
                              className={`block w-full truncate text-left text-[11.5px] transition-colors disabled:opacity-60 ${shop.tone.text} hover:underline`}
                            >
                              {syncing ? t("shop.syncing") : tm("shopStatus", shop.statusKey)}
                            </button>
                            <span className="block truncate text-[10px] text-a-ink/40">
                              {shop.warning === "missing"
                                ? shop.handle
                                : shop.synced
                                  ? `${fmtEurExact(shop.shop.price)}${
                                      shop.shop.available === false ? ` · ${t("shop.availableNo")}` : ""
                                    }`
                                  : shop.handle}
                            </span>
                            {/* the warning is spelled out, not colour-coded
                                only: colour alone is not a message */}
                            {shop.warning && (
                              <span
                                title={shop.warning === "error" ? (shop.shop.error ?? "") : undefined}
                                className={`mt-0.5 block truncate text-[10px] ${shop.tone.text}`}
                              >
                                {shop.warning === "missing"
                                  ? "404 · " + tm("shopStatus", "missing")
                                  : shop.warning === "drift"
                                    ? t("shop.warnDrift", {
                                        shop: fmtEurExact(shop.shop.price),
                                        own: fmtEurExact(w.price),
                                      })
                                    : shop.warning === "unavailable"
                                      ? t("shop.availableNo")
                                      : t("shop.warnError", { error: shop.shop.error ?? "" })}
                              </span>
                            )}
                            {!shop.warning && shop.shop.syncedAt && (
                              <span className="block truncate text-[10px] text-a-ink/30">
                                {t("shop.lastSync", {
                                  when: relativeTime(shop.shop.syncedAt, intl, t("shop.justNow")),
                                })}
                              </span>
                            )}
                          </span>
                        </span>
                      )}
                    </td>

                    <td className={td}>
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-a-ink/10"
                          style={{ background: accent?.hex }}
                        />
                        <span className="min-w-0">
                          <span className="block text-[11.5px] text-a-ink/55">
                            {tm("accent", w.label?.accent)}
                          </span>
                          {/* wordmark treatment — the Rosato is the one label
                              without the white-on-black band */}
                          <span className="block text-[9.5px] uppercase tracking-[0.1em] text-a-ink/35">
                            {w.label?.wordmark === "banded-white-on-black"
                              ? t("table.bandWhite")
                              : t("table.lines")}
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
                        {tm("status", w.status)}
                      </span>
                    </td>

                    <td className={`${td} text-right`}>
                      <span className="flex items-center justify-end gap-1">
                        {archived ? (
                          <button
                            type="button"
                            onClick={() => onRestore(w)}
                            className="rounded-lg px-2.5 py-1.5 text-[11px] text-a-ink/55 transition-colors hover:bg-vine/10 hover:text-vine"
                          >
                            {t("table.restore")}
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => onQuickEdit(w)}
                              title={t("table.quickTitle")}
                              className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-a-accent/80 transition-colors hover:bg-a-accent/10 hover:text-a-accent"
                            >
                              {t("table.stock")}
                            </button>
                            <button
                              type="button"
                              onClick={() => onEdit(w)}
                              className="rounded-lg px-2.5 py-1.5 text-[11px] text-a-ink/55 transition-colors hover:bg-a-ink/[0.06] hover:text-a-ink"
                            >
                              {t("table.edit")}
                            </button>
                            <button
                              type="button"
                              onClick={() => onAssets(w)}
                              title={t("table.assetsTitle")}
                              className="rounded-lg px-2.5 py-1.5 text-[11px] text-a-ink/55 transition-colors hover:bg-champagne/20 hover:text-a-accent"
                            >
                              {t("table.assets")}
                            </button>
                            <button
                              type="button"
                              onClick={() => onArchive(w)}
                              className="rounded-lg px-2.5 py-1.5 text-[11px] text-a-ink/45 transition-colors hover:bg-a-accent/10 hover:text-a-accent"
                            >
                              {t("table.archive")}
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
