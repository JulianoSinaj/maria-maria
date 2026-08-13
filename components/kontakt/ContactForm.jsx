"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/ui/Button";
import { Arrow, Check, ChevronDown } from "@/components/Icons";
import Link from "@/components/i18n/LocaleLink";

/* Kontaktformular — Glaskarte mit sichtbaren Labels, Blur-Validierung und
   echtem Versand an /api/contact. Bei einer Verkostungsanfrage klappen
   Wunschtermin und Gästezahl auf, damit die Anfrage direkt planbar ankommt.

   Der gesamte Text kommt als `copy`-Prop aus content/<sprache>/kontakt.js.
   Ein Formular ist die Stelle, an der eine fehlende Übersetzung am teuersten
   ist: Wer nicht versteht, was ein Feld will, schickt nichts ab.

   Die Anliegen laufen über feste SCHLÜSSEL (tasting …), nicht über ihre
   Beschriftung. Vorher stand `values.topic === "Verkostungsanfrage"` im Code —
   auf Italienisch, Englisch und Tschechisch wären die Terminfelder damit nie
   aufgegangen. */

const INPUT =
  "w-full rounded-xl border border-white/60 bg-white/50 px-4 py-3 text-[13px] text-charcoal outline-none transition-all duration-200 focus:border-champagne focus:bg-white/70 focus:ring-2 focus:ring-champagne/30 placeholder:text-charcoal/40";

const LABEL = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/60";

const TOPIC_KEYS = ["tasting", "merchant", "press", "general"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY = {
  name: "",
  email: "",
  subject: "",
  topic: "",
  date: "",
  guests: "",
  message: "",
  privacy: false,
};

const TASTING = "tasting";

/* `e` ist der Fehler-Zweig des Wörterbuchs — die Regeln sind sprachneutral,
   nur der Satz dahinter wechselt. */
function validateField(field, value, values, e = {}) {
  switch (field) {
    case "name":
      return value.trim() ? "" : e.name;
    case "email":
      if (!value.trim()) return e.email;
      return EMAIL_RE.test(value.trim()) ? "" : e.emailInvalid;
    case "subject":
      return value.trim() ? "" : e.subject;
    case "topic":
      return value ? "" : e.topic;
    case "date":
      if (values?.topic !== TASTING) return "";
      return value ? "" : e.date;
    case "guests":
      if (values?.topic !== TASTING) return "";
      return value ? "" : e.guests;
    case "message":
      return value.trim() ? "" : e.message;
    case "privacy":
      return value ? "" : e.privacy;
    default:
      return "";
  }
}

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[11px] leading-snug text-[#B3261E]">
      {children}
    </p>
  );
}

