"use client";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "@/components/i18n/LocaleLink";
import Button from "@/components/ui/Button";
import { Check, ChevronDown } from "@/components/Icons";
import {
  pushEvent,
  pageLanguage,
  CONTACT_FORM_NAME,
  FORM_START,
  FORM_SUBMIT,
  GENERATE_LEAD,
} from "@/lib/analytics";
import { useIntentTarget } from "./IntentContext";
import {
  CONDITIONAL_FIELDS,
  CONDITIONAL_TYPES,
  CONDITIONAL_WIDE,
  FORM_ANCHOR,
  FORM_INTENTS,
} from "./intents";
import { FIELD, FIELD_LABEL, FOCUS_RING, PANEL } from "./styles";

/* Das Anfrageformular der Kontaktseite.

   Handoff §5 und §9. Zwei Dinge daran sind nicht Geschmack, sondern Auftrag:

   1. Erst das Thema, dann die Felder. „Wählen Sie zuerst Ihr Thema –
      anschließend zeigen wir nur die Felder, die für Ihre Anfrage wirklich
      relevant sind." Ein Formular, das alle achtzehn Felder gleichzeitig
      zeigt, sieht nach Arbeit aus und wird nicht abgeschickt.

   2. Versteckte Felder sind nie Pflicht („I campi condizionali non restano
      required quando nascosti"). Hier gilt die schärfere Fassung: Die
      Zusatzfelder sind grundsätzlich freiwillig, und beim Absenden reisen
      nur die mit, die zum gewählten Anliegen gehören — sonst käme die
      Gästezahl einer verworfenen Event-Anfrage in einer Händleranfrage an.

   Pflicht sind die fünf Angaben, ohne die niemand antworten kann: Anliegen,
   Name, E-Mail, Nachricht, Einwilligung. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const BASE = {
  name: "",
  email: "",
  company: "",
  city: "",
  phone: "",
  message: "",
  privacy: false,
};

const REQUIRED = ["intent", "name", "email", "message", "privacy"];

function validateField(field, value, e = {}) {
  switch (field) {
    case "intent":
      return value ? "" : e.intent;
    case "name":
      return value.trim() ? "" : e.name;
    case "email":
      if (!value.trim()) return e.email;
      return EMAIL_RE.test(value.trim()) ? "" : e.emailInvalid;
    case "message":
      return value.trim() ? "" : e.message;
    case "privacy":
      return value ? "" : e.privacy;
    default:
      return "";
  }
}

/* Sternchen am Label statt „(Pflichtfeld)" hinter jedem Feld — sichtbar in
   Bordeaux, für Screenreader bleibt das Wort. */
function Required({ label }) {
  return (
    <>
      <span aria-hidden="true" className="text-bordeaux">
        *
      </span>
      <span className="sr-only"> ({label})</span>
    </>
  );
}

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[11.5px] leading-snug text-[#B3261E]">
      {children}
    </p>
  );
}

