"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SITE_URL } from "@/lib/site";
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
import {
  DEFAULT_ROLE,
  addUser,
  findUser,
  isEmail,
  nameFromEmail,
  normalizeEmail,
  removeUser,
  setRole,
  touchSignIn,
} from "./users";
import { LINK_MAX_AGE_MINUTES, consumeLink, issueLink, revokeLinks } from "./magic";
import { mailConfigured, sendInvite, sendSignInLink } from "./mail";
import { canManageUsers, isRole } from "./roles";
import { record } from "./audit";

/* Everything the backoffice writes about ITSELF: who is signed in, who may
   be, and with what password.

   Server actions rather than API routes, for one concrete reason: the forms
   work without JavaScript. Next posts them to the page itself, the action
   runs, the cookie is set — no fetch, no client-side state machine, no window
   where a failed script leaves the only door into the backoffice shut.

   They live in lib/ and not next to a page because AdminHeader imports
   signOut too, and a shared component reaching into app/(admin)/… for its
   action would tie it to one route's folder.

   EVERY ACTION HERE RE-CHECKS THE SESSION. A server action is a routable
   endpoint: the middleware guards the page, but the action can be posted to
   directly, and "the form was only reachable behind a login" is not an access
   check. */

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
  if (target === "/admin/login" || target.startsWith("/admin/login")) return "/admin";
  return target;
}

/* The address the link has to point at.

   Taken from the request, not from SITE_URL: a link built from the canonical
   domain would send someone developing on localhost — or testing on a preview
   deployment — to production, where their token does not exist. SITE_URL is
   the fallback for the one case where the headers say nothing. */
function originFromRequest() {
  try {
    const h = headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    if (!host) return SITE_URL;
    const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  } catch {
    return SITE_URL;
  }
}

const requestIp = () => {
  try {
    const forwarded = headers().get("x-forwarded-for");
    return forwarded ? forwarded.split(",")[0].trim().slice(0, 64) : null;
  } catch {
    return null;
  }
};

/** The identity behind the current request, or null. */
async function currentSession() {
  return verifySession(cookies().get(SESSION_COOKIE)?.value, sessionSecret());
}

async function issueSession(identity) {
  cookies().set(sessionCookie(await createSession(sessionSecret(), identity)));
}

/* A short pause on a failed attempt. It does not stop a determined attacker —
   the real defence is a long password and a 15-minute link — but it turns an
   unattended script from thousands of tries per minute into a handful, and a
   human typing their own password wrong never notices a third of a second. */
const pause = () => new Promise((resolve) => setTimeout(resolve, 350));

/* ------------------------------------------------------- sign in by link ---- */

/**
 * Ask for a sign-in link.
 *
 * The answer is THE SAME whether the address is on the allowlist or not.
 * Anything else turns this form into a way to ask "does this person work
 * here?" — and the honest-looking version ("unknown address") is the one that
 * answers it most clearly.
 */
export async function requestLink(previous, formData) {
  const email = normalizeEmail(formData.get("email"));
  const target = safeNext(formData.get("next"));

  if (!isEmail(email)) return { error: "Bitte eine gültige E-Mail-Adresse eingeben." };

  const user = await findUser(email);
  if (!user) {
    /* the same pause a real send costs, so the response time does not answer
       the question the wording refuses to */
    await pause();
    return { sent: true, email };
  }

  const link = await issueLink(email, { ip: requestIp() });
  if (link.throttled) return { sent: true, email };

  const url = `${originFromRequest()}/admin/login/bestaetigen?token=${encodeURIComponent(
    link.token,
  )}${target !== "/admin" ? `&next=${encodeURIComponent(target)}` : ""}`;

  try {
    const { channel, link: shown } = await sendSignInLink({
      to: email,
      name: user.name,
      url,
      minutes: LINK_MAX_AGE_MINUTES,
    });
    await record({
      actor: { email, name: user.name, role: user.role, via: "link" },
      action: "auth.linkRequested",
      target: email,
      summary: `Anmeldelink angefordert (${channel})`,
    });
    /* `devLink` only ever comes back on a machine with no mail channel and
       NODE_ENV !== production — see lib/admin/mail.js */
    return { sent: true, email, devLink: shown ?? null };
  } catch (err) {
    console.error("[admin] Anmeldelink konnte nicht zugestellt werden:", err);
    return {
      error:
        "Der Link konnte gerade nicht verschickt werden. Bitte in einem Moment noch einmal versuchen.",
    };
  }
}

/**
 * Spend a link and sign the person in.
 *
 * Deliberately a POST from a button rather than something that happens on
 * opening the link: mail clients and corporate scanners FETCH the URLs in a
 * message before anyone reads it, and a single-use token spent by a scanner
 * is a sign-in that fails for the person it was meant for.
 */
