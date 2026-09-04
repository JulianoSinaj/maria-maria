"use client";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import { confirmLink } from "@/lib/admin/actions";

/* The button that spends the link.

   One field, and it is hidden: the token travels back exactly as it arrived.
   Everything that decides anything — is it known, is it expired, was it used,
   is this address still on the list — happens in the action, because a
   verdict reached in the browser is a verdict an attacker writes. */

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      aria-disabled={pending}
      className={`w-full ${pending ? "pointer-events-none opacity-70" : ""}`}
    >
      {pending ? "Wird angemeldet …" : "Anmeldung bestätigen"}
    </Button>
  );
}

export default function ConfirmForm({ token, next = "" }) {
  const [state, formAction] = useFormState(confirmLink, { error: null });
  const reduced = useReducedMotion();

  return (
    <form action={formAction} className="mt-8">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="next" value={next} />

      {state?.error ? (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <p
            role="alert"
            className="rounded-xl border border-bordeaux/20 bg-bordeaux/[0.06] px-4 py-3 text-[12.5px] leading-relaxed text-bordeaux"
          >
            {state.error}
          </p>
          <Link
            href="/admin/login"
            className="mt-5 inline-block text-[12px] text-bordeaux underline decoration-champagne underline-offset-4 transition-colors hover:text-wine"
          >
            Neuen Link anfordern
          </Link>
        </motion.div>
      ) : (
        <SubmitButton />
      )}
    </form>
  );
}
