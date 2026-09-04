"use client";
import { useEffect, useMemo, useState } from "react";
import { Reorder, motion, useDragControls, useReducedMotion } from "motion/react";
import { useAdminI18n } from "../i18n/AdminI18n";
import { FAQ_DEFAULT_LOCALE, FAQ_LOCALES, STATUS } from "@/lib/faq/schema";

/* The questions of one group, in the order the page renders them.

   Drag reorders within a cluster and only within it: on /kontakt and
   /regionen the cluster IS the index column, so a row dragged across a
   heading would silently change which topic it answers. Moving a question
   to another cluster is a field in the editor, where it is a decision
   rather than a slip of the wrist.

   The drag handle is its own control (useDragControls + dragListener=false):
   the row itself stays a button that opens the editor, so a click never
   turns into a half-drag. */

const SPRING = { type: "spring", stiffness: 400, damping: 34 };

const Dots = ({ record }) => {
  const { t } = useAdminI18n();
  return (
    <span className="flex shrink-0 items-center gap-1" aria-hidden="false">
      {FAQ_LOCALES.map((locale) => {
        const done = record.completeness?.[locale];
        return (
          <span
            key={locale}
            title={`${locale.toUpperCase()} — ${done ? t("faqPage.complete") : t("faqPage.incomplete")}`}
            className={`grid h-[18px] w-[22px] place-items-center rounded-[5px] text-[8.5px] font-semibold uppercase tracking-[0.04em] ${
              done ? "bg-a-gold/25 text-a-ink/70" : "border border-dashed border-a-ink/20 text-a-ink/30"
            }`}
          >
            {locale}
          </span>
        );
      })}
    </span>
  );
};

const Handle = ({ controls, label }) => (
  <span
    role="button"
    tabIndex={-1}
    aria-label={label}
    title={label}
    onPointerDown={(e) => {
      e.preventDefault();
      controls.start(e);
    }}
    className="flex h-9 w-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-a-ink/25 transition-colors duration-300 hover:text-a-accent active:cursor-grabbing"
  >
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" aria-hidden="true">
      <path
        d="M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </span>
);

function Row({ record, onOpen }) {
  const controls = useDragControls();
  const { t } = useAdminI18n();
  const draft = record.status === STATUS.DRAFT;

  return (
    <Reorder.Item
      value={record}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.01, boxShadow: "0 18px 40px rgba(33,21,17,0.16)" }}
      transition={SPRING}
      className="list-none will-change-transform"
    >
      <div className="group flex items-center gap-2 border-b border-a-ink/[0.07] bg-a-canvas px-1 py-2.5">
        <Handle controls={controls} label={t("faqPage.list.drag")} />

        <button
          type="button"
          onClick={() => onOpen(record)}
          className="min-w-0 flex-1 text-left outline-offset-4"
        >
          <span className="flex items-center gap-2">
            <span className="truncate text-[13.5px] font-medium leading-snug text-a-ink">
              {record.text?.[FAQ_DEFAULT_LOCALE]?.q || t("faqPage.list.untitled")}
            </span>
            {draft && (
              <span className="shrink-0 rounded-full bg-a-ink/[0.07] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-a-ink/55">
                {t("faqPage.status.draft")}
              </span>
            )}
          </span>
          <span className="mt-0.5 flex items-center gap-2 text-[11px] text-a-ink/40">
            <span className="truncate font-mono text-[10.5px]">{record.id}</span>
            {record.text?.[FAQ_DEFAULT_LOCALE]?.link && (
              <span className="truncate text-a-ink/35">
                → {record.text[FAQ_DEFAULT_LOCALE].link.href}
              </span>
            )}
          </span>
        </button>

        <Dots record={record} />
      </div>
    </Reorder.Item>
  );
}

/** One cluster (or the whole group, for flat pages) as a reorderable list. */
function Cluster({ title, count, records, onOpen, onReorder }) {
  const [order, setOrder] = useState(records);
  const { t } = useAdminI18n();

  /* follow the server whenever the list changes underneath (refetch, filter,
     another cluster's save) — but not while the pointer is mid-drag */
  useEffect(() => setOrder(records), [records]);

  const commit = () => onReorder(order.map((r) => r.id));

  return (
    <section className="mt-6 first:mt-0">
      {title && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3 px-1">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
            {title}
          </h3>
          <span className="text-[10.5px] tabular-nums text-a-ink/35">
            {t("faqPage.list.count", { n: count })}
          </span>
        </div>
      )}
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={setOrder}
        onPointerUp={commit}
        onKeyUp={commit}
        className="m-0 border-t border-a-ink/[0.07] p-0"
      >
        {order.map((record) => (
          <Row key={record.id} record={record} onOpen={onOpen} />
        ))}
      </Reorder.Group>
    </section>
  );
}

export default function QuestionList({ group, items, loading, onOpen, onReorder }) {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();

  const clusters = useMemo(() => {
    if (!group?.nested) {
      return [{ key: null, title: null, records: items }];
    }
    return (group.subgroups ?? []).map((sub) => ({
      key: sub.key,
      title: sub.label?.[FAQ_DEFAULT_LOCALE] || sub.key,
      records: items.filter((i) => i.subgroup === sub.key),
    }));
  }, [group, items]);

  if (loading) {
    return (
      <p className="px-1 py-10 text-[12.5px] text-a-ink/45">{t("faqPage.list.loading")}</p>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-a-ink/15 px-6 py-12 text-center">
        <p className="font-playfair text-[18px] text-a-ink">{t("faqPage.list.emptyTitle")}</p>
        <p className="mx-auto mt-1.5 max-w-[46ch] text-[12.5px] leading-relaxed text-a-ink/55">
          {t("faqPage.list.emptyBody")}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 22 }}
    >
      {clusters.map((cluster) => (
        <Cluster
          key={cluster.key ?? "flat"}
          title={cluster.title}
          count={cluster.records.length}
          records={cluster.records}
          onOpen={onOpen}
          onReorder={(ids) => onReorder(cluster.key, ids)}
        />
      ))}
    </motion.div>
  );
}
