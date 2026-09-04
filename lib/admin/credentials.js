import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/* The password the CLIENT owns.

   Until now the only credential was ADMIN_PASSWORD in the hosting panel —
   which means whoever set it knows it, forever. Maria Maria should be able to
   change her own password without telling anybody, so the password she picks
   cannot live in the environment. It lives here, as a salted scrypt hash in
   data/admin/credentials.json, and nothing in the system can read it back.

   The decisive rule is in verify() below: ONCE A STORED PASSWORD EXISTS, THE
   ENVIRONMENT PASSWORD NO LONGER SIGNS ANYONE IN. Accepting both would make
   the change cosmetic — the old, known credential would keep working beside
   the new, private one.

   ADMIN_PASSWORD therefore has exactly one job left: the first sign-in, once,
   at handover. After the client has set her own password it can be deleted
   from the panel entirely (ADMIN_SESSION_SECRET keeps the backoffice
   configured), and then nobody outside the house holds a working credential.

   What this cannot promise, and nobody should claim it does: anyone with
   access to the hosting panel can still delete this file and put a fresh
   ADMIN_PASSWORD in place — that is also the intended recovery path when the
   password is forgotten. The guarantee is about knowledge, not about power:
   the chosen password itself is never seen, stored or recoverable by anyone.

   Node runtime only (fs + node:crypto). The Edge middleware must not import
   this file — it verifies the session cookie and nothing else. */

const scryptAsync = promisify(scrypt);

/* Runtime state, not source. `data/` also holds the admin's uploads and is
   git-ignored; on the server it MUST be a persistent volume, or this file —
   and with it the client's password — is gone at the next deploy and the
   environment password silently takes over again. */
const FILE = path.join(process.cwd(), "data", "admin", "credentials.json");

export const MIN_PASSWORD_LENGTH = 12;

/* scrypt with the Node defaults (N=16384, r=8, p=1) — deliberately slow, so a
   stolen file cannot be run through a word list at speed. A single sign-in
   costs about 100 ms here, which nobody notices once per day. */
const KEY_LENGTH = 64;

async function derive(password, salt) {
  /* NFKC: "Grüß" typed on a Mac and on Windows are different byte sequences
     for the same word. Normalising both sides means a password with an umlaut
     does not depend on which keyboard set it. */
  return scryptAsync(password.normalize("NFKC"), salt, KEY_LENGTH);
}

function equal(a, b) {
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function readStoredCredential() {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8"));
    if (typeof parsed?.hash !== "string" || typeof parsed?.salt !== "string") return null;
    return parsed;
  } catch {
    /* Not there, unreadable, or not JSON — all the same answer: no stored
       password, fall back to the bootstrap credential. */
    return null;
  }
}

export async function storeCredential(user, password) {
  const salt = randomBytes(16);
  const record = {
    version: 1,
    algorithm: "scrypt",
    user,
    salt: salt.toString("base64"),
    hash: (await derive(password, salt)).toString("base64"),
    updatedAt: new Date().toISOString(),
  };

  await fs.mkdir(path.dirname(FILE), { recursive: true });
  /* 0600: readable by the process that owns it and by nobody else on the box. */
  await fs.writeFile(FILE, `${JSON.stringify(record, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  return record;
}

/* Who may sign in, and on whose authority.

   Returns "stored" | "bootstrap" | false — the caller uses the distinction to
   decide whether to nudge the client towards setting a password of her own. */
export async function verify(user, password) {
  if (!password) return false;

  const stored = await readStoredCredential();

  if (stored) {
    const expectedUser = stored.user || process.env.ADMIN_USER || "maria";
    const supplied = await derive(password, Buffer.from(stored.salt, "base64"));
    const matches =
      equal(supplied, Buffer.from(stored.hash, "base64")) && (user || expectedUser) === expectedUser;
    return matches ? "stored" : false;
  }

  /* No password of her own yet — the handover credential still opens the door. */
  const bootstrap = process.env.ADMIN_PASSWORD;
  if (!bootstrap) return false;

  const expectedUser = process.env.ADMIN_USER || "maria";
  const a = Buffer.from(`${user || expectedUser}:${password}`.normalize("NFKC"));
  const b = Buffer.from(`${expectedUser}:${bootstrap}`.normalize("NFKC"));
  /* Buffers of different length cannot go into timingSafeEqual, and the length
     itself is not a secret worth protecting here — the hash comparison above
     is the path that matters. */
  return equal(a, b) ? "bootstrap" : false;
}

/* Is there any way at all to sign in right now? Used by the login page to
   tell "wrong password" apart from "this deployment has no credential". */
export async function credentialExists() {
  return Boolean(process.env.ADMIN_PASSWORD) || Boolean(await readStoredCredential());
}

/* Who is signing this edit.

   The session cookie carries an expiry and a signature and nothing else —
   a single-account backoffice has no user id to put in it. The name is
   therefore read from the stored credential, which is the only place a
   person ever named themselves, and falls back to the environment's user.

   It is a LABEL, not an authorisation: the middleware has already decided
   that whoever got this far may write. It exists so the Rechtstexte history
   can say who saved a version — and so it keeps saying the right thing once
   the client has taken the backoffice over and set her own name. */
export async function currentUser() {
  const stored = await readStoredCredential();
  return stored?.user || process.env.ADMIN_USER || "maria";
}

export function validatePassword(password, confirmation) {
  if (!password) return "Bitte ein neues Passwort eingeben.";
  if (password.normalize("NFKC").length < MIN_PASSWORD_LENGTH) {
    return `Das Passwort braucht mindestens ${MIN_PASSWORD_LENGTH} Zeichen.`;
  }
  if (password !== confirmation) return "Die beiden Eingaben stimmen nicht überein.";
  return null;
}
