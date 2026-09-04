"use client";
import { createContext, useContext } from "react";

/* Who is signed in, available to any client component inside the shell.

   The session is an httpOnly cookie — deliberately invisible to scripts — so
   the identity is resolved on the server (app/(admin)/admin/(backoffice)/
   layout.jsx) and handed down once. This context is only the delivery: it
   exists so a card deep in the tree can ask "may this person manage access?"
   without five components passing a prop they do not use.

   IT IS NOT A PERMISSION. Everything it can do is decide what to SHOW; every
   check that matters happens in the middleware and again in the action or
   route that does the work. Hiding a link the server would refuse anyway is
   courtesy, not security. */

const AdminUserContext = createContext(null);

export function AdminUserProvider({ user, children }) {
  return <AdminUserContext.Provider value={user ?? null}>{children}</AdminUserContext.Provider>;
}

/** `{ email, name, role, via }` — or null outside the shell / signed out. */
export function useAdminUser() {
  return useContext(AdminUserContext);
}
