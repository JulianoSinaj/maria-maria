import { cookies } from "next/headers";
import { SESSION_COOKIE, sessionSecret, verifySession } from "./session";

/* Who is asking — the answer, without any opinion about what to do with it.

   Split from guard.js so that server components can import it: guard.js pulls
   in NextResponse to build its 401/403 answers, and a layout that only wants
   to greet someone by name has no business dragging a response builder into
   its module graph.

   DEVELOPMENT: with no ADMIN_SESSION_SECRET set, the middleware leaves /admin
   open — it is only reachable over localhost there — and so does this. The
   actor then reads "Entwicklung": the audit log says plainly that nobody was
   signed in, rather than inventing a person. */

export const DEV_ACTOR = Object.freeze({
  email: null,
  name: "Entwicklung",
  role: "owner",
  via: "dev",
});

/** True when this deployment has no signing key and is not production. */
export const unconfigured = () => !sessionSecret() && process.env.NODE_ENV !== "production";

/** The identity behind a route-handler request, or null. */
export async function actorFromRequest(request) {
  if (unconfigured()) return DEV_ACTOR;
  const token = request?.cookies?.get(SESSION_COOKIE)?.value;
  return verifySession(token, sessionSecret());
}

/** The identity in a server component or server action, or null. */
export async function currentActor() {
  if (unconfigured()) return DEV_ACTOR;
  return verifySession(cookies().get(SESSION_COOKIE)?.value, sessionSecret());
}