export async function confirmLink(previous, formData) {
  const token = String(formData.get("token") || "");
  const target = safeNext(formData.get("next"));

  const email = await consumeLink(token);
  if (!email) {
    await pause();
    return {
      error:
        "Dieser Link ist abgelaufen oder wurde bereits verwendet. Bitte einen neuen anfordern.",
    };
  }

  /* The allowlist is checked AGAIN here, not only when the link was issued:
     access can be withdrawn in the fifteen minutes a link is valid, and the
     moment of use is the moment that counts. */
  const user = await findUser(email);
  if (!user) {
    return { error: "Für diese Adresse besteht kein Zugang mehr." };
  }

  await issueSession({ email: user.email, name: user.name, role: user.role, via: "link" });
  await touchSignIn(user.email);
  await record({
    actor: { email: user.email, name: user.name, role: user.role, via: "link" },
    action: "auth.signIn",
    target: user.email,
    summary: "Angemeldet per E-Mail-Link",
  });

  redirect(target);
}

/* --------------------------------------------------- sign in by password ---- */

/**
 * The house password — the owner's own door.
 *
 * It stays beside the links rather than being replaced by them, and the
 * reason is practical: mail is a dependency. If the mailbox is down, the DNS
 * is mid-migration or the SMTP password expired, the owner still gets in.
 * Editors and viewers have no password at all; there is nothing to hand them
 * and nothing for them to lose.
 */
