"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Close, Mail, Phone } from "@/components/Icons";
import { INQUIRY_STATUSES, replyMailto } from "@/lib/inquiries/schema";
import { useAdminI18n } from "../i18n/AdminI18n";
import {
  StatusChip,
  IntentTag,
  LanguageTag,
  STATUS_CHIP,
  relativeTime,
  absoluteTime,
} from "./shared";

/* Slide-over with one inquiry in full: the message as the visitor wrote it,
   the extra fields of their intent, the desk's status and internal notes,
   and the reply — which is a mailto, because the answer itself belongs in
   the team's mailbox, not in a CMS. Only status and notes write back. */

const STATUS_SPRING = { type: "spring", stiffness: 320, damping: 32, mass: 0.8 };

const Section = ({ label, hint, children }) => (
  <section>
    <h3 className="mb-2.5 flex items-baseline justify-between gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55">
        {label}
      </span>
      {hint && <span className="text-[10.5px] text-a-ink/35">{hint}</span>}
    </h3>
    {children}
  </section>
);

const Row = ({ label, children }) => (
  <div className="flex gap-4 py-2.5">
    <dt className="w-[38%] shrink-0 text-[11.5px] text-a-ink/45">{label}</dt>
    <dd className="min-w-0 flex-1 break-words text-[13px] text-a-ink/85">{children}</dd>
  </div>
);

