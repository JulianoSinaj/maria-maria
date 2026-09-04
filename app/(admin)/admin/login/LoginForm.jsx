"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import { Eye, EyeOff, Lock } from "@/components/admin/AdminIcons";
import { Mail } from "@/components/Icons";
import { requestLink, signIn } from "@/lib/admin/actions";

/* The two doors.

   THE LINK is the everyday one, and the only one most people have: an address
   is typed in, a mail arrives, one click and the session exists. Nothing is
   invented, transmitted or remembered by anybody — which is the whole reason
   several people can now work here without a password being passed around.

   THE PASSWORD is the house's own, and it stays because mail is a dependency:
   if the mailbox is down or the SMTP credentials expired, the owner still
   gets in. It sits behind a toggle rather than beside the link form — two
   equal-looking sign-in boxes make people hesitate over which is "theirs".

   `useFormState` rather than an onSubmit handler: the browser posts the form
   to the server action even with JavaScript disabled or still loading, and
   the answer comes back through the same channel either way. There is no
   client-side validation beyond `required` — the server decides, and a second
   opinion in the browser could only ever disagree with it.

   No password and no address touches React state. Each lives in its input, is
   read out of the FormData by the action, and is gone with the next render. */

const FIELD =
  "h-12 w-full rounded-xl border border-charcoal/12 bg-ivory/70 px-4 text-[13.5px] text-charcoal transition-colors placeholder:text-charcoal/30 focus:border-champagne focus:outline-none focus:ring-0";

const LABEL =
  "mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.2em] text-charcoal/45";

const NOTE = "mt-5 text-center text-[11px] leading-relaxed text-charcoal/40";

function SubmitButton({ idle, busy }) {
  /* useFormStatus only reports for the form it is rendered inside — hence a
     child component rather than a flag next to useFormState. */
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      aria-disabled={pending}
      className={`w-full ${pending ? "pointer-events-none opacity-70" : ""}`}
    >
      {pending ? busy : idle}
    </Button>
  );
}

function Problem({ children }) {
  const reduced = useReducedMotion();
  return (
    <motion.p
      role="alert"
      initial={reduced ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="mt-5 rounded-xl border border-bordeaux/20 bg-bordeaux/[0.06] px-4 py-3 text-[12.5px] leading-relaxed text-bordeaux"
    >
      {children}
    </motion.p>
  );
}

/* ------------------------------------------------------------------ link ---- */

function LinkForm({ next, onRestart }) {
  const [state, formAction] = useFormState(requestLink, { error: null });
  const reduced = useReducedMotion();

  if (state?.sent) {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="mt-9"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-bordeaux to-wine text-ivory">
          <Mail className="h-5 w-5" />
        </span>
        <h2 className="mt-5 font-playfair text-[21px] leading-tight text-charcoal">
          Schauen Sie in Ihr Postfach
        </h2>
        {/* Deliberately not "we sent you a link": whether an address is on the
            list is not something this page answers, and a wording that only
            appears for known addresses answers it. */}
        <p className="mt-3 text-[12.5px] leading-relaxed text-charcoal/60">
          Wenn <span className="font-medium text-charcoal">{state.email}</span> Zugang zum
          Backoffice hat, liegt dort gleich ein Anmeldelink. Er gilt fünfzehn Minuten und lässt
          sich einmal verwenden.
        </p>

        {/* Only ever set on a machine without a mail channel, outside
            production — see lib/admin/mail.js. It saves a trip to the server
            log while developing and cannot appear on the live site. */}
        {state.devLink && (
          <p className="mt-5 break-all rounded-xl border border-champagne/50 bg-champagne/[0.14] px-4 py-3 text-[11.5px] leading-relaxed text-charcoal/70">
            Kein Versandkanal eingerichtet — Link:{" "}
            <a href={state.devLink} className="underline decoration-champagne underline-offset-4">
              {state.devLink}
            </a>
          </p>
        )}

        <button
          type="button"
          onClick={onRestart}
          className="mt-7 text-[12px] text-bordeaux underline decoration-champagne underline-offset-4 transition-colors hover:text-wine"
        >
          Andere Adresse verwenden
        </button>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="mt-9">
      <input type="hidden" name="next" value={next} />

      <label className="block">
        <span className={LABEL}>E-Mail-Adresse</span>
        <span className="relative block">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-charcoal/30"
          />
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            spellCheck={false}
            placeholder="name@haus.de"
            className={`${FIELD} pl-11`}
          />
        </span>
      </label>

      {state?.error && <Problem>{state.error}</Problem>}

      <div className="mt-7">
        <SubmitButton idle="Anmeldelink schicken" busy="Wird geschickt …" />
      </div>

      <p className={NOTE}>Kein Passwort nötig — der Link im Postfach genügt.</p>
    </form>
  );
}

/* -------------------------------------------------------------- password ---- */

function PasswordForm({ next }) {
  const [state, formAction] = useFormState(signIn, { error: null });
  const [visible, setVisible] = useState(false);

  return (
    <form action={formAction} className="mt-9">
      {/* Where to go afterwards. Hidden rather than kept in the action's
          closure so the form still carries it without JavaScript. */}
      <input type="hidden" name="next" value={next} />

      <div className="space-y-5">
        <label className="block">
          <span className={LABEL}>Benutzer</span>
          <input
            name="user"
            type="text"
            autoComplete="username"
            defaultValue="maria"
            spellCheck={false}
            className={FIELD}
          />
        </label>

        <label className="block">
          <span className={LABEL}>Passwort</span>
          <span className="relative block">
            <Lock
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-charcoal/30"
            />
            <input
              name="password"
              type={visible ? "text" : "password"}
              autoComplete="current-password"
              required
              autoFocus
              className={`${FIELD} pl-11 pr-12`}
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
        </label>
      </div>

      {/* role="alert" so a screen reader announces the failure — the visual
          jump of a red panel is worth nothing to someone who cannot see it. */}
      {state?.error && <Problem>{state.error}</Problem>}

      <div className="mt-7">
        <SubmitButton idle="Anmelden" busy="Wird geprüft …" />
      </div>

      <p className={NOTE}>Die Anmeldung gilt zwölf Stunden auf diesem Gerät.</p>
    </form>
  );
}

/* ------------------------------------------------------------------ both ---- */

export default function LoginForm({ next = "", canLink = false, canPassword = true }) {
  /* Whichever door is actually available opens first; with both, the link
     leads, because it is the one every colleague has. */
  const [mode, setMode] = useState(canLink ? "link" : "password");
  /* Remounting the form is what resets useFormState — "use another address"
     has to forget the answer the server gave about the last one. */
  const [attempt, setAttempt] = useState(0);
  const reduced = useReducedMotion();

  const both = canLink && canPassword;

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${mode}-${attempt}`}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        >
          {mode === "link" ? (
            <LinkForm next={next} onRestart={() => setAttempt((a) => a + 1)} />
          ) : (
            <PasswordForm next={next} />
          )}
        </motion.div>
      </AnimatePresence>

      {both && (
        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "link" ? "password" : "link"));
            setAttempt((a) => a + 1);
          }}
          className="mt-6 w-full text-center text-[11.5px] text-charcoal/45 transition-colors hover:text-bordeaux"
        >
          {mode === "link" ? (
            <>
              Oder <span className="underline decoration-champagne underline-offset-4">mit dem Passwort des Hauses anmelden</span>
            </>
          ) : (
            <>
              Oder <span className="underline decoration-champagne underline-offset-4">einen Anmeldelink anfordern</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
