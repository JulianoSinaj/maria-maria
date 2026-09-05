import BenutzerView from "@/components/admin/benutzer/BenutzerView";
import { listUsers } from "@/lib/admin/users";
import { mailConfigured } from "@/lib/admin/mail";
import { recent } from "@/lib/admin/audit";
import { currentActor } from "@/lib/admin/actor";

/* Zugänge — who may sign in, and what everybody did.

   Owner-only, and enforced twice: the middleware turns anyone else away
   before this file is loaded (OWNER_ONLY in middleware.js), and every action
   the page can trigger re-checks the role for itself. What happens here is
   only what the page SHOWS.

   The audit log sits on the same page rather than getting one of its own, and
   that is a judgement about how it gets used: nobody opens a log to browse
   it. It is opened when a question about a person has already been asked —
   "who changed that, and when did she last sign in" — and the two halves of
   that answer should not be two clicks apart.

   The file is read on every request: there is nothing here worth caching, and
   a stale answer is exactly the kind that gets somebody's access wrong. */

export const metadata = {
  title: "Zugänge — Maria Maria",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/* Enough to answer "what happened this week" without turning the page into a
   scroll. The card on the overview shows eight; this is the tail. */
const AUDIT_LIMIT = 60;

export default async function BenutzerPage() {
  /* Three file reads, in parallel — they do not depend on each other. */
  const [users, entries, me] = await Promise.all([
    listUsers(),
    recent({ limit: AUDIT_LIMIT }),
    currentActor(),
  ]);

  return (
    <BenutzerView
      users={users}
      entries={entries}
      currentEmail={me?.email ?? null}
      mailReady={mailConfigured()}
    />
  );
}