export default function InquiryPanel({ open, item, onClose, onPatch, busy }) {
  const reduced = useReducedMotion();
  const { t, tm, intl } = useAdminI18n();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  const [notes, setNotes] = useState("");
  const [notesState, setNotesState] = useState("idle"); // idle | saving | saved | error

  /* reseed the draft whenever a different record opens */
  useEffect(() => {
    if (!open) return;
    setNotes(item?.notes ?? "");
    setNotesState("idle");
  }, [open, item?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  /* focus in, trap Tab, Escape closes, focus returns to the trigger */
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = panelRef.current?.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
      );
      if (!els?.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  const dirty = notes !== (item?.notes ?? "");

  const saveNotes = async () => {
    if (!item || !dirty) return;
    setNotesState("saving");
    try {
      await onPatch(item.id, { notes });
      setNotesState("saved");
    } catch {
      setNotesState("error");
    }
  };

  const setStatus = (status) => {
    if (!item || status === item.status || busy) return;
    onPatch(item.id, { status }).catch(() => {});
  };

  const title = item ? `${t("inquiriesPage.eyebrow")} ${item.id} — ${item.name}` : "";

  return (
    <AnimatePresence>
      {open && item && (
        <div className="fixed inset-0 z-[90]">
          <motion.button
            type="button"
            aria-label={t("common.close")}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="absolute inset-0 w-full cursor-default bg-espresso/50 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={
              reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 34, mass: 0.9 }
            }
            className="absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col bg-a-canvas will-transform"
          >
            <header className="flex items-start justify-between gap-4 border-b border-a-ink/[0.08] px-6 py-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
                  {t("inquiriesPage.eyebrow")} · <span className="tabular-nums">{item.id}</span>
                </p>
                <h2 className="mt-1 truncate font-playfair text-[21px] leading-tight text-a-ink">
                  {item.name}
                </h2>
                {(item.company || item.city) && (
                  <p className="mt-0.5 truncate text-[11.5px] text-a-ink/45">
                    {[item.company, item.city].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t("common.close")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-a-ink/12 text-a-ink/70 transition-colors hover:border-champagne hover:text-a-accent"
              >
                <Close className="h-[18px] w-[18px]" />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain px-6 py-6">
              {/* ---- at a glance ---- */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <IntentTag intent={item.intent} />
                <StatusChip status={item.status} />
                <LanguageTag language={item.language} />
              </div>

              <div className="rounded-2xl border border-a-ink/[0.08] bg-a-surface/60 px-4 py-3.5">
                <p className="text-[12.5px] text-a-ink/80 tabular-nums">
                  {t("inquiriesPage.received", { when: absoluteTime(item.receivedAt, intl) })}
                  <span className="text-a-ink/40"> · {relativeTime(item.receivedAt, intl)}</span>
                </p>
                <p className="mt-1 text-[11px] text-a-ink/45">
                  {t("inquiriesPage.from", { language: tm("inquiryLanguage", item.language) })}
                  {" · "}
                  {item.delivery === "failed"
                    ? t("inquiriesPage.deliveryFailed")
                    : item.delivery === "pending"
                      ? t("inquiriesPage.deliveryPending")
                      : item.delivery === "inbox"
                        ? t("inquiriesPage.deliveryInboxOnly")
                        : t("inquiriesPage.deliveredVia", { channel: item.delivery })}
                </p>
                {item.delivery === "failed" && (
                  <p role="note" className="mt-2 text-[11.5px] leading-snug text-a-accent">
                    {t("inquiriesPage.deliveryFailedLong")}
                  </p>
                )}
              </div>

              {/* ---- reply ---- */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.a
                  href={replyMailto(item)}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory"
                >
                  <Mail className="h-4 w-4" />
                  {t("inquiriesPage.reply")}
                </motion.a>
                <span className="text-[11px] text-a-ink/40">{t("inquiriesPage.replyHint")}</span>
              </div>

              {/* ---- contact ---- */}
              <Section label={t("inquiriesPage.contact")}>
                <dl className="divide-y divide-a-ink/[0.06] rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 px-4">
                  <Row label={t("inquiriesPage.email")}>
                    <a
                      href={`mailto:${item.email}`}
                      className="text-a-accent underline decoration-a-accent/30 underline-offset-2 transition-colors hover:decoration-a-accent"
                    >
                      {item.email}
                    </a>
                  </Row>
                  {item.phone && (
                    <Row label={t("inquiriesPage.phone")}>
                      <a
                        href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}
                        className="inline-flex items-center gap-1.5 text-a-accent underline decoration-a-accent/30 underline-offset-2 transition-colors hover:decoration-a-accent"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {item.phone}
                      </a>
                    </Row>
                  )}
                  {item.company && <Row label={t("inquiriesPage.company")}>{item.company}</Row>}
                  {item.city && <Row label={t("inquiriesPage.city")}>{item.city}</Row>}
                </dl>
              </Section>

              {/* ---- message ---- */}
              <Section label={t("inquiriesPage.message")}>
                <p className="whitespace-pre-wrap rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 px-4 py-3.5 text-[13.5px] leading-relaxed text-a-ink/85">
                  {item.message}
                </p>
              </Section>

              {/* ---- the intent's extra fields ---- */}
              {item.details?.length > 0 && (
                <Section label={t("inquiriesPage.details")}>
                  <dl className="divide-y divide-a-ink/[0.06] rounded-2xl border border-a-ink/[0.08] bg-a-surface/50 px-4">
                    {item.details.map((d, i) => (
                      <Row key={`${d.key || d.label}-${i}`} label={d.label}>
                        {d.value}
                      </Row>
                    ))}
                  </dl>
                </Section>
              )}

              {/* ---- status ---- */}
              <Section label={t("inquiriesPage.status")}>
                <div
                  role="radiogroup"
                  aria-label={t("inquiriesPage.status")}
                  className="flex flex-wrap gap-1.5 rounded-full border border-a-ink/12 bg-a-surface/70 p-1"
                >
                  {INQUIRY_STATUSES.map((s) => {
                    const active = s === item.status;
                    return (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={busy}
                        onClick={() => setStatus(s)}
                        className={`relative min-h-[36px] rounded-full px-4 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 disabled:cursor-wait ${
                          active ? "" : "text-a-ink/50 hover:text-a-ink"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="inquiry-status-pill"
                            aria-hidden="true"
                            className={`absolute inset-0 rounded-full ${STATUS_CHIP[s]}`}
                            transition={reduced ? { duration: 0 } : STATUS_SPRING}
                          />
                        )}
                        <span className={`relative z-10 ${active ? STATUS_CHIP[s].split(" ")[1] : ""}`}>
                          {tm("inquiryStatus", s)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* ---- internal notes ---- */}
              <Section label={t("inquiriesPage.notes")} hint={t("inquiriesPage.notesHint")}>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    if (notesState !== "idle") setNotesState("idle");
                  }}
                  placeholder={t("inquiriesPage.notesPlaceholder")}
                  className="w-full resize-y rounded-2xl border border-a-ink/12 bg-a-surface/70 px-4 py-3 text-[13px] leading-relaxed text-a-ink transition-colors duration-300 placeholder:text-a-ink/30 focus:border-champagne focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span
                    role="status"
                    aria-live="polite"
                    className={`text-[11px] ${
                      notesState === "error" ? "text-a-accent" : "text-a-ink/45"
                    }`}
                  >
                    {notesState === "saved"
                      ? t("common.saved")
                      : notesState === "saving"
                        ? t("common.saving")
                        : notesState === "error"
                          ? t("common.saveFailed", { status: "!" })
                          : ""}
                  </span>
                  <motion.button
                    type="button"
                    onClick={saveNotes}
                    disabled={!dirty || busy || notesState === "saving"}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="rounded-full border border-a-ink/12 px-5 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.12em] text-a-ink transition-colors duration-300 hover:border-champagne hover:text-a-accent disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-a-ink/12 disabled:hover:text-a-ink"
                  >
                    {t("inquiriesPage.saveNotes")}
                  </motion.button>
                </div>
              </Section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
