"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/ui/Button";
import { Arrow, Check, ChevronDown } from "@/components/Icons";

/* Kontaktformular — Glaskarte mit sichtbaren Labels, Blur-Validierung und
   fake-async Versand. Erfolgszustand mit Reset-Link. */

const INPUT =
  "w-full rounded-xl border border-white/60 bg-white/50 px-4 py-3 text-[13px] text-charcoal outline-none transition-all duration-200 focus:border-champagne focus:bg-white/70 focus:ring-2 focus:ring-champagne/30 placeholder:text-charcoal/40";

const LABEL = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/60";

const TOPICS = ["Verkostungsanfrage", "Händleranfrage", "Presse & Kooperationen", "Allgemeine Frage"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY = { name: "", email: "", subject: "", topic: "", message: "", privacy: false };

function validateField(field, value) {
  switch (field) {
    case "name":
      return value.trim() ? "" : "Bitte geben Sie Ihren Namen an.";
    case "email":
      if (!value.trim()) return "Bitte geben Sie Ihre E-Mail-Adresse an.";
      return EMAIL_RE.test(value.trim()) ? "" : "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    case "subject":
      return value.trim() ? "" : "Bitte geben Sie einen Betreff an.";
    case "topic":
      return value ? "" : "Bitte wählen Sie ein Anliegen.";
    case "message":
      return value.trim() ? "" : "Bitte schreiben Sie uns eine kurze Nachricht.";
    case "privacy":
      return value ? "" : "Bitte stimmen Sie der Datenschutzerklärung zu.";
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

export default function ContactForm({ className = "" }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const setField = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field] && !validateField(field, value)) {
      setErrors((e) => ({ ...e, [field]: "" }));
    }
  };

  const onBlurField = (field) =>
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const next = {};
    Object.keys(EMPTY).forEach((f) => {
      next[f] = validateField(f, values[f]);
    });
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 900);
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
  };

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
              Vielen Dank für Ihre Nachricht!
            </h3>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-charcoal/70">
              Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 1–2 Werktagen persönlich
              bei Ihnen.
            </p>
            <button
              type="button"
              onClick={reset}
              className="group mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-medium text-bordeaux"
            >
              Neue Nachricht
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
            <h2 className="font-playfair text-[24px] text-charcoal">Schreiben Sie uns</h2>
            <span aria-hidden="true" className="mt-3 block h-px w-12 bg-champagne/80" />

            <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="kf-name" className={LABEL}>
                    Name
                  </label>
                  <input
                    id="kf-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Ihr Name"
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
                    E-Mail
                  </label>
                  <input
                    id="kf-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@beispiel.de"
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
                  Betreff
                </label>
                <input
                  id="kf-subject"
                  name="subject"
                  type="text"
                  placeholder="Worum geht es?"
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
                  Anliegen
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
                      Anliegen wählen
                    </option>
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
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

              <div>
                <label htmlFor="kf-message" className={LABEL}>
                  Nachricht
                </label>
                <textarea
                  id="kf-message"
                  name="message"
                  rows={4}
                  placeholder="Ihre Nachricht an uns …"
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
                    Ich habe die{" "}
                    <a
                      href="#"
                      className="font-medium text-bordeaux underline decoration-bordeaux/30 underline-offset-2 transition-colors duration-300 hover:decoration-bordeaux"
                    >
                      Datenschutzerklärung
                    </a>{" "}
                    gelesen und stimme der Verarbeitung meiner Daten zu.
                  </span>
                </label>
                <FieldError id="kf-privacy-error">{errors.privacy}</FieldError>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="md"
                  iconType={sending ? "none" : "arrow"}
                  disabled={sending}
                  aria-busy={sending}
                  className="disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? "Wird gesendet…" : "Nachricht senden"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
