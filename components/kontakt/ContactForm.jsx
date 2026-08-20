"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import Link from "@/components/i18n/LocaleLink";
import { Arrow, Check, ChevronDown } from "@/components/Icons";
import { useKontaktIntent, smoothScrollTo, INTENT_KEYS } from "@/components/kontakt/IntentContext";
import { useLenis } from "@/components/motion/SmoothScroll";
import { useLocale } from "@/lib/i18n/context";
import {
  pushEvent,
  FORM_START,
  FORM_SUBMIT,
  GENERATE_LEAD,
  CONTACT_FORM_NAME,
} from "@/lib/analytics";

/* Lead-Formular der Kontaktseite (Handoff §8/§9).

   Grundfelder: Anliegen (Select, Pflicht), Name, E-Mail, Unternehmen/Location,
   Ort/PLZ, Telefon, Nachricht, Datenschutz. Je nach Anliegen klappt ein
   Block bedingter Felder auf — nur die, die für dieses Anliegen wirklich
   zählen (Event: Datum, Art, Gästezahl, Ort; Gastronomie/Handel: Art des
   Betriebs, gewünschte Auswahl; Verkostung: Termin, Personen, Anlass;
   individuelle Auswahl: Kontext, Gästezahl, Stil). Die bedingten Felder
   sind ALLE optional und werden beim Wechsel des Anliegens geleert — ein
   verstecktes Feld kann so nie „required" bleiben (Definition of Done).

   Vertrag mit dem Server (app/api/contact/route.js): Schlüssel, keine
   Beschriftungen. `intent` und die Select-Werte der Detailfelder reisen als
   stabile Keys; der Server übersetzt sie in deutsche Klartexte für die
   Benachrichtigungsmail — so liest das Team Deutsch, egal in welcher Sprache
   das Formular ausgefüllt wurde.

   Tracking (Handoff §16), ohne personenbezogene Daten:
   form_start bei der ersten echten Eingabe (nicht bei programmatischer
   Vorbelegung durch eine Intent-Karte), form_submit bei jedem Absende-Versuch,
   generate_lead GENAU EINMAL nach der Erfolgsantwort des Endpunkts.

   Das Anliegen kommt von außen über den Intent-Provider: Hero-CTAs und
   Intent-Karten setzen es, das Formular übernimmt es sichtbar im Select und
   fokussiert ihn nach dem Scroll. */

/* Bedingte Felder je Anliegen — Struktur hier, Text im Wörterbuch unter
   form.details[intent][key]. Select-Optionen sind Schlüssel (Handoff §9). */
const DETAIL_FIELDS = {
  event_feier: [
    { key: "eventDate", type: "date" },
    { key: "eventType", type: "text" },
    { key: "guests", type: "number" },
    { key: "location", type: "text" },
  ],
  gastronomie_feinkost: [
    { key: "businessType", type: "select", options: ["restaurant", "cafe", "weinbar", "feinkost", "sonstiges"] },
    { key: "interest", type: "text", wide: true },
  ],
  handel_wiederverkauf: [
    { key: "businessType", type: "select", options: ["weinhandel", "feinkost", "fachhandel", "sonstiges"] },
    { key: "interest", type: "text", wide: true },
  ],
  verkostung: [
    { key: "date", type: "date" },
    { key: "persons", type: "number" },
    { key: "occasion", type: "select", options: ["privat", "unternehmen", "gastronomie_handel", "sonstiger"] },
  ],
  individuelle_auswahl: [
    { key: "context", type: "text", wide: true },
    { key: "guests", type: "number" },
    { key: "style", type: "text" },
  ],
  sonstiges: [],
};

const DETAIL_KEYS = [
  ...new Set(Object.values(DETAIL_FIELDS).flatMap((fields) => fields.map((f) => f.key))),
];

const EMPTY_DETAILS = Object.fromEntries(DETAIL_KEYS.map((k) => [k, ""]));

const EMPTY = {
  intent: "",
  name: "",
  email: "",
  companyLocation: "",
  postalCity: "",
  phone: "",
  message: "",
  privacy: false,
  ...EMPTY_DETAILS,
};

/* Reihenfolge der Pflichtfelder im Formular — der Fokus springt nach einem
   fehlgeschlagenen Absenden auf das ERSTE ungültige Feld in dieser Folge. */
const REQUIRED_ORDER = ["intent", "name", "email", "message", "privacy"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const INPUT =
  "w-full rounded-lg border border-stone/80 bg-ivory/40 px-3.5 py-2.5 text-[13.5px] text-charcoal outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-charcoal/40 focus:border-terracotta focus:bg-white focus:ring-2 focus:ring-terracotta/20 aria-[invalid=true]:border-[#B3261E]/70";

const LABEL = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/65";

const ERROR_COLOR = "#B3261E";

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

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[11px] leading-snug" style={{ color: ERROR_COLOR }}>
      {children}
    </p>
  );
}

