import AdminShell from "@/components/admin/AdminShell";

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

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
