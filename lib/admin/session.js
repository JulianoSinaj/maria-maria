/* The backoffice session — one signed cookie, verifiable at the edge.

   Until now /admin was gated by HTTP Basic auth in middleware.js: the browser
   put up its own grey dialog, there was no way to style it, no way to say
   "wrong password" in our own words, and no way to sign out short of closing
   the browser. This module replaces the credential *transport* — the
   credentials themselves are unchanged (ADMIN_USER / ADMIN_PASSWORD), and
   Basic auth stays available for scripts (see guardBackoffice in
   middleware.js).

   The token is `<expiry>.<signature>`:

     1756900000.k3Jd8f2s…

   The signature is an HMAC over the expiry string, so a client can neither
   extend its own session nor forge one without the secret. There is nothing
   else in the token — a single-account backoffice has no user id to carry,
   and anything we put in there would only be a second copy of a fact the
   server already knows.

   No database, no session table: the cookie IS the session. That is what
   makes it verifiable inside the Edge middleware, which has no filesystem and
   no connection pool, and it is why signing out works by deleting a cookie.

   The flip side is stated plainly: a stolen token stays valid until it
   expires. Hence the short lifetime, httpOnly + secure, and the fact that
   changing ADMIN_PASSWORD invalidates every session at once (the password IS
   the default signing key — see sessionSecret).

   Web Crypto only, no Node built-ins: this file is imported by middleware.js,
   which runs on the Edge runtime, AND by the server action that signs people
   in. One implementation for both, or the two sides drift apart. */

export const SESSION_COOKIE = "mm_admin";

/* Twelve hours: a working day. Long enough that nobody signs in twice while
   editing the portfolio, short enough that a laptop left open in a café is
   not a standing invitation over the weekend. */
export const SESSION_MAX_AGE = 60 * 60 * 12;

/* The signing key — and NOT the password.

   The two were the same thing until the client got a password of her own
   (lib/admin/credentials.js). They cannot be any more: her password lives in
   a file, and this key has to be readable inside the Edge middleware, which
   has no filesystem. So the key stays in the environment and the password
   leaves it.

   ADMIN_SESSION_SECRET is the right variable to set — a long random string
   that is never typed by anyone and never changes. ADMIN_PASSWORD is only
   the fallback, so that a deployment configured the old way keeps working;
   the moment it is deleted from the panel (which is the point of the
   handover), the secret has to be there or the backoffice reports itself
   unconfigured.

   One consequence, stated rather than hidden: a password change cannot
   invalidate sessions on other devices, because the key they were signed with
   did not change. They expire on their own within SESSION_MAX_AGE. */
export const sessionSecret = () =>
  process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

const bytes = (text) => new TextEncoder().encode(text);

async function sign(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    bytes(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, bytes(message));
  /* base64url: the value travels in a cookie, where "+", "/" and "=" are
     either reserved or get quoted by some proxies. */
  let binary = "";
  for (const byte of new Uint8Array(signature)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/* Comparison over the SHA-256 sums instead of character by character: a plain
   string comparison stops at the first difference and gives away, through the
   response time, how many characters matched — and through the length check
   in front of it, the length of the secret as well. Two sums are always 32
   bytes long and are always walked through completely.

   (Moved here from middleware.js, which now imports it — the login form needs
   the identical check, and two copies of a security primitive are one copy
   too many.) */
async function digest(text) {
  const buffer = await crypto.subtle.digest("SHA-256", bytes(text));
  return new Uint8Array(buffer);
}

async function secretsMatch(supplied, expected) {
  const [a, b] = await Promise.all([digest(supplied), digest(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function createSession(secret, maxAge = SESSION_MAX_AGE) {
  const expires = Math.floor(Date.now() / 1000) + maxAge;
  return `${expires}.${await sign(secret, String(expires))}`;
}

export async function verifySession(token, secret) {
  if (!token || !secret) return false;

  const separator = token.indexOf(".");
  if (separator < 1) return false;

  const expires = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  /* Digits only — Number() would happily accept "1e999" or " 12" and the
     expiry check below is the only thing standing between a visitor and an
     unlimited session. */
  if (!/^\d{1,15}$/.test(expires)) return false;
  if (Number(expires) * 1000 <= Date.now()) return false;

  return secretsMatch(signature, await sign(secret, expires));
}

/* Cookie attributes, in one place because they are load-bearing:

   httpOnly  — no script can read the token, so an injected snippet on any
               admin page cannot carry the session off.
   sameSite  — "lax" keeps the cookie on normal navigations (a bookmark into
               /admin/portfolio still works) but not on cross-site POSTs.
   secure    — only over HTTPS. Off in development, where localhost is http
               and a secure cookie would simply never be stored: sign-in would
               appear to succeed and then loop back to the form. */
export const sessionCookie = (value, maxAge = SESSION_MAX_AGE) => ({
  name: SESSION_COOKIE,
  value,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge,
});
