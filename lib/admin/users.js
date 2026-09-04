import { promises as fs } from "node:fs";
import path from "node:path";
import { ROLES, isRole } from "./roles";

/* Who may sign in — the allowlist, and the only answer to that question.

   Until now the backoffice knew exactly one credential and therefore exactly
   one person: whoever held the password. That is fine for a house of one and
   wrong the moment an agency or Terra Vera needs access — there was no way to
   give someone their own way in, no way to take it away again without
   changing the password for everybody, and no way to tell afterwards who had
   changed what.

   This file is the list. An e-mail address that is not in it gets no link,
   and a link is the only thing that opens the door for anyone but the owner.

   TWO SOURCES, ON PURPOSE:

     1. data/admin/users.json — the list the owner edits in /admin/benutzer.
        Runtime state, on the persistent volume, next to the password.
     2. ADMIN_ALLOWLIST — "maria@example.com:owner, jan@agentur.de:editor".
        Read-only entries from the hosting panel. They exist so a deployment
        whose data volume was lost (or never set up) still has a way in that
        does not require touching the password, and so the very first owner
        can be seated before anyone has ever signed in.

   Entries from the panel cannot be edited or removed in the UI — the panel
   owns them, and a UI that pretends to delete something that reappears on the
   next request would be lying. They are marked `source: "env"` for exactly
   that reason.

   E-mail is the key. Not an opaque id: the address IS the identity here (it
   is what receives the link), it is what the audit log has to show a human,
   and a second identifier would only be a thing that can disagree with it.
   Everything is compared lowercased and trimmed.

   Node runtime only (node:fs). The Edge middleware must never import this —
   it reads role and name from the signed cookie, which is the whole reason
   the cookie carries them. */

const FILE = path.join(process.cwd(), "data", "admin", "users.json");

export const DEFAULT_ROLE = "editor";

/* Long enough for a real name, short enough that the header chip and the
   audit rows never have to deal with an essay. */
export const NAME_MAX = 60;
export const EMAIL_MAX = 200;

/* Deliberately the same expression the contact form validates against: an
   address this rejects is one no link would ever reach anyway. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase().slice(0, EMAIL_MAX) : "";

export const isEmail = (value) => EMAIL_RE.test(normalizeEmail(value));

/** A display name for an address that never had one: "jan.meier@x.de" → "Jan Meier". */
export function nameFromEmail(email) {
  const local = normalizeEmail(email).split("@")[0] ?? "";
  const words = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.join(" ").slice(0, NAME_MAX) || "Admin";
}

const cleanName = (value, fallbackEmail) => {
  const name = typeof value === "string" ? value.trim().slice(0, NAME_MAX) : "";
  return name || nameFromEmail(fallbackEmail);
};

/* ------------------------------------------------------------ the panel ---- */

/** Parse ADMIN_ALLOWLIST. Malformed entries are skipped, never fatal: a typo
    in the panel must not take the backoffice down, it must leave one person
    unable to sign in — which is visible, reversible and obvious. */
export function envUsers() {
  const raw = process.env.ADMIN_ALLOWLIST;
  if (!raw) return [];

  const out = [];
  for (const chunk of raw.split(/[,;\n]/)) {
    const entry = chunk.trim();
    if (!entry) continue;
    const [addressPart, rolePart] = entry.split(":");
    const email = normalizeEmail(addressPart);
    if (!isEmail(email) || out.some((u) => u.email === email)) continue;
    const role = isRole(rolePart?.trim()) ? rolePart.trim() : DEFAULT_ROLE;
    out.push({
      email,
      name: nameFromEmail(email),
      role,
      source: "env",
      createdAt: null,
      lastSignInAt: null,
      invitedBy: null,
    });
  }
  return out;
}

/* ------------------------------------------------------------- the file ---- */

async function readFile() {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8"));
    if (!Array.isArray(parsed?.users)) return [];
    return parsed.users
      .filter((u) => isEmail(u?.email) && isRole(u?.role))
      .map((u) => ({
        email: normalizeEmail(u.email),
        name: cleanName(u.name, u.email),
        role: u.role,
        source: "file",
        createdAt: typeof u.createdAt === "string" ? u.createdAt : null,
        lastSignInAt: typeof u.lastSignInAt === "string" ? u.lastSignInAt : null,
        invitedBy: typeof u.invitedBy === "string" ? u.invitedBy : null,
      }));
  } catch {
    /* absent, unreadable or not JSON — all the same answer: no stored list.
       The panel entries below still apply, so a lost volume is a degraded
       backoffice and not a locked one. */
    return [];
  }
}

