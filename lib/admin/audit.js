import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

/* What happened, who did it, and what it looked like before.

   The backoffice had no memory. A hero photo swapped at eleven at night, a
   price corrected, a wine archived — afterwards nothing anywhere said who had
   done it or what the value used to be. With one shared password that was at
   least consistent (the answer was always "whoever had the password"); with
   several people signing in it is the difference between a mistake that can
   be undone in a minute and an afternoon of guessing.

   ONE LINE PER EVENT, appended to data/admin/audit.jsonl. Line-delimited JSON
   because an append is a single write with no read in front of it: two
   requests finishing at the same moment cannot lose each other's entry the
   way a read-modify-write of one big JSON array would. Reading back means
   reading the tail, which is what every consumer wants anyway.

   The file lives on the same persistent volume as the password and the user
   list. If that volume is missing the log is not a log — recording is
   therefore best-effort and NEVER throws into a request: a save that
   succeeded must not report failure because its receipt could not be filed.

   WHAT IS NOT IN HERE: passwords, session tokens, magic links, and the full
   body of anything. Entries carry a bounded diff — the fields that changed,
   old value and new value, truncated — because that is what answers "what did
   she change?" without turning the log into a second copy of the database. */

const FILE = path.join(process.cwd(), "data", "admin", "audit.jsonl");

/* Roughly a year of ordinary editing at this size. Trimmed on write when the
   file grows past the cap, so the volume cannot fill up unattended. */
const MAX_ENTRIES = 4000;
const TRIM_AT_BYTES = 2 * 1024 * 1024;

/* A changed value is shown, not stored in full: a hero lede is 240 characters
   and a page block can be far longer. The cut is marked with an ellipsis so
   nobody mistakes a truncation for the actual value. */
const VALUE_MAX = 160;
const MAX_CHANGES = 14;
const SUMMARY_MAX = 160;

/* -------------------------------------------------------------- diffing ---- */

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

function short(value) {
  if (value === undefined) return null;
  if (value === null || typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.length > VALUE_MAX ? `${value.slice(0, VALUE_MAX)}…` : value;
  }
  /* arrays and objects: describe them rather than inline them — a diff that
     carries a whole config is a copy, and copies rot */
  try {
    const json = JSON.stringify(value);
    return json.length > VALUE_MAX ? `${json.slice(0, VALUE_MAX)}…` : json;
  } catch {
    return "[unlesbar]";
  }
}

/**
 * Flat leaf-by-leaf difference between two states.
 * `{ "copy.lede": { from, to }, "image.src": { from, to } }` — the shape the
 * UI renders and the shape a human reads out loud. Arrays are compared whole
 * (an array's identity is its order, and a per-index diff of a reordered list
 * is noise, not information).
 */
export function changesBetween(before, after, prefix = "", acc = {}) {
  if (Object.keys(acc).length >= MAX_CHANGES) return acc;

  const keys = new Set([
    ...(isObject(before) ? Object.keys(before) : []),
    ...(isObject(after) ? Object.keys(after) : []),
  ]);

  for (const key of keys) {
    if (Object.keys(acc).length >= MAX_CHANGES) break;
    const a = isObject(before) ? before[key] : undefined;
    const b = isObject(after) ? after[key] : undefined;
    const at = prefix ? `${prefix}.${key}` : key;

    if (isObject(a) && isObject(b)) {
      changesBetween(a, b, at, acc);
      continue;
    }
    /* JSON comparison so 0.9 vs 0.9 and [1,2] vs [1,2] count as unchanged */
    if (JSON.stringify(a ?? null) === JSON.stringify(b ?? null)) continue;
    acc[at] = { from: short(a), to: short(b) };
  }

  return acc;
}

/* --------------------------------------------------------------- writes ---- */

/* The actor as the log stores it: what the signed cookie said, plus nothing.
   `via` separates the two doors — a change made from a magic-link session and
   one made with the house password are different facts. */
function actorOf(actor) {
  return {
    email: typeof actor?.email === "string" ? actor.email : null,
    name: typeof actor?.name === "string" && actor.name.trim() ? actor.name.trim() : "Unbekannt",
    role: typeof actor?.role === "string" ? actor.role : null,
    via: typeof actor?.via === "string" ? actor.via : null,
  };
}

/**
 * File one event. Returns the entry (handy in tests) or null when nothing
 * could be written — callers ignore the result on purpose.
 *
 * @param {object}  event
 * @param {object}  event.actor    identity from the session cookie
 * @param {string}  event.action   "hero.update", "user.invite", …
 * @param {string}  [event.target] what it was done to, in human words
 * @param {string}  [event.summary]
 * @param {object}  [event.before] state before — diffed against `after`
 * @param {object}  [event.after]  state after
 * @param {object}  [event.changes] a ready-made diff, instead of before/after
 */
export async function record(event) {
  try {
    const changes =
      event.changes ??
      (event.before !== undefined || event.after !== undefined
        ? changesBetween(event.before, event.after)
        : undefined);

    const entry = {
      id: randomUUID(),
      at: new Date().toISOString(),
      actor: actorOf(event.actor),
      action: String(event.action || "unknown").slice(0, 60),
      target: event.target ? String(event.target).slice(0, 120) : null,
      summary: event.summary ? String(event.summary).slice(0, SUMMARY_MAX) : null,
      changes: changes && Object.keys(changes).length ? changes : null,
    };

    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.appendFile(FILE, `${JSON.stringify(entry)}\n`, { encoding: "utf8", mode: 0o600 });
    await trimIfLarge();
    return entry;
  } catch {
    /* A log that can break a save is worse than no log. */
    return null;
  }
}

async function trimIfLarge() {
  try {
    const { size } = await fs.stat(FILE);
    if (size < TRIM_AT_BYTES) return;
    const lines = (await fs.readFile(FILE, "utf8")).split("\n").filter(Boolean);
    if (lines.length <= MAX_ENTRIES) return;
    await fs.writeFile(FILE, `${lines.slice(-MAX_ENTRIES).join("\n")}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
  } catch {
    /* trimming is housekeeping — never let it surface */
  }
}

/* ---------------------------------------------------------------- reads ---- */

/**
 * The most recent entries, newest first.
 * @param {{limit?: number, action?: string, actor?: string}} [query]
 */
export async function recent(query = {}) {
  const limit = Math.min(Math.max(Number(query.limit) || 25, 1), 200);

  let lines;
  try {
    lines = (await fs.readFile(FILE, "utf8")).split("\n");
  } catch {
    return [];
  }

  const out = [];
  /* walk backwards: the newest entries are at the end, and a log with four
     thousand lines should not be parsed in full to show eight of them */
  for (let i = lines.length - 1; i >= 0 && out.length < limit; i -= 1) {
    const line = lines[i].trim();
    if (!line) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue; // a half-written line from a killed process
    }
    if (query.action && entry.action !== query.action) continue;
    if (query.actor && entry.actor?.email !== query.actor) continue;
    out.push(entry);
  }
  return out;
}

/** How many events the log holds — the users page shows it next to the list. */
export async function count() {
  try {
    const text = await fs.readFile(FILE, "utf8");
    return text.split("\n").filter(Boolean).length;
  } catch {
    return 0;
  }
}
