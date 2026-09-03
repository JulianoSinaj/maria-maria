"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import PageShell from "@/components/admin/PageShell";
import Button from "@/components/ui/Button";
import { Check } from "@/components/Icons";
import { Eye, EyeOff, Lock } from "@/components/admin/AdminIcons";
import { changePassword } from "@/lib/admin/actions";

/* Set your own password.

   Three fields and no cleverness: the current password (so a borrowed open
   laptop cannot lock the owner out), the new one twice. All validation lives
   in the server action — a second opinion in the browser could only ever
   disagree with the side that decides.

   No password touches React state. Each one stays in its input, is read out
   of the FormData by the action, and is gone with the next render. */

const MINIMUM = 12;

const FIELD =
  "h-12 w-full rounded-xl border border-charcoal/12 bg-ivory/70 pl-11 pr-12 text-[13.5px] text-charcoal transition-colors placeholder:text-charcoal/30 focus:border-champagne focus:outline-none";

const LABEL = "mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.2em] text-charcoal/45";

function PasswordField({ name, label, autoComplete, hint }) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <span className="relative block">
        <Lock
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-charcoal/30"
        />
        <input
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          className={FIELD}
        />
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? "Passwort verbergen" : "Passwort anzeigen"}
          aria-pressed={visible}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-charcoal/40 transition-colors hover:text-bordeaux"
        >
          {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </span>
      {hint && <span className="mt-2 block text-[11.5px] leading-relaxed text-charcoal/45">{hint}</span>}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      aria-disabled={pending}
      className={`w-full sm:w-auto ${pending ? "pointer-events-none opacity-70" : ""}`}
    >
      {pending ? "Wird gespeichert …" : "Passwort speichern"}
    </Button>
  );
}

const formatDate = (iso) => {
  try {
    return new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeStyle: "short" }).format(
      new Date(iso),
    );
  } catch {
    return null;
  }
};

export default function PasswordForm({ handover = false, user, changedAt }) {
  const [state, formAction] = useFormState(changePassword, { error: null });
  const reduced = useReducedMotion();
  const changed = changedAt ? formatDate(changedAt) : null;

  return (
    <PageShell
      title="Passwort"
      lede="Ihr Zugang zum Redaktionssystem. Was Sie hier vergeben, wird nur verschlüsselt gespeichert — auslesen kann es niemand, auch wir nicht."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
        <section className="rounded-card-lg border border-charcoal/[0.08] bg-ivory/70 p-6 sm:p-7">
          {handover && (
            <p className="mb-6 rounded-xl border border-champagne/50 bg-champagne/[0.12] px-4 py-3.5 text-[12.5px] leading-relaxed text-charcoal/80">
              Sie sind mit dem Übergabe-Passwort angemeldet. Vergeben Sie jetzt
              Ihr eigenes — danach funktioniert das übergebene nicht mehr.
            </p>
          )}

          {state?.done ? (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="py-4 text-center"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-bordeaux to-wine text-ivory">
                <Check className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-playfair text-[21px] leading-tight text-charcoal">
                Passwort geändert
              </h3>
              <p className="mx-auto mt-3 max-w-[38ch] text-[12.5px] leading-relaxed text-charcoal/60">
                Ab sofort gilt nur noch das neue Passwort. Auf diesem Gerät
                bleiben Sie angemeldet.
              </p>
            </motion.div>
          ) : (
            <form action={formAction} className="space-y-5">
              <PasswordField
                name="current"
                label="Bisheriges Passwort"
                autoComplete="current-password"
              />

              <div className="h-px bg-charcoal/[0.08]" />

              <PasswordField
                name="next"
                label="Neues Passwort"
                autoComplete="new-password"
                hint={`Mindestens ${MINIMUM} Zeichen. Länger ist besser als komplizierter: drei ungewöhnliche Wörter sind sicherer und leichter zu merken.`}
              />
              <PasswordField
                name="confirmation"
                label="Neues Passwort wiederholen"
                autoComplete="new-password"
              />

              {state?.error && (
                <motion.p
                  role="alert"
                  initial={reduced ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="rounded-xl border border-bordeaux/20 bg-bordeaux/[0.06] px-4 py-3 text-[12.5px] leading-relaxed text-bordeaux"
                >
                  {state.error}
                </motion.p>
              )}

              <div className="pt-1">
                <SubmitButton />
              </div>
            </form>
          )}
        </section>

        <aside className="space-y-5 rounded-card-lg border border-charcoal/[0.08] bg-cream/60 p-6 text-[12.5px] leading-relaxed text-charcoal/65 sm:p-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bordeaux/55">
              Zugang
            </p>
            <p className="mt-2">
              Benutzer <span className="font-medium text-charcoal">{user}</span>
              {changed ? (
                <> · zuletzt geändert am <span className="font-medium text-charcoal">{changed}</span></>
              ) : (
                <> · noch kein eigenes Passwort vergeben</>
              )}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bordeaux/55">
              Was beim Speichern passiert
            </p>
            <ul className="mt-2 space-y-2">
              <li>
                Gespeichert wird keine lesbare Fassung des Passworts, sondern
                eine nicht umkehrbare Prüfsumme. Es lässt sich weder auslesen
                noch wiederherstellen — auch nicht von der Agentur.
              </li>
              <li>Das bei der Übergabe vergebene Passwort verliert seine Gültigkeit.</li>
              <li>
                Andere Geräte, an denen Sie angemeldet sind, bleiben es noch bis
                zu zwölf Stunden. Danach ist überall das neue Passwort nötig.
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bordeaux/55">
              Passwort vergessen
            </p>
            <p className="mt-2">
              Dann kann es niemand nachschlagen; es muss zurückgesetzt werden.
              Die Agentur setzt den Zugang zurück und übergibt ein neues
              Startpasswort, das Sie hier sofort wieder ersetzen.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
