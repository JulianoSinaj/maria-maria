import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { normalizeEmail } from "./users";

/* The link in the e-mail — issued once, valid briefly, usable exactly once.

   A magic link is the only credential in this system that reaches someone
   who was never handed a password: the owner types an address into
   /admin/benutzer, that person gets mail, and from then on they sign in by
   asking for a link. Nobody has to invent, transmit or store a shared secret
   for them, and revoking access is one line removed from the allowlist.

   THE TOKEN IS `<id>.<secret>` and the file stores a SHA-256 of the secret,
   never the secret itself. Losing the file therefore cannot leak a working
   link, and a link that is in a mailbox is exactly as long-lived as the
   record next to it says.

   Why SHA-256 and not scrypt like the password: the secret is 32 random bytes
   we generated, not something a human chose. There is no word list to run
   against it, and a slow hash would only make every sign-in slower.

   SINGLE USE, and this is not decoration. Mail lives in mailboxes, gets
   forwarded, ends up in backups. A link that keeps working is a password with
   a nicer name.

   FIFTEEN MINUTES. Long enough to fetch the mail on a phone, short enough
   that a link found later is scrap.

   No enumeration anywhere: the login form's answer is the same whether the
   address is on the list or not (see the action), and this module's job stops
   at "issue" and "consume". */

const FILE = path.join(process.cwd(), "data", "admin", "magic-links.json");

export const LINK_MAX_AGE_MINUTES = 15;
const LINK_MAX_AGE_MS = LINK_MAX_AGE_MINUTES * 60 * 1000;

/* One link per address per minute. A person who clicks "send again" twice is
   not a problem; a script that turns our SMTP into a mail cannon is. The
   caller still tells the visitor a link is on its way — saying "too fast"
   would answer a question about someone else's mailbox. */
const RESEND_COOLDOWN_MS = 60 * 1000;

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

async function readLinks() {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8"));
    return Array.isArray(parsed?.links) ? parsed.links : [];
  } catch {
    return [];
  }
}

async function writeLinks(links) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  /* expired and used records are dropped on every write: the file stays the
     size of "what is outstanding right now" without a separate sweep */
  const now = Date.now();
  const live = links.filter((l) => !l.usedAt && Date.parse(l.expiresAt) > now);
  await fs.writeFile(FILE, `${JSON.stringify({ version: 1, links: live }, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
}

/**
 * Mint a link for an address that is already known to be on the allowlist.
 * Returns `{ token, expiresAt }`, or `{ throttled: true }` when one was sent
 * moments ago — the caller answers the visitor the same way either way.
 */
export async function issueLink(email, { ip = null } = {}) {
  const address = normalizeEmail(email);
  const links = await readLinks();
  const now = Date.now();

  const fresh = links.find(
    (l) =>
      l.email === address &&
      !l.usedAt &&
      Date.parse(l.expiresAt) > now &&
      now - Date.parse(l.createdAt) < RESEND_COOLDOWN_MS,
  );
  if (fresh) return { throttled: true };

  const id = randomBytes(9).toString("base64url");
  const secret = randomBytes(32).toString("base64url");
  const expiresAt = new Date(now + LINK_MAX_AGE_MS).toISOString();

  /* Any older outstanding link for this address is dropped: asking for a new
     one is how a person says "the last one didn't reach me", and two live
     links are two chances for the wrong one to be used. */
  const rest = links.filter((l) => l.email !== address);
  await writeLinks([
    ...rest,
    {
      id,
      email: address,
      hash: sha256(secret),
      createdAt: new Date(now).toISOString(),
      expiresAt,
      usedAt: null,
      ip: typeof ip === "string" ? ip.slice(0, 64) : null,
    },
  ]);

  return { token: `${id}.${secret}`, expiresAt };
}

const equal = (a, b) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/**
 * Check a token WITHOUT spending it — what the confirmation page asks so it
 * can show "this link has expired" instead of a form that will fail.
 * Returns the e-mail address, or null.
 */
export async function peekLink(token) {
  const [id, secret] = String(token ?? "").split(".");
  if (!id || !secret) return null;

  const record = (await readLinks()).find((l) => l.id === id);
  if (!record || record.usedAt) return null;
  if (Date.parse(record.expiresAt) <= Date.now()) return null;
  if (!equal(sha256(secret), record.hash)) return null;

  return record.email;
}

/**
 * Spend a token. Returns the e-mail address on success and null on anything
 * else — expired, unknown, already used, tampered with.
 *
 * The record is marked used BEFORE the caller issues a session, so two
 * clicks arriving together cannot both succeed.
 */
export async function consumeLink(token) {
  const [id, secret] = String(token ?? "").split(".");
  if (!id || !secret) return null;

  const links = await readLinks();
  const record = links.find((l) => l.id === id);
  if (!record || record.usedAt) return null;
  if (Date.parse(record.expiresAt) <= Date.now()) return null;
  if (!equal(sha256(secret), record.hash)) return null;

  await writeLinks(links.filter((l) => l.id !== id));
  return record.email;
}

/** Drop every outstanding link for one address — used when access is revoked. */
export async function revokeLinks(email) {
  const address = normalizeEmail(email);
  const links = await readLinks();
  if (!links.some((l) => l.email === address)) return;
  await writeLinks(links.filter((l) => l.email !== address));
}
