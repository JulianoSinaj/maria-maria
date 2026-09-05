/* Benutzer — sessions, links, the allowlist and the log.

   Runs WITHOUT a server: everything under test here is pure logic plus a few
   files, and the parts that decide who gets in should be checkable without a
   deployment. Uses a scratch data directory so a run cannot touch the real
   credentials, allowlist or audit log.

     node lib/admin/__tests__/benutzer.test.mjs
*/
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

/* The stores resolve their files from process.cwd() at call time, so the
   working directory has to move BEFORE they are imported — hence dynamic
   imports, and absolute URLs because a relative specifier would then resolve
   against the scratch directory. Bare Node also wants the extension that the
   bundler adds for the app. */
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^[/](?=[A-Za-z]:)/, ""));
const load = (name) => import(pathToFileURL(path.join(HERE, "..", name)).href);

const scratch = mkdtempSync(path.join(tmpdir(), "mm-admin-test-"));
process.chdir(scratch);

const { createSession, verifySession } = await load("session.js");
const { addUser, findUser, listUsers, setRole, removeUser, envUsers, nameFromEmail } =
  await load("users.js");
const { issueLink, consumeLink, peekLink, revokeLinks } = await load("magic.js");
const { record, recent, changesBetween } = await load("audit.js");
const { canWrite, canManageUsers } = await load("roles.js");

let pass = 0;
let fail = 0;
const ok = (cond, msg) => {
  if (cond) {
    pass += 1;
    console.log("  ✓ " + msg);
  } else {
    fail += 1;
    console.log("  ✗ FAIL: " + msg);
  }
};

const SECRET = "test-signing-key-not-a-password";

console.log("ROLES:");
ok(canWrite("owner") && canWrite("editor") && !canWrite("viewer"), "only owner and editor write");
ok(
  canManageUsers("owner") && !canManageUsers("editor") && !canManageUsers("viewer"),
  "only the owner manages access",
);

console.log("\nSESSION TOKEN:");
const token = await createSession(SECRET, {
  email: "Maria@Haus.DE",
  name: "Maria Pia",
  role: "owner",
  via: "link",
});
const who = await verifySession(token, SECRET);
ok(who?.email === "maria@haus.de", "e-mail comes back lowercased");
ok(who?.name === "Maria Pia" && who?.role === "owner" && who?.via === "link", "identity survives");
ok((await verifySession(token, "another-key")) === null, "a different key does not verify");

/* The payload is readable — it is meant to be — so the signature is the only
   thing standing between a viewer and an owner session. */
const [exp, payload, sig] = token.split(".");
const forged = Buffer.from(
  JSON.stringify({ e: "maria@haus.de", n: "Maria Pia", r: "owner", v: "link" }),
)
  .toString("base64url")
  .replace(/=+$/, "");
const viewerToken = await createSession(SECRET, { email: "v@haus.de", name: "V", role: "viewer" });
const [vExp, , vSig] = viewerToken.split(".");
ok(
  (await verifySession(`${vExp}.${forged}.${vSig}`, SECRET)) === null,
  "swapping the payload for an owner one fails the signature",
);
ok(
  (await verifySession(`${Number(exp) + 86400}.${payload}.${sig}`, SECRET)) === null,
  "extending the expiry fails the signature",
);
ok(
  (await verifySession(await createSession(SECRET, { name: "X", role: "owner" }, -10), SECRET)) ===
    null,
  "an expired token is no session",
);
ok((await verifySession("1756900000.abc", SECRET)) === null, "a two-part legacy token is refused");
let threw = false;
try {
  await createSession(SECRET, { name: "No role" });
} catch {
  threw = true;
}
ok(threw, "a session cannot be minted without a role");

console.log("\nALLOWLIST:");
ok(nameFromEmail("jan.meier@x.de") === "Jan Meier", "a name is derived from the address");
ok((await listUsers()).length === 0, "the scratch deployment starts empty");

const added = await addUser({ email: " Jan@Agentur.DE ", name: "Jan", role: "editor" });
ok(added.ok && added.user.email === "jan@agentur.de", "an address is trimmed and lowercased");
ok((await findUser("JAN@agentur.de"))?.role === "editor", "lookup ignores case");
ok(!(await addUser({ email: "jan@agentur.de", role: "viewer" })).ok, "no duplicate addresses");
ok(!(await addUser({ email: "not-an-address", role: "editor" })).ok, "an invalid address is refused");

