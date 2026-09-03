"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import { Eye, EyeOff, Lock } from "@/components/admin/AdminIcons";
import { signIn } from "@/lib/admin/actions";

/* The sign-in form.

   `useFormState` rather than an onSubmit handler: the browser posts the form
   to the server action even with JavaScript disabled or still loading, and
   the error message comes back through the same channel either way. There is
   no client-side validation beyond `required` — the server decides, and a
   second opinion in the browser could only ever disagree with it.

   The password never touches React state. It lives in the input, is read out
   of the FormData by the action, and is gone with the next render. */

const FIELD =
  "h-12 w-full rounded-xl border border-charcoal/12 bg-ivory/70 px-4 text-[13.5px] text-charcoal transition-colors placeholder:text-charcoal/30 focus:border-champagne focus:outline-none focus:ring-0";

const LABEL =
  "mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.2em] text-charcoal/45";

function SubmitButton() {
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
      {pending ? "Wird geprüft …" : "Anmelden"}
    </Button>
  );
}

export default function LoginForm({ next = "" }) {
  const [state, formAction] = useFormState(signIn, { error: null });
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

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
      {state?.error && (
        <motion.p
          role="alert"
          initial={reduced ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="mt-5 rounded-xl border border-bordeaux/20 bg-bordeaux/[0.06] px-4 py-3 text-[12.5px] leading-relaxed text-bordeaux"
        >
          {state.error}
        </motion.p>
      )}

      <div className="mt-7">
        <SubmitButton />
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-charcoal/40">
        Die Anmeldung gilt zwölf Stunden auf diesem Gerät.
      </p>
    </form>
  );
}
