import AdminShell from "@/components/admin/AdminShell";
import { currentActor } from "@/lib/admin/actor";

/* Everything behind the door.

   The (backoffice) group exists for one reason: /admin/login must NOT
   get this layout. A route group changes no URL — /admin, /admin/media
   and the rest are exactly where they were — it only draws a line
   around the routes that share the shell. The login page sits beside
   the group and therefore renders on the bare root layout. */

export const metadata = {
  title: "Maria Maria — Administration",
  robots: { index: false, follow: false },
};

/* The header greets a person by name, so the frame has to know who signed
   in. It is read HERE and not in the shell: the session lives in an httpOnly
   cookie, which is exactly the kind of thing a client component cannot see —
   and should not. */
export default async function AdminLayout({ children }) {
  const user = await currentActor();
  return <AdminShell user={user}>{children}</AdminShell>;
}
