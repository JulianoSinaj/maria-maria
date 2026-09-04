import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/* Leave preview: drops the draft-mode cookie so the storefront serves the
   cached, published pages again. `to` is restricted to the backoffice so
   the endpoint cannot be used as an open redirect. */
export const dynamic = "force-dynamic";

export async function GET(request) {
  const to = request.nextUrl.searchParams.get("to") ?? "/admin/magazin";
  const safe = to.startsWith("/admin") && !to.startsWith("//") ? to : "/admin/magazin";
  draftMode().disable();
  redirect(safe);
}
