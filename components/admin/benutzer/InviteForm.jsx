"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import { Mail } from "@/components/Icons";
import { inviteUser } from "@/lib/admin/actions";
import { ROLES } from "@/lib/admin/roles";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Giving someone access — three fields, and the mail goes out with them.

   The role is chosen HERE rather than afterwards, because "add, then find the
   row, then change the dropdown" is how a colleague ends up an owner for ten
   minutes. Editor is preselected: it is what an agency or a Terra Vera
   colleague needs, and neither of the other two is a safe default — viewer
   would be useless to them, owner would be too much. */

const FIELD =
  "h-11 w-full rounded-xl border border-a-ink/12 bg-a-canvas/70 px-4 text-[13px] text-a-ink transition-colors placeholder:text-a-ink/30 focus:border-champagne focus:outline-none";

const LABEL = "mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-a-ink/45";

function Submit() {
  const { t } = useAdminI18n();
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending}
      aria-disabled={pending}
      className={`w-full sm:w-auto ${pending ? "pointer-events-none opacity-70" : ""}`}
    >
      {pending ? t("usersPage.inviteSubmitting") : t("usersPage.inviteSubmit")}
    </Button>
  );
}

export default function InviteForm({ mailReady = true }) {
  const { t, tm } = useAdminI18n();
  const [state, formAction] = useFormState(inviteUser, {});
  const [attempt, setAttempt] = useState(0);
  const reduced = useReducedMotion();

  return (
    <section className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/70 p-6 sm:p-7">
      <h3 className="font-playfair text-[19px] leading-tight text-a-ink">
        {t("usersPage.inviteTitle")}
      </h3>
      <p className="mt-2 text-[12.5px] leading-relaxed text-a-ink/55">
        {t("usersPage.inviteLede")}
      </p>

      {!mailReady && (
        <p
          role="note"
          className="mt-5 rounded-xl border border-champagne/50 bg-champagne/15 px-4 py-3 text-[12px] leading-relaxed text-a-gold"
        >
          {t("usersPage.mailWarning")}
        </p>
      )}

      <form key={attempt} action={formAction} className="mt-6 space-y-4">
        <label className="block">
          <span className={LABEL}>{t("usersPage.inviteEmail")}</span>
          <span className="relative block">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-a-ink/30"
            />
            <input
              name="email"
              type="email"
              required
              spellCheck={false}
              placeholder="name@haus.de"
              className={`${FIELD} pl-10`}
            />
          </span>
        </label>

        <label className="block">
          <span className={LABEL}>{t("usersPage.inviteName")}</span>
          <input
            name="name"
            type="text"
            placeholder={t("usersPage.inviteNamePlaceholder")}
            className={FIELD}
          />
        </label>

        <fieldset>
          <legend className={LABEL}>{t("usersPage.inviteRole")}</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {ROLES.map((role) => (
              <label
                key={role}
                className="group cursor-pointer rounded-xl border border-a-ink/[0.1] bg-a-canvas/60 px-3.5 py-3 transition-colors duration-300 hover:border-champagne has-[:checked]:border-a-accent/40 has-[:checked]:bg-a-accent/[0.06]"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    defaultChecked={role === "editor"}
                    className="h-3.5 w-3.5 accent-[rgb(var(--a-accent))]"
                  />
                  <span className="text-[12.5px] font-medium text-a-ink/85">{tm("role", role)}</span>
                </span>
                <span className="mt-1.5 block text-[10.5px] leading-relaxed text-a-ink/45">
                  {tm("roleHint", role)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {state?.error && (
          <motion.p
            role="alert"
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="rounded-xl border border-a-accent/25 bg-a-accent/[0.07] px-4 py-3 text-[12.5px] leading-relaxed text-a-accent"
          >
            {state.error}
          </motion.p>
        )}

        {state?.done && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="rounded-xl border border-vine/30 bg-vine/[0.08] px-4 py-3 text-[12.5px] leading-relaxed text-vine"
          >
            <p>{t("usersPage.inviteDone", { email: state.email })}</p>
            {state.warning && <p className="mt-1.5 text-a-gold">{state.warning}</p>}
            {state.devLink && (
              <p className="mt-2 break-all text-[11.5px] text-a-ink/55">
                {t("usersPage.devLink")}{" "}
                <a href={state.devLink} className="underline decoration-champagne underline-offset-4">
                  {state.devLink}
                </a>
              </p>
            )}
          </motion.div>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Submit />
          {/* Remounting the form is what resets useFormState — after one
              invitation the fields have to be empty for the next person, and
              the confirmation has to stop describing the last one. */}
          {state?.done && (
            <button
              type="button"
              onClick={() => setAttempt((a) => a + 1)}
              className="text-[11.5px] text-a-ink/45 underline decoration-champagne underline-offset-4 transition-colors hover:text-a-accent"
            >
              {t("usersPage.inviteAnother")}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
