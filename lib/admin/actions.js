"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  createSession,
  sessionCookie,
  sessionSecret,
  verifySession,
} from "./session";
import {
  MIN_PASSWORD_LENGTH,
  readStoredCredential,
  storeCredential,
  validatePassword,
  verify,
} from "./credentials";

/* The three writes behind the login page and the password page.

   Server actions rather than API routes, for one concrete reason: the forms
   work without JavaScript. Next posts them to the page itself, the action
   runs, the cookie is set — no fetch, no client-side state machine, no window
   where a failed script leaves the only door into the backoffice shut.

   They live in lib/ and not next to a page because AdminHeader imports
   signOut too, and a shared component reaching into app/(admin)/… for its
   action would tie it to one route's folder. */

/* Where to go after a successful sign-in.

   Everything that is not a plain backoffice path falls back to /admin. The
   check exists because `next` comes out of the query string, i.e. from
   whoever wrote the link: without it, /admin/login?next=https://example.com
   turns our login form into an open redirect — a phishing page one hop away
   from a domain the recipient trusts, complete with a real password prompt in
   front of it.

   Rejected on purpose: "//evil.example" (protocol-relative, a browser reads it
   as a host) and /admin/login itself (a sign-in that lands back on the form
   reads as a failure). */
function safeNext(target) {
  if (typeof target !== "string") return "/admin";
  if (!target.startsWith("/admin") || target.startsWith("//")) return "/admin";
  if (target === "/admin/login" || target.startsWith("/admin/login?")) return "/admin";
  return target;
}

async function issueSession() {
  cookies().set(sessionCookie(await createSession(sessionSecret())));
}

export async function signIn(previous, formData) {
  const password = String(formData.get("password") || "");
  const user = String(formData.get("user") || "").trim();
  const target = safeNext(formData.get("next"));

  if (!password) return { error: "Bitte das Passwort eingeben." };

  const granted = await verify(user, password);
  if (!granted) {
    /* A short pause on failure. It does not stop a determined attacker — the
       real defence is a long password — but it turns an unattended script
       from thousands of tries per minute into a handful, and a human typing
       their own password wrong never notices a third of a second. */
    await new Promise((resolve) => setTimeout(resolve, 350));
    return { error: "Benutzer oder Passwort stimmt nicht." };
  }

  await issueSession();

  /* Signed in with the handover password, no password of her own yet: the
     first thing she sees is the page where she picks one. The deep link she
     came from is dropped on purpose — this is the one moment where finishing
     the handover matters more than the page she was headed for, and it
     happens exactly once. */
  if (granted === "bootstrap") redirect("/admin/passwort?uebernahme=1");

  /* redirect() signals by throwing; it must stay outside any try/catch and is
     the last thing this action does. */
  redirect(target);
}

export async function signOut() {
  cookies().delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* Set a new password — the client's own, which nobody else ever sees.

   The session is re-checked here rather than trusted. A server action is a
   routable endpoint: the middleware guards the PAGE, but the action can be
   posted to directly, and "the form was only reachable behind a login" is not
   an access check. */
export async function changePassword(previous, formData) {
  if (!(await verifySession(cookies().get(SESSION_COOKIE)?.value, sessionSecret()))) {
    return { error: "Die Sitzung ist abgelaufen. Bitte erneut anmelden." };
  }

  const current = String(formData.get("current") || "");
  const next = String(formData.get("next") || "");
  const confirmation = String(formData.get("confirmation") || "");
  const stored = await readStoredCredential();
  const user = stored?.user || process.env.ADMIN_USER || "maria";

  if (!(await verify(user, current))) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return { error: "Das bisherige Passwort stimmt nicht." };
  }

  const invalid = validatePassword(next, confirmation);
  if (invalid) return { error: invalid };

  if (next === current) {
    return { error: "Das neue Passwort ist das bisherige." };
  }

  await storeCredential(user, next);

  /* A fresh cookie for this device. The old one stays valid — it is signed
     with a key that lives in the environment and the Edge middleware cannot
     be told to forget it — so other devices keep their session for up to
     twelve hours. The page says so; overstating it would be worse. */
  await issueSession();

  return { done: true, minimum: MIN_PASSWORD_LENGTH };
}
