/* The three roles of the backoffice — and nothing else.

   A plain module on purpose: it is read by the Edge middleware (which cannot
   load node:fs), by server actions, by API routes and by client components.
   One list, one set of rules, and every layer asks the same two questions.

     owner   – everything, including who else may sign in and the password
               of the house. Maria Maria herself.
     editor  – every save the backoffice offers: portfolio, hero, map,
               showcase, uploads. Agency or Terra Vera staff doing the work.
     viewer  – reads only. Someone who needs to see the state of things —
               a bookkeeper, a new colleague — without being able to change
               anything by accident.

   The middleware enforces these at the chokepoint (a viewer's PUT dies before
   any route runs; a non-owner never reaches /admin/benutzer). The UI reads
   the same helpers to hide what a role cannot use, but hiding is a courtesy,
   not a check. */

export const ROLES = Object.freeze(["owner", "editor", "viewer"]);

export const isRole = (value) => ROLES.includes(value);

/** May this role change content? Owners and editors. */
export const canWrite = (role) => role === "owner" || role === "editor";

/** May this role decide who signs in, and change the house password? */
export const canManageUsers = (role) => role === "owner";

/* How a session came to be — carried in the cookie so the header can say
   "angemeldet per Link" and the audit log can tell the two doors apart. */
export const SIGN_IN_METHODS = Object.freeze(["link", "password", "dev"]);