await addUser({ email: "maria@haus.de", name: "Maria", role: "owner" });
ok(!(await setRole("maria@haus.de", "viewer")).ok, "the last owner cannot be demoted");
ok(!(await removeUser("maria@haus.de")).ok, "the last owner cannot be removed");
await addUser({ email: "zweite@haus.de", name: "Zweite", role: "owner" });
ok((await setRole("maria@haus.de", "viewer")).ok, "with a second owner the first may be demoted");

process.env.ADMIN_ALLOWLIST = "panel@haus.de:owner, broken, viewer@haus.de";
ok(envUsers().length === 2, "a malformed allowlist entry is skipped, not fatal");
ok(envUsers()[1].role === "editor", "an entry without a role defaults to editor");
ok((await findUser("panel@haus.de"))?.source === "env", "panel entries join the list read-only");
ok(!(await removeUser("panel@haus.de")).ok, "a panel entry cannot be removed in the UI");
delete process.env.ADMIN_ALLOWLIST;

console.log("\nMAGIC LINKS:");
const link = await issueLink("jan@agentur.de");
ok(typeof link.token === "string" && link.token.includes("."), "a link token is issued");
ok((await peekLink(link.token)) === "jan@agentur.de", "peeking does not spend it");
ok((await peekLink(link.token)) === "jan@agentur.de", "peeking twice still does not spend it");
ok((await consumeLink(link.token)) === "jan@agentur.de", "spending it returns the address");
ok((await consumeLink(link.token)) === null, "a spent link cannot be spent again");

const second = await issueLink("zweite@haus.de");
const [id, secret] = second.token.split(".");
ok((await consumeLink(`${id}.${secret}x`)) === null, "a tampered secret is refused");
ok((await consumeLink(`x${id}.${secret}`)) === null, "an unknown id is refused");
ok((await consumeLink(second.token)) === "zweite@haus.de", "the untouched token still works");

ok((await issueLink("jan@agentur.de")).token, "a fresh link can be requested");
ok((await issueLink("jan@agentur.de")).throttled === true, "a second request within a minute waits");

const toRevoke = await issueLink("viewer@haus.de");
await revokeLinks("viewer@haus.de");
ok((await consumeLink(toRevoke.token)) === null, "revoking access kills outstanding links");

console.log("\nAUDIT DIFF:");
const diff = changesBetween(
  { copy: { lede: "alt", title: "gleich" }, veil: { opacity: 0.9 } },
  { copy: { lede: "neu", title: "gleich" }, veil: { opacity: 0.5 } },
);
ok(Object.keys(diff).length === 2, "only changed leaves appear");
ok(diff["copy.lede"].from === "alt" && diff["copy.lede"].to === "neu", "before and after are kept");
ok(diff["veil.opacity"].to === 0.5, "numbers survive as numbers");
ok(changesBetween({ a: [1, 2] }, { a: [1, 2] })["a"] === undefined, "equal arrays are unchanged");
const long = changesBetween({ t: "x" }, { t: "y".repeat(400) });
ok(long.t.to.length <= 161 && long.t.to.endsWith("…"), "a long value is truncated and marked");

console.log("\nAUDIT LOG:");
const actor = { email: "maria@haus.de", name: "Maria", role: "owner", via: "link" };
await record({ actor, action: "hero.update", target: "Hero", before: { a: 1 }, after: { a: 2 } });
await record({ actor, action: "user.invite", target: "jan@agentur.de" });

const entries = await recent({ limit: 10 });
ok(entries.length === 2, "both entries are stored");
ok(entries[0].action === "user.invite", "newest first");
ok(entries[1].changes["a"].from === 1, "the diff is stored with the entry");
ok(entries[0].actor.name === "Maria", "the actor is named");
ok(entries[0].changes === null, "an entry without a diff stores none");
ok((await recent({ limit: 10, action: "hero.update" })).length === 1, "entries filter by action");

/* A log that can break a save is worse than no log. */
let recordThrew = false;
try {
  await record({ actor, action: "x", after: { circular: null } });
} catch {
  recordThrew = true;
}
ok(!recordThrew, "recording never throws into the caller");

process.chdir(tmpdir());
rmSync(scratch, { recursive: true, force: true });

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