async function writeFile(users) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const record = {
    version: 1,
    updatedAt: new Date().toISOString(),
    users: users.map(({ email, name, role, createdAt, lastSignInAt, invitedBy }) => ({
      email,
      name,
      role,
      createdAt,
      lastSignInAt,
      invitedBy,
    })),
  };
  /* 0600 like the credential file next to it: an address list is not a
     secret, but it says who to phish, and it costs nothing to keep it shut. */
  await fs.writeFile(FILE, `${JSON.stringify(record, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
}

/* --------------------------------------------------------------- reads ---- */

/** Everyone who may sign in: the edited list first, panel entries after —
    an address in both is the file's, so the owner can rename or promote
    someone the panel seated without editing the panel. */
export async function listUsers() {
  const stored = await readFile();
  const seen = new Set(stored.map((u) => u.email));
  const merged = [...stored, ...envUsers().filter((u) => !seen.has(u.email))];

  /* owners first, then editors, then viewers; alphabetical inside a role, so
     the list reads the same on every reload */
  return merged.sort(
    (a, b) => ROLES.indexOf(a.role) - ROLES.indexOf(b.role) || a.email.localeCompare(b.email),
  );
}

export async function findUser(email) {
  const wanted = normalizeEmail(email);
  if (!wanted) return null;
  return (await listUsers()).find((u) => u.email === wanted) ?? null;
}

/** Is there anybody at all who could receive a link? The login page asks, so
    it can say "no address is set up" instead of silently accepting an
    address that will never get mail. */
export async function hasUsers() {
  return (await listUsers()).length > 0;
}

export async function ownerCount() {
  return (await listUsers()).filter((u) => u.role === "owner").length;
}

/* -------------------------------------------------------------- writes ---- */

/* Every write returns `{ ok: true, user }` or `{ ok: false, error }` with a
   German message: these are called from server actions that render the text
   straight into the form. */

export async function addUser({ email, name, role, invitedBy = null }) {
  const address = normalizeEmail(email);
  if (!isEmail(address)) return { ok: false, error: "Diese E-Mail-Adresse ist ungültig." };
  if (!isRole(role)) return { ok: false, error: "Unbekannte Rolle." };

  if (await findUser(address)) {
    return { ok: false, error: "Diese Adresse hat bereits Zugang." };
  }

  const user = {
    email: address,
    name: cleanName(name, address),
    role,
    source: "file",
    createdAt: new Date().toISOString(),
    lastSignInAt: null,
    invitedBy: normalizeEmail(invitedBy) || null,
  };

  await writeFile([...(await readFile()), user]);
  return { ok: true, user };
}

/** Change a role. Refuses to remove the last owner — a backoffice nobody can
    administer any more is not a state the UI may produce. */
export async function setRole(email, role) {
  const address = normalizeEmail(email);
  if (!isRole(role)) return { ok: false, error: "Unbekannte Rolle." };

  const existing = await findUser(address);
  if (!existing) return { ok: false, error: "Diese Person steht nicht auf der Liste." };
  if (existing.source === "env") {
    return {
      ok: false,
      error: "Dieser Zugang kommt aus der Server-Konfiguration und wird dort geändert.",
    };
  }
  if (existing.role === role) return { ok: true, user: existing };
  if (existing.role === "owner" && (await ownerCount()) < 2) {
    return { ok: false, error: "Es muss mindestens ein Zugang mit der Rolle Leitung bleiben." };
  }

  const users = await readFile();
  const next = users.map((u) => (u.email === address ? { ...u, role } : u));
  await writeFile(next);
  return { ok: true, user: { ...existing, role } };
}

export async function removeUser(email) {
  const address = normalizeEmail(email);
  const existing = await findUser(address);
  if (!existing) return { ok: false, error: "Diese Person steht nicht auf der Liste." };
  if (existing.source === "env") {
    return {
      ok: false,
      error: "Dieser Zugang kommt aus der Server-Konfiguration und wird dort entfernt.",
    };
  }
  if (existing.role === "owner" && (await ownerCount()) < 2) {
    return { ok: false, error: "Es muss mindestens ein Zugang mit der Rolle Leitung bleiben." };
  }

  await writeFile((await readFile()).filter((u) => u.email !== address));
  return { ok: true, user: existing };
}

/** Stamp the moment someone actually got in. Best effort: a failed write here
    must never keep a valid sign-in from completing. */
export async function touchSignIn(email) {
  const address = normalizeEmail(email);
  try {
    const users = await readFile();
    if (!users.some((u) => u.email === address)) return;
    await writeFile(
      users.map((u) => (u.email === address ? { ...u, lastSignInAt: new Date().toISOString() } : u)),
    );
  } catch {
    /* the list is a convenience here, not a permission — carry on */
  }
}