function Select({ id, value, onChange, onBlur, placeholder, options, invalid, describedBy, inputRef }) {
  return (
    <div className="relative">
      <select
        id={id}
        ref={inputRef}
        className={`${FIELD} cursor-pointer appearance-none pr-10 ${value ? "" : "text-charcoal/45"}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
      >
        <option value="">{placeholder}</option>
        {options.map(([key, label]) => (
          <option key={key} value={key} className="text-charcoal">
            {label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45"
      />
    </div>
  );
}

export default function ContactForm({ copy }) {
  const t = copy;
  const err = t.errors;
  const { intent, setIntent, focusRef } = useIntentTarget();

  const [values, setValues] = useState(BASE);
  const [extra, setExtra] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [submitError, setSubmitError] = useState("");

  const conditional = CONDITIONAL_FIELDS[intent] ?? [];

  const all = useMemo(() => ({ ...values, intent }), [values, intent]);

  /* Handoff §16: form_start feuert bei der ERSTEN echten Interaktion mit dem
     Formular (Tippen oder Auswahl), einmal pro Seitenaufruf. Als Ref statt
     State: das Ereignis braucht keinen Re-Render, nur ein Gedächtnis. */
  const startedRef = useRef(false);
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    pushEvent(FORM_START, {
      form_name: CONTACT_FORM_NAME,
      initial_intent: intent || null,
    });
  };

  const setField = (field, value) => {
    markStarted();
    if (field === "intent") setIntent(value);
    else setValues((v) => ({ ...v, [field]: value }));
    /* Einen bereits gemeldeten Fehler sofort zurücknehmen, sobald die
       Eingabe stimmt — nicht erst beim nächsten Blur. */
    if (errors[field] && !validateField(field, value, err)) {
      setErrors((e) => ({ ...e, [field]: "" }));
    }
  };

  const setExtraField = (key, value) => {
    markStarted();
    setExtra((x) => ({ ...x, [key]: value }));
  };

  const onBlurField = (field) =>
    setErrors((e) => ({ ...e, [field]: validateField(field, all[field], err) }));

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;

    /* Absende-VERSUCH, unabhängig vom Ergebnis — die Diagnosezahl neben dem
       Lead (Handoff §16). Der Lead selbst (generate_lead) feuert erst nach
       der Erfolgsantwort des Endpunkts. */
    pushEvent(FORM_SUBMIT, {
      form_name: CONTACT_FORM_NAME,
      intent: intent || null,
    });

    const next = {};
    REQUIRED.forEach((f) => {
      next[f] = validateField(f, all[f], err);
    });
    setErrors(next);

    /* Fokus auf das erste ungültige Feld (Handoff §17). Ohne das landet der
       Nutzer nach dem Absenden am Seitenende und sucht die Meldung selbst. */
    const firstBad = REQUIRED.find((f) => next[f]);
    if (firstBad) {
      document.getElementById(`kf-${firstBad}`)?.focus?.();
      return;
    }

    setStatus("sending");
    setSubmitError("");

    /* Nur die Zusatzfelder des gewählten Anliegens, und nur die ausgefüllten.
       Mit Beschriftung, weil das Team die Mail liest und „privat" ohne
       „Anlass:" davor nichts aussagt. */
    const details = conditional
      .map((key) => {
        const raw = extra[key];
        if (!raw) return null;
        const field = t.conditional[key];
        const label = field.label;
        const value = field.options ? field.options[raw] ?? raw : raw;
        return { key, label, value };
      })
      .filter(Boolean);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          intentLabel: t.intent.options[intent] ?? intent,
          name: values.name,
          email: values.email,
          company: values.company,
          city: values.city,
          phone: values.phone,
          message: values.message,
          details,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(err.send);
      /* Das Key Event in GA4 — genau einmal, erst nach dem 200 des
         Endpunkts. Nutzlast ohne personenbezogene Daten. */
      pushEvent(GENERATE_LEAD, {
        lead_type: intent,
        form_name: CONTACT_FORM_NAME,
        source_section: FORM_ANCHOR,
        language: pageLanguage(),
      });
      setStatus("sent");
    } catch (error) {
      setStatus("idle");
      setSubmitError(error?.message || err.send);
    }
  };

  const reset = () => {
    setValues(BASE);
    setExtra({});
    setErrors({});
    setIntent("");
    setStatus("idle");
    setSubmitError("");
  };

  const sending = status === "sending";
  const describe = (field) => (errors[field] ? `kf-${field}-error` : undefined);
  const today = new Date().toISOString().slice(0, 10);

  /* Ein gewöhnliches Textfeld — Beschriftung, Eingabe, Fehler. Die sechs
     Basisfelder unterscheiden sich nur in vier Werten. */
  const text = (field, { type = "text", autoComplete, required = false, span = false } = {}) => (
    <div className={span ? "sm:col-span-2" : undefined}>
      <label htmlFor={`kf-${field}`} className={FIELD_LABEL}>
        {t[field].label}
        {required && <Required label={t.required} />}
      </label>
      <input
        id={`kf-${field}`}
        name={field}
        type={type}
        autoComplete={autoComplete}
        placeholder={t[field].placeholder}
        className={FIELD}
        value={values[field]}
        onChange={(e) => setField(field, e.target.value)}
        onBlur={() => (required ? onBlurField(field) : null)}
        aria-invalid={errors[field] ? true : undefined}
        aria-describedby={describe(field)}
      />
      <FieldError id={`kf-${field}-error`}>{errors[field]}</FieldError>
    </div>
  );

  return (
    <div className={`${PANEL} p-6 sm:p-8 lg:p-9`}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center py-14 text-center"
          >
            <span className="ring-hairline flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cream to-champagne-light/40 text-bordeaux">
              <Check className="h-6 w-6" />
            </span>
            <h3 className="mt-6 font-playfair text-[22px] text-charcoal">{t.success.title}</h3>
            <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-charcoal/70">
              {t.success.text}
            </p>
            <button
              type="button"
              onClick={reset}
              className={`mt-7 min-h-[44px] text-[13px] font-semibold text-bordeaux transition-colors duration-300 hover:text-bordeaux-deep ${FOCUS_RING}`}
            >
              {t.success.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2"
          >
            {/* Zeile 1 — Anliegen und Name */}
            <div>
              <label htmlFor="kf-intent" className={FIELD_LABEL}>
                {t.intent.label}
                <Required label={t.required} />
              </label>
              <Select
                id="kf-intent"
                inputRef={focusRef}
                value={intent}
                onChange={(e) => setField("intent", e.target.value)}
                onBlur={() => onBlurField("intent")}
                placeholder={t.intent.placeholder}
                options={FORM_INTENTS.map((v) => [v, t.intent.options[v]])}
                invalid={!!errors.intent}
                describedBy={describe("intent")}
              />
              <FieldError id="kf-intent-error">{errors.intent}</FieldError>
            </div>
            {text("name", { autoComplete: "name", required: true })}

            {/* Zeile 2 — E-Mail und Unternehmen */}
            {text("email", { type: "email", autoComplete: "email", required: true })}
            {text("company", { autoComplete: "organization" })}

            {/* Zeile 3 — Ort und Telefon */}
            {text("city", { autoComplete: "postal-code" })}
            {text("phone", { type: "tel", autoComplete: "tel" })}

            {/* Zusatzfelder des gewählten Anliegens (Handoff §9) */}
            <AnimatePresence initial={false} mode="popLayout">
              {conditional.length > 0 && (
                <motion.div
                  key={intent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden sm:col-span-2"
                >
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 rounded-2xl border border-stone/60 bg-champagne-light/20 p-5 sm:grid-cols-2">
                    {conditional.map((key) => {
                      const field = t.conditional[key];
                      const type = CONDITIONAL_TYPES[key] ?? "text";
                      const wide = CONDITIONAL_WIDE.has(key);
                      const id = `kf-x-${key}`;

                      return (
                        <div key={key} className={wide ? "sm:col-span-2" : undefined}>
                          <label htmlFor={id} className={FIELD_LABEL}>
                            {field.label}
                          </label>
                          {type === "select" ? (
                            <Select
                              id={id}
                              value={extra[key] ?? ""}
                              onChange={(e) => setExtraField(key, e.target.value)}
                              placeholder={field.placeholder}
                              options={Object.entries(field.options)}
                            />
                          ) : (
                            <input
                              id={id}
                              name={key}
                              type={type === "number" ? "number" : type}
                              {...(type === "number" ? { min: 1, inputMode: "numeric" } : null)}
                              {...(type === "date" ? { min: today } : null)}
                              placeholder={field.placeholder}
                              className={FIELD}
                              value={extra[key] ?? ""}
                              onChange={(e) => setExtraField(key, e.target.value)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nachricht über die volle Breite */}
            <div className="sm:col-span-2">
              <label htmlFor="kf-message" className={FIELD_LABEL}>
                {t.message.label}
                <Required label={t.required} />
              </label>
              <textarea
                id="kf-message"
                name="message"
                rows={4}
                placeholder={t.message.placeholder}
                className={`${FIELD} resize-none`}
                value={values.message}
                onChange={(e) => setField("message", e.target.value)}
                onBlur={() => onBlurField("message")}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={describe("message")}
              />
              <FieldError id="kf-message-error">{errors.message}</FieldError>
            </div>

            {submitError && (
              <p
                role="alert"
                className="rounded-[4px] border border-[#B3261E]/25 bg-[#B3261E]/5 px-4 py-3 text-[12.5px] leading-snug text-[#B3261E] sm:col-span-2"
              >
                {submitError}
              </p>
            )}

            {/* Einwilligung links, Absenden rechts — wie im Mockup */}
            <div className="sm:col-span-2">
              <label
                htmlFor="kf-privacy"
                className="flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-snug text-charcoal/80"
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
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-[2px] accent-bordeaux"
                />
                <span>
                  {t.privacyPre}{" "}
                  <Link
                    href="/datenschutz"
                    className="text-bordeaux underline decoration-bordeaux/40 underline-offset-2 transition-colors hover:decoration-bordeaux"
                  >
                    {t.privacyLink}
                  </Link>{" "}
                  {t.privacyPost}
                  <Required label={t.required} />
                </span>
              </label>
              <FieldError id="kf-privacy-error">{errors.privacy}</FieldError>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  iconType="none"
                  disabled={sending}
                  aria-busy={sending}
                  className="disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? t.sending : t.submit}
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
