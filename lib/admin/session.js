import { isRole, SIGN_IN_METHODS } from "./roles";

/* The backoffice session — one signed cookie, verifiable at the edge.

   Until September 2026 /admin was gated by HTTP Basic auth in middleware.js:
   the browser put up its own grey dialog, there was no way to style it, no
   way to say "wrong password" in our own words, and no way to sign out short
   of closing the browser. This module replaced the credential *transport*
   first, and now carries the one thing Basic auth never could: WHO is signed
   in. The Benutzer feature (magic links, roles, audit log) needs a name and a
   role on every request, and the cookie is the only thing every request has.

   The token is `<expiry>.<payload>.<signature>`:

     1756900000.eyJlIjoibWFyaWFAbWFyaWEtbWFyaWEuZGUiLCJuIjoiTWFyaWEiLCJyIjoib3duZXIiLCJ2IjoibGluayJ9.k3Jd8f2s…

   The payload is base64url JSON — e-mail, display name, role, and how the
   person signed in (link / password / dev). It is NOT encrypted: nothing in
   it is secret, the cookie is httpOnly anyway, and a reader who can see it
   is the person it describes. It IS signed: the HMAC covers expiry and
   payload together, so a client can neither extend its session nor promote
   itself to owner without the key. Change one byte and the signature fails.

   No database, no session table: the cookie IS the session. That is what
   makes it verifiable inside the Edge middleware, which has no filesystem and
   no connection pool, and it is why signing out works by deleting a cookie.

   The flip side is stated plainly: a stolen token stays valid until it
   expires, and REMOVING A PERSON FROM THE ALLOWLIST DOES NOT END A SESSION
   THEY ALREADY HOLD — the middleware cannot look the list up. Hence the short
   lifetime, httpOnly + secure, and the rule of thumb for the owner: remove
   the person, and if it matters, rotate ADMIN_SESSION_SECRET, which ends
   every session at once.

   Web Crypto only, no Node built-ins: this file is imported by middleware.js,
   which runs on the Edge runtime, AND by the server code that signs people
   in. One implementation for both, or the two sides drift apart. */

export const SESSION_COOKIE = "mm_admin";

/* Twelve hours: a working day. Long enough that nobody signs in twice while
   editing the portfolio, short enough that a laptop left open in a café is
   not a standing invitation over the weekend. */
export const SESSION_MAX_AGE = 60 * 60 * 12;

/* The signing key — and NOT the password.

   ADMIN_SESSION_SECRET is the right variable to set — a long random string
   that is never typed by anyone and never changes. ADMIN_PASSWORD is only
   the fallback, so that a deployment configured the old way keeps working;
   the moment it is deleted from the panel (which is the point of the
   handover), the secret has to be there or the backoffice reports itself
   unconfigured. */
export const sessionSecret = () =>
  process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

const bytes = (text) => new TextEncoder().encode(text);

/* base64url: the value travels in a cookie, where "+", "/" and "=" are
   either reserved or get quoted by some proxies. */
const toBase64Url = (binary) =>
  btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const fromBase64Url = (text) => {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
  return atob(b64 + pad);
};

/* UTF-8 in, base64url out — a name with an umlaut must survive the trip. */
export function encodePayload(value) {
  let binary = "";
  for (const byte of bytes(JSON.stringify(value))) binary += String.fromCharCode(byte);
  return toBase64Url(binary);
}

export function decodePayload(text) {
  try {
    const binary = fromBase64Url(text);
    const raw = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(raw));
  } catch {
    return null;
  }
}

async function sign(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    bytes(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, bytes(message));
  let binary = "";
  for (const byte of new Uint8Array(signature)) binary += String.fromCharCode(byte);
  return toBase64Url(binary);
}

/* Comparison over the SHA-256 sums instead of character by character: a plain
   string comparison stops at the first difference and gives away, through the
   response time, how many characters matched — and through the length check
   in front of it, the length of the secret as well. Two sums are always 32
   bytes long and are always walked through completely. */
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

/* What a session says about its holder. Every field is checked on the way
   in AND on the way out — a token is user input the moment it leaves the
   server, however well it was signed. */
export function normalizeIdentity(input = {}) {
  const email =
    typeof input.email === "string" && input.email.trim()
      ? input.email.trim().toLowerCase()
      : null;
  const name =
    typeof input.name === "string" && input.name.trim() ? input.name.trim() : email || "Admin";
  const role = isRole(input.role) ? input.role : null;
  const via = SIGN_IN_METHODS.includes(input.via) ? input.via : "link";
  return { email, name, role, via };
}

/**
 * Mint a session for one person.
 * @param {string} secret   the signing key (sessionSecret())
 * @param {{email?: string|null, name: string, role: string, via?: string}} identity
 */
export async function createSession(secret, identity, maxAge = SESSION_MAX_AGE) {
  const who = normalizeIdentity(identity);
  if (!who.role) throw new Error("createSession: identity needs a role");
  const expires = Math.floor(Date.now() / 1000) + maxAge;
  const payload = encodePayload({ e: who.email, n: who.name, r: who.role, v: who.via });
  const message = `${expires}.${payload}`;
  return `${message}.${await sign(secret, message)}`;
}

/**
 * Verify a token. Resolves to the identity it carries — `{ email, name,
 * role, via, expires }` — or null for anything that is not a valid, unexpired,
 * correctly signed token. Tokens from before identities existed (two parts)
 * are simply invalid: their holders sign in again, once.
 */
export async function verifySession(token, secret) {
  if (!token || !secret) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [expires, payload, signature] = parts;

  /* Digits only — Number() would happily accept "1e999" or " 12" and the
     expiry check below is the only thing standing between a visitor and an
     unlimited session. */
  if (!/^\d{1,15}$/.test(expires)) return null;
  if (Number(expires) * 1000 <= Date.now()) return null;

  if (!(await secretsMatch(signature, await sign(secret, `${expires}.${payload}`)))) return null;

  const data = decodePayload(payload);
  if (!data || typeof data !== "object") return null;
  const who = normalizeIdentity({ email: data.e, name: data.n, role: data.r, via: data.v });
  /* a signed token with an unknown role is still no session — a role is
     what every permission check downstream keys on */
  if (!who.role) return null;

  return { ...who, expires: Number(expires) };
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
