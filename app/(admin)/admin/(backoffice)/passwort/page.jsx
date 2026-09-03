import { readStoredCredential } from "@/lib/admin/credentials";
import PasswordForm from "./PasswordForm";

/* Where the client takes her password out of our hands.

   Inside the (backoffice) group, so it wears the normal admin frame — this is
   an everyday page, not a security ritual, and framing it as one would make
   people avoid it.

   The page reads only the metadata of the stored credential (who, when), never
   the password: there is nothing stored that could be read back. */

export const metadata = {
  title: "Passwort — Maria Maria",
  robots: { index: false, follow: false },
};

/* The stored credential is a file on disk; a cached render would show a stale
   "last changed" for as long as the cache lives. */
export const dynamic = "force-dynamic";

export default async function PasswordPage({ searchParams }) {
  const stored = await readStoredCredential();

  return (
    <PasswordForm
      /* Set by signIn() right after a sign-in with the handover password —
         the one moment where the client should not be left to find this page
         on her own. */
      handover={searchParams?.uebernahme === "1" && !stored}
      user={stored?.user || process.env.ADMIN_USER || "maria"}
      changedAt={stored?.updatedAt ?? null}
    />
  );
}