export default function ContactForm({ copy, className = "" }) {
  const t = copy;
  const err = t.errors;
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [submitError, setSubmitError] = useState("");

  const setField = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field] && !validateField(field, value, { ...values, [field]: value }, err)) {
      setErrors((e) => ({ ...e, [field]: "" }));
    }
  };

  const onBlurField = (field) =>
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field], values, err) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const next = {};
    Object.keys(EMPTY).forEach((f) => {
      next[f] = validateField(f, values[f], values, err);
    });
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    setStatus("sending");
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: values.subject,
          /* Schlüssel für die Logik, Klartext für die Benachrichtigungsmail —
             das Team liest sie auf Deutsch, egal in welcher Sprache das
             Formular ausgefüllt wurde. */
          topicKey: values.topic,
          topic: t.topics[values.topic] ?? values.topic,
          date: values.date,
          guests: values.guests,
          message: values.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        /* Die Serverantwort ist immer deutsch (sie geht auch ins Log). Dem
           Besucher zeigen wir stattdessen den Satz seiner Sprache. */
        throw new Error(err.send);
      }
      setStatus("sent");
    } catch (error) {
      setStatus("idle");
      setSubmitError(error?.message || err.send);
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
    setSubmitError("");
  };

  const isTasting = values.topic === TASTING;
  const today = new Date().toISOString().slice(0, 10);

  const sending = status === "sending";
  const describe = (field) => (errors[field] ? `kf-${field}-error` : undefined);

  return (
    <div
      id="kontakt-formular"
      className={`glass rounded-card-lg p-7 shadow-glass scroll-mt-28 sm:p-8 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center py-12 text-center"
          >
            <span className="ring-hairline flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cream to-champagne-light/40 text-bordeaux shadow-luxe">
              <Check className="h-7 w-7" />
            </span>
            <h3 className="mt-6 font-playfair text-[22px] text-charcoal">
              {t.success.title}
            </h3>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-charcoal/70">
              {t.success.text}
            </p>
            <button
              type="button"
              onClick={reset}
              className="group mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
            >
              {t.success.again}
              <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-playfair text-[24px] text-charcoal">{t.title}</h2>
            <span aria-hidden="true" className="mt-3 block h-px w-12 bg-champagne/80" />

            <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="kf-name" className={LABEL}>
                    {t.name.label}
                  </label>
                  <input
                    id="kf-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={t.name.placeholder}
                    className={INPUT}
                    value={values.name}
                    onChange={(e) => setField("name", e.target.value)}
                    onBlur={() => onBlurField("name")}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describe("name")}
                  />
                  <FieldError id="kf-name-error">{errors.name}</FieldError>
                </div>
                <div>
                  <label htmlFor="kf-email" className={LABEL}>
                    {t.email.label}
                  </label>
                  <input
                    id="kf-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t.email.placeholder}
                    className={INPUT}
                    value={values.email}
                    onChange={(e) => setField("email", e.target.value)}
                    onBlur={() => onBlurField("email")}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describe("email")}
                  />
                  <FieldError id="kf-email-error">{errors.email}</FieldError>
                </div>
              </div>

              <div>
                <label htmlFor="kf-subject" className={LABEL}>
                  {t.subject.label}
                </label>
                <input
                  id="kf-subject"
                  name="subject"
                  type="text"
                  placeholder={t.subject.placeholder}
                  className={INPUT}
                  value={values.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  onBlur={() => onBlurField("subject")}
                  aria-invalid={errors.subject ? true : undefined}
                  aria-describedby={describe("subject")}
                />
                <FieldError id="kf-subject-error">{errors.subject}</FieldError>
              </div>

              <div>
                <label htmlFor="kf-topic" className={LABEL}>
                  {t.topic.label}
                </label>
                <div className="relative">
                  <select
                    id="kf-topic"
                    name="topic"
                    className={`${INPUT} cursor-pointer appearance-none pr-11 ${
                      values.topic ? "" : "text-charcoal/40"
                    }`}
                    value={values.topic}
                    onChange={(e) => setField("topic", e.target.value)}
                    onBlur={() => onBlurField("topic")}
                    aria-invalid={errors.topic ? true : undefined}
                    aria-describedby={describe("topic")}
                  >
                    <option value="" disabled>
                      {t.topic.placeholder}
                    </option>
                    {/* Wert ist der Schlüssel, Beschriftung der übersetzte
                        Text — so bleibt die Auswahl beim Sprachwechsel gültig. */}
                    {TOPIC_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {t.topics[key]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/50"
                  />
                </div>
                <FieldError id="kf-topic-error">{errors.topic}</FieldError>
              </div>

              <AnimatePresence initial={false}>
                {isTasting && (
                  <motion.div
                    key="tasting"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-4 pb-1 sm:grid-cols-2">
                      <div>
                        <label htmlFor="kf-date" className={LABEL}>
                          {t.date.label}
                        </label>
                        <input
                          id="kf-date"
                          name="date"
                          type="date"
                          min={today}
                          className={INPUT}
                          value={values.date}
                          onChange={(e) => setField("date", e.target.value)}
                          onBlur={() => onBlurField("date")}
                          aria-invalid={errors.date ? true : undefined}
                          aria-describedby={describe("date")}
                        />
                        <FieldError id="kf-date-error">{errors.date}</FieldError>
                      </div>
                      <div>
                        <label htmlFor="kf-guests" className={LABEL}>
                          {t.guests.label}
                        </label>
                        <div className="relative">
                          <select
                            id="kf-guests"
                            name="guests"
                            className={`${INPUT} cursor-pointer appearance-none pr-11 ${
                              values.guests ? "" : "text-charcoal/40"
                            }`}
                            value={values.guests}
                            onChange={(e) => setField("guests", e.target.value)}
                            onBlur={() => onBlurField("guests")}
                            aria-invalid={errors.guests ? true : undefined}
                            aria-describedby={describe("guests")}
                          >
                            <option value="" disabled>
                              {t.guests.placeholder}
                            </option>
                            {t.guests.options.map((g) => (
                              <option key={g} value={g}>
                                {g} {t.guests.unit}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            aria-hidden="true"
                            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/50"
                          />
                        </div>
                        <FieldError id="kf-guests-error">{errors.guests}</FieldError>
                      </div>
                      <p className="text-[11.5px] leading-snug text-charcoal/60 sm:col-span-2">
                        {t.guests?.note}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label htmlFor="kf-message" className={LABEL}>
                  {t.message.label}
                </label>
                <textarea
                  id="kf-message"
                  name="message"
                  rows={4}
                  placeholder={t.message.placeholder}
                  className={`${INPUT} resize-none`}
                  value={values.message}
                  onChange={(e) => setField("message", e.target.value)}
                  onBlur={() => onBlurField("message")}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={describe("message")}
                />
                <FieldError id="kf-message-error">{errors.message}</FieldError>
              </div>

              <div>
                <label
                  htmlFor="kf-privacy"
                  className="flex cursor-pointer items-start gap-2.5 py-1 text-[11.5px] leading-snug text-charcoal/70"
                >
                  <input
                    id="kf-privacy"
                    name="privacy"
                    type="checkbox"
                    checked={values.privacy}
                    onChange={(e) => setField("privacy", e.target.checked)}
                    onBlur={() => onBlurField("privacy")}
                    aria-invalid={errors.privacy ? true : undefined}
                    aria-describedby={describe("privacy")}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-bordeaux"
                  />
                  <span>
                    {t.privacyPre}{" "}
                    <Link
                      href="/datenschutz"
                      className="font-medium text-bordeaux underline decoration-bordeaux/30 underline-offset-2 transition-colors duration-300 hover:decoration-bordeaux"
                    >
                      {t.privacyLink}
                    </Link>{" "}
                    {t.privacyPost}
                  </span>
                </label>
                <FieldError id="kf-privacy-error">{errors.privacy}</FieldError>
              </div>

              {submitError && (
                <p
                  role="alert"
                  className="rounded-xl border border-[#B3261E]/25 bg-[#B3261E]/5 px-4 py-3 text-[12px] leading-snug text-[#B3261E]"
                >
                  {submitError}
                </p>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  size="md"
                  iconType={sending ? "none" : "arrow"}
                  disabled={sending}
                  aria-busy={sending}
                  className="disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? t.sending : t.submit}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