/* Pflichtmarkierung — der Stern ist visuell, `required` + aria-required
   tragen die Bedeutung für Hilfstechnik. */
function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-terracotta">
      {" "}
      *
    </span>
  );
}

function SelectShell({ children }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/50"
      />
    </div>
  );
}

export default function ContactForm({ copy, className = "" }) {
  const t = copy;
  const err = t.errors;
  const locale = useLocale();
  const reduced = useReducedMotion();
  const lenisRef = useLenis();
  const { request } = useKontaktIntent();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [submitError, setSubmitError] = useState("");

  const selectRef = useRef(null);
  const statusRef = useRef(status);
  statusRef.current = status;
  const startedRef = useRef(false);
  const seenSeqRef = useRef(0);
  const focusTimer = useRef(null);

  /* ---- Anliegen von außen (Hero-CTA / Intent-Karte) übernehmen ---- */
  useEffect(() => {
    if (!request.seq || request.seq === seenSeqRef.current) return;
    seenSeqRef.current = request.seq;

    if (statusRef.current === "sent") {
      /* Wer nach dem Abschicken erneut eine Karte drückt, will ein neues
         Formular, kein Dankeschön — also zurücksetzen. */
      setStatus("idle");
      setSubmitError("");
      setErrors({});
      setValues({ ...EMPTY, intent: request.intent ?? "" });
    } else if (request.intent) {
      setValues((v) => ({ ...v, ...EMPTY_DETAILS, intent: request.intent }));
      setErrors((e) => ({ ...e, intent: "" }));
    }

    /* Fokus auf den Select, sobald der sanfte Scroll angekommen ist —
       preventScroll, damit der Browser nicht selbst noch einmal springt. */
    clearTimeout(focusTimer.current);
    focusTimer.current = setTimeout(
      () => selectRef.current?.focus({ preventScroll: true }),
      reduced ? 60 : 1050
    );
    return () => clearTimeout(focusTimer.current);
  }, [request, reduced]);

  /* ---- Eingaben ---- */
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    pushEvent(FORM_START, {
      form_name: CONTACT_FORM_NAME,
      initial_intent: values.intent || null,
    });
  };

  const setField = (field, value) => {
    markStarted();
    setValues((v) => {
      /* Wechsel des Anliegens leert die Detailfelder — ein Wert aus dem
         vorigen Block (z. B. businessType „restaurant") wäre im neuen ein
         unsichtbarer Fremdkörper. */
      if (field === "intent") return { ...v, ...EMPTY_DETAILS, intent: value };
      return { ...v, [field]: value };
    });
    if (errors[field] && !validateField(field, value, err)) {
      setErrors((e) => ({ ...e, [field]: "" }));
    }
  };

  const onBlurField = (field) =>
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field], err) }));

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
    setSubmitError("");
    startedRef.current = false;
  };

  /* ---- Absenden ---- */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    pushEvent(FORM_SUBMIT, { form_name: CONTACT_FORM_NAME, intent: values.intent || null });

    const next = {};
    REQUIRED_ORDER.forEach((f) => {
      next[f] = validateField(f, values[f], err);
    });
    setErrors(next);
    const firstInvalid = REQUIRED_ORDER.find((f) => next[f]);
    if (firstInvalid) {
      /* Fokus auf das erste ungültige Feld (Handoff §17). Erst fokussieren
         ohne Scroll, dann selbst scrollen: der Browser setzt ein fokussiertes
         Feld an die Oberkante — also unter die fixierte Kopfzeile. Über Lenis,
         wenn es läuft (sonst streiten sich zwei Scroll-Motoren), mit Luft
         nach oben; bei Reduced Motion ohne Animation. */
      const el = document.getElementById(`kf-${firstInvalid}`);
      if (el) {
        el.focus({ preventScroll: true });
        smoothScrollTo(el, { lenis: lenisRef?.current, reduced, offset: -180, duration: 0.8 });
      }
      return;
    }

    setStatus("sending");
    setSubmitError("");

    const activeFields = DETAIL_FIELDS[values.intent] ?? [];
    const details = Object.fromEntries(
      activeFields
        .map((f) => [f.key, String(values[f.key] ?? "").trim()])
        .filter(([, v]) => v)
    );

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: values.intent,
          name: values.name,
          email: values.email,
          companyLocation: values.companyLocation,
          postalCity: values.postalCity,
          phone: values.phone,
          message: values.message,
          details,
          language: locale,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        /* Die Serverantwort ist deutsch (sie geht auch ins Log); der Besucher
           sieht den Satz seiner Sprache. */
        throw new Error(err.send);
      }
      setStatus("sent");
      /* Der Lead — einmal, und erst jetzt, nach echter Erfolgsantwort. */
      pushEvent(GENERATE_LEAD, {
        lead_type: values.intent,
        form_name: CONTACT_FORM_NAME,
        source_section: "kontakt_form",
        language: locale,
      });
    } catch (error) {
      setStatus("idle");
      setSubmitError(error?.message || err.send);
    }
  };

  /* ---- Ableitungen fürs Rendern ---- */
  const sending = status === "sending";
  const describe = (field) => (errors[field] ? `kf-${field}-error` : undefined);
  const detailFields = DETAIL_FIELDS[values.intent] ?? [];
  const detailCopy = t.details?.[values.intent] ?? {};
  /* nur im Browser gebraucht (der Block rendert erst nach einer Auswahl) —
     kein SSR-Wert, also kein Hydration-Unterschied */
  const today = typeof window !== "undefined" ? new Date().toISOString().slice(0, 10) : undefined;

  const heightTransition = reduced
    ? { duration: 0 }
    : { height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } };

  return (
    <div
      id="kontakt-formular"
      className={`rounded-card border border-stone/70 bg-white p-6 sm:p-8 lg:p-10 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center py-14 text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-terracotta/25 bg-terracotta-light/50 text-terracotta">
              <Check className="h-7 w-7" />
            </span>
            <h3 className="mt-6 font-playfair text-[24px] text-charcoal">{t.success.title}</h3>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-charcoal/70">{t.success.text}</p>
            <button
              type="button"
              onClick={reset}
              className="group mt-7 inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-terracotta"
            >
              {t.success.again}
              <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={onSubmit}
            noValidate
            aria-busy={sending}
          >
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              {/* ---- Anliegen ---- */}
              <div>
                <label htmlFor="kf-intent" className={LABEL}>
                  {t.intent.label}
                  <RequiredMark />
                </label>
                <SelectShell>
                  <select
                    id="kf-intent"
                    name="intent"
                    ref={selectRef}
                    required
                    aria-required="true"
                    className={`${INPUT} cursor-pointer appearance-none pr-10 ${values.intent ? "" : "text-charcoal/40"}`}
                    value={values.intent}
                    onChange={(e) => setField("intent", e.target.value)}
                    onBlur={() => onBlurField("intent")}
                    aria-invalid={errors.intent ? true : undefined}
                    aria-describedby={describe("intent")}
                  >
                    <option value="" disabled>
                      {t.intent.placeholder}
                    </option>
                    {/* Wert = stabiler Schlüssel, Beschriftung = Wörterbuch */}
                    {INTENT_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {t.intents[key]}
                      </option>
                    ))}
                  </select>
                </SelectShell>
                <FieldError id="kf-intent-error">{errors.intent}</FieldError>
              </div>

              {/* ---- Name ---- */}
              <div>
                <label htmlFor="kf-name" className={LABEL}>
                  {t.name.label}
                  <RequiredMark />
                </label>
                <input
                  id="kf-name"
                  name="name"
                  type="text"
                  required
                  aria-required="true"
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

              {/* ---- E-Mail ---- */}
              <div>
                <label htmlFor="kf-email" className={LABEL}>
                  {t.email.label}
                  <RequiredMark />
                </label>
                <input
                  id="kf-email"
                  name="email"
                  type="email"
                  required
                  aria-required="true"
                  autoComplete="email"
                  inputMode="email"
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

              {/* ---- Unternehmen / Location ---- */}
              <div>
                <label htmlFor="kf-companyLocation" className={LABEL}>
                  {t.companyLocation.label}
                </label>
                <input
                  id="kf-companyLocation"
                  name="companyLocation"
                  type="text"
                  autoComplete="organization"
                  placeholder={t.companyLocation.placeholder}
                  className={INPUT}
                  value={values.companyLocation}
                  onChange={(e) => setField("companyLocation", e.target.value)}
                />
              </div>

              {/* ---- Ort / PLZ ---- */}
              <div>
                <label htmlFor="kf-postalCity" className={LABEL}>
                  {t.postalCity.label}
                </label>
                <input
                  id="kf-postalCity"
                  name="postalCity"
                  type="text"
                  autoComplete="address-level2"
                  placeholder={t.postalCity.placeholder}
                  className={INPUT}
                  value={values.postalCity}
                  onChange={(e) => setField("postalCity", e.target.value)}
                />
              </div>

              {/* ---- Telefon ---- */}
              <div>
                <label htmlFor="kf-phone" className={LABEL}>
                  {t.phone.label}
                </label>
                <input
                  id="kf-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={t.phone.placeholder}
                  className={INPUT}
                  value={values.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </div>

              {/* ---- bedingte Felder je Anliegen ---- */}
              <AnimatePresence initial={false} mode="wait">
                {detailFields.length > 0 && (
                  <motion.div
                    key={values.intent}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={heightTransition}
                    className="overflow-hidden sm:col-span-2"
                  >
                    <fieldset className="rounded-xl border border-stone/60 bg-sand/60 p-4 sm:p-5">
                      <legend className="px-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-terracotta">
                        {t.intents[values.intent]}
                      </legend>
                      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                        {detailFields.map((f) => {
                          const fc = detailCopy[f.key] ?? {};
                          const id = `kf-${f.key}`;
                          const span = f.wide ? "sm:col-span-2" : "";
                          if (f.type === "select") {
                            return (
                              <div key={f.key} className={span}>
                                <label htmlFor={id} className={LABEL}>
                                  {fc.label}
                                </label>
                                <SelectShell>
                                  <select
                                    id={id}
                                    name={f.key}
                                    className={`${INPUT} cursor-pointer appearance-none pr-10 ${values[f.key] ? "" : "text-charcoal/40"}`}
                                    value={values[f.key]}
                                    onChange={(e) => setField(f.key, e.target.value)}
                                  >
                                    <option value="">{fc.placeholder ?? ""}</option>
                                    {f.options.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {fc.options?.[opt] ?? opt}
                                      </option>
                                    ))}
                                  </select>
                                </SelectShell>
                              </div>
                            );
                          }
                          return (
                            <div key={f.key} className={span}>
                              <label htmlFor={id} className={LABEL}>
                                {fc.label}
                              </label>
                              <input
                                id={id}
                                name={f.key}
                                type={f.type}
                                {...(f.type === "date" ? { min: today } : null)}
                                {...(f.type === "number" ? { min: 1, inputMode: "numeric" } : null)}
                                placeholder={fc.placeholder}
                                className={INPUT}
                                value={values[f.key]}
                                onChange={(e) => setField(f.key, e.target.value)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </fieldset>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ---- Nachricht ---- */}
              <div className="sm:col-span-2">
                <label htmlFor="kf-message" className={LABEL}>
                  {t.message.label}
                  <RequiredMark />
                </label>
                <textarea
                  id="kf-message"
                  name="message"
                  rows={4}
                  required
                  aria-required="true"
                  placeholder={t.message.placeholder}
                  className={`${INPUT} resize-y`}
                  value={values.message}
                  onChange={(e) => setField("message", e.target.value)}
                  onBlur={() => onBlurField("message")}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={describe("message")}
                />
                <FieldError id="kf-message-error">{errors.message}</FieldError>
              </div>

              {/* ---- Datenschutz ---- */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="kf-privacy"
                  className="flex cursor-pointer items-start gap-2.5 py-1 text-[12px] leading-snug text-charcoal/70"
                >
                  <input
                    id="kf-privacy"
                    name="privacy"
                    type="checkbox"
                    required
                    aria-required="true"
                    checked={values.privacy}
                    onChange={(e) => setField("privacy", e.target.checked)}
                    onBlur={() => onBlurField("privacy")}
                    aria-invalid={errors.privacy ? true : undefined}
                    aria-describedby={describe("privacy")}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-terracotta"
                  />
                  <span>
                    {t.privacyPre}{" "}
                    <Link
                      href="/datenschutz"
                      className="font-medium text-terracotta underline decoration-terracotta/30 underline-offset-2 transition-colors duration-300 hover:decoration-terracotta"
                    >
                      {t.privacyLink}
                    </Link>{" "}
                    {t.privacyPost}
                    <RequiredMark />
                  </span>
                </label>
                <FieldError id="kf-privacy-error">{errors.privacy}</FieldError>
              </div>

              {submitError && (
                <p
                  role="alert"
                  className="rounded-lg border px-4 py-3 text-[12px] leading-snug sm:col-span-2"
                  style={{ color: ERROR_COLOR, borderColor: `${ERROR_COLOR}40`, backgroundColor: `${ERROR_COLOR}0D` }}
                >
                  {submitError}
                </p>
              )}

              <div className="flex justify-end pt-1 sm:col-span-2">
                <Button
                  type="submit"
                  variant="terracotta"
                  size="md"
                  iconType={sending ? "none" : "arrow"}
                  disabled={sending}
                  className="w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