export async function signIn(previous, formData) {
  const password = String(formData.get("password") || "");
  const user = String(formData.get("user") || "").trim();
  const target = safeNext(formData.get("next"));

  if (!password) return { error: "Bitte das Passwort eingeben." };

  const granted = await verify(user, password);
  if (!granted) {
    await pause();
    return { error: "Benutzer oder Passwort stimmt nicht." };
  }

  const stored = await readStoredCredential();
  const name = stored?.user || user || process.env.ADMIN_USER || "Maria";

  /* The password identity is always an owner: it is the credential of the
     house, and the house owns the house. Its e-mail is null — this door does
     not know an address, and inventing one would put a name in the audit log
     that nobody could write to. */
  await issueSession({ email: null, name, role: "owner", via: "password" });
  await record({
    actor: { email: null, name, role: "owner", via: "password" },
    action: "auth.signIn",
    target: name,
    summary:
      granted === "bootstrap" ? "Angemeldet mit dem Übergabe-Passwort" : "Angemeldet mit Passwort",
  });

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
  const who = await currentSession();
  if (who) {
    await record({
      actor: who,
      action: "auth.signOut",
      target: who.email || who.name,
      summary: "Abgemeldet",
    });
  }
  cookies().delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ------------------------------------------------------------- password ---- */

/** Set a new house password — the owner's own, which nobody else ever sees. */
export async function changePassword(previous, formData) {
  const who = await currentSession();
  if (!who) return { error: "Die Sitzung ist abgelaufen. Bitte erneut anmelden." };
  if (!canManageUsers(who.role)) {
    return { error: "Das Passwort des Hauses ändert die Leitung." };
  }

  const current = String(formData.get("current") || "");
  const next = String(formData.get("next") || "");
  const confirmation = String(formData.get("confirmation") || "");
  const stored = await readStoredCredential();
  const user = stored?.user || process.env.ADMIN_USER || "maria";

  if (!(await verify(user, current))) {
    await pause();
    return { error: "Das bisherige Passwort stimmt nicht." };
  }

  const invalid = validatePassword(next, confirmation);
  if (invalid) return { error: invalid };
  if (next === current) return { error: "Das neue Passwort ist das bisherige." };

  await storeCredential(user, next);
  await record({
    actor: who,
    action: "password.change",
    target: user,
    summary: "Passwort des Hauses geändert",
  });

  /* A fresh cookie for this device, carrying the SAME identity — changing the
     password does not change who you are. The old cookie stays valid: it is
     signed with a key that lives in the environment and the Edge middleware
     cannot be told to forget it, so other devices keep their session for up
     to twelve hours. The page says so; overstating it would be worse. */
  await issueSession(who);

  return { done: true, minimum: MIN_PASSWORD_LENGTH };
}

/* ---------------------------------------------------------------- users ---- */

/* Every one of these re-checks the role. The middleware already keeps
   non-owners off /admin/benutzer, but an action is an endpoint of its own. */

async function requireOwnerSession() {
  const who = await currentSession();
  if (!who) return { error: "Die Sitzung ist abgelaufen. Bitte erneut anmelden." };
  if (!canManageUsers(who.role)) {
    return { error: "Zugänge verwaltet die Leitung." };
  }
  return { who };
}

/**
 * Add someone to the allowlist and send them their first link in the same
 * breath. An invitation the recipient cannot act on is an invitation that
 * generates a phone call.
 */
export async function inviteUser(previous, formData) {
  const gate = await requireOwnerSession();
  if (gate.error) return { error: gate.error };

  const email = normalizeEmail(formData.get("email"));
  const name = String(formData.get("name") || "").trim();
  const roleInput = String(formData.get("role") || "");
  const role = isRole(roleInput) ? roleInput : DEFAULT_ROLE;

  if (!isEmail(email)) return { error: "Bitte eine gültige E-Mail-Adresse eingeben." };

  const created = await addUser({
    email,
    name: name || nameFromEmail(email),
    role,
    invitedBy: gate.who.email,
  });
  if (!created.ok) return { error: created.error };

  await record({
    actor: gate.who,
    action: "user.invite",
    target: email,
    summary: `Zugang eingerichtet als ${role}`,
    changes: { role: { from: null, to: role }, name: { from: null, to: created.user.name } },
  });

  /* The mail is best effort — the access exists either way, and an SMTP
     hiccup must not leave a user half-created. The form says what happened. */
  let delivery = { channel: "log" };
  try {
    const link = await issueLink(email, { ip: requestIp() });
    if (link.token) {
      delivery = await sendInvite({
        to: email,
        name: created.user.name,
        url: `${originFromRequest()}/admin/login/bestaetigen?token=${encodeURIComponent(link.token)}`,
        minutes: LINK_MAX_AGE_MINUTES,
        invitedBy: gate.who.name,
      });
    }
  } catch (err) {
    console.error("[admin] Einladung konnte nicht zugestellt werden:", err);
    revalidatePath("/admin/benutzer");
    return {
      done: true,
      email,
      warning:
        "Der Zugang steht, die Einladung konnte aber nicht verschickt werden. Die Person kann sich unter /admin/login selbst einen Link schicken lassen.",
    };
  }

  revalidatePath("/admin/benutzer");
  return {
    done: true,
    email,
    devLink: delivery.link ?? null,
    warning: mailConfigured()
      ? null
      : "Es ist kein Versandkanal eingerichtet — die Einladung steht nur im Server-Log.",
  };
}

/** Promote or demote. The last owner cannot be demoted; users.js decides. */
export async function changeUserRole(previous, formData) {
  const gate = await requireOwnerSession();
  if (gate.error) return { error: gate.error };

  const email = normalizeEmail(formData.get("email"));
  const role = String(formData.get("role") || "");
  const before = await findUser(email);

  const changed = await setRole(email, role);
  if (!changed.ok) return { error: changed.error };

  await record({
    actor: gate.who,
    action: "user.role",
    target: email,
    summary: `Rolle geändert: ${before?.role ?? "—"} → ${role}`,
    changes: { role: { from: before?.role ?? null, to: role } },
  });

  revalidatePath("/admin/benutzer");
  return { done: true, email };
}

/**
 * Withdraw access. Outstanding links are dropped with it — a link in a
 * mailbox is a working credential until it is spent, and "removed" has to
 * mean removed.
 *
 * What this CANNOT do is end a session the person already holds: the
 * middleware verifies a signature, it does not read the list. Twelve hours is
 * the outer limit, and rotating ADMIN_SESSION_SECRET ends every session at
 * once. The page says so rather than implying an immediacy that is not there.
 */
export async function revokeUser(previous, formData) {
  const gate = await requireOwnerSession();
  if (gate.error) return { error: gate.error };

  const email = normalizeEmail(formData.get("email"));
  const removed = await removeUser(email);
  if (!removed.ok) return { error: removed.error };

  await revokeLinks(email);
  await record({
    actor: gate.who,
    action: "user.remove",
    target: email,
    summary: `Zugang entzogen (war ${removed.user.role})`,
    changes: { role: { from: removed.user.role, to: null } },
  });

  revalidatePath("/admin/benutzer");
  return { done: true, email };
}

/** Send someone a fresh link — for the invitation that never arrived. */
export async function resendInvite(previous, formData) {
  const gate = await requireOwnerSession();
  if (gate.error) return { error: gate.error };

  const email = normalizeEmail(formData.get("email"));
  const user = await findUser(email);
  if (!user) return { error: "Diese Person steht nicht auf der Liste." };

  const link = await issueLink(email, { ip: requestIp() });
  if (link.throttled) {
    return { done: true, email, warning: "Vor einer Minute ging schon ein Link raus." };
  }

  try {
    const delivery = await sendSignInLink({
      to: email,
      name: user.name,
      url: `${originFromRequest()}/admin/login/bestaetigen?token=${encodeURIComponent(link.token)}`,
      minutes: LINK_MAX_AGE_MINUTES,
      requestedBy: gate.who.name,
    });
    await record({
      actor: gate.who,
      action: "user.link",
      target: email,
      summary: "Anmeldelink erneut verschickt",
    });
    return { done: true, email, devLink: delivery.link ?? null };
  } catch (err) {
    console.error("[admin] Anmeldelink konnte nicht zugestellt werden:", err);
    return { error: "Der Link konnte gerade nicht verschickt werden." };
  }
}
