"use client";
import { useFormState, useFormStatus } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Trash } from "../AdminIcons";
import { Mail } from "@/components/Icons";
import { changeUserRole, resendInvite, revokeUser } from "@/lib/admin/actions";
import { ROLES } from "@/lib/admin/roles";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Who has access, one row each.

   Every action is its own <form> posting a server action. That is more markup
   than a single handler with a fetch, and it buys the property that matters
   here: the page works without JavaScript, and each row carries exactly the
   one thing it can do to exactly the one person it names. There is no shared
   "selected user" state that a mis-click can point at the wrong row.

   ROWS FROM THE PANEL (ADMIN_ALLOWLIST) show their controls disabled and say
   why. Offering a delete button that cannot delete — the entry reappears from
   the environment on the next request — would be a lie the UI tells once and
   the user never trusts again.

   The role select submits on change rather than behind a "save" button: it is
   a single value, the server answers immediately, and a pending save that
   nobody pressed is how a permission ends up half-applied. */

const CELL = "px-4 py-3.5 align-middle";
const HEAD = "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-a-ink/45";

/* useFormStatus reports for the form it is rendered INSIDE, so every control
   that wants to know whether its own form is in flight has to be a child of
   it — a hook called beside the <form> would always read false. */
function RoleField({ user, disabled }) {
  const { t, tm } = useAdminI18n();
  const { pending } = useFormStatus();

  return (
    <label>
      <span className="sr-only">{t("usersPage.roleChange")}</span>
      <select
        name="role"
        defaultValue={user.role}
        disabled={disabled || pending}
        onChange={(e) => e.currentTarget.form.requestSubmit()}
        className="h-9 rounded-lg border border-a-ink/12 bg-a-canvas/70 px-2.5 text-[12px] text-a-ink transition-colors focus:border-champagne focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {tm("role", role)}
          </option>
        ))}
      </select>
    </label>
  );
}

function RoleSelect({ user, disabled }) {
  const [state, formAction] = useFormState(changeUserRole, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="email" value={user.email} />
      <RoleField user={user} disabled={disabled} />
      {state?.error && (
        <p role="alert" className="mt-1.5 max-w-[26ch] text-[10.5px] leading-snug text-a-accent">
          {state.error}
        </p>
      )}
    </form>
  );
}

function RowButton({ title, danger, children }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title={title}
      aria-label={title}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-a-ink/12 transition-colors disabled:opacity-40 ${
        danger
          ? "text-a-ink/55 hover:border-a-accent/40 hover:bg-a-accent/[0.07] hover:text-a-accent"
          : "text-a-ink/55 hover:border-champagne hover:text-a-accent"
      }`}
    >
      {children}
    </button>
  );
}

function RowAction({ action, user, title, children, confirm = null, danger = false }) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        /* window.confirm and not a modal: it is the browser's own dialog, it
           cannot be missed, and it needs no state of its own for something
           that happens twice a year. */
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="email" value={user.email} />
      <RowButton title={title} danger={danger}>
        {children}
      </RowButton>
      {state?.error && (
        <span role="alert" className="ml-2 text-[10.5px] text-a-accent">
          {state.error}
        </span>
      )}
    </form>
  );
}

export default function UserList({ users = [], currentEmail = null }) {
  const { t, tm, intl } = useAdminI18n();
  const reduced = useReducedMotion();

  const when = (iso) => {
    if (!iso) return t("usersPage.never");
    try {
      return new Intl.DateTimeFormat(intl, { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(iso),
      );
    } catch {
      return iso;
    }
  };

  if (!users.length) {
    return (
      <div className="rounded-card-lg border border-dashed border-a-ink/15 bg-a-surface/40 px-8 py-12 text-center">
        <p className="mx-auto max-w-[44ch] text-[12.5px] leading-relaxed text-a-ink/50">
          {t("usersPage.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card-lg border border-a-ink/[0.08] bg-a-surface/60">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-a-ink/[0.07]">
            <th scope="col" className={HEAD}>
              {t("usersPage.colPerson")}
            </th>
            <th scope="col" className={HEAD}>
              {t("usersPage.colRole")}
            </th>
            <th scope="col" className={HEAD}>
              {t("usersPage.colLast")}
            </th>
            <th scope="col" className={`${HEAD} text-right`}>
              <span className="sr-only">{t("usersPage.roleChange")}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-a-ink/[0.06]">
          <AnimatePresence initial={false}>
            {users.map((user) => {
              const fromEnv = user.source === "env";
              const isSelf = currentEmail && user.email === currentEmail;

              return (
                <motion.tr
                  key={user.email}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  className="group/row"
                >
                  <td className={CELL}>
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 font-playfair text-[13px] italic text-ivory">
                        {(user.name?.[0] ?? "?").toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-baseline gap-2">
                          <span className="truncate text-[13px] font-medium text-a-ink/90">
                            {user.name}
                          </span>
                          {isSelf && (
                            <span className="shrink-0 rounded-full bg-a-ink/[0.06] px-2 py-0.5 text-[9.5px] uppercase tracking-[0.1em] text-a-ink/45">
                              {t("usersPage.you")}
                            </span>
                          )}
                        </span>
                        <span className="block truncate text-[11.5px] text-a-ink/45">
                          {user.email}
                        </span>
                        {fromEnv && (
                          <span
                            title={t("usersPage.fromEnvHint")}
                            className="mt-1 inline-block rounded-full bg-champagne/20 px-2 py-0.5 text-[9.5px] uppercase tracking-[0.1em] text-a-gold"
                          >
                            {t("usersPage.fromEnv")}
                          </span>
                        )}
                      </span>
                    </span>
                  </td>

                  <td className={CELL}>
                    <RoleSelect user={user} disabled={fromEnv} />
                    <span className="mt-1 block max-w-[30ch] text-[10.5px] leading-snug text-a-ink/40">
                      {tm("roleHint", user.role)}
                    </span>
                  </td>

                  <td className={`${CELL} whitespace-nowrap text-[12px] tabular-nums text-a-ink/55`}>
                    {when(user.lastSignInAt)}
                  </td>

                  <td className={`${CELL} text-right`}>
                    <span className="inline-flex items-center gap-2">
                      <RowAction
                        action={resendInvite}
                        user={user}
                        title={t("usersPage.resend")}
                      >
                        <Mail className="h-[16px] w-[16px]" />
                      </RowAction>
                      {!fromEnv && (
                        <RowAction
                          action={revokeUser}
                          user={user}
                          danger
                          confirm={t("usersPage.removeConfirm", { email: user.email })}
                          title={t("usersPage.remove")}
                        >
                          <Trash className="h-[16px] w-[16px]" />
                        </RowAction>
                      )}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
