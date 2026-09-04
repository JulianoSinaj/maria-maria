"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Logout, Lock, Users } from "./AdminIcons";
import { signOut } from "@/lib/admin/actions";
import { canManageUsers } from "@/lib/admin/roles";
import { useAdminI18n } from "./i18n/AdminI18n";

/* The person, top right.

   It used to be a chip that said "Admin" over the letter A and did nothing at
   all — which was honest while there was exactly one shared password and
   nobody to name. Now that people sign in as themselves, it says who is
   signed in, which role they hold and how they got in, and it holds the two
   things that belong to a person rather than to the website: the way to their
   own settings, and the way out.

   The menu is a plain popover, not a portal: it lives inside the header,
   which is already the top layer of the shell, and a portal would only add a
   focus problem. Escape closes it, a click anywhere else closes it, and focus
   returns to the chip — the same contract as the mobile drawer.

   Sign-out is a FORM, not a link. A GET that ends a session can be triggered
   by any <img src> on a foreign page, and a form still posts when JavaScript
   never arrives. */

const initial = (name) => (name?.trim()?.[0] ?? "A").toUpperCase();

export default function AdminUserChip({ user }) {
  const { t, tm } = useAdminI18n();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    /* pointerdown rather than click: a menu that closes only on a completed
       click stays open while a drag selects text behind it */
    const onPointer = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const name = user?.name || t("header.userName");
  const role = user?.role ?? null;
  const owner = canManageUsers(role);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("header.menu")}
        className="group flex items-center gap-2.5 rounded-full border border-a-ink/12 py-1 pl-1 pr-1 transition-colors hover:border-champagne sm:pr-4"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 font-playfair text-[13px] italic text-ivory">
          {initial(name)}
        </span>
        <span className="hidden max-w-[13ch] text-left sm:block">
          <span className="block truncate text-[12px] font-medium leading-tight text-a-ink">
            {name}
          </span>
          <span className="block truncate text-[10px] leading-tight tracking-[0.06em] text-a-ink/45">
            {role ? tm("role", role) : t("header.userRole")}
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={t("header.menu")}
            initial={reduced ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.7 }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-[270px] overflow-hidden rounded-2xl border border-a-ink/[0.09] bg-a-surface shadow-glass will-transform"
          >
            <div className="border-b border-a-ink/[0.07] px-5 py-4">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
                {t("header.signedInAs")}
              </p>
              <p className="mt-1.5 truncate font-playfair text-[16px] leading-tight text-a-ink">
                {name}
              </p>
              {user?.email && (
                <p className="mt-0.5 truncate text-[11.5px] text-a-ink/50">{user.email}</p>
              )}
              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-a-ink/45">
                {role && (
                  <span className="rounded-full bg-a-accent/10 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-a-accent/80">
                    {tm("role", role)}
                  </span>
                )}
                {user?.via && <span>{tm("via", user.via)}</span>}
              </p>
              {role && (
                <p className="mt-2 text-[11px] leading-relaxed text-a-ink/45">{tm("roleHint", role)}</p>
              )}
            </div>

            {/* Only owners have anything to manage: everyone else signs in by
                link and has no password to change. Hiding it is a courtesy —
                the middleware turns them away either way. */}
            {owner && (
              <div className="p-1.5">
                <Link
                  href="/admin/benutzer"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] text-a-ink/80 transition-colors hover:bg-a-ink/[0.05] hover:text-a-accent"
                >
                  <Users className="h-[17px] w-[17px] text-a-ink/45" />
                  {t("header.users")}
                </Link>
                <Link
                  href="/admin/passwort"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] text-a-ink/80 transition-colors hover:bg-a-ink/[0.05] hover:text-a-accent"
                >
                  <Lock className="h-[17px] w-[17px] text-a-ink/45" />
                  {t("header.account")}
                </Link>
              </div>
            )}

            <form action={signOut} className="border-t border-a-ink/[0.07] p-1.5">
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[12.5px] text-a-ink/80 transition-colors hover:bg-a-fill/10 hover:text-a-accent"
              >
                <Logout className="h-[17px] w-[17px] text-a-ink/45" />
                {t("header.signOut")}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
